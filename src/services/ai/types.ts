// ============================================================================
// Ask TALORAX — AI intelligence layer types
// ----------------------------------------------------------------------------
// The response model is intentionally STRUCTURED (not free text) so that:
//   1. Every recommendation is grounded in real TALORAX data.
//   2. Every recommendation can carry real in-product actions (no dead ends).
//   3. A future LLM can populate the same structure without UI changes.
// The engine NEVER fabricates people, opportunities, projects, or statistics —
// it only references entities that exist in the data layer.
// ============================================================================

import type { ID } from '../../models';

/** A tappable action attached to a recommendation. Routes into the product. */
export interface AiAction {
  label: string;
  /** In-app route to navigate to, e.g. `/opportunities/o-itsupport`. */
  to?: string;
  /**
   * A named in-app command handled by the UI instead of a route
   * (e.g. connect with a user, save an opportunity, offer help).
   */
  command?: AiCommand;
  variant?: 'primary' | 'secondary' | 'ghost' | 'highlight' | 'subtle';
}

export type AiCommand =
  | { kind: 'connect'; userId: ID }
  | { kind: 'follow'; userId: ID }
  | { kind: 'saveOpportunity'; opportunityId: ID }
  | { kind: 'offerHelp'; needId: ID }
  | { kind: 'openCreate' }
  | { kind: 'ask'; prompt: string };

/** One item within a recommendation block (a person, opportunity, etc.). */
export interface AiItem {
  id: string;
  title: string;
  subtitle?: string;
  /** Optional colored avatar seed (a name) so the UI can render an avatar. */
  avatarName?: string;
  /** Honest, data-derived reasons this item is being shown. */
  reasons?: string[];
  /** Optional match score (0-100) when relevance was scored. */
  score?: number;
  actions: AiAction[];
}

export type AiBlockKind =
  | 'paragraph'
  | 'items'
  | 'checklist'
  | 'note';

/** A block of an AI message. A message is an ordered list of blocks. */
export interface AiBlock {
  kind: AiBlockKind;
  /** Optional heading shown above the block. */
  heading?: string;
  /** For `paragraph` / `note`. */
  text?: string;
  /** For `items`. */
  items?: AiItem[];
  /** For `checklist`: each entry is {done, text}. */
  checklist?: { done: boolean; text: string }[];
}

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  /** Plain text for user messages; blocks for assistant messages. */
  text?: string;
  blocks?: AiBlock[];
  createdAt: string;
}

/** A suggested starter prompt shown on the Ask TALORAX home screen. */
export interface SuggestedPrompt {
  icon: string;
  label: string;
  prompt: string;
}

/**
 * The engine contract. `LocalAskEngine` implements it deterministically today;
 * a future `LlmAskEngine` can implement the same interface (calling a real
 * model + the same data tools) without changing the UI.
 */
export interface AskEngine {
  suggestedPrompts(): SuggestedPrompt[];
  /**
   * Answer a prompt for a given user. Returns the assistant's structured reply.
   * Implementations must only reference real data the user may access.
   */
  answer(prompt: string, userId: ID): AiBlock[];
}
