"""
Audit GenX — SaaS Web Application
By Team Frame Flux
"""
from flask import Flask, render_template, request, jsonify, send_from_directory, Response
from audit_decision_system import (
    process_claim, CLAIMS, RULES,
    stage_01_input_validation, stage_02_document_verification,
    stage_03_claim_analysis, stage_04_damage_assessment,
    stage_05_coverage_validation, stage_06_policy_limit_check,
    stage_07_history_check, stage_08_fraud_detection,
    stage_09_consistency_check, stage_10_risk_scoring,
    stage_11_decision, stage_12_payout_estimation,
    stage_13_recommendations, stage_14_audit_verification,
)
from werkzeug.utils import secure_filename
from datetime import datetime, timezone
import json, os, re, uuid, time

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

@app.after_request
def add_cors(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
    return response

@app.before_request
def handle_preflight():
    from flask import make_response
    if request.method == 'OPTIONS':
        r = make_response()
        r.headers['Access-Control-Allow-Origin'] = '*'
        r.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
        r.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
        return r
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, "output")
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
RESULTS_PATH = os.path.join(OUTPUT_DIR, "results.json")
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

ALLOWED_EXT = {"pdf", "docx", "doc", "png", "jpg", "jpeg", "txt", "csv"}

def _load_results():
    if os.path.exists(RESULTS_PATH):
        with open(RESULTS_PATH) as f:
            return json.load(f)
    return []

def _save_results(results):
    with open(RESULTS_PATH, "w") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

def _extract_text(filepath):
    """Extract text from uploaded document."""
    ext = filepath.rsplit(".", 1)[-1].lower()
    try:
        if ext == "pdf":
            from pypdf import PdfReader
            reader = PdfReader(filepath)
            return "\n".join(p.extract_text() or "" for p in reader.pages)
        elif ext in ("docx", "doc"):
            import docx
            doc = docx.Document(filepath)
            return "\n".join(p.text for p in doc.paragraphs)
        elif ext in ("png", "jpg", "jpeg"):
            try:
                import pytesseract
                from PIL import Image
                return pytesseract.image_to_string(Image.open(filepath))
            except Exception:
                return "[Image uploaded — OCR unavailable. Install tesseract for text extraction.]"
        elif ext == "txt":
            with open(filepath) as f:
                return f.read()
        elif ext == "csv":
            import csv
            with open(filepath) as f:
                rows = list(csv.reader(f))
            return "\n".join(", ".join(r) for r in rows)
    except Exception as e:
        return f"[Extraction error: {e}]"
    return ""

def _parse_fields(text):
    """Extract claim fields from document text — handles Indian formats, unstructured text."""
    fields = {}
    t = text.lower()

    def _parse_inr(s):
        """Parse Indian number formats: 8,00,000 or 800000 or 8,000"""
        return float(s.replace(",", ""))

    # Claim amount — multiple patterns
    for pat in [
        r'(?:claim\s*amount|amount\s*claimed|amount)\s*[:\-]?\s*(?:₹|rs\.?|inr)?\s*([\d,]+)',
        r'(?:₹|rs\.?|inr)\s*([\d,]+)',
        r'claim\s*(?:₹|rs\.?)?\s*([\d,]+)',
    ]:
        m = re.search(pat, t)
        if m and _parse_inr(m.group(1)) >= 1000:
            fields["claim_amount"] = _parse_inr(m.group(1))
            break

    # Policy type
    if re.search(r'third[\s\-_.]*party', t):
        fields["policy_type"] = "Third-Party"
    elif "comprehensive" in t:
        fields["policy_type"] = "Comprehensive"

    # Vehicle value — multiple patterns
    for pat in [
        r'(?:vehicle\s*value|car\s*value|idv|vehicle\s*idv|insured\s*value|sum\s*insured)\s*[:\-]?\s*(?:₹|rs\.?|inr)?\s*([\d,]+)',
        r'(?:value\s*of\s*vehicle|market\s*value)\s*[:\-]?\s*(?:₹|rs\.?)?\s*([\d,]+)',
    ]:
        m = re.search(pat, t)
        if m and _parse_inr(m.group(1)) >= 10000:
            fields["vehicle_value"] = _parse_inr(m.group(1))
            break

    # Past claims
    m = re.search(r'(?:past\s*claims|previous\s*claims|prior\s*claims|no\.?\s*of\s*claims)\s*[:\-]?\s*(\d+)', t)
    if m:
        fields["past_claims"] = int(m.group(1))

    # Claims this year
    m = re.search(r'(?:claims?\s*this\s*year|claims?\s*in\s*\d{4})\s*[:\-]?\s*(\d+)', t)
    if m:
        fields["claims_this_year"] = int(m.group(1))

    # Claim ID
    m = re.search(r'(?:claim\s*(?:id|no|number|ref))\s*[:\-]?\s*([A-Za-z0-9\-]+)', t)
    if m:
        fields["claim_id"] = m.group(1).upper()

    # Dates
    for label, key in [
        (r"incident|accident|date\s*of\s*loss", "incident_date"),
        (r"report|filing|submission", "reporting_date"),
        (r"policy\s*start|policy\s*date|commencement", "policy_start_date"),
    ]:
        m = re.search(r'(?:' + label + r')\s*(?:date)?\s*[:\-]?\s*(\d{4}[\-/]\d{2}[\-/]\d{2}|\d{2}[\-/]\d{2}[\-/]\d{4})', t)
        if m:
            d = m.group(1).replace("/", "-")
            if len(d.split("-")[0]) == 2:
                parts = d.split("-")
                d = f"{parts[2]}-{parts[1]}-{parts[0]}"
            fields[key] = d

    # Description — try labeled first, then find descriptive sentences
    m = re.search(r'(?:description|incident\s*details?|nature\s*of\s*(?:loss|damage|claim)|accident\s*details?)\s*[:\-]\s*(.+?)(?:\n|$)', t)
    if m and len(m.group(1).strip()) > 10:
        fields["description"] = m.group(1).strip().capitalize()
    else:
        # Find sentences with damage/incident keywords
        damage_kw = r'(?:hit|crash|collision|fire|flood|scratch|dent|broke|crack|damage|stolen|theft|submerge|burn|accident|reverse|skid)'
        for line in text.split("\n"):
            stripped = line.strip()
            if re.search(damage_kw, stripped.lower()) and len(stripped) > 15 and not re.match(r'^(?:date|claim|policy|amount|vehicle|idv|rs|₹|\d)', stripped.lower()):
                fields["description"] = stripped[:200]
                break

    return fields

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/process", methods=["POST"])
def api_process():
    data = request.json
    claim = _build_claim(data)
    result = process_claim(claim)
    if data.get("uploaded_files"):
        result["Uploaded Documents"] = data["uploaded_files"]
    results = _load_results()
    results.append(result)
    _save_results(results)
    return jsonify(result)

def _build_claim(data):
    return {
        "claim_id": data.get("claim_id", f"WEB-{uuid.uuid4().hex[:4].upper()}"),
        "description": data.get("description", ""),
        "policy_type": data.get("policy_type", "Comprehensive"),
        "claim_amount": float(data.get("claim_amount", 0)),
        "past_claims": int(data.get("past_claims", 0)),
        "documents": "Complete" if len(data.get("documents_submitted", [])) >= len(RULES["required_documents"]) else "Missing",
        "documents_submitted": data.get("documents_submitted", []),
        "vehicle_value": float(data.get("vehicle_value", 0)),
        "policy_start_date": data.get("policy_start_date", ""),
        "incident_date": data.get("incident_date", ""),
        "reporting_date": data.get("reporting_date", ""),
        "claims_this_year": int(data.get("claims_this_year", 0)),
    }

@app.route("/api/process-stream", methods=["POST"])
def api_process_stream():
    """SSE endpoint — streams each stage result in real time."""
    data = request.json
    claim = _build_claim(data)

    def generate():
        def emit(idx, name, stage_result):
            payload = json.dumps({"stage": idx, "name": name, "data": stage_result}, ensure_ascii=False)
            return f"data: {payload}\n\n"

        s01 = stage_01_input_validation(claim)
        yield emit(1, "Input Validation", s01); time.sleep(0.3)

        s02 = stage_02_document_verification(claim)
        yield emit(2, "Document Verification", s02); time.sleep(0.3)

        s03 = stage_03_claim_analysis(claim)
        yield emit(3, "Claim Analysis", s03); time.sleep(0.3)

        s04 = stage_04_damage_assessment(claim)
        yield emit(4, "Damage Assessment", s04); time.sleep(0.3)

        s05 = stage_05_coverage_validation(claim)
        yield emit(5, "Coverage Validation", s05); time.sleep(0.3)

        s06 = stage_06_policy_limit_check(claim)
        yield emit(6, "Policy Limit Check", s06); time.sleep(0.3)

        s07 = stage_07_history_check(claim)
        yield emit(7, "History Check", s07); time.sleep(0.3)

        s08 = stage_08_fraud_detection(claim, s04)
        yield emit(8, "Fraud Detection", s08); time.sleep(0.3)

        s09 = stage_09_consistency_check(claim, s04, s03)
        yield emit(9, "Consistency Cross-Check", s09); time.sleep(0.3)

        s10 = stage_10_risk_scoring(claim, s08, s02, s04, s09, s07)
        yield emit(10, "Risk Scoring", s10); time.sleep(0.3)

        s11 = stage_11_decision(claim, s05, s08, s10, s02, s01)
        yield emit(11, "Decision", s11); time.sleep(0.3)

        s12 = stage_12_payout_estimation(claim, s11, s04)
        yield emit(12, "Payout Estimation", s12); time.sleep(0.3)

        s13 = stage_13_recommendations(claim, s11, s08, s02, s10)
        yield emit(13, "Recommendations", s13); time.sleep(0.3)

        steps = [s01,s02,s03,s04,s05,s06,s07,s08,s09,s10,s11,s12,s13]
        s14 = stage_14_audit_verification(steps, s11, s05, s08)
        yield emit(14, "Audit Verification", s14); time.sleep(0.1)

        steps.append(s14)
        confs = [s["confidence"] for s in steps]
        final = {
            "Claim ID": claim["claim_id"], "Status": s11["result"],
            "Reason": s11["reason"], "Confidence Score": round(sum(confs)/len(confs),2),
            "Damage Level": s04["result"]["damage_level"], "Policy Type": claim["policy_type"],
            "Claim Amount": f"\u20b9{claim['claim_amount']:,}",
            "Estimated Payout": f"\u20b9{s12['result'].get('estimated_net_payout',0):,}" if isinstance(s12["result"],dict) else "\u20b90",
            "Risk Score": s10["result"]["overall_risk_score"], "Fraud Risk": s08["result"]["risk_level"],
            "Recommendations": s13["result"]["actions"], "Audit Log": steps,
            "Processed At": datetime.now(timezone.utc).isoformat(),
        }
        if data.get("uploaded_files"):
            final["Uploaded Documents"] = data["uploaded_files"]
        results = _load_results()
        results.append(final)
        _save_results(results)
        yield f"data: {json.dumps({'stage':'done','result':final}, ensure_ascii=False)}\n\n"

    return Response(generate(), mimetype="text/event-stream")

@app.route("/api/upload", methods=["POST"])
def api_upload():
    """Upload a document, extract text, try to auto-parse claim fields."""
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400
    f = request.files["file"]
    if not f.filename:
        return jsonify({"error": "Empty filename"}), 400
    ext = f.filename.rsplit(".", 1)[-1].lower() if "." in f.filename else ""
    if ext not in ALLOWED_EXT:
        return jsonify({"error": f"Unsupported file type: .{ext}"}), 400
    fname = f"{uuid.uuid4().hex[:8]}_{secure_filename(f.filename)}"
    fpath = os.path.join(UPLOAD_DIR, fname)
    f.save(fpath)
    text = _extract_text(fpath)
    parsed = _parse_fields(text)
    return jsonify({
        "filename": fname,
        "original_name": f.filename,
        "extracted_text": text[:3000],
        "parsed_fields": parsed,
        "download_url": f"/uploads/{fname}"
    })

@app.route("/uploads/<path:filename>")
def serve_upload(filename):
    return send_from_directory(UPLOAD_DIR, filename)

@app.route("/api/dashboard")
def api_dashboard():
    return jsonify(_load_results())

@app.route("/api/sample-claims")
def api_sample_claims():
    return jsonify(CLAIMS)

@app.route("/api/config")
def api_config():
    return jsonify(RULES)

@app.route("/api/clear", methods=["POST"])
def api_clear():
    _save_results([])
    return jsonify({"status": "cleared"})

if __name__ == "__main__":
    import socket
    port = 5001
    while port < 5100:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('127.0.0.1', port)) != 0:
                break
        port += 1
    print(f"\n  Audit GenX — Claim Intelligence Platform")
    print(f"  By Team Frame Flux")
    print(f"  Open http://127.0.0.1:{port} in your browser\n")
    app.run(debug=False, port=port)
