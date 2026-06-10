/* Wayang Lingua Nusantara
   Copyright © Dr. Joko Slamet
   Static GitHub Pages app: no paid API, no backend required. Data is stored locally in the browser.
*/
(() => {
  const APP = document.getElementById('app');
  const TOAST = document.getElementById('toast');
  const LS = {
    users: 'wln_users_v1',
    current: 'wln_current_user_v1',
    route: 'wln_route_v1'
  };
  const skillNames = ['listening','speaking','reading','writing','culture','performance'];
  const iconMap = {home:'⌂', world:'✺', listen:'♫', speak:'🎙', read:'▣', write:'✎', perform:'♛', mentor:'☯', dashboard:'▥', passport:'✦', settings:'⚙'};

  const characters = [
    {id:'semar', name:'Semar', epithet:'The Wisdom Mentor', figure:'🧙‍♂️', skill:'Reflection and cultural meaning', desc:'Guides learners to connect language, ethics, humility, and wise communication.'},
    {id:'arjuna', name:'Arjuna', epithet:'The Noble Speaker', figure:'🏹', skill:'Fluent presentation', desc:'Helps learners express purpose, confidence, choices, and self-discipline.'},
    {id:'srikandi', name:'Srikandi', epithet:'The Brave Communicator', figure:'🛡️', skill:'Argument and confidence', desc:'Models courage, public voice, and respectful disagreement in English.'},
    {id:'bima', name:'Bima', epithet:'The Strong Narrator', figure:'💪', skill:'Clear narration', desc:'Builds powerful storytelling, sequence, and cause-effect explanation.'},
    {id:'gatotkaca', name:'Gatotkaca', epithet:'The Loyal Protector', figure:'🦅', skill:'Leadership language', desc:'Supports learners in explaining loyalty, responsibility, and brave decisions.'},
    {id:'gareng', name:'Gareng', epithet:'Grammar Guardian', figure:'🪶', skill:'Accuracy and correction', desc:'Finds sentence structure, tense, article, and coherence problems.'},
    {id:'petruk', name:'Petruk', epithet:'Pronunciation Coach', figure:'🎭', skill:'Stress, rhythm, intonation', desc:'Trains intelligible English through repetition, rhythm, and speaking confidence.'},
    {id:'bagong', name:'Bagong', epithet:'Vocabulary Booster', figure:'🌱', skill:'Vocabulary expansion', desc:'Introduces useful words, collocations, and contextual phrases from Wayang stories.'}
  ];

  const modules = [
    {
      id:'semar-wisdom', cefr:'A1', title:"Semar's Wisdom", character:'Semar', icon:'🧙‍♂️', values:['humility','wisdom','kindness'],
      focus:'Simple self-introduction, basic adjectives, and moral vocabulary.',
      synopsis:'Semar teaches that strong language begins with a humble heart and clear intention.',
      listenText:'Hello, I am Semar. I am not a king, but I guide heroes. Wisdom is not only in power. Wisdom is in kind words, honest action, and respect for other people.',
      readingTitle:'The Guide with a Kind Heart',
      readingText:'Semar is a special figure in Wayang stories. He is simple, wise, and humorous. He often helps heroes when they are confused. Semar teaches that a good person speaks with respect and acts with kindness. For EFL students, Semar reminds us that English is not only about correct grammar. English is also about clear meaning, polite expression, and confidence.',
      vocab:['wise','humble','respect','kindness','guide','honest','clear','meaning'],
      questions:[
        {q:'What does Semar teach?', a:'kind words and honest action', opts:['angry words','kind words and honest action','silent learning','winning a war']},
        {q:'Semar is described as...', a:'simple and wise', opts:['simple and wise','rich and selfish','quiet and afraid','young and careless']}
      ],
      speakingPrompt:'Introduce yourself as Semar. Say who you are, what you value, and how you help other people.',
      writingPrompt:'Write 5–7 sentences about a wise person in your life. Use simple present tense.',
      performancePrompt:'Perform a short Semar monologue about kindness in learning English.'
    },
    {
      id:'arjuna-journey', cefr:'A2', title:"Arjuna's Journey", character:'Arjuna', icon:'🏹', values:['discipline','choice','focus'],
      focus:'Past tense narrative, sequence markers, and goal-setting language.',
      synopsis:'Arjuna faces a difficult choice and learns that discipline gives direction to courage.',
      listenText:'Arjuna walked through the forest before sunrise. He wanted to become a better warrior, but he also wanted to become a wiser person. He practiced every day and listened to advice from his teachers.',
      readingTitle:'A Journey Before Sunrise',
      readingText:'Arjuna began his journey before sunrise. The forest was quiet, and the road was difficult. He carried his bow, but his greatest weapon was not the bow. It was his discipline. Every day, he practiced, reflected, and listened to advice. He learned that a hero does not only fight enemies. A hero also controls himself and chooses the right action.',
      vocab:['journey','discipline','practice','advice','weapon','control','choice','sunrise'],
      questions:[
        {q:'When did Arjuna begin his journey?', a:'before sunrise', opts:['at midnight','before sunrise','after lunch','in the evening']},
        {q:'What was Arjuna’s greatest weapon?', a:'discipline', opts:['gold','a horse','discipline','anger']}
      ],
      speakingPrompt:'Retell Arjuna’s journey using first, then, after that, and finally.',
      writingPrompt:'Write a short narrative about one difficult choice you made as a student.',
      performancePrompt:'Act as Arjuna and explain why discipline matters for learning English.'
    },
    {
      id:'srikandi-courage', cefr:'B1', title:"Srikandi's Courage", character:'Srikandi', icon:'🛡️', values:['courage','voice','justice'],
      focus:'Opinion expression, reasons, examples, and respectful argument.',
      synopsis:'Srikandi speaks bravely when others remain silent and shows that voice is part of justice.',
      listenText:'Srikandi stood before the council and spoke with a calm voice. She did not speak to defeat others. She spoke because truth needed protection. Her courage came from purpose, not anger.',
      readingTitle:'A Voice for Truth',
      readingText:'Srikandi is remembered for courage and determination. In this story, she speaks before a council when many people are afraid to tell the truth. Her voice is calm but strong. She does not use language to attack others. She uses language to defend justice. For students, Srikandi represents the courage to express ideas clearly, support opinions with reasons, and respect different views.',
      vocab:['courage','council','truth','justice','purpose','opinion','reason','respect'],
      questions:[
        {q:'Why did Srikandi speak?', a:'because truth needed protection', opts:['because she wanted a prize','because truth needed protection','because she was angry','because she wanted to leave']},
        {q:'What does Srikandi represent for students?', a:'the courage to express ideas clearly', opts:['the fear of speaking','the courage to express ideas clearly','the habit of silence','the desire to argue without reasons']}
      ],
      speakingPrompt:'Give a one-minute opinion: Why is courage important in learning English?',
      writingPrompt:'Write one paragraph giving your opinion about courage, with at least two reasons.',
      performancePrompt:'Perform Srikandi’s speech to a council about honesty in academic life.'
    },
    {
      id:'bima-strength', cefr:'B1', title:"Bima's Strength", character:'Bima', icon:'💪', values:['strength','responsibility','honesty'],
      focus:'Descriptive storytelling, cause-effect language, and character analysis.',
      synopsis:'Bima learns that real strength is responsibility, not domination.',
      listenText:'Bima was strong, but his teacher told him that strength without responsibility can hurt people. Bima learned to use his power to protect, not to frighten.',
      readingTitle:'The Meaning of Strength',
      readingText:'Bima is known as a strong warrior. However, the story of Bima is not only about physical power. His teacher reminds him that strength must be guided by responsibility. When Bima helps others, his strength becomes meaningful. When he listens before acting, he becomes wiser. This story helps learners describe a character and explain the connection between power, responsibility, and honesty.',
      vocab:['strength','responsibility','protect','frighten','physical','power','meaningful','guided'],
      questions:[
        {q:'What can strength without responsibility do?', a:'hurt people', opts:['help everyone automatically','hurt people','make learning easy','replace wisdom']},
        {q:'When does Bima become wiser?', a:'when he listens before acting', opts:['when he ignores advice','when he listens before acting','when he becomes louder','when he fights everyone']}
      ],
      speakingPrompt:'Describe Bima and explain the difference between strength and responsibility.',
      writingPrompt:'Write a character analysis of Bima in 120–150 words.',
      performancePrompt:'Perform a dialogue between Bima and his teacher about responsible power.'
    },
    {
      id:'gatotkaca-loyalty', cefr:'B2', title:"Gatotkaca's Loyalty", character:'Gatotkaca', icon:'🦅', values:['loyalty','sacrifice','leadership'],
      focus:'Complex sentences, leadership reflection, and moral argument.',
      synopsis:'Gatotkaca protects his kingdom and shows that loyalty requires judgment, not blind obedience.',
      listenText:'Gatotkaca flew above the battlefield and saw the danger below. Although he was young, he understood responsibility. Loyalty was not blind obedience. It was a thoughtful commitment to protect what was right.',
      readingTitle:'Loyalty with Judgment',
      readingText:'Gatotkaca is often associated with bravery and loyalty. Yet loyalty in this story is not simple obedience. Gatotkaca must decide how to protect his kingdom without losing his moral judgment. He understands that a leader needs courage, but also reflection. This lesson invites students to discuss leadership, responsibility, and ethical decision-making in English.',
      vocab:['loyalty','sacrifice','battlefield','obedience','commitment','ethical','judgment','responsibility'],
      questions:[
        {q:'How is loyalty described in the story?', a:'a thoughtful commitment to protect what is right', opts:['blind obedience only','a thoughtful commitment to protect what is right','a way to avoid responsibility','a form of silence']},
        {q:'What does a leader need besides courage?', a:'reflection', opts:['reflection','more noise','expensive clothes','less responsibility']}
      ],
      speakingPrompt:'Explain whether loyalty is always positive. Give examples and reasons.',
      writingPrompt:'Write a 180-word moral argument about loyalty and leadership.',
      performancePrompt:'Perform Gatotkaca’s leadership speech before a difficult decision.'
    },
    {
      id:'petruk-humor', cefr:'A2', title:"Petruk's Humor", character:'Petruk', icon:'🎭', values:['humor','confidence','friendship'],
      focus:'Everyday dialogue, pronunciation practice, and friendly expressions.',
      synopsis:'Petruk uses humor to reduce fear and help friends speak more confidently.',
      listenText:'Petruk laughed and said, Do not be afraid of making mistakes. A mistake is not the end of learning. It is the beginning of improvement.',
      readingTitle:'Learning with Laughter',
      readingText:'Petruk is humorous and expressive. He often makes people laugh, but his humor has meaning. In learning English, students sometimes feel nervous because they are afraid of mistakes. Petruk reminds them that mistakes are part of learning. With practice, feedback, and confidence, students can speak more naturally.',
      vocab:['humor','mistake','improvement','nervous','practice','feedback','naturally','expressive'],
      questions:[
        {q:'What does Petruk say about mistakes?', a:'they are the beginning of improvement', opts:['they are the end of learning','they are the beginning of improvement','they must be hidden','they are always bad']},
        {q:'Why do students sometimes feel nervous?', a:'because they are afraid of mistakes', opts:['because they know everything','because they are afraid of mistakes','because English is never used','because feedback is impossible']}
      ],
      speakingPrompt:'Tell a short funny learning experience and what you learned from it.',
      writingPrompt:'Write a dialogue between Petruk and a nervous English learner.',
      performancePrompt:'Perform Petruk’s motivational message for students who fear speaking English.'
    },
    {
      id:'bagong-vocabulary', cefr:'A1', title:"Bagong's Word Garden", character:'Bagong', icon:'🌱', values:['curiosity','daily life','growth'],
      focus:'Vocabulary building, simple sentences, and word families.',
      synopsis:'Bagong collects useful words and grows them into meaningful sentences.',
      listenText:'Bagong has a word garden. Every day, he plants new words. One word becomes one sentence. One sentence becomes one story.',
      readingTitle:'The Word Garden',
      readingText:'Bagong loves new words. He writes them in his word garden. He learns the meaning, pronunciation, and example sentence. Bagong knows that vocabulary grows slowly. A student does not need to memorize all words in one day. A student needs to use words again and again.',
      vocab:['garden','plant','sentence','story','meaning','example','memorize','slowly'],
      questions:[
        {q:'What does Bagong plant in his garden?', a:'new words', opts:['new words','old shoes','gold coins','musical instruments']},
        {q:'How does vocabulary grow?', a:'slowly through repeated use', opts:['slowly through repeated use','only by sleeping','without practice','in one minute']}
      ],
      speakingPrompt:'Choose five new words and use them in simple spoken sentences.',
      writingPrompt:'Create a vocabulary journal with 8 words and example sentences.',
      performancePrompt:'Perform Bagong teaching three new English words to children.'
    },
    {
      id:'dalang-global', cefr:'C1', title:'Dalang for the World', character:'Dalang', icon:'🎙️', values:['interculturality','identity','global communication'],
      focus:'Academic presentation, cultural explanation, and critical reflection.',
      synopsis:'Students become cultural interpreters who explain Wayang values to international audiences.',
      listenText:'A dalang does more than tell a story. A dalang connects the past with the present, local values with global audiences, and language with wisdom. Today, you will become a dalang for the world.',
      readingTitle:'The Dalang as Cultural Communicator',
      readingText:'The dalang is not merely a performer. In Wayang tradition, the dalang interprets moral conflict, connects characters with social values, and guides audiences through complex meanings. In English language education, the dalang metaphor can help students become intercultural communicators. They do not simply translate culture. They explain, negotiate, and reinterpret local wisdom for global audiences.',
      vocab:['intercultural','interpret','negotiate','reinterpret','audience','tradition','metaphor','wisdom'],
      questions:[
        {q:'What does a dalang connect?', a:'the past with the present and local values with global audiences', opts:['food with music only','the past with the present and local values with global audiences','silence with silence','grammar with punishment']},
        {q:'In English education, the dalang metaphor helps students become...', a:'intercultural communicators', opts:['intercultural communicators','passive listeners','copyists','silent observers']}
      ],
      speakingPrompt:'Deliver a two-minute cultural presentation explaining Wayang to an international audience.',
      writingPrompt:'Write a 250-word reflective essay: How can Wayang support global English communication?',
      performancePrompt:'Create and perform a bilingual opening as a modern dalang for international EFL learners.'
    }
  ];

  const mentors = [
    {id:'semar', name:'Semar', title:'Reflection Mentor', icon:'🧙‍♂️', specialty:'meaning, coherence, confidence, academic tone'},
    {id:'gareng', name:'Gareng', title:'Grammar Mentor', icon:'🪶', specialty:'sentence structure, tense, articles, clarity'},
    {id:'petruk', name:'Petruk', title:'Pronunciation Mentor', icon:'🎭', specialty:'stress, rhythm, intonation, intelligibility'},
    {id:'bagong', name:'Bagong', title:'Vocabulary Mentor', icon:'🌱', specialty:'word choice, collocation, expression'},
    {id:'dalang', name:'Dalang AI', title:'Performance Mentor', icon:'🎙️', specialty:'storytelling, audience awareness, fluency'}
  ];

  const routes = [
    {id:'home', label:'Home', icon:'home'},
    {id:'world', label:'Wayang World', icon:'world'},
    {id:'listen', label:'Listen', icon:'listen'},
    {id:'speak', label:'Speak', icon:'speak'},
    {id:'read', label:'Read', icon:'read'},
    {id:'write', label:'Write', icon:'write'},
    {id:'perform', label:'Perform', icon:'perform'},
    {id:'mentor', label:'AI Mentor', icon:'mentor'},
    {id:'dashboard', label:'Dashboard', icon:'dashboard'},
    {id:'passport', label:'Research Passport', icon:'passport'},
    {id:'settings', label:'Settings', icon:'settings'}
  ];

  let state = {
    user: null,
    route: localStorage.getItem(LS.route) || 'home',
    authTab: 'login',
    selectedModule: 'semar-wisdom',
    selectedMentor: 'semar',
    sidebarOpen: false,
    speakingRecognition: null
  };

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
  const esc = (s='') => String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const nowISO = () => new Date().toISOString();
  const dateHuman = (d=new Date()) => d.toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'});
  const clamp = (n,min=0,max=100) => Math.max(min, Math.min(max, Math.round(n)));

  function getUsers(){ return JSON.parse(localStorage.getItem(LS.users) || '[]'); }
  function setUsers(users){ localStorage.setItem(LS.users, JSON.stringify(users)); }
  function currentEmail(){ return state.user?.email || 'guest'; }
  function progressKey(email=currentEmail()){ return `wln_progress_${email}`; }
  function submissionsKey(email=currentEmail()){ return `wln_submissions_${email}`; }
  function getProgress(email=currentEmail()){
    const raw = localStorage.getItem(progressKey(email));
    if(raw) return JSON.parse(raw);
    return {
      passportId: `WLN-JS-${new Date().getFullYear()}-${Math.random().toString(36).slice(2,7).toUpperCase()}`,
      selectedModule: 'semar-wisdom',
      skillScore: {listening:0,speaking:0,reading:0,writing:0,culture:0,performance:0},
      completed: {}, badges: [], sessions: [], createdAt: nowISO(), consent:false
    };
  }
  function setProgress(progress,email=currentEmail()){ localStorage.setItem(progressKey(email), JSON.stringify(progress)); }
  function getSubmissions(email=currentEmail()){ return JSON.parse(localStorage.getItem(submissionsKey(email)) || '[]'); }
  function setSubmissions(items,email=currentEmail()){ localStorage.setItem(submissionsKey(email), JSON.stringify(items)); }
  function moduleById(id){ return modules.find(m=>m.id===id) || modules[0]; }
  function charByName(name){ return characters.find(c=>c.name===name) || characters[0]; }

  function toast(msg){
    TOAST.textContent = msg;
    TOAST.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(()=>TOAST.classList.remove('show'), 3300);
  }

  function init(){
    const email = localStorage.getItem(LS.current);
    if(email){ state.user = getUsers().find(u=>u.email===email) || null; }
    if(!state.user){ renderLanding(); } else { const p=getProgress(); state.selectedModule=p.selectedModule || 'semar-wisdom'; renderApp(); }
    bindGlobalEvents();
    if('serviceWorker' in navigator){ navigator.serviceWorker.register('./sw.js').catch(()=>{}); }
  }

  function renderLanding(){
    APP.innerHTML = `
      <section class="auth-landing">
        <div class="landing-stage">
          <div class="landing-inner">
            <div class="brand-row"><img class="logo" src="assets/logo.svg" alt="Wayang Lingua Nusantara logo"><div><div class="kicker">AI-Powered Cultural Storytelling for EFL Skills</div><h1>Wayang <span class="gold">Lingua</span><br>Nusantara</h1></div></div>
            <p class="lead">A professional EFL learning app that transforms Wayang heritage into listening, speaking, reading, writing, performance, AI-guided feedback, CEFR pathways, lecturer dashboard, and research-ready analytics.</p>
            <div class="hero-actions">
              <button class="btn primary" data-auth-tab="register">Create Account →</button>
              <button class="btn ghost" data-auth-tab="login">Login</button>
              <button class="btn ghost" data-scroll-design>View Design System</button>
            </div>
          </div>
          <div class="feature-grid" id="designSystem">
            <div class="feature-tile"><strong>Rooted in Culture</strong><span>Wayang characters, values, shadow theatre, and Nusantara storytelling.</span></div>
            <div class="feature-tile"><strong>Integrated Skills</strong><span>Listening, speaking, reading, writing, vocabulary, pronunciation, and performance.</span></div>
            <div class="feature-tile"><strong>AI Mentor</strong><span>Local feedback from Semar, Gareng, Petruk, Bagong, and Dalang AI.</span></div>
            <div class="feature-tile"><strong>Research Passport</strong><span>Export learning analytics for evidence-based teaching and publication.</span></div>
          </div>
          <div class="copyright">Copyright © Dr. Joko Slamet</div>
        </div>
        <aside class="auth-card" id="authCard">
          ${authCard()}
        </aside>
      </section>`;
  }

  function authCard(){
    const isLogin = state.authTab === 'login';
    return `
      <div class="brand-row"><img class="logo sm" src="assets/logo.svg" alt="logo"><div><h2>${isLogin?'Welcome Back':'Create Account'}</h2><p class="mini-lead">Secure local access for students and lecturers.</p></div></div>
      <div class="auth-tabs"><button class="auth-tab ${isLogin?'active':''}" data-auth-tab="login">Login</button><button class="auth-tab ${!isLogin?'active':''}" data-auth-tab="register">Register</button></div>
      ${isLogin ? loginForm() : registerForm()}
      <p class="small-note">Your data stays in this browser unless you export it. For institutional deployment, connect this interface to a protected database.</p>`;
  }
  function loginForm(){
    return `<form class="form-grid" data-login-form>
      <div class="field"><label>Email</label><input required type="email" name="email" autocomplete="email" placeholder="you@example.com"></div>
      <div class="field"><label>Password</label><input required type="password" name="password" autocomplete="current-password" placeholder="Enter password"></div>
      <button class="btn primary" type="submit">Login →</button>
    </form>`;
  }
  function registerForm(){
    return `<form class="form-grid" data-register-form>
      <div class="two-col form-grid">
        <div class="field"><label>Full Name</label><input required name="name" placeholder="Your full name"></div>
        <div class="field"><label>Role</label><select name="role"><option value="student">Student</option><option value="lecturer">Lecturer / Researcher</option></select></div>
      </div>
      <div class="two-col form-grid">
        <div class="field"><label>Email</label><input required type="email" name="email" placeholder="you@example.com"></div>
        <div class="field"><label>Password</label><input required minlength="4" type="password" name="password" placeholder="Minimum 4 characters"></div>
      </div>
      <div class="two-col form-grid">
        <div class="field"><label>Institution</label><input name="institution" placeholder="University / School"></div>
        <div class="field"><label>Class / Program</label><input name="className" placeholder="EFL Class / Course"></div>
      </div>
      <div class="field"><label>Country</label><input name="country" value="Indonesia"></div>
      <button class="btn primary" type="submit">Register & Enter App →</button>
    </form>`;
  }

  function shell(content){
    return `<div class="app-layout">
      <aside class="sidebar ${state.sidebarOpen?'open':''}" id="sidebar">
        <div class="brand-row"><img class="logo sm" src="assets/logo.svg" alt="logo"><div><h3>Wayang<br><span class="gold">Lingua</span></h3><div class="kicker">Nusantara</div></div></div>
        <div class="user-mini"><img class="logo xs" src="assets/logo.svg" alt=""><div><b>${esc(state.user.name)}</b><span>${esc(state.user.role)} · ${levelLabel()}</span></div></div>
        <nav class="nav">${routes.map(r=>navButton(r)).join('')}</nav>
        <div class="sidebar-footer"><span>Rooted in heritage. Powered by AI. Designed for EFL learning.</span><strong>Copyright © Dr. Joko Slamet</strong></div>
      </aside>
      <main class="main">
        ${topbar()}
        ${content}
      </main>
      <nav class="bottom-nav">${['home','listen','speak','mentor','dashboard'].map(id=>navButton(routes.find(r=>r.id===id), true)).join('')}</nav>
    </div>
    <div class="modal" id="modal"></div>`;
  }

  function navButton(r, bottom=false){
    return `<button class="nav-btn ${state.route===r.id?'active':''}" data-route="${r.id}" title="${esc(r.label)}"><span class="nav-ico">${iconMap[r.icon]}</span>${bottom?`<small>${esc(r.label.split(' ')[0])}</small>`:`<span>${esc(r.label)}</span>`}</button>`;
  }

  function topbar(){
    const m = moduleById(state.selectedModule);
    return `<div class="topbar">
      <div class="page-title">
        <button class="btn ghost mobile-menu" data-mobile-menu>☰ Menu</button>
        <h2>${esc(pageTitle())}</h2>
        <p>${esc(pageSubtitle())}</p>
      </div>
      <div class="top-actions">
        <span class="level-pill">${m.cefr} · ${esc(m.title)}</span>
        <button class="btn ghost" data-open-module-picker>Change Module</button>
        <button class="btn danger" data-logout>Logout</button>
      </div>
    </div>`;
  }
  function pageTitle(){ return ({home:'Student Home',world:'Wayang World',listen:'Gamelan Listening Chamber',speak:'Shadow Speaking Theatre',read:'Lakon Reading Quest',write:'Wayang Writing Studio',perform:'Dalang Performance Stage',mentor:'AI Mentor Center',dashboard:'Learning Dashboard',passport:'Research Passport',settings:'Settings'})[state.route] || 'Wayang Lingua Nusantara'; }
  function pageSubtitle(){ return ({home:'Learn English through culture, speak with confidence, and tell your story to the world.',world:'Explore characters, values, stories, and cultural meanings from Wayang.',listen:'Listen to narrated Wayang scenes and complete comprehension tasks.',speak:'Practice role-play, oral retelling, pronunciation, and intelligibility.',read:'Read graded Wayang texts aligned with CEFR pathways.',write:'Create paragraphs, reflections, dialogues, and academic responses.',perform:'Become a dalang and build a performance portfolio.',mentor:'Receive local AI-style feedback from Wayang mentors.',dashboard:'Monitor progress, submissions, skill growth, and class readiness.',passport:'Export evidence for research, teaching reports, and learning portfolios.',settings:'Manage your profile, backup data, and application preferences.'})[state.route] || ''; }

  function renderApp(){
    const pages = {home,world,listen,speak,read,write,perform,mentor,dashboard,passport,settings};
    APP.innerHTML = shell((pages[state.route] || home)());
    hydrateRoute();
  }

  function home(){
    const p = getProgress();
    const m = moduleById(state.selectedModule);
    return `<section class="page">
      <div class="card hero-card">
        <div>
          <div class="kicker">Current learning pathway</div>
          <h2>${esc(m.title)} <span class="gold">(${m.cefr})</span></h2>
          <p class="lead">${esc(m.synopsis)}</p>
          <p class="hero-quote">“In the shadow of story, we find the light of language.”</p>
          <div class="tag-cloud">${m.values.map(v=>`<span class="pill">${esc(v)}</span>`).join('')} ${m.vocab.slice(0,4).map(v=>`<span class="pill">#${esc(v)}</span>`).join('')}</div>
          <div class="hero-actions"><button class="btn primary" data-route="listen">Start Lesson →</button><button class="btn ghost" data-route="mentor">Ask AI Mentor</button><button class="btn ghost" data-route="passport">Open Passport</button></div>
        </div>
        <div class="shadow-stage" aria-label="Wayang shadow theatre visualization"><div class="puppet-row"><span class="puppet">${charByName(m.character).figure}</span><span class="gunungan">♜</span><span class="puppet">🎭</span></div></div>
      </div>
      ${statsBlock(p)}
      <div class="grid cols-3">
        <div class="card"><h3>Today’s Focus</h3><p class="mini-lead">Complete one task from listening, speaking, reading, and writing. Each activity updates your dashboard automatically.</p>${dailyChecklist(p)}</div>
        <div class="card"><h3>Skill Growth</h3>${skillBars(p)}</div>
        <div class="card"><h3>Recommended Next</h3>${nextAction(p)}</div>
      </div>
    </section>`;
  }

  function statsBlock(p){
    const completed = Object.keys(p.completed || {}).length;
    const avg = averageSkills(p.skillScore);
    return `<div class="stats-row">
      <div class="stat-card"><small>Completed Tasks</small><strong>${completed}</strong></div>
      <div class="stat-card"><small>Overall Growth</small><strong>${avg}%</strong></div>
      <div class="stat-card"><small>Badges</small><strong>${(p.badges||[]).length}</strong></div>
      <div class="stat-card"><small>Sessions</small><strong>${(p.sessions||[]).length}</strong></div>
    </div>`;
  }
  function dailyChecklist(p){
    const done = skillNames.filter(s=>p.completed?.[`${state.selectedModule}-${s}`]).length;
    return `<div class="skill-row"><span>Daily Goal</span><div class="progress-bar"><div class="progress-fill green" style="width:${done/6*100}%"></div></div><b>${done}/6</b></div><div class="toolbar"><button class="btn primary" data-route="listen">Continue</button><button class="btn ghost" data-route="dashboard">View Progress</button></div>`;
  }
  function nextAction(p){
    const order = ['listen','speak','read','write','perform'];
    const labels = {listen:'Complete listening comprehension',speak:'Record a shadow speaking performance',read:'Answer reading questions',write:'Analyze a writing response',perform:'Submit a Dalang performance'};
    const next = order.find(r=>!p.completed?.[`${state.selectedModule}-${r}`]) || 'mentor';
    return `<p class="mini-lead">${labels[next] || 'Ask a mentor to refine your portfolio.'}</p><button class="btn primary" data-route="${next}">Open ${next==='mentor'?'AI Mentor':next} →</button>`;
  }

  function world(){
    return `<section class="page">
      <div class="grid cols-2">
        <div class="card"><h3>Wayang World</h3><p class="mini-lead">This app uses Wayang as a culturally responsive EFL ecosystem: students learn language by understanding characters, values, conflict, performance, and intercultural explanation.</p><ul class="list-clean"><li>Characters become learning mentors.</li><li>Stories become graded CEFR lessons.</li><li>Moral values become intercultural speaking and writing tasks.</li><li>Performance becomes evidence of communication growth.</li></ul></div>
        <div class="card"><h3>CEFR Pathway</h3>${cefrPath()}</div>
      </div>
      <div class="card"><div class="section-head"><h3>Characters and Learning Roles</h3><button class="btn ghost" data-route="mentor">Open Mentors</button></div><div class="character-grid">${characters.map(characterCard).join('')}</div></div>
      <div class="card"><div class="section-head"><h3>Story Library</h3><button class="btn primary" data-open-module-picker>Select Lesson</button></div><div class="module-list">${modules.map(moduleCard).join('')}</div></div>
    </section>`;
  }
  function characterCard(c){ return `<article class="character-card"><span class="character-figure">${c.figure}</span><b>${esc(c.name)}</b><small>${esc(c.epithet)}</small><p>${esc(c.desc)}</p><span class="pill">${esc(c.skill)}</span></article>`; }
  function moduleCard(m){ return `<button class="module-card ${m.id===state.selectedModule?'active':''}" data-select-module="${m.id}"><span class="module-icon">${m.icon}</span><span><h4>${esc(m.title)}</h4><p>${esc(m.focus)}</p><span class="tag-cloud">${m.values.map(v=>`<span class="pill">${esc(v)}</span>`).join('')}</span></span><span class="cefr-badge">${m.cefr}</span></button>`; }
  function cefrPath(){
    const levels = ['A1','A2','B1','B2','C1','C2'];
    const current = levelLabel().slice(0,2);
    return `<div class="tag-cloud">${levels.map(l=>`<span class="pill" style="${l===current?'background:var(--gold);color:#160f05':''}">${l}</span>`).join('')}</div><p class="mini-lead">The pathway begins with simple cultural vocabulary and develops toward intercultural academic presentation.</p>${skillBars(getProgress())}`;
  }

  function listen(){
    const m = moduleById(state.selectedModule);
    return `<section class="page">
      <div class="grid cols-2">
        <div class="activity-card">
          <div class="section-head"><h3>${esc(m.title)}</h3><span class="level-pill">${m.cefr}</span></div>
          <div class="media-player"><div class="wave"></div><div class="toolbar"><button class="btn primary" data-speak-text="${esc(m.listenText)}">▶ Play Narration</button><button class="btn ghost" data-stop-speech>■ Stop</button><button class="btn ghost" data-show-transcript>Show Transcript</button></div><div class="transcript hidden" id="listenTranscript">${esc(m.listenText)}</div></div>
          <p class="mini-lead">Skill focus: ${esc(m.focus)}</p><div class="tag-cloud">${m.vocab.map(v=>`<span class="pill">${esc(v)}</span>`).join('')}</div>
        </div>
        <div class="activity-card"><h3>Listening Comprehension</h3>${quizHTML(m,'listening')}<button class="btn primary" data-submit-quiz="listening">Submit Listening</button><div id="listeningResult"></div></div>
      </div>
    </section>`;
  }

  function read(){
    const m = moduleById(state.selectedModule);
    return `<section class="page">
      <div class="grid cols-2">
        <article class="activity-card"><div class="section-head"><h3>${esc(m.readingTitle)}</h3><span class="level-pill">${m.cefr}</span></div><div class="transcript">${esc(m.readingText)}</div><h3 style="margin-top:20px">Key Vocabulary</h3><div class="tag-cloud">${m.vocab.map(v=>`<button class="pill" data-speak-text="${esc(v)}">🔊 ${esc(v)}</button>`).join('')}</div></article>
        <div class="activity-card"><h3>Reading Check</h3>${quizHTML(m,'reading')}<button class="btn primary" data-submit-quiz="reading">Submit Reading</button><div id="readingResult"></div></div>
      </div>
    </section>`;
  }
  function quizHTML(m,type){ return `<form class="quiz" id="${type}Quiz">${m.questions.map((q,i)=>`<div class="question"><p>${i+1}. ${esc(q.q)}</p>${q.opts.map(o=>`<label class="option"><input type="radio" required name="q${i}" value="${esc(o)}"> <span>${esc(o)}</span></label>`).join('')}</div>`).join('')}</form>`; }

  function speak(){
    const m = moduleById(state.selectedModule);
    return `<section class="page">
      <div class="grid cols-2">
        <div class="activity-card"><div class="section-head"><h3>Role: ${esc(m.character)}</h3><span class="level-pill">${m.cefr}</span></div><p class="hero-quote">${esc(m.speakingPrompt)}</p><div class="shadow-stage"><div class="puppet-row"><span class="puppet">${charByName(m.character).figure}</span><span class="gunungan">♜</span></div></div><div class="toolbar" style="margin-top:16px"><button class="btn primary" data-speak-text="${esc(m.speakingPrompt)}">▶ Model Prompt</button><button class="btn ghost" data-route="mentor">Ask Petruk</button></div></div>
        <div class="activity-card"><h3>Speaking Practice</h3><p class="mini-lead">Use microphone recognition when available, or type your transcript manually. The app will provide local intelligibility and fluency feedback.</p><div class="toolbar"><button class="btn primary" data-start-recognition>🎙 Start Speaking</button><button class="btn ghost" data-stop-recognition>Stop</button></div><div class="field" style="margin-top:14px"><label>Your Transcript</label><textarea id="speakingText" placeholder="Your spoken transcript appears here, or type it manually..."></textarea></div><button class="btn primary" data-analyze-speaking>Analyze Speaking</button><div id="speakingFeedback"></div></div>
      </div>
    </section>`;
  }

  function write(){
    const m = moduleById(state.selectedModule);
    return `<section class="page"><div class="grid cols-2">
      <div class="activity-card"><h3>Writing Task</h3><p class="hero-quote">${esc(m.writingPrompt)}</p><ul class="list-clean"><li>Use clear topic sentences.</li><li>Connect Wayang values with real communication.</li><li>Check vocabulary, grammar, and coherence before submission.</li></ul><div class="tag-cloud">${m.values.concat(m.vocab.slice(0,5)).map(v=>`<span class="pill">${esc(v)}</span>`).join('')}</div></div>
      <div class="activity-card"><h3>Writing Studio</h3><div class="field"><label>Your Writing</label><textarea id="writingText" placeholder="Write your paragraph, dialogue, reflection, or short essay here..."></textarea></div><div class="toolbar"><button class="btn primary" data-analyze-writing>Analyze Writing</button><button class="btn ghost" data-save-draft>Save Draft</button><button class="btn ghost" data-clear-writing>Clear</button></div><div id="writingFeedback"></div></div>
    </div></section>`;
  }

  function perform(){
    const m = moduleById(state.selectedModule);
    return `<section class="page"><div class="grid cols-2">
      <div class="activity-card"><h3>Dalang Performance Mission</h3><p class="hero-quote">${esc(m.performancePrompt)}</p><div class="shadow-stage"><div class="puppet-row"><span class="puppet">🎭</span><span class="gunungan">♜</span><span class="puppet">${charByName(m.character).figure}</span></div></div></div>
      <div class="activity-card"><h3>Performance Portfolio</h3><div class="field"><label>Performance Script</label><textarea id="performanceText" placeholder="Create your mini performance script in English..."></textarea></div><div class="field"><label>Reflection</label><textarea id="reflectionText" placeholder="What cultural value did you communicate? What English skill improved?"></textarea></div><div class="toolbar"><button class="btn primary" data-submit-performance>Submit Performance</button><button class="btn ghost" data-speak-performance>Play Script</button></div><div id="performanceFeedback"></div></div>
    </div></section>`;
  }

  function mentor(){
    const selected = mentors.find(x=>x.id===state.selectedMentor) || mentors[0];
    return `<section class="page"><div class="grid cols-2">
      <div class="card"><h3>Choose Your Wayang Mentor</h3><div class="mentor-list">${mentors.map(x=>`<button class="mentor-item ${state.selectedMentor===x.id?'active':''}" data-select-mentor="${x.id}"><span class="mentor-avatar">${x.icon}</span><span><h4>${esc(x.name)}</h4><span>${esc(x.title)} · ${esc(x.specialty)}</span></span><span>→</span></button>`).join('')}</div></div>
      <div class="card"><h3>${esc(selected.name)} · ${esc(selected.title)}</h3><p class="mini-lead">Paste your sentence, paragraph, speech transcript, or performance plan. Feedback is generated locally without external API calls.</p><div class="field"><label>Your Text</label><textarea id="mentorText" placeholder="Write or paste your English here..."></textarea></div><div class="toolbar"><button class="btn primary" data-run-mentor>Generate Feedback</button><button class="btn ghost" data-example-mentor>Use Sample</button></div><div id="mentorFeedback"></div></div>
    </div></section>`;
  }

  function dashboard(){
    return state.user.role === 'lecturer' ? lecturerDashboard() : studentDashboard();
  }
  function studentDashboard(){
    const p=getProgress(); const subs=getSubmissions();
    return `<section class="page">${statsBlock(p)}<div class="grid cols-2"><div class="card"><h3>Skill Snapshot</h3>${skillBars(p)}</div><div class="card"><h3>Badges & Achievements</h3>${badgesBlock(p)}</div></div><div class="card"><div class="section-head"><h3>Recent Sessions</h3><button class="btn ghost" data-export-csv>Export CSV</button></div>${sessionTable(p.sessions||[])}</div><div class="card"><h3>Submissions</h3>${submissionTable(subs)}</div></section>`;
  }
  function lecturerDashboard(){
    const users=getUsers(); const students=users.filter(u=>u.role==='student');
    const rows=students.map(s=>({u:s,p:getProgress(s.email),subs:getSubmissions(s.email)}));
    const avg = rows.length? clamp(rows.reduce((a,r)=>a+averageSkills(r.p.skillScore),0)/rows.length):0;
    return `<section class="page"><div class="stats-row"><div class="stat-card"><small>Local Students</small><strong>${students.length}</strong></div><div class="stat-card"><small>Class Average</small><strong>${avg}%</strong></div><div class="stat-card"><small>Total Submissions</small><strong>${rows.reduce((a,r)=>a+r.subs.length,0)}</strong></div><div class="stat-card"><small>Research Ready</small><strong>${rows.filter(r=>r.p.consent).length}</strong></div></div><div class="grid cols-2"><div class="card"><h3>Class Analytics</h3>${classAnalytics(rows)}</div><div class="card"><h3>Lecturer Actions</h3><p class="mini-lead">Create tasks, monitor skill growth, and export browser-based data. For institutional use, connect accounts to a protected database.</p><div class="toolbar"><button class="btn primary" data-export-class-csv>Export Class CSV</button><button class="btn ghost" data-route="passport">Open Research Passport</button></div></div></div><div class="card"><h3>Student Progress</h3>${studentProgressTable(rows)}</div></section>`;
  }

  function classAnalytics(rows){
    const avgBySkill = Object.fromEntries(skillNames.map(s=>[s, rows.length?clamp(rows.reduce((a,r)=>a+(r.p.skillScore?.[s]||0),0)/rows.length):0]));
    return skillBars({skillScore:avgBySkill});
  }
  function studentProgressTable(rows){
    if(!rows.length) return `<div class="empty">No student accounts have been registered in this browser yet.</div>`;
    return `<div class="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Level</th><th>Average</th><th>Badges</th><th>Sessions</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r.u.name)}</td><td>${esc(r.u.email)}</td><td>${deriveLevel(r.p.skillScore)}</td><td>${averageSkills(r.p.skillScore)}%</td><td>${(r.p.badges||[]).length}</td><td>${(r.p.sessions||[]).length}</td></tr>`).join('')}</tbody></table></div>`;
  }
  function sessionTable(items){
    if(!items.length) return `<div class="empty">No sessions yet. Complete an activity to create analytics.</div>`;
    return `<div class="table-wrap"><table><thead><tr><th>Date</th><th>Module</th><th>Skill</th><th>Score</th><th>Evidence</th></tr></thead><tbody>${items.slice().reverse().map(x=>`<tr><td>${esc(new Date(x.date).toLocaleString())}</td><td>${esc(moduleById(x.module).title)}</td><td>${esc(x.skill)}</td><td>${x.score}%</td><td>${esc(x.evidence||'-')}</td></tr>`).join('')}</tbody></table></div>`;
  }
  function submissionTable(items){
    if(!items.length) return `<div class="empty">No writing, speaking, or performance submissions yet.</div>`;
    return `<div class="table-wrap"><table><thead><tr><th>Date</th><th>Type</th><th>Module</th><th>Score</th><th>Preview</th></tr></thead><tbody>${items.slice().reverse().map(x=>`<tr><td>${esc(new Date(x.date).toLocaleString())}</td><td>${esc(x.type)}</td><td>${esc(moduleById(x.module).title)}</td><td>${x.score}%</td><td>${esc((x.text||'').slice(0,120))}${(x.text||'').length>120?'…':''}</td></tr>`).join('')}</tbody></table></div>`;
  }
  function badgesBlock(p){
    const badges = p.badges?.length ? p.badges : ['Start your first lesson'];
    return `<div class="tag-cloud">${badges.map(b=>`<span class="pill">🏅 ${esc(b)}</span>`).join('')}</div>`;
  }

  function passport(){
    const p=getProgress(); const avg=averageSkills(p.skillScore); const qrdots = qrDots(p.passportId);
    return `<section class="page"><div class="grid cols-2"><div class="passport-card"><div><div class="kicker">Research Analytics Passport</div><h2>Evidence of EFL Growth</h2><p class="mini-lead">Passport ID: <b>${esc(p.passportId)}</b></p><p class="mini-lead">Owner: ${esc(state.user.name)} · ${esc(state.user.institution || 'Institution not set')}</p><div class="toolbar"><button class="btn primary" data-export-json>Export JSON</button><button class="btn ghost" data-export-csv>Export CSV</button><button class="btn ghost" data-print>Print Certificate</button></div></div><div class="qr-seal" aria-label="Verification seal">${qrdots.map(d=>`<span class="qr-dot ${d?'':'light'}"></span>`).join('')}</div></div><div class="card"><h3>Ethical Research Readiness</h3><label class="option"><input type="checkbox" ${p.consent?'checked':''} data-consent> I agree to include my learning analytics in lecturer-managed classroom research after ethical approval and anonymization.</label><p class="small-note">This app exports local data only. Institutional research should obtain informed consent and ethics approval.</p>${skillBars(p)}</div></div><div class="certificate"><h3>Certificate of Achievement</h3><p>This is to certify that</p><div class="certificate-name">${esc(state.user.name)}</div><p>has completed learning activities in <b>Wayang Lingua Nusantara</b> with current overall progress of <b>${avg}%</b>.</p><p class="small-note">Generated on ${dateHuman()} · ${esc(p.passportId)}</p><strong>Copyright © Dr. Joko Slamet</strong></div><div class="card"><h3>Research Variables Captured</h3><div class="rubric-grid">${skillNames.map(s=>`<div class="rubric-item"><span>${title(s)}</span><strong>${p.skillScore[s]||0}%</strong><small>${researchDefinition(s)}</small></div>`).join('')}</div></div></section>`;
  }
  function researchDefinition(s){ return ({listening:'comprehension of narrated Wayang scenes',speaking:'fluency, confidence, intelligibility indicators',reading:'graded text comprehension',writing:'coherence, grammar, vocabulary, and task response',culture:'intercultural reflection and value explanation',performance:'role-play, narration, and audience awareness'})[s]; }

  function settings(){
    return `<section class="page"><div class="grid cols-2"><div class="card"><h3>Profile Metadata</h3><form class="form-grid" data-profile-form><div class="field"><label>Full Name</label><input name="name" value="${esc(state.user.name)}"></div><div class="field"><label>Institution</label><input name="institution" value="${esc(state.user.institution||'')}"></div><div class="field"><label>Class / Program</label><input name="className" value="${esc(state.user.className||'')}"></div><div class="field"><label>Country</label><input name="country" value="${esc(state.user.country||'')}"></div><button class="btn primary">Save Profile</button></form></div><div class="card"><h3>Backup & Maintenance</h3><p class="mini-lead">Export or import browser data for account migration. Reset only removes your local progress in this browser.</p><div class="toolbar"><button class="btn primary" data-backup>Download Backup</button><label class="btn ghost file-drop">Import Backup<input type="file" accept="application/json" data-import-backup hidden></label><button class="btn danger" data-reset-progress>Reset My Progress</button></div></div></div><div class="card"><h3>About</h3><p class="mini-lead"><b>Wayang Lingua Nusantara</b> is a cultural AI-assisted EFL app for integrated skills, CEFR learning pathways, lecturer assessment, and research analytics.</p><p class="copyright">Copyright © Dr. Joko Slamet</p></div></section>`;
  }

  function skillBars(p){
    return `<div>${skillNames.map(s=>`<div class="skill-row"><span>${title(s)}</span><div class="progress-bar"><div class="progress-fill ${s==='culture'?'green':''}" style="width:${p.skillScore?.[s]||0}%"></div></div><b>${p.skillScore?.[s]||0}%</b></div>`).join('')}</div>`;
  }
  function title(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
  function averageSkills(score={}){ return clamp(skillNames.reduce((a,s)=>a+(score[s]||0),0)/skillNames.length); }
  function deriveLevel(score={}){ const avg=averageSkills(score); return avg>=88?'C2':avg>=76?'C1':avg>=64?'B2':avg>=50?'B1':avg>=30?'A2':'A1'; }
  function levelLabel(){ return deriveLevel(getProgress().skillScore); }

  function hydrateRoute(){
    const draft = localStorage.getItem(`wln_draft_${state.selectedModule}`);
    if($('#writingText') && draft) $('#writingText').value = draft;
  }

  function bindGlobalEvents(){
    document.addEventListener('click', e => {
      const routeBtn = e.target.closest('[data-route]');
      if(routeBtn){ changeRoute(routeBtn.dataset.route); return; }
      const authBtn = e.target.closest('[data-auth-tab]');
      if(authBtn){ state.authTab=authBtn.dataset.authTab; const card=$('#authCard'); if(card) card.innerHTML=authCard(); return; }
      if(e.target.closest('[data-scroll-design]')){ $('#designSystem')?.scrollIntoView({behavior:'smooth'}); return; }
      if(e.target.closest('[data-mobile-menu]')){ state.sidebarOpen=!state.sidebarOpen; $('#sidebar')?.classList.toggle('open',state.sidebarOpen); return; }
      if(e.target.closest('[data-logout]')){ logout(); return; }
      const pick=e.target.closest('[data-open-module-picker]'); if(pick){ openModulePicker(); return; }
      const selectModule=e.target.closest('[data-select-module]'); if(selectModule){ setModule(selectModule.dataset.selectModule); return; }
      const speakBtn=e.target.closest('[data-speak-text]'); if(speakBtn){ speakText(speakBtn.dataset.speakText); return; }
      if(e.target.closest('[data-stop-speech]')){ stopSpeech(); return; }
      if(e.target.closest('[data-show-transcript]')){ $('#listenTranscript')?.classList.toggle('hidden'); return; }
      const quiz=e.target.closest('[data-submit-quiz]'); if(quiz){ submitQuiz(quiz.dataset.submitQuiz); return; }
      if(e.target.closest('[data-start-recognition]')){ startRecognition(); return; }
      if(e.target.closest('[data-stop-recognition]')){ stopRecognition(); return; }
      if(e.target.closest('[data-analyze-speaking]')){ analyzeSpeaking(); return; }
      if(e.target.closest('[data-analyze-writing]')){ analyzeWriting(); return; }
      if(e.target.closest('[data-save-draft]')){ saveDraft(); return; }
      if(e.target.closest('[data-clear-writing]')){ $('#writingText').value=''; toast('Writing area cleared.'); return; }
      if(e.target.closest('[data-submit-performance]')){ submitPerformance(); return; }
      if(e.target.closest('[data-speak-performance]')){ speakText($('#performanceText')?.value || 'Please write your performance script first.'); return; }
      const mentorBtn=e.target.closest('[data-select-mentor]'); if(mentorBtn){ state.selectedMentor=mentorBtn.dataset.selectMentor; renderApp(); return; }
      if(e.target.closest('[data-run-mentor]')){ runMentor(); return; }
      if(e.target.closest('[data-example-mentor]')){ fillMentorExample(); return; }
      if(e.target.closest('[data-export-json]')){ downloadJSON(); return; }
      if(e.target.closest('[data-export-csv]')){ downloadCSV(); return; }
      if(e.target.closest('[data-export-class-csv]')){ downloadClassCSV(); return; }
      if(e.target.closest('[data-print]')){ window.print(); return; }
      if(e.target.closest('[data-backup]')){ backupData(); return; }
      if(e.target.closest('[data-reset-progress]')){ resetProgress(); return; }
    });
    document.addEventListener('submit', e => {
      if(e.target.matches('[data-login-form]')){ e.preventDefault(); doLogin(e.target); }
      if(e.target.matches('[data-register-form]')){ e.preventDefault(); doRegister(e.target); }
      if(e.target.matches('[data-profile-form]')){ e.preventDefault(); saveProfile(e.target); }
    });
    document.addEventListener('change', e => {
      if(e.target.matches('[data-consent]')){ const p=getProgress(); p.consent=e.target.checked; setProgress(p); toast('Research consent preference saved.'); }
      if(e.target.matches('[data-import-backup]')){ importBackup(e.target.files[0]); }
    });
  }

  function changeRoute(route){ state.route=route; state.sidebarOpen=false; localStorage.setItem(LS.route, route); renderApp(); }
  function setModule(id){ const p=getProgress(); p.selectedModule=id; state.selectedModule=id; setProgress(p); closeModal(); renderApp(); toast(`Module selected: ${moduleById(id).title}`); }
  function openModulePicker(){
    openModal(`<button class="close-x" data-close-modal>×</button><h2>Select Wayang Lesson</h2><p class="mini-lead">Choose a CEFR-aligned story module. Your activities will be saved to this module.</p><div class="module-list">${modules.map(moduleCard).join('')}</div>`);
  }
  function openModal(html){ const modal=$('#modal'); modal.innerHTML=`<div class="modal-panel">${html}</div>`; modal.classList.add('show'); modal.addEventListener('click', modalClick); }
  function modalClick(e){ if(e.target.id==='modal' || e.target.closest('[data-close-modal]')) closeModal(); }
  function closeModal(){ const modal=$('#modal'); if(modal){ modal.classList.remove('show'); modal.innerHTML=''; modal.removeEventListener('click', modalClick); } }

  function doRegister(form){
    const data = Object.fromEntries(new FormData(form).entries());
    const users = getUsers();
    const email = data.email.trim().toLowerCase();
    if(users.some(u=>u.email===email)){ toast('This email is already registered. Please login.'); state.authTab='login'; $('#authCard').innerHTML=authCard(); return; }
    const user = {...data, email, createdAt:nowISO()};
    users.push(user); setUsers(users); localStorage.setItem(LS.current,email); state.user=user;
    setProgress(getProgress(email), email);
    renderApp(); toast('Account created successfully. Welcome to Wayang Lingua Nusantara.');
  }
  function doLogin(form){
    const data=Object.fromEntries(new FormData(form).entries());
    const email=data.email.trim().toLowerCase();
    const user=getUsers().find(u=>u.email===email && u.password===data.password);
    if(!user){ toast('Login failed. Please check your registered email and password.'); return; }
    state.user=user; localStorage.setItem(LS.current,email); const p=getProgress(); state.selectedModule=p.selectedModule || 'semar-wisdom'; renderApp(); toast('Login successful.');
  }
  function logout(){ stopSpeech(); localStorage.removeItem(LS.current); state.user=null; renderLanding(); toast('Logged out.'); }
  function saveProfile(form){
    const data=Object.fromEntries(new FormData(form).entries());
    const users=getUsers().map(u=>u.email===state.user.email?{...u,...data}:u); setUsers(users); state.user={...state.user,...data}; renderApp(); toast('Profile metadata saved.');
  }

  function speakText(text){
    stopSpeech();
    if(!('speechSynthesis' in window)){ toast('Speech synthesis is not supported in this browser.'); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.lang='en-US'; u.rate=.92; u.pitch=1.02;
    const voices = speechSynthesis.getVoices();
    const preferred = voices.find(v=>/English|US|UK|Google/i.test(v.name+v.lang));
    if(preferred) u.voice = preferred;
    speechSynthesis.speak(u); toast('Audio narration started.');
  }
  function stopSpeech(){ if('speechSynthesis' in window) speechSynthesis.cancel(); }

  function submitQuiz(type){
    const m=moduleById(state.selectedModule); const form=$(`#${type}Quiz`); if(!form) return;
    let correct=0; let answered=0;
    m.questions.forEach((q,i)=>{ const v=form.querySelector(`input[name="q${i}"]:checked`)?.value; if(v){ answered++; if(v===q.a) correct++; }});
    if(answered<m.questions.length){ toast('Please answer all questions first.'); return; }
    const score=clamp(correct/m.questions.length*100);
    updateSkill(type==='listening'?'listening':'reading', score, `${correct}/${m.questions.length} comprehension answers correct`, type);
    const box=$(`#${type}Result`); box.innerHTML=`<div class="feedback-box"><b>${score}% score.</b> You answered ${correct} of ${m.questions.length} correctly. ${score>=70?'Excellent. This task has been completed.':'Review the story and try again for stronger comprehension.'}</div>`;
  }

  function startRecognition(){
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR){ toast('Speech recognition is not available in this browser. Type your transcript manually, then analyze.'); return; }
    const rec = new SR(); rec.lang='en-US'; rec.interimResults=true; rec.continuous=true;
    const area=$('#speakingText'); let final='';
    rec.onresult = (e)=>{ let interim=''; for(let i=e.resultIndex;i<e.results.length;i++){ const t=e.results[i][0].transcript; if(e.results[i].isFinal) final += t + ' '; else interim += t; } area.value = (final + interim).trim(); };
    rec.onerror = () => toast('Microphone recognition stopped. You can continue by typing your transcript.');
    state.speakingRecognition=rec; rec.start(); toast('Speaking recognition started.');
  }
  function stopRecognition(){ try{ state.speakingRecognition?.stop(); toast('Speaking recognition stopped.'); }catch(e){} }

  function analyzeSpeaking(){
    const text=$('#speakingText')?.value.trim() || '';
    if(text.length<12){ toast('Please speak or type a longer transcript first.'); return; }
    const m=moduleById(state.selectedModule); const words=tokenize(text); const vocabHits=m.vocab.filter(v=>new RegExp(`\\b${escapeRegex(v)}\\b`,'i').test(text)).length;
    const sentenceCount=(text.match(/[.!?]/g)||[]).length || 1;
    const wps=words.length/Math.max(sentenceCount,1);
    const score=clamp(42 + Math.min(words.length,70)*.45 + vocabHits*5 + (wps>4&&wps<22?12:4));
    const feedback = `<div class="feedback-box"><b>Speaking score: ${score}%</b><br>${speakingFeedbackText(score, words.length, vocabHits)}<div class="rubric-grid" style="margin-top:12px"><div class="rubric-item"><span>Words</span><strong>${words.length}</strong></div><div class="rubric-item"><span>Target Vocabulary</span><strong>${vocabHits}/${m.vocab.length}</strong></div><div class="rubric-item"><span>Fluency Estimate</span><strong>${clamp(score+3)}%</strong></div></div></div>`;
    $('#speakingFeedback').innerHTML=feedback;
    updateSkill('speaking', score, `${words.length} spoken/typed words; ${vocabHits} target words used`, 'speaking', text);
  }
  function speakingFeedbackText(score, words, hits){
    if(score>=82) return `Your response is confident and sufficiently extended. Keep refining stress, pauses, and audience awareness.`;
    if(score>=65) return `Good progress. Add more details, use more target vocabulary, and vary sentence openings.`;
    return `Develop your response with more complete sentences. Practice slowly first, then repeat with better rhythm.`;
  }

  function analyzeWriting(){
    const text=$('#writingText')?.value.trim() || '';
    if(text.length<30){ toast('Please write at least several sentences before analysis.'); return; }
    const m=moduleById(state.selectedModule); const res=analyzeText(text,m);
    $('#writingFeedback').innerHTML=`<div class="feedback-box"><b>Writing score: ${res.score}%</b><br>${res.summary}<div class="rubric-grid" style="margin-top:12px">${res.metrics.map(x=>`<div class="rubric-item"><span>${esc(x.label)}</span><strong>${esc(x.value)}</strong><small>${esc(x.note)}</small></div>`).join('')}</div><h4>Suggestions</h4><ul class="list-clean">${res.suggestions.map(s=>`<li>${esc(s)}</li>`).join('')}</ul></div>`;
    updateSkill('writing', res.score, `${res.metrics[0].value} words; ${res.metrics[2].value} target words`, 'writing', text);
  }
  function analyzeText(text,m){
    const words=tokenize(text); const sentences=(text.match(/[.!?]+/g)||[]).length || 1;
    const connectors=['because','therefore','however','although','first','then','finally','for example','in addition','as a result'];
    const conn=connectors.filter(c=>text.toLowerCase().includes(c)).length;
    const vocab=m.vocab.filter(v=>new RegExp(`\\b${escapeRegex(v)}\\b`,'i').test(text)).length;
    const startsUpper = /^[A-Z]/.test(text.trim());
    const hasValue = m.values.some(v=>text.toLowerCase().includes(v));
    const longEnough = words.length >= (m.cefr==='C1'?180:m.cefr==='B2'?130:m.cefr==='B1'?90:45);
    const score=clamp(32 + Math.min(words.length,200)*.16 + conn*5 + vocab*4 + (startsUpper?6:0) + (hasValue?8:0) + (longEnough?10:0));
    const suggestions=[];
    if(!longEnough) suggestions.push('Develop the response with more supporting details and examples.');
    if(conn<2) suggestions.push('Add connectors such as because, however, for example, or therefore.');
    if(vocab<2) suggestions.push('Use more vocabulary from the selected Wayang module.');
    if(!hasValue) suggestions.push('Connect your writing to at least one cultural or moral value from the story.');
    if(startsUpper && suggestions.length===0) suggestions.push('Strong response. Refine sentence variety and add a concluding insight.');
    return {score, summary: score>=78?'Your writing is clear, purposeful, and culturally connected.':score>=60?'Your writing is understandable but needs stronger development and cohesion.':'Your writing needs more details, clearer organization, and stronger vocabulary use.', metrics:[{label:'Words',value:String(words.length),note:'Length and development'},{label:'Sentences',value:String(sentences),note:'Sentence control'},{label:'Target words',value:`${vocab}/${m.vocab.length}`,note:'Module vocabulary'},{label:'Connectors',value:String(conn),note:'Cohesion markers'}], suggestions};
  }
  function saveDraft(){ const text=$('#writingText')?.value || ''; localStorage.setItem(`wln_draft_${state.selectedModule}`, text); toast('Draft saved locally.'); }

  function submitPerformance(){
    const script=$('#performanceText')?.value.trim() || ''; const reflection=$('#reflectionText')?.value.trim() || '';
    if(script.length<35 || reflection.length<25){ toast('Please complete both script and reflection.'); return; }
    const words=tokenize(script+' '+reflection).length; const score=clamp(45 + Math.min(words,180)*.2 + (reflection.toLowerCase().includes('culture') || reflection.toLowerCase().includes('value') ? 10:0));
    $('#performanceFeedback').innerHTML=`<div class="feedback-box"><b>Performance score: ${score}%</b><br>Your Dalang portfolio has been saved. ${score>=75?'Excellent integration of performance and reflection.':'Add clearer cultural meaning and stronger audience awareness.'}</div>`;
    updateSkill('performance', score, `${words} performance/reflection words`, 'performance', script+'\n\nReflection: '+reflection);
    updateSkill('culture', clamp(score+5), 'Cultural reflection submitted', 'culture');
  }

  function runMentor(){
    const text=$('#mentorText')?.value.trim() || ''; if(text.length<10){ toast('Please enter text for mentor feedback.'); return; }
    const m=moduleById(state.selectedModule); const mentor=mentors.find(x=>x.id===state.selectedMentor) || mentors[0]; const analysis=mentorFeedback(mentor.id,text,m);
    $('#mentorFeedback').innerHTML=`<div class="feedback-box warn"><b>${esc(mentor.name)} says:</b><br>${analysis.summary}<h4>Action Points</h4><ul class="list-clean">${analysis.points.map(p=>`<li>${esc(p)}</li>`).join('')}</ul></div>`;
    updateSkill('culture', Math.max(getProgress().skillScore.culture||0, analysis.score), `AI mentor feedback from ${mentor.name}`, 'mentor', text);
  }
  function fillMentorExample(){ const m=moduleById(state.selectedModule); $('#mentorText').value = `I think ${m.character} teaches us about ${m.values[0]}. This value is important because students need confidence and respect when they communicate in English.`; }
  function mentorFeedback(id,text,m){
    const words=tokenize(text); const lower=text.toLowerCase(); const points=[]; let score=60;
    if(id==='gareng'){
      if(!/[.!?]$/.test(text.trim())) points.push('End your sentence or paragraph with correct punctuation.');
      if(/\bi am agree\b/i.test(text)) points.push('Use “I agree,” not “I am agree.”');
      if(/\bvery unique\b/i.test(text)) points.push('Use “highly distinctive” or “very distinctive” instead of “very unique” in formal writing.');
      points.push('Check tense consistency and make sure every sentence has a clear subject and verb.'); score=clamp(55+words.length*.25);
    } else if(id==='petruk'){
      points.push('Practice key words slowly first, then repeat with natural rhythm.');
      points.push('Stress content words such as nouns, verbs, adjectives, and cultural terms.');
      points.push('Pause after each idea unit to improve intelligibility.'); score=clamp(58+words.length*.22);
    } else if(id==='bagong'){
      const hits=m.vocab.filter(v=>lower.includes(v)).length; points.push(`You used ${hits} target words from this module. Try to use at least three more.`);
      points.push('Add collocations such as “cultural value,” “moral lesson,” “global audience,” or “clear communication.”'); score=clamp(55+hits*7+words.length*.18);
    } else if(id==='dalang'){
      points.push('Open with a strong cultural hook for your audience.'); points.push('Use storytelling sequence: orientation, conflict, value, and closing message.'); points.push('Address the audience directly to make the performance more engaging.'); score=clamp(60+words.length*.2);
    } else {
      const hasValue=m.values.some(v=>lower.includes(v)); points.push(hasValue?'Your text connects language with moral value.':'Add one explicit Wayang value such as wisdom, courage, loyalty, or responsibility.'); points.push('Clarify the main message in one sentence before developing examples.'); points.push('Connect the local story to global English communication.'); score=clamp(58+words.length*.2+(hasValue?10:0));
    }
    return {score, summary: score>=78?'This is meaningful and communicatively strong.':'This is promising. Improve clarity, development, and cultural connection.', points};
  }

  function updateSkill(skill, score, evidence, type='activity', text=''){
    const p=getProgress();
    p.skillScore[skill]=Math.max(p.skillScore[skill]||0, clamp(score));
    p.completed[`${state.selectedModule}-${skill}`]=true;
    p.sessions.push({date:nowISO(), module:state.selectedModule, skill, score:clamp(score), evidence});
    p.badges = awardBadges(p);
    setProgress(p);
    if(text){ const subs=getSubmissions(); subs.push({date:nowISO(), type, module:state.selectedModule, skill, score:clamp(score), text}); setSubmissions(subs); }
    toast(`${title(skill)} updated: ${clamp(score)}%`);
  }
  function awardBadges(p){
    const b=new Set(p.badges||[]); const avg=averageSkills(p.skillScore);
    if(Object.keys(p.completed).length>=1) b.add('First Shadow Step');
    if(p.skillScore.speaking>=70) b.add('Clear Speaker');
    if(p.skillScore.writing>=70) b.add('Story Writer');
    if(p.skillScore.culture>=70) b.add('Culture Interpreter');
    if(p.skillScore.performance>=75) b.add('Dalang Performer');
    if(avg>=80) b.add('Global Communicator');
    return [...b];
  }

  function downloadJSON(){
    const data={app:'Wayang Lingua Nusantara', copyright:'Copyright © Dr. Joko Slamet', exportedAt:nowISO(), user:safeUser(state.user), progress:getProgress(), submissions:getSubmissions()};
    saveFile(`wayang-lingua-passport-${state.user.email}.json`, JSON.stringify(data,null,2), 'application/json');
  }
  function downloadCSV(){
    const p=getProgress(); const rows=[['date','module','skill','score','evidence'],...(p.sessions||[]).map(s=>[s.date,moduleById(s.module).title,s.skill,s.score,s.evidence])];
    saveFile(`wayang-lingua-sessions-${state.user.email}.csv`, toCSV(rows), 'text/csv');
  }
  function downloadClassCSV(){
    const students=getUsers().filter(u=>u.role==='student');
    const rows=[['name','email','institution','class','level','average','listening','speaking','reading','writing','culture','performance','sessions','badges','consent']];
    students.forEach(u=>{ const p=getProgress(u.email); rows.push([u.name,u.email,u.institution||'',u.className||'',deriveLevel(p.skillScore),averageSkills(p.skillScore),...skillNames.map(s=>p.skillScore[s]||0),(p.sessions||[]).length,(p.badges||[]).join('; '),p.consent?'yes':'no']); });
    saveFile('wayang-lingua-class-analytics.csv', toCSV(rows), 'text/csv');
  }
  function backupData(){
    const keys=Object.keys(localStorage).filter(k=>k.startsWith('wln_'));
    const data=Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)]));
    saveFile('wayang-lingua-backup.json', JSON.stringify(data,null,2), 'application/json');
  }
  function importBackup(file){
    if(!file) return; const reader=new FileReader();
    reader.onload=()=>{ try{ const data=JSON.parse(reader.result); Object.entries(data).forEach(([k,v])=>{ if(k.startsWith('wln_')) localStorage.setItem(k,v); }); toast('Backup imported. Please login again if needed.'); init(); }catch(e){ toast('Invalid backup file.'); } };
    reader.readAsText(file);
  }
  function resetProgress(){ if(!confirm('Reset your local progress?')) return; localStorage.removeItem(progressKey()); localStorage.removeItem(submissionsKey()); const p=getProgress(); p.selectedModule=state.selectedModule; setProgress(p); renderApp(); toast('Progress reset.'); }

  function saveFile(filename, content, type){
    const blob=new Blob([content],{type}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url), 500);
  }
  function toCSV(rows){ return rows.map(r=>r.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\n'); }
  function safeUser(u){ const {password, ...rest}=u; return rest; }
  function tokenize(text){ return (text.toLowerCase().match(/[a-zA-Z']+/g)||[]); }
  function escapeRegex(s){ return String(s).replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }
  function qrDots(seed){
    let h=0; for(let i=0;i<seed.length;i++) h=(h*31+seed.charCodeAt(i))>>>0;
    const dots=[]; for(let i=0;i<81;i++){ h=(h*1664525+1013904223)>>>0; const finder=(i<3||i%9<3||i>53&&i%9>5); dots.push(finder || (h%7<3)); } return dots;
  }

  init();
})();
