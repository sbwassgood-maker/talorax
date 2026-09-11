import type { Interest } from '../models';

export const interests: Interest[] = [
  { id: 'int-it', name: 'Information Technology' },
  { id: 'int-se', name: 'Software Engineering' },
  { id: 'int-cyber', name: 'Cybersecurity' },
  { id: 'int-networking', name: 'Networking' },
  { id: 'int-ai', name: 'AI' },
  { id: 'int-business', name: 'Business' },
  { id: 'int-finance', name: 'Finance' },
  { id: 'int-marketing', name: 'Marketing' },
  { id: 'int-design', name: 'Design' },
  { id: 'int-healthcare', name: 'Healthcare' },
  { id: 'int-hospitality', name: 'Hospitality' },
  { id: 'int-entrepreneurship', name: 'Entrepreneurship' },
];

export const interestNames = interests.map((i) => i.name);
