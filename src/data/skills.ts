import type { Skill } from '../models';

export const skills: Skill[] = [
  { id: 'sk-python', name: 'Python', category: 'Programming' },
  { id: 'sk-js', name: 'JavaScript', category: 'Programming' },
  { id: 'sk-react', name: 'React', category: 'Programming' },
  { id: 'sk-networking', name: 'Networking', category: 'Infrastructure' },
  { id: 'sk-linux', name: 'Linux', category: 'Infrastructure' },
  { id: 'sk-cybersecurity', name: 'Cybersecurity', category: 'Security' },
  { id: 'sk-sql', name: 'SQL', category: 'Data' },
  { id: 'sk-communication', name: 'Communication', category: 'Soft skills' },
];

export const skillNames = skills.map((s) => s.name);
