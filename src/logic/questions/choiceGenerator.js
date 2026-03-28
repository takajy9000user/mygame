function unique(values) {
  return [...new Set(values)];
}

function clampChoice(value) {
  return Math.max(0, value);
}

export function generateChoices(correctAnswer, category, difficulty) {
  const variance = difficulty === "beginner" ? 3 : 8;
  const categoryBias =
    category === "multiplication"
      ? [variance, variance + 4, -variance]
      : [variance, -variance, variance + 2];

  const candidates = unique(
    categoryBias.map((offset) => clampChoice(correctAnswer + offset))
  ).filter((value) => value !== correctAnswer);

  while (candidates.length < 2) {
    const extraOffset = Math.floor(Math.random() * (variance + 6)) + 1;
    const extraChoice =
      Math.random() > 0.5
        ? correctAnswer + extraOffset
        : clampChoice(correctAnswer - extraOffset);

    if (extraChoice !== correctAnswer && !candidates.includes(extraChoice)) {
      candidates.push(extraChoice);
    }
  }

  const answers = [correctAnswer, candidates[0], candidates[1]];

  for (let index = answers.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [answers[index], answers[swapIndex]] = [answers[swapIndex], answers[index]];
  }

  return answers;
}
