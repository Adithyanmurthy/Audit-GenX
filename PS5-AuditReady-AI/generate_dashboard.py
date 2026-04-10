"""
Generate HTML dashboard from processed results (v2.0 — 14-stage pipeline).
"""

import json, os, sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, "output")


def generate_dashboard(results):
    approved = sum(1 for r in results if r["Status"] == "Approved")
    rejected = sum(1 for r in results if r["Status"] == "Rejected")
    pending = sum(1 for r in results if r["Status"] == "Pending")

    stages = [
        "1.Input Validation", "2.Document Verification", "3.Claim Analysis",
        "4.Damage Assessment", "5.Coverage Validation", "6.Policy Limit",
        "7.History Check", "8.Fraud Detection", "9.Consistency Check",
        "10.Risk Scoring", "11.Decision", "12.Payout Estimation",
        "13.Recommendations", "14.Audit Verification"
    ]
    pipeline_html = ""
    for i, s in enumerate(stages):
        color = "#fef3c7;color:#92400e" if "14" in s else "#dbeafe;color:#1d4ed8"
        pipeline_html += f'<span style="background:{color};padding:5px 10px;border-radius:6px;font-size:0.8em;font-weight:600">{s}</span>'
        if i < len(stages) - 1:
            pipeline_html += '<span style="color:#cbd5e1">→</span>'

    claim_cards = ""
    for r in results:
        sc = {"Approved": "#22c55e", "Rejected": "#ef4444", "Pending": "#f59e0b"}[r["Status"]]
        sb = {"Approved": "#f0fdf4", "Rejected": "#fef2f2", "Pending": "#fffbeb"}[r["Status"]]
        si = {"Approved": "✅", "Rejected": "❌", "Pending": "⚠️"}[r["Status"]]

        audit_rows = ""
        for step in r["Audit Log"]:
            conf = step["confidence"]
            cc = "#22c55e" if conf >= 0.80 else ("#f59e0b" if conf >= 0.60 else "#ef4444")
            cl = "HIGH" if conf >= 0.80 else ("MED" if conf >= 0.60 else "LOW")
            name = step["step"].replace("_", " ").title()
            reason = step["reason"][:120] + ("..." if len(step["reason"]) > 120 else "")
            audit_rows += f"""<tr>
              <td style="font-weight:600;white-space:nowrap;vertical-align:top;font-size:0.85em">{name}</td>
              <td style="vertical-align:top;font-size:0.85em">{reason}</td>
              <td style="text-align:center;vertical-align:top"><span style="background:{cc};color:#fff;padding:2px 7px;border-radius:10px;font-size:0.75em">{conf} ({cl})</span></td>
              <td style="font-size:0.8em;color:#666;vertical-align:top">{step['source'][:60]}</td></tr>"""

        recs_html = ""
        for rec in r.get("Recommendations", []):
            recs_html += f"<li style='font-size:0.85em;margin:2px 0'>{rec}</li>"

        claim_cards += f"""
        <div style="background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);margin-bottom:24px;overflow:hidden;border-left:5px solid {sc}">
          <div style="padding:16px 20px;display:flex;justify-content:space-between;align-items:center;background:{sb};flex-wrap:wrap;gap:8px">
            <div>
              <h3 style="margin:0;font-size:1.2em">{si} Claim {r['Claim ID']}</h3>
              <p style="margin:4px 0 0;color:#555;font-size:0.9em">{r['Policy Type']} | {r['Claim Amount']} | Damage: {r['Damage Level']} | Risk: {r['Risk Score']}/100 | Fraud: {r['Fraud Risk']}</p>
            </div>
            <div style="text-align:right">
              <span style="background:{sc};color:#fff;padding:5px 14px;border-radius:20px;font-weight:700">{r['Status']}</span>
              <p style="margin:4px 0 0;font-size:0.85em;color:#555">Confidence: {r['Confidence Score']} | Payout: {r['Estimated Payout']}</p>
            </div>
          </div>
          <div style="padding:12px 20px;border-bottom:1px solid #f1f5f9">
            <strong>Decision:</strong> {r['Reason']}
          </div>
          <div style="padding:8px 20px 16px">
            <h4 style="margin:8px 0 6px;color:#333;font-size:0.95em">📋 Audit Trail ({len(r['Audit Log'])} stages)</h4>
            <div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:0.9em">
              <thead><tr style="background:#f8fafc;border-bottom:2px solid #e2e8f0">
                <th style="padding:6px;text-align:left;width:14%">Stage</th>
                <th style="padding:6px;text-align:left;width:42%">Reasoning</th>
                <th style="padding:6px;text-align:center;width:12%">Confidence</th>
                <th style="padding:6px;text-align:left;width:32%">Source</th>
              </tr></thead>
              <tbody>{audit_rows}</tbody>
            </table></div>
          </div>
          {"<div style='padding:0 20px 16px'><h4 style='margin:0 0 4px;font-size:0.95em'>📌 Recommendations</h4><ul style='margin:0;padding-left:20px'>" + recs_html + "</ul></div>" if recs_html else ""}
        </div>"""

    html = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Audit-Ready AI v2.0 — 14-Stage Dashboard</title>
<style>*{{box-sizing:border-box}}body{{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f1f5f9;margin:0;padding:20px;color:#1e293b}}table td,table th{{padding:6px 8px;border-bottom:1px solid #e2e8f0}}table tr:last-child td{{border-bottom:none}}</style>
</head><body>
<div style="max-width:1200px;margin:0 auto">
  <div style="text-align:center;margin-bottom:28px">
    <h1 style="margin:0;font-size:1.8em">🛡️ Audit-Ready AI Decision System v2.0</h1>
    <p style="color:#64748b;margin:6px 0 0">AI Build Sprint — Problem Statement 5 | 14-Stage Explainable Pipeline</p>
    <p style="color:#94a3b8;margin:2px 0 0;font-size:0.9em">By Adithya N Murthy</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px">
    <div style="background:#fff;border-radius:10px;padding:16px;text-align:center;box-shadow:0 1px 4px rgba(0,0,0,0.06)">
      <div style="font-size:1.8em;font-weight:700;color:#3b82f6">{len(results)}</div><div style="color:#64748b;font-size:0.9em">Total Claims</div></div>
    <div style="background:#fff;border-radius:10px;padding:16px;text-align:center;box-shadow:0 1px 4px rgba(0,0,0,0.06)">
      <div style="font-size:1.8em;font-weight:700;color:#22c55e">{approved}</div><div style="color:#64748b;font-size:0.9em">Approved</div></div>
    <div style="background:#fff;border-radius:10px;padding:16px;text-align:center;box-shadow:0 1px 4px rgba(0,0,0,0.06)">
      <div style="font-size:1.8em;font-weight:700;color:#ef4444">{rejected}</div><div style="color:#64748b;font-size:0.9em">Rejected</div></div>
    <div style="background:#fff;border-radius:10px;padding:16px;text-align:center;box-shadow:0 1px 4px rgba(0,0,0,0.06)">
      <div style="font-size:1.8em;font-weight:700;color:#f59e0b">{pending}</div><div style="color:#64748b;font-size:0.9em">Pending</div></div>
  </div>
  <div style="background:#fff;border-radius:10px;padding:16px;margin-bottom:24px;box-shadow:0 1px 4px rgba(0,0,0,0.06)">
    <h3 style="margin:0 0 10px;font-size:1em">🔄 14-Stage Processing Pipeline</h3>
    <div style="display:flex;align-items:center;justify-content:center;gap:4px;flex-wrap:wrap">{pipeline_html}</div>
  </div>
  {claim_cards}
  <div style="text-align:center;padding:16px;color:#94a3b8;font-size:0.85em">Audit-Ready AI v2.0 | 14 stages | Every decision is explainable, traceable, and verifiable.</div>
</div></body></html>"""

    path = os.path.join(OUTPUT_DIR, "dashboard.html")
    with open(path, "w") as f:
        f.write(html)
    print(f"  🌐 Dashboard saved to: output/dashboard.html")


if __name__ == "__main__":
    p = os.path.join(OUTPUT_DIR, "results.json")
    if not os.path.exists(p):
        print("Run audit_decision_system.py first.")
        sys.exit(1)
    with open(p) as f:
        results = json.load(f)
    generate_dashboard(results)
