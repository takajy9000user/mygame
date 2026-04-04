import './style.css'

const cards = [
  {
    id: 'orange-cash',
    name: 'Orange Cash',
    theme: 'キャッシュバック',
    limit: 22000,
    color: '#fb923c',
    bonus: {
      supermarket: 2.2,
      convenience: 1.8,
      default: 1.1,
    },
    text: 'スーパーとコンビニでポイントが伸びる使いやすいカード。',
  },
  {
    id: 'sky-miles',
    name: 'Sky Miles',
    theme: 'トラベル',
    limit: 26000,
    color: '#38bdf8',
    bonus: {
      train: 2.4,
      travel: 2.8,
      default: 1,
    },
    text: '電車や旅行の支払いに強い空色カード。',
  },
  {
    id: 'green-family',
    name: 'Green Family',
    theme: 'まいにち',
    limit: 18000,
    color: '#4ade80',
    bonus: {
      online: 2.3,
      bookstore: 1.9,
      default: 1.4,
    },
    text: 'ネット注文や本の買い物が得意な安定カード。',
  },
]

const scenarios = [
  {
    title: '放課後のおやつ',
    category: 'convenience',
    categoryLabel: 'コンビニ',
    amount: 780,
    description: '飲み物とおやつを買うことにした。',
  },
  {
    title: '家族の買い出し',
    category: 'supermarket',
    categoryLabel: 'スーパー',
    amount: 4200,
    description: '週末の食材をまとめて買う。',
  },
  {
    title: '遠足の切符',
    category: 'train',
    categoryLabel: '電車',
    amount: 1650,
    description: '電車で科学館へ行くための切符代。',
  },
  {
    title: '図鑑を注文',
    category: 'online',
    categoryLabel: 'ネットショップ',
    amount: 3200,
    description: '宇宙の図鑑をネットで注文する。',
  },
  {
    title: '旅行のホテル',
    category: 'travel',
    categoryLabel: '旅行',
    amount: 9800,
    description: '家族旅行のホテルを予約する。',
  },
  {
    title: '新しい本を買う',
    category: 'bookstore',
    categoryLabel: '本屋',
    amount: 1800,
    description: '好きなシリーズの新刊が出た。',
  },
]

const state = {
  round: 1,
  maxRounds: scenarios.length,
  currentScenario: null,
  points: 0,
  stars: 3,
  deck: [],
  history: [],
  cardUsage: Object.fromEntries(cards.map((card) => [card.id, 0])),
  selectedCardId: null,
  finished: false,
}

const app = document.querySelector('#app')

app.innerHTML = `
  <main class="game-shell">
    <section class="hero-panel">
      <div>
        <p class="eyebrow">Credit Card Game</p>
        <h1>カードをえらんで ポイントをあつめよう</h1>
        <p class="intro">
          架空のクレジットカードからその場に合う1枚を選ぶゲームです。<strong>お店の種類ごとに得意なカードが違います。</strong>
          上手に選んでポイントを集め、使いすぎにも注意します。
        </p>
      </div>
      <div class="score-card">
        <div>
          <span>ポイント</span>
          <strong id="points">0</strong>
        </div>
        <div>
          <span>スター</span>
          <strong id="stars">3</strong>
        </div>
        <div>
          <span>ラウンド</span>
          <strong id="round">1 / 6</strong>
        </div>
      </div>
    </section>

    <section class="main-grid">
      <section class="panel scenario-panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Shopping Scene</p>
            <h2 id="scene-title">お買い物スタート</h2>
          </div>
          <button id="reset-button" class="action-button secondary" type="button">もう一度遊ぶ</button>
        </div>

        <div class="scene-box">
          <p id="scene-category" class="scene-category">カテゴリー</p>
          <p id="scene-description" class="scene-description"></p>
          <p id="scene-amount" class="scene-amount">0円</p>
        </div>

        <p id="feedback" class="feedback">3枚の中から、いちばん向いているカードを選んでください。</p>
        <button id="next-button" class="action-button primary" type="button">次の買い物へ</button>
      </section>

      <section class="panel cards-panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Card Select</p>
            <h2>カードを選ぶ</h2>
          </div>
        </div>
        <div id="cards-grid" class="cards-grid"></div>
      </section>
    </section>

    <section class="insight-grid">
      <article class="insight-card">
        <p class="eyebrow">Card Memo</p>
        <h3>カードの特徴</h3>
        <p id="card-memo">各カードに得意なお店があります。</p>
      </article>

      <article class="insight-card">
        <p class="eyebrow">Usage</p>
        <h3>今月の利用額</h3>
        <div id="usage-list" class="usage-list"></div>
      </article>

      <article class="insight-card">
        <p class="eyebrow">History</p>
        <h3>プレーログ</h3>
        <ol id="history-list" class="history-list"></ol>
      </article>
    </section>
  </main>
`

const pointsEl = document.querySelector('#points')
const starsEl = document.querySelector('#stars')
const roundEl = document.querySelector('#round')
const sceneTitleEl = document.querySelector('#scene-title')
const sceneCategoryEl = document.querySelector('#scene-category')
const sceneDescriptionEl = document.querySelector('#scene-description')
const sceneAmountEl = document.querySelector('#scene-amount')
const feedbackEl = document.querySelector('#feedback')
const cardsGridEl = document.querySelector('#cards-grid')
const cardMemoEl = document.querySelector('#card-memo')
const usageListEl = document.querySelector('#usage-list')
const historyListEl = document.querySelector('#history-list')
const nextButton = document.querySelector('#next-button')
const resetButton = document.querySelector('#reset-button')

function shuffleArray(items) {
  const next = [...items]
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
  }
  return next
}

function getCurrentScenario() {
  return state.currentScenario
}

function getCardMultiplier(card, category) {
  return card.bonus[category] ?? card.bonus.default
}

function getBestCard(category) {
  return cards.reduce((best, card) =>
    getCardMultiplier(card, category) > getCardMultiplier(best, category) ? card : best,
  )
}

function addHistory(text) {
  state.history.unshift(text)
  state.history = state.history.slice(0, 6)
}

function renderHistory() {
  historyListEl.innerHTML = state.history.length
    ? state.history.map((entry) => `<li>${entry}</li>`).join('')
    : '<li>まだ記録はありません。</li>'
}

function renderUsage() {
  usageListEl.innerHTML = cards
    .map((card) => {
      const used = state.cardUsage[card.id]
      const percent = Math.min(100, Math.round((used / card.limit) * 100))
      return `
        <div class="usage-item">
          <div class="usage-head">
            <span>${card.name}</span>
            <span>${used} / ${card.limit}円</span>
          </div>
          <div class="usage-bar"><div class="usage-fill" style="width:${percent}%; background:${card.color};"></div></div>
        </div>
      `
    })
    .join('')
}

function renderCards() {
  const scenario = getCurrentScenario()

  cardsGridEl.innerHTML = cards
    .map((card) => {
      const selected = state.selectedCardId === card.id ? ' selected' : ''
      const used = state.cardUsage[card.id]
      const multiplier = scenario ? getCardMultiplier(card, scenario.category) : card.bonus.default
      return `
        <button class="credit-card${selected}" data-id="${card.id}" type="button" style="--card-color:${card.color};">
          <span class="credit-name">${card.name}</span>
          <span class="credit-theme">${card.theme}</span>
          <span class="credit-multiplier">今回 ${multiplier.toFixed(1)} 倍</span>
          <span class="credit-limit">利用 ${used} / ${card.limit}円</span>
          <span class="credit-text">${card.text}</span>
        </button>
      `
    })
    .join('')

  ;[...cardsGridEl.querySelectorAll('.credit-card')].forEach((button) => {
    button.addEventListener('click', () => handleChoice(button.dataset.id))
  })
}

function renderScenario() {
  const scenario = getCurrentScenario()

  if (!scenario) {
    sceneTitleEl.textContent = 'ゲーム終了'
    sceneCategoryEl.textContent = 'おつかれさま'
    sceneDescriptionEl.textContent = '6ラウンドが終わりました。もう一度遊ぶで新しい順番で挑戦できます。'
    sceneAmountEl.textContent = `${state.points}ポイント`
    feedbackEl.textContent =
      state.stars >= 2
        ? '上手にカードを使い分けられました。'
        : '次はお店ごとの得意カードをもっと意識すると伸びます。'
    nextButton.disabled = true
    renderCards()
    return
  }

  sceneTitleEl.textContent = scenario.title
  sceneCategoryEl.textContent = scenario.categoryLabel
  sceneDescriptionEl.textContent = scenario.description
  sceneAmountEl.textContent = `${scenario.amount.toLocaleString('ja-JP')}円`
  nextButton.disabled = false
  renderCards()
}

function renderHud() {
  pointsEl.textContent = String(state.points)
  starsEl.textContent = '★'.repeat(state.stars) || '0'
  roundEl.textContent = `${Math.min(state.round, state.maxRounds)} / ${state.maxRounds}`
  cardMemoEl.textContent = state.selectedCardId
    ? `${cards.find((card) => card.id === state.selectedCardId)?.name} を選択中。カードごとの得意分野を見て選ぶと高得点です。`
    : '各カードに得意なお店があります。'
  renderUsage()
  renderHistory()
}

function moveNextScenario() {
  state.currentScenario = state.deck.shift() ?? null
  state.selectedCardId = null
  renderScenario()
  renderHud()
}

function handleChoice(cardId) {
  const scenario = getCurrentScenario()
  if (!scenario || state.selectedCardId) {
    return
  }

  const card = cards.find((item) => item.id === cardId)
  if (!card) {
    return
  }

  state.selectedCardId = cardId

  const nextUsage = state.cardUsage[cardId] + scenario.amount
  if (nextUsage > card.limit) {
    state.stars = Math.max(0, state.stars - 1)
    feedbackEl.textContent = `${card.name} は利用上限オーバーです。別ラウンドで気をつけよう。`
    addHistory(`${scenario.title}: 上限オーバーでスターを1つ失った`)
    renderCards()
    renderHud()
    return
  }

  state.cardUsage[cardId] = nextUsage
  const bestCard = getBestCard(scenario.category)
  const multiplier = getCardMultiplier(card, scenario.category)
  const earnedPoints = Math.round((scenario.amount / 100) * multiplier)

  state.points += earnedPoints

  if (bestCard.id === cardId) {
    feedbackEl.textContent = `大成功。${card.name} がぴったりで ${earnedPoints} ポイント獲得。`
    addHistory(`${scenario.title}: ベストなカードで ${earnedPoints} ポイント`)
  } else {
    feedbackEl.textContent = `${earnedPoints} ポイント獲得。もっと良いのは ${bestCard.name} でした。`
    addHistory(`${scenario.title}: ${card.name} を選んで ${earnedPoints} ポイント`)
  }

  renderCards()
  renderHud()
}

function nextRound() {
  if (!state.currentScenario) {
    return
  }

  state.round += 1
  moveNextScenario()
}

function resetGame() {
  state.round = 1
  state.points = 0
  state.stars = 3
  state.deck = shuffleArray(scenarios)
  state.history = []
  state.cardUsage = Object.fromEntries(cards.map((card) => [card.id, 0]))
  state.selectedCardId = null
  state.finished = false
  feedbackEl.textContent = '3枚の中から、いちばん向いているカードを選んでください。'
  moveNextScenario()
}

nextButton.addEventListener('click', nextRound)
resetButton.addEventListener('click', resetGame)

resetGame()
