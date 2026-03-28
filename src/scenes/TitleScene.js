import Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../config/constants.js";
import { UI_COPY } from "../config/copy.js";
import { saveSoundEnabled } from "../logic/game/storage.js";
import { MenuButton } from "../ui/MenuButton.js";

export class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  create() {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x0b1530);
    this.add.circle(110, 120, 90, 0x1c6dd0, 0.2);
    this.add.circle(400, 230, 120, 0xffd166, 0.16);
    this.add.circle(370, 720, 140, 0x4ecdc4, 0.18);

    this.add.text(GAME_WIDTH / 2, 110, UI_COPY.title, {
      fontFamily: "Arial Black, sans-serif",
      fontSize: "44px",
      color: "#fff4bf",
      align: "center"
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 160, UI_COPY.subtitle, {
      fontFamily: "Arial, sans-serif",
      fontSize: "22px",
      color: "#d5e5ff",
      align: "center"
    }).setOrigin(0.5);

    const card = this.add.rectangle(GAME_WIDTH / 2, 360, 390, 240, 0xf7fbff, 0.95);
    card.setStrokeStyle(4, 0x24416b);

    this.add.text(60, 262, UI_COPY.howToTitle, {
      fontFamily: "Arial Black, sans-serif",
      fontSize: "28px",
      color: "#24416b"
    });

    this.add.text(60, 312, UI_COPY.howToLines.join("\n"), {
      fontFamily: "Arial, sans-serif",
      fontSize: "22px",
      color: "#35506f",
      lineSpacing: 12
    });

    const isTouch = this.input.manager.touch?.enabled ?? false;
    this.add.text(GAME_WIDTH / 2, 470, isTouch ? UI_COPY.controlsMobile : UI_COPY.controlsDesktop, {
      fontFamily: "Arial, sans-serif",
      fontSize: "20px",
      color: "#24416b",
      align: "center"
    }).setOrigin(0.5);

    new MenuButton(this, GAME_WIDTH / 2, 578, UI_COPY.start, () => {
      this.scene.start("GameScene");
    });

    this.soundButton = new MenuButton(
      this,
      GAME_WIDTH / 2,
      666,
      this.registry.get("soundEnabled") ? UI_COPY.soundOn : UI_COPY.soundOff,
      () => this.toggleSound(),
      "secondary"
    );

    this.add.text(GAME_WIDTH / 2, 742, "※ おとの きりかえは いまは ダミーです", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#c8dbff"
    }).setOrigin(0.5);
  }

  toggleSound() {
    const nextValue = !this.registry.get("soundEnabled");
    this.registry.set("soundEnabled", nextValue);
    saveSoundEnabled(nextValue);
    this.soundButton.setLabel(nextValue ? UI_COPY.soundOn : UI_COPY.soundOff);
  }
}
