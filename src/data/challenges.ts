export type ChallengeLibraryCategory =
  | "start"
  | "spicy"
  | "hot"
  | "extreme"
  | "date_night"
  | "communication";

export type ChallengeLibraryItem = {
  id: string;
  title: string;
  description: string;
  category: ChallengeLibraryCategory;
  difficulty: 1 | 2 | 3 | 4 | 5;
  duration: "5 min" | "10 min" | "15 min" | "30 min" | "1 hour" | "evening";
  points: number;
};

export const CHALLENGES: ChallengeLibraryItem[] = [
  {
    id: "challenge-001",
    title: "Slow Dance",
    description:
      "Put on a song you both love and slow dance for the full duration. No phones, just presence.",
    category: "start",
    difficulty: 1,
    duration: "5 min",
    points: 10
  },
  {
    id: "challenge-002",
    title: "Two Truths, One Dream",
    description:
      "Share two true things you adore about your relationship and one dream you want to create together.",
    category: "start",
    difficulty: 1,
    duration: "10 min",
    points: 10
  },
  {
    id: "challenge-003",
    title: "Favorite Memory Replay",
    description:
      "Take turns retelling a favorite shared memory in as much emotional detail as you can remember.",
    category: "start",
    difficulty: 2,
    duration: "10 min",
    points: 20
  },
  {
    id: "challenge-004",
    title: "Compliment Chain",
    description:
      "Offer alternating compliments until each of you has received five that feel specific and genuine.",
    category: "start",
    difficulty: 1,
    duration: "5 min",
    points: 10
  },
  {
    id: "challenge-005",
    title: "Mini Ritual Design",
    description:
      "Create one tiny nightly ritual you can realistically keep for the next seven days.",
    category: "start",
    difficulty: 2,
    duration: "15 min",
    points: 20
  },
  {
    id: "challenge-006",
    title: "Morning-after Note",
    description:
      "Write each other a short handwritten note about what you appreciate most right now and swap them.",
    category: "start",
    difficulty: 2,
    duration: "15 min",
    points: 20
  },
  {
    id: "challenge-007",
    title: "Five Minute Tease",
    description:
      "Spend five minutes flirting with words only. No touching until the timer ends.",
    category: "spicy",
    difficulty: 2,
    duration: "5 min",
    points: 20
  },
  {
    id: "challenge-008",
    title: "Secret Dress Code",
    description:
      "Each of you picks one detail for the other to wear tonight and reveals the reason afterward.",
    category: "spicy",
    difficulty: 2,
    duration: "10 min",
    points: 20
  },
  {
    id: "challenge-009",
    title: "Mirror Compliments",
    description:
      "Stand in front of a mirror together and say three things you find irresistible about each other.",
    category: "spicy",
    difficulty: 3,
    duration: "10 min",
    points: 30
  },
  {
    id: "challenge-010",
    title: "Hands-Only Build Up",
    description:
      "Sit close and explore touch slowly with your hands only, staying playful and deliberate.",
    category: "spicy",
    difficulty: 3,
    duration: "15 min",
    points: 30
  },
  {
    id: "challenge-011",
    title: "Voice Note Seduction",
    description:
      "Record a private voice note telling your partner exactly what mood you want to create later.",
    category: "spicy",
    difficulty: 3,
    duration: "10 min",
    points: 30
  },
  {
    id: "challenge-012",
    title: "No-Kiss Countdown",
    description:
      "Get as close as you want for ten full minutes, but you may not kiss until the final second.",
    category: "spicy",
    difficulty: 4,
    duration: "10 min",
    points: 40
  },
  {
    id: "challenge-013",
    title: "Lights Low, Focus High",
    description:
      "Dim the room and spend the session focused only on touch, breath, and reading each other's cues.",
    category: "hot",
    difficulty: 3,
    duration: "15 min",
    points: 30
  },
  {
    id: "challenge-014",
    title: "One Desire Each",
    description:
      "Each person names one desire for tonight and the other commits to exploring it with care.",
    category: "hot",
    difficulty: 3,
    duration: "15 min",
    points: 30
  },
  {
    id: "challenge-015",
    title: "Blindfold Trust",
    description:
      "With consent and a blindfold, one partner leads a slow sensory experience while checking in throughout.",
    category: "hot",
    difficulty: 4,
    duration: "30 min",
    points: 40
  },
  {
    id: "challenge-016",
    title: "Playlist Heat",
    description:
      "Build a short playlist together and let each song guide the pace, energy, and mood of the room.",
    category: "hot",
    difficulty: 3,
    duration: "30 min",
    points: 30
  },
  {
    id: "challenge-017",
    title: "Silence and Signals",
    description:
      "For the full challenge, avoid talking and communicate only through touch, eye contact, and body language.",
    category: "hot",
    difficulty: 4,
    duration: "15 min",
    points: 40
  },
  {
    id: "challenge-018",
    title: "Stay in the Moment",
    description:
      "Choose one sensation to focus on deeply and guide each other back whenever your attention drifts.",
    category: "hot",
    difficulty: 5,
    duration: "30 min",
    points: 50
  },
  {
    id: "challenge-019",
    title: "Fantasy Blueprint",
    description:
      "Describe a fantasy scenario in detail, then identify what parts feel exciting, safe, and worth trying.",
    category: "extreme",
    difficulty: 4,
    duration: "30 min",
    points: 40
  },
  {
    id: "challenge-020",
    title: "Yes, No, Maybe Night",
    description:
      "Go through a shared yes-no-maybe list and talk honestly about curiosity, limits, and boundaries.",
    category: "extreme",
    difficulty: 4,
    duration: "1 hour",
    points: 40
  },
  {
    id: "challenge-021",
    title: "Roleplay Warmup",
    description:
      "Pick a playful scenario, set clear boundaries, and commit to staying in character for one scene.",
    category: "extreme",
    difficulty: 5,
    duration: "30 min",
    points: 50
  },
  {
    id: "challenge-022",
    title: "Power Exchange Conversation",
    description:
      "Talk through what control, surrender, and trust mean to each of you before trying anything physical.",
    category: "extreme",
    difficulty: 5,
    duration: "30 min",
    points: 50
  },
  {
    id: "challenge-023",
    title: "New Rule, New Thrill",
    description:
      "Invent one temporary rule for the evening that adds tension, anticipation, or playful restraint.",
    category: "extreme",
    difficulty: 4,
    duration: "evening",
    points: 40
  },
  {
    id: "challenge-024",
    title: "Aftercare Upgrade",
    description:
      "Plan a full aftercare routine together with words, touch, snacks, water, and emotional check-in.",
    category: "extreme",
    difficulty: 3,
    duration: "15 min",
    points: 30
  },
  {
    id: "challenge-025",
    title: "Candlelit Home Bistro",
    description:
      "Transform home into a date spot with candles, a simple menu, and one course served intentionally.",
    category: "date_night",
    difficulty: 2,
    duration: "1 hour",
    points: 20
  },
  {
    id: "challenge-026",
    title: "Phone-Free City Walk",
    description:
      "Take an evening walk without phones and let the route be guided by curiosity instead of a destination.",
    category: "date_night",
    difficulty: 1,
    duration: "30 min",
    points: 10
  },
  {
    id: "challenge-027",
    title: "Memory Lane Dinner",
    description:
      "Recreate part of an early date night and talk about how your connection has changed since then.",
    category: "date_night",
    difficulty: 2,
    duration: "evening",
    points: 20
  },
  {
    id: "challenge-028",
    title: "Surprise Each Other",
    description:
      "Each partner prepares one tiny surprise for the evening without revealing it in advance.",
    category: "date_night",
    difficulty: 3,
    duration: "evening",
    points: 30
  },
  {
    id: "challenge-029",
    title: "Stay-In Spa",
    description:
      "Set up a warm, relaxing spa night at home with music, oils, towels, and no rushing.",
    category: "date_night",
    difficulty: 3,
    duration: "1 hour",
    points: 30
  },
  {
    id: "challenge-030",
    title: "Dress Up for Each Other",
    description:
      "Even if you stay home, get fully ready for one another as if it were a special reservation night.",
    category: "date_night",
    difficulty: 2,
    duration: "30 min",
    points: 20
  },
  {
    id: "challenge-031",
    title: "What I Need More Of",
    description:
      "Take turns finishing the sentence: I feel most loved when you... and listen without defending.",
    category: "communication",
    difficulty: 2,
    duration: "10 min",
    points: 20
  },
  {
    id: "challenge-032",
    title: "Future Us",
    description:
      "Describe your ideal relationship one year from now in specific emotional and practical detail.",
    category: "communication",
    difficulty: 3,
    duration: "15 min",
    points: 30
  },
  {
    id: "challenge-033",
    title: "Repair Conversation",
    description:
      "Choose one small tension you've avoided and talk it through gently using curiosity over blame.",
    category: "communication",
    difficulty: 4,
    duration: "30 min",
    points: 40
  },
  {
    id: "challenge-034",
    title: "Ask Better Questions",
    description:
      "Each partner asks three questions that go beyond logistics and into feelings, fears, or desires.",
    category: "communication",
    difficulty: 2,
    duration: "15 min",
    points: 20
  },
  {
    id: "challenge-035",
    title: "Boundary Check-In",
    description:
      "Review one emotional boundary, one physical boundary, and one way each of you likes to be reassured.",
    category: "communication",
    difficulty: 4,
    duration: "30 min",
    points: 40
  },
  {
    id: "challenge-036",
    title: "Gratitude and Growth",
    description:
      "Share one thing you're grateful for and one area where you want to grow together next.",
    category: "communication",
    difficulty: 3,
    duration: "10 min",
    points: 30
  }
];
