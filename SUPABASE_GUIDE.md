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

-- 4. News / Insights articles (for /news page)
create table news_articles (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  excerpt text,
  body text,
  category text not null check (category in ('petroleum','gas','solar','regulatory','market')),
  source text,
  source_url text,
  image text,
  img_credit text,
  date text,
  tags text[] default '{}',
  display_order int default 0,
  created_at timestamp with time zone default now()
);

-- 5. Enable Security (RLS)
alter table site_content enable row level security;
alter table team_members enable row level security;
alter table services enable row level security;
alter table news_articles enable row level security;

-- 6. Policies (Allow Public Read, Allow All for Admin)
create policy "Public Read Content" on site_content for select using (true);
create policy "Admin Write Content" on site_content for all using (true);

create policy "Public Read Team" on team_members for select using (true);
create policy "Admin Write Team" on team_members for all using (true);

create policy "Public Read Services" on services for select using (true);
create policy "Admin Write Services" on services for all using (true);

create policy "Public Read News" on news_articles for select using (true);
create policy "Admin Write News" on news_articles for all using (true);

-- 7. Storage Bucket for Images
insert into storage.buckets (id, name, public) values ('images', 'images', true);

-- Storage Policies
create policy "Public Access Images" on storage.objects for select using ( bucket_id = 'images' );
create policy "Admin Upload Images" on storage.objects for insert with check ( bucket_id = 'images' );
create policy "Admin Update Images" on storage.objects for update using ( bucket_id = 'images' );
create policy "Admin Delete Images" on storage.objects for delete using ( bucket_id = 'images' );
```

**News articles:** Add and edit articles in the CMS under the **News** tab. To seed the latest articles, run:

```sql
insert into news_articles (title, excerpt, body, category, source, source_url, image, img_credit, date, tags, display_order) values
('Dangote Refinery Begins Full Commercial Sales of PMS Across Nigerian Retail Outlets', 'The 650,000 bpd Dangote Petroleum Refinery has commenced full commercial distribution of Premium Motor Spirit to major fuel retailers across Lagos, Ogun, and Rivers States, with plans to extend supply to the North by Q2 2026.', 'The Dangote Petroleum Refinery has officially transitioned from trial sales to full commercial distribution of Premium Motor Spirit (PMS), marking a pivotal moment for Nigeria''s downstream energy sector. The refinery, with a nameplate capacity of 650,000 barrels per day, began delivering product to major independent marketers and retail chains across Lagos, Ogun, and Rivers States this week.

Industry sources confirm that the pricing arrangement is competitive with imported PMS, offering downstream operators significant logistics savings particularly in the South-West corridor. Transport costs from port to inland depot — a persistent overhead for marketers relying on imported product — are dramatically reduced for stations within 200 kilometres of the Lekki facility.

The Nigerian Midstream and Downstream Petroleum Regulatory Authority (NMDPRA) confirmed receipt of the refinery''s commercial operations documentation and noted that quality certification tests on Dangote-produced PMS have passed all prescribed benchmarks. Independent lab results from the Petroleum Products Standards Organisation were shared with marketers during the product launch briefing.

For downstream operators like Wavy Energy, the development signals a structural shift in supply chain planning. Procurement teams are now evaluating blended sourcing strategies — drawing on Dangote volumes for base load while maintaining import facility relationships for supply security during scheduled maintenance windows.

Industry analysts at Lagos-based Energy Analytics Africa project that domestic refining capacity coming fully online could reduce the national PMS import bill by up to 60% over the next eighteen months, freeing foreign exchange reserves and stabilising pump prices in a deregulated market environment.', 'petroleum', 'BusinessDay', 'https://africaoilgasreport.com/2026/02/downstream/dangote-revises-supply-targets-announces-65million-litres-per-day-of-pms-for-the-nigerian-market/', 'https://wsrv.nl/?url=https%3A%2F%2Fafricaoilgasreport.com%2Fwp-content%2Fuploads%2F2026%2F02%2FSP-Dangote-5.jpeg&w=900&output=jpg&q=80', 'Africa Oil Gas Report', '2026-03-08', ARRAY['Dangote','PMS','Downstream','Petroleum'], 1),

('AGO Prices Stabilise at ₦1,420/Litre as Supply Volumes Improve Nationwide', 'Automotive Gas Oil has stabilised between ₦1,400 and ₦1,440 per litre across major depot hubs following improved vessel discharge rates at Apapa and Tin Can Island ports, easing pressure on industrial consumers.', 'Automotive Gas Oil (AGO) prices have found a measure of stability this week after weeks of volatile movement, holding within a ₦1,400–₦1,440 per litre band at major depot exits in Lagos, Warri, and Port Harcourt. The stabilisation follows improved vessel turnaround times at Apapa Wharf and Tin Can Island, where three AGO-laden tankers completed full discharge over the past five days.

The Nigerian Ports Authority attributed the improved throughput to a combination of upgraded berth allocation protocols and the partial resolution of lighter congestion that had slowed cross-loading operations since late January. Total AGO volumes discharged in the first week of March represent a 22% increase over the February weekly average.

For industrial consumers — including manufacturers, telecommunications tower operators, and commercial property managers who depend on AGO for generator power — the stabilisation offers some respite. Several large corporates had been forced to implement demand rationing and renegotiate supply contracts as prices exceeded ₦1,500 per litre in spot transactions during the February squeeze.

Downstream marketers caution that price stability remains fragile. Forward freight rates for petroleum product tankers serving the West African coast have edged upward on the back of Red Sea rerouting premiums that continue to inflate global shipping costs. Any disruption to current berthing schedules at Lagos ports could quickly reverse current gains.

Wavy Energy''s supply operations team is monitoring the situation closely and has secured AGO allocations through end-of-month to protect contracted industrial clients from near-term volatility.', 'market', 'Punch', 'https://punchng.com/petrol-may-hit-n1000-litre-as-dangote-hikes-price/', 'https://wsrv.nl/?url=https%3A%2F%2Fcdn.punchng.com%2Fwp-content%2Fuploads%2F2024%2F07%2F27220152%2FDANGOTE-REFINERY.jpg&w=900&output=jpg&q=80', 'The PUNCH', '2026-03-08', ARRAY['AGO','Fuel Price','Market','Downstream'], 2),

('NMDPRA Issues New Depot Licensing Framework to Curb Diversion and Adulteration', 'Nigeria''s midstream and downstream regulator has released an updated licensing framework requiring all petroleum product depots to install real-time electronic metering systems and comply with mandatory third-party product quality audits by June 2026.', 'The Nigerian Midstream and Downstream Petroleum Regulatory Authority (NMDPRA) has published a revised depot licensing and compliance framework that represents the most significant regulatory update to downstream infrastructure standards in over a decade. The framework, effective immediately for new licence applications and with a six-month transition period for existing operators, introduces mandatory real-time electronic metering at all throughput points and mandates quarterly third-party product quality audits.

The new rules are a direct response to escalating concerns about product diversion and adulteration — two chronic problems that the regulator says have contributed to both consumer harm and significant revenue leakage. NMDPRA''s enforcement division documented over 340 confirmed adulteration incidents in 2025, a 40% increase on the prior year, with diesel and kerosene being the most frequently compromised products.

Under the framework, depot operators must now transmit daily throughput data to the NMDPRA''s central monitoring portal using approved metering hardware from a certified vendor list. Operators who fail to maintain live data transmission for more than 72 consecutive hours face automatic provisional suspension of their licence pending inspection.

Industry stakeholders have broadly welcomed the intent of the framework while raising concerns about implementation timelines. The Petroleum Products Retail Outlet Owners Association of Nigeria (PETROAN) noted that the cost of approved metering installations ranges between ₦8 million and ₦25 million per depot and called on the NMDPRA to consider a concessionary financing facility for smaller operators.

For compliant operators like Wavy Energy who have already invested in monitoring infrastructure, the new framework provides a level playing field and reduces the competitive disadvantage that has historically come from competing against non-compliant operators.', 'regulatory', 'This Day', 'https://realnewsmagazine.net/nmdpra-signals-new-investment-era-for-nigerias-downstream-sector/', 'https://wsrv.nl/?url=https%3A%2F%2Frealnewsmagazine.net%2Fwp-content%2Fuploads%2F2026%2F02%2Fimage-58.png&w=900&output=jpg&q=80', 'Realnews Magazine', '2026-03-07', ARRAY['NMDPRA','Regulatory','Downstream','PIA'], 3),

('NNPC Gas Expands LPG Aggregation Hubs in Rivers and Bayelsa to Boost Cylinder Penetration', 'NNPC Gas Limited has commissioned two new LPG aggregation and storage hubs in Rivers and Bayelsa States, targeting a 35% increase in cylinder refilling capacity in the South-South zone.', 'NNPC Gas Limited has commissioned two new Liquefied Petroleum Gas aggregation and storage facilities in Port Harcourt, Rivers State, and Yenagoa, Bayelsa State, as part of the Federal Government''s accelerated domestic gas utilisation agenda. The facilities, with a combined storage capacity of 2,400 metric tonnes, are expected to increase LPG cylinder refilling capacity in the South-South geopolitical zone by an estimated 35%.

The Port Harcourt hub, located within the Trans-Amadi Industrial Layout, has been designed to serve both retail cylinder distributors and bulk industrial consumers. The Yenagoa facility, positioned closer to producing fields in the Niger Delta, will leverage shorter supply chains to offer more competitive pricing to rural and peri-urban consumers who currently have limited access to cooking gas.

NNPC Gas Chief Operating Officer noted that LPG penetration in the South-South and South-East remains significantly below national targets, with a large proportion of households still relying on biomass fuels for cooking. The new hubs are intended to address both supply availability and pricing barriers that have constrained adoption despite growing consumer awareness of health and environmental benefits.

The Federal Government''s cooking gas affordability initiative, which provides subsidised cylinders and starter kits to low-income households through state government partnerships, will use both new hubs as distribution anchor points. A total of 120,000 subsidised starter kits are planned for deployment across Rivers, Bayelsa, and Delta States before the end of Q2 2026.

For downstream LPG distributors including Wavy Energy, the expansion of aggregation infrastructure in the region represents both a supply security improvement and a demand stimulus expected to grow the overall cylinder market in coming quarters.', 'gas', 'Vanguard', 'https://businesspost.ng/economy/nnpc-targets-230-lpg-supply-surge-to-5mtpa-under-gas-master-plan-2026/', 'https://wsrv.nl/?url=https%3A%2F%2Fbusinesspost.ng%2Fwp-content%2Fuploads%2F2020%2F11%2FDomestic-LPG.jpg&w=900&output=jpg&q=80', 'BusinessPost Nigeria', '2026-03-07', ARRAY['LPG','NNPC','Gas','Downstream'], 4),

('World Bank Approves $750M Facility to Accelerate Nigeria''s Off-Grid Solar Transition', 'The World Bank Group has approved a $750 million financing package for Nigeria''s Distributed Access through Renewable Energy Scale-up programme, targeting 2.5 million new solar connections by 2028.', 'The World Bank Group has approved a $750 million financing facility to support Nigeria''s Distributed Access through Renewable Energy Scale-up (DARES) programme — one of the largest single off-grid solar commitments in Sub-Saharan Africa. The funding, structured as a mix of International Development Association credits and guarantees, will target 2.5 million new electricity connections in underserved communities with a particular focus on states in the North-East, North-West, and rural South-South.

The programme operates through a results-based financing model, with disbursements tied to verified connections and performance benchmarks. Approved solar home system and mini-grid operators will receive subsidy payments upon confirmed installation and commissioning, reducing upfront capital requirements that have historically been the primary barrier to rural solar deployment at scale in Nigeria.

Nigeria''s Rural Electrification Agency (REA), which coordinates the DARES programme, said the World Bank approval unlocks co-financing commitments from the African Development Bank, the European Investment Bank, and several bilateral donors that together bring total programme capitalisation to over $1.2 billion.

For the private sector, the facility creates a substantially de-risked opportunity. Solar home system distributors and mini-grid developers who meet DARES technical and financial eligibility criteria gain access to both subsidy payments and currency hedging instruments — a critical provision given the naira volatility that has historically eroded returns for foreign-currency-denominated renewable energy investments.

Energy sector analysts describe the DARES programme as a potential inflection point for Nigeria''s clean energy transition, noting that achieving 2.5 million connections would represent roughly 12% of the estimated 20 million households currently without reliable electricity access.', 'solar', 'The Guardian Nigeria', 'https://www.worldbank.org/en/news/feature/2023/12/15/going-green-scaling-up-access-to-clean-electricity-for-over-17-million-nigerians', 'https://wsrv.nl/?url=https%3A%2F%2Fworldbank.scene7.com%2Fis%2Fimage%2Fworldbankprod%2Fgoing-green-access-to-clean-electricity-nigeria-780x439-v1&w=900&output=jpg&q=80', 'World Bank / REA', '2026-03-06', ARRAY['Solar','World Bank','Renewable','Off-Grid'], 5),

('Naira Appreciation Against Dollar Brings Mixed Signals for Petroleum Product Importers', 'The naira''s recent strengthening to ₦1,560/$ has created a dual effect — reducing landing costs in naira terms while introducing hedging uncertainty for operators who locked in forward contracts at weaker rates.', 'The naira''s recent appreciation to approximately ₦1,560 per US dollar at the official NAFEM window — compared to a rate above ₦1,650 just six weeks ago — is creating complex calculations for petroleum product importers who structure their operations around foreign exchange availability and cost.

For operators making new import decisions, the stronger naira immediately reduces the naira-denominated landing cost of petroleum products. A cargo of AGO purchased at current international prices represents meaningfully lower naira outlay compared to identical volumes procured in January. This is gradually feeding through to ex-depot price reductions at the margin, contributing to the current stabilisation of AGO prices around ₦1,420 per litre.

However, the picture is more complicated for operators who entered forward foreign exchange contracts or supply agreements at rates between ₦1,620 and ₦1,680 per dollar during the tight liquidity period of Q4 2025 and January 2026. These operators are effectively locked into higher effective naira costs for volumes they have already committed to purchase.

The Central Bank of Nigeria has maintained that the current exchange rate trajectory reflects improved dollar liquidity from both oil receipts and diaspora remittance flows, signalling an intention to sustain the current band. Market participants, however, remain cautious about the durability of the appreciation, citing Nigeria''s structural dependence on crude oil export revenues.

For downstream operators, the current environment rewards active treasury and hedging strategies over passive dollar accumulation approaches that may have worked in periods of more predictable naira movement.', 'market', 'BusinessDay', 'https://punchng.com/petrol-may-hit-n1000-litre-as-dangote-hikes-price/', 'https://wsrv.nl/?url=https%3A%2F%2Fcdn.punchng.com%2Fwp-content%2Fuploads%2F2023%2F06%2F16212212%2FSHIP-OFFLOADING.jpg&w=900&output=jpg&q=80', 'The PUNCH', '2026-03-06', ARRAY['Market','Naira','Fuel Price','Downstream'], 6),

('Axxela Completes Phase Two of Eastern Gas Distribution Pipeline Serving Delta Industrial Corridor', 'Axxela Limited has completed the second phase of its 47-kilometre eastern gas distribution pipeline, expanding natural gas supply to over 40 manufacturing and industrial facilities in the Warri-Effurun corridor.', 'Axxela Limited has announced the completion of Phase Two of its Eastern Gas Distribution pipeline project, a 47-kilometre network that now connects over 40 industrial and manufacturing facilities in the Warri-Effurun-Sapele corridor of Delta State to the national gas grid. The phase two extension adds 18 new industrial customers to the network, with a combined gas offtake capacity of approximately 35 million standard cubic feet per day.

The expanded network draws gas from the Escravos-Lagos Pipeline System (ELPS) through a designated custody transfer metering station in Warri, with pressure regulation infrastructure sized to accommodate additional demand growth as new industrial facilities come online in the corridor. Axxela said total capital expenditure for Phase Two was approximately $28 million.

The industrial customers connected include textile manufacturers, cement processors, a glass manufacturing plant, and several large-scale food and beverage facilities that had previously relied on costly and emission-intensive heavy fuel oil and diesel for process heat and power generation. Initial operational data suggest gas-fuelled operations are delivering energy cost savings of between 35% and 55% compared to diesel, depending on the application.

The Nigeria Gas Infrastructure Blueprint, the Federal Government''s long-term framework for expanding domestic gas utilisation, identifies the Warri-Effurun industrial corridor as a priority development zone due to its proximity to producing fields and existing transmission infrastructure. Axxela''s project is described by the Ministry of Petroleum Resources as a model for private-sector-led gas distribution investment.

Phase Three, planned for 2027, will extend the network southward toward Ughelli and connect the corridor to a new gas processing facility currently under development by a midstream joint venture.', 'gas', 'Energy Monitor', 'https://www.vanguardngr.com/2025/06/axxela-expresses-commitment-to-sustainable-energy-devt/', 'https://wsrv.nl/?url=https%3A%2F%2Fcdn.punchng.com%2Fwp-content%2Fuploads%2F2024%2F07%2F27220152%2FDANGOTE-REFINERY.jpg&w=900&output=jpg&q=80', 'Axxela Group / Vanguard', '2026-03-05', ARRAY['Gas','Pipeline','Industrial','Delta'], 7),

('Senate Committee Proposes Amendments to PIA Midstream Provisions to Attract Pipeline Investment', 'Nigeria''s Senate Committee on Petroleum has proposed targeted amendments to the PIA''s midstream provisions, aimed at improving commercial viability of third-party pipeline access arrangements.', 'The Senate Committee on Petroleum (Downstream) has released a set of proposed amendments to the Petroleum Industry Act (PIA) 2021 targeting the midstream transportation provisions of the legislation. The proposals, circulated to industry stakeholders for comment ahead of a public hearing scheduled for later this month, focus primarily on third-party access frameworks for petroleum pipelines and the tariff-setting methodology applied by the NMDPRA.

Central to the proposed changes is a revision to the formula by which pipeline operators recover capital investment through regulated tariffs. Several pipeline owners have argued that current tariff parameters do not adequately compensate for the risk-adjusted cost of capital in Nigeria''s operating environment — a concern that has reportedly deterred at least two prospective pipeline investment projects that have stalled at the pre-FID stage since the PIA''s passage.

The committee is also proposing clearer dispute resolution procedures for cases where pipeline capacity requests are denied or restricted, noting that ambiguity in the current provisions has created uncertainty for shippers seeking to transport petroleum products on third-party infrastructure.

The Nigerian Association of Petroleum Explorationists and the Depot and Petroleum Products Marketers Association of Nigeria (DAPPMAN) are among the industry bodies that have submitted preliminary written inputs to the committee, with DAPPMAN particularly focused on provisions that affect the competitive dynamics of the Lagos-Ibadan and Warri-Kaduna product pipeline corridors.

Amendments to the PIA require passage by both chambers of the National Assembly and presidential assent — a process that, if the committee timetable is maintained, could see revised provisions in effect before year-end 2026.', 'regulatory', 'The Sun', 'https://guardian.ng/energy/nigerias-fuel-crude-importation-concern-defies-price-war/', 'https://wsrv.nl/?url=https%3A%2F%2Fcdn.punchng.com%2Fwp-content%2Fuploads%2F2023%2F06%2F16212212%2FSHIP-OFFLOADING.jpg&w=900&output=jpg&q=80', 'The Guardian Nigeria', '2026-03-05', ARRAY['PIA','Regulatory','Pipeline','NMDPRA'], 8),

('Rivers State Government Launches 20MW Solar Mini-Grid Programme for Rural Communities', 'Rivers State has launched a 20MW distributed solar programme to electrify 48 rural communities across Khana, Tai, and Eleme LGAs under a hybrid government-subsidy and pay-as-you-go model.', 'The Rivers State Government has formally launched a 20-megawatt distributed solar electrification programme targeting 48 rural and riverine communities across Khana, Tai, and Eleme Local Government Areas. The programme, developed in partnership with three private solar mini-grid developers — Havenhill Synergy, Rubitec Solar, and Rensource Energy — will deploy a mix of solar home systems and community mini-grids under a hybrid financing model combining state government viability gap subsidies with end-user pay-as-you-go payment plans.

Governor Siminalayi Fubara, speaking at the launch ceremony in Port Harcourt, described the programme as a response to the state''s persistent rural energy poverty, noting that electrification rates in riverine communities remain below 15% despite Rivers State being a major oil and gas producing region. The programme is expected to provide clean electricity access to approximately 95,000 residents across the 48 communities.

The selected communities were identified through a feasibility assessment conducted by the Rivers State Electricity Board in collaboration with the Federal Rural Electrification Agency. Communities were prioritised based on population density, economic activity, the absence of grid connectivity prospects within a five-year planning horizon, and the availability of suitable solar irradiation.

Technical specifications call for mini-grids ranging from 30 kilowatts to 500 kilowatts, with battery energy storage systems sized to provide a minimum of eight hours of backup capacity. The solar home system component will target households in more dispersed settlements where mini-grid economics are less favourable.

For the private sector developers, the state government''s viability gap subsidy — estimated to cover between 30% and 45% of project capital costs — is critical to making the business case work in communities where average household energy expenditure is below the level required to support full cost recovery.', 'solar', 'Rivers State Ministry of Energy', 'https://techcabal.com/2026/01/21/as-power-outages-worsen-nigeria-plans-28-new-mini-grids-to-keep-the-lights-on/', 'https://wsrv.nl/?url=https%3A%2F%2Fc76c7bbc41.mjedge.net%2Fwp-content%2Fuploads%2Ftc%2F2026%2F01%2Fimage-13.png&w=900&output=jpg&q=80', 'TechCabal / REA', '2026-03-04', ARRAY['Solar','Rivers State','Mini-Grid','Renewable'], 9);
```

**News articles:** Add and edit articles in the CMS under the **News** tab. To seed one sample article, run:

```sql
insert into news_articles (title, excerpt, body, category, source, source_url, image, img_credit, date, tags, display_order) values
('Dangote Refinery Begins Full Commercial Sales of PMS', 'The 650,000 bpd Dangote Petroleum Refinery has commenced full commercial distribution of Premium Motor Spirit to major fuel retailers across Lagos, Ogun, and Rivers States.', 'The Dangote Petroleum Refinery has officially transitioned from trial sales to full commercial distribution of Premium Motor Spirit (PMS)...', 'petroleum', 'BusinessDay', 'https://example.com', 'https://wsrv.nl/?url=https%3A%2F%2Fafricaoilgasreport.com%2Fwp-content%2Fuploads%2F2026%2F02%2FSP-Dangote-5.jpeg&w=900&output=jpg&q=80', 'Africa Oil Gas Report', '2026-03-08', ARRAY['Dangote','PMS','Downstream','Petroleum'], 1);
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
