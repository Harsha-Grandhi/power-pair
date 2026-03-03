import { Archetype } from '@/types';

// ─── 8 Canonical Archetypes — v1 Locked Definitions ───────────────────────────
// Prototype vector order: [PersonalEmotionalAwareness, EmotionalRegulation,
//   Empathy&Validation, LoveStyleIntensity, FutureAlignmentMindset, ConsistencyOfEffort]

export const ARCHETYPES: Archetype[] = [
  {
    id: 'emotional-sage',
    name: 'Emotional Sage',
    emoji: '🌿',
    prototype: [85, 85, 80, 65, 70, 75],
    description:
      'Emotionally mature and grounded. You understand your feelings deeply and communicate with clarity and calm — a rare quality that builds lasting trust.',
    strengths: [
      'Deep emotional self-awareness',
      'Stable under stress',
      'Healthy communication',
    ],
    growthEdge: [
      'May over-intellectualize emotions',
      'Can seem emotionally distant at times',
    ],
    color: '#4CAF9A',
    gradientFrom: '#3D9B84',
    gradientTo: '#5DC4AA',
  },
  {
    id: 'passionate-heart',
    name: 'Passionate Heart',
    emoji: '🔥',
    prototype: [80, 45, 85, 90, 60, 55],
    description:
      'You feel deeply and love intensely. Expressive, affectionate, and emotionally rich — your love is a force that fills every room.',
    strengths: ['High emotional depth', 'Strong empathy', 'Expressive love'],
    growthEdge: [
      'Emotional intensity during conflict',
      'Needs stronger emotional grounding',
    ],
    color: '#E05C5C',
    gradientFrom: '#C94848',
    gradientTo: '#F07070',
  },
  {
    id: 'steady-anchor',
    name: 'Steady Anchor',
    emoji: '⚓',
    prototype: [55, 85, 55, 50, 70, 80],
    description:
      'Calm, reliable, and stable. You build long-term security through consistency — the person your partner can always count on.',
    strengths: ['Strong emotional control', 'Dependable', 'Long-term oriented'],
    growthEdge: [
      'May struggle expressing vulnerability',
      'Can seem less emotionally expressive',
    ],
    color: '#7B8FA6',
    gradientFrom: '#647892',
    gradientTo: '#8FA3BA',
  },
  {
    id: 'safe-haven',
    name: 'Safe Haven',
    emoji: '🫶',
    prototype: [75, 70, 90, 80, 65, 70],
    description:
      'You create emotional safety like no one else. Your partner feels deeply understood, accepted, and secure in your presence.',
    strengths: ['High empathy', 'Emotionally validating', 'Warm presence'],
    growthEdge: ['May neglect own needs', 'Can become emotional caretaker'],
    color: '#F6B17A',
    gradientFrom: '#E09A62',
    gradientTo: '#F8C496',
  },
  {
    id: 'future-builder',
    name: 'Future Builder',
    emoji: '🚀',
    prototype: [65, 75, 60, 55, 90, 90],
    description:
      'You think long-term and build intentionally. For you, relationships are something to grow, invest in, and consciously design together.',
    strengths: ['Vision-driven', 'Committed', 'Structured and goal-oriented'],
    growthEdge: [
      'May prioritize progress over emotional nuance',
      'Can appear overly pragmatic',
    ],
    color: '#5B8FD4',
    gradientFrom: '#4A7BBF',
    gradientTo: '#70A3E8',
  },
  {
    id: 'free-spirit',
    name: 'Free Spirit',
    emoji: '🌊',
    prototype: [70, 45, 60, 75, 40, 40],
    description:
      'Authentic, independent, emotionally real. You value freedom and honesty, bringing a spontaneous energy that keeps the relationship alive.',
    strengths: ['Self-aware', 'Emotionally expressive', 'Energetic and spontaneous'],
    growthEdge: ['Needs more consistency', 'May avoid long-term structure'],
    color: '#9B72CF',
    gradientFrom: '#8560BB',
    gradientTo: '#AF86E0',
  },
  {
    id: 'devoted-partner',
    name: 'Devoted Partner',
    emoji: '🤍',
    prototype: [65, 70, 80, 55, 75, 85],
    description:
      'You show love through loyalty and consistent effort. Deeply dependable, your actions speak louder than any words ever could.',
    strengths: ['Reliable', 'Supportive', 'Long-term stable'],
    growthEdge: [
      'May suppress personal frustration',
      'Can tie identity to relationship stability',
    ],
    color: '#8DB5C8',
    gradientFrom: '#76A0B5',
    gradientTo: '#A4CCDC',
  },
  {
    id: 'balanced-romantic',
    name: 'Balanced Romantic',
    emoji: '⚖️',
    prototype: [70, 70, 70, 70, 70, 70],
    description:
      'Well-rounded across all pillars. You bring emotional stability, empathy, and forward-thinking to create a relationship of rare depth and balance.',
    strengths: ['Stable foundation', 'Balanced emotional depth', 'Healthy growth mindset'],
    growthEdge: [
      'May lack standout defining intensity',
      'Can feel steady rather than passionate',
    ],
    color: '#7077A1',
    gradientFrom: '#5D648E',
    gradientTo: '#848AB6',
  },
];

export function getArchetypeById(id: string): Archetype | undefined {
  return ARCHETYPES.find((a) => a.id === id);
}
