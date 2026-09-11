import type { Conversation } from '../models';
import { DEMO_USER_ID } from './users';

// Conversations for the demo user (u-alex). Real-time messaging can replace
// this static structure later without changing the messaging UI.
export const conversations: Conversation[] = [
  {
    id: 'conv-1',
    participantIds: [DEMO_USER_ID, 'u-sarah'],
    messages: [
      {
        id: 'm-1',
        conversationId: 'conv-1',
        senderId: 'u-sarah',
        text: 'Hey! I saw your networking project. Really interesting.',
        createdAt: '2025-05-12T09:00:00Z',
      },
      {
        id: 'm-2',
        conversationId: 'conv-1',
        senderId: DEMO_USER_ID,
        text: 'Thanks Sarah! I learned a ton building it. Want to team up on the next one?',
        createdAt: '2025-05-12T09:04:00Z',
      },
      {
        id: 'm-3',
        conversationId: 'conv-1',
        senderId: 'u-sarah',
        text: 'Yes! I have some ideas around security monitoring we could combine.',
        createdAt: '2025-05-12T09:07:00Z',
      },
    ],
  },
  {
    id: 'conv-2',
    participantIds: [DEMO_USER_ID, 'u-carlos'],
    messages: [
      {
        id: 'm-4',
        conversationId: 'conv-2',
        senderId: 'u-carlos',
        text: 'Happy to mentor you on networking. What are you hoping to learn first?',
        createdAt: '2025-05-11T14:20:00Z',
      },
      {
        id: 'm-5',
        conversationId: 'conv-2',
        senderId: DEMO_USER_ID,
        text: 'I would love to understand how enterprise networks are segmented in practice.',
        createdAt: '2025-05-11T14:25:00Z',
      },
    ],
  },
  {
    id: 'conv-3',
    participantIds: [DEMO_USER_ID, 'u-priya'],
    messages: [
      {
        id: 'm-6',
        conversationId: 'conv-3',
        senderId: 'u-priya',
        text: 'We could use someone with your networking background on the travel planner infra. Interested?',
        createdAt: '2025-05-10T18:00:00Z',
      },
    ],
  },
];
