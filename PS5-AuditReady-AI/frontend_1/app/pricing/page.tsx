"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { CheckIcon } from "@/components/Icons";

const PLANS = [
  {
    id: "free", name: "Free", price: "Free", period: "",
    description: "Try it out, no setup needed",
    limit: "Unlimited claims",
    features: ["14-stage AI pipeline", "PDF & DOCX upload", "Fraud detection (8 indicators)", "Risk scoring", "Full audit trail", "Payout estimation"],
    cta: "Get Started", highlight: false,
  },
  {
    id: "starter", name: "Starter", price: "2,400", period: "/month",
    description: "For individual claims officers",
    limit: "100 claims / month",
    features: ["Everything in Free", "Document OCR extraction", "Auto-field detection", "Priority processing", "Email support"],
    cta: "Get Started", highlight: false,
  },
  {
    id: "pro", name: "Pro", price: "6,500", period: "/month",
    description: "For claims teams",
    limit: "500 claims / month",
    features: ["Everything in Starter", "Custom policy rules", "Bulk processing", "API access", "Team collaboration", "Priority support"],
    cta: "Get Pro", highlight: true,
  },
  {
    id: "team", name: "Team", price: "20,000", period: "/month",
    description: "For insurance companies",
    limit: "Unlimited claims",
    features: ["Everything in Pro", "White-label reports", "Custom fraud indicators", "Dedicated account manager", "SLA guarantee", "On-premise deployment"],
    cta: "Contact Sales", highlight: false,
  },
];

export default function Pricing() {
  return (
    <>
      <Header />
      <main style={{ background: "#fafafa", minHeight: "calc(100vh - 57px)" }}>
        <div style={{ borderBottom: "1px solid #f0f0f0", background: "#fff", padding: "64px 24px 56px", textAlign: "center" }}>
          <p style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, marginBottom: 12 }}>Pricing</p>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, color: "#1a1a1a", letterSpacing: "-0.02em", margin: 0 }}>
            Simple, transparent pricing
          </h1>
          <p style={{ color: "#888", fontSize: 16, marginTop: 12, maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
            Start free. Scale as your claims volume grows.
          </p>
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {PLANS.map(plan => (
              <div key={plan.id} style={{
                background: "#fff", border: plan.highlight ? "2px solid #000" : "1px solid #e8e8e8",
                borderRadius: 8, padding: "32px 24px", position: "relative",
                boxShadow: plan.highlight ? "0 8px 30px rgba(0,0,0,0.08)" : "none"
              }}>
                {plan.highlight && (
                  <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                    background: "#000", color: "#fff", padding: "4px 16px", borderRadius: 12, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                    Popular
                  </div>
                )}
                <p style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, margin: 0 }}>{plan.name}</p>
                <div style={{ marginTop: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 36, fontWeight: 300, color: "#1a1a1a" }}>{plan.price === "Free" ? "Free" : `₹${plan.price}`}</span>
                  {plan.period && <span style={{ fontSize: 14, color: "#888" }}>{plan.period}</span>}
                </div>
                <p style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>{plan.description}</p>
                <p style={{ fontSize: 12, color: "#aaa", marginBottom: 24 }}>{plan.limit}</p>
                <Link href="/dashboard" style={{
                  display: "block", textAlign: "center", padding: "12px 20px", borderRadius: 6, textDecoration: "none", fontWeight: 600, fontSize: 14,
                  background: plan.highlight ? "#000" : "#f8f8f8", color: plan.highlight ? "#fff" : "#1a1a1a",
                  border: plan.highlight ? "none" : "1px solid #e0e0e0", transition: "all 0.2s"
                }}>
                  {plan.cta}
                </Link>
                <div style={{ marginTop: 24, borderTop: "1px solid #f0f0f0", paddingTop: 20 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10, fontSize: 13, color: "#555" }}>
                      <span style={{ color: "#059669", flexShrink: 0, marginTop: 1 }}><CheckIcon size={14} /></span>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
