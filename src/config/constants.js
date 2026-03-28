export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 800;

export const LAYOUT = {
  safePadding: 24,
  playerY: 690,
  enemyStartY: 180,
  enemyEndY: 600,
  choiceBarY: 735,
  choiceSpacing: 146
};

export const GAME_RULES = {
  totalQuestions: 10,
  maxLives: 3,
  baseScore: 100,
  comboBonus: 15,
  timeLimitMs: 8000,
  bulletSpeed: 680,
  playerSpeed: 360,
  explanationDuration: 1800
};

export const DIFFICULTY_STEPS = {
  beginner: "初級",
  medium: "中級"
};

export const CATEGORY_LABELS = {
  addition: "たし算",
  subtraction: "ひき算",
  multiplication: "かけ算"
};

export const STORAGE_KEYS = {
  soundEnabled: "math-shooter-sound-enabled",
  learningHistory: "math-shooter-learning-history"
};
