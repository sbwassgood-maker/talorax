// ============================================================================
// TALORAX geography — reusable marketplace geography registry.
//
// The marketplace is geographically staged: Country → State/Region → City →
// Neighborhood/Area. TALORAX launches Miami-first, but Miami is NOT hard-coded
// anywhere in the app — it is simply the first market whose `active` flag is
// true in this registry. Adding a new market later (e.g. Orlando, then the rest
// of Florida, then other U.S. metros, then international) is a data change here,
// not a code change across the app.
//
// This module is the SINGLE source of truth for markets and neighborhoods. UI,
// filters, and seed data all read from it, so the geographic footprint can grow
// without touching the Opportunities system.
// ============================================================================

export type MarketStatus = 'active' | 'coming-soon';

export interface Neighborhood {
  id: string;
  name: string;
}

/**
 * A Market is a launchable city-level marketplace. It carries its full
 * geographic path (country → state → city) so consumers never have to hard-code
 * any single level, plus the neighborhoods/areas that scope listings within it.
 */
export interface Market {
  id: string; // stable slug, e.g. 'miami'
  city: string; // 'Miami'
  state: string; // full state/region name, e.g. 'Florida'
  stateCode: string; // 'FL'
  country: string; // 'United States'
  countryCode: string; // 'US'
  status: MarketStatus;
  /** Neighborhoods / areas within the city, used for fine-grained filtering. */
  neighborhoods: Neighborhood[];
}

const nb = (name: string): Neighborhood => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  name,
});

// ---------------------------------------------------------------------------
// Market registry. To launch a new city later, add an entry here (and flip its
// status to 'active'). Nothing else in the app needs to change.
// ---------------------------------------------------------------------------
export const MARKETS: Market[] = [
  {
    id: 'miami',
    city: 'Miami',
    state: 'Florida',
    stateCode: 'FL',
    country: 'United States',
    countryCode: 'US',
    status: 'active', // ← Miami is the first (and currently only) active market
    neighborhoods: [
      nb('Downtown Miami'),
      nb('Brickell'),
      nb('Wynwood'),
      nb('Little Havana'),
      nb('Coral Gables'),
      nb('Coconut Grove'),
      nb('Miami Beach'),
      nb('Doral'),
      nb('Aventura'),
      nb('Kendall'),
      nb('Design District'),
      nb('Edgewater'),
    ],
  },
  // --- Future markets (kept as data so the app is expansion-ready). ---------
  // These are intentionally NOT active yet. They demonstrate that expansion is
  // a data change: uncomment/flip `status` to 'active' when a market launches.
  // {
  //   id: 'orlando', city: 'Orlando', state: 'Florida', stateCode: 'FL',
  //   country: 'United States', countryCode: 'US', status: 'coming-soon',
  //   neighborhoods: [nb('Downtown Orlando'), nb('Winter Park'), nb('Lake Nona')],
  // },
];

// ---------------------------------------------------------------------------
// Lookups & helpers — all derived from MARKETS so there is one source of truth.
// ---------------------------------------------------------------------------
const BY_ID = new Map(MARKETS.map((m) => [m.id, m] as const));

export const getMarketById = (id: string): Market | undefined => BY_ID.get(id);

/** Markets currently open for listings (Miami-first: today this is just Miami). */
export const getActiveMarkets = (): Market[] =>
  MARKETS.filter((m) => m.status === 'active');

/**
 * The default market for the current launch phase — the first active market.
 * Consumers use this instead of hard-coding "Miami", so switching/adding the
 * launch market is a one-line data change.
 */
export const getDefaultMarket = (): Market | undefined => getActiveMarkets()[0];

/** Human-readable label, e.g. "Miami, FL". */
export const marketLabel = (m: Market): string => `${m.city}, ${m.stateCode}`;

/**
 * Resolve which active market a free-text location string belongs to (if any).
 * This is the bridge between the legacy plain-string `location` field
 * (e.g. "Miami, FL") and the structured market registry — matching on city or
 * state code, case-insensitively. Returns undefined for non-market locations
 * (e.g. "Remote", "Seattle, WA") so nothing is mislabeled as a market.
 */
export const findMarketForLocation = (
  location: string | undefined,
): Market | undefined => {
  if (!location) return undefined;
  const lower = location.toLowerCase();
  return getActiveMarkets().find(
    (m) =>
      lower.includes(m.city.toLowerCase()) ||
      lower.includes(`, ${m.stateCode.toLowerCase()}`) ||
      lower.includes(m.state.toLowerCase()),
  );
};

/** Find a neighborhood within a market by id or name (case-insensitive). */
export const findNeighborhood = (
  market: Market,
  idOrName: string | undefined,
): Neighborhood | undefined => {
  if (!idOrName) return undefined;
  const lower = idOrName.toLowerCase();
  return market.neighborhoods.find(
    (n) => n.id === lower || n.name.toLowerCase() === lower,
  );
};

/** All neighborhoods across active markets (handy for building filter lists). */
export const getActiveNeighborhoods = (): Neighborhood[] =>
  getActiveMarkets().flatMap((m) => m.neighborhoods);
