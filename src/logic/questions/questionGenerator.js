import { generateChoices } from "./choiceGenerator.js";

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createAdditionQuestion(difficulty) {
  const left = difficulty === "beginner" ? randomInt(4, 39) : randomInt(18, 68);
  const right = difficulty === "beginner" ? randomInt(3, 29) : randomInt(14, 55);
  const correctAnswer = left + right;

  return {
    prompt: `${left} + ${right} = ?`,
    correctAnswer,
    explanation: `${left} に ${right} を たすと ${correctAnswer}。10 のまとまりを つくると わかりやすいよ。`
  };
}

function createSubtractionQuestion(difficulty) {
  const answer = difficulty === "beginner" ? randomInt(5, 42) : randomInt(16, 58);
  const right = difficulty === "beginner" ? randomInt(3, 24) : randomInt(12, 47);
  const left = answer + right;

  return {
    prompt: `${left} - ${right} = ?`,
    correctAnswer: answer,
    explanation: `${left} から ${right} を ひくと ${answer}。ひく数だけ もとにもどして たしかめよう。`
  };
}

function createMultiplicationQuestion(difficulty) {
  const left = difficulty === "beginner" ? randomInt(2, 9) : randomInt(11, 19);
  const right = difficulty === "beginner" ? randomInt(2, 9) : randomInt(11, 19);
  const correctAnswer = left * right;

  return {
    prompt: `${left} × ${right} = ?`,
    correctAnswer,
    explanation: `${left} が ${right} こ あると ${correctAnswer}。かけ算は たし算の くりかえしだよ。`
  };
}

const QUESTION_BUILDERS = {
  addition: createAdditionQuestion,
  subtraction: createSubtractionQuestion,
  multiplication: createMultiplicationQuestion
};

export function createQuestion({ category, difficulty, roundIndex }) {
  const builder = QUESTION_BUILDERS[category];
  const baseQuestion = builder(difficulty);

  return {
    id: `${category}-${difficulty}-${roundIndex}-${Date.now()}-${Math.random()
      .toString(16)
      .slice(2, 6)}`,
    category,
    difficulty,
    roundIndex,
    ...baseQuestion,
    choices: generateChoices(baseQuestion.correctAnswer, category, difficulty)
  };
}
