"""
Audit GenX Decision System v2.0 - 14-Stage Pipeline
========================================================
AI Build Sprint - Problem Statement 5

Processes insurance claims through 14 thorough verification stages,
each producing reasoning, confidence, and source for a complete audit trail.

Author: Team Frame Flux
"""

import json, os, math
from datetime import datetime, timezone, date

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIGS_DIR = os.path.join(BASE_DIR, "configs")
DATA_DIR = os.path.join(BASE_DIR, "data")
OUTPUT_DIR = os.path.join(BASE_DIR, "output")

def load_json(path):
    with open(path, "r") as f:
        return json.load(f)

RULES = load_json(os.path.join(CONFIGS_DIR, "policy_rules.json"))
CLAIMS = load_json(os.path.join(DATA_DIR, "claims.json"))

def _audit(step, result, reason, confidence, source):
    return {"step": step, "result": result, "reason": reason, "confidence": round(confidence, 2), "source": source}

def _parse_date(s):
    try: return date.fromisoformat(s)
    except: return None

# ── STAGE 1: Input Validation ─────────────────────────────────────────
def stage_01_input_validation(c):
    errors = []
    if not c.get("description","").strip(): errors.append("Description is empty")
    if not isinstance(c.get("claim_amount"), (int,float)) or c["claim_amount"] <= 0: errors.append("Claim amount invalid or zero")
    if c.get("policy_type") not in RULES["coverage_rules"]: errors.append(f"Unknown policy type: {c.get('policy_type')}")
    if not isinstance(c.get("past_claims"), int) or c["past_claims"] < 0: errors.append("Past claims invalid")
    if not isinstance(c.get("vehicle_value"), (int,float)) or c.get("vehicle_value",0) <= 0: errors.append("Vehicle value missing or invalid")
    if not _parse_date(c.get("incident_date","")): errors.append("Incident date missing or invalid")
    if not _parse_date(c.get("reporting_date","")): errors.append("Reporting date missing or invalid")
    valid = len(errors) == 0
    return _audit("input_validation",
        {"valid": valid, "errors": errors, "fields_checked": 7},
        f"{'All 7 input fields validated successfully' if valid else 'Validation failed: ' + '; '.join(errors)}.",
        0.95 if valid else 0.40,
        "Input field type and range checks")

# ── STAGE 2: Document Verification ────────────────────────────────────
def stage_02_document_verification(c):
    required = RULES["required_documents"]
    submitted = c.get("documents_submitted", [])
    missing = [d for d in required if d not in submitted]
    extra = [d for d in submitted if d not in required]
    complete = len(missing) == 0
    pct = round((len(required) - len(missing)) / len(required) * 100)
    conf = 0.95 if complete else (0.60 if pct >= 50 else 0.35)
    return _audit("document_verification",
        {"complete": complete, "submitted": len(submitted), "required": len(required), "missing": missing, "completeness_pct": pct},
        f"{len(submitted)}/{len(required)} documents submitted ({pct}%). {'All required documents present.' if complete else 'Missing: ' + ', '.join(missing) + '.'}",
        conf,
        "Required documents checklist from config")

# ── STAGE 3: Claim Analysis ───────────────────────────────────────────
def stage_03_claim_analysis(c):
    desc = c["description"].lower()
    incident = "unknown"
    for itype, keywords in RULES["incident_types"].items():
        if any(kw in desc for kw in keywords):
            incident = itype
            break
    return _audit("claim_analysis",
        {"incident_type": incident, "description_length": len(c["description"]), "claim_id": c["claim_id"]},
        f"Incident classified as '{incident}' based on description keyword matching.",
        0.90 if incident != "unknown" else 0.70,
        "incident_types config + description text")

# ── STAGE 4: Damage Assessment ────────────────────────────────────────
def stage_04_damage_assessment(c):
    desc = c["description"].lower()
    best_level, best_count = "unknown", 0
    for level in ["minor","moderate","major"]:
        kws = RULES["damage_classification"][level]["keywords"]
        count = sum(1 for kw in kws if kw in desc)
        if count > best_count:
            best_count = count
            best_level = level
    info = RULES["damage_classification"].get(best_level, {})
    repair_range = info.get("typical_repair_range", [0,0])
    amount = c["claim_amount"]
    within_range = repair_range[0] <= amount <= repair_range[1] if best_level != "unknown" else None
    return _audit("damage_assessment",
        {"damage_level": best_level, "keywords_matched": best_count, "typical_repair_range": repair_range, "claim_amount": amount, "amount_within_typical_range": within_range},
        f"Damage classified as {best_level} ({best_count} keywords matched). Typical repair: ₹{repair_range[0]:,}-₹{repair_range[1]:,}. Claimed ₹{amount:,} is {'within' if within_range else 'outside'} typical range.",
        0.90 if best_level != "unknown" and within_range else (0.75 if best_level != "unknown" else 0.65),
        "damage_classification config keywords + typical_repair_range")

# ── STAGE 5: Coverage Validation ──────────────────────────────────────
def stage_05_coverage_validation(c):
    policy = c["policy_type"]
    rule = RULES["coverage_rules"].get(policy, {})
    covered = rule.get("covers_own_damage", False)
    desc = c["description"].lower()
    exclusions = RULES.get("exclusions", {}).get(policy, [])
    triggered = [e for e in exclusions if e in desc]
    excluded = len(triggered) > 0
    final_covered = covered and not excluded
    return _audit("coverage_validation",
        {"policy_type": policy, "covers_own_damage": covered, "exclusions_triggered": triggered, "excluded": excluded, "final_covered": final_covered},
        f"{policy} policy {'covers' if covered else 'does NOT cover'} own damage. {'Exclusion triggered: ' + ', '.join(triggered) + '.' if excluded else 'No exclusions triggered.'} Final: {'Covered' if final_covered else 'Not covered'}.",
        0.95,
        "coverage_rules + exclusions config")

# ── STAGE 6: Policy Limit Check ───────────────────────────────────────
def stage_06_policy_limit_check(c):
    rule = RULES["coverage_rules"].get(c["policy_type"], {})
    limit = rule.get("policy_limit_inr", 0)
    amount = c["claim_amount"]
    within = amount <= limit
    pct = round(amount / limit * 100, 1) if limit > 0 else 0
    return _audit("policy_limit_check",
        {"claim_amount": amount, "policy_limit": limit, "within_limit": within, "utilization_pct": pct},
        f"Claim ₹{amount:,} is {pct}% of policy limit ₹{limit:,}. {'Within limit.' if within else 'EXCEEDS policy limit.'}",
        0.95 if within else 0.90,
        "policy_limit_inr from coverage_rules config")

# ── STAGE 7: Duplicate / History Check ────────────────────────────────
def stage_07_history_check(c):
    flags = []
    past = c.get("past_claims", 0)
    this_year = c.get("claims_this_year", 0)
    threshold = RULES["fraud_indicators"]["past_claims_threshold"]
    yr_threshold = RULES["fraud_indicators"]["multiple_claims_same_year_threshold"]
    if past > threshold:
        flags.append(f"Total past claims ({past}) exceed threshold ({threshold})")
    if this_year >= yr_threshold:
        flags.append(f"Claims this year ({this_year}) meet/exceed threshold ({yr_threshold})")
    policy_start = _parse_date(c.get("policy_start_date",""))
    incident = _parse_date(c.get("incident_date",""))
    if policy_start and incident:
        days_since = (incident - policy_start).days
        if days_since <= RULES["fraud_indicators"]["recent_policy_purchase_days"]:
            flags.append(f"Incident occurred only {days_since} days after policy purchase")
    return _audit("history_check",
        {"past_claims": past, "claims_this_year": this_year, "flags": flags, "risk_flags_count": len(flags)},
        f"{'No history concerns.' if not flags else 'Flags: ' + '; '.join(flags) + '.'}",
        0.90 if not flags else 0.65,
        "Claim history fields + fraud_indicators thresholds")

# ── STAGE 8: Fraud Detection ─────────────────────────────────────────
def stage_08_fraud_detection(c, damage_result):
    fi = RULES["fraud_indicators"]
    weights = fi["fraud_weight_config"]
    flags = []
    score = 0
    # 1. Past claims
    if c.get("past_claims",0) > fi["past_claims_threshold"]:
        flags.append(("past_claims_exceeded", f"Past claims ({c['past_claims']}) > {fi['past_claims_threshold']}"))
        score += weights["past_claims_exceeded"]
    # 2. High claim minor damage
    dmg = damage_result["result"]["damage_level"]
    if dmg == "minor" and c["claim_amount"] > fi["high_claim_minor_damage_threshold_inr"]:
        flags.append(("high_claim_minor_damage", f"₹{c['claim_amount']:,} for minor damage (threshold ₹{fi['high_claim_minor_damage_threshold_inr']:,})"))
        score += weights["high_claim_minor_damage"]
    # 3. Missing docs
    if c.get("documents") == "Missing":
        flags.append(("missing_documents", "Supporting documents incomplete"))
        score += weights["missing_documents"]
    # 4. Amount vs vehicle value
    vv = c.get("vehicle_value", 1)
    ratio = c["claim_amount"] / vv if vv > 0 else 0
    if ratio > fi["claim_amount_vs_vehicle_value_ratio"]:
        flags.append(("description_amount_mismatch", f"Claim is {ratio:.0%} of vehicle value (threshold {fi['claim_amount_vs_vehicle_value_ratio']:.0%})"))
        score += weights["description_amount_mismatch"]
    # 5. Multiple claims same year
    if c.get("claims_this_year",0) >= fi["multiple_claims_same_year_threshold"]:
        flags.append(("multiple_claims_same_year", f"{c['claims_this_year']} claims this year"))
        score += weights["multiple_claims_same_year"]
    # 6. Late reporting
    inc = _parse_date(c.get("incident_date",""))
    rep = _parse_date(c.get("reporting_date",""))
    if inc and rep:
        delay = (rep - inc).days
        if delay > fi["late_reporting_days"]:
            flags.append(("late_reporting", f"Reported {delay} days after incident"))
            score += weights["late_reporting"]
    # 7. Exclusion keywords
    desc = c["description"].lower()
    excl = RULES.get("exclusions",{}).get(c["policy_type"],[])
    found = [e for e in excl if e in desc]
    if found:
        flags.append(("exclusion_keywords_found", f"Exclusion terms in description: {', '.join(found)}"))
        score += weights["exclusion_keywords_found"]
    # 8. Amount outside typical range
    if not damage_result["result"].get("amount_within_typical_range", True) and dmg != "unknown":
        flags.append(("amount_outside_range", f"Claim amount outside typical repair range for {dmg} damage"))
        score += 10
    risk = "high" if score >= 40 else ("medium" if score >= 20 else "low")
    return _audit("fraud_detection",
        {"fraud_risk_score": score, "risk_level": risk, "flags": [{"id":f[0],"detail":f[1]} for f in flags], "indicators_checked": 8},
        f"Fraud risk score: {score}/100 ({risk}). {len(flags)} indicator(s) triggered." + (f" Flags: {'; '.join(f[1] for f in flags)}." if flags else ""),
        0.92 if risk == "low" else (0.80 if risk == "medium" else 0.85),
        "fraud_indicators config with weighted scoring")

# ── STAGE 9: Consistency Cross-Check ──────────────────────────────────
def stage_09_consistency_check(c, damage_result, claim_analysis):
    issues = []
    dmg = damage_result["result"]["damage_level"]
    amount = c["claim_amount"]
    repair_range = damage_result["result"].get("typical_repair_range", [0,0])
    if dmg != "unknown" and not (repair_range[0] <= amount <= repair_range[1]):
        issues.append(f"Claim ₹{amount:,} outside typical {dmg} repair range ₹{repair_range[0]:,}-₹{repair_range[1]:,}")
    incident = claim_analysis["result"]["incident_type"]
    policy = c["policy_type"]
    if incident in ["theft","fire","natural_disaster"] and policy == "Third-Party":
        issues.append(f"Incident type '{incident}' not covered by Third-Party policy")
    consistent = len(issues) == 0
    return _audit("consistency_cross_check",
        {"consistent": consistent, "issues": issues, "checks_performed": ["amount_vs_damage_range", "incident_vs_policy"]},
        f"{'All cross-checks passed.' if consistent else 'Inconsistencies: ' + '; '.join(issues) + '.'}",
        0.92 if consistent else 0.55,
        "Cross-verification of damage assessment, claim amount, incident type, and policy type")

# ── STAGE 10: Risk Scoring ────────────────────────────────────────────
def stage_10_risk_scoring(c, fraud_result, doc_result, damage_result, consistency_result, history_result):
    w = RULES["risk_score_weights"]
    fraud_s = min(fraud_result["result"]["fraud_risk_score"], 100)
    doc_pct = doc_result["result"]["completeness_pct"]
    doc_s = 100 - doc_pct
    amt_in_range = damage_result["result"].get("amount_within_typical_range", True)
    amt_s = 0 if amt_in_range else 60
    consist_s = 0 if consistency_result["result"]["consistent"] else 70
    hist_flags = history_result["result"]["risk_flags_count"]
    hist_s = min(hist_flags * 30, 100)
    inc = _parse_date(c.get("incident_date",""))
    rep = _parse_date(c.get("reporting_date",""))
    delay = (rep - inc).days if inc and rep else 0
    time_s = min(delay * 3, 100)
    total = round(w["fraud_risk"]*fraud_s + w["document_completeness"]*doc_s + w["claim_amount_reasonableness"]*amt_s + w["description_consistency"]*consist_s + w["claim_history"]*hist_s + w["reporting_timeliness"]*time_s)
    total = min(max(total, 0), 100)
    level = "high" if total >= 50 else ("medium" if total >= 25 else "low")
    return _audit("risk_scoring",
        {"overall_risk_score": total, "risk_level": level, "components": {"fraud": round(fraud_s), "documents": round(doc_s), "amount_reasonableness": round(amt_s), "consistency": round(consist_s), "history": round(hist_s), "timeliness": round(time_s)}},
        f"Overall risk score: {total}/100 ({level}). Fraud:{round(fraud_s)} Docs:{round(doc_s)} Amount:{round(amt_s)} Consistency:{round(consist_s)} History:{round(hist_s)} Timeliness:{round(time_s)}.",
        0.88,
        "Weighted risk scoring formula from risk_score_weights config")

# ── STAGE 11: Decision Generation ─────────────────────────────────────
def stage_11_decision(c, coverage_result, fraud_result, risk_result, doc_result, input_result):
    reasons = []
    if not input_result["result"]["valid"]:
        return _audit("decision", "Rejected", "Claim input validation failed: " + "; ".join(input_result["result"]["errors"]), 0.90, "input_validation result")
    if not coverage_result["result"]["final_covered"]:
        r = f"{c['policy_type']} policy does not cover this claim"
        if coverage_result["result"]["excluded"]:
            r += f" (exclusion triggered: {', '.join(coverage_result['result']['exclusions_triggered'])})"
        return _audit("decision", "Rejected", r, 0.95, "coverage_validation result")
    risk_level = risk_result["result"]["risk_level"]
    fraud_level = fraud_result["result"]["risk_level"]
    if fraud_level == "high":
        return _audit("decision", "Pending", "High fraud risk detected — requires manual investigation by senior claims officer.", 0.82, "fraud_detection + risk_scoring results")
    if not doc_result["result"]["complete"]:
        return _audit("decision", "Pending", f"Documents incomplete ({doc_result['result']['completeness_pct']}%). Missing: {', '.join(doc_result['result']['missing'])}.", 0.78, "document_verification result")
    if risk_level == "high":
        return _audit("decision", "Pending", f"Overall risk score {risk_result['result']['overall_risk_score']}/100 is high — flagged for review.", 0.75, "risk_scoring result")
    if fraud_level == "medium":
        return _audit("decision", "Pending", "Medium fraud risk — flagged for review before approval.", 0.72, "fraud_detection result")
    return _audit("decision", "Approved", "Claim is covered, documents complete, no fraud indicators, risk is low.", 0.93, "All prior stages passed")

# ── STAGE 12: Payout Estimation ───────────────────────────────────────
def stage_12_payout_estimation(c, decision_result, damage_result):
    if decision_result["result"] == "Rejected":
        return _audit("payout_estimation", {"estimated_payout": 0, "reason": "Claim rejected"}, "No payout — claim was rejected.", 0.95, "decision result")
    dmg = damage_result["result"]["damage_level"]
    info = RULES["damage_classification"].get(dmg, {})
    pmin = info.get("payout_percent_min", 50)
    pmax = info.get("payout_percent_max", 70)
    pct = (pmin + pmax) / 2 / 100
    deductible = RULES["coverage_rules"].get(c["policy_type"],{}).get("deductible_inr", 3000)
    gross = round(c["claim_amount"] * pct)
    net = max(gross - deductible, 0)
    return _audit("payout_estimation",
        {"damage_level": dmg, "payout_pct_range": f"{pmin}-{pmax}%", "payout_pct_used": f"{pct:.0%}", "gross_payout": gross, "deductible": deductible, "estimated_net_payout": net},
        f"Damage: {dmg} → payout range {pmin}-{pmax}%, using midpoint {pct:.0%}. Gross: ₹{gross:,} - deductible ₹{deductible:,} = Net: ₹{net:,}.",
        0.85 if decision_result["result"] == "Approved" else 0.70,
        "damage_classification payout ranges + deductible from coverage_rules config")

# ── STAGE 13: Recommendation Engine ───────────────────────────────────
def stage_13_recommendations(c, decision_result, fraud_result, doc_result, risk_result):
    recs = []
    status = decision_result["result"]
    if status == "Approved":
        recs.append("Proceed with payout processing")
        recs.append("Send approval notification to policyholder")
        recs.append("Archive claim with audit trail for compliance")
    elif status == "Rejected":
        recs.append("Send rejection letter with detailed reason and appeal instructions")
        recs.append("Archive claim with full audit trail")
    else:
        if fraud_result["result"]["risk_level"] in ["high","medium"]:
            recs.append("Assign to Special Investigation Unit (SIU) for fraud review")
            recs.append("Request additional documentation from claimant")
        if not doc_result["result"]["complete"]:
            recs.append(f"Request missing documents: {', '.join(doc_result['result']['missing'])}")
            recs.append("Set 15-day deadline for document submission")
        recs.append("Schedule follow-up review after additional information received")
    if risk_result["result"]["overall_risk_score"] >= 40:
        recs.append("Flag policyholder profile for enhanced monitoring on future claims")
    return _audit("recommendations",
        {"actions": recs, "count": len(recs)},
        f"{len(recs)} recommended actions generated for claims officer.",
        0.88,
        "Decision status + fraud/document/risk results")

# ── STAGE 14: Audit Verification ──────────────────────────────────────
def stage_14_audit_verification(all_steps, decision_result, coverage_result, fraud_result):
    contradictions = []
    if not coverage_result["result"]["final_covered"] and decision_result["result"] != "Rejected":
        contradictions.append("Coverage says not covered but decision is not Rejected")
    if fraud_result["result"]["risk_level"] == "high" and decision_result["result"] == "Approved":
        contradictions.append("High fraud risk but decision is Approved")
    if coverage_result["result"]["final_covered"] and fraud_result["result"]["risk_level"] == "low" and decision_result["result"] == "Rejected":
        contradictions.append("Covered + low fraud but decision is Rejected")
    consistent = len(contradictions) == 0
    traceability = {}
    for s in all_steps:
        traceability[s["step"]] = {"confidence": s["confidence"], "source": s["source"]}
    return _audit("audit_verification",
        {"consistent": consistent, "contradictions": contradictions, "total_steps_audited": len(all_steps) + 1, "traceability_map": traceability},
        f"{'All {0} stages are consistent with the final decision. No contradictions found.'.format(len(all_steps)) if consistent else 'CONTRADICTIONS: ' + '; '.join(contradictions)}",
        0.98 if consistent else 0.30,
        "Cross-verification of all 14 pipeline stages")


# ── MAIN PIPELINE ─────────────────────────────────────────────────────
def process_claim(c):
    s01 = stage_01_input_validation(c)
    s02 = stage_02_document_verification(c)
    s03 = stage_03_claim_analysis(c)
    s04 = stage_04_damage_assessment(c)
    s05 = stage_05_coverage_validation(c)
    s06 = stage_06_policy_limit_check(c)
    s07 = stage_07_history_check(c)
    s08 = stage_08_fraud_detection(c, s04)
    s09 = stage_09_consistency_check(c, s04, s03)
    s10 = stage_10_risk_scoring(c, s08, s02, s04, s09, s07)
    s11 = stage_11_decision(c, s05, s08, s10, s02, s01)
    s12 = stage_12_payout_estimation(c, s11, s04)
    s13 = stage_13_recommendations(c, s11, s08, s02, s10)
    steps = [s01,s02,s03,s04,s05,s06,s07,s08,s09,s10,s11,s12,s13]
    s14 = stage_14_audit_verification(steps, s11, s05, s08)
    steps.append(s14)
    confs = [s["confidence"] for s in steps]
    final_conf = round(sum(confs)/len(confs), 2)
    return {
        "Claim ID": c["claim_id"],
        "Status": s11["result"],
        "Reason": s11["reason"],
        "Confidence Score": final_conf,
        "Damage Level": s04["result"]["damage_level"],
        "Policy Type": c["policy_type"],
        "Claim Amount": f"\u20b9{c['claim_amount']:,}",
        "Estimated Payout": f"\u20b9{s12['result'].get('estimated_net_payout',0):,}" if isinstance(s12["result"],dict) else "\u20b90",
        "Risk Score": s10["result"]["overall_risk_score"],
        "Fraud Risk": s08["result"]["risk_level"],
        "Recommendations": s13["result"]["actions"],
        "Audit Log": steps,
        "Processed At": datetime.now(timezone.utc).isoformat(),
    }


def process_all_claims():
    results = []
    print("=" * 72)
    print("  AUDIT-READY AI DECISION SYSTEM v2.0 — 14-Stage Pipeline")
    print("  AI Build Sprint — Problem Statement 5")
    print("=" * 72)
    print(f"\n  Claims: {len(CLAIMS)} | Pipeline stages: 14 | Fraud indicators: 8")
    print()
    for c in CLAIMS:
        r = process_claim(c)
        results.append(r)
        icon = {"Approved":"\u2705","Rejected":"\u274c","Pending":"\u26a0\ufe0f"}.get(r["Status"],"\u2753")
        print(f"  {icon} {r['Claim ID']}: {r['Status']} | conf:{r['Confidence Score']} | risk:{r['Risk Score']}/100 | fraud:{r['Fraud Risk']} | payout:{r['Estimated Payout']}")
        print(f"     Reason: {r['Reason'][:90]}")
        for s in r["Audit Log"]:
            cl = "HIGH" if s["confidence"]>=0.80 else ("MED" if s["confidence"]>=0.60 else "LOW")
            print(f"     \u251c\u2500 {s['step']}: conf {s['confidence']} ({cl})")
        print()
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    with open(os.path.join(OUTPUT_DIR, "results.json"), "w") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"  \U0001f4c4 Results saved to: output/results.json")
    print("\n" + "=" * 72)
    print("  SUMMARY")
    print("=" * 72)
    print(f"  {'Claim':<6} {'Status':<9} {'Conf':<6} {'Risk':<6} {'Fraud':<7} {'Damage':<9} {'Policy':<14} {'Amount':<11} {'Payout':<11}")
    print(f"  {'─'*6} {'─'*9} {'─'*6} {'─'*6} {'─'*7} {'─'*9} {'─'*14} {'─'*11} {'─'*11}")
    for r in results:
        print(f"  {r['Claim ID']:<6} {r['Status']:<9} {r['Confidence Score']:<6} {r['Risk Score']:<6} {r['Fraud Risk']:<7} {r['Damage Level']:<9} {r['Policy Type']:<14} {r['Claim Amount']:<11} {r['Estimated Payout']:<11}")
    a = sum(1 for r in results if r["Status"]=="Approved")
    rj = sum(1 for r in results if r["Status"]=="Rejected")
    p = sum(1 for r in results if r["Status"]=="Pending")
    ok = all(next(s for s in r["Audit Log"] if s["step"]=="audit_verification")["result"]["consistent"] for r in results)
    print(f"\n  Approved: {a} | Rejected: {rj} | Pending: {p}")
    print(f"  Audit Consistency: {'\u2705 ALL CONSISTENT' if ok else '\u274c INCONSISTENCIES FOUND'}")
    print("=" * 72)
    return results

if __name__ == "__main__":
    process_all_claims()
