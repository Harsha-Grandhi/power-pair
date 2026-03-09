export interface CrimeFileQuestion {
  id: string;
  label: string;
}

export interface CrimeFileSection {
  id: string;
  emoji: string;
  name: string;
  questions: CrimeFileQuestion[];
}

export const crimeFileSections: CrimeFileSection[] = [
  {
    id: 'basics',
    emoji: '🎂',
    name: 'The Basics',
    questions: [
      { id: 'birthday', label: 'Birthday' },
      { id: 'star_sign', label: 'Star sign' },
      { id: 'shoe_size', label: 'Shoe size' },
      { id: 'shirt_size', label: 'Shirt size' },
      { id: 'pant_size', label: 'Pant size' },
      { id: 'dress_size', label: 'Dress size' },
      { id: 'ring_size', label: 'Ring size' },
      { id: 'jacket_size', label: 'Jacket size' },
      { id: 'height', label: 'Height' },
      { id: 'blood_type', label: 'Blood type' },
    ],
  },
  {
    id: 'favorites',
    emoji: '🎨',
    name: 'Favorites',
    questions: [
      { id: 'fav_color', label: 'Favorite color' },
      { id: 'fav_food', label: 'Favorite food' },
      { id: 'comfort_food', label: 'Comfort food' },
      { id: 'fav_cuisine', label: 'Favorite cuisine' },
      { id: 'fav_restaurant', label: 'Favorite restaurant' },
      { id: 'fav_movie', label: 'Favorite movie' },
      { id: 'fav_tv_rewatch', label: 'Favorite TV show to rewatch forever' },
      { id: 'fav_book', label: 'Favorite book' },
      { id: 'fav_song_now', label: 'Favorite song right now' },
      { id: 'fav_song_alltime', label: 'All-time favorite song' },
      { id: 'fav_artist', label: 'Favorite artist or band' },
      { id: 'fav_holiday_dest', label: 'Favorite holiday destination' },
      { id: 'fav_season', label: 'Favorite season' },
      { id: 'fav_sport_watch', label: 'Favorite sport to watch' },
      { id: 'fav_sport_play', label: 'Favorite sport to play' },
      { id: 'fav_childhood_memory', label: 'Favorite childhood memory' },
      { id: 'fav_sunday', label: 'Favorite way to spend a Sunday' },
      { id: 'fav_dessert', label: 'Favorite dessert' },
      { id: 'fav_snack', label: 'Favorite snack' },
      { id: 'fav_drink', label: 'Favorite drink' },
    ],
  },
  {
    id: 'daily_habits',
    emoji: '☕',
    name: 'Daily Habits',
    questions: [
      { id: 'coffee_order', label: 'How I take my coffee' },
      { id: 'morning_or_night', label: 'Morning person or night owl' },
      { id: 'wake_time', label: 'Usual wake up time' },
      { id: 'bedtime', label: 'Usual bedtime' },
      { id: 'restaurant_order', label: 'Go-to restaurant order' },
      { id: 'first_morning', label: 'First thing I do in the morning' },
      { id: 'wind_down', label: 'Wind-down routine at night' },
      { id: 'get_ready_time', label: 'Time I take to get ready' },
      { id: 'stress_eat', label: 'Stress-eat of choice' },
      { id: 'guilty_pleasure_tv', label: 'Guilty pleasure TV show' },
    ],
  },
  {
    id: 'gifting',
    emoji: '🎁',
    name: 'Gifting Intel',
    questions: [
      { id: 'gift_always_wanted', label: "Gift I've always wanted but never bought myself" },
      { id: 'fav_flower', label: 'Favorite flower or plant' },
      { id: 'fav_candle_scent', label: 'Favorite candle scent or fragrance' },
      { id: 'fav_perfume', label: 'Favorite perfume or cologne' },
      { id: 'experiences_or_physical', label: 'Experiences or physical gifts' },
      { id: 'fav_chocolate', label: 'Favorite type of chocolate' },
      { id: 'wardrobe_wish', label: "One thing I'd love in my wardrobe" },
      { id: 'fav_clothing_brand', label: 'Favorite clothing brand' },
      { id: 'fav_surprise', label: 'Favorite way to be surprised' },
      { id: 'small_smile', label: 'Something small that always makes me smile' },
    ],
  },
  {
    id: 'travel',
    emoji: '🌍',
    name: 'Travel & Adventure',
    questions: [
      { id: 'dream_destination', label: 'Dream holiday destination' },
      { id: 'best_trip', label: "Best trip I've ever taken" },
      { id: 'beach_or_mountains', label: 'Beach or mountains' },
      { id: 'roadtrips_or_flights', label: 'Road trips or flights' },
      { id: 'country_to_visit', label: "Country I've always wanted to visit" },
      { id: 'travel_style', label: 'Travel style' },
      { id: 'window_or_aisle', label: 'Window seat or aisle seat' },
      { id: 'fav_holiday_activity', label: 'Favorite thing to do on holiday' },
      { id: 'bucket_list_adventure', label: 'Adventure activity on my bucket list' },
      { id: 'city_move_tomorrow', label: 'City I could move to tomorrow' },
    ],
  },
  {
    id: 'work',
    emoji: '💼',
    name: 'Work & Ambitions',
    questions: [
      { id: 'dream_job', label: "Dream job if money didn't matter" },
      { id: 'career_goal', label: "One career goal I'm working toward" },
      { id: 'childhood_dream_job', label: 'What I wanted to be as a kid' },
      { id: 'proudest_achievement', label: 'Proudest professional achievement' },
      { id: 'alone_or_team', label: 'Working alone or in a team' },
      { id: 'work_motivation', label: 'What motivates me most at work' },
      { id: 'work_drain', label: 'What drains me most at work' },
      { id: 'secret_skill', label: 'Skill I secretly wish I had' },
      { id: 'want_to_learn', label: "Something I'd love to learn or study" },
      { id: 'business_idea', label: "Business I'd start if I could" },
    ],
  },
  {
    id: 'personality',
    emoji: '🧠',
    name: 'Personality & Quirks',
    questions: [
      { id: 'love_language', label: 'My love language' },
      { id: 'pet_peeve', label: 'Biggest pet peeve' },
      { id: 'cheers_me_up', label: 'Something that always cheers me up' },
      { id: 'biggest_fear', label: 'Biggest fear' },
      { id: 'hardest_laugh', label: 'What makes me laugh harder than anything' },
      { id: 'irrational_passion', label: "Something I'm irrationally passionate about" },
      { id: 'habit_breaking', label: "Habit I'm trying to break" },
      { id: 'nobody_watching', label: 'Something I do when nobody is watching' },
      { id: 'secretly_proud', label: "One thing I'm secretly proud of" },
      { id: 'surprising_opinion', label: 'Opinion I hold that surprises people' },
    ],
  },
  {
    id: 'home',
    emoji: '🏠',
    name: 'Home & Lifestyle',
    questions: [
      { id: 'ideal_home_vibe', label: 'Ideal home vibe' },
      { id: 'fav_room', label: 'Favorite room in the house' },
      { id: 'hated_chore', label: 'Chore I hate the most' },
      { id: 'ok_chore', label: "Chore I secretly don't mind" },
      { id: 'fav_cook', label: 'Favorite thing to cook' },
      { id: 'cant_sleep_without', label: "Something I can't sleep without" },
      { id: 'bedside_table', label: "What's always on my bedside table" },
      { id: 'fav_nothing', label: 'Favorite way to do nothing' },
      { id: 'comfort_show', label: 'Show or movie I put on when I need comfort' },
      { id: 'first_notice_home', label: "First thing I notice entering someone's home" },
    ],
  },
  {
    id: 'relationship',
    emoji: '❤️',
    name: 'Relationship & Connection',
    questions: [
      { id: 'first_impression', label: 'My first impression of you' },
      { id: 'fav_memory_us', label: 'My favorite memory of us' },
      { id: 'love_never_told', label: 'Something you do that I love but have never told you' },
      { id: 'fav_date_ever', label: "My favorite date we've ever been on" },
      { id: 'wish_more_of', label: 'One thing I wish you did more of' },
      { id: 'surprising_romantic', label: 'Something I find romantic that might surprise you' },
      { id: 'perfect_date_night', label: 'My idea of a perfect date night' },
      { id: 'want_to_do_together', label: "One thing I want us to do together that we haven't yet" },
      { id: 'tradition_to_start', label: "A tradition I'd love for us to start" },
      { id: 'always_remember', label: 'One thing I want you to always remember about me' },
    ],
  },
];

export const TOTAL_QUESTIONS = crimeFileSections.reduce(
  (sum, s) => sum + s.questions.length,
  0
);

export function countAnswered(answers: Record<string, string>): number {
  return Object.values(answers).filter((v) => v.trim().length > 0).length;
}

export function countAnsweredInSection(
  answers: Record<string, string>,
  section: CrimeFileSection
): number {
  return section.questions.filter(
    (q) => answers[q.id] && answers[q.id].trim().length > 0
  ).length;
}
