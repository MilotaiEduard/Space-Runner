import Phaser from "phaser";
import { getLeaderboard } from "../scoreService.js";

export class Leaderboard extends Phaser.Scene {
  constructor() {
    super("Leaderboard");
  }

  preload() {
    this.load.image("leaderboardBackground", "/assets/space.png");
  }

  create() {
    const background = this.add.image(640, 360, "leaderboardBackground");

    background.setDisplaySize(1280, 720);

    this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.6);

    this.add
      .rectangle(640, 360, 760, 620, 0x071426, 0.95)
      .setStrokeStyle(3, 0x52d4ff, 1);

    this.add
      .text(640, 95, "LEADERBOARD", {
        fontFamily: "Arial",
        fontSize: "56px",
        fontStyle: "bold",
        color: "#ffffff",
        stroke: "#168dca",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.add
      .text(395, 160, "RANK", {
        fontFamily: "Arial",
        fontSize: "21px",
        fontStyle: "bold",
        color: "#52d4ff",
      })
      .setOrigin(0.5);

    this.add
      .text(640, 160, "PLAYER", {
        fontFamily: "Arial",
        fontSize: "21px",
        fontStyle: "bold",
        color: "#52d4ff",
      })
      .setOrigin(0.5);

    this.add
      .text(885, 160, "SCORE", {
        fontFamily: "Arial",
        fontSize: "21px",
        fontStyle: "bold",
        color: "#52d4ff",
      })
      .setOrigin(0.5);

    this.loadingText = this.add
      .text(640, 330, "Loading leaderboard...", {
        fontFamily: "Arial",
        fontSize: "24px",
        color: "#a8bdcc",
      })
      .setOrigin(0.5);

    const backButton = this.createButton(640, 640, "BACK");

    backButton.on("pointerdown", () => {
      this.scene.start("Menu");
    });

    this.loadLeaderboard();
  }

  async loadLeaderboard() {
    try {
      const players = await getLeaderboard(10);

      if (!this.scene.isActive()) {
        return;
      }

      this.loadingText.destroy();

      if (players.length === 0) {
        this.add
          .text(640, 330, "No scores available yet.", {
            fontFamily: "Arial",
            fontSize: "24px",
            color: "#a8bdcc",
          })
          .setOrigin(0.5);

        return;
      }

      players.forEach((player, index) => {
        this.createLeaderboardRow(player, index);
      });
    } catch (error) {
      console.error("Leaderboard loading failed:", error);

      if (!this.scene.isActive()) {
        return;
      }

      this.loadingText.setText("The leaderboard could not be loaded.");

      this.loadingText.setColor("#ff6374");
    }
  }

  createLeaderboardRow(player, index) {
    const startY = 210;
    const rowSpacing = 38;
    const y = startY + index * rowSpacing;

    const isCurrentPlayer =
      player.playerName === this.registry.get("playerName");

    const backgroundColor = isCurrentPlayer ? 0x174865 : 0x0c2438;

    const rowBackground = this.add.rectangle(
      640,
      y,
      650,
      32,
      backgroundColor,
      0.95,
    );

    if (isCurrentPlayer) {
      rowBackground.setStrokeStyle(1, 0x52d4ff, 1);
    }

    let rankText = `${player.position}`;

    if (player.position === 1) {
      rankText = "1st";
    }

    if (player.position === 2) {
      rankText = "2nd";
    }

    if (player.position === 3) {
      rankText = "3rd";
    }

    this.add
      .text(395, y, rankText, {
        fontFamily: "Arial",
        fontSize: "20px",
        fontStyle: player.position <= 3 ? "bold" : "normal",
        color: this.getRankColor(player.position),
      })
      .setOrigin(0.5);

    this.add
      .text(640, y, player.playerName, {
        fontFamily: "Arial",
        fontSize: "20px",
        fontStyle: isCurrentPlayer ? "bold" : "normal",
        color: isCurrentPlayer ? "#52d4ff" : "#ffffff",
      })
      .setOrigin(0.5);

    this.add
      .text(885, y, `${player.bestScore}`, {
        fontFamily: "Arial",
        fontSize: "20px",
        fontStyle: "bold",
        color: "#ffffff",
      })
      .setOrigin(0.5);
  }

  getRankColor(position) {
    if (position === 1) {
      return "#ffd700";
    }

    if (position === 2) {
      return "#d9e1e8";
    }

    if (position === 3) {
      return "#cd7f32";
    }

    return "#ffffff";
  }

  createButton(x, y, text) {
    const button = this.add.container(x, y);

    const buttonBackground = this.add.rectangle(0, 0, 260, 60, 0x123b59);

    buttonBackground.setStrokeStyle(2, 0x52d4ff);

    const buttonText = this.add
      .text(0, 0, text, {
        fontFamily: "Arial",
        fontSize: "24px",
        fontStyle: "bold",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    button.add([buttonBackground, buttonText]);

    button.setSize(260, 60);

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
