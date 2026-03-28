import Phaser from "phaser";
import "./style.css";

const GAME_WIDTH = 480;
const GAME_HEIGHT = 720;
const PLAYER_SPEED = 320;
const BULLET_SPEED = 520;
const ENEMY_SPEED_MIN = 120;
const ENEMY_SPEED_MAX = 240;
const FIRE_INTERVAL = 180;

class ShooterScene extends Phaser.Scene {
  constructor() {
    super("ShooterScene");
  }

  preload() {
    this.createTextures();
  }

  create() {
    this.score = 0;
    this.gameOver = false;
    this.lastFiredAt = 0;

    this.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      GAME_WIDTH,
      GAME_HEIGHT,
      0x07111f
    );

    this.starfield = this.add.group({
      classType: Phaser.GameObjects.Rectangle,
      maxSize: 50,
      runChildUpdate: false
    });

    this.createStarfield();

    this.player = this.physics.add
      .image(GAME_WIDTH / 2, GAME_HEIGHT - 80, "player")
      .setCollideWorldBounds(true);

    this.bullets = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 24
    });

    this.enemies = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 24
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.fireKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.scoreText = this.add.text(20, 18, "SCORE 0000", {
      fontFamily: "monospace",
      fontSize: "24px",
      color: "#f5f7ff"
    });

    this.guideText = this.add.text(
      GAME_WIDTH / 2,
      GAME_HEIGHT - 24,
      "MOVE: Arrow Keys / FIRE: Space",
      {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#9fb3c8"
      }
    );
    this.guideText.setOrigin(0.5, 1);

    this.resultText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "", {
        fontFamily: "monospace",
        fontSize: "28px",
        align: "center",
        color: "#ffffff"
      })
      .setOrigin(0.5)
      .setDepth(10);

    this.physics.add.overlap(
      this.bullets,
      this.enemies,
      this.handleBulletHitEnemy,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.handlePlayerHit,
      undefined,
      this
    );

    this.enemyTimer = this.time.addEvent({
      delay: 650,
      loop: true,
      callback: this.spawnEnemy,
      callbackScope: this
    });

    this.input.keyboard.on("keydown-ENTER", () => {
      if (this.gameOver) {
        this.scene.restart();
      }
    });
  }

  update(time, delta) {
    this.updateStarfield(delta);

    if (this.gameOver) {
      this.player.setVelocity(0);
      return;
    }

    const moveLeft = this.cursors.left.isDown;
    const moveRight = this.cursors.right.isDown;
    const moveUp = this.cursors.up.isDown;
    const moveDown = this.cursors.down.isDown;

    const horizontal = (moveRight ? 1 : 0) - (moveLeft ? 1 : 0);
    const vertical = (moveDown ? 1 : 0) - (moveUp ? 1 : 0);

    this.player.setVelocity(horizontal * PLAYER_SPEED, vertical * PLAYER_SPEED);

    if (
      Phaser.Input.Keyboard.JustDown(this.fireKey) ||
      (this.fireKey.isDown && time > this.lastFiredAt + FIRE_INTERVAL)
    ) {
      this.fireBullet(time);
    }

    this.bullets.children.each((bullet) => {
      if (bullet.active && bullet.y < -32) {
        this.recycleGameObject(bullet);
      }
    });

    this.enemies.children.each((enemy) => {
      if (enemy.active && enemy.y > GAME_HEIGHT + 48) {
        this.recycleGameObject(enemy);
      }
    });
  }

  createTextures() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });

    graphics.fillStyle(0x68f0ff, 1);
    graphics.beginPath();
    graphics.moveTo(16, 0);
    graphics.lineTo(32, 28);
    graphics.lineTo(20, 24);
    graphics.lineTo(16, 32);
    graphics.lineTo(12, 24);
    graphics.lineTo(0, 28);
    graphics.closePath();
    graphics.fillPath();
    graphics.generateTexture("player", 32, 32);
    graphics.clear();

    graphics.fillStyle(0xffd166, 1);
    graphics.fillRect(0, 0, 6, 18);
    graphics.generateTexture("bullet", 6, 18);
    graphics.clear();

    graphics.fillStyle(0xff5d73, 1);
    graphics.fillRoundedRect(0, 0, 30, 24, 6);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRect(6, 8, 6, 6);
    graphics.fillRect(18, 8, 6, 6);
    graphics.generateTexture("enemy", 30, 24);
    graphics.destroy();
  }

  createStarfield() {
    for (let index = 0; index < 40; index += 1) {
      const x = Phaser.Math.Between(0, GAME_WIDTH);
      const y = Phaser.Math.Between(0, GAME_HEIGHT);
      const size = Phaser.Math.Between(1, 3);
      const alpha = Phaser.Math.FloatBetween(0.2, 0.8);
      const star = this.add.rectangle(x, y, size, size * 2, 0xffffff, alpha);
      star.speed = Phaser.Math.Between(60, 180);
      this.starfield.add(star);
    }
  }

  updateStarfield(delta) {
    this.starfield.children.each((star) => {
      star.y += (star.speed * delta) / 1000;
      if (star.y > GAME_HEIGHT + 6) {
        star.y = -6;
        star.x = Phaser.Math.Between(0, GAME_WIDTH);
      }
    });
  }

  fireBullet(time) {
    const bullet = this.bullets.get(this.player.x, this.player.y - 28, "bullet");

    if (!bullet) {
      return;
    }

    bullet.setActive(true);
    bullet.setVisible(true);
    bullet.body.enable = true;
    bullet.setPosition(this.player.x, this.player.y - 28);
    bullet.setVelocity(0, -BULLET_SPEED);
    this.lastFiredAt = time;
  }

  spawnEnemy() {
    if (this.gameOver) {
      return;
    }

    const enemy = this.enemies.get(
      Phaser.Math.Between(28, GAME_WIDTH - 28),
      -32,
      "enemy"
    );

    if (!enemy) {
      return;
    }

    enemy.setActive(true);
    enemy.setVisible(true);
    enemy.body.enable = true;
    enemy.setPosition(Phaser.Math.Between(28, GAME_WIDTH - 28), -32);
    enemy.setVelocity(0, Phaser.Math.Between(ENEMY_SPEED_MIN, ENEMY_SPEED_MAX));
  }

  handleBulletHitEnemy(bullet, enemy) {
    this.recycleGameObject(bullet);
    this.recycleGameObject(enemy);
    this.score += 10;
    this.scoreText.setText(`SCORE ${String(this.score).padStart(4, "0")}`);
  }

  handlePlayerHit(player, enemy) {
    this.recycleGameObject(enemy);
    player.setTint(0xff6b6b);
    this.gameOver = true;
    this.enemyTimer.remove(false);
    this.resultText.setText("GAME OVER\nPRESS ENTER");
  }

  recycleGameObject(gameObject) {
    gameObject.disableBody(true, true);
    gameObject.setVelocity(0, 0);
  }
}

const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: "app",
  backgroundColor: "#07111f",
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [ShooterScene]
};

new Phaser.Game(config);
