const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5001";

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Request failed");
  }
  return res.json();
}

// ── Claims ────────────────────────────────────────────────────────────────────
export async function listClaims() {
  return request("/api/dashboard");
}

export async function processClaim(data: Record<string, unknown>) {
  return request("/api/process", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function processClaimStream(data: Record<string, unknown>) {
  return fetch(`${API_BASE}/api/process-stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function clearClaims() {
  return request("/api/clear", { method: "POST" });
}

export async function getSampleClaims() {
  return request("/api/sample-claims");
}

export async function getConfig() {
  return request("/api/config");
}

// ── Upload ────────────────────────────────────────────────────────────────────
export async function uploadDocument(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  return request("/api/upload", { method: "POST", body: fd });
}
