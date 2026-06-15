// Binary Search Tree visualizer — data model.
//
// A BST node has a value, an optional left child (smaller values),
// and an optional right child (larger values). The renderer walks the
// tree once to compute each node's (x, y) position so the canvas stays
// consistent across steps (visited highlights animate on top of the
// pre-laid-out tree).

export type BSTNodeState =
  | 'normal'
  | 'visiting' // pointer is currently here
  | 'comparing' // we are comparing target to this node's value
  | 'found' // target matched
  | 'new' // just inserted
  | 'in-path' // along the path we walked
  | 'removing'
  | 'successor' // marked as the in-order successor during delete

export interface BSTNode {
  id: string
  value: number
  // Children — must reference IDs that exist in the same scenario's node set.
  leftId: string | null
  rightId: string | null
  state: BSTNodeState
}

export interface BSTStep {
  // The root of the tree at this step. nodes maps id → node.
  rootId: string | null
  nodes: Record<string, BSTNode>
  // Optional output list (for traversals)
  output?: number[]
  // Variables to display on the side
  vars: Array<{ label: string; value: string }>
  note: string
  codeLine?: number
}

export interface BSTScenario {
  id: string
  name: string
  blurb: string
  complexity: { time: string; space: string }
  code: { js: string[]; go: string[] }
  steps: BSTStep[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Compute every node's (x, y) position in [0, 1] for the renderer.
 * We do this in the view (tree-view.tsx) — here we just store the tree shape.
 * But we expose this helper for tests / future use.
 */
export function layoutTree(
  rootId: string | null,
  nodes: Record<string, BSTNode>,
): Record<string, { x: number; y: number }> {
  const out: Record<string, { x: number; y: number }> = {}
  if (!rootId) return out

  const walk = (id: string, depth: number, left: number, right: number) => {
    const node = nodes[id]
    if (!node) return
    const mid = (left + right) / 2
    out[id] = { x: mid, y: depth }
    if (node.leftId) walk(node.leftId, depth + 1, left, mid)
    if (node.rightId) walk(node.rightId, depth + 1, mid, right)
  }
  walk(rootId, 0, 0, 1)
  return out
}

// Convenience constructor
const node = (
  id: string,
  value: number,
  leftId: string | null = null,
  rightId: string | null = null,
  state: BSTNodeState = 'normal',
): BSTNode => ({ id, value, leftId, rightId, state })

// ---------------------------------------------------------------------------
// Scenario 1 — Insert (build a tree from a sequence)
// ---------------------------------------------------------------------------

const insert: BSTScenario = {
  id: 'insert',
  name: 'Insert (build)',
  blurb:
    'Insert a sequence of values into an empty BST. At each step, walk down comparing — go left if smaller, right if bigger. Insert at the first empty slot. Average depth O(log n); worst-case (sorted input) O(n).',
  complexity: { time: 'O(log n) avg, O(n) worst', space: 'O(log n) recursion' },
  code: {
    js: [
      `class TreeNode {`,
      `  left: TreeNode | null = null`,
      `  right: TreeNode | null = null`,
      `  constructor(public value: number) {}`,
      `}`,
      ``,
      `function insert(root: TreeNode | null, value: number): TreeNode {`,
      `  if (!root) return new TreeNode(value)`,
      `  if (value < root.value) {`,
      `    root.left = insert(root.left, value)`,
      `  } else if (value > root.value) {`,
      `    root.right = insert(root.right, value)`,
      `  }`,
      `  return root`,
      `}`,
    ],
    go: [
      `type TreeNode struct {`,
      `  Value       int`,
      `  Left, Right *TreeNode`,
      `}`,
      ``,
      `func Insert(root *TreeNode, value int) *TreeNode {`,
      `  if root == nil {`,
      `    return &TreeNode{Value: value}`,
      `  }`,
      `  if value < root.Value {`,
      `    root.Left = Insert(root.Left, value)`,
      `  } else if value > root.Value {`,
      `    root.Right = Insert(root.Right, value)`,
      `  }`,
      `  return root`,
      `}`,
    ],
  },
  steps: (() => {
    const out: BSTStep[] = []

    // Sequence: 5, 3, 7, 1, 4, 8
    // Final tree:
    //          5
    //        /   \
    //       3     7
    //      / \     \
    //     1   4     8

    // Step 1: empty
    out.push({
      rootId: null,
      nodes: {},
      vars: [{ label: 'sequence', value: '[5, 3, 7, 1, 4, 8]' }],
      note: 'Start with an empty tree. Insert sequence: 5, 3, 7, 1, 4, 8.',
      codeLine: 7,
    })

    // Step 2: insert 5
    out.push({
      rootId: '5',
      nodes: { '5': node('5', 5, null, null, 'new') },
      vars: [
        { label: 'inserting', value: '5' },
        { label: 'tree size', value: '1' },
      ],
      note: 'Insert 5. Tree was empty → 5 becomes the root.',
      codeLine: 8,
    })

    // Step 3: insert 3 — 3 < 5, go left
    out.push({
      rootId: '5',
      nodes: {
        '5': node('5', 5, '3', null, 'comparing'),
        '3': node('3', 3, null, null, 'new'),
      },
      vars: [
        { label: 'inserting', value: '3' },
        { label: 'compare', value: '3 < 5 → go left' },
      ],
      note: 'Insert 3. At root (5): 3 < 5, recurse into left. Left is null → place 3 there.',
      codeLine: 10,
    })

    // Step 4: insert 7 — 7 > 5, go right
    out.push({
      rootId: '5',
      nodes: {
        '5': node('5', 5, '3', '7', 'comparing'),
        '3': node('3', 3, null, null),
        '7': node('7', 7, null, null, 'new'),
      },
      vars: [
        { label: 'inserting', value: '7' },
        { label: 'compare', value: '7 > 5 → go right' },
      ],
      note: 'Insert 7. At root (5): 7 > 5, recurse into right. Right is null → place 7 there.',
      codeLine: 12,
    })

    // Step 5a: insert 1 — 1 < 5, then 1 < 3
    out.push({
      rootId: '5',
      nodes: {
        '5': node('5', 5, '3', '7', 'comparing'),
        '3': node('3', 3, null, null),
        '7': node('7', 7, null, null),
      },
      vars: [
        { label: 'inserting', value: '1' },
        { label: 'compare', value: '1 < 5 → go left' },
      ],
      note: 'Insert 1. At root (5): 1 < 5, recurse into left subtree.',
      codeLine: 10,
    })
    out.push({
      rootId: '5',
      nodes: {
        '5': node('5', 5, '3', '7', 'in-path'),
        '3': node('3', 3, '1', null, 'comparing'),
        '7': node('7', 7, null, null),
        '1': node('1', 1, null, null, 'new'),
      },
      vars: [
        { label: 'inserting', value: '1' },
        { label: 'compare', value: '1 < 3 → go left' },
      ],
      note: 'At 3: 1 < 3, recurse left. Left is null → place 1 there.',
      codeLine: 10,
    })

    // Step 6: insert 4 — 4 < 5 → 4 > 3
    out.push({
      rootId: '5',
      nodes: {
        '5': node('5', 5, '3', '7', 'in-path'),
        '3': node('3', 3, '1', '4', 'comparing'),
        '7': node('7', 7, null, null),
        '1': node('1', 1, null, null),
        '4': node('4', 4, null, null, 'new'),
      },
      vars: [
        { label: 'inserting', value: '4' },
        { label: 'path', value: '5 → 3 → null (right)' },
      ],
      note: 'Insert 4. Walk: 4 < 5 → left to 3. 4 > 3 → right of 3. Right is null → place 4.',
      codeLine: 12,
    })

    // Step 7: insert 8 — 8 > 5, 8 > 7
    out.push({
      rootId: '5',
      nodes: {
        '5': node('5', 5, '3', '7', 'in-path'),
        '3': node('3', 3, '1', '4', 'normal'),
        '7': node('7', 7, null, '8', 'comparing'),
        '1': node('1', 1, null, null),
        '4': node('4', 4, null, null),
        '8': node('8', 8, null, null, 'new'),
      },
      vars: [
        { label: 'inserting', value: '8' },
        { label: 'path', value: '5 → 7 → null (right)' },
      ],
      note: 'Insert 8. Walk: 8 > 5 → right to 7. 8 > 7 → right of 7. Right is null → place 8.',
      codeLine: 12,
    })

    // Step 8: final
    out.push({
      rootId: '5',
      nodes: {
        '5': node('5', 5, '3', '7'),
        '3': node('3', 3, '1', '4'),
        '7': node('7', 7, null, '8'),
        '1': node('1', 1, null, null),
        '4': node('4', 4, null, null),
        '8': node('8', 8, null, null),
      },
      vars: [
        { label: 'tree size', value: '6' },
        { label: 'height', value: '2' },
      ],
      note: 'Done. Tree built. Every left subtree holds smaller values; every right subtree holds larger.',
      codeLine: 14,
    })

    return out
  })(),
}

// ---------------------------------------------------------------------------
// Scenario 2 — Search (find a value)
// ---------------------------------------------------------------------------

const baseTree = (): Record<string, BSTNode> => ({
  '5': node('5', 5, '3', '7'),
  '3': node('3', 3, '1', '4'),
  '7': node('7', 7, '6', '8'),
  '1': node('1', 1, null, null),
  '4': node('4', 4, null, null),
  '6': node('6', 6, null, null),
  '8': node('8', 8, null, null),
})

const search: BSTScenario = {
  id: 'search',
  name: 'Search',
  blurb:
    "Find whether a value exists in the BST. Walk down: if target equals current, found. If smaller, go left. If bigger, go right. If we hit null, not found.",
  complexity: { time: 'O(log n) avg, O(n) worst', space: 'O(1) iterative' },
  code: {
    js: [
      `function search(root: TreeNode | null, target: number): boolean {`,
      `  let curr = root`,
      `  while (curr !== null) {`,
      `    if (target === curr.value) return true`,
      `    curr = target < curr.value ? curr.left : curr.right`,
      `  }`,
      `  return false`,
      `}`,
    ],
    go: [
      `func Search(root *TreeNode, target int) bool {`,
      `  curr := root`,
      `  for curr != nil {`,
      `    if target == curr.Value { return true }`,
      `    if target < curr.Value {`,
      `      curr = curr.Left`,
      `    } else {`,
      `      curr = curr.Right`,
      `    }`,
      `  }`,
      `  return false`,
      `}`,
    ],
  },
  steps: (() => {
    const out: BSTStep[] = []
    const target = 4
    const mk = (
      stateOverrides: Record<string, BSTNodeState>,
      note: string,
      vars: Array<{ label: string; value: string }>,
      codeLine?: number,
    ): BSTStep => {
      const nodes = baseTree()
      for (const id of Object.keys(stateOverrides)) {
        nodes[id] = { ...nodes[id], state: stateOverrides[id] }
      }
      return { rootId: '5', nodes, vars, note, codeLine }
    }

    out.push(
      mk({}, `Goal: search for ${target}. Start at the root.`, [
        { label: 'target', value: String(target) },
      ], 1),
    )
    out.push(
      mk(
        { '5': 'comparing' },
        `At 5: 4 < 5 → go left.`,
        [
          { label: 'target', value: String(target) },
          { label: 'curr', value: '5' },
          { label: 'compare', value: '4 < 5 → left' },
        ],
        5,
      ),
    )
    out.push(
      mk(
        { '5': 'in-path', '3': 'comparing' },
        `At 3: 4 > 3 → go right.`,
        [
          { label: 'target', value: String(target) },
          { label: 'curr', value: '3' },
          { label: 'compare', value: '4 > 3 → right' },
        ],
        5,
      ),
    )
    out.push(
      mk(
        { '5': 'in-path', '3': 'in-path', '4': 'comparing' },
        `At 4: 4 === 4 → found!`,
        [
          { label: 'target', value: String(target) },
          { label: 'curr', value: '4' },
          { label: 'compare', value: '4 === 4 ✓' },
        ],
        4,
      ),
    )
    out.push(
      mk(
        { '5': 'in-path', '3': 'in-path', '4': 'found' },
        `Return true. Took 3 comparisons in a 7-node tree — that is the O(log n) win.`,
        [
          { label: 'target', value: String(target) },
          { label: 'result', value: 'true' },
          { label: 'comparisons', value: '3' },
        ],
        4,
      ),
    )

    return out
  })(),
}

// ---------------------------------------------------------------------------
// Scenario 3 — In-order Traversal (produces sorted output)
// ---------------------------------------------------------------------------

const inorder: BSTScenario = {
  id: 'inorder',
  name: 'In-order traversal',
  blurb:
    "In-order traversal visits Left, then Node, then Right. For a BST, this produces values in SORTED order — a free O(n) sort. It's also the basis for the 'validate BST' interview question.",
  complexity: { time: 'O(n)', space: 'O(h) recursion' },
  code: {
    js: [
      `function inorder(root: TreeNode | null, out: number[] = []): number[] {`,
      `  if (!root) return out`,
      `  inorder(root.left, out)        // 1. left`,
      `  out.push(root.value)           // 2. node`,
      `  inorder(root.right, out)       // 3. right`,
      `  return out`,
      `}`,
    ],
    go: [
      `func Inorder(root *TreeNode) []int {`,
      `  var out []int`,
      `  var walk func(*TreeNode)`,
      `  walk = func(n *TreeNode) {`,
      `    if n == nil { return }`,
      `    walk(n.Left)`,
      `    out = append(out, n.Value)`,
      `    walk(n.Right)`,
      `  }`,
      `  walk(root)`,
      `  return out`,
      `}`,
    ],
  },
  steps: (() => {
    const out: BSTStep[] = []
    const collected: number[] = []
    const mk = (
      stateOverrides: Record<string, BSTNodeState>,
      output: number[],
      note: string,
      codeLine?: number,
    ): BSTStep => {
      const nodes = baseTree()
      for (const id of Object.keys(stateOverrides)) {
        nodes[id] = { ...nodes[id], state: stateOverrides[id] }
      }
      return {
        rootId: '5',
        nodes,
        output: [...output],
        vars: [{ label: 'output', value: output.length ? `[${output.join(', ')}]` : '[]' }],
        note,
        codeLine,
      }
    }

    out.push(mk({}, [...collected], 'In-order: visit Left, then Node, then Right. Start at root (5).', 1))

    // Walk left from 5 → 3 → 1
    out.push(mk({ '5': 'visiting' }, [...collected], 'At 5. First recurse into LEFT (3).', 3))
    out.push(mk({ '5': 'in-path', '3': 'visiting' }, [...collected], 'At 3. First recurse into LEFT (1).', 3))
    out.push(mk({ '5': 'in-path', '3': 'in-path', '1': 'visiting' }, [...collected], 'At 1. Left is null → return. Now print node (1).', 4))
    collected.push(1)
    out.push(mk({ '5': 'in-path', '3': 'in-path', '1': 'found' }, [...collected], 'Output: [1]. Now recurse right of 1 → null → return.', 4))

    // Back to 3 — print 3
    out.push(mk({ '5': 'in-path', '3': 'visiting' }, [...collected], 'Back at 3. Left done. Print node (3).', 4))
    collected.push(3)
    out.push(mk({ '5': 'in-path', '3': 'found' }, [...collected], 'Output: [1, 3]. Now recurse right of 3 (4).', 5))

    // 4
    out.push(mk({ '5': 'in-path', '3': 'in-path', '4': 'visiting' }, [...collected], 'At 4. Left null → print 4.', 4))
    collected.push(4)
    out.push(mk({ '5': 'in-path', '3': 'in-path', '4': 'found' }, [...collected], 'Output: [1, 3, 4]. Right null → return.', 4))

    // Back to 5 — print 5
    out.push(mk({ '5': 'visiting' }, [...collected], 'Back at 5. Left subtree done. Print node (5).', 4))
    collected.push(5)
    out.push(mk({ '5': 'found' }, [...collected], 'Output: [1, 3, 4, 5]. Now recurse right (7).', 5))

    // Walk into right subtree: 7 → 6 then 7 then 8
    out.push(mk({ '5': 'in-path', '7': 'visiting' }, [...collected], 'At 7. First recurse LEFT (6).', 3))
    out.push(mk({ '5': 'in-path', '7': 'in-path', '6': 'visiting' }, [...collected], 'At 6. Left null → print 6.', 4))
    collected.push(6)
    out.push(mk({ '5': 'in-path', '7': 'in-path', '6': 'found' }, [...collected], 'Output: [1, 3, 4, 5, 6]. Right null → return.', 4))

    out.push(mk({ '5': 'in-path', '7': 'visiting' }, [...collected], 'Back at 7. Print node (7).', 4))
    collected.push(7)
    out.push(mk({ '5': 'in-path', '7': 'found' }, [...collected], 'Output: [1, 3, 4, 5, 6, 7]. Right (8).', 5))

    out.push(mk({ '5': 'in-path', '7': 'in-path', '8': 'visiting' }, [...collected], 'At 8. Left null → print 8.', 4))
    collected.push(8)
    out.push(mk({ '5': 'in-path', '7': 'in-path', '8': 'found' }, [...collected], 'Output: [1, 3, 4, 5, 6, 7, 8]. Tree fully traversed.', 4))

    out.push(mk({}, [...collected], 'Done. In-order traversal of a BST = sorted array. Free O(n) sort if your data is already in a balanced BST.', 6))

    return out
  })(),
}

// ---------------------------------------------------------------------------
// Scenario 4 — Delete (the tricky case: two children)
// ---------------------------------------------------------------------------

const del: BSTScenario = {
  id: 'delete',
  name: 'Delete (two-child case)',
  blurb:
    'Deleting from a BST has three cases: leaf (just remove), one child (replace with child), two children (the tricky one — replace with in-order successor). Watch the two-children case where we delete the root.',
  complexity: { time: 'O(log n) avg', space: 'O(log n) recursion' },
  code: {
    js: [
      `function deleteNode(root: TreeNode | null, key: number): TreeNode | null {`,
      `  if (!root) return null`,
      `  if (key < root.value) {`,
      `    root.left = deleteNode(root.left, key)`,
      `  } else if (key > root.value) {`,
      `    root.right = deleteNode(root.right, key)`,
      `  } else {`,
      `    // Found the node to delete`,
      `    if (!root.left) return root.right`,
      `    if (!root.right) return root.left`,
      `    // Two children: find in-order successor (leftmost of right subtree)`,
      `    let succ = root.right`,
      `    while (succ.left) succ = succ.left`,
      `    root.value = succ.value`,
      `    root.right = deleteNode(root.right, succ.value)`,
      `  }`,
      `  return root`,
      `}`,
    ],
    go: [
      `func Delete(root *TreeNode, key int) *TreeNode {`,
      `  if root == nil { return nil }`,
      `  switch {`,
      `  case key < root.Value:`,
      `    root.Left = Delete(root.Left, key)`,
      `  case key > root.Value:`,
      `    root.Right = Delete(root.Right, key)`,
      `  default:`,
      `    if root.Left == nil  { return root.Right }`,
      `    if root.Right == nil { return root.Left }`,
      `    succ := root.Right`,
      `    for succ.Left != nil { succ = succ.Left }`,
      `    root.Value = succ.Value`,
      `    root.Right = Delete(root.Right, succ.Value)`,
      `  }`,
      `  return root`,
      `}`,
    ],
  },
  steps: (() => {
    const out: BSTStep[] = []

    const mk = (
      nodes: Record<string, BSTNode>,
      vars: Array<{ label: string; value: string }>,
      note: string,
      codeLine?: number,
      rootId: string | null = '5',
    ): BSTStep => ({ rootId, nodes, vars, note, codeLine })

    // Initial tree (same as baseTree): root 5, target: delete 5 (the root!)
    out.push(
      mk(
        baseTree(),
        [{ label: 'target', value: 'delete 5 (root)' }],
        'Delete 5 (the root). 5 has TWO children — we need to find its in-order successor.',
        7,
      ),
    )

    // Found 5
    out.push(
      mk(
        { ...baseTree(), '5': { ...baseTree()['5'], state: 'comparing' } },
        [
          { label: 'target', value: '5' },
          { label: 'case', value: 'two children' },
        ],
        'Found 5. Both subtrees exist → cannot just unlink. Find the smallest value in the RIGHT subtree.',
        12,
      ),
    )

    // Walk right then leftmost: 7 → 6
    out.push(
      mk(
        {
          ...baseTree(),
          '5': { ...baseTree()['5'], state: 'in-path' },
          '7': { ...baseTree()['7'], state: 'visiting' },
        },
        [
          { label: 'succ search', value: 'walk right then leftmost' },
          { label: 'curr', value: '7' },
        ],
        'Successor = leftmost node of right subtree. Right of 5 is 7.',
        13,
      ),
    )
    out.push(
      mk(
        {
          ...baseTree(),
          '5': { ...baseTree()['5'], state: 'in-path' },
          '7': { ...baseTree()['7'], state: 'in-path' },
          '6': { ...baseTree()['6'], state: 'successor' },
        },
        [
          { label: 'succ', value: '6' },
          { label: 'reason', value: 'leftmost of right subtree' },
        ],
        'Walk left from 7 → 6. Left of 6 is null. So 6 is the in-order successor.',
        14,
      ),
    )

    // Copy succ value into root, then delete succ from right subtree
    out.push(
      mk(
        {
          ...baseTree(),
          '5': { ...baseTree()['5'], value: 6, state: 'new' },
          '6': { ...baseTree()['6'], state: 'removing' },
        },
        [
          { label: 'root.value', value: '5 → 6' },
          { label: 'next', value: 'delete original 6 from right subtree' },
        ],
        'Copy the successor value (6) into the root node. Now we have two 6s — delete the original.',
        15,
      ),
    )

    // Final: 6 deleted from right subtree (it was a leaf — easy case)
    const final = baseTree()
    final['5'] = { ...final['5'], value: 6 } // root is now 6
    final['7'] = { ...final['7'], leftId: null } // 7 no longer has a left child
    delete final['6']
    out.push(
      mk(
        final,
        [
          { label: 'result', value: 'root deleted, tree still valid BST' },
          { label: 'tree size', value: '6' },
        ],
        'Original 6 was a leaf — easy delete. Tree is still a valid BST: every left subtree < node < every right subtree.',
        16,
      ),
    )

    return out
  })(),
}

export const scenarios: BSTScenario[] = [insert, search, inorder, del]
