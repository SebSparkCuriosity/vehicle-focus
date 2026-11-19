// Static copy for the public site, drawn from the Vehicle Focus brochure and current website.

export const CONTACT = {
  phone: "+44 7797 738888",
  phoneHref: "tel:+447797738888",
  whatsappHref: "https://wa.me/447797738888",
  email: "247@vehicle-focus.com",
  emailHref: "mailto:247@vehicle-focus.com",
  coverage: ["Channel Islands", "United Kingdom", "Europe"],
} as const;

export const NAV = [
  { href: "/services", label: "Services" },
  { href: "/membership", label: "Membership" },
  { href: "/the-garage", label: "The Garage" },
  { href: "/advisers", label: "For advisers" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export type Service = {
  number: string;
  title: string;
  points: string[];
};

export type ServiceGroup = {
  id: string;
  title: string;
  summary: string;
  services: Service[];
};

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    id: "preservation",
    title: "Preservation & Care",
    summary: "Keeping the car mechanically right and cosmetically perfect while it waits for you.",
    services: [
      {
        number: "01",
        title: "Scheduled maintenance checks",
        points: [
          "Weekly, monthly or quarterly inspection cycles",
          "Tyre pressures, wheel rotation and tread checks",
          "Fluid level inspections: oil, coolant, brake fluid",
          "Minor repairs and adjustments carried out in place",
          "Discretionary preventative servicing tailored to the collection",
        ],
      },
      {
        number: "02",
        title: "Battery & electrical care",
        points: [
          "Regular trickle charging and battery health monitoring",
          "Lithium-ion battery care for modern and hybrid systems",
          "Charger testing and voltage diagnostics",
          "Electrical system checks before every use",
        ],
      },
      {
        number: "03",
        title: "Detailing & protection",
        points: [
          "Pre- and post-use detailing",
          "Ceramic coating application and maintenance",
          "Paint protection film (PPF) fitting",
          "Flat-spot prevention for stored vehicles",
        ],
      },
      {
        number: "04",
        title: "Secure storage",
        points: [
          "Short-term secure storage solutions",
          "Condition-appropriate environments for long layups",
          "Routine in-storage checks, not storage alone",
          "Collection and return arranged around your travel",
        ],
      },
    ],
  },
  {
    id: "movement",
    title: "Movement & Compliance",
    summary: "Getting the car where it needs to be, legally and without drama.",
    services: [
      {
        number: "05",
        title: "Relocation & logistics",
        points: [
          "Secure transport to events, circuits or second homes",
          "Airport and dockside delivery for clients travelling abroad",
          "International shipping coordination",
          "Track preparation and event-day readiness",
        ],
      },
      {
        number: "06",
        title: "Registration & compliance",
        points: [
          "MOT, insurance and road tax deadline tracking",
          "Cross-jurisdiction registration support",
          "Assistance with custom registration plates",
          "Paperwork handled before it becomes urgent",
        ],
      },
      {
        number: "07",
        title: "24/7 concierge",
        points: [
          "Vehicle pick-up and drop-off for services or events",
          "Access to supercar meet-ups and owner events",
          "Upgrades and customisations arranged with trusted vendors",
          "One point of contact, whatever the request",
        ],
      },
      {
        number: "08",
        title: "Live vehicle tracking",
        points: [
          "Tracking fitted and monitored on request",
          "Visibility of the vehicle during transport",
          "Added reassurance for stored and shipped cars",
        ],
      },
    ],
  },
  {
    id: "value",
    title: "Value & Acquisition",
    summary: "Protecting what the collection is worth, and helping it grow.",
    services: [
      {
        number: "09",
        title: "Asset management reporting",
        points: [
          "Detailed reports on vehicle condition",
          "Valuation trend analysis across the collection",
          "Complete, ordered service and ownership records",
          "Collection management support for multi-car owners",
        ],
      },
      {
        number: "10",
        title: "Sourcing & pre-purchase inspection",
        points: [
          "Acquisition support for specific cars and specifications",
          "Independent pre-purchase inspections",
          "Honest assessment before money moves",
          "Handover, registration and delivery arranged end to end",
        ],
      },
      {
        number: "11",
        title: "Photography & film",
        points: [
          "Professional vehicle photography and videography arranged",
          "Imagery for sale listings, insurance or records",
          "Wall murals produced from your own cars",
          "Vehicle-themed artwork sourced to commission",
        ],
      },
      {
        number: "12",
        title: "Bespoke requests",
        points: [
          "Requirements outside this list are usually possible",
          "Long-standing network of specialists and vendors",
          "If we can't do it properly, we'll say so and find who can",
        ],
      },
    ],
  },
];

export const PRINCIPLES = [
  {
    title: "Preventative, not reactive",
    body: "We work to a schedule, not a breakdown, so problems are caught while they're small and cheap.",
  },
  {
    title: "Discreet by default",
    body: "NDAs as standard. Cars move without fanfare. Nothing about your collection leaves the arrangement.",
  },
  {
    title: "Documented, always",
    body: "Every check, service and movement is recorded, because provenance is part of the asset.",
  },
];

export const STEPS = [
  { title: "Conversation", body: "A private call about the cars, how you use them and what currently frustrates you." },
  { title: "Vehicle audit", body: "We inspect each car, review its paperwork and flag anything that needs attention now." },
  { title: "Care schedule", body: "An agreed cycle of checks, services and deadlines, built around your calendar." },
  { title: "Ongoing reporting", body: "Condition updates in The Garage and one point of contact for everything." },
];

export const TIER_DETAILS = {
  gold: {
    forWhom: "For owners who want essential upkeep handled properly.",
    includes: [
      "Quarterly vehicle health checks: battery, tyre pressures, fluid levels",
      "Battery maintenance and trickle charging to prevent failures",
      "TPMS resets and tyre rotation to avoid flat spots",
      "Concierge advisory for servicing, MOTs and repairs",
      "The Garage client portal",
      "Standard client support",
    ],
  },
  platinum: {
    forWhom: "For serious collectors and drivers who want seamless ownership and full concierge support.",
    includes: [
      "Monthly inspections, fluid top-ups and detailed condition reports",
      "Full concierge handling of servicing, detailing and maintenance scheduling",
      "Priority relocation, logistics and track day or event preparation",
      "Short-term secure storage with 24/7 access",
      "Dedicated account manager for bespoke requests",
      "The Garage with delegate access for your PA or family office",
    ],
  },
  "black-label": {
    forWhom: "Our most complete service, for significant automotive collections.",
    includes: [
      "Weekly readiness checks and custom maintenance schedules",
      "Worldwide vehicle transport and compliance management",
      "Private chauffeur and trackside support for racing events",
      "Bespoke asset protection, investment consultation and auction preparation",
      "24/7 concierge with priority access to luxury partnerships",
      "The Garage with collection-level valuation reporting",
    ],
  },
} as const;

/** Rows for the membership comparison table. Values: true, false or a short string. */
export const COMPARISON: { feature: string; gold: string | boolean; platinum: string | boolean; blackLabel: string | boolean }[] = [
  { feature: "Health and readiness checks", gold: "Quarterly", platinum: "Monthly", blackLabel: "Weekly" },
  { feature: "Battery care and trickle charging", gold: true, platinum: true, blackLabel: true },
  { feature: "Tyre care and flat-spot prevention", gold: true, platinum: true, blackLabel: true },
  { feature: "Servicing, MOT and repair advisory", gold: true, platinum: true, blackLabel: true },
  { feature: "Servicing and detailing fully handled", gold: false, platinum: true, blackLabel: true },
  { feature: "Relocation and event preparation", gold: "On request", platinum: "Priority", blackLabel: "Worldwide" },
  { feature: "Short-term secure storage", gold: false, platinum: true, blackLabel: true },
  { feature: "Dedicated account manager", gold: false, platinum: true, blackLabel: true },
  { feature: "Trackside and chauffeur support", gold: false, platinum: false, blackLabel: true },
  { feature: "Asset protection and auction preparation", gold: false, platinum: false, blackLabel: true },
  { feature: "The Garage client portal", gold: true, platinum: true, blackLabel: true },
  { feature: "Delegate access for PA or family office", gold: false, platinum: true, blackLabel: true },
  { feature: "Collection valuation reporting", gold: false, platinum: "Per car", blackLabel: "Collection-wide" },
  { feature: "Concierge availability", gold: "Business hours", platinum: "Extended", blackLabel: "24/7" },
];

export const ROLE_OPTIONS = ["Owner", "Personal assistant", "Wealth manager", "Family office", "Other"] as const;
