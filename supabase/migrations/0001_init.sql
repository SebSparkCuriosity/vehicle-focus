-- Vehicle Focus: The Garage
-- Initial schema. Mirrors lib/types.ts so the demo store can be swapped for Supabase.
-- Security model:
--   * team members (Vehicle Focus staff) can read and write everything
--   * a client owner and their delegates can read only their own collection
--   * delegates need can_book to raise requests
--   * history events flagged visible_to_client = false are never readable by clients

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type tier as enum ('gold', 'platinum', 'black-label');
create type contact_preference as enum ('WhatsApp', 'Phone', 'Email');
create type vehicle_status as enum ('ready', 'in-storage', 'charging', 'at-service', 'in-transit', 'attention');
create type body_style as enum ('coupe', 'gt', 'suv', 'roadster', 'saloon');
create type powertrain as enum ('petrol', 'hybrid', 'electric');
create type location_kind as enum ('client-home', 'vf-storage', 'specialist', 'in-transit', 'airport');
create type check_frequency as enum ('weekly', 'fortnightly', 'monthly', 'quarterly');
create type due_kind as enum ('MOT', 'Insurance', 'Registration', 'Service', 'Warranty', 'Tracker subscription');
create type history_kind as enum ('check', 'service', 'movement', 'detailing', 'document', 'valuation', 'note', 'handover');
create type document_kind as enum ('Registration', 'Insurance', 'Service record', 'Invoice', 'Condition report', 'Purchase', 'Shipping', 'Warranty');
create type request_type as enum ('ready', 'relocation', 'service', 'detailing', 'storage', 'valuation', 'other');
create type request_status as enum ('new', 'scheduled', 'in-progress', 'done', 'cancelled');
create type job_kind as enum ('check', 'relocation', 'service', 'detailing', 'handover', 'collection', 'photography');
create type job_status as enum ('planned', 'in-progress', 'done');
create type member_role as enum ('owner', 'Personal assistant', 'Family office', 'Wealth manager', 'Partner', 'Driver');
create type lead_source as enum ('Website', 'Readiness check', 'Referral', 'Adviser', 'Event');
create type lead_stage as enum ('new', 'contacted', 'audit-booked', 'proposal', 'won', 'lost');
create type partner_kind as enum ('Transport', 'Detailing', 'Specialist workshop', 'Storage', 'Photography', 'Inspection', 'Shipping');
create type region as enum ('Jersey', 'Guernsey', 'UK', 'Europe', 'Worldwide');

-- ---------------------------------------------------------------------------
-- People
-- ---------------------------------------------------------------------------
create table team_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users (id) on delete set null,
  name text not null,
  role text not null,
  initials text not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  first_name text not null,
  email text not null,
  phone text,
  tier tier not null,
  client_since date not null default current_date,
  home_base text,
  nda boolean not null default false,
  contact_preference contact_preference not null default 'Email',
  notes text, -- team-only; never selected by client-facing queries (see view below)
  monthly_fee numeric(10, 2) not null default 0,
  created_at timestamptz not null default now()
);

-- Owner and delegates (PAs, family offices, wealth managers) who can sign in for a client
create table client_members (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  role member_role not null,
  can_book boolean not null default false,
  created_at timestamptz not null default now(),
  unique (client_id, email)
);

-- ---------------------------------------------------------------------------
-- Vehicles and their records
-- ---------------------------------------------------------------------------
create table vehicles (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients (id) on delete cascade,
  make text not null,
  model text not null,
  variant text,
  year int not null,
  colour text,
  paint_hex text,
  registration text,
  vin_last6 text,
  body_style body_style not null default 'coupe',
  powertrain powertrain not null default 'petrol',
  mileage int not null default 0,
  status vehicle_status not null default 'ready',
  status_note text,
  location_name text not null,
  location_kind location_kind not null,
  battery_voltage numeric(4, 2),
  battery_health_pct int,
  on_conditioner boolean not null default false,
  tyres_current jsonb not null default '{}'::jsonb, -- {fl, fr, rl, rr}
  tyres_target jsonb not null default '{}'::jsonb,
  tyre_unit text not null default 'psi',
  check_frequency check_frequency not null default 'monthly',
  last_check_at timestamptz,
  next_check_at timestamptz,
  purchase_price numeric(12, 2),
  purchase_date date,
  specialist_notes text,
  created_at timestamptz not null default now()
);

create table vehicle_valuations (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references vehicles (id) on delete cascade,
  valued_on date not null,
  value numeric(12, 2) not null,
  source text not null
);

create table due_items (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references vehicles (id) on delete cascade,
  kind due_kind not null,
  due_date date not null,
  notes text
);

create table history_events (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references vehicles (id) on delete cascade,
  at timestamptz not null default now(),
  kind history_kind not null,
  title text not null,
  detail text,
  by_name text not null,
  by_team_member uuid references team_members (id),
  cost numeric(10, 2),
  readings jsonb, -- {batteryVoltage, tyres{fl,fr,rl,rr}, mileage, fluidsOk, exteriorOk, interiorOk}
  visible_to_client boolean not null default true
);

create table documents (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references vehicles (id) on delete cascade,
  title text not null,
  kind document_kind not null,
  doc_date date not null,
  storage_path text, -- Supabase Storage object key, bucket "documents"
  size_kb int,
  extracted jsonb, -- AI-extracted fields (insurer, expiry, amounts) for review
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Operations
-- ---------------------------------------------------------------------------
create table partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind partner_kind not null,
  region region not null,
  contact_name text,
  email text,
  phone text,
  rating int check (rating between 1 and 5),
  notes text
);

create table service_requests (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients (id) on delete cascade,
  vehicle_id uuid not null references vehicles (id) on delete cascade,
  type request_type not null,
  title text not null,
  needed_at timestamptz not null,
  location text not null,
  notes text,
  status request_status not null default 'new',
  created_at timestamptz not null default now(),
  created_by_name text not null,
  created_by_user uuid references auth.users (id),
  assignee_id uuid references team_members (id),
  partner_id uuid references partners (id),
  quote numeric(10, 2)
);

create table jobs (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references vehicles (id) on delete cascade,
  request_id uuid references service_requests (id) on delete set null,
  kind job_kind not null,
  title text not null,
  starts_at timestamptz not null,
  duration_mins int not null default 60,
  assignee_id uuid not null references team_members (id),
  status job_status not null default 'planned',
  location text
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients (id) on delete cascade,
  from_team boolean not null,
  author_name text not null,
  author_user uuid references auth.users (id),
  body text not null,
  at timestamptz not null default now()
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  source lead_source not null default 'Website',
  role text,
  message text,
  cars text,
  readiness_score int,
  stage lead_stage not null default 'new',
  created_at timestamptz not null default now()
);

-- Every time the team opens a client's record
create table client_access_log (
  id bigint generated always as identity primary key,
  team_member_id uuid not null references team_members (id),
  client_id uuid not null references clients (id) on delete cascade,
  resource text not null,
  at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index on client_members (user_id);
create index on vehicles (client_id);
create index on vehicle_valuations (vehicle_id, valued_on);
create index on due_items (due_date);
create index on history_events (vehicle_id, at desc);
create index on documents (vehicle_id);
create index on service_requests (client_id, status);
create index on jobs (starts_at);
create index on messages (client_id, at);
create index on leads (stage, created_at desc);

-- ---------------------------------------------------------------------------
-- Helper functions for RLS (security definer so they can read membership tables)
-- ---------------------------------------------------------------------------
create or replace function is_team() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from team_members where user_id = auth.uid());
$$;

create or replace function my_client_ids() returns setof uuid
language sql stable security definer set search_path = public as $$
  select client_id from client_members where user_id = auth.uid();
$$;

create or replace function can_book_for(target_client uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from client_members
    where user_id = auth.uid() and client_id = target_client and (can_book or role = 'owner')
  );
$$;

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------
alter table team_members enable row level security;
alter table clients enable row level security;
alter table client_members enable row level security;
alter table vehicles enable row level security;
alter table vehicle_valuations enable row level security;
alter table due_items enable row level security;
alter table history_events enable row level security;
alter table documents enable row level security;
alter table partners enable row level security;
alter table service_requests enable row level security;
alter table jobs enable row level security;
alter table messages enable row level security;
alter table leads enable row level security;
alter table client_access_log enable row level security;

-- Team: full access everywhere
create policy team_all on team_members for all using (is_team()) with check (is_team());
create policy team_all on clients for all using (is_team()) with check (is_team());
create policy team_all on client_members for all using (is_team()) with check (is_team());
create policy team_all on vehicles for all using (is_team()) with check (is_team());
create policy team_all on vehicle_valuations for all using (is_team()) with check (is_team());
create policy team_all on due_items for all using (is_team()) with check (is_team());
create policy team_all on history_events for all using (is_team()) with check (is_team());
create policy team_all on documents for all using (is_team()) with check (is_team());
create policy team_all on partners for all using (is_team()) with check (is_team());
create policy team_all on service_requests for all using (is_team()) with check (is_team());
create policy team_all on jobs for all using (is_team()) with check (is_team());
create policy team_all on messages for all using (is_team()) with check (is_team());
create policy team_all on leads for all using (is_team()) with check (is_team());
create policy team_all on client_access_log for all using (is_team()) with check (is_team());

-- Clients and delegates: read their own collection
create policy client_read on client_members for select using (client_id in (select my_client_ids()));
create policy client_read on vehicles for select using (client_id in (select my_client_ids()));
create policy client_read on vehicle_valuations for select
  using (vehicle_id in (select id from vehicles where client_id in (select my_client_ids())));
create policy client_read on due_items for select
  using (vehicle_id in (select id from vehicles where client_id in (select my_client_ids())));
create policy client_read on history_events for select
  using (visible_to_client and vehicle_id in (select id from vehicles where client_id in (select my_client_ids())));
create policy client_read on documents for select
  using (vehicle_id in (select id from vehicles where client_id in (select my_client_ids())));
create policy client_read on jobs for select
  using (vehicle_id in (select id from vehicles where client_id in (select my_client_ids())));
create policy client_read on service_requests for select using (client_id in (select my_client_ids()));
create policy client_read on messages for select using (client_id in (select my_client_ids()));

-- Clients and delegates: limited writes
create policy client_book on service_requests for insert
  with check (can_book_for(client_id) and status = 'new'
              and vehicle_id in (select id from vehicles where client_id = service_requests.client_id));
create policy client_cancel on service_requests for update
  using (can_book_for(client_id) and status = 'new')
  with check (status = 'cancelled');
create policy client_message on messages for insert
  with check (client_id in (select my_client_ids()) and from_team = false);

-- Clients never read the clients table directly (it holds team notes and fees).
-- They use this view, which exposes only safe columns for their own record.
create view my_client_profile with (security_invoker = false) as
  select c.id, c.name, c.first_name, c.tier, c.client_since, c.home_base, c.contact_preference
  from clients c
  where c.id in (select my_client_ids());

-- Leads arrive from the public website through a server action using the service role,
-- so there is deliberately no anon insert policy on leads.
