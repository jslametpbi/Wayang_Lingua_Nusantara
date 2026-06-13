/* ============================================================
   Wayang Lingua Nusantara — data.js
   Curriculum (16 lakon meetings), AI Wayang mentors, badges,
   CEFR path, and demo seed data for classes & students.
   ============================================================ */

const WLN = window.WLN = {};

/* ---------- CEFR learning path (XP thresholds) ---------- */
WLN.PATH = [
  { level:'A1', name:'Beginner',     xp:0    },
  { level:'A2', name:'Explorer',     xp:600  },
  { level:'B1', name:'Intermediate', xp:1500 },
  { level:'B2', name:'Confident',    xp:3000 },
  { level:'C1', name:'Advanced',     xp:5200 },
  { level:'C2', name:'Mastery',      xp:8000 },
];

/* ---------- AI Wayang Mentors (the 5 Guides) ---------- */
WLN.MENTORS = [
  { id:'semar',  name:'Semar',     role:'Wisdom Mentor',
    focus:'meaning, coherence, message, confidence, academic tone',
    desc:'Gives reflective feedback on coherence, content, and academic tone.',
    style:'warm, reflective, encouraging; speaks in gentle wisdom',
    palette:['#e8c97a','#9a7415'], shape:'round',
    opener:'Your idea is strong! Let\u2019s make your English clearer and smoother.' },
  { id:'gareng', name:'Gareng',    role:'Grammar Guardian',
    focus:'grammar, tense, articles, agreement, sentence clarity',
    desc:'Detects grammar errors and gives clear correction and explanation.',
    style:'precise, corrective, patient; explains the rule briefly',
    palette:['#d98f5a','#7a4a1c'], shape:'sharp',
    opener:'Show me your sentence \u2014 I will guard every verb and article.' },
  { id:'petruk', name:'Petruk',    role:'Pronunciation Coach',
    focus:'pronunciation, word stress, intonation, rhythm',
    desc:'Improves your pronunciation, stress, intonation, and rhythm.',
    style:'practical, phonological, rhythmic; gives sound-by-sound tips',
    palette:['#c9b16a','#6b5320'], shape:'tall',
    opener:'Let\u2019s improve your pronunciation \u2014 speak, and I will listen closely.' },
  { id:'bagong', name:'Bagong',    role:'Vocabulary Booster',
    focus:'word choice, collocations, expressions, academic vocabulary',
    desc:'Introduces useful vocabulary and collocations from stories.',
    style:'playful, lexical, concrete; loves giving word families',
    palette:['#e0a85c','#8a5a18'], shape:'wide',
    opener:'Great word choice! Want three stronger words for that idea?' },
  { id:'dalang', name:'Dalang AI', role:'Performance Mentor',
    focus:'fluency, storytelling, audience engagement, confidence',
    desc:'Evaluates your fluency, confidence, storytelling, and overall performance.',
    style:'dramatic, holistic, performative; thinks like a puppet master',
    palette:['#f3cf63','#9a7415'], shape:'crowned',
    opener:'The stage is yours. Perform, and I will shape your story.' },
];

/* extended mentor cast for the Character Room */
WLN.HEROES = [
  { id:'arjuna',    name:'Arjuna',    role:'Fluency Strategist',    focus:'confidence, pacing, argument flow', palette:['#cfe0e8','#3d5a6b'], shape:'tall' },
  { id:'srikandi',  name:'Srikandi',  role:'Presentation Coach',    focus:'public speaking, clarity, courage', palette:['#e8a8b8','#8a3d55'], shape:'sharp' },
  { id:'bima',      name:'Bima',      role:'Critical Thinking Coach', focus:'evidence, logic, moral reasoning', palette:['#a8c8a0','#3d6b45'], shape:'wide' },
  { id:'gatotkaca', name:'Gatotkaca', role:'Intelligibility Coach', focus:'clarity, volume, emphasis, stamina', palette:['#a8b8e8','#3d4a8a'], shape:'crowned' },
  { id:'kresna',    name:'Kresna',    role:'Intercultural Advisor', focus:'culture, diplomacy, global audience', palette:['#8ad0c8','#1d6b60'], shape:'round' },
];

/* ---------- 16-meeting curriculum (Story Library) ---------- */
const M = (id, title, level, value, mentor, vocab, scene) => ({
  id, title, level, value, mentor, vocab,
  scene,
  outcomes: [
    `Retell the main idea of "${title}" in clear English`,
    `Use ${level}-level vocabulary from the story accurately`,
    'Perform one oral task with intelligible pronunciation and stress',
    'Write a short evidence-based moral reflection',
  ],
  listening: {
    script: `${scene} The dalang slows the gamelan and asks the audience to listen: which choice shows ${value.toLowerCase()}? Listen for the conflict, the turning point, and two expressions the characters use to persuade each other.`,
    task: 'Listen, then identify: the conflict, the turning point, the moral value, and two useful expressions.',
    questions: [
      { q:'What does the dalang ask the audience to identify first?', opts:['The names of the gamelan players','The choice that shows the moral value','The colour of the screen','The price of the ticket'], a:1 },
      { q:'Which TWO things should you listen for in the dialogue?', opts:['Expressions used to persuade','The weather report','Sound effects only','Audience applause'], a:0 },
      { q:`The central value of this lakon is best described as…`, opts:['Speed','Wealth',value,'Silence'], a:2 },
    ],
  },
  speaking: {
    prompt: `Take the role of the dalang. In 60–90 seconds, narrate the moment of "${title}": set the scene, voice the conflict, and end with the lesson about ${value.toLowerCase()}. Use clear word stress and engage your audience.`,
    keywords: vocab.slice(0, 6),
    criteria: ['Pronunciation','Fluency','Vocabulary','Storytelling','Confidence'],
  },
  reading: {
    text: `${scene} In the version told across Java, the hero does not win by force alone. The turning point comes when language itself becomes the weapon: a promise kept, a truth spoken at the right moment, a request phrased with respect. Readers of this lakon learn that ${value.toLowerCase()} is performed through words — in how characters negotiate, apologise, persuade, and stand firm. For the EFL learner, the passage models how meaning, identity, and responsibility travel through carefully chosen English.`,
    questions: [
      { q:'According to the passage, how does the hero finally succeed?', opts:['By force alone','Through language used at the right moment','By avoiding the conflict','By paying a fee'], a:1 },
      { q:'What does the passage say the lakon models for EFL learners?', opts:['How meaning travels through carefully chosen words','How to memorise grammar tables','How to play gamelan','How to build a puppet'], a:0 },
      { q:'The value highlighted in this reading is…', opts:['Luck','Anger',value,'Secrecy'], a:2 },
    ],
  },
  writing: {
    prompt: `Write a 120–200 word reflection: How does "${title}" help an EFL learner communicate ${value.toLowerCase()} with cultural identity and global confidence? Support your idea with one moment from the story.`,
    rubric: ['Clear thesis','Organization & coherence','Vocabulary range','Grammar accuracy','Cultural reflection'],
  },
});

WLN.MEETINGS = [
  M(1,'The Wisdom of Semar','A1','Humility','semar',
    ['wisdom','humble','servant','advice','listen','respect','gentle','guide'],
    'Semar, the wise servant, hides great power behind a humble smile. When the princes argue, he speaks last — and his quiet words end the quarrel.'),
  M(2,'Gareng and the Clear Sentence','A1','Honesty','gareng',
    ['honest','truth','mistake','correct','clear','promise','simple','direct'],
    'Gareng, with his crooked arm, cannot fight — so he learns to speak with perfect clarity. One honest sentence from Gareng untangles a market dispute.'),
  M(3,'Petruk Speaks with Rhythm','A2','Perseverance','petruk',
    ['rhythm','practice','repeat','patient','stress','voice','improve','effort'],
    'Tall Petruk once mumbled so badly that no one listened. He practises with the gamelan every dawn until his words land like drumbeats.'),
  M(4,'Bagong Builds a Word Treasury','A2','Curiosity','bagong',
    ['curious','collect','meaning','treasury','phrase','borrow','discover','playful'],
    'Round Bagong collects words the way merchants collect coins. At the night market he trades jokes for new expressions from every island.'),
  M(5,'The Courage of Gatotkaca','B1','Courage','dalang',
    ['courage','sacrifice','loyalty','protect','kingdom','hero','moral','brave','duty','honor'],
    'Gatotkaca, the flying knight with bones of iron, rises to defend the kingdom knowing the cost. He shows great courage to protect others even when he must sacrifice himself.'),
  M(6,'Arjuna\u2019s Quest for Focus','B1','Discipline','semar',
    ['focus','meditate','target','discipline','distraction','steady','master','aim'],
    'Before the great contest, Arjuna sees only the eye of the bird — not the tree, not the sky. His teacher asks each prince what they see; only Arjuna answers with one word.'),
  M(7,'Srikandi Takes the Stage','B1','Confidence','petruk',
    ['confidence','stage','audience','posture','project','equal','challenge','voice'],
    'Srikandi, the archer princess, claims her place among warriors who doubt her. She speaks first in the council — clearly, calmly, and without apology.'),
  M(8,'Bima and the Honest Giant','B2','Integrity','gareng',
    ['integrity','oath','blunt','genuine','principle','refuse','loyal','firm'],
    'Bima speaks to kings and beggars in exactly the same blunt voice. When offered a shortcut built on a lie, he refuses — and walks the long road instead.'),
  M(9,'Kresna the Diplomat','B2','Diplomacy','bagong',
    ['diplomacy','negotiate','mediate','compromise','tactful','alliance','phrase','persuade'],
    'Before the great war, Kresna travels as a messenger of peace. He reframes every insult as a question and every demand as an invitation.'),
  M(10,'The Dalang\u2019s Apprentice','B2','Craftsmanship','dalang',
    ['craft','apprentice','rehearse','timing','gesture','narrate','tone','perform'],
    'A young apprentice learns that the dalang\u2019s power is not in the puppets but in the pauses. One night, the master hands over the screen mid-story.'),
  M(11,'Shadow Theatre Debate','C1','Critical Thinking','gareng',
    ['argument','evidence','counter','rebut','premise','fallacy','concede','position'],
    'Two narrators tell the same battle from opposite sides of the screen. The audience must decide: which account holds the stronger evidence?'),
  M(12,'Ethical Leadership in the Pandawa Court','C1','Responsibility','semar',
    ['leadership','accountable','burden','counsel','justice','sacrifice','govern','serve'],
    'King Yudhistira must judge his own brother. The court watches how a leader weighs love against law — and owns the consequence aloud.'),
  M(13,'Wayang for the World: Cultural Tourism English','B2','Hospitality','bagong',
    ['heritage','UNESCO','guide','visitor','authentic','craft','exhibit','welcome'],
    'A village dalang hosts visitors from five countries. He must introduce the kelir, the gamelan, and a 700-year tradition in clear, welcoming English.'),
  M(14,'Academic Reflection through Wayang','C1','Scholarship','gareng',
    ['analyse','interpret','cite','perspective','framework','implication','scholarly','synthesise'],
    'A student writes a seminar paper on wayang as soft power. She must turn admiration into argument: claims, sources, and a defensible thesis.'),
  M(15,'The Global Presentation Portfolio','C2','Excellence','dalang',
    ['portfolio','articulate','nuance','register','impact','refine','deliver','command'],
    'For the international showcase, each learner curates their finest performances. Every slide, every sentence, every pause is chosen with intent.'),
  M(16,'The Final Performance: A Lakon of Your Own','C2','Mastery','dalang',
    ['mastery','original','compose','legacy','improvise','resonance','vision','transform'],
    'The screen is lit, the gamelan waits. Tonight the learner is the dalang — composing an original lakon in English that carries Nusantara wisdom to the world.'),
];

/* ---------- badges ---------- */
WLN.BADGES = [
  { id:'clear-speaker',  icon:'\uD83C\uDF99\uFE0F', name:'Clear Speaker',           how:'Score 75+ in a Shadow Speaking session', test:s=>s.speakBest>=75 },
  { id:'expressive',     icon:'\u2728',  name:'Expressive',               how:'Score 85+ in a Shadow Speaking session', test:s=>s.speakBest>=85 },
  { id:'storyteller',    icon:'\uD83D\uDCD6', name:'Storyteller',              how:'Complete 5 full lakon lessons',          test:s=>s.lessonsDone>=5 },
  { id:'disciplined',    icon:'\uD83D\uDD25', name:'Disciplined Practitioner', how:'Keep a 7-day streak',                    test:s=>s.streak>=7 },
  { id:'word-collector', icon:'\uD83D\uDCDA', name:'Word Collector',           how:'Master 60 vocabulary items',             test:s=>s.vocabCount>=60 },
  { id:'wayang-performer',icon:'\uD83C\uDFAD', name:'Wayang Performer',        how:'Reach level B2 on the learning path',    test:s=>s.xp>=3000 },
  { id:'researcher',     icon:'\uD83D\uDD2C', name:'Researcher',               how:'Complete both pre-test and post-test',   test:s=>s.preTest!=null&&s.postTest!=null },
  { id:'reflective',     icon:'\uD83E\uDEB7', name:'Reflective Writer',        how:'Submit 5 writing reflections',           test:s=>s.writingCount>=5 },
];

/* ---------- demo seed: classes & students (lecturer view) ---------- */
WLN.SEED_CLASSES = [
  { id:'c1', title:'Indonesian for Global Communication', level:'B1', students:32, progress:78 },
  { id:'c2', title:'Academic Speaking & Presentation',    level:'B2', students:28, progress:71 },
  { id:'c3', title:'Nusantara Culture & Society',         level:'A2', students:24, progress:64 },
  { id:'c4', title:'Writing for Academic Purposes',       level:'B1', students:20, progress:83 },
];

WLN.SEED_STUDENTS = [
  { id:'s1', name:'Siti Nurhaliza', email:'siti.nur@student.ac.id',  cefr:'B1', classId:'c1',
    skills:{Listening:78,Speaking:72,Reading:80,Writing:69,Culture:85},
    pre:{Listening:52,Speaking:48,Reading:58,Writing:45,Overall:51},
    post:{Listening:78,Speaking:72,Reading:80,Writing:69,Overall:75},
    sessionsWk:3.6, studyTime:'4h 28m', activities:95, vocabGained:312 },
  { id:'s2', name:'Ahmad Fadli',    email:'a.fadli@student.ac.id',   cefr:'B1', classId:'c1',
    skills:{Listening:82,Speaking:70,Reading:75,Writing:80,Culture:81},
    pre:{Listening:55,Speaking:50,Reading:54,Writing:52,Overall:53},
    post:{Listening:82,Speaking:70,Reading:75,Writing:80,Overall:77},
    sessionsWk:4.1, studyTime:'5h 02m', activities:91, vocabGained:287 },
  { id:'s3', name:'Dewi Lestari',   email:'d.lestari@student.ac.id', cefr:'B2', classId:'c2',
    skills:{Listening:88,Speaking:90,Reading:72,Writing:78,Culture:88},
    pre:{Listening:60,Speaking:62,Reading:50,Writing:55,Overall:57},
    post:{Listening:88,Speaking:90,Reading:72,Writing:78,Overall:82},
    sessionsWk:4.4, studyTime:'5h 40m', activities:97, vocabGained:355 },
  { id:'s4', name:'Rizky Pratama',  email:'r.pratama@student.ac.id', cefr:'A2', classId:'c3',
    skills:{Listening:90,Speaking:92,Reading:88,Writing:62,Culture:90},
    pre:{Listening:64,Speaking:66,Reading:60,Writing:40,Overall:58},
    post:{Listening:90,Speaking:92,Reading:88,Writing:62,Overall:83},
    sessionsWk:3.2, studyTime:'3h 50m', activities:88, vocabGained:240 },
  { id:'s5', name:'Andi Pratama',   email:'andi.p@student.ac.id',    cefr:'B1', classId:'c4',
    skills:{Listening:82,Speaking:78,Reading:70,Writing:80,Culture:81},
    pre:{Listening:54,Speaking:49,Reading:47,Writing:53,Overall:51},
    post:{Listening:82,Speaking:78,Reading:70,Writing:80,Overall:78},
    sessionsWk:3.9, studyTime:'4h 45m', activities:90, vocabGained:301 },
  { id:'s6', name:'Budi Santoso',   email:'b.santoso@student.ac.id', cefr:'A2', classId:'c3',
    skills:{Listening:75,Speaking:70,Reading:72,Writing:68,Culture:71},
    pre:{Listening:48,Speaking:44,Reading:46,Writing:42,Overall:45},
    post:{Listening:75,Speaking:70,Reading:72,Writing:68,Overall:71},
    sessionsWk:2.8, studyTime:'3h 10m', activities:79, vocabGained:198 },
];

WLN.SEED_SUBMISSIONS = [
  { id:'sub1', student:'s1', type:'Speaking', title:'Academic Presentation',  cls:'B2', status:'pending', when:'10m ago' },
  { id:'sub2', student:'s2', type:'Quiz',     title:'Listening Quiz — Lakon 5', cls:'B1', status:'done',  when:'35m ago', score:84 },
  { id:'sub3', student:'s3', type:'Writing',  title:'Argumentative Essay',    cls:'B1', status:'pending', when:'1h ago' },
  { id:'sub4', student:'s4', type:'Badge',    title:'Earned "Researcher" badge', cls:'A2', status:'info', when:'2h ago' },
  { id:'sub5', student:'s5', type:'Writing',  title:'Cultural Reflection 13', cls:'B1', status:'pending', when:'3h ago' },
];

WLN.CEFR_DIST = [ ['A1',8,10], ['A2',20,25], ['B1',42,52], ['B2',22,27], ['C1',6,8], ['C2',2,2] ];

WLN.DAILY_FOCUS = [
  'Speak about your day using past tense.',
  'Describe one wayang character to a friend in 5 sentences.',
  'Use three new words from your last story in one paragraph.',
  'Record yourself reading a lakon scene with clear word stress.',
  'Explain a Nusantara value to an international visitor.',
  'Retell yesterday\u2019s lesson in 60 seconds without stopping.',
  'Write two sentences using a collocation you learned this week.',
];

WLN.QUOTES = [
  ['Bahasa adalah jembatan budaya.', 'Language is the bridge of culture.'],
  ['In the shadow of story, we find the light of language.', ''],
  ['Sedikit demi sedikit, lama-lama menjadi bukit.', 'Little by little becomes a hill.'],
];
