'use strict';

const APP = {
  name: 'Wayang Lingua Nusantara',
  tagline: 'AI-Powered Wayang Storytelling for EFL Skills',
  copyright: 'Copyright © Dr. Joko Slamet',
  adminPin: 'JS2026',
  version: '2.0 GitHub Ready'
};

const STORAGE = {
  users: 'wln_users_v2',
  session: 'wln_session_v2',
  progress: 'wln_progress_v2',
  rooms: 'wln_rooms_v2',
  submissions: 'wln_submissions_v2',
  announcements: 'wln_announcements_v2'
};

const CHARACTERS = [
  {id:'semar', name:'Semar', role:'Wisdom Mentor', emoji:'🧙', values:'wisdom, humility, reflection', desc:'Guides learners to speak with meaning, confidence, and moral awareness.'},
  {id:'gareng', name:'Gareng', role:'Grammar Guardian', emoji:'🪶', values:'clarity, accuracy, structure', desc:'Helps learners notice tense, sentence flow, and grammar accuracy.'},
  {id:'petruk', name:'Petruk', role:'Pronunciation Coach', emoji:'🎙️', values:'voice, expression, rhythm', desc:'Supports stress, intonation, rhythm, and intelligible English.'},
  {id:'bagong', name:'Bagong', role:'Vocabulary Booster', emoji:'💡', values:'word choice, collocation, meaning', desc:'Introduces vocabulary from Wayang stories for global communication.'},
  {id:'arjuna', name:'Arjuna', role:'Noble Speaker', emoji:'🏹', values:'discipline, courage, diplomacy', desc:'Models calm, respectful, and persuasive English communication.'},
  {id:'srikandi', name:'Srikandi', role:'Brave Communicator', emoji:'🛡️', values:'voice, equality, bravery', desc:'Inspires confident speaking, argumentation, and leadership.'},
  {id:'gatotkaca', name:'Gatotkaca', role:'Heroic Performer', emoji:'⚡', values:'courage, loyalty, sacrifice', desc:'Encourages performance, storytelling, and purposeful fluency.'},
  {id:'dalang', name:'Dalang AI', role:'Performance Mentor', emoji:'🎭', values:'storytelling, fluency, audience awareness', desc:'Evaluates the whole English performance and learning portfolio.'}
];

const MENTORS = [
  {name:'Semar', title:'Reflection Mentor', target:'content, coherence, confidence, and academic tone', icon:'🧙'},
  {name:'Gareng', title:'Grammar Mentor', target:'sentence structure, tense, articles, and agreement', icon:'🪶'},
  {name:'Petruk', title:'Pronunciation Mentor', target:'stress, rhythm, intonation, and intelligibility', icon:'🎙️'},
  {name:'Bagong', title:'Vocabulary Mentor', target:'word choice, collocation, and cultural vocabulary', icon:'💡'},
  {name:'Dalang AI', title:'Performance Mentor', target:'fluency, storytelling, audience awareness, and portfolio growth', icon:'🎭'}
];

const MODULES = [
  {
    id:'w01-semar-wisdom', week:1, level:'A1', title:'Semar’s Wisdom', character:'Semar', theme:'Introducing self and values', duration:'35 min', skills:['Listening','Speaking','Vocabulary'],
    objectives:['Introduce yourself politely','Recognize simple Wayang character descriptions','Use be-verbs and simple adjectives'],
    vocab:['wise','kind','humble','guide','story','village','friend','teacher'],
    story:'Semar welcomes young learners to the kelir and teaches them that every English word can carry respect.',
    listenText:'Welcome to the shadow theatre. My name is Semar. I am a guide. I help people speak with kindness and wisdom. Today, you will introduce yourself in English.',
    reading:'Semar is a wise guide in Wayang stories. He is humble, kind, and honest. He helps heroes understand life. In English learning, Semar reminds students to speak clearly and respectfully.',
    quiz:[['Who is Semar?','A wise guide','A mountain','A book','A city'],['What value does Semar teach?','Kindness','Anger','Noise','Fear']],
    speaking:'Introduce yourself as a young learner in the Wayang theatre. Say your name, your class, and one good value you want to practice.',
    writing:'Write five sentences about yourself and one value you learn from Semar.',
    moral:'Humility makes communication meaningful.'
  },
  {
    id:'w02-gareng-grammar', week:2, level:'A1', title:'Gareng and Clear Sentences', character:'Gareng', theme:'Simple present and daily actions', duration:'40 min', skills:['Reading','Writing','Grammar'],
    objectives:['Use simple present verbs','Identify subject and verb','Write clear daily routines'],
    vocab:['practice','listen','read','write','speak','every day','always','usually'],
    story:'Gareng repairs unclear sentences and teaches learners that every sentence needs balance.',
    listenText:'Gareng says: I practice English every day. I listen to stories. I read short texts. I write new words. Clear sentences help people understand me.',
    reading:'Gareng likes clear sentences. He says that English needs a subject and a verb. A clear sentence can help listeners follow the story. Gareng practices every day and checks his grammar carefully.',
    quiz:[['Which sentence is clear?','I practice English every day.','Practice every day English I.','Every practice I English.','English day I.'],['What does Gareng check?','Grammar','Weather','Food','Music']],
    speaking:'Tell Gareng three daily actions you do to improve English.',
    writing:'Write a short daily English routine using at least five simple present verbs.',
    moral:'Accuracy helps your message travel farther.'
  },
  {
    id:'w03-petruk-sounds', week:3, level:'A2', title:'Petruk’s Sound Journey', character:'Petruk', theme:'Pronunciation, stress, and rhythm', duration:'45 min', skills:['Listening','Speaking','Pronunciation'],
    objectives:['Practice word stress','Notice rhythm in short sentences','Record a short response'],
    vocab:['voice','sound','stress','rhythm','clear','repeat','listen','confidence'],
    story:'Petruk makes the audience laugh, but he also teaches that clear sounds make stories alive.',
    listenText:'Petruk walks onto the stage and says, Speak slowly, breathe calmly, and make your important words strong. Your voice can guide the audience.',
    reading:'Petruk is humorous and expressive. In a performance, he uses rhythm, pause, and stress to attract the audience. English speakers also need rhythm and stress to make meaning clear.',
    quiz:[['What does Petruk teach?','Clear pronunciation','Cooking','Painting','Running'],['What can guide the audience?','Your voice','A table','A window','A chair']],
    speaking:'Repeat this line with clear stress: My voice can guide the audience and tell a meaningful story.',
    writing:'Reflect on one pronunciation problem you want to improve and explain your plan.',
    moral:'A clear voice helps the audience feel the story.'
  },
  {
    id:'w04-bagong-vocabulary', week:4, level:'A2', title:'Bagong’s Word Treasure', character:'Bagong', theme:'Vocabulary in context', duration:'40 min', skills:['Vocabulary','Reading','Writing'],
    objectives:['Learn cultural vocabulary','Use new words in sentences','Build a personal glossary'],
    vocab:['heritage','shadow','puppet','wisdom','kingdom','journey','perform','audience'],
    story:'Bagong collects important words from every scene and turns them into useful English expressions.',
    listenText:'Bagong says, Words are treasures. A puppet can tell a story, a shadow can show a feeling, and a journey can teach wisdom.',
    reading:'Bagong believes vocabulary grows when students meet words inside meaningful stories. Words such as heritage, audience, shadow, and journey help students explain Wayang culture in English.',
    quiz:[['What is a synonym of heritage?','Cultural inheritance','Fast food','Empty room','Blue sky'],['Who watches a performance?','Audience','River','Table','Mountain']],
    speaking:'Choose three vocabulary words and explain them to an international visitor.',
    writing:'Create a mini glossary of ten Wayang-related English words with definitions.',
    moral:'Words become powerful when they are used with meaning.'
  },
  {
    id:'w05-arjuna-journey', week:5, level:'B1', title:'Arjuna’s Journey', character:'Arjuna', theme:'Narrative retelling', duration:'50 min', skills:['Listening','Speaking','Reading'],
    objectives:['Retell a story sequence','Use past tense verbs','Express personal opinions'],
    vocab:['choice','courage','discipline','destiny','challenge','peace','kingdom','mission'],
    story:'Arjuna faces a difficult choice and learns that courage also means controlling oneself.',
    listenText:'Arjuna walked through the forest before sunrise. He carried a mission for his kingdom. He was afraid, but he remembered his discipline. He chose peace before anger.',
    reading:'Arjuna is often described as disciplined and thoughtful. In this lesson, his journey teaches learners how to describe events in sequence. A good narrative explains what happened, why it mattered, and what value was learned.',
    quiz:[['What did Arjuna choose before anger?','Peace','Gold','Sleep','Noise'],['Which tense is common in retelling stories?','Past tense','Future continuous only','Imperative only','No verb']],
    speaking:'Retell Arjuna’s journey in one minute using at least four past tense verbs.',
    writing:'Write a paragraph about a difficult choice you made and what you learned.',
    moral:'True courage includes self-control.'
  },
  {
    id:'w06-srikandi-courage', week:6, level:'B1', title:'Srikandi’s Courage', character:'Srikandi', theme:'Opinion and argument', duration:'50 min', skills:['Speaking','Writing','Intercultural'],
    objectives:['State an opinion clearly','Support an argument with reasons','Use respectful disagreement'],
    vocab:['brave','equal','leader','opinion','reason','evidence','respect','voice'],
    story:'Srikandi speaks bravely in the royal hall and shows that a strong voice can defend justice.',
    listenText:'Srikandi stands before the audience. She says, I believe every person deserves respect. A brave voice is not loud; it is clear, fair, and honest.',
    reading:'Srikandi is a symbol of courage and voice. In EFL learning, her character helps students practice opinion, evidence, and respectful communication. Students learn to speak confidently without ignoring other perspectives.',
    quiz:[['A good opinion should be supported by...','Reasons','Silence','Random words','Only emotion'],['Srikandi represents...','Courage and voice','Laziness','Confusion','Weakness']],
    speaking:'Give your opinion: Why is courage important for students today?',
    writing:'Write an opinion paragraph about leadership and respect in modern education.',
    moral:'A brave voice protects justice.'
  },
  {
    id:'w07-gatotkaca-courage', week:7, level:'B1', title:'The Courage of Gatotkaca', character:'Gatotkaca', theme:'Heroism and sacrifice', duration:'55 min', skills:['Listening','Speaking','Writing'],
    objectives:['Identify main ideas in a narrative','Retell a heroic scene','Write a moral argument'],
    vocab:['sacrifice','protect','loyalty','hero','kingdom','danger','brave','honor'],
    story:'Gatotkaca protects the kingdom when danger comes from the sky.',
    listenText:'Gatotkaca saw danger above the kingdom. He did not run away. He flew into the dark sky and protected the people. His courage was not for fame, but for loyalty and honor.',
    reading:'Gatotkaca is remembered for courage and loyalty. In this module, students explore how heroic values can be explained in English. They practice listening, retelling, and writing about sacrifice in modern life.',
    quiz:[['Why did Gatotkaca protect the kingdom?','Because of loyalty and honor','Because he wanted sleep','Because he hated stories','Because he lost a book'],['What skill is practiced through retelling?','Speaking fluency','Cooking','Drawing only','Mathematics only']],
    speaking:'As a dalang, retell Gatotkaca’s heroic action in one minute.',
    writing:'Write a paragraph: What does courage mean in modern student life?',
    moral:'Courage becomes noble when it protects others.'
  },
  {
    id:'w08-bima-strength', week:8, level:'B2', title:'Bima’s Strength and Kindness', character:'Bima', theme:'Compare and contrast', duration:'55 min', skills:['Reading','Writing','Critical Thinking'],
    objectives:['Compare physical and moral strength','Use linking words','Write a comparative paragraph'],
    vocab:['strength','kindness','responsibility','power','protect','compare','however','therefore'],
    story:'Bima learns that strength without kindness can become dangerous.',
    listenText:'Bima was strong, but his teacher reminded him that power must protect the weak. Strength is not only in the body; it also lives in responsibility.',
    reading:'Bima is known for strength, courage, and directness. However, this module asks students to compare physical strength and moral strength. Students learn that English argumentation requires examples, contrast, and explanation.',
    quiz:[['What must power do?','Protect the weak','Ignore others','Create confusion','Stop learning'],['Which word signals contrast?','However','Because','And','Also']],
    speaking:'Compare physical strength and moral strength using two examples.',
    writing:'Write a comparative paragraph: Physical strength versus moral strength.',
    moral:'Power needs responsibility.'
  },
  {
    id:'w09-ramayana-values', week:9, level:'B2', title:'Ramayana Values for Global Dialogue', character:'Dalang AI', theme:'Intercultural explanation', duration:'60 min', skills:['Speaking','Reading','Intercultural'],
    objectives:['Explain cultural values to global audiences','Use examples from a story','Avoid stereotyping'],
    vocab:['intercultural','dialogue','value','tradition','respect','interpretation','perspective','global'],
    story:'The dalang invites learners to explain local cultural values for international communication.',
    listenText:'A dalang does not only tell a story. A dalang connects people, values, and time. When you explain Wayang in English, you help local wisdom meet the world.',
    reading:'Intercultural communication requires more than translation. Students must explain cultural concepts with clarity, respect, and examples. Wayang stories provide meaningful cultural values that can be discussed globally.',
    quiz:[['Intercultural communication needs...','Respect and clarity','Only memorization','Silence','No examples'],['Wayang can help students explain...','Local wisdom globally','Only numbers','Weather reports','Sports only']],
    speaking:'Explain one Wayang value to a foreign student in two minutes.',
    writing:'Write a short intercultural reflection on how Wayang values can support global citizenship.',
    moral:'Culture becomes global when it is explained with respect.'
  },
  {
    id:'w10-debate-kurawa', week:10, level:'B2', title:'Debating the Kurawa Conflict', character:'Srikandi', theme:'Debate and evidence', duration:'60 min', skills:['Speaking','Critical Thinking','Writing'],
    objectives:['State claims and counterclaims','Use evidence phrases','Practice respectful debate'],
    vocab:['claim','counterclaim','evidence','fairness','conflict','justice','therefore','although'],
    story:'Students examine conflict and fairness through a Wayang-inspired debate task.',
    listenText:'In every conflict, a speaker must ask: What is fair? What evidence supports my claim? How can I disagree without losing respect?',
    reading:'Debate in English requires structure. Students need a claim, evidence, explanation, and respectful counterclaim. Wayang conflict scenes help students practice ethical argumentation.',
    quiz:[['A strong debate uses...','Claims and evidence','Only shouting','No structure','Only jokes'],['What is a counterclaim?','An opposing argument','A puppet box','A song','A place']],
    speaking:'Debate this statement: A leader must choose justice over personal loyalty.',
    writing:'Write one claim, one evidence sentence, and one counterclaim about leadership.',
    moral:'Respectful debate protects truth and dignity.'
  },
  {
    id:'w11-dalang-narration', week:11, level:'C1', title:'Dalang Academic Narration', character:'Dalang AI', theme:'Academic storytelling', duration:'65 min', skills:['Speaking','Writing','Academic English'],
    objectives:['Use formal narration','Build coherent paragraphs','Connect culture and theory'],
    vocab:['narrative','symbolism','identity','heritage','representation','pedagogy','discourse','interpret'],
    story:'The Dalang AI teaches learners to transform cultural storytelling into academic English.',
    listenText:'Academic narration does not remove culture. It interprets culture. A strong speaker explains symbols, context, and meaning in language that international audiences can understand.',
    reading:'Academic storytelling can bridge local knowledge and global scholarship. In this module, students analyze Wayang as cultural pedagogy and practice explaining symbolic meaning in formal English.',
    quiz:[['Academic narration should include...','Context and interpretation','Only informal jokes','No meaning','Only translation'],['Wayang can be interpreted as...','Cultural pedagogy','A calculator','A traffic sign','A phone charger']],
    speaking:'Deliver a formal two-minute explanation of Wayang as cultural pedagogy.',
    writing:'Write an academic paragraph explaining how Wayang supports culturally responsive EFL learning.',
    moral:'Scholarship becomes stronger when culture is interpreted carefully.'
  },
  {
    id:'w12-research-passport', week:12, level:'C1', title:'Research Passport Reflection', character:'Semar', theme:'Learning analytics and reflection', duration:'60 min', skills:['Writing','Reflection','Research Literacy'],
    objectives:['Interpret learning progress','Write reflective evidence','Prepare a research-ready portfolio'],
    vocab:['analytics','evidence','portfolio','reflection','progress','achievement','validity','impact'],
    story:'Semar helps learners read their own progress and turn learning evidence into reflection.',
    listenText:'Your progress is a story. Your score is not the whole story, but it is evidence. Reflection helps you understand how your English grows over time.',
    reading:'Learning analytics can support reflection when students understand the meaning of their progress. A research passport documents achievement, engagement, feedback, and intercultural development.',
    quiz:[['A research passport documents...','Learning evidence','Only a password','A weather report','A random picture'],['Reflection helps students...','Understand progress','Stop learning','Hide mistakes','Avoid feedback']],
    speaking:'Explain your learning progress this semester using evidence from your dashboard.',
    writing:'Write a reflective learning report using at least three pieces of evidence.',
    moral:'Evidence becomes meaningful through reflection.'
  },
  {
    id:'w13-esp-tourism', week:13, level:'B1', title:'Wayang for Cultural Tourism English', character:'Bagong', theme:'ESP tourism communication', duration:'50 min', skills:['Speaking','Vocabulary','ESP'],
    objectives:['Describe a cultural performance','Guide visitors politely','Use tourism vocabulary'],
    vocab:['visitor','performance','ticket','stage','guide','explain','traditional','experience'],
    story:'Bagong becomes a cultural guide and explains the Wayang performance to visitors.',
    listenText:'Good evening, welcome to the Wayang performance. Please enjoy the shadow theatre. The puppets, music, and stories represent Indonesian cultural heritage.',
    reading:'Tourism English helps students explain local culture to international visitors. Students need polite expressions, clear descriptions, and useful cultural vocabulary.',
    quiz:[['Who may watch a cultural performance?','Visitors','Only chairs','Only pencils','Only clocks'],['A guide should speak...','Politely and clearly','Angrily','Silently','Randomly']],
    speaking:'Act as a guide and welcome international visitors to a Wayang performance.',
    writing:'Write a short tourism brochure paragraph about Wayang Lingua Nusantara.',
    moral:'Local culture can welcome the world through language.'
  },
  {
    id:'w14-digital-ethics', week:14, level:'B2', title:'Digital Ethics with Semar', character:'Semar', theme:'AI ethics and academic integrity', duration:'55 min', skills:['Reading','Writing','Academic Integrity'],
    objectives:['Identify ethical AI use','Write an integrity statement','Explain responsible learning'],
    vocab:['integrity','responsible','citation','feedback','original','support','ethics','honesty'],
    story:'Semar reminds learners that AI is a guide, not a replacement for honest thinking.',
    listenText:'Use AI as a mirror, not as a mask. Let it help you revise, but keep your own voice, your own thinking, and your own honesty.',
    reading:'AI-assisted learning requires responsibility. Students may use feedback to improve clarity and grammar, but they must maintain original ideas, cite sources when needed, and avoid dishonest submission.',
    quiz:[['AI should be used as...','Support for learning','A way to cheat','A replacement for thinking','A secret identity'],['Academic integrity means...','Honest learning','Copying everything','Hiding sources','Ignoring feedback']],
    speaking:'Explain how students can use AI responsibly in English learning.',
    writing:'Write an academic integrity statement for your portfolio.',
    moral:'Technology must serve honesty.'
  },
  {
    id:'w15-performance-project', week:15, level:'C1', title:'Final Wayang Performance Project', character:'Dalang AI', theme:'Integrated performance', duration:'75 min', skills:['Performance','Speaking','Writing'],
    objectives:['Plan a digital performance','Write a script','Perform and reflect'],
    vocab:['script','scene','audience','performance','feedback','revision','confidence','message'],
    story:'Students design and perform a short English Wayang scene for a global audience.',
    listenText:'A final performance is not only a test. It is a celebration of voice, culture, and learning. Prepare your script, practice your delivery, and speak to the world.',
    reading:'The final project integrates listening, reading, speaking, writing, vocabulary, intercultural reflection, and performance. Students create a short script and record a Wayang-inspired English presentation.',
    quiz:[['The final project integrates...','All English skills','Only one word','Only silence','Only drawing'],['A script helps performers...','Organize ideas','Forget the story','Avoid practice','Hide from audience']],
    speaking:'Perform a two-minute Wayang-inspired English scene with clear voice and audience awareness.',
    writing:'Write a performance script and a 150-word reflection about your learning journey.',
    moral:'Performance transforms practice into confidence.'
  },
  {
    id:'w16-global-showcase', week:16, level:'C2', title:'Global Showcase and Publication Voice', character:'Srikandi', theme:'Global presentation', duration:'80 min', skills:['Presentation','Academic English','Intercultural'],
    objectives:['Present an innovation globally','Use academic presentation language','Reflect on cultural identity'],
    vocab:['innovation','heritage','global','evidence','impact','audience','identity','sustainability'],
    story:'Learners present Wayang Lingua Nusantara as an educational innovation for global audiences.',
    listenText:'Today, I present a culturally responsive English learning innovation. It connects Wayang heritage, AI feedback, and communicative skills to help EFL learners become confident global speakers.',
    reading:'The global showcase asks learners to communicate innovation, evidence, culture, and impact. Students practice academic presentation language and explain how local heritage can support international education.',
    quiz:[['A global showcase should explain...','Innovation and impact','Only the speaker name','No evidence','Only color'],['Cultural identity can support...','Global communication','Silence','Confusion','Forgetting heritage']],
    speaking:'Present Wayang Lingua Nusantara as an international educational innovation in three minutes.',
    writing:'Write a 200-word abstract about your final performance and learning impact.',
    moral:'Local identity can become an international voice.'
  }
];

const NAVS = {
  guest:[
    ['landing','Home','⌂'], ['concept','Concept','✦'], ['materials','Materials','▣'], ['room','Online Room','◉']
  ],
  student:[
    ['dashboard','Home','⌂'], ['world','Wayang World','✺'], ['modules','CEFR Modules','▤'], ['studio','Learning Studio','🎧'], ['perform','Perform','🎭'], ['mentor','AI Mentor','✦'], ['room','Online Room','◉'], ['passport','Research Passport','▥'], ['profile','Profile','☻']
  ],
  lecturer:[
    ['teacher','Dashboard','⌂'], ['classes','Classes','▤'], ['modules','Materials','▣'], ['review','Review Tasks','✓'], ['room','Online Room','◉'], ['analytics','Analytics','↗'], ['passport','Research Passport','▥'], ['profile','Profile','☻']
  ],
  admin:[
    ['admin','Admin Home','⚙'], ['adminUsers','Users','☻'], ['modules','Materials','▣'], ['room','Online Room','◉'], ['analytics','Analytics','↗'], ['adminBackup','Backup','⇩']
  ]
};

let state = {
  route:'landing',
  selectedModule: MODULES[0].id,
  filterLevel:'All',
  authTab:'login',
  lessonTab:'overview',
  recognition:null,
  speechActive:false,
  transcript:'',
  roomLink:''
};

const $ = sel => document.querySelector(sel);
const app = $('#app');
const sideNav = $('#sideNav');
const mobileNav = $('#mobileNav');
const topBar = $('#topBar');
const toast = $('#toast');

function esc(value=''){
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));
}
function getStore(key, fallback){
  try{return JSON.parse(localStorage.getItem(key)) ?? fallback;}catch(e){return fallback;}
}
function setStore(key, value){localStorage.setItem(key, JSON.stringify(value));}
function currentUser(){return getStore(STORAGE.session, null);}
function isAuthed(){return !!currentUser();}
function userProgress(){return getStore(STORAGE.progress, {});}
function setProgress(progress){setStore(STORAGE.progress, progress);}
function submissions(){return getStore(STORAGE.submissions, []);}
function setSubmissions(rows){setStore(STORAGE.submissions, rows);}
function rooms(){return getStore(STORAGE.rooms, []);}
function setRooms(rows){setStore(STORAGE.rooms, rows);}
function announcements(){return getStore(STORAGE.announcements, []);}
function setAnnouncements(rows){setStore(STORAGE.announcements, rows);}
function users(){return getStore(STORAGE.users, []);}
function setUsers(rows){setStore(STORAGE.users, rows);}
function toastMsg(msg){toast.textContent = msg; toast.classList.add('show'); clearTimeout(toast._t); toast._t=setTimeout(()=>toast.classList.remove('show'),3600);}
function findModule(id=state.selectedModule){return MODULES.find(m=>m.id===id) || MODULES[0];}
function userKey(){const u=currentUser(); return u ? (u.email || u.role) : 'guest';}
function getUserProgress(){const all=userProgress(); return all[userKey()] || {completed:{}, scores:{}, portfolio:[], streak:0, lastActive:null, words:[], currentLevel:'A1'};}
function saveUserProgress(p){const all=userProgress(); all[userKey()]=p; setProgress(all);}
function moduleScore(moduleId){return getUserProgress().scores[moduleId] || 0;}
function completedCount(){return Object.keys(getUserProgress().completed || {}).length;}
function overallProgress(){return Math.round((completedCount()/MODULES.length)*100);}
function moduleLevelRank(level){return ['A1','A2','B1','B2','C1','C2'].indexOf(level);}
function nextLevel(){
  const done=completedCount();
  if(done<3) return 'A1'; if(done<5) return 'A2'; if(done<8) return 'B1'; if(done<11) return 'B2'; if(done<14) return 'C1'; return 'C2';
}

function routeTo(route){
  state.route=route;
  if(route==='studio' && !isAuthed()) state.route='landing';
  render();
  window.scrollTo({top:0, behavior:'smooth'});
}

function userRole(){return currentUser()?.role || 'guest';}
function navItems(){return NAVS[userRole()] || NAVS.guest;}
function renderNav(){
  const items=navItems();
  const html = `
    <div class="brand-card">
      <img src="assets/logo-mark.png" alt="Wayang Lingua Nusantara Logo" />
      <div>
        <div class="brand-title">Wayang <span>Lingua</span> Nusantara</div>
        <div class="brand-subtitle">Original 5D visual identity • EFL • Culture • AI</div>
      </div>
    </div>
    <div class="nav-group-title">Main Menu</div>
    <div class="nav-list">
      ${items.map(([route,label,ico])=>`<button class="nav-btn ${state.route===route?'active':''}" data-route="${route}"><span class="ico">${ico}</span><span>${label}</span></button>`).join('')}
    </div>
    <div class="nav-foot">
      <strong>${APP.copyright}</strong><br>
      Admin access is protected by the requested PIN.<br>
      <span class="badge">${APP.version}</span>
    </div>`;
  sideNav.innerHTML=html;
  mobileNav.innerHTML=items.slice(0,8).map(([route,label,ico])=>`<button class="nav-btn ${state.route===route?'active':''}" data-route="${route}"><span class="ico">${ico}</span><span>${label}</span></button>`).join('');
  document.querySelectorAll('[data-route]').forEach(btn=>btn.addEventListener('click',()=>routeTo(btn.dataset.route)));
}

function renderTopBar(){
  const u=currentUser();
  topBar.innerHTML=`
    <div class="top-title">
      <img src="assets/logo-wide.png" alt="Wayang Lingua Nusantara" />
      <div>
        <h1>${APP.name}</h1>
        <small>${u ? `${esc(u.name)} • ${esc(u.role.toUpperCase())}` : APP.tagline}</small>
      </div>
    </div>
    <div class="top-actions">
      ${u ? `<button class="ghost-btn" id="quickRoomBtn">Online Room</button><button class="soft-btn" id="logoutBtn">Logout</button>` : `<button class="ghost-btn" id="guestConceptBtn">View Concept</button><button class="btn" id="guestStartBtn">Start / Login</button>`}
    </div>`;
  $('#logoutBtn')?.addEventListener('click', logout);
  $('#quickRoomBtn')?.addEventListener('click',()=>routeTo('room'));
  $('#guestConceptBtn')?.addEventListener('click',()=>routeTo('concept'));
  $('#guestStartBtn')?.addEventListener('click',()=>routeTo('landing'));
}

function render(){
  renderNav();
  renderTopBar();
  const role=userRole();
  const routes = {
    landing: renderLanding,
    concept: renderConcept,
    materials: renderMaterialsOverview,
    dashboard: renderStudentDashboard,
    world: renderWayangWorld,
    modules: renderModules,
    studio: renderLearningStudio,
    perform: renderPerformance,
    mentor: renderMentor,
    room: renderOnlineRoom,
    passport: renderPassport,
    profile: renderProfile,
    teacher: renderTeacherDashboard,
    classes: renderClasses,
    review: renderReview,
    analytics: renderAnalytics,
    admin: renderAdmin,
    adminUsers: renderAdminUsers,
    adminBackup: renderBackup
  };
  let fn = routes[state.route] || renderLanding;
  if(role==='guest' && !['landing','concept','materials','room'].includes(state.route)) fn=renderLanding;
  app.innerHTML=fn();
  bindCommon();
}

function renderLanding(){
  return `
  <div class="hero">
    <div class="hero-content">
      <span class="kicker">Original 5D Wayang EFL App</span>
      <h2 class="big">Wayang <span>Lingua</span><br>Nusantara</h2>
      <p class="lead">An exclusive, research-ready English learning app where Indonesian Wayang heritage becomes an interactive EFL ecosystem: listening, speaking, reading, writing, pronunciation, intercultural communication, AI-style mentoring, teacher analytics, and online classroom rooms.</p>
      <div class="hero-actions">
        <button class="btn" data-action="authTab" data-tab="register">Create Account</button>
        <button class="ghost-btn" data-action="authTab" data-tab="login">Login</button>
        <button class="soft-btn" data-action="authTab" data-tab="admin">Admin Login</button>
      </div>
      <div class="metric-strip">
        <div class="metric"><strong>16</strong><span>ready CEFR modules</span></div>
        <div class="metric"><strong>5</strong><span>AI Wayang mentors</span></div>
        <div class="metric"><strong>4</strong><span>integrated EFL skills</span></div>
        <div class="metric"><strong>1</strong><span>online room center</span></div>
        <div class="metric"><strong>∞</strong><span>research export data</span></div>
      </div>
    </div>
  </div>
  <div class="section grid two">
    <div class="panel">${authPanel()}</div>
    <div class="panel">
      <div class="section-head" style="margin-top:0"><div><span class="kicker">Live Interactive Design</span><h2>Inspired directly by your provided visual concept</h2><p>The app uses the original dark-gold Wayang identity, shadow theatre mood, CEFR pathway, AI mentor cards, teacher dashboard, research passport, and copyright placement for Dr. Joko Slamet.</p></div></div>
      <div class="grid two">
        ${featureCard('Cultural Heritage','UNESCO-oriented Wayang learning identity, original 5D logo, and Nusantara visual language.','✺')}
        ${featureCard('AI Mentor Local','Semar, Gareng, Petruk, Bagong, and Dalang AI provide local feedback without paid API.','✦')}
        ${featureCard('Online Room','Create, copy, and join professional live rooms for class meetings and performance sessions.','◉')}
        ${featureCard('Research Passport','Export learning evidence in CSV/JSON and print achievement certificates.','▥')}
      </div>
    </div>
  </div>`;
}

function authPanel(){
  const tabs = [['login','Login'],['register','Register'],['admin','Admin PIN']];
  return `
    <div class="tabs" style="margin-bottom:18px">${tabs.map(([id,label])=>`<button class="tab ${state.authTab===id?'active':''}" data-action="authTab" data-tab="${id}">${label}</button>`).join('')}</div>
    ${state.authTab==='login' ? `
      <h3>Welcome Back</h3><p>Continue your learning or teaching journey.</p>
      <form id="loginForm" class="form-grid">
        <div class="field"><label>Email</label><input name="email" type="email" placeholder="you@example.com" required /></div>
        <div class="field"><label>Password</label><input name="password" type="password" placeholder="Enter password" required /></div>
        <button class="btn" type="submit">Login →</button>
      </form>` : ''}
    ${state.authTab==='register' ? `
      <h3>Create Account</h3><p>Register as student or lecturer. Data is stored locally in the browser for this GitHub Pages version.</p>
      <form id="registerForm" class="form-grid two">
        <div class="field"><label>Full Name</label><input name="name" placeholder="Your full name" required /></div>
        <div class="field"><label>Email</label><input name="email" type="email" placeholder="you@example.com" required /></div>
        <div class="field"><label>Password</label><input name="password" type="password" placeholder="Create password" required /></div>
        <div class="field"><label>Role</label><select name="role"><option value="student">Student</option><option value="lecturer">Lecturer</option></select></div>
        <div class="field"><label>Institution</label><input name="institution" placeholder="University / School" /></div>
        <div class="field"><label>Class Code</label><input name="classCode" placeholder="e.g., WLN-B1-2026" value="WLN-B1-2026" /></div>
        <button class="btn" type="submit" style="grid-column:1/-1">Create Account & Enter App →</button>
      </form>` : ''}
    ${state.authTab==='admin' ? `
      <h3>Admin Access</h3><p>Enter the official admin PIN requested for this deployment.</p>
      <form id="adminForm" class="form-grid">
        <div class="field"><label>Admin PIN</label><input name="pin" type="password" placeholder="Enter admin PIN" required /></div>
        <button class="btn" type="submit">Unlock Admin Console →</button>
      </form>` : ''}
  `;
}

function featureCard(title, text, icon){
  return `<div class="card"><span class="badge">${icon}</span><h3>${esc(title)}</h3><p>${esc(text)}</p></div>`;
}

function renderConcept(){
  return `
  <div class="section-head"><div><span class="kicker">Visual Blueprint</span><h2>Professional App Design System</h2><p>The interface is rebuilt from the provided pictures: dark-gold 5D visual identity, original logo usage, shadow theatre depth, CEFR badges, AI mentor guides, teacher dashboard, achievement certificate, and research analytics passport.</p></div><button class="btn" data-route="landing">Start Now</button></div>
  <div class="grid two">
    <div class="card gold"><img src="assets/design-dark.png" alt="Dark Wayang Lingua design" style="width:100%;border-radius:20px;border:1px solid var(--line)"><h3>Exclusive Dark 5D Interface</h3><p>Used for student dashboard, speaking theatre, AI mentor, progress, room, and performance screens.</p></div>
    <div class="card light"><img src="assets/design-concept.png" alt="Wayang Lingua concept overview" style="width:100%;border-radius:20px;border:1px solid rgba(166,124,82,.22)"><h3>Complete Concept Poster</h3><p>Used as the full professional reference for content, features, flow, analytics, dashboard, and international identity.</p></div>
  </div>
  <div class="section grid four">
    ${featureCard('Color Palette','Midnight indigo, antique gold, warm ivory, parchment beige, muted bronze, and jade green.','🎨')}
    ${featureCard('Typography','Elegant serif headings, clean interface text, and academic-readable content blocks.','Aa')}
    ${featureCard('Interaction','Animated cards, real progress bars, speaking transcript, feedback, and room creation.','↗')}
    ${featureCard('Ownership','Copyright is visible in the footer, certificate, dashboard, and app metadata.','©')}
  </div>`;
}

function renderMaterialsOverview(){
  return `
    <div class="section-head"><div><span class="kicker">Ready-Use Materials</span><h2>Complete EFL Content Bank</h2><p>All modules include listening text, reading text, speaking prompt, writing task, vocabulary, quiz, values, and CEFR level alignment.</p></div><button class="btn" data-route="modules">Open Modules</button></div>
    ${renderModuleGrid(MODULES)}
  `;
}

function renderStudentDashboard(){
  const u=currentUser(); const p=getUserProgress(); const progress=overallProgress(); const last=findModule(p.lastModule || state.selectedModule);
  return `
    <div class="section-head"><div><span class="kicker">Student Home Dashboard</span><h2>Good morning, ${esc(u?.name || 'Learner')}</h2><p>Keep learning through culture, AI mentor feedback, and English performance practice.</p></div><button class="btn" data-route="studio">Continue Learning</button></div>
    <div class="grid four">
      <div class="card gold"><span class="badge">${nextLevel()}</span><h3>Current CEFR Pathway</h3><p>${progress}% completed</p><div class="progress"><span style="width:${progress}%"></span></div></div>
      <div class="card"><span class="badge">🔥</span><h3>Learning Streak</h3><p>${p.streak || 0} active session(s)</p></div>
      <div class="card"><span class="badge">✓</span><h3>Completed Modules</h3><p>${completedCount()} of ${MODULES.length}</p></div>
      <div class="card"><span class="badge">▥</span><h3>Portfolio Items</h3><p>${(p.portfolio||[]).length} saved evidence item(s)</p></div>
    </div>
    <div class="section grid two">
      <div class="card">
        <h3>Continue Learning</h3>
        <p class="lead" style="font-size:.98rem">${esc(last.title)} — ${esc(last.story)}</p>
        <div class="module-meta"><span class="level-badge">${last.level}</span>${last.skills.map(s=>`<span class="pill">${s}</span>`).join('')}</div>
        <div class="audio-wave"></div>
        <div class="cluster"><button class="btn" data-action="selectModule" data-id="${last.id}">Open Lesson →</button><button class="ghost-btn" data-route="modules">Browse All</button></div>
      </div>
      <div class="card">
        <h3>Today's Focus</h3>
        <div class="grid two">
          ${featureCard('Listen','Play a narrated Wayang scene and answer comprehension tasks.','🎧')}
          ${featureCard('Speak','Record or transcribe your dalang performance and get feedback.','🎙️')}
          ${featureCard('Read','Read a CEFR-aligned cultural text and analyze meaning.','📖')}
          ${featureCard('Write','Create reflection, script, or academic paragraph with AI mentor support.','✍️')}
        </div>
      </div>
    </div>
    <div class="section panel">
      <div class="section-head" style="margin-top:0"><div><h2>Announcements</h2><p>Admin and lecturer notices appear here.</p></div></div>
      ${announcements().length ? announcements().slice(-4).reverse().map(a=>`<div class="mini-card"><strong>${esc(a.title)}</strong><p>${esc(a.text)}</p><small>${esc(a.date)}</small></div>`).join('') : '<p>No announcements yet.</p>'}
    </div>`;
}

function renderWayangWorld(){
  return `
  <div class="section-head"><div><span class="kicker">Wayang World</span><h2>Characters as English Learning Guides</h2><p>Each character has a pedagogical function so students learn language, performance, and cultural meaning at the same time.</p></div><button class="btn" data-route="studio">Enter Theatre</button></div>
  <div class="grid four">
    ${CHARACTERS.map(c=>`
      <div class="card character-card">
        <div class="avatar">${c.emoji}</div>
        <div><span class="badge">${esc(c.role)}</span><h3>${esc(c.name)}</h3><p>${esc(c.desc)}</p><p><strong>Values:</strong> ${esc(c.values)}</p></div>
      </div>`).join('')}
  </div>`;
}

function renderModules(){
  const levels=['All','A1','A2','B1','B2','C1','C2'];
  const filtered=state.filterLevel==='All'?MODULES:MODULES.filter(m=>m.level===state.filterLevel);
  return `
    <div class="section-head"><div><span class="kicker">CEFR Pathways</span><h2>16-Week Wayang-Based EFL Curriculum</h2><p>Ready-to-use materials from beginner to mastery: story, listening, reading, speaking, writing, vocabulary, quiz, and moral reflection.</p></div></div>
    <div class="tabs">${levels.map(l=>`<button class="tab ${state.filterLevel===l?'active':''}" data-action="filterLevel" data-level="${l}">${l}</button>`).join('')}</div>
    <div class="section">${renderModuleGrid(filtered)}</div>`;
}

function renderModuleGrid(mods){
  return `<div class="grid auto">${mods.map(m=>`
    <div class="card module-card">
      <div class="module-meta"><span class="level-badge">${m.level}</span><span class="pill jade">Week ${m.week}</span><span class="pill">${esc(m.character)}</span></div>
      <h3>${esc(m.title)}</h3>
      <p class="story">${esc(m.story)}</p>
      <div class="module-meta">${m.skills.map(s=>`<span class="pill">${esc(s)}</span>`).join('')}</div>
      <div class="progress"><span style="width:${moduleScore(m.id)}%"></span></div>
      <div class="cluster"><button class="btn" data-action="selectModule" data-id="${m.id}">Start Lesson</button><button class="ghost-btn" data-action="previewModule" data-id="${m.id}">Preview</button></div>
    </div>`).join('')}</div>`;
}

function renderLearningStudio(){
  const m=findModule();
  const tabs=[['overview','Overview'],['listen','Listen'],['read','Read'],['speak','Speak'],['write','Write'],['quiz','Quiz']];
  return `
  <div class="section-head"><div><span class="kicker">Learning Studio</span><h2>${esc(m.title)}</h2><p>${esc(m.story)}</p></div><button class="ghost-btn" data-route="modules">Change Module</button></div>
  <div class="lesson-layout">
    <aside class="lesson-sidebar card gold">
      <span class="level-badge">${m.level}</span><h3>Week ${m.week}: ${esc(m.title)}</h3><p>${esc(m.theme)}</p>
      <div class="module-meta">${m.skills.map(s=>`<span class="pill">${esc(s)}</span>`).join('')}</div>
      <h4>Objectives</h4><ul>${m.objectives.map(o=>`<li>${esc(o)}</li>`).join('')}</ul>
      <h4>Vocabulary</h4><div class="module-meta">${m.vocab.map(v=>`<button class="pill" data-action="say" data-text="${esc(v)}">${esc(v)}</button>`).join('')}</div>
      <button class="btn" data-action="completeModule" data-id="${m.id}">Mark Evidence Complete</button>
    </aside>
    <div class="panel">
      <div class="tabs">${tabs.map(([id,label])=>`<button class="tab ${state.lessonTab===id?'active':''}" data-action="lessonTab" data-tab="${id}">${label}</button>`).join('')}</div>
      <div class="section">${renderLessonTab(m)}</div>
    </div>
  </div>`;
}

function renderLessonTab(m){
  if(state.lessonTab==='overview') return `
    <div class="grid two">
      <div class="card"><img src="assets/stage-hero.png" style="width:100%;border-radius:18px;border:1px solid var(--line)" alt="Wayang stage"><h3>Story Overview</h3><p>${esc(m.reading)}</p><p><strong>Moral Value:</strong> ${esc(m.moral)}</p></div>
      <div class="card"><h3>Learning Flow</h3>${['Explore story','Listen and read','Speak and perform','Write and reflect','Get mentor feedback','Save portfolio evidence'].map((s,i)=>`<div class="mini-card"><span class="level-badge">${i+1}</span> ${s}</div>`).join('')}</div>
    </div>`;
  if(state.lessonTab==='listen') return `
    <div class="card"><h3>Gamelan Listening Chamber</h3><p>${esc(m.listenText)}</p><div class="audio-wave"></div><div class="cluster"><button class="btn" data-action="playListen">▶ Play Narration</button><button class="ghost-btn" data-action="stopListen">■ Stop</button><button class="soft-btn" data-action="saveListen">Save Listening Evidence</button></div></div>`;
  if(state.lessonTab==='read') return `
    <div class="card"><h3>Lakon Reading Quest</h3><p class="lead" style="font-size:1.02rem">${esc(m.reading)}</p><h4>Reading Mission</h4><p>Identify the main idea, two supporting details, and one cultural value from the text.</p><textarea id="readingNote" placeholder="Write your reading notes here..."></textarea><button class="btn" data-action="saveReading">Save Reading Notes</button></div>`;
  if(state.lessonTab==='speak') return `
    <div class="card"><h3>Shadow Speaking Theatre</h3><p><strong>Prompt:</strong> ${esc(m.speaking)}</p><div class="audio-wave"></div><textarea id="speechTranscript" placeholder="Your transcript will appear here. If speech recognition is not available, type your answer manually.">${esc(state.transcript)}</textarea><div class="cluster"><button class="btn" data-action="startSpeaking">🎙 Start Speaking</button><button class="ghost-btn" data-action="stopSpeaking">Stop</button><button class="soft-btn" data-action="analyzeSpeaking">Analyze Speaking</button></div><div id="speakingFeedback" class="section"></div></div>`;
  if(state.lessonTab==='write') return `
    <div class="card"><h3>Wayang Writing Studio</h3><p><strong>Task:</strong> ${esc(m.writing)}</p><textarea id="writingText" placeholder="Write your response here..."></textarea><div class="cluster"><button class="btn" data-action="analyzeWriting">Get AI Mentor Feedback</button><button class="ghost-btn" data-action="saveWriting">Save Writing Evidence</button></div><div id="writingFeedback" class="section"></div></div>`;
  if(state.lessonTab==='quiz') return renderQuiz(m);
  return '';
}

function renderQuiz(m){
  return `<div class="card"><h3>Comprehension Quiz</h3>${m.quiz.map((q,i)=>`
    <div class="mini-card"><strong>Q${i+1}. ${esc(q[0])}</strong>${q.slice(1).map(opt=>`<button class="quiz-option" data-action="quiz" data-module="${m.id}" data-answer="${esc(q[1])}" data-choice="${esc(opt)}">${esc(opt)}</button>`).join('')}</div>`).join('')}<div id="quizResult" class="section"></div></div>`;
}

function renderPerformance(){
  const p=getUserProgress();
  return `
    <div class="section-head"><div><span class="kicker">Dalang Stage</span><h2>Performance Portfolio</h2><p>Record, write, or submit your Wayang-inspired English performance evidence. Your items are saved into the Research Passport.</p></div><button class="btn" data-route="room">Open Online Room</button></div>
    <div class="grid two">
      <div class="card"><h3>Create Performance Evidence</h3><div class="field"><label>Performance Title</label><input id="perfTitle" placeholder="e.g., Arjuna's Journey Retelling" /></div><div class="field"><label>Script / Transcript</label><textarea id="perfText" placeholder="Paste your script or transcript..."></textarea></div><div class="field"><label>Performance Type</label><select id="perfType"><option>Dalang Narration</option><option>Character Roleplay</option><option>Academic Presentation</option><option>Tourism Guiding</option></select></div><button class="btn" data-action="savePerformance">Save Performance</button></div>
      <div class="card"><h3>Your Portfolio</h3>${(p.portfolio||[]).length ? p.portfolio.slice().reverse().map(item=>`<div class="mini-card"><strong>${esc(item.title)}</strong><p>${esc(item.type)} • ${esc(item.date)}</p><p>${esc(item.text).slice(0,160)}...</p></div>`).join('') : '<p>No performance evidence saved yet.</p>'}</div>
    </div>`;
}

function renderMentor(){
  return `
    <div class="section-head"><div><span class="kicker">AI Wayang Mentor</span><h2>5 Guides for English Improvement</h2><p>This GitHub-ready version uses local rule-based feedback for grammar, vocabulary, fluency, clarity, and performance confidence, so it works without a paid API key.</p></div></div>
    <div class="grid five"></div>
    <div class="grid auto">${MENTORS.map(m=>`<div class="card character-card"><div class="avatar">${m.icon}</div><div><span class="badge">${esc(m.title)}</span><h3>${esc(m.name)}</h3><p>Focus: ${esc(m.target)}.</p></div></div>`).join('')}</div>
    <div class="section panel"><h3>Instant Mentor Review</h3><p>Paste any speaking transcript or writing response below.</p><textarea id="mentorText" placeholder="Paste your English text here..."></textarea><div class="cluster"><button class="btn" data-action="mentorAnalyze">Analyze with 5 Mentors</button><button class="ghost-btn" data-action="mentorClear">Clear</button></div><div id="mentorOutput" class="section"></div></div>`;
}

function renderOnlineRoom(){
  const u=currentUser();
  const defaultRoom = `WayangLinguaNusantara-${(u?.classCode || 'Global').replace(/[^a-z0-9]/gi,'')}`;
  return `
    <div class="section-head"><div><span class="kicker">Room Online</span><h2>Integrated Live Classroom and Performance Room</h2><p>Create a professional room for synchronous speaking practice, lecturer consultation, online performance, and intercultural presentation. The app generates a clean meeting link and invitation text.</p></div></div>
    <div class="grid two">
      <div class="card gold"><h3>Create / Join Room</h3><div class="field"><label>Room Name</label><input id="roomName" value="${esc(defaultRoom)}" /></div><div class="field"><label>Session Purpose</label><select id="roomPurpose"><option>Live Wayang Speaking Practice</option><option>Online Lecture Room</option><option>Performance Assessment</option><option>Research Interview Room</option><option>Teacher Consultation</option></select></div><div class="cluster"><button class="btn" data-action="createRoom">Create Room Link</button><button class="ghost-btn" data-action="copyRoom">Copy Invitation</button><button class="soft-btn" data-action="openRoom">Open Room</button></div><div id="roomDetails" class="section">${state.roomLink ? roomLinkBox(state.roomLink) : ''}</div></div>
      <div class="card"><h3>Room Protocol</h3>${['Use English during the session','Start with a cultural greeting','Record performance evidence ethically only with permission','Use the chat for vocabulary support','Lecturer may save participation notes to Research Passport'].map(x=>`<div class="mini-card">✓ ${x}</div>`).join('')}</div>
    </div>
    <div class="section room-frame" id="roomFrameBox">${state.roomLink ? `<iframe title="Wayang Lingua Online Room" src="${state.roomLink.replace('/','/')}"></iframe>` : '<div style="display:grid;place-items:center;height:520px;color:var(--muted)">Create a room link to load the online classroom here.</div>'}</div>
    <div class="section panel"><h3>Room History</h3>${rooms().length ? `<div class="table-wrap"><table><thead><tr><th>Date</th><th>Purpose</th><th>Room</th><th>Link</th></tr></thead><tbody>${rooms().slice().reverse().map(r=>`<tr><td>${esc(r.date)}</td><td>${esc(r.purpose)}</td><td>${esc(r.name)}</td><td><a href="${esc(r.link)}" target="_blank" rel="noopener">Join</a></td></tr>`).join('')}</tbody></table></div>` : '<p>No rooms created yet.</p>'}</div>`;
}
function roomLinkBox(link){return `<div class="mini-card"><strong>Room Link Ready</strong><p><a href="${esc(link)}" target="_blank" rel="noopener">${esc(link)}</a></p></div>`;}

function renderPassport(){
  const p=getUserProgress(); const progress=overallProgress();
  const avg = avgScoreForUser(p);
  return `
    <div class="section-head"><div><span class="kicker">Research Passport</span><h2>Learning Analytics and Evidence Center</h2><p>Export data for classroom research, student reflection, report writing, and international publication evidence.</p></div><div class="cluster"><button class="btn" data-action="exportCSV">Export CSV</button><button class="ghost-btn" data-action="exportJSON">Export JSON</button><button class="soft-btn" data-action="printCert">Print Certificate</button></div></div>
    <div class="grid four">
      <div class="card"><h3>Overall Growth</h3><div class="circle-score" style="--pct:${progress}%"><strong>${progress}%</strong></div></div>
      <div class="card"><h3>Average Score</h3><div class="circle-score" style="--pct:${avg}%"><strong>${avg}</strong></div></div>
      <div class="card"><h3>Words Practiced</h3><p>${(p.words||[]).length} vocabulary item(s)</p></div>
      <div class="card"><h3>Evidence Items</h3><p>${(p.portfolio||[]).length} portfolio item(s)</p></div>
    </div>
    <div class="section grid two">
      <div class="panel"><h3>Skill Snapshot</h3>${skillBars(p)}</div>
      <div class="panel"><h3>Saved Evidence</h3>${(p.portfolio||[]).length ? p.portfolio.map(item=>`<div class="mini-card"><strong>${esc(item.title)}</strong><p>${esc(item.type)} • ${esc(item.date)}</p></div>`).join('') : '<p>No evidence yet.</p>'}</div>
    </div>
    <div class="section certificate" id="certificate">
      <div class="seal">✺</div><h2>Certificate of Achievement</h2><p>This is to certify that</p><h2>${esc(currentUser()?.name || 'Learner')}</h2><p>has completed learning activities in <strong>Wayang Lingua Nusantara</strong><br>with current pathway level <strong>${nextLevel()}</strong> and overall progress <strong>${progress}%</strong>.</p><p>${APP.copyright}</p>
    </div>`;
}

function renderProfile(){
  const u=currentUser(); if(!u) return renderLanding();
  return `<div class="section-head"><div><span class="kicker">Profile</span><h2>${esc(u.name)}</h2><p>Manage your local profile data for this app deployment.</p></div></div><div class="panel"><form id="profileForm" class="form-grid two"><div class="field"><label>Name</label><input name="name" value="${esc(u.name)}"></div><div class="field"><label>Email</label><input name="email" value="${esc(u.email)}" readonly></div><div class="field"><label>Role</label><input value="${esc(u.role)}" readonly></div><div class="field"><label>Institution</label><input name="institution" value="${esc(u.institution||'')}"></div><div class="field"><label>Class Code</label><input name="classCode" value="${esc(u.classCode||'WLN-B1-2026')}"></div><button class="btn" type="submit" style="grid-column:1/-1">Save Profile</button></form></div>`;
}

function renderTeacherDashboard(){
  const u=currentUser(); const rows=submissions(); const students=users().filter(x=>x.role==='student');
  return `
  <div class="section-head"><div><span class="kicker">Lecturer Dashboard</span><h2>Selamat datang kembali, ${esc(u?.name || 'Lecturer')}</h2><p>Teach with culture, assess with confidence, track with insight, and research with impact.</p></div><button class="btn" data-route="room">Create Online Room</button></div>
  <div class="grid four">
    <div class="card gold"><h3>Active Students</h3><p style="font-size:2rem;margin:0">${students.length}</p></div>
    <div class="card"><h3>Submissions</h3><p style="font-size:2rem;margin:0">${rows.length}</p></div>
    <div class="card"><h3>Modules</h3><p style="font-size:2rem;margin:0">${MODULES.length}</p></div>
    <div class="card"><h3>Rooms Created</h3><p style="font-size:2rem;margin:0">${rooms().length}</p></div>
  </div>
  <div class="section grid two"><div class="panel"><h3>Recent Submissions</h3>${renderSubmissionTable(rows.slice(-8).reverse())}</div><div class="panel"><h3>Class Analytics</h3>${skillBarsFromSubmissions(rows)}</div></div>`;
}

function renderClasses(){
  const students=users().filter(x=>x.role==='student');
  return `<div class="section-head"><div><span class="kicker">Classes</span><h2>Class and Student Management</h2><p>Student accounts created in this browser appear here.</p></div></div><div class="panel">${students.length ? `<div class="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Institution</th><th>Class Code</th><th>Created</th></tr></thead><tbody>${students.map(s=>`<tr><td>${esc(s.name)}</td><td>${esc(s.email)}</td><td>${esc(s.institution||'-')}</td><td>${esc(s.classCode||'-')}</td><td>${esc(s.createdAt||'-')}</td></tr>`).join('')}</tbody></table></div>` : '<p>No student accounts yet.</p>'}</div>`;
}

function renderReview(){
  const rows=submissions().slice().reverse();
  return `<div class="section-head"><div><span class="kicker">Review Tasks</span><h2>Assignments and Evidence Review</h2><p>Review student writing, speaking transcripts, reading notes, and performance evidence.</p></div><button class="btn" data-action="exportCSV">Export Review CSV</button></div><div class="panel">${renderSubmissionTable(rows)}</div>`;
}

function renderAnalytics(){
  const rows=submissions();
  return `<div class="section-head"><div><span class="kicker">Analytics</span><h2>Research-Ready Learning Evidence</h2><p>Aggregated from saved submissions and local progress. Export for classroom research and manuscript preparation.</p></div><div class="cluster"><button class="btn" data-action="exportCSV">Export CSV</button><button class="ghost-btn" data-action="exportJSON">Export JSON</button></div></div><div class="grid two"><div class="panel"><h3>Skill Breakdown</h3>${skillBarsFromSubmissions(rows)}</div><div class="panel"><h3>CEFR Distribution</h3>${levelDistribution()}</div></div>`;
}

function renderAdmin(){
  return `<div class="section-head"><div><span class="kicker">Admin Console</span><h2>Wayang Lingua Nusantara Administration</h2><p>Control users, rooms, announcements, exports, and local deployment settings. Admin access uses the requested PIN.</p></div></div><div class="grid four">${featureCard('Users',`${users().length} local user account(s).`,'☻')}${featureCard('Modules',`${MODULES.length} ready-use modules.`,'▣')}${featureCard('Rooms',`${rooms().length} room record(s).`,'◉')}${featureCard('Submissions',`${submissions().length} evidence record(s).`,'▥')}</div><div class="section grid two"><div class="panel"><h3>Create Announcement</h3><form id="announcementForm" class="form-grid"><div class="field"><label>Title</label><input name="title" placeholder="Announcement title" required></div><div class="field"><label>Message</label><textarea name="text" placeholder="Message for students and lecturers" required></textarea></div><button class="btn" type="submit">Publish Announcement</button></form></div><div class="panel"><h3>Recent Announcements</h3>${announcements().length ? announcements().slice().reverse().map(a=>`<div class="mini-card"><strong>${esc(a.title)}</strong><p>${esc(a.text)}</p><small>${esc(a.date)}</small></div>`).join('') : '<p>No announcements yet.</p>'}</div></div>`;
}

function renderAdminUsers(){
  const all=users();
  return `<div class="section-head"><div><span class="kicker">Admin Users</span><h2>User Accounts</h2><p>Manage local users created in this GitHub Pages deployment.</p></div></div><div class="panel">${all.length ? `<div class="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Institution</th><th>Class</th><th>Action</th></tr></thead><tbody>${all.map(u=>`<tr><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${esc(u.role)}</td><td>${esc(u.institution||'-')}</td><td>${esc(u.classCode||'-')}</td><td><button class="danger-btn" data-action="deleteUser" data-email="${esc(u.email)}">Delete</button></td></tr>`).join('')}</tbody></table></div>` : '<p>No local users yet.</p>'}</div>`;
}

function renderBackup(){
  return `<div class="section-head"><div><span class="kicker">Backup and Export</span><h2>Local Data Backup</h2><p>Export or restore local app data. This is useful before redeploying the GitHub app.</p></div></div><div class="grid two"><div class="panel"><h3>Export Backup</h3><p>Download users, progress, submissions, rooms, and announcements as JSON.</p><button class="btn" data-action="downloadBackup">Download Backup</button></div><div class="panel"><h3>Import Backup</h3><textarea id="backupText" placeholder="Paste backup JSON here"></textarea><button class="ghost-btn" data-action="importBackup">Import Backup</button></div></div><div class="section panel"><h3>Reset Local Data</h3><p>This clears user accounts, progress, submissions, rooms, and announcements in this browser only.</p><button class="danger-btn" data-action="resetAll">Reset All Local Data</button></div>`;
}

function skillBars(p){
  const base={Listening:0,Speaking:0,Reading:0,Writing:0,Performance:0,Vocabulary:0};
  const portfolio=p.portfolio||[];
  base.Listening = Math.min(100, Math.round((p.completed ? Object.keys(p.completed).length : 0) / MODULES.length * 75 + 10));
  base.Reading = Math.min(100, 20 + portfolio.filter(x=>/reading/i.test(x.type)).length*18);
  base.Speaking = Math.min(100, 20 + portfolio.filter(x=>/speaking|performance|dalang/i.test(x.type)).length*15);
  base.Writing = Math.min(100, 20 + portfolio.filter(x=>/writing|reflection|script/i.test(x.type)).length*15);
  base.Performance = Math.min(100, 15 + portfolio.filter(x=>/performance|dalang/i.test(x.type)).length*20);
  base.Vocabulary = Math.min(100, 15 + (p.words||[]).length*4);
  return Object.entries(base).map(([k,v])=>`<div class="mini-card"><div style="display:flex;justify-content:space-between"><strong>${k}</strong><span>${v}%</span></div><div class="progress"><span style="width:${v}%"></span></div></div>`).join('');
}
function skillBarsFromSubmissions(rows){
  const types=['Listening','Speaking','Reading','Writing','Performance'];
  if(!rows.length) return '<p>No submission data yet. Student activities will appear here after learners save evidence.</p>';
  return types.map(t=>{const n=rows.filter(r=>r.type.toLowerCase().includes(t.toLowerCase())).length; const v=Math.min(100, Math.round(n/Math.max(1,rows.length)*100)); return `<div class="mini-card"><div style="display:flex;justify-content:space-between"><strong>${t}</strong><span>${v}%</span></div><div class="progress"><span style="width:${v}%"></span></div></div>`}).join('');
}
function levelDistribution(){
  const counts=MODULES.reduce((a,m)=>(a[m.level]=(a[m.level]||0)+1,a),{});
  return Object.entries(counts).map(([l,n])=>`<div class="mini-card"><div style="display:flex;justify-content:space-between"><strong>${l}</strong><span>${n} module(s)</span></div><div class="progress"><span style="width:${n/MODULES.length*100}%"></span></div></div>`).join('');
}
function renderSubmissionTable(rows){
  if(!rows.length) return '<p>No submissions yet.</p>';
  return `<div class="table-wrap"><table><thead><tr><th>Date</th><th>Student</th><th>Module</th><th>Type</th><th>Score</th><th>Evidence</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r.date)}</td><td>${esc(r.student)}</td><td>${esc(r.moduleTitle)}</td><td>${esc(r.type)}</td><td>${esc(r.score ?? '-')}</td><td>${esc(r.text).slice(0,140)}...</td></tr>`).join('')}</tbody></table></div>`;
}
function avgScoreForUser(p){
  const vals=Object.values(p.scores||{}); if(!vals.length) return 0; return Math.round(vals.reduce((a,b)=>a+b,0)/vals.length);
}

function bindCommon(){
  document.querySelectorAll('[data-route]').forEach(el=>el.addEventListener('click',()=>routeTo(el.dataset.route)));
  document.querySelectorAll('[data-action]').forEach(el=>el.addEventListener('click', handleAction));
  $('#loginForm')?.addEventListener('submit', handleLogin);
  $('#registerForm')?.addEventListener('submit', handleRegister);
  $('#adminForm')?.addEventListener('submit', handleAdminLogin);
  $('#profileForm')?.addEventListener('submit', handleProfile);
  $('#announcementForm')?.addEventListener('submit', handleAnnouncement);
}

function handleAction(e){
  const el=e.currentTarget; const action=el.dataset.action;
  if(action==='authTab'){state.authTab=el.dataset.tab; render();}
  if(action==='filterLevel'){state.filterLevel=el.dataset.level; render();}
  if(action==='lessonTab'){state.lessonTab=el.dataset.tab; render();}
  if(action==='selectModule'){state.selectedModule=el.dataset.id; state.lessonTab='overview'; const p=getUserProgress(); p.lastModule=el.dataset.id; saveUserProgress(p); routeTo('studio');}
  if(action==='previewModule'){state.selectedModule=el.dataset.id; state.lessonTab='overview'; routeTo('studio');}
  if(action==='say'){speakText(el.dataset.text); addWord(el.dataset.text);}
  if(action==='playListen') speakText(findModule().listenText);
  if(action==='stopListen') stopSpeech();
  if(action==='saveListen') saveEvidence('Listening Evidence', findModule().listenText, 80);
  if(action==='saveReading') saveEvidence('Reading Notes', $('#readingNote')?.value || '', 78);
  if(action==='startSpeaking') startSpeaking();
  if(action==='stopSpeaking') stopSpeaking();
  if(action==='analyzeSpeaking') analyzeSpeaking();
  if(action==='analyzeWriting') analyzeWriting();
  if(action==='saveWriting') saveEvidence('Writing Evidence', $('#writingText')?.value || '', analyzeText($('#writingText')?.value || '').overall);
  if(action==='quiz') checkQuiz(el);
  if(action==='completeModule') completeModule(el.dataset.id);
  if(action==='savePerformance') savePerformance();
  if(action==='mentorAnalyze') mentorAnalyze();
  if(action==='mentorClear'){const t=$('#mentorText'); if(t)t.value=''; const o=$('#mentorOutput'); if(o)o.innerHTML='';}
  if(action==='createRoom') createRoom();
  if(action==='copyRoom') copyRoom();
  if(action==='openRoom') openRoom();
  if(action==='exportCSV') exportCSV();
  if(action==='exportJSON') exportJSON();
  if(action==='printCert') window.print();
  if(action==='deleteUser') deleteUser(el.dataset.email);
  if(action==='downloadBackup') downloadBackup();
  if(action==='importBackup') importBackup();
  if(action==='resetAll') resetAll();
}

function handleLogin(e){
  e.preventDefault(); const data=Object.fromEntries(new FormData(e.target).entries());
  const u=users().find(x=>x.email.toLowerCase()===data.email.toLowerCase() && x.password===data.password);
  if(!u){toastMsg('Login failed. Please check email and password.'); return;}
  setStore(STORAGE.session, {...u, password:undefined});
  toastMsg('Login successful. Welcome back.');
  routeTo(u.role==='lecturer'?'teacher':'dashboard');
}
function handleRegister(e){
  e.preventDefault(); const data=Object.fromEntries(new FormData(e.target).entries());
  const all=users(); if(all.some(u=>u.email.toLowerCase()===data.email.toLowerCase())){toastMsg('This email is already registered.'); return;}
  const u={...data, createdAt:new Date().toLocaleString()}; all.push(u); setUsers(all); setStore(STORAGE.session,{...u,password:undefined});
  toastMsg('Account created. Welcome to Wayang Lingua Nusantara.'); routeTo(data.role==='lecturer'?'teacher':'dashboard');
}
function handleAdminLogin(e){
  e.preventDefault(); const pin=new FormData(e.target).get('pin');
  if(pin!==APP.adminPin){toastMsg('Invalid admin PIN.'); return;}
  setStore(STORAGE.session,{role:'admin', name:'Administrator', email:'admin@wayanglingua.local', institution:'Wayang Lingua Nusantara'});
  toastMsg('Admin console unlocked.'); routeTo('admin');
}
function handleProfile(e){
  e.preventDefault(); const data=Object.fromEntries(new FormData(e.target).entries());
  const session=currentUser(); const all=users(); const idx=all.findIndex(u=>u.email===session.email);
  if(idx>=0){all[idx]={...all[idx],...data}; setUsers(all);}
  setStore(STORAGE.session,{...session,...data}); toastMsg('Profile saved.'); render();
}
function handleAnnouncement(e){
  e.preventDefault(); const data=Object.fromEntries(new FormData(e.target).entries());
  const rows=announcements(); rows.push({...data, date:new Date().toLocaleString()}); setAnnouncements(rows); toastMsg('Announcement published.'); render();
}
function logout(){localStorage.removeItem(STORAGE.session); stopSpeech(); state.route='landing'; state.authTab='login'; render(); toastMsg('Logged out.');}

function speakText(text){
  if(!('speechSynthesis' in window)){toastMsg('Speech synthesis is not supported in this browser.'); return;}
  stopSpeech(); const utter=new SpeechSynthesisUtterance(text); utter.lang='en-US'; utter.rate=.88; utter.pitch=1; speechSynthesis.speak(utter); state.speechActive=true;
}
function stopSpeech(){if('speechSynthesis' in window) speechSynthesis.cancel(); state.speechActive=false;}
function startSpeaking(){
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const box=$('#speechTranscript');
  if(!SpeechRecognition){toastMsg('Speech recognition is not supported here. Please type your transcript manually.'); box?.focus(); return;}
  const rec=new SpeechRecognition(); rec.lang='en-US'; rec.interimResults=true; rec.continuous=true; state.transcript=box?.value || '';
  rec.onresult = ev => {
    let text=''; for(let i=0;i<ev.results.length;i++){text += ev.results[i][0].transcript + ' ';}
    state.transcript=text.trim(); if(box) box.value=state.transcript;
  };
  rec.onerror=()=>toastMsg('Speech recognition stopped. You may type manually.');
  rec.start(); state.recognition=rec; toastMsg('Speaking capture started.');
}
function stopSpeaking(){try{state.recognition?.stop();}catch(e){} state.recognition=null; toastMsg('Speaking capture stopped.');}

function analyzeText(text){
  const words=text.trim().split(/\s+/).filter(Boolean);
  const sentences=text.split(/[.!?]+/).filter(s=>s.trim().length>2);
  const unique=new Set(words.map(w=>w.toLowerCase().replace(/[^a-z]/g,''))).size;
  const connectors=(text.match(/\b(because|however|therefore|although|first|second|finally|moreover|for example|in conclusion)\b/gi)||[]).length;
  const culture=(text.match(/\b(wayang|dalang|semar|arjuna|srikandi|gatotkaca|heritage|culture|wisdom|puppet|shadow|story)\b/gi)||[]).length;
  const grammarFlags=[];
  if(/\bi am agree\b/i.test(text)) grammarFlags.push('Use “I agree” instead of “I am agree”.');
  if(/\bhe are\b|\bshe are\b|\bit are\b/i.test(text)) grammarFlags.push('Check subject–verb agreement with is/are.');
  if(words.length<40) grammarFlags.push('Develop your response with more supporting details.');
  const overall=Math.max(35, Math.min(96, Math.round(words.length*0.6 + unique*0.5 + connectors*5 + culture*3 + (sentences.length>2?10:0) - grammarFlags.length*6)));
  return {words:words.length, unique, sentences:sentences.length, connectors, culture, grammarFlags, overall};
}
function feedbackHTML(text, mode='Writing'){
  const a=analyzeText(text);
  const pron=Math.min(95, Math.max(45, a.overall + (mode==='Speaking'?3:-2)));
  const flu=Math.min(95, Math.max(42, a.words>60?a.overall:a.overall-8));
  return `<div class="grid two"><div class="card gold"><h3>${mode} Analytics</h3><div class="score-circles"><div class="circle-score" style="--pct:${a.overall}%"><strong>${a.overall}</strong></div><div class="circle-score" style="--pct:${flu}%"><strong>${flu}</strong></div><div class="circle-score" style="--pct:${pron}%"><strong>${pron}</strong></div></div><p>Words: ${a.words} • Sentences: ${a.sentences} • Connectors: ${a.connectors} • Cultural terms: ${a.culture}</p></div><div class="card"><h3>5 Mentor Feedback</h3>${MENTORS.map(m=>`<div class="mini-card"><strong>${m.icon} ${m.name}</strong><p>${mentorLine(m.name,a)}</p></div>`).join('')}</div></div>`;
}
function mentorLine(name,a){
  if(name==='Semar') return a.sentences>=3 ? 'Your meaning is visible. Add one deeper reflection to make the message more memorable.' : 'Develop your idea into more complete sentences with a clear beginning, middle, and closing.';
  if(name==='Gareng') return a.grammarFlags.length ? a.grammarFlags.join(' ') : 'Your grammar looks acceptable for this local review. Check articles and verb consistency before final submission.';
  if(name==='Petruk') return a.words>=50 ? 'Your response is long enough for fluency practice. Read it aloud with clear stress on key words.' : 'Add more words and practice slowly to improve fluency, pausing after each main idea.';
  if(name==='Bagong') return a.unique>=30 ? 'Good lexical variety. Add more precise academic or cultural vocabulary where possible.' : 'Use richer vocabulary from the module glossary to strengthen your expression.';
  return a.culture>0 ? 'Your performance connects English with Wayang culture. Strengthen audience awareness with a clear opening and closing.' : 'Add Wayang or Nusantara cultural references to make the performance identity stronger.';
}
function analyzeSpeaking(){
  const text=$('#speechTranscript')?.value || ''; if(!text.trim()){toastMsg('Please speak or type your transcript first.'); return;}
  $('#speakingFeedback').innerHTML=feedbackHTML(text,'Speaking');
  saveEvidence('Speaking Transcript', text, analyzeText(text).overall, false);
}
function analyzeWriting(){
  const text=$('#writingText')?.value || ''; if(!text.trim()){toastMsg('Please write your response first.'); return;}
  $('#writingFeedback').innerHTML=feedbackHTML(text,'Writing');
}
function mentorAnalyze(){
  const text=$('#mentorText')?.value || ''; if(!text.trim()){toastMsg('Please paste text first.'); return;}
  $('#mentorOutput').innerHTML=feedbackHTML(text,'Mentor Review');
}
function addWord(word){
  const p=getUserProgress(); p.words=Array.from(new Set([...(p.words||[]), word])); saveUserProgress(p);
}
function saveEvidence(type, text, score=75, show=true){
  const u=currentUser(); if(!u){toastMsg('Please login first.'); return;}
  if(!String(text||'').trim()){toastMsg('Please add evidence text before saving.'); return;}
  const m=findModule(); const p=getUserProgress();
  const item={title:m.title, moduleId:m.id, type, text, score, date:new Date().toLocaleString()};
  p.portfolio=[...(p.portfolio||[]), item]; p.scores[m.id]=Math.max(p.scores[m.id]||0, score); p.lastActive=new Date().toISOString(); p.lastModule=m.id; p.streak=(p.streak||0)+1; saveUserProgress(p);
  const rows=submissions(); rows.push({student:u.name, email:u.email, moduleTitle:m.title, moduleId:m.id, type, text, score, date:item.date}); setSubmissions(rows);
  if(show) toastMsg(`${type} saved to Research Passport.`);
}
function completeModule(id){
  const p=getUserProgress(); p.completed=p.completed||{}; p.completed[id]=new Date().toLocaleString(); p.scores[id]=Math.max(p.scores[id]||0, 85); p.currentLevel=nextLevel(); saveUserProgress(p); toastMsg('Module completion evidence saved.'); render();
}
function checkQuiz(btn){
  const correct=btn.dataset.answer; const choice=btn.dataset.choice;
  const options=btn.parentElement.querySelectorAll('.quiz-option'); options.forEach(o=>{o.disabled=true; if(o.dataset.choice===correct)o.classList.add('correct');});
  if(choice===correct){btn.classList.add('correct'); toastMsg('Correct answer. Well done.'); saveEvidence('Quiz Evidence', `Quiz answer for ${findModule().title}: ${choice}`, 88, false);} else {btn.classList.add('wrong'); toastMsg('Not correct. Review the story and try the next question.');}
}
function savePerformance(){
  const title=$('#perfTitle')?.value || 'Wayang Performance'; const text=$('#perfText')?.value || ''; const type=$('#perfType')?.value || 'Performance';
  if(!text.trim()){toastMsg('Please add your script or transcript.'); return;}
  const p=getUserProgress(); const score=analyzeText(text).overall; const item={title, type, text, score, date:new Date().toLocaleString()};
  p.portfolio=[...(p.portfolio||[]), item]; p.scores[findModule().id]=Math.max(p.scores[findModule().id]||0, score); p.streak=(p.streak||0)+1; saveUserProgress(p);
  const u=currentUser(); const rows=submissions(); rows.push({student:u?.name||'Learner', email:u?.email||'', moduleTitle:title, moduleId:'performance', type, text, score, date:item.date}); setSubmissions(rows);
  toastMsg('Performance saved to portfolio.'); render();
}

function createRoom(){
  const name=($('#roomName')?.value || 'WayangLinguaNusantara').replace(/[^a-z0-9-]/gi,''); const purpose=$('#roomPurpose')?.value || 'Online Room';
  const room=`${name}-${new Date().toISOString().slice(0,10).replace(/-/g,'')}`;
  const link=`https://meet.jit.si/${room}`;
  state.roomLink=link;
  const rows=rooms(); rows.push({name:room,purpose,link,date:new Date().toLocaleString(),creator:currentUser()?.name||'Guest'}); setRooms(rows);
  toastMsg('Online room link created.'); render();
}
function copyRoom(){
  const link=state.roomLink || rooms().slice(-1)[0]?.link; if(!link){toastMsg('Create a room first.'); return;}
  const text=`Wayang Lingua Nusantara Online Room\nLink: ${link}\nPurpose: ${$('#roomPurpose')?.value || 'Live English learning room'}\n${APP.copyright}`;
  navigator.clipboard?.writeText(text).then(()=>toastMsg('Room invitation copied.')).catch(()=>toastMsg('Copy is not available. Please copy the link manually.'));
}
function openRoom(){
  const link=state.roomLink || rooms().slice(-1)[0]?.link; if(!link){toastMsg('Create a room first.'); return;}
  window.open(link,'_blank','noopener');
}

function exportCSV(){
  const rows=submissions();
  const header=['date','student','email','moduleTitle','moduleId','type','score','text'];
  const csv=[header.join(','),...rows.map(r=>header.map(h=>`"${String(r[h]??'').replace(/"/g,'""')}"`).join(','))].join('\n');
  downloadFile('wayang-lingua-research-export.csv', csv, 'text/csv');
}
function exportJSON(){
  const data={app:APP, exportedAt:new Date().toISOString(), users:users().map(({password,...u})=>u), progress:userProgress(), submissions:submissions(), rooms:rooms(), modules:MODULES};
  downloadFile('wayang-lingua-research-export.json', JSON.stringify(data,null,2), 'application/json');
}
function downloadBackup(){
  const data={users:users(),progress:userProgress(),submissions:submissions(),rooms:rooms(),announcements:announcements(), exportedAt:new Date().toISOString()};
  downloadFile('wayang-lingua-local-backup.json', JSON.stringify(data,null,2), 'application/json');
}
function importBackup(){
  const txt=$('#backupText')?.value || ''; if(!txt.trim()){toastMsg('Paste backup JSON first.'); return;}
  try{const d=JSON.parse(txt); if(d.users)setUsers(d.users); if(d.progress)setProgress(d.progress); if(d.submissions)setSubmissions(d.submissions); if(d.rooms)setRooms(d.rooms); if(d.announcements)setAnnouncements(d.announcements); toastMsg('Backup imported.'); render();}catch(e){toastMsg('Invalid backup JSON.');}
}
function downloadFile(filename, content, type){
  const blob=new Blob([content],{type}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=filename; a.click(); URL.revokeObjectURL(a.href); toastMsg(`${filename} downloaded.`);
}
function deleteUser(email){
  if(!confirm('Delete this local user?')) return; setUsers(users().filter(u=>u.email!==email)); toastMsg('User deleted.'); render();
}
function resetAll(){
  if(!confirm('Reset all local data in this browser?')) return; Object.values(STORAGE).forEach(k=>localStorage.removeItem(k)); toastMsg('Local data reset.'); state.route='landing'; render();
}

if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
render();
