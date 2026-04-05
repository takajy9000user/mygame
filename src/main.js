import './style.css'

const quizBank = [
  {
    era: '弥生時代',
    question: '米づくりが日本で広まった時代はどれ？',
    choices: ['縄文時代', '弥生時代', '古墳時代', '江戸時代'],
    answerIndex: 1,
    explanation: '米づくりが広まったのは弥生時代です。',
  },
  {
    era: '奈良時代',
    question: '大仏で有名な東大寺があるのはどこ？',
    choices: ['奈良県', '京都府', '大阪府', '兵庫県'],
    answerIndex: 0,
    explanation: '東大寺は奈良県にあります。',
  },
  {
    era: '平安時代',
    question: '「源氏物語」を書いた人はだれ？',
    choices: ['紫式部', '清少納言', '聖徳太子', '徳川家康'],
    answerIndex: 0,
    explanation: '源氏物語を書いたのは紫式部です。',
  },
  {
    era: '鎌倉時代',
    question: '鎌倉幕府を開いた人はだれ？',
    choices: ['豊臣秀吉', '織田信長', '源頼朝', '足利尊氏'],
    answerIndex: 2,
    explanation: '鎌倉幕府を開いたのは源頼朝です。',
  },
  {
    era: '室町時代',
    question: '金閣を建てた将軍はだれ？',
    choices: ['足利義満', '足利義政', '徳川家光', '平清盛'],
    answerIndex: 0,
    explanation: '金閣を建てたのは足利義満です。',
  },
  {
    era: '安土桃山時代',
    question: '全国統一を進めた武将でないのはだれ？',
    choices: ['織田信長', '豊臣秀吉', '徳川家康', '菅原道真'],
    answerIndex: 3,
    explanation: '菅原道真は学問の神様として有名な人物です。',
  },
  {
    era: '戦国時代',
    question: '「鳴かぬなら 殺してしまえ ほととぎす」とたとえられる武将はだれ？',
    choices: ['徳川家康', '豊臣秀吉', '織田信長', '武田信玄'],
    answerIndex: 2,
    explanation: 'このたとえで表されるのは織田信長です。',
  },
  {
    era: '戦国時代',
    question: '長篠の戦いで鉄砲を多く使ったことで有名な武将はだれ？',
    choices: ['織田信長', '上杉謙信', '毛利元就', '伊達政宗'],
    answerIndex: 0,
    explanation: '長篠の戦いでは織田信長の鉄砲戦術が有名です。',
  },
  {
    era: '戦国時代',
    question: '「天下統一」を目前にして本能寺の変で倒れた人物はだれ？',
    choices: ['徳川家康', '織田信長', '豊臣秀頼', '足利義満'],
    answerIndex: 1,
    explanation: '本能寺の変で倒れたのは織田信長です。',
  },
  {
    era: '戦国時代',
    question: '豊臣秀吉が行った、刀や武器を取り上げる政策は何？',
    choices: ['参勤交代', '刀狩', '楽市楽座', '大化の改新'],
    answerIndex: 1,
    explanation: '農民などから武器を取り上げる政策は刀狩です。',
  },
  {
    era: '戦国時代',
    question: '関ヶ原の戦いのあと、のちに江戸幕府を開いた人物はだれ？',
    choices: ['豊臣秀吉', '徳川家康', '明智光秀', '北条時宗'],
    answerIndex: 1,
    explanation: '関ヶ原の戦いに勝ち、江戸幕府を開いたのは徳川家康です。',
  },
  {
    era: '江戸時代',
    question: '江戸幕府を開いた人はだれ？',
    choices: ['徳川家康', '徳川吉宗', '西郷隆盛', '坂本龍馬'],
    answerIndex: 0,
    explanation: '江戸幕府を開いたのは徳川家康です。',
  },
  {
    era: '江戸時代',
    question: '大名が交代で江戸と領地を行き来した制度は何？',
    choices: ['刀狩', '検地', '参勤交代', '廃藩置県'],
    answerIndex: 2,
    explanation: '大名が交代で江戸に来る制度は参勤交代です。',
  },
  {
    era: '江戸時代',
    question: '江戸時代の身分の中で、いちばん人数が多かったのはどれ？',
    choices: ['武士', '農民', '町人', '大名'],
    answerIndex: 1,
    explanation: '江戸時代はいちばん多かったのが農民です。',
  },
  {
    era: '江戸時代',
    question: '新しい政治を進めた「享保の改革」を行った将軍はだれ？',
    choices: ['徳川吉宗', '徳川家光', '徳川慶喜', '徳川家茂'],
    answerIndex: 0,
    explanation: '享保の改革を行ったのは徳川吉宗です。',
  },
  {
    era: '江戸時代',
    question: '浮世絵で有名な「富嶽三十六景」をえがいた人はだれ？',
    choices: ['葛飾北斎', '紫式部', '福沢諭吉', '聖徳太子'],
    answerIndex: 0,
    explanation: '富嶽三十六景をえがいたのは葛飾北斎です。',
  },
  {
    era: '江戸時代',
    question: '江戸時代の終わりごろ、日本に開国を求めてきたアメリカの人物はだれ？',
    choices: ['ペリー', 'ナポレオン', 'コロンブス', 'リンカーン'],
    answerIndex: 0,
    explanation: '黒船で来航したのはペリーです。',
  },
  {
    era: '江戸時代',
    question: '江戸時代に長く続いた、外国との交流を制限する政策は何？',
    choices: ['鎖国', '徴兵令', '楽市楽座', '太閤検地'],
    answerIndex: 0,
    explanation: '外国との交流を制限した政策は鎖国です。',
  },
  {
    era: '明治時代',
    question: '日本で鉄道が初めて開通した区間はどこ？',
    choices: ['東京-上野', '新橋-横浜', '大阪-神戸', '京都-奈良'],
    answerIndex: 1,
    explanation: '日本で最初の鉄道は新橋-横浜間です。',
  },
]

const state = {
  round: 1,
  maxRounds: 5,
  score: 0,
  streak: 0,
  currentQuestion: null,
  deck: [],
  history: [],
  collectedEras: [],
}

const app = document.querySelector('#app')

app.innerHTML = `
  <main class="game-shell">
    <section class="hero-panel">
      <div>
        <p class="eyebrow">History Quiz Adventure</p>
        <h1>歴史クイズゲーム</h1>
        <p class="intro">
          日本の歴史を4択クイズで楽しく学ぶゲームです。<strong>時代の流れや有名な人物を、遊びながら少しずつ覚えられます。</strong>
        </p>
      </div>
      <div class="score-card">
        <div>
          <span>スコア</span>
          <strong id="score">0</strong>
        </div>
        <div>
          <span>れんぞく正解</span>
          <strong id="streak">0</strong>
        </div>
        <div>
          <span>ラウンド</span>
          <strong id="round">1 / 5</strong>
        </div>
      </div>
    </section>

    <section class="main-grid">
      <section class="panel quiz-panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">History Scene</p>
            <h2 id="era-title">時代をめぐるクイズ</h2>
          </div>
          <button id="reset-button" class="action-button secondary" type="button">もう一度遊ぶ</button>
        </div>

        <div class="era-card">
          <p id="era-label" class="era-label">弥生時代</p>
          <p id="question-text" class="question-text"></p>
        </div>

        <div id="answer-grid" class="quiz-answers"></div>
        <p id="feedback" class="quiz-feedback">答えを選ぶと解説が見られます。</p>
        <button id="next-button" class="action-button primary" type="button">次の問題へ</button>
      </section>

      <section class="panel info-panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Learning Note</p>
            <h2>学びメモ</h2>
          </div>
        </div>
        <div class="info-stack">
          <article class="insight-card">
            <p class="eyebrow">Hint</p>
            <h3>覚え方</h3>
            <p id="hint-text">時代名と有名な人物・できごとをセットで覚えると、流れがつながります。</p>
          </article>
          <article class="insight-card">
            <p class="eyebrow">Collection</p>
            <h3>時代コレクション</h3>
            <div id="collection-list" class="collection-list"></div>
          </article>
          <article class="insight-card">
            <p class="eyebrow">Last Learn</p>
            <h3>今回の学び</h3>
            <p id="learn-text">最初の問題から気楽に始めましょう。</p>
          </article>
          <article class="insight-card">
            <p class="eyebrow">Quiz Log</p>
            <h3>学習ログ</h3>
            <ol id="history-list" class="history-list"></ol>
          </article>
        </div>
      </section>
    </section>
  </main>
`

const scoreEl = document.querySelector('#score')
const streakEl = document.querySelector('#streak')
const roundEl = document.querySelector('#round')
const eraTitleEl = document.querySelector('#era-title')
const eraLabelEl = document.querySelector('#era-label')
const questionTextEl = document.querySelector('#question-text')
const answerGridEl = document.querySelector('#answer-grid')
const feedbackEl = document.querySelector('#feedback')
const hintTextEl = document.querySelector('#hint-text')
const collectionListEl = document.querySelector('#collection-list')
const learnTextEl = document.querySelector('#learn-text')
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

function addHistory(text) {
  state.history = [text, ...state.history].slice(0, 6)
}

function renderHistory() {
  historyListEl.innerHTML = state.history.length
    ? state.history.map((entry) => `<li>${entry}</li>`).join('')
    : '<li>まだ記録はありません。</li>'
}

function renderCollection() {
  const eras = [...new Set(quizBank.map((quiz) => quiz.era))]
  collectionListEl.innerHTML = eras
    .map((era) => {
      const collected = state.collectedEras.includes(era) ? ' collected' : ''
      return `<span class="collection-chip${collected}">${era}</span>`
    })
    .join('')
}

function nextQuestion() {
  state.currentQuestion = state.deck.shift() ?? null
  if (!state.currentQuestion) return

  eraTitleEl.textContent = `${state.currentQuestion.era}クイズ`
  eraLabelEl.textContent = state.currentQuestion.era
  questionTextEl.textContent = state.currentQuestion.question

  answerGridEl.innerHTML = state.currentQuestion.choices
    .map((choice, index) => `<button class="quiz-answer" data-index="${index}" type="button">${choice}</button>`)
    .join('')

  ;[...answerGridEl.querySelectorAll('.quiz-answer')].forEach((button) => {
    button.addEventListener('click', () => answerQuestion(Number(button.dataset.index)))
  })
}

function renderHud() {
  scoreEl.textContent = String(state.score)
  streakEl.textContent = String(state.streak)
  roundEl.textContent = `${Math.min(state.round, state.maxRounds)} / ${state.maxRounds}`
  renderCollection()
  renderHistory()
}

function answerQuestion(index) {
  if (!state.currentQuestion) return

  const correct = index === state.currentQuestion.answerIndex

  if (correct) {
    state.score += 20 + state.streak * 5
    state.streak += 1
    if (!state.collectedEras.includes(state.currentQuestion.era)) {
      state.collectedEras.push(state.currentQuestion.era)
    }
    feedbackEl.textContent = `正解。${state.currentQuestion.explanation} ${state.currentQuestion.era}カードを集めました。`
    learnTextEl.textContent = `${state.currentQuestion.era}: ${state.currentQuestion.explanation}`
    addHistory(`${state.currentQuestion.era}の問題に正解して時代カードを獲得`)
  } else {
    state.streak = 0
    const answer = state.currentQuestion.choices[state.currentQuestion.answerIndex]
    feedbackEl.textContent = `不正解。正解は「${answer}」。${state.currentQuestion.explanation}`
    learnTextEl.textContent = `${state.currentQuestion.era}: 正解は ${answer}。${state.currentQuestion.explanation}`
    addHistory(`${state.currentQuestion.era}の問題はおしい。正解を確認`)
  }

  hintTextEl.textContent = `「${state.currentQuestion.era} と ${state.currentQuestion.choices[state.currentQuestion.answerIndex]}」のようにセットで覚えると定着しやすいです。`
  answerGridEl.innerHTML = ''
  renderHud()
}

function advanceRound() {
  if (state.round >= state.maxRounds) {
    feedbackEl.textContent = `クイズ終了。合計 ${state.score} 点でした。もう一度遊ぶで新しい順番に挑戦できます。`
    answerGridEl.innerHTML = ''
    questionTextEl.textContent = '最後までよくがんばりました。'
    eraTitleEl.textContent = '歴史クイズ終了'
    eraLabelEl.textContent = 'おつかれさま'
    return
  }

  state.round += 1
  nextQuestion()
  feedbackEl.textContent = '答えを選ぶと解説が見られます。'
  renderHud()
}

function resetGame() {
  state.round = 1
  state.score = 0
  state.streak = 0
  state.deck = shuffleArray(quizBank).slice(0, state.maxRounds)
  state.history = []
  state.collectedEras = []
  hintTextEl.textContent = '時代名と有名な人物・できごとをセットで覚えると、流れがつながります。'
  learnTextEl.textContent = '最初の問題から気楽に始めましょう。'
  feedbackEl.textContent = '答えを選ぶと解説が見られます。正解すると時代カードが集まります。'
  nextQuestion()
  renderHud()
}

nextButton.addEventListener('click', advanceRound)
resetButton.addEventListener('click', resetGame)

resetGame()
