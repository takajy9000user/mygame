const historyFacts = [
  { subject: '縄文土器', era: '縄文時代', location: '各地のむら', category: 'artifact' },
  { subject: '弥生土器', era: '弥生時代', location: '米づくりのむら', category: 'artifact' },
  { subject: '打製石器', era: '旧石器時代', location: '狩りのくらし', category: 'artifact' },
  { subject: '竪穴住居', era: '縄文時代', location: 'むら', category: 'architecture' },
  { subject: '高床倉庫', era: '弥生時代', location: '米の保管', category: 'architecture' },
  { subject: '埴輪', era: '古墳時代', location: '古墳', category: 'artifact' },
  { subject: '大仙古墳', era: '古墳時代', location: '大阪府', category: 'place' },
  { subject: '聖徳太子', era: '飛鳥時代', location: '奈良県', category: 'person' },
  { subject: '中大兄皇子', era: '飛鳥時代', location: '奈良県', category: 'person' },
  { subject: '大化の改新', era: '飛鳥時代', location: '朝廷', category: 'event' },
  { subject: '平城京', era: '奈良時代', location: '奈良県', category: 'place' },
  { subject: '東大寺', era: '奈良時代', location: '奈良県', category: 'place' },
  { subject: '聖武天皇', era: '奈良時代', location: '奈良県', category: 'person' },
  { subject: '遣唐使', era: '奈良時代', location: '中国', category: 'event' },
  { subject: '平安京', era: '平安時代', location: '京都府', category: 'place' },
  { subject: '紫式部', era: '平安時代', location: '京都', category: 'person' },
  { subject: '清少納言', era: '平安時代', location: '京都', category: 'person' },
  { subject: '源氏物語', era: '平安時代', location: '宮中', category: 'book' },
  { subject: '枕草子', era: '平安時代', location: '宮中', category: 'book' },
  { subject: '藤原道長', era: '平安時代', location: '京都', category: 'person' },
  { subject: '平清盛', era: '平安時代', location: '瀬戸内海', category: 'person' },
  { subject: '源頼朝', era: '鎌倉時代', location: '神奈川県', category: 'person' },
  { subject: '鎌倉幕府', era: '鎌倉時代', location: '鎌倉', category: 'government' },
  { subject: '御恩と奉公', era: '鎌倉時代', location: '武士の社会', category: 'system' },
  { subject: '北条時宗', era: '鎌倉時代', location: '鎌倉', category: 'person' },
  { subject: '元寇', era: '鎌倉時代', location: '九州', category: 'event' },
  { subject: '足利尊氏', era: '室町時代', location: '京都', category: 'person' },
  { subject: '室町幕府', era: '室町時代', location: '京都', category: 'government' },
  { subject: '足利義満', era: '室町時代', location: '京都', category: 'person' },
  { subject: '金閣', era: '室町時代', location: '京都府', category: 'place' },
  { subject: '足利義政', era: '室町時代', location: '京都', category: 'person' },
  { subject: '銀閣', era: '室町時代', location: '京都府', category: 'place' },
  { subject: '応仁の乱', era: '室町時代', location: '京都', category: 'event' },
  { subject: '織田信長', era: '安土桃山時代', location: '安土城', category: 'person' },
  { subject: '豊臣秀吉', era: '安土桃山時代', location: '大阪城', category: 'person' },
  { subject: '徳川家康', era: '江戸時代', location: '江戸', category: 'person' },
  { subject: '本能寺の変', era: '安土桃山時代', location: '京都', category: 'event' },
  { subject: '刀狩', era: '安土桃山時代', location: '全国', category: 'system' },
  { subject: '太閤検地', era: '安土桃山時代', location: '全国', category: 'system' },
  { subject: '関ヶ原の戦い', era: '安土桃山時代', location: '岐阜県', category: 'event' },
  { subject: '江戸幕府', era: '江戸時代', location: '江戸', category: 'government' },
  { subject: '参勤交代', era: '江戸時代', location: '江戸と領地', category: 'system' },
  { subject: '鎖国', era: '江戸時代', location: '長崎', category: 'system' },
  { subject: '徳川吉宗', era: '江戸時代', location: '江戸', category: 'person' },
  { subject: '享保の改革', era: '江戸時代', location: '江戸幕府', category: 'event' },
  { subject: '葛飾北斎', era: '江戸時代', location: '江戸', category: 'person' },
  { subject: 'ペリー', era: '江戸時代', location: '浦賀', category: 'person' },
  { subject: '明治天皇', era: '明治時代', location: '東京', category: 'person' },
  { subject: '廃藩置県', era: '明治時代', location: '全国', category: 'event' },
  { subject: '文明開化', era: '明治時代', location: '日本各地', category: 'event' },
]

const eraChoices = [...new Set(historyFacts.map((fact) => fact.era))]
const locationChoices = [...new Set(historyFacts.map((fact) => fact.location))]
const subjectChoices = historyFacts.map((fact) => fact.subject)

function buildChoices(correct, pool) {
  const unique = pool.filter((item) => item !== correct)
  const picks = []

  for (let index = 0; index < unique.length && picks.length < 3; index += 1) {
    picks.push(unique[index])
  }

  const options = [correct, ...picks]

  for (let index = options.length - 1; index > 0; index -= 1) {
    const swapIndex = (index * 7 + correct.length) % (index + 1)
    ;[options[index], options[swapIndex]] = [options[swapIndex], options[index]]
  }

  return options
}

function createQuestionSet(fact, index) {
  const q1Choices = buildChoices(fact.era, eraChoices)
  const q2Choices = buildChoices(fact.location, locationChoices)
  const q3Choices = buildChoices(fact.subject, subjectChoices)
  const q4Choices = buildChoices(fact.subject, subjectChoices.slice().reverse())

  return [
    {
      id: `${index}-era`,
      question: `「${fact.subject}」が活やくした時代として正しいものはどれ？`,
      choices: q1Choices,
      answerIndex: q1Choices.indexOf(fact.era),
      explanation: `${fact.subject}は${fact.era}に関係の深いできごと・人物です。`,
    },
    {
      id: `${index}-place`,
      question: `「${fact.subject}」に特に関係の深い場所や地域はどれ？`,
      choices: q2Choices,
      answerIndex: q2Choices.indexOf(fact.location),
      explanation: `${fact.subject}は${fact.location}と結びつけて覚えるとわかりやすいです。`,
    },
    {
      id: `${index}-subject`,
      question: `${fact.era}に関係の深いものを1つ選ぶならどれ？`,
      choices: q3Choices,
      answerIndex: q3Choices.indexOf(fact.subject),
      explanation: `${fact.subject}は${fact.era}を代表するキーワードの1つです。`,
    },
    {
      id: `${index}-description`,
      question: `次のうち「${fact.location}」に関係が深い歴史の言葉はどれ？`,
      choices: q4Choices,
      answerIndex: q4Choices.indexOf(fact.subject),
      explanation: `${fact.subject}は${fact.location}とあわせて覚えておくと整理しやすいです。`,
    },
  ]
}

export const quizBank = historyFacts.flatMap((fact, index) => createQuestionSet(fact, index))
