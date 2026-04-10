# Audit GenX

**14-Stage AI Pipeline for Insurance Claim Processing**

> Every decision is explainable, traceable, and audit-ready.

Built by **Team Frame Flux** | AI Build Sprint — Problem Statement 5

---

## What It Does

Audit GenX processes insurance claims through **14 automated verification stages** in under 1 second. Each stage produces reasoning, a confidence score, and the data source — creating a complete audit trail that satisfies regulators like IRDAI.

**Input**: Insurance claim (form or uploaded document)
**Output**: Approve / Reject / Pending — with full 14-step audit trail, payout estimation, and recommended actions

---

## Quick Start

```bash
cd PS5-AuditReady-AI
pip install flask pypdf python-docx Pillow
python3 app.py
```

Open the URL printed in the terminal. That's it.

---

## The 14-Stage Pipeline

```
Claim → [1] Input Validation
      → [2] Document Verification
      → [3] Claim Analysis
      → [4] Damage Assessment
      → [5] Coverage Validation
      → [6] Policy Limit Check
      → [7] History Check
      → [8] Fraud Detection (8 weighted indicators)
      → [9] Consistency Cross-Check
      → [10] Risk Scoring (6-factor weighted)
      → [11] Decision Generation
      → [12] Payout Estimation
      → [13] Recommendation Engine
      → [14] Audit Verification
      → Decision + Full Audit Trail
```

Every stage outputs:
- **Reasoning** — what was checked and why
- **Confidence** — HIGH / MED / LOW with numeric score
- **Source** — which rule or data drove the result

---

## Features

| Feature | Description |
|---------|-------------|
| **Live Pipeline** | n8n-style node visualization — watch 14 stages execute in real time with SVG connections |
| **Document Upload** | Upload PDF, DOCX, images, text — auto-extracts text and detects claim fields |
| **Fraud Detection** | 8 weighted indicators: past claims, inflated amounts, missing docs, late reporting, and more |
| **Risk Scoring** | 6-factor weighted composite score (0–100) |
| **Audit Trail** | 14-row table with reasoning, confidence, and source at every step |
| **Payout Estimation** | Damage-based calculation with deductible |
| **Recommendations** | Actionable next steps for claims officers |
| **Config-Driven** | All rules in JSON — change behavior without changing code |
| **Data Persistence** | Results saved to disk, survive restarts |
| **Streaming** | Server-Sent Events for real-time pipeline visualization |

---

## Fraud Detection — 8 Indicators

| Indicator | Weight | Trigger |
|-----------|--------|---------|
| Past claims exceeded | 25 | > 3 lifetime claims |
| High claim for minor damage | 20 | > ₹25,000 for minor damage |
| Claim vs vehicle value | 20 | > 80% of vehicle value |
| Missing documents | 15 | Required docs not submitted |
| Multiple claims same year | 15 | 2+ claims in current year |
| Exclusion keywords | 15 | Drunk driving, racing in description |
| Late reporting | 10 | 30+ days after incident |
| Amount outside range | 10 | Doesn't match damage level |

Score ≥ 40 = High Risk | ≥ 20 = Medium | < 20 = Low

---

## Test Claims

| Claim | Scenario | Result |
|-------|----------|--------|
| C1 | Third-Party policy, own damage | Rejected — not covered |
| C2 | Comprehensive, moderate collision | Approved |
| C3 | Minor scratch, ₹75K, 5 past claims, missing docs | Pending — fraud risk 72/100 |
| C4 | Vehicle fire, total loss | Approved |
| C5 | Third-Party, hit-and-run | Rejected — not covered |
| C6 | Comprehensive, missing 2 documents | Pending — incomplete docs |
| C7 | Flood damage, Comprehensive | Approved |

---

## Project Structure

```
PS5-AuditReady-AI/
├── app.py                     Flask backend + API + SSE streaming
├── audit_decision_system.py   14-stage processing engine
├── configs/
│   └── policy_rules.json      All business rules (config-driven)
├── data/
│   └── claims.json            7 test claims
├── templates/
│   └── index.html             SaaS frontend with live pipeline
├── frontend_1/                Next.js frontend (alternate)
├── output/
│   └── results.json           Processed results (persisted)
├── DOCUMENTATION.md           Detailed project documentation
└── DOCUMENTATION.html         HTML version of documentation
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python, Flask |
| Frontend | HTML/CSS/JS, Next.js (alternate) |
| Engine | Rule-based 14-stage pipeline with weighted scoring |
| Document Processing | pypdf, python-docx, Pillow, pytesseract |
| Real-Time | Server-Sent Events (SSE) |
| Visualization | SVG bezier curves, CSS animations |
| Data | JSON (config, claims, results) |

---

## The Problem We Solve

- **72%** of insurance fraud goes undetected in manual review
- **45 min** average to process one claim manually
- **0%** of manual decisions have structured audit trails
- **₹80,000+ crore** annual fraud cost to the Indian insurance industry

Audit GenX brings this down to **< 1 second** per claim with **100% audit traceability**.

---

## Config-Driven

All business logic lives in `configs/policy_rules.json`:

- Coverage rules (Comprehensive vs Third-Party)
- Policy exclusions (drunk driving, racing, war)
- Required documents checklist
- Fraud indicator thresholds and weights
- Damage classification keywords and repair ranges
- Risk score factor weights
- Payout percentages and deductibles

Different insurance companies → different JSON config → same engine.

---

**Team Frame Flux** · AI Build Sprint · Problem Statement 5
