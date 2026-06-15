// Tricky Outputs visualizer — 6 classic "what does this print?" interview
// gotchas. Each is a multi-step reveal: read code → predict → reveal output
// → walk through the reasoning.

export interface TrickyStep {
  // What's visible at this step
  visibleCodeLines: number // how many lines of code to show
  // Has the user "revealed" the answer yet?
  showAnswer: boolean
  // Per-line annotation (1-indexed)
  annotations?: Array<{ line: number; text: string }>
  note: string
}

export interface TrickyOutputScenario {
  id: string
  name: string
  blurb: string
  code: string[]
  // The actual output the code produces, line-by-line
  output: string[]
  // The naive / wrong prediction most people make
  commonWrongAnswer: string
  // Why the actual output is what it is
  explanation: string[]
  // Difficulty
  difficulty: 'medium' | 'hard'
  steps: TrickyStep[]
}

// ---------------------------------------------------------------------------
// Scenario 1 — Coercion: [] == ![]
// ---------------------------------------------------------------------------

const coercion: TrickyOutputScenario = {
  id: 'coercion',
  name: '[] == ![]',
  difficulty: 'hard',
  blurb: 'The most famous WTF in JS. == on the left side, ! on the right — three coercion rules collide.',
  code: [
    `console.log([] == ![])`,
    ``,
    `// Why true? Three coercions in sequence:`,
    `// 1. ![] → false (any object is truthy → ! makes it false)`,
    `// 2. [] == false → [] == 0 (boolean coerces to number)`,
    `// 3. [] == 0 → "" == 0 (array.toString() = "")`,
    `// 4. "" == 0 → 0 == 0 (empty string coerces to 0)`,
    `// → true`,
  ],
  output: ['true'],
  commonWrongAnswer: 'false (since [] !== ![])',
  explanation: [
    "Step 1: ![] = false (any object is truthy, ! negates it).",
    "Step 2: [] == false → coerce RHS to Number → [] == 0.",
    "Step 3: [] == 0 → coerce LHS to primitive via valueOf/toString → [] becomes \"\" .",
    "Step 4: \"\" == 0 → coerce \"\" to Number → 0 == 0 → true.",
    "Moral: always use === in production. == is a maze.",
  ],
  steps: [
    {
      visibleCodeLines: 1,
      showAnswer: false,
      note: 'Predict the output of `[] == ![]`. (Click step forward when ready.)',
    },
    {
      visibleCodeLines: 1,
      showAnswer: true,
      note: 'Output: true. Why?',
    },
    {
      visibleCodeLines: 8,
      showAnswer: true,
      annotations: [
        { line: 4, text: '! coerces array to boolean (true) then negates → false' },
      ],
      note: 'Step 1: ![] = false. Any object (including []) is truthy. ! makes it false.',
    },
    {
      visibleCodeLines: 8,
      showAnswer: true,
      annotations: [
        { line: 5, text: '== with a boolean: convert boolean to number first' },
      ],
      note: 'Step 2: [] == false. The == operator converts the boolean side to a number → [] == 0.',
    },
    {
      visibleCodeLines: 8,
      showAnswer: true,
      annotations: [
        { line: 6, text: 'Object == primitive: convert object to primitive via toString' },
      ],
      note: 'Step 3: [] == 0. Now we have object == number. Convert [] to a primitive: [].toString() = "". So "" == 0.',
    },
    {
      visibleCodeLines: 8,
      showAnswer: true,
      annotations: [
        { line: 7, text: 'String == number: convert string to number' },
      ],
      note: 'Step 4: "" == 0. String to number: Number("") = 0. So 0 == 0 = true.',
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 2 — typeof null
// ---------------------------------------------------------------------------

const typeofNull: TrickyOutputScenario = {
  id: 'typeof-null',
  name: 'typeof null',
  difficulty: 'medium',
  blurb: 'A 30-year-old bug in JS that can never be fixed without breaking the web.',
  code: [
    `console.log(typeof null)         // ?`,
    `console.log(typeof undefined)    // ?`,
    `console.log(typeof [])           // ?`,
    `console.log(typeof function(){}) // ?`,
    `console.log(typeof NaN)          // ?`,
  ],
  output: ['"object"', '"undefined"', '"object"', '"function"', '"number"'],
  commonWrongAnswer: 'typeof null → "null" (intuitive but wrong)',
  explanation: [
    'typeof null returns "object" because of a bug in the very first JS implementation. Values in early JS were stored as a 32-bit word: low 3 bits = type tag, upper 29 bits = value. 0 was the tag for object. null was represented as ALL ZEROS, so its type tag was 0 → "object".',
    'They never fixed it because too much code relies on it.',
    "Other notes: typeof [] is 'object' (arrays ARE objects). typeof function is 'function' (the only callable type). typeof NaN is 'number' because NaN is a special numeric value (Not-a-Number is still typed as a Number).",
  ],
  steps: [
    {
      visibleCodeLines: 5,
      showAnswer: false,
      note: 'Predict all 5 outputs. Step forward to reveal.',
    },
    {
      visibleCodeLines: 5,
      showAnswer: true,
      annotations: [
        { line: 1, text: '→ "object" (the famous bug)' },
        { line: 2, text: '→ "undefined"' },
        { line: 3, text: '→ "object" (arrays ARE objects)' },
        { line: 4, text: '→ "function" (only callable type)' },
        { line: 5, text: '→ "number" (NaN is still numeric)' },
      ],
      note: 'All 5 answers. The big one: typeof null is "object" because of a bug in the original JS implementation. The type tag for object was 0, and null was represented as all-zeros.',
    },
    {
      visibleCodeLines: 5,
      showAnswer: true,
      annotations: [
        { line: 1, text: 'use null === null OR `x == null` (catches null AND undefined)' },
      ],
      note: 'To safely check for null: use === null directly. Or use `x == null` (one of the rare valid uses of ==) which is true for BOTH null and undefined.',
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 3 — var hoisting trap
// ---------------------------------------------------------------------------

const hoistingTrap: TrickyOutputScenario = {
  id: 'hoisting-trap',
  name: 'var hoisting trap',
  difficulty: 'medium',
  blurb: 'A var declared inside a block hoists to the function, but the if-block guard never runs. Where is x at the end?',
  code: [
    `function foo() {`,
    `  console.log(x)`,
    ``,
    `  if (false) {`,
    `    var x = 10`,
    `  }`,
    ``,
    `  console.log(x)`,
    `}`,
    `foo()`,
  ],
  output: ['undefined', 'undefined'],
  commonWrongAnswer: 'ReferenceError, OR 10',
  explanation: [
    'The `var x` declaration is hoisted to the TOP of the function (not the block — var has function scope). But the assignment (= 10) stays where it is, inside the never-taken if branch.',
    'So `x` exists as a binding from the start of foo, with value undefined. Both console.logs see it as undefined.',
    'With `let` instead of `var`: line 2 would throw ReferenceError (TDZ), because let has block scope.',
  ],
  steps: [
    {
      visibleCodeLines: 10,
      showAnswer: false,
      note: 'Predict the output.',
    },
    {
      visibleCodeLines: 10,
      showAnswer: true,
      note: 'Output: "undefined", "undefined". Both logs see x as undefined.',
    },
    {
      visibleCodeLines: 10,
      showAnswer: true,
      annotations: [
        { line: 1, text: 'var x is hoisted to here — value = undefined' },
        { line: 2, text: 'logs the hoisted-but-unassigned x' },
        { line: 4, text: 'if (false) NEVER runs' },
        { line: 5, text: 'this line never executes — assignment skipped' },
        { line: 8, text: 'still undefined' },
      ],
      note: 'var hoists the binding (not the value). The if block never runs, so the = 10 assignment never happens. x stays undefined throughout.',
    },
    {
      visibleCodeLines: 10,
      showAnswer: true,
      annotations: [
        { line: 5, text: 'change to `let x = 10`: line 2 would throw (TDZ in BLOCK scope)' },
      ],
      note: 'Why use let/const: let/const have block scope and use TDZ. Replacing `var` with `let` would make line 2 throw ReferenceError — usually what you want (early failure beats undefined surprises).',
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 4 — `this` drift in callbacks
// ---------------------------------------------------------------------------

const thisDrift: TrickyOutputScenario = {
  id: 'this-drift',
  name: '`this` drift',
  difficulty: 'medium',
  blurb: 'A method that calls itself via setTimeout. Where does `this` end up pointing?',
  code: [
    `class Greeter {`,
    `  name = "Alice"`,
    `  hello() {`,
    `    setTimeout(function () {`,
    `      console.log("Hi, " + this.name)`,
    `    }, 0)`,
    `  }`,
    `}`,
    ``,
    `new Greeter().hello()`,
  ],
  output: ['Hi, undefined  (sloppy)   /   TypeError (strict)'],
  commonWrongAnswer: '"Hi, Alice"',
  explanation: [
    'setTimeout invokes its callback with a default `this` binding. For a regular function (non-arrow), default `this` is `undefined` in strict mode (which class methods always are), or the global object in sloppy mode.',
    'Result: `this.name` is either `undefined.name` → TypeError (strict / classes), OR `globalThis.name` which is usually undefined → "Hi, undefined".',
    'Fix: use an arrow function (`() => { ... }`) inside setTimeout. Arrows DON\'T bind their own this — they inherit from the enclosing scope (Greeter instance).',
  ],
  steps: [
    {
      visibleCodeLines: 10,
      showAnswer: false,
      note: 'Predict the output. (Hint: setTimeout calls its callback.)',
    },
    {
      visibleCodeLines: 10,
      showAnswer: true,
      note: 'Output: "Hi, undefined" (in sloppy mode) or TypeError (in strict mode, which classes use).',
    },
    {
      visibleCodeLines: 10,
      showAnswer: true,
      annotations: [
        { line: 3, text: '`this` here is the Greeter instance' },
        { line: 4, text: 'setTimeout calls this fn LATER, with default `this` binding' },
        { line: 5, text: 'this.name → undefined (default this is undefined in strict mode)' },
      ],
      note: 'The setTimeout callback is invoked by the timer queue, not by the Greeter instance. Default `this` binding rules apply: undefined in strict / class context.',
    },
    {
      visibleCodeLines: 10,
      showAnswer: true,
      annotations: [
        { line: 4, text: 'fix: arrow fn inherits `this` from hello\'s scope' },
      ],
      note: 'Fix: `setTimeout(() => { console.log("Hi, " + this.name) }, 0)`. Arrow functions don\'t bind their own `this`; they inherit from the enclosing scope (where `this` is the Greeter instance). Output becomes "Hi, Alice".',
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 5 — Array mutation surprise
// ---------------------------------------------------------------------------

const arrayMutation: TrickyOutputScenario = {
  id: 'array-mutation',
  name: 'sort + reverse mutate',
  difficulty: 'medium',
  blurb: 'Some array methods mutate the original. Others return a new copy. Mixing them up bites in production.',
  code: [
    `const original = [3, 1, 4, 1, 5]`,
    `const sorted = original.sort()`,
    `console.log(original)`,
    `console.log(sorted === original)`,
    ``,
    `const reversed = original.slice().reverse()`,
    `console.log(original)  // unchanged?`,
  ],
  output: ['[1, 1, 3, 4, 5]', 'true', '[1, 1, 3, 4, 5]'],
  commonWrongAnswer: 'original would still be [3, 1, 4, 1, 5]',
  explanation: [
    "Array#sort mutates the original AND returns it (same reference). So `sorted === original` is true and the original got reordered.",
    'Same for reverse, splice, push, pop, shift, unshift, fill, copyWithin.',
    'Array#slice, concat, map, filter, reduce, every, some, find — return new arrays.',
    '`original.slice().reverse()` is the safe pattern: slice() makes a copy, then mutate the copy.',
    'Modern alternative: `original.toSorted()` and `original.toReversed()` (ES2023) — non-mutating versions, finally.',
  ],
  steps: [
    {
      visibleCodeLines: 7,
      showAnswer: false,
      note: 'Predict each output.',
    },
    {
      visibleCodeLines: 7,
      showAnswer: true,
      note: 'Outputs: [1, 1, 3, 4, 5]  /  true  /  [1, 1, 3, 4, 5]. The original array got mutated by .sort().',
    },
    {
      visibleCodeLines: 7,
      showAnswer: true,
      annotations: [
        { line: 2, text: 'mutates AND returns the same reference' },
        { line: 4, text: '=== true — they are the SAME array' },
        { line: 6, text: 'slice() creates a copy, then reverse() mutates the copy — original safe' },
      ],
      note: 'Mutating methods: sort, reverse, splice, push, pop, shift, unshift, fill, copyWithin. Non-mutating: slice, concat, map, filter, reduce, every, some, find. Modern (ES2023): toSorted, toReversed, toSpliced, with — non-mutating versions.',
    },
  ],
}

// ---------------------------------------------------------------------------
// Scenario 6 — Promise + setTimeout ordering
// ---------------------------------------------------------------------------

const promiseOrdering: TrickyOutputScenario = {
  id: 'promise-ordering',
  name: 'Promise vs setTimeout',
  difficulty: 'medium',
  blurb: 'Microtasks drain before macrotasks. Three async sources lined up — what is the output order?',
  code: [
    `console.log('1')`,
    ``,
    `setTimeout(() => console.log('2'), 0)`,
    ``,
    `Promise.resolve().then(() => console.log('3'))`,
    `Promise.resolve().then(() => console.log('4'))`,
    ``,
    `console.log('5')`,
  ],
  output: ['1', '5', '3', '4', '2'],
  commonWrongAnswer: '1, 2, 3, 4, 5  (intuitive but wrong)',
  explanation: [
    'JS runs sync code first → "1", then "5".',
    'After sync code finishes, the microtask queue drains: both Promise .then callbacks fire → "3", "4".',
    "Only after the microtask queue is EMPTY does one macrotask run → the setTimeout fires → \"2\".",
    'Rule: synchronous → microtasks fully drained → ONE macrotask → repeat.',
  ],
  steps: [
    {
      visibleCodeLines: 8,
      showAnswer: false,
      note: 'Predict the output order.',
    },
    {
      visibleCodeLines: 8,
      showAnswer: true,
      note: 'Output order: 1, 5, 3, 4, 2.',
    },
    {
      visibleCodeLines: 8,
      showAnswer: true,
      annotations: [
        { line: 1, text: 'sync → prints "1" immediately' },
        { line: 3, text: 'schedules callback as MACROTASK (later)' },
        { line: 5, text: 'schedules callback as MICROTASK' },
        { line: 6, text: 'another microtask' },
        { line: 8, text: 'sync → prints "5"' },
      ],
      note: 'After all sync code: print "1", schedule a macrotask, schedule 2 microtasks, print "5". Sync is done.',
    },
    {
      visibleCodeLines: 8,
      showAnswer: true,
      annotations: [
        { line: 5, text: 'fires → "3"' },
        { line: 6, text: 'fires → "4"' },
      ],
      note: 'Microtask queue drains first. Both .then callbacks run → "3", "4".',
    },
    {
      visibleCodeLines: 8,
      showAnswer: true,
      annotations: [
        { line: 3, text: 'finally fires → "2"' },
      ],
      note: 'Microtask queue empty. Now run ONE macrotask → the setTimeout callback → "2". Final order: 1, 5, 3, 4, 2.',
    },
  ],
}

export const scenarios: TrickyOutputScenario[] = [
  coercion,
  typeofNull,
  hoistingTrap,
  thisDrift,
  arrayMutation,
  promiseOrdering,
]
