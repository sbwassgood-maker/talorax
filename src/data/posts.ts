import type { Post } from '../models';

export const posts: Post[] = [
  {
    id: 'post-collab-1',
    authorId: 'u-emily',
    type: 'collab',
    content:
      "Hey TALORAX 👋 I'm starting a new YouTube series about building a startup from scratch and looking for someone to edit the videos and cut them into short-form clips.",
    collabId: 'cl-yt-editor',
    createdAt: '2025-05-14T10:05:00Z',
    likeCount: 22,
    commentCount: 6,
    shareCount: 4,
  },
  {
    id: 'post-collab-2',
    authorId: 'u-priya',
    type: 'collab',
    content:
      "We're building an AI Travel Planner in the open and looking for a React developer to shape the front-end. Great way to build real portfolio work with a friendly team.",
    collabId: 'cl-react-dev',
    createdAt: '2025-05-12T09:35:00Z',
    likeCount: 37,
    commentCount: 11,
    shareCount: 8,
  },
  {
    id: 'post-1',
    authorId: 'u-alex',
    type: 'project',
    content:
      "Just finished building my first network monitoring dashboard using Python. Learned way more about troubleshooting than I expected — especially how noisy real networks are. Feedback welcome!",
    projectId: 'p-netmon',
    createdAt: '2025-05-12T14:30:00Z',
    likeCount: 48,
    commentCount: 12,
    shareCount: 5,
  },
  {
    id: 'post-2',
    authorId: 'u-sarah',
    type: 'learning',
    content:
      'Spent the weekend on a defensive security CTF and finally understood how log correlation catches attackers. If you are starting in cybersecurity, hands-on beats theory every time.',
    createdAt: '2025-05-12T10:15:00Z',
    likeCount: 72,
    commentCount: 18,
    shareCount: 9,
    mediaColor: '#dc2626',
    mediaLabel: 'CTF Weekend',
  },
  {
    id: 'post-3',
    authorId: 'u-priya',
    type: 'collaboration',
    content:
      'We are building an AI Travel Planner in the open and looking for a React developer to join. Great chance to build portfolio work with a friendly team. Comment if interested!',
    projectId: 'p-travelplanner',
    createdAt: '2025-05-11T16:45:00Z',
    likeCount: 91,
    commentCount: 24,
    shareCount: 14,
  },
  {
    id: 'post-4',
    authorId: 'u-carlos',
    type: 'text',
    content:
      "Reminder to students: you don't need years of experience to add value. Curiosity, consistency, and asking good questions will take you further than you think. Happy to mentor — my inbox is open.",
    createdAt: '2025-05-11T09:00:00Z',
    likeCount: 130,
    commentCount: 31,
    shareCount: 22,
  },
  {
    id: 'post-5',
    authorId: 'u-carlos',
    type: 'company',
    content:
      'We just opened two new roles in Miami: an IT Support Intern and a Junior Network Administrator. If you love infrastructure and solving problems, we would love to meet you.',
    companyId: 'c-nova',
    opportunityId: 'o-itsupport',
    createdAt: '2025-05-10T13:20:00Z',
    likeCount: 56,
    commentCount: 8,
    shareCount: 11,
    mediaColor: '#101828',
    mediaLabel: 'Now Hiring',
  },
  {
    id: 'post-6',
    authorId: 'u-maya',
    type: 'project',
    content:
      'Shipping the first version of my accessible component library. Every component is keyboard-navigable with clear focus states. Accessibility should be the default, not an afterthought.',
    projectId: 'p-designsystem',
    createdAt: '2025-05-10T11:00:00Z',
    likeCount: 64,
    commentCount: 15,
    shareCount: 8,
  },
  {
    id: 'post-7',
    authorId: 'u-emily',
    type: 'opportunity',
    content:
      'ClaraCare is looking for a technical cofounder to help reduce clinic no-shows and improve patient care. If you want to build something meaningful in healthcare, let us talk.',
    opportunityId: 'o-cofounder',
    companyId: 'c-claracare',
    createdAt: '2025-05-09T15:30:00Z',
    likeCount: 43,
    commentCount: 19,
    shareCount: 6,
  },
  {
    id: 'post-8',
    authorId: 'u-james',
    type: 'text',
    content:
      'Officially transitioning from hospitality into data analytics. Eight years of managing teams taught me how to read people and operations — now I am learning to read data. Any career changers out there, you are not alone.',
    createdAt: '2025-05-09T08:40:00Z',
    likeCount: 98,
    commentCount: 27,
    shareCount: 12,
  },
  {
    id: 'post-9',
    authorId: 'u-david',
    type: 'learning',
    content:
      'A simple cloud tip that saves teams money: right-size before you scale out. Most cost problems are just resources nobody turned off. Measure first, then optimize.',
    createdAt: '2025-05-08T17:10:00Z',
    likeCount: 77,
    commentCount: 10,
    shareCount: 15,
    mediaColor: '#0891b2',
    mediaLabel: 'Cloud Tips',
  },
  {
    id: 'post-10',
    authorId: 'u-fatima',
    type: 'video',
    content:
      'Recorded a short walkthrough of how I structure a React project as a student. Nothing fancy — just the patterns that keep my code readable as projects grow.',
    createdAt: '2025-05-08T12:00:00Z',
    likeCount: 84,
    commentCount: 21,
    shareCount: 13,
    mediaColor: '#0aa5e0',
    mediaLabel: '▶ React Project Structure',
  },
];

export const getPostById = (id: string): Post | undefined =>
  posts.find((p) => p.id === id);
