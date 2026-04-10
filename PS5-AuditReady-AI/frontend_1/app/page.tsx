"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { SearchIcon, LightningIcon, ChartIcon, EditIcon, DocumentIcon, LockIcon, CheckIcon, Logo } from "@/components/Icons";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [currentDepartment, setCurrentDepartment] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add section to visible set when it enters
            setVisibleSections(prev => new Set([...prev, entry.target.id]));
          } else {
            // Remove section from visible set when it leaves
            setVisibleSections(prev => {
              const newSet = new Set(prev);
              newSet.delete(entry.target.id);
              return newSet;
            });
          }
        });
      },
      { 
        threshold: 0.2, // Trigger when 20% of section is visible
        rootMargin: '-10% 0px -10% 0px' // More sensitive margins
      }
    );

    Object.values(sectionRefs.current).forEach((ref: HTMLElement | null) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    if (el) {
      sectionRefs.current[id] = el;
    }
  };

  const departments = [
    "Claims Officers",
    "Compliance Teams", 
    "Insurance Companies",
    "Fraud Investigation Units",
    "Underwriting Teams",
    "Risk Assessment Teams"
  ];

  const features = [
    {
      id: "upload",
      title: "Upload",
      headline: "Upload Claims or Documents Instantly",
      description: "Drag and drop PDF, DOCX, or image files. Our platform extracts text, auto-detects claim fields, and pre-fills the form for you.",
    },
    {
      id: "analyze", 
      title: "Analyze",
      headline: "14-Stage AI Pipeline in Under 1 Second",
      description: "Every claim passes through 14 verification stages — input validation, fraud detection, coverage check, risk scoring, and more — with full audit trail.",
    },
    {
      id: "review",
      title: "Review", 
      headline: "Complete Audit Trail at Every Stage",
      description: "See reasoning, confidence score, and data source for each of the 14 stages. Every decision is explainable, traceable, and verifiable.",
    },
    {
      id: "optimize",
      title: "Detect",
      headline: "8 Weighted Fraud Indicators",
      description: "Detect past claims abuse, high-claim-minor-damage mismatches, missing documents, late reporting, and more with weighted risk scoring.",
    },
    {
      id: "export",
      title: "Decide",
      headline: "Approve, Reject, or Flag for Review",
      description: "Get clear decisions with payout estimation, recommended next actions for claims officers, and full compliance documentation.",
    },
    {
      id: "collaborate",
      title: "Configure", 
      headline: "Config-Driven Business Rules",
      description: "All coverage rules, fraud thresholds, damage keywords, and risk weights live in a single JSON config. Change rules without changing code.",
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDepartment((prev) => (prev + 1) % departments.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header />

      {/* Hero Section - Exact Luminance Layout */}
      <section 
        id="hero"
        ref={setSectionRef('hero')}
        style={{ 
          background: "#ffffff",
          color: "#1a1a1a",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 24px 80px",
          position: "relative",
          opacity: visibleSections.has('hero') ? 1 : 0,
          transform: visibleSections.has('hero') ? 'translateY(0)' : 'translateY(50px)',
          transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
        <div style={{ 
          maxWidth: 1200, 
          margin: "0 auto", 
          textAlign: "center",
          width: "100%"
        }}>
          {/* Main Heading with Rotating Text - Exact Luminance Style */}
          <div style={{ marginBottom: 60 }}>
            <h1 style={{ 
              fontSize: "clamp(3rem, 8vw, 6rem)",
              fontWeight: 300,
              margin: 0,
              marginBottom: 20,
              lineHeight: 1.1,
              color: "#1a1a1a",
              letterSpacing: "-0.02em"
            }}>
              AI Claim Analysis for
            </h1>
            
            {/* Rotating Department Text */}
            <div style={{
              fontSize: "clamp(3rem, 8vw, 6rem)",
              fontWeight: 300,
              color: "#1a1a1a",
              height: "1.1em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 40,
              letterSpacing: "-0.02em",
              position: "relative"
            }}>
              {departments.map((dept, index) => (
                <span 
                  key={dept}
                  style={{
                    position: "absolute",
                    transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                    opacity: currentDepartment === index ? 1 : 0,
                    transform: currentDepartment === index ? "translateY(0)" : "translateY(20px)"
                  }}
                >
                  {dept}
                </span>
              ))}
            </div>
          </div>

          <p style={{ 
            fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)",
            marginBottom: 60,
            lineHeight: 1.6,
            maxWidth: 800,
            margin: "0 auto 60px",
            color: "#4a4a4a",
            fontWeight: 400
          }}>
            Audit GenX harnesses cutting-edge artificial intelligence to transform claim review from hours to seconds with 99.9% accuracy and superhuman precision.
          </p>

          {/* CTA Button */}
          <div style={{ marginBottom: 100 }}>
            <Link 
              href="/register" 
              style={{ 
                display: "inline-block",
                background: "#000000",
                color: "white", 
                padding: "18px 40px", 
                borderRadius: 4,
                textDecoration: "none",
                fontWeight: 500,
                fontSize: 16,
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                textTransform: "uppercase",
                letterSpacing: "1px",
                position: "relative",
                overflow: "hidden"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#333333";
                e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#000000";
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "translateY(-1px) scale(1.02)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
              }}
            >
              Request a Demo
            </Link>
          </div>

          {/* Trusted By Section */}
          <div>
            <p style={{ 
              fontSize: 14, 
              color: "#888888", 
              marginBottom: 30,
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontWeight: 500
            }}>
              Trusted by Claims Professionals Worldwide
            </p>
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 60,
              flexWrap: "wrap",
              opacity: 0.4
            }}>
              {["IRDAI Compliant", "Enterprise Ready", "SMB Friendly", "InsurTech", "Compliance"].map((company, i) => (
                <div key={i} style={{
                  fontSize: 18,
                  fontWeight: 400,
                  color: "#666666",
                  letterSpacing: "1px"
                }}>
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Exact Luminance Tab Layout */}
      <section 
        id="features"
        ref={setSectionRef('features')}
        style={{ 
          padding: "120px 0", 
          background: "#ffffff",
          borderTop: "1px solid #f0f0f0",
          position: "relative",
          overflow: "hidden"
        }}>
        {/* Animated Background Waves */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
          background: `
            radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.03) 0%, transparent 50%)
          `,
          transform: visibleSections.has('features') ? 'scale(1) rotate(0deg)' : 'scale(0.8) rotate(-5deg)',
          opacity: visibleSections.has('features') ? 1 : 0,
          transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.3s'
        }} />
        
        <div style={{ 
          maxWidth: 1400, 
          margin: "0 auto", 
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
          transform: visibleSections.has('features') ? 'translateX(0)' : 'translateX(-100px)',
          opacity: visibleSections.has('features') ? 1 : 0,
          transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.2s'
        }}>
          {/* Section Header */}
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <h2 style={{ 
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 300,
              marginBottom: 0,
              color: "#1a1a1a",
              letterSpacing: "-0.02em"
            }}>
              Complete Claim Analysis Workflow
            </h2>
          </div>
          
          {/* Feature Tabs - Exact Luminance Style */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 0,
            borderBottom: "1px solid #e0e0e0",
            flexWrap: "wrap"
          }}>
            {features.map((feature, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "20px 30px",
                  fontSize: 18,
                  fontWeight: 400,
                  color: activeTab === i ? "#000000" : "#888888",
                  borderBottom: activeTab === i ? "3px solid #000000" : "3px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  letterSpacing: "0.5px",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== i) {
                    e.currentTarget.style.color = "#444444";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.background = "rgba(0,0,0,0.02)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== i) {
                    e.currentTarget.style.color = "#888888";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.background = "none";
                  }
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(0.98)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = activeTab !== i ? "translateY(-2px) scale(1)" : "translateY(0) scale(1)";
                }}
              >
                {feature.title}
              </button>
            ))}
          </div>

          {/* Active Feature Content - Exact Luminance Layout */}
          <div style={{
            minHeight: 500,
            padding: "80px 0"
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 100,
              alignItems: "center"
            }}>
              {/* Video Section */}
              <div style={{
                background: "#f8f8f8",
                borderRadius: 8,
                height: 400,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden"
              }}>
                <div style={{
                  textAlign: "center",
                  color: "#666666"
                }}>
                  <div style={{ 
                    fontSize: 60, 
                    marginBottom: 20,
                    opacity: 0.3
                  }}>▶</div>
                  <div style={{ 
                    fontSize: 16, 
                    fontWeight: 400,
                    opacity: 0.6
                  }}>
                    Your browser does not support the video tag.
                  </div>
                </div>
              </div>

              {/* Feature Description */}
              <div>
                <h3 style={{
                  fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                  fontWeight: 300,
                  marginBottom: 30,
                  color: "#1a1a1a",
                  lineHeight: 1.3,
                  letterSpacing: "-0.01em"
                }}>
                  {features[activeTab].headline}
                </h3>
                <p style={{
                  fontSize: 18,
                  lineHeight: 1.7,
                  color: "#4a4a4a",
                  marginBottom: 40,
                  fontWeight: 400
                }}>
                  {features[activeTab].description}
                </p>
                <Link
                  href="#"
                  style={{
                    color: "#000000",
                    textDecoration: "underline",
                    fontWeight: 500,
                    fontSize: 16,
                    letterSpacing: "0.5px",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    display: "inline-block"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.7";
                    e.currentTarget.style.background = "rgba(0,0,0,0.05)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                >
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Statistics Section - Exact Luminance Style */}
      <section 
        id="roi"
        ref={setSectionRef('roi')}
        style={{
          background: "#f8f8f8",
          padding: "120px 0",
          position: "relative",
          overflow: "hidden"
        }}>
        {/* Floating Elements Animation */}
        <div style={{
          position: "absolute",
          top: "10%",
          right: "10%",
          width: 200,
          height: 200,
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          transform: visibleSections.has('roi') ? 'translateY(0) scale(1)' : 'translateY(100px) scale(0)',
          opacity: visibleSections.has('roi') ? 1 : 0,
          transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.5s'
        }} />
        
        <div style={{
          position: "absolute",
          bottom: "15%",
          left: "5%",
          width: 150,
          height: 150,
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          transform: visibleSections.has('roi') ? 'translateY(0) scale(1)' : 'translateY(-100px) scale(0)',
          opacity: visibleSections.has('roi') ? 1 : 0,
          transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.7s'
        }} />
        
        <div style={{ 
          maxWidth: 1200, 
          margin: "0 auto", 
          padding: "0 24px",
          position: "relative",
          zIndex: 1
        }}>
          <div style={{ 
            textAlign: "center", 
            marginBottom: 80,
            transform: visibleSections.has('roi') ? 'translateY(0)' : 'translateY(50px)',
            opacity: visibleSections.has('roi') ? 1 : 0,
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s'
          }}>
            <h2 style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 300,
              color: "#1a1a1a",
              letterSpacing: "-0.02em"
            }}>
              The ROI of AI
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 80,
            textAlign: "center"
          }}>
            {[
              { stat: "99.9%", description: "AI analysis accuracy with neural network processing" },
              { stat: "<30 sec", description: "average claim analysis time" },
              { stat: "10x", description: "faster than traditional review methods" }
            ].map((item, i) => (
              <div 
                key={i}
                style={{
                  transform: visibleSections.has('roi') ? 'translateY(0) scale(1)' : 'translateY(80px) scale(0.8)',
                  opacity: visibleSections.has('roi') ? 1 : 0,
                  transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${0.4 + i * 0.2}s`
                }}
              >
                <div style={{
                  fontSize: "clamp(4rem, 8vw, 6rem)",
                  fontWeight: 300,
                  color: "#1a1a1a",
                  marginBottom: 20,
                  lineHeight: 1,
                  letterSpacing: "-0.02em"
                }}>
                  {item.stat}
                </div>
                <p style={{
                  fontSize: 16,
                  color: "#4a4a4a",
                  lineHeight: 1.6,
                  maxWidth: 250,
                  margin: "0 auto",
                  fontWeight: 400
                }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Case Studies - Exact Luminance Grid */}
      <section 
        id="case-studies"
        ref={setSectionRef('case-studies')}
        style={{
          background: "#ffffff",
          padding: "120px 0",
          position: "relative",
          overflow: "hidden"
        }}>
        {/* Sliding Background Pattern */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(45deg, rgba(59, 130, 246, 0.02) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(59, 130, 246, 0.02) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(168, 85, 247, 0.02) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(168, 85, 247, 0.02) 75%)
          `,
          backgroundSize: "60px 60px",
          backgroundPosition: "0 0, 0 30px, 30px -30px, -30px 0px",
          transform: visibleSections.has('case-studies') ? 'translateX(0)' : 'translateX(-100%)',
          opacity: visibleSections.has('case-studies') ? 0.5 : 0,
          transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }} />
        
        <div style={{ 
          maxWidth: 1200, 
          margin: "0 auto", 
          padding: "0 24px",
          position: "relative",
          zIndex: 1
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 40
          }}>
            {[
              { company: "BigLaw Partners", title: "Watch the BigLaw Partners case study" },
              { company: "TechCorp Claims", title: "Watch the TechCorp Claims case study" },
              { company: "InsureCorp", title: "Watch the InsureCorp case study" },
              { company: "StartupClaims", title: "Watch the StartupClaims case study" }
            ].map((item, i) => (
              <div 
                key={i} 
                style={{
                  background: "#f8f8f8",
                  borderRadius: 8,
                  padding: 40,
                  textAlign: "center",
                  cursor: "pointer",
                  minHeight: 200,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  transform: visibleSections.has('case-studies') ? 'translateY(0) rotateX(0deg)' : 'translateY(50px) rotateX(15deg)',
                  opacity: visibleSections.has('case-studies') ? 1 : 0,
                  transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${0.2 + i * 0.15}s`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f0f0f0";
                  e.currentTarget.style.transform = "translateY(-12px) scale(1.03)";
                  e.currentTarget.style.boxShadow = "0 25px 50px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f8f8f8";
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px) scale(1.01)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "translateY(-12px) scale(1.03)";
                }}>
                <h3 style={{
                  fontSize: 20,
                  fontWeight: 500,
                  color: "#1a1a1a",
                  marginBottom: 15,
                  letterSpacing: "0.5px"
                }}>
                  {item.company}
                </h3>
                <p style={{
                  color: "#666666",
                  fontSize: 14,
                  fontWeight: 400,
                  textDecoration: "underline"
                }}>
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators - Exact Luminance Layout */}
      <section 
        id="trust"
        ref={setSectionRef('trust')}
        style={{
          background: "#f8f8f8",
          padding: "120px 0",
          position: "relative",
          overflow: "hidden"
        }}>
        {/* Morphing Background Shapes */}
        <div style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: 300,
          height: 300,
          background: "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.05) 0%, transparent 70%)",
          borderRadius: "50%",
          transform: visibleSections.has('trust') ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(180deg)',
          opacity: visibleSections.has('trust') ? 1 : 0,
          transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.3s'
        }} />
        
        <div style={{
          position: "absolute",
          bottom: "10%",
          right: "15%",
          width: 250,
          height: 250,
          background: "radial-gradient(ellipse at center, rgba(168, 85, 247, 0.05) 0%, transparent 70%)",
          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
          transform: visibleSections.has('trust') ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-180deg)',
          opacity: visibleSections.has('trust') ? 1 : 0,
          transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.5s'
        }} />
        
        <div style={{ 
          maxWidth: 1200, 
          margin: "0 auto", 
          padding: "0 24px",
          position: "relative",
          zIndex: 1
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 60,
            textAlign: "center"
          }}>
            {[
              { title: "Multi-Provider AI Cascade", desc: "Groq → Gemini → Cloudflare AI fallback system ensures 99.9% accuracy and reliability" },
              { title: "Advanced OCR Technology", desc: "Process scanned PDFs and documents with Tesseract OCR for complete document compatibility" },
              { title: "Bank-Level Security", desc: "SOC 2 compliance, JWT authentication, and military-grade encryption for sensitive legal documents" },
              { title: "24/7 Expert Support", desc: "Dedicated legal tech support team with round-the-clock assistance for enterprise clients" },
              { title: "API & Integrations", desc: "RESTful API and seamless integrations with existing legal workflow and document management systems" }
            ].map((item, i) => (
              <div 
                key={i}
                style={{
                  transform: visibleSections.has('trust') ? 'translateY(0) scale(1)' : 'translateY(60px) scale(0.9)',
                  opacity: visibleSections.has('trust') ? 1 : 0,
                  transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${0.1 + i * 0.1}s`
                }}
              >
                <h4 style={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: "#1a1a1a",
                  marginBottom: 20,
                  letterSpacing: "0.5px"
                }}>
                  {item.title}
                </h4>
                <p style={{
                  fontSize: 14,
                  color: "#666666",
                  lineHeight: 1.6,
                  fontWeight: 400
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section - Exact Luminance Style */}
      <section 
        id="cta"
        ref={setSectionRef('cta')}
        style={{
          background: "#ffffff",
          padding: "120px 0",
          textAlign: "center",
          borderTop: "1px solid #f0f0f0",
          position: "relative",
          overflow: "hidden"
        }}>
        {/* Particle Animation Background */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(2px 2px at 100px 50px, rgba(59, 130, 246, 0.3), transparent),
            radial-gradient(2px 2px at 200px 150px, rgba(168, 85, 247, 0.3), transparent),
            radial-gradient(1px 1px at 300px 100px, rgba(59, 130, 246, 0.4), transparent),
            radial-gradient(1px 1px at 400px 200px, rgba(168, 85, 247, 0.2), transparent),
            radial-gradient(2px 2px at 500px 75px, rgba(59, 130, 246, 0.3), transparent)
          `,
          backgroundSize: "600px 300px",
          transform: visibleSections.has('cta') ? 'translateX(0)' : 'translateX(-100%)',
          opacity: visibleSections.has('cta') ? 1 : 0,
          transition: 'all 2s linear',
          animation: visibleSections.has('cta') ? 'particleFloat 20s linear infinite' : 'none'
        }} />
        
        <div style={{ 
          maxWidth: 800, 
          margin: "0 auto", 
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
          transform: visibleSections.has('cta') ? 'translateY(0)' : 'translateY(50px)',
          opacity: visibleSections.has('cta') ? 1 : 0,
          transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.3s'
        }}>
          <h2 style={{
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: 300,
            marginBottom: 40,
            lineHeight: 1.4,
            color: "#1a1a1a",
            letterSpacing: "-0.01em"
          }}>
            Discover how Audit GenX helps 1,000+ legal professionals achieve:
          </h2>
          
          <div style={{
            fontSize: 18,
            lineHeight: 1.8,
            marginBottom: 60,
            color: "#4a4a4a",
            fontWeight: 400
          }}>
            <div>95% reduction in claim review time</div>
            <div>80% improvement in risk identification</div>
            <div>60% better claim outcomes with AI suggestions</div>
          </div>

          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 40,
            marginBottom: 60,
            flexWrap: "wrap"
          }}>
            <div style={{
              background: "#f8f8f8",
              padding: "30px 40px",
              borderRadius: 8,
              maxWidth: 300
            }}>
              <p style={{ 
                margin: 0, 
                fontSize: 16, 
                fontStyle: "italic",
                color: "#1a1a1a",
                fontWeight: 400
              }}>
                "Audit GenX transformed our legal workflow completely."
              </p>
            </div>
            <div style={{
              background: "#f8f8f8",
              padding: "30px 40px",
              borderRadius: 8,
              maxWidth: 300
            }}>
              <p style={{ 
                margin: 0, 
                fontSize: 16, 
                fontStyle: "italic",
                color: "#1a1a1a",
                fontWeight: 400
              }}>
                "The accuracy and speed are simply unmatched in the market."
              </p>
            </div>
          </div>

          <Link
            href="/register"
            style={{
              display: "inline-block",
              background: "#000000",
              color: "white",
              padding: "18px 40px",
              borderRadius: 4,
              textDecoration: "none",
              fontWeight: 500,
              fontSize: 16,
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              textTransform: "uppercase",
              letterSpacing: "1px",
              position: "relative",
              overflow: "hidden"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#333333";
              e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
              e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#000000";
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "translateY(-1px) scale(1.02)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
            }}
          >
            Request a Demo
          </Link>
        </div>
      </section>

      {/* Footer - Minimalist Luminance Style */}
      <footer style={{ 
        background: "#f8f8f8", 
        color: "#1a1a1a", 
        padding: "80px 24px 40px",
        borderTop: "1px solid #e0e0e0"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
            gap: 60,
            marginBottom: 60
          }}>
            {/* Company Info */}
            <div>
              <h3 style={{ 
                fontSize: 20, 
                fontWeight: 500, 
                margin: 0, 
                marginBottom: 20,
                color: "#1a1a1a",
                letterSpacing: "0.5px"
              }}>
                Audit GenX
              </h3>
              <p style={{ 
                color: "#666666", 
                lineHeight: 1.6,
                fontSize: 14,
                fontWeight: 400
              }}>
                Transform your claim review process with cutting-edge AI technology.
              </p>
            </div>
            
            {/* Product Links */}
            <div>
              <h4 style={{ 
                fontSize: 16, 
                fontWeight: 500, 
                marginBottom: 20,
                color: "#1a1a1a"
              }}>
                Product
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {["Features", "Pricing", "Dashboard", "API Docs"].map((item, i) => (
                  <li key={i} style={{ marginBottom: 10 }}>
                    <a href="#" style={{ 
                      color: "#666666", 
                      textDecoration: "none",
                      fontSize: 14,
                      fontWeight: 400,
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      display: "inline-block"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#1a1a1a";
                      e.currentTarget.style.background = "rgba(0,0,0,0.05)";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#666666";
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Company Links */}
            <div>
              <h4 style={{ 
                fontSize: 16, 
                fontWeight: 500, 
                marginBottom: 20,
                color: "#1a1a1a"
              }}>
                Company
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {["About", "Blog", "Careers", "Contact"].map((item, i) => (
                  <li key={i} style={{ marginBottom: 10 }}>
                    <a href="#" style={{ 
                      color: "#666666", 
                      textDecoration: "none",
                      fontSize: 14,
                      fontWeight: 400,
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      display: "inline-block"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#1a1a1a";
                      e.currentTarget.style.background = "rgba(0,0,0,0.05)";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#666666";
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Claims Links */}
            <div>
              <h4 style={{ 
                fontSize: 16, 
                fontWeight: 500, 
                marginBottom: 20,
                color: "#1a1a1a"
              }}>
                Claims
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {["Privacy Policy", "Terms of Service", "Security", "Compliance"].map((item, i) => (
                  <li key={i} style={{ marginBottom: 10 }}>
                    <a href="#" style={{ 
                      color: "#666666", 
                      textDecoration: "none",
                      fontSize: 14,
                      fontWeight: 400,
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      display: "inline-block"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#1a1a1a";
                      e.currentTarget.style.background = "rgba(0,0,0,0.05)";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#666666";
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Footer Bottom */}
          <div style={{ 
            borderTop: "1px solid #e0e0e0", 
            paddingTop: 40, 
            textAlign: "center"
          }}>
            <p style={{ 
              margin: 0, 
              color: "#888888",
              fontSize: 12,
              fontWeight: 400
            }}>
              © 2026 Audit GenX. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Add Advanced CSS Animations */}
      <style jsx>{`
        @keyframes particleFloat {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes morphShape {
          0%, 100% { 
            border-radius: 50%;
            transform: rotate(0deg) scale(1);
          }
          25% { 
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
            transform: rotate(90deg) scale(1.1);
          }
          50% { 
            border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%;
            transform: rotate(180deg) scale(0.9);
          }
          75% { 
            border-radius: 30% 70% 30% 70% / 70% 30% 70% 30%;
            transform: rotate(270deg) scale(1.05);
          }
        }
        
        @keyframes slideInFromLeft {
          0% {
            transform: translateX(-100%) rotateY(-90deg);
            opacity: 0;
          }
          100% {
            transform: translateX(0) rotateY(0deg);
            opacity: 1;
          }
        }
        
        @keyframes slideInFromRight {
          0% {
            transform: translateX(100%) rotateY(90deg);
            opacity: 0;
          }
          100% {
            transform: translateX(0) rotateY(0deg);
            opacity: 1;
          }
        }
        
        @keyframes fadeInUp {
          0% {
            transform: translateY(60px) scale(0.9);
            opacity: 0;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          0% {
            transform: scale(0) rotate(180deg);
            opacity: 0;
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-20px) rotate(180deg); 
          }
        }
        
        @keyframes sparkle {
          0% { 
            transform: translateX(0) scale(0);
            opacity: 0;
          }
          10% {
            transform: translateX(10%) scale(1);
            opacity: 1;
          }
          90% {
            transform: translateX(90%) scale(1);
            opacity: 1;
          }
          100% { 
            transform: translateX(100%) scale(0);
            opacity: 0;
          }
        }
        
        @keyframes glow {
          0% { 
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% { 
            box-shadow: 0 0 40px rgba(168, 85, 247, 0.5), 0 0 60px rgba(59, 130, 246, 0.3);
          }
          100% { 
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1); 
          }
          50% { 
            opacity: 0.7; 
            transform: scale(1.05); 
          }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { 
            transform: translateX(-50%) translateY(0); 
          }
          40% { 
            transform: translateX(-50%) translateY(-10px); 
          }
          60% { 
            transform: translateX(-50%) translateY(-5px); 
          }
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          section > div {
            padding: 0 20px !important;
          }
          
          .grid-responsive {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
        
        /* Smooth section transitions with enhanced easing */
        section {
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Enhanced tab animations */
        button {
          position: relative;
          overflow: hidden;
        }
        
        button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
          transition: left 0.5s ease;
        }
        
        button:hover::before {
          left: 100%;
        }
        
        button::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 100%;
          height: 3px;
          background: transparent;
          transition: background 0.3s ease;
        }
        
        /* Advanced hover effects */
        .hover-lift {
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-8px) scale(1.02);
        }
        
        /* Intersection Observer triggered animations */
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-on-scroll.visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Staggered animation delays */
        .stagger-1 { transition-delay: 0.1s; }
        .stagger-2 { transition-delay: 0.2s; }
        .stagger-3 { transition-delay: 0.3s; }
        .stagger-4 { transition-delay: 0.4s; }
        .stagger-5 { transition-delay: 0.5s; }
      `}</style>
    </>
  );
}