# Vehicle Focus website: review and ideas

**The short version:** Lawrence's service is better than his website. The brochure already tells the right story, so the new site should tell that story, put a client portal at the centre as the thing nobody else in Jersey offers, and give visitors two easy first steps: a readiness check for owners and a referral route for advisers. We've built all of this in this repo as a working demo.

Reviewed 19 November 2026 against www.vehicle-focus.com (Wix, five pages) and the PDF brochure linked from it.

---

## Where things stand

Vehicle Focus is a real, differentiated business. Lawrence looks after supercars, hypercars and private collections across the Channel Islands, UK and Europe: scheduled checks, battery care, storage, logistics, compliance, detailing, sourcing and valuation reporting. There are three membership tiers (Gold, Platinum, Black Label), NDAs as standard, and a founder with a motorsport and vehicle-importation background who deals with clients himself.

The complication is that the website reads like a task list, while the brochure reads like a premium service. Somebody who lands on the site from a referral sees bullet points about tyre flat spots before they understand what Vehicle Focus actually does for them. There's no proof, no way to act beyond a short form, and nothing that brings existing clients back.

So the question is: what should the website do to win more of the right clients, and keep the ones he has? Our answer is to turn it from a brochure into a front door.

---

## 1. The brochure already has the story, so the site should tell it

The brochure's "Cared for. Ready. Recorded." framing, the three principles (preventative, discreet, documented) and the four-step onboarding are clear and well written. The site doesn't use any of it.

What we found on the current site:

- **The headline isn't a headline.** "We make supercar ownership effortless" is a strong line but it sits inside a paragraph. Four of the five pages have no H1 at all, which hurts both clarity and search.
- **The home page leads with risks.** Tyre flat spots, lithium batteries and fluid degradation are good content, but as the first thing you read they come across as warnings rather than a promise.
- **The services page has a copy-and-paste error.** "Vehicle sourcing and pre-purchase inspections" repeats the concierge bullets (pick-up and drop-off, meet-ups, upgrades) instead of describing sourcing. "Tire" and "tyre" are both used.
- **The tiers are hard to compare.** The concierge page lists three packages as separate blocks with no side-by-side view, and the Gold tier's heading gets lost in the layout.
- **The contact form asks too little.** First name, last name, email and three checkboxes. No phone, no cars, no role, so Lawrence can't tell a PA from an owner before he calls.
- **Images have camera filenames as alt text** ("IMG_1709 2.JPG", "592D0053-8ECA..."). That's invisible to visitors but bad for accessibility and search.
- **The founder story switches voice.** The about page is first person, everything else is third. Lawrence's story is one of the best assets the business has, so it deserves its own clear treatment.

**What we built:** a new site in this repo (`app/(site)`) that follows the brochure's structure: promise, why it matters, principles, services in three groups, how it works, membership, who it's for, the founder, then a clear next step.

---

## 2. The client portal is the USP, so make it the centrepiece

None of the Jersey car-care businesses we found (detailers, valeters, dealer workshops) offer clients anything after the job is done. UK storage outfits like H.R. Owen's The Vault and The London Car Vault sell concierge and storage, but not a portal you'd open on a Saturday morning to check your car is ready.

That gap is the opportunity. A wealthy owner already gets a portal from their bank, their wealth manager and their insurer. Vehicle Focus can be the one that does it for their cars: every car's status, the latest check readings, the full service history as a provenance record, the documents vault, the value trend, and a one-tap "have it ready for 9am at the airport".

It also changes how the service feels. Most of what Lawrence does happens while the client is away. The portal makes that work visible, which is exactly what justifies a monthly fee.

**What we built:** a dedicated page selling it (`/the-garage`), a mock of it on the home page, and the real thing behind `/login`. See `docs/02-platform-spec.md`.

---

## 3. Give visitors two easy first steps, not one form

Right now the only action is "Request a call". That suits someone who's already decided. Most visitors haven't.

**A readiness check for owners.** Six questions (how long since it was driven, powertrain, on a conditioner or not, where it's stored, months since service, whether the records are complete) produce a risk score and plain-English findings, then offer a free vehicle audit. It answers a question owners genuinely have in November, it shows expertise without a sales pitch, and every submission arrives in Lawrence's console as a warm lead with a score attached. Built at `/readiness`.

**A referral route for advisers.** The current contact page already names personal assistants and wealth managers as audiences. In Jersey that's a real channel: the island is full of wealth managers, family offices and PAs whose clients own exactly these cars. A page that speaks to them (delegate access, discretion, reports they can hand to insurers or use for succession planning) plus a referral form is probably the cheapest high-quality lead source available. Built at `/advisers`.

---

## Other ideas, in rough priority order

1. **Proof, with permission.** Three short anonymised stories ("A 964 RS kept ready through a winter layup", "A Revuelto moved from Monaco to Jersey without a mark") with real photos of real jobs. Never invent testimonials: a few true stories beat a wall of quotes.
2. **Answer the questions people search for.** Lawrence's importation and logistics background is rare. Short guides on shipping a car between Jersey and the UK, registering an imported car in Jersey, winter layup on an island, and supercar storage in Jersey would bring in people with exactly the right problem.
3. **Make contact effortless.** WhatsApp click-to-chat (most of these clients prefer it), a phone number that's tappable, and a calendar link to book the free audit directly.
4. **Show indicative pricing when he's ready.** "Priced per collection after a free audit" is what we've used. Even a "from £X per car per month" would qualify leads before the first call. That's Lawrence's call.
5. **Let the monthly report do the marketing.** The console generates a printable monthly collection report. Clients forward these to insurers and wealth managers, and every one carries the brand.
6. **Get off Wix.** One Next.js codebase for site and portal means one login, one design, proper structured data, a sitemap, fast pages and analytics he owns.

---

## The decision we'd ask for

**Agree to put The Garage at the centre of the proposition, and pilot it with three existing clients for eight weeks before relaunching the public site.**

The alternatives, roughly priced:

| Option | What it is | Rough cost | Our view |
| --- | --- | --- | --- |
| Refresh the Wix site | Rewrite copy, fix headings and forms | A few days, no new running costs | Better, but still looks like everyone else |
| New site, no portal | This repo's public site only | About a week to finish and launch, roughly £20 a month hosting | Good shop window, no USP |
| **New site plus portal pilot** | Public site plus The Garage on Supabase, three pilot clients | Two to three weeks to wire up, roughly £60 to £100 a month to run | **Recommended.** Creates the thing competitors can't copy quickly |

The pilot matters because the portal only works if Lawrence and his team log checks consistently. Eight weeks with three friendly clients will tell us whether the workflow fits his day before we promise it to everyone.
