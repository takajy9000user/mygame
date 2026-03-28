import Phaser from "phaser";

export class FeedbackPanel extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.card = scene.add.rectangle(0, 0, 360, 92, 0x102443, 0.92);
    this.card.setStrokeStyle(4, 0xffd166);

    this.titleText = scene.add.text(0, -18, "", {
      fontFamily: "Arial Black, sans-serif",
      fontSize: "24px",
      color: "#fff2b6"
    });
    this.titleText.setOrigin(0.5);

    this.bodyText = scene.add.text(0, 16, "", {
      fontFamily: "Arial, sans-serif",
      fontSize: "18px",
      color: "#ffffff",
      align: "center",
      wordWrap: { width: 320 }
    });
    this.bodyText.setOrigin(0.5);

    this.add([this.card, this.titleText, this.bodyText]);
    this.setVisible(false);

    scene.add.existing(this);
  }

  showMessage(title, body, borderColor = 0xffd166) {
    this.card.setStrokeStyle(4, borderColor);
    this.titleText.setText(title);
    this.bodyText.setText(body);
    this.setVisible(true);
  }

  hideMessage() {
    this.setVisible(false);
  }
}
