# 🛡 Audit GenX — Insurance Claim Intelligence Platform

**AI Build Sprint — Problem Statement 5: Explainable + Traceable AI**

A 14-stage AI pipeline for insurance claim processing, built as a professional SaaS web application with document upload, real-time analysis, and complete audit trails.

**By Team Frame Flux**

---

## 🚀 How to Run

```bash
cd PS5-AuditReady-AI
pip install flask pypdf python-docx Pillow    # if not installed
python3 app.py
```

Open **http://127.0.0.1:5000** in your browser.

---

## 🖥 SaaS Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | Stats overview, all processed claims, click any claim to see full audit trail |
| **New Claim** | 12-field form with document checkboxes, processes through 14 stages |
| **Upload Document** | Upload PDF/DOCX/image/text → auto-extracts text → auto-detects claim fields → pre-fills form |
| **Analysis Result** | Full 14-stage audit trail with reasoning, confidence, source at every step |
| **Pipeline Info** | Explains all 14 stages, required documents, policy types |
| **Policy Config** | View current business rules (all config-driven, no code changes needed) |
| **Run 7 Test Claims** | One-click to process all test cases and see dashboard |

---

## 📁 Project Structure

```
PS5-AuditReady-AI/
├── app.py                     # Flask SaaS backend (API + document upload)
├── audit_decision_system.py   # 14-stage processing engine
├── generate_dashboard.py      # Static HTML dashboard generator
├── README.md
├── configs/
│   └── policy_rules.json      # All business rules (config-driven)
├── data/
│   └── claims.json            # 7 test claims
├── templates/
│   └── index.html             # Professional SaaS frontend
├── uploads/                   # Uploaded documents stored here
└── output/
    ├── results.json           # Processed results with audit trails
    └── dashboard.html         # Static visual dashboard
```

---

## ✅ Requirements Checklist

| Requirement | Status |
|-------------|--------|
| Step-by-step audit trail | ✅ 14 stages per claim |
| Reasoning + confidence + source per step | ✅ |
| Process multiple claims (≥3) | ✅ 7 claims |
| Consistency verification | ✅ Stage 14 checks for contradictions |
| Handle edge cases | ✅ Fraud, missing docs, invalid policy |
| Structured JSON output | ✅ Full JSON with nested audit logs |
| Visual format | ✅ Professional SaaS web app |
| Document upload + extraction | ✅ PDF, DOCX, images, text |
| No contradictions | ✅ All 7 claims pass consistency check |
