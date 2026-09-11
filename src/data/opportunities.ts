import type { Opportunity } from '../models';

export const opportunities: Opportunity[] = [
  {
    id: 'o-itsupport',
    title: 'IT Support Intern',
    companyId: 'c-nova',
    location: 'Miami, FL',
    workMode: 'Hybrid',
    type: 'Internship',
    compensation: '$20/hr',
    shortDescription:
      'Support our internal team with hardware, networking, and troubleshooting while learning enterprise IT operations.',
    description:
      'Join Nova Technologies as an IT Support Intern and get hands-on experience keeping a busy IT services company running. You will work alongside our support and networking teams, learning how real infrastructure is maintained day to day.',
    responsibilities: [
      'Respond to internal support tickets and help resolve hardware and software issues',
      'Assist with basic network configuration and monitoring',
      'Document common issues and solutions for the team knowledge base',
      'Shadow senior engineers on larger projects',
    ],
    requiredSkills: ['Networking', 'Linux', 'Communication'],
    teamMemberIds: ['u-carlos'],
    createdAt: '2025-05-01T09:00:00Z',
  },
  {
    id: 'o-netadmin',
    title: 'Junior Network Administrator',
    companyId: 'c-nova',
    location: 'Miami, FL',
    workMode: 'On-site',
    type: 'Full-time',
    compensation: '$62,000/yr',
    shortDescription:
      'Help design, maintain, and secure client networks as part of our infrastructure team.',
    description:
      'We are looking for a Junior Network Administrator to help maintain and improve the networks we manage for our clients. This is a great next step for someone with strong networking fundamentals.',
    responsibilities: [
      'Configure and maintain routers, switches, and firewalls',
      'Monitor network performance and respond to incidents',
      'Support security hardening and patching',
      'Work with clients to resolve connectivity issues',
    ],
    requiredSkills: ['Networking', 'Linux', 'Cybersecurity'],
    teamMemberIds: ['u-carlos'],
    createdAt: '2025-04-20T09:00:00Z',
  },
  {
    id: 'o-mlintern',
    title: 'Machine Learning Intern',
    companyId: 'c-brightwave',
    location: 'San Francisco, CA',
    workMode: 'Hybrid',
    type: 'Internship',
    compensation: '$35/hr',
    shortDescription:
      'Work with our ML team on real product features that bring machine learning to everyday software.',
    description:
      'BrightWave AI is hiring a Machine Learning Intern to contribute to production ML features. You will help with data processing, model experimentation, and evaluation under the guidance of senior engineers.',
    responsibilities: [
      'Prepare and clean datasets for model training',
      'Run experiments and evaluate model performance',
      'Collaborate on integrating models into product features',
      'Present findings to the team',
    ],
    requiredSkills: ['Python', 'SQL'],
    teamMemberIds: ['u-priya'],
    createdAt: '2025-05-05T09:00:00Z',
  },
  {
    id: 'o-frontend',
    title: 'Front-End Developer',
    companyId: 'c-brightwave',
    location: 'Remote',
    workMode: 'Remote',
    type: 'Full-time',
    compensation: '$95,000/yr',
    shortDescription:
      'Build delightful, accessible interfaces for our AI-powered products.',
    description:
      'We are looking for a Front-End Developer who cares about craft and accessibility to help build the interfaces that make our AI features approachable and useful.',
    responsibilities: [
      'Build responsive, accessible UI components in React',
      'Collaborate closely with design and ML teams',
      'Improve performance and front-end architecture',
      'Contribute to our design system',
    ],
    requiredSkills: ['React', 'JavaScript'],
    teamMemberIds: ['u-priya'],
    createdAt: '2025-04-28T09:00:00Z',
  },
  {
    id: 'o-cloudintern',
    title: 'Cloud Engineering Intern',
    companyId: 'c-cloudpeak',
    location: 'Seattle, WA',
    workMode: 'Hybrid',
    type: 'Internship',
    compensation: '$30/hr',
    shortDescription:
      'Learn cloud architecture hands-on while supporting real client migration projects.',
    description:
      'CloudPeak Systems is offering a Cloud Engineering Internship for someone eager to learn how modern cloud systems are designed and operated. You will support migration and automation work.',
    responsibilities: [
      'Assist with cloud resource provisioning and automation scripts',
      'Help document architecture and runbooks',
      'Monitor systems and support incident response',
      'Learn infrastructure-as-code practices',
    ],
    requiredSkills: ['Linux', 'Python', 'Networking'],
    teamMemberIds: ['u-david'],
    createdAt: '2025-05-08T09:00:00Z',
  },
  {
    id: 'o-cofounder',
    title: 'Technical Cofounder',
    companyId: 'c-claracare',
    posterId: 'u-emily',
    location: 'Boston, MA',
    workMode: 'Hybrid',
    type: 'Cofounder',
    compensation: 'Equity',
    shortDescription:
      'Join a health tech startup as technical cofounder to build the product from the ground up.',
    description:
      'ClaraCare is looking for a technical cofounder to lead engineering as we build a patient scheduling platform that reduces clinic no-shows. You will shape the product, tech stack, and team.',
    responsibilities: [
      'Own technical strategy and architecture',
      'Build and iterate on the core product',
      'Hire and lead the early engineering team',
      'Partner with the founder on product decisions',
    ],
    requiredSkills: ['React', 'Python', 'SQL'],
    teamMemberIds: ['u-emily'],
    createdAt: '2025-04-15T09:00:00Z',
  },
  {
    id: 'o-healthfreelance',
    title: 'Freelance Full-Stack Developer',
    companyId: 'c-claracare',
    posterId: 'u-emily',
    location: 'Remote',
    workMode: 'Remote',
    type: 'Freelance',
    compensation: '$60/hr',
    shortDescription:
      'Help build our scheduling prototype into a working MVP on a flexible freelance basis.',
    description:
      'We need a freelance full-stack developer to help turn our scheduling prototype into a polished MVP. Flexible hours and a chance to shape an early product.',
    responsibilities: [
      'Implement front-end and back-end features for the scheduling flow',
      'Integrate reminders and rescheduling logic',
      'Ensure the product is reliable and accessible',
    ],
    requiredSkills: ['React', 'JavaScript', 'SQL'],
    teamMemberIds: ['u-emily'],
    createdAt: '2025-05-11T09:00:00Z',
  },
  {
    id: 'o-marketingpt',
    title: 'Part-Time Marketing Associate',
    companyId: 'c-flowdesk',
    location: 'New York, NY',
    workMode: 'Hybrid',
    type: 'Part-time',
    compensation: '$28/hr',
    shortDescription:
      'Support content and social campaigns for a growing B2B SaaS brand.',
    description:
      'Flowdesk is hiring a part-time Marketing Associate to help create content, manage social channels, and support campaigns. Great for a student building marketing experience.',
    responsibilities: [
      'Draft blog posts, social content, and newsletters',
      'Schedule and track campaign performance',
      'Support brand and community initiatives',
    ],
    requiredSkills: ['Communication', 'Marketing'],
    teamMemberIds: ['u-lena'],
    createdAt: '2025-05-02T09:00:00Z',
  },
  {
    id: 'o-mentorship',
    title: 'Networking Career Mentorship',
    posterId: 'u-carlos',
    location: 'Orlando, FL',
    workMode: 'Remote',
    type: 'Mentorship',
    compensation: 'Free',
    shortDescription:
      'Monthly 1:1 mentorship for students breaking into network engineering and infrastructure.',
    description:
      'I am offering free monthly mentorship sessions for students who want to build a career in networking and infrastructure. We will cover fundamentals, certifications, and real-world advice.',
    responsibilities: [
      'Attend monthly 1:1 video sessions',
      'Complete small hands-on labs between sessions',
      'Come with questions and goals',
    ],
    requiredSkills: ['Networking', 'Communication'],
    teamMemberIds: ['u-carlos'],
    createdAt: '2025-05-06T09:00:00Z',
  },
  {
    id: 'o-collab-travel',
    title: 'AI Travel Planner — React Developer',
    posterId: 'u-priya',
    location: 'Remote',
    workMode: 'Remote',
    type: 'Collaboration',
    compensation: 'Open-source',
    shortDescription:
      'Join an open-source AI travel planner as a React developer and help shape the front-end experience.',
    description:
      'We are building an AI Travel Planner in the open and looking for a React developer to collaborate on the front-end. A great way to build portfolio work with a friendly team.',
    responsibilities: [
      'Build front-end features in React',
      'Collaborate on UX with the team',
      'Help review pull requests',
    ],
    requiredSkills: ['React', 'JavaScript'],
    teamMemberIds: ['u-priya', 'u-fatima'],
    createdAt: '2025-05-09T09:00:00Z',
  },
  {
    id: 'o-freelance-web',
    title: 'Freelance Website Build',
    posterId: 'u-lena',
    location: 'Remote',
    workMode: 'Remote',
    type: 'Contract',
    compensation: '$2,500 fixed',
    shortDescription:
      'Short contract to build a modern marketing website for a small SaaS product.',
    description:
      'Looking for a developer to build a clean, fast marketing website for a small SaaS product. Clear scope, fixed budget, and a friendly point of contact.',
    responsibilities: [
      'Build a responsive marketing site from provided designs',
      'Set up a simple contact form',
      'Ensure fast load times and good SEO basics',
    ],
    requiredSkills: ['React', 'JavaScript'],
    teamMemberIds: ['u-lena'],
    createdAt: '2025-05-03T09:00:00Z',
  },
  {
    id: 'o-project-budget',
    title: 'BudgetBuddy — Data Collaborator',
    posterId: 'u-omar',
    location: 'Remote',
    workMode: 'Remote',
    type: 'Project',
    compensation: 'Learning project',
    shortDescription:
      'Collaborate on a personal finance tracker and practice data visualization together.',
    description:
      'I am building BudgetBuddy, a personal finance tracker, and looking for someone to collaborate on the data and visualization side. Perfect for mutual learning.',
    responsibilities: [
      'Design simple data models for spending categories',
      'Build charts to visualize spending',
      'Pair on features and review each other work',
    ],
    requiredSkills: ['Python', 'SQL'],
    teamMemberIds: ['u-omar'],
    createdAt: '2025-05-12T09:00:00Z',
  },
];

export const getOpportunityById = (id: string): Opportunity | undefined =>
  opportunities.find((o) => o.id === id);
