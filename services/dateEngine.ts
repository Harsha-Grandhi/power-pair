import { ACTIVITY_LIBRARY, Activity } from '@/data/activityLibrary';
import { EMOTIONAL_LAYERS, EmotionalLayer } from '@/data/emotionalLayers';

// ── Types ────────────────────────────────────────────────────────────────────

export interface ParsedArchetype {
  emotional: 'Expressive' | 'Reflective';
  conflict: 'Direct' | 'Adaptive';
  affection: 'Romantic' | 'Practical';
  rhythm: 'Structured' | 'Spontaneous';
}

export interface CoupleProfile {
  energy: 'expressive' | 'reflective' | 'mixed';
  conflict: 'direct' | 'adaptive' | 'mixed';
  affection: 'romantic' | 'practical' | 'mixed';
  rhythm: 'structured' | 'spontaneous' | 'mixed';
}

export type TimeSlot = '30min' | '1hr' | '3hrs';

export interface DateIdea {
  title: string;
  description: string;
}

// ── Parsing ──────────────────────────────────────────────────────────────────

const POS1: Record<string, 'Expressive' | 'Reflective'> = { E: 'Expressive', R: 'Reflective' };
const POS2: Record<string, 'Direct' | 'Adaptive'> = { D: 'Direct', A: 'Adaptive' };
const POS3: Record<string, 'Romantic' | 'Practical'> = { R: 'Romantic', P: 'Practical' };
const POS4: Record<string, 'Structured' | 'Spontaneous'> = { S: 'Structured', P: 'Spontaneous' };

export function parseArchetype(code: string): ParsedArchetype {
  if (!code || code.length !== 4) {
    throw new Error('Invalid archetype code: "' + code + '". Expected 4-letter code.');
  }
  const c1 = code[0].toUpperCase();
  const c2 = code[1].toUpperCase();
  const c3 = code[2].toUpperCase();
  const c4 = code[3].toUpperCase();

  const emotional = POS1[c1];
  const conflict = POS2[c2];
  const affection = POS3[c3];
  const rhythm = POS4[c4];

  if (!emotional) throw new Error('Invalid emotional letter: "' + c1 + '"');
  if (!conflict) throw new Error('Invalid conflict letter: "' + c2 + '"');
  if (!affection) throw new Error('Invalid affection letter: "' + c3 + '"');
  if (!rhythm) throw new Error('Invalid rhythm letter: "' + c4 + '"');

  return { emotional, conflict, affection, rhythm };
}

// ── Couple Profile ───────────────────────────────────────────────────────────

export function combineCoupleProfile(p1: ParsedArchetype, p2: ParsedArchetype): CoupleProfile {
  return {
    energy:
      p1.emotional === p2.emotional
        ? (p1.emotional.toLowerCase() as 'expressive' | 'reflective')
        : 'mixed',
    conflict:
      p1.conflict === p2.conflict
        ? (p1.conflict.toLowerCase() as 'direct' | 'adaptive')
        : 'mixed',
    affection:
      p1.affection === p2.affection
        ? (p1.affection.toLowerCase() as 'romantic' | 'practical')
        : 'mixed',
    rhythm:
      p1.rhythm === p2.rhythm
        ? (p1.rhythm.toLowerCase() as 'structured' | 'spontaneous')
        : 'mixed',
  };
}

// ── Activity Filtering & Scoring ─────────────────────────────────────────────

export function filterActivities(
  profile: CoupleProfile,
  timeSlot: TimeSlot
): Activity[] {
  const candidates = ACTIVITY_LIBRARY.filter((a) => a.timeSlots.includes(timeSlot));

  const scored = candidates.map((activity) => {
    let score = 0;

    // Energy dimension
    if (profile.energy === 'expressive') {
      score += activity.energy === 'energetic' ? 3 : activity.energy === 'neutral' ? 1 : 0;
    } else if (profile.energy === 'reflective') {
      score += activity.energy === 'calm' ? 3 : activity.energy === 'neutral' ? 1 : 0;
    } else {
      score += 1; // mixed accepts all
    }

    // Rhythm dimension
    if (profile.rhythm === 'structured') {
      score += activity.structure === 'planned' ? 3 : activity.structure === 'neutral' ? 1 : 0;
    } else if (profile.rhythm === 'spontaneous') {
      score += activity.structure === 'spontaneous' ? 3 : activity.structure === 'neutral' ? 1 : 0;
    } else {
      score += 1;
    }

    // Affection dimension
    if (profile.affection === 'romantic') {
      score += activity.affection === 'romantic' ? 3 : activity.affection === 'neutral' ? 1 : 0;
    } else if (profile.affection === 'practical') {
      score += activity.affection === 'supportive' ? 3 : activity.affection === 'neutral' ? 1 : 0;
    } else {
      score += 1;
    }

    return { activity, score };
  });

  // Sort best first, keep all (even score-0 so we always have ideas)
  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.activity);
}

// ── Emotional Layer Filtering ────────────────────────────────────────────────

export function filterEmotionalLayers(profile: CoupleProfile): EmotionalLayer[] {
  if (profile.conflict === 'direct') {
    return EMOTIONAL_LAYERS.filter((l) => l.depth === 'deep');
  }
  if (profile.conflict === 'adaptive') {
    return EMOTIONAL_LAYERS.filter((l) => l.depth === 'light');
  }
  // mixed — return both
  return [...EMOTIONAL_LAYERS];
}

// ── Activity Verb Phrase Map ─────────────────────────────────────────────────


const ACTIVITY_TITLES: Record<string, string[]> = {
  'Cooking challenge': ['Kitchen Cook-Off', 'Chef Battle', 'Cook-Off Night'],
  'Cafe hopping': ['Caf\u00E9 Crawl', 'Coffee Run', 'Caf\u00E9 Hop'],
  'Street food exploration': ['Street Eats', 'Food Trail', 'Street Food Run'],
  'Board game night': ['Game Night', 'Board Game Bash'],
  'Photo walk': ['Snap & Stroll', 'Photo Walk'],
  'Park picnic': ['Picnic Date', 'Park Picnic'],
  'Couple workout': ['Sweat Date', 'Workout Together'],
  'Art challenge': ['Art Jam', 'Creative Clash'],
  'Puzzle solving': ['Puzzle Time', 'Brain Teasers'],
  'Movie analysis': ['Movie Deep Dive', 'Film Night'],
  'Relationship trivia': ['Love Trivia', 'Couple Quiz'],
  'Future planning': ['Dream Planning', 'Future Talk'],
  'Bucket list writing': ['Bucket List Date', 'Dream List'],
  'Dance session': ['Dance It Out', 'Dance Date'],
  'Love letter writing': ['Love Letters', 'Letter Date'],
  'Memory walk': ['Memory Lane', 'Walk & Remember'],
  'Blind taste test': ['Taste Test Showdown', 'Blind Tasting'],
  'Travel planning': ['Trip Planning', 'Wanderlust Date'],
  'DIY craft': ['Craft Date', 'DIY Together'],
  'Mini road trip': ['Mini Road Trip', 'Spontaneous Drive'],
  'Bookstore date': ['Bookstore Browse', 'Book Date'],
  'Sunset watching': ['Sunset Date', 'Golden Hour'],
  'Museum visit': ['Museum Date', 'Culture Trip'],
  'Karaoke': ['Karaoke Night', 'Sing-Off'],
  'Cooking competition': ['Cook-Off Battle', 'Kitchen Showdown'],
  'Vision board creation': ['Vision Board', 'Dream Board Date'],
  'Couple journaling': ['Journal Together', 'Couple Journal'],
  'Yoga together': ['Yoga Date', 'Stretch & Connect'],
  'Meditation session': ['Zen Date', 'Meditation Moment'],
  'Podcast listening discussion': ['Podcast & Chat', 'Listen & Discuss'],
  'Board game cafe': ['Game Caf\u00E9', 'Board Game Caf\u00E9'],
  'Farmers market visit': ['Market Date', 'Farmers Market Run'],
  'Dessert tasting': ['Sweet Tasting', 'Dessert Date'],
  'Creative storytelling': ['Story Time', 'Make Up Stories'],
  'Relationship quiz': ['Couple Quiz', 'How Well Do You Know Me?'],
  'Cooking international cuisine': ['World Kitchen', 'Global Flavors'],
  'Learn a new skill together': ['Skill Date', 'Learn Together'],
  'Language challenge': ['Language Date', 'Lingo Challenge'],
  'Couple photography': ['Photo Shoot', 'Couple Snaps'],
  'Random adventure challenge': ['Mystery Adventure', 'Random Challenge'],
};

const ACTIVITY_PHRASES: Record<string, string[]> = {
  'Cooking challenge': [
    'Challenge each other to a cook-off',
    'Battle it out in the kitchen with a cooking challenge',
    'Pick a recipe and race to make it best',
  ],
  'Cafe hopping': [
    'Hop between caf\u00E9s and rate each one',
    'Explore new caf\u00E9s together',
    'Go on a caf\u00E9 crawl around town',
  ],
  'Street food exploration': [
    'Hit the streets and hunt for the best bites',
    'Go on a street food crawl together',
    'Explore food stalls and try something new',
  ],
  'Board game night': [
    'Break out the board games and get competitive',
    'Have a board game showdown',
    'Pick a board game neither of you has played before',
  ],
  'Photo walk': [
    'Take a photo walk and capture moments together',
    'Grab your phones and go on a photo walk',
    'Wander around snapping photos of things you love',
  ],
  'Park picnic': [
    'Pack a picnic and head to the park',
    'Set up a cozy picnic in the park',
    'Grab some snacks and have a park picnic',
  ],
  'Couple workout': [
    'Get your heart rates up with a couple workout',
    'Sweat it out together with a partner workout',
    'Do a fun couple workout and cheer each other on',
  ],
  'Art challenge': [
    'Have an art challenge and judge each other\'s creations',
    'Grab some art supplies and see who\'s more creative',
    'Challenge each other to draw or paint something silly',
  ],
  'Puzzle solving': [
    'Team up to solve a tricky puzzle',
    'Work through a puzzle together',
    'Put your heads together on a puzzle',
  ],
  'Movie analysis': [
    'Watch a movie and break it down together',
    'Pick a film and have your own movie discussion',
    'Watch something thought-provoking and talk it through',
  ],
  'Relationship trivia': [
    'Quiz each other on relationship trivia',
    'Test how well you know each other with trivia',
    'Play a round of relationship trivia',
  ],
  'Future planning': [
    'Dream up your future together over coffee',
    'Sit down and plan something exciting for your future',
    'Map out your next big goals together',
  ],
  'Bucket list writing': [
    'Write a couples bucket list together',
    'Dream big and build your shared bucket list',
    'Add to your bucket list and pick one to do soon',
  ],
  'Dance session': [
    'Put on your favorite songs and dance together',
    'Have a spontaneous dance session in the living room',
    'Learn a new dance move together',
  ],
  'Love letter writing': [
    'Write each other heartfelt love letters',
    'Sit down and put your feelings into a love letter',
    'Surprise each other with a handwritten love letter',
  ],
  'Memory walk': [
    'Take a walk down memory lane through your neighborhood',
    'Revisit meaningful spots on a memory walk',
    'Go for a walk and share your favorite memories',
  ],
  'Blind taste test': [
    'Blindfold each other for a taste test',
    'Set up a blind taste test and see who guesses best',
    'Try a fun blind taste test challenge',
  ],
  'Travel planning': [
    'Plan your dream trip together',
    'Pull up a map and plan your next adventure',
    'Research and plan a future getaway',
  ],
  'DIY craft': [
    'Get crafty with a DIY project together',
    'Pick a DIY craft and make something cool',
    'Work on a hands-on craft project as a team',
  ],
  'Mini road trip': [
    'Hit the road for a spontaneous mini road trip',
    'Pick a direction and go on a mini road trip',
    'Take a mini road trip to somewhere new',
  ],
  'Bookstore date': [
    'Browse a bookstore and pick books for each other',
    'Get lost in a bookstore together',
    'Have a bookstore date and swap recommendations',
  ],
  'Sunset watching': [
    'Find a great spot and watch the sunset together',
    'Catch the sunset and soak it in',
    'Chase the sunset and enjoy the view side by side',
  ],
  'Museum visit': [
    'Explore a museum and share your hot takes on the art',
    'Wander through a museum together',
    'Visit a museum and play tour guide for each other',
  ],
  'Karaoke': [
    'Belt out your favorite songs at karaoke',
    'Hit up karaoke and sing your hearts out',
    'Do a karaoke duet and own the stage',
  ],
  'Cooking competition': [
    'Go head-to-head in a cooking competition',
    'See who can make the best dish in a cook-off',
    'Compete in a kitchen showdown',
  ],
  'Vision board creation': [
    'Create a vision board for your relationship',
    'Build a vision board of your shared dreams',
    'Get creative with a couples vision board',
  ],
  'Couple journaling': [
    'Journal together and share what you wrote',
    'Grab your journals and write side by side',
    'Do a couple journaling session and swap entries',
  ],
  'Yoga together': [
    'Flow through a yoga session together',
    'Do some partner yoga and find your balance',
    'Unwind with a couples yoga session',
  ],
  'Meditation session': [
    'Meditate together and clear your minds',
    'Do a guided meditation side by side',
    'Share a peaceful meditation session',
  ],
  'Podcast listening discussion': [
    'Listen to a podcast and discuss it together',
    'Pick a podcast episode and debate the takes',
    'Tune into a podcast and share your thoughts',
  ],
  'Board game cafe': [
    'Hit up a board game caf\u00E9 and play something new',
    'Spend time at a board game caf\u00E9 trying new games',
    'Challenge each other at a board game caf\u00E9',
  ],
  'Farmers market visit': [
    'Stroll through a farmers market together',
    'Explore a farmers market and pick fresh ingredients',
    'Visit a farmers market and taste-test everything',
  ],
  'Dessert tasting': [
    'Go on a dessert tasting adventure',
    'Sample desserts and rate them together',
    'Try new desserts and find your shared favorite',
  ],
  'Creative storytelling': [
    'Make up a story together, taking turns with each line',
    'Get creative and build a story together',
    'Try a round of collaborative storytelling',
  ],
  'Relationship quiz': [
    'Take a relationship quiz and compare answers',
    'See how well you know each other with a couple\'s quiz',
    'Do a fun relationship quiz together',
  ],
  'Cooking international cuisine': [
    'Pick a country and cook its cuisine together',
    'Try making an international dish from scratch',
    'Travel the world through cooking tonight',
  ],
  'Learn a new skill together': [
    'Pick something new and learn it together',
    'Challenge yourselves to learn a new skill as a team',
    'Find a tutorial and learn something new together',
  ],
  'Language challenge': [
    'Try learning a few phrases in a new language together',
    'Do a fun language challenge and quiz each other',
    'Pick a language and learn the basics together',
  ],
  'Couple photography': [
    'Do a couple photoshoot and get creative with poses',
    'Take turns being each other\'s photographer',
    'Have a fun couple photography session',
  ],
  'Random adventure challenge': [
    'Flip a coin at every turn and see where you end up',
    'Go on a random adventure with no plan',
    'Let randomness decide your next adventure',
  ],
};

// ── Casual Emotional Phrase Map ──────────────────────────────────────────────

const CASUAL_LAYERS: Record<string, string[]> = {
  'while asking each other deep relationship questions': [
    'ask each other questions you\'ve never dared to',
    'dive into some deep relationship questions',
  ],
  'while telling childhood stories': [
    'swap your favorite childhood stories',
    'trade childhood memories you\'ve never shared',
  ],
  'while discussing your future dreams together': [
    'talk about your wildest future dreams',
    'share where you see yourselves in five years',
  ],
  'while reflecting on your relationship journey': [
    'reflect on how far you\'ve come together',
    'look back on your relationship journey so far',
  ],
  'while discussing what you admire most about each other': [
    'share what you admire most about each other',
    'tell each other what you find most inspiring',
  ],
  'while having a future planning conversation': [
    'map out something exciting for your future',
    'plan your next big chapter together',
  ],
  'while discussing your dream travel destinations': [
    'talk about your dream travel destinations',
    'plan an imaginary trip to your dream destination',
  ],
  'while sharing memory lane stories': [
    'walk down memory lane with your best stories',
    'swap your favorite memories together',
  ],
  'while discussing your relationship strengths': [
    'talk about what makes you strong as a couple',
    'celebrate the best parts of your relationship',
  ],
  'while brainstorming life goals together': [
    'brainstorm your biggest life goals',
    'dream up your next goals as a team',
  ],
  'while sharing your deepest fears and hopes': [
    'open up about your deepest fears and hopes',
    'get real about what scares you and what excites you',
  ],
  'while discussing how you\'ve grown together': [
    'talk about how you\'ve both grown together',
    'reflect on the ways you\'ve changed each other',
  ],
  'while talking about your most meaningful moments': [
    'share your most meaningful moments as a couple',
    'revisit the moments that meant the most to you both',
  ],
  'while exploring each other\'s love languages': [
    'explore each other\'s love languages',
    'figure out new ways to speak each other\'s love language',
  ],
  'while discussing what home means to both of you': [
    'talk about what home really means to you both',
    'share what makes a place feel like home',
  ],
  'while sharing words of appreciation': [
    'drop genuine compliments on each other',
    'take turns sharing what you appreciate about each other',
  ],
  'while doing a compliment challenge': [
    'do a rapid-fire compliment challenge',
    'see who can come up with the best compliments',
  ],
  'while exchanging love letters': [
    'exchange little love notes',
    'write each other a quick love letter on the spot',
  ],
  'while expressing gratitude for each other': [
    'share what you\'re grateful for about each other',
    'express some heartfelt gratitude',
  ],
  'while playing a couple\'s question game': [
    'play a fun couple\'s question game',
    'pull out some spicy couple\'s questions',
  ],
  'while sharing your favorite memories together': [
    'share your all-time favorite memories together',
    'relive your best moments as a couple',
  ],
  'while taking turns saying what makes you smile': [
    'take turns saying what makes you smile',
    'share the little things that make you happiest',
  ],
  'while sharing three things you love about today': [
    'share three things you love about today',
    'name three things that made today great',
  ],
  'while guessing each other\'s favorites': [
    'guess each other\'s favorites and keep score',
    'test how well you know each other\'s favorites',
  ],
  'while making promises for the week ahead': [
    'make one sweet promise to each other for the week',
    'set a fun couple\'s goal for the week ahead',
  ],
  'while sharing funny relationship moments': [
    'crack up over your funniest relationship moments',
    'share the most hilarious things that have happened to you two',
  ],
  'while creating a shared playlist together': [
    'build a shared playlist of songs that are "so us"',
    'create a playlist that tells your love story',
  ],
  'while writing down wishes for each other': [
    'write down a wish for each other and swap',
    'jot down something you wish for each other',
  ],
  'while sharing what you\'re most grateful for': [
    'share what you\'re most grateful for right now',
    'take a moment to say what you\'re thankful for',
  ],
  'while celebrating small wins together': [
    'celebrate your small wins from the week',
    'hype each other up over your recent wins',
  ],
};

// ── Connectors ───────────────────────────────────────────────────────────────

const CONNECTORS = [
  ' \u2014 ',
  ', then ',
  ' and along the way, ',
  ' and afterwards, ',
  '. Bonus: ',
  ' \u2014 and while you\'re at it, ',
  ', ',
];

// ── Idea Generation ──────────────────────────────────────────────────────────

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateDateIdea(activity: Activity, layer: EmotionalLayer): DateIdea {
  // Pick an activity verb phrase (fallback to raw name)
  const actPhrases = ACTIVITY_PHRASES[activity.name];
  const actPart = actPhrases ? pickRandom(actPhrases) : activity.name;

  // Pick a casual emotional phrase (fallback to raw text)
  const layerPhrases = CASUAL_LAYERS[layer.text];
  const layerPart = layerPhrases ? pickRandom(layerPhrases) : layer.text.replace(/^while /, '');

  // Pick a connector
  const connector = pickRandom(CONNECTORS);

  // Combine into a natural sentence
  let sentence = actPart + connector + layerPart;

  // Capitalize first letter
  sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);

  // Ensure it ends with a period
  if (!sentence.endsWith('.') && !sentence.endsWith('!') && !sentence.endsWith('?')) {
    sentence += '.';
  }

  // Pick a short catchy title from ACTIVITY_TITLES
  const titles = ACTIVITY_TITLES[activity.name];
  const title = titles ? pickRandom(titles) : activity.name;

  return { title, description: sentence };
}

// ── Main Entry Points ────────────────────────────────────────────────────────

export function generateMultipleDates(
  code1: string,
  code2: string,
  timeSlot: TimeSlot,
  count = 20
): DateIdea[] {
  const p1 = parseArchetype(code1);
  const p2 = parseArchetype(code2);
  const profile = combineCoupleProfile(p1, p2);
  const activities = filterActivities(profile, timeSlot);
  const layers = filterEmotionalLayers(profile);

  if (activities.length === 0 || layers.length === 0) {
    return [];
  }

  const ideasMap = new Map<string, DateIdea>();
  let attempts = 0;
  const maxAttempts = count * 5; // prevent infinite loop

  while (ideasMap.size < count && attempts < maxAttempts) {
    const activity = pickRandom(activities);
    const layer = pickRandom(layers);
    const idea = generateDateIdea(activity, layer);
    if (!ideasMap.has(idea.description)) {
      ideasMap.set(idea.description, idea);
    }
    attempts++;
  }

  return Array.from(ideasMap.values());
}

export function spinDateWheel(
  code1: string,
  code2: string,
  timeSlot: TimeSlot
): DateIdea {
  const ideas = generateMultipleDates(code1, code2, timeSlot, 1);
  return ideas[0] ?? { title: 'Go for a Walk', description: "Go for a walk and enjoy each other's company." };
}
