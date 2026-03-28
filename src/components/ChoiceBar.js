import Phaser from "phaser";
import { GAME_WIDTH, LAYOUT } from "../config/constants.js";

function createChoiceButton(scene, x, y) {
  const container = scene.add.container(x, y);
  const plate = scene.add.rectangle(0, 0, 120, 76, 0xffffff);
  plate.setStrokeStyle(4, 0x18355d);

  const label = scene.add.text(0, -4, "", {
    fontFamily: "Arial Black, sans-serif",
    fontSize: "28px",
    color: "#17365b"
  });
  label.setOrigin(0.5);

  const hint = scene.add.text(0, 24, "", {
    fontFamily: "Arial, sans-serif",
    fontSize: "16px",
    color: "#35506f"
  });
  hint.setOrigin(0.5);

  container.add([plate, label, hint]);
  container.setSize(120, 76);
  container.setInteractive(
    new Phaser.Geom.Rectangle(-60, -38, 120, 76),
    Phaser.Geom.Rectangle.Contains
  );

  return { container, plate, label, hint };
}

export class ChoiceBar extends Phaser.GameObjects.Container {
  constructor(scene, onFireChoice) {
    super(scene, GAME_WIDTH / 2, LAYOUT.choiceBarY);

    this.onFireChoice = onFireChoice;
    this.buttons = [];
    this.selectedIndex = 0;
    const positions = [-LAYOUT.choiceSpacing, 0, LAYOUT.choiceSpacing];

    positions.forEach((offsetX, index) => {
      const button = createChoiceButton(scene, offsetX, 0);
      button.container.on("pointerdown", () => {
        this.fireChoice(index);
      });
      this.buttons.push(button);
      this.add(button.container);
    });

    scene.add.existing(this);
  }

  setChoices(choices) {
    this.choices = choices;
    this.selectedIndex = 0;

    this.buttons.forEach((button, index) => {
      button.label.setText(String(choices[index]));
      button.hint.setText(`${index + 1}ばん`);
    });

    this.refreshSelection();
  }

  fireChoice(index) {
    this.selectedIndex = index;
    this.refreshSelection();
    this.onFireChoice(this.choices[index]);
  }

  fireSelectedChoice() {
    this.onFireChoice(this.choices[this.selectedIndex]);
  }

  selectIndex(index) {
    this.selectedIndex = index;
    this.refreshSelection();
  }

  refreshSelection() {
    this.buttons.forEach((button, index) => {
      const active = index === this.selectedIndex;

      button.plate.setFillStyle(active ? 0xffe17d : 0xf4f8ff, 1);
      button.plate.setStrokeStyle(4, active ? 0xf28f3b : 0x18355d);
      button.container.y = active ? -6 : 0;
    });
  }
}
