import type { Company } from '../models';

export const companies: Company[] = [
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
];

export const getCompanyById = (id: string): Company | undefined =>
  companies.find((c) => c.id === id);
