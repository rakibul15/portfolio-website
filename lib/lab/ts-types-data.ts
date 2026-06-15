// TypeScript Type System visualizer — 4 scenarios for the most-asked
// senior FE TS interview topics: type narrowing, generics with constraints,
// conditional types with infer, and mapped types (DeepPartial-style).

export type TypeBoxState = 'normal' | 'active' | 'narrowed' | 'eliminated' | 'inferred' | 'result'

// A "type box" represents a candidate type in a union, an inferred type,
// or a node in a recursive type walk.
export interface TypeBox {
  id: string
  label: string // e.g. "string", "Cat", "{ kind: 'rect' }"
  state: TypeBoxState
  // Optional small subscript / detail (e.g. "narrowed by typeof === 'string'")
  detail?: string
}

// Optional "before / after" comparison panel for showing input type vs result.
export interface TypeCompare {
  before: { label: string; lines: string[] }
  after: { label: string; lines: string[] }
}

export interface TSStep {
  // Headline expression being evaluated this step.
  expression?: string
  // Candidate types (union narrowing, inferred slots, etc.)
  boxes?: TypeBox[]
  // Side-by-side type comparison (used by mapped-type scenarios).
  compare?: TypeCompare
  // Tracked variables — type params, control flow, etc.
  vars: Array<{ label: string; value: string }>
  // Output text (e.g. console.log accumulation, or final resolved type)
  output: string[]
  codeLine: number
  note: string
}

export interface TSScenario {
  id: string
  name: string
  flavor: 'narrowing' | 'generics' | 'conditional' | 'mapped'
  blurb: string
  code: string[]
  steps: TSStep[]
}

// ---------------------------------------------------------------------------
// Scenario 1 — Type Narrowing (discriminated union)
// ---------------------------------------------------------------------------

const narrowing: TSScenario = {
  id: 'narrowing',
  name: 'Type narrowing',
  flavor: 'narrowing',
  blurb:
    "TypeScript narrows a union type as control flow runs. Discriminated unions (a literal-typed field shared across variants) give the compiler enough signal to eliminate impossible variants — the exhaustive check at the end is the senior-level signal.",
  code: [
    `type Shape =`,
    `  | { kind: 'circle';    radius: number }`,
    `  | { kind: 'rect';      w: number; h: number }`,
    `  | { kind: 'triangle';  base: number; height: number }`,
    ``,
    `function area(s: Shape): number {`,
    `  switch (s.kind) {`,
    `    case 'circle':   return Math.PI * s.radius ** 2`,
    `    case 'rect':     return s.w * s.h`,
    `    case 'triangle': return (s.base * s.height) / 2`,
    `    default:`,
    `      // \`s\` is now of type \`never\` — exhaustive check.`,
    `      const _exhaustive: never = s`,
    `      return _exhaustive`,
    `  }`,
    `}`,
  ],
  steps: [
    {
      boxes: [
        { id: 'c', label: '{ kind: "circle"; radius }', state: 'normal' },
        { id: 'r', label: '{ kind: "rect"; w, h }', state: 'normal' },
        { id: 't', label: '{ kind: "triangle"; base, h }', state: 'normal' },
      ],
      vars: [{ label: 'inferred type of s', value: 'Shape (union)' }],
      output: [],
      codeLine: 6,
      note: 'Enter area(). `s` has the full union type Shape — 3 possible variants.',
    },
    {
      boxes: [
        { id: 'c', label: '{ kind: "circle"; radius }', state: 'active' },
        { id: 'r', label: '{ kind: "rect" }', state: 'eliminated' },
        { id: 't', label: '{ kind: "triangle" }', state: 'eliminated' },
      ],
      vars: [
        { label: 'switch arm', value: "'circle'" },
        { label: 'inferred type of s', value: '{ kind: "circle"; radius }' },
      ],
      output: [],
      codeLine: 8,
      note: 'switch case "circle". TS narrows `s` to ONLY the circle variant — accessing s.radius is now safe.',
    },
    {
      boxes: [
        { id: 'c', label: '{ kind: "circle" }', state: 'eliminated' },
        { id: 'r', label: '{ kind: "rect"; w, h }', state: 'active' },
        { id: 't', label: '{ kind: "triangle" }', state: 'eliminated' },
      ],
      vars: [
        { label: 'switch arm', value: "'rect'" },
        { label: 'inferred type of s', value: '{ kind: "rect"; w; h }' },
      ],
      output: [],
      codeLine: 9,
      note: 'case "rect". `s.radius` would be a compile error here — TS knows it doesn\'t exist on this variant.',
    },
    {
      boxes: [
        { id: 'c', label: '{ kind: "circle" }', state: 'eliminated' },
        { id: 'r', label: '{ kind: "rect" }', state: 'eliminated' },
        { id: 't', label: '{ kind: "triangle"; base; h }', state: 'active' },
      ],
      vars: [
        { label: 'switch arm', value: "'triangle'" },
        { label: 'inferred type of s', value: '{ kind: "triangle"; base; h }' },
      ],
      output: [],
      codeLine: 10,
      note: 'case "triangle".',
    },
    {
      boxes: [
        { id: 'c', label: '{ kind: "circle" }', state: 'eliminated' },
        { id: 'r', label: '{ kind: "rect" }', state: 'eliminated' },
        { id: 't', label: '{ kind: "triangle" }', state: 'eliminated' },
        { id: 'never', label: 'never (empty set)', state: 'result' },
      ],
      vars: [
        { label: 'default arm', value: 'unreachable' },
        { label: 'inferred type of s', value: 'never' },
      ],
      output: [],
      codeLine: 13,
      note: 'default. All 3 variants eliminated → `s` is `never` (the empty set). Assigning it to `_exhaustive: never` compiles ONLY if we covered every case. If we ever add a 4th variant to Shape, this line breaks the build — that\'s the trap that catches uncovered cases.',
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 2 — Generics with Constraint
// ---------------------------------------------------------------------------

const generics: TSScenario = {
  id: 'generics',
  name: 'Generics with constraints',
  flavor: 'generics',
  blurb:
    'A type parameter T captures the input type and threads it through the function signature. `extends` adds a constraint — T must be at least the shape on the right. The compiler resolves T at each call site.',
  code: [
    `function pluck<T, K extends keyof T>(obj: T, key: K): T[K] {`,
    `  return obj[key]`,
    `}`,
    ``,
    `const user = { name: "Alice", age: 30, isAdmin: true }`,
    ``,
    `const a = pluck(user, "name")     // T[K] = string`,
    `const b = pluck(user, "age")      // T[K] = number`,
    `const c = pluck(user, "isAdmin")  // T[K] = boolean`,
    `// const d = pluck(user, "xxx")   // ✗ compile error`,
  ],
  steps: [
    {
      boxes: [
        { id: 'T', label: 'T (free)', state: 'normal' },
        { id: 'K', label: 'K extends keyof T', state: 'normal' },
      ],
      vars: [
        { label: 'signature', value: 'pluck<T, K extends keyof T>(T, K): T[K]' },
      ],
      output: [],
      codeLine: 1,
      note: 'pluck signature has two type parameters. T is free. K must be a key OF T (constraint).',
    },
    {
      boxes: [
        { id: 'T', label: 'T = { name; age; isAdmin }', state: 'inferred' },
        { id: 'K', label: 'K = "name" | "age" | "isAdmin"', state: 'inferred' },
      ],
      vars: [
        { label: 'call', value: 'pluck(user, "name")' },
        { label: 'T inferred from', value: 'user' },
      ],
      output: [],
      codeLine: 7,
      note: 'Call 1: pluck(user, "name"). T inferred from `user` → the user object shape. K must extend keyof T → must be one of the 3 keys.',
    },
    {
      boxes: [
        { id: 'T', label: 'T = { name: string; age: number; isAdmin: boolean }', state: 'normal' },
        { id: 'K', label: 'K = "name"', state: 'narrowed' },
        { id: 'ret', label: 'T[K] = string', state: 'result' },
      ],
      vars: [
        { label: 'K narrowed', value: '"name"' },
        { label: 'return type', value: 'T["name"] = string' },
      ],
      output: ['typeof a // string'],
      codeLine: 7,
      note: 'K narrowed to "name". T[K] resolves to T["name"] = string. So `a` is typed as `string`.',
    },
    {
      boxes: [
        { id: 'T', label: 'T = same user shape', state: 'normal' },
        { id: 'K', label: 'K = "age"', state: 'narrowed' },
        { id: 'ret', label: 'T[K] = number', state: 'result' },
      ],
      vars: [
        { label: 'call', value: 'pluck(user, "age")' },
        { label: 'return type', value: 'number' },
      ],
      output: ['typeof a // string', 'typeof b // number'],
      codeLine: 8,
      note: 'Call 2. Same T, K narrows to "age". Returns number.',
    },
    {
      boxes: [
        { id: 'T', label: 'T = same user shape', state: 'normal' },
        { id: 'K', label: 'K = "isAdmin"', state: 'narrowed' },
        { id: 'ret', label: 'T[K] = boolean', state: 'result' },
      ],
      vars: [{ label: 'return type', value: 'boolean' }],
      output: ['typeof a // string', 'typeof b // number', 'typeof c // boolean'],
      codeLine: 9,
      note: 'Call 3. Returns boolean. Each call site, TS recomputes T[K] for the specific K used.',
    },
    {
      boxes: [
        { id: 'T', label: 'T = same user shape', state: 'normal' },
        { id: 'K', label: '"xxx" — NOT in keyof T', state: 'eliminated' },
        { id: 'err', label: 'compile error', state: 'eliminated' },
      ],
      vars: [{ label: 'attempt', value: 'pluck(user, "xxx")' }],
      output: ['typeof a // string', 'typeof b // number', 'typeof c // boolean'],
      codeLine: 10,
      note: 'pluck(user, "xxx") would fail to compile. K must extend keyof T = "name" | "age" | "isAdmin". The constraint catches the bug at compile time, no runtime cost.',
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 3 — Conditional Types + `infer`
// ---------------------------------------------------------------------------

const conditional: TSScenario = {
  id: 'conditional-infer',
  name: 'Conditional + infer',
  flavor: 'conditional',
  blurb:
    "Conditional types branch like ternaries but at the type level: `T extends U ? X : Y`. The `infer` keyword extracts a type from inside the matched pattern — this is how built-ins like ReturnType, Awaited, and Parameters work.",
  code: [
    `// Re-implement built-in ReturnType<T>`,
    `type MyReturn<T> = T extends (...args: any[]) => infer R ? R : never`,
    ``,
    `function getUser() { return { id: 1, name: "Alice" } }`,
    `function getAge():  number { return 30 }`,
    `const notFn = 42`,
    ``,
    `type U = MyReturn<typeof getUser>  // { id: number; name: string }`,
    `type A = MyReturn<typeof getAge>   // number`,
    `type N = MyReturn<typeof notFn>    // never (didn't match function shape)`,
  ],
  steps: [
    {
      expression: 'MyReturn<T> = T extends (...args: any[]) => infer R ? R : never',
      boxes: [
        { id: 'T', label: 'T (free)', state: 'normal', detail: 'input type' },
        { id: 'R', label: 'R (to be inferred)', state: 'normal' },
      ],
      vars: [{ label: 'shape', value: 'a conditional type' }],
      output: [],
      codeLine: 2,
      note: 'Definition. The pattern `(...args) => infer R` says: match any function and capture its return type as R. If it matches, return R. Otherwise return never.',
    },
    {
      expression: 'MyReturn<typeof getUser>',
      boxes: [
        { id: 'T', label: 'T = () => { id; name }', state: 'inferred' },
        { id: 'R', label: 'R (about to infer)', state: 'normal' },
      ],
      vars: [
        { label: 'instantiation', value: 'MyReturn<typeof getUser>' },
        { label: 'T resolves to', value: '() => { id: number; name: string }' },
      ],
      output: [],
      codeLine: 8,
      note: 'Instantiate with T = typeof getUser. Does T match `(...args) => infer R`? Yes — getUser is a function.',
    },
    {
      expression: 'R is inferred = { id: number; name: string }',
      boxes: [
        { id: 'T', label: 'T matched', state: 'normal' },
        { id: 'R', label: '{ id: number; name: string }', state: 'inferred', detail: "extracted from T's return slot" },
      ],
      vars: [{ label: 'inferred R', value: '{ id: number; name: string }' }],
      output: [],
      codeLine: 8,
      note: 'TS extracts R from the return-type slot of T. The pattern matched — return R.',
    },
    {
      expression: 'MyReturn<typeof getUser> = { id: number; name: string }',
      boxes: [
        { id: 'result', label: '{ id: number; name: string }', state: 'result' },
      ],
      vars: [{ label: 'U', value: '{ id: number; name: string }' }],
      output: ['type U = { id: number; name: string }'],
      codeLine: 8,
      note: 'Type U is now { id: number; name: string }. The conditional returned its true-branch.',
    },
    {
      expression: 'MyReturn<typeof getAge>',
      boxes: [
        { id: 'T', label: 'T = () => number', state: 'inferred' },
        { id: 'R', label: 'number', state: 'inferred' },
      ],
      vars: [{ label: 'A', value: 'number' }],
      output: [
        'type U = { id: number; name: string }',
        'type A = number',
      ],
      codeLine: 9,
      note: 'Repeat for getAge. R is inferred as number. A = number.',
    },
    {
      expression: 'MyReturn<typeof notFn>',
      boxes: [
        { id: 'T', label: 'T = number (not a fn)', state: 'eliminated' },
        { id: 'result', label: 'never (fallback)', state: 'result' },
      ],
      vars: [{ label: 'N', value: 'never' }],
      output: [
        'type U = { id: number; name: string }',
        'type A = number',
        'type N = never',
      ],
      codeLine: 10,
      note: 'T = number does NOT match `(...args) => infer R`. The conditional returns its false-branch → `never`. N = never.',
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 4 — Mapped Types: DeepPartial
// ---------------------------------------------------------------------------

const mapped: TSScenario = {
  id: 'mapped-deep-partial',
  name: 'Mapped types — DeepPartial',
  flavor: 'mapped',
  blurb:
    "A mapped type builds a new type by walking the keys of another (`[K in keyof T]: …`). DeepPartial makes every property optional, recursively. This is what enables typed redux-style partial updates, settings objects, and config merging.",
  code: [
    `type DeepPartial<T> = {`,
    `  [K in keyof T]?: T[K] extends object`,
    `    ? DeepPartial<T[K]>     // recurse`,
    `    : T[K]                  // leaf — keep as-is`,
    `}`,
    ``,
    `interface Config {`,
    `  api: { url: string; retries: number }`,
    `  ui:  { theme: 'light' | 'dark'; density: 'comfy' | 'compact' }`,
    `  flag: boolean`,
    `}`,
    ``,
    `type ConfigPatch = DeepPartial<Config>`,
  ],
  steps: [
    {
      compare: {
        before: {
          label: 'Config',
          lines: [
            'interface Config {',
            '  api: {',
            '    url: string',
            '    retries: number',
            '  }',
            '  ui: {',
            '    theme: "light" | "dark"',
            '    density: "comfy" | "compact"',
            '  }',
            '  flag: boolean',
            '}',
          ],
        },
        after: {
          label: 'ConfigPatch (pending…)',
          lines: ['{}'],
        },
      },
      vars: [{ label: 'target', value: 'DeepPartial<Config>' }],
      output: [],
      codeLine: 1,
      note: 'Goal: turn Config into a type where every nested field is optional. We walk each key of Config and decide leaf vs recurse.',
    },
    {
      compare: {
        before: {
          label: 'Config (visiting "api")',
          lines: [
            'interface Config {',
            '→ api: { url; retries }',
            '  ui: { theme; density }',
            '  flag: boolean',
            '}',
          ],
        },
        after: {
          label: 'ConfigPatch',
          lines: ['{', '  api?: DeepPartial<{ url; retries }>', '  // …', '}'],
        },
      },
      vars: [
        { label: 'K', value: '"api"' },
        { label: 'T[K]', value: '{ url; retries } — is object → recurse' },
      ],
      output: [],
      codeLine: 2,
      note: 'Visit key "api". Its value type is an object → take the recursive branch: DeepPartial<{ url; retries }>.',
    },
    {
      compare: {
        before: {
          label: 'recursing into { url; retries }',
          lines: [
            '{',
            '  url: string      // leaf',
            '  retries: number  // leaf',
            '}',
          ],
        },
        after: {
          label: 'ConfigPatch.api',
          lines: ['api?: {', '  url?: string', '  retries?: number', '}'],
        },
      },
      vars: [
        { label: 'depth', value: '1 (inside api)' },
        { label: 'leaves', value: 'url (string), retries (number)' },
      ],
      output: [],
      codeLine: 4,
      note: 'Inside api: url and retries are primitives → leaf branch (keep as-is). Both wrapped in ?. Recursion bottoms out.',
    },
    {
      compare: {
        before: {
          label: 'Config (visiting "ui")',
          lines: [
            'interface Config {',
            '  api: { … } ✓',
            '→ ui: { theme; density }',
            '  flag: boolean',
            '}',
          ],
        },
        after: {
          label: 'ConfigPatch',
          lines: [
            '{',
            '  api?: { url?; retries? }',
            '  ui?: DeepPartial<{ theme; density }>',
            '  // …',
            '}',
          ],
        },
      },
      vars: [
        { label: 'K', value: '"ui"' },
        { label: 'T[K]', value: '{ theme; density } — is object → recurse' },
      ],
      output: [],
      codeLine: 2,
      note: 'Visit "ui". Object → recurse again.',
    },
    {
      compare: {
        before: {
          label: 'Config (visiting "flag")',
          lines: [
            'interface Config {',
            '  api: { … } ✓',
            '  ui: { … } ✓',
            '→ flag: boolean',
            '}',
          ],
        },
        after: {
          label: 'ConfigPatch',
          lines: [
            '{',
            '  api?: { url?; retries? }',
            '  ui?: { theme?; density? }',
            '  flag?: boolean',
            '}',
          ],
        },
      },
      vars: [
        { label: 'K', value: '"flag"' },
        { label: 'T[K]', value: 'boolean — leaf' },
      ],
      output: [],
      codeLine: 4,
      note: 'Visit "flag". It\'s a primitive (boolean) → leaf branch. flag? : boolean.',
    },
    {
      compare: {
        before: { label: 'Config (done)', lines: ['interface Config { … all visited }'] },
        after: {
          label: 'ConfigPatch (full result)',
          lines: [
            'type ConfigPatch = {',
            '  api?: {',
            '    url?: string',
            '    retries?: number',
            '  }',
            '  ui?: {',
            '    theme?: "light" | "dark"',
            '    density?: "comfy" | "compact"',
            '  }',
            '  flag?: boolean',
            '}',
          ],
        },
      },
      vars: [{ label: 'done', value: 'all keys mapped' }],
      output: ['type ConfigPatch = (see right panel)'],
      codeLine: 13,
      note: 'Done. Every level of Config is now optional. You can pass `{ ui: { theme: "dark" } }` and TS accepts it — partial nested update.',
    },
  ],
}

export const scenarios: TSScenario[] = [narrowing, generics, conditional, mapped]
