import Phaser from "phaser";

export class Start extends Phaser.Scene {
  constructor() {
    super("Start");

    this.shipSpeed = 400;
    this.score = 0;

    this.playerShootCooldown = 500;

    this.enemyShootCooldownMin = 700;
    this.enemyShootCooldownMax = 1300;
  }

  preload() {
    this.load.image("background", "assets/space.png");
    this.load.image("laser", "assets/laser.png");
    this.load.image("enemy", "assets/enemy-spaceship.png");
    this.load.image("explosion", "assets/explosion.png");
    this.load.audio("explosionSound", "assets/explosion.mp3");

    this.load.spritesheet("ship", "assets/spaceship.png", {
      frameWidth: 176,
      frameHeight: 96,
    });
  }

  create() {
    this.physics.resume();

    this.score = 0;
    this.lastPlayerShotTime = 0;
    this.isGameOver = false;

    this.background = this.add.tileSprite(640, 360, 1280, 720, "background");

    this.scoreText = this.add.text(1250, 30, "Score: 0", {
      fontSize: "32px",
      color: "#ffffff",
    });

    this.scoreText.setOrigin(1, 0);

    this.ship = this.physics.add.sprite(200, 360, "ship");

    if (!this.anims.exists("fly")) {
      this.anims.create({
        key: "fly",
        frames: this.anims.generateFrameNumbers("ship", {
          start: 0,
          end: 2,
        }),
        frameRate: 15,
        repeat: -1,
      });
    }

    this.ship.play("fly");

    this.cursors = this.input.keyboard.createCursorKeys();

    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );

    this.enemies = this.physics.add.group();
    this.lasers = this.physics.add.group();
    this.enemyLasers = this.physics.add.group();

    this.physics.add.overlap(
      this.lasers,
      this.enemies,
      this.hitEnemy,
      null,
      this,
    );

    this.physics.add.overlap(
      this.ship,
      this.enemies,
      this.hitPlayer,
      null,
      this,
    );

    this.physics.add.overlap(
      this.ship,
      this.enemyLasers,
      this.hitPlayerWithLaser,
      null,
      this,
    );

    this.explosionSound = this.sound.add("explosionSound", {
      volume: 0.5,
    });

    this.enemySpawnEvent = this.time.addEvent({
      delay: 1700,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });
  }

  update(time, delta) {
    if (this.isGameOver) {
      return;
    }

    const deltaSeconds = delta / 1000;

    this.background.tilePositionX += 300 * deltaSeconds;

    const movement = this.shipSpeed * deltaSeconds;

    if (this.cursors.left.isDown) {
      this.ship.x -= movement;
    }

    if (this.cursors.right.isDown) {
      this.ship.x += movement;
    }

    if (this.cursors.up.isDown) {
      this.ship.y -= movement;
    }

    if (this.cursors.down.isDown) {
      this.ship.y += movement;
    }

    this.keepShipInsideScreen();

    const canPlayerShoot =
      time >= this.lastPlayerShotTime + this.playerShootCooldown;

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && canPlayerShoot) {
      const laser = this.lasers.create(
        this.ship.x + this.ship.displayWidth / 2 + 60,
        this.ship.y,
        "laser",
      );

      laser.setScale(0.25);
      laser.setVelocityX(700);

      this.lastPlayerShotTime = time;
    }

    this.lasers.getChildren().forEach((laser) => {
      if (laser.x > 1280 + laser.displayWidth) {
        laser.destroy();
      }
    });

    this.enemyLasers.getChildren().forEach((laser) => {
      if (laser.x < -laser.displayWidth) {
        laser.destroy();
      }
    });

    this.enemies.getChildren().forEach((enemy) => {
      if (enemy.x < -enemy.displayWidth) {
        this.removeEnemyShootEvent(enemy);
        enemy.destroy();
      }
    });
  }

  spawnEnemy() {
    if (this.isGameOver) {
      return;
    }

    const randomY = Phaser.Math.Between(80, 640);

    const enemy = this.enemies.create(1350, randomY, "enemy");

    enemy.setScale(0.5);
    enemy.setVelocityX(-400);

    this.scheduleEnemyShot(enemy);
  }

  scheduleEnemyShot(enemy) {
    if (this.isGameOver || !enemy || !enemy.active) {
      return;
    }

    const cooldown = Phaser.Math.Between(
      this.enemyShootCooldownMin,
      this.enemyShootCooldownMax,
    );

    enemy.shootEvent = this.time.delayedCall(cooldown, () => {
      if (this.isGameOver || !enemy.active) {
        this.removeEnemyShootEvent(enemy);
        return;
      }

      this.enemyShoot(enemy);
      this.scheduleEnemyShot(enemy);
    });
  }

  enemyShoot(enemy) {
    if (this.isGameOver || !enemy || !enemy.active) {
      return;
    }

    const enemyLaser = this.enemyLasers.create(
      enemy.x - enemy.displayWidth / 2,
      enemy.y,
      "laser",
    );

    enemyLaser.setScale(0.2);
    enemyLaser.setVelocityX(-600);
  }

  hitEnemy(laser, enemy) {
    if (this.isGameOver || !laser.active || !enemy.active) {
      return;
    }

    const explosionX = enemy.x;
    const explosionY = enemy.y;

    laser.destroy();

    this.removeEnemyShootEvent(enemy);

    enemy.destroy();

    this.createExplosion(explosionX, explosionY, 0.2);

    this.score += 10;

    this.scoreText.setText(`Score: ${this.score}`);
  }

  hitPlayerWithLaser(ship, enemyLaser) {
    if (this.isGameOver) {
      return;
    }

    enemyLaser.destroy();

    this.hitPlayer(ship, null);
  }

  hitPlayer(ship, enemy) {
    if (this.isGameOver) {
      return;
    }

    this.isGameOver = true;

    const explosionX = ship.x;
    const explosionY = ship.y;

    ship.destroy();

    if (enemy) {
      this.removeEnemyShootEvent(enemy);
      enemy.destroy();
    }

    this.createExplosion(explosionX, explosionY, 0.2);

    if (this.enemySpawnEvent) {
      this.enemySpawnEvent.remove();
      this.enemySpawnEvent = null;
    }

    this.enemies.getChildren().forEach((currentEnemy) => {
      this.removeEnemyShootEvent(currentEnemy);
    });

    this.physics.pause();

    this.time.delayedCall(300, () => {
      this.scene.start("GameOver", {
        score: this.score,
        playerName: this.registry.get("playerName"),
      });
    });
  }

  createExplosion(x, y, scale) {
    const explosion = this.add.image(x, y, "explosion");

    explosion.setScale(scale);

    this.explosionSound.play();

    this.time.delayedCall(300, () => {
      if (explosion.active) {
        explosion.destroy();
      }
    });
  }

  removeEnemyShootEvent(enemy) {
    if (enemy && enemy.shootEvent) {
      enemy.shootEvent.remove();
      enemy.shootEvent = null;
    }
  }

  keepShipInsideScreen() {
    const halfWidth = this.ship.displayWidth / 2;

    const halfHeight = this.ship.displayHeight / 2;

    this.ship.x = Phaser.Math.Clamp(this.ship.x, halfWidth, 1280 - halfWidth);

    this.ship.y = Phaser.Math.Clamp(this.ship.y, halfHeight, 720 - halfHeight);
  }
}
