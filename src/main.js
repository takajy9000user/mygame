import Phaser from "phaser";
import "./styles/global.css";
import { GAME_HEIGHT, GAME_WIDTH } from "./config/constants.js";
import { BootScene } from "./scenes/BootScene.js";
import { GameScene } from "./scenes/GameScene.js";
import { ResultScene } from "./scenes/ResultScene.js";
import { TitleScene } from "./scenes/TitleScene.js";

const config = {
  type: Phaser.AUTO,
  parent: "app",
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: "#0b1530",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, TitleScene, GameScene, ResultScene]
};

new Phaser.Game(config);
