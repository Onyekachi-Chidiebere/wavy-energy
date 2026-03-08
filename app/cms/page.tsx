"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import ImageUploader from "./components/ImageUploader";
import logo from '../images/logo.png'
import Image from "next/image";

export default function AdminDashboard() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState("hero");
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [content, setContent] = useState<Record<string, string>>({});
  const [team, setTeam] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [contentRes, teamRes, servicesRes] = await Promise.all([
        supabase.from("site_content").select("*"),
        supabase.from("team_members").select("*").order("display_order"),
        supabase.from("services").select("*").order("display_order"),
      ]);

      if (contentRes.data) {
        const map: any = {};
        contentRes.data.forEach((i) => (map[i.key] = i.value));
        setContent(map);
      }
      if (teamRes.data) setTeam(teamRes.data);
      if (servicesRes.data) setServices(servicesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // --- Handlers for Content ---
  async function saveContent(e: React.FormEvent) {
    e.preventDefault();
    const updates = Object.entries(content).map(([key, value]) => ({ key, value }));
    const { error } = await supabase.from("site_content").upsert(updates);
    if (!error) alert("Content Saved!");
  }

  // --- Handlers for Team ---
  async function addTeamMember() {
    const { data, error } = await supabase.from("team_members").insert([{ name: "New Member", role: "Role", display_order: team.length + 1 }]).select();
    if (data) setTeam([...team, data[0]]);
  }
  async function updateTeamMember(id: string, field: string, value: any) {
    const newTeam = team.map(m => m.id === id ? { ...m, [field]: value } : m);
    setTeam(newTeam);
    await supabase.from("team_members").update({ [field]: value }).eq("id", id);
  }
  async function deleteTeamMember(id: string) {
    if(!confirm("Are you sure?")) return;
    setTeam(team.filter(m => m.id !== id));
    await supabase.from("team_members").delete().eq("id", id);
  }

  // --- Handlers for Services ---
  async function addService() {
    const { data, error } = await supabase.from("services").insert([{ name: "New Service", description: "Desc", display_order: services.length + 1 }]).select();
    if (data) setServices([...services, data[0]]);
  }
  async function updateService(id: string, field: string, value: any) {
    const newServices = services.map(s => s.id === id ? { ...s, [field]: value } : s);
    setServices(newServices);
    await supabase.from("services").update({ [field]: value }).eq("id", id);
  }
  async function deleteService(id: string) {
    if(!confirm("Are you sure?")) return;
    setServices(services.filter(s => s.id !== id));
    await supabase.from("services").delete().eq("id", id);
  }

  const tabs = [
    {
      id: "hero",
      label: "Hero & Stats",
      description: "Hero banner text, tagline, and key performance statistics.",
    },
    {
      id: "about",
      label: "About & Vision",
      description: "Company overview narrative, callout, and vision/mission statements.",
    },
    {
      id: "hse_contact",
      label: "HSE, Why Us & Contact",
      description: "HSE narrative, Why Wavy Energy intro, and contact/footer details.",
    },
    {
      id: "team",
      label: "Team",
      description: "Principal officers, roles, biographies, photos, and display order.",
    },
    {
      id: "services",
      label: "Services",
      description: "Service lines, descriptions, and how they appear in the accordion.",
    },
  ] as const;

  const active = tabs.find((t) => t.id === activeTab) ?? tabs[0];

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-green-900">
        <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm ring-1 ring-green-900/10">
          <span className="h-2 w-2 animate-ping rounded-full bg-green-700" />
          <span className="text-sm font-medium tracking-wide">
            Loading Wavy CMS…
          </span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 font-sans">
       <nav  className="mx-auto  px-4 py-6 sm:px-8 sm:py-10 bg-[#112616] " >
        <Image alt='logo' height={97} width={74} src={logo}/>
      </nav>
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-8 sm:py-10 mt-10">
    
        <header className="mb-6 border-b border-slate-200 pb-4">
      
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
             
              <h1 className="text-lg font-bold text-slate-900">
                Wavy Energy CMS
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Manage all public-facing content for the Wavy Energy website.
              </p>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="mt-4 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  activeTab === tab.id
                    ? "border-green-900 bg-green-900 text-white shadow-sm"
                    : "border-slate-300 bg-white text-slate-700 hover:border-green-700 hover:text-green-900"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    activeTab === tab.id ? "bg-emerald-300" : "bg-slate-300"
                  }`}
                />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active tab description */}
          <p className="mt-3 max-w-2xl text-xs text-slate-500">
            {active.description}
          </p>
        </header>

        {/* --- HERO TAB --- */}
        {activeTab === "hero" && (
          <form onSubmit={saveContent} className="space-y-6 pb-16">
            <Section title="Hero Section">
              <Input
                label="Top Tagline"
                value={content.hero_tag}
                onChange={(v) => setContent({ ...content, hero_tag: v })}
              />
              <Input
                label="Hero Title"
                value={content.hero_title}
                onChange={(v) => setContent({ ...content, hero_title: v })}
              />
              <TextArea
                label="Hero Description"
                value={content.hero_description}
                onChange={(v) =>
                  setContent({ ...content, hero_description: v })
                }
              />
            </Section>

            <Section title="Hero Statistics">
              <Input
                label="Litres Capacity (e.g. 150K)"
                value={content.stats_litres}
                onChange={(v) => setContent({ ...content, stats_litres: v })}
              />
              <Input
                label="States Covered (e.g. 36+)"
                value={content.stats_states}
                onChange={(v) => setContent({ ...content, stats_states: v })}
              />
              <Input
                label="Service Lines (e.g. 5)"
                value={content.stats_lines}
                onChange={(v) => setContent({ ...content, stats_lines: v })}
              />
              <Input
                label="Documentation % (e.g. 100%)"
                value={content.stats_doc}
                onChange={(v) => setContent({ ...content, stats_doc: v })}
              />
            </Section>

            <button className="inline-flex items-center justify-center rounded bg-green-900 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-900 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100">
              Save Changes
            </button>
          </form>
        )}

        {/* --- ABOUT TAB --- */}
        {activeTab === "about" && (
          <form onSubmit={saveContent} className="space-y-6 pb-16">
            <Section title="About Section">
              <TextArea
                label="Intro Paragraph"
                value={content.about_intro}
                onChange={(v) => setContent({ ...content, about_intro: v })}
              />
              <TextArea
                label="Body Paragraph 1"
                value={content.about_body_1}
                onChange={(v) => setContent({ ...content, about_body_1: v })}
              />
              <TextArea
                label="Body Paragraph 2"
                value={content.about_body_2}
                onChange={(v) => setContent({ ...content, about_body_2: v })}
              />
              <TextArea
                label="About Callout"
                value={content.about_callout}
                onChange={(v) =>
                  setContent({ ...content, about_callout: v })
                }
              />
            </Section>

            <Section title="Vision & Mission">
              <TextArea
                label="Vision Statement"
                value={content.vision_text}
                onChange={(v) => setContent({ ...content, vision_text: v })}
              />
              <TextArea
                label="Mission Statement"
                value={content.mission_text}
                onChange={(v) =>
                  setContent({ ...content, mission_text: v })
                }
              />
            </Section>

            <button className="inline-flex items-center justify-center rounded bg-green-900 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-900 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100">
              Save Changes
            </button>
          </form>
        )}

        {/* --- HSE / WHY / CONTACT TAB --- */}
        {activeTab === "hse_contact" && (
          <form onSubmit={saveContent} className="space-y-6 pb-16">
            <Section title="HSE & Compliance">
              <TextArea
                label="HSE Intro Paragraph"
                value={content.hse_intro}
                onChange={(v) => setContent({ ...content, hse_intro: v })}
              />
              <TextArea
                label="HSE Body Paragraph"
                value={content.hse_body}
                onChange={(v) => setContent({ ...content, hse_body: v })}
              />
              <TextArea
                label="Safety Quote"
                value={content.hse_quote}
                onChange={(v) => setContent({ ...content, hse_quote: v })}
              />
            </Section>

            <Section title="Why Choose Us">
              <TextArea
                label="Intro Paragraph"
                value={content.why_intro}
                onChange={(v) => setContent({ ...content, why_intro: v })}
              />
            </Section>

            <Section title="Contact & Footer">
              <Input
                label="Public Email"
                value={content.contact_email}
                onChange={(v) =>
                  setContent({ ...content, contact_email: v })
                }
              />
              <Input
                label="Public Phone"
                value={content.contact_phone}
                onChange={(v) =>
                  setContent({ ...content, contact_phone: v })
                }
              />
              <Input
                label="Address Line"
                value={content.contact_address}
                onChange={(v) =>
                  setContent({ ...content, contact_address: v })
                }
              />
              <TextArea
                label="Footer Tagline"
                value={content.footer_tagline}
                onChange={(v) =>
                  setContent({ ...content, footer_tagline: v })
                }
              />
            </Section>

            <button className="inline-flex items-center justify-center rounded bg-green-900 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-900 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100">
              Save Changes
            </button>
          </form>
        )}

        {/* --- TEAM TAB --- */}
        {activeTab === "team" && (
          <div className="space-y-6 pb-16">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Team Members</h2>
              <button
                onClick={addTeamMember}
                className="rounded bg-green-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-900 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100"
              >
                + Add Member
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Changes to team members are saved automatically as you edit.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {team.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-green-200 hover:shadow-md"
                >
                  <ImageUploader
                    label="Photo"
                    currentUrl={member.image_url}
                    onUpload={(url) =>
                      updateTeamMember(member.id, "image_url", url)
                    }
                  />
                  <Input
                    label="Name"
                    value={member.name}
                    onChange={(v) =>
                      updateTeamMember(member.id, "name", v)
                    }
                  />
                  <Input
                    label="Role"
                    value={member.role}
                    onChange={(v) =>
                      updateTeamMember(member.id, "role", v)
                    }
                  />
                  <TextArea
                    label="Bio"
                    value={member.bio}
                    onChange={(v) =>
                      updateTeamMember(member.id, "bio", v)
                    }
                  />
                  <Input
                    label="Order"
                    value={member.display_order}
                    type="number"
                    onChange={(v) =>
                      updateTeamMember(member.id, "display_order", v)
                    }
                  />
                  <button
                    onClick={() => deleteTeamMember(member.id)}
                    className="mt-1 text-sm font-medium text-red-600 hover:underline"
                  >
                    Delete Member
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- SERVICES TAB --- */}
        {activeTab === "services" && (
          <div className="space-y-6 pb-16">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Services</h2>
              <button
                onClick={addService}
                className="rounded bg-green-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-900 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100"
              >
                + Add Service
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Edits to services are saved automatically as you change fields.
            </p>
            <div className="space-y-4">
              {services.map((svc) => (
                <div
                  key={svc.id}
                  className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-green-200 hover:shadow-md"
                >
                  <Input
                    label="Service Name"
                    value={svc.name}
                    onChange={(v) => updateService(svc.id, "name", v)}
                  />
                  <TextArea
                    label="Description"
                    value={svc.description}
                    onChange={(v) =>
                      updateService(svc.id, "description", v)
                    }
                  />
                  <Input
                    label="Order"
                    value={svc.display_order}
                    type="number"
                    onChange={(v) =>
                      updateService(svc.id, "display_order", v)
                    }
                  />
                  <button
                    onClick={() => deleteService(svc.id)}
                    className="mt-1 text-sm font-medium text-red-600 hover:underline"
                  >
                    Delete Service
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple Helper Components for Layout
function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number | undefined;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded focus:ring-2 focus:ring-green-900 outline-none text-gray-600"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded focus:ring-2 focus:ring-green-900 outline-none h-24 text-gray-600"
      />
    </div>
  );
}
