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

const quizBank = [
  {
    subject: '算数',
    question: '0.25L は何mLでしょう？',
    choices: ['25mL', '250mL', '2500mL', '75mL'],
    answerIndex: 1,
    explanation: '1L は 1000mL なので、0.25L は 250mL です。',
  },
  {
    subject: '算数',
    question: '3/4 と同じ大きさの小数はどれ？',
    choices: ['0.25', '0.34', '0.75', '0.8'],
    answerIndex: 2,
    explanation: '4つに分けたうちの3つ分なので 0.75 です。',
  },
  {
    subject: '理科',
    question: '月が光って見えるのはなぜ？',
    choices: ['月が自分で光るから', '太陽の光を反射するから', '星の光を集めるから', '雲が光らせるから'],
    answerIndex: 1,
    explanation: '月は自分では光らず、太陽の光を反射して見えます。',
  },
  {
    subject: '理科',
    question: '植物が昼に行う「でんぷんをつくるはたらき」は？',
    choices: ['発芽', '蒸発', '光合成', '消化'],
    answerIndex: 2,
    explanation: '日光を使って養分をつくるはたらきが光合成です。',
  },
  {
    subject: '社会',
    question: '日本でいちばん面積が広い都道府県は？',
    choices: ['北海道', '岩手県', '長野県', '新潟県'],
    answerIndex: 0,
    explanation: '北海道が最も広い都道府県です。',
  },
  {
    subject: '社会',
    question: '国会で法律をつくる中心となる場所は？',
    choices: ['裁判所', '市役所', '国会議事堂', '警察署'],
    answerIndex: 2,
    explanation: '国会議事堂で国会が開かれ、法律づくりが進みます。',
  },
  {
    subject: '国語',
    question: '「努力」の意味にいちばん近い言葉は？',
    choices: ['なまけること', '力をつくすこと', 'あきらめること', '休むこと'],
    answerIndex: 1,
    explanation: '努力は、目標に向かって力をつくすことです。',
  },
  {
    subject: '国語',
    question: '「潮」の読みとして正しいものはどれ？',
    choices: ['しお', 'うみ', 'なみ', 'みず'],
    answerIndex: 0,
    explanation: '「潮」は「しお」と読み、海の満ち引きにも使います。',
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
  keeperBoost: 0,
  quizDeck: [],
  currentQuestion: null,
  selectedChoice: null,
  answerResolved: false,
  lastAnswerCorrect: null,
}

const app = document.querySelector('#app')

app.innerHTML = `
  <main class="game-shell">
    <section class="hero-panel">
      <div>
        <p class="eyebrow">Quiz Penalty Keeper</p>
        <h1>クイズに答えて PK を決めよう</h1>
        <p class="intro">
          日本の小学生高学年向けの4択クイズに答えてからシュート。<strong>間違えるたびにキーパーが強くなり、読みも反応もどんどん鋭くなります。</strong>
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

      <section class="quiz-card">
        <div class="quiz-head">
          <div>
            <p class="eyebrow">Quiz Mission</p>
            <h3 id="quiz-subject">算数</h3>
          </div>
          <div class="keeper-boost-box">
            <p class="label">キーパー強化</p>
            <strong id="keeper-boost">Lv.0</strong>
          </div>
        </div>
        <p id="question-text" class="question-text"></p>
        <div id="answer-buttons" class="answer-grid"></div>
        <p id="quiz-feedback" class="quiz-feedback">答えを選ぶと結果が出ます。正解ならそのまま攻め、不正解ならキーパーが強化されます。</p>
      </section>

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
          <button id="shoot-button" class="action-button primary" type="button">答えてシュート</button>
          <button id="power-up" class="action-button secondary" type="button">パワー +</button>
          <button id="aim-next" class="action-button secondary" type="button">ねらい →</button>
        </div>

        <div class="control-row">
          <div class="control-box">
            <p class="label">操作</p>
            <p>4択クイズに答えてから、ゴール内をタップしてコースを選び、強さを調整してシュートします。</p>
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
        <p id="keeper-boost-detail" class="detail"></p>
      </article>

      <article class="insight-card">
        <p class="eyebrow">Last Shot</p>
        <h3>前回の結果</h3>
        <p id="result-text">1本目が始まります。まずはクイズに答えて、キーパーの傾向も読んでみましょう。</p>
        <p id="result-detail" class="detail">正解なら落ち着いて狙えます。不正解だとキーパーが強化されて厳しくなります。</p>
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
const keeperBoostDetailEl = document.querySelector('#keeper-boost-detail')
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
const quizSubjectEl = document.querySelector('#quiz-subject')
const keeperBoostEl = document.querySelector('#keeper-boost')
const questionTextEl = document.querySelector('#question-text')
const answerButtonsEl = document.querySelector('#answer-buttons')
const quizFeedbackEl = document.querySelector('#quiz-feedback')

function shuffleArray(items) {
  const next = [...items]

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
  }

  return next
}

function getZone(index = state.aimIndex) {
  return zones[index]
}

function setKeeperProfile() {
  state.keeperProfile = keeperProfiles[(state.shotNumber - 1) % keeperProfiles.length]
}

function setCurrentQuestion() {
  state.currentQuestion = state.quizDeck[state.history.length] ?? null
  state.selectedChoice = null
  state.answerResolved = false
  state.lastAnswerCorrect = null
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

function getKeeperBoostPenalty() {
  return Math.min(0.26, state.keeperBoost * 0.05)
}

function estimateShotQuality(zone, power) {
  const base = 0.78 - zone.risk - getPowerAccuracyModifier(power) - getKeeperBoostPenalty()
  const profile = state.keeperProfile
  const biasRank = profile.bias.indexOf(zone.id)
  const biasPenalty = (biasRank === -1 ? 0 : (6 - biasRank) * 0.04) + state.keeperBoost * 0.015
  const scoreChance = Math.max(0.06, Math.min(0.9, base + 0.18 - biasPenalty))

  return {
    scoreChance,
    biasRank,
  }
}

function renderAnswers() {
  const question = state.currentQuestion

  if (!question) {
    answerButtonsEl.innerHTML = ''
    return
  }

  answerButtonsEl.innerHTML = question.choices
    .map((choice, index) => {
      const classes = ['answer-button']

      if (state.answerResolved && index === state.selectedChoice) {
        classes.push(state.lastAnswerCorrect ? 'correct' : 'wrong')
      }

      if (state.answerResolved && index === question.answerIndex) {
        classes.push('reveal')
      }

      const disabled = state.answerResolved ? 'disabled' : ''
      return `<button class="${classes.join(' ')}" data-answer-index="${index}" type="button" ${disabled}>${index + 1}. ${choice}</button>`
    })
    .join('')

  ;[...answerButtonsEl.querySelectorAll('.answer-button')].forEach((button) => {
    button.addEventListener('click', () => {
      resolveAnswer(Number(button.dataset.answerIndex))
    })
  })
}

function renderQuiz() {
  const question = state.currentQuestion

  if (!question) {
    quizSubjectEl.textContent = '全ラウンド終了'
    questionTextEl.textContent = '5本のチャレンジが終わりました。もう一度遊ぶで新しいクイズに挑戦できます。'
    quizFeedbackEl.textContent = 'キーパー強化は次の試合でリセットされます。'
    renderAnswers()
    return
  }

  quizSubjectEl.textContent = `${question.subject}クイズ`
  questionTextEl.textContent = `Q${state.shotNumber}. ${question.question}`

  if (!state.answerResolved) {
    quizFeedbackEl.textContent = '先に答えを選んでください。正解ならそのまま勝負、不正解ならキーパーが強くなります。'
  } else if (state.lastAnswerCorrect) {
    quizFeedbackEl.textContent = `正解。${question.explanation}`
  } else {
    quizFeedbackEl.textContent = `不正解。${question.explanation} キーパー強化で反応が上がりました。`
  }

  renderAnswers()
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
  keeperBoostEl.textContent = `Lv.${state.keeperBoost}`
  successNoteEl.textContent = `予想成功率 ${percent}%。${biasText}`
  coachTipEl.textContent = `${zone.label}へ ${state.power}% で蹴る作戦です。`
  coachDetailEl.textContent = zone.learning
  keeperHintEl.textContent = state.keeperProfile.hint
  keeperBoostDetailEl.textContent =
    state.keeperBoost === 0
      ? 'まだ強化されていません。まずは正解を続けて主導権を握りましょう。'
      : `現在は Lv.${state.keeperBoost}。不正解のぶんだけ反応が鋭くなり、読まれやすくなっています。`

  zoneButtons.forEach((button, index) => {
    button.classList.toggle('active', index === state.aimIndex)
  })

  keeperEl.style.setProperty('--keeper-scale', String(1 + state.keeperBoost * 0.08))
}

function renderHistory() {
  if (state.history.length === 0) {
    historyListEl.innerHTML = '<li>まだシュートはありません。</li>'
    return
  }

  historyListEl.innerHTML = state.history
    .map(
      (entry) =>
        `<li><strong>${entry.label}</strong> ${entry.quizOutcome}。${entry.outcome}。${entry.note}</li>`,
    )
    .join('')
}

function resetActors() {
  ballEl.style.left = '50%'
  ballEl.style.top = '95%'
  ballEl.style.width = '30px'
  ballEl.style.height = '30px'
  ballEl.classList.remove('shot')
  keeperEl.style.left = '50%'
  keeperEl.style.top = '56%'
  keeperEl.className = 'keeper'
  keeperEl.style.setProperty('--keeper-scale', String(1 + state.keeperBoost * 0.08))
}

function chooseKeeperDive(targetZone) {
  const profile = state.keeperProfile
  const weightedChoice = Math.random()
  const focusBoost = Math.min(0.18, state.keeperBoost * 0.04)
  const secondBoost = Math.min(0.1, state.keeperBoost * 0.02)
  const directReadBoost = Math.min(0.16, state.keeperBoost * 0.03)

  if (weightedChoice < 0.48 + focusBoost) return profile.bias[0]
  if (weightedChoice < 0.78 + focusBoost + secondBoost) return profile.bias[1]
  if (weightedChoice < 0.9 + secondBoost) return profile.bias[2]
  if (weightedChoice < 0.95 + directReadBoost) return targetZone.id

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

  let verdict = 'クイズとコース選びを両立できるようになると、さらに安定して決められます。'

  if (state.goals >= 4) {
    verdict = 'すばらしいです。学びと読み合いの両方でキーパーを上回りました。'
  } else if (state.goals >= 2) {
    verdict = 'あと一歩です。クイズでの正解を増やせば、キーパーを強化させずに有利に進められます。'
  }

  resultTextEl.textContent = `試合終了 ${state.goals} / ${state.maxShots}本成功`
  resultDetailEl.textContent = verdict
}

function resolveAnswer(choiceIndex) {
  if (state.busy || state.answerResolved || !state.currentQuestion) {
    return
  }

  state.selectedChoice = choiceIndex
  state.answerResolved = true
  state.lastAnswerCorrect = choiceIndex === state.currentQuestion.answerIndex

  if (!state.lastAnswerCorrect) {
    state.keeperBoost += 1
  }

  renderQuiz()
  renderHud()
}

function takeShot() {
  if (state.busy || state.history.length >= state.maxShots) {
    return
  }

  if (!state.answerResolved || !state.currentQuestion) {
    resultTextEl.textContent = '先にクイズへ答えてください。'
    resultDetailEl.textContent = '4つの選択肢から1つ選ぶと、そのラウンドのキーパー強化が確定します。'
    return
  }

  state.busy = true

  const zone = getZone()
  const question = state.currentQuestion
  const answerWasCorrect = state.lastAnswerCorrect
  const { scoreChance, biasRank } = estimateShotQuality(zone, state.power)
  const missChance = zone.risk + getPowerAccuracyModifier(state.power) + state.keeperBoost * 0.01
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

    const quizOutcome = answerWasCorrect
      ? `クイズ正解 (${question.subject})`
      : `クイズ不正解 (${question.subject})`

    state.history.unshift({
      label: `${state.shotNumber}本目: ${zone.label} / ${state.power}%`,
      quizOutcome,
      outcome,
      note,
    })

    resultTextEl.textContent = `${state.shotNumber}本目は${quizOutcome}、シュートは${outcome}。`
    resultDetailEl.textContent = answerWasCorrect
      ? `${question.explanation} ${note}`
      : `${question.explanation} 不正解でキーパーが強化された状態でした。${note}`

    state.shotNumber += 1
    setKeeperProfile()
    setCurrentQuestion()
    renderQuiz()
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
  state.keeperBoost = 0
  state.quizDeck = shuffleArray(quizBank).slice(0, state.maxShots)
  setKeeperProfile()
  setCurrentQuestion()
  resetActors()
  renderQuiz()
  renderHud()
  renderHistory()
  resultTextEl.textContent = '1本目が始まります。まずはクイズに答えて、キーパーの傾向も読んでみましょう。'
  resultDetailEl.textContent = '正解なら有利なまま攻められます。不正解だとキーパーが強くなります。'
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
