"use client";

import Link from "next/link";
import { Logo } from "./Icons";

export default function Header() {
  return (
    <header style={{
      background: "#ffffff", borderBottom: "1px solid #f0f0f0",
      position: "sticky", top: 0, zIndex: 50,
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
    }}>
      <nav style={{
        maxWidth: 1400, margin: "0 auto", padding: "14px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <Link href="/" style={{
          display: "flex", alignItems: "center", gap: 12,
          fontSize: 20, fontWeight: 500, color: "#1a1a1a",
          textDecoration: "none", letterSpacing: "0.5px", transition: "opacity 0.2s"
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.7"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}>
          <div style={{ background: "#000000", padding: 6, borderRadius: 6, color: "white", display: "flex" }}>
            <Logo size={20} />
          </div>
          Audit GenX
        </Link>

        <div style={{ display: "flex", gap: 32, alignItems: "center", fontSize: 15 }}>
          {[
            { href: "/#features", label: "Features" },
            { href: "/pricing", label: "Pricing" },
            { href: "/#trust", label: "Security" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} style={{ color: "#666666", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#1a1a1a"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#666666"; }}>
              {label}
            </Link>
          ))}
          <Link href="/dashboard" style={{
            background: "#000000", color: "white", padding: "10px 20px",
            borderRadius: 6, textDecoration: "none", fontWeight: 500, fontSize: 14,
            textTransform: "uppercase", letterSpacing: "1px", transition: "all 0.2s"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#333333"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#000000"; }}>
            Dashboard
          </Link>
        </div>
      </nav>
    </header>
  );
}
