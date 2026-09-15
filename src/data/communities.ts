import type { Community } from '../models';

export const communities: Community[] = [
  {
    id: 'cm-cyber',
    name: 'Cybersecurity',
    description:
      'A community for security enthusiasts to share threats, tools, CTF write-ups, and career advice.',
    topic: 'Cybersecurity',
    memberCount: 4820,
    coverColor: '#dc2626',
  },
  {
    id: 'cm-se',
    name: 'Software Engineering',
    description:
      'Discuss engineering practices, system design, code reviews, and everything about building software.',
    topic: 'Software Engineering',
    memberCount: 9130,
    coverColor: '#2563eb',
  },
  {
    id: 'cm-itstudents',
    name: 'IT Students',
    description:
      'A friendly space for IT students to ask questions, share projects, and find study buddies and internships.',
    topic: 'Information Technology',
    memberCount: 3560,
    coverColor: '#0aa5e0',
  },
  {
    id: 'cm-entrepreneurs',
    name: 'Entrepreneurs',
    description:
      'Founders and aspiring founders sharing lessons, seeking cofounders, and supporting each other.',
    topic: 'Entrepreneurship',
    memberCount: 2740,
    coverColor: '#d97706',
  },
  {
    id: 'cm-womenintech',
    name: 'Women in Technology',
    description:
      'A supportive community celebrating and advancing women across every corner of the tech industry.',
    topic: 'Information Technology',
    memberCount: 6210,
    coverColor: '#db2777',
  },
];

export const getCommunityById = (id: string): Community | undefined =>
  communities.find((c) => c.id === id);
