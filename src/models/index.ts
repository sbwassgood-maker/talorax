// Talorax — Core domain models
// These interfaces describe the shape of every entity in the app. Even though
// the MVP is powered by mock data, keeping the types centralized here means a
// real backend can be connected later without changing component code.

export type ID = string;

// ---------------------------------------------------------------------------
// People & identity
// ---------------------------------------------------------------------------

export type PersonaType =
  | 'Student'
  | 'Recent graduate'
  | 'Professional'
  | 'Career changer'
  | 'Freelancer'
  | 'Entrepreneur';

export type LookingFor =
  | 'Internship'
  | 'Full-time job'
  | 'Part-time job'
  | 'Freelance work'
  | 'Projects'
  | 'Collaboration'
  | 'Mentorship'
  | 'Cofounder'
  | 'Learning opportunities';

export interface Skill {
  id: ID;
  name: string;
  category?: string;
}

export interface Interest {
  id: ID;
  name: string;
}

export interface Education {
  id: ID;
  school: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
}

export interface Experience {
  id: ID;
  title: string;
  organization: string;
  startYear: number;
  endYear?: number;
  description?: string;
}

/**
 * A User is the authentication/account entity. The Profile below holds the
 * richer, public-facing professional data. In this MVP the two are merged into
 * a single object for simplicity but modeled distinctly for future separation.
 */
export interface User {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  persona: PersonaType;
  headline: string;
  location: string;
  about: string;
  lookingFor: LookingFor[];
  canHelpWith: string[];
  skills: string[];
  interests: string[];
  education: Education[];
  experience: Experience[];
  followerIds: ID[];
  connectionIds: ID[];
  projectIds: ID[];
  createdAt: string;
}

// Profile is a projection of a User for public display.
export type Profile = User;

// ---------------------------------------------------------------------------
// Companies & communities
// ---------------------------------------------------------------------------

export interface Company {
  id: ID;
  name: string;
  industry: string;
  location: string;
  description: string;
  logoUrl?: string;
  openOpportunityIds: ID[];
  followerCount: number;
}

export interface Community {
  id: ID;
  name: string;
  description: string;
  topic: string;
  memberCount: number;
  coverColor: string;
}

// ---------------------------------------------------------------------------
// Content: posts & projects
// ---------------------------------------------------------------------------

export type PostType =
  | 'text'
  | 'project'
  | 'company'
  | 'opportunity'
  | 'learning'
  | 'collaboration'
  | 'video'
  | 'collab'; // a TALORAX Collab request surfaced natively in the feed

export interface Post {
  id: ID;
  authorId: ID;
  type: PostType;
  content: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  // Optional references depending on post type
  projectId?: ID;
  opportunityId?: ID;
  companyId?: ID;
  collabId?: ID;
  mediaColor?: string; // used to render a lightweight visual preview
  mediaLabel?: string;
}

export type ProjectStatus = 'In progress' | 'Completed' | 'Looking for collaborators';

export interface Project {
  id: ID;
  title: string;
  creatorId: ID;
  description: string;
  technologies: string[];
  status: ProjectStatus;
  collaboratorIds: ID[];
  coverColor: string;
  coverLabel: string;
  likeCount: number;
  commentCount: number;
  githubUrl?: string;
  demoUrl?: string;
  seekingRoles?: string[];
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Opportunities
// ---------------------------------------------------------------------------

export type OpportunityType =
  | 'Full-time'
  | 'Part-time'
  | 'Internship'
  | 'Freelance'
  | 'Contract'
  | 'Collaboration'
  | 'Mentorship'
  | 'Cofounder'
  | 'Project';

export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';

export interface Opportunity {
  id: ID;
  title: string;
  companyId?: ID;
  posterId?: ID; // a person can post an opportunity too
  location: string;
  workMode: WorkMode;
  type: OpportunityType;
  compensation?: string;
  shortDescription: string;
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  teamMemberIds: ID[];
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Relationships & messaging
// ---------------------------------------------------------------------------

export type ConnectionStatus = 'none' | 'pending' | 'connected';

export interface Connection {
  id: ID;
  userId: ID;
  targetUserId: ID;
  status: ConnectionStatus;
  createdAt: string;
}

export interface Follow {
  id: ID;
  followerId: ID;
  followedId: ID;
}

export interface Message {
  id: ID;
  conversationId: ID;
  senderId: ID;
  text: string;
  createdAt: string;
}

export interface Conversation {
  id: ID;
  participantIds: ID[];
  messages: Message[];
}

export interface Notification {
  id: ID;
  userId: ID;
  text: string;
  read: boolean;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Recommendations / Radar
// ---------------------------------------------------------------------------

export interface Recommendation {
  reasons: string[];
  score: number; // 0 - 100 match percentage
}

export interface SkillGap {
  skill: string;
  unlocksCount: number;
  rationale: string;
}


// ---------------------------------------------------------------------------
// TALORAX Collabs — social collaboration requests ("I need someone")
// ---------------------------------------------------------------------------

/**
 * Broad, extensible category groups. New categories can be added to
 * COLLAB_CATEGORIES (in data/collabs) without code changes — this union is a
 * convenience type, and the data layer treats category as an open string group
 * so the system stays extensible per the product spec.
 */
export type CollabCategoryGroup =
  | 'Creator'
  | 'Creative'
  | 'Technology'
  | 'Business'
  | 'Learning'
  | 'Projects';

export interface Collab {
  id: ID;
  creatorId: ID;
  title: string; // e.g. "Looking for a YouTube Editor"
  description: string; // the social-style request body
  categoryGroup: CollabCategoryGroup;
  category: string; // e.g. "YouTube", "Video Editing", "Co-founder"
  /** Skills / roles the creator is looking for (the "I need" side). */
  lookingFor: string[];
  location: string;
  workMode: WorkMode;
  budget?: string; // optional; not every collab is paid
  timeline?: string; // e.g. "Starting this week"
  collaboratorsNeeded: number;
  /** Users who have expressed interest (lightweight, non-committal). */
  interestedUserIds: ID[];
  /** Users the creator has directly invited. */
  invitedUserIds: ID[];
  /** Optional link to an existing TALORAX project. */
  projectId?: ID;
  accentColor: string; // subtle visual accent for the collab card
  accentLabel: string; // short cover label
  createdAt: string;
  // --- Future-ready workspace seam (intentionally unused in this MVP) ---
  // A successful collab can later expand into a workspace with members, tasks,
  // files, and milestones. Kept optional so the model is extensible now.
  workspace?: {
    memberIds: ID[];
  };
}
