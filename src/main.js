import './style.css'

const quizBank = [
  {
    maker: 'Toyota',
    model: 'GR Supra',
    question: 'トヨタのスポーツカー「GR Supra」はどれ？',
    choices: ['GR Supra', 'Prius', 'Alphard', 'Aqua'],
    answerIndex: 0,
    reward: 60,
    explanation: 'GR Supra はトヨタの代表的なスポーツカーです。',
  },
  {
    maker: 'Nissan',
    model: 'GT-R',
    question: '日産の高性能スポーツモデルとして有名なのはどれ？',
    choices: ['Serena', 'NOTE', 'GT-R', 'Cube'],
    answerIndex: 2,
    reward: 65,
    explanation: 'GT-R は日産を代表する高性能スポーツモデルです。',
  },
  {
    maker: 'Mazda',
    model: 'Roadster',
    question: 'マツダの軽快なオープンスポーツカーはどれ？',
    choices: ['CX-5', 'Roadster', 'Demio', 'Bongo'],
    answerIndex: 1,
    reward: 55,
    explanation: 'Roadster は軽さとハンドリングが魅力のスポーツカーです。',
  },
  {
    maker: 'Subaru',
    model: 'BRZ',
    question: 'スバルのFRスポーツクーペはどれ？',
    choices: ['Forester', 'BRZ', 'Levorg', 'Justy'],
    answerIndex: 1,
    reward: 55,
    explanation: 'BRZ は低重心でコーナリングが楽しいFRスポーツです。',
  },
  {
    maker: 'Honda',
    model: 'NSX',
    question: 'ホンダのスーパースポーツとして知られる車はどれ？',
    choices: ['Fit', 'N-BOX', 'Stepwgn', 'NSX'],
    answerIndex: 3,
    reward: 70,
    explanation: 'NSX はホンダのスーパースポーツです。',
  },
  {
    maker: 'Suzuki',
    model: 'Swift Sport',
    question: 'スズキのコンパクトスポーツモデルはどれ？',
    choices: ['Hustler', 'Jimny', 'Swift Sport', 'Solio'],
    answerIndex: 2,
    reward: 50,
    explanation: 'Swift Sport は軽快な走りが人気のコンパクトスポーツです。',
  },
  {
    maker: 'Mitsubishi',
    model: 'Lancer Evolution',
    question: '三菱のラリー系スポーツセダンとして有名なのはどれ？',
    choices: ['Delica', 'Lancer Evolution', 'eK Wagon', 'Outlander'],
    answerIndex: 1,
    reward: 65,
    explanation: 'Lancer Evolution はラリーでも活躍したスポーツセダンです。',
  },
  {
    maker: 'Toyota',
    model: '86',
    question: 'トヨタのFRスポーツカーはどれ？',
    choices: ['Crown', '86', 'Voxy', 'Sienta'],
    answerIndex: 1,
    reward: 55,
    explanation: '86 は操る楽しさを重視したFRスポーツカーです。',
  },
]

const cars = [
  {
    id: 'starter',
    name: 'Street One',
    maker: 'Starter',
    price: 0,
    color: '#7dd3fc',
    speed: 2.6,
    accel: 0.08,
    grip: 0.88,
    drift: 1.0,
    owned: true,
    description: '最初から使える入門FR。扱いやすい。',
  },
  {
    id: 'swift',
    name: 'Swift Sport',
    maker: 'Suzuki',
    price: 140,
    color: '#facc15',
    speed: 2.9,
    accel: 0.085,
    grip: 0.84,
    drift: 1.08,
    description: '軽くて振り回しやすいホットハッチ。',
  },
  {
    id: 'brz',
    name: 'BRZ',
    maker: 'Subaru',
    price: 220,
    color: '#60a5fa',
    speed: 3.15,
    accel: 0.09,
    grip: 0.8,
    drift: 1.2,
    description: 'バランスの良いFRクーペ。ドリフトの基本向け。',
  },
  {
    id: 'supra',
    name: 'GR Supra',
    maker: 'Toyota',
    price: 320,
    color: '#fb7185',
    speed: 3.45,
    accel: 0.1,
    grip: 0.75,
    drift: 1.35,
    description: '大パワーで角度を作りやすい上級モデル。',
  },
  {
    id: 'gtr',
    name: 'GT-R',
    maker: 'Nissan',
    price: 420,
    color: '#c084fc',
    speed: 3.7,
    accel: 0.105,
    grip: 0.82,
    drift: 1.22,
    description: '加速が鋭いハイパワー車。立ち上がりが速い。',
  },
]

const state = {
  coins: 80,
  currentQuestion: null,
  answerResolved: false,
  selectedCarId: 'starter',
  garage: cars.map((car) => ({ ...car })),
  history: [],
  quizDeck: [],
  driftScore: 0,
  bestScore: 0,
  driftStatus: 'アクセルで加速、左右で向きを変えよう。',
}

const input = {
  up: false,
  down: false,
  left: false,
  right: false,
}

const track = {
  width: 880,
  height: 440,
  centerX: 440,
  centerY: 220,
  outerRx: 340,
  outerRy: 150,
  innerRx: 220,
  innerRy: 70,
}

const carState = {
  x: track.centerX,
  y: track.centerY + 110,
  angle: -Math.PI / 2,
  velocityX: 0,
  velocityY: 0,
  driftChain: 0,
}

const app = document.querySelector('#app')

app.innerHTML = `
  <main class="game-shell">
    <section class="hero-panel">
      <div>
        <p class="eyebrow">Quiz Drift Garage</p>
        <h1>車種クイズでコインを集めて ドリフトしよう</h1>
        <p class="intro">
          車の車種クイズに正解するとコインを獲得。コインで車を買い、選んだ車でドリフト走行ができます。
        </p>
      </div>
      <div class="score-card">
        <div>
          <span>コイン</span>
          <strong id="coin-count">80</strong>
        </div>
        <div>
          <span>所持台数</span>
          <strong id="owned-count">1</strong>
        </div>
        <div>
          <span>ベスト</span>
          <strong id="best-score">0</strong>
        </div>
      </div>
    </section>

    <section class="dashboard-grid">
      <section class="panel quiz-panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Car Quiz</p>
            <h2 id="quiz-title">車種を当てよう</h2>
          </div>
          <button id="next-quiz" class="action-button secondary" type="button">次のクイズ</button>
        </div>
        <p id="question-text" class="question-text"></p>
        <div id="answer-buttons" class="answer-grid"></div>
        <p id="quiz-feedback" class="quiz-feedback">正解するとコインがもらえます。</p>
      </section>

      <section class="panel garage-panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Garage</p>
            <h2>車を買う</h2>
          </div>
          <p id="selected-car" class="selected-car">選択中: Street One</p>
        </div>
        <div id="garage-list" class="garage-list"></div>
      </section>
    </section>

    <section class="panel drift-panel">
      <div class="panel-head">
        <div>
          <p class="eyebrow">Drift Run</p>
          <h2 id="drift-car-name">Street Oneで走行中</h2>
        </div>
        <div class="drift-stats">
          <span>スコア <strong id="drift-score">0</strong></span>
          <span>コンボ <strong id="drift-chain">0</strong></span>
        </div>
      </div>
      <canvas id="drift-canvas" class="drift-canvas" width="880" height="440" aria-label="ドリフトコース"></canvas>
      <p id="drift-status" class="drift-status">アクセルで加速、左右で向きを変えよう。</p>
      <p class="hint-text">操作: ↑ アクセル / ↓ ブレーキ / ← → ステア</p>
    </section>

    <section class="insight-grid">
      <article class="insight-card">
        <p class="eyebrow">Shop Note</p>
        <h3>購入のコツ</h3>
        <p id="shop-note">最初は安い車で台数を増やし、次に速い車を狙うと遊びやすいです。</p>
      </article>
      <article class="insight-card">
        <p class="eyebrow">Car Data</p>
        <h3>選択車の性能</h3>
        <p id="car-specs"></p>
      </article>
      <article class="insight-card">
        <p class="eyebrow">Log</p>
        <h3>直近の結果</h3>
        <ol id="history-list" class="history-list"></ol>
      </article>
    </section>
  </main>
`

const coinCountEl = document.querySelector('#coin-count')
const ownedCountEl = document.querySelector('#owned-count')
const bestScoreEl = document.querySelector('#best-score')
const quizTitleEl = document.querySelector('#quiz-title')
const questionTextEl = document.querySelector('#question-text')
const answerButtonsEl = document.querySelector('#answer-buttons')
const quizFeedbackEl = document.querySelector('#quiz-feedback')
const nextQuizButton = document.querySelector('#next-quiz')
const garageListEl = document.querySelector('#garage-list')
const selectedCarEl = document.querySelector('#selected-car')
const driftCanvas = document.querySelector('#drift-canvas')
const driftCarNameEl = document.querySelector('#drift-car-name')
const driftScoreEl = document.querySelector('#drift-score')
const driftChainEl = document.querySelector('#drift-chain')
const driftStatusEl = document.querySelector('#drift-status')
const shopNoteEl = document.querySelector('#shop-note')
const carSpecsEl = document.querySelector('#car-specs')
const historyListEl = document.querySelector('#history-list')

const ctx = driftCanvas.getContext('2d')

function shuffleArray(items) {
  const next = [...items]
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
  }
  return next
}

function getSelectedCar() {
  return state.garage.find((car) => car.id === state.selectedCarId) ?? state.garage[0]
}

function refillQuizDeck() {
  state.quizDeck = shuffleArray(quizBank)
}

function setNextQuestion() {
  if (state.quizDeck.length === 0) {
    refillQuizDeck()
  }

  state.currentQuestion = state.quizDeck.shift()
  state.answerResolved = false
}

function addHistory(text) {
  state.history.unshift(text)
  state.history = state.history.slice(0, 5)
}

function renderHistory() {
  historyListEl.innerHTML = state.history.length
    ? state.history.map((entry) => `<li>${entry}</li>`).join('')
    : '<li>まだ記録はありません。</li>'
}

function renderQuiz() {
  const question = state.currentQuestion
  quizTitleEl.textContent = `${question.maker}の車種クイズ`
  questionTextEl.textContent = question.question

  answerButtonsEl.innerHTML = question.choices
    .map((choice, index) => {
      const classes = ['answer-button']
      if (state.answerResolved && index === question.answerIndex) classes.push('correct')
      const disabled = state.answerResolved ? 'disabled' : ''
      return `<button class="${classes.join(' ')}" data-index="${index}" type="button" ${disabled}>${choice}</button>`
    })
    .join('')

  ;[...answerButtonsEl.querySelectorAll('.answer-button')].forEach((button) => {
    button.addEventListener('click', () => answerQuestion(Number(button.dataset.index)))
  })
}

function renderGarage() {
  garageListEl.innerHTML = state.garage
    .map((car) => {
      const owned = car.owned ? 'owned' : ''
      const selected = car.id === state.selectedCarId ? 'selected' : ''
      const action = car.owned
        ? `<button class="garage-action select" data-action="select" data-id="${car.id}" type="button">${selected ? '選択中' : 'この車に乗る'}</button>`
        : `<button class="garage-action buy" data-action="buy" data-id="${car.id}" type="button">${car.price}コインで買う</button>`

      return `
        <article class="garage-item ${owned} ${selected}">
          <div class="garage-swatch" style="background:${car.color}"></div>
          <div class="garage-copy">
            <h3>${car.name}</h3>
            <p>${car.description}</p>
            <p class="garage-stats">速さ ${car.speed.toFixed(2)} / 曲がり ${car.grip.toFixed(2)} / ドリフト ${car.drift.toFixed(2)}</p>
          </div>
          ${action}
        </article>
      `
    })
    .join('')

  ;[...garageListEl.querySelectorAll('.garage-action')].forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.id
      if (button.dataset.action === 'buy') buyCar(id)
      if (button.dataset.action === 'select') selectCar(id)
    })
  })
}

function renderHud() {
  const selectedCar = getSelectedCar()
  coinCountEl.textContent = String(state.coins)
  ownedCountEl.textContent = String(state.garage.filter((car) => car.owned).length)
  bestScoreEl.textContent = String(Math.round(state.bestScore))
  selectedCarEl.textContent = `選択中: ${selectedCar.name}`
  driftCarNameEl.textContent = `${selectedCar.name}で走行中`
  driftScoreEl.textContent = String(Math.round(state.driftScore))
  driftChainEl.textContent = String(Math.round(carState.driftChain))
  driftStatusEl.textContent = state.driftStatus
  carSpecsEl.textContent = `${selectedCar.name} / 速さ ${selectedCar.speed.toFixed(2)} / 加速 ${selectedCar.accel.toFixed(2)} / グリップ ${selectedCar.grip.toFixed(2)} / ドリフト適性 ${selectedCar.drift.toFixed(2)}`
  shopNoteEl.textContent = selectedCar.drift > 1.2 ? '今の車はドリフト角度が作りやすいです。アクセルを残して滑らせると伸びます。' : '今の車は安定寄りです。大きく切りすぎず、出口でアクセルを踏むとつなぎやすいです。'
  renderGarage()
  renderHistory()
}

function answerQuestion(index) {
  if (state.answerResolved) return

  const question = state.currentQuestion
  state.answerResolved = true

  if (index === question.answerIndex) {
    state.coins += question.reward
    quizFeedbackEl.textContent = `正解。${question.explanation} ${question.reward}コイン獲得。`
    addHistory(`${question.model} に正解して ${question.reward} コイン獲得`)
  } else {
    const correct = question.choices[question.answerIndex]
    quizFeedbackEl.textContent = `不正解。正解は ${correct}。${question.explanation}`
    addHistory(`${question.model} を外した。正解は ${correct}`)
  }

  renderQuiz()
  renderHud()
}

function buyCar(id) {
  const car = state.garage.find((item) => item.id === id)
  if (!car || car.owned) return
  if (state.coins < car.price) {
    quizFeedbackEl.textContent = `${car.name} を買うには ${car.price} コイン必要です。`
    return
  }

  state.coins -= car.price
  car.owned = true
  state.selectedCarId = car.id
  resetCarPosition()
  addHistory(`${car.name} を購入してガレージに追加`)
  renderHud()
}

function selectCar(id) {
  const car = state.garage.find((item) => item.id === id)
  if (!car || !car.owned) return
  state.selectedCarId = car.id
  resetCarPosition()
  addHistory(`${car.name} に乗り換えた`)
  renderHud()
}

function resetCarPosition() {
  carState.x = track.centerX
  carState.y = track.centerY + 110
  carState.angle = -Math.PI / 2
  carState.velocityX = 0
  carState.velocityY = 0
  carState.driftChain = 0
  state.driftScore = 0
  state.driftStatus = '新しい車でコースイン。滑らせてみよう。'
}

function drawTrack() {
  ctx.clearRect(0, 0, driftCanvas.width, driftCanvas.height)
  ctx.fillStyle = '#1f2937'
  ctx.fillRect(0, 0, driftCanvas.width, driftCanvas.height)

  ctx.fillStyle = '#14532d'
  ctx.beginPath()
  ctx.ellipse(track.centerX, track.centerY, track.outerRx, track.outerRy, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#374151'
  ctx.beginPath()
  ctx.ellipse(track.centerX, track.centerY, track.outerRx - 16, track.outerRy - 16, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#166534'
  ctx.beginPath()
  ctx.ellipse(track.centerX, track.centerY, track.innerRx, track.innerRy, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = 'rgba(255,255,255,0.65)'
  ctx.lineWidth = 3
  ctx.setLineDash([10, 10])
  ctx.beginPath()
  ctx.ellipse(track.centerX, track.centerY, (track.outerRx + track.innerRx) / 2, (track.outerRy + track.innerRy) / 2, 0, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])
}

function drawCar() {
  const car = getSelectedCar()
  ctx.save()
  ctx.translate(carState.x, carState.y)
  ctx.rotate(carState.angle)
  ctx.fillStyle = car.color
  ctx.fillRect(-18, -10, 36, 20)
  ctx.fillStyle = '#111827'
  ctx.fillRect(-12, -7, 24, 14)
  ctx.restore()
}

function distanceToIdealLane(x, y) {
  const dx = x - track.centerX
  const dy = y - track.centerY
  const outer = (dx * dx) / (track.outerRx * track.outerRx) + (dy * dy) / (track.outerRy * track.outerRy)
  const inner = (dx * dx) / (track.innerRx * track.innerRx) + (dy * dy) / (track.innerRy * track.innerRy)
  return { outer, inner }
}

function updateCarPhysics() {
  const car = getSelectedCar()
  const forwardX = Math.cos(carState.angle)
  const forwardY = Math.sin(carState.angle)
  const speed = Math.hypot(carState.velocityX, carState.velocityY)

  if (input.up) {
    carState.velocityX += forwardX * car.accel
    carState.velocityY += forwardY * car.accel
  }

  if (input.down) {
    carState.velocityX *= 0.96
    carState.velocityY *= 0.96
  }

  if (input.left) {
    carState.angle -= 0.04 + speed * 0.007
  }

  if (input.right) {
    carState.angle += 0.04 + speed * 0.007
  }

  const sideX = -forwardY
  const sideY = forwardX
  const lateral = carState.velocityX * sideX + carState.velocityY * sideY
  const forward = carState.velocityX * forwardX + carState.velocityY * forwardY

  const adjustedLateral = lateral * car.grip
  carState.velocityX = forward * forwardX + adjustedLateral * sideX
  carState.velocityY = forward * forwardY + adjustedLateral * sideY

  const currentSpeed = Math.hypot(carState.velocityX, carState.velocityY)
  const maxSpeed = car.speed
  if (currentSpeed > maxSpeed) {
    carState.velocityX = (carState.velocityX / currentSpeed) * maxSpeed
    carState.velocityY = (carState.velocityY / currentSpeed) * maxSpeed
  }

  carState.velocityX *= 0.992
  carState.velocityY *= 0.992
  carState.x += carState.velocityX
  carState.y += carState.velocityY

  const lane = distanceToIdealLane(carState.x, carState.y)
  const onTrack = lane.outer < 1 && lane.inner > 1

  if (!onTrack) {
    carState.velocityX *= 0.95
    carState.velocityY *= 0.95
    state.driftStatus = 'コース外にふくらんだ。戻して立て直そう。'
    carState.driftChain = 0
  }

  const driftPower = Math.abs(lateral) * 18 * car.drift
  if (onTrack && currentSpeed > 1.3 && driftPower > 6 && (input.left || input.right)) {
    carState.driftChain += 0.4
    state.driftScore += driftPower * 0.18 + carState.driftChain * 0.03
    state.driftStatus = `ドリフト中。角度を保ってスコアを伸ばそう。`
  } else if (carState.driftChain > 0) {
    state.driftStatus = 'ドリフトをつなぎ直そう。'
    carState.driftChain = Math.max(0, carState.driftChain - 0.25)
  }

  state.bestScore = Math.max(state.bestScore, state.driftScore)
}

function loop() {
  drawTrack()
  updateCarPhysics()
  drawCar()
  renderHud()
  requestAnimationFrame(loop)
}

document.addEventListener('keydown', (event) => {
  if (event.code === 'ArrowUp') input.up = true
  if (event.code === 'ArrowDown') input.down = true
  if (event.code === 'ArrowLeft') input.left = true
  if (event.code === 'ArrowRight') input.right = true
})

document.addEventListener('keyup', (event) => {
  if (event.code === 'ArrowUp') input.up = false
  if (event.code === 'ArrowDown') input.down = false
  if (event.code === 'ArrowLeft') input.left = false
  if (event.code === 'ArrowRight') input.right = false
})

nextQuizButton.addEventListener('click', () => {
  setNextQuestion()
  quizFeedbackEl.textContent = '正解するとコインがもらえます。'
  renderQuiz()
})

refillQuizDeck()
setNextQuestion()
renderQuiz()
renderHud()
resetCarPosition()
loop()
