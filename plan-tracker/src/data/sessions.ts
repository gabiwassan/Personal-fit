import type { SessionDefinition, SessionKey } from '@/types';

export const SESSION_DEFINITIONS: Record<SessionKey, SessionDefinition> = {
  'asian-walk': {
    key: 'asian-walk',
    title: 'Asian Walk (3+3)',
    description: '3 min fast + 3 min slow intervals',
    howTo: '3 min fast + 3 min slow × 5 = 30 min. Fast = breathing hard but controlled.',
    defaultMinutes: 30,
    category: 'Cardio',
    intensity: 'Medium',
    icon: '🚶‍♂️',
  },
  'walk-or-jog': {
    key: 'walk-or-jog',
    title: 'Walk or Easy Jog',
    description: 'Easy pace walking with optional light jogging',
    howTo: '30 min total. Walk + very easy jog only if feeling good; never gasping.',
    defaultMinutes: 30,
    category: 'Cardio',
    intensity: 'Easy',
    icon: '🏃',
  },
  'long-walk': {
    key: 'long-walk',
    title: 'Long Continuous Walk',
    description: 'Steady continuous walking',
    howTo: 'NOT interval 3+3. Continuous comfortable-active pace 40–60 min.',
    defaultMinutes: 50,
    category: 'Cardio/Base',
    intensity: 'Easy-Medium',
    icon: '🚶',
  },
  'strength-a': {
    key: 'strength-a',
    title: 'Strength A (Push + Core)',
    description: 'Upper body push and core work',
    howTo: '25 min. 2–3 rounds: Push-ups 10–15 (knees allowed), Squats 15–20, Front plank 30–45s, Side plank 20s each side. Rest 45–60s between rounds.',
    defaultMinutes: 25,
    category: 'Strength',
    intensity: 'Medium',
    icon: '💪',
  },
  'strength-b': {
    key: 'strength-b',
    title: 'Strength B (Pull + Shoulders)',
    description: 'Upper body pull and shoulder work',
    howTo: '25 min. 2–3 rounds: Row with towel/backpack 12–15, Lateral raises with bottles/band 12–15, Biceps curl with towel/backpack 12, Dead bug OR hollow hold 20–30s.',
    defaultMinutes: 25,
    category: 'Strength',
    intensity: 'Medium',
    icon: '🏋️',
  },
  'rest': {
    key: 'rest',
    title: 'Rest / Family',
    description: 'Recovery day',
    howTo: 'Rest day. Optional light movement only (walk/mobility/easy core 10–15 min).',
    defaultMinutes: 0,
    category: 'Recovery',
    intensity: '—',
    icon: '🧘',
  },
};

// Weekly template (Mon=0, Tue=1, ..., Sun=6)
export const WEEKLY_TEMPLATE: Record<number, SessionKey> = {
  0: 'asian-walk', // Monday
  1: 'strength-a', // Tuesday
  2: 'rest', // Wednesday
  3: 'walk-or-jog', // Thursday
  4: 'strength-b', // Friday
  5: 'long-walk', // Saturday
  6: 'rest', // Sunday
};

export const TRAINING_RULES = [
  {
    title: 'Rest Days',
    rule: 'If you train, it must be LIGHT (walk/mobility/core). No HIIT, no hard jog, no "military" calisthenics.',
  },
  {
    title: 'Strength Sessions',
    rule: 'Never train to failure; focus on consistency.',
  },
  {
    title: 'Long Walk',
    rule: 'Continuous pace (NOT 3+3 intervals).',
  },
];
