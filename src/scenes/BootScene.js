import Phaser from "phaser";
import { loadPreferences } from "../logic/game/storage.js";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create() {
    this.createTextures();
    const preferences = loadPreferences();
    this.registry.set("soundEnabled", preferences.soundEnabled);
    this.scene.start("TitleScene");
  }

  createTextures() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });

    graphics.fillStyle(0x69d2ff, 1);
    graphics.beginPath();
    graphics.moveTo(30, 4);
    graphics.lineTo(56, 48);
    graphics.lineTo(38, 44);
    graphics.lineTo(30, 60);
    graphics.lineTo(22, 44);
    graphics.lineTo(4, 48);
    graphics.closePath();
    graphics.fillPath();
    graphics.generateTexture("player-ship", 60, 64);
    graphics.clear();

    graphics.fillStyle(0xff8a65, 1);
    graphics.fillCircle(40, 40, 36);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(28, 34, 7);
    graphics.fillCircle(52, 34, 7);
    graphics.fillStyle(0x17365b, 1);
    graphics.fillCircle(28, 34, 3);
    graphics.fillCircle(52, 34, 3);
    graphics.fillRoundedRect(23, 48, 34, 8, 4);
    graphics.generateTexture("enemy-core", 80, 80);
    graphics.destroy();
  }
}
