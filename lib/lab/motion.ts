// Shared Framer Motion presets for /lab visualizers.
//
// Goal: a "cartoonish" feel — bouncy springs, overshoot on entrance,
// gentle pulse on active states, hover wiggles. Used to make the
// learning animations feel playful and easy to track without going
// full mascot/character territory (which would clash with the
// portfolio's editorial design).

import type { Transition, Variants } from 'framer-motion'

// -----------------------------------------------------------------------------
// Transitions
// -----------------------------------------------------------------------------

/** Bouncy spring — what most cell / badge / item entrances should use. */
export const springBouncy: Transition = {
  type: 'spring',
  stiffness: 360,
  damping: 14,
  mass: 0.8,
}

/** Softer spring for layout transitions (less overshoot, cleaner). */
export const springSoft: Transition = {
  type: 'spring',
  stiffness: 280,
  damping: 26,
  mass: 0.6,
}

/** Snappier spring for marker / playhead slides. */
export const springSnap: Transition = {
  type: 'spring',
  stiffness: 480,
  damping: 30,
}

// -----------------------------------------------------------------------------
// Variants (composable enter/exit/hover sets)
// -----------------------------------------------------------------------------

/** Item pops in with a slight overshoot, exits by shrinking. */
export const popIn: Variants = {
  initial: { opacity: 0, scale: 0.5, y: 6 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springBouncy,
  },
  exit: { opacity: 0, scale: 0.6, transition: { duration: 0.18 } },
}

/** Stack-style pop-up (used by the call stack lane). */
export const stackPop: Variants = {
  initial: { opacity: 0, scale: 0.6, y: -10, rotate: -2 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotate: 0,
    transition: springBouncy,
  },
  exit: {
    opacity: 0,
    scale: 0.6,
    y: -8,
    rotate: 4,
    transition: { duration: 0.2 },
  },
}

/** Queue-style slide in from the side. */
export const slideIn: Variants = {
  initial: { opacity: 0, x: -16, scale: 0.85 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: springBouncy,
  },
  exit: { opacity: 0, x: 16, scale: 0.85, transition: { duration: 0.18 } },
}

/** Sliding pop with a tiny wiggle at the end. Good for status badges. */
export const wiggleBadge: Variants = {
  initial: { opacity: 0, scale: 0.7, rotate: -8 },
  animate: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { ...springBouncy, stiffness: 420 },
  },
}

/** Gentle pulse on a continuously-active element (no exit). */
export const pulse: Variants = {
  animate: {
    scale: [1, 1.06, 1],
    transition: {
      duration: 1.6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

/** Soft float used for the "▶ running" indicator on the active code line. */
export const floatNudge: Variants = {
  animate: {
    x: [0, 3, 0],
    transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' },
  },
}

// -----------------------------------------------------------------------------
// Hover helpers
// -----------------------------------------------------------------------------

/** Apply via `whileHover` on a motion element for a subtle nudge. */
export const hoverNudge = { scale: 1.05, y: -2 }

/** A slightly rotational hover for tappable pills. */
export const hoverWiggle = { scale: 1.06, rotate: -1.5 }

/** Tap shrink — gives a "click" feel. */
export const tapShrink = { scale: 0.94 }
