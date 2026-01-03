import type { SessionDefinition, SessionKey } from '@/types';
import { es } from '@/lib/i18n';

export const SESSION_DEFINITIONS: Record<SessionKey, SessionDefinition> = {
  'asian-walk': {
    key: 'asian-walk',
    title: es.sessions['asian-walk'].title,
    description: es.sessions['asian-walk'].description,
    howTo: es.sessions['asian-walk'].howTo,
    defaultMinutes: 30,
    category: 'Cardio',
    intensity: 'Medium',
    icon: '🚶‍♂️',
  },
  'walk-or-jog': {
    key: 'walk-or-jog',
    title: es.sessions['walk-or-jog'].title,
    description: es.sessions['walk-or-jog'].description,
    howTo: es.sessions['walk-or-jog'].howTo,
    defaultMinutes: 30,
    category: 'Cardio',
    intensity: 'Easy',
    icon: '🏃',
  },
  'long-walk': {
    key: 'long-walk',
    title: es.sessions['long-walk'].title,
    description: es.sessions['long-walk'].description,
    howTo: es.sessions['long-walk'].howTo,
    defaultMinutes: 50,
    category: 'Cardio/Base',
    intensity: 'Easy-Medium',
    icon: '🚶',
  },
  'strength-a': {
    key: 'strength-a',
    title: es.sessions['strength-a'].title,
    description: es.sessions['strength-a'].description,
    howTo: es.sessions['strength-a'].howTo,
    defaultMinutes: 25,
    category: 'Strength',
    intensity: 'Medium',
    icon: '💪',
  },
  'strength-b': {
    key: 'strength-b',
    title: es.sessions['strength-b'].title,
    description: es.sessions['strength-b'].description,
    howTo: es.sessions['strength-b'].howTo,
    defaultMinutes: 25,
    category: 'Strength',
    intensity: 'Medium',
    icon: '🏋️',
  },
  'rest': {
    key: 'rest',
    title: es.sessions.rest.title,
    description: es.sessions.rest.description,
    howTo: es.sessions.rest.howTo,
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
    title: es.trainingRules.restDays.title,
    rule: es.trainingRules.restDays.rule,
  },
  {
    title: es.trainingRules.strengthSessions.title,
    rule: es.trainingRules.strengthSessions.rule,
  },
  {
    title: es.trainingRules.longWalk.title,
    rule: es.trainingRules.longWalk.rule,
  },
];
