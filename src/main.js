import './style.css'

const machine = {
  width: 900,
  height: 480,
  railY: 62,
  leftBarX: 270,
  rightBarX: 510,
  barY: 300,
  barWidth: 140,
  barHeight: 12,
  floorY: 430,
}

const state = {
  coins: 5,
  plays: 0,
  wins: 0,
  armX: 430,
  armY: machine.railY,
  dropping: false,
  rising: false,
  movingLeft: false,
  movingRight: false,
  status: '左右に動かして、狙った位置でアームを下ろそう。',
  box: {},
}

const app = document.querySelector('#app')

app.innerHTML = `
  <main class="game-shell">
    <section class="hero-panel">
      <div>
        <p class="eyebrow">Bridge Crane</p>
        <h1>橋渡しのクレーンゲーム</h1>
        <p class="intro">
          箱を2本バーの上で少しずつずらし、2本のバーの間へ落とす橋渡しゲームです。
          <strong>アームは左右移動して、タイミングよく下降させます。</strong>
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
        <p id="status-text" class="status-text">左右に動かして、狙った位置でアームを下ろそう。</p>
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
          <p>箱の左か右の角を押すと、少し回転しながら前に進みます。</p>
          <p>片側の支えが少なくなると、箱がバーの間へ落ちやすくなります。</p>
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
        <p id="memo-text">最初は中心より少し右か左を押して角度をつけると動かしやすいです。</p>
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
    x: 430,
    y: 264,
    width: 144,
    height: 42,
    angle: 0.06,
    falling: false,
    vx: 0,
    vy: 0,
    settled: true,
    won: false,
  }
}

function resetPrizeBox() {
  state.box = createBox()
  state.armX = 430
  state.armY = machine.railY
  state.dropping = false
  state.rising = false
  state.status = '箱の端を押して、少しずつ前へ送ろう。'
  memoTextEl.textContent = '最初は中心より少し右か左を押して角度をつけると動かしやすいです。'
}

function addHistory(text) {
  state.history = [text, ...(state.history ?? [])].slice(0, 6)
  historyListEl.innerHTML = state.history.length
    ? state.history.map((entry) => `<li>${entry}</li>`).join('')
    : '<li>まだプレイ記録はありません。</li>'
}

state.history = []

function renderHud() {
  coinCountEl.textContent = String(state.coins)
  playCountEl.textContent = String(state.plays)
  winCountEl.textContent = String(state.wins)
  statusTextEl.textContent = state.status
  boxStateEl.textContent = state.box.won
    ? '2本のバーの間に落ちた。成功です。'
    : state.box.falling
      ? '箱が落下中。位置を見守ろう。'
      : `箱の角度 ${(state.box.angle * 57.3).toFixed(1)}° / 横位置 ${Math.round(state.box.x)}`
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
  ctx.fillRect(40, 24, 820, 24)

  ctx.fillStyle = '#94a3b8'
  ctx.fillRect(60, 48, 18, 360)
  ctx.fillRect(822, 48, 18, 360)

  ctx.fillStyle = '#334155'
  ctx.fillRect(machine.leftBarX, machine.barY, machine.barWidth, machine.barHeight)
  ctx.fillRect(machine.rightBarX, machine.barY, machine.barWidth, machine.barHeight)

  ctx.fillStyle = '#0f172a'
  ctx.fillRect(machine.leftBarX + machine.barWidth, machine.barY + 2, machine.rightBarX - (machine.leftBarX + machine.barWidth), 120)
  ctx.strokeStyle = '#f59e0b'
  ctx.lineWidth = 3
  ctx.strokeRect(machine.leftBarX + machine.barWidth, machine.barY + 8, machine.rightBarX - (machine.leftBarX + machine.barWidth), 90)

  ctx.strokeStyle = '#475569'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(state.armX, machine.railY)
  ctx.lineTo(state.armX, state.armY)
  ctx.stroke()

  ctx.fillStyle = '#e2e8f0'
  ctx.fillRect(state.armX - 26, state.armY, 12, 52)
  ctx.fillRect(state.armX + 14, state.armY, 12, 52)
  ctx.fillStyle = '#94a3b8'
  ctx.fillRect(state.armX - 16, state.armY + 44, 14, 10)
  ctx.fillRect(state.armX + 2, state.armY + 44, 14, 10)
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

function startDrop() {
  if (state.dropping || state.rising || state.box.won || state.coins <= 0) {
    return
  }

  state.coins -= 1
  state.plays += 1
  state.dropping = true
  state.status = 'アーム下降中。箱に当たる位置を見よう。'
  addHistory(`プレイ ${state.plays} 回目: アームを下降`)
}

function nudgeBox() {
  const box = state.box
  const leftBarRight = machine.leftBarX + machine.barWidth
  const rightBarLeft = machine.rightBarX
  const horizontalOffset = state.armX - box.x
  if (Math.abs(horizontalOffset) > box.width / 2 + 18) {
    state.status = '箱に届かなかった。位置を少しずらして再挑戦。'
    memoTextEl.textContent = '中心から外しすぎると箱に当たりません。'
    return
  }

  const force = horizontalOffset > 0 ? 1 : -1
  const edgeHit = Math.abs(horizontalOffset) / (box.width / 2)
  box.x += force * (12 + edgeHit * 18)
  box.angle += force * (0.05 + edgeHit * 0.06)
  box.angle = Math.max(-0.55, Math.min(0.55, box.angle))

  const nextLeft = box.x - box.width / 2
  const nextRight = box.x + box.width / 2
  const leftSupport = Math.max(0, Math.min(nextRight, leftBarRight) - Math.max(nextLeft, machine.leftBarX))
  const rightSupport = Math.max(0, Math.min(nextRight, machine.rightBarX + machine.barWidth) - Math.max(nextLeft, rightBarLeft))

  if (leftSupport < 30 || rightSupport < 30) {
    box.falling = true
    box.vx = force * (0.8 + edgeHit * 0.4)
    box.vy = 2.2
    box.settled = false
    state.status = '支えが少なくなって、箱がバーの間へ落ち始めた。'
    memoTextEl.textContent = 'このまま2本のバーの間へ落ちれば成功です。'
  } else {
    state.status = edgeHit > 0.55 ? '箱の角を押して前に進んだ。もう一度同じ側を狙えます。' : '箱の中心寄りに当たった。次はもっと端を狙うと動きます。'
    memoTextEl.textContent = '端を押すほど回転して前に進みやすくなります。'
  }
}

function updateArm() {
  if (!state.dropping && !state.rising) {
    if (state.movingLeft) state.armX = Math.max(120, state.armX - 4)
    if (state.movingRight) state.armX = Math.min(780, state.armX + 4)
    return
  }

  if (state.dropping) {
    state.armY += 8
    if (state.armY >= state.box.y - 56) {
      nudgeBox()
      state.dropping = false
      state.rising = true
    }
  } else if (state.rising) {
    state.armY -= 10
    if (state.armY <= machine.railY) {
      state.armY = machine.railY
      state.rising = false
    }
  }
}

function updateBox() {
  const box = state.box
  if (!box.falling) {
    return
  }

  box.x += box.vx
  box.y += box.vy
  box.vy += 0.18
  box.angle += box.vx * 0.012

  if (box.y >= machine.floorY) {
    const gapLeft = machine.leftBarX + machine.barWidth
    const gapRight = machine.rightBarX
    if (box.x > gapLeft && box.x < gapRight) {
      box.won = true
      box.falling = false
      state.wins += 1
      state.status = '成功。2本のバーの間に落ちた。'
      addHistory(`プレイ ${state.plays} 回目: バーの間に落として成功`)
      memoTextEl.textContent = '片側の支えを減らして、中央の隙間へ落とせました。'
    } else {
      box.falling = false
      state.status = '惜しい。バーの外側へ落ちた。'
      addHistory(`プレイ ${state.plays} 回目: 外側へ落ちて失敗`)
      memoTextEl.textContent = 'バーの間の真上で落ちるように、ずらし幅を小さく調整すると良いです。'
    }
  }
}

function gameLoop() {
  updateArm()
  updateBox()
  drawMachine()
  drawPrizeBox()
  renderHud()
  requestAnimationFrame(gameLoop)
}

function setMove(direction, pressed) {
  if (direction === 'left') state.movingLeft = pressed
  if (direction === 'right') state.movingRight = pressed
}

document.addEventListener('keydown', (event) => {
  if (event.code === 'ArrowLeft') setMove('left', true)
  if (event.code === 'ArrowRight') setMove('right', true)
  if (event.code === 'Space') {
    event.preventDefault()
    startDrop()
  }
})

document.addEventListener('keyup', (event) => {
  if (event.code === 'ArrowLeft') setMove('left', false)
  if (event.code === 'ArrowRight') setMove('right', false)
})

leftButton.addEventListener('pointerdown', () => setMove('left', true))
leftButton.addEventListener('pointerup', () => setMove('left', false))
leftButton.addEventListener('pointerleave', () => setMove('left', false))
rightButton.addEventListener('pointerdown', () => setMove('right', true))
rightButton.addEventListener('pointerup', () => setMove('right', false))
rightButton.addEventListener('pointerleave', () => setMove('right', false))
dropButton.addEventListener('click', startDrop)
dropSideButton.addEventListener('click', startDrop)
resetButton.addEventListener('click', () => {
  resetPrizeBox()
  addHistory('箱を置き直した')
})

historyListEl.innerHTML = '<li>まだプレイ記録はありません。</li>'
resetPrizeBox()
renderHud()
gameLoop()
