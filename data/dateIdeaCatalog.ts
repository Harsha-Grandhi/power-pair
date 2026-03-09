import { DateDuration } from '@/lib/dateIdeas';

export type CatalogCategory =
  | 'Foodie'
  | 'Adventure'
  | 'Creative'
  | 'Wellness'
  | 'Entertainment'
  | 'Outdoors'
  | 'Cultural'
  | 'Romantic'
  | 'Budget'
  | 'Seasonal';

export const CATALOG_CATEGORIES: { id: CatalogCategory; emoji: string }[] = [
  { id: 'Foodie', emoji: '🍽️' },
  { id: 'Adventure', emoji: '🏔️' },
  { id: 'Creative', emoji: '🎨' },
  { id: 'Wellness', emoji: '🧘' },
  { id: 'Entertainment', emoji: '🎬' },
  { id: 'Outdoors', emoji: '🌿' },
  { id: 'Cultural', emoji: '🏛️' },
  { id: 'Romantic', emoji: '💕' },
  { id: 'Budget', emoji: '💰' },
  { id: 'Seasonal', emoji: '🌸' },
];

export interface CatalogDateIdea {
  id: string;
  title: string;
  description: string;
  duration: DateDuration;
  category: CatalogCategory;
  emoji: string;
}

export const DATE_IDEA_CATALOG: CatalogDateIdea[] = [
  // ── Foodie (15) ─────────────────────────────────────────────────────────────
  { id: 'foodie-01', title: 'Cook a New Recipe Together', description: 'Pick a cuisine neither of you has tried and follow a recipe from scratch. Bonus points for plating it fancy.', duration: '1 hr', category: 'Foodie', emoji: '👨‍🍳' },
  { id: 'foodie-02', title: 'Homemade Pizza Night', description: 'Make dough from scratch, set up a toppings bar, and each create your dream pizza. Judge whose looks better.', duration: '1 hr', category: 'Foodie', emoji: '🍕' },
  { id: 'foodie-03', title: 'Blind Taste Test Challenge', description: 'Blindfold each other and guess mystery foods. Keep score and crown a winner at the end.', duration: '30 min', category: 'Foodie', emoji: '🤔' },
  { id: 'foodie-04', title: 'Brunch at a New Spot', description: 'Find a brunch place neither of you has been to. Order something you wouldn\'t normally try.', duration: '1 hr', category: 'Foodie', emoji: '🥞' },
  { id: 'foodie-05', title: 'Dessert Crawl', description: 'Hit three different dessert spots in one evening — bakery, ice cream, and a chocolate shop.', duration: '3 hrs', category: 'Foodie', emoji: '🍰' },
  { id: 'foodie-06', title: 'Midnight Pancakes', description: 'Stay up late and make pancakes together at midnight. Add fun toppings and enjoy the quiet together.', duration: '30 min', category: 'Foodie', emoji: '🥞' },
  { id: 'foodie-07', title: 'Farmers Market Adventure', description: 'Browse a local farmers market together, pick fresh ingredients, and cook a meal with what you find.', duration: '3 hrs', category: 'Foodie', emoji: '🧺' },
  { id: 'foodie-08', title: 'Sushi Rolling at Home', description: 'Get sushi-grade fish, nori, and rice. Learn to roll your own sushi and enjoy your creations.', duration: '1 hr', category: 'Foodie', emoji: '🍣' },
  { id: 'foodie-09', title: 'Coffee Shop Hop', description: 'Visit three different coffee shops in your area. Rate each one and pick your couple favourite.', duration: '3 hrs', category: 'Foodie', emoji: '☕' },
  { id: 'foodie-10', title: 'Fondue Night', description: 'Melt cheese and chocolate for a cozy fondue night with bread, fruit, and your favourite dippables.', duration: '1 hr', category: 'Foodie', emoji: '🫕' },
  { id: 'foodie-11', title: 'Bake-Off Challenge', description: 'Pick the same dessert recipe and each make your own version. Taste test and declare a winner.', duration: '1 hr', category: 'Foodie', emoji: '🧁' },
  { id: 'foodie-12', title: 'Food Truck Crawl', description: 'Find a food truck gathering and try bites from multiple trucks. Share everything and explore flavours.', duration: '1 hr', category: 'Foodie', emoji: '🚚' },
  { id: 'foodie-13', title: 'Cocktail / Mocktail Making', description: 'Look up recipes, gather ingredients, and play bartender for each other. Make it fancy with garnishes.', duration: '30 min', category: 'Foodie', emoji: '🍹' },
  { id: 'foodie-14', title: 'Breakfast in Bed', description: 'Wake up early and surprise your partner with a full breakfast tray in bed. Simple but so romantic.', duration: '30 min', category: 'Foodie', emoji: '🍳' },
  { id: 'foodie-15', title: 'International Dinner Night', description: 'Pick a country, research its cuisine, cook a traditional dish, and set the mood with music from that region.', duration: '3 hrs', category: 'Foodie', emoji: '🌍' },

  // ── Adventure (15) ──────────────────────────────────────────────────────────
  { id: 'adventure-01', title: 'Go-Kart Racing', description: 'Hit the go-kart track and race each other. Loser buys ice cream on the way home.', duration: '1 hr', category: 'Adventure', emoji: '🏎️' },
  { id: 'adventure-02', title: 'Indoor Rock Climbing', description: 'Try bouldering or top-rope climbing at a local gym. Cheer each other on and celebrate small wins.', duration: '1 hr', category: 'Adventure', emoji: '🧗' },
  { id: 'adventure-03', title: 'Escape Room Challenge', description: 'Book an escape room and work together under pressure. See how well you communicate as a team.', duration: '1 hr', category: 'Adventure', emoji: '🔐' },
  { id: 'adventure-04', title: 'Road Trip to a Nearby Town', description: 'Pick a town within an hour\'s drive you\'ve never explored. Wander, eat, and discover together.', duration: '3 hrs', category: 'Adventure', emoji: '🚗' },
  { id: 'adventure-05', title: 'Kayaking or Canoeing', description: 'Rent a kayak or canoe and paddle along a river or lake. Enjoy nature and each other\'s company.', duration: '3 hrs', category: 'Adventure', emoji: '🛶' },
  { id: 'adventure-06', title: 'Mini Golf Tournament', description: 'Play 18 holes of mini golf with a little friendly competition. Keep score and have fun with it.', duration: '1 hr', category: 'Adventure', emoji: '⛳' },
  { id: 'adventure-07', title: 'Bowling Night', description: 'Hit the bowling alley for a few rounds. Make fun bets on who scores higher.', duration: '1 hr', category: 'Adventure', emoji: '🎳' },
  { id: 'adventure-08', title: 'Trampoline Park', description: 'Jump, flip, and play dodgeball at a trampoline park. Let your inner kids out.', duration: '1 hr', category: 'Adventure', emoji: '🤸' },
  { id: 'adventure-09', title: 'Geocaching Expedition', description: 'Download a geocaching app and hunt for hidden caches in your area. A real-life treasure hunt.', duration: '3 hrs', category: 'Adventure', emoji: '🗺️' },
  { id: 'adventure-10', title: 'Zip Line Adventure', description: 'Find a local zip line course and soar through the trees. An adrenaline rush you\'ll share together.', duration: '3 hrs', category: 'Adventure', emoji: '🪂' },
  { id: 'adventure-11', title: 'Arcade Night', description: 'Hit up an arcade and challenge each other at classic games. Win tickets and trade them for silly prizes.', duration: '1 hr', category: 'Adventure', emoji: '🕹️' },
  { id: 'adventure-12', title: 'Laser Tag Battle', description: 'Suit up for laser tag and compete against each other (or team up against strangers).', duration: '1 hr', category: 'Adventure', emoji: '🔫' },
  { id: 'adventure-13', title: 'Try a New Sport Together', description: 'Pick a sport neither of you has played — badminton, table tennis, frisbee — and learn together.', duration: '1 hr', category: 'Adventure', emoji: '🏸' },
  { id: 'adventure-14', title: 'Scavenger Hunt', description: 'Create a scavenger hunt for each other around the city. Include fun clues and a surprise at the end.', duration: '3 hrs', category: 'Adventure', emoji: '🔍' },
  { id: 'adventure-15', title: 'Night Drive Adventure', description: 'Drive somewhere scenic at night with good music. Pull over for stargazing or a quiet chat.', duration: '1 hr', category: 'Adventure', emoji: '🌙' },

  // ── Creative (15) ───────────────────────────────────────────────────────────
  { id: 'creative-01', title: 'Paint and Sip Night', description: 'Set up canvases, paints, and wine. Follow a tutorial or freestyle — then reveal your masterpieces.', duration: '1 hr', category: 'Creative', emoji: '🎨' },
  { id: 'creative-02', title: 'Pottery Class', description: 'Book a pottery class and try your hand at the wheel. Channel your inner Ghost movie scene.', duration: '3 hrs', category: 'Creative', emoji: '🏺' },
  { id: 'creative-03', title: 'Write Love Letters', description: 'Sit together and each write a heartfelt letter to the other. Then exchange and read aloud.', duration: '30 min', category: 'Creative', emoji: '💌' },
  { id: 'creative-04', title: 'Build a Playlist Together', description: 'Each pick 10 songs that remind you of your relationship. Merge them into your official couple playlist.', duration: '30 min', category: 'Creative', emoji: '🎵' },
  { id: 'creative-05', title: 'Couple Photo Shoot', description: 'Find a pretty location and take turns photographing each other. Get creative with poses and angles.', duration: '1 hr', category: 'Creative', emoji: '📸' },
  { id: 'creative-06', title: 'DIY Scrapbook', description: 'Print your favourite couple photos and create a scrapbook together. Add stickers, notes, and memories.', duration: '3 hrs', category: 'Creative', emoji: '📒' },
  { id: 'creative-07', title: 'Learn a TikTok Dance', description: 'Pick a trending dance, learn it together, and record your best attempt. Laugh guaranteed.', duration: '30 min', category: 'Creative', emoji: '💃' },
  { id: 'creative-08', title: 'Drawing Each Other', description: 'Set a timer and draw portraits of each other. No matter the skill level, the results will be priceless.', duration: '30 min', category: 'Creative', emoji: '✏️' },
  { id: 'creative-09', title: 'Candle Making', description: 'Get a candle-making kit and create custom candles together. Pick your favourite scents and colours.', duration: '1 hr', category: 'Creative', emoji: '🕯️' },
  { id: 'creative-10', title: 'Tie-Dye Party', description: 'Buy white t-shirts and tie-dye kits. Make matching shirts or go wild with your own designs.', duration: '1 hr', category: 'Creative', emoji: '🌈' },
  { id: 'creative-11', title: 'Write a Short Story Together', description: 'Take turns writing sentences to create an absurd or romantic story. Read it aloud when done.', duration: '30 min', category: 'Creative', emoji: '📝' },
  { id: 'creative-12', title: 'Vision Board Date', description: 'Cut out magazine images and create a shared vision board for your relationship goals and dreams.', duration: '1 hr', category: 'Creative', emoji: '🎯' },
  { id: 'creative-13', title: 'Make a Time Capsule', description: 'Write letters to your future selves, add small keepsakes, seal it, and set a date to open it.', duration: '1 hr', category: 'Creative', emoji: '📦' },
  { id: 'creative-14', title: 'Karaoke Night', description: 'Belt out your favourite songs at a karaoke bar or set up a home karaoke session. No judgment zone.', duration: '1 hr', category: 'Creative', emoji: '🎤' },
  { id: 'creative-15', title: 'Learn Origami Together', description: 'Watch tutorials and fold paper cranes, flowers, or hearts. See who can master it first.', duration: '30 min', category: 'Creative', emoji: '🦢' },

  // ── Wellness (15) ───────────────────────────────────────────────────────────
  { id: 'wellness-01', title: 'Couples Yoga Session', description: 'Follow a couples yoga video at home. Help each other with poses and enjoy the calm together.', duration: '30 min', category: 'Wellness', emoji: '🧘' },
  { id: 'wellness-02', title: 'Spa Night at Home', description: 'Face masks, candles, bath bombs, and soothing music. Give each other massages and fully unwind.', duration: '1 hr', category: 'Wellness', emoji: '🛁' },
  { id: 'wellness-03', title: 'Meditation Together', description: 'Find a guided couples meditation and sit together in stillness. Reset and reconnect.', duration: '30 min', category: 'Wellness', emoji: '🧠' },
  { id: 'wellness-04', title: 'Sunrise or Sunset Walk', description: 'Wake up early for sunrise or head out for golden hour. Walk in silence or share what you\'re grateful for.', duration: '30 min', category: 'Wellness', emoji: '🌅' },
  { id: 'wellness-05', title: 'Digital Detox Evening', description: 'Put all devices away for 3 hours. Talk, cook, play games — just be present with each other.', duration: '3 hrs', category: 'Wellness', emoji: '📵' },
  { id: 'wellness-06', title: 'Try a New Workout Together', description: 'Pick a class — spinning, boxing, dance — and do it together. Sweat it out and feel great after.', duration: '1 hr', category: 'Wellness', emoji: '💪' },
  { id: 'wellness-07', title: 'Gratitude Journaling', description: 'Sit together and each write 10 things you\'re grateful for about each other. Then share your lists.', duration: '30 min', category: 'Wellness', emoji: '📓' },
  { id: 'wellness-08', title: 'Visit a Botanical Garden', description: 'Stroll through a botanical garden, enjoy the flowers, and take photos of your favourite plants.', duration: '1 hr', category: 'Wellness', emoji: '🌺' },
  { id: 'wellness-09', title: 'Cook a Healthy Meal Together', description: 'Pick a nutritious recipe, prep ingredients together, and enjoy a wholesome home-cooked dinner.', duration: '1 hr', category: 'Wellness', emoji: '🥗' },
  { id: 'wellness-10', title: 'Take a Nap Together', description: 'Sometimes the best date is doing nothing. Curl up and nap together on a lazy afternoon.', duration: '30 min', category: 'Wellness', emoji: '😴' },
  { id: 'wellness-11', title: 'Hot Springs or Sauna Visit', description: 'Visit a hot spring or sauna facility. Relax, detox, and enjoy the warmth together.', duration: '3 hrs', category: 'Wellness', emoji: '♨️' },
  { id: 'wellness-12', title: 'Stretching Session', description: 'Follow a deep stretch video together. Help each other hold poses and release tension.', duration: '30 min', category: 'Wellness', emoji: '🤸' },
  { id: 'wellness-13', title: 'Nature Sound Bath', description: 'Find a quiet spot outdoors, lie down, close your eyes, and just listen to nature together.', duration: '30 min', category: 'Wellness', emoji: '🌿' },
  { id: 'wellness-14', title: 'Bike Ride Together', description: 'Rent bikes or ride your own through a scenic trail. Stop for a drink or snack along the way.', duration: '1 hr', category: 'Wellness', emoji: '🚴' },
  { id: 'wellness-15', title: 'Morning Routine Together', description: 'Spend a morning intentionally doing your routines side by side — skincare, coffee, stretching.', duration: '1 hr', category: 'Wellness', emoji: '🌤️' },

  // ── Entertainment (15) ──────────────────────────────────────────────────────
  { id: 'entertainment-01', title: 'Movie Marathon', description: 'Pick a trilogy or series and binge-watch with blankets, snacks, and zero interruptions.', duration: '3 hrs', category: 'Entertainment', emoji: '🎬' },
  { id: 'entertainment-02', title: 'Board Game Night', description: 'Pull out board games and play for a few rounds. Try strategy games, word games, or classics.', duration: '1 hr', category: 'Entertainment', emoji: '🎲' },
  { id: 'entertainment-03', title: 'Live Comedy Show', description: 'Catch a stand-up comedy show and laugh together. Check local venues for open mic nights too.', duration: '3 hrs', category: 'Entertainment', emoji: '😂' },
  { id: 'entertainment-04', title: 'Puzzle Night', description: 'Start a 500 or 1000 piece puzzle together. Put on some music and enjoy the slow pace.', duration: '1 hr', category: 'Entertainment', emoji: '🧩' },
  { id: 'entertainment-05', title: 'Video Game Co-Op', description: 'Play a cooperative video game together. Overcooked, It Takes Two, or any game that needs teamwork.', duration: '1 hr', category: 'Entertainment', emoji: '🎮' },
  { id: 'entertainment-06', title: 'Live Music or Concert', description: 'See a live band or concert — big or small. Discover new music together in person.', duration: '3 hrs', category: 'Entertainment', emoji: '🎸' },
  { id: 'entertainment-07', title: 'Watch a Documentary', description: 'Pick a topic you\'re both curious about and watch a documentary. Discuss what you learned after.', duration: '1 hr', category: 'Entertainment', emoji: '📺' },
  { id: 'entertainment-08', title: 'Card Game Tournament', description: 'Learn a new card game or play old favourites. Uno, Rummy, or a two-player strategy card game.', duration: '30 min', category: 'Entertainment', emoji: '🃏' },
  { id: 'entertainment-09', title: 'Trivia Night at a Bar', description: 'Join a pub trivia night as a team of two. Test your combined knowledge and have fun.', duration: '1 hr', category: 'Entertainment', emoji: '🧠' },
  { id: 'entertainment-10', title: 'Binge a New Series', description: 'Start a new TV series together and make it your couple show. No watching ahead without the other.', duration: '3 hrs', category: 'Entertainment', emoji: '📱' },
  { id: 'entertainment-11', title: 'Open Mic Night', description: 'Attend an open mic for poetry, comedy, or music. Or be brave and perform something yourselves.', duration: '1 hr', category: 'Entertainment', emoji: '🎙️' },
  { id: 'entertainment-12', title: 'Drive-In Movie', description: 'Find a drive-in cinema, bring blankets and snacks, and enjoy a nostalgic movie experience.', duration: '3 hrs', category: 'Entertainment', emoji: '🚙' },
  { id: 'entertainment-13', title: 'Would You Rather Night', description: 'Go through a list of "Would You Rather" questions. You\'ll learn surprising things about each other.', duration: '30 min', category: 'Entertainment', emoji: '🤷' },
  { id: 'entertainment-14', title: 'Truth or Dare', description: 'Play truth or dare with a romantic twist. Ask deep questions and give fun dares.', duration: '30 min', category: 'Entertainment', emoji: '🎯' },
  { id: 'entertainment-15', title: 'Murder Mystery Night', description: 'Host a murder mystery game at home or with friends. Dress up in character and solve the crime.', duration: '3 hrs', category: 'Entertainment', emoji: '🕵️' },

  // ── Outdoors (15) ───────────────────────────────────────────────────────────
  { id: 'outdoors-01', title: 'Picnic in the Park', description: 'Pack sandwiches, fruit, and a blanket. Find a shady spot and enjoy a relaxed outdoor meal.', duration: '1 hr', category: 'Outdoors', emoji: '🧺' },
  { id: 'outdoors-02', title: 'Hiking a New Trail', description: 'Find a trail neither of you has hiked. Enjoy the views, take photos, and breathe in fresh air.', duration: '3 hrs', category: 'Outdoors', emoji: '🥾' },
  { id: 'outdoors-03', title: 'Stargazing', description: 'Drive somewhere with little light pollution, bring a blanket, and look up at the stars together.', duration: '1 hr', category: 'Outdoors', emoji: '⭐' },
  { id: 'outdoors-04', title: 'Beach Day', description: 'Head to the beach for swimming, sunbathing, and sandcastle building. Simple and always fun.', duration: '3 hrs', category: 'Outdoors', emoji: '🏖️' },
  { id: 'outdoors-05', title: 'Fly a Kite', description: 'Buy or make a kite and find an open field. It\'s silly, it\'s fun, and it\'s surprisingly romantic.', duration: '1 hr', category: 'Outdoors', emoji: '🪁' },
  { id: 'outdoors-06', title: 'Outdoor Yoga or Stretching', description: 'Bring yoga mats to a park and practice together in the fresh air. End with a meditation.', duration: '30 min', category: 'Outdoors', emoji: '🧘' },
  { id: 'outdoors-07', title: 'Visit a Dog Park', description: 'Even without a dog, watching puppies play is pure joy. If you have one, even better.', duration: '30 min', category: 'Outdoors', emoji: '🐕' },
  { id: 'outdoors-08', title: 'Fishing Trip', description: 'Find a local fishing spot, pack snacks, and enjoy the patience and quiet of fishing together.', duration: '3 hrs', category: 'Outdoors', emoji: '🎣' },
  { id: 'outdoors-09', title: 'Sunrise Breakfast Outdoors', description: 'Wake up early, make coffee and breakfast to-go, and eat while watching the sunrise.', duration: '1 hr', category: 'Outdoors', emoji: '🌄' },
  { id: 'outdoors-10', title: 'Photo Walk', description: 'Walk through your city with phones out, photographing interesting things. Share your best shots after.', duration: '1 hr', category: 'Outdoors', emoji: '📷' },
  { id: 'outdoors-11', title: 'Hammock Hangout', description: 'Set up a hammock in a park or backyard. Lie together, read, or just enjoy the breeze.', duration: '30 min', category: 'Outdoors', emoji: '🌴' },
  { id: 'outdoors-12', title: 'Outdoor Movie Night', description: 'Set up a projector in the backyard, hang a sheet, and watch a movie under the stars.', duration: '3 hrs', category: 'Outdoors', emoji: '🎥' },
  { id: 'outdoors-13', title: 'Garden Together', description: 'Plant flowers, herbs, or vegetables together. Nurture something as a couple and watch it grow.', duration: '1 hr', category: 'Outdoors', emoji: '🌱' },
  { id: 'outdoors-14', title: 'Catch Fireflies', description: 'On a warm evening, go to a field or park and catch fireflies in a jar. Release them after.', duration: '30 min', category: 'Outdoors', emoji: '✨' },
  { id: 'outdoors-15', title: 'Explore a Waterfall', description: 'Find a waterfall hike nearby and make it a mini adventure. The destination is always worth it.', duration: '3 hrs', category: 'Outdoors', emoji: '💧' },

  // ── Cultural (15) ───────────────────────────────────────────────────────────
  { id: 'cultural-01', title: 'Museum Visit', description: 'Pick a museum — art, history, or science — and explore together. Discuss your favourite exhibits.', duration: '3 hrs', category: 'Cultural', emoji: '🏛️' },
  { id: 'cultural-02', title: 'Bookshop Date', description: 'Browse a bookshop together, each pick a book for the other, and read the first chapter aloud.', duration: '1 hr', category: 'Cultural', emoji: '📚' },
  { id: 'cultural-03', title: 'Attend a Cultural Festival', description: 'Find a local festival celebrating a culture, holiday, or tradition. Try the food and enjoy performances.', duration: '3 hrs', category: 'Cultural', emoji: '🎪' },
  { id: 'cultural-04', title: 'Visit an Art Gallery', description: 'Walk through a gallery at your own pace. Share which pieces speak to you and why.', duration: '1 hr', category: 'Cultural', emoji: '🖼️' },
  { id: 'cultural-05', title: 'Learn a Language Together', description: 'Start a language learning app together and practise phrases. Helpful if you\'re planning a trip.', duration: '30 min', category: 'Cultural', emoji: '🗣️' },
  { id: 'cultural-06', title: 'Watch a Foreign Film', description: 'Pick a highly-rated film in a language neither of you speaks. Experience storytelling from another culture.', duration: '1 hr', category: 'Cultural', emoji: '🎬' },
  { id: 'cultural-07', title: 'Attend a Theatre Show', description: 'See a play, musical, or local theatre production. Dress up a little and make an evening of it.', duration: '3 hrs', category: 'Cultural', emoji: '🎭' },
  { id: 'cultural-08', title: 'Poetry Reading Night', description: 'Find poems online, each pick a few favourites, and read them aloud to each other.', duration: '30 min', category: 'Cultural', emoji: '📜' },
  { id: 'cultural-09', title: 'Walking Tour of Your City', description: 'Take a guided or self-guided walking tour of your own city. Discover history you never knew.', duration: '3 hrs', category: 'Cultural', emoji: '🚶' },
  { id: 'cultural-10', title: 'Explore a Historic Neighbourhood', description: 'Visit an older part of town, admire the architecture, read the plaques, and imagine life there years ago.', duration: '1 hr', category: 'Cultural', emoji: '🏘️' },
  { id: 'cultural-11', title: 'Attend a Workshop', description: 'Sign up for a workshop — ceramics, cooking, calligraphy. Learn something new together.', duration: '3 hrs', category: 'Cultural', emoji: '🔧' },
  { id: 'cultural-12', title: 'Visit a Library', description: 'Spend time in a beautiful library. Read together in silence or explore interesting sections.', duration: '1 hr', category: 'Cultural', emoji: '📖' },
  { id: 'cultural-13', title: 'Try a Traditional Tea Ceremony', description: 'Visit a tea house or set up your own ceremony at home. Slow down and savour the ritual together.', duration: '30 min', category: 'Cultural', emoji: '🍵' },
  { id: 'cultural-14', title: 'Listen to a Podcast Together', description: 'Find a fascinating podcast episode and listen together. Discuss your takeaways over coffee.', duration: '30 min', category: 'Cultural', emoji: '🎧' },
  { id: 'cultural-15', title: 'Explore Street Art', description: 'Walk through a neighbourhood known for murals and street art. Take photos and discuss the art.', duration: '1 hr', category: 'Cultural', emoji: '🎨' },

  // ── Romantic (15) ───────────────────────────────────────────────────────────
  { id: 'romantic-01', title: 'Candlelit Dinner at Home', description: 'Cook a special dinner, light candles, put on soft music, and dress up just for each other.', duration: '1 hr', category: 'Romantic', emoji: '🕯️' },
  { id: 'romantic-02', title: 'Recreate Your First Date', description: 'Go back to where it all started. Recreate the food, the place, and the butterflies.', duration: '3 hrs', category: 'Romantic', emoji: '💕' },
  { id: 'romantic-03', title: 'Love Language Night', description: 'Each share your love language and spend the evening intentionally loving each other that way.', duration: '1 hr', category: 'Romantic', emoji: '💝' },
  { id: 'romantic-04', title: 'Dance in the Living Room', description: 'Put on your favourite slow song and dance together in the living room. No skill required.', duration: '30 min', category: 'Romantic', emoji: '💃' },
  { id: 'romantic-05', title: 'Watch the Sunset', description: 'Find a spot with a great view and watch the sun go down. Simple, free, and deeply romantic.', duration: '30 min', category: 'Romantic', emoji: '🌇' },
  { id: 'romantic-06', title: 'Couple Q&A Night', description: 'Find a list of deep couple questions and take turns answering. You\'ll discover new things about each other.', duration: '1 hr', category: 'Romantic', emoji: '💬' },
  { id: 'romantic-07', title: 'Hotel Staycation', description: 'Book a nice hotel in your own city. Order room service, enjoy the pool, and pretend you\'re on holiday.', duration: '3 hrs', category: 'Romantic', emoji: '🏨' },
  { id: 'romantic-08', title: 'Couples Massage', description: 'Book a couples massage at a spa or take turns giving each other massages at home.', duration: '1 hr', category: 'Romantic', emoji: '💆' },
  { id: 'romantic-09', title: 'Star Naming Date', description: 'Name a star after your relationship online, then go outside and try to find it in the sky.', duration: '30 min', category: 'Romantic', emoji: '🌟' },
  { id: 'romantic-10', title: 'Write Your Love Story', description: 'Together, write out the story of how you met, your favourite memories, and your dreams ahead.', duration: '1 hr', category: 'Romantic', emoji: '📖' },
  { id: 'romantic-11', title: 'Picnic Under the Stars', description: 'Set up a blanket and pillows outside at night. Share snacks and talk under the open sky.', duration: '1 hr', category: 'Romantic', emoji: '🌌' },
  { id: 'romantic-12', title: 'Surprise Date Night', description: 'One partner plans the entire evening without telling the other. Full surprise from start to finish.', duration: '3 hrs', category: 'Romantic', emoji: '🎁' },
  { id: 'romantic-13', title: 'Create a Bucket List', description: 'Sit together and write a couple bucket list — travels, experiences, milestones you want to share.', duration: '30 min', category: 'Romantic', emoji: '✅' },
  { id: 'romantic-14', title: 'Slow Morning Together', description: 'No alarms, no plans. Wake up naturally, cuddle, make coffee, and just enjoy the morning.', duration: '1 hr', category: 'Romantic', emoji: '☀️' },
  { id: 'romantic-15', title: 'Anniversary Redo', description: 'Pick your best anniversary and redo the date. Same restaurant, same outfit if you can. Relive the magic.', duration: '3 hrs', category: 'Romantic', emoji: '💍' },

  // ── Budget (15) ─────────────────────────────────────────────────────────────
  { id: 'budget-01', title: 'Free Museum Day', description: 'Many museums have free entry days. Find one and explore without spending a penny.', duration: '1 hr', category: 'Budget', emoji: '🏛️' },
  { id: 'budget-02', title: 'Library Date', description: 'Spend time at the library reading together, exploring books, or attending a free event.', duration: '1 hr', category: 'Budget', emoji: '📚' },
  { id: 'budget-03', title: 'People Watching', description: 'Grab a bench in a busy area, make up stories about passersby, and enjoy each other\'s imagination.', duration: '30 min', category: 'Budget', emoji: '👀' },
  { id: 'budget-04', title: 'Window Shopping', description: 'Stroll through shops and pick out things you\'d buy each other — without actually buying. Dream together.', duration: '1 hr', category: 'Budget', emoji: '🛍️' },
  { id: 'budget-05', title: 'Cloud Watching', description: 'Lie on a blanket in a park and find shapes in the clouds. It\'s free, peaceful, and surprisingly fun.', duration: '30 min', category: 'Budget', emoji: '☁️' },
  { id: 'budget-06', title: 'Cook with What You Have', description: 'Challenge: make a meal using only ingredients already in your kitchen. Get creative and have fun.', duration: '1 hr', category: 'Budget', emoji: '🍳' },
  { id: 'budget-07', title: 'YouTube Workout Together', description: 'Find a fun couples workout on YouTube and do it in your living room. Free and healthy.', duration: '30 min', category: 'Budget', emoji: '🏋️' },
  { id: 'budget-08', title: 'Free Concert or Event', description: 'Check local listings for free concerts, festivals, or community events. Enjoy entertainment without the price tag.', duration: '3 hrs', category: 'Budget', emoji: '🎵' },
  { id: 'budget-09', title: 'Neighbourhood Walk', description: 'Explore a neighbourhood you\'ve never walked through. Notice details, architecture, and hidden gems.', duration: '1 hr', category: 'Budget', emoji: '🚶' },
  { id: 'budget-10', title: 'DIY Movie Night', description: 'Stream a movie at home with homemade popcorn, blankets, and zero cinema prices.', duration: '1 hr', category: 'Budget', emoji: '🍿' },
  { id: 'budget-11', title: 'Free Online Game Night', description: 'Play free browser games or mobile co-op games together. Plenty of options that cost nothing.', duration: '1 hr', category: 'Budget', emoji: '🎮' },
  { id: 'budget-12', title: 'Volunteer Together', description: 'Give back by volunteering at a local shelter, food bank, or community garden. Bonding through giving.', duration: '3 hrs', category: 'Budget', emoji: '🤝' },
  { id: 'budget-13', title: 'Thrift Store Fashion Show', description: 'Hit a thrift store with a small budget. Each pick an outfit for the other and try them on.', duration: '1 hr', category: 'Budget', emoji: '👗' },
  { id: 'budget-14', title: 'Map Roulette', description: 'Spin a map (or use a random location app) and go wherever it lands within your city. Explore the unknown.', duration: '3 hrs', category: 'Budget', emoji: '🗺️' },
  { id: 'budget-15', title: 'Backyard Camping', description: 'Pitch a tent in the backyard, make s\'mores, and sleep under the stars. Free adventure at home.', duration: '3 hrs', category: 'Budget', emoji: '⛺' },

  // ── Seasonal (15) ───────────────────────────────────────────────────────────
  { id: 'seasonal-01', title: 'Cherry Blossom Walk', description: 'In spring, find a spot with blooming trees and take a slow walk surrounded by petals.', duration: '1 hr', category: 'Seasonal', emoji: '🌸' },
  { id: 'seasonal-02', title: 'Build a Snowman', description: 'When it snows, bundle up and build a snowman (or snow couple) in the yard or park.', duration: '30 min', category: 'Seasonal', emoji: '⛄' },
  { id: 'seasonal-03', title: 'Pumpkin Patch Visit', description: 'In autumn, visit a pumpkin patch. Pick pumpkins, take photos, and enjoy the fall vibes.', duration: '1 hr', category: 'Seasonal', emoji: '🎃' },
  { id: 'seasonal-04', title: 'Ice Skating', description: 'Hit the ice rink in winter. Hold hands, wobble together, and warm up with hot chocolate after.', duration: '1 hr', category: 'Seasonal', emoji: '⛸️' },
  { id: 'seasonal-05', title: 'Beach Bonfire', description: 'On a summer evening, build a bonfire on the beach. Roast marshmallows and listen to the waves.', duration: '3 hrs', category: 'Seasonal', emoji: '🔥' },
  { id: 'seasonal-06', title: 'Leaf Peeping Drive', description: 'In fall, drive through scenic routes to see autumn foliage. Stop for photos and apple cider.', duration: '3 hrs', category: 'Seasonal', emoji: '🍂' },
  { id: 'seasonal-07', title: 'Holiday Light Tour', description: 'Drive or walk through neighbourhoods with holiday light displays. Rate the best decorations.', duration: '1 hr', category: 'Seasonal', emoji: '🎄' },
  { id: 'seasonal-08', title: 'Spring Cleaning Together', description: 'Tackle a room or closet together. Declutter, organise, and celebrate with a treat after.', duration: '3 hrs', category: 'Seasonal', emoji: '🧹' },
  { id: 'seasonal-09', title: 'Summer Pool Day', description: 'Spend an afternoon at the pool or water park. Swim, float, and soak up the sun together.', duration: '3 hrs', category: 'Seasonal', emoji: '🏊' },
  { id: 'seasonal-10', title: 'Hot Chocolate Tasting', description: 'In cold weather, visit different cafes and rate their hot chocolate. Crown the best cup.', duration: '1 hr', category: 'Seasonal', emoji: '🍫' },
  { id: 'seasonal-11', title: 'Apple or Berry Picking', description: 'Visit a farm for seasonal fruit picking. Bring your haul home and bake something together.', duration: '3 hrs', category: 'Seasonal', emoji: '🍎' },
  { id: 'seasonal-12', title: 'Rainy Day Blanket Fort', description: 'When it rains, build a blanket fort in the living room. Watch movies and snack inside your creation.', duration: '1 hr', category: 'Seasonal', emoji: '🏰' },
  { id: 'seasonal-13', title: 'Valentine\'s Day DIY', description: 'Skip the restaurant. Instead, make handmade valentines and cook a special dinner at home.', duration: '1 hr', category: 'Seasonal', emoji: '❤️' },
  { id: 'seasonal-14', title: 'New Year\'s Vision Night', description: 'Set goals and intentions for the new year together. Write them down and share your dreams.', duration: '1 hr', category: 'Seasonal', emoji: '🎆' },
  { id: 'seasonal-15', title: 'Wildflower Hunting', description: 'In spring or summer, go on a walk to find and identify wildflowers. Bring a guide or use an app.', duration: '1 hr', category: 'Seasonal', emoji: '🌼' },
];
