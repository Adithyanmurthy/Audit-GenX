# Audit GenX — Insurance Claim Intelligence Platform

**AI Build Sprint — Problem Statement 5: Explainable + Traceable AI**
**By Team Frame Flux**

---

## Problem Space

### The Crisis in Insurance Claim Processing

The Indian insurance industry processes over **3 crore claims annually**, yet the process remains fundamentally broken:

- **72% of insurance fraud goes undetected** because manual reviewers cannot consistently apply complex rule sets across thousands of claims
- **Average processing time is 45 minutes per claim** — a single claims officer handles 15–20 claims per day, creating massive backlogs
- **Zero audit trail** — when regulators like IRDAI ask "why was this claim approved?", there is no structured reasoning to show
- **Inconsistent decisions** — the same claim reviewed by two different officers often gets two different outcomes
- **Fraud costs the industry ₹80,000+ crore annually** — inflated claims, staged accidents, missing document fraud, and repeat claimants slip through manual review

### Who Suffers?

| Stakeholder | Pain Point |
|-------------|-----------|
| Insurance Companies | Fraudulent payouts, regulatory penalties, operational costs |
| Claims Officers | Overwhelmed with volume, no decision support tools |
| Policyholders | Slow processing, inconsistent outcomes, lack of transparency |
| Regulators (IRDAI) | No audit trails, no explainability, no traceability |

---

## Solution Approach

### Core Philosophy: Every Decision Must Be Explainable

Audit GenX is not a black-box AI. It is a **14-stage transparent pipeline** where every single decision is:

1. **Explainable** — each stage produces human-readable reasoning
2. **Traceable** — every output links back to a specific rule, config, or input field
3. **Auditable** — the complete trail can be presented to regulators as-is
4. **Config-driven** — all business logic lives in JSON, not hardcoded

### Architecture

```
                    ┌─────────────────────────────────────────┐
                    │           Audit GenX Platform            │
                    ├─────────────────────────────────────────┤
                    │                                         │
  Claim Input ──────►  14-Stage AI Pipeline                   │
  (Form / Document) │  ┌──────────────────────────────────┐  │
                    │  │ 1. Input Validation               │  │
                    │  │ 2. Document Verification          │  │
                    │  │ 3. Claim Analysis                 │  │
                    │  │ 4. Damage Assessment              │  │
                    │  │ 5. Coverage Validation            │  │
                    │  │ 6. Policy Limit Check             │  │
                    │  │ 7. History Check                  │  │
                    │  │ 8. Fraud Detection (8 indicators) │  │
                    │  │ 9. Consistency Cross-Check        │  │
                    │  │ 10. Risk Scoring (6-factor)       │  │
                    │  │ 11. Decision Generation           │  │
                    │  │ 12. Payout Estimation             │  │
                    │  │ 13. Recommendation Engine         │  │
                    │  │ 14. Audit Verification            │  │
                    │  └──────────────────────────────────┘  │
                    │                                         │
                    │  Output:                                │
                    │  ✓ Decision (Approved/Rejected/Pending) │
                    │  ✓ Full 14-step audit trail             │
                    │  ✓ Confidence scores per stage          │
                    │  ✓ Payout estimation                    │
                    │  ✓ Recommended actions                  │
                    └─────────────────────────────────────────┘
                                      │
                              ┌───────┴───────┐
                              │ Config Layer  │
                              │ (JSON rules)  │
                              └───────────────┘
                              Coverage rules
                              Fraud thresholds
                              Damage keywords
                              Risk weights
                              Policy limits
```

---

## The 14-Stage Pipeline — In Detail

### Stage 1: Input Validation
Validates all 12 input fields — checks types, ranges, required fields. Catches empty descriptions, invalid amounts, missing dates.

### Stage 2: Document Verification
Checks each of the 6 required documents individually: FIR/Police Report, Driving License, Vehicle Registration (RC), Insurance Policy Copy, Claim Form (signed), Repair Estimate/Bill. Reports completeness percentage and lists missing documents.

### Stage 3: Claim Analysis
Reads the incident description and classifies the incident type using keyword matching: collision, single-vehicle, theft, fire, natural disaster, vandalism, or hit-and-run.

### Stage 4: Damage Assessment
Classifies damage severity as minor, moderate, or major using keyword frequency matching. Cross-checks the claim amount against typical repair cost ranges for that damage level.

### Stage 5: Coverage Validation
Checks if the policy type (Comprehensive vs Third-Party) covers the claimed damage. Also checks for exclusions — drunk driving, racing, commercial use, war, nuclear events.

### Stage 6: Policy Limit Check
Verifies the claim amount doesn't exceed the policy's maximum coverage limit (₹10,00,000 for Comprehensive, ₹5,00,000 for Third-Party).

### Stage 7: History Check
Examines the claimant's history: total past claims vs threshold, claims filed this year, and whether the policy was purchased suspiciously recently (within 30 days of incident).

### Stage 8: Fraud Detection
Runs 8 weighted fraud indicators:

| Indicator | Weight | What It Catches |
|-----------|--------|----------------|
| Past claims exceeded | 25/100 | Repeat claimants (>3 lifetime) |
| High claim for minor damage | 20/100 | Inflated claims (>₹25,000 for minor) |
| Claim vs vehicle value | 20/100 | Claim >80% of car value |
| Missing documents | 15/100 | Incomplete evidence |
| Multiple claims same year | 15/100 | Suspicious frequency (2+/year) |
| Exclusion keywords | 15/100 | Drunk driving, racing in description |
| Late reporting | 10/100 | Reported 30+ days after incident |
| Amount outside range | 10/100 | Doesn't match damage level |

Total score ≥40 = High Risk, ≥20 = Medium Risk, <20 = Low Risk.

### Stage 9: Consistency Cross-Check
Cross-verifies that the claim amount matches the damage level's typical repair range, and that the incident type is covered by the policy type.

### Stage 10: Risk Scoring
Combines 6 weighted factors into an overall risk score (0–100):

| Factor | Weight |
|--------|--------|
| Fraud risk | 30% |
| Claim amount reasonableness | 20% |
| Document completeness | 15% |
| Description consistency | 15% |
| Claim history | 10% |
| Reporting timeliness | 10% |

### Stage 11: Decision Generation
Makes the final call based on all prior stages:
- **Approved** — covered, documents complete, no fraud, low risk
- **Rejected** — not covered by policy, or exclusion triggered
- **Pending** — high fraud risk, missing documents, or high overall risk (requires manual review)

### Stage 12: Payout Estimation
Calculates estimated payout based on damage level payout percentages minus the policy deductible:
- Minor: 70–90% payout range
- Moderate: 50–70% payout range
- Major: 30–50% payout range

### Stage 13: Recommendation Engine
Generates actionable next steps for the claims officer:
- Approved: process payout, notify policyholder, archive with audit trail
- Rejected: send rejection letter with appeal instructions
- Pending: assign to SIU, request missing documents, set deadlines

### Stage 14: Audit Verification
The final safeguard — checks for contradictions across all 13 prior stages:
- If coverage says "not covered" but decision is not "Rejected" → contradiction
- If fraud risk is "high" but decision is "Approved" → contradiction
- If covered + low fraud but decision is "Rejected" → contradiction

Produces a traceability map linking every stage's confidence and source.

---

## Features

### 1. Real-Time Pipeline Visualization
Watch all 14 stages execute live with an n8n-style node graph. Each node lights up as it processes, with SVG bezier curve connections showing data flow. A terminal log shows reasoning in real time.

### 2. Document Upload and Auto-Extraction
Upload PDF, DOCX, images, or text files. The system extracts text using pypdf/python-docx/pytesseract, then auto-detects claim fields (amount, policy type, vehicle value, description, dates) using regex pattern matching. Supports Indian number formats (₹8,00,000).

### 3. Claim Submission Form
12-field form with document checkboxes. Load sample claims with one click, or process all 7 test claims at once for demo purposes.

### 4. Full Audit Trail
Every claim produces a 14-row audit table showing: stage name, reasoning, confidence score (HIGH/MED/LOW), and data source. This is the core deliverable — the complete, structured, auditable decision trail.

### 5. Dashboard with Analytics
Stats overview (total/approved/rejected/pending/audit consistency), clickable claim list, clear-all functionality. All data persists to disk.

### 6. Config-Driven Business Rules
All logic lives in `configs/policy_rules.json`:
- Coverage rules (what each policy covers)
- Exclusions (drunk driving, racing, etc.)
- Required documents list
- Fraud indicator thresholds and weights
- Damage classification keywords and repair ranges
- Risk score factor weights
- Confidence thresholds

Change the JSON → change the behavior. No code changes needed. Different insurance companies can have completely different rules.

### 7. Streaming SSE Pipeline
Server-Sent Events endpoint streams each stage result as it completes, enabling the real-time visualization. 0.3s delay between stages for visual effect.

### 8. Data Persistence
All processed claims are saved to `output/results.json` on disk. Data survives server restarts and persists after deployment.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python, Flask |
| Frontend | HTML, CSS, JavaScript (single-page app) |
| AI Engine | Rule-based 14-stage pipeline with weighted scoring |
| Document Processing | pypdf, python-docx, Pillow, pytesseract |
| Data Format | JSON (config, claims, results) |
| Real-Time | Server-Sent Events (SSE) |
| Visualization | SVG bezier curves, CSS animations |

---

## Test Claims — 7 Edge Cases

| Claim | Scenario | Result | Why |
|-------|----------|--------|-----|
| C1 | Third-Party policy, own damage | Rejected | Policy doesn't cover own vehicle damage |
| C2 | Comprehensive, moderate collision | Approved | Covered, clean record, all docs |
| C3 | Minor scratch, ₹75K claim, 5 past claims, missing docs | Pending | High fraud risk (score 72/100) |
| C4 | Vehicle fire, total loss, Comprehensive | Approved | Covered, clean record, major damage |
| C5 | Third-Party, hit-and-run, own damage | Rejected | Policy doesn't cover own damage |
| C6 | Comprehensive, missing 2 documents | Pending | Cannot finalize without documentation |
| C7 | Flood damage, Comprehensive, clean | Approved | Covered, clean record, major damage |

---

## What Makes This Different

| Traditional Approach | Audit GenX |
|---------------------|-----------|
| Manual review, 45 min/claim | Automated, <1 second |
| No audit trail | 14-stage structured trail |
| 3 basic checks | 14 verification stages |
| Binary fraud flag | 8 weighted indicators, score 0–100 |
| Hardcoded rules | Config-driven JSON |
| No explainability | Reasoning + confidence + source at every step |
| No real-time visibility | Live pipeline visualization |
| No payout estimation | Damage-based payout calculation |
| No recommendations | Actionable next steps for officers |

---

## How to Run

```bash
cd PS5-AuditReady-AI
python3 app.py
```

Open the URL printed in the terminal. Submit a claim and watch the 14-stage pipeline execute in real time.

---

## Project Structure

```
PS5-AuditReady-AI/
├── app.py                     — Flask backend (API + SSE streaming + frontend)
├── audit_decision_system.py   — 14-stage processing engine
├── configs/
│   └── policy_rules.json      — All business rules (config-driven)
├── data/
│   └── claims.json            — 7 test claims with 12 fields each
├── templates/
│   └── index.html             — Professional SaaS frontend
├── uploads/                   — Uploaded documents
└── output/
    └── results.json           — Processed results (persisted)
```

---

**Built by Team Frame Flux**
**AI Build Sprint — Problem Statement 5**
