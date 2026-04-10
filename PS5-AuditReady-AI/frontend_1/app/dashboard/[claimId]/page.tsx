"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { listClaims } from "@/lib/api";
import { Logo, ArrowLeftIcon, SpinnerIcon, ShieldIcon, CheckIcon, AlertIcon } from "@/components/Icons";

type AuditStep = {
  step: string; result: any; reason: string; confidence: number; source: string;
};

type Claim = {
  "Claim ID": string; Status: string; Reason: string; "Confidence Score": number;
  "Damage Level": string; "Policy Type": string; "Claim Amount": string;
  "Estimated Payout": string; "Risk Score": number; "Fraud Risk": string;
  Recommendations: string[]; "Audit Log": AuditStep[]; "Processed At": string;
};

export default function ClaimDetail() {
  const { claimId } = useParams();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const all = await listClaims();
        const found = all.find((c: Claim) => c["Claim ID"] === claimId);
        setClaim(found || null);
      } catch {} finally { setLoading(false); }
    })();
  }, [claimId]);

  if (loading) return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <SpinnerIcon size={32} />
    </main>
  );

  if (!claim) return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <p style={{ fontSize: 16, color: "#888" }}>Claim not found</p>
      <Link href="/dashboard" style={{ color: "#000", fontWeight: 600 }}>Back to Dashboard</Link>
    </main>
  );

  const s = claim.Status.toLowerCase();
  const statusColor = s === "approved" ? "#059669" : s === "rejected" ? "#dc2626" : "#d97706";
  const statusBg = s === "approved" ? "#ecfdf5" : s === "rejected" ? "#fef2f2" : "#fffbeb";

  return (
    <>
      <header style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", position: "sticky", top: 0, zIndex: 50 }}>
        <nav style={{ maxWidth: 1400, margin: "0 auto", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 20, fontWeight: 500, color: "#1a1a1a", textDecoration: "none" }}>
            <div style={{ background: "#000", padding: 6, borderRadius: 6, color: "#fff", display: "flex" }}><Logo size={20} /></div>
            Audit GenX
          </Link>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 6, color: "#666", textDecoration: "none", fontSize: 14 }}>
            <ArrowLeftIcon size={16} /> Back to Dashboard
          </Link>
        </nav>
      </header>

      <main style={{ background: "#fafafa", minHeight: "calc(100vh - 57px)" }}>
        {/* Header */}
        <div style={{ borderBottom: "1px solid #f0f0f0", background: "#fff", padding: "48px 24px 40px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
              <div>
                <p style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, marginBottom: 12 }}>Claim Analysis</p>
                <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 300, color: "#1a1a1a", letterSpacing: "-0.02em", margin: 0 }}>
                  {claim["Claim ID"]}
                </h1>
                <p style={{ fontSize: 14, color: "#888", marginTop: 8 }}>
                  {claim["Policy Type"]} &middot; {claim["Claim Amount"]} &middot; Damage: {claim["Damage Level"]}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ display: "inline-block", padding: "8px 20px", borderRadius: 20, fontWeight: 700, fontSize: 14, color: statusColor, background: statusBg }}>
                  {claim.Status}
                </span>
                <p style={{ fontSize: 13, color: "#888", marginTop: 8 }}>
                  Confidence: {claim["Confidence Score"]} &middot; Payout: {claim["Estimated Payout"]}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
          {/* Decision */}
          <section style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8, marginBottom: 24 }}>
            <div style={{ padding: "20px 28px", borderBottom: "1px solid #f0f0f0" }}>
              <p style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, margin: 0 }}>Decision</p>
            </div>
            <div style={{ padding: 28 }}>
              <p style={{ fontSize: 15, color: "#1a1a1a", lineHeight: 1.6 }}>{claim.Reason}</p>
              <div style={{ display: "flex", gap: 24, marginTop: 20, flexWrap: "wrap" }}>
                <div style={{ padding: "12px 20px", background: "#f8f8f8", borderRadius: 6 }}>
                  <p style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Risk Score</p>
                  <p style={{ fontSize: 22, fontWeight: 300, margin: "4px 0 0", color: claim["Risk Score"] >= 50 ? "#dc2626" : claim["Risk Score"] >= 25 ? "#d97706" : "#059669" }}>
                    {claim["Risk Score"]}/100
                  </p>
                </div>
                <div style={{ padding: "12px 20px", background: "#f8f8f8", borderRadius: 6 }}>
                  <p style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Fraud Risk</p>
                  <p style={{ fontSize: 22, fontWeight: 300, margin: "4px 0 0", textTransform: "capitalize" }}>{claim["Fraud Risk"]}</p>
                </div>
                <div style={{ padding: "12px 20px", background: "#f8f8f8", borderRadius: 6 }}>
                  <p style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Payout</p>
                  <p style={{ fontSize: 22, fontWeight: 300, margin: "4px 0 0" }}>{claim["Estimated Payout"]}</p>
                </div>
              </div>
            </div>
          </section>

          {/* 14-Stage Audit Trail */}
          <section style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8, marginBottom: 24 }}>
            <div style={{ padding: "20px 28px", borderBottom: "1px solid #f0f0f0" }}>
              <p style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, margin: 0 }}>
                Audit Trail ({claim["Audit Log"].length} Stages)
              </p>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #f0f0f0" }}>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, width: 30 }}>#</th>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, width: "15%" }}>Stage</th>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600 }}>Reasoning</th>
                    <th style={{ padding: "10px 16px", textAlign: "center", fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, width: 90 }}>Confidence</th>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, width: "22%" }}>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {claim["Audit Log"].map((step, i) => {
                    const conf = step.confidence;
                    const confColor = conf >= 0.8 ? "#059669" : conf >= 0.6 ? "#d97706" : "#dc2626";
                    const confBg = conf >= 0.8 ? "#ecfdf5" : conf >= 0.6 ? "#fffbeb" : "#fef2f2";
                    const confLabel = conf >= 0.8 ? "HIGH" : conf >= 0.6 ? "MED" : "LOW";
                    const name = step.step.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
                    return (
                      <tr key={i} style={{ borderBottom: "1px solid #f8f8f8" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#fafafa"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = ""; }}>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: "#bbb", fontWeight: 700 }}>{i + 1}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>{name}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: "#555", lineHeight: 1.5 }}>{step.reason}</td>
                        <td style={{ padding: "12px 16px", textAlign: "center" }}>
                          <span style={{ padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700, color: confColor, background: confBg }}>
                            {conf} {confLabel}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: "#999" }}>{step.source}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Recommendations */}
          {claim.Recommendations && claim.Recommendations.length > 0 && (
            <section style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8 }}>
              <div style={{ padding: "20px 28px", borderBottom: "1px solid #f0f0f0" }}>
                <p style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, margin: 0 }}>Recommended Actions</p>
              </div>
              <div style={{ padding: 28 }}>
                {claim.Recommendations.map((rec, i) => (
                  <div key={i} style={{ padding: "10px 14px", borderLeft: "3px solid #000", background: "#f8f8f8", marginBottom: 6, borderRadius: "0 6px 6px 0", fontSize: 13, color: "#333" }}>
                    {rec}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
