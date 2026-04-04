import './style.css'

const machine = {
  width: 900,
  height: 480,
  railY: 54,
  leftWallX: 60,
  rightWallX: 840,
  leftBarX: 255,
  rightBarX: 515,
  barY: 312,
  barWidth: 130,
  barHeight: 12,
  floorY: 438,
}

const state = {
  coins: 5,
  plays: 0,
  wins: 0,
  armX: 450,
  armY: machine.railY,
  phase: 'idle',
  moveLeft: false,
  moveRight: false,
  status: '左右で位置を合わせ、タイミングを見てアームを下ろそう。',
  memo: '箱の角を狙って、上がるときに少し持ち上げるのが基本です。',
  history: [],
  box: null,
  grab: null,
}

const app = document.querySelector('#app')

app.innerHTML = `
  <main class="game-shell">
    <section class="hero-panel">
      <div>
        <p class="eyebrow">Bridge Crane</p>
        <h1>橋渡しのクレーンゲーム</h1>
        <p class="intro">
          景品箱は2本の棒にまたがって置かれています。アームを自分で動かし、<strong>引き上げながら少しずつ箱をずらして、最後に2本の棒の間へ通せば成功</strong>です。
        </p>
      </div>
      <div class="score-card">
        <div>
          <span>コイン</span>
          <strong id="coin-count">5</strong>
        </div>
        <div>
          <span>プレイ</span>
          <strong id="play-count">0</strong>
        </div>
        <div>
          <span>成功</span>
          <strong id="win-count">0</strong>
        </div>
      </div>
    </section>

    <section class="main-grid">
      <section class="panel machine-panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Machine</p>
            <h2>橋渡しステージ</h2>
          </div>
          <button id="drop-button" class="action-button primary" type="button">アームを下ろす</button>
        </div>
        <canvas id="game-canvas" class="game-canvas" width="900" height="480" aria-label="橋渡しクレーンゲーム"></canvas>
        <p id="status-text" class="status-text">左右で位置を合わせ、タイミングを見てアームを下ろそう。</p>
      </section>

      <section class="panel control-panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Controls</p>
            <h2>操作</h2>
          </div>
        </div>

        <div class="control-grid">
          <button id="left-button" class="action-button secondary" type="button">← 左へ</button>
          <button id="drop-side-button" class="action-button primary" type="button">↓ 下ろす</button>
          <button id="right-button" class="action-button secondary" type="button">右へ →</button>
        </div>

        <div class="tip-card">
          <p class="eyebrow">Tips</p>
          <p>中心より少し外した位置で当てると、片側だけ持ち上がって箱が進みやすくなります。</p>
          <p>一気に落とすのではなく、何回かで角度をつけて、支えを減らしていきます。</p>
          <p>操作キーは ← → Space でも使えます。</p>
        </div>

        <button id="reset-button" class="action-button secondary" type="button">箱を置き直す</button>
      </section>
    </section>

    <section class="insight-grid">
      <article class="insight-card">
        <p class="eyebrow">Prize Box</p>
        <h3>箱の状態</h3>
        <p id="box-state"></p>
      </article>
      <article class="insight-card">
        <p class="eyebrow">Machine Memo</p>
        <h3>攻略メモ</h3>
        <p id="memo-text">箱の角を狙って、上がるときに少し持ち上げるのが基本です。</p>
      </article>
      <article class="insight-card">
        <p class="eyebrow">Log</p>
        <h3>プレーログ</h3>
        <ol id="history-list" class="history-list"></ol>
      </article>
    </section>
  </main>
`

const coinCountEl = document.querySelector('#coin-count')
const playCountEl = document.querySelector('#play-count')
const winCountEl = document.querySelector('#win-count')
const statusTextEl = document.querySelector('#status-text')
const boxStateEl = document.querySelector('#box-state')
const memoTextEl = document.querySelector('#memo-text')
const historyListEl = document.querySelector('#history-list')
const dropButton = document.querySelector('#drop-button')
const dropSideButton = document.querySelector('#drop-side-button')
const leftButton = document.querySelector('#left-button')
const rightButton = document.querySelector('#right-button')
const resetButton = document.querySelector('#reset-button')
const canvas = document.querySelector('#game-canvas')
const ctx = canvas.getContext('2d')

function createBox() {
  return {
    x: 450,
    y: 286,
    width: 146,
    height: 44,
    angle: 0.05,
    vx: 0,
    vy: 0,
    falling: false,
    won: false,
    settled: true,
  }
}

function addHistory(text) {
  state.history = [text, ...state.history].slice(0, 6)
  historyListEl.innerHTML = state.history.length
    ? state.history.map((entry) => `<li>${entry}</li>`).join('')
    : '<li>まだプレイ記録はありません。</li>'
}

function resetPrizeBox() {
  state.box = createBox()
  state.grab = null
  state.armX = 450
  state.armY = machine.railY
  state.phase = 'idle'
  state.status = '箱の端を狙って、少しずつ横へ送ろう。'
  state.memo = '箱の角を狙って、上がるときに少し持ち上げるのが基本です。'
}

function drawRoundedRect(x, y, width, height, radius) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

function drawMachine() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = '#dbeafe'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = '#cbd5e1'
  ctx.fillRect(42, 24, 816, 24)

  ctx.fillStyle = '#94a3b8'
  ctx.fillRect(machine.leftWallX, 48, 18, 366)
  ctx.fillRect(machine.rightWallX - 18, 48, 18, 366)

  ctx.fillStyle = '#334155'
  ctx.fillRect(machine.leftBarX, machine.barY, machine.barWidth, machine.barHeight)
  ctx.fillRect(machine.rightBarX, machine.barY, machine.barWidth, machine.barHeight)

  const gapX = machine.leftBarX + machine.barWidth
  const gapWidth = machine.rightBarX - gapX
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(gapX, machine.barY + 4, gapWidth, 108)
  ctx.strokeStyle = '#f59e0b'
  ctx.lineWidth = 3
  ctx.strokeRect(gapX, machine.barY + 8, gapWidth, 88)

  ctx.strokeStyle = '#475569'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(state.armX, machine.railY)
  ctx.lineTo(state.armX, state.armY)
  ctx.stroke()

  ctx.fillStyle = '#e2e8f0'
  ctx.fillRect(state.armX - 29, state.armY, 12, 66)
  ctx.fillRect(state.armX + 17, state.armY, 12, 66)
  ctx.fillStyle = '#94a3b8'
  ctx.fillRect(state.armX - 18, state.armY + 58, 14, 10)
  ctx.fillRect(state.armX + 4, state.armY + 58, 14, 10)
}

function drawPrizeBox() {
  const box = state.box
  ctx.save()
  ctx.translate(box.x, box.y)
  ctx.rotate(box.angle)
  ctx.fillStyle = '#f97316'
  drawRoundedRect(-box.width / 2, -box.height / 2, box.width, box.height, 10)
  ctx.fill()
  ctx.fillStyle = '#fdba74'
  ctx.fillRect(-12, -box.height / 2, 24, box.height)
  ctx.restore()
}

function getSupports(box) {
  const leftEdge = box.x - box.width / 2
  const rightEdge = box.x + box.width / 2
  const leftSupport = Math.max(
    0,
    Math.min(rightEdge, machine.leftBarX + machine.barWidth) - Math.max(leftEdge, machine.leftBarX),
  )
  const rightSupport = Math.max(
    0,
    Math.min(rightEdge, machine.rightBarX + machine.barWidth) - Math.max(leftEdge, machine.rightBarX),
  )

  return { leftSupport, rightSupport }
}

function updateHud() {
  coinCountEl.textContent = String(state.coins)
  playCountEl.textContent = String(state.plays)
  winCountEl.textContent = String(state.wins)
  statusTextEl.textContent = state.status
  memoTextEl.textContent = state.memo

  const supports = getSupports(state.box)
  boxStateEl.textContent = state.box.won
    ? '2本の棒の間を通って落ちた。成功です。'
    : state.box.falling
      ? '箱が棒の間へ落下中。'
      : `左の支え ${Math.round(supports.leftSupport)} / 右の支え ${Math.round(supports.rightSupport)} / 角度 ${(state.box.angle * 57.3).toFixed(1)}°`
}

function beginDrop() {
  if (state.phase !== 'idle' || state.box.won || state.coins <= 0) {
    return
  }

  state.coins -= 1
  state.plays += 1
  state.phase = 'descending'
  state.status = 'アーム下降中。どこを持ち上げるか見よう。'
  addHistory(`プレイ ${state.plays} 回目: アームを下降`)
}

function tryGrabBox() {
  const box = state.box
  const horizontalOffset = state.armX - box.x

  if (Math.abs(horizontalOffset) > box.width / 2 + 24) {
    state.grab = null
    state.status = '箱に届かなかった。位置を少し修正して再挑戦。'
    state.memo = '中心から離れすぎると箱を持ち上げられません。'
    return
  }

  const side = horizontalOffset < 0 ? 'left' : 'right'
  const edgeFactor = Math.min(1, Math.abs(horizontalOffset) / (box.width / 2))
  state.grab = {
    side,
    strength: 0.8 + edgeFactor * 0.7,
    edgeFactor,
  }

  state.status = side === 'left' ? '左側を持ち上げた。戻りで箱が右へずれる。' : '右側を持ち上げた。戻りで箱が左へずれる。'
  state.memo = edgeFactor > 0.55 ? '良い位置です。角をしっかり持ち上げられています。' : 'もう少し端を狙うと、さらに大きく動かせます。'
}

function applyLiftMotion() {
  const box = state.box
  const grab = state.grab
  if (!grab || box.falling) {
    return
  }

  const liftDirection = grab.side === 'left' ? 1 : -1
  const shift = (1.1 + grab.edgeFactor * 1.6) * liftDirection
  box.x += shift
  box.y -= 0.28 * grab.strength
  box.angle += 0.012 * liftDirection * grab.strength
  box.angle = Math.max(-0.72, Math.min(0.72, box.angle))

  const supports = getSupports(box)
  if (supports.leftSupport < 18 || supports.rightSupport < 18) {
    box.falling = true
    box.vx = shift * 0.52
    box.vy = 1.8
    state.status = '支えが減って、箱が棒の間へ落ち始めた。'
    state.memo = 'このまま棒の間を通れば成功です。'
  }
}

function updateArm() {
  if (state.phase === 'idle') {
    if (state.moveLeft) state.armX = Math.max(120, state.armX - 4)
    if (state.moveRight) state.armX = Math.min(780, state.armX + 4)
    return
  }

  if (state.phase === 'descending') {
    state.armY += 8
    if (state.armY >= state.box.y - 70) {
      tryGrabBox()
      state.phase = 'ascending'
    }
    return
  }

  if (state.phase === 'ascending') {
    state.armY -= 9
    applyLiftMotion()
    if (state.armY <= machine.railY) {
      state.armY = machine.railY
      state.phase = 'idle'
      state.grab = null
      if (!state.box.falling && !state.box.won) {
        state.status = 'アームが戻った。もう一度少しずつずらそう。'
      }
    }
  }
}

function updateBoxPhysics() {
  const box = state.box
  if (!box.falling) {
    return
  }

  box.x += box.vx
  box.y += box.vy
  box.vy += 0.18
  box.angle += box.vx * 0.015

  if (box.y >= machine.floorY) {
    const gapLeft = machine.leftBarX + machine.barWidth
    const gapRight = machine.rightBarX
    box.falling = false

    if (box.x > gapLeft && box.x < gapRight) {
      box.won = true
      state.wins += 1
      state.status = '成功。箱が2本の棒の間を通った。'
      state.memo = '片側を何回か持ち上げて、支えを減らせたのが勝因です。'
      addHistory(`プレイ ${state.plays} 回目: 棒の間に落として成功`)
    } else {
      state.status = '惜しい。外側へ落ちた。'
      state.memo = 'もう少し中央寄りで支えを減らすと、棒の間へ落ちやすくなります。'
      addHistory(`プレイ ${state.plays} 回目: 外側へ落ちて失敗`)
    }
  }
}

function loop() {
  updateArm()
  updateBoxPhysics()
  drawMachine()
  drawPrizeBox()
  updateHud()
  requestAnimationFrame(loop)
}

function setDirection(direction, pressed) {
  if (direction === 'left') state.moveLeft = pressed
  if (direction === 'right') state.moveRight = pressed
}

document.addEventListener('keydown', (event) => {
  if (event.code === 'ArrowLeft') setDirection('left', true)
  if (event.code === 'ArrowRight') setDirection('right', true)
  if (event.code === 'Space') {
    event.preventDefault()
    beginDrop()
  }
})

document.addEventListener('keyup', (event) => {
  if (event.code === 'ArrowLeft') setDirection('left', false)
  if (event.code === 'ArrowRight') setDirection('right', false)
})

leftButton.addEventListener('pointerdown', () => setDirection('left', true))
leftButton.addEventListener('pointerup', () => setDirection('left', false))
leftButton.addEventListener('pointerleave', () => setDirection('left', false))
rightButton.addEventListener('pointerdown', () => setDirection('right', true))
rightButton.addEventListener('pointerup', () => setDirection('right', false))
rightButton.addEventListener('pointerleave', () => setDirection('right', false))
dropButton.addEventListener('click', beginDrop)
dropSideButton.addEventListener('click', beginDrop)
resetButton.addEventListener('click', () => {
  resetPrizeBox()
  addHistory('箱を置き直した')
})

historyListEl.innerHTML = '<li>まだプレイ記録はありません。</li>'
resetPrizeBox()
updateHud()
loop()
