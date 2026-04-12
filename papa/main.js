import Phaser from 'phaser'
import { quizBank } from './quizBank.js'

const WIDTH = 960
const HEIGHT = 540
const PLAYER_X = 180
const QUIZ_INTERVAL = 12000

class PapaScene extends Phaser.Scene {
  constructor() {
    super('PapaScene')
    this.quizCooldown = QUIZ_INTERVAL
    this.quizCursor = 0
    this.gameOver = false
    this.quizActive = false
    this.survivalTime = 0
    this.bestScore = Number(window.localStorage.getItem('papa-best-score') || 0)
    this.flameSpeed = 280
    this.combo = 0
    this.lives = 3
  }

  create() {
    this.createBackground()
    this.createTextures()
    this.createActors()
    this.createHud()
    this.createQuizOverlay()
    this.createInput()
    this.resetRound()
  }

  createTextures() {
    if (!this.textures.exists('papa-flame')) {
      const graphics = this.make.graphics({ x: 0, y: 0, add: false })
      graphics.fillStyle(0xdc2626, 1)
      graphics.fillTriangle(4, 16, 34, 2, 34, 30)
      graphics.fillStyle(0xfb923c, 1)
      graphics.fillCircle(18, 16, 12)
      graphics.fillStyle(0xfef08a, 1)
      graphics.fillCircle(15, 14, 6)
      graphics.generateTexture('papa-flame', 40, 32)
      graphics.destroy()
    }
  }

  createBackground() {
    this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x0f172a)
    this.add.rectangle(WIDTH / 2, 78, WIDTH, 156, 0x1d4ed8, 0.18)
    this.add.rectangle(WIDTH / 2, HEIGHT - 56, WIDTH, 112, 0x14532d, 0.9)

    this.backMountains = this.add.tileSprite(WIDTH / 2, HEIGHT - 140, WIDTH, 160, this.makeStripeTexture(0x1e293b, 0x334155, 18, 60))
    this.frontGround = this.add.tileSprite(WIDTH / 2, HEIGHT - 38, WIDTH, 76, this.makeStripeTexture(0x365314, 0x4d7c0f, 24, 48))
  }

  makeStripeTexture(primary, secondary, stripeWidth, height) {
    const key = `stripe-${primary}-${secondary}-${stripeWidth}-${height}`

    if (this.textures.exists(key)) {
      return key
    }

    const graphics = this.make.graphics({ x: 0, y: 0, add: false })
    graphics.fillStyle(primary, 1)
    graphics.fillRect(0, 0, 256, height)
    graphics.fillStyle(secondary, 1)

    for (let x = 0; x < 256; x += stripeWidth * 2) {
      graphics.fillRect(x, 0, stripeWidth, height)
    }

    graphics.generateTexture(key, 256, height)
    graphics.destroy()
    return key
  }

  createActors() {
    this.player = this.add.container(PLAYER_X, HEIGHT / 2)
    const body = this.add.ellipse(0, 0, 50, 62, 0xf8fafc)
    const visor = this.add.ellipse(6, -6, 24, 18, 0x38bdf8)
    const scarf = this.add.rectangle(0, 18, 34, 10, 0xf97316)
    this.player.add([body, visor, scarf])
    this.playerBody = body

    this.enemy = this.add.container(WIDTH - 130, HEIGHT / 2)
    const enemyCore = this.add.circle(0, 0, 28, 0x7f1d1d)
    const enemyEye = this.add.circle(-8, -4, 6, 0xfef2f2)
    const enemyEye2 = this.add.circle(10, -4, 6, 0xfef2f2)
    const enemyMouth = this.add.rectangle(0, 12, 24, 8, 0xfb7185)
    this.enemy.add([enemyCore, enemyEye, enemyEye2, enemyMouth])

    this.flames = this.add.group()
    this.playerHitbox = this.add.zone(PLAYER_X, HEIGHT / 2, 42, 56)
    this.physics.add.existing(this.playerHitbox)
    this.playerHitbox.body.setAllowGravity(false)
    this.playerHitbox.body.setImmovable(true)
  }

  createHud() {
    this.hudBand = this.add.rectangle(WIDTH / 2, 34, WIDTH - 32, 52, 0x0f172a, 0.72).setStrokeStyle(1, 0x94a3b8, 0.22)
    this.scoreText = this.add.text(24, 18, '', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '20px',
      color: '#eff6ff',
    })
    this.statusText = this.add.text(WIDTH - 24, 18, '', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '18px',
      color: '#fdba74',
    }).setOrigin(1, 0)
    this.helpText = this.add.text(24, HEIGHT - 40, '上下キー / W S で移動', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '18px',
      color: '#e2e8f0',
    })
  }

  createQuizOverlay() {
    this.quizLayer = this.add.container(0, 0).setDepth(20).setVisible(false)
    const veil = this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x020617, 0.78)
    const panel = this.add.rectangle(WIDTH / 2, HEIGHT / 2, 700, 360, 0x0f172a, 0.98).setStrokeStyle(2, 0xfb923c, 0.55)
    const title = this.add.text(WIDTH / 2, 120, '歴史クイズ', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '34px',
      color: '#fed7aa',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    this.quizPromptText = this.add.text(WIDTH / 2, 178, '', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '25px',
      align: 'center',
      wordWrap: { width: 610 },
      color: '#f8fafc',
    }).setOrigin(0.5)

    this.quizFeedbackText = this.add.text(WIDTH / 2, 458, '', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '18px',
      color: '#cbd5e1',
      align: 'center',
      wordWrap: { width: 610 },
    }).setOrigin(0.5)

    this.answerButtons = []
    this.quizLayer.add([veil, panel, title, this.quizPromptText])

    for (let index = 0; index < 4; index += 1) {
      const column = index % 2
      const row = Math.floor(index / 2)
      const x = 275 + column * 315
      const y = 265 + row * 82
      const button = this.add.container(x, y)
      const bg = this.add.rectangle(0, 0, 280, 58, 0x1e293b, 0.94).setStrokeStyle(2, 0x60a5fa, 0.42)
      const label = this.add.text(0, 0, '', {
        fontFamily: 'Trebuchet MS, sans-serif',
        fontSize: '20px',
        color: '#eff6ff',
        align: 'center',
        wordWrap: { width: 250 },
      }).setOrigin(0.5)

      bg.setInteractive({ useHandCursor: true })
      bg.on('pointerover', () => {
        if (!this.quizResolved) {
          bg.setFillStyle(0x2563eb, 0.9)
        }
      })
      bg.on('pointerout', () => {
        if (!this.quizResolved) {
          bg.setFillStyle(0x1e293b, 0.94)
        }
      })
      bg.on('pointerdown', () => {
        if (!this.quizResolved) {
          this.resolveQuiz(index)
        }
      })

      button.add([bg, label])
      this.answerButtons.push({ button, bg, label })
      this.quizLayer.add(button)
    }

    this.quizLayer.add(this.quizFeedbackText)
  }

  createInput() {
    this.cursors = this.input.keyboard.createCursorKeys()
    this.keys = this.input.keyboard.addKeys('W,S,R')
  }

  resetRound() {
    this.gameOver = false
    this.quizActive = false
    this.quizResolved = false
    this.survivalTime = 0
    this.quizCooldown = QUIZ_INTERVAL
    this.flameSpeed = 280
    this.combo = 0
    this.lives = 3
    this.player.y = HEIGHT / 2
    this.enemy.y = HEIGHT / 2
    this.playerHitbox.y = this.player.y
    this.flames.clear(true, true)
    this.spawnTimer?.remove(false)
    this.spawnTimer = this.time.addEvent({
      delay: 1100,
      loop: true,
      callback: () => this.spawnFlame(),
    })
    this.quizLayer.setVisible(false)
    this.helpText.setText('上下キー / W S で移動')
    this.updateHud()
  }

  spawnFlame() {
    if (this.gameOver || this.quizActive) {
      return
    }

    const flame = this.add.image(
      this.enemy.x - 44,
      this.enemy.y + Phaser.Math.Between(-10, 10),
      'papa-flame',
    )

    flame.setDepth(3)
    flame.setScale(1.05)
    flame.setData('speedX', -this.flameSpeed)
    flame.setData('speedY', Phaser.Math.Between(-40, 40))
    this.flames.add(flame)
  }

  startQuiz() {
    this.quizActive = true
    this.quizResolved = false
    this.quizCooldown = QUIZ_INTERVAL + 2000
    this.currentQuiz = quizBank[this.quizCursor % quizBank.length]
    this.quizCursor += 1
    this.physics.pause()
    this.quizPromptText.setText(this.currentQuiz.question)
    this.quizFeedbackText.setText('正解すると炎が少しゆっくりになります。')
    this.answerButtons.forEach((entry, index) => {
      entry.label.setText(this.currentQuiz.choices[index])
      entry.bg.setFillStyle(0x1e293b, 0.94)
    })
    this.quizLayer.setVisible(true)
  }

  resolveQuiz(selectedIndex) {
    const correctIndex = this.currentQuiz.answerIndex
    const isCorrect = selectedIndex === correctIndex
    this.quizResolved = true

    this.answerButtons.forEach((entry, index) => {
      if (index === correctIndex) {
        entry.bg.setFillStyle(0x15803d, 0.96)
      } else if (index === selectedIndex) {
        entry.bg.setFillStyle(0xb91c1c, 0.96)
      } else {
        entry.bg.setFillStyle(0x334155, 0.86)
      }
    })

    if (isCorrect) {
      this.combo += 1
      this.flameSpeed = Math.max(220, this.flameSpeed - 18)
      this.quizFeedbackText.setText(`せいかい！ ${this.currentQuiz.explanation}`)
    } else {
      this.combo = 0
      this.flameSpeed += 70
      this.quizFeedbackText.setText(`ざんねん！ ${this.currentQuiz.explanation} 炎が速くなった！`)
    }

    this.updateHud()

    this.time.delayedCall(1500, () => {
      this.quizLayer.setVisible(false)
      this.quizActive = false
      this.quizResolved = false
      this.physics.resume()
    })
  }

  takeHit() {
    if (this.hitCooldown || this.gameOver) {
      return
    }

    this.hitCooldown = true
    this.lives -= 1
    this.combo = 0
    this.flameSpeed += 30
    this.cameras.main.shake(180, 0.007)
    this.playerBody.setFillStyle(0xfca5a5)

    this.time.delayedCall(380, () => {
      this.playerBody.setFillStyle(0xf8fafc)
      this.hitCooldown = false
    })

    if (this.lives <= 0) {
      this.finishGame()
    }

    this.updateHud()
  }

  finishGame() {
    this.gameOver = true
    this.spawnTimer?.remove(false)
    this.physics.pause()
    const score = Math.floor(this.survivalTime / 1000)

    if (score > this.bestScore) {
      this.bestScore = score
      window.localStorage.setItem('papa-best-score', String(score))
    }

    this.helpText.setText(`ゲームオーバー ${score}秒生存。Rキーで再スタート`)
  }

  updateHud() {
    this.scoreText.setText(`生存 ${Math.floor(this.survivalTime / 1000)}秒   コンボ ${this.combo}   ライフ ${this.lives}`)
    this.statusText.setText(`炎スピード ${Math.round(this.flameSpeed)}   ベスト ${this.bestScore}秒`)
  }

  update(_, delta) {
    this.backMountains.tilePositionX += 0.18 * delta
    this.frontGround.tilePositionX += 0.35 * delta

    if (Phaser.Input.Keyboard.JustDown(this.keys.R) && this.gameOver) {
      this.physics.resume()
      this.resetRound()
      return
    }

    if (this.gameOver) {
      return
    }

    if (!this.quizActive) {
      const moveUp = this.cursors.up.isDown || this.keys.W.isDown
      const moveDown = this.cursors.down.isDown || this.keys.S.isDown
      const speed = 280

      if (moveUp) {
        this.player.y -= speed * (delta / 1000)
      }
      if (moveDown) {
        this.player.y += speed * (delta / 1000)
      }

      this.player.y = Phaser.Math.Clamp(this.player.y, 90, HEIGHT - 94)
      this.playerHitbox.y = this.player.y

      const targetEnemyY = Phaser.Math.Linear(this.enemy.y, this.player.y, 0.03)
      this.enemy.y = Phaser.Math.Clamp(targetEnemyY, 80, HEIGHT - 90)

      this.survivalTime += delta
      this.quizCooldown -= delta

      if (this.quizCooldown <= 0) {
        this.startQuiz()
      }
    }

    this.flames.getChildren().forEach((flame) => {
      flame.x += flame.getData('speedX') * (delta / 1000)
      flame.y += flame.getData('speedY') * (delta / 1000)

      if (flame.y < 70 || flame.y > HEIGHT - 80) {
        flame.setData('speedY', flame.getData('speedY') * -1)
      }

      if (flame.x < -40) {
        this.flames.remove(flame, true, true)
        return
      }

      const distance = Phaser.Math.Distance.Between(flame.x, flame.y, this.playerHitbox.x, this.playerHitbox.y)
      if (distance < 34) {
        this.flames.remove(flame, true, true)
        this.takeHit()
      }
    })

    this.updateHud()
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game-root',
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: '#020617',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [PapaScene],
})

window.addEventListener('beforeunload', () => {
  game.destroy(true)
})
