export function createReviewQueue() {
  return [];
}

export function enqueueReview(queue, question) {
  queue.push({
    category: question.category,
    difficulty: question.difficulty
  });
}

export function getReviewRequest(queue, roundIndex) {
  if (queue.length === 0) {
    return null;
  }

  if (queue.length >= 2 || roundIndex >= 5 || Math.random() < 0.45) {
    return queue.shift();
  }

  return null;
}
