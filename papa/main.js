import Phaser from 'phaser'
import { quizBank } from './quizBank.js'

const WIDTH = 960
const HEIGHT = 540
const QUIZ_INTERVAL = 18000
const ROUND_TIME = 60
const BEST_SCORE_KEY = 'papa-crane-best-score'

class PapaScene extends Phaser.Scene {
  constructor() {
    super('PapaScene')
    this.bestScore = Number(window.localStorage.getItem(BEST_SCORE_KEY) || 0)
    this.quizCooldown = QUIZ_INTERVAL
    this.quizActive = false
    this.roundOver = false
    this.dropInProgress = false
    this.score = 0
    this.timeLeft = ROUND_TIME
    this.grabRadius = 58
  }

  create() {
    this.createBackground()
    this.createMachine()
    this.createPrizeField()
    this.createHud()
    this.createQuizOverlay()
    this.createInput()
    this.resetRound()
  }

  createBackground() {
    this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x0f172a)
    this.add.rectangle(WIDTH / 2, 88, WIDTH, 176, 0x38bdf8, 0.16)
    this.add.rectangle(WIDTH / 2, HEIGHT - 90, WIDTH, 180, 0x7c3aed, 0.12)
    this.add.rectangle(WIDTH / 2, HEIGHT - 30, WIDTH, 60, 0x4c1d95, 0.82)
  }

  createMachine() {
    this.add.rectangle(WIDTH / 2, 250, 820, 360, 0xe2e8f0, 0.08).setStrokeStyle(4, 0xcbd5e1, 0.25)
    this.add.rectangle(84, 326, 96, 148, 0xf59e0b, 0.22).setStrokeStyle(3, 0xfde68a, 0.55)
    this.add.text(84, 274, 'GET!', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '24px',
      color: '#fef3c7',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    this.craneRail = this.add.rectangle(WIDTH / 2, 96, 720, 10, 0x94a3b8, 0.9)
    this.craneHead = this.add.container(WIDTH / 2, 110)
    const head = this.add.rectangle(0, 0, 92, 34, 0xf8fafc).setStrokeStyle(3, 0x475569, 0.4)
    const light = this.add.circle(24, 0, 7, 0xf59e0b)
    this.cable = this.add.rectangle(0, 100, 4, 160, 0xe2e8f0)
    this.leftArm = this.add.line(-16, 182, 0, 0, -18, 24, 0xf8fafc).setLineWidth(4)
    this.rightArm = this.add.line(16, 182, 0, 0, 18, 24, 0xf8fafc).setLineWidth(4)
    this.craneHead.add([head, light, this.cable, this.leftArm, this.rightArm])
  }

  createPrizeField() {
    this.prizeGroup = this.add.group()
  }

  createPrize(x, y, label, fill) {
    const prize = this.add.container(x, y)
    const body = this.add.circle(0, 0, 24, fill)
    const shine = this.add.circle(-8, -8, 7, 0xffffff, 0.45)
    const text = this.add.text(0, 0, label, {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '14px',
      color: '#0f172a',
      fontStyle: 'bold',
    }).setOrigin(0.5)
    prize.add([body, shine, text])
    prize.setData('label', label)
    prize.setData('value', 1)
    return prize
  }

  populatePrizes() {
    this.prizeGroup.clear(true, true)

    const labels = ['卑弥呼', '大仏', '金閣', '信長', '家康', '北斎', '龍馬', '土偶']
    const colors = [0xfda4af, 0x93c5fd, 0xfcd34d, 0x86efac, 0xc4b5fd, 0x67e8f9, 0xfdba74, 0xf9a8d4]

    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 5; col += 1) {
        const x = 220 + col * 122 + Phaser.Math.Between(-10, 10)
        const y = 300 + row * 72 + Phaser.Math.Between(-8, 8)
        const index = (row * 5 + col) % labels.length
        const prize = this.createPrize(x, y, labels[index], colors[index])
        this.prizeGroup.add(prize)
      }
    }
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
    this.helpText = this.add.text(24, HEIGHT - 40, '← → で移動 / Space でつかむ', {
      fontFamily: 'Trebuchet MS, sans-serif',
      fontSize: '18px',
      color: '#e2e8f0',
    })
  }

  createQuizOverlay() {
    this.quizLayer = this.add.container(0, 0).setDepth(30).setVisible(false)
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
      bg.on('pointerdown', () => {
        if (!this.quizResolved) {
          this.resolveQuiz(index)
        }
      })

      button.add([bg, label])
      this.answerButtons.push({ bg, label })
      this.quizLayer.add(button)
    }

    this.quizLayer.add(this.quizFeedbackText)
  }

  createInput() {
    this.cursors = this.input.keyboard.createCursorKeys()
    this.keys = this.input.keyboard.addKeys('A,D,SPACE,R')
  }

  resetRound() {
    this.roundOver = false
    this.quizActive = false
    this.quizResolved = false
    this.dropInProgress = false
    this.score = 0
    this.timeLeft = ROUND_TIME
    this.quizCooldown = QUIZ_INTERVAL
    this.grabRadius = 58
    this.craneHead.x = WIDTH / 2
    this.craneHead.y = 110
    this.cable.height = 160
    this.leftArm.setTo(-16, 182, 0, 0, -18, 24)
    this.rightArm.setTo(16, 182, 0, 0, 18, 24)
    this.populatePrizes()
    this.quizLayer.setVisible(false)
    this.helpText.setText('← → で移動 / Space でつかむ')
    this.updateHud()
  }

  startQuiz() {
    this.quizActive = true
    this.quizResolved = false
    this.quizCooldown = QUIZ_INTERVAL
    this.currentQuiz = Phaser.Utils.Array.GetRandom(quizBank)
    this.quizPromptText.setText(this.currentQuiz.question)
    this.quizFeedbackText.setText('正解するとボーナス。不正解だとキャッチしにくくなる。')
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
      this.timeLeft = Math.min(ROUND_TIME, this.timeLeft + 5)
      this.grabRadius = Math.min(76, this.grabRadius + 4)
      this.quizFeedbackText.setText(`せいかい！ ${this.currentQuiz.explanation} のこり時間がふえた！`)
    } else {
      this.grabRadius = Math.max(42, this.grabRadius - 6)
      this.quizFeedbackText.setText(`ざんねん！ ${this.currentQuiz.explanation} アームが少しシビアになった！`)
    }

    this.updateHud()

    this.time.delayedCall(1500, () => {
      this.quizLayer.setVisible(false)
      this.quizActive = false
      this.quizResolved = false
    })
  }

  attemptGrab(targetY) {
    const prizes = this.prizeGroup.getChildren()
    let nearestPrize = null
    let nearestDistance = Number.POSITIVE_INFINITY

    prizes.forEach((prize) => {
      const distance = Phaser.Math.Distance.Between(this.craneHead.x, targetY, prize.x, prize.y)
      if (distance < this.grabRadius && distance < nearestDistance) {
        nearestDistance = distance
        nearestPrize = prize
      }
    })

    return nearestPrize
  }

  runDropSequence() {
    if (this.dropInProgress || this.quizActive || this.roundOver) {
      return
    }

    this.dropInProgress = true
    const dropY = 320

    this.tweens.add({
      targets: this.craneHead,
      y: dropY,
      duration: 500,
      onUpdate: () => {
        this.cable.height = this.craneHead.y + 50
      },
      onComplete: () => {
        const grabbedPrize = this.attemptGrab(dropY + 72)

        if (grabbedPrize) {
          grabbedPrize.setDepth(10)
          this.tweens.add({
            targets: grabbedPrize,
            x: this.craneHead.x,
            y: this.craneHead.y + 78,
            duration: 180,
            onComplete: () => this.returnWithPrize(grabbedPrize),
          })
        } else {
          this.returnEmpty()
        }
      },
    })
  }

  returnWithPrize(prize) {
    this.tweens.add({
      targets: this.craneHead,
      x: 126,
      y: 118,
      duration: 800,
      onUpdate: () => {
        this.cable.height = this.craneHead.y + 42
        prize.x = this.craneHead.x
        prize.y = this.craneHead.y + 78
      },
      onComplete: () => {
        this.prizeGroup.remove(prize, true, true)
        this.score += prize.getData('value')
        this.helpText.setText(`「${prize.getData('label')}」をゲット！`)

        if (this.prizeGroup.getLength() === 0) {
          this.populatePrizes()
        }

        this.returnEmpty()
      },
    })
  }

  returnEmpty() {
    this.tweens.add({
      targets: this.craneHead,
      y: 110,
      duration: 450,
      onUpdate: () => {
        this.cable.height = this.craneHead.y + 50
      },
      onComplete: () => {
        this.cable.height = 160
        this.dropInProgress = false
        this.updateHud()
      },
    })
  }

  finishRound() {
    this.roundOver = true
    const savedBest = Number(window.localStorage.getItem(BEST_SCORE_KEY) || 0)

    if (this.score > savedBest) {
      this.bestScore = this.score
      window.localStorage.setItem(BEST_SCORE_KEY, String(this.score))
    } else {
      this.bestScore = savedBest
    }

    this.helpText.setText(`ゲーム終了！ ${this.score}こゲット。Rキーで再スタート`)
    this.updateHud()
  }

  updateHud() {
    this.scoreText.setText(`ゲット ${this.score}こ   のこり ${Math.ceil(this.timeLeft)}秒`)
    this.statusText.setText(`ベスト ${this.bestScore}こ   つかみやすさ ${this.grabRadius}`)
  }

  update(_, delta) {
    if (this.roundOver) {
      if (Phaser.Input.Keyboard.JustDown(this.keys.R)) {
        this.resetRound()
      }
      return
    }

    if (!this.quizActive) {
      const moveLeft = this.cursors.left.isDown || this.keys.A.isDown
      const moveRight = this.cursors.right.isDown || this.keys.D.isDown
      const moveSpeed = 260 * (delta / 1000)

      if (!this.dropInProgress && moveLeft) {
        this.craneHead.x = Phaser.Math.Clamp(this.craneHead.x - moveSpeed, 180, 780)
      }
      if (!this.dropInProgress && moveRight) {
        this.craneHead.x = Phaser.Math.Clamp(this.craneHead.x + moveSpeed, 180, 780)
      }

      if (!this.dropInProgress && Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
        this.runDropSequence()
      }

      this.timeLeft -= delta / 1000
      this.quizCooldown -= delta

      if (this.quizCooldown <= 0) {
        this.startQuiz()
      }

      if (this.timeLeft <= 0) {
        this.timeLeft = 0
        this.finishRound()
      }
    }

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
