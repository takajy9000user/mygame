import Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../config/constants.js";
import { UI_COPY } from "../config/copy.js";
import { MenuButton } from "../ui/MenuButton.js";

export class ResultScene extends Phaser.Scene {
  constructor() {
    super("ResultScene");
  }

  create(data) {
    const { summary, cleared } = data;

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x0b1530);
    this.add.circle(120, 140, 90, 0x6ac8ff, 0.18);
    this.add.circle(386, 660, 140, 0xffd166, 0.16);

    this.add.text(GAME_WIDTH / 2, 96, cleared ? UI_COPY.stageClear : UI_COPY.gameOver, {
      fontFamily: "Arial Black, sans-serif",
      fontSize: "42px",
      color: cleared ? "#fff2b6" : "#ffd6de"
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 148, UI_COPY.summaryTitle, {
      fontFamily: "Arial, sans-serif",
      fontSize: "24px",
      color: "#d6e6ff"
    }).setOrigin(0.5);

    const card = this.add.rectangle(GAME_WIDTH / 2, 390, 390, 370, 0xf8fbff, 0.96);
    card.setStrokeStyle(4, 0x24416b);

    const lines = [
      `${UI_COPY.scoreLabel}: ${summary.score}`,
      `${UI_COPY.correctLabel}: ${summary.correctCount}`,
      `${UI_COPY.missLabel}: ${summary.missCount}`,
      `${UI_COPY.accuracyLabel}: ${summary.accuracy}%`,
      `${UI_COPY.weakPointLabel}: ${summary.weakCategory ?? UI_COPY.weakPointNone}`
    ];

    this.add.text(72, 250, lines.join("\n"), {
      fontFamily: "Arial Black, sans-serif",
      fontSize: "30px",
      color: "#17365b",
      lineSpacing: 20,
      wordWrap: { width: 330 }
    });

    this.add.text(GAME_WIDTH / 2, 528, UI_COPY.retryHint, {
      fontFamily: "Arial, sans-serif",
      fontSize: "20px",
      color: "#35506f",
      align: "center",
      wordWrap: { width: 320 }
    }).setOrigin(0.5);

    new MenuButton(this, GAME_WIDTH / 2, 652, UI_COPY.playAgain, () => {
      this.scene.start("GameScene");
    });

    new MenuButton(this, GAME_WIDTH / 2, 732, UI_COPY.backToTitle, () => {
      this.scene.start("TitleScene");
    }, "secondary");
  }
}
