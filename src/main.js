import './style.css'

const quizBank = [
  {
    subject: '算数',
    question: '8 × 7 はいくつ？',
    choices: ['54', '56', '63', '58'],
    answerIndex: 1,
    explanation: '8 × 7 = 56 です。',
  },
  {
    subject: '社会',
    question: '日本の首都はどこ？',
    choices: ['大阪', '東京', '京都', '福岡'],
    answerIndex: 1,
    explanation: '日本の首都は東京です。',
  },
  {
    subject: '理科',
    question: '水がこおる温度は何℃？',
    choices: ['10℃', '0℃', '5℃', '100℃'],
    answerIndex: 1,
    explanation: '水は 0℃ でこおり始めます。',
  },
  {
    subject: '国語',
    question: '「努力」に近い意味の言葉はどれ？',
    choices: ['なまける', '力をつくす', 'ねむる', 'あそぶ'],
    answerIndex: 1,
    explanation: '努力は目標に向かって力をつくすことです。',
  },
]

const moves = [
  { id: 'jab', name: 'ストレート', damage: 14, text: '素早い一撃で前に出る。', aura: '足を止めずに圧をかける' },
  { id: 'kick', name: '回し蹴り', damage: 18, text: '大きく踏み込んで蹴りを入れる。', aura: '勢いで主導権を取りにいく' },
  { id: 'guard', name: 'ガード反撃', damage: 10, heal: 8, text: '守りを固めてから小さく返す。', aura: '落ち着いて隙を待つ' },
]

const enemyMoves = [
  { name: 'パンチ連打', damage: 11, text: '棒人間の連打が飛んでくる。' },
  { name: 'ジャンプ蹴り', damage: 15, text: '高い位置から蹴り込んでくる。' },
  { name: '体当たり', damage: 13, text: '勢いよくぶつかって押してくる。' },
]

const state = {
  playerHp: 120,
  enemyHp: 120,
  maxHp: 120,
  turn: 1,
  boostReady: false,
  boostAmount: 0,
  battleOver: false,
  busy: false,
  history: [],
  aura: '様子を見ながら間合いを測る',
  currentQuestion: null,
  quizOpen: false,
  quizDeck: [],
  studyStreak: 0,
  learnedCount: 0,
}

const app = document.querySelector('#app')

app.innerHTML = `
  <main class="game-shell">
    <section class="hero-panel">
      <div>
        <p class="eyebrow">Fun Study Battle</p>
        <h1>楽しく学べる 棒人間バトル</h1>
        <p class="intro">
          棒人間どうしの1対1バトルです。攻撃前に学びチャレンジへ挑戦するかは自分で選べます。
          <strong>クイズに正解すると、その次の攻撃力がアップし、学びコンボも伸びます。</strong>
        </p>
      </div>
      <div class="score-card">
        <div>
          <span>自分HP</span>
          <strong id="player-hp">120</strong>
        </div>
        <div>
          <span>相手HP</span>
          <strong id="enemy-hp">120</strong>
        </div>
        <div>
          <span>学びコンボ</span>
          <strong id="turn-count">1</strong>
        </div>
      </div>
    </section>

    <section class="main-grid">
      <section class="panel battle-panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Battle Stage</p>
            <h2>棒人間ファイト</h2>
          </div>
          <button id="reset-button" class="action-button secondary" type="button">再戦する</button>
        </div>

        <div class="stick-arena">
          <div class="fighter-card">
            <div class="stickman player-stickman">
              <span class="head"></span>
              <span class="body"></span>
              <span class="arm arm-left"></span>
              <span class="arm arm-right"></span>
              <span class="leg leg-left"></span>
              <span class="leg leg-right"></span>
            </div>
            <h3>プレイヤー</h3>
            <div class="hp-bar"><div id="player-bar" class="hp-fill player-fill"></div></div>
            <p id="player-state" class="state-text">かまえて様子を見ている。</p>
          </div>

          <div class="center-status">
            <div id="boost-badge" class="boost-badge">通常</div>
            <p id="battle-status" class="battle-status">最初の一手を選んでください。</p>
          </div>

          <div class="fighter-card">
            <div class="stickman enemy-stickman">
              <span class="head"></span>
              <span class="body"></span>
              <span class="arm arm-left"></span>
              <span class="arm arm-right"></span>
              <span class="leg leg-left"></span>
              <span class="leg leg-right"></span>
            </div>
            <h3>ライバル</h3>
            <div class="hp-bar"><div id="enemy-bar" class="hp-fill enemy-fill"></div></div>
            <p id="enemy-state" class="state-text">腕を回して挑発している。</p>
          </div>
        </div>
      </section>

      <section class="panel action-panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Action</p>
            <h2>楽しく進める</h2>
          </div>
        </div>
        <div id="moves-grid" class="skills-grid"></div>
        <div class="quiz-actions">
          <button id="open-quiz-button" class="action-button primary" type="button">学びチャレンジ</button>
          <button id="skip-quiz-button" class="action-button secondary" type="button">そのまま戦う</button>
        </div>
      </section>
    </section>

    <section class="panel quiz-panel">
      <div class="panel-head">
        <div>
          <p class="eyebrow">Quiz Boost</p>
          <h2>ごほうびクイズ</h2>
        </div>
      </div>
      <p id="quiz-question" class="quiz-question">クイズに挑戦すると、次の攻撃が強くなります。</p>
      <div id="quiz-answers" class="quiz-answers"></div>
      <p id="quiz-feedback" class="quiz-feedback">できた分だけ強くなります。わからなくても次に進めます。</p>
    </section>

    <section class="insight-grid">
      <article class="insight-card">
        <p class="eyebrow">Aura</p>
        <h3>戦況</h3>
        <p id="aura-text">様子を見ながら間合いを測る</p>
      </article>
      <article class="insight-card">
        <p class="eyebrow">Boost</p>
        <h3>攻撃アップ</h3>
        <p id="boost-text">今は通常ダメージです。</p>
      </article>
      <article class="insight-card">
        <p class="eyebrow">Study Log</p>
        <h3>学びログ</h3>
        <ol id="history-list" class="history-list"></ol>
      </article>
    </section>
  </main>
`

const playerHpEl = document.querySelector('#player-hp')
const enemyHpEl = document.querySelector('#enemy-hp')
const turnCountEl = document.querySelector('#turn-count')
const playerBarEl = document.querySelector('#player-bar')
const enemyBarEl = document.querySelector('#enemy-bar')
const playerStateEl = document.querySelector('#player-state')
const enemyStateEl = document.querySelector('#enemy-state')
const battleStatusEl = document.querySelector('#battle-status')
const boostBadgeEl = document.querySelector('#boost-badge')
const movesGridEl = document.querySelector('#moves-grid')
const openQuizButton = document.querySelector('#open-quiz-button')
const skipQuizButton = document.querySelector('#skip-quiz-button')
const quizQuestionEl = document.querySelector('#quiz-question')
const quizAnswersEl = document.querySelector('#quiz-answers')
const quizFeedbackEl = document.querySelector('#quiz-feedback')
const auraTextEl = document.querySelector('#aura-text')
const boostTextEl = document.querySelector('#boost-text')
const historyListEl = document.querySelector('#history-list')
const resetButton = document.querySelector('#reset-button')
const playerStickmanEl = document.querySelector('.player-stickman')
const enemyStickmanEl = document.querySelector('.enemy-stickman')

function animateFighter(element, className, duration = 320) {
  element.classList.remove(className)
  void element.offsetWidth
  element.classList.add(className)
  window.setTimeout(() => element.classList.remove(className), duration)
}

function shuffleArray(items) {
  const next = [...items]
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
  }
  return next
}

function addHistory(text) {
  state.history = [text, ...state.history].slice(0, 6)
}

function renderHistory() {
  historyListEl.innerHTML = state.history.length
    ? state.history.map((entry) => `<li>${entry}</li>`).join('')
    : '<li>まだ行動はありません。</li>'
}

function refillQuizDeck() {
  state.quizDeck = shuffleArray(quizBank)
}

function setQuestion() {
  if (state.quizDeck.length === 0) refillQuizDeck()
  state.currentQuestion = state.quizDeck.shift()
}

function renderQuiz() {
  if (!state.quizOpen || !state.currentQuestion) {
    quizQuestionEl.textContent = '学びチャレンジに正解すると、次の攻撃が強くなります。'
    quizAnswersEl.innerHTML = ''
    return
  }

  quizQuestionEl.textContent = `${state.currentQuestion.subject}クイズ: ${state.currentQuestion.question}`
  quizAnswersEl.innerHTML = state.currentQuestion.choices
    .map((choice, index) => `<button class="quiz-answer" data-index="${index}" type="button">${choice}</button>`)
    .join('')

  ;[...quizAnswersEl.querySelectorAll('.quiz-answer')].forEach((button) => {
    button.addEventListener('click', () => answerQuiz(Number(button.dataset.index)))
  })
}

function renderMoves() {
  movesGridEl.innerHTML = moves
    .map(
      (move) => `
        <button class="skill-card" data-id="${move.id}" type="button">
          <strong>${move.name}</strong>
          <span>威力 ${move.damage + state.boostAmount}</span>
          <p>${move.text}</p>
        </button>
      `,
    )
    .join('')

  ;[...movesGridEl.querySelectorAll('.skill-card')].forEach((button) => {
    button.addEventListener('click', () => performTurn(button.dataset.id))
  })
}

function renderHud() {
  playerHpEl.textContent = String(state.playerHp)
  enemyHpEl.textContent = String(state.enemyHp)
  turnCountEl.textContent = state.studyStreak > 0 ? `${state.studyStreak}` : '0'
  playerBarEl.style.width = `${(state.playerHp / state.maxHp) * 100}%`
  enemyBarEl.style.width = `${(state.enemyHp / state.maxHp) * 100}%`
  auraTextEl.textContent = state.aura
  boostBadgeEl.textContent = state.boostReady ? `+${state.boostAmount}` : '通常'
  boostTextEl.textContent = state.boostReady
    ? `次の攻撃は +${state.boostAmount} 強化。これまでに ${state.learnedCount} 問学びました。`
    : `今は通常ダメージ。これまでに ${state.learnedCount} 問学びました。`
  openQuizButton.disabled = state.battleOver || state.busy || state.quizOpen
  skipQuizButton.disabled = state.battleOver || state.busy
  renderMoves()
  renderQuiz()
  renderHistory()
}

function enemyTurn() {
  const move = enemyMoves[Math.floor(Math.random() * enemyMoves.length)]
  state.playerHp = Math.max(0, state.playerHp - move.damage)
  animateFighter(enemyStickmanEl, 'attack')
  animateFighter(playerStickmanEl, 'hit')
  playerStateEl.textContent = `${move.damage} ダメージを受けた。`
  enemyStateEl.textContent = move.text
  battleStatusEl.textContent = `相手の反撃: ${move.name}`
  addHistory(`相手の ${move.name} で ${move.damage} ダメージ`)

  if (state.playerHp <= 0) {
    state.battleOver = true
    state.aura = '今回は負けても、学びはちゃんと残る'
    battleStatusEl.textContent = '敗北。次は学びチャレンジでもっと有利に進めよう。'
  }
}

function finishTurn() {
  if (state.enemyHp <= 0) {
    state.battleOver = true
    state.aura = '学びの力で最後まで押し切った'
    playerStateEl.textContent = '拳を下ろして勝負あり。'
    enemyStateEl.textContent = 'その場に倒れ込んだ。'
    battleStatusEl.textContent = '勝利。楽しく学びながら勝ち切った。'
    renderHud()
    return
  }

  enemyTurn()
  state.turn += 1
  renderHud()
}

function performTurn(moveId) {
  if (state.busy || state.battleOver) return

  const move = moves.find((item) => item.id === moveId)
  if (!move) return

  state.busy = true
  const totalDamage = move.damage + state.boostAmount
  state.enemyHp = Math.max(0, state.enemyHp - totalDamage)
  animateFighter(playerStickmanEl, move.id === 'kick' ? 'kick' : 'attack')
  animateFighter(enemyStickmanEl, 'hit')
  if (move.heal) {
    state.playerHp = Math.min(state.maxHp, state.playerHp + move.heal)
    animateFighter(playerStickmanEl, 'guard')
  }

  state.aura = move.aura
  playerStateEl.textContent = `${move.name} を決めた。`
  enemyStateEl.textContent = `${totalDamage} ダメージでよろけた。`
  battleStatusEl.textContent = `${move.name} が命中`
  addHistory(`${move.name} で ${totalDamage} ダメージ`)

  state.boostReady = false
  state.boostAmount = 0
  state.quizOpen = false
  quizFeedbackEl.textContent = '次も気が向いたら学びチャレンジに挑戦できます。'

  renderHud()

  window.setTimeout(() => {
    finishTurn()
    state.busy = false
  }, 360)
}

function answerQuiz(index) {
  if (!state.quizOpen || !state.currentQuestion || state.busy || state.battleOver) return

  const correct = index === state.currentQuestion.answerIndex
  if (correct) {
    state.boostReady = true
    state.boostAmount = 8
    state.studyStreak += 1
    state.learnedCount += 1
    quizFeedbackEl.textContent = `正解。${state.currentQuestion.explanation} 次の攻撃が +8 強化されます。`
    addHistory(`${state.currentQuestion.subject}クイズ正解で攻撃アップ`)
  } else {
    state.boostReady = false
    state.boostAmount = 0
    state.studyStreak = 0
    quizFeedbackEl.textContent = `不正解。${state.currentQuestion.explanation} 今回は通常ダメージです。`
    addHistory(`${state.currentQuestion.subject}クイズは惜しい。説明を見て次へ`)
  }

  state.quizOpen = false
  renderHud()
}

function openQuiz() {
  if (state.battleOver || state.busy || state.quizOpen) return
  setQuestion()
  state.quizOpen = true
  quizFeedbackEl.textContent = '正解すると次の攻撃力がアップします。気楽に挑戦できます。'
  renderHud()
}

function skipQuiz() {
  if (state.battleOver || state.busy) return
  state.quizOpen = false
  quizFeedbackEl.textContent = '今はそのまま戦います。あとでまた挑戦できます。'
  renderHud()
}

function resetBattle() {
  state.playerHp = 120
  state.enemyHp = 120
  state.maxHp = 120
  state.turn = 1
  state.boostReady = false
  state.boostAmount = 0
  state.battleOver = false
  state.busy = false
  state.history = []
  state.aura = '様子を見ながら間合いを測る'
  state.currentQuestion = null
  state.quizOpen = false
  state.studyStreak = 0
  state.learnedCount = 0
  refillQuizDeck()
  playerStateEl.textContent = 'かまえて様子を見ている。'
  enemyStateEl.textContent = '腕を回して挑発している。'
  battleStatusEl.textContent = '最初の一手を選んでください。'
  quizFeedbackEl.textContent = 'できた分だけ強くなります。わからなくても次に進めます。'
  renderHud()
}

openQuizButton.addEventListener('click', openQuiz)
skipQuizButton.addEventListener('click', skipQuiz)
resetButton.addEventListener('click', resetBattle)

resetBattle()
