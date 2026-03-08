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
-- General Text
insert into site_content (key, value) values 
('hero_title', 'Fueling Growth with Clean Energy Solutions.'),
('hero_description', 'Wavy Energy Company Limited is an integrated downstream petroleum and energy engineering company.'),
('contact_email', 'contact@wavyenergy.com'),
('contact_phone', '+234 916 000 8477'),
('about_intro', 'Wavy Energy Limited is an integrated downstream petroleum and energy engineering company, headquartered in Lagos, Nigeria.'),
('vision_text', 'To be Nigeria''s most technically credible and operationally dependable energy company.'),
('mission_text', 'To deliver integrated energy solutions — across petroleum product supply, gas plant engineering, and solar power installation.');

-- Team Members
insert into team_members (name, role, bio, image_url, display_order) values
('Kenneth Martins', 'Group Chief Executive Officer', 'At the helm of Wavy Energy, Kenneth Martins provides overall strategic direction...', '', 1),
('Tolulope Ogunleye', 'Group Executive Director', 'Tolulope Ogunleye brings over a decade of experience in corporate governance...', '', 2),
('Engr. Tega Akpo', 'Chief of Operations', 'Engineer Tega Akpo brings more than ten years of operational leadership...', '', 3);

-- Services
insert into services (name, description, tags, display_order) values
('Bulk Petroleum Product Supply', 'Large-volume procurement and logistics management...', ARRAY['AGO (Diesel)', 'PMS (Petrol)', 'LPG (Cooking Gas)'], 1),
('Gas Plant Design & Installation', 'Engineering, fabrication, and commissioning of LPG...', ARRAY['Site Survey', 'System Design', 'Safety Certification'], 2),
('Retail & Wholesale Distribution', 'Targeted supply of petroleum products to smaller...', ARRAY['Flexible Volume', 'Scheduled Delivery'], 3),
('Gas Infrastructure Maintenance', 'Scheduled and emergency technical maintenance...', ARRAY['Preventive Maintenance', 'Emergency Repairs'], 4),
('Solar Power Systems', 'End-to-end delivery of solar photovoltaic power...', ARRAY['Load Analysis', 'Battery Storage', 'Support'], 5);
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
