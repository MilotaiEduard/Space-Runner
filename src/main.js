import Phaser from "phaser";

import { Start } from "./scenes/Start.js";
import { Menu } from "./scenes/Menu.js";
import { Controls } from "./scenes/Controls.js";
import { GameOver } from "./scenes/GameOver.js";
import { NameEntry } from "./scenes/NameEntry.js";
import { Leaderboard } from "./scenes/Leaderboard.js";

const config = {
  type: Phaser.AUTO,
  title: "SPACE RUNNER",
  description: "",
  parent: "game-container",
  width: 1280,
  height: 720,
  backgroundColor: "#000000",
  pixelArt: false,

  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        x: 0,
        y: 0,
      },
      debug: false,
    },
  },

  scene: [Menu, NameEntry, Controls, Start, GameOver, Leaderboard],

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

new Phaser.Game(config);
