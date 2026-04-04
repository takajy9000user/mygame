import './style.css'

const gradeSettings = [
  { id: 'special', label: '特級', enemyName: '特級呪霊', maxHp: 140, damage: 28 },
  { id: 'grade1', label: '一級', enemyName: '一級呪霊', maxHp: 130, damage: 24 },
  { id: 'semi1', label: '準一級', enemyName: '準一級呪霊', maxHp: 120, damage: 22 },
  { id: 'grade2', label: '二級', enemyName: '二級呪霊', maxHp: 110, damage: 20 },
  { id: 'semi2', label: '準二級', enemyName: '準二級呪霊', maxHp: 100, damage: 18 },
  { id: 'grade3', label: '三級', enemyName: '三級呪霊', maxHp: 90, damage: 16 },
  { id: 'grade4', label: '四級', enemyName: '四級呪霊', maxHp: 80, damage: 14 },
]

const questionBank = {
  special: [
    {
      subject: '算数',
      question: '1.25 ÷ 0.05 の答えはどれ？',
      choices: ['2.5', '25', '250', '0.25'],
      answerIndex: 1,
      explanation: '0.05 は 1/20 なので、1.25 ÷ 0.05 = 25 です。',
    },
    {
      subject: '理科',
      question: '流れる水のはたらきとして正しくないものはどれ？',
      choices: ['けずる', '運ぶ', 'つもらせる', '発光させる'],
      answerIndex: 3,
      explanation: '水のはたらきは、けずる・運ぶ・つもらせるです。',
    },
    {
      subject: '社会',
      question: '日本国憲法の三原則に入らないものはどれ？',
      choices: ['国民主権', '基本的人権の尊重', '平和主義', '地方分権'],
      answerIndex: 3,
      explanation: '三原則は国民主権、基本的人権の尊重、平和主義です。',
    },
    {
      subject: '国語',
      question: '「異口同音」の意味として最も近いものはどれ？',
      choices: ['別々の話をすること', 'みんなが同じことを言うこと', '小声で相談すること', '順番に発表すること'],
      answerIndex: 1,
      explanation: '異口同音は、多くの人が同じことを言うことです。',
    },
  ],
  grade1: [
    {
      subject: '算数',
      question: '3/5 を百分率で表すとどれ？',
      choices: ['0.6%', '6%', '60%', '600%'],
      answerIndex: 2,
      explanation: '3/5 = 0.6 なので 60% です。',
    },
    {
      subject: '理科',
      question: 'ふりこが1往復する時間に最も関係が深いのはどれ？',
      choices: ['おもりの色', '糸の長さ', 'おもりの形', '振れた回数'],
      answerIndex: 1,
      explanation: 'ふりこの往復時間は主に糸の長さで変わります。',
    },
    {
      subject: '社会',
      question: '国会の衆議院議員総選挙で選ばれるのはどれ？',
      choices: ['内閣総理大臣', '裁判官', '衆議院議員', '都道府県知事'],
      answerIndex: 2,
      explanation: '総選挙で選ばれるのは衆議院議員です。',
    },
    {
      subject: '国語',
      question: '「絶景」の意味に最も近いものはどれ？',
      choices: ['とてもすばらしい景色', '暗い夜道', '古い建物', 'にぎやかな市場'],
      answerIndex: 0,
      explanation: '絶景は、とてもすばらしい景色のことです。',
    },
  ],
  semi1: [
    {
      subject: '算数',
      question: '8.4 を 0.7 で割るといくつ？',
      choices: ['1.2', '12', '120', '0.12'],
      answerIndex: 1,
      explanation: '8.4 ÷ 0.7 = 12 です。',
    },
    {
      subject: '理科',
      question: '植物の葉に日光が当たるとでんぷんができるはたらきは？',
      choices: ['発芽', '蒸散', '光合成', '消化'],
      answerIndex: 2,
      explanation: '日光を使って養分をつくるのが光合成です。',
    },
    {
      subject: '社会',
      question: '日本の都道府県で最も北にあるのはどこ？',
      choices: ['青森県', '北海道', '岩手県', '秋田県'],
      answerIndex: 1,
      explanation: '最も北にある都道府県は北海道です。',
    },
    {
      subject: '国語',
      question: '「感心」の使い方として正しいものはどれ？',
      choices: ['忘れ物をして感心した', 'よく努力していて感心した', '道に迷って感心した', '雨が降って感心した'],
      answerIndex: 1,
      explanation: '感心は、すばらしいと思って心を動かされることです。',
    },
  ],
  grade2: [
    {
      subject: '算数',
      question: '2.5L は何mL？',
      choices: ['25mL', '250mL', '2500mL', '25000mL'],
      answerIndex: 2,
      explanation: '1L = 1000mL なので 2.5L = 2500mL です。',
    },
    {
      subject: '理科',
      question: '人の体で、食べ物を消化するはたらきがある器官はどれ？',
      choices: ['心ぞう', '胃', '肺', '筋肉'],
      answerIndex: 1,
      explanation: '胃は食べ物の消化に関わる器官です。',
    },
    {
      subject: '社会',
      question: '日本の国会が開かれる建物はどれ？',
      choices: ['国会議事堂', '国立博物館', '最高裁判所', '首相官邸'],
      answerIndex: 0,
      explanation: '国会が開かれるのは国会議事堂です。',
    },
    {
      subject: '国語',
      question: '「協力」の反対に近い言葉はどれ？',
      choices: ['助け合い', '対立', '応援', '工夫'],
      answerIndex: 1,
      explanation: '協力の反対に近いのは対立です。',
    },
  ],
  semi2: [
    {
      subject: '算数',
      question: '1/4 と同じ大きさの小数はどれ？',
      choices: ['0.4', '0.25', '0.75', '0.2'],
      answerIndex: 1,
      explanation: '1/4 = 0.25 です。',
    },
    {
      subject: '理科',
      question: '月が光って見える理由はどれ？',
      choices: ['月が自分で光るから', '太陽の光を反射するから', '星の光を集めるから', '地球が光らせるから'],
      answerIndex: 1,
      explanation: '月は太陽の光を反射して見えます。',
    },
    {
      subject: '社会',
      question: '日本でいちばん広い都道府県はどこ？',
      choices: ['北海道', '長野県', '岩手県', '新潟県'],
      answerIndex: 0,
      explanation: '面積が最も広い都道府県は北海道です。',
    },
    {
      subject: '国語',
      question: '「努力」に近い意味の言葉はどれ？',
      choices: ['なまける', '力をつくす', '遊び続ける', 'ねむる'],
      answerIndex: 1,
      explanation: '努力は、目標に向かって力をつくすことです。',
    },
  ],
  grade3: [
    {
      subject: '算数',
      question: '36 ÷ 6 はいくつ？',
      choices: ['5', '6', '7', '8'],
      answerIndex: 1,
      explanation: '36 を 6 で割ると 6 です。',
    },
    {
      subject: '理科',
      question: '植物を育てるのに必要なものとして正しいものはどれ？',
      choices: ['水', 'ゲーム機', 'けしゴム', '金づち'],
      answerIndex: 0,
      explanation: '植物の成長には水が必要です。',
    },
    {
      subject: '社会',
      question: '学校や市役所がある国を何という？',
      choices: ['都道府県', '市町村', '外国', '海'],
      answerIndex: 1,
      explanation: '市役所などがある単位は市町村です。',
    },
    {
      subject: '国語',
      question: '「山」の読みはどれ？',
      choices: ['うみ', 'やま', 'かわ', 'もり'],
      answerIndex: 1,
      explanation: '山は「やま」と読みます。',
    },
  ],
  grade4: [
    {
      subject: '算数',
      question: '5 + 7 はいくつ？',
      choices: ['11', '12', '13', '14'],
      answerIndex: 1,
      explanation: '5 + 7 = 12 です。',
    },
    {
      subject: '理科',
      question: '昼の空に見えることが多いものはどれ？',
      choices: ['月', '太陽', '星だけ', '流れ星'],
      answerIndex: 1,
      explanation: '昼の空でよく見えるのは太陽です。',
    },
    {
      subject: '社会',
      question: '日本の首都はどこ？',
      choices: ['大阪', '東京', '札幌', '名古屋'],
      answerIndex: 1,
      explanation: '日本の首都は東京です。',
    },
    {
      subject: '国語',
      question: '「あか」の色として正しいものはどれ？',
      choices: ['赤', '青', '白', '黒'],
      answerIndex: 0,
      explanation: '「あか」は赤です。',
    },
  ],
}

const state = {
  selectedGrade: gradeSettings[3].id,
  currentQuestion: null,
  selectedChoice: null,
  answerResolved: false,
  playerHp: 0,
  enemyHp: 0,
  maxHp: 0,
  damage: 0,
  turn: 1,
  busy: false,
  result: '',
  history: [],
  quizDeck: [],
  enemyMood: '静観',
}

const app = document.querySelector('#app')

app.innerHTML = `
  <main class="game-shell">
    <section class="hero-panel">
      <div>
        <p class="eyebrow">Cursed Quiz Battle</p>
        <h1>クイズで術式を決めて 呪霊にダメージ</h1>
        <p class="intro">
          呪術バトル風のクイズ対戦です。<strong>正解すると相手にダメージ、不正解だと自分がダメージを受けます。</strong> 階級を選ぶと問題の難しさと戦闘の重さが変わります。
        </p>
      </div>
      <div class="score-card battle-card">
        <div>
          <span>自分HP</span>
          <strong id="player-hp">100</strong>
        </div>
        <div>
          <span>敵HP</span>
          <strong id="enemy-hp">100</strong>
        </div>
        <div>
          <span>ターン</span>
          <strong id="turn-count">1</strong>
        </div>
      </div>
    </section>

    <section class="stadium-card">
      <section class="grade-card">
        <div>
          <p class="eyebrow">Grade Select</p>
          <h2>難しさを選ぶ</h2>
        </div>
        <div id="grade-buttons" class="grade-grid"></div>
        <p id="grade-detail" class="grade-detail"></p>
      </section>

      <section class="battle-stage">
        <div class="fighter-card player-side">
          <p class="label">術師</p>
          <h3>高専の術師</h3>
          <div class="hp-bar"><div id="player-bar" class="hp-fill player-fill"></div></div>
          <p id="player-status" class="fighter-status">集中して術式を準備中</p>
        </div>

        <div class="versus-column">
          <div id="battle-flash" class="battle-flash">戦闘開始</div>
          <div class="orb arena-orb" aria-hidden="true"></div>
        </div>

        <div class="fighter-card enemy-side">
          <p class="label">呪霊</p>
          <h3 id="enemy-name">二級呪霊</h3>
          <div class="hp-bar"><div id="enemy-bar" class="hp-fill enemy-fill"></div></div>
          <p id="enemy-status" class="fighter-status">こちらを観察している</p>
        </div>
      </section>

      <section class="quiz-card">
        <div class="quiz-head">
          <div>
            <p class="eyebrow">Quiz Technique</p>
            <h3 id="quiz-subject">算数術式</h3>
          </div>
          <div class="keeper-boost-box">
            <p class="label">与えるダメージ</p>
            <strong id="damage-label">20</strong>
          </div>
        </div>
        <p id="question-text" class="question-text"></p>
        <div id="answer-buttons" class="answer-grid"></div>
        <p id="quiz-feedback" class="quiz-feedback">答えを選ぶと、その場でダメージ判定が発生します。</p>
      </section>

      <div class="stadium-actions">
        <div class="mobile-controls" aria-label="操作パネル">
          <button id="next-button" class="action-button primary" type="button">次の問題へ</button>
          <button id="reset-button" class="action-button secondary" type="button">同じ階級で再戦</button>
        </div>

        <div class="control-row">
          <div class="control-box">
            <p class="label">ルール</p>
            <p>正解なら呪霊にダメージ。不正解なら自分がダメージを受けます。どちらかのHPが0になると決着です。</p>
          </div>
          <div class="control-box">
            <p class="label">戦術メモ</p>
            <p id="success-note">階級が高いほどダメージが大きく、問題も手ごわくなります。</p>
          </div>
        </div>
      </div>
    </section>

    <section class="insight-grid">
      <article class="insight-card coach-card">
        <p class="eyebrow">Battle Note</p>
        <h3>術式の助言</h3>
        <p id="coach-tip"></p>
        <p id="coach-detail" class="detail"></p>
      </article>

      <article class="insight-card">
        <p class="eyebrow">Enemy Read</p>
        <h3>敵の気配</h3>
        <p id="enemy-read"></p>
        <p id="enemy-detail" class="detail"></p>
      </article>

      <article class="insight-card">
        <p class="eyebrow">Last Action</p>
        <h3>直前の結果</h3>
        <p id="result-text">階級を選んで戦闘を始めてください。</p>
        <p id="result-detail" class="detail">最初の問題からダメージ判定が入ります。</p>
      </article>
    </section>

    <section class="history-card">
      <div class="history-head">
        <div>
          <p class="eyebrow">Battle Log</p>
          <h3>戦闘ログ</h3>
        </div>
      </div>
      <ol id="history-list" class="history-list"></ol>
    </section>
  </main>
`

const playerHpEl = document.querySelector('#player-hp')
const enemyHpEl = document.querySelector('#enemy-hp')
const turnCountEl = document.querySelector('#turn-count')
const gradeButtonsEl = document.querySelector('#grade-buttons')
const gradeDetailEl = document.querySelector('#grade-detail')
const playerBarEl = document.querySelector('#player-bar')
const enemyBarEl = document.querySelector('#enemy-bar')
const playerStatusEl = document.querySelector('#player-status')
const enemyStatusEl = document.querySelector('#enemy-status')
const battleFlashEl = document.querySelector('#battle-flash')
const enemyNameEl = document.querySelector('#enemy-name')
const quizSubjectEl = document.querySelector('#quiz-subject')
const damageLabelEl = document.querySelector('#damage-label')
const questionTextEl = document.querySelector('#question-text')
const answerButtonsEl = document.querySelector('#answer-buttons')
const quizFeedbackEl = document.querySelector('#quiz-feedback')
const nextButton = document.querySelector('#next-button')
const resetButton = document.querySelector('#reset-button')
const successNoteEl = document.querySelector('#success-note')
const coachTipEl = document.querySelector('#coach-tip')
const coachDetailEl = document.querySelector('#coach-detail')
const enemyReadEl = document.querySelector('#enemy-read')
const enemyDetailEl = document.querySelector('#enemy-detail')
const resultTextEl = document.querySelector('#result-text')
const resultDetailEl = document.querySelector('#result-detail')
const historyListEl = document.querySelector('#history-list')

function shuffleArray(items) {
  const next = [...items]

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
  }

  return next
}

function getGrade() {
  return gradeSettings.find((grade) => grade.id === state.selectedGrade) ?? gradeSettings[0]
}

function buildDeck() {
  state.quizDeck = shuffleArray(questionBank[state.selectedGrade] ?? [])
}

function setCurrentQuestion() {
  if (state.quizDeck.length === 0) {
    buildDeck()
  }

  state.currentQuestion = state.quizDeck.shift() ?? null
  state.selectedChoice = null
  state.answerResolved = false
}

function updateBars() {
  const playerPercent = Math.max(0, (state.playerHp / state.maxHp) * 100)
  const enemyPercent = Math.max(0, (state.enemyHp / state.maxHp) * 100)

  playerBarEl.style.width = `${playerPercent}%`
  enemyBarEl.style.width = `${enemyPercent}%`
}

function renderGrades() {
  gradeButtonsEl.innerHTML = gradeSettings
    .map((grade) => {
      const active = grade.id === state.selectedGrade ? ' active' : ''
      return `<button class="grade-button${active}" data-grade="${grade.id}" type="button">${grade.label}</button>`
    })
    .join('')

  ;[...gradeButtonsEl.querySelectorAll('.grade-button')].forEach((button) => {
    button.addEventListener('click', () => {
      state.selectedGrade = button.dataset.grade
      startBattle()
    })
  })
}

function renderAnswers() {
  if (!state.currentQuestion) {
    answerButtonsEl.innerHTML = ''
    return
  }

  answerButtonsEl.innerHTML = state.currentQuestion.choices
    .map((choice, index) => {
      const classes = ['answer-button']

      if (state.answerResolved && index === state.selectedChoice) {
        classes.push(index === state.currentQuestion.answerIndex ? 'correct' : 'wrong')
      }

      if (state.answerResolved && index === state.currentQuestion.answerIndex) {
        classes.push('reveal')
      }

      const disabled = state.answerResolved || isBattleFinished() ? 'disabled' : ''
      return `<button class="${classes.join(' ')}" data-answer-index="${index}" type="button" ${disabled}>${index + 1}. ${choice}</button>`
    })
    .join('')

  ;[...answerButtonsEl.querySelectorAll('.answer-button')].forEach((button) => {
    button.addEventListener('click', () => {
      resolveAnswer(Number(button.dataset.answerIndex))
    })
  })
}

function renderHud() {
  const grade = getGrade()

  playerHpEl.textContent = String(state.playerHp)
  enemyHpEl.textContent = String(state.enemyHp)
  turnCountEl.textContent = String(state.turn)
  enemyNameEl.textContent = grade.enemyName
  damageLabelEl.textContent = String(state.damage)
  gradeDetailEl.textContent = `${grade.label}は ${grade.enemyName} との戦いです。1回の正誤で ${state.damage} ダメージ発生します。`
  successNoteEl.textContent = `${grade.label}では一問の重みが大きいです。落ち着いて答えるほど勝率が上がります。`
  coachTipEl.textContent = `${state.currentQuestion?.subject ?? '学習'}の正答で術式が発動します。`
  coachDetailEl.textContent =
    state.currentQuestion?.explanation ?? '次の問題で術式を決めてください。'
  enemyReadEl.textContent = `${grade.enemyName}は ${state.enemyMood}。`
  enemyDetailEl.textContent =
    state.answerResolved
      ? '正解なら攻め切り、不正解なら反撃を受ける緊張感があります。'
      : '解答前はまだ判定されていません。問題文をよく読んでください。'

  updateBars()
  renderGrades()
  renderAnswers()
}

function renderQuestion() {
  if (!state.currentQuestion) {
    quizSubjectEl.textContent = '戦闘終了'
    questionTextEl.textContent = '勝負は決着しました。再戦するか、階級を変えて別の敵に挑戦してください。'
    quizFeedbackEl.textContent = '次の問題へは戦闘中のみ使えます。'
    renderAnswers()
    return
  }

  quizSubjectEl.textContent = `${state.currentQuestion.subject}術式`
  questionTextEl.textContent = `Q${state.turn}. ${state.currentQuestion.question}`

  if (!state.answerResolved) {
    quizFeedbackEl.textContent = '正解すると敵にダメージ。不正解だと自分にダメージです。'
  }

  renderAnswers()
}

function renderHistory() {
  if (state.history.length === 0) {
    historyListEl.innerHTML = '<li>まだ行動ログはありません。</li>'
    return
  }

  historyListEl.innerHTML = state.history
    .map((entry) => `<li><strong>${entry.turn}</strong> ${entry.result}。${entry.note}</li>`)
    .join('')
}

function isBattleFinished() {
  return state.playerHp <= 0 || state.enemyHp <= 0
}

function setBattleMessage(title, detail) {
  resultTextEl.textContent = title
  resultDetailEl.textContent = detail
}

function finishBattle() {
  if (!isBattleFinished()) {
    return
  }

  if (state.enemyHp <= 0) {
    battleFlashEl.textContent = '祓い成功'
    playerStatusEl.textContent = '勝負あり。術式が決まった'
    enemyStatusEl.textContent = '呪霊は力を失った'
    setBattleMessage('勝利', '最後まで正解を重ねて呪霊を祓いました。')
  } else {
    battleFlashEl.textContent = '被弾'
    playerStatusEl.textContent = '術式が乱れ、倒れこんだ'
    enemyStatusEl.textContent = '呪霊が優位に立っている'
    setBattleMessage('敗北', '不正解が重なって自分のHPが尽きました。階級を下げて再挑戦できます。')
  }

  state.currentQuestion = null
  renderQuestion()
  renderHud()
}

function applyDamage(isCorrect) {
  const grade = getGrade()

  state.enemyMood = isCorrect ? '隙を見せている' : '反撃態勢'

  if (isCorrect) {
    state.enemyHp = Math.max(0, state.enemyHp - state.damage)
    playerStatusEl.textContent = `${grade.label}術式が命中した`
    enemyStatusEl.textContent = `${state.damage} ダメージを受けて揺らいでいる`
    battleFlashEl.textContent = `-${state.damage} 呪霊`
  } else {
    state.playerHp = Math.max(0, state.playerHp - state.damage)
    playerStatusEl.textContent = `${state.damage} ダメージを受けた`
    enemyStatusEl.textContent = '不正解を見て反撃してきた'
    battleFlashEl.textContent = `-${state.damage} 自分`
  }
}

function resolveAnswer(choiceIndex) {
  if (state.busy || state.answerResolved || !state.currentQuestion || isBattleFinished()) {
    return
  }

  state.answerResolved = true
  state.selectedChoice = choiceIndex

  const isCorrect = choiceIndex === state.currentQuestion.answerIndex
  const target = isCorrect ? '敵' : '自分'

  applyDamage(isCorrect)

  const result = isCorrect ? '正解して敵にダメージ' : '不正解で自分がダメージ'
  const note = `${state.currentQuestion.explanation} ${target}が ${state.damage} ダメージを受けました。`

  state.history.unshift({
    turn: `${state.turn}ターン目`,
    result,
    note,
  })

  quizFeedbackEl.textContent = isCorrect
    ? `正解。${state.currentQuestion.explanation} 呪霊に ${state.damage} ダメージ。`
    : `不正解。${state.currentQuestion.explanation} 自分が ${state.damage} ダメージ。`

  setBattleMessage(result, note)
  renderHud()
  renderHistory()
  finishBattle()
}

function nextTurn() {
  if (state.busy || isBattleFinished()) {
    return
  }

  if (!state.answerResolved) {
    setBattleMessage('まだ未解答です', '現在の問題に答えてから次へ進んでください。')
    return
  }

  state.turn += 1
  setCurrentQuestion()
  battleFlashEl.textContent = `第${state.turn}問`
  playerStatusEl.textContent = '次の術式を準備している'
  enemyStatusEl.textContent = '次の一手をうかがっている'
  renderQuestion()
  renderHud()
}

function startBattle() {
  const grade = getGrade()

  state.maxHp = grade.maxHp
  state.playerHp = grade.maxHp
  state.enemyHp = grade.maxHp
  state.damage = grade.damage
  state.turn = 1
  state.busy = false
  state.result = ''
  state.history = []
  state.enemyMood = '静観'
  buildDeck()
  setCurrentQuestion()

  battleFlashEl.textContent = grade.label
  playerStatusEl.textContent = '術式を整えている'
  enemyStatusEl.textContent = `${grade.enemyName} が現れた`
  setBattleMessage(`${grade.label}の戦闘開始`, `${grade.enemyName} に勝つには正解を積み重ねる必要があります。`)

  renderQuestion()
  renderHud()
  renderHistory()
}

nextButton.addEventListener('click', nextTurn)
resetButton.addEventListener('click', startBattle)

document.addEventListener('keydown', (event) => {
  if (event.code === 'Enter' || event.code === 'Space') {
    event.preventDefault()
    nextTurn()
  }
})

startBattle()
