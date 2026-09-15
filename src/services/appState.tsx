import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type {
  Post,
  Project,
  Opportunity,
  ConnectionStatus,
  Conversation,
  Message,
} from '../models';
import { posts as seedPosts } from '../data/posts';
import { projects as seedProjects } from '../data/projects';
import { opportunities as seedOpps } from '../data/opportunities';
import { conversations as seedConversations } from '../data/conversations';
import { DEMO_USER_ID } from '../data/users';

// Global, in-memory application state for social interactions. Backed by React
// state (not persisted) so the demo resets cleanly. A real backend would move
// these mutations behind API calls.

interface AppStateValue {
  posts: Post[];
  projects: Project[];
  opportunities: Opportunity[];
  conversations: Conversation[];

  likedPostIds: Set<string>;
  savedPostIds: Set<string>;
  savedOpportunityIds: Set<string>;
  interestedOpportunityIds: Set<string>;
  followedUserIds: Set<string>;
  helpOfferedIds: Set<string>;
  connectionStatus: Record<string, ConnectionStatus>;

  toggleLike: (postId: string) => void;
  toggleSavePost: (postId: string) => void;
  toggleSaveOpportunity: (oppId: string) => void;
  markInterested: (oppId: string) => void;
  toggleFollow: (userId: string) => void;
  requestConnection: (userId: string) => void;
  getConnectionStatus: (userId: string) => ConnectionStatus;
  isFollowing: (userId: string) => boolean;
  /** Record that the current user offered to help with a "need" (person+role). */
  offerHelp: (needId: string) => void;
  hasOfferedHelp: (needId: string) => boolean;

  addPost: (post: Post) => void;
  addProject: (project: Project) => void;
  addOpportunity: (opp: Opportunity) => void;
  sendMessage: (conversationId: string, text: string) => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

function seedConnectionStatus(): Record<string, ConnectionStatus> {
  // Reflect the demo user's existing connections so the UI is consistent.
  const map: Record<string, ConnectionStatus> = {};
  ['u-sarah', 'u-carlos', 'u-priya'].forEach((id) => {
    map[id] = 'connected';
  });
  return map;
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(seedPosts);
  const [projects, setProjects] = useState<Project[]>(seedProjects);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(seedOpps);
  const [conversations, setConversations] =
    useState<Conversation[]>(seedConversations);

  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());
  const [savedOpportunityIds, setSavedOpportunityIds] = useState<Set<string>>(
    new Set(),
  );
  const [interestedOpportunityIds, setInterestedOpportunityIds] = useState<
    Set<string>
  >(new Set());
  const [followedUserIds, setFollowedUserIds] = useState<Set<string>>(
    new Set(['u-carlos']),
  );
  const [helpOfferedIds, setHelpOfferedIds] = useState<Set<string>>(new Set());
  const [connectionStatus, setConnectionStatus] = useState<
    Record<string, ConnectionStatus>
  >(seedConnectionStatus);

  const toggleInSet = (
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    id: string,
  ) =>
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleLike = useCallback((postId: string) => {
    setLikedPostIds((prev) => {
      const next = new Set(prev);
      const liked = next.has(postId);
      if (liked) next.delete(postId);
      else next.add(postId);
      setPosts((ps) =>
        ps.map((p) =>
          p.id === postId
            ? { ...p, likeCount: p.likeCount + (liked ? -1 : 1) }
            : p,
        ),
      );
      return next;
    });
  }, []);

  const toggleSavePost = useCallback(
    (postId: string) => toggleInSet(setSavedPostIds, postId),
    [],
  );
  const toggleSaveOpportunity = useCallback(
    (oppId: string) => toggleInSet(setSavedOpportunityIds, oppId),
    [],
  );
  const markInterested = useCallback((oppId: string) => {
    setInterestedOpportunityIds((prev) => new Set(prev).add(oppId));
  }, []);
  const toggleFollow = useCallback(
    (userId: string) => toggleInSet(setFollowedUserIds, userId),
    [],
  );
  const offerHelp = useCallback((needId: string) => {
    setHelpOfferedIds((prev) => new Set(prev).add(needId));
  }, []);

  const requestConnection = useCallback((userId: string) => {
    setConnectionStatus((prev) => {
      const current = prev[userId] ?? 'none';
      if (current !== 'none') return prev;
      return { ...prev, [userId]: 'pending' };
    });
  }, []);

  const getConnectionStatus = useCallback(
    (userId: string): ConnectionStatus => connectionStatus[userId] ?? 'none',
    [connectionStatus],
  );
  const isFollowing = useCallback(
    (userId: string) => followedUserIds.has(userId),
    [followedUserIds],
  );
  const hasOfferedHelp = useCallback(
    (needId: string) => helpOfferedIds.has(needId),
    [helpOfferedIds],
  );

  const addPost = useCallback(
    (post: Post) => setPosts((prev) => [post, ...prev]),
    [],
  );
  const addProject = useCallback(
    (project: Project) => setProjects((prev) => [project, ...prev]),
    [],
  );
  const addOpportunity = useCallback(
    (opp: Opportunity) => setOpportunities((prev) => [opp, ...prev]),
    [],
  );

  const sendMessage = useCallback((conversationId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const message: Message = {
      id: `m-${Date.now()}`,
      conversationId,
      senderId: DEMO_USER_ID,
      text: trimmed,
      createdAt: new Date().toISOString(),
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, messages: [...c.messages, message] }
          : c,
      ),
    );
  }, []);

  const value = useMemo<AppStateValue>(
    () => ({
      posts,
      projects,
      opportunities,
      conversations,
      likedPostIds,
      savedPostIds,
      savedOpportunityIds,
      interestedOpportunityIds,
      followedUserIds,
      helpOfferedIds,
      connectionStatus,
      toggleLike,
      toggleSavePost,
      toggleSaveOpportunity,
      markInterested,
      toggleFollow,
      requestConnection,
      getConnectionStatus,
      isFollowing,
      offerHelp,
      hasOfferedHelp,
      addPost,
      addProject,
      addOpportunity,
      sendMessage,
    }),
    [
      posts,
      projects,
      opportunities,
      conversations,
      likedPostIds,
      savedPostIds,
      savedOpportunityIds,
      interestedOpportunityIds,
      followedUserIds,
      helpOfferedIds,
      connectionStatus,
      toggleLike,
      toggleSavePost,
      toggleSaveOpportunity,
      markInterested,
      toggleFollow,
      requestConnection,
      getConnectionStatus,
      isFollowing,
      offerHelp,
      hasOfferedHelp,
      addPost,
      addProject,
      addOpportunity,
      sendMessage,
    ],
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
