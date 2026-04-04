import './style.css'

const zones = [
  {
    id: 'top-left',
    label: '左上',
    x: 18,
    y: 20,
    risk: 0.44,
    learning: '左上は止めにくい反面、強く蹴りすぎると外れやすいコースです。',
  },
  {
    id: 'top-center',
    label: '上中央',
    x: 50,
    y: 18,
    risk: 0.62,
    learning: '上中央は迫力がありますが、力加減が難しい上級者向けです。',
  },
  {
    id: 'top-right',
    label: '右上',
    x: 82,
    y: 20,
    risk: 0.44,
    learning: '右上は人気のコースです。角度は良いですが、強すぎると外れやすくなります。',
  },
  {
    id: 'bottom-left',
    label: '左下',
    x: 20,
    y: 66,
    risk: 0.2,
    learning: '左下は安定しやすいコースです。コントロール重視で決めやすくなります。',
  },
  {
    id: 'bottom-center',
    label: '下中央',
    x: 50,
    y: 68,
    risk: 0.5,
    learning: '下中央は読みやすいので、キーパーの動きを見て使い分けるのが大切です。',
  },
  {
    id: 'bottom-right',
    label: '右下',
    x: 80,
    y: 66,
    risk: 0.2,
    learning: '右下も安定しやすいコースです。落ち着いて狙うと成功しやすくなります。',
  },
]

const keeperProfiles = [
  {
    name: 'かがみ型',
    bias: ['bottom-left', 'bottom-right', 'top-left', 'top-right', 'bottom-center', 'top-center'],
    hint: '低いシュートによく反応します。高いコースは比較的空きやすいです。',
  },
  {
    name: '読み勝ち型',
    bias: ['top-right', 'bottom-right', 'top-left', 'bottom-left', 'bottom-center', 'top-center'],
    hint: '右側を先に読むタイプです。反対側へ打つと決まりやすくなります。',
  },
  {
    name: '中央待ち型',
    bias: ['bottom-center', 'top-center', 'bottom-left', 'bottom-right', 'top-left', 'top-right'],
    hint: 'まず中央を固めます。左右の角を狙うとチャンスです。',
  },
]

const state = {
  shotNumber: 1,
  maxShots: 5,
  goals: 0,
  saves: 0,
  aimIndex: 4,
  power: 72,
  busy: false,
  history: [],
  keeperProfile: keeperProfiles[0],
}

const app = document.querySelector('#app')

app.innerHTML = `
  <main class="game-shell">
    <section class="hero-panel">
      <div>
        <p class="eyebrow">Penalty Kick Lab</p>
        <h1>PKで読み合いながら楽しく学ぶ</h1>
        <p class="intro">
          ねらう場所とキックの強さを選んでシュート。<strong>キーパーの動きを読んで、5本の勝負でできるだけ多く決めよう。</strong>
        </p>
      </div>
      <div class="score-card">
        <div>
          <span>ゴール</span>
          <strong id="score">0</strong>
        </div>
        <div>
          <span>セーブ</span>
          <strong id="saves">0</strong>
        </div>
        <div>
          <span>残り</span>
          <strong id="shots-left">5</strong>
        </div>
      </div>
    </section>

    <section class="stadium-card">
      <div class="stadium-head">
        <div>
          <p class="label">今のねらい</p>
          <h2 id="aim-label">右下</h2>
        </div>
        <div>
          <p class="label">キーパーのタイプ</p>
          <h2 id="keeper-name">かがみ型</h2>
        </div>
        <div>
          <p class="label">キック強さ</p>
          <h2><span id="power-label">72</span>%</h2>
        </div>
      </div>

      <div class="pitch">
        <div class="goal" aria-hidden="true">
          <div class="net-lines"></div>
          <div class="zone-grid">
            ${zones
              .map(
                (zone, index) =>
                  `<button class="zone-button${index === state.aimIndex ? ' active' : ''}" data-zone="${zone.id}" type="button">${zone.label}</button>`,
              )
              .join('')}
          </div>
          <div id="keeper" class="keeper"></div>
          <div id="ball" class="ball"></div>
        </div>
        <div class="penalty-spot"></div>
      </div>

      <div class="stadium-actions">
        <div class="mobile-controls" aria-label="タッチ操作パネル">
          <button id="aim-prev" class="action-button secondary" type="button">ねらい ←</button>
          <button id="power-down" class="action-button secondary" type="button">パワー -</button>
          <button id="shoot-button" class="action-button primary" type="button">シュート</button>
          <button id="power-up" class="action-button secondary" type="button">パワー +</button>
          <button id="aim-next" class="action-button secondary" type="button">ねらい →</button>
        </div>

        <div class="control-row">
          <div class="control-box">
            <p class="label">操作</p>
            <p>ゴール内をタップしてコースを選び、下のボタンで強さを調整してシュート。</p>
          </div>
          <div class="control-box">
            <p class="label">成功メモ</p>
            <p id="success-note">右下は安定しやすいコースです。キーパーが中央に強いときに有効です。</p>
          </div>
        </div>
      </div>
    </section>

    <section class="insight-grid">
      <article class="insight-card coach-card">
        <p class="eyebrow">Coach Note</p>
        <h3>コーチの学び</h3>
        <p id="coach-tip"></p>
        <p id="coach-detail" class="detail"></p>
      </article>

      <article class="insight-card">
        <p class="eyebrow">Scout Report</p>
        <h3>相手の傾向</h3>
        <p id="keeper-hint"></p>
        <p class="detail">ラウンドごとにキーパーのねらいが少し変わります。次の1本を考えながら打つのがコツです。</p>
      </article>

      <article class="insight-card">
        <p class="eyebrow">Last Shot</p>
        <h3>前回の結果</h3>
        <p id="result-text">1本目が始まります。まずはキーパーの傾向を読んでみましょう。</p>
        <p id="result-detail" class="detail">高い所は止めにくいですが、リスクもあります。低い所は安定しやすいです。</p>
      </article>
    </section>

    <section class="history-card">
      <div class="history-head">
        <div>
          <p class="eyebrow">Round Log</p>
          <h3>プレーログ</h3>
        </div>
        <button id="reset-button" class="reset-button" type="button">もう一度遊ぶ</button>
      </div>
      <ol id="history-list" class="history-list"></ol>
    </section>
  </main>
`

const scoreEl = document.querySelector('#score')
const savesEl = document.querySelector('#saves')
const shotsLeftEl = document.querySelector('#shots-left')
const aimLabelEl = document.querySelector('#aim-label')
const keeperNameEl = document.querySelector('#keeper-name')
const powerLabelEl = document.querySelector('#power-label')
const successNoteEl = document.querySelector('#success-note')
const coachTipEl = document.querySelector('#coach-tip')
const coachDetailEl = document.querySelector('#coach-detail')
const keeperHintEl = document.querySelector('#keeper-hint')
const resultTextEl = document.querySelector('#result-text')
const resultDetailEl = document.querySelector('#result-detail')
const historyListEl = document.querySelector('#history-list')
const ballEl = document.querySelector('#ball')
const keeperEl = document.querySelector('#keeper')
const resetButton = document.querySelector('#reset-button')
const zoneButtons = [...document.querySelectorAll('.zone-button')]
const aimPrevButton = document.querySelector('#aim-prev')
const aimNextButton = document.querySelector('#aim-next')
const powerDownButton = document.querySelector('#power-down')
const powerUpButton = document.querySelector('#power-up')
const shootButton = document.querySelector('#shoot-button')

function getZone(index = state.aimIndex) {
  return zones[index]
}

function setKeeperProfile() {
  state.keeperProfile = keeperProfiles[(state.shotNumber - 1) % keeperProfiles.length]
}

function clampPower(nextPower) {
  return Math.max(45, Math.min(100, nextPower))
}

function getPowerAccuracyModifier(power) {
  if (power >= 88) return 0.16
  if (power >= 78) return 0.08
  if (power <= 55) return 0.05
  return 0
}

function estimateShotQuality(zone, power) {
  const base = 0.78 - zone.risk - getPowerAccuracyModifier(power)
  const profile = state.keeperProfile
  const biasRank = profile.bias.indexOf(zone.id)
  const biasPenalty = biasRank === -1 ? 0 : (6 - biasRank) * 0.04
  const scoreChance = Math.max(0.08, Math.min(0.9, base + 0.18 - biasPenalty))

  return {
    scoreChance,
    biasRank,
  }
}

function renderHud() {
  const zone = getZone()
  const { scoreChance, biasRank } = estimateShotQuality(zone, state.power)
  const percent = Math.round(scoreChance * 100)

  let biasText = '読み合いになりやすいコースです。強さとのバランスが大切です。'

  if (biasRank <= 1) {
    biasText = 'キーパーが読みやすいコースです。反対側を狙うと成功率が上がります。'
  } else if (biasRank >= 4) {
    biasText = 'キーパーの意識が薄いコースです。読み勝ちしやすい狙い目です。'
  }

  scoreEl.textContent = String(state.goals)
  savesEl.textContent = String(state.saves)
  shotsLeftEl.textContent = String(state.maxShots - state.history.length)
  aimLabelEl.textContent = zone.label
  keeperNameEl.textContent = state.keeperProfile.name
  powerLabelEl.textContent = String(state.power)
  successNoteEl.textContent = `予想成功率 ${percent}%。${biasText}`
  coachTipEl.textContent = `${zone.label}へ ${state.power}% で蹴る作戦です。`
  coachDetailEl.textContent = zone.learning
  keeperHintEl.textContent = state.keeperProfile.hint

  zoneButtons.forEach((button, index) => {
    button.classList.toggle('active', index === state.aimIndex)
  })
}

function renderHistory() {
  if (state.history.length === 0) {
    historyListEl.innerHTML = '<li>まだシュートはありません。</li>'
    return
  }

  historyListEl.innerHTML = state.history
    .map(
      (entry) => `<li><strong>${entry.label}</strong> ${entry.outcome}。${entry.note}</li>`,
    )
    .join('')
}

function resetActors() {
  ballEl.style.left = '50%'
  ballEl.style.top = '92%'
  ballEl.style.width = '30px'
  ballEl.style.height = '30px'
  ballEl.classList.remove('shot')
  keeperEl.style.left = '50%'
  keeperEl.style.top = '56%'
  keeperEl.className = 'keeper'
}

function chooseKeeperDive(targetZone) {
  const profile = state.keeperProfile
  const weightedChoice = Math.random()

  if (weightedChoice < 0.48) return profile.bias[0]
  if (weightedChoice < 0.78) return profile.bias[1]
  if (weightedChoice < 0.9) return profile.bias[2]
  if (weightedChoice < 0.95) return targetZone.id

  return profile.bias[Math.floor(Math.random() * profile.bias.length)]
}

function moveKeeper(zoneId) {
  const zone = zones.find((item) => item.id === zoneId) ?? zones[4]
  keeperEl.style.left = `${zone.x}%`
  keeperEl.style.top = `${zone.y + 8}%`
  keeperEl.className = `keeper ${zone.id.includes('left') ? 'dive-left' : zone.id.includes('right') ? 'dive-right' : 'hold-center'}`
}

function moveBall(zone) {
  ballEl.classList.add('shot')
  ballEl.style.left = `${zone.x}%`
  ballEl.style.top = `${zone.y}%`
  ballEl.style.width = '18px'
  ballEl.style.height = '18px'
}

function finishMatchIfNeeded() {
  if (state.history.length < state.maxShots) {
    return
  }

  let verdict = 'コースの使い分けを続けると、もっと決定率を上げられます。'

  if (state.goals >= 4) {
    verdict = 'すばらしいPK名人です。キーパーの傾向を見ながら落ち着いて決められました。'
  } else if (state.goals >= 2) {
    verdict = '読み合いはできています。次は苦手なコースにも挑戦するとさらに良くなります。'
  }

  resultTextEl.textContent = `試合終了 ${state.goals} / ${state.maxShots}本成功`
  resultDetailEl.textContent = verdict
}

function takeShot() {
  if (state.busy || state.history.length >= state.maxShots) {
    return
  }

  state.busy = true

  const zone = getZone()
  const { scoreChance, biasRank } = estimateShotQuality(zone, state.power)
  const missChance = zone.risk + getPowerAccuracyModifier(state.power)
  const roll = Math.random()
  const keeperDive = chooseKeeperDive(zone)
  const keeperReadsShot = keeperDive === zone.id
  const isMiss = roll < missChance * 0.45
  const isGoal = !isMiss && (!keeperReadsShot || roll < scoreChance)

  moveBall(zone)
  window.setTimeout(() => moveKeeper(keeperDive), 120)

  window.setTimeout(() => {
    let outcome = 'ゴール'
    let note = ''

    if (isMiss) {
      outcome = 'ミス'
      note =
        state.power >= 88
          ? '強く蹴りすぎて外れました。高いコースでは力加減が特に大切です。'
          : 'コースは良かったですが、少しだけずれました。'
    } else if (isGoal) {
      state.goals += 1
      note =
        biasRank >= 3
          ? 'キーパーの逆を取れました。読み勝ちできたナイスシュートです。'
          : '狙いと強さがかみ合いました。落ち着いて決められました。'
    } else {
      state.saves += 1
      outcome = 'セーブ'
      note =
        keeperReadsShot
          ? 'キーパーに読まれました。次は反対のコースも試してみましょう。'
          : 'コースは悪くありませんでしたが、相手の反応が少し上回りました。'
    }

    state.history.unshift({
      label: `${state.shotNumber}本目: ${zone.label} / ${state.power}%`,
      outcome,
      note,
    })

    resultTextEl.textContent = `${state.shotNumber}本目は${outcome}。`
    resultDetailEl.textContent = note

    state.shotNumber += 1
    setKeeperProfile()
    renderHud()
    renderHistory()
    finishMatchIfNeeded()

    window.setTimeout(() => {
      resetActors()
      state.busy = false
    }, 900)
  }, 1100)
}

function resetGame() {
  state.shotNumber = 1
  state.goals = 0
  state.saves = 0
  state.aimIndex = 4
  state.power = 72
  state.busy = false
  state.history = []
  setKeeperProfile()
  resetActors()
  renderHud()
  renderHistory()
  resultTextEl.textContent = '1本目が始まります。まずはキーパーの傾向を読んでみましょう。'
  resultDetailEl.textContent = '高い所は止めにくいですが、リスクもあります。低い所は安定しやすいです。'
}

function updateAim(direction) {
  const nextIndex = (state.aimIndex + direction + zones.length) % zones.length
  state.aimIndex = nextIndex
  renderHud()
}

function updatePower(direction) {
  state.power = clampPower(state.power + direction * 5)
  renderHud()
}

document.addEventListener('keydown', (event) => {
  if (event.code === 'ArrowLeft') {
    event.preventDefault()
    updateAim(-1)
  } else if (event.code === 'ArrowRight') {
    event.preventDefault()
    updateAim(1)
  } else if (event.code === 'ArrowUp') {
    event.preventDefault()
    updatePower(1)
  } else if (event.code === 'ArrowDown') {
    event.preventDefault()
    updatePower(-1)
  } else if (event.code === 'Space' || event.code === 'Enter') {
    event.preventDefault()
    takeShot()
  }
})

zoneButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    state.aimIndex = index
    renderHud()
  })
})

aimPrevButton.addEventListener('click', () => updateAim(-1))
aimNextButton.addEventListener('click', () => updateAim(1))
powerDownButton.addEventListener('click', () => updatePower(-1))
powerUpButton.addEventListener('click', () => updatePower(1))
shootButton.addEventListener('click', takeShot)
resetButton.addEventListener('click', resetGame)

resetGame()
