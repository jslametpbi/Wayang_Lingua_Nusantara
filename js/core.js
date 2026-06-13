/* ============================================================
   Wayang Lingua Nusantara — core.js
   State & storage, auth, gamification, speech engine
   (TTS + recognition + scoring), AI mentor feedback engine,
   wayang portrait generator, shared UI helpers.
   ============================================================ */

const $  = (s,p=document)=>p.querySelector(s);
const $$ = (s,p=document)=>[...p.querySelectorAll(s)];
const esc = s => String(s??'').replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));

/* ============================ STATE ============================ */
const LS_KEY = 'WLN_STATE_V2'; /* V2: forces fresh state, prevents old-app localStorage conflicts */

function newStudentRecord(){
  return {
    xp: 0, streak: 0, lastActive: null,
    speakBest: 0, lessonsDone: 0, writingCount: 0, vocabCount: 0,
    preTest: null, postTest: null,
    skills: { Listening:0, Speaking:0, Reading:0, Writing:0, Culture:0 },
    lessonProgress: {},          // meetingId -> {steps:{listen,read,speak,write,feedback}, score}
    speakingSessions: [],        // {date, meetingId, scores:{pron,fluency,overall}, transcript}
    writings: [],                // {date, meetingId, text, score, feedback}
    quizzes: [],                 // {date, meetingId, kind, score}
    vocabMastered: [],           // words
    badges: [],                  // badge ids
    mentorChats: {},             // mentorId -> [{role,text,date}]
    dailyDone: [],               // dates daily focus completed
  };
}

function defaultState(){
  return {
    version: 1,
    session: null, // email of logged-in user
    users: [
      { name:'Administrator', email:'admin@wayanglingua.id', password:'Admin@JS2026',
        role:'Admin', cefr:'C2', institution:'Wayang Lingua Nusantara', photo:'', bio:'' },
      { name:'Dr. Joko Slamet', email:'lecturer@wayanglingua.id', password:'Lecturer@2026',
        role:'Lecturer', cefr:'C2', institution:'Universitas Nusantara', photo:'',
        bio:'Empowering learners through language, culture, and research.' },
      { name:'Siti Nurhaliza', email:'siti.nur@student.ac.id', password:'Student@2026',
        role:'Student', cefr:'B1', institution:'Universitas Nusantara', photo:'', bio:'',
        record: seedStudentRecord() },
    ],
    classes: structuredClone(WLN.SEED_CLASSES),
    submissions: structuredClone(WLN.SEED_SUBMISSIONS),
    assessments: [],
    rooms: WLN.MEETINGS.slice(0,6).map(m => ({
      id:'r'+m.id, title:`Week ${m.id}: ${m.title}`,
      url:`https://meet.jit.si/WayangLingua-${m.id}-${m.title.replace(/\W+/g,'')}`,
      agenda:'Opening reflection \u2192 mini lecture \u2192 guided skill practice \u2192 breakout performance \u2192 peer feedback \u2192 portfolio submission.',
      chat:[], attendance:[],
    })),
    certificates: [],
    activity: [],
    apiKey: '', // optional Anthropic key for live AI feedback
  };
}

/* a believable seeded record for the demo student (matches the boards) */
function seedStudentRecord(){
  const r = newStudentRecord();
  r.xp = 2450; r.streak = 7;
  r.lastActive = new Date().toISOString().slice(0,10);
  r.speakBest = 79; r.lessonsDone = 4; r.writingCount = 3; r.vocabCount = 46;
  r.skills = { Listening:78, Speaking:72, Reading:80, Writing:69, Culture:85 };
  r.preTest  = { Listening:52, Speaking:48, Reading:58, Writing:45, Overall:51 };
  r.postTest = null;
  r.lessonProgress = {
    1:{steps:{listen:1,read:1,speak:1,write:1,feedback:1},score:82},
    2:{steps:{listen:1,read:1,speak:1,write:1,feedback:1},score:75},
    3:{steps:{listen:1,read:1,speak:1,write:1,feedback:1},score:80},
    4:{steps:{listen:1,read:1,speak:1,write:1,feedback:1},score:77},
    5:{steps:{listen:1,read:1},score:0},
  };
  r.speakingSessions = [
    { date:offsetDay(-2), meetingId:6, scores:{pron:82,fluency:76,overall:79}, transcript:'Arjuna\u2019s quest, introductions' },
    { date:offsetDay(-3), meetingId:7, scores:{pron:74,fluency:75,overall:75}, transcript:'Srikandi\u2019s advice, giving tips' },
  ];
  r.vocabMastered = ['wisdom','humble','advice','respect','honest','truth','clear','promise','rhythm','practice','patient','voice','curious','collect','meaning','phrase','courage','sacrifice','loyalty','protect','kingdom','hero','moral','brave','duty','honor','focus','discipline','steady','aim','confidence','stage','audience','posture','project','challenge','integrity','oath','genuine','principle','diplomacy','negotiate','compromise','tactful','craft','timing'];
  r.badges = ['clear-speaker','storyteller','disciplined'];
  return r;
}
function offsetDay(n){ const d=new Date(); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); }

let state = load();
function load(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    if(raw){ const s = JSON.parse(raw); if(s && s.version===1) return s; }
  }catch(e){ console.warn('State load failed, resetting.', e); }
  return defaultState();
}
function save(){ try{ localStorage.setItem(LS_KEY, JSON.stringify(state)); }catch(e){ console.warn('Save failed', e); } }
function resetAll(){ localStorage.removeItem(LS_KEY); state = defaultState(); save(); location.reload(); }

const me = () => state.users.find(u=>u.email===state.session) || null;
const rec = () => { const u=me(); if(!u) return null; if(!u.record) u.record=newStudentRecord(); return u.record; };

/* ============================ AUTH ============================ */
function login(email, password, requireAdmin=false){
  const u = state.users.find(u=>u.email.toLowerCase()===email.toLowerCase().trim() && u.password===password);
  if(!u) return { ok:false, msg:'Account not found or wrong password.' };
  if(requireAdmin && u.role!=='Admin') return { ok:false, msg:'That account is not an administrator.' };
  state.session = u.email;
  if(u.role==='Student') touchStreak();
  logActivity(`${u.name} signed in`);
  save();
  return { ok:true };
}
function register({name,email,password,role,cefr}){
  if(!name||!email||!password) return { ok:false, msg:'Please fill in every field.' };
  if(state.users.some(u=>u.email.toLowerCase()===email.toLowerCase())) return { ok:false, msg:'That email is already registered.' };
  const u = { name, email, password, role:role||'Student', cefr:cefr||'A1', institution:'', photo:'', bio:'' };
  if(u.role==='Student') u.record = newStudentRecord();
  state.users.push(u);
  state.session = u.email;
  if(u.role==='Student') touchStreak();
  logActivity(`${name} joined as ${u.role}`);
  save();
  return { ok:true };
}
function logout(){ state.session=null; save(); App.go('auth'); }

/* ===================== GAMIFICATION ===================== */
function touchStreak(){
  const r = rec(); if(!r) return;
  const today = new Date().toISOString().slice(0,10);
  if(r.lastActive===today) return;
  const yest = offsetDay(-1);
  r.streak = (r.lastActive===yest) ? r.streak+1 : 1;
  r.lastActive = today;
}
function addXP(n, why){
  const r = rec(); if(!r) return;
  const before = levelFor(r.xp);
  r.xp += n;
  const after = levelFor(r.xp);
  toast(`+${n} XP${why? ' \u2014 '+why : ''}`);
  if(after.level!==before.level) setTimeout(()=>toast(`\u2728 Level up! You reached ${after.level} \u2014 ${after.name}`), 900);
  checkBadges();
  save();
}
function levelFor(xp){
  let cur = WLN.PATH[0];
  for(const p of WLN.PATH) if(xp>=p.xp) cur=p;
  return cur;
}
function nextLevel(xp){
  for(const p of WLN.PATH) if(xp<p.xp) return p;
  return null;
}
function checkBadges(){
  const r = rec(); if(!r) return;
  WLN.BADGES.forEach(b=>{
    if(!r.badges.includes(b.id) && b.test(r)){
      r.badges.push(b.id);
      setTimeout(()=>toast(`${b.icon} Badge earned: ${b.name}`), 400);
    }
  });
}
function bumpSkill(name, points){
  const r = rec(); if(!r) return;
  r.skills[name] = Math.min(100, Math.round((r.skills[name]||0)*0.8 + points*0.2 + 2));
}
function logActivity(text){
  state.activity.unshift({ text, date:new Date().toISOString() });
  state.activity = state.activity.slice(0,80);
}

/* ===================== SPEECH ENGINE ===================== */
const Speech = {
  speak(text, { rate=0.95 }={}){
    try{
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang='en-US'; u.rate=rate;
      const v = speechSynthesis.getVoices().find(v=>/en[-_](US|GB)/i.test(v.lang));
      if(v) u.voice=v;
      speechSynthesis.speak(u);
    }catch(e){ toast('Text-to-speech is not available in this browser.'); }
  },
  stop(){ try{ speechSynthesis.cancel(); }catch(e){} },

  recAvailable(){ return !!(window.SpeechRecognition || window.webkitSpeechRecognition); },

  _rec:null, _t0:0,
  startRecognition({ onPartial, onEnd, onError }){
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR){ onError?.('unsupported'); return false; }
    const r = new SR();
    r.lang='en-US'; r.continuous=true; r.interimResults=true;
    let finalText='';
    r.onresult = e=>{
      let interim='';
      for(let i=e.resultIndex;i<e.results.length;i++){
        const t=e.results[i][0].transcript;
        if(e.results[i].isFinal) finalText+=t+' '; else interim+=t;
      }
      onPartial?.(finalText+interim);
    };
    r.onerror = e=>{ onError?.(e.error); };
    r.onend = ()=>{ onEnd?.(finalText.trim(), (Date.now()-this._t0)/1000); };
    this._rec=r; this._t0=Date.now();
    try{ r.start(); return true; }catch(e){ onError?.('start-failed'); return false; }
  },
  stopRecognition(){ try{ this._rec?.stop(); }catch(e){} },

  /* score a transcript against the speaking task */
  scoreSpeaking(transcript, keywords, seconds){
    const words = transcript.toLowerCase().split(/[^a-z']+/).filter(Boolean);
    const n = words.length;
    if(n===0) return null;
    const uniq = new Set(words);
    const kwHit = keywords.filter(k=>uniq.has(k.toLowerCase())).length;
    const wpm = seconds>2 ? n/(seconds/60) : 0;
    const fillers = words.filter(w=>['um','uh','er','like','eh','mmm'].includes(w)).length;

    // Fluency: ideal pace 90-150 wpm, penalised by fillers
    let fluency = wpm<=0?40 : wpm<60? 45+wpm/3 : wpm<=150? 70+ (1-Math.abs(wpm-115)/60)*28 : Math.max(55, 98-(wpm-150)/2);
    fluency = Math.max(25, Math.min(98, fluency - fillers*4));
    // Vocabulary: keyword usage + lexical variety
    const variety = uniq.size/Math.max(1,n);
    let vocab = Math.min(98, 40 + kwHit*9 + variety*45);
    // Length/development
    let develop = Math.min(98, 30 + Math.min(n,120)*0.55);
    // Pronunciation proxy: recognition confidence correlates with clarity; we use recognised-word density vs time
    let pron = Math.min(96, 50 + Math.min(wpm,140)*0.25 + kwHit*3 - fillers*3);
    pron = Math.max(30, pron);

    const overall = Math.round(pron*.3 + fluency*.3 + vocab*.2 + develop*.2);
    return {
      pron: Math.round(pron), fluency: Math.round(fluency),
      vocab: Math.round(vocab), develop: Math.round(develop),
      overall, wpm: Math.round(wpm), wordCount:n, kwHit, fillers,
    };
  },
};

/* ===================== AI MENTOR ENGINE =====================
   Local heuristic engine (no key needed) + optional live API. */
const Mentor = {
  /* ---- lightweight grammar/style analysis ---- */
  analyse(text){
    const issues=[], strengths=[];
    const sentences = text.split(/(?<=[.!?])\s+/).filter(s=>s.trim());
    const words = text.toLowerCase().split(/[^a-z']+/).filter(Boolean);
    const uniq = new Set(words);

    // capitalisation of standalone "i"
    if(/\bi\b/.test(text) && !/\bI\b/.test(text.replace(/\bi\b/g,'X'))){}
    if(/(^|[.!?]\s+)[a-z]/.test(text)) issues.push(['Capitalisation','Begin each sentence with a capital letter.']);
    if(/\bi\b/.test(text)) issues.push(['Capitalisation','Write the pronoun \u201cI\u201d with a capital letter.']);
    // a/an
    const anErr = text.match(/\ba\s+[aeiou]\w*/i); if(anErr) issues.push(['Articles',`Use \u201can\u201d before a vowel sound: \u201can ${anErr[0].split(/\s+/)[1]}\u201d.`]);
    const aErr = text.match(/\ban\s+[^aeiou\s]\w*/i); if(aErr) issues.push(['Articles',`Use \u201ca\u201d before a consonant sound: \u201ca ${aErr[0].split(/\s+/)[1]}\u201d.`]);
    // double words
    const dbl = text.match(/\b(\w+)\s+\1\b/i); if(dbl) issues.push(['Repetition',`The word \u201c${dbl[1]}\u201d is repeated \u2014 remove one.`]);
    // common SVA patterns
    if(/\b(he|she|it)\s+(go|do|have|want|need|like|make|take|say)\b/i.test(text))
      issues.push(['Subject\u2013verb agreement','After he/she/it, add \u2011s/\u2011es to the present verb (he goes, she has).']);
    if(/\b(don't|do not)\s+(he|she|it)\b/i.test(text) || /\b(he|she|it)\s+don't\b/i.test(text))
      issues.push(['Subject\u2013verb agreement','Use \u201cdoesn\u2019t\u201d with he/she/it.']);
    // run-on / very long sentence
    const long = sentences.find(s=>s.split(/\s+/).length>32);
    if(long) issues.push(['Sentence length','One sentence is very long \u2014 split it into two for clarity.']);
    // informal fillers in writing
    if(/\b(gonna|wanna|gotta|kinda)\b/i.test(text)) issues.push(['Register','Replace informal forms (gonna \u2192 going to) in academic writing.']);
    // weak intensifier
    if(/\bvery\s+(good|bad|big|small|important|nice)\b/i.test(text)) issues.push(['Word choice','Upgrade \u201cvery + adjective\u201d: very good \u2192 excellent; very important \u2192 essential.']);

    // strengths
    if(sentences.length>=3) strengths.push('Your ideas are developed across several sentences \u2014 good organisation.');
    if(uniq.size/Math.max(1,words.length) > .62 && words.length>20) strengths.push('Strong lexical variety \u2014 you avoid repeating the same words.');
    if(/\b(because|therefore|however|although|moreover|for example)\b/i.test(text)) strengths.push('Good use of linking words to connect ideas.');
    if(/\b(wayang|dalang|gamelan|nusantara|semar|arjuna|srikandi|bima|gatotkaca|kresna)\b/i.test(text)) strengths.push('You connect language to cultural identity \u2014 exactly the spirit of this course.');
    if(!strengths.length) strengths.push('Your message is understandable and on topic \u2014 a solid foundation to refine.');

    return { issues, strengths, sentences, wordCount: words.length };
  },

  improve(text){
    return text
      .replace(/(^|[.!?]\s+)([a-z])/g, (m,p,c)=>p+c.toUpperCase())
      .replace(/\bi\b/g,'I')
      .replace(/\bvery good\b/gi,'excellent')
      .replace(/\bvery important\b/gi,'essential')
      .replace(/\bvery big\b/gi,'enormous')
      .replace(/\bgonna\b/gi,'going to').replace(/\bwanna\b/gi,'want to')
      .replace(/\b(\w+)\s+\1\b/gi,'$1')
      .replace(/\ba\s+([aeiou])/gi,'an $1');
  },

  /* persona-shaped reply (local) */
  reply(mentor, text, lessonVocab=[]){
    const a = this.analyse(text);
    const fixed = this.improve(text);
    const vocabSuggest = lessonVocab.filter(v=>!text.toLowerCase().includes(v)).slice(0,3);
    const lines = [];
    const persona = {
      semar:  ()=>{ lines.push(`I hear the heart of your message, and it is strong.`);
                    lines.push(`\u2726 Strength: ${a.strengths[0]}`);
                    if(a.issues[0]) lines.push(`\u2726 Gentle guidance \u2014 ${a.issues[0][0]}: ${a.issues[0][1]}`);
                    lines.push(`\u2726 Reflect: which single sentence carries your main idea? Begin with that one.`); },
      gareng: ()=>{ lines.push(`I checked every sentence. Report from the Grammar Guardian:`);
                    if(a.issues.length) a.issues.slice(0,3).forEach(i=>lines.push(`\u2716 ${i[0]}: ${i[1]}`));
                    else lines.push(`\u2714 No major grammar errors found \u2014 well guarded!`);
                    if(fixed!==text) lines.push(`\u270E Corrected version:\n\u201c${fixed}\u201d`); },
      petruk: ()=>{ const hard = (text.match(/\b\w{3,}\b/g)||[]).filter(w=>/th|rhythm|world|three|culture|strength/i.test(w)).slice(0,3);
                    lines.push(`Let\u2019s give your words rhythm. Read your text aloud three times, slower each time.`);
                    if(hard.length) lines.push(`\u266A Practice these sounds: ${hard.map(w=>`\u201c${w}\u201d`).join(', ')} \u2014 stress the first syllable and finish the final consonant.`);
                    lines.push(`\u266A Tip: pause at every comma; let your intonation rise on questions and fall at full stops.`);
                    lines.push(`Use the Listen button to hear the model, then record yourself in the Shadow Theatre.`); },
      bagong: ()=>{ lines.push(`Word treasure time!`);
                    if(vocabSuggest.length) lines.push(`\u25C6 Try weaving in: ${vocabSuggest.map(v=>`\u201c${v}\u201d`).join(', ')} \u2014 they belong to this lakon.`);
                    lines.push(`\u25C6 Collocation gift: \u201cmake a decision\u201d, \u201ctake responsibility\u201d, \u201ckeep a promise\u201d.`);
                    if(/\bgood\b/i.test(text)) lines.push(`\u25C6 Upgrade \u201cgood\u201d \u2192 valuable, effective, admirable \u2014 pick the one that fits your meaning.`);
                    else lines.push(`\u25C6 Your word choice is already growing \u2014 ${a.strengths[0]}`); },
      dalang: ()=>{ lines.push(`From behind the screen, here is my judgement of your performance:`);
                    lines.push(`\u2605 Story: ${a.sentences.length>=3?'your narrative has shape \u2014 a beginning, a middle, a turn.':'give your idea a shape: situation \u2192 conflict \u2192 lesson.'}`);
                    lines.push(`\u2605 Audience: speak your final sentence as if the whole pendopo is listening.`);
                    if(a.issues[0]) lines.push(`\u2605 Polish before the next show \u2014 ${a.issues[0][1]}`);
                    lines.push(`The stage will be lit again tomorrow. Bring this text to the Shadow Speaking Theatre.`); },
    };
    (persona[mentor.id] || persona.semar)();
    return lines.join('\n\n');
  },

  /* optional live AI via user-supplied Anthropic API key */
  async liveReply(mentor, history, text, lesson){
    const sys = `You are ${mentor.name}, the ${mentor.role} in Wayang Lingua Nusantara, an Indonesian wayang-themed English learning app. Persona: ${mentor.style}. Focus only on: ${mentor.focus}. The learner is studying the lakon "${lesson?.title||'general English'}". Give concise, encouraging EFL feedback (max 130 words): one strength, one or two concrete corrections with examples, one next step. Stay in character with light wayang flavour. Never mock the learner.`;
    const messages = history.slice(-6).map(m=>({role:m.role==='ai'?'assistant':'user', content:m.text}));
    messages.push({role:'user', content:text});
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'x-api-key': state.apiKey,
        'anthropic-version':'2023-06-01',
        'anthropic-dangerous-direct-browser-access':'true',
      },
      body: JSON.stringify({ model:'claude-sonnet-4-6', max_tokens:400, system:sys, messages }),
    });
    if(!res.ok) throw new Error('API '+res.status);
    const data = await res.json();
    return (data.content||[]).map(c=>c.text||'').join('\n').trim();
  },
};

/* ===================== PORTRAITS =====================
   Generated wayang-style SVG portraits, deterministic per character. */
function portrait(ch){
  /* Distinctive wayang puppet SVG for each character */
  const G = { /* gradient IDs are unique per character */
    bg:(id,c1,c2)=>`<defs><radialGradient id="pg${id}" cx="50%" cy="38%" r="70%"><stop offset="0%" stop-color="${c1}" stop-opacity=".28"/><stop offset="100%" stop-color="#060c18"/></radialGradient></defs><rect width="120" height="120" rx="0" fill="url(#pg${id})"/>`,
    base:'<rect width="120" height="120" fill="#070e1e"/>',
  };

  const svgs = {
    /* ── PANAKAWAN (servant clowns) ── */
    semar:`<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Semar portrait">
      ${G.base}${G.bg('sem','#f3cf63','#9a7415')}
      <!-- Semar: round jovial guardian, no headdress, large belly -->
      <ellipse cx="60" cy="88" rx="28" ry="22" fill="#c8932a" opacity=".9"/>
      <ellipse cx="60" cy="88" rx="22" ry="16" fill="#d7a928"/>
      <circle cx="60" cy="52" r="24" fill="#e8c97a"/>
      <circle cx="60" cy="52" r="22" fill="#d4a850"/>
      <!-- face shading -->
      <ellipse cx="60" cy="56" rx="18" ry="14" fill="#e8c97a" opacity=".8"/>
      <!-- eyes closed happy -->
      <path d="M49 50 q4-4 8 0" stroke="#2a1c08" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M63 50 q4-4 8 0" stroke="#2a1c08" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <!-- big smile -->
      <path d="M46 60 q14 14 28 0" stroke="#2a1c08" stroke-width="2.8" fill="none" stroke-linecap="round"/>
      <!-- belly button / shirt detail -->
      <circle cx="60" cy="88" r="4" fill="#9a7415" opacity=".5"/>
      <!-- arms out wide -->
      <path d="M36 80 Q18 68 22 52" stroke="#c8932a" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M84 80 Q102 68 98 52" stroke="#c8932a" stroke-width="7" fill="none" stroke-linecap="round"/>
      <!-- gold aura -->
      <circle cx="60" cy="52" r="26" fill="none" stroke="#f3cf63" stroke-width="1" opacity=".4"/>
      <text x="60" y="116" text-anchor="middle" fill="#f3cf63" font-size="9" font-family="Cinzel,serif" opacity=".7">SEMAR</text>
    </svg>`,

    gareng:`<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Gareng portrait">
      ${G.base}${G.bg('gar','#d98f5a','#7a4a1c')}
      <!-- Gareng: angular features, distinctive eye, analytical pose -->
      <path d="M52 100 L48 72 L38 55 L45 32 L60 28 L75 32 L80 56 L70 72 L68 100 Z" fill="#c8721a" opacity=".9"/>
      <circle cx="60" cy="42" r="20" fill="#d98f5a"/>
      <!-- angular jaw -->
      <path d="M40 50 L38 64 L44 72 L60 76 L76 72 L82 64 L80 50" fill="#c8721a" opacity=".7"/>
      <!-- big angular nose -->
      <path d="M60 44 L68 58 L58 58" fill="#a05015" opacity=".8"/>
      <!-- one big eye, one small (Gareng's trait) -->
      <circle cx="50" cy="40" r="5" fill="#1a0c04"/><circle cx="52" cy="39" r="2" fill="#fff" opacity=".4"/>
      <circle cx="70" cy="41" r="3" fill="#1a0c04"/><circle cx="71" cy="40" r="1" fill="#fff" opacity=".4"/>
      <!-- angular eyebrows -->
      <path d="M44 34 L56 37" stroke="#2a1c08" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M65 36 L76 34" stroke="#2a1c08" stroke-width="2.5" stroke-linecap="round"/>
      <!-- small determined mouth -->
      <path d="M52 64 L60 62 L68 64" stroke="#2a1c08" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- headdress/hat -->
      <path d="M40 32 Q60 14 80 32" fill="#7a4a1c" opacity=".9"/>
      <path d="M44 28 Q60 8 76 28" fill="#9a6020" opacity=".7"/>
      <text x="60" y="116" text-anchor="middle" fill="#f3cf63" font-size="9" font-family="Cinzel,serif" opacity=".7">GARENG</text>
    </svg>`,

    petruk:`<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Petruk portrait">
      ${G.base}${G.bg('pet','#c9b16a','#6b5320')}
      <!-- Petruk: VERY long nose, tall thin body, playful -->
      <rect x="50" y="72" width="20" height="36" rx="4" fill="#b89448" opacity=".9"/>
      <ellipse cx="60" cy="68" rx="14" ry="26" fill="#c9b16a"/>
      <!-- head oval -->
      <ellipse cx="60" cy="40" rx="18" ry="20" fill="#c9b16a"/>
      <!-- THE LONG NOSE — Petruk's signature feature -->
      <path d="M68 42 Q88 44 104 40 Q100 50 80 52 Q72 52 68 48 Z" fill="#a07828" opacity=".95"/>
      <!-- eyes -->
      <circle cx="52" cy="37" r="4" fill="#1a0c04"/>
      <circle cx="53" cy="36" r="1.5" fill="#fff" opacity=".5"/>
      <circle cx="66" cy="38" r="3" fill="#1a0c04"/>
      <!-- curved eyebrows -->
      <path d="M47 31 Q52 28 57 31" stroke="#5a3a10" stroke-width="2" fill="none"/>
      <path d="M63 32 Q67 30 71 32" stroke="#5a3a10" stroke-width="2" fill="none"/>
      <!-- big happy grin -->
      <path d="M48 52 Q60 62 72 52" stroke="#2a1c08" stroke-width="2.5" fill="rgba(180,80,0,.2)" stroke-linecap="round"/>
      <!-- topknot headdress -->
      <ellipse cx="60" cy="22" rx="10" ry="8" fill="#8a6828"/>
      <circle cx="60" cy="14" r="6" fill="#c9b16a"/>
      <circle cx="60" cy="8" r="3" fill="#f3cf63"/>
      <!-- arms -->
      <path d="M46 78 Q28 82 24 96" stroke="#c9b16a" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M74 78 Q92 82 96 96" stroke="#c9b16a" stroke-width="5" fill="none" stroke-linecap="round"/>
      <text x="60" y="116" text-anchor="middle" fill="#f3cf63" font-size="9" font-family="Cinzel,serif" opacity=".7">PETRUK</text>
    </svg>`,

    bagong:`<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bagong portrait">
      ${G.base}${G.bg('bag','#e0a85c','#8a5a18')}
      <!-- Bagong: very round/chubby, bulging eyes, big mouth -->
      <!-- fat round body -->
      <ellipse cx="60" cy="88" rx="34" ry="24" fill="#c88020"/>
      <ellipse cx="60" cy="84" rx="30" ry="20" fill="#d99030"/>
      <!-- round head - VERY round -->
      <circle cx="60" cy="50" r="28" fill="#e0a85c"/>
      <circle cx="60" cy="52" r="24" fill="#d4903a"/>
      <!-- face -->
      <ellipse cx="60" cy="54" rx="20" ry="16" fill="#e8b060" opacity=".7"/>
      <!-- BIG bulging eyes - Bagong's trait -->
      <ellipse cx="48" cy="46" rx="8" ry="9" fill="#1a0c04"/>
      <ellipse cx="50" cy="44" rx="3" ry="3.5" fill="#fff" opacity=".5"/>
      <ellipse cx="72" cy="46" rx="8" ry="9" fill="#1a0c04"/>
      <ellipse cx="74" cy="44" rx="3" ry="3.5" fill="#fff" opacity=".5"/>
      <!-- wide flat nose -->
      <ellipse cx="60" cy="56" rx="7" ry="5" fill="#a06020" opacity=".6"/>
      <!-- BIG grinning mouth -->
      <path d="M42 64 Q60 76 78 64" fill="#8a3010" opacity=".85"/>
      <path d="M44 64 Q60 74 76 64" fill="#c04020" opacity=".6"/>
      <!-- teeth -->
      <rect x="50" y="64" width="6" height="5" rx="1" fill="#fff" opacity=".7"/>
      <rect x="58" y="64" width="6" height="5" rx="1" fill="#fff" opacity=".7"/>
      <text x="60" y="116" text-anchor="middle" fill="#f3cf63" font-size="9" font-family="Cinzel,serif" opacity=".7">BAGONG</text>
    </svg>`,

    dalang:`<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Dalang AI portrait">
      ${G.base}${G.bg('dal','#f3cf63','#9a7415')}
      <!-- Dalang AI: frontal face, elaborate crown, master presence -->
      <!-- crown / elaborate headdress -->
      <path d="M28 42 L36 16 L44 28 L52 8 L60 24 L68 8 L76 28 L84 16 L92 42 Z" fill="#f3cf63"/>
      <path d="M32 42 L38 20 L46 30 L54 12 L60 26 L66 12 L74 30 L82 20 L88 42 Z" fill="#d7a928"/>
      <!-- crown jewels -->
      <circle cx="60" cy="16" r="5" fill="#f3cf63" stroke="#9a7415" stroke-width="1"/>
      <circle cx="44" cy="22" r="3" fill="#e8c97a"/>
      <circle cx="76" cy="22" r="3" fill="#e8c97a"/>
      <!-- face oval -->
      <ellipse cx="60" cy="62" rx="22" ry="26" fill="#d4903a"/>
      <ellipse cx="60" cy="64" rx="18" ry="20" fill="#d9a050"/>
      <!-- wise eyes -->
      <ellipse cx="50" cy="58" rx="5" ry="4" fill="#1a0c04"/>
      <ellipse cx="51" cy="57" rx="2" ry="1.5" fill="#fff" opacity=".5"/>
      <ellipse cx="70" cy="58" rx="5" ry="4" fill="#1a0c04"/>
      <ellipse cx="71" cy="57" rx="2" ry="1.5" fill="#fff" opacity=".5"/>
      <!-- strong brows -->
      <path d="M43 52 Q50 48 57 52" stroke="#5a3a10" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M63 52 Q70 48 77 52" stroke="#5a3a10" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- prominent nose -->
      <path d="M57 60 L55 72 L60 76 L65 72 L63 60" fill="#a07020" opacity=".7"/>
      <!-- commanding mouth -->
      <path d="M50 78 Q60 84 70 78" stroke="#2a1c08" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <!-- beard -->
      <path d="M45 80 Q50 95 60 98 Q70 95 75 80" fill="#9a7010" opacity=".6"/>
      <!-- robe/collar -->
      <path d="M30 88 Q40 80 60 84 Q80 80 90 88 L96 110 L24 110 Z" fill="#7a5010" opacity=".8"/>
      <!-- gold trim -->
      <path d="M30 88 Q60 78 90 88" stroke="#f3cf63" stroke-width="2" fill="none" opacity=".7"/>
      <text x="60" y="116" text-anchor="middle" fill="#f3cf63" font-size="8.5" font-family="Cinzel,serif" opacity=".7">DALANG AI</text>
    </svg>`,

    /* ── HEROES ── */
    arjuna:`<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Arjuna portrait">
      ${G.base}${G.bg('arj','#cfe0e8','#3d5a6b')}
      <!-- Arjuna: noble warrior, refined profile, headdress with point -->
      <!-- tall pointed headdress -->
      <path d="M55 6 L52 40 L68 40 L65 6 Z" fill="#5a8aaa"/>
      <path d="M58 6 L56 38 L64 38 L62 6 L60 2 Z" fill="#7aaac8"/>
      <ellipse cx="60" cy="40" rx="12" ry="6" fill="#4a7a9a"/>
      <!-- noble face in profile lean -->
      <ellipse cx="60" cy="60" rx="20" ry="22" fill="#cfe0e8"/>
      <ellipse cx="63" cy="62" rx="16" ry="18" fill="#b8ceda"/>
      <!-- refined sharp eyes -->
      <ellipse cx="55" cy="56" rx="4.5" ry="3.5" fill="#1a2a3a"/>
      <ellipse cx="56" cy="55" rx="1.5" ry="1.5" fill="#fff" opacity=".5"/>
      <ellipse cx="68" cy="56" rx="4.5" ry="3.5" fill="#1a2a3a"/>
      <ellipse cx="69" cy="55" rx="1.5" ry="1.5" fill="#fff" opacity=".5"/>
      <!-- sharp brows -->
      <path d="M50 50 L59 47" stroke="#2a3a4a" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M64 48 L73 51" stroke="#2a3a4a" stroke-width="2.5" stroke-linecap="round"/>
      <!-- long nose -->
      <path d="M60 60 L62 72" stroke="#8aaabb" stroke-width="3" stroke-linecap="round"/>
      <!-- calm mouth -->
      <path d="M54 76 Q61 80 68 76" stroke="#3a5a6a" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- warrior collar/armor -->
      <path d="M34 88 Q50 78 60 80 Q70 78 86 88 L90 108 L30 108 Z" fill="#3a5a7a" opacity=".85"/>
      <path d="M34 88 Q60 76 86 88" stroke="#7aaac8" stroke-width="2" fill="none"/>
      <!-- bow symbol -->
      <path d="M88 56 Q96 66 88 76" stroke="#f3cf63" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <line x1="88" y1="56" x2="88" y2="76" stroke="#f3cf63" stroke-width="1" stroke-dasharray="2"/>
      <text x="60" y="116" text-anchor="middle" fill="#7aaac8" font-size="9" font-family="Cinzel,serif" opacity=".7">ARJUNA</text>
    </svg>`,

    srikandi:`<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Srikandi portrait">
      ${G.base}${G.bg('sri','#e8a8b8','#8a3d55')}
      <!-- Srikandi: female warrior, elegant, bow & arrow motif -->
      <!-- elegant flower headdress -->
      <circle cx="60" cy="18" r="14" fill="#c87890" opacity=".8"/>
      <circle cx="60" cy="18" r="10" fill="#e8a8b8"/>
      <circle cx="60" cy="18" r="5" fill="#f3cf63"/>
      <!-- side flowers -->
      <circle cx="42" cy="30" r="8" fill="#c87890" opacity=".7"/>
      <circle cx="78" cy="30" r="8" fill="#c87890" opacity=".7"/>
      <!-- face — feminine, elegant -->
      <ellipse cx="60" cy="58" rx="18" ry="20" fill="#e8a8b8"/>
      <ellipse cx="60" cy="60" rx="15" ry="17" fill="#f0b8c4"/>
      <!-- almond eyes -->
      <path d="M48 54 Q55 50 62 54" fill="#1a0c10" stroke="none"/>
      <path d="M48 54 Q55 58 62 54" fill="#c87890" opacity=".5"/>
      <ellipse cx="55" cy="54" rx="3" ry="2" fill="#1a0c10"/>
      <path d="M66 54 Q72 50 78 54" fill="#1a0c10"/>
      <path d="M66 54 Q72 58 78 54" fill="#c87890" opacity=".5"/>
      <ellipse cx="72" cy="54" rx="3" ry="2" fill="#1a0c10"/>
      <!-- delicate brows -->
      <path d="M46 48 Q55 44 61 48" stroke="#6a2a3a" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M67 48 Q73 44 80 48" stroke="#6a2a3a" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- small nose -->
      <path d="M59 58 L58 66 L62 66 L61 58" fill="#c87890" opacity=".4"/>
      <!-- small graceful mouth -->
      <path d="M53 72 Q60 77 67 72" stroke="#8a3040" stroke-width="2.5" fill="rgba(200,100,120,.3)" stroke-linecap="round"/>
      <!-- warrior sash/armor -->
      <path d="M32 86 Q50 76 60 78 Q70 76 88 86 L92 108 L28 108 Z" fill="#8a3d55" opacity=".85"/>
      <path d="M32 86 Q60 74 88 86" stroke="#e8a8b8" stroke-width="1.5" fill="none"/>
      <!-- bow -->
      <path d="M90 50 Q98 62 90 74" stroke="#f3cf63" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <text x="60" y="116" text-anchor="middle" fill="#e8a8b8" font-size="9" font-family="Cinzel,serif" opacity=".7">SRIKANDI</text>
    </svg>`,

    bima:`<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bima portrait">
      ${G.base}${G.bg('bim','#a8c8a0','#3d6b45')}
      <!-- Bima: large powerful warrior, messy hair, strong features -->
      <!-- wild flowing hair -->
      <path d="M28 44 Q24 20 38 12 Q50 4 60 8 Q70 4 82 12 Q96 20 92 44" fill="#2a4a20" opacity=".9"/>
      <path d="M32 44 Q28 24 40 16 Q52 8 60 12 Q68 8 80 16 Q92 24 88 44" fill="#3d6b30" opacity=".8"/>
      <!-- large square jaw face -->
      <rect x="36" y="42" width="48" height="48" rx="8" fill="#a8c8a0"/>
      <ellipse cx="60" cy="66" rx="22" ry="24" fill="#a0c098"/>
      <!-- strong brow ridge -->
      <path d="M36 52 L84 52" stroke="#3d6b30" stroke-width="3" opacity=".5"/>
      <!-- fierce eyes -->
      <ellipse cx="48" cy="58" rx="6" ry="5" fill="#1a2a14"/>
      <ellipse cx="49" cy="57" rx="2" ry="2" fill="#fff" opacity=".4"/>
      <ellipse cx="72" cy="58" rx="6" ry="5" fill="#1a2a14"/>
      <ellipse cx="73" cy="57" rx="2" ry="2" fill="#fff" opacity=".4"/>
      <!-- heavy brows -->
      <path d="M40 50 Q48 46 56 50" stroke="#1a2a14" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M64 50 Q72 46 80 50" stroke="#1a2a14" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <!-- wide nose -->
      <ellipse cx="60" cy="68" rx="7" ry="5" fill="#7aaa70" opacity=".5"/>
      <!-- firm mouth -->
      <path d="M48 76 L72 76" stroke="#2a4a20" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <!-- massive shoulders/armor -->
      <path d="M18 92 Q30 80 60 82 Q90 80 102 92 L106 108 L14 108 Z" fill="#3d6b45" opacity=".9"/>
      <rect x="16" y="88" width="20" height="16" rx="4" fill="#2a5030" opacity=".8"/>
      <rect x="84" y="88" width="20" height="16" rx="4" fill="#2a5030" opacity=".8"/>
      <!-- Bima's distinctive nail weapon symbol -->
      <path d="M8 100 L20 88 L22 102 Z" fill="#f3cf63" opacity=".8"/>
      <text x="60" y="116" text-anchor="middle" fill="#a8c8a0" font-size="9" font-family="Cinzel,serif" opacity=".7">BIMA</text>
    </svg>`,

    gatotkaca:`<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Gatotkaca portrait">
      ${G.base}${G.bg('gat','#a8b8e8','#3d4a8a')}
      <!-- Gatotkaca: flying warrior, wings, armor, sky-blue tones -->
      <!-- wings spread -->
      <path d="M8 50 Q20 30 36 46" fill="#3d4a8a" opacity=".8"/>
      <path d="M8 50 Q22 40 36 46" fill="#5a6ab0" opacity=".6"/>
      <path d="M112 50 Q100 30 84 46" fill="#3d4a8a" opacity=".8"/>
      <path d="M112 50 Q98 40 84 46" fill="#5a6ab0" opacity=".6"/>
      <!-- armor body -->
      <ellipse cx="60" cy="82" rx="22" ry="20" fill="#3d4a8a"/>
      <ellipse cx="60" cy="80" rx="18" ry="16" fill="#5a6ab0"/>
      <!-- flying hero face -->
      <ellipse cx="60" cy="52" rx="20" ry="22" fill="#a8b8e8"/>
      <ellipse cx="60" cy="54" rx="17" ry="18" fill="#c0cef0"/>
      <!-- warrior helmet -->
      <path d="M40 46 Q50 28 60 26 Q70 28 80 46" fill="#3d4a8a"/>
      <path d="M44 44 Q52 30 60 28 Q68 30 76 44" fill="#5a6ab0"/>
      <path d="M52 26 Q60 12 68 26" fill="#a8b8e8" opacity=".8"/>
      <!-- fierce eyes -->
      <ellipse cx="50" cy="52" rx="5.5" ry="4" fill="#1a1a3a"/>
      <ellipse cx="51" cy="51" rx="2" ry="1.5" fill="#7aaae8" opacity=".6"/>
      <ellipse cx="70" cy="52" rx="5.5" ry="4" fill="#1a1a3a"/>
      <ellipse cx="71" cy="51" rx="2" ry="1.5" fill="#7aaae8" opacity=".6"/>
      <!-- brows -->
      <path d="M43 46 Q50 42 57 46" stroke="#1a1a3a" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M63 46 Q70 42 77 46" stroke="#1a1a3a" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- determined mouth -->
      <path d="M52 64 Q60 68 68 64" stroke="#2a2a5a" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- armor details -->
      <path d="M44 84 Q60 76 76 84" stroke="#a8b8e8" stroke-width="2" fill="none"/>
      <text x="60" y="116" text-anchor="middle" fill="#a8b8e8" font-size="8" font-family="Cinzel,serif" opacity=".7">GATOTKACA</text>
    </svg>`,

    kresna:`<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Kresna portrait">
      ${G.base}${G.bg('kre','#8ad0c8','#1d6b60')}
      <!-- Kresna: blue-skinned wise king, regal crown, beard -->
      <!-- elaborate royal crown -->
      <path d="M34 46 L40 20 L48 30 L56 12 L60 22 L64 12 L72 30 L80 20 L86 46 Z" fill="#f3cf63"/>
      <path d="M38 44 L43 22 L50 30 L57 14 L60 23 L63 14 L70 30 L77 22 L82 44 Z" fill="#d7a928"/>
      <!-- crown gems -->
      <circle cx="60" cy="16" r="5" fill="#1d6b60" stroke="#f3cf63" stroke-width="1.5"/>
      <circle cx="46" cy="24" r="3" fill="#8ad0c8"/>
      <circle cx="74" cy="24" r="3" fill="#8ad0c8"/>
      <!-- BLUE-SKINNED face — Kresna's trait -->
      <ellipse cx="60" cy="66" rx="22" ry="26" fill="#2a7a70"/>
      <ellipse cx="60" cy="68" rx="18" ry="21" fill="#3d9a8a"/>
      <!-- wise aged eyes -->
      <ellipse cx="50" cy="62" rx="5.5" ry="4" fill="#1a3a30"/>
      <ellipse cx="51" cy="61" rx="2" ry="1.5" fill="#8ad0c8" opacity=".5"/>
      <ellipse cx="70" cy="62" rx="5.5" ry="4" fill="#1a3a30"/>
      <ellipse cx="71" cy="61" rx="2" ry="1.5" fill="#8ad0c8" opacity=".5"/>
      <!-- wise brows -->
      <path d="M43 55 Q50 52 57 55" stroke="#1a3a30" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M63 55 Q70 52 77 55" stroke="#1a3a30" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <!-- dignified nose -->
      <path d="M58 66 L56 76 L60 80 L64 76 L62 66" fill="#1d6b60" opacity=".5"/>
      <!-- wise smile -->
      <path d="M50 82 Q60 88 70 82" stroke="#1a3a30" stroke-width="2.5" fill="rgba(50,150,130,.3)" stroke-linecap="round"/>
      <!-- beard -->
      <path d="M44 82 Q48 96 60 100 Q72 96 76 82" fill="#1a5a50" opacity=".7"/>
      <!-- royal robe -->
      <path d="M26 94 Q44 82 60 84 Q76 82 94 94 L98 110 L22 110 Z" fill="#1d6b60" opacity=".9"/>
      <path d="M26 94 Q60 80 94 94" stroke="#f3cf63" stroke-width="2" fill="none"/>
      <text x="60" y="116" text-anchor="middle" fill="#8ad0c8" font-size="9" font-family="Cinzel,serif" opacity=".7">KRESNA</text>
    </svg>`,
  };

  if(svgs[ch.id]) return svgs[ch.id];

  /* fallback generic */
  const [hi,lo] = ch.palette || ['#e8c97a','#9a7415'];
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(ch.name)} portrait">
    <rect width="120" height="120" fill="#070e1e"/>
    <circle cx="60" cy="52" r="24" fill="${hi}"/>
    <circle cx="60" cy="52" r="20" fill="${lo}" opacity=".5"/>
    <text x="60" y="116" text-anchor="middle" fill="${hi}" font-size="9" font-family="Cinzel,serif" opacity=".7">${esc(ch.name.toUpperCase())}</text>
  </svg>`;
}
/* generic dalang silhouette for the theatre stage */
function silhouetteSVG(){
  return `<svg class="silhouette" viewBox="0 0 130 150" aria-hidden="true">
    <path fill="#120c04" d="M64 8c8 0 13 6 13 13 0 5-2 8-5 11 9 2 15 8 17 17l8 34c1 5-2 8-6 8-3 0-5-2-6-5l-6-26-2 24 6 52c0 3-2 6-5 6h-7c-3 0-5-2-5-5l-3-44h-4l-3 44c0 3-2 5-5 5h-7c-3 0-5-3-5-6l6-52-2-24-6 26c-1 3-3 5-6 5-4 0-7-3-6-8l8-34c2-9 8-15 17-17-3-3-5-6-5-11 0-7 5-13 13-13z"/>
    <path fill="none" stroke="#d7a928" stroke-width="1.4" opacity=".8" d="M28 30 q-12 4 -14 18 M102 30 q12 4 14 18 M22 56 l-10 44 M108 56 l10 44"/>
  </svg>`;
}

/* ===================== SHARED UI ===================== */
function toast(msg){
  const d=document.createElement('div'); d.className='toast'; d.textContent=msg;
  $('#toastRoot').appendChild(d);
  setTimeout(()=>{ d.style.opacity='0'; d.style.transition='opacity .3s'; }, 2400);
  setTimeout(()=>d.remove(), 2800);
}
function modal(title, bodyHtml, { wide=false }={}){
  $('#modalRoot').innerHTML = `
    <div class="modalBack" data-close="1">
      <div class="modal" ${wide?'style="width:min(880px,100%)"':''} role="dialog" aria-modal="true" aria-label="${esc(title)}">
        <h2>${esc(title)}</h2>
        <div class="modalBody">${bodyHtml}</div>
        <div style="margin-top:16px;text-align:right"><button class="btn" data-close="1">Close</button></div>
      </div>
    </div>`;
  $$('#modalRoot [data-close]').forEach(el=>el.addEventListener('click', e=>{
    if(e.target.dataset.close) $('#modalRoot').innerHTML='';
  }));
}
function closeModal(){ $('#modalRoot').innerHTML=''; }

function download(name, text, type='text/plain'){
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([text],{type}));
  a.download=name; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href), 4000);
}
function timeAgo(iso){
  const s=(Date.now()-new Date(iso))/1000;
  if(s<60) return 'just now';
  if(s<3600) return Math.floor(s/60)+'m ago';
  if(s<86400) return Math.floor(s/3600)+'h ago';
  return Math.floor(s/86400)+'d ago';
}

/* icon set (inline SVG, stroke style) */
const Icons = {
  dashboard:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="5" rx="2"/><rect x="13" y="10" width="8" height="11" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/></svg>',
  classes:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19V6a2 2 0 0 1 2-2h13v15"/><path d="M4 19a2 2 0 0 0 2 2h13v-4H6a2 2 0 0 0-2 2z"/></svg>',
  students:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3.4"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 4.5a3.4 3.4 0 1 1 0 6.8M21 20c0-2.8-1.9-5.1-4.5-5.8"/></svg>',
  story:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 5c-2-1.5-5-2-8-1.5V19c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V3.5C17 3 14 3.5 12 5z"/><path d="M12 5v15.5"/></svg>',
  theatre:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3a8 8 0 0 1 8 8v9H4v-9a8 8 0 0 1 8-8z"/><circle cx="12" cy="11" r="2.6"/><path d="M12 13.6V20"/></svg>',
  mic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
  mentor:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7"/><path d="M9 8h6"/></svg>',
  progress:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/></svg>',
  badge:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2l8 3.5v6c0 5-3.5 8.5-8 10.5-4.5-2-8-5.5-8-10.5v-6L12 2z"/><path d="M9 11.5l2.2 2.2L15.5 9"/></svg>',
  assignment:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
  analytics:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 21h18M7 17V9M12 17V5M17 17v-6"/></svg>',
  passport:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="2.5" width="16" height="19" rx="2.5"/><circle cx="12" cy="10" r="3.4"/><path d="M8 16.5h8"/></svg>',
  room:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2.5" y="5" width="13" height="14" rx="2"/><path d="M15.5 10l6-3.5v11l-6-3.5"/></svg>',
  cert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="9" r="5.5"/><path d="M8.5 13.5L7 21l5-2.5L17 21l-1.5-7.5"/></svg>',
  settings:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3.2"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z"/></svg>',
  users:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="7.5" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/></svg>',
  builder:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="9"/></svg>',
  logout:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>',
  menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>',
  stopIc:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
  bell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  forum:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2v4l-4-4H9a2 2 0 0 1-2-2v-1"/><path d="M15 3H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2v4l4-4h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/></svg>',
  help:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  resource:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  community:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>',
};
