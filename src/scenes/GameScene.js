import Phaser from "phaser";
import { ChoiceBar } from "../components/ChoiceBar.js";
import { MathEnemy } from "../components/MathEnemy.js";
import { NumberBullet } from "../components/NumberBullet.js";
import { PlayerShip } from "../components/PlayerShip.js";
import {
  CATEGORY_LABELS,
  GAME_HEIGHT,
  GAME_RULES,
  GAME_WIDTH,
  LAYOUT
} from "../config/constants.js";
import { UI_COPY } from "../config/copy.js";
import { createReviewQueue, enqueueReview, getReviewRequest } from "../logic/game/reviewQueue.js";
import {
  buildSessionSummary,
  createSessionStats,
  recordCorrect,
  recordMiss
} from "../logic/game/sessionStats.js";
import { saveLearningHistory } from "../logic/game/storage.js";
import { createQuestion } from "../logic/questions/questionGenerator.js";
import { pickDifficulty, pickQuestionType } from "../logic/questions/problemTypes.js";
import { FeedbackPanel } from "../ui/FeedbackPanel.js";
import { Hud } from "../ui/Hud.js";

export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    this.drawBackground();

    this.stats = createSessionStats(GAME_RULES.totalQuestions);
    this.reviewQueue = createReviewQueue();
    this.remainingLives = GAME_RULES.maxLives;
    this.roundIndex = 0;
    this.dragTargetX = null;
    this.bullets = [];
    this.isResolvingQuestion = false;

    this.hud = new Hud(this);
    this.feedbackPanel = new FeedbackPanel(this, GAME_WIDTH / 2, 258);
    this.player = new PlayerShip(this, GAME_WIDTH / 2, LAYOUT.playerY);
    this.enemy = new MathEnemy(this, GAME_WIDTH / 2, LAYOUT.enemyStartY);
    this.choiceBar = new ChoiceBar(this, (answer) => this.fireAnswer(answer));

    this.cursors = this.input.keyboard.createCursorKeys();
    this.numberKeys = this.input.keyboard.addKeys("ONE,TWO,THREE");
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.input.on("pointerdown", (pointer) => {
      if (pointer.y < GAME_HEIGHT - 150) {
        this.dragTargetX = pointer.x;
      }
    });
    this.input.on("pointermove", (pointer) => {
      if (pointer.isDown && pointer.y < GAME_HEIGHT - 150) {
        this.dragTargetX = pointer.x;
      }
    });
    this.input.on("pointerup", () => {
      this.dragTargetX = null;
    });

    this.startNextQuestion();
  }

  update(time, delta) {
    this.updateBullets(delta);

    if (this.isResolvingQuestion) {
      return;
    }

    this.updatePlayer(delta);
    this.updateEnemy(time);
    this.checkKeyboardFire();
    this.checkBulletHit();
  }

  drawBackground() {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x0b1530);

    for (let index = 0; index < 36; index += 1) {
      const x = Phaser.Math.Between(10, GAME_WIDTH - 10);
      const y = Phaser.Math.Between(10, GAME_HEIGHT - 10);
      const size = Phaser.Math.Between(2, 4);
      const alpha = Phaser.Math.FloatBetween(0.22, 0.66);
      this.add.circle(x, y, size, 0xffffff, alpha);
    }

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 158, GAME_WIDTH, 180, 0x091226, 0.45);
  }

  startNextQuestion() {
    if (this.roundIndex >= GAME_RULES.totalQuestions || this.remainingLives <= 0) {
      this.finishStage();
      return;
    }

    const reviewRequest = getReviewRequest(this.reviewQueue, this.roundIndex);
    const category = reviewRequest?.category ?? pickQuestionType(this.roundIndex);
    const difficulty = reviewRequest?.difficulty ?? pickDifficulty(this.roundIndex);

    this.currentQuestion = createQuestion({
      category,
      difficulty,
      roundIndex: this.roundIndex
    });
    this.currentQuestion.categoryLabel = CATEGORY_LABELS[this.currentQuestion.category];

    this.questionStartedAt = this.time.now;
    this.feedbackPanel.hideMessage();
    this.enemy.setQuestion(this.currentQuestion);
    this.choiceBar.setChoices(this.currentQuestion.choices);
    this.hud.setProblem(this.currentQuestion);
    this.hud.setStats({
      score: this.stats.score,
      lives: this.remainingLives,
      combo: this.stats.combo,
      roundNumber: this.roundIndex + 1
    });
  }

  updatePlayer(delta) {
    const direction =
      (this.cursors.right.isDown || this.keyD.isDown ? 1 : 0) -
      (this.cursors.left.isDown || this.keyA.isDown ? 1 : 0);

    this.player.update(delta, direction, this.dragTargetX);
  }

  updateEnemy(time) {
    const elapsed = time - this.questionStartedAt;
    const progress = Phaser.Math.Clamp(elapsed / GAME_RULES.timeLimitMs, 0, 1);
    this.enemy.setProgress(progress);

    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        this.enemy.getBounds(),
        this.player.getBounds()
      )
    ) {
      this.resolveMiss("contact");
      return;
    }

    if (progress >= 1) {
      this.resolveMiss("timeout");
    }
  }

  updateBullets(delta) {
    this.bullets = this.bullets.filter((bullet) => {
      bullet.update(delta);

      if (bullet.y < -60) {
        bullet.destroy();
        return false;
      }

      return true;
    });
  }

  checkKeyboardFire() {
    if (Phaser.Input.Keyboard.JustDown(this.numberKeys.ONE)) {
      this.choiceBar.fireChoice(0);
    }

    if (Phaser.Input.Keyboard.JustDown(this.numberKeys.TWO)) {
      this.choiceBar.fireChoice(1);
    }

    if (Phaser.Input.Keyboard.JustDown(this.numberKeys.THREE)) {
      this.choiceBar.fireChoice(2);
    }

    if (Phaser.Input.Keyboard.JustDown(this.fireKey)) {
      this.choiceBar.fireSelectedChoice();
    }
  }

  fireAnswer(answer) {
    if (this.isResolvingQuestion) {
      return;
    }

    const bullet = new NumberBullet(this, this.player.x, this.player.y - 44, answer);
    bullet.launch(GAME_RULES.bulletSpeed);
    this.bullets.push(bullet);
  }

  checkBulletHit() {
    const enemyBounds = this.enemy.getBounds();

    for (const bullet of this.bullets) {
      if (Phaser.Geom.Intersects.RectangleToRectangle(enemyBounds, bullet.getBounds())) {
        this.handleShotAnswer(bullet.answer);
        bullet.destroy();
        this.bullets = this.bullets.filter((current) => current !== bullet);
        return;
      }
    }
  }

  handleShotAnswer(answer) {
    if (answer === this.currentQuestion.correctAnswer) {
      const points = GAME_RULES.baseScore + this.stats.combo * GAME_RULES.comboBonus;
      recordCorrect(this.stats, this.currentQuestion, points);
      this.enemy.pulseCorrect();
      this.feedbackPanel.showMessage(
        UI_COPY.correctMessage,
        `${this.currentQuestion.prompt} の こたえは ${this.currentQuestion.correctAnswer}。`,
        0x7be495
      );
      this.roundIndex += 1;
      this.hud.setStats({
        score: this.stats.score,
        lives: this.remainingLives,
        combo: this.stats.combo,
        roundNumber: Math.min(this.roundIndex + 1, GAME_RULES.totalQuestions)
      });
      this.delayNextQuestion();
      return;
    }

    this.resolveMiss("wrong");
  }

  resolveMiss(reason) {
    if (this.isResolvingQuestion) {
      return;
    }

    this.remainingLives -= 1;
    enqueueReview(this.reviewQueue, this.currentQuestion);
    recordMiss(this.stats, this.currentQuestion);
    this.enemy.flashMistake();

    const title =
      reason === "wrong"
        ? UI_COPY.wrongMessage
        : reason === "contact"
          ? UI_COPY.contactMessage
          : UI_COPY.timeoutMessage;
    this.feedbackPanel.showMessage(title, this.currentQuestion.explanation, 0xff8fab);

    this.roundIndex += 1;
    this.hud.setStats({
      score: this.stats.score,
      lives: this.remainingLives,
      combo: this.stats.combo,
      roundNumber: Math.min(this.roundIndex + 1, GAME_RULES.totalQuestions)
    });

    this.delayNextQuestion();
  }

  delayNextQuestion() {
    this.isResolvingQuestion = true;

    this.time.delayedCall(GAME_RULES.explanationDuration, () => {
      this.isResolvingQuestion = false;
      this.startNextQuestion();
    });
  }

  finishStage() {
    const summary = buildSessionSummary(this.stats);
    saveLearningHistory(summary);
    this.scene.start("ResultScene", {
      summary,
      cleared: this.remainingLives > 0 && this.roundIndex >= GAME_RULES.totalQuestions
    });
  }
}
