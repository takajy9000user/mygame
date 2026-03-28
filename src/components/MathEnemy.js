import Phaser from "phaser";
import { CATEGORY_LABELS, DIFFICULTY_STEPS, LAYOUT } from "../config/constants.js";

const CATEGORY_COLORS = {
  addition: 0xff8c66,
  subtraction: 0x6acb7a,
  multiplication: 0x6ac8ff
};

export class MathEnemy extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.glow = scene.add.circle(0, 0, 52, 0xffffff, 0.12);
    this.body = scene.add.image(0, 0, "enemy-core");
    this.face = scene.add.text(0, -2, "!", {
      fontFamily: "Arial Black, sans-serif",
      fontSize: "30px",
      color: "#ffffff"
    });
    this.face.setOrigin(0.5);

    this.badge = scene.add.text(0, -68, "", {
      fontFamily: "Arial, sans-serif",
      fontSize: "20px",
      color: "#ffffff",
      backgroundColor: "#17365b",
      padding: { left: 12, right: 12, top: 6, bottom: 6 }
    });
    this.badge.setOrigin(0.5);

    this.add([this.glow, this.body, this.face, this.badge]);
    scene.add.existing(this);
  }

  setQuestion(question) {
    this.question = question;
    this.y = LAYOUT.enemyStartY;
    this.body.setTint(CATEGORY_COLORS[question.category]);
    this.glow.setFillStyle(CATEGORY_COLORS[question.category], 0.18);
    this.badge.setText(
      `${CATEGORY_LABELS[question.category]} ・ ${DIFFICULTY_STEPS[question.difficulty]}`
    );
  }

  setProgress(progress) {
    this.y = Phaser.Math.Linear(LAYOUT.enemyStartY, LAYOUT.enemyEndY, progress);
    this.scale = Phaser.Math.Linear(1, 1.08, progress);
  }

  pulseCorrect() {
    this.scene.tweens.add({
      targets: this,
      scaleX: 1.16,
      scaleY: 1.16,
      yoyo: true,
      duration: 140
    });
  }

  flashMistake() {
    this.scene.tweens.add({
      targets: this.body,
      alpha: 0.3,
      yoyo: true,
      repeat: 1,
      duration: 80
    });
  }
}
