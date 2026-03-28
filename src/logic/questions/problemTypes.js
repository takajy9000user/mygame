export const QUESTION_TYPES = ["addition", "subtraction", "multiplication"];

export function pickQuestionType(roundIndex) {
  const scriptedTypes = [
    "addition",
    "subtraction",
    "addition",
    "multiplication",
    "subtraction",
    "addition",
    "multiplication",
    "subtraction",
    "addition",
    "multiplication"
  ];

  return scriptedTypes[roundIndex % scriptedTypes.length];
}

export function pickDifficulty(roundIndex) {
  return roundIndex < 4 ? "beginner" : "medium";
}
