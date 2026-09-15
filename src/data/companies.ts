import type { Company } from '../models';
import { SEED_MIAMI_COMPANIES } from './miamiSeed';

const baseCompanies: Company[] = [
  {
    id: 'c-nova',
    name: 'Nova Technologies',
    industry: 'Information Technology',
    location: 'Miami, FL',
    description:
      'A regional IT services company helping small and mid-sized businesses modernize their infrastructure and stay secure.',
    openOpportunityIds: ['o-itsupport', 'o-netadmin'],
    followerCount: 1240,
  },
  {
    id: 'c-brightwave',
    name: 'BrightWave AI',
    industry: 'Artificial Intelligence',
    location: 'San Francisco, CA',
    description:
      'Applied AI company building machine learning tools that make everyday software smarter and more helpful.',
    openOpportunityIds: ['o-mlintern', 'o-frontend'],
    followerCount: 3820,
  },
  {
    id: 'c-cloudpeak',
    name: 'CloudPeak Systems',
    industry: 'Cloud Infrastructure',
    location: 'Seattle, WA',
    description:
      'Cloud consultancy guiding companies through migrations, architecture, and cost optimization on major cloud platforms.',
    openOpportunityIds: ['o-cloudintern'],
    followerCount: 2110,
  },
  {
    id: 'c-claracare',
    name: 'ClaraCare',
    industry: 'Healthcare Technology',
    location: 'Boston, MA',
    description:
      'Early-stage health tech startup reducing clinic no-shows with friendly, automated patient scheduling.',
    openOpportunityIds: ['o-cofounder', 'o-healthfreelance'],
    followerCount: 540,
  },
  {
    id: 'c-flowdesk',
    name: 'Flowdesk',
    industry: 'SaaS / Marketing',
    location: 'New York, NY',
    description:
      'B2B SaaS platform that helps teams organize their work and collaborate across departments.',
    openOpportunityIds: ['o-marketingpt'],
    followerCount: 1670,
  },

  // --- Industry-diverse organizations (TALORAX is for every field) ---
  {
    id: 'c-baywater',
    name: 'Baywater Regional Hospital',
    industry: 'Healthcare & Medical',
    location: 'Tampa, FL',
    description:
      'A 400-bed regional hospital delivering compassionate care across emergency, surgical, and outpatient services.',
    openOpportunityIds: ['j-nurse', 'j-medassist'],
    followerCount: 2890,
  },
  {
    id: 'c-tavola',
    name: 'Tavola Restaurant Group',
    industry: 'Hospitality & Restaurants',
    location: 'Chicago, IL',
    description:
      'A growing family of neighborhood restaurants focused on seasonal food and genuine hospitality.',
    openOpportunityIds: ['j-restmgr', 'j-chef'],
    followerCount: 1450,
  },
  {
    id: 'c-meridian-bank',
    name: 'Meridian Community Bank',
    industry: 'Banking',
    location: 'Charlotte, NC',
    description:
      'A community-focused bank helping local families and small businesses reach their financial goals.',
    openOpportunityIds: ['j-analyst', 'j-teller'],
    followerCount: 3120,
  },
  {
    id: 'c-riverside-schools',
    name: 'Riverside Unified School District',
    industry: 'Education',
    location: 'Riverside, CA',
    description:
      'Serving 40,000 students with a commitment to inclusive, high-quality public education.',
    openOpportunityIds: ['j-teacher'],
    followerCount: 1980,
  },
  {
    id: 'c-hartwell-law',
    name: 'Hartwell & Associates',
    industry: 'Legal',
    location: 'New York, NY',
    description:
      'A full-service law firm known for approachable, client-first legal counsel.',
    openOpportunityIds: ['j-paralegal'],
    followerCount: 940,
  },
  {
    id: 'c-summit-build',
    name: 'Summit Builders',
    industry: 'Construction',
    location: 'Denver, CO',
    description:
      'Commercial and residential construction firm building communities across the Rockies.',
    openOpportunityIds: ['j-constpm', 'j-electrician'],
    followerCount: 1210,
  },
  {
    id: 'c-verde-market',
    name: 'Verde Market',
    industry: 'Retail',
    location: 'Austin, TX',
    description:
      'A regional grocery and lifestyle retailer championing local producers.',
    openOpportunityIds: ['j-retailmgr', 'j-csr'],
    followerCount: 2670,
  },
  {
    id: 'c-brightpath',
    name: 'BrightPath Foundation',
    industry: 'Nonprofit',
    location: 'Seattle, WA',
    description:
      'A nonprofit expanding access to education and career training in underserved communities.',
    openOpportunityIds: ['j-hrcoord'],
    followerCount: 1330,
  },
  {
    id: 'c-swiftline',
    name: 'Swiftline Logistics',
    industry: 'Transportation & Logistics',
    location: 'Memphis, TN',
    description:
      'A logistics and freight company keeping supply chains moving across North America.',
    openOpportunityIds: ['j-driver', 'j-warehouse'],
    followerCount: 1560,
  },
  {
    id: 'c-anchor-realty',
    name: 'Anchor Realty Group',
    industry: 'Real Estate',
    location: 'Miami, FL',
    description:
      'A residential and commercial real estate brokerage helping people find the right space.',
    openOpportunityIds: ['j-realtor'],
    followerCount: 1080,
  },
  {
    id: 'c-pulse-fitness',
    name: 'Pulse Fitness',
    industry: 'Fitness & Sports',
    location: 'San Diego, CA',
    description:
      'A community gym and wellness brand helping members build lasting healthy habits.',
    openOpportunityIds: ['j-trainer'],
    followerCount: 2240,
  },
  {
    id: 'c-northstar-mfg',
    name: 'Northstar Manufacturing',
    industry: 'Manufacturing',
    location: 'Detroit, MI',
    description:
      'A precision manufacturer producing components for the automotive and aerospace sectors.',
    openOpportunityIds: ['j-mecheng'],
    followerCount: 1720,
  },
];

// The exported list combines the original demo companies with the Miami
// marketplace SEED companies. Seed companies remain individually identifiable
// (source: 'Admin', verificationStatus: 'Unverified') and are defined in the
// separate miamiSeed module so they can be swapped for real employer accounts.
export const companies: Company[] = [...SEED_MIAMI_COMPANIES, ...baseCompanies];

export const getCompanyById = (id: string): Company | undefined =>
  companies.find((c) => c.id === id);
