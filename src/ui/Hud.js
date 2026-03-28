import Phaser from "phaser";
import { DIFFICULTY_STEPS, GAME_WIDTH, GAME_RULES } from "../config/constants.js";
import { UI_COPY } from "../config/copy.js";

export class Hud extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, 0, 0);

    this.scoreText = scene.add.text(24, 18, `${UI_COPY.scoreLabel}: 0`, {
      fontFamily: "Arial Black, sans-serif",
      fontSize: "24px",
      color: "#fff8d6"
    });

    this.lifeText = scene.add.text(GAME_WIDTH - 24, 18, `${UI_COPY.lifeLabel}: 3`, {
      fontFamily: "Arial Black, sans-serif",
      fontSize: "24px",
      color: "#ffd6de"
    });
    this.lifeText.setOrigin(1, 0);

    this.roundText = scene.add.text(
      24,
      58,
      `${UI_COPY.roundLabel}: 1 / ${GAME_RULES.totalQuestions}`,
      {
        fontFamily: "Arial, sans-serif",
        fontSize: "18px",
        color: "#c8dbff"
      }
    );

    this.comboText = scene.add.text(GAME_WIDTH - 24, 58, `${UI_COPY.comboLabel}: 0`, {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#c8dbff"
    });
    this.comboText.setOrigin(1, 0);

    this.problemCard = scene.add.rectangle(GAME_WIDTH / 2, 126, 388, 116, 0xf9fbff, 0.96);
    this.problemCard.setStrokeStyle(4, 0x2b4d7a);

    this.problemLabel = scene.add.text(GAME_WIDTH / 2, 92, UI_COPY.question, {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#29507d"
    });
    this.problemLabel.setOrigin(0.5);

    this.problemText = scene.add.text(GAME_WIDTH / 2, 130, "", {
      fontFamily: "Arial Black, sans-serif",
      fontSize: "42px",
      color: "#17365b"
    });
    this.problemText.setOrigin(0.5);

    this.problemMeta = scene.add.text(GAME_WIDTH / 2, 164, "", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#35506f"
    });
    this.problemMeta.setOrigin(0.5);

    this.add([
      this.scoreText,
      this.lifeText,
      this.roundText,
      this.comboText,
      this.problemCard,
      this.problemLabel,
      this.problemText,
      this.problemMeta
    ]);

    scene.add.existing(this);
  }

  setProblem(question) {
    this.problemText.setText(question.prompt);
    this.problemMeta.setText(
      `${DIFFICULTY_STEPS[question.difficulty]} ・ ${question.categoryLabel}`
    );
  }

  setStats({ score, lives, combo, roundNumber }) {
    this.scoreText.setText(`${UI_COPY.scoreLabel}: ${score}`);
    this.lifeText.setText(`${UI_COPY.lifeLabel}: ${lives}`);
    this.comboText.setText(`${UI_COPY.comboLabel}: ${combo}`);
    this.roundText.setText(
      `${UI_COPY.roundLabel}: ${roundNumber} / ${GAME_RULES.totalQuestions}`
    );
  }
}
