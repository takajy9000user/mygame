import Phaser from "phaser";

export class NumberBullet extends Phaser.GameObjects.Container {
  constructor(scene, x, y, answer) {
    super(scene, x, y);

    this.answer = answer;
    this.speed = 0;

    this.shell = scene.add.circle(0, 0, 24, 0xfff3b0);
    this.outline = scene.add.circle(0, 0, 24);
    this.outline.setStrokeStyle(4, 0xf28f3b);
    this.label = scene.add.text(0, 0, String(answer), {
      fontFamily: "Arial Black, sans-serif",
      fontSize: "22px",
      color: "#1e1e1e"
    });
    this.label.setOrigin(0.5);

    this.add([this.shell, this.outline, this.label]);
    scene.add.existing(this);
  }

  launch(speed) {
    this.speed = speed;
  }

  update(delta) {
    this.y -= this.speed * (delta / 1000);
  }
}
