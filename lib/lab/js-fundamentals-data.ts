// JS Fundamentals visualizer — data model.
//
// Five scenarios cover the JS concepts that come up in every senior FE
// interview: closures, currying, hoisting, `this` binding, and the
// prototype chain. Each step renders a code panel + a "memory state"
// view (scope chain or prototype chain) + console output.

export type ScopeKind = 'global' | 'function' | 'block' | 'closure' | 'partial'

export interface ScopeVar {
  name: string
  value: string
  // Visual marker — accent-emerald for newly defined, accent-amber for changed,
  // muted for hoisted-but-undefined.
  state?: 'normal' | 'new' | 'changed' | 'hoisted'
}

export interface Scope {
  id: string
  kind: ScopeKind
  label: string // 'global', 'makeCounter()', 'inner()', etc.
  variables: ScopeVar[]
  // If truthy, marks this scope as the one currently executing.
  active?: boolean
}

export interface ProtoLink {
  label: string // 'instance', 'Person.prototype', 'Object.prototype'
  // Things we care about on this object — methods or props.
  members: string[]
  // The state of this link in the property-lookup walk:
  //   'searching'  — currently inspecting
  //   'miss'       — searched, not found, walk continues up
  //   'found'      — property located here
  state?: 'normal' | 'searching' | 'miss' | 'found'
}

export interface JSFundamentalsStep {
  // Scope chain at this step (innermost first).
  scopes: Scope[]
  // Optional `this` binding callout.
  thisContext?: string
  // Optional prototype chain (for the prototype scenario).
  prototypeChain?: ProtoLink[]
  // Accumulated console output up to this step.
  output: string[]
  // Active code line (1-indexed; 0 = none).
  codeLine: number
  note: string
}

export interface JSFundamentalsScenario {
  id: string
  name: string
  flavor: 'closure' | 'curry' | 'hoisting' | 'this' | 'prototype'
  blurb: string
  code: string[]
  // Whether this scenario uses the prototype-chain renderer.
  showPrototypeChain?: boolean
  // Whether to highlight a `this` indicator panel.
  showThis?: boolean
  steps: JSFundamentalsStep[]
}

// ---------------------------------------------------------------------------
// Scenario 1 — Closures
// ---------------------------------------------------------------------------

const closures: JSFundamentalsScenario = {
  id: 'closures',
  name: 'Closures',
  flavor: 'closure',
  blurb:
    'A closure is a function that remembers the variables of the scope where it was created — even after that scope has returned. The classic counter example shows persistent private state without a class.',
  code: [
    `function makeCounter() {`,
    `  let count = 0`,
    ``,
    `  return function increment() {`,
    `    count++`,
    `    return count`,
    `  }`,
    `}`,
    ``,
    `const counter = makeCounter()`,
    `console.log(counter())  // 1`,
    `console.log(counter())  // 2`,
    `console.log(counter())  // 3`,
  ],
  steps: [
    {
      scopes: [{ id: 'g', kind: 'global', label: 'global', variables: [], active: true }],
      output: [],
      codeLine: 1,
      note: 'Start at module scope. About to define makeCounter.',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [{ name: 'makeCounter', value: '<fn>', state: 'new' }],
          active: true,
        },
      ],
      output: [],
      codeLine: 1,
      note: 'makeCounter is now a binding in global scope.',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [
            { name: 'makeCounter', value: '<fn>' },
            { name: 'counter', value: 'pending…', state: 'new' },
          ],
        },
        {
          id: 'mc',
          kind: 'function',
          label: 'makeCounter()',
          variables: [],
          active: true,
        },
      ],
      output: [],
      codeLine: 10,
      note: 'Call makeCounter(). A new function scope is pushed on top of global.',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [
            { name: 'makeCounter', value: '<fn>' },
            { name: 'counter', value: 'pending…' },
          ],
        },
        {
          id: 'mc',
          kind: 'function',
          label: 'makeCounter()',
          variables: [{ name: 'count', value: '0', state: 'new' }],
          active: true,
        },
      ],
      output: [],
      codeLine: 2,
      note: 'Inside makeCounter: `count` is declared and set to 0. It lives in makeCounter\'s scope.',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [
            { name: 'makeCounter', value: '<fn>' },
            { name: 'counter', value: 'pending…' },
          ],
        },
        {
          id: 'mc',
          kind: 'function',
          label: 'makeCounter()',
          variables: [{ name: 'count', value: '0' }],
          active: true,
        },
      ],
      output: [],
      codeLine: 4,
      note: 'makeCounter returns the inner `increment` function. The inner function captures the surrounding scope — that\'s the closure.',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [
            { name: 'makeCounter', value: '<fn>' },
            { name: 'counter', value: '<fn> (closed over count)', state: 'changed' },
          ],
          active: true,
        },
        {
          id: 'mc-closure',
          kind: 'closure',
          label: 'makeCounter\'s closed scope',
          variables: [{ name: 'count', value: '0' }],
        },
      ],
      output: [],
      codeLine: 10,
      note: 'makeCounter has returned. Its scope normally would be GC\'d — BUT `counter` (the inner fn) still references `count`, so the scope is kept alive in memory.',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [
            { name: 'makeCounter', value: '<fn>' },
            { name: 'counter', value: '<fn>' },
          ],
        },
        {
          id: 'mc-closure',
          kind: 'closure',
          label: 'makeCounter\'s closed scope',
          variables: [{ name: 'count', value: '0' }],
        },
        {
          id: 'inc1',
          kind: 'function',
          label: 'increment()',
          variables: [],
          active: true,
        },
      ],
      output: [],
      codeLine: 5,
      note: 'Call counter(). Inside increment, JS looks for `count` — not in local scope → walk up the chain → found in the closure.',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [
            { name: 'makeCounter', value: '<fn>' },
            { name: 'counter', value: '<fn>' },
          ],
        },
        {
          id: 'mc-closure',
          kind: 'closure',
          label: 'makeCounter\'s closed scope',
          variables: [{ name: 'count', value: '1', state: 'changed' }],
        },
        {
          id: 'inc1',
          kind: 'function',
          label: 'increment()',
          variables: [],
          active: true,
        },
      ],
      output: [],
      codeLine: 5,
      note: 'count++ mutates the closed-over variable. count is now 1 — and it sticks across calls.',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [
            { name: 'makeCounter', value: '<fn>' },
            { name: 'counter', value: '<fn>' },
          ],
          active: true,
        },
        {
          id: 'mc-closure',
          kind: 'closure',
          label: 'makeCounter\'s closed scope',
          variables: [{ name: 'count', value: '1' }],
        },
      ],
      output: ['1'],
      codeLine: 11,
      note: 'increment returns 1. Console logs 1. The increment function has returned, but the closure scope is still alive.',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [
            { name: 'makeCounter', value: '<fn>' },
            { name: 'counter', value: '<fn>' },
          ],
        },
        {
          id: 'mc-closure',
          kind: 'closure',
          label: 'makeCounter\'s closed scope',
          variables: [{ name: 'count', value: '2', state: 'changed' }],
          active: true,
        },
      ],
      output: ['1', '2'],
      codeLine: 12,
      note: 'Call counter() again. The SAME closure is referenced. count is now 2. Logs 2.',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [
            { name: 'makeCounter', value: '<fn>' },
            { name: 'counter', value: '<fn>' },
          ],
        },
        {
          id: 'mc-closure',
          kind: 'closure',
          label: 'makeCounter\'s closed scope',
          variables: [{ name: 'count', value: '3', state: 'changed' }],
          active: true,
        },
      ],
      output: ['1', '2', '3'],
      codeLine: 13,
      note: 'Third call. count is 3. Each call mutates the SAME closed-over variable — private state without a class.',
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 2 — Currying
// ---------------------------------------------------------------------------

const currying: JSFundamentalsScenario = {
  id: 'currying',
  name: 'Currying',
  flavor: 'curry',
  blurb:
    'Currying converts f(a, b, c) into f(a)(b)(c). Each partial application returns a new function that closes over the args so far. Useful for: pre-binding config, building reusable pipelines, function composition.',
  code: [
    `function add(a, b, c) {`,
    `  return a + b + c`,
    `}`,
    ``,
    `function curry(fn) {`,
    `  return function curried(...args) {`,
    `    if (args.length >= fn.length) {`,
    `      return fn(...args)`,
    `    }`,
    `    return (...more) => curried(...args, ...more)`,
    `  }`,
    `}`,
    ``,
    `const cAdd = curry(add)`,
    `const result = cAdd(1)(2)(3)  // → 6`,
  ],
  steps: [
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [
            { name: 'add', value: '<fn> (arity 3)', state: 'new' },
            { name: 'curry', value: '<fn>', state: 'new' },
          ],
          active: true,
        },
      ],
      output: [],
      codeLine: 5,
      note: 'add takes 3 args. curry wraps it so we can pass them one at a time.',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [
            { name: 'add', value: '<fn>' },
            { name: 'curry', value: '<fn>' },
            { name: 'cAdd', value: 'curried (args=[])', state: 'new' },
          ],
          active: true,
        },
      ],
      output: [],
      codeLine: 14,
      note: 'cAdd = curry(add). cAdd is the inner `curried` function with empty args.',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [
            { name: 'add', value: '<fn>' },
            { name: 'curry', value: '<fn>' },
            { name: 'cAdd', value: 'curried (args=[])' },
          ],
        },
        {
          id: 'p1',
          kind: 'partial',
          label: 'cAdd(1)',
          variables: [{ name: 'args', value: '[1]', state: 'new' }],
          active: true,
        },
      ],
      output: [],
      codeLine: 6,
      note: 'Call cAdd(1). args = [1]. 1 < add.length (3) → return a new function closed over args.',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [
            { name: 'add', value: '<fn>' },
            { name: 'curry', value: '<fn>' },
            { name: 'cAdd', value: 'curried (args=[])' },
          ],
        },
        {
          id: 'p1c',
          kind: 'closure',
          label: 'partial (args=[1])',
          variables: [{ name: 'args', value: '[1]' }],
          active: true,
        },
      ],
      output: [],
      codeLine: 10,
      note: 'Returned partial holds args=[1] in its closure. Hand-off to next call.',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [
            { name: 'add', value: '<fn>' },
            { name: 'curry', value: '<fn>' },
            { name: 'cAdd', value: 'curried (args=[])' },
          ],
        },
        {
          id: 'p1c',
          kind: 'closure',
          label: 'partial (args=[1])',
          variables: [{ name: 'args', value: '[1]' }],
        },
        {
          id: 'p2c',
          kind: 'partial',
          label: 'partial(2) — merge to [1, 2]',
          variables: [{ name: 'more', value: '[2]', state: 'new' }],
          active: true,
        },
      ],
      output: [],
      codeLine: 10,
      note: 'Call partial(2). more=[2]. Internally calls curried(...args, ...more) = curried(1, 2).',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [
            { name: 'add', value: '<fn>' },
            { name: 'curry', value: '<fn>' },
            { name: 'cAdd', value: 'curried (args=[])' },
          ],
        },
        {
          id: 'p2',
          kind: 'closure',
          label: 'partial (args=[1, 2])',
          variables: [{ name: 'args', value: '[1, 2]', state: 'changed' }],
          active: true,
        },
      ],
      output: [],
      codeLine: 10,
      note: '2 < 3 → still not enough. Return ANOTHER partial closed over [1, 2].',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [
            { name: 'add', value: '<fn>' },
            { name: 'curry', value: '<fn>' },
            { name: 'cAdd', value: 'curried (args=[])' },
            { name: 'result', value: 'pending…', state: 'new' },
          ],
        },
        {
          id: 'p3',
          kind: 'partial',
          label: 'partial(3) — args become [1, 2, 3]',
          variables: [
            { name: 'args', value: '[1, 2]' },
            { name: 'more', value: '[3]', state: 'new' },
          ],
          active: true,
        },
      ],
      output: [],
      codeLine: 7,
      note: 'Call third partial with 3. Recurses → args = [1, 2, 3]. Now args.length (3) === fn.length (3) → invoke add.',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [
            { name: 'add', value: '<fn>' },
            { name: 'curry', value: '<fn>' },
            { name: 'cAdd', value: 'curried (args=[])' },
            { name: 'result', value: '6', state: 'changed' },
          ],
          active: true,
        },
      ],
      output: [],
      codeLine: 15,
      note: 'add(1, 2, 3) = 6. The partial chain collapses. All 3 closures are now eligible for GC.',
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 3 — Hoisting (var vs let vs function)
// ---------------------------------------------------------------------------

const hoisting: JSFundamentalsScenario = {
  id: 'hoisting',
  name: 'Hoisting',
  flavor: 'hoisting',
  blurb:
    'JS scans each scope BEFORE executing it, hoisting declarations to the top. `var` is hoisted as undefined. `function` is hoisted with its full body. `let` and `const` are hoisted but uninitialized — the "temporal dead zone".',
  code: [
    `console.log(a)        // undefined  — var hoisted`,
    `console.log(b())      // works      — fn declaration hoisted`,
    `// console.log(c)     // ReferenceError — let in TDZ`,
    ``,
    `var a = 10`,
    `function b() { return 'hi' }`,
    `let c = 20`,
    ``,
    `console.log(a, b(), c) // 10 'hi' 20`,
  ],
  steps: [
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global — COMPILE PASS',
          variables: [],
          active: true,
        },
      ],
      output: [],
      codeLine: 0,
      note: 'Before execution: JS scans the scope. We are in the COMPILE pass.',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global — COMPILE PASS',
          variables: [
            { name: 'a', value: 'undefined', state: 'hoisted' },
            { name: 'b', value: '<fn>', state: 'new' },
            { name: 'c', value: '<TDZ>', state: 'hoisted' },
          ],
          active: true,
        },
      ],
      output: [],
      codeLine: 0,
      note: 'Hoisting: `var a` → undefined. `function b` → full body available. `let c` → exists but TDZ — accessing throws.',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global — EXECUTION',
          variables: [
            { name: 'a', value: 'undefined' },
            { name: 'b', value: '<fn>' },
            { name: 'c', value: '<TDZ>' },
          ],
          active: true,
        },
      ],
      output: [],
      codeLine: 1,
      note: 'Now execute line by line. console.log(a) — reads `a` from the hoisted slot.',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [
            { name: 'a', value: 'undefined' },
            { name: 'b', value: '<fn>' },
            { name: 'c', value: '<TDZ>' },
          ],
          active: true,
        },
      ],
      output: ['undefined'],
      codeLine: 1,
      note: 'Logs "undefined". `var` declarations are hoisted but their values are NOT — only the binding exists.',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [
            { name: 'a', value: 'undefined' },
            { name: 'b', value: '<fn>' },
            { name: 'c', value: '<TDZ>' },
          ],
          active: true,
        },
      ],
      output: ['undefined', 'hi'],
      codeLine: 2,
      note: 'Logs "hi". `function` declarations are hoisted WITH their body — callable before the source line.',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [
            { name: 'a', value: '10', state: 'changed' },
            { name: 'b', value: '<fn>' },
            { name: 'c', value: '<TDZ>' },
          ],
          active: true,
        },
      ],
      output: ['undefined', 'hi'],
      codeLine: 5,
      note: 'Execute `var a = 10`. The hoisted slot is now assigned 10.',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [
            { name: 'a', value: '10' },
            { name: 'b', value: '<fn>' },
            { name: 'c', value: '20', state: 'changed' },
          ],
          active: true,
        },
      ],
      output: ['undefined', 'hi'],
      codeLine: 7,
      note: 'Execute `let c = 20`. The TDZ ends — `c` is now usable. If we had tried to read `c` before this line it would have thrown.',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [
            { name: 'a', value: '10' },
            { name: 'b', value: '<fn>' },
            { name: 'c', value: '20' },
          ],
          active: true,
        },
      ],
      output: ['undefined', 'hi', '10 hi 20'],
      codeLine: 9,
      note: 'Final log: all three values read correctly. The takeaway: `var` is hoisted as undefined, `function` is hoisted whole, `let`/`const` are hoisted but in TDZ until their declaration line.',
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 4 — `this` binding (4 rules)
// ---------------------------------------------------------------------------

const thisBinding: JSFundamentalsScenario = {
  id: 'this-binding',
  name: '`this` binding',
  flavor: 'this',
  blurb:
    "`this` is determined at CALL TIME, not declaration time. Four binding rules in priority order: new > explicit (call/apply/bind) > implicit (obj.method()) > default (window/undefined in strict).",
  showThis: true,
  code: [
    `function whoami() {`,
    `  return this.name`,
    `}`,
    ``,
    `// 1. Default binding (undefined in strict mode)`,
    `whoami()                          // undefined`,
    ``,
    `// 2. Implicit binding`,
    `const user = { name: 'Alice', say: whoami }`,
    `user.say()                        // 'Alice'`,
    ``,
    `// 3. Explicit binding`,
    `whoami.call({ name: 'Bob' })      // 'Bob'`,
    ``,
    `// 4. new binding`,
    `function Person(name) { this.name = name }`,
    `const p = new Person('Carol')     // p.name = 'Carol'`,
  ],
  steps: [
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [{ name: 'whoami', value: '<fn>' }],
          active: true,
        },
      ],
      output: [],
      codeLine: 1,
      note: 'whoami is just a function. It reads this.name. The value of `this` depends on HOW it is called.',
    },
    {
      scopes: [
        {
          id: 'wcall1',
          kind: 'function',
          label: 'whoami() — default call',
          variables: [],
          active: true,
        },
      ],
      thisContext: 'undefined (strict mode) / window (sloppy)',
      output: [],
      codeLine: 6,
      note: 'Default binding: whoami() called with no context. In strict mode, this = undefined. Reading .name throws.',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [{ name: 'user', value: '{ name: "Alice", say: whoami }', state: 'new' }],
          active: true,
        },
      ],
      thisContext: 'undefined',
      output: [],
      codeLine: 9,
      note: 'Define user with name "Alice" and a method `say` referencing whoami.',
    },
    {
      scopes: [
        {
          id: 'wcall2',
          kind: 'function',
          label: 'user.say() — implicit',
          variables: [],
          active: true,
        },
      ],
      thisContext: 'user → "Alice"',
      output: ['Alice'],
      codeLine: 10,
      note: 'Implicit binding. user.say() → `this` is the object before the dot (user). Logs "Alice".',
    },
    {
      scopes: [
        {
          id: 'wcall3',
          kind: 'function',
          label: 'whoami.call({name: "Bob"})',
          variables: [],
          active: true,
        },
      ],
      thisContext: '{ name: "Bob" } (forced via .call)',
      output: ['Alice', 'Bob'],
      codeLine: 13,
      note: 'Explicit binding via .call(thisArg, ...args). `this` is forced to the passed object. Logs "Bob".',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [{ name: 'Person', value: '<fn (constructor)>', state: 'new' }],
          active: true,
        },
      ],
      thisContext: 'undefined',
      output: ['Alice', 'Bob'],
      codeLine: 16,
      note: 'Define Person constructor.',
    },
    {
      scopes: [
        {
          id: 'pcall',
          kind: 'function',
          label: 'new Person("Carol")',
          variables: [{ name: 'name', value: '"Carol"' }],
          active: true,
        },
      ],
      thisContext: 'a fresh empty object {} (created by `new`)',
      output: ['Alice', 'Bob'],
      codeLine: 16,
      note: '`new Person("Carol")` does four things: 1) creates a fresh object, 2) binds `this` to it, 3) runs the body, 4) returns it (unless body returns its own object).',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [
            { name: 'Person', value: '<fn>' },
            { name: 'p', value: '{ name: "Carol" }', state: 'new' },
          ],
          active: true,
        },
      ],
      thisContext: 'p (the new instance)',
      output: ['Alice', 'Bob'],
      codeLine: 17,
      note: 'After new: p is { name: "Carol" }. The 4 rules in priority: new > call/apply/bind > obj.method() > default.',
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 5 — Prototype chain (property lookup)
// ---------------------------------------------------------------------------

const prototype: JSFundamentalsScenario = {
  id: 'prototype-chain',
  name: 'Prototype chain',
  flavor: 'prototype',
  blurb:
    'Every JS object has an internal [[Prototype]] reference. When you read a property, the engine walks UP the chain until it finds it or hits null. This chain is also what `class` syntax sugar produces under the hood.',
  showPrototypeChain: true,
  code: [
    `class Animal {`,
    `  constructor(name) { this.name = name }`,
    `  describe() { return \`A \${this.name}\` }`,
    `}`,
    ``,
    `class Dog extends Animal {`,
    `  bark() { return 'woof!' }`,
    `}`,
    ``,
    `const d = new Dog('rex')`,
    `d.bark()         // own → 'woof!'`,
    `d.describe()     // walk up to Animal.prototype`,
    `d.toString()     // walk up to Object.prototype`,
  ],
  steps: [
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [
            { name: 'd', value: 'Dog instance', state: 'new' },
          ],
          active: true,
        },
      ],
      prototypeChain: [
        { label: 'd (instance)', members: ['name: "rex"'] },
        { label: 'Dog.prototype', members: ['bark()'] },
        { label: 'Animal.prototype', members: ['describe()'] },
        { label: 'Object.prototype', members: ['toString()', 'hasOwnProperty()'] },
        { label: 'null', members: [] },
      ],
      output: [],
      codeLine: 10,
      note: 'd is a new Dog. Its prototype chain: d → Dog.prototype → Animal.prototype → Object.prototype → null.',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [{ name: 'd', value: 'Dog instance' }],
          active: true,
        },
      ],
      prototypeChain: [
        { label: 'd (instance)', members: ['name: "rex"'], state: 'searching' },
        { label: 'Dog.prototype', members: ['bark()'] },
        { label: 'Animal.prototype', members: ['describe()'] },
        { label: 'Object.prototype', members: ['toString()'] },
        { label: 'null', members: [] },
      ],
      output: [],
      codeLine: 11,
      note: 'd.bark() — look for `bark` on d. Not an own property.',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [{ name: 'd', value: 'Dog instance' }],
          active: true,
        },
      ],
      prototypeChain: [
        { label: 'd (instance)', members: ['name: "rex"'], state: 'miss' },
        { label: 'Dog.prototype', members: ['bark()'], state: 'found' },
        { label: 'Animal.prototype', members: ['describe()'] },
        { label: 'Object.prototype', members: ['toString()'] },
        { label: 'null', members: [] },
      ],
      output: ['"woof!"'],
      codeLine: 11,
      note: 'Walk up to Dog.prototype. Found `bark`. Invoke it. Returns "woof!".',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [{ name: 'd', value: 'Dog instance' }],
          active: true,
        },
      ],
      prototypeChain: [
        { label: 'd (instance)', members: ['name: "rex"'], state: 'miss' },
        { label: 'Dog.prototype', members: ['bark()'], state: 'miss' },
        { label: 'Animal.prototype', members: ['describe()'], state: 'found' },
        { label: 'Object.prototype', members: ['toString()'] },
        { label: 'null', members: [] },
      ],
      output: ['"woof!"', '"A rex"'],
      codeLine: 12,
      note: 'd.describe() — not on d, not on Dog.prototype, found on Animal.prototype. Two hops up.',
    },
    {
      scopes: [
        {
          id: 'g',
          kind: 'global',
          label: 'global',
          variables: [{ name: 'd', value: 'Dog instance' }],
          active: true,
        },
      ],
      prototypeChain: [
        { label: 'd (instance)', members: ['name: "rex"'], state: 'miss' },
        { label: 'Dog.prototype', members: ['bark()'], state: 'miss' },
        { label: 'Animal.prototype', members: ['describe()'], state: 'miss' },
        { label: 'Object.prototype', members: ['toString()'], state: 'found' },
        { label: 'null', members: [] },
      ],
      output: ['"woof!"', '"A rex"', '"[object Object]"'],
      codeLine: 13,
      note: 'd.toString() — not on d, not on Dog or Animal prototypes, found on Object.prototype. Three hops. If it wasn\'t there, we\'d hit null and the lookup returns undefined.',
    },
  ],
}

export const scenarios: JSFundamentalsScenario[] = [
  closures,
  currying,
  hoisting,
  thisBinding,
  prototype,
]
