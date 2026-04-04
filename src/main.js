import './style.css'

const playerSkills = [
  { id: 'strike', name: '黒閃ラッシュ', damage: 18, charge: 10, text: '一気に間合いを詰めて強打をたたき込む。' },
  { id: 'barrier', name: '簡易領域', damage: 8, charge: 18, heal: 10, text: '受け流しながら体勢を立て直す。' },
  { id: 'burst', name: '術式解放', damage: 26, charge: 16, text: '呪力をまとめて放つ高火力技。' },
]

const enemyMoves = [
  { name: '呪力弾', damage: 12, text: '圧の強い呪力弾を飛ばしてくる。' },
  { name: '近接連打', damage: 15, text: '素早い連打で押し込んでくる。' },
  { name: '呪詛の波', damage: 18, text: '濃い呪力の波で大きく削ってくる。' },
]

const state = {
  playerHp: 120,
  enemyHp: 150,
  maxPlayerHp: 120,
  maxEnemyHp: 150,
  charge: 0,
  turn: 1,
  battleOver: false,
  busy: false,
  history: [],
  aura: '静かに気配を読む',
}

const app = document.querySelector('#app')

app.innerHTML = `
  <main class="game-shell">
    <section class="hero-panel">
      <div>
        <p class="eyebrow">Jujutsu Battle</p>
        <h1>呪術バトルゲーム</h1>
        <p class="intro">
          呪術バトル風の1対1ゲームです。術式を選び、相手の呪霊を祓うまで攻撃を重ねます。
          <strong>毎ターン相手も反撃してくるので、攻めと立て直しを使い分けます。</strong>
        </p>
      </div>
      <div class="score-card">
        <div>
          <span>自分HP</span>
          <strong id="player-hp">120</strong>
        </div>
        <div>
          <span>敵HP</span>
          <strong id="enemy-hp">150</strong>
        </div>
        <div>
          <span>ターン</span>
          <strong id="turn-count">1</strong>
        </div>
      </div>
    </section>

    <section class="main-grid">
      <section class="panel battle-panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Battle Field</p>
            <h2>高専の結界内</h2>
          </div>
          <button id="reset-button" class="action-button secondary" type="button">再戦する</button>
        </div>

        <div class="arena">
          <div class="fighter player">
            <div class="avatar player-avatar"></div>
            <h3>主人公の術師</h3>
            <div class="hp-bar"><div id="player-bar" class="hp-fill player-fill"></div></div>
            <p id="player-state" class="state-text">呼吸を整えて構えている。</p>
          </div>

          <div class="versus-core">
            <div id="charge-ring" class="charge-ring">0%</div>
            <p id="battle-status" class="battle-status">戦闘開始。最初の一手を選ぼう。</p>
          </div>

          <div class="fighter enemy">
            <div class="avatar enemy-avatar"></div>
            <h3>特級呪霊</h3>
            <div class="hp-bar"><div id="enemy-bar" class="hp-fill enemy-fill"></div></div>
            <p id="enemy-state" class="state-text">不気味な笑みでこちらを見ている。</p>
          </div>
        </div>
      </section>

      <section class="panel skills-panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Technique</p>
            <h2>術式を選ぶ</h2>
          </div>
        </div>
        <div id="skills-grid" class="skills-grid"></div>
        <button id="ultimate-button" class="action-button primary" type="button">領域展開を放つ</button>
      </section>
    </section>

    <section class="insight-grid">
      <article class="insight-card">
        <p class="eyebrow">Aura</p>
        <h3>戦況</h3>
        <p id="aura-text">静かに気配を読む</p>
      </article>
      <article class="insight-card">
        <p class="eyebrow">Ultimate</p>
        <h3>必殺ゲージ</h3>
        <p id="charge-text">まだ領域展開は使えない。</p>
      </article>
      <article class="insight-card">
        <p class="eyebrow">Battle Log</p>
        <h3>戦闘ログ</h3>
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
const chargeRingEl = document.querySelector('#charge-ring')
const skillsGridEl = document.querySelector('#skills-grid')
const ultimateButton = document.querySelector('#ultimate-button')
const auraTextEl = document.querySelector('#aura-text')
const chargeTextEl = document.querySelector('#charge-text')
const historyListEl = document.querySelector('#history-list')
const resetButton = document.querySelector('#reset-button')

function addHistory(text) {
  state.history = [text, ...state.history].slice(0, 6)
}

function renderHistory() {
  historyListEl.innerHTML = state.history.length
    ? state.history.map((entry) => `<li>${entry}</li>`).join('')
    : '<li>まだ行動はありません。</li>'
}

function renderSkills() {
  skillsGridEl.innerHTML = playerSkills
    .map(
      (skill) => `
        <button class="skill-card" data-id="${skill.id}" type="button">
          <strong>${skill.name}</strong>
          <span>威力 ${skill.damage}</span>
          <span>ゲージ +${skill.charge}</span>
          <p>${skill.text}</p>
        </button>
      `,
    )
    .join('')

  ;[...skillsGridEl.querySelectorAll('.skill-card')].forEach((button) => {
    button.addEventListener('click', () => performPlayerTurn(button.dataset.id))
  })
}

function renderHud() {
  playerHpEl.textContent = String(state.playerHp)
  enemyHpEl.textContent = String(state.enemyHp)
  turnCountEl.textContent = String(state.turn)
  playerBarEl.style.width = `${(state.playerHp / state.maxPlayerHp) * 100}%`
  enemyBarEl.style.width = `${(state.enemyHp / state.maxEnemyHp) * 100}%`
  chargeRingEl.textContent = `${state.charge}%`
  auraTextEl.textContent = state.aura
  chargeTextEl.textContent = state.charge >= 100 ? '領域展開が使える。決めにいける。' : `領域展開まであと ${100 - state.charge}%`
  ultimateButton.disabled = state.charge < 100 || state.battleOver || state.busy
}

function enemyAttack() {
  const move = enemyMoves[Math.floor(Math.random() * enemyMoves.length)]
  state.playerHp = Math.max(0, state.playerHp - move.damage)
  playerStateEl.textContent = `${move.name}で ${move.damage} ダメージを受けた。`
  enemyStateEl.textContent = move.text
  battleStatusEl.textContent = `敵の反撃: ${move.name}`
  addHistory(`敵が ${move.name} を放ち ${move.damage} ダメージ`)

  if (state.playerHp <= 0) {
    state.battleOver = true
    state.aura = '呪力が尽きて倒れた'
    battleStatusEl.textContent = '敗北。呪霊を祓えなかった。'
  }
}

function finishTurn() {
  if (state.enemyHp <= 0) {
    state.battleOver = true
    state.aura = '呪力の奔流で勝負を決めた'
    playerStateEl.textContent = '立ち姿のまま勝利した。'
    enemyStateEl.textContent = '呪霊は浄化されて消えた。'
    battleStatusEl.textContent = '勝利。呪霊を祓った。'
    renderHud()
    renderHistory()
    return
  }

  enemyAttack()
  state.turn += 1
  renderHud()
  renderHistory()
}

function performPlayerTurn(skillId) {
  if (state.busy || state.battleOver) return

  const skill = playerSkills.find((item) => item.id === skillId)
  if (!skill) return

  state.busy = true
  state.enemyHp = Math.max(0, state.enemyHp - skill.damage)
  state.charge = Math.min(100, state.charge + skill.charge)
  if (skill.heal) {
    state.playerHp = Math.min(state.maxPlayerHp, state.playerHp + skill.heal)
  }

  state.aura = skill.damage >= 24 ? '呪力が大きく脈打つ' : '間合いを支配している'
  playerStateEl.textContent = `${skill.name} を発動。`
  enemyStateEl.textContent = `${skill.damage} ダメージで体勢を崩した。`
  battleStatusEl.textContent = `${skill.name} が命中`
  addHistory(`${skill.name} で ${skill.damage} ダメージ`)

  renderHud()
  renderHistory()

  window.setTimeout(() => {
    finishTurn()
    state.busy = false
  }, 380)
}

function performUltimate() {
  if (state.busy || state.battleOver || state.charge < 100) return

  state.busy = true
  const damage = 44
  state.enemyHp = Math.max(0, state.enemyHp - damage)
  state.charge = 0
  state.aura = '領域展開で空気が変わった'
  playerStateEl.textContent = '領域展開を発動した。'
  enemyStateEl.textContent = `${damage} ダメージの直撃で大きく揺らいだ。`
  battleStatusEl.textContent = '領域展開が炸裂'
  addHistory(`領域展開で ${damage} ダメージ`)

  renderHud()
  renderHistory()

  window.setTimeout(() => {
    finishTurn()
    state.busy = false
  }, 420)
}

function resetBattle() {
  state.playerHp = 120
  state.enemyHp = 150
  state.maxPlayerHp = 120
  state.maxEnemyHp = 150
  state.charge = 0
  state.turn = 1
  state.battleOver = false
  state.busy = false
  state.history = []
  state.aura = '静かに気配を読む'
  playerStateEl.textContent = '呼吸を整えて構えている。'
  enemyStateEl.textContent = '不気味な笑みでこちらを見ている。'
  battleStatusEl.textContent = '戦闘開始。最初の一手を選ぼう。'
  renderHud()
  renderHistory()
}

ultimateButton.addEventListener('click', performUltimate)
resetButton.addEventListener('click', resetBattle)

renderSkills()
resetBattle()
