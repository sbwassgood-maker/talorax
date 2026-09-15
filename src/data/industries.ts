// ============================================================================
// TALORAX industry taxonomy — the single source of truth for job/company
// industries across the whole platform. Technology is ONE entry here, not the
// default. Search, filters, recommendations, and seed data all read from this.
// ============================================================================

export interface Industry {
  id: string;
  name: string;
  icon: string;
}

// Comprehensive, broad taxonomy. Ordered roughly alphabetically (NOT with tech
// first) so nothing visually prioritizes technology.
export const INDUSTRIES: Industry[] = [
  { id: 'admin', name: 'Administrative & Office', icon: '🗂️' },
  { id: 'agriculture', name: 'Agriculture', icon: '🌾' },
  { id: 'architecture', name: 'Architecture', icon: '📐' },
  { id: 'automotive', name: 'Automotive', icon: '🚗' },
  { id: 'banking', name: 'Banking', icon: '🏦' },
  { id: 'beauty', name: 'Beauty & Wellness', icon: '💇' },
  { id: 'business', name: 'Business & Consulting', icon: '📊' },
  { id: 'construction', name: 'Construction', icon: '🏗️' },
  { id: 'customer-service', name: 'Customer Service', icon: '🎧' },
  { id: 'design', name: 'Design & Creative', icon: '🎨' },
  { id: 'education', name: 'Education', icon: '🎓' },
  { id: 'energy', name: 'Energy & Utilities', icon: '⚡' },
  { id: 'engineering', name: 'Engineering', icon: '⚙️' },
  { id: 'environmental', name: 'Environmental & Sustainability', icon: '🌍' },
  { id: 'finance', name: 'Finance & Accounting', icon: '💵' },
  { id: 'fitness', name: 'Fitness & Sports', icon: '🏋️' },
  { id: 'food-bev', name: 'Food & Beverage', icon: '🍽️' },
  { id: 'government', name: 'Government & Public Service', icon: '🏛️' },
  { id: 'healthcare', name: 'Healthcare & Medical', icon: '🩺' },
  { id: 'hospitality', name: 'Hospitality & Restaurants', icon: '🏨' },
  { id: 'hr', name: 'Human Resources', icon: '🧑‍💼' },
  { id: 'insurance', name: 'Insurance', icon: '🛡️' },
  { id: 'journalism', name: 'Journalism', icon: '📰' },
  { id: 'legal', name: 'Legal', icon: '⚖️' },
  { id: 'logistics', name: 'Transportation & Logistics', icon: '🚚' },
  { id: 'manufacturing', name: 'Manufacturing', icon: '🏭' },
  { id: 'marketing', name: 'Marketing', icon: '📣' },
  { id: 'media', name: 'Media & Communications', icon: '🎬' },
  { id: 'nonprofit', name: 'Nonprofit', icon: '🤲' },
  { id: 'operations', name: 'Operations', icon: '🔧' },
  { id: 'pharma', name: 'Pharmaceutical', icon: '💊' },
  { id: 'real-estate', name: 'Real Estate', icon: '🏠' },
  { id: 'retail', name: 'Retail', icon: '🛍️' },
  { id: 'sales', name: 'Sales', icon: '🤝' },
  { id: 'science', name: 'Science & Research', icon: '🔬' },
  { id: 'security', name: 'Security & Safety', icon: '🚨' },
  { id: 'skilled-trades', name: 'Skilled Trades', icon: '🔨' },
  { id: 'technology', name: 'Technology & IT', icon: '💻' },
  { id: 'travel', name: 'Travel & Tourism', icon: '✈️' },
  { id: 'other', name: 'Other', icon: '✨' },
];

export const INDUSTRY_NAMES = INDUSTRIES.map((i) => i.name);

const BY_NAME = new Map(INDUSTRIES.map((i) => [i.name, i] as const));
const BY_ID = new Map(INDUSTRIES.map((i) => [i.id, i] as const));

export const getIndustryByName = (name: string): Industry | undefined =>
  BY_NAME.get(name);
export const getIndustryById = (id: string): Industry | undefined =>
  BY_ID.get(id);

export const industryIcon = (name?: string): string =>
  (name && BY_NAME.get(name)?.icon) || '✨';
