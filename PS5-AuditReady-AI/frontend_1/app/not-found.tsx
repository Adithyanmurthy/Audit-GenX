"use client";

import Link from "next/link";
import { Logo, ArrowLeftIcon } from "@/components/Icons";

export default function NotFound() {
  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20
    }}>
      {/* Animated Background */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(255, 119, 198, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(120, 219, 255, 0.1) 0%, transparent 50%)
        `,
        animation: "float 20s ease-in-out infinite"
      }} />

      {/* Floating 404 Numbers */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "10%",
        fontSize: 120,
        fontWeight: 900,
        color: "rgba(102, 126, 234, 0.1)",
        animation: "float 15s ease-in-out infinite",
        userSelect: "none"
      }}>4</div>
      
      <div style={{
        position: "absolute",
        top: "60%",
        right: "15%",
        fontSize: 150,
        fontWeight: 900,
        color: "rgba(240, 147, 251, 0.1)",
        animation: "float 12s ease-in-out infinite reverse",
        userSelect: "none"
      }}>0</div>
      
      <div style={{
        position: "absolute",
        bottom: "30%",
        left: "20%",
        fontSize: 100,
        fontWeight: 900,
        color: "rgba(67, 233, 123, 0.1)",
        animation: "float 18s ease-in-out infinite",
        userSelect: "none"
      }}>4</div>

      {/* Main Content */}
      <div style={{ 
        textAlign: "center",
        position: "relative",
        zIndex: 2,
        maxWidth: 600
      }}>
        {/* Logo */}
        <Link href="/" style={{ 
          display: "inline-flex", 
          alignItems: "center", 
          gap: 16, 
          fontSize: 32, 
          fontWeight: 800, 
          color: "white",
          textDecoration: "none",
          marginBottom: 48
        }}>
          <div style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: 16,
            borderRadius: 20,
            boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)"
          }}>
            <Logo size={40} />
          </div>
          <span style={{
            background: "linear-gradient(135deg, #fff 0%, #a8edea 50%, #fed6e3 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>Audit GenX</span>
        </Link>

        {/* 404 Display */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ 
            fontSize: "clamp(4rem, 12vw, 8rem)",
            fontWeight: 900,
            margin: 0,
            marginBottom: 16,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "0 0 40px rgba(102, 126, 234, 0.3)",
            animation: "glow 3s ease-in-out infinite alternate"
          }}>
            404
          </h1>
          
          <div style={{
            width: 120,
            height: 4,
            background: "linear-gradient(90deg, #667eea, #764ba2, #f093fb)",
            margin: "0 auto 32px",
            borderRadius: 2,
            animation: "pulse 2s ease-in-out infinite"
          }} />
        </div>

        {/* Error Message */}
        <h2 style={{ 
          fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
          fontWeight: 700,
          marginBottom: 16,
          color: "white",
          textShadow: "0 0 20px rgba(255,255,255,0.2)"
        }}>
          Page Not Found
        </h2>
        
        <p style={{ 
          fontSize: 18,
          marginBottom: 48,
          color: "rgba(255,255,255,0.7)",
          lineHeight: 1.6,
          maxWidth: 500,
          margin: "0 auto 48px"
        }}>
          The page you're looking for seems to have vanished into the digital void. 
          But don't worry, our AI can help you find your way back!
        </p>

        {/* Action Buttons */}
        <div style={{ 
          display: "flex", 
          gap: 24, 
          justifyContent: "center", 
          flexWrap: "wrap",
          marginBottom: 40
        }}>
          <Link 
            href="/" 
            style={{ 
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white", 
              padding: "16px 32px", 
              borderRadius: 16,
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 16,
              boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
              transition: "all 0.3s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: 12
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px) scale(1.05)";
              e.currentTarget.style.boxShadow = "0 12px 35px rgba(102, 126, 234, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.3)";
            }}
          >
            <ArrowLeftIcon size={20} />
            Back to Home
          </Link>
          
          <Link 
            href="/dashboard" 
            style={{ 
              background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white", 
              padding: "16px 32px", 
              borderRadius: 16,
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 16,
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}
          >
            🚀 Try Dashboard
          </Link>
        </div>

        {/* Fun Fact */}
        <div style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 16,
          padding: 24,
          maxWidth: 400,
          margin: "0 auto"
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🤖</div>
          <p style={{ 
            color: "rgba(255,255,255,0.8)", 
            fontSize: 14,
            margin: 0,
            fontStyle: "italic"
          }}>
            "Even our 404 page is powered by AI... just kidding! But our claim processing definitely is."
          </p>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes glow {
          0% { text-shadow: 0 0 40px rgba(102, 126, 234, 0.3); }
          100% { text-shadow: 0 0 60px rgba(102, 126, 234, 0.5), 0 0 80px rgba(240, 147, 251, 0.3); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}