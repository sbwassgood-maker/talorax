import type { Notification } from '../models';
import { DEMO_USER_ID } from './users';

export const notifications: Notification[] = [
  {
    id: 'n-1',
    userId: DEMO_USER_ID,
    text: 'Sarah Johnson accepted your connection request.',
    read: false,
    createdAt: '2025-05-12T09:10:00Z',
  },
  {
    id: 'n-2',
    userId: DEMO_USER_ID,
    text: 'Your project "Network Monitoring Dashboard" reached 48 likes.',
    read: false,
    createdAt: '2025-05-12T08:00:00Z',
  },
  {
    id: 'n-3',
    userId: DEMO_USER_ID,
    text: 'A new opportunity matches your profile: IT Support Intern at Nova Technologies.',
    read: true,
    createdAt: '2025-05-11T12:00:00Z',
  },
];
