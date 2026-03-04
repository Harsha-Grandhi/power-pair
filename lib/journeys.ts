// ─── Journey Content Data ──────────────────────────────────────────────────────
// All content sourced from the Relationship Journeys PDF

export type TaskType =
  | 'solo_prompt'
  | 'conversation'
  | 'shared_exercise'
  | 'fun_task'
  | 'experiment'
  | 'ritual';

export interface DayTask {
  type: TaskType;
  title: string;
  instructions: string;
  prompts?: string[];
  checkboxLabel: string; // label shown in the checkbox list
}

export interface JourneyDay {
  day: number;
  title: string;
  phase: string;
  tasks: DayTask[];
}

export interface JourneyBadge {
  emoji: string;
  label: string;
  color: string;
}

export interface Journey {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number; // days
  badge: JourneyBadge;
  days: JourneyDay[];
}

// ─── Helper: compute checkbox count for a day ──────────────────────────────────

export function getCheckboxLabelsForDay(day: JourneyDay): string[] {
  const labels: string[] = [];
  for (const task of day.tasks) {
    if (task.type === 'solo_prompt') {
      labels.push('I\'ve written my solo reflection');
      labels.push('I\'ve read my partner\'s reflection');
    } else {
      labels.push(task.checkboxLabel);
    }
  }
  return labels;
}

// ─── Journey 1 ─────────────────────────────────────────────────────────────────

const journey1: Journey = {
  id: 'wedding_planning_connection',
  number: 1,
  title: 'Wedding Planning Without Losing Each Other',
  subtitle: 'Staying Connected While the Event Machine Takes Over',
  description: 'Planning a wedding can be magical — but it can also become one of the most stressful periods in a relationship. Between budgets, family expectations, endless decisions, and time pressure, couples often find themselves arguing about things they never expected. This journey helps couples stay emotionally connected while planning the wedding, ensuring the relationship remains the priority — not just the event.',
  category: 'Relationship Milestone',
  difficulty: 'Moderate',
  duration: 10,
  badge: { emoji: '💍', label: 'Wedding Warriors', color: '#F6B17A' },
  days: [
    {
      day: 1, title: 'What the Wedding Means to Me', phase: 'Aligning Your Vision',
      tasks: [
        {
          type: 'solo_prompt', title: 'Your Wedding Reflection', checkboxLabel: 'I\'ve written my solo reflection',
          instructions: 'Write privately. Complete each of these prompts honestly.',
          prompts: [
            '"When I imagine our wedding day, the moment I care most about is…"',
            '"The biggest emotion I want to feel on that day is…"',
            '"The part of weddings that stresses me out the most is…"',
            '"The thing I\'m most excited to experience with you is…"',
          ],
        },
        {
          type: 'conversation', title: 'Evening Conversation', checkboxLabel: 'We\'ve had our evening conversation',
          instructions: 'Share your solo prompt answers with each other. Then ask:',
          prompts: ['"If we removed all expectations, what kind of wedding would we truly want?"'],
        },
      ],
    },
    {
      day: 2, title: 'The Dream Wedding Vision', phase: 'Aligning Your Vision',
      tasks: [
        {
          type: 'shared_exercise', title: 'Create Your Wedding Vision Board', checkboxLabel: 'We\'ve created our Vision Board',
          instructions: 'Each partner chooses 3 elements that matter most to them and 3 elements they don\'t care much about. Compare and discuss overlaps.',
          prompts: ['"If something goes wrong on the wedding day, what would help us still feel happy?"'],
        },
      ],
    },
    {
      day: 3, title: 'The Hidden Pressure', phase: 'Aligning Your Vision',
      tasks: [
        {
          type: 'solo_prompt', title: 'Expectations Reflection', checkboxLabel: 'I\'ve written my solo reflection',
          instructions: 'Complete this prompt honestly.',
          prompts: ['"The expectation I feel most pressure about is…" (e.g., guest list size, cultural traditions, spending money, pleasing family)'],
        },
        {
          type: 'conversation', title: 'Pressure Discussion', checkboxLabel: 'We\'ve had our conversation about expectations',
          instructions: 'Share your answers and discuss:',
          prompts: ['"What expectations do we want to honor, and which ones do we want to question?"'],
        },
      ],
    },
    {
      day: 4, title: 'The Decision System', phase: 'Designing the Planning System',
      tasks: [
        {
          type: 'shared_exercise', title: 'Create Your Decision-Making System', checkboxLabel: 'We\'ve designed our Decision-Making System',
          instructions: 'Wedding planning involves hundreds of decisions. Divide ownership by category (e.g., Partner A: music, photography; Partner B: food, décor; Shared: guest list, budget). Write it down together.',
          prompts: [],
        },
      ],
    },
    {
      day: 5, title: 'Wedding Budget Priorities', phase: 'Designing the Planning System',
      tasks: [
        {
          type: 'conversation', title: 'Budget Conversation', checkboxLabel: 'We\'ve discussed our budget priorities',
          instructions: 'Discuss openly. Each partner distributes 100 imaginary points across wedding categories (photography, venue, food, entertainment, décor, etc). Compare and create your Wedding Budget Priorities List.',
          prompts: ['"What parts of the wedding are worth spending more on?"', '"What spending decisions would make you uncomfortable?"'],
        },
      ],
    },
    {
      day: 6, title: 'The Family Boundary Plan', phase: 'Designing the Planning System',
      tasks: [
        {
          type: 'shared_exercise', title: 'Family Boundaries', checkboxLabel: 'We\'ve created our Family Boundary Plan',
          instructions: 'Discuss which decisions belong only to you as a couple, and how you\'ll respond when family members push for something you don\'t want. Create your Family Boundary Plan together.',
          prompts: ['"What decisions belong only to us as a couple?"', '"How will we respond when family members push for something we don\'t want?"'],
        },
      ],
    },
    {
      day: 7, title: 'Decision Fatigue Reset', phase: 'Designing the Planning System',
      tasks: [
        {
          type: 'experiment', title: 'One Evening Off', checkboxLabel: 'We took an evening off from wedding planning',
          instructions: 'Take one evening with absolutely no wedding talk, no logistics, no planning. Cook together, watch a movie, or take a walk.',
          prompts: ['"How does it feel when we reconnect without wedding stress?"'],
        },
      ],
    },
    {
      day: 8, title: 'The Stress Check-In', phase: 'Protecting the Relationship',
      tasks: [
        {
          type: 'conversation', title: 'Stress Check-In', checkboxLabel: 'We\'ve had our stress check-in',
          instructions: 'Each partner answers honestly. Practice responding with empathy instead of solutions (e.g., "I can see why that feels overwhelming").',
          prompts: ['"What part of wedding planning is stressing me most right now?"', '"What support from you would help me handle that stress?"'],
        },
      ],
    },
    {
      day: 9, title: 'The Partnership Pact', phase: 'Protecting the Relationship',
      tasks: [
        {
          type: 'shared_exercise', title: 'Write Your Wedding Partnership Pact', checkboxLabel: 'We\'ve written our Wedding Partnership Pact',
          instructions: 'Complete these statements together:',
          prompts: ['"When wedding stress rises, we will remember to…" (e.g., stay patient, communicate calmly, prioritize each other over the event)'],
        },
      ],
    },
    {
      day: 10, title: 'The Wedding Anchor Ritual', phase: 'Protecting the Relationship',
      tasks: [
        {
          type: 'ritual', title: 'Closing Ritual', checkboxLabel: 'We\'ve completed our closing ritual',
          instructions: 'Sit together and answer: "Beyond the wedding itself, what excites you most about our life together?" Then say together: "The wedding is one day. Our partnership is for life." End with a two-minute silent hug.',
          prompts: [],
        },
      ],
    },
  ],
};

// ─── Journey 2 ─────────────────────────────────────────────────────────────────

const journey2: Journey = {
  id: 'inlaws_moving_in',
  number: 2,
  title: 'When In-Laws Move In',
  subtitle: 'Balancing Family Love, Boundaries, and Household Harmony',
  description: 'Having a parent or in-law move into your home can bring warmth, support, and family connection — but it can also introduce tension around boundaries, privacy, parenting styles, routines, and household roles. This journey helps couples align as a team first, set respectful boundaries, and design systems that protect both the relationship and family harmony.',
  category: 'Living Transition',
  difficulty: 'Moderate–High',
  duration: 10,
  badge: { emoji: '🏠', label: 'Home Harmonizers', color: '#7077A1' },
  days: [
    {
      day: 1, title: 'The Emotional Temperature Check', phase: 'Understanding Expectations & Fears',
      tasks: [
        {
          type: 'solo_prompt', title: 'Your Honest Feelings', checkboxLabel: 'I\'ve written my solo reflection',
          instructions: 'Reflect privately. Complete the following sentences:',
          prompts: [
            '"When I imagine your parent living with us, I feel…"',
            '"The biggest change I think this will bring to our life is…"',
            '"The fear I hesitate to say out loud is…"',
          ],
        },
        {
          type: 'conversation', title: 'Evening Share', checkboxLabel: 'We\'ve shared with no interrupting or defending',
          instructions: 'Share your answers. Ground rules: No interrupting, no defending or correcting. Only say: "Thank you for telling me that." The goal is emotional safety.',
          prompts: [],
        },
      ],
    },
    {
      day: 2, title: 'The Family Influence Map', phase: 'Understanding Expectations & Fears',
      tasks: [
        {
          type: 'shared_exercise', title: 'Family Influence Map', checkboxLabel: 'We\'ve created our Family Influence Map',
          instructions: 'Each partner answers: "What was living with parents like growing up?" Discuss rules around privacy, roles, and communication style. Then ask: "What family habits might follow us into this new situation?"',
          prompts: ['"What parts of our childhood family environment do we want to recreate — and what do we want to avoid?"'],
        },
      ],
    },
    {
      day: 3, title: 'The Hidden Worries', phase: 'Understanding Expectations & Fears',
      tasks: [
        {
          type: 'solo_prompt', title: 'Hidden Worries Reflection', checkboxLabel: 'I\'ve written my solo reflection',
          instructions: 'Write answers to these questions privately:',
          prompts: [
            '"What could create tension between my partner and my parent?"',
            '"What situation would make me feel stuck between them?"',
            '"What would make this living arrangement feel healthy instead of stressful?"',
          ],
        },
        {
          type: 'conversation', title: 'Support Conversation', checkboxLabel: 'We\'ve discussed how to support each other',
          instructions: 'Each partner shares one concern. Then discuss:',
          prompts: ['"How can we support each other if conflicts arise?"'],
        },
      ],
    },
    {
      day: 4, title: 'The Household Roles Conversation', phase: 'Designing the Household System',
      tasks: [
        {
          type: 'shared_exercise', title: 'Household Roles Agreement', checkboxLabel: 'We\'ve created our Household Roles Agreement',
          instructions: 'List all household responsibilities (cooking, cleaning, groceries, childcare, bills, errands). Discuss which roles the in-law will take on and which remain the couple\'s responsibility. Write your Household Roles Agreement.',
          prompts: [],
        },
      ],
    },
    {
      day: 5, title: 'Privacy & Space Boundaries', phase: 'Designing the Household System',
      tasks: [
        {
          type: 'conversation', title: 'Privacy Conversation', checkboxLabel: 'We\'ve created our Privacy & Boundary Guidelines',
          instructions: 'Discuss what spaces should remain private (bedroom, workspaces, date nights) and what boundaries help everyone feel respected (knocking before entering, quiet hours, personal belongings). Create your Privacy & Boundary Guidelines.',
          prompts: ['"What spaces should remain private for us as a couple?"', '"What boundaries help everyone feel respected?"'],
        },
      ],
    },
    {
      day: 6, title: 'The Communication Bridge', phase: 'Designing the Household System',
      tasks: [
        {
          type: 'shared_exercise', title: 'Family Communication Rules', checkboxLabel: 'We\'ve established our Family Communication Rules',
          instructions: 'Discuss: if tension arises between a partner and the in-law — who addresses it and how? Create your Family Communication Rules (e.g., "the biological child communicates sensitive issues with their parent").',
          prompts: [],
        },
      ],
    },
    {
      day: 7, title: 'The Support System Map', phase: 'Designing the Household System',
      tasks: [
        {
          type: 'shared_exercise', title: 'Support System Map', checkboxLabel: 'We\'ve mapped our Support System',
          instructions: 'Each partner identifies outside support systems (friends, siblings, mentors, therapy). Discuss: "Who can we talk to when we need perspective?" Create your Support System Map.',
          prompts: [],
        },
      ],
    },
    {
      day: 8, title: 'The Scenario Simulation', phase: 'Preparing for Real-Life Friction',
      tasks: [
        {
          type: 'experiment', title: 'Scenario Practice', checkboxLabel: 'We\'ve practiced responding to hypothetical scenarios',
          instructions: 'Practice responding calmly to hypothetical situations: (1) the in-law criticizes how something is done, (2) the in-law enters your room without knocking, (3) parenting advice conflicts with your approach.',
          prompts: ['"How can we respond calmly while maintaining boundaries?"'],
        },
      ],
    },
    {
      day: 9, title: 'The Couple Alignment Check', phase: 'Preparing for Real-Life Friction',
      tasks: [
        {
          type: 'conversation', title: 'Couple Alignment', checkboxLabel: 'We\'ve discussed how to stay a team',
          instructions: 'Discuss: "What does supporting each other look like when family tension appears?" Complete this sentence:',
          prompts: ['"If conflict arises, I need you to…" (e.g., listen first, defend me respectfully, address issues privately)'],
        },
      ],
    },
    {
      day: 10, title: 'The Household Harmony Ritual', phase: 'Preparing for Real-Life Friction',
      tasks: [
        {
          type: 'ritual', title: 'Harmony Ritual', checkboxLabel: 'We\'ve completed our closing ritual',
          instructions: 'Each partner answers: "The most important thing I want to protect in our relationship during this transition is…" Then say together: "We face challenges as a team." Finish with a two-minute silent hug.',
          prompts: [],
        },
      ],
    },
  ],
};

// ─── Journey 3 ─────────────────────────────────────────────────────────────────

const journey3: Journey = {
  id: 'first_big_trip',
  number: 3,
  title: 'First Big Trip Together',
  subtitle: 'Travel Stress-Tests Relationships — Prepare to Pass',
  description: 'Traveling together for the first time is exciting — but it also reveals habits you\'ve never seen before. How you handle stress, money, planning, exhaustion, and unexpected problems all show up during trips. This journey helps couples align expectations, prevent common travel conflicts, and turn the trip into a bonding experience instead of a stress test.',
  category: 'Relationship Milestone',
  difficulty: 'Easy–Moderate',
  duration: 10,
  badge: { emoji: '✈️', label: 'Adventure Partners', color: '#4ECDC4' },
  days: [
    {
      day: 1, title: 'Your Travel Personality', phase: 'Understanding Travel Personalities',
      tasks: [
        {
          type: 'solo_prompt', title: 'Travel Style Reflection', checkboxLabel: 'I\'ve written my solo reflection',
          instructions: 'Answer honestly about your travel style.',
          prompts: [
            '"When I travel, I usually… (plan everything / go with the flow / prioritize food / prioritize relaxation)"',
            '"My ideal vacation day looks like…"',
            '"The thing that stresses me most during travel is…"',
            '"The thing I love most about traveling is…"',
          ],
        },
        {
          type: 'conversation', title: 'Travel Personality Share', checkboxLabel: 'We\'ve created our Travel Personality Map',
          instructions: 'Share your answers. Then ask each other: "What would make this trip feel amazing for you?" Create your Travel Personality Map.',
          prompts: [],
        },
      ],
    },
    {
      day: 2, title: 'Dream Trip Vision', phase: 'Understanding Travel Personalities',
      tasks: [
        {
          type: 'shared_exercise', title: 'Trip Vision Board', checkboxLabel: 'We\'ve created our Trip Vision Board',
          instructions: 'Each partner chooses 3 must-have experiences from the trip. Look up food experiences, places to visit, relaxing activities, cultural experiences together.',
          prompts: ['"What kind of memories do we want from this trip?"'],
        },
        {
          type: 'fun_task', title: 'Destination Photo Hunt', checkboxLabel: 'We\'ve looked at photos together',
          instructions: 'Look at photos of the destination together. Each partner says: "The moment I\'m most excited to experience with you is…"',
          prompts: [],
        },
      ],
    },
    {
      day: 3, title: 'Travel Annoyance Forecast', phase: 'Understanding Travel Personalities',
      tasks: [
        {
          type: 'solo_prompt', title: 'Annoyance Reflection', checkboxLabel: 'I\'ve written my solo reflection',
          instructions: 'Complete honestly:',
          prompts: ['"During travel I might get irritated when…" (e.g., running late, overplanning, spending too much, constant phone use)'],
        },
        {
          type: 'conversation', title: 'Prevention Plan', checkboxLabel: 'We\'ve discussed how to prevent frustrations',
          instructions: 'Share your answers. Then discuss:',
          prompts: ['"What can we do in advance to prevent these frustrations?"'],
        },
      ],
    },
    {
      day: 4, title: 'The Itinerary Balance', phase: 'Designing the Trip',
      tasks: [
        {
          type: 'shared_exercise', title: 'Balanced Itinerary', checkboxLabel: 'We\'ve planned a balanced itinerary',
          instructions: 'Create a balanced day: Morning (sightseeing), Afternoon (relaxation), Evening (dinner exploration). Rule: each partner gets one activity choice per day.',
          prompts: [],
        },
      ],
    },
    {
      day: 5, title: 'Travel Budget Transparency', phase: 'Designing the Trip',
      tasks: [
        {
          type: 'conversation', title: 'Budget Discussion', checkboxLabel: 'We\'ve created our Travel Budget Plan',
          instructions: 'Discuss openly: accommodation expectations, food budget, shopping, activity costs. Create your Travel Budget Plan.',
          prompts: ['"What spending would make you uncomfortable?"'],
        },
      ],
    },
    {
      day: 6, title: 'Decision-Making System', phase: 'Designing the Trip',
      tasks: [
        {
          type: 'shared_exercise', title: 'Decision Rules', checkboxLabel: 'We\'ve created our Decision Rule System',
          instructions: 'Create a rule system for quick decisions on the trip (where to eat, what to visit, when to rest). Options: alternating decisions, flip a coin, one partner chooses morning / other evening.',
          prompts: [],
        },
      ],
    },
    {
      day: 7, title: 'Packing & Preparation', phase: 'Designing the Trip',
      tasks: [
        {
          type: 'shared_exercise', title: 'Packing Lists', checkboxLabel: 'We\'ve compared our packing lists',
          instructions: 'Each partner writes a packing list. Compare lists.',
          prompts: ['"What comfort items do you need when traveling?"'],
        },
      ],
    },
    {
      day: 8, title: 'The Travel Stress Simulation', phase: 'Preparing for Travel Stress',
      tasks: [
        {
          type: 'experiment', title: 'Stress Scenarios', checkboxLabel: 'We\'ve created our Travel Survival Playbook',
          instructions: 'Imagine a stressful situation (flight delay, getting lost, wrong hotel, bad weather). Discuss how you want to handle stress together. Create your Travel Survival Playbook with rules (e.g., no blaming during problems, take a break if frustration rises).',
          prompts: ['"How do we want to handle stress together?"'],
        },
      ],
    },
    {
      day: 9, title: 'Surprise Adventure', phase: 'Preparing for Travel Stress',
      tasks: [
        {
          type: 'fun_task', title: 'Secret Surprise Plan', checkboxLabel: 'We\'ve each planned a secret surprise',
          instructions: 'Each partner secretly plans a small surprise experience for the other during the trip (hidden café, sunset spot, local activity). Share only a hint!',
          prompts: [],
        },
      ],
    },
    {
      day: 10, title: 'The Travel Pact', phase: 'Preparing for Travel Stress',
      tasks: [
        {
          type: 'ritual', title: 'Travel Pact Ritual', checkboxLabel: 'We\'ve created our Travel Pact and said our words',
          instructions: 'Sit together and answer: "The thing I want us to remember during this trip is…" Create your Travel Pact (e.g., "We promise to prioritize the experience over perfection"). End with a hug and say: "Adventure starts now."',
          prompts: [],
        },
      ],
    },
  ],
};

// ─── Journey 4 ─────────────────────────────────────────────────────────────────

const journey4: Journey = {
  id: 'moving_in_together',
  number: 4,
  title: 'Moving In Together',
  subtitle: 'Merging Two Lives Into One Shared Home',
  description: 'Moving in together is one of the biggest transitions in a relationship. What once felt effortless during dates or visits now becomes a daily reality: shared routines, shared space, shared responsibilities. This journey helps couples design their shared life intentionally instead of discovering differences through conflict. You\'ll align expectations, create systems for chores and finances, set healthy boundaries, and practice living together before it actually begins.',
  category: 'Living Transition',
  difficulty: 'Moderate',
  duration: 10,
  badge: { emoji: '🔑', label: 'Home Builders', color: '#FF6B6B' },
  days: [
    {
      day: 1, title: 'The Dream vs Reality Conversation', phase: 'Understanding Expectations',
      tasks: [
        {
          type: 'solo_prompt', title: 'Living Together Reflection', checkboxLabel: 'I\'ve written my solo reflection',
          instructions: 'Write privately. Complete these sentences:',
          prompts: [
            '"When I imagine living together, the thing I\'m most excited about is…"',
            '"The daily moment I\'m most looking forward to sharing is…"',
            '"The thing that worries me most about living together is…"',
            '"One habit of mine that might annoy you is…"',
          ],
        },
        {
          type: 'conversation', title: 'Share Your Reflections', checkboxLabel: 'We\'ve shared with curiosity (no defending)',
          instructions: 'Share answers. Ground rules: no interrupting, no defending, only curiosity questions.',
          prompts: ['"What part of living together feels most meaningful to you?"'],
        },
      ],
    },
    {
      day: 2, title: 'The Lifestyle Compatibility Check', phase: 'Understanding Expectations',
      tasks: [
        {
          type: 'shared_exercise', title: 'Lifestyle Ratings', checkboxLabel: 'We\'ve compared our lifestyle habits',
          instructions: 'Rate yourselves (1–5) on: morning person vs night owl, cleanliness standards, noise tolerance, need for alone time, hosting friends. Discuss the biggest differences.',
          prompts: ['"Where do we need flexibility or compromise?"'],
        },
      ],
    },
    {
      day: 3, title: 'The Annoyance Forecast', phase: 'Understanding Expectations',
      tasks: [
        {
          type: 'solo_prompt', title: 'Annoyance Reflection', checkboxLabel: 'I\'ve written my solo reflection',
          instructions: 'Complete this sentence:',
          prompts: ['"When we live together I might get frustrated when you…" (e.g., leave dishes in the sink, stay up late, forget chores, bring guests without notice)'],
        },
        {
          type: 'conversation', title: 'Gentle Share', checkboxLabel: 'We\'ve discussed habit adjustments',
          instructions: 'Share answers gently. Then ask:',
          prompts: ['"What small habits can we adjust now to prevent future tension?"'],
        },
      ],
    },
    {
      day: 4, title: 'The Chore Marketplace', phase: 'Designing the Shared Home System',
      tasks: [
        {
          type: 'shared_exercise', title: 'Chore Allocation Matrix', checkboxLabel: 'We\'ve created our Chore Allocation Matrix',
          instructions: 'List all household chores (dishes, cooking, laundry, groceries, cleaning, bills, trash). Each partner gets 10 points to "bid" on preferred chores. Create your Chore Allocation Matrix.',
          prompts: [],
        },
      ],
    },
    {
      day: 5, title: 'Money & Expenses', phase: 'Designing the Shared Home System',
      tasks: [
        {
          type: 'conversation', title: 'Expense System', checkboxLabel: 'We\'ve created our Shared Expense System',
          instructions: 'Discuss openly: rent split, groceries, subscriptions, shared purchases. Create your Shared Expense System (options: equal split, proportional split, expense tracking app).',
          prompts: ['"What spending habits make you uncomfortable?"'],
        },
      ],
    },
    {
      day: 6, title: 'Personal Space Agreement', phase: 'Designing the Shared Home System',
      tasks: [
        {
          type: 'conversation', title: 'Space & Alone Time', checkboxLabel: 'We\'ve created our Personal Space Agreement',
          instructions: 'Discuss when you need personal time (quiet mornings, solo hobbies, reading). Create rules: respecting alone time, quiet hours, personal workspace. This becomes your Personal Space Agreement.',
          prompts: ['"When do I need personal time?"'],
        },
      ],
    },
    {
      day: 7, title: 'Designing Your Home Culture', phase: 'Designing the Shared Home System',
      tasks: [
        {
          type: 'shared_exercise', title: 'Home Culture Statement', checkboxLabel: 'We\'ve written our Home Culture Statement',
          instructions: 'Discuss: "What kind of home do we want to create?" (calm and cozy, lively and social, creative). Create a short statement: "Our home will be a place where…"',
          prompts: [],
        },
      ],
    },
    {
      day: 8, title: 'The 24-Hour Cohabitation Simulation', phase: 'Practicing the Reality',
      tasks: [
        {
          type: 'experiment', title: 'Living Together Test Day', checkboxLabel: 'We\'ve done our cohabitation simulation',
          instructions: 'Spend one full day acting as if you already live together. Simulate morning routine, cooking together, cleaning, relaxing. At night discuss what felt natural and what surprised you.',
          prompts: ['"What felt natural?"', '"What surprised us?"'],
        },
      ],
    },
    {
      day: 9, title: 'Conflict Prevention Plan', phase: 'Practicing the Reality',
      tasks: [
        {
          type: 'shared_exercise', title: 'Conflict Reset Protocol', checkboxLabel: 'We\'ve written our Conflict Reset Protocol',
          instructions: 'Create your Conflict Reset Protocol: no name-calling or sarcasm, pause the argument if voices rise, return to discussion after cooling down.',
          prompts: ['"How do we want to handle disagreements respectfully?"'],
        },
      ],
    },
    {
      day: 10, title: 'The Home Ritual', phase: 'Practicing the Reality',
      tasks: [
        {
          type: 'ritual', title: 'Weekly Home Ritual & Closing', checkboxLabel: 'We\'ve chosen our weekly ritual and said our words',
          instructions: 'Choose one weekly home ritual (Sunday breakfast, Friday movie night, monthly reset day). Stand together and each say: "The kind of home I want us to build together is…" Finish: "We build this home as a team." Hold a two-minute silent hug.',
          prompts: [],
        },
      ],
    },
  ],
};

// ─── Journey 5 ─────────────────────────────────────────────────────────────────

const journey5: Journey = {
  id: 'career_transition_support',
  number: 5,
  title: 'When Work Changes Everything',
  subtitle: 'Navigating Career Change or Job Loss as a Team',
  description: 'A career change or job loss can shake more than finances. It can affect identity, confidence, routines, and emotional stability. One partner may feel pressure, shame, or uncertainty, while the other may feel worried about stability or unsure how to help. This journey helps couples stay emotionally connected during career transitions, communicate openly about money and stress, and design systems for support without creating resentment or pressure.',
  category: 'Career & Financial Shifts',
  difficulty: 'Moderate',
  duration: 10,
  badge: { emoji: '💼', label: 'Resilient Partners', color: '#45B7D1' },
  days: [
    {
      day: 1, title: 'The Emotional Check-In', phase: 'Processing the Change',
      tasks: [
        {
          type: 'solo_prompt', title: 'Career Change Feelings', checkboxLabel: 'I\'ve written my solo reflection',
          instructions: 'Reflect privately. Complete these sentences:',
          prompts: [
            '"When I think about this career change/job loss, I feel…" (anxious / relieved / embarrassed / hopeful)',
            '"The biggest fear I have about this situation is…"',
            '"The biggest opportunity I see in this situation is…"',
          ],
        },
        {
          type: 'conversation', title: 'Validation Conversation', checkboxLabel: 'We\'ve had our validation conversation',
          instructions: 'Share your answers. Ground rules: no fixing or advice yet. Listener only says: "I understand why you feel that way." Goal: emotional validation.',
          prompts: [],
        },
      ],
    },
    {
      day: 2, title: 'Identity & Work', phase: 'Processing the Change',
      tasks: [
        {
          type: 'solo_prompt', title: 'Identity Reflection', checkboxLabel: 'I\'ve written my solo reflection',
          instructions: 'Complete these prompts:',
          prompts: ['"My work makes me feel…" (purposeful, valued, secure)', '"What part of my identity feels shaken right now?"'],
        },
        {
          type: 'conversation', title: 'Identity Affirmation', checkboxLabel: 'We\'ve discussed each other\'s qualities beyond work',
          instructions: 'Discuss:',
          prompts: ['"What qualities do you see in me beyond my job?"'],
        },
      ],
    },
    {
      day: 3, title: 'The Stress Map', phase: 'Processing the Change',
      tasks: [
        {
          type: 'shared_exercise', title: 'Dual Stress Map', checkboxLabel: 'We\'ve created our Stress Map',
          instructions: 'Each partner answers: "What stresses me most about this situation?" (finances, uncertainty, social expectations, loss of routine). Create a Stress Map showing both perspectives.',
          prompts: ['"Where can we support each other better?"'],
        },
      ],
    },
    {
      day: 4, title: 'Financial Transparency', phase: 'Creating Stability Together',
      tasks: [
        {
          type: 'conversation', title: 'Money Talk', checkboxLabel: 'We\'ve created our Financial Transparency Plan',
          instructions: 'Discuss openly: current savings, essential expenses, temporary adjustments. Create your Financial Transparency Plan (monthly spending limit, emergency budget, timeline for reassessment).',
          prompts: ['"What financial change would make you feel safer right now?"'],
        },
      ],
    },
    {
      day: 5, title: 'The Support Style Conversation', phase: 'Creating Stability Together',
      tasks: [
        {
          type: 'solo_prompt', title: 'Support Needs', checkboxLabel: 'I\'ve written my solo reflection',
          instructions: 'Complete:',
          prompts: ['"When I\'m stressed about work, what helps me most is…" (encouragement, practical advice, space, reassurance)'],
        },
        {
          type: 'conversation', title: 'Support Style Guide', checkboxLabel: 'We\'ve created our Support Style Guide',
          instructions: 'Share answers. Create your Support Style Guide (e.g., when feeling discouraged → encouragement; when overwhelmed → give space).',
          prompts: [],
        },
      ],
    },
    {
      day: 6, title: 'Rebuilding Daily Routine', phase: 'Creating Stability Together',
      tasks: [
        {
          type: 'shared_exercise', title: 'New Daily Structure', checkboxLabel: 'We\'ve designed our new daily structure',
          instructions: 'Design a Daily Structure together: Morning (job search/planning), Afternoon (skill learning/networking), Evening (relaxation and couple time).',
          prompts: ['"What routine helps maintain motivation?"'],
        },
      ],
    },
    {
      day: 7, title: 'The Encouragement Ritual', phase: 'Creating Stability Together',
      tasks: [
        {
          type: 'fun_task', title: '5 Encouraging Statements', checkboxLabel: 'We\'ve shared our encouraging statements out loud',
          instructions: 'Each partner writes 5 encouraging statements for the other (e.g., "I admire your resilience", "You\'re capable of more than you realize"). Share them out loud.',
          prompts: [],
        },
      ],
    },
    {
      day: 8, title: 'The Opportunity Brainstorm', phase: 'Moving Forward With Confidence',
      tasks: [
        {
          type: 'shared_exercise', title: 'Career Transition Map', checkboxLabel: 'We\'ve created our Career Transition Map',
          instructions: 'Brainstorm possibilities together (new job search, career pivot, freelance, starting a business, additional education). Write every idea without judging. Create your Career Transition Map.',
          prompts: [],
        },
      ],
    },
    {
      day: 9, title: 'The Next 90 Days Plan', phase: 'Moving Forward With Confidence',
      tasks: [
        {
          type: 'shared_exercise', title: '90-Day Action Roadmap', checkboxLabel: 'We\'ve created our Career Action Roadmap',
          instructions: 'Create a realistic 3-month plan: Month 1 (research opportunities), Month 2 (apply or test ideas), Month 3 (evaluate direction). This becomes your Career Action Roadmap.',
          prompts: [],
        },
      ],
    },
    {
      day: 10, title: 'The Partnership Ritual', phase: 'Moving Forward With Confidence',
      tasks: [
        {
          type: 'ritual', title: 'Team Ritual', checkboxLabel: 'We\'ve completed our partnership ritual',
          instructions: 'Sit together and complete: "During this transition, the way I promise to support you is…" Then say together: "We face uncertainty as a team." End with a two-minute silent hug.',
          prompts: [],
        },
      ],
    },
  ],
};

// ─── Journey 6 ─────────────────────────────────────────────────────────────────

const journey6: Journey = {
  id: 'cultural_religious_differences',
  number: 6,
  title: 'When Our Backgrounds Collide',
  subtitle: 'Navigating Cultural or Religious Differences',
  description: 'In the early stages of a relationship, cultural or religious differences can feel exciting or even invisible. But over time, these differences can surface in meaningful ways — traditions, holidays, food, family expectations, rituals, or beliefs about raising children. This journey helps couples understand each other\'s cultural identities, navigate sensitive differences respectfully, and build a shared culture together. The goal is not to erase differences — but to create a relationship where both identities feel honored and respected.',
  category: 'Identity & Values',
  difficulty: 'Moderate',
  duration: 10,
  badge: { emoji: '🌍', label: 'Bridge Builders', color: '#96CEB4' },
  days: [
    {
      day: 1, title: 'The Cultural Identity Story', phase: 'Understanding Each Other\'s Backgrounds',
      tasks: [
        {
          type: 'solo_prompt', title: 'Cultural Background Reflection', checkboxLabel: 'I\'ve written my solo reflection',
          instructions: 'Reflect privately. Complete the following:',
          prompts: [
            '"The traditions that shaped my childhood were…"',
            '"The religious or cultural practices that matter most to me are…"',
            '"A cultural belief I carry from my upbringing is…"',
            '"One tradition I would be sad to lose is…"',
          ],
        },
        {
          type: 'conversation', title: 'Cultural Story Share', checkboxLabel: 'We\'ve shared our cultural stories',
          instructions: 'Share your answers. Goal: understanding, not debating.',
          prompts: ['"What part of your culture feels most important to your identity?"'],
        },
      ],
    },
    {
      day: 2, title: 'Family Traditions Map', phase: 'Understanding Each Other\'s Backgrounds',
      tasks: [
        {
          type: 'shared_exercise', title: 'Traditions Map', checkboxLabel: 'We\'ve created our Traditions Map',
          instructions: 'Each partner lists important family traditions (religious holidays, family meals, ceremonies, cultural festivals). Create a Traditions Map comparing both.',
          prompts: ['"Which traditions feel most meaningful to continue in our relationship?"'],
        },
      ],
    },
    {
      day: 3, title: 'The Sensitive Topics', phase: 'Understanding Each Other\'s Backgrounds',
      tasks: [
        {
          type: 'solo_prompt', title: 'Sensitive Differences Reflection', checkboxLabel: 'I\'ve written my solo reflection',
          instructions: 'Write privately:',
          prompts: ['"What cultural or religious difference between us worries me the most?" (raising children, dietary rules, religious practices, family expectations)'],
        },
        {
          type: 'conversation', title: 'Open Sharing', checkboxLabel: 'We\'ve shared one concern each with curiosity',
          instructions: 'Share one concern each. Rule: the listener responds with "Help me understand why this matters to you."',
          prompts: [],
        },
      ],
    },
    {
      day: 4, title: 'Holiday Expectations', phase: 'Navigating Differences Respectfully',
      tasks: [
        {
          type: 'shared_exercise', title: 'Shared Holiday Plan', checkboxLabel: 'We\'ve created our Shared Holiday Plan',
          instructions: 'Discuss: which holidays are most important to each partner and how each is traditionally celebrated. Create your Shared Holiday Plan.',
          prompts: ['"What part of this celebration feels most meaningful to you?"'],
        },
      ],
    },
    {
      day: 5, title: 'Food, Lifestyle & Daily Practices', phase: 'Navigating Differences Respectfully',
      tasks: [
        {
          type: 'conversation', title: 'Daily Culture Conversation', checkboxLabel: 'We\'ve discussed our daily cultural habits',
          instructions: 'Discuss differences around food preferences, fasting/dietary rules, lifestyle routines, spiritual practices.',
          prompts: ['"What daily habits from your culture feel essential to keep?"'],
        },
      ],
    },
    {
      day: 6, title: 'Family Expectations', phase: 'Navigating Differences Respectfully',
      tasks: [
        {
          type: 'shared_exercise', title: 'Family Expectation Strategy', checkboxLabel: 'We\'ve created our Family Expectation Strategy',
          instructions: 'Discuss: "What expectations might our families have?" Create a Family Expectation Strategy for responding respectfully (e.g., "We want to respect our traditions while making decisions that work for our relationship").',
          prompts: [],
        },
      ],
    },
    {
      day: 7, title: 'The Respect Agreement', phase: 'Navigating Differences Respectfully',
      tasks: [
        {
          type: 'conversation', title: 'Respect Agreement', checkboxLabel: 'We\'ve created our Respect Agreement',
          instructions: 'Discuss: "What behaviors help us feel respected when cultural differences appear?" (curiosity instead of judgment, avoiding dismissive language, asking questions respectfully). Create your Respect Agreement.',
          prompts: [],
        },
      ],
    },
    {
      day: 8, title: 'Cultural Exchange Day', phase: 'Building a Shared Culture',
      tasks: [
        {
          type: 'experiment', title: 'Cultural Exchange', checkboxLabel: 'We\'ve had our cultural exchange experience',
          instructions: 'Each partner introduces one meaningful element of their culture (cooking a traditional dish, explaining a cultural story, sharing music or rituals).',
          prompts: ['"What does this tradition mean to you emotionally?"'],
        },
      ],
    },
    {
      day: 9, title: 'Future Family Culture', phase: 'Building a Shared Culture',
      tasks: [
        {
          type: 'conversation', title: 'Future Parenting Culture', checkboxLabel: 'We\'ve created our Future Parenting Culture Plan',
          instructions: 'If you plan to have children, discuss: which traditions to pass on, how to teach children about both cultures, whether religious practices will be shared. Create your Future Parenting Culture Plan.',
          prompts: [],
        },
      ],
    },
    {
      day: 10, title: 'The Shared Culture Ritual', phase: 'Building a Shared Culture',
      tasks: [
        {
          type: 'ritual', title: 'Shared Culture Statement', checkboxLabel: 'We\'ve written our Shared Culture Statement and completed the ritual',
          instructions: 'Write a statement together: "In our relationship we honor both of our backgrounds while creating our own traditions." Each partner answers: "One thing from your culture that I\'m grateful to experience because of you is…" Then say: "Our differences make our relationship richer." End with a two-minute hug.',
          prompts: [],
        },
      ],
    },
  ],
};

// ─── Journey 7 ─────────────────────────────────────────────────────────────────

const journey7: Journey = {
  id: 'emotional_neglect_healing',
  number: 7,
  title: 'Healing from Emotional Neglect',
  subtitle: 'Seeing Each Other Again',
  description: 'Emotional neglect rarely happens because one partner stops caring. More often, it grows slowly through stress, routines, distractions, or misunderstandings about emotional needs. Over time, one partner may feel invisible, unsupported, or emotionally alone — while the other may not even realize the distance that has formed. This journey helps couples rebuild emotional connection, learn how to recognize each other\'s needs, and restore the feeling of being truly seen and valued in the relationship.',
  category: 'Conflict & Repair',
  difficulty: 'Moderate–High',
  duration: 10,
  badge: { emoji: '💜', label: 'Reconnected Hearts', color: '#C77DFF' },
  days: [
    {
      day: 1, title: 'The Emotional Temperature Check', phase: 'Understanding the Emotional Distance',
      tasks: [
        {
          type: 'solo_prompt', title: 'Emotional Distance Reflection', checkboxLabel: 'I\'ve written my solo reflection',
          instructions: 'Reflect privately. Complete these sentences:',
          prompts: [
            '"Recently, the moment I felt most emotionally alone in our relationship was…"',
            '"What I wished my partner understood in that moment was…"',
            '"One thing I miss about how we used to connect is…"',
          ],
        },
        {
          type: 'conversation', title: 'Being Heard (Not Fixed)', checkboxLabel: 'We\'ve shared without interrupting or defending',
          instructions: 'Share answers. Rules: the listener cannot interrupt or defend themselves. The listener responds with: "Thank you for telling me that." The goal is being heard, not fixing.',
          prompts: [],
        },
      ],
    },
    {
      day: 2, title: 'The Invisible Moments', phase: 'Understanding the Emotional Distance',
      tasks: [
        {
          type: 'shared_exercise', title: 'Missed Connection Moments', checkboxLabel: 'We\'ve shared our invisible moments',
          instructions: 'Each partner lists three moments where emotional connection could have happened but didn\'t (e.g., sharing a stressful work story, asking for comfort, expressing excitement).',
          prompts: ['"What emotional response did I hope for in that moment?"'],
        },
      ],
    },
    {
      day: 3, title: 'The Emotional Impact', phase: 'Understanding the Emotional Distance',
      tasks: [
        {
          type: 'solo_prompt', title: 'Impact Reflection', checkboxLabel: 'I\'ve written my solo reflection',
          instructions: 'Write privately:',
          prompts: ['"How has this emotional distance affected me?" (feeling lonely, withdrawing emotionally, feeling less valued)'],
        },
        {
          type: 'conversation', title: 'Emotional Needs Draft', checkboxLabel: 'We\'ve started our Emotional Needs Map',
          instructions: 'Each partner shares one impact. Then:',
          prompts: ['"What would emotional support look like in moments like this?"'],
        },
      ],
    },
    {
      day: 4, title: 'Learning to Listen', phase: 'Rebuilding Emotional Awareness',
      tasks: [
        {
          type: 'shared_exercise', title: 'Listening Exercise', checkboxLabel: 'We\'ve completed the listening exercise',
          instructions: 'Partner A shares something meaningful for 3 minutes. Partner B must listen silently, then summarize what they heard (e.g., "What I\'m hearing is that you felt overwhelmed and wished I had asked how you were doing"). Then switch roles. Create your Listening Rules Agreement.',
          prompts: [],
        },
      ],
    },
    {
      day: 5, title: 'Emotional Needs Discovery', phase: 'Rebuilding Emotional Awareness',
      tasks: [
        {
          type: 'solo_prompt', title: 'Love Language Reflection', checkboxLabel: 'I\'ve written my solo reflection',
          instructions: 'Complete the sentence:',
          prompts: ['"I feel most loved when my partner…" (checks in emotionally, shows affection, offers encouragement, listens without fixing)'],
        },
        {
          type: 'shared_exercise', title: 'Complete Your Emotional Needs Map', checkboxLabel: 'We\'ve completed our Emotional Needs Map',
          instructions: 'Combine answers into your Emotional Needs Map (e.g., when feeling overwhelmed → ask how I\'m doing; when feeling sad → offer comfort).',
          prompts: [],
        },
      ],
    },
    {
      day: 6, title: 'The Support Signals', phase: 'Rebuilding Emotional Awareness',
      tasks: [
        {
          type: 'shared_exercise', title: 'Support Signal System', checkboxLabel: 'We\'ve created our Support Signal System',
          instructions: 'Create a simple system: "I need a listening ear" = listen without advice. "I need encouragement" = reassure. Add your own signals.',
          prompts: [],
        },
      ],
    },
    {
      day: 7, title: 'Practicing Emotional Presence', phase: 'Rebuilding Emotional Awareness',
      tasks: [
        {
          type: 'experiment', title: '15 Minutes of Connection', checkboxLabel: 'We\'ve had our 15 minutes of uninterrupted connection',
          instructions: 'Set aside 15 minutes of uninterrupted connection. Rules: no phones, no distractions. Each partner answers:',
          prompts: ['"What\'s something you\'ve been feeling lately that I may not know?"'],
        },
      ],
    },
    {
      day: 8, title: 'Small Daily Check-Ins', phase: 'Restoring Connection & Trust',
      tasks: [
        {
          type: 'shared_exercise', title: 'Daily Check-In Ritual', checkboxLabel: 'We\'ve designed our Daily Check-In Ritual',
          instructions: 'Create a Daily Emotional Check-In Ritual with questions like: "How was your day emotionally?", "What stressed you today?", "What made you smile today?"',
          prompts: [],
        },
      ],
    },
    {
      day: 9, title: 'Appreciation Rebuild', phase: 'Restoring Connection & Trust',
      tasks: [
        {
          type: 'fun_task', title: '5 Appreciations', checkboxLabel: 'We\'ve shared our appreciations out loud',
          instructions: 'Each partner writes 5 things they appreciate about the other (kindness, patience, humor, effort in the relationship). Share them out loud.',
          prompts: [],
        },
      ],
    },
    {
      day: 10, title: 'The Repair Commitment', phase: 'Restoring Connection & Trust',
      tasks: [
        {
          type: 'ritual', title: 'Repair Commitment Ritual', checkboxLabel: 'We\'ve written our Relationship Repair Commitment and said our words',
          instructions: 'Discuss: "What habits will help us avoid emotional distance in the future?" Write your Relationship Repair Commitment. Each partner says: "One way I want to show up more emotionally for you is…" Then say together: "We choose to see and support each other." End with a two-minute silent hug.',
          prompts: [],
        },
      ],
    },
  ],
};

// ─── Journey 8 ─────────────────────────────────────────────────────────────────

const journey8: Journey = {
  id: 'planning_for_baby',
  number: 8,
  title: 'Preparing for Parenthood',
  subtitle: 'Planning for a Baby as a Team',
  description: 'Deciding to have a baby is one of the biggest transitions a couple can make. It brings excitement, but also uncertainty about finances, roles, identity, lifestyle changes, and emotional readiness. This journey helps couples explore their hopes, fears, and expectations about parenthood, align on values, and prepare for the changes a child will bring into their relationship. The goal is not to answer every question — but to ensure both partners feel heard, prepared, and united before beginning the journey into parenthood.',
  category: 'Family Planning & Parenthood',
  difficulty: 'Moderate',
  duration: 10,
  badge: { emoji: '👶', label: 'Future Parents', color: '#FFD93D' },
  days: [
    {
      day: 1, title: 'The Parenthood Reflection', phase: 'Exploring Readiness',
      tasks: [
        {
          type: 'solo_prompt', title: 'Parenthood Feelings', checkboxLabel: 'I\'ve written my solo reflection',
          instructions: 'Reflect privately. Complete these sentences:',
          prompts: [
            '"When I imagine having a child, the thing that excites me most is…"',
            '"The thing that scares me most about becoming a parent is…"',
            '"The kind of parent I hope to be is…"',
            '"One thing I worry might change in our relationship is…"',
          ],
        },
        {
          type: 'conversation', title: 'Parenthood Motivations', checkboxLabel: 'We\'ve shared our parenthood motivations',
          instructions: 'Share answers with each other.',
          prompts: ['"What part of becoming parents feels most meaningful to you?"'],
        },
      ],
    },
    {
      day: 2, title: 'The Childhood Influence', phase: 'Exploring Readiness',
      tasks: [
        {
          type: 'shared_exercise', title: 'Parenting Influence Map', checkboxLabel: 'We\'ve created our Parenting Influence Map',
          instructions: 'Each partner answers: "What parenting style did I grow up with?" (strict, nurturing, hands-off, structured). Discuss what you\'d like to repeat and what you\'d change.',
          prompts: ['"What parts of my upbringing would I like to repeat, and what would I change?"'],
        },
      ],
    },
    {
      day: 3, title: 'The Lifestyle Reality Check', phase: 'Exploring Readiness',
      tasks: [
        {
          type: 'solo_prompt', title: 'Lifestyle Change Reflection', checkboxLabel: 'I\'ve written my solo reflection',
          instructions: 'Complete:',
          prompts: ['"The lifestyle change I think will be hardest for me is…" (sleep disruption, less free time, financial pressure, career adjustments)'],
        },
        {
          type: 'conversation', title: 'Mutual Support Plan', checkboxLabel: 'We\'ve discussed mutual support through lifestyle changes',
          instructions: 'Discuss:',
          prompts: ['"How can we support each other through these lifestyle changes?"'],
        },
      ],
    },
    {
      day: 4, title: 'Parenting Values', phase: 'Designing the Future Family System',
      tasks: [
        {
          type: 'shared_exercise', title: 'Parenting Values Map', checkboxLabel: 'We\'ve created our Parenting Values Map',
          instructions: 'Discuss the values you want to pass on to your child (kindness, curiosity, resilience, independence). Create your Parenting Values Map.',
          prompts: ['"What kind of person do we hope our child grows up to be?"'],
        },
      ],
    },
    {
      day: 5, title: 'Parenting Roles & Responsibilities', phase: 'Designing the Future Family System',
      tasks: [
        {
          type: 'conversation', title: 'Parenting Roles', checkboxLabel: 'We\'ve created our Parenting Roles document',
          instructions: 'Discuss expectations around responsibilities (nighttime care, feeding, childcare, career adjustments). Create a Parenting Roles Discussion document.',
          prompts: ['"What kind of parenting partnership feels fair to both of us?"'],
        },
      ],
    },
    {
      day: 6, title: 'The Support Network', phase: 'Designing the Future Family System',
      tasks: [
        {
          type: 'shared_exercise', title: 'Support Network Plan', checkboxLabel: 'We\'ve created our Support Network Plan',
          instructions: 'Identify potential sources of help (family, friends, childcare providers, community groups). Create your Support Network Plan.',
          prompts: ['"Who could we rely on if we needed help or advice?"'],
        },
      ],
    },
    {
      day: 7, title: 'Financial & Lifestyle Planning', phase: 'Designing the Future Family System',
      tasks: [
        {
          type: 'conversation', title: 'Financial Planning', checkboxLabel: 'We\'ve created our Lifestyle Change Plan',
          instructions: 'Discuss: childcare costs, work-life balance, lifestyle adjustments. Create your Lifestyle Change Plan.',
          prompts: ['"What financial preparation would make us feel more secure?"'],
        },
      ],
    },
    {
      day: 8, title: 'The Sleep Deprivation Simulation', phase: 'Preparing for the Reality of Parenthood',
      tasks: [
        {
          type: 'experiment', title: 'Parenting Challenge Prep', checkboxLabel: 'We\'ve discussed how to support each other through exhaustion',
          instructions: 'Discuss realistic parenting challenges (waking multiple times at night, baby crying when exhausted). Prepare emotionally for difficult moments.',
          prompts: ['"How will we support each other when we\'re both tired and stressed?"'],
        },
      ],
    },
    {
      day: 9, title: 'The Future Family Vision', phase: 'Preparing for the Reality of Parenthood',
      tasks: [
        {
          type: 'shared_exercise', title: 'Parenthood Vision Statement', checkboxLabel: 'We\'ve created our Parenthood Vision Statement',
          instructions: 'Imagine your life five years from now. Discuss daily routines, family traditions, parenting style. Create your Parenthood Vision Statement (e.g., "We want our home to feel safe, loving, and curious").',
          prompts: [],
        },
      ],
    },
    {
      day: 10, title: 'The Letter to Our Future Child', phase: 'Preparing for the Reality of Parenthood',
      tasks: [
        {
          type: 'ritual', title: 'Future Family Letter', checkboxLabel: 'We\'ve written our letter and completed the ritual',
          instructions: 'Together write a short letter beginning with "Dear future child…" Include what you hope to teach them, the life you want to build, what love means in your household. Save it as your Future Family Letter. Sit together and answer: "What excites you most about building a family together?" Say together: "We step into parenthood as partners." End with a two-minute silent hug.',
          prompts: [],
        },
      ],
    },
  ],
};

// ─── Journey 9 ─────────────────────────────────────────────────────────────────

const journey9: Journey = {
  id: 'dating_to_committed',
  number: 9,
  title: 'Defining "Us"',
  subtitle: 'Transitioning from Dating to Committed',
  description: 'Dating often begins with excitement, curiosity, and exploration. But eventually couples reach a moment where the question arises: "What are we?" Transitioning from dating into a committed relationship is not just about exclusivity — it involves aligning expectations about time, emotional support, future goals, and how both partners show up for the relationship. This journey helps couples move from ambiguity to clarity, define what commitment means to them, and build a strong emotional foundation for the relationship ahead.',
  category: 'Relationship Milestones',
  difficulty: 'Easy–Moderate',
  duration: 10,
  badge: { emoji: '🤝', label: 'Committed Partners', color: '#FF9F43' },
  days: [
    {
      day: 1, title: 'What Commitment Means to Me', phase: 'Understanding What Commitment Means',
      tasks: [
        {
          type: 'solo_prompt', title: 'Commitment Reflection', checkboxLabel: 'I\'ve written my solo reflection',
          instructions: 'Reflect privately. Complete the following:',
          prompts: [
            '"When I think about being in a committed relationship, I imagine…"',
            '"The biggest thing I hope for in a committed relationship is…"',
            '"One fear I have about commitment is…"',
            '"What makes me feel secure in a relationship is…"',
          ],
        },
        {
          type: 'conversation', title: 'Commitment Share', checkboxLabel: 'We\'ve shared our commitment expectations',
          instructions: 'Share your reflections.',
          prompts: ['"What does commitment look like in everyday life for you?"'],
        },
      ],
    },
    {
      day: 2, title: 'Our Relationship Story So Far', phase: 'Understanding What Commitment Means',
      tasks: [
        {
          type: 'shared_exercise', title: 'Relationship Story Timeline', checkboxLabel: 'We\'ve created our Relationship Story Timeline',
          instructions: 'Reflect together on your journey: how you first met, the moment you started feeling close, challenges you\'ve overcome. Create a short Relationship Story Timeline.',
          prompts: ['"What moment made you realize this relationship mattered?"'],
        },
      ],
    },
    {
      day: 3, title: 'The Relationship Expectations', phase: 'Understanding What Commitment Means',
      tasks: [
        {
          type: 'solo_prompt', title: 'Expectations Reflection', checkboxLabel: 'I\'ve written my solo reflection',
          instructions: 'Complete:',
          prompts: ['"In a committed relationship I expect my partner to…" (prioritize the relationship, communicate openly, support me emotionally)'],
        },
        {
          type: 'conversation', title: 'Expectations Map', checkboxLabel: 'We\'ve created our Relationship Expectations Map',
          instructions: 'Share your answers. Create your Relationship Expectations Map.',
          prompts: [],
        },
      ],
    },
    {
      day: 4, title: 'The Exclusivity Conversation', phase: 'Aligning Expectations',
      tasks: [
        {
          type: 'conversation', title: 'Exclusivity Discussion', checkboxLabel: 'We\'ve created our Exclusivity Agreement',
          instructions: 'Discuss openly: exclusivity expectations, boundaries with other people, online behavior. Create your Exclusivity Agreement.',
          prompts: ['"What actions make you feel secure in an exclusive relationship?"'],
        },
      ],
    },
    {
      day: 5, title: 'Communication Preferences', phase: 'Aligning Expectations',
      tasks: [
        {
          type: 'solo_prompt', title: 'Communication Style', checkboxLabel: 'I\'ve written my solo reflection',
          instructions: 'Complete:',
          prompts: ['"When something bothers me, I usually…" (talk immediately, need time to process, avoid conflict)'],
        },
        {
          type: 'shared_exercise', title: 'Communication Guide', checkboxLabel: 'We\'ve created our Communication Preferences Guide',
          instructions: 'Create a Communication Preferences Guide (e.g., when conflict arises → calm conversation; when stressed → emotional support).',
          prompts: [],
        },
      ],
    },
    {
      day: 6, title: 'Emotional Support Styles', phase: 'Aligning Expectations',
      tasks: [
        {
          type: 'conversation', title: 'Support Styles', checkboxLabel: 'We\'ve created our Emotional Support Guide',
          instructions: 'Each partner shares: "What makes me feel emotionally supported is…" (listening, encouragement, physical affection). Create your Emotional Support Guide.',
          prompts: [],
        },
      ],
    },
    {
      day: 7, title: 'Handling Disagreements', phase: 'Aligning Expectations',
      tasks: [
        {
          type: 'conversation', title: 'Conflict Approach', checkboxLabel: 'We\'ve created our Conflict Approach Plan',
          instructions: 'Discuss: "How did conflict work in our families growing up?" Then answer: "What kind of disagreement style would feel healthy for our relationship?" Create a Conflict Approach Plan.',
          prompts: [],
        },
      ],
    },
    {
      day: 8, title: 'The Future Possibilities', phase: 'Defining the Relationship Together',
      tasks: [
        {
          type: 'shared_exercise', title: 'Future Possibilities Map', checkboxLabel: 'We\'ve created our Future Possibilities Map',
          instructions: 'Discuss potential future directions (travel together, meeting families, living together). Create a Future Possibilities Map.',
          prompts: ['"What future experiences excite you most about us?"'],
        },
      ],
    },
    {
      day: 9, title: 'The Relationship Identity', phase: 'Defining the Relationship Together',
      tasks: [
        {
          type: 'shared_exercise', title: 'Relationship Identity Statement', checkboxLabel: 'We\'ve written our Relationship Identity Statement',
          instructions: 'Create a short statement describing your relationship (e.g., "We are two people who support each other\'s growth while building a life together"). This becomes your Relationship Identity Statement.',
          prompts: [],
        },
      ],
    },
    {
      day: 10, title: 'The Commitment Conversation', phase: 'Defining the Relationship Together',
      tasks: [
        {
          type: 'ritual', title: 'Commitment Ritual', checkboxLabel: 'We\'ve had our commitment conversation and said our words',
          instructions: 'Each partner completes: "What I promise to bring into this relationship is…" (honesty, effort, patience). Sit together and say: "We choose to move forward together." Then answer: "What excites you most about the relationship we are building?" End with a two-minute hug.',
          prompts: [],
        },
      ],
    },
  ],
};

// ─── Journey 10 ────────────────────────────────────────────────────────────────

const journey10: Journey = {
  id: 'wedding_team_planning',
  number: 10,
  title: 'Staying a Team During Wedding Planning',
  subtitle: 'Navigating Wedding Planning Stress Together',
  description: 'Planning a wedding can be joyful, but it also introduces unexpected pressure. Couples often face hundreds of decisions, financial concerns, family expectations, and time constraints. During this process, it\'s easy for the relationship itself to become secondary to the event. This journey helps couples stay emotionally connected while planning their wedding, communicate effectively under stress, and ensure the wedding strengthens their partnership rather than straining it.',
  category: 'Relationship Milestone',
  difficulty: 'Moderate',
  duration: 10,
  badge: { emoji: '💒', label: 'Wedding Team', color: '#A8E6CF' },
  days: [
    {
      day: 1, title: 'The Wedding Meaning Conversation', phase: 'Understanding What the Wedding Means',
      tasks: [
        {
          type: 'solo_prompt', title: 'What This Wedding Means to You', checkboxLabel: 'I\'ve written my solo reflection',
          instructions: 'Reflect privately. Complete the following:',
          prompts: [
            '"When I imagine our wedding day, the moment I care about most is…"',
            '"The emotion I hope to feel on our wedding day is…"',
            '"The biggest stress I feel about wedding planning is…"',
            '"One expectation I feel from family or society is…"',
          ],
        },
        {
          type: 'conversation', title: 'Wedding Purpose Conversation', checkboxLabel: 'We\'ve identified the core purpose of our wedding',
          instructions: 'Share your answers.',
          prompts: ['"If we stripped away all expectations, what kind of wedding would we truly want?"'],
        },
      ],
    },
    {
      day: 2, title: 'Dream vs Reality', phase: 'Understanding What the Wedding Means',
      tasks: [
        {
          type: 'shared_exercise', title: 'Wedding Vision Statement', checkboxLabel: 'We\'ve created our Wedding Vision Statement draft',
          instructions: 'Each partner lists 3 elements they care deeply about and 3 they care less about. Compare and identify overlaps. Create the first draft of your Wedding Vision Statement.',
          prompts: [],
        },
      ],
    },
    {
      day: 3, title: 'The Hidden Pressure', phase: 'Understanding What the Wedding Means',
      tasks: [
        {
          type: 'solo_prompt', title: 'Pressure Points', checkboxLabel: 'I\'ve written my solo reflection',
          instructions: 'Complete:',
          prompts: ['"The pressure I feel most strongly about the wedding is…" (pleasing family, spending money, cultural traditions, guest expectations)'],
        },
        {
          type: 'conversation', title: 'Expectations Review', checkboxLabel: 'We\'ve discussed which expectations to honor vs rethink',
          instructions: 'Discuss:',
          prompts: ['"Which expectations do we want to honor, and which ones do we want to rethink?"'],
        },
      ],
    },
    {
      day: 4, title: 'The Decision Ownership System', phase: 'Designing the Planning System',
      tasks: [
        {
          type: 'shared_exercise', title: 'Decision-Making System', checkboxLabel: 'We\'ve created our Decision-Making System',
          instructions: 'Divide wedding responsibilities by category. Examples: Partner A (music, photography, invitations), Partner B (décor, flowers, guests), Shared (venue, ceremony format, budget).',
          prompts: [],
        },
      ],
    },
    {
      day: 5, title: 'Budget Priorities', phase: 'Designing the Planning System',
      tasks: [
        {
          type: 'conversation', title: 'Budget Priority Map', checkboxLabel: 'We\'ve created our Budget Priority Map',
          instructions: 'Each partner distributes 100 points across wedding categories (venue, food, photography, attire, décor, entertainment). Compare priorities.',
          prompts: [],
        },
      ],
    },
    {
      day: 6, title: 'Family Influence', phase: 'Designing the Planning System',
      tasks: [
        {
          type: 'shared_exercise', title: 'Family Boundary Strategy', checkboxLabel: 'We\'ve created our Family Boundary Strategy',
          instructions: 'Discuss: what decisions are open to family input vs belong only to you. Create your Family Boundary Strategy.',
          prompts: ['"What decisions are open to family input?"', '"What decisions belong only to us?"'],
        },
      ],
    },
    {
      day: 7, title: 'The Planning Break', phase: 'Designing the Planning System',
      tasks: [
        {
          type: 'experiment', title: 'Wedding-Free Evening', checkboxLabel: 'We took a full evening away from wedding planning',
          instructions: 'Take one full evening where wedding talk is not allowed. Instead: cook dinner together, watch a movie, take a walk.',
          prompts: ['"How does it feel when we reconnect outside wedding planning?"'],
        },
      ],
    },
    {
      day: 8, title: 'Stress Check-In', phase: 'Protecting the Relationship',
      tasks: [
        {
          type: 'conversation', title: 'Stress Check', checkboxLabel: 'We\'ve done our stress check-in with empathy',
          instructions: 'Each partner answers. The listener responds with empathy, not solutions.',
          prompts: ['"What part of wedding planning is stressing me the most right now?"', '"What kind of support from you would help?"'],
        },
      ],
    },
    {
      day: 9, title: 'The Stress Reset Ritual', phase: 'Protecting the Relationship',
      tasks: [
        {
          type: 'shared_exercise', title: 'Stress Reset Ritual', checkboxLabel: 'We\'ve designed our Stress Reset Ritual',
          instructions: 'Design a Stress Reset Ritual (a walk together, short meditation, cooking a favorite meal). Create a rule: when tension rises, either partner can say "Let\'s reset."',
          prompts: [],
        },
      ],
    },
    {
      day: 10, title: 'The Marriage Partnership Pact', phase: 'Protecting the Relationship',
      tasks: [
        {
          type: 'ritual', title: 'Partnership Pact Ritual', checkboxLabel: 'We\'ve written our Partnership Pact and said our words',
          instructions: 'Each partner completes: "Beyond the wedding itself, what excites me most about our future together is…" Together write your Marriage Partnership Pact (e.g., "We promise to prioritize our relationship over the wedding event and support each other through stress and challenges"). Say together: "The wedding is one day. Our partnership is for life." End with a two-minute silent hug.',
          prompts: [],
        },
      ],
    },
  ],
};

// ─── All Journeys Export ────────────────────────────────────────────────────────

export const JOURNEYS: Journey[] = [
  journey1,
  journey2,
  journey3,
  journey4,
  journey5,
  journey6,
  journey7,
  journey8,
  journey9,
  journey10,
];

export function getJourneyById(id: string): Journey | undefined {
  return JOURNEYS.find((j) => j.id === id);
}
