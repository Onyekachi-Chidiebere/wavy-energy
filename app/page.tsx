"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import logo from "./images/logo.png";
import Image from "next/image";

interface SiteContent {
  hero_title: string;
  hero_description: string;
  hero_tag?: string;
  stats_litres?: string;
  stats_states?: string;
  stats_lines?: string;
  stats_doc?: string;
  about_intro?: string;
  about_body_1?: string;
  about_body_2?: string;
  about_callout?: string;
  vision_text: string;
  mission_text: string;
  hse_intro?: string;
  hse_body?: string;
  hse_quote?: string;
  why_intro?: string;
  contact_email: string;
  contact_phone: string;
  contact_address?: string;
  footer_tagline?: string;
}

export default function Home() {
  const supabase = createClient();
  const [scrolled, setScrolled] = useState(false);
  const [openSvc, setOpenSvc] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);

  const [content, setContent] = useState<SiteContent>({
    hero_title: "Fueling Growth with Clean Energy Solutions.",
    hero_description:
      "Wavy Energy Company Limited is an integrated downstream petroleum and energy engineering company — delivering institutional-grade petroleum supply, gas plant engineering, and solar power solutions nationwide.",
    hero_tag: "Lagos, Nigeria · Downstream Energy · Clean Power",
    stats_litres: "150K",
    stats_states: "36+",
    stats_lines: "5",
    stats_doc: "100%",
    about_intro:
      "Wavy Energy Limited is an integrated downstream petroleum and energy engineering company, headquartered in Lagos, Nigeria. Prior to formal incorporation, the company's founders and technical partners had been actively engaged in petroleum distribution, fuel logistics coordination, and energy system deployment within the Nigerian market.",
    about_body_1:
      "This period of pre-incorporation activity enabled the organisation to build strong industry relationships, operational competence, and market credibility. The leadership team brings longstanding experience in downstream petroleum logistics and energy engineering, with incorporation serving to formalise existing operations under a limited liability structure to strengthen governance, regulatory compliance, risk management, and scalable growth.",
    about_body_2:
      "Since incorporation, Wavy Energy has consolidated its operational framework and expanded its service delivery capacity — building upon its prior field experience to deliver structured petroleum supply and energy system installations for commercial and institutional clients across Lagos, the South-West region, and national markets through licensed partners.",
    about_callout:
      "The company continues to leverage its pre-registration operational foundation, technical expertise, and established networks to execute projects efficiently, maintain high service standards, and position itself as a reliable participant within Nigeria's evolving energy sector.",
    vision_text:
      "To be Nigeria's most technically credible and operationally dependable energy company — a name that institutions, businesses, and households associate unconditionally with reliability, safety, and professional excellence.",
    mission_text:
      "To deliver integrated energy solutions — across petroleum product supply, gas plant engineering, and solar power installation — with a standard of technical competence, safety compliance, and client accountability that defines a new benchmark for energy service providers in Nigeria.",
    hse_intro:
      "In Nigeria's energy sector, safety and regulatory compliance are not optional — they are the baseline conditions for legitimate, sustainable operation. Wavy Energy treats its HSE obligations as a fundamental component of its operational identity, not a peripheral compliance burden.",
    hse_body:
      "All field personnel receive HSE induction before deployment and must comply with the Wavy Energy HSE Code of Conduct throughout every client engagement. Prior to commencing any installation or maintenance engagement, a site-specific risk assessment is conducted and documented.",
    hse_quote:
      'No delivery is urgent enough, and no deadline tight enough, to justify a departure from our safety standards. At Wavy Energy, safety is the one area where we never negotiate.',
    why_intro:
      "Nigeria's energy services market is dominated by operators whose value propositions focus primarily on price and availability. Wavy Energy differentiates itself through technical competence, disciplined operations, and institutional-grade service standards.",
    contact_email: "info@wavyenergy.com",
    contact_phone: "+234 916 000 8477",
    contact_address: "Ikeja Lagos State, Nigeria",
    footer_tagline: "Fueling Growth with Clean Energy Solutions.",
  });

  const cursorRef = useRef<HTMLDivElement | null>(null);
  const cursorRingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        const [contentRes, teamRes, servicesRes] = await Promise.all([
          supabase.from("site_content").select("*"),
          supabase.from("team_members").select("*").order("display_order"),
          supabase.from("services").select("*").order("display_order"),
        ]);
        
        if (contentRes.data) {
          const contentMap: any = {};
          contentRes.data.forEach((item) => {
            contentMap[item.key] = item.value;
          });
          if (Object.keys(contentMap).length > 0) {
            setContent((prev) => ({ ...prev, ...contentMap }));
          }
        }

        if (teamRes.data && teamRes.data.length > 0) {
          setTeamMembers(teamRes.data);
        }

        if (servicesRes.data && servicesRes.data.length > 0) {
          setServicesList(servicesRes.data);
        }

      } catch (err) {
        console.error("Error fetching site content:", err);
      }
    }
    fetchContent();
  }, []);

  const team = useMemo(() => {
    if (teamMembers.length > 0) {
      return teamMembers.map(m => ({
        initials: m.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
        name: m.name,
        photoSrc: m.image_url || null,
        role: m.role,
        bio: m.bio
      }));
    }
    
    return [
      {
        initials: "KM",
        name: "Kenneth Martins",
        photoSrc: "/team/kenneth-martins.jpg",
        role: "Group Chief Executive Officer",
        bio:
          "At the helm of Wavy Energy, Kenneth Martins provides overall strategic direction and executive oversight, ensuring the company's operations align with its long-term growth objectives and service commitments. His leadership focuses on building a resilient energy company defined by operational discipline, reliability, and sustainable expansion.",
      },
      {
        initials: "TO",
        name: "Tolulope Ogunleye",
        photoSrc: "/team/tolulope-ogunleye.jpg",
        role: "Group Executive Director",
        bio:
          "Tolulope Ogunleye brings over a decade of experience in corporate governance and strategic leadership. His role centres on strengthening organisational structure, enhancing governance frameworks, and positioning the company for scalable growth through structured planning, institutional partnerships, and disciplined executive coordination.",
      },
      {
        initials: "TA",
        name: "Engr. Tega Akpo",
        photoSrc: "/team/engr-tega-akpo.jpg",
        role: "Chief of Operations",
        bio:
          "Engineer Tega Akpo brings more than ten years of operational leadership within the energy sector. He oversees technical delivery, operational supervision, and project execution, ensuring that all supply, engineering, and energy system deployments are conducted with efficiency, safety compliance, and professional oversight.",
      },
    ];
  }, [teamMembers]);

  const services = useMemo(() => {
    if (servicesList.length > 0) {
      return servicesList.map((s, idx) => ({
        n: String(idx + 1).padStart(2, '0'),
        name: s.name,
        body: s.description,
        tags: Array.isArray(s.tags) ? s.tags : []
      }));
    }
    
    return [
      {
        n: "01",
        name: "Bulk Petroleum Product Supply",
        body:
          "Large-volume procurement and logistics management for Automotive Gas Oil (AGO), Premium Motor Spirit (PMS), Liquefied Petroleum Gas (LPG), and Dual Purpose Kerosene (DPK). Our supply chain is designed for volume, velocity, and reliability — with haulage partnerships, product quality controls, and delivery documentation protocols embedded across every transaction.",
        tags: [
          "AGO (Diesel)",
          "PMS (Petrol)",
          "LPG (Cooking Gas)",
          "DPK (Kerosene)",
          "Contract & Spot Supply",
        ],
      },
      {
        n: "02",
        name: "Gas Plant Design, Construction & Installation",
        body:
          "Engineering, fabrication, and commissioning of LPG gas plant systems for residential properties, hotels, hospitals, schools, restaurants, and commercial facilities. Our engineering team conducts site surveys, load assessments, and system specifications before any construction begins. All installations undergo a formal commissioning and safety verification process before handover.",
        tags: [
          "Site Survey & Assessment",
          "System Design",
          "Civil & Mechanical Works",
          "Commissioning",
          "Safety Certification",
        ],
      },
      {
        n: "03",
        name: "Retail & Wholesale Petroleum Distribution",
        body:
          "Targeted supply of petroleum products to smaller commercial, hospitality, and residential clients requiring flexible volume and delivery scheduling. Wavy Energy provides structured retail and wholesale distribution services with clear pricing, defined lead times, and documented delivery processes.",
        tags: ["Flexible Volume", "Scheduled Delivery", "Price Transparency", "Quality Assurance"],
      },
      {
        n: "04",
        name: "Gas Infrastructure Inspection, Maintenance & Repairs",
        body:
          "Scheduled and emergency technical maintenance of gas plants, storage tanks, pumping systems, pipelines, and dispensing equipment. Our technical team provides periodic inspection programmes, preventive maintenance schedules, and emergency repair services for all gas infrastructure. All maintenance activities are documented and reconciled against client safety records.",
        tags: ["Preventive Maintenance", "Pump & Tank Servicing", "Emergency Repairs", "Compliance Inspections"],
      },
      {
        n: "05",
        name: "Solar Power Systems — Design, Supply, Installation & Support",
        body:
          "End-to-end delivery of solar photovoltaic power systems for residential, commercial, and institutional clients. We conduct electrical load analysis and site assessment, supply and install solar panels, inverter systems, battery storage, and all balance-of-system components, and provide ongoing technical support and warranty management after installation.",
        tags: [
          "Load Analysis",
          "System Design & Sizing",
          "Panel & Inverter Supply",
          "Battery Storage",
          "Post-Installation Support",
        ],
      },
    ];
  }, [servicesList]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Reveal animations
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(".rv,.rv-l,.rv-s"),
    );
    els.forEach((el, idx) => {
      el.dataset.rvIndex = String(idx);
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          const idx = Number(el.dataset.rvIndex ?? "0");
          window.setTimeout(() => el.classList.add("on"), idx * 55);
          io.unobserve(el);
        });
      },
      { threshold: 0.1 },
    );
    els.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const canHover =
      window.matchMedia?.("(hover: hover)").matches &&
      window.matchMedia?.("(pointer: fine)").matches;
    if (!canHover) return;

    const c = cursorRef.current;
    const r = cursorRingRef.current;
    if (!c || !r) return;

    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    document.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      c.style.left = `${mx}px`;
      c.style.top = `${my}px`;
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      r.style.left = `${rx}px`;
      r.style.top = `${ry}px`;
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div id="cur" ref={cursorRef} />
      <div id="cur-r" ref={cursorRingRef} />

      <nav id="nav" className={scrolled ? "s" : ""}>
        <a href="#home" className="nl">
          <Image src={logo} alt="Wavy Energy Logo" className="nl-logo" width={92} height={74} />
        </a>
        <ul className="nm">
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#services">Services</a>
          </li>
          <li>
            <a href="#hse">HSE</a>
          </li>
          <li>
            <a href="#coverage">Coverage</a>
          </li>
          <li>
            <a href="#team">Team</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
        <button
          className="nb"
          onClick={() =>
            document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Get In Touch
        </button>
      </nav>

      <section className="hero" id="home">
        <div className="hero-bg">
          <div className="hero-grid" />
          <div className="hero-glow" />
          <div className="hero-glow2" />
          <div className="hero-lines" />
        </div>
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-tag">
              {content.hero_tag ||
                "Lagos, Nigeria · Downstream Energy · Clean Power"}
            </div>
            <h1>{content.hero_title}</h1>
            <p className="hero-desc">
              {content.hero_description}
            </p>
            <div className="hero-btns">
              <a href="#services" className="btn-g">
                Our Services
              </a>
              <a href="#about" className="btn-o">
                Company Profile
              </a>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-stats">
              <div className="hs">
                <div className="hs-n">{content.stats_litres || "150K"}</div>
                <div className="hs-l">Litres Monthly Capacity</div>
              </div>
              <div className="hs">
                <div className="hs-n">{content.stats_states || "36+"}</div>
                <div className="hs-l">States Nationwide</div>
              </div>
              <div className="hs">
                <div className="hs-n">{content.stats_lines || "5"}</div>
                <div className="hs-l">Integrated Service Lines</div>
              </div>
              <div className="hs">
                <div className="hs-n">{content.stats_doc || "100%"}</div>
                <div className="hs-l">Deliveries Documented</div>
              </div>
              <div className="hero-ticker">
                <span className="ticker-label">Live Operations</span>
                <div className="ticker-track" aria-hidden="true">
                  <span className="ticker-item">AGO · Diesel Supply</span>
                  <span className="ticker-item">PMS · Petrol</span>
                  <span className="ticker-item">LPG · Cooking Gas</span>
                  <span className="ticker-item">Gas Plant Engineering</span>
                  <span className="ticker-item">Solar Power Systems</span>
                  <span className="ticker-item">DPK · Kerosene</span>
                  <span className="ticker-item">AGO · Diesel Supply</span>
                  <span className="ticker-item">PMS · Petrol</span>
                  <span className="ticker-item">LPG · Cooking Gas</span>
                  <span className="ticker-item">Gas Plant Engineering</span>
                  <span className="ticker-item">Solar Power Systems</span>
                  <span className="ticker-item">DPK · Kerosene</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-scroll">
          <span>Scroll</span>
          <div className="hero-scroll-line" />
        </div>
      </section>

      <div className="band" aria-hidden="true">
        <div className="band-track">
          <span className="band-item">Petroleum Supply</span>
          <span className="band-item">Gas Plant Engineering</span>
          <span className="band-item">Solar Power Systems</span>
          <span className="band-item">NMDPRA Compliant</span>
          <span className="band-item">100% Nigerian-Owned</span>
          <span className="band-item">Infrastructure Maintenance</span>
          <span className="band-item">Petroleum Supply</span>
          <span className="band-item">Gas Plant Engineering</span>
          <span className="band-item">Solar Power Systems</span>
          <span className="band-item">NMDPRA Compliant</span>
          <span className="band-item">100% Nigerian-Owned</span>
          <span className="band-item">Infrastructure Maintenance</span>
        </div>
      </div>

      <section className="about" id="about">
        <div className="si">
          <div className="ag">
            <div>
              <div className="ew rv">Who We Are</div>
              <h2 className="st rv">
                Company <em>Overview</em>
              </h2>
              <blockquote className="a-quote rv">
                {content.hero_title || "Fueling Growth with Clean Energy Solutions."}
              </blockquote>
              <p className="a-body rv">
                {content.about_intro ||
                  "Wavy Energy Limited is an integrated downstream petroleum and energy engineering company, headquartered in Lagos, Nigeria. Prior to formal incorporation, the company's founders and technical partners had been actively engaged in petroleum distribution, fuel logistics coordination, and energy system deployment within the Nigerian market."}
              </p>
              <p className="a-body rv">
                {content.about_body_1 ||
                  "This period of pre-incorporation activity enabled the organisation to build strong industry relationships, operational competence, and market credibility. The leadership team brings longstanding experience in downstream petroleum logistics and energy engineering, with incorporation serving to formalise existing operations under a limited liability structure to strengthen governance, regulatory compliance, risk management, and scalable growth."}
              </p>
              <p className="a-body rv">
                {content.about_body_2 ||
                  "Since incorporation, Wavy Energy has consolidated its operational framework and expanded its service delivery capacity — building upon its prior field experience to deliver structured petroleum supply and energy system installations for commercial and institutional clients across Lagos, the South-West region, and national markets through licensed partners."}
              </p>
              <div className="about-callout rv">
                <p>
                  {content.about_callout ||
                    "The company continues to leverage its pre-registration operational foundation, technical expertise, and established networks to execute projects efficiently, maintain high service standards, and position itself as a reliable participant within Nigeria's evolving energy sector."}
                </p>
              </div>
            </div>
            <div className="rv-s">
              <table className="at">
                <tbody>
                  <tr>
                    <td>Company Type</td>
                    <td>Private Limited Company (Ltd)</td>
                  </tr>
                  <tr>
                    <td>Headquarters</td>
                    <td>Lagos State, Nigeria</td>
                  </tr>
                  <tr>
                    <td>Primary Sector</td>
                    <td>Downstream Oil &amp; Gas / Energy</td>
                  </tr>
                  <tr>
                    <td>Secondary Sector</td>
                    <td>Renewable Energy (Solar)</td>
                  </tr>
                  <tr>
                    <td>Ownership</td>
                    <td>100% Indigenous, Nigerian-Owned</td>
                  </tr>
                  <tr>
                    <td>Operational Scope</td>
                    <td>Lagos State &amp; Nationwide</td>
                  </tr>
                  <tr>
                    <td>Regulatory Status</td>
                    <td>DPR / NMDPRA Compliant</td>
                  </tr>
                  <tr>
                    <td>Business Type</td>
                    <td>Supply · Engineering · Maintenance</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="vision" id="vision">
        <div className="si">
          <div className="ew rv" style={{ color: "var(--gold2)" }}>
            Our Foundation
          </div>
          <h2 className="st rv" style={{ color: "#fff" }}>
            Vision, Mission
            <br />&amp; <em>Core Values</em>
          </h2>
          <div className="vm rv">
            <div className="vm-c">
              <div className="vm-l">Our Vision</div>
              <p>
                {content.vision_text ||
                  "To be Nigeria's most technically credible and operationally dependable energy company — a name that institutions, businesses, and households associate unconditionally with reliability, safety, and professional excellence."}
              </p>
            </div>
            <div className="vm-c">
              <div className="vm-l">Our Mission</div>
              <p>
                {content.mission_text ||
                  "To deliver integrated energy solutions — across petroleum product supply, gas plant engineering, and solar power installation — with a standard of technical competence, safety compliance, and client accountability that defines a new benchmark for energy service providers in Nigeria."}
              </p>
            </div>
          </div>
          <div className="vals rv">
            <div className="val">
              <div className="vd" />
              <div className="vt">Integrity</div>
              <p className="vb">
                We operate with complete transparency in all commercial engagements. Our pricing
                is honest, our documentation is accurate, and our representations are truthful —
                without exception.
              </p>
            </div>
            <div className="val">
              <div className="vd" />
              <div className="vt">Safety</div>
              <p className="vb">
                Every operation — from a gas plant installation to a fuel delivery — is governed
                by rigorous safety protocols. Safety is not a compliance exercise; it is a core
                operating discipline.
              </p>
            </div>
            <div className="val">
              <div className="vd" />
              <div className="vt">Reliability</div>
              <p className="vb">
                Our clients depend on consistent supply and timely delivery. We have structured
                our logistics, procurement, and workforce around that non-negotiable obligation.
              </p>
            </div>
            <div className="val">
              <div className="vd" />
              <div className="vt">Technical Excellence</div>
              <p className="vb">
                We invest in the competence of our people, the quality of our equipment, and the
                rigour of our processes. Mediocre execution is not a standard Wavy Energy accepts.
              </p>
            </div>
            <div className="val">
              <div className="vd" />
              <div className="vt">Client Partnership</div>
              <p className="vb">
                We do not seek transactional relationships. We build long-term client partnerships
                grounded in mutual respect, clear communication, and genuine commitment to
                outcomes.
              </p>
            </div>
            <div className="val">
              <div className="vd" />
              <div className="vt">Compliance</div>
              <p className="vb">
                Wavy Energy operates in full conformity with DPR / NMDPRA requirements. Clients can
                engage us with confidence that every arrangement is properly structured and legally
                sound.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="services" id="services">
        <div className="si">
          <div className="svc-intro">
            <div>
              <div className="ew rv">What We Deliver</div>
              <h2 className="st rv">
                Five Integrated
                <br />
                <em>Service Lines</em>
              </h2>
            </div>
            <p className="sl rv">
              Wavy Energy operates five integrated service lines, enabling the company to function
              as a single, technically capable energy partner for clients across residential,
              commercial, hospitality, and industrial sectors.
            </p>
          </div>

          <div className="svc-list rv">
            {services.map((svc, idx) => (
              <div
                key={svc.n}
                className={`svc ${openSvc === idx ? "op" : ""}`}
                onClick={() => setOpenSvc((cur) => (cur === idx ? null : idx))}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpenSvc((cur) => (cur === idx ? null : idx));
                  }
                }}
              >
                <div className="svc-hd">
                  <span className="svc-n">{svc.n}</span>
                  <span className="svc-nm">{svc.name}</span>
                  <span className="svc-arr">+</span>
                </div>
                <div className="svc-bd">
                  <p>{svc.body}</p>
                  <div className="tags">
                    {svc.tags.map((t: string) => (
                      <span className="tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="caps" id="capabilities">
        <div className="si">
          <div className="ew rv">Operational Depth</div>
          <h2 className="st rv">
            Technical <em>Capabilities</em>
          </h2>
          <p className="sl rv">
            The credibility of an energy company is ultimately determined not by its service list,
            but by its ability to execute. Wavy Energy has built its operational framework around
            three pillars: human capital, supply chain infrastructure, and quality management.
          </p>
          <div className="cap-g">
            <div className="cap rv">
              <svg className="cap-icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="22" cy="13" r="7" fill="#22502E" />
                <path
                  d="M6 42c0-8.837 7.163-16 16-16s16 7.163 16 16"
                  stroke="#22502E"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <rect x="12" y="5" width="20" height="4" rx="2" fill="#22502E" opacity=".4" />
                <rect x="10" y="4" width="24" height="3" rx="1.5" fill="#22502E" opacity=".25" />
              </svg>
              <div className="cap-t">Qualified Workforce</div>
              <div className="cap-s">Human Capital</div>
              <p>
                Technical personnel include certified gas engineers, petroleum logistics coordinators,
                solar photovoltaic installers, and field safety officers. All technical staff are
                vetted for relevant qualifications and operational experience before deployment. The
                company maintains a structured programme of professional development to ensure field
                competence evolves in step with regulatory requirements and industry best practice.
              </p>
            </div>
            <div className="cap rv">
              <svg className="cap-icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 4L10 22a12 12 0 0024 0L22 4z" fill="#22502E" />
                <path
                  d="M16 28a6 6 0 006 6"
                  stroke="#1A3A24"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity=".4"
                />
              </svg>
              <div className="cap-t">Procurement Infrastructure</div>
              <div className="cap-s">Supply Chain</div>
              <p>
                Our petroleum product supply chain is anchored by direct commercial relationships with
                licensed Nigerian downstream marketers, loading terminals, and licensed hauliers
                registered under the NMDPRA framework. Product sourcing protocols include verification
                of product certification, volumetric measurement at point of loading, and delivery
                documentation standards on all supply transactions.
              </p>
            </div>
            <div className="cap rv">
              <svg className="cap-icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="8" width="28" height="32" rx="3" stroke="#22502E" strokeWidth="2.5" />
                <rect x="16" y="4" width="12" height="6" rx="3" fill="#22502E" />
                <path
                  d="M15 23l5 5 9-9"
                  stroke="#22502E"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="cap-t">Standards &amp; Controls</div>
              <div className="cap-s">Quality Management</div>
              <p>
                Wavy Energy applies defined operating procedures across each service line, specifying
                minimum standards for materials, workmanship, documentation, and client communication —
                reviewed periodically to reflect regulatory changes. For gas works, all installations
                undergo pre-commissioning inspection and pressure testing. For solar, completed systems
                undergo functional testing before client handover.
              </p>
            </div>
            <div className="cap rv">
              <svg className="cap-icon" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="12" width="26" height="20" rx="2" fill="#22502E" />
                <path d="M28 18h8l6 8v6H28V18z" fill="#22502E" opacity=".6" />
                <circle cx="10" cy="34" r="4" fill="#FAF8F3" stroke="#22502E" strokeWidth="2.5" />
                <circle cx="34" cy="34" r="4" fill="#FAF8F3" stroke="#22502E" strokeWidth="2.5" />
                <rect x="12" y="17" width="10" height="7" rx="1" fill="#FAF8F3" opacity=".25" />
              </svg>
              <div className="cap-t">Delivery &amp; Distribution</div>
              <div className="cap-s">Logistics</div>
              <p>
                Our logistics framework supports both scheduled contract deliveries and time-sensitive
                supply requirements. Haulage partners operate tanker fleets licensed for petroleum
                product transportation across Lagos and nationwide. Delivery documentation — including
                waybills, dispatch notes, and delivery receipts — is prepared as standard on all fuel
                supply transactions and retained for client reconciliation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hse" id="hse">
        <div className="si">
          <div className="hse-g">
            <div>
              <div className="ew rv">Safety &amp; Compliance</div>
              <h2 className="st rv">
                Health, Safety &amp;
                <br />
                <em>Regulatory</em> Compliance
              </h2>
              <p className="hse-body rv">
                {content.hse_intro ||
                  "In Nigeria's energy sector, safety and regulatory compliance are not optional — they are the baseline conditions for legitimate, sustainable operation. Wavy Energy treats its HSE obligations as a fundamental component of its operational identity, not a peripheral compliance burden."}
              </p>
              <p className="hse-body rv">
                {content.hse_body ||
                  "All field personnel receive HSE induction before deployment and must comply with the Wavy Energy HSE Code of Conduct throughout every client engagement. Prior to commencing any installation or maintenance engagement, a site-specific risk assessment is conducted and documented."}
              </p>
              <ul className="hse-ul rv">
                <li>Pre-installation site hazard assessment for all gas and solar engineering works</li>
                <li>Mandatory use of certified pressure testing equipment on all gas infrastructure</li>
                <li>Product quality verification at loading point for all petroleum supply transactions</li>
                <li>Licensed and insured hauliers exclusively used for petroleum product transportation</li>
                <li>Emergency response procedure documentation on all field operations</li>
                <li>Client safety briefing and system orientation upon completion of all installations</li>
                <li>Periodic safety audits of all active service contracts and supply arrangements</li>
                <li>Incident recording and root-cause analysis to drive continuous safety improvement</li>
              </ul>
              <div className="comp-g rv">
                <div className="comp">
                  <div className="comp-l">Regulatory Authority</div>
                  <p>NMDPRA &amp; DPR compliant across all petroleum operations</p>
                </div>
                <div className="comp">
                  <div className="comp-l">Corporate Governance</div>
                  <p>Good standing with all applicable regulatory bodies</p>
                </div>
                <div className="comp">
                  <div className="comp-l">HSE Framework</div>
                  <p>Formal framework with PPE requirements &amp; incident reporting</p>
                </div>
                <div className="comp">
                  <div className="comp-l">Legal Agreements</div>
                  <p>All commercial agreements executed with appropriate legal review</p>
                </div>
              </div>
            </div>
            <div className="hse-box rv-s">
              <p className="hse-q">
                &quot;
                {content.hse_quote ||
                  "No delivery is urgent enough, and no deadline tight enough, to justify a departure from our safety standards. At Wavy Energy, safety is the one area where we never negotiate."}
                &quot;
              </p>
              <div className="hse-qa">— Wavy Energy Management</div>
            </div>
          </div>
        </div>
      </section>

      <section className="why" id="why">
        <div className="si">
          <div className="ew rv">The Case for Wavy Energy</div>
          <h2 className="st rv">
            Why Choose <em>Wavy Energy</em>
          </h2>
          <p className="sl rv">
            {content.why_intro ||
              "Nigeria's energy services market is dominated by operators whose value propositions focus primarily on price and availability. Wavy Energy differentiates itself through technical competence, disciplined operations, and institutional-grade service standards."}
          </p>
          <div className="why-g">
            <div className="wc rv">
              <div className="wc-n">01</div>
              <div className="wc-t">An Integrated Energy Partner — Not a Single-Product Vendor</div>
              <p>
                Clients who engage Wavy Energy access petroleum product supply, gas plant engineering, and solar power
                solutions from one entity — with unified accountability, coherent documentation, and a single
                relationship to manage.
              </p>
            </div>
            <div className="wc rv">
              <div className="wc-n">02</div>
              <div className="wc-t">Technical Depth Across All Service Lines</div>
              <p>
                Each of our five service lines is supported by trained and experienced personnel, appropriate
                equipment, and defined operating procedures. Clients receive a service that reflects genuine technical
                competence — not subcontracted approximation.
              </p>
            </div>
            <div className="wc rv">
              <div className="wc-n">03</div>
              <div className="wc-t">Supply Chain Discipline and Delivery Reliability</div>
              <p>
                We maintain verified supplier relationships, documented delivery protocols, and logistics partnerships
                capable of fulfilling both routine and urgent supply requirements — with the consistency that
                institutional and commercial clients demand.
              </p>
            </div>
            <div className="wc rv">
              <div className="wc-n">04</div>
              <div className="wc-t">Regulatory Compliance and Legal Soundness</div>
              <p>
                Every commercial arrangement Wavy Energy enters is properly structured, documented, and compliant with
                applicable Nigerian downstream energy regulations. Clients do not carry the compliance risk of
                engaging an operator with unclear regulatory standing.
              </p>
            </div>
            <div className="wc rv">
              <div className="wc-n">05</div>
              <div className="wc-t">A Company Built for Long-Term Partnerships</div>
              <p>
                Our client relationships are founded on recurring service contracts, established supply arrangements,
                and consistent performance that earns trust over time. We are committed to remaining relevant,
                reputable, and fully accountable to our clients well into the next decade.
              </p>
            </div>
            <div className="wc wc-dark rv">
              <div className="wc-n">WE</div>
              <div className="wc-t">100% Indigenous &amp; Nigerian-Owned</div>
              <p>
                Wavy Energy is a proudly indigenous Nigerian energy company — built by Nigerians, for Nigeria&apos;s energy
                future. Our leadership, workforce, and operational infrastructure are entirely home-grown.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cov" id="coverage">
        <div className="si">
          <div className="cov-g">
            <div>
              <div className="ew rv">Geographic Reach</div>
              <h2 className="st rv">
                Operational <em>Coverage</em>
                <br />&amp; Delivery Hubs
              </h2>
              <p className="sl rv">
                Wavy Energy operates three primary delivery hubs — Lagos, Delta, and the Federal Capital Territory
                (Abuja) — from which it coordinates petroleum product and energy supply across all 36 states of
                Nigeria and the FCT.
              </p>
              <div className="hubs rv">
                <div className="hub">
                  <div className="hub-dot" />
                  <div>
                    <div className="hub-n">Lagos State</div>
                    <div className="hub-r">South-West Hub · Primary Base of Operations</div>
                  </div>
                </div>
                <div className="hub">
                  <div className="hub-dot" />
                  <div>
                    <div className="hub-n">Delta State</div>
                    <div className="hub-r">South-South Hub</div>
                  </div>
                </div>
                <div className="hub">
                  <div className="hub-dot" />
                  <div>
                    <div className="hub-n">Abuja (FCT)</div>
                    <div className="hub-r">North-Central Hub</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rv-s">
              <div className="ew" style={{ color: "var(--gold2)", marginBottom: 22 }}>
                Client Segments
              </div>
              <div className="segs">
                <span className="seg">Industrial Clients &amp; Facilities</span>
                <span className="seg">Commercial Operators &amp; Estates</span>
                <span className="seg">Residential Clients &amp; Institutions</span>
                <span className="seg">Hospitality Sector</span>
                <span className="seg">Offshore &amp; Industrial Enquiries</span>
              </div>
              <div style={{ marginTop: 44 }}>
                <div className="ew" style={{ color: "var(--gold2)", marginBottom: 18 }}>
                  Startup Supply Capacity
                </div>
                <p
                  style={{
                    fontFamily: "var(--pl)",
                    fontSize: "1rem",
                    fontStyle: "italic",
                    color: "rgba(255,255,255,.55)",
                    lineHeight: 1.85,
                  }}
                >
                  100,000 – 150,000 Litres per month, via own fleet and partner haulier networks. Contract and spot
                  supply available.
                </p>
              </div>
              <div style={{ marginTop: 36 }}>
                <div className="ew" style={{ color: "var(--gold2)", marginBottom: 18 }}>
                  Recent Projects
                </div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                  <li
                    style={{
                      fontSize: ".84rem",
                      color: "rgba(255,255,255,.5)",
                      lineHeight: 1.7,
                      display: "flex",
                      gap: 12,
                    }}
                  >
                    <span style={{ color: "var(--gold)", flexShrink: 0 }}>—</span>
                    Bulk diesel supply to commercial facilities and private estates within Lagos
                  </li>
                  <li
                    style={{
                      fontSize: ".84rem",
                      color: "rgba(255,255,255,.5)",
                      lineHeight: 1.7,
                      display: "flex",
                      gap: 12,
                    }}
                  >
                    <span style={{ color: "var(--gold)", flexShrink: 0 }}>—</span>
                    Engineering support and installation of small-scale solar backup systems for commercial clients
                  </li>
                  <li
                    style={{
                      fontSize: ".84rem",
                      color: "rgba(255,255,255,.5)",
                      lineHeight: 1.7,
                      display: "flex",
                      gap: 12,
                    }}
                  >
                    <span style={{ color: "var(--gold)", flexShrink: 0 }}>—</span>
                    Technical advisory for LPG system installations within hospitality and mixed-use environments
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="cov-bar rv">
            <div className="cov-s">
              <div className="cov-n">3</div>
              <div className="cov-l">Primary Delivery Hubs</div>
            </div>
            <div className="cov-s">
              <div className="cov-n">36+</div>
              <div className="cov-l">States Nationwide</div>
            </div>
            <div className="cov-s">
              <div className="cov-n">150K L</div>
              <div className="cov-l">Max Monthly Capacity</div>
            </div>
            <div className="cov-s">
              <div className="cov-n">100%</div>
              <div className="cov-l">Deliveries Documented</div>
            </div>
          </div>
        </div>
      </section>

      <section className="team" id="team">
        <div className="si">
          <div className="ew rv" style={{ justifyContent: "center" }}>
            Leadership &amp; Governance
          </div>
          <h2 className="st rv" style={{ textAlign: "center" }}>
            Principal <em>Officers</em>
          </h2>
          <p
            className="sl rv"
            style={{
              marginBottom: 0,
              textAlign: "center",
              maxWidth: 680,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Wavy Energy is led by three principal officers whose combined expertise spans executive strategy,
            corporate governance, and operational engineering — forming the core of the company&apos;s leadership and
            accountability structure.
          </p>

          <div className="tg">
            {team.map((p) => (
              <div className="tc rv" key={p.name}>
                {p.photoSrc ? (
                  <img
                    className="tc-photo"
                    src={p.photoSrc}
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="tc-av" aria-hidden="true">
                    {p.initials}
                  </div>
                )}
                <div className="tc-n">{p.name}</div>
                <div className="tc-hover-info">
                  <div className="tc-r">{p.role}</div>
                  <p className="tc-b">{p.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="si">
          <div className="ew rv">Engage With Us</div>
          <h2 className="st rv">
            Contact &amp; <em>Enquiries</em>
          </h2>
          <p className="sl rv" style={{ marginBottom: 60 }}>
            Wavy Energy Company Limited welcomes formal and informal enquiries from clients, institutions, project
            developers, and strategic partners. Our team is prepared to engage with professionalism and
            transparency.
          </p>
          <div className="ct-g">
            <div>
              <div className="ct-cards">
                <div className="ctc rv">
                  <div className="ctc-ic">📞</div>
                  <div>
                    <div className="ctc-l">Telephone</div>
                    <div className="ctc-v">{content.contact_phone}</div>
                  </div>
                </div>
                <div className="ctc rv">
                  <div className="ctc-ic">✉️</div>
                  <div>
                    <div className="ctc-l">Email</div>
                    <div className="ctc-v">{content.contact_email}</div>
                  </div>
                </div>
                <div className="ctc rv">
                  <div className="ctc-ic">🌐</div>
                  <div>
                    <div className="ctc-l">Website</div>
                    <div className="ctc-v">www.wavyenergyltd.com</div>
                  </div>
                </div>
                <div className="ctc rv">
                  <div className="ctc-ic">📍</div>
                  <div>
                    <div className="ctc-l">Address</div>
                    <div className="ctc-v">
                      {content.contact_address || "Ikeja Lagos State, Nigeria"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="ct-hrs rv">
                <div className="ct-hl">Business Hours</div>
                <div className="hr">
                  <span>Monday – Friday</span>
                  <span>8:00 AM – 6:00 PM</span>
                </div>
                <div className="hr">
                  <span>Saturday</span>
                  <span>9:00 AM – 3:00 PM</span>
                </div>
                <div className="hr">
                  <span>Emergency Enquiries</span>
                  <span>Available 24 Hours</span>
                </div>
                <div className="hr">
                  <span>Nationwide Engagement</span>
                  <span>Available</span>
                </div>
                <div className="hr">
                  <span>Offshore &amp; Industrial</span>
                  <span>Enquiries Welcome</span>
                </div>
              </div>
            </div>

            <form
              className="cf rv-s"
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                setError(null);
                
                const formData = new FormData(e.currentTarget);
                const data = {
                  firstName: formData.get("firstName"),
                  lastName: formData.get("lastName"),
                  email: formData.get("email"),
                  organisation: formData.get("organisation"),
                  enquiryType: formData.get("enquiryType"),
                  message: formData.get("message"),
                };

                try {
                  const response = await fetch("/api/contact", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                  });

                  if (response.ok) {
                    setSubmitted(true);
                  } else {
                    const result = await response.json();
                    setError(result.error || "Failed to send enquiry. Please try again.");
                  }
                } catch (err) {
                  setError("An unexpected error occurred. Please try again later.");
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              <div className="fr">
                <div className="fg">
                  <label className="fl">First Name</label>
                  <input className="fi" name="firstName" type="text" placeholder="Your first name" required />
                </div>
                <div className="fg">
                  <label className="fl">Last Name</label>
                  <input className="fi" name="lastName" type="text" placeholder="Your last name" required />
                </div>
              </div>
              <div className="fg">
                <label className="fl">Email Address</label>
                <input className="fi" name="email" type="email" placeholder="your@email.com" required />
              </div>
              <div className="fg">
                <label className="fl">Organisation</label>
                <input className="fi" name="organisation" type="text" placeholder="Company or organisation" />
              </div>
              <div className="fg">
                <label className="fl">Enquiry Type</label>
                <select className="fs" name="enquiryType" defaultValue="">
                  <option value="">Select enquiry type</option>
                  <option>Bulk Petroleum Product Supply</option>
                  <option>Gas Plant Design &amp; Installation</option>
                  <option>Retail &amp; Wholesale Distribution</option>
                  <option>Gas Infrastructure Maintenance</option>
                  <option>Solar Power Systems</option>
                  <option>Partnership / Strategic</option>
                  <option>General Enquiry</option>
                </select>
              </div>
              <div className="fg">
                <label className="fl">Message</label>
                <textarea className="ft" name="message" placeholder="Tell us about your requirements..." required />
              </div>
              {error && <div style={{ color: "red", fontSize: "0.85rem", marginBottom: "15px" }}>{error}</div>}
              <button
                type="submit"
                className="fsub"
                disabled={submitted || isSubmitting}
                style={
                  submitted
                    ? { background: "var(--green)", opacity: 0.98, transform: "none" }
                    : isSubmitting ? { opacity: 0.7, cursor: "not-allowed" } : undefined
                }
              >
                {submitted
                  ? "✓ Enquiry received — we will be in touch shortly."
                  : isSubmitting ? "Sending..." : "Send Enquiry →"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer>
        <div className="fi-inner">
          <div className="ft-top">
            <div>
              <div className="fb-logo">
                <Image src={logo} alt="Wavy Energy Logo" className="fb-logo-img" width={130} height={97} />
              </div>
              <p className="fb-tl">
                {content.footer_tagline ||
                  "Fueling Growth with Clean Energy Solutions."}
              </p>
              <div className="fb-rc">Lagos, Nigeria · 100% Nigerian-Owned</div>
            </div>
            <div>
              <div className="fc-t">Navigate</div>
              <ul className="fc-links">
                <li>
                  <a href="#about">Company Overview</a>
                </li>
                <li>
                  <a href="#vision">Vision &amp; Values</a>
                </li>
                <li>
                  <a href="#services">Our Services</a>
                </li>
                <li>
                  <a href="#capabilities">Technical Capabilities</a>
                </li>
                <li>
                  <a href="#hse">HSE &amp; Compliance</a>
                </li>
                <li>
                  <a href="#coverage">Coverage &amp; Hubs</a>
                </li>
                <li>
                  <a href="#team">Leadership Team</a>
                </li>
              </ul>
            </div>
            <div>
              <div className="fc-t">Services</div>
              <ul className="fc-links">
                <li>
                  <a href="#services">Bulk Petroleum Supply</a>
                </li>
                <li>
                  <a href="#services">Gas Plant Engineering</a>
                </li>
                <li>
                  <a href="#services">Retail Distribution</a>
                </li>
                <li>
                  <a href="#services">Infrastructure Maintenance</a>
                </li>
                <li>
                  <a href="#services">Solar Power Systems</a>
                </li>
              </ul>
            </div>
            <div>
              <div className="fc-t">Contact</div>
              <ul className="fc-links">
                <li>
                  <a href={`tel:${content.contact_phone || "+2349160008477"}`}>
                    {content.contact_phone || "+234 916 000 8477"}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${content.contact_email || "info@wavyenergy.com"}`}>
                    {content.contact_email || "info@wavyenergy.com"}
                  </a>
                </li>
                <li>
                  <a href="#">www.wavyenergyltd.com</a>
                </li>
                <li>
                  <a href="#contact">
                    {content.contact_address || "Ikeja Lagos State, Nigeria"}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="ft-bot">
            <div className="ft-copy">© 2025 Wavy Energy Company Limited. All rights reserved.</div>
            <div className="ft-leg">Strictly Private &amp; Confidential</div>
          </div>
        </div>
      </footer>
    </>
  );
}
