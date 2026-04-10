"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { listClaims, processClaim, getSampleClaims, clearClaims, uploadDocument } from "@/lib/api";
import { Logo, UploadIcon, LightningIcon, SpinnerIcon, DocumentIcon, ShieldIcon, CheckIcon } from "@/components/Icons";

const DOCS = ["FIR / Police Report","Driving License","Vehicle Registration (RC)","Insurance Policy Copy","Claim Form (signed)","Repair Estimate / Bill"];

type Claim = {
  "Claim ID": string; Status: string; Reason: string; "Confidence Score": number;
  "Damage Level": string; "Policy Type": string; "Claim Amount": string;
  "Estimated Payout": string; "Risk Score": number; "Fraud Risk": string;
  "Processed At": string; "Audit Log": any[];
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function Dashboard() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    claim_id: "", description: "", policy_type: "Comprehensive", claim_amount: "",
    vehicle_value: "", past_claims: "0", claims_this_year: "0",
    policy_start_date: "2025-06-01", incident_date: new Date().toISOString().split("T")[0],
    reporting_date: new Date().toISOString().split("T")[0],
  });
  const [checkedDocs, setCheckedDocs] = useState<string[]>([...DOCS]);
  const router = useRouter();

  const loadClaims = useCallback(async () => {
    try { setClaims(await listClaims()); } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { loadClaims(); }, [loadClaims]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true); setError(""); setProgress("Processing through 14 stages...");
    try {
      const data = {
        ...form,
        claim_amount: parseFloat(form.claim_amount),
        vehicle_value: parseFloat(form.vehicle_value),
        past_claims: parseInt(form.past_claims),
        claims_this_year: parseInt(form.claims_this_year),
        documents_submitted: checkedDocs,
      };
      const result = await processClaim(data);
      router.push(`/dashboard/${result["Claim ID"]}`);
    } catch (e: any) { setError(e.message); setProcessing(false); }
  };

  const handleFile = async (file: File) => {
    setProcessing(true); setProgress("Extracting text from document...");
    try {
      const data = await uploadDocument(file);
      const pf = data.parsed_fields || {};
      setForm(prev => ({
        ...prev,
        ...(pf.claim_id ? { claim_id: pf.claim_id } : {}),
        ...(pf.description ? { description: pf.description } : {}),
        ...(pf.policy_type ? { policy_type: pf.policy_type } : {}),
        ...(pf.claim_amount ? { claim_amount: String(pf.claim_amount) } : {}),
        ...(pf.vehicle_value ? { vehicle_value: String(pf.vehicle_value) } : {}),
        ...(pf.past_claims ? { past_claims: String(pf.past_claims) } : {}),
      }));
      setShowForm(true);
      setProgress("");
    } catch (e: any) { setError(e.message); }
    setProcessing(false);
  };

  const runSamples = async () => {
    setProcessing(true); setProgress("Processing 7 test claims...");
    try {
      await clearClaims();
      const samples = await getSampleClaims();
      for (const c of samples) {
        await processClaim({ ...c, documents_submitted: c.documents_submitted || [] });
      }
      await loadClaims();
      setShowForm(false);
    } catch (e: any) { setError(e.message); }
    setProcessing(false); setProgress("");
  };

  const onDrop = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); };

  const approved = claims.filter(c => c.Status === "Approved").length;
  const rejected = claims.filter(c => c.Status === "Rejected").length;
  const pending = claims.filter(c => c.Status === "Pending").length;

  return (
    <>
      <header style={{ background: "#ffffff", borderBottom: "1px solid #f0f0f0", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <nav style={{ maxWidth: 1400, margin: "0 auto", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 20, fontWeight: 500, color: "#1a1a1a", textDecoration: "none" }}>
            <div style={{ background: "#000000", padding: 6, borderRadius: 6, color: "white", display: "flex" }}><Logo size={20} /></div>
            Audit GenX
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={runSamples} disabled={processing} style={{ background: "#f8f8f8", border: "1px solid #e0e0e0", color: "#666", padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
              Run 7 Test Claims
            </button>
            <button onClick={() => setShowForm(!showForm)} style={{ background: "#000", color: "#fff", padding: "8px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              + New Claim
            </button>
          </div>
        </nav>
      </header>

      <main style={{ background: "#fafafa", minHeight: "calc(100vh - 57px)" }}>
        <div style={{ borderBottom: "1px solid #f0f0f0", background: "#ffffff", padding: "48px 24px 40px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <p style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, marginBottom: 12 }}>Dashboard</p>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 300, color: "#1a1a1a", letterSpacing: "-0.02em", margin: 0 }}>
              Claim Processing
            </h1>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
          {/* Stats */}
          {claims.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 32 }}>
              {[
                { label: "Total", value: claims.length, color: "#1a1a1a" },
                { label: "Approved", value: approved, color: "#059669" },
                { label: "Rejected", value: rejected, color: "#dc2626" },
                { label: "Pending", value: pending, color: "#d97706" },
                { label: "Audit", value: "Pass", color: "#059669" },
              ].map(s => (
                <div key={s.label} style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8, padding: "20px 24px" }}>
                  <p style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 600, margin: 0 }}>{s.label}</p>
                  <p style={{ fontSize: 28, fontWeight: 300, color: s.color, margin: "4px 0 0" }}>{s.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Upload / Form */}
          {showForm ? (
            <section style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8, marginBottom: 32 }}>
              <div style={{ padding: "20px 28px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, margin: 0 }}>Submit Claim</p>
                <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 18 }}>x</button>
              </div>
              <div style={{ padding: 28 }}>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                    {[
                      { id: "claim_id", label: "Claim ID", placeholder: "C8" },
                      { id: "policy_type", label: "Policy Type", type: "select" },
                      { id: "claim_amount", label: "Claim Amount", placeholder: "35000", type: "number" },
                      { id: "vehicle_value", label: "Vehicle Value", placeholder: "800000", type: "number" },
                      { id: "past_claims", label: "Past Claims", type: "number" },
                      { id: "claims_this_year", label: "Claims This Year", type: "number" },
                      { id: "policy_start_date", label: "Policy Start", type: "date" },
                      { id: "incident_date", label: "Incident Date", type: "date" },
                      { id: "reporting_date", label: "Reporting Date", type: "date" },
                    ].map(f => (
                      <div key={f.id}>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>{f.label}</label>
                        {f.type === "select" ? (
                          <select value={form[f.id as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))}
                            style={{ width: "100%", padding: "10px 12px", border: "1px solid #e8e8e8", borderRadius: 6, fontSize: 14, background: "#fff" }}>
                            <option value="Comprehensive">Comprehensive</option>
                            <option value="Third-Party">Third-Party</option>
                          </select>
                        ) : (
                          <input type={f.type || "text"} value={form[f.id as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))}
                            placeholder={f.placeholder} required={f.id === "claim_id" || f.id === "claim_amount"}
                            style={{ width: "100%", padding: "10px 12px", border: "1px solid #e8e8e8", borderRadius: 6, fontSize: 14, boxSizing: "border-box" }} />
                        )}
                      </div>
                    ))}
                  </div>
                  <div style={{ gridColumn: "1 / -1", marginTop: 16 }}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Description</label>
                    <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required
                      placeholder="Describe what happened to the vehicle..."
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #e8e8e8", borderRadius: 6, fontSize: 14, minHeight: 60, resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Documents</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                      {DOCS.map(d => (
                        <label key={d} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, padding: "6px 8px", borderRadius: 4, border: "1px solid #f0f0f0", cursor: "pointer" }}>
                          <input type="checkbox" checked={checkedDocs.includes(d)}
                            onChange={e => setCheckedDocs(prev => e.target.checked ? [...prev, d] : prev.filter(x => x !== d))}
                            style={{ accentColor: "#000" }} />
                          {d}
                        </label>
                      ))}
                    </div>
                  </div>
                  {error && <p style={{ color: "#dc2626", fontSize: 13, marginTop: 12 }}>{error}</p>}
                  <button type="submit" disabled={processing}
                    style={{ marginTop: 20, background: "#000", color: "#fff", padding: "12px 24px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                    {processing ? progress : "Process Through 14 Stages"}
                  </button>
                </form>
              </div>
            </section>
          ) : (
            <section style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8, marginBottom: 32 }}>
              <div style={{ padding: "20px 28px", borderBottom: "1px solid #f0f0f0" }}>
                <p style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, margin: 0 }}>Upload Document</p>
              </div>
              <div style={{ padding: 28 }}>
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  onClick={() => { const i = document.createElement("input"); i.type = "file"; i.accept = ".pdf,.docx,.txt,.jpg,.png,.csv"; i.onchange = () => { if (i.files?.[0]) handleFile(i.files[0]); }; i.click(); }}
                  style={{
                    border: `2px dashed ${dragOver ? "#000" : "#e0e0e0"}`, borderRadius: 12, padding: "48px 24px",
                    textAlign: "center", cursor: "pointer", transition: "all 0.2s", background: dragOver ? "#fafafa" : "#fff"
                  }}>
                  {processing ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                      <SpinnerIcon size={24} />
                      <p style={{ fontSize: 14, color: "#666" }}>{progress}</p>
                    </div>
                  ) : (
                    <>
                      <div style={{ color: "#ccc", marginBottom: 12 }}><UploadIcon size={32} /></div>
                      <p style={{ fontSize: 15, fontWeight: 500, color: "#1a1a1a", marginBottom: 4 }}>Drop a claim document here</p>
                      <p style={{ fontSize: 13, color: "#888" }}>PDF, DOCX, TXT, JPG, PNG, CSV</p>
                    </>
                  )}
                </div>
                <p style={{ fontSize: 12, color: "#aaa", marginTop: 12, textAlign: "center" }}>
                  Or <button onClick={() => setShowForm(true)} style={{ background: "none", border: "none", color: "#000", cursor: "pointer", fontWeight: 600, textDecoration: "underline", fontSize: 12 }}>fill in the form manually</button>
                </p>
              </div>
            </section>
          )}

          {/* Claims List */}
          <section style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: 8 }}>
            <div style={{ padding: "20px 28px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, margin: 0 }}>
                Processed Claims {claims.length > 0 && `(${claims.length})`}
              </p>
              {claims.length > 0 && (
                <button onClick={async () => { await clearClaims(); setClaims([]); }}
                  style={{ background: "none", border: "1px solid #ffd0d0", color: "#cc0000", padding: "4px 12px", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>
                  Clear All
                </button>
              )}
            </div>
            {loading ? (
              <div style={{ padding: 48, textAlign: "center" }}><SpinnerIcon size={24} /></div>
            ) : claims.length === 0 ? (
              <div style={{ padding: "48px 24px", textAlign: "center", color: "#aaa" }}>
                <p style={{ fontSize: 14 }}>No claims processed yet. Upload a document or submit a claim to get started.</p>
              </div>
            ) : (
              claims.map(c => {
                const s = c.Status.toLowerCase();
                const color = s === "approved" ? "#059669" : s === "rejected" ? "#dc2626" : "#d97706";
                const bg = s === "approved" ? "#ecfdf5" : s === "rejected" ? "#fef2f2" : "#fffbeb";
                return (
                  <Link key={c["Claim ID"] + c["Processed At"]} href={`/dashboard/${c["Claim ID"]}`}
                    style={{ display: "flex", alignItems: "center", padding: "16px 28px", borderBottom: "1px solid #f8f8f8", textDecoration: "none", color: "inherit", transition: "background 0.1s", gap: 16 }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#fafafa"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = ""; }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                    <div style={{ width: 60, fontWeight: 600, fontSize: 14 }}>{c["Claim ID"]}</div>
                    <div style={{ flex: 1, fontSize: 13, color: "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.Reason}</div>
                    <div style={{ fontSize: 13, color: "#888", width: 80, textAlign: "right" }}>{c["Claim Amount"]}</div>
                    <div style={{ fontSize: 13, color: "#888", width: 60, textAlign: "right" }}>Risk {c["Risk Score"]}</div>
                    <span style={{ padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 700, background: bg, color }}>{c.Status}</span>
                    <div style={{ fontSize: 12, color: "#bbb", width: 60, textAlign: "right" }}>{timeAgo(c["Processed At"])}</div>
                  </Link>
                );
              })
            )}
          </section>
        </div>
      </main>
    </>
  );
}
