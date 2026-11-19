// Core domain model for the Vehicle Focus platform ("The Garage").
// Mirrors supabase/migrations/0001_init.sql so the demo store can be swapped for Supabase.

export type Tier = "gold" | "platinum" | "black-label";

export type ContactPreference = "WhatsApp" | "Phone" | "Email";

export interface ClientContact {
  name: string;
  role: "Personal assistant" | "Family office" | "Wealth manager" | "Partner" | "Driver";
  email: string;
  phone?: string;
  canBook: boolean;
}

export interface Client {
  id: string;
  name: string;
  firstName: string;
  email: string;
  phone: string;
  tier: Tier;
  clientSince: string; // ISO date
  homeBase: string;
  contacts: ClientContact[];
  preferences: {
    nda: boolean;
    contactPreference: ContactPreference;
    notes: string;
  };
  monthlyFee: number; // GBP, demo figure
}

export type VehicleStatus =
  | "ready" // checked, charged, clean, legal: drive away
  | "in-storage" // laid up, on a care cycle
  | "charging" // on conditioner / maintenance charge
  | "at-service" // with a specialist
  | "in-transit" // being moved
  | "attention"; // something needs a decision

export type BodyStyle = "coupe" | "gt" | "suv" | "roadster" | "saloon";

export type CheckFrequency = "weekly" | "fortnightly" | "monthly" | "quarterly";

export type LocationKind = "client-home" | "vf-storage" | "specialist" | "in-transit" | "airport";

export interface TyrePressures {
  fl: number;
  fr: number;
  rl: number;
  rr: number;
}

export interface Vehicle {
  id: string;
  clientId: string;
  make: string;
  model: string;
  variant?: string;
  year: number;
  colour: string;
  paintHex: string; // used to tint the illustration
  registration: string;
  vinLast6: string;
  bodyStyle: BodyStyle;
  powertrain: "petrol" | "hybrid" | "electric";
  mileage: number;
  status: VehicleStatus;
  statusNote?: string;
  location: { name: string; kind: LocationKind };
  battery: { voltage: number; healthPct: number; onConditioner: boolean };
  tyres: { current: TyrePressures; target: TyrePressures; unit: "psi" | "bar" };
  checkFrequency: CheckFrequency;
  lastCheckAt: string; // ISO datetime
  nextCheckAt: string; // ISO datetime
  purchasePrice: number;
  purchaseDate: string;
  valuations: { date: string; value: number; source: string }[];
  specialistNotes?: string;
}

export type DueKind = "MOT" | "Insurance" | "Registration" | "Service" | "Warranty" | "Tracker subscription";

export interface DueItem {
  id: string;
  vehicleId: string;
  kind: DueKind;
  dueDate: string; // ISO date
  notes?: string;
}

export type HistoryKind = "check" | "service" | "movement" | "detailing" | "document" | "valuation" | "note" | "handover";

export interface CheckReadings {
  batteryVoltage: number;
  tyres: TyrePressures;
  mileage: number;
  fluidsOk: boolean;
  exteriorOk: boolean;
  interiorOk: boolean;
}

export interface HistoryEvent {
  id: string;
  vehicleId: string;
  at: string; // ISO datetime
  kind: HistoryKind;
  title: string;
  detail?: string;
  by: string;
  cost?: number;
  readings?: CheckReadings;
  visibleToClient: boolean;
}

export type DocumentKind =
  | "Registration"
  | "Insurance"
  | "Service record"
  | "Invoice"
  | "Condition report"
  | "Purchase"
  | "Shipping"
  | "Warranty";

export interface VehicleDocument {
  id: string;
  vehicleId: string;
  title: string;
  kind: DocumentKind;
  date: string;
  sizeKb: number;
}

export type RequestType = "ready" | "relocation" | "service" | "detailing" | "storage" | "valuation" | "other";

export type RequestStatus = "new" | "scheduled" | "in-progress" | "done" | "cancelled";

export interface ServiceRequest {
  id: string;
  clientId: string;
  vehicleId: string;
  type: RequestType;
  title: string;
  when: string; // ISO datetime the client needs it
  location: string;
  notes?: string;
  status: RequestStatus;
  createdAt: string;
  createdBy: string; // who raised it, client or a delegate
  assigneeId?: string;
  partnerId?: string;
  quote?: number;
}

export type JobKind = "check" | "relocation" | "service" | "detailing" | "handover" | "collection" | "photography";

export interface Job {
  id: string;
  vehicleId: string;
  requestId?: string;
  kind: JobKind;
  title: string;
  start: string; // ISO datetime
  durationMins: number;
  assigneeId: string;
  status: "planned" | "in-progress" | "done";
  location: string;
}

export interface Message {
  id: string;
  clientId: string;
  from: "client" | "vf";
  author: string;
  body: string;
  at: string;
}

export type LeadSource = "Website" | "Readiness check" | "Referral" | "Adviser" | "Event";
export type LeadStage = "new" | "contacted" | "audit-booked" | "proposal" | "won" | "lost";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  source: LeadSource;
  role?: "Owner" | "Personal assistant" | "Wealth manager" | "Family office" | "Other";
  message?: string;
  cars?: string;
  readinessScore?: number; // 0-100, higher is more at risk
  createdAt: string;
  stage: LeadStage;
}

export type PartnerKind =
  | "Transport"
  | "Detailing"
  | "Specialist workshop"
  | "Storage"
  | "Photography"
  | "Inspection"
  | "Shipping";

export interface Partner {
  id: string;
  name: string;
  kind: PartnerKind;
  region: "Jersey" | "Guernsey" | "UK" | "Europe" | "Worldwide";
  contactName: string;
  email: string;
  phone: string;
  rating: number; // 1-5
  notes?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
}

export type Persona = { kind: "team"; memberId: string } | { kind: "client"; clientId: string };
