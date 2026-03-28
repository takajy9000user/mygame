import Phaser from "phaser";

export class MenuButton extends Phaser.GameObjects.Container {
  constructor(scene, x, y, label, onClick, variant = "primary") {
    super(scene, x, y);

    const fillColor = variant === "primary" ? 0xffd166 : 0xd8e7ff;
    const textColor = variant === "primary" ? "#1e2b48" : "#24416b";

    this.background = scene.add.rectangle(0, 0, 220, 66, fillColor);
    this.background.setStrokeStyle(4, 0x24416b);

    this.label = scene.add.text(0, 0, label, {
      fontFamily: "Arial Black, sans-serif",
      fontSize: "26px",
      color: textColor
    });
    this.label.setOrigin(0.5);

    this.add([this.background, this.label]);
    this.setSize(220, 66);
    this.setInteractive(
      new Phaser.Geom.Rectangle(-110, -33, 220, 66),
      Phaser.Geom.Rectangle.Contains
    );
    this.on("pointerdown", onClick);
    this.on("pointerover", () => {
      this.scene.tweens.add({
        targets: this,
        scaleX: 1.04,
        scaleY: 1.04,
        duration: 120
      });
    });
    this.on("pointerout", () => {
      this.scene.tweens.add({
        targets: this,
        scaleX: 1,
        scaleY: 1,
        duration: 120
      });
    });

    scene.add.existing(this);
  }

  setLabel(text) {
    this.label.setText(text);
  }
}
