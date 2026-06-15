// Next.js App Router caching — visualizer data model.
//
// The four caches, top to bottom (closer to user → closer to origin):
//
//   1. ROUTER CACHE        — client-side, in-memory, RSC payload per route
//   2. FULL ROUTE CACHE    — server-side, rendered RSC payload + HTML
//   3. REQUEST MEMOIZATION — per-render, dedupes fetch() in one server pass
//   4. DATA CACHE          — server-side, persistent, keyed by fetch URL+opts
//
// Each scenario is a sequence of steps. Each step is a full snapshot of all
// cache states, plus an optional console note and a timing accumulator.

export type CacheKey = 'router' | 'fullRoute' | 'requestMemo' | 'data'

export type CacheStatus =
  | 'idle' // not touched yet in this scenario
  | 'checking' // request is currently looking it up
  | 'hit' // found, return cached
  | 'miss' // not found, will move down
  | 'storing' // writing back on the way up
  | 'invalidated' // was valid but cleared by revalidateTag / revalidatePath
  | 'skip' // not consulted (e.g. dynamic route skips Full Route Cache)

export type OriginStatus = 'idle' | 'fetching' | 'responded'

export interface CachingStep {
  router: CacheStatus
  fullRoute: CacheStatus
  requestMemo: CacheStatus
  data: CacheStatus
  origin: OriginStatus
  // Which cache the request "is at" right now (for the moving arrow / highlight)
  focus: 'client' | CacheKey | 'origin' | null
  note: string
  // Accumulated wall time in this scenario (ms). Optional.
  timeMs?: number
}

export interface CachingScenario {
  id: string
  name: string
  blurb: string
  steps: CachingStep[]
}

// Tiny helper to construct a step. Defaults all caches to 'idle'.
const mk = (overrides: Partial<CachingStep>): CachingStep => ({
  router: 'idle',
  fullRoute: 'idle',
  requestMemo: 'idle',
  data: 'idle',
  origin: 'idle',
  focus: null,
  note: '',
  ...overrides,
})

// ----------------------------------------------------------------------------
// Scenario 1 — Cold cache (first-ever visit, hard refresh on cold deploy)
// ----------------------------------------------------------------------------

const cold: CachingScenario = {
  id: 'cold',
  name: 'Cold cache',
  blurb:
    'First-ever request after deploy. Every cache is empty. The request walks all the way down to the origin and stores on the way back up.',
  steps: [
    mk({ note: 'Ready. The user types yoursite.dev/products and hits Enter.' }),
    mk({
      focus: 'router',
      router: 'checking',
      note: 'Browser checks the Router Cache for an RSC payload for /products. Nothing there — this is a fresh tab.',
    }),
    mk({
      focus: 'router',
      router: 'miss',
      note: 'Router Cache MISS. Fire a network request to the Next.js server.',
      timeMs: 5,
    }),
    mk({
      focus: 'fullRoute',
      router: 'miss',
      fullRoute: 'checking',
      note: 'Server checks the Full Route Cache for a pre-rendered /products. Empty — never built.',
      timeMs: 15,
    }),
    mk({
      focus: 'fullRoute',
      router: 'miss',
      fullRoute: 'miss',
      note: 'Full Route Cache MISS. Next.js will render the route from scratch.',
      timeMs: 18,
    }),
    mk({
      focus: 'requestMemo',
      router: 'miss',
      fullRoute: 'miss',
      requestMemo: 'checking',
      note: 'During render, a Server Component calls fetch(/api/products). Check Request Memoization — first call in this render.',
      timeMs: 25,
    }),
    mk({
      focus: 'requestMemo',
      router: 'miss',
      fullRoute: 'miss',
      requestMemo: 'miss',
      note: 'Request Memo MISS (nothing to dedupe yet). Continue down to the Data Cache.',
      timeMs: 26,
    }),
    mk({
      focus: 'data',
      router: 'miss',
      fullRoute: 'miss',
      requestMemo: 'miss',
      data: 'checking',
      note: 'Check the Data Cache for this fetch URL + options. Empty.',
      timeMs: 30,
    }),
    mk({
      focus: 'data',
      router: 'miss',
      fullRoute: 'miss',
      requestMemo: 'miss',
      data: 'miss',
      note: 'Data Cache MISS. Hit the origin.',
      timeMs: 32,
    }),
    mk({
      focus: 'origin',
      router: 'miss',
      fullRoute: 'miss',
      requestMemo: 'miss',
      data: 'miss',
      origin: 'fetching',
      note: 'Origin call to /api/products. Database query runs — slow path.',
      timeMs: 50,
    }),
    mk({
      focus: 'origin',
      router: 'miss',
      fullRoute: 'miss',
      requestMemo: 'miss',
      data: 'miss',
      origin: 'responded',
      note: 'Origin responds with 24 products. ~200ms.',
      timeMs: 250,
    }),
    mk({
      focus: 'data',
      router: 'miss',
      fullRoute: 'miss',
      requestMemo: 'miss',
      data: 'storing',
      origin: 'responded',
      note: 'Store the response in the Data Cache, keyed by URL + options.',
      timeMs: 252,
    }),
    mk({
      focus: 'requestMemo',
      router: 'miss',
      fullRoute: 'miss',
      requestMemo: 'storing',
      data: 'hit',
      origin: 'responded',
      note: 'Memoize for the rest of this render — any duplicate fetch is instant.',
      timeMs: 253,
    }),
    mk({
      focus: 'fullRoute',
      router: 'miss',
      fullRoute: 'storing',
      requestMemo: 'hit',
      data: 'hit',
      origin: 'responded',
      note: 'Render completes. Store the RSC payload + HTML in the Full Route Cache (this is a static route).',
      timeMs: 260,
    }),
    mk({
      focus: 'router',
      router: 'storing',
      fullRoute: 'hit',
      requestMemo: 'hit',
      data: 'hit',
      origin: 'responded',
      note: 'Server streams the response to the browser. Router Cache stores the RSC payload client-side.',
      timeMs: 280,
    }),
    mk({
      router: 'hit',
      fullRoute: 'hit',
      requestMemo: 'hit',
      data: 'hit',
      origin: 'responded',
      note: 'Done. Total: ~280ms. Now everything is warm — the next visit will be ~instant.',
      timeMs: 280,
    }),
  ],
}

// ----------------------------------------------------------------------------
// Scenario 2 — Warm Link navigation (Router Cache hit, no network)
// ----------------------------------------------------------------------------

const warmLink: CachingScenario = {
  id: 'warm-link',
  name: 'Warm <Link> navigation',
  blurb:
    'User clicks an internal <Link>. The Router Cache already has the RSC payload from a prefetch or a recent visit. No network call at all.',
  steps: [
    mk({
      router: 'hit',
      fullRoute: 'hit',
      requestMemo: 'idle',
      data: 'hit',
      origin: 'responded',
      note: 'Start with everything warm. User is on /products and clicks <Link href="/products/123">.',
    }),
    mk({
      focus: 'router',
      router: 'checking',
      fullRoute: 'hit',
      data: 'hit',
      origin: 'responded',
      note: 'Browser checks the Router Cache for /products/123. The prefetch on hover already filled it.',
      timeMs: 1,
    }),
    mk({
      focus: 'router',
      router: 'hit',
      fullRoute: 'hit',
      data: 'hit',
      origin: 'responded',
      note: 'Router Cache HIT. Render the cached RSC payload. No network call, no server work.',
      timeMs: 4,
    }),
    mk({
      router: 'hit',
      fullRoute: 'hit',
      data: 'hit',
      origin: 'responded',
      note: 'Done. ~4ms (in-memory copy + React commit). This is why App Router navigations feel instant.',
      timeMs: 4,
    }),
  ],
}

// ----------------------------------------------------------------------------
// Scenario 3 — Hard refresh (Cmd+R): Router Cache cleared, FRC still warm
// ----------------------------------------------------------------------------

const hardRefresh: CachingScenario = {
  id: 'hard-refresh',
  name: 'Hard refresh (Cmd+R)',
  blurb:
    'A full page reload drops the client-side Router Cache. But the Full Route Cache still has the pre-rendered output on the server.',
  steps: [
    mk({
      router: 'idle',
      fullRoute: 'hit',
      data: 'hit',
      origin: 'responded',
      note: 'User hits Cmd+R on /products. The browser drops in-memory Router Cache. Server caches are untouched.',
    }),
    mk({
      focus: 'router',
      router: 'checking',
      fullRoute: 'hit',
      data: 'hit',
      origin: 'responded',
      note: 'Fresh page load — Router Cache is empty.',
      timeMs: 5,
    }),
    mk({
      focus: 'router',
      router: 'miss',
      fullRoute: 'hit',
      data: 'hit',
      origin: 'responded',
      note: 'Router MISS. Hit the network.',
      timeMs: 8,
    }),
    mk({
      focus: 'fullRoute',
      router: 'miss',
      fullRoute: 'checking',
      data: 'hit',
      origin: 'responded',
      note: 'Server checks the Full Route Cache. Still has the rendered output from the last build / visit.',
      timeMs: 12,
    }),
    mk({
      focus: 'fullRoute',
      router: 'miss',
      fullRoute: 'hit',
      data: 'hit',
      origin: 'responded',
      note: 'Full Route Cache HIT. No rendering, no fetch, no database. Just send the cached HTML.',
      timeMs: 14,
    }),
    mk({
      focus: 'router',
      router: 'storing',
      fullRoute: 'hit',
      data: 'hit',
      origin: 'responded',
      note: 'Response flies back. Client repopulates the Router Cache.',
      timeMs: 35,
    }),
    mk({
      router: 'hit',
      fullRoute: 'hit',
      data: 'hit',
      origin: 'responded',
      note: 'Done. ~35ms (network only, no compute). The database was never touched.',
      timeMs: 35,
    }),
  ],
}

// ----------------------------------------------------------------------------
// Scenario 4 — revalidateTag('products') invalidates Data Cache, cascades
// ----------------------------------------------------------------------------

const revalidate: CachingScenario = {
  id: 'revalidate-tag',
  name: 'revalidateTag(\'products\')',
  blurb:
    'A Server Action edits a product and calls revalidateTag(\'products\'). Every Data Cache entry tagged \'products\' is purged. Routes that depended on those fetches are next.',
  steps: [
    mk({
      router: 'hit',
      fullRoute: 'hit',
      data: 'hit',
      origin: 'responded',
      note: 'Admin edits a product. Server Action calls revalidateTag(\'products\').',
    }),
    mk({
      focus: 'data',
      router: 'hit',
      fullRoute: 'invalidated',
      data: 'invalidated',
      origin: 'responded',
      note: 'Data Cache entries tagged \'products\' are marked invalidated. Full Route Cache entries that consumed them are dropped too.',
      timeMs: 1,
    }),
    mk({
      focus: 'client',
      router: 'invalidated',
      fullRoute: 'invalidated',
      data: 'invalidated',
      origin: 'responded',
      note: 'A user now navigates to /products. Browser starts fresh.',
      timeMs: 10,
    }),
    mk({
      focus: 'router',
      router: 'checking',
      fullRoute: 'invalidated',
      data: 'invalidated',
      origin: 'responded',
      note: 'Router Cache still has an entry — but it\'s now stale. Next.js may still use it briefly (soft cache).',
      timeMs: 12,
    }),
    mk({
      focus: 'fullRoute',
      router: 'miss',
      fullRoute: 'checking',
      data: 'invalidated',
      origin: 'responded',
      note: 'Server checks the Full Route Cache. Entry was invalidated by the tag.',
      timeMs: 16,
    }),
    mk({
      focus: 'fullRoute',
      router: 'miss',
      fullRoute: 'miss',
      data: 'invalidated',
      origin: 'responded',
      note: 'Full Route Cache MISS. Re-render the page.',
      timeMs: 18,
    }),
    mk({
      focus: 'data',
      router: 'miss',
      fullRoute: 'miss',
      requestMemo: 'miss',
      data: 'checking',
      origin: 'responded',
      note: 'fetch(/api/products) — check Data Cache. The tagged entry is gone.',
      timeMs: 22,
    }),
    mk({
      focus: 'origin',
      router: 'miss',
      fullRoute: 'miss',
      requestMemo: 'miss',
      data: 'miss',
      origin: 'fetching',
      note: 'Data Cache MISS. Re-fetch from the origin to get fresh product data.',
      timeMs: 25,
    }),
    mk({
      focus: 'origin',
      router: 'miss',
      fullRoute: 'miss',
      requestMemo: 'miss',
      data: 'miss',
      origin: 'responded',
      note: 'Origin returns fresh data (~180ms).',
      timeMs: 205,
    }),
    mk({
      focus: 'data',
      router: 'miss',
      fullRoute: 'miss',
      requestMemo: 'storing',
      data: 'storing',
      origin: 'responded',
      note: 'Repopulate the Data Cache and memo. Render completes.',
      timeMs: 210,
    }),
    mk({
      focus: 'router',
      router: 'storing',
      fullRoute: 'storing',
      requestMemo: 'hit',
      data: 'hit',
      origin: 'responded',
      note: 'Store the new render in Full Route Cache and ship to client.',
      timeMs: 220,
    }),
    mk({
      router: 'hit',
      fullRoute: 'hit',
      requestMemo: 'hit',
      data: 'hit',
      origin: 'responded',
      note: 'Done. The edit propagated to all readers with one revalidateTag call.',
      timeMs: 220,
    }),
  ],
}

// ----------------------------------------------------------------------------
// Scenario 5 — fetch() dedup in one render (Request Memoization)
// ----------------------------------------------------------------------------

const dedup: CachingScenario = {
  id: 'dedup',
  name: 'Two fetch() in one render',
  blurb:
    'A layout AND a page both call fetch(/api/user). Same render. Request Memoization deduplicates so the Data Cache + origin only see ONE call.',
  steps: [
    mk({
      note: 'New request for /dashboard. Layout uses currentUser(); the page also uses it. Both call fetch(/api/user).',
    }),
    mk({
      focus: 'requestMemo',
      requestMemo: 'checking',
      note: 'Layout fires first. Check Request Memo. First call in this render — nothing to dedupe.',
      timeMs: 5,
    }),
    mk({
      focus: 'data',
      requestMemo: 'miss',
      data: 'checking',
      note: 'Memo MISS. Check Data Cache.',
      timeMs: 6,
    }),
    mk({
      focus: 'data',
      requestMemo: 'miss',
      data: 'hit',
      note: 'Data Cache HIT (cached from a previous request). Return cached user.',
      timeMs: 7,
    }),
    mk({
      focus: 'requestMemo',
      requestMemo: 'storing',
      data: 'hit',
      note: 'Memoize for the rest of this render — store the resolved user.',
      timeMs: 8,
    }),
    mk({
      focus: 'requestMemo',
      requestMemo: 'checking',
      data: 'hit',
      note: 'Page now also calls fetch(/api/user). Check Request Memo.',
      timeMs: 9,
    }),
    mk({
      focus: 'requestMemo',
      requestMemo: 'hit',
      data: 'hit',
      note: 'Request Memo HIT. Return the memoized result instantly — Data Cache is never touched again.',
      timeMs: 9,
    }),
    mk({
      requestMemo: 'hit',
      data: 'hit',
      note: 'Done. Two callsites, one fetch. This is why colocating data with components is safe in App Router.',
      timeMs: 9,
    }),
  ],
}

export const scenarios: CachingScenario[] = [
  cold,
  warmLink,
  hardRefresh,
  revalidate,
  dedup,
]
