import Phaser from "phaser";
import { GAME_RULES, GAME_WIDTH, LAYOUT } from "../config/constants.js";

export class PlayerShip extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.ship = scene.add.image(0, 0, "player-ship");
    this.shadow = scene.add.ellipse(0, 24, 56, 16, 0x091226, 0.28);
    this.add([this.shadow, this.ship]);

    this.targetX = x;

    scene.add.existing(this);
  }

  update(delta, inputDirection, dragX) {
    if (typeof dragX === "number") {
      this.targetX = dragX;
    } else if (inputDirection !== 0) {
      this.targetX += inputDirection * GAME_RULES.playerSpeed * (delta / 1000);
    }

    this.targetX = Phaser.Math.Clamp(
      this.targetX,
      LAYOUT.safePadding + 28,
      GAME_WIDTH - LAYOUT.safePadding - 28
    );

    this.x = Phaser.Math.Linear(this.x, this.targetX, 0.25);
  }
}
