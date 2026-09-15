// Lightweight, transparent intent detection for Ask TALORAX.
// This is deliberately simple keyword routing — NOT natural-language
// understanding. It maps a free-form prompt to one of a fixed set of intents
// that the engine knows how to answer with real data. A future LLM-backed
// engine can replace this with genuine intent parsing behind the same API.

export type Intent =
  | 'next'
  | 'meet-people'
  | 'find-opportunities'
  | 'find-projects'
  | 'improve-profile'
  | 'skills-to-learn'
  | 'who-needs-me'
  | 'discover'
  | 'help';

interface Rule {
  intent: Intent;
  patterns: RegExp[];
}

// Order matters: earlier rules win when multiple could match.
const RULES: Rule[] = [
  {
    intent: 'improve-profile',
    patterns: [/improve.*profile/, /profile.*(better|improve|stronger|feedback)/, /discover(ed)? my profile/, /get discovered/, /more people.*(see|find|discover)/],
  },
  {
    intent: 'skills-to-learn',
    patterns: [/what.*(skill|learn)/, /skill.*(learn|develop|missing|gap)/, /am i missing/, /what should i learn/, /upskill/],
  },
  {
    intent: 'who-needs-me',
    patterns: [/who needs (me|my)/, /need my skills/, /people who need/, /can i help/, /help someone/, /where.*my skills.*useful/],
  },
  {
    intent: 'meet-people',
    patterns: [/who should i meet/, /meet(ing)? (people|someone)/, /people i should/, /find.*(people|mentor|cofounder|collaborator)/, /networking/, /connect with/],
  },
  {
    intent: 'find-opportunities',
    patterns: [/opportunit/, /\bjobs?\b/, /internship/, /freelance/, /\bhiring\b/, /\brole\b/, /startup/, /work in/, /career/],
  },
  {
    intent: 'find-projects',
    patterns: [/project/, /contribute/, /collaborat/, /build (something|with)/, /open[- ]?source/],
  },
  {
    intent: 'discover',
    patterns: [/discover/, /show me something/, /explore/, /surprise me/, /new/],
  },
  {
    intent: 'next',
    patterns: [/what.*(do|should).*(next|now)/, /what.*focus/, /where.*(start|begin)/, /next step/, /help me grow/],
  },
];

export function detectIntent(prompt: string): Intent {
  const p = prompt.trim().toLowerCase();
  if (!p) return 'help';
  for (const rule of RULES) {
    if (rule.patterns.some((re) => re.test(p))) return rule.intent;
  }
  // Default to the flagship "what should I do next" when unsure, so the user
  // always gets useful, grounded guidance rather than a blank response.
  return 'next';
}
