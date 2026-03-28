import Phaser from "phaser";
import "./style.css";

const GAME_WIDTH = 480;
const GAME_HEIGHT = 720;
const PLAYER_SPEED = 320;
const BULLET_SPEED = 520;
const ENEMY_SPEED_MIN = 120;
const ENEMY_SPEED_MAX = 240;
const FIRE_INTERVAL = 180;
const CUSTOM_ENEMY_STORAGE_KEY = "mini-shooter-custom-enemy-url";
const CUSTOM_ENEMY_STATUS_KEY = "mini-shooter-custom-enemy-status";
const BASE_ENEMY_OPTIONS = [
  {
    key: "enemy-crab",
    name: "CRAB",
    accent: "#ff5d73"
  },
  {
    key: "enemy-skull",
    name: "SKULL",
    accent: "#9bff66"
  },
  {
    key: "enemy-ufo",
    name: "UFO",
    accent: "#66d9ff"
  }
];

class ShooterScene extends Phaser.Scene {
  constructor() {
    super("ShooterScene");
  }

  preload() {
    this.createTextures();
    this.customEnemyUrl = getCustomEnemyUrl();
    this.load.setCORS("anonymous");

    if (this.customEnemyUrl) {
      this.load.on(
        Phaser.Loader.Events.FILE_LOAD_ERROR,
        () => {
          setCustomEnemyStatus(
            "画像を読み込めませんでした。ローカル画像ファイルの保存も試してください"
          );
        },
        this
      );
      this.load.once(
        Phaser.Loader.Events.COMPLETE,
        () => {
          if (this.textures.exists("enemy-custom")) {
            setCustomEnemyStatus("カスタム画像を読み込みました");
          }
        },
        this
      );
      this.load.image("enemy-custom", this.customEnemyUrl);
    }
  }

  create() {
    this.score = 0;
    this.gameOver = false;
    this.gameStarted = false;
    this.lastFiredAt = 0;
    this.selectedEnemyIndex = 0;
    this.touchTarget = null;
    this.touchShooting = false;
    this.isTouchDevice =
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(hover: none)").matches;
    this.enemyOptions = this.buildEnemyOptions();

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
      .setCollideWorldBounds(true)
      .setVisible(false);
    this.player.body.enable = false;

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
      this.isTouchDevice
        ? "SWIPE: MOVE / TAP: FIRE"
        : "MOVE: Arrow Keys / FIRE: Space",
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

    this.startTitleText = this.add
      .text(GAME_WIDTH / 2, 120, "CHOOSE YOUR ENEMY", {
        fontFamily: "monospace",
        fontSize: "28px",
        color: "#ffffff"
      })
      .setOrigin(0.5)
      .setDepth(10);

    this.startHintText = this.add
      .text(
        GAME_WIDTH / 2,
        GAME_HEIGHT - 80,
        this.isTouchDevice
          ? "TAP LEFT/RIGHT: SELECT   TAP CENTER: START"
          : "LEFT / RIGHT: SELECT   ENTER: START",
        {
          fontFamily: "monospace",
          fontSize: "16px",
          color: "#9fb3c8"
        }
      )
      .setOrigin(0.5)
      .setDepth(10);

    this.enemyPreview = this.add
      .image(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 10, this.enemyOptions[0].key)
      .setScale(4)
      .setDepth(10);

    this.enemyNameText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 110, "", {
        fontFamily: "monospace",
        fontSize: "24px",
        color: "#ffffff"
      })
      .setOrigin(0.5)
      .setDepth(10);

    this.enemyFlavorText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 152, "", {
        fontFamily: "monospace",
        fontSize: "14px",
        align: "center",
        color: "#c9d7e6"
      })
      .setOrigin(0.5)
      .setDepth(10);

    this.selectionMarkers = [
      this.add
        .text(GAME_WIDTH / 2 - 140, GAME_HEIGHT / 2 - 10, "<", {
          fontFamily: "monospace",
          fontSize: "44px",
          color: "#ffffff"
        })
        .setOrigin(0.5)
        .setDepth(10),
      this.add
        .text(GAME_WIDTH / 2 + 140, GAME_HEIGHT / 2 - 10, ">", {
          fontFamily: "monospace",
          fontSize: "44px",
          color: "#ffffff"
        })
        .setOrigin(0.5)
        .setDepth(10)
    ];

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
    this.enemyTimer.paused = true;

    this.input.keyboard.on("keydown-ENTER", () => {
      if (this.gameOver) {
        this.scene.restart();
      } else if (!this.gameStarted) {
        this.startGame();
      }
    });

    this.input.keyboard.on("keydown-LEFT", () => {
      if (!this.gameStarted) {
        this.changeEnemySelection(-1);
      }
    });

    this.input.keyboard.on("keydown-RIGHT", () => {
      if (!this.gameStarted) {
        this.changeEnemySelection(1);
      }
    });

    this.input.on("pointerdown", (pointer) => {
      if (!this.isPointerInsideGame(pointer)) {
        return;
      }

      if (this.gameOver) {
        this.scene.restart();
        return;
      }

      if (!this.gameStarted) {
        this.handleStartScreenPointer(pointer);
        return;
      }

      this.touchTarget = {
        x: Phaser.Math.Clamp(pointer.x, 24, GAME_WIDTH - 24),
        y: Phaser.Math.Clamp(pointer.y, 40, GAME_HEIGHT - 40)
      };
      this.touchShooting = true;
      this.fireBullet(this.time.now);
    });

    this.input.on("pointermove", (pointer) => {
      if (!pointer.isDown || !this.gameStarted || !this.isPointerInsideGame(pointer)) {
        return;
      }

      this.touchTarget = {
        x: Phaser.Math.Clamp(pointer.x, 24, GAME_WIDTH - 24),
        y: Phaser.Math.Clamp(pointer.y, 40, GAME_HEIGHT - 40)
      };
    });

    this.input.on("pointerup", () => {
      this.touchShooting = false;
      this.touchTarget = null;
    });

    this.refreshEnemySelection();
    updateStatusMessage(
      getCustomEnemyStatus() || "公開URLかローカル画像ファイルを使えます"
    );
  }

  update(time, delta) {
    this.updateStarfield(delta);

    if (this.gameOver || !this.gameStarted) {
      this.player.setVelocity(0);
      return;
    }

    const moveLeft = this.cursors.left.isDown;
    const moveRight = this.cursors.right.isDown;
    const moveUp = this.cursors.up.isDown;
    const moveDown = this.cursors.down.isDown;

    const horizontal = (moveRight ? 1 : 0) - (moveLeft ? 1 : 0);
    const vertical = (moveDown ? 1 : 0) - (moveUp ? 1 : 0);

    if (this.touchTarget) {
      const dx = this.touchTarget.x - this.player.x;
      const dy = this.touchTarget.y - this.player.y;

      this.player.setVelocity(
        Phaser.Math.Clamp(dx * 8, -PLAYER_SPEED, PLAYER_SPEED),
        Phaser.Math.Clamp(dy * 8, -PLAYER_SPEED, PLAYER_SPEED)
      );
    } else {
      this.player.setVelocity(horizontal * PLAYER_SPEED, vertical * PLAYER_SPEED);
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.fireKey) ||
      (this.touchShooting && time > this.lastFiredAt + FIRE_INTERVAL) ||
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
    graphics.generateTexture("enemy-crab", 30, 24);
    graphics.clear();

    graphics.fillStyle(0x9bff66, 1);
    graphics.fillRoundedRect(6, 0, 28, 28, 8);
    graphics.fillStyle(0x12202c, 1);
    graphics.fillCircle(15, 12, 3);
    graphics.fillCircle(25, 12, 3);
    graphics.fillRect(14, 20, 12, 3);
    graphics.generateTexture("enemy-skull", 40, 30);
    graphics.clear();

    graphics.fillStyle(0x66d9ff, 1);
    graphics.fillEllipse(20, 16, 40, 18);
    graphics.fillStyle(0xe7fbff, 1);
    graphics.fillEllipse(20, 10, 18, 10);
    graphics.generateTexture("enemy-ufo", 40, 30);
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
    if (this.gameOver || !this.gameStarted) {
      return;
    }

    const enemy = this.enemies.get(
      Phaser.Math.Between(28, GAME_WIDTH - 28),
      -32,
      this.enemyOptions[this.selectedEnemyIndex].key
    );

    if (!enemy) {
      return;
    }

    enemy.setTexture(this.enemyOptions[this.selectedEnemyIndex].key);
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

  changeEnemySelection(direction) {
    const total = this.enemyOptions.length;
    this.selectedEnemyIndex =
      (this.selectedEnemyIndex + direction + total) % total;
    this.refreshEnemySelection();
  }

  refreshEnemySelection() {
    const selected = this.enemyOptions[this.selectedEnemyIndex];
    this.enemyPreview.setTexture(selected.key);
    this.enemyNameText.setText(selected.name);
    this.enemyNameText.setColor(selected.accent);

    const flavorTextByEnemy = {
      CRAB: "SIDE STEPPER\nCLASSIC RED INVADER",
      SKULL: "BONE CHILLER\nGREEN PANIC WAVE",
      UFO: "CITY POP RAIDER\nSMOOTH BLUE GLIDER",
      CUSTOM: "YOUR UPLOADED ENEMY\nFROM A PUBLIC IMAGE URL"
    };

    this.enemyFlavorText.setText(flavorTextByEnemy[selected.name]);
  }

  startGame() {
    this.gameStarted = true;
    this.player.setVisible(true);
    this.player.body.enable = true;
    this.player.clearTint();
    this.enemyTimer.paused = false;
    this.startTitleText.setVisible(false);
    this.startHintText.setVisible(false);
    this.enemyPreview.setVisible(false);
    this.enemyNameText.setVisible(false);
    this.enemyFlavorText.setVisible(false);
    this.selectionMarkers.forEach((marker) => marker.setVisible(false));
    this.guideText.setText(
      this.isTouchDevice
        ? `ENEMY: ${this.enemyOptions[this.selectedEnemyIndex].name} / SWIPE + TAP`
        : `ENEMY: ${this.enemyOptions[this.selectedEnemyIndex].name} / FIRE: Space`
    );
  }

  buildEnemyOptions() {
    const enemyOptions = [...BASE_ENEMY_OPTIONS];

    if (this.textures.exists("enemy-custom")) {
      enemyOptions.push({
        key: "enemy-custom",
        name: "CUSTOM",
        accent: "#ffd166"
      });
    }

    return enemyOptions;
  }

  recycleGameObject(gameObject) {
    gameObject.disableBody(true, true);
    gameObject.setVelocity(0, 0);
  }

  handleStartScreenPointer(pointer) {
    if (pointer.x < GAME_WIDTH * 0.34) {
      this.changeEnemySelection(-1);
      return;
    }

    if (pointer.x > GAME_WIDTH * 0.66) {
      this.changeEnemySelection(1);
      return;
    }

    this.startGame();
  }

  isPointerInsideGame(pointer) {
    return (
      pointer.x >= 0 &&
      pointer.x <= GAME_WIDTH &&
      pointer.y >= 0 &&
      pointer.y <= GAME_HEIGHT
    );
  }
}

function getCustomEnemyUrl() {
  return window.localStorage.getItem(CUSTOM_ENEMY_STORAGE_KEY)?.trim() || "";
}

function getCustomEnemyStatus() {
  return window.localStorage.getItem(CUSTOM_ENEMY_STATUS_KEY)?.trim() || "";
}

function setCustomEnemyStatus(message) {
  window.localStorage.setItem(CUSTOM_ENEMY_STATUS_KEY, message);
}

function updateStatusMessage(message) {
  const status = document.querySelector("#enemy-image-status");

  if (status) {
    status.textContent = message;
  }
}

function setupCustomEnemyControls() {
  const input = document.querySelector("#enemy-image-url");
  const fileInput = document.querySelector("#enemy-image-file");
  const saveButton = document.querySelector("#save-enemy-image");
  const saveFileButton = document.querySelector("#save-enemy-file");
  const resetButton = document.querySelector("#reset-enemy-image");

  if (!input || !fileInput || !saveButton || !saveFileButton || !resetButton) {
    return;
  }

  input.value = getCustomEnemyUrl();

  saveButton.addEventListener("click", () => {
    const url = input.value.trim();

    if (!url) {
      updateStatusMessage("画像URLを入力してください");
      return;
    }

    window.localStorage.setItem(CUSTOM_ENEMY_STORAGE_KEY, url);
    setCustomEnemyStatus("URLを保存しました。画像を読み込みます");
    updateStatusMessage("URLを保存しました。ページを再読み込みします");
    window.setTimeout(() => {
      window.location.reload();
    }, 500);
  });

  saveFileButton.addEventListener("click", () => {
    const file = fileInput.files?.[0];

    if (!file) {
      updateStatusMessage("画像ファイルを選択してください");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        updateStatusMessage("画像の読み込みに失敗しました");
        return;
      }

      window.localStorage.setItem(CUSTOM_ENEMY_STORAGE_KEY, reader.result);
      setCustomEnemyStatus("ローカル画像を保存しました。画像を読み込みます");
      updateStatusMessage("ローカル画像を保存しました。ページを再読み込みします");
      window.setTimeout(() => {
        window.location.reload();
      }, 500);
    };

    reader.onerror = () => {
      updateStatusMessage("画像ファイルの読み込みに失敗しました");
    };

    reader.readAsDataURL(file);
  });

  resetButton.addEventListener("click", () => {
    input.value = "";
    fileInput.value = "";
    window.localStorage.removeItem(CUSTOM_ENEMY_STORAGE_KEY);
    window.localStorage.removeItem(CUSTOM_ENEMY_STATUS_KEY);
    updateStatusMessage("カスタム画像を削除しました。ページを再読み込みします");
    window.setTimeout(() => {
      window.location.reload();
    }, 500);
  });
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

setupCustomEnemyControls();
new Phaser.Game(config);
