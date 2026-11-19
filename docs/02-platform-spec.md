# The Garage: platform spec

**The short version:** Build one platform with three faces: the public website, a client portal ("The Garage") and an operator console that becomes Lawrence's central management system. Take the best of VehicleVault's breadth, but flip its model. VehicleVault is a self-serve app with a supplier marketplace. The Garage is service-led: every check, movement and document in it was done by Vehicle Focus, and the portal is the proof. The demo in this repo runs today on seeded data; wiring it to Supabase is two to three weeks.

---

## What VehicleVault actually is

We pulled apart the public build of vehicle-vault.com. It's a React single-page app built on Lovable, backed by Supabase, positioned as "a bespoke digital concierge platform for vehicle collectors".

It's broad. Six user roles (client, concierge, family office, supplier, driver, admin) across about 50 routes and 45 database tables:

- **For owners:** a garage of vehicles with extended specs, a document vault with AI extraction (Gemini), valuation history and AI desktop valuations, expenses, inspection schedules with walk-around checks, provenance records (exhibitions, literature citations, loans, matching component numbers), a wishlist with listing searches, and an AI maintenance planner.
- **For concierge and family office operators:** client lists, fleet views, a schedule, activity feeds, reports and driver job management.
- **A supplier marketplace:** suppliers apply, list services with availability and blocked dates, take bookings and receive reviews.
- **Admin:** membership and supplier applications, user management, analytics.

Membership is by application, sign-in uses email MFA, and there's a car catalogue (make, model, generation, trim, specs) behind vehicle entry.

---

## 1. Borrow the record-keeping, because provenance is part of the asset

VehicleVault gets one thing exactly right: a car's history is worth money. Complete, ordered records support agreed-value insurance, smooth a sale and settle questions at succession. Lawrence's brochure says the same thing ("provenance is part of the asset").

What we've taken:

- **A provenance timeline per car.** Every check, service, movement, detail, valuation and document, in order, with who did it and what it cost.
- **A document vault** per car and across the collection.
- **Valuation history** charted against purchase price.
- **Inspection schedules** with a set frequency per car (weekly for Black Label, quarterly for Gold).
- **Delegate access**, which VehicleVault does through its family-office role. Here PAs, partners and family offices can be added to a client's account with or without the right to book.

---

## 2. Flip the model: service-led, not self-serve

VehicleVault asks the owner to do the work: add cars, upload documents, run valuations, find suppliers in a marketplace. That's the right model for a software company. It's the wrong one for Lawrence, whose clients pay him precisely so they don't have to.

So The Garage is built around what his team does:

- **Readiness is the core object.** Every car has a live status (Ready, In storage, Charging, At service, In transit, Needs attention) and a one-line note written by a person. The first thing a client sees is "is my car ready?"
- **Checks are logged in the field.** The console's check form captures resting battery voltage, all four tyre pressures against target, mileage, fluids, exterior and interior. Saving it updates the car's live state, writes to its history, sets the next check date, and flags the car if anything's off.
- **Requests are one tap.** "Have it ready", "Move a car", "Service", "Detailing", "Storage", "Valuation". The client (or their PA) picks a car, a time and a place. The team schedules it, assigns it and the client gets a confirmation in their thread.
- **Partners stay behind the curtain.** VehicleVault's marketplace makes suppliers the product. Here, transporters, detailers and specialist workshops sit in Lawrence's partner network inside the console. The client deals with Vehicle Focus, which is the point.

What we've deliberately left out for now: the open supplier marketplace, wishlists and listing searches, AI image generation and the full car catalogue. All are possible later; none help Lawrence win or keep a client this year.

---

## 3. The console is the real product for Lawrence

The client portal is the USP. The console is what makes the business run. Today Lawrence's operations live in his head, his phone and WhatsApp. The console puts them in one place:

| Area | What it does |
| --- | --- |
| **Today** | Business numbers (clients, cars, value under care, open requests, checks due, monthly recurring revenue), today's jobs, everything needing attention, new requests and leads |
| **Requests** | A board from New to Done. Each request opens to client preferences, the car's current state, and a form to schedule, assign, attach a partner and quote |
| **Fleet** | Every car across every client, filterable, with battery, tyres, last and next check. Each car has the full record including internal notes, and the check form |
| **Schedule** | Seven-day view of jobs plus upcoming checks that haven't been booked yet |
| **Clients** | Tier, fee, NDA flag, contact preference, delegates, cars, requests, messages |
| **Compliance** | MOT, insurance, registration, service and warranty dates across the fleet: overdue, next 30 days, later |
| **Messages** | One thread per client, shared by the team |
| **Leads** | Pipeline fed directly by the website's contact, readiness and adviser forms |
| **Partners** | Transporters, detailers, workshops, shippers, inspectors and storage across Jersey, UK and Europe |
| **Reports** | A printable monthly collection report per client |

---

## Architecture

```
                    ┌────────────────────────────────────────────┐
                    │  Next.js app (one codebase, Vercel)         │
   Visitors ───────▶│  app/(site)   public website + lead forms   │
   Clients, PAs ───▶│  app/garage   client portal                 │
   Lawrence, team ─▶│  app/console  operator console              │
                    │  lib/actions  server actions (all writes)    │
                    └──────────────┬─────────────────────────────┘
                                   │
                    ┌──────────────▼─────────────────────────────┐
                    │  Supabase                                   │
                    │  Postgres + row-level security              │
                    │  Auth: magic link + TOTP MFA (clients),     │
                    │        Google SSO (team)                    │
                    │  Storage: documents, check photos           │
                    │  Edge functions: document extraction,       │
                    │        report emails                        │
                    └──────────────┬─────────────────────────────┘
                                   │ webhooks
                    ┌──────────────▼─────────────────────────────┐
                    │  n8n                                        │
                    │  due-date reminders, overdue-check alerts,  │
                    │  monthly report send, new lead to Telegram  │
                    │  or WhatsApp, Xero invoices                 │
                    └────────────────────────────────────────────┘
```

**Why this stack:** it's the same Next.js and Supabase setup we use elsewhere, so there's nothing exotic to maintain. The demo already separates reads (`lib/data/queries.ts`) and writes (`lib/actions.ts`) behind async functions with the same signatures a Supabase version will have, so pages don't change when the data source does.

**Data model:** `supabase/migrations/0001_init.sql` mirrors `lib/types.ts` table for table: clients, client_members (delegates), team_members, vehicles, vehicle_valuations, due_items, history_events, documents, service_requests, jobs, messages, leads, partners. Row-level security means a client or delegate can only ever read their own collection, delegates without booking rights can't raise requests, internal notes are never visible to clients, and only the team can write checks.

---

## Security matters more here than usual

A portal that shows where several million pounds of very stealable cars are parked is a target. We've designed for that from the start:

- **MFA for every client and delegate**, not optional.
- **Locations are described, not mapped.** "Client residence, St Brelade" or "Vehicle Focus storage", never a street address or coordinates in the client UI. Exact addresses and garage codes live only in team-only notes.
- **Live tracking is team-only by default.** Clients see "In transit", not a dot on a map.
- **Internal notes are a separate flag** on every history event, enforced in the database, not just hidden in the UI.
- **Audit log** of every read of a client's records by the team (VehicleVault has a `client_data_access_log` table for the same reason).
- **Jersey data protection.** Vehicle Focus is a controller under the Data Protection (Jersey) Law 2018 and should be registered with the Jersey Office of the Information Commissioner. Data stays in Supabase's EU region.

---

## Roadmap

| Phase | What ships | Rough effort |
| --- | --- | --- |
| **0. Demo (done)** | Public site, client portal, operator console on seeded data | Done, in this repo |
| **1. Pilot** | Supabase wiring, auth with MFA, Lawrence's real clients and cars, mobile check logging with photos, three pilot clients | Two to three weeks |
| **2. Automation** | Document upload with AI extraction (insurance schedules, service invoices), monthly report emails, WhatsApp notifications, due-date reminders via n8n | Two weeks |
| **3. Money and data** | Xero invoicing and GoCardless subscriptions per tier, tracker integration for transport, valuation feeds for classics | Two to four weeks |

**Running costs once live:** roughly £60 to £100 a month (Vercel Pro, Supabase Pro, transactional email, WhatsApp messages and a small AI bill for document extraction).

---

## What we'd need from Lawrence

1. A list of current clients and cars (even a spreadsheet) to load the pilot.
2. Which three clients he'd trust to pilot it.
3. His real logo files and some photography of his own work to replace the illustrations.
4. A decision on whether to publish indicative pricing.
