"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import ImageUploader from "./components/ImageUploader";

export default function AdminDashboard() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState("general");
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

  if (loading) return <div className="p-10 text-green-900">Loading Dashboard...</div>;

  return (
    <div className="max-w-5xl mx-auto p-8 font-sans">
      <header className="mb-8 border-b pb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-900">Wavy CMS</h1>
        <div className="space-x-4">
          <button onClick={() => setActiveTab("general")} className={`px-4 py-2 rounded ${activeTab === 'general' ? 'bg-green-900 text-white' : 'bg-gray-100'}`}>General</button>
          <button onClick={() => setActiveTab("team")} className={`px-4 py-2 rounded ${activeTab === 'team' ? 'bg-green-900 text-white' : 'bg-gray-100'}`}>Team</button>
          <button onClick={() => setActiveTab("services")} className={`px-4 py-2 rounded ${activeTab === 'services' ? 'bg-green-900 text-white' : 'bg-gray-100'}`}>Services</button>
        </div>
      </header>

      {/* --- GENERAL TAB --- */}
      {activeTab === "general" && (
        <form onSubmit={saveContent} className="space-y-6">
          <Section title="Hero Section">
            <Input label="Title" value={content.hero_title} onChange={(v) => setContent({ ...content, hero_title: v })} />
            <TextArea label="Description" value={content.hero_description} onChange={(v) => setContent({ ...content, hero_description: v })} />
          </Section>
          <Section title="Contact Info">
            <Input label="Email" value={content.contact_email} onChange={(v) => setContent({ ...content, contact_email: v })} />
            <Input label="Phone" value={content.contact_phone} onChange={(v) => setContent({ ...content, contact_phone: v })} />
          </Section>
          <Section title="About Section">
            <TextArea label="Intro Paragraph" value={content.about_intro} onChange={(v) => setContent({ ...content, about_intro: v })} />
            <TextArea label="Vision" value={content.vision_text} onChange={(v) => setContent({ ...content, vision_text: v })} />
            <TextArea label="Mission" value={content.mission_text} onChange={(v) => setContent({ ...content, mission_text: v })} />
          </Section>
          <button className="bg-green-900 text-white px-6 py-2 rounded font-bold">Save Changes</button>
        </form>
      )}

      {/* --- TEAM TAB --- */}
      {activeTab === "team" && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-yellow-600">Team Members</h2>
            <button onClick={addTeamMember} className="bg-green-900 text-white px-4 py-2 rounded">+ Add Member</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {team.map((member) => (
              <div key={member.id} className="border p-4 rounded bg-gray-50 shadow-sm">
                <ImageUploader 
                  label="Photo" 
                  currentUrl={member.image_url} 
                  onUpload={(url) => updateTeamMember(member.id, "image_url", url)} 
                />
                <Input label="Name" value={member.name} onChange={(v) => updateTeamMember(member.id, "name", v)} />
                <Input label="Role" value={member.role} onChange={(v) => updateTeamMember(member.id, "role", v)} />
                <TextArea label="Bio" value={member.bio} onChange={(v) => updateTeamMember(member.id, "bio", v)} />
                <Input label="Order" value={member.display_order} type="number" onChange={(v) => updateTeamMember(member.id, "display_order", v)} />
                <button onClick={() => deleteTeamMember(member.id)} className="text-red-600 text-sm mt-2 underline">Delete Member</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- SERVICES TAB --- */}
      {activeTab === "services" && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-yellow-600">Services</h2>
            <button onClick={addService} className="bg-green-900 text-white px-4 py-2 rounded">+ Add Service</button>
          </div>
          <div className="space-y-4">
            {services.map((svc) => (
              <div key={svc.id} className="border p-4 rounded bg-white shadow-sm">
                <Input label="Service Name" value={svc.name} onChange={(v) => updateService(svc.id, "name", v)} />
                <TextArea label="Description" value={svc.description} onChange={(v) => updateService(svc.id, "description", v)} />
                <Input label="Order" value={svc.display_order} type="number" onChange={(v) => updateService(svc.id, "display_order", v)} />
                <button onClick={() => deleteService(svc.id)} className="text-red-600 text-sm mt-2 underline">Delete Service</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Simple Helper Components for Layout
function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded border border-gray-200">
      <h3 className="text-lg font-bold text-yellow-600 mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: any) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
      <input 
        type={type} 
        value={value || ""} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full p-2 border rounded focus:ring-2 focus:ring-green-900 outline-none" 
      />
    </div>
  );
}

function TextArea({ label, value, onChange }: any) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
      <textarea 
        value={value || ""} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full p-2 border rounded focus:ring-2 focus:ring-green-900 outline-none h-24" 
      />
    </div>
  );
}
