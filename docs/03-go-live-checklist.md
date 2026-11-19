# Go-live checklist

**The short version:** there are two tracks, and they don't have to launch together. The **website** could be live in about a week of work once Lawrence has signed off the words and sent his photos and logo. The **platform** (client portal plus console) needs roughly three to five weeks of build, then an eight-week pilot with three clients before everyone gets it. The thing most likely to hold either track up isn't code, it's Lawrence's input, so that list comes first.

Owners: **L** = Lawrence, **S** = Seb / developer, **L+S** = together. Effort is our rough estimate of hands-on time.

---

## 1. Lawrence's decisions and content unblock everything

None of this needs a developer, and both tracks wait on it.

### Sign-offs

- [ ] **L** Read every page of the preview and mark up anything that's wrong or doesn't sound like him
- [ ] **L** Confirm or change wording we wrote without his say-so:
  - the vehicle audit is **free**
  - enquiries are answered **"usually the same day"**
  - which tiers get **delegate access** for PAs and family offices
  - membership inclusions per tier as written on `/membership`
- [ ] **L** Decide whether to publish indicative pricing ("from £X per car per month") or keep "priced per collection"
- [ ] **L** Give us the real fee structure per tier (the console currently shows made-up fees)

### Assets

- [ ] **L** Logo as vector files (SVG or AI). The preview uses a trace of the logo on his current site, which is close but not the master.
- [ ] **L** Confirm we can reuse the photos from his current site (the preview uses them: the F8 on Bond Street, the Cullinan in Mayfair, the Vantage, the Huracán, the 911 interior, the concours shots, the showroom stills and his portrait), and that the owners of those cars are happy for them to appear
- [ ] **L** More photography of real work, especially at night or in his storage, with each client's permission and no plates or house fronts visible
- [ ] **L** The current brochure PDF, or an updated one, to host on the new site
- [ ] **L** Social links he wants shown (LinkedIn is the only one on the current site) and a WhatsApp business number
- [ ] **L** Two or three short anonymised client stories, with permission. Never invented.

### For the platform

- [ ] **L** A spreadsheet of current clients, their delegates and their cars (make, model, year, registration, where it lives, check frequency)
- [ ] **L** Key dates per car: MOT, insurance, registration, last service
- [ ] **L** His partner list: transporters, detailers, workshops, shippers
- [ ] **L** Which team members need console accounts, and their roles
- [ ] **L** Which three clients he'd trust to pilot the portal

---

## 2. The website can go live on its own in about a week

Effort once content is in: roughly five days.

### Content and design

- [ ] **S** Replace the car illustrations with real photography, add the real logo and favicon (1 day)
- [ ] **S** Apply Lawrence's copy changes (half a day)
- [ ] **S** Add the stories, brochure download and social links (half a day)

### Forms have to go somewhere real

Today the contact, readiness and adviser forms save into the demo's temporary memory, which is wiped on every restart.

- [ ] **S** Send every enquiry to Lawrence by email (Resend or similar), and to Telegram or WhatsApp via n8n if he wants a ping (half a day)
- [ ] **S** Store enquiries in a database so they're never lost. A single Supabase table is enough until the platform launches (half a day)
- [ ] **S** Add spam protection (Cloudflare Turnstile) and rate limiting to the forms (half a day)
- [ ] **S** Auto-reply to the enquirer confirming receipt

### Legal pages the forms need

- [ ] **L+S** Privacy notice: the forms collect names, emails, phone numbers and details of valuable cars
- [ ] **L+S** Website terms
- [ ] **S** Cookie notice only if we use cookie-based analytics. Recommendation: use cookie-free analytics (Vercel Analytics or Plausible) and avoid the banner entirely.

### Hide what isn't ready

- [ ] **S** If the website launches before the platform, switch off `/login`, `/garage` and `/console` and change "Client sign in" to "Coming soon" or remove it (an hour)

### Move the domain without breaking email

This is the step most likely to go wrong, so it gets its own list.

- [ ] **L+S** Find out where vehicle-focus.com is registered (looks like Wix) and where 247@vehicle-focus.com email is hosted
- [ ] **S** Copy every existing DNS record before touching anything, especially the MX records that deliver email
- [ ] **S** Either point the domain's DNS at Vercel or transfer the domain out of Wix to a registrar Lawrence controls (recommended)
- [ ] **S** Send and receive a test email after the switch
- [ ] **S** Set up SPF, DKIM and DMARC so emails sent by the site don't land in spam

### Search and launch

- [ ] **S** Set up redirects from old Wix addresses: `/concierge` to `/membership`, and the old brochure PDF link to its new home
- [ ] **S** Set `SITE_LIVE=true` on production only. Until then every page is hidden from search engines and shows a preview banner.
- [ ] **S** Submit the sitemap to Google Search Console and update the Google Business Profile with the new site
- [ ] **S** Speed and accessibility check (Lighthouse), and test on a real iPhone and Android phone
- [ ] **L** Cancel the Wix plan only after the domain and email are confirmed working

---

## 3. The platform needs three to five weeks of build

The screens and business logic exist. What's missing is everything that makes them safe to use with real people and real cars.

### A real database (about 1 week)

- [ ] **S** Create a Supabase project in the London region and run `supabase/migrations/0001_init.sql`
- [ ] **S** Rewrite `lib/data/queries.ts` and `lib/actions.ts` against Supabase (the pages don't change)
- [ ] **S** Import Lawrence's client and car spreadsheet
- [ ] **S** Turn on daily backups (Supabase Pro)

### Real sign-in (about 1 week)

- [ ] **S** Replace the demo persona picker with Supabase Auth: magic-link email sign-in
- [ ] **S** Make two-factor authentication **mandatory** for clients and delegates. The portal shows where very valuable cars are.
- [ ] **S** Team sign-in via Google Workspace, or the same magic link plus two-factor
- [ ] **S** Invitation flow: Lawrence invites a client, and a client invites their PA or family office
- [ ] **S** Check the user's role on every console page and every action, not just once in the layout

### Things the team can't do yet (about 1 to 2 weeks)

- [ ] **S** Add and edit clients, delegates, cars, due dates, partners and team members (at the moment these only exist in the seed data)
- [ ] **S** Reschedule, edit and cancel jobs (scheduling currently only adds new ones)
- [ ] **S** Upload documents to secure storage, with time-limited download links
- [ ] **S** Attach photos to a check from a phone
- [ ] **S** Turn the monthly report into a PDF that's emailed automatically

### Notifications (about 3 days)

- [ ] **S** Email the client when a request is confirmed and when a check is logged (or a weekly digest, if Lawrence prefers)
- [ ] **S** Remind the team before MOT, insurance and registration deadlines, and when a check is overdue (n8n)
- [ ] **S** Ping Lawrence on every new request and enquiry

### Hardening before real client data goes in (about 3 days)

- [ ] **S** Automated tests proving one client can never see another client's cars or documents
- [ ] **S** End-to-end tests for the main flows: enquiry, request, check, message
- [ ] **S** Error monitoring (Sentry) and uptime alerts
- [ ] **S** Show all times in Jersey time explicitly. The server runs on UTC, which is an hour out during British Summer Time.
- [ ] **S** Keep typed notes when a form comes back with an error (they currently clear)
- [ ] **S** Log every time a team member opens a client's records
- [ ] **S** Never show street addresses or garage codes to clients or delegates, only descriptions like "Client residence, St Brelade"

---

## 4. Data protection and paperwork are Lawrence's, with his adviser

- [ ] **L** Register Vehicle Focus as a data controller with the Jersey Office of the Information Commissioner (Data Protection (Jersey) Law 2018), if not already
- [ ] **L+S** Privacy notice covering the portal: what's held, why, how long, who it's shared with
- [ ] **S** Accept the data processing terms with Supabase, Vercel and the email provider, and record where data is stored
- [ ] **L** Update client agreements to cover portal use, delegate access and consent
- [ ] **L** Check his insurance covers holding client location data and access details
- [ ] **L+S** Agree how long records are kept after a client leaves

---

## 5. The pilot proves the workflow before everyone gets it

- [ ] **L+S** Load the three pilot clients and their cars with at least the last year of key history
- [ ] **L** Agree what a "check" measures, so every visit records the same readings
- [ ] **S** Train the team: logging a check should take under five minutes per car (an hour's session)
- [ ] **L** Set response times for requests and stick to them
- [ ] **L+S** Run for eight weeks with a short weekly review. Watch three things: are checks logged on time, do clients raise requests in the portal rather than on WhatsApp, and do they log in without being prompted.
- [ ] **L+S** Fix what the pilot shows, then roll out to all clients
- [ ] **L** Only then make The Garage the headline of the public site and marketing

---

## 6. Ownership and running costs need agreeing up front

- [ ] **L+S** Decide who owns the domain, the hosting account, the database and the code. Either Spark AI Agency hosts and maintains it on a retainer, or it's handed over to accounts in Lawrence's name. Both work; it needs writing down.
- [ ] **S** Move the Vercel project to whichever account is agreed. The preview currently sits in the Spark Curiosity team.

| Item | Rough monthly cost |
| --- | --- |
| Vercel Pro (commercial use needs a paid plan) | about £16 per seat |
| Supabase Pro (database, auth, storage, backups) | about £20 |
| Transactional email | free to about £16 |
| Error monitoring, spam protection, analytics | free tiers to start |
| WhatsApp notifications, AI document reading (phase 2) | a few pounds |
| **Total** | **roughly £60 to £100 a month** |

The domain itself is about £15 a year once it's out of Wix, and the Wix subscription goes.
