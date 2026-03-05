export interface EmotionalLayer {
  text: string;
  depth: 'light' | 'deep';
}

export const EMOTIONAL_LAYERS: EmotionalLayer[] = [
  { text: "while asking each other deep relationship questions", depth: "deep" },
  { text: "while telling childhood stories", depth: "deep" },
  { text: "while discussing your future dreams together", depth: "deep" },
  { text: "while reflecting on your relationship journey", depth: "deep" },
  { text: "while discussing what you admire most about each other", depth: "deep" },
  { text: "while having a future planning conversation", depth: "deep" },
  { text: "while discussing your dream travel destinations", depth: "deep" },
  { text: "while sharing memory lane stories", depth: "deep" },
  { text: "while discussing your relationship strengths", depth: "deep" },
  { text: "while brainstorming life goals together", depth: "deep" },
  { text: "while sharing your deepest fears and hopes", depth: "deep" },
  { text: "while discussing how you've grown together", depth: "deep" },
  { text: "while talking about your most meaningful moments", depth: "deep" },
  { text: "while exploring each other's love languages", depth: "deep" },
  { text: "while discussing what home means to both of you", depth: "deep" },
  { text: "while sharing words of appreciation", depth: "light" },
  { text: "while doing a compliment challenge", depth: "light" },
  { text: "while exchanging love letters", depth: "light" },
  { text: "while expressing gratitude for each other", depth: "light" },
  { text: "while playing a couple's question game", depth: "light" },
  { text: "while sharing your favorite memories together", depth: "light" },
  { text: "while taking turns saying what makes you smile", depth: "light" },
  { text: "while sharing three things you love about today", depth: "light" },
  { text: "while guessing each other's favorites", depth: "light" },
  { text: "while making promises for the week ahead", depth: "light" },
  { text: "while sharing funny relationship moments", depth: "light" },
  { text: "while creating a shared playlist together", depth: "light" },
  { text: "while writing down wishes for each other", depth: "light" },
  { text: "while sharing what you're most grateful for", depth: "light" },
  { text: "while celebrating small wins together", depth: "light" },
];
