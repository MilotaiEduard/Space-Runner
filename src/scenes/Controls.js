import Phaser from "phaser";

export class Controls extends Phaser.Scene {
  constructor() {
    super("Controls");
  }

  preload() {
    this.load.image("controlsBackground", "/assets/controls-background.png");
  }

  create() {
    const background = this.add.image(640, 360, "controlsBackground");

    background.setDisplaySize(1280, 720);

    // Butonul Back.
    const backButton = this.createBackButton(640, 665, "BACK");

    backButton.on("pointerdown", () => {
      this.scene.start("Menu");
    });
  }

  createBackButton(x, y, text) {
    const button = this.add.container(x, y);

    const background = this.add.rectangle(0, 0, 220, 60, 0x123b59);

    background.setStrokeStyle(2, 0x52d4ff);

    const buttonText = this.add
      .text(0, 0, text, {
        fontFamily: "Arial",
        fontSize: "25px",
        fontStyle: "bold",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    button.add([background, buttonText]);

    button.setSize(220, 60);

    button.setInteractive({
      useHandCursor: true,
    });

    button.on("pointerover", () => {
      background.setFillStyle(0x1c6d99);

      this.tweens.add({
        targets: button,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 120,
      });
    });

    button.on("pointerout", () => {
      background.setFillStyle(0x123b59);

      this.tweens.add({
        targets: button,
        scaleX: 1,
        scaleY: 1,
        duration: 120,
      });
    });

    return button;
  }
}
