# Supabase Setup Guide for Wavy Energy

Follow these steps to enable the Admin Panel for your website.

## 1. Create a Project
1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Create a new project named `Wavy Energy`.

## 2. Setup the Database (Full CMS)
Go to the **SQL Editor** in the left sidebar and run this script. It handles text, team members, services, and images.

```sql
-- 1. Site Content (Key-Value pairs for static text)
create table site_content (
  key text primary key,
  value text not null,
  updated_at timestamp with time zone default now()
);

-- 2. Team Members
create table team_members (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text not null,
  bio text,
  image_url text,
  display_order int default 0,
  created_at timestamp with time zone default now()
);

-- 3. Services
create table services (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null,
  tags text[], -- Array of strings
  display_order int default 0,
  created_at timestamp with time zone default now()
);

-- 4. Enable Security (RLS)
alter table site_content enable row level security;
alter table team_members enable row level security;
alter table services enable row level security;

-- 5. Policies (Allow Public Read, Allow All for Admin)
create policy "Public Read Content" on site_content for select using (true);
create policy "Admin Write Content" on site_content for all using (true);

create policy "Public Read Team" on team_members for select using (true);
create policy "Admin Write Team" on team_members for all using (true);

create policy "Public Read Services" on services for select using (true);
create policy "Admin Write Services" on services for all using (true);

-- 6. Storage Bucket for Images
insert into storage.buckets (id, name, public) values ('images', 'images', true);

-- Storage Policies
create policy "Public Access Images" on storage.objects for select using ( bucket_id = 'images' );
create policy "Admin Upload Images" on storage.objects for insert with check ( bucket_id = 'images' );
create policy "Admin Update Images" on storage.objects for update using ( bucket_id = 'images' );
create policy "Admin Delete Images" on storage.objects for delete using ( bucket_id = 'images' );
```

## 3. Seed Initial Data
Run this to populate your CMS with the current site data.

```sql
-- General Text (matches all editable content on the site)
insert into site_content (key, value) values 
  -- Hero
  ('hero_title', 'Fueling Growth with Clean Energy Solutions.'),
  ('hero_description', 'Wavy Energy Company Limited is an integrated downstream petroleum and energy engineering company — delivering institutional-grade petroleum supply, gas plant engineering, and solar power solutions nationwide.'),
  ('hero_tag', 'Lagos, Nigeria · Downstream Energy · Clean Power'),
  ('stats_litres', '150K'),
  ('stats_states', '36+'),
  ('stats_lines', '5'),
  ('stats_doc', '100%'),
  ('band_items', 'Petroleum Supply|Gas Plant Engineering|Solar Power Systems|NMDPRA Compliant|100% Nigerian-Owned|Infrastructure Maintenance'),

  -- About
  ('about_intro', 'Wavy Energy Limited is an integrated downstream petroleum and energy engineering company, headquartered in Lagos, Nigeria. Prior to formal incorporation, the company''s founders and technical partners had been actively engaged in petroleum distribution, fuel logistics coordination, and energy system deployment within the Nigerian market.'),
  ('about_body_1', 'This period of pre-incorporation activity enabled the organisation to build strong industry relationships, operational competence, and market credibility. The leadership team brings longstanding experience in downstream petroleum logistics and energy engineering, with incorporation serving to formalise existing operations under a limited liability structure to strengthen governance, regulatory compliance, risk management, and scalable growth.'),
  ('about_body_2', 'Since incorporation, Wavy Energy has consolidated its operational framework and expanded its service delivery capacity — building upon its prior field experience to deliver structured petroleum supply and energy system installations for commercial and institutional clients across Lagos, the South-West region, and national markets through licensed partners.'),
  ('about_callout', 'The company continues to leverage its pre-registration operational foundation, technical expertise, and established networks to execute projects efficiently, maintain high service standards, and position itself as a reliable participant within Nigeria''s evolving energy sector.'),

  -- Vision & Mission
  ('vision_text', 'To be Nigeria''s most technically credible and operationally dependable energy company — a name that institutions, businesses, and households associate unconditionally with reliability, safety, and professional excellence.'),
  ('mission_text', 'To deliver integrated energy solutions — across petroleum product supply, gas plant engineering, and solar power installation — with a standard of technical competence, safety compliance, and client accountability that defines a new benchmark for energy service providers in Nigeria.'),

  -- HSE
  ('hse_intro', 'In Nigeria''s energy sector, safety and regulatory compliance are not optional — they are the baseline conditions for legitimate, sustainable operation. Wavy Energy treats its HSE obligations as a fundamental component of its operational identity, not a peripheral compliance burden.'),
  ('hse_body', 'All field personnel receive HSE induction before deployment and must comply with the Wavy Energy HSE Code of Conduct throughout every client engagement. Prior to commencing any installation or maintenance engagement, a site-specific risk assessment is conducted and documented.'),
  ('hse_quote', 'No delivery is urgent enough, and no deadline tight enough, to justify a departure from our safety standards. At Wavy Energy, safety is the one area where we never negotiate.'),

  -- Why Choose Us
  ('why_intro', 'Nigeria''s energy services market is dominated by operators whose value propositions focus primarily on price and availability. Wavy Energy differentiates itself through technical competence, disciplined operations, and institutional-grade service standards.'),

  -- Contact & Footer
  ('contact_email', 'contact@wavyenergyltd.com'),
  ('contact_phone', '+234 916 000 8477'),
  ('contact_address', 'Ikeja Lagos State, Nigeria'),
  ('footer_tagline', 'Fueling Growth with Clean Energy Solutions.');

-- Team Members
insert into team_members (name, role, bio, image_url, display_order) values
('Kenneth Martins', 'Group Chief Executive Officer', "At the helm of Wavy Energy, Kenneth Martins provides overall strategic direction and executive oversight, ensuring the company's operations align with its long-term growth objectives and service commitments. His leadership focuses on building a resilient energy company defined by operational discipline, reliability, and sustainable expansion.", '', 1),
('Tolulope Ogunleye', 'Group Executive Director', 'Tolulope Ogunleye brings over a decade of experience in corporate governance and strategic leadership. His role centres on strengthening organisational structure, enhancing governance frameworks, and positioning the company for scalable growth through structured planning, institutional partnerships, and disciplined executive coordination.', '', 2),
('Engr. Tega Akpo', 'Chief of Operations', 'Engineer Tega Akpo brings more than ten years of operational leadership within the energy sector. He oversees technical delivery, operational supervision, and project execution, ensuring that all supply, engineering, and energy system deployments are conducted with efficiency, safety compliance, and professional oversight.', '', 3);

-- Services
insert into services (name, description, tags, display_order) values
('Bulk Petroleum Product Supply', 'Large-volume procurement and logistics management for Automotive Gas Oil (AGO), Premium Motor Spirit (PMS), Liquefied Petroleum Gas (LPG), and Dual Purpose Kerosene (DPK). Our supply chain is designed for volume, velocity, and reliability — with haulage partnerships, product quality controls, and delivery documentation protocols embedded across every transaction.', ARRAY['AGO (Diesel)', 'PMS (Petrol)', 'LPG (Cooking Gas)'], 1),
('Gas Plant Design & Installation', 'Engineering, fabrication, and commissioning of LPG gas plant systems for residential properties, hotels, hospitals, schools, restaurants, and commercial facilities. Our engineering team conducts site surveys, load assessments, and system specifications before any construction begins. All installations undergo a formal commissioning and safety verification process before handover.', ARRAY['Site Survey', 'System Design', 'Safety Certification'], 2),
('Retail & Wholesale Distribution', 'Targeted supply of petroleum products to smaller commercial, hospitality, and residential clients requiring flexible volume and delivery scheduling. Wavy Energy provides structured retail and wholesale distribution services with clear pricing, defined lead times, and documented delivery processes.', ARRAY['Flexible Volume', 'Scheduled Delivery'], 3),
('Gas Infrastructure Maintenance', 'Scheduled and emergency technical maintenance of gas plants, storage tanks, pumping systems, pipelines, and dispensing equipment. Our technical team provides periodic inspection programmes, preventive maintenance schedules, and emergency repair services for all gas infrastructure. All maintenance activities are documented and reconciled against client safety records.', ARRAY['Preventive Maintenance', 'Emergency Repairs'], 4),
('Solar Power Systems', 'End-to-end delivery of solar photovoltaic power systems for residential, commercial, and institutional clients. We conduct electrical load analysis and site assessment, supply and install solar panels, inverter systems, battery storage, and all balance-of-system components, and provide ongoing technical support and warranty management after installation.', ARRAY['Load Analysis', 'Battery Storage', 'Support'], 5);
```


## 4. Get Your API Keys
1. Go to **Project Settings** > **API**.
2. Copy the **Project URL** and **anon public** key.
3. Open your `.env.local` file in your code and paste them:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

## 5. Deployment (Vercel)
When you deploy to Vercel, make sure to add these same environment variables in the Vercel Dashboard Settings.

## 6. Accessing the Admin Panel
- **Locally:** Go to `admin.localhost:3000` (or `localhost:3000/admin`).
- **Production:** Once your domain is set up, go to `admin.wavyenergy.com`.
