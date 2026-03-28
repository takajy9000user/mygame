import { CATEGORY_LABELS } from "../../config/constants.js";

export function createSessionStats(totalQuestions) {
  return {
    totalQuestions,
    correctCount: 0,
    missCount: 0,
    answeredCount: 0,
    score: 0,
    combo: 0,
    maxCombo: 0,
    mistakesByCategory: {
      addition: 0,
      subtraction: 0,
      multiplication: 0
    }
  };
}

export function recordCorrect(stats, question, points) {
  stats.correctCount += 1;
  stats.answeredCount += 1;
  stats.combo += 1;
  stats.maxCombo = Math.max(stats.maxCombo, stats.combo);
  stats.score += points;

  return stats;
}

export function recordMiss(stats, question) {
  stats.missCount += 1;
  stats.answeredCount += 1;
  stats.combo = 0;
  stats.mistakesByCategory[question.category] += 1;

  return stats;
}

export function buildSessionSummary(stats) {
  const accuracy =
    stats.answeredCount === 0
      ? 0
      : Math.round((stats.correctCount / stats.answeredCount) * 100);

  const sortedWeaknesses = Object.entries(stats.mistakesByCategory).sort(
    (left, right) => right[1] - left[1]
  );
  const [weakCategoryKey, weakCategoryCount] = sortedWeaknesses[0];

  return {
    score: stats.score,
    correctCount: stats.correctCount,
    missCount: stats.missCount,
    accuracy,
    maxCombo: stats.maxCombo,
    weakCategory:
      weakCategoryCount > 0 ? CATEGORY_LABELS[weakCategoryKey] : null
  };
}
