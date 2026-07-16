import Phaser from "phaser";

export class NameEntry extends Phaser.Scene {
  constructor() {
    super("NameEntry");

    this.playerName = "";
    this.maxNameLength = 12;
  }

  preload() {
    this.load.image("nameEntryBackground", "assets/space.png");
  }

  create() {
    this.playerName = "";

    const background = this.add.image(640, 360, "nameEntryBackground");

    background.setDisplaySize(1280, 720);

    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.55);

    this.add
      .rectangle(640, 360, 760, 620, 0x071426, 0.95)
      .setStrokeStyle(3, 0x52d4ff, 1);

    this.add
      .text(640, 140, "ENTER YOUR NAME", {
        fontFamily: "Arial",
        fontSize: "50px",
        fontStyle: "bold",
        color: "#ffffff",
        stroke: "#168dca",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.add
      .text(640, 205, "Choose the name displayed on the leaderboard", {
        fontFamily: "Arial",
        fontSize: "21px",
        color: "#9edfff",
      })
      .setOrigin(0.5);

    this.inputBackground = this.add
      .rectangle(640, 300, 460, 80, 0x0c2438, 1)
      .setStrokeStyle(2, 0x52d4ff, 1);

    this.nameText = this.add
      .text(640, 305, "_", {
        fontFamily: "Arial",
        fontSize: "36px",
        fontStyle: "bold",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.add
      .text(640, 365, "3–12 characters: letters, numbers or underscore", {
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#a8bdcc",
      })
      .setOrigin(0.5);

    this.errorText = this.add
      .text(640, 420, "", {
        fontFamily: "Arial",
        fontSize: "20px",
        color: "#ff6374",
        align: "center",
        wordWrap: {
          width: 560,
        },
      })
      .setOrigin(0.5);

    this.continueButton = this.createButton(640, 520, "CONTINUE");

    this.backButton = this.createButton(640, 610, "BACK");

    this.continueButton.on("pointerdown", () => {
      this.submitPlayerName();
    });

    this.backButton.on("pointerdown", () => {
      this.scene.start("Menu");
    });

    this.input.keyboard.on("keydown", this.handleKeyboardInput, this);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard.off("keydown", this.handleKeyboardInput, this);
    });
  }

  handleKeyboardInput(event) {
    if (event.key === "Backspace") {
      event.preventDefault();

      this.playerName = this.playerName.slice(0, -1);

      this.clearError();
      this.updateNameText();

      return;
    }

    if (event.key === "Enter") {
      this.submitPlayerName();
      return;
    }

    if (
      event.key.length === 1 &&
      this.playerName.length < this.maxNameLength &&
      /^[a-zA-Z0-9_]$/.test(event.key)
    ) {
      this.playerName += event.key;

      this.clearError();
      this.updateNameText();
    }
  }

  updateNameText() {
    this.nameText.setText(this.playerName || "_");
  }

  clearError() {
    this.errorText.setText("");

    this.inputBackground.setStrokeStyle(2, 0x52d4ff, 1);
  }

  showError(message) {
    this.errorText.setText(message);

    this.inputBackground.setStrokeStyle(3, 0xff6374, 1);
  }

  submitPlayerName() {
    const trimmedName = this.playerName.trim();

    if (trimmedName.length < 3) {
      this.showError("The name must contain at least 3 characters.");

      return;
    }

    if (trimmedName.length > this.maxNameLength) {
      this.showError(
        `The name can contain a maximum of ${this.maxNameLength} characters.`,
      );

      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmedName)) {
      this.showError("Use only letters, numbers or underscore.");

      return;
    }

    this.registry.set("playerName", trimmedName);

    this.scene.start("Start");
  }

  createButton(x, y, text) {
    const button = this.add.container(x, y);

    const buttonBackground = this.add.rectangle(0, 0, 300, 65, 0x123b59, 1);

    buttonBackground.setStrokeStyle(2, 0x52d4ff, 1);

    const buttonText = this.add
      .text(0, 0, text, {
        fontFamily: "Arial",
        fontSize: "25px",
        fontStyle: "bold",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    button.add([buttonBackground, buttonText]);

    button.setSize(300, 65);

    button.setInteractive({
      useHandCursor: true,
    });

    button.on("pointerover", () => {
      buttonBackground.setFillStyle(0x1c6d99);

      this.tweens.add({
        targets: button,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 120,
      });
    });

    button.on("pointerout", () => {
      buttonBackground.setFillStyle(0x123b59);

      this.tweens.add({
        targets: button,
        scaleX: 1,
        scaleY: 1,
        duration: 120,
      });
    });

    button.on("pointerdown", () => {
      button.setScale(0.97);
    });

    button.on("pointerup", () => {
      button.setScale(1.05);
    });

    return button;
  }
}
