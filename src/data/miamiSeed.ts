// ============================================================================
// TALORAX Miami — SEED / DEMO DATA (clearly identifiable as such)
//
// IMPORTANT — this file contains ADMIN-SEEDED demo listings, NOT real customer
// data. It exists to demonstrate the Miami-first marketplace. Everything here:
//   • has `source: 'Admin'` (admin-added seed content — a provenance label, not
//     a trust claim);
//   • is `verificationStatus: 'Unverified'` — nothing here is represented as a
//     verified employer or a verified listing;
//   • represents NO real applicants, real hiring activity, or marketplace
//     metrics of any kind. Follower counts on seed companies are illustrative
//     placeholders, not real audience figures.
//
// This module is kept SEPARATE from the original seed arrays so that, as the
// marketplace transitions to real employer accounts / authorized feeds / ATS
// integrations, seed content can be swapped or removed without touching the
// Opportunities system. The `SEED_*` exports below are merged into the app's
// company/opportunity lists in companies.ts / opportunities.ts.
// ============================================================================

import type { Company, Opportunity } from '../models';
import { DEMO_USER_ID } from './users';

// A single, obvious marker so seed content is trivially filterable in code.
export const SEED_SOURCE = 'Admin' as const;

// ---------------------------------------------------------------------------
// Seed Miami employer companies. All Unverified. `adminUserIds` on the first
// company includes the demo user so the employer posting flow can be tried in
// the demo (the demo user can "Post as" this company in Create → Opportunity).
// ---------------------------------------------------------------------------
export const SEED_MIAMI_COMPANIES: Company[] = [
  {
    id: 'c-seed-brickell-health',
    name: 'Brickell Bay Health Group',
    industry: 'Healthcare & Medical',
    location: 'Miami, FL',
    description:
      'A demo Miami outpatient healthcare group used to showcase the TALORAX Miami marketplace. Not a real employer.',
    openOpportunityIds: ['jm-medassist', 'jm-frontdesk'],
    followerCount: 0, // seed placeholder — not a real audience metric
    source: SEED_SOURCE,
    verificationStatus: 'Unverified',
    adminUserIds: [DEMO_USER_ID], // lets the demo user try employer posting
    websiteUrl: undefined,
  },
  {
    id: 'c-seed-wynwood-studio',
    name: 'Wynwood Creative Studio',
    industry: 'Design & Creative',
    location: 'Miami, FL',
    description:
      'A demo Miami design studio used to demonstrate creative roles in the marketplace. Not a real employer.',
    openOpportunityIds: ['jm-designer', 'jm-socialmgr'],
    followerCount: 0,
    source: SEED_SOURCE,
    verificationStatus: 'Unverified',
  },
  {
    id: 'c-seed-doral-logistics',
    name: 'Doral Freight & Logistics',
    industry: 'Transportation & Logistics',
    location: 'Miami, FL',
    description:
      'A demo Miami logistics company used to demonstrate operations and trades roles. Not a real employer.',
    openOpportunityIds: ['jm-warehouse', 'jm-dispatch'],
    followerCount: 0,
    source: SEED_SOURCE,
    verificationStatus: 'Unverified',
  },
  {
    id: 'c-seed-gables-finance',
    name: 'Coral Gables Capital Partners',
    industry: 'Finance & Accounting',
    location: 'Miami, FL',
    description:
      'A demo Miami financial services firm used to demonstrate finance roles. Not a real employer.',
    openOpportunityIds: ['jm-analyst', 'jm-clientassoc'],
    followerCount: 0,
    source: SEED_SOURCE,
    verificationStatus: 'Unverified',
  },
  {
    id: 'c-seed-southbeach-hosp',
    name: 'South Beach Hospitality Co.',
    industry: 'Hospitality & Restaurants',
    location: 'Miami, FL',
    description:
      'A demo Miami hospitality operator used to demonstrate restaurant and service roles. Not a real employer.',
    openOpportunityIds: ['jm-server', 'jm-eventscoord'],
    followerCount: 0,
    source: SEED_SOURCE,
    verificationStatus: 'Unverified',
  },
];

// ---------------------------------------------------------------------------
// Seed Miami jobs. Dates are computed relative to "now" so the "Date posted"
// filter is demonstrable. Most are Active; a few intentionally use non-active
// states (Paused / Closed / Expired) to prove that inactive listings are NOT
// presented as active opportunities.
// ---------------------------------------------------------------------------
const daysAgo = (n: number): string =>
  new Date(Date.now() - n * 86400000).toISOString();
const daysAhead = (n: number): string =>
  new Date(Date.now() + n * 86400000).toISOString();

// Common seed provenance applied to every listing here.
const seedMeta = {
  source: SEED_SOURCE,
  verificationStatus: 'Unverified' as const,
  state: 'FL',
  city: 'Miami',
};

export const SEED_MIAMI_OPPORTUNITIES: Opportunity[] = [
  // --- Active Miami jobs across neighborhoods & industries -----------------
  {
    id: 'jm-medassist',
    title: 'Medical Assistant',
    companyId: 'c-seed-brickell-health',
    location: 'Miami, FL',
    neighborhood: 'Brickell',
    workMode: 'On-site',
    type: 'Full-time',
    industry: 'Healthcare & Medical',
    seniority: 'Entry level',
    salaryMin: 40000,
    salaryMax: 48000,
    salaryPeriod: 'year',
    compensation: '$40,000–$48,000/yr',
    shortDescription:
      'Support providers and patients in a busy Brickell outpatient clinic — a great entry into Miami healthcare.',
    description:
      'Room patients, take vitals, and keep clinical workflows moving in our Brickell clinic. We train the right person — reliability and warmth matter most.',
    responsibilities: [
      'Take patient vitals and histories',
      'Prepare exam rooms and assist providers',
      'Coordinate follow-up scheduling',
    ],
    requiredSkills: ['Communication', 'Patient Care', 'Organization'],
    preferredSkills: ['Bilingual (English/Spanish)'],
    teamMemberIds: [],
    createdAt: daysAgo(3),
    postedAt: daysAgo(3),
    status: 'Active',
    ...seedMeta,
  },
  {
    id: 'jm-frontdesk',
    title: 'Front Desk Coordinator',
    companyId: 'c-seed-brickell-health',
    location: 'Miami, FL',
    neighborhood: 'Brickell',
    workMode: 'On-site',
    type: 'Part-time',
    industry: 'Administrative & Office',
    seniority: 'Entry level',
    salaryMin: 33000,
    salaryMax: 38000,
    salaryPeriod: 'year',
    compensation: '$17–$20/hr',
    shortDescription:
      'Be the welcoming first point of contact at our Brickell clinic front desk.',
    description:
      'Greet patients, manage check-in, and keep the front office organized. Perfect for someone people-first and detail-oriented.',
    responsibilities: [
      'Greet and check in patients',
      'Answer calls and manage scheduling',
      'Keep the reception area organized',
    ],
    requiredSkills: ['Customer Service', 'Communication', 'Organization'],
    teamMemberIds: [],
    createdAt: daysAgo(6),
    postedAt: daysAgo(6),
    status: 'Active',
    ...seedMeta,
  },
  {
    id: 'jm-designer',
    title: 'Junior Graphic Designer',
    companyId: 'c-seed-wynwood-studio',
    location: 'Miami, FL',
    neighborhood: 'Wynwood',
    workMode: 'Hybrid',
    type: 'Full-time',
    industry: 'Design & Creative',
    seniority: 'Entry level',
    salaryMin: 46000,
    salaryMax: 58000,
    salaryPeriod: 'year',
    compensation: '$46,000–$58,000/yr',
    shortDescription:
      'Create brand and social visuals for clients out of our Wynwood studio.',
    description:
      'Join a small, collaborative Wynwood studio designing brand identities, social campaigns, and print. Bring a portfolio and a willingness to learn.',
    responsibilities: [
      'Design social and brand assets',
      'Collaborate with senior designers',
      'Prepare files for print and digital',
    ],
    requiredSkills: ['Design', 'Figma', 'Communication'],
    preferredSkills: ['Illustration', 'Motion basics'],
    teamMemberIds: [],
    createdAt: daysAgo(2),
    postedAt: daysAgo(2),
    status: 'Active',
    ...seedMeta,
  },
  {
    id: 'jm-socialmgr',
    title: 'Social Media Manager',
    companyId: 'c-seed-wynwood-studio',
    location: 'Miami, FL',
    neighborhood: 'Wynwood',
    workMode: 'Hybrid',
    type: 'Full-time',
    industry: 'Marketing',
    seniority: 'Mid level',
    salaryMin: 55000,
    salaryMax: 68000,
    salaryPeriod: 'year',
    compensation: '$55,000–$68,000/yr',
    shortDescription:
      'Own social strategy and content for a growing roster of Miami brands.',
    description:
      'Plan calendars, create content, and grow engaged communities for our clients. Miami culture fluency is a plus.',
    responsibilities: [
      'Build and run social content calendars',
      'Create short-form video and graphics',
      'Report on engagement and iterate',
    ],
    requiredSkills: ['Marketing', 'Communication', 'Content Creation'],
    teamMemberIds: [],
    createdAt: daysAgo(9),
    postedAt: daysAgo(9),
    status: 'Active',
    ...seedMeta,
  },
  {
    id: 'jm-warehouse',
    title: 'Warehouse Associate',
    companyId: 'c-seed-doral-logistics',
    location: 'Miami, FL',
    neighborhood: 'Doral',
    workMode: 'On-site',
    type: 'Full-time',
    industry: 'Operations',
    seniority: 'Entry level',
    salaryMin: 35000,
    salaryMax: 42000,
    salaryPeriod: 'year',
    compensation: '$17–$21/hr',
    shortDescription:
      'Pick, pack, and ship orders with a friendly team at our Doral facility.',
    description:
      'Keep the Doral warehouse moving — picking, packing, and loading. Reliable and hardworking is what we value most.',
    responsibilities: [
      'Pick, pack, and label orders',
      'Load and unload shipments',
      'Keep the floor clean and safe',
    ],
    requiredSkills: ['Teamwork', 'Reliability', 'Physical Stamina'],
    teamMemberIds: [],
    createdAt: daysAgo(4),
    postedAt: daysAgo(4),
    status: 'Active',
    ...seedMeta,
  },
  {
    id: 'jm-dispatch',
    title: 'Logistics Dispatcher',
    companyId: 'c-seed-doral-logistics',
    location: 'Miami, FL',
    neighborhood: 'Doral',
    workMode: 'On-site',
    type: 'Full-time',
    industry: 'Transportation & Logistics',
    seniority: 'Mid level',
    salaryMin: 48000,
    salaryMax: 58000,
    salaryPeriod: 'year',
    compensation: '$48,000–$58,000/yr',
    shortDescription:
      'Coordinate routes and drivers to keep Miami freight moving on time.',
    description:
      'Schedule and route drivers, solve problems in real time, and keep customers informed. Calm under pressure is key.',
    responsibilities: [
      'Assign and optimize driver routes',
      'Communicate with drivers and customers',
      'Track deliveries and resolve delays',
    ],
    requiredSkills: ['Organization', 'Communication', 'Problem Solving'],
    teamMemberIds: [],
    createdAt: daysAgo(11),
    postedAt: daysAgo(11),
    status: 'Active',
    ...seedMeta,
  },
  {
    id: 'jm-analyst',
    title: 'Financial Analyst',
    companyId: 'c-seed-gables-finance',
    location: 'Miami, FL',
    neighborhood: 'Coral Gables',
    workMode: 'Hybrid',
    type: 'Full-time',
    industry: 'Finance & Accounting',
    seniority: 'Mid level',
    salaryMin: 70000,
    salaryMax: 88000,
    salaryPeriod: 'year',
    compensation: '$70,000–$88,000/yr',
    shortDescription:
      'Build models and analysis that guide investment decisions from Coral Gables.',
    description:
      'Support forecasting, reporting, and analysis for our Coral Gables team. Strong Excel and clear communication required.',
    responsibilities: [
      'Build financial models and forecasts',
      'Prepare performance reports',
      'Present findings to stakeholders',
    ],
    requiredSkills: ['Financial Analysis', 'Excel', 'Communication'],
    teamMemberIds: [],
    createdAt: daysAgo(5),
    postedAt: daysAgo(5),
    status: 'Active',
    ...seedMeta,
  },
  {
    id: 'jm-clientassoc',
    title: 'Client Services Associate',
    companyId: 'c-seed-gables-finance',
    location: 'Miami, FL',
    neighborhood: 'Coral Gables',
    workMode: 'On-site',
    type: 'Full-time',
    industry: 'Customer Service',
    seniority: 'Entry level',
    salaryMin: 45000,
    salaryMax: 52000,
    salaryPeriod: 'year',
    compensation: '$45,000–$52,000/yr',
    shortDescription:
      'Help clients feel supported and informed at a Coral Gables finance firm.',
    description:
      'Be the friendly, reliable contact for our clients — answering questions, coordinating paperwork, and following through.',
    responsibilities: [
      'Respond to client inquiries',
      'Coordinate documents and scheduling',
      'Support advisors and operations',
    ],
    requiredSkills: ['Customer Service', 'Communication', 'Attention to Detail'],
    teamMemberIds: [],
    createdAt: daysAgo(8),
    postedAt: daysAgo(8),
    status: 'Active',
    ...seedMeta,
  },
  {
    id: 'jm-server',
    title: 'Restaurant Server',
    companyId: 'c-seed-southbeach-hosp',
    location: 'Miami, FL',
    neighborhood: 'Miami Beach',
    workMode: 'On-site',
    type: 'Part-time',
    industry: 'Hospitality & Restaurants',
    seniority: 'Entry level',
    salaryMin: 30000,
    salaryMax: 45000,
    salaryPeriod: 'year',
    compensation: 'Hourly + tips',
    shortDescription:
      'Deliver warm, memorable service at a lively South Beach restaurant.',
    description:
      'Take care of guests, know the menu, and keep the energy up during service. Experience helpful but not required.',
    responsibilities: [
      'Greet and serve guests',
      'Take orders and run food',
      'Keep sections clean and stocked',
    ],
    requiredSkills: ['Customer Service', 'Teamwork', 'Time Management'],
    teamMemberIds: [],
    createdAt: daysAgo(1),
    postedAt: daysAgo(1),
    status: 'Active',
    ...seedMeta,
  },
  {
    id: 'jm-eventscoord',
    title: 'Events Coordinator',
    companyId: 'c-seed-southbeach-hosp',
    location: 'Miami, FL',
    neighborhood: 'Miami Beach',
    workMode: 'Hybrid',
    type: 'Full-time',
    industry: 'Hospitality & Restaurants',
    seniority: 'Mid level',
    salaryMin: 50000,
    salaryMax: 62000,
    salaryPeriod: 'year',
    compensation: '$50,000–$62,000/yr',
    shortDescription:
      'Plan and run private events across our South Beach venues.',
    description:
      'Own event logistics from booking to execution — vendors, timelines, and guest experience. Organized and unflappable wins here.',
    responsibilities: [
      'Coordinate event logistics and vendors',
      'Manage timelines and budgets',
      'Ensure an excellent guest experience',
    ],
    requiredSkills: ['Organization', 'Communication', 'Operations'],
    teamMemberIds: [],
    createdAt: daysAgo(13),
    postedAt: daysAgo(13),
    status: 'Active',
    ...seedMeta,
  },

  // --- Intentionally NON-ACTIVE examples (must NOT show as active jobs) -----
  {
    id: 'jm-paused-barista',
    title: 'Barista (Downtown)',
    companyId: 'c-seed-southbeach-hosp',
    location: 'Miami, FL',
    neighborhood: 'Downtown Miami',
    workMode: 'On-site',
    type: 'Part-time',
    industry: 'Food & Beverage',
    seniority: 'Entry level',
    salaryMin: 30000,
    salaryPeriod: 'year',
    compensation: '$15–$18/hr',
    shortDescription:
      'Demo listing intentionally PAUSED to show paused jobs are hidden from active views.',
    description:
      'This seed listing is paused on purpose to demonstrate lifecycle handling.',
    responsibilities: [],
    requiredSkills: ['Customer Service'],
    teamMemberIds: [],
    createdAt: daysAgo(20),
    postedAt: daysAgo(20),
    status: 'Paused',
    ...seedMeta,
  },
  {
    id: 'jm-closed-recruiter',
    title: 'Recruiter (filled)',
    companyId: 'c-seed-doral-logistics',
    location: 'Miami, FL',
    neighborhood: 'Doral',
    workMode: 'Hybrid',
    type: 'Full-time',
    industry: 'Human Resources',
    seniority: 'Mid level',
    salaryMin: 55000,
    salaryMax: 65000,
    salaryPeriod: 'year',
    compensation: '$55,000–$65,000/yr',
    shortDescription:
      'Demo listing intentionally CLOSED to show closed jobs are hidden from active views.',
    description:
      'This seed listing is closed on purpose to demonstrate lifecycle handling.',
    responsibilities: [],
    requiredSkills: ['Communication'],
    teamMemberIds: [],
    createdAt: daysAgo(30),
    postedAt: daysAgo(30),
    status: 'Closed',
    ...seedMeta,
  },
  {
    id: 'jm-expired-cashier',
    title: 'Seasonal Cashier',
    companyId: 'c-seed-southbeach-hosp',
    location: 'Miami, FL',
    neighborhood: 'Miami Beach',
    workMode: 'On-site',
    type: 'Temporary',
    industry: 'Retail',
    seniority: 'Entry level',
    salaryMin: 30000,
    salaryPeriod: 'year',
    compensation: '$15/hr',
    shortDescription:
      'Demo listing that is EXPIRED (past expiresAt) to show expired jobs are hidden from active views.',
    description:
      'This seed listing has an expiresAt in the past to demonstrate expiry handling.',
    responsibilities: [],
    requiredSkills: ['Customer Service'],
    teamMemberIds: [],
    createdAt: daysAgo(60),
    postedAt: daysAgo(60),
    expiresAt: daysAhead(-5), // expired 5 days ago
    status: 'Active', // status Active but past expiry → treated as expired
    ...seedMeta,
  },
];
