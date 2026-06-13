/* ============================================================
   Wayang Lingua Nusantara — views-student.js
   Student experience: Home, Story Library, Lesson Journey,
   Shadow Speaking Theatre, AI Mentors, Progress, Badges.
   ============================================================ */
window.Views = window.Views || {};

/* ---------- helpers ---------- */
function lessonState(id){
  const r = rec();
  if(!r.lessonProgress[id]) r.lessonProgress[id] = { steps:{}, score:0 };
  return r.lessonProgress[id];
}
function lessonPct(id){
  const ls = rec().lessonProgress[id]; if(!ls) return 0;
  return Math.round(Object.keys(ls.steps).length/5*100);
}
function currentMeeting(){
  const r = rec();
  for(const m of WLN.MEETINGS) if(lessonPct(m.id)<100) return m;
  return WLN.MEETINGS.at(-1);
}

/* ============================ HOME ============================ */
Views.home = function(el){
  const u = me(), r = rec();
  const m = currentMeeting();
  const lvl = levelFor(r.xp), nxt = nextLevel(r.xp);
  const pct = nxt ? Math.round((r.xp-lvl.xp)/(nxt.xp-lvl.xp)*100) : 100;
  const today = new Date();
  const focus = WLN.DAILY_FOCUS[today.getDay()];
  const focusDone = r.dailyDone.includes(today.toISOString().slice(0,10));
  const quote = WLN.QUOTES[today.getDate()%WLN.QUOTES.length];

  el.innerHTML = `
    <div class="missionCard">
      <span class="eyebrow">Today's Mission \u2022 ${m.level} Level</span>
      <h2>${esc(m.title)}</h2>
      <p class="sub" style="margin:0">${esc(m.scene.split('.')[0])}.</p>
      <div style="margin-top:10px"><button class="btn primary" data-go="lesson" data-id="${m.id}">${lessonPct(m.id)>0?'Continue Learning':'Begin the Lakon'}</button>
      <span class="chip dim" style="margin-left:10px">${lessonPct(m.id)}% complete</span></div>
    </div>

    <div class="grid2" style="margin-top:16px">
      <div class="panel">
        <h3 class="panelTitle">Skills Progress</h3>
        <div class="skillRow">
          ${['Listening','Speaking','Reading','Writing'].map(s=>`
            <div class="skillCell">
              <div class="lbl"><span>${s}</span><b>${r.skills[s]||0}%</b></div>
              <div class="bar"><i style="width:${r.skills[s]||0}%"></i></div>
            </div>`).join('')}
        </div>
        <hr class="divider">
        <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">
          <div class="streakBox" style="flex:1;min-width:150px">
            <span class="flame">\uD83D\uDD25</span>
            <div><b style="font-family:var(--font-display);font-size:20px;color:var(--gold-bright)">${r.streak} days</b><br><span class="small muted">Streak</span></div>
          </div>
          <div class="streakBox" style="flex:1;min-width:150px">
            <span style="font-size:24px">\uD83C\uDFC5</span>
            <div><b style="font-family:var(--font-display);font-size:20px;color:var(--gold-bright)">${r.badges.length}</b><br><span class="small muted">Badges earned</span></div>
          </div>
        </div>
      </div>

      <div class="panel ornate">
        <h3 class="panelTitle">Learning Path<span class="chip">${lvl.level} \u2022 ${lvl.name}</span></h3>
        <div class="pathRow">
          ${WLN.PATH.map(p=>`<div class="pathCell ${p.level===lvl.level?'now':r.xp>=p.xp?'done':''}"><b>${p.level}</b><span>${p.name}</span></div>`).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--cream-dim);margin:10px 0 5px">
          <span>XP ${r.xp.toLocaleString()}${nxt?' / '+nxt.xp.toLocaleString():''}</span><span>${nxt? 'Next: '+nxt.level : 'Mastery reached'}</span>
        </div>
        <div class="bar"><i style="width:${pct}%"></i></div>
        <hr class="divider">
        <div class="eyebrow" style="margin-bottom:8px">Daily Focus</div>
        <p style="margin:0 0 12px;font-size:14px">${esc(focus)}</p>
        ${focusDone
          ? `<span class="chip teal">\u2713 Completed today</span>`
          : `<button class="btn small primary" id="doFocus">Claim Reward (+40 XP)</button>`}
      </div>
    </div>

    <div class="panel" style="margin-top:16px;text-align:center">
      <p class="sub" style="font-size:19px;margin:4px 0">\u201C${esc(quote[0])}\u201D</p>
      ${quote[1]?`<p class="small muted" style="margin:0">${esc(quote[1])}</p>`:''}
    </div>`;

  $('#doFocus')?.addEventListener('click', ()=>{
    rec().dailyDone.push(new Date().toISOString().slice(0,10));
    addXP(40,'Daily focus completed'); save(); App.refresh();
  });
};

/* ======================== STORY LIBRARY ======================== */
Views.stories = function(el){
  el.innerHTML = `
    <p class="sub" style="margin:0 0 16px">Sixteen lakon \u2014 graded stories from A1 to C2. Each one is a complete learning journey.</p>
    ${WLN.MEETINGS.map(m=>{
      const pct = lessonPct(m.id);
      return `<div class="storyCard" data-go="lesson" data-id="${m.id}">
        <div class="num">${m.id}</div>
        <div style="flex:1;min-width:0">
          <b style="display:block;font-size:14.5px">${esc(m.title)}</b>
          <span class="small muted">${esc(m.value)} \u2022 Mentor: ${esc((WLN.MENTORS.find(x=>x.id===m.mentor)||{}).name)}</span>
          <div class="bar" style="margin-top:8px;max-width:340px"><i style="width:${pct}%"></i></div>
        </div>
        <span class="cefr">${m.level}</span>
        <span class="chip dim">${pct}%</span>
      </div>`;
    }).join('')}`;
};

/* ========================= LESSON JOURNEY ========================= */
const JOURNEY = [
  ['explore','Explore'],['listen','Listen & Read'],['speak','Speak & Perform'],
  ['write','Write & Reflect'],['feedback','AI Feedback'],['achieve','Achieve'],
];
let _lessonStep = 'explore';

Views.lesson = function(el, id){
  const m = WLN.MEETINGS.find(x=>x.id==id) || WLN.MEETINGS[0];
  App.ctx.lessonId = m.id;
  const ls = lessonState(m.id);
  const stepIdx = JOURNEY.findIndex(j=>j[0]===_lessonStep);

  el.innerHTML = `
    <div class="panel ornate" style="margin-bottom:16px">
      <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">
        <span class="cefr">${m.level}</span>
        <div style="flex:1;min-width:200px">
          <h2 style="font-size:20px">${esc(m.title)}</h2>
          <span class="sub">${esc(m.value)} \u2014 a lakon of the Nusantara stage</span>
        </div>
        <button class="btn small" data-go="stories">\u2190 Story Library</button>
      </div>
      <hr class="divider">
      <div class="journey">
        ${JOURNEY.map(([k,lbl],i)=>{
          const done = k==='explore'? true : !!ls.steps[stepKeyFor(k)];
          const cls = k===_lessonStep ? 'now' : (done && i<stepIdx ? 'done':'') ;
          return `<div class="jStep ${cls}" data-jstep="${k}" style="cursor:pointer"><span>${lbl}</span></div>`;
        }).join('')}
      </div>
    </div>
    <div id="lessonBody"></div>`;

  $$('[data-jstep]').forEach(b=>b.addEventListener('click',()=>{ _lessonStep=b.dataset.jstep; Views.lesson(el,m.id); }));
  renderLessonStep(m, ls);
};

function stepKeyFor(k){ return {explore:'explore',listen:'listen',speak:'speak',write:'write',feedback:'feedback',achieve:'achieve'}[k]; }
function markStep(m, key, xp, why){
  const ls = lessonState(m.id);
  if(!ls.steps[key]){
    ls.steps[key]=1;
    if(['listen','speak','write','feedback'].every(k=>ls.steps[k]) && !ls.steps._counted){
      ls.steps._counted=1; rec().lessonsDone++;
    }
    addXP(xp, why);
  }
  save();
}

function renderLessonStep(m, ls){
  const body = $('#lessonBody');
  const mentor = WLN.MENTORS.find(x=>x.id===m.mentor);

  /* ---- EXPLORE ---- */
  if(_lessonStep==='explore'){
    body.innerHTML = `
      <div class="grid2">
        <div class="panel">
          <h3 class="panelTitle">The Story</h3>
          <p style="line-height:1.7">${esc(m.scene)}</p>
          <div class="eyebrow" style="margin:14px 0 8px">Learning Outcomes</div>
          ${m.outcomes.map(o=>`<div class="feedItem"><span style="color:var(--gold)">\u25C8</span> ${esc(o)}</div>`).join('')}
        </div>
        <div class="panel">
          <h3 class="panelTitle">Key Vocabulary</h3>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px">
            ${m.vocab.map(v=>`<button class="chip vocabChip" data-w="${esc(v)}">${esc(v)}</button>`).join('')}
          </div>
          <p class="small muted">Tap a word to hear it. Master words by using them in your speaking and writing.</p>
          <hr class="divider">
          <div style="display:flex;gap:12px;align-items:center">
            <div class="portraitWrap" style="width:60px;height:60px">${portrait(mentor)}</div>
            <div><b>${mentor.name}</b> guides this lakon<br><span class="small muted">${esc(mentor.role)} \u2014 ${esc(mentor.focus)}</span></div>
          </div>
          <button class="btn primary" style="margin-top:16px" id="toListen">Begin: Listen & Read \u2192</button>
        </div>
      </div>`;
    $$('.vocabChip').forEach(b=>b.addEventListener('click',()=>Speech.speak(b.dataset.w,{rate:.85})));
    $('#toListen').addEventListener('click',()=>{ _lessonStep='listen'; Views.lesson($('#viewRoot'), m.id); });
    return;
  }

  /* ---- LISTEN & READ ---- */
  if(_lessonStep==='listen'){
    body.innerHTML = `
      <div class="grid2">
        <div class="panel ornate">
          <h3 class="panelTitle">Gamelan Listening Chamber</h3>
          <p style="line-height:1.7" class="muted">${esc(m.listening.script)}</p>
          <div style="display:flex;gap:9px;margin:12px 0">
            <button class="btn primary" id="playScript">${Icons.play} Listen to the Dalang</button>
            <button class="btn" id="stopScript">${Icons.stopIc} Stop</button>
          </div>
          <p class="small"><b>Task:</b> ${esc(m.listening.task)}</p>
          <hr class="divider">
          <h3 class="panelTitle">Lakon Reading Quest</h3>
          <p style="line-height:1.75">${esc(m.reading.text)}</p>
        </div>
        <div class="panel">
          <h3 class="panelTitle">Comprehension Check</h3>
          <div id="quizBox"></div>
        </div>
      </div>`;
    $('#playScript').addEventListener('click',()=>Speech.speak(m.listening.script));
    $('#stopScript').addEventListener('click',()=>Speech.stop());
    renderQuiz([...m.listening.questions, ...m.reading.questions], score=>{
      markStep(m,'listen',60,'Listening & reading completed');
      bumpSkill('Listening',score); bumpSkill('Reading',score);
      rec().quizzes.push({date:new Date().toISOString(), meetingId:m.id, kind:'comprehension', score});
      save();
      $('#quizBox').insertAdjacentHTML('beforeend',
        `<div class="fbBlock" style="border-color:var(--gold)"><span class="fbTag">Result</span>You scored <b class="gold">${score}%</b>. ${score>=70?'Excellent comprehension \u2014 the dalang nods with approval.':'Review the passage once more, then continue \u2014 understanding grows with each retelling.'}<br><br><button class="btn primary small" id="toSpeak">Continue: Speak & Perform \u2192</button></div>`);
      $('#toSpeak').addEventListener('click',()=>{ _lessonStep='speak'; Views.lesson($('#viewRoot'), m.id); });
    });
    return;
  }

  /* ---- SPEAK & PERFORM ---- */
  if(_lessonStep==='speak'){
    body.innerHTML = `<div id="theatreMount"></div>`;
    renderTheatre($('#theatreMount'), m, res=>{
      markStep(m,'speak',80,'Performance recorded');
      if(res){ bumpSkill('Speaking',res.overall); const r=rec(); r.speakBest=Math.max(r.speakBest,res.overall); }
      save();
    });
    return;
  }

  /* ---- WRITE & REFLECT ---- */
  if(_lessonStep==='write'){
    const saved = rec().writings.findLast(w=>w.meetingId===m.id);
    body.innerHTML = `
      <div class="grid2">
        <div class="panel ornate">
          <h3 class="panelTitle">Wayang Writing Studio</h3>
          <p class="muted" style="line-height:1.6">${esc(m.writing.prompt)}</p>
          <textarea class="input" id="writeBox" style="min-height:220px" placeholder="Write your reflection here...">${esc(saved?.text||'')}</textarea>
          <div style="display:flex;gap:9px;align-items:center;flex-wrap:wrap">
            <button class="btn primary" id="submitWrite">Submit for AI Review</button>
            <span class="small muted" id="wordCount"></span>
          </div>
        </div>
        <div class="panel">
          <h3 class="panelTitle">Writing Rubric</h3>
          ${m.writing.rubric.map(rb=>`<div class="feedItem"><span style="color:var(--gold)">\u25C8</span>${esc(rb)}</div>`).join('')}
          <hr class="divider">
          <div id="writeFeedback"><p class="small muted">Submit your text and ${esc(WLN.MENTORS.find(x=>x.id===m.mentor).name)} will review it against the rubric.</p></div>
        </div>
      </div>`;
    const box=$('#writeBox'), wc=$('#wordCount');
    const count=()=>{ wc.textContent=(box.value.trim().split(/\s+/).filter(Boolean).length)+' words'; };
    box.addEventListener('input',count); count();
    $('#submitWrite').addEventListener('click',async()=>{
      const text=box.value.trim();
      if(text.split(/\s+/).length<30){ toast('Write at least 30 words for a meaningful review.'); return; }
      const a = Mentor.analyse(text);
      const wordsN = a.wordCount;
      const lenScore = Math.min(100, wordsN/1.6);
      const issuePenalty = a.issues.length*7;
      const score = Math.max(35, Math.min(96, Math.round(60 + lenScore*.25 + a.strengths.length*4 - issuePenalty)));
      const mentorObj = WLN.MENTORS.find(x=>x.id===m.mentor);
      let fb;
      $('#writeFeedback').innerHTML='<p class="small muted">Reviewing your writing\u2026</p>';
      if(state.apiKey){ try{ fb = await Mentor.liveReply(mentorObj, [], `Review this ${m.level} reflection for the lesson "${m.title}" against rubric (${m.writing.rubric.join(', ')}):\n\n${text}`, m); }catch(e){ fb=null; } }
      if(!fb) fb = Mentor.reply(mentorObj, text, m.vocab);
      rec().writings.push({date:new Date().toISOString(), meetingId:m.id, text, score, feedback:fb});
      rec().writingCount++;
      const newWords = m.vocab.filter(v=>text.toLowerCase().includes(v) && !rec().vocabMastered.includes(v));
      newWords.forEach(v=>rec().vocabMastered.push(v));
      rec().vocabCount = rec().vocabMastered.length;
      bumpSkill('Writing',score); bumpSkill('Culture',score);
      markStep(m,'write',90,'Reflection submitted');
      save();
      $('#writeFeedback').innerHTML = `
        <div style="display:flex;align-items:baseline;gap:10px;margin-bottom:12px">
          <span class="scoreBig">${score}<small>/100</small></span>
          <span class="chip">CEFR ${m.level}</span>
        </div>
        <div class="fbBlock"><span class="fbTag">${esc(mentorObj.name)} \u2014 ${esc(mentorObj.role)}</span>${esc(fb).replace(/\n/g,'<br>')}</div>
        ${newWords.length?`<div class="fbBlock"><span class="fbTag">Vocabulary mastered</span>${newWords.map(v=>`<span class="chip" style="margin:2px">${esc(v)}</span>`).join(' ')}</div>`:''}
        <button class="btn primary small" id="toFb">Continue: AI Feedback Summary \u2192</button>`;
      $('#toFb').addEventListener('click',()=>{ _lessonStep='feedback'; Views.lesson($('#viewRoot'), m.id); });
    });
    return;
  }

  /* ---- AI FEEDBACK ---- */
  if(_lessonStep==='feedback'){
    const r = rec();
    const speak = r.speakingSessions.findLast(s=>s.meetingId===m.id);
    const write = r.writings.findLast(w=>w.meetingId===m.id);
    const quiz  = r.quizzes.findLast(q=>q.meetingId===m.id);
    const parts = [quiz?.score, speak?.scores.overall, write?.score].filter(v=>v!=null);
    const overall = parts.length? Math.round(parts.reduce((a,b)=>a+b,0)/parts.length) : 0;
    ls.score = overall;
    markStep(m,'feedback',50,'Feedback reviewed');
    save();
    body.innerHTML = `
      <div class="grid2">
        <div class="panel ornate" style="text-align:center">
          <h3 class="panelTitle" style="justify-content:center">Lesson Performance</h3>
          ${Charts.ring(overall,{size:130,thick:11,label:'overall'})}
          <p class="muted small" style="margin-top:6px">Overall \u2014 combined comprehension, performance, writing</p>
          <div class="scoreRings" style="margin-top:10px">
            <div class="ringCell">${Charts.ring(quiz?.score??0,{size:74,thick:7,color:Charts.C.teal})}<div class="lbl">Comprehension</div></div>
            <div class="ringCell">${Charts.ring(speak?.scores.overall??0,{size:74,thick:7})}<div class="lbl">Speaking</div></div>
            <div class="ringCell">${Charts.ring(write?.score??0,{size:74,thick:7,color:Charts.C.plum})}<div class="lbl">Writing</div></div>
          </div>
        </div>
        <div class="panel">
          <h3 class="panelTitle">Mentors' Summary</h3>
          <div class="fbBlock"><span class="fbTag">Semar \u2014 meaning</span>${write?'Your reflection carries a clear message rooted in the lakon\u2019s value of '+esc(m.value.toLowerCase())+'.':'Complete the writing step so Semar can weigh your message.'}</div>
          <div class="fbBlock"><span class="fbTag">Petruk \u2014 voice</span>${speak?`Pronunciation ${speak.scores.pron} \u2022 Fluency ${speak.scores.fluency}. ${speak.scores.pron>=75?'Your words land clearly \u2014 keep that final-consonant discipline.':'Slow down at key words and finish your final consonants.'}`:'Record a performance in the Speak step for Petruk\u2019s review.'}</div>
          <div class="fbBlock"><span class="fbTag">Bagong \u2014 words</span>${rec().vocabCount} words now mastered. ${m.vocab.slice(0,3).map(v=>`<span class="chip" style="margin:1px">${esc(v)}</span>`).join(' ')}</div>
          <button class="btn primary" id="toAchieve" style="margin-top:8px">Continue: Achieve \u2192</button>
        </div>
      </div>`;
    $('#toAchieve').addEventListener('click',()=>{ _lessonStep='achieve'; Views.lesson($('#viewRoot'), m.id); });
    return;
  }

  /* ---- ACHIEVE ---- */
  if(_lessonStep==='achieve'){
    const done = lessonPct(m.id)>=100 || ['listen','speak','write','feedback'].every(k=>ls.steps[k]);
    const r = rec(), lvl = levelFor(r.xp);
    body.innerHTML = `
      <div class="panel ornate" style="text-align:center;padding:40px 24px">
        <div style="font-size:52px;filter:drop-shadow(0 0 18px rgba(243,207,99,.6))">${done?'\u2B50':'\uD83C\uDFAF'}</div>
        <h2 style="margin:12px 0 6px">${done?'Congratulations!':'Almost there'}</h2>
        <p class="sub">${done? `You completed \u201C${esc(m.title)}\u201D with a score of ${ls.score||'-'} \u2014 ${esc(m.value)} earned.` : 'Finish the Listen, Speak, Write, and Feedback steps to complete this lakon.'}</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:8px">
          <span class="chip">Level ${lvl.level} \u2022 ${r.xp.toLocaleString()} XP</span>
          <span class="chip teal">${r.badges.length} badges</span>
        </div>
        <div style="margin-top:22px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          ${done && m.id<16 ? `<button class="btn primary" data-go="lesson" data-id="${m.id+1}">Next Lakon: ${esc(WLN.MEETINGS[m.id].title)} \u2192</button>`:''}
          <button class="btn" data-go="stories">Story Library</button>
          <button class="btn" data-go="progress">View Progress</button>
        </div>
      </div>`;
    return;
  }
}

/* quiz renderer (MCQ, instant marking) */
function renderQuiz(questions, onDone){
  const box = $('#quizBox');
  let idx=0, correct=0;
  function step(){
    if(idx>=questions.length){ onDone(Math.round(correct/questions.length*100)); return; }
    const q = questions[idx];
    box.innerHTML = `
      <p class="small muted" style="margin:0 0 4px">Question ${idx+1} of ${questions.length}</p>
      <p style="font-weight:600;margin:0 0 12px">${esc(q.q)}</p>
      ${q.opts.map((o,i)=>`<button class="quizOpt" data-i="${i}">${esc(o)}</button>`).join('')}`;
    $$('.quizOpt',box).forEach(b=>b.addEventListener('click',()=>{
      const i=+b.dataset.i;
      $$('.quizOpt',box).forEach(x=>x.disabled=true);
      if(i===q.a){ b.classList.add('right'); correct++; }
      else{ b.classList.add('wrong'); $$('.quizOpt',box)[q.a].classList.add('right'); }
      setTimeout(()=>{ idx++; step(); }, 850);
    }));
  }
  step();
}

/* ================== SHADOW SPEAKING THEATRE ================== */
Views.theatre = function(el){
  const m = WLN.MEETINGS.find(x=>x.id==App.ctx.lessonId) || currentMeeting();
  el.innerHTML = `<div id="theatreMount"></div><div id="historyMount" style="margin-top:16px"></div>`;
  renderTheatre($('#theatreMount'), m, res=>{
    if(res){ bumpSkill('Speaking',res.overall); const r=rec(); r.speakBest=Math.max(r.speakBest,res.overall); addXP(70,'Theatre performance'); save(); }
    renderSpeakHistory($('#historyMount'));
  });
  renderSpeakHistory($('#historyMount'));
};

function renderSpeakHistory(mount){
  const r = rec();
  const sess = r.speakingSessions.slice(-7);
  if(!sess.length){ mount.innerHTML=''; return; }
  mount.innerHTML = `
    <div class="grid2">
      <div class="panel">
        <h3 class="panelTitle">Speaking History<span class="chip dim">${r.speakingSessions.length} sessions</span></h3>
        ${Charts.line(sess.map((s,i)=>({label:'S'+(r.speakingSessions.length-sess.length+i+1), value:s.scores.overall})),{h:160,max:100})}
      </div>
      <div class="panel">
        <h3 class="panelTitle">Recent Sessions</h3>
        ${sess.slice().reverse().slice(0,4).map(s=>{
          const mm = WLN.MEETINGS.find(x=>x.id===s.meetingId);
          return `<div class="rowItem"><span class="cefr" style="width:34px;height:34px;font-size:12px">${s.scores.overall}</span>
            <div class="grow"><b>${esc(mm?mm.title:'Practice')}</b><span class="meta">${esc(s.date)} \u2022 pron ${s.scores.pron} \u2022 fluency ${s.scores.fluency}</span></div></div>`;
        }).join('')}
      </div>
    </div>`;
}

function renderTheatre(mount, m, onScored){
  const role = ['Semar','Arjuna','Srikandi','Bima','Gatotkaca'][m.id%5];
  mount.innerHTML = `
    <div class="grid2">
      <div>
        <div class="theatreStage">
          ${silhouetteSVG()}
          <span class="roleTag">Today's Role: ${role} \u2014 ${esc(m.value)}</span>
          <div class="promptBox">${esc(m.speaking.prompt)}</div>
        </div>
        <div class="waveBox" id="waveBox" aria-hidden="true">${'<i></i>'.repeat(48)}</div>
        <div class="recControls">
          <button class="btn small" id="hintBtn">Hint</button>
          <button class="recBtn" id="recBtn" aria-label="Record">${Icons.mic.replace('viewBox','width="26" height="26" viewBox')}</button>
          <span class="small muted" id="recTime">0:00 / 1:30</span>
        </div>
        <p class="small muted" style="text-align:center;margin-top:10px" id="recNote">${Speech.recAvailable()?'Tap the microphone, perform your narration, then tap again to finish.':'Live speech recognition is not supported in this browser \u2014 use Chrome or Edge, or type your performance below for AI review.'}</p>
        ${Speech.recAvailable()?'':`<textarea class="input" id="manualSpeak" placeholder="Type what you would say, and the AI will score it as a script..."></textarea><button class="btn primary" id="manualScore">Score My Script</button>`}
      </div>
      <div class="panel">
        <h3 class="panelTitle">Live Performance<span class="chip">${m.level}</span></h3>
        <div id="liveOut">
          <p class="small muted">Your transcript and scores will appear here in real time.</p>
          <div class="eyebrow" style="margin:14px 0 8px">Target keywords</div>
          <div style="display:flex;flex-wrap:wrap;gap:7px">${m.speaking.keywords.map(k=>`<span class="chip dim" data-kw="${esc(k)}">${esc(k)}</span>`).join('')}</div>
          <div class="eyebrow" style="margin:16px 0 8px">Criteria</div>
          ${m.speaking.criteria.map(c=>`<div class="feedItem"><span style="color:var(--gold)">\u25C8</span>${esc(c)}</div>`).join('')}
        </div>
      </div>
    </div>`;

  const waveBars = $$('#waveBox i', mount);
  waveBars.forEach(b=>b.style.setProperty('--h', (20+Math.random()*70)+'%'));
  let recording=false, timer=null, t=0;

  function showScores(res, transcript){
    $('#liveOut').innerHTML = `
      <div class="scoreRings">
        <div class="ringCell">${Charts.ring(res.pron,{size:84,thick:8})}<div class="lbl">Pronunciation</div></div>
        <div class="ringCell">${Charts.ring(res.fluency,{size:84,thick:8,color:Charts.C.teal})}<div class="lbl">Fluency</div></div>
        <div class="ringCell">${Charts.ring(res.overall,{size:84,thick:8,color:Charts.C.goldBright})}<div class="lbl">Overall</div></div>
      </div>
      <div class="fbBlock" style="margin-top:14px"><span class="fbTag">Your response</span>${esc(transcript)||'(no speech detected)'}</div>
      <div class="fbBlock"><span class="fbTag">AI Feedback Summary \u2014 Dalang AI</span>
        ${res.overall>=80?'Great clarity and expression! ':res.overall>=65?'A solid performance with room to grow. ':'A brave start \u2014 every dalang begins quietly. '}
        ${res.kwHit>=3?`You used ${res.kwHit} target keywords \u2014 the story\u2019s vocabulary lives in your voice. `:`Try weaving in more target keywords (you used ${res.kwHit}). `}
        ${res.fillers>2?`Reduce fillers (\u201cum\u201d, \u201cuh\u201d \u2014 ${res.fillers} detected) by pausing silently instead. `:''}
        Pace: ${res.wpm} words/min \u2014 ${res.wpm>=90&&res.wpm<=150?'a confident storytelling rhythm.':res.wpm<90?'try a slightly brisker pace.':'slow down a touch and let key words breathe.'}
      </div>
      <div style="display:flex;gap:9px">
        <button class="btn" id="tryAgain">Try Again</button>
        ${App.route==='lesson'?`<button class="btn primary" id="contWrite">Continue: Write & Reflect \u2192</button>`:''}
      </div>`;
    $('#tryAgain')?.addEventListener('click',()=>renderTheatre(mount,m,onScored));
    $('#contWrite')?.addEventListener('click',()=>{ _lessonStep='write'; Views.lesson($('#viewRoot'), m.id); });
  }

  function finish(transcript, seconds){
    recording=false; clearInterval(timer);
    $('#recBtn').classList.remove('recording');
    $('#waveBox').classList.remove('live');
    const res = Speech.scoreSpeaking(transcript, m.speaking.keywords, seconds);
    if(!res){ $('#recNote').textContent='No speech detected \u2014 check your microphone permission and try again.'; return; }
    rec().speakingSessions.push({date:new Date().toISOString().slice(0,10), meetingId:m.id, scores:{pron:res.pron,fluency:res.fluency,overall:res.overall}, transcript:transcript.slice(0,300)});
    const newWords = m.speaking.keywords.filter(k=>transcript.toLowerCase().includes(k)&&!rec().vocabMastered.includes(k));
    newWords.forEach(w=>rec().vocabMastered.push(w));
    rec().vocabCount = rec().vocabMastered.length;
    save();
    showScores(res, transcript);
    onScored?.(res);
  }

  $('#recBtn').addEventListener('click',()=>{
    if(recording){ Speech.stopRecognition(); return; }
    if(!Speech.recAvailable()){ toast('Speech recognition needs Chrome or Edge \u2014 use the script box instead.'); return; }
    const ok = Speech.startRecognition({
      onPartial: txt=>{
        const live=$('#liveOut .liveTx'); 
        if(live) live.textContent=txt;
        else $('#liveOut').insertAdjacentHTML('afterbegin',`<div class="fbBlock"><span class="fbTag">Listening\u2026</span><span class="liveTx">${esc(txt)}</span></div>`);
        m.speaking.keywords.forEach(k=>{ if(txt.toLowerCase().includes(k)){ const c=$(`[data-kw="${k}"]`,mount); if(c){c.classList.remove('dim');} } });
      },
      onEnd: finish,
      onError: err=>{
        recording=false; clearInterval(timer);
        $('#recBtn').classList.remove('recording'); $('#waveBox').classList.remove('live');
        $('#recNote').textContent = err==='not-allowed' ? 'Microphone permission was denied \u2014 allow it in your browser settings.' :
          err==='unsupported' ? 'Speech recognition is not supported here \u2014 use Chrome or Edge.' :
          'Recognition stopped ('+err+'). Tap the microphone to try again.';
      },
    });
    if(ok){
      recording=true; t=0;
      $('#recBtn').classList.add('recording');
      $('#waveBox').classList.add('live');
      $('#recNote').textContent='Recording \u2014 perform your narration, then tap the microphone to finish.';
      timer=setInterval(()=>{
        t++; $('#recTime').textContent=`${Math.floor(t/60)}:${String(t%60).padStart(2,'0')} / 1:30`;
        waveBars.forEach(b=>b.style.setProperty('--h',(15+Math.random()*80)+'%'));
        if(t>=90) Speech.stopRecognition();
      },1000);
    }
  });
  $('#hintBtn').addEventListener('click',()=>modal('Dalang\u2019s Hint',
    `<p>Open with the scene: <i>\u201cTonight, on the kelir, we meet\u2026\u201d</i></p>
     <p>Name the conflict, voice both sides, and close with the lesson of <b>${esc(m.value.toLowerCase())}</b>.</p>
     <p>Use at least three keywords: ${m.speaking.keywords.slice(0,4).map(k=>`<span class="chip">${esc(k)}</span>`).join(' ')}</p>`));
  $('#manualScore')?.addEventListener('click',()=>{
    const txt=$('#manualSpeak').value.trim();
    if(txt.split(/\s+/).length<15){ toast('Write at least 15 words.'); return; }
    finish(txt, Math.max(20, txt.split(/\s+/).length/2.2));
  });
}

/* ====================== AI MENTORS ====================== */
Views.mentors = function(el){
  const r = rec();
  if(!r){ el.innerHTML='<p class="muted">Please sign in as a student to access mentors.</p>'; return; }
  if(!r.mentorChats) r.mentorChats = {};

  const allMentors = [...WLN.MENTORS, ...WLN.HEROES];
  const curId = App.ctx.mentorId || 'semar';
  const cur   = allMentors.find(m=>m.id===curId) || WLN.MENTORS[0];
  App.ctx.mentorId = cur.id;
  if(!r.mentorChats[cur.id]) r.mentorChats[cur.id] = [];
  const chat = r.mentorChats[cur.id];
  const lesson = WLN.MEETINGS.find(x=>x.id==App.ctx.lessonId);
  let isRecording = false;

  /* ─── Inline wayang portraits — one per character ─── */
  function PORTRAIT(id){
    const P = {
      semar:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="39" fill="#0a1428"/>
        <radialGradient id="gs" cx="40%" cy="35%"><stop offset="0%" stop-color="#f3cf63" stop-opacity=".3"/><stop offset="100%" stop-color="#0a1428"/></radialGradient>
        <circle cx="40" cy="40" r="39" fill="url(#gs)"/>
        <ellipse cx="40" cy="54" rx="22" ry="18" fill="#c8832a"/>
        <circle cx="40" cy="33" r="19" fill="#d9a040"/>
        <ellipse cx="40" cy="36" rx="15" ry="12" fill="#e8b050" opacity=".7"/>
        <path d="M27 29 q5-4 9 0" stroke="#2a1004" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M44 29 q5-4 9 0" stroke="#2a1004" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M27 42 q13 10 26 0" stroke="#2a1004" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M18 55 Q8 46 14 36" stroke="#c8832a" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="M62 55 Q72 46 66 36" stroke="#c8832a" stroke-width="5" fill="none" stroke-linecap="round"/>
        <circle cx="40" cy="40" r="38" fill="none" stroke="#d7a928" stroke-width="1.5"/>
      </svg>`,
      gareng:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="39" fill="#0a1428"/>
        <radialGradient id="gg" cx="40%" cy="30%"><stop offset="0%" stop-color="#d98f5a" stop-opacity=".35"/><stop offset="100%" stop-color="#0a1428"/></radialGradient>
        <circle cx="40" cy="40" r="39" fill="url(#gg)"/>
        <ellipse cx="40" cy="56" rx="15" ry="20" fill="#a05010"/>
        <ellipse cx="40" cy="36" rx="16" ry="19" fill="#c8721a"/>
        <path d="M28 50 L26 62 L32 68 L40 70 L48 68 L54 62 L52 50" fill="#b06010" opacity=".8"/>
        <path d="M42 42 L52 54 L44 54" fill="#7a3810" opacity=".9"/>
        <circle cx="30" cy="34" r="6" fill="#1a0804"/>
        <circle cx="32" cy="32" r="2" fill="#fff" opacity=".35"/>
        <ellipse cx="50" cy="35" rx="4" ry="3.5" fill="#1a0804"/>
        <path d="M24 28 L36 31" stroke="#2a1004" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M44 30 L56 27" stroke="#2a1004" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M29 54 Q32 58 40 56 Q48 54 52 58" stroke="#2a1004" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M24 22 Q40 8 56 22" fill="#7a4a1a" opacity=".9"/>
        <path d="M27 22 Q40 12 53 22" fill="#9a6030" opacity=".7"/>
        <circle cx="40" cy="40" r="38" fill="none" stroke="#d7a928" stroke-width="1.5"/>
      </svg>`,
      petruk:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="39" fill="#0a1428"/>
        <radialGradient id="gp" cx="40%" cy="30%"><stop offset="0%" stop-color="#c9b16a" stop-opacity=".35"/><stop offset="100%" stop-color="#0a1428"/></radialGradient>
        <circle cx="40" cy="40" r="39" fill="url(#gp)"/>
        <ellipse cx="37" cy="55" rx="13" ry="22" fill="#9a7420"/>
        <ellipse cx="37" cy="33" rx="16" ry="18" fill="#c9a040"/>
        <path d="M44 36 Q58 37 72 32 Q68 42 56 44 Q48 44 44 40 Z" fill="#9a7020" opacity=".95"/>
        <circle cx="28" cy="30" r="5" fill="#1a0c04"/>
        <circle cx="29" cy="29" r="2" fill="#fff" opacity=".4"/>
        <circle cx="44" cy="31" r="4" fill="#1a0c04"/>
        <path d="M22 24 Q28 20 34 24" stroke="#4a3010" stroke-width="2" fill="none"/>
        <path d="M41 25 Q46 22 51 25" stroke="#4a3010" stroke-width="2" fill="none"/>
        <path d="M26 46 Q36 54 48 46" stroke="#2a1c08" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <ellipse cx="37" cy="17" rx="9" ry="7" fill="#7a5818"/>
        <circle cx="37" cy="10" r="5" fill="#c9a040"/>
        <circle cx="37" cy="5" r="3" fill="#f3cf63"/>
        <circle cx="40" cy="40" r="38" fill="none" stroke="#d7a928" stroke-width="1.5"/>
      </svg>`,
      bagong:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="39" fill="#0a1428"/>
        <radialGradient id="gb" cx="40%" cy="35%"><stop offset="0%" stop-color="#f3cf63" stop-opacity=".35"/><stop offset="100%" stop-color="#0a1428"/></radialGradient>
        <circle cx="40" cy="40" r="39" fill="url(#gb)"/>
        <ellipse cx="40" cy="52" rx="28" ry="22" fill="#c88020"/>
        <circle cx="40" cy="36" r="24" fill="#d99030"/>
        <ellipse cx="40" cy="38" rx="20" ry="16" fill="#e8a040" opacity=".7"/>
        <ellipse cx="28" cy="32" rx="9" ry="10" fill="#1a0c04"/>
        <ellipse cx="30" cy="30" r="3.5" fill="#fff" opacity=".45"/>
        <ellipse cx="52" cy="32" rx="9" ry="10" fill="#1a0c04"/>
        <ellipse cx="54" cy="30" r="3.5" fill="#fff" opacity=".45"/>
        <ellipse cx="40" cy="46" rx="7" ry="5" fill="#9a5010" opacity=".6"/>
        <path d="M22 54 Q40 66 58 54" fill="#8a2010" opacity=".85"/>
        <path d="M24 54 Q40 64 56 54" fill="#c04020" opacity=".5"/>
        <rect x="31" y="54" width="5" height="5" rx="1" fill="#fff" opacity=".65"/>
        <rect x="39" y="54" width="5" height="5" rx="1" fill="#fff" opacity=".65"/>
        <circle cx="40" cy="40" r="38" fill="none" stroke="#d7a928" stroke-width="1.5"/>
      </svg>`,
      dalang:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="39" fill="#0a1428"/>
        <radialGradient id="gd" cx="50%" cy="30%"><stop offset="0%" stop-color="#f3cf63" stop-opacity=".4"/><stop offset="100%" stop-color="#0a1428"/></radialGradient>
        <circle cx="40" cy="40" r="39" fill="url(#gd)"/>
        <path d="M16 36 L22 14 L30 22 L36 6 L40 18 L44 6 L50 22 L58 14 L64 36 Z" fill="#f3cf63"/>
        <path d="M19 35 L24 16 L31 22 L37 8 L40 18 L43 8 L49 22 L56 16 L61 35 Z" fill="#d7a928"/>
        <circle cx="40" cy="10" r="4" fill="#f3cf63" stroke="#9a7415" stroke-width="1"/>
        <circle cx="28" cy="16" r="2.5" fill="#e8c970"/>
        <circle cx="52" cy="16" r="2.5" fill="#e8c970"/>
        <ellipse cx="40" cy="54" rx="18" ry="20" fill="#c8882a"/>
        <ellipse cx="40" cy="55" rx="14" ry="16" fill="#d99838"/>
        <ellipse cx="30" cy="47" rx="5" ry="4" fill="#1a0c04"/>
        <ellipse cx="31" cy="46" r="1.5" fill="#fff" opacity=".4"/>
        <ellipse cx="50" cy="47" rx="5" ry="4" fill="#1a0c04"/>
        <ellipse cx="51" cy="46" r="1.5" fill="#fff" opacity=".4"/>
        <path d="M27 44 Q33 40 39 44" stroke="#4a2a08" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M41 44 Q47 40 53 44" stroke="#4a2a08" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M34 58 L32 70 L40 72 L48 70 L46 58" fill="#8a5010" opacity=".6"/>
        <path d="M33 62 Q40 66 47 62" stroke="#2a1004" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M24 68 Q30 58 40 60 Q50 58 56 68 L58 78 L22 78 Z" fill="#6a4010" opacity=".85"/>
        <path d="M24 68 Q40 56 56 68" stroke="#f3cf63" stroke-width="1.5" fill="none"/>
        <circle cx="40" cy="40" r="38" fill="none" stroke="#f3cf63" stroke-width="2"/>
      </svg>`,
      arjuna:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="39" fill="#0a1428"/>
        <radialGradient id="ga" cx="40%" cy="30%"><stop offset="0%" stop-color="#cfe0e8" stop-opacity=".3"/><stop offset="100%" stop-color="#0a1428"/></radialGradient>
        <circle cx="40" cy="40" r="39" fill="url(#ga)"/>
        <path d="M37 6 L34 36 L46 36 L43 6 L40 2 Z" fill="#4a7a9a"/>
        <path d="M39 5 L37 34 L43 34 L41 5 L40 2 Z" fill="#6a9ab8" opacity=".7"/>
        <ellipse cx="40" cy="36" rx="10" ry="5" fill="#3a6a8a"/>
        <ellipse cx="40" cy="52" rx="18" ry="20" fill="#8ab8d0"/>
        <ellipse cx="42" cy="53" rx="14" ry="16" fill="#a0c8e0"/>
        <ellipse cx="32" cy="47" rx="5" ry="4" fill="#1a2a3a"/>
        <ellipse cx="33" cy="46" r="1.5" fill="#fff" opacity=".4"/>
        <ellipse cx="48" cy="47" rx="4.5" ry="3.5" fill="#1a2a3a"/>
        <ellipse cx="49" cy="46" r="1.5" fill="#fff" opacity=".4"/>
        <path d="M27 41 L37 38" stroke="#1a2a3a" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M43 39 L53 42" stroke="#1a2a3a" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M40 55 L38 64" stroke="#6a9ab0" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M35 64 Q40 68 45 64" stroke="#2a3a4a" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M24 72 Q34 62 40 64 Q46 62 56 72 L58 80 L22 80 Z" fill="#2a5a7a" opacity=".85"/>
        <path d="M62 36 Q70 44 62 52" stroke="#f3cf63" stroke-width="2" fill="none" stroke-linecap="round"/>
        <circle cx="40" cy="40" r="38" fill="none" stroke="#7aaac8" stroke-width="1.5"/>
      </svg>`,
      srikandi:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="39" fill="#0a1428"/>
        <radialGradient id="gsr" cx="40%" cy="30%"><stop offset="0%" stop-color="#e8a8b8" stop-opacity=".35"/><stop offset="100%" stop-color="#0a1428"/></radialGradient>
        <circle cx="40" cy="40" r="39" fill="url(#gsr)"/>
        <circle cx="40" cy="16" r="12" fill="#c87890" opacity=".8"/>
        <circle cx="40" cy="16" r="8" fill="#e0a0b8"/>
        <circle cx="40" cy="16" r="4" fill="#f3cf63"/>
        <circle cx="26" cy="26" r="7" fill="#c07080" opacity=".7"/>
        <circle cx="54" cy="26" r="7" fill="#c07080" opacity=".7"/>
        <ellipse cx="40" cy="52" rx="17" ry="20" fill="#d09098"/>
        <ellipse cx="40" cy="53" rx="14" ry="16" fill="#e0a8b0"/>
        <path d="M26 46 Q33 42 40 46" fill="#1a0c10" stroke="none"/>
        <path d="M26 46 Q33 50 40 46" fill="#d09098" opacity=".4"/>
        <ellipse cx="33" cy="46" rx="3" ry="2.5" fill="#1a0c10"/>
        <path d="M40 46 Q47 42 54 46" fill="#1a0c10"/>
        <path d="M40 46 Q47 50 54 46" fill="#d09098" opacity=".4"/>
        <ellipse cx="47" cy="46" rx="3" ry="2.5" fill="#1a0c10"/>
        <path d="M25 40 Q32 36 38 40" stroke="#4a1a2a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
        <path d="M42 40 Q48 36 55 40" stroke="#4a1a2a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
        <path d="M36 58 L35 66 L40 68 L45 66 L44 58" fill="#c07080" opacity=".5"/>
        <path d="M34 64 Q40 68 46 64" stroke="#6a2030" stroke-width="2" fill="rgba(200,100,120,.25)" stroke-linecap="round"/>
        <path d="M22 72 Q32 62 40 64 Q48 62 58 72 L60 80 L20 80 Z" fill="#7a3050" opacity=".85"/>
        <circle cx="40" cy="40" r="38" fill="none" stroke="#e8a8b8" stroke-width="1.5"/>
      </svg>`,
      bima:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="39" fill="#0a1428"/>
        <radialGradient id="gbi" cx="40%" cy="30%"><stop offset="0%" stop-color="#a8c8a0" stop-opacity=".3"/><stop offset="100%" stop-color="#0a1428"/></radialGradient>
        <circle cx="40" cy="40" r="39" fill="url(#gbi)"/>
        <path d="M14 36 Q18 14 30 10 Q40 6 50 10 Q62 14 66 36" fill="#2a4a20" opacity=".9"/>
        <path d="M17 35 Q21 16 32 12 Q40 8 48 12 Q59 16 63 35" fill="#3d6b30" opacity=".7"/>
        <rect x="26" y="34" width="28" height="32" rx="6" fill="#88b080"/>
        <ellipse cx="40" cy="50" rx="18" ry="20" fill="#90b888"/>
        <rect x="22" y="36" width="36" height="4" fill="#2a4a20" opacity=".5" rx="2"/>
        <ellipse cx="30" cy="46" rx="6" ry="5" fill="#1a2a14"/>
        <ellipse cx="32" cy="45" r="2" fill="#fff" opacity=".35"/>
        <ellipse cx="50" cy="46" rx="6" ry="5" fill="#1a2a14"/>
        <ellipse cx="52" cy="45" r="2" fill="#fff" opacity=".35"/>
        <path d="M22 38 Q30 33 38 38" stroke="#1a2a14" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M42 38 Q50 33 58 38" stroke="#1a2a14" stroke-width="3" fill="none" stroke-linecap="round"/>
        <ellipse cx="40" cy="58" rx="8" ry="5" fill="#5a8840" opacity=".5"/>
        <path d="M34 62 Q40 66 46 62" stroke="#1a2a14" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M16 72 Q28 60 40 62 Q52 60 64 72 L68 80 L12 80 Z" fill="#2a5030" opacity=".9"/>
        <path d="M6 74 L20 60 L22 75 Z" fill="#f3cf63" opacity=".75"/>
        <circle cx="40" cy="40" r="38" fill="none" stroke="#90b888" stroke-width="1.5"/>
      </svg>`,
      gatotkaca:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="39" fill="#0a1428"/>
        <radialGradient id="ggat" cx="50%" cy="30%"><stop offset="0%" stop-color="#a8b8e8" stop-opacity=".35"/><stop offset="100%" stop-color="#0a1428"/></radialGradient>
        <circle cx="40" cy="40" r="39" fill="url(#ggat)"/>
        <path d="M2 40 Q14 24 28 38" fill="#2a3a7a" opacity=".85"/>
        <path d="M4 40 Q15 28 28 38" fill="#4a5aa0" opacity=".6"/>
        <path d="M78 40 Q66 24 52 38" fill="#2a3a7a" opacity=".85"/>
        <path d="M76 40 Q65 28 52 38" fill="#4a5aa0" opacity=".6"/>
        <ellipse cx="40" cy="58" rx="18" ry="17" fill="#2a3a8a"/>
        <ellipse cx="40" cy="56" rx="15" ry="14" fill="#4a5ab0"/>
        <ellipse cx="40" cy="40" rx="17" ry="18" fill="#88a0d8"/>
        <ellipse cx="42" cy="41" rx="14" ry="15" fill="#a0b8e8"/>
        <path d="M26 34 Q34 26 40 28 Q46 26 54 34" fill="#2a3a8a"/>
        <path d="M28 34 Q35 28 40 30 Q45 28 52 34" fill="#4a5ab0"/>
        <path d="M34 28 Q40 16 46 28" fill="#8898d0" opacity=".8"/>
        <ellipse cx="30" cy="40" rx="5.5" ry="4" fill="#1a1a3a"/>
        <ellipse cx="31" cy="39" r="2" fill="#6a8ae0" opacity=".5"/>
        <ellipse cx="50" cy="40" rx="5.5" ry="4" fill="#1a1a3a"/>
        <ellipse cx="51" cy="39" r="2" fill="#6a8ae0" opacity=".5"/>
        <path d="M27 35 Q33 30 39 35" stroke="#1a1a3a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M41 35 Q47 30 53 35" stroke="#1a1a3a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M35 54 Q40 58 45 54" stroke="#1a2a5a" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M30 66 Q34 60 40 62 Q46 60 50 66" stroke="#4a5ab0" stroke-width="3" fill="none"/>
        <circle cx="40" cy="40" r="38" fill="none" stroke="#a8b8e8" stroke-width="1.5"/>
      </svg>`,
      kresna:`<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="39" fill="#0a1428"/>
        <radialGradient id="gkr" cx="50%" cy="30%"><stop offset="0%" stop-color="#8ad0c8" stop-opacity=".35"/><stop offset="100%" stop-color="#0a1428"/></radialGradient>
        <circle cx="40" cy="40" r="39" fill="url(#gkr)"/>
        <path d="M18 38 L24 16 L32 24 L38 8 L40 18 L42 8 L48 24 L56 16 L62 38 Z" fill="#f3cf63"/>
        <path d="M21 37 L26 18 L33 24 L38 10 L40 18 L42 10 L47 24 L54 18 L59 37 Z" fill="#d7a928"/>
        <circle cx="40" cy="12" r="4" fill="#1d6b60" stroke="#f3cf63" stroke-width="1.2"/>
        <circle cx="28" cy="18" r="2.5" fill="#8ad0c8"/>
        <circle cx="52" cy="18" r="2.5" fill="#8ad0c8"/>
        <ellipse cx="40" cy="54" rx="18" ry="20" fill="#1a6058"/>
        <ellipse cx="40" cy="55" rx="14" ry="16" fill="#2a8070"/>
        <ellipse cx="30" cy="48" rx="5.5" ry="4" fill="#0a2820"/>
        <ellipse cx="31" cy="47" r="2" fill="#8ad0c8" opacity=".4"/>
        <ellipse cx="50" cy="48" rx="5.5" ry="4" fill="#0a2820"/>
        <ellipse cx="51" cy="47" r="2" fill="#8ad0c8" opacity=".4"/>
        <path d="M26 42 Q32 38 38 42" stroke="#0a2820" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M42 42 Q48 38 54 42" stroke="#0a2820" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M35 56 L33 64" stroke="#5a9888" stroke-width="2" stroke-linecap="round"/>
        <path d="M45 56 L47 64" stroke="#5a9888" stroke-width="2" stroke-linecap="round"/>
        <path d="M33 64 Q40 68 47 64" stroke="#0a3028" stroke-width="2" fill="rgba(50,150,130,.2)" stroke-linecap="round"/>
        <path d="M28 58 Q32 48 40 50 Q48 48 52 58" fill="#0a4038" opacity=".6"/>
        <path d="M20 72 Q30 60 40 62 Q50 60 60 72 L64 80 L16 80 Z" fill="#0a4838" opacity=".9"/>
        <path d="M20 72 Q40 58 60 72" stroke="#f3cf63" stroke-width="1.5" fill="none"/>
        <circle cx="40" cy="40" r="38" fill="none" stroke="#8ad0c8" stroke-width="1.5"/>
      </svg>`,
    };
    return P[id] || `<svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="38" fill="#1a2a3a" stroke="#d7a928" stroke-width="1.5"/><text x="40" y="45" text-anchor="middle" fill="#d7a928" font-size="14" font-family="Cinzel,serif">${id.charAt(0).toUpperCase()}</text></svg>`;
  }

  const MENTOR_DATA = {
    responses: {
      semar:  (txt)=>`Wise words arise from clear thoughts. ${txt.length<30?'Try to expand your idea — the audience needs more to follow.':txt.includes('because')||txt.includes('therefore')?'Your reasoning flows well — this shows academic maturity. Now deepen the cultural reflection.':'Your message has heart. Now make it shine: reorder your ideas from strongest point first, add one supporting example.'} Remember: every great dalang learns from silence as much as speech.`,
      gareng: (txt)=>{
        const issues=[];
        if(!/[A-Z]/.test(txt[0])) issues.push('start with a capital letter');
        if(!/[.!?]$/.test(txt.trim())) issues.push('end with proper punctuation');
        if(/\bi\b/.test(txt)&&!/\bI\b/.test(txt)) issues.push('capitalize "I" always');
        const going=/going to/i.test(txt);
        return `Grammar check complete! ${issues.length?`I spotted ${issues.length} rule(s) to fix: please ${issues.join('; ')}. `:'Your grammar structure looks solid! '}${going?'Tip: "going to" is correct — well done using future tense. ':''}I always say: rules are the bones of language. Master them and you can break them beautifully.`;
      },
      petruk: (txt)=>`Let me analyse your pronunciation patterns! For the text you wrote, focus on these sounds: Words ending in "-tion" (like communication, pronunciation) → say /ʃən/ not /tion/. Stress your key words: try stressing ${txt.split(' ').filter(w=>w.length>5)[0]||'your main nouns'}. Your rhythm will improve when you speak in thought groups, not word by word. Try reading aloud: "${txt.slice(0,60)}…" and record yourself! Rhythm is everything in English.`,
      bagong: (txt)=>{
        const vocab=['eloquent','profound','articulate','compelling','coherent'];
        const pick=vocab[txt.length%vocab.length];
        return `Oh, great word choice adventure! Here are 3 stronger words for your text: Instead of common words, try: 1) "${pick}" — this elevates your academic register. 2) "Moreover" instead of "also" → sounds more sophisticated. 3) "${txt.split(' ').filter(w=>w.length>4)[0]||'your word'}" could become "${pick}d" in some contexts! Build your vocabulary one story at a time. Words are my favourite treasure!`;
      },
      dalang: (txt)=>{
        const wc=txt.split(/\s+/).length;
        return `Performance analysis complete! Word count: ${wc} words. ${wc<20?'Too brief for a full performance — expand to at least 60 words to engage your audience.':wc>150?'Excellent stamina! Now tighten: cut any sentence that does not serve the story.':'Good length for a performance piece.'} Your storytelling arc: ${txt.includes('?')?'Good — questions engage the audience. ':'Add a rhetorical question to pull your audience in. '}Confidence tip: every story needs a beginning (hook), a conflict (tension), and a resolution (wisdom). Does yours have all three?`;
      },
      arjuna: (txt)=>`Your argument structure shows ${txt.includes('however')||txt.includes('although')?'excellent':'developing'} strategic thinking. For fluency, practice this: read your text aloud three times — each time faster. Notice where you stumble; those are your weak points. Your pacing: aim for 130-150 words per minute in formal contexts. The archer's wisdom: aim for clarity before speed. Precision wins every time.`,
      srikandi: (txt)=>`Presentation assessment: Your opening ${txt.split('.')[0].length<50?'is concise — good for commanding attention immediately':'is detailed — consider a shorter, punchier opening line'}. Eye contact tip: memorise your first two sentences. Voice projection: put your energy into the final word of each sentence. Courage in speaking comes from knowing your material deeply — and you clearly do. Speak to inspire, not just to inform!`,
      bima: (txt)=>`Critical analysis: Your argument ${txt.includes('evidence')||txt.includes('example')||txt.includes('because')?'presents evidence — strong foundation!':'needs more evidence. Add: "For example…" or "Research shows that…"'} Logical flow: ${txt.split('.').length>2?'Multiple points — good structure.':'Develop more than one supporting point.'} The warrior's truth: every claim needs proof. What evidence supports your position? State it boldly, defend it clearly.`,
      gatotkaca:`Intelligibility check: Your message ${txt.length>50?'has sufficient length for context':'is brief — add more context for clarity'}. Clarity score: Volume matters — project confidence in every word. Emphasis: stress the MOST IMPORTANT word in each sentence. Example: "Communication is the BRIDGE between cultures." High-flying communication soars when every word lands clearly!`,
      kresna: (txt)=>`Intercultural wisdom: Your text touches on ${txt.toLowerCase().includes('culture')||txt.toLowerCase().includes('wayang')||txt.toLowerCase().includes('java')?'cultural themes — excellent intercultural awareness!':'a universal topic. Consider connecting it to cultural context for richer meaning.'}Diplomatic language tip: Instead of "you are wrong", try "I see it differently" — this preserves face in Javanese communication culture. Global competence is not just English — it is understanding how cultures communicate meaning through language. Deep insight.`,
    }
  };

  function getResponse(id, txt){
    const fn = MENTOR_DATA.responses[id];
    if(typeof fn === 'function') return fn(txt);
    if(typeof fn === 'string') return fn;
    return `I am ${cur.name}, your ${cur.role}. I see your text: "${txt.slice(0,80)}…" Let me reflect on this and guide you. Your effort to communicate in English is already a step toward mastery.`;
  }

  function msgBubble(mn){
    return mn.role==='user'
      ? `<div class="bubble user">${esc(mn.text)}</div>`
      : `<div class="bubble ai"><span class="who">${esc(cur.name)} · ${esc(cur.role)}</span>${esc(mn.text)}</div>`;
  }

  const CHARS = [
    {group:'✦ Panakawan — Language Guides', items:WLN.MENTORS},
    {group:'✦ Hero Characters', items:WLN.HEROES}
  ];

  el.innerHTML = `
<div style="margin-bottom:8px">
  <h2 style="margin:0 0 6px;font-size:20px">AI Wayang Mentors</h2>
  <p class="muted small" style="margin:0;max-width:680px;line-height:1.6">
    Ten wayang characters guide your English journey — each with a unique focus and voice. Select a guide, then write or speak your English for personalised feedback.
    ${state.apiKey?'<span class="chip teal" style="font-size:10px;margin-left:6px">Live AI Active</span>':''}
  </p>
</div>

<!-- ═══ ALL 10 CHARACTERS ═══ -->
${CHARS.map(group=>`
<div style="margin:18px 0 10px">
  <div style="font-size:10.5px;letter-spacing:.16em;color:var(--gold);text-transform:uppercase;margin-bottom:12px;display:flex;align-items:center;gap:10px">
    ${group.group}
    <div style="flex:1;height:1px;background:linear-gradient(to right,rgba(215,169,40,.3),transparent)"></div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px">
    ${group.items.map(m=>`
      <div data-mentor="${m.id}" style="cursor:pointer;padding:14px 10px;text-align:center;border-radius:14px;border:${m.id===cur.id?'2px solid var(--gold)':'1px solid var(--line-soft)'};background:${m.id===cur.id?'rgba(215,169,40,.1)':'var(--navy-2)'};transition:all .2s;position:relative" class="mcCard">
        ${m.id===cur.id?'<div style="position:absolute;top:-1px;left:50%;transform:translateX(-50%);background:var(--gold);color:#1d1604;font-size:9px;font-family:Cinzel,serif;padding:1px 8px;border-radius:0 0 6px 6px;letter-spacing:.06em;font-weight:700">ACTIVE</div>':''}
        <div style="width:72px;height:72px;margin:0 auto 10px;border-radius:50%;overflow:hidden;border:2px solid ${m.id===cur.id?'var(--gold)':'var(--line)'};background:#070e1e;flex:none">
          ${PORTRAIT(m.id)}
        </div>
        <b style="display:block;font-size:13px;font-family:var(--font-display);color:${m.id===cur.id?'var(--gold-bright)':'var(--cream)'};margin-bottom:3px">${esc(m.name)}</b>
        <span style="display:block;font-size:10.5px;color:var(--gold);font-weight:600;margin-bottom:5px">${esc(m.role)}</span>
        <p style="font-size:10.5px;color:var(--cream-dim);margin:0;line-height:1.4">${esc((m.desc||m.focus||'').split(',')[0])}</p>
      </div>`).join('')}
  </div>
</div>`).join('')}

<!-- ═══ ACTIVE MENTOR STUDIO ═══ -->
<div style="display:grid;grid-template-columns:280px 1fr;gap:18px;margin-top:22px">

  <!-- Left: Active character card -->
  <div style="display:flex;flex-direction:column;gap:12px">
    <div class="panel ornate" style="text-align:center;padding:22px">
      <div style="width:130px;height:130px;margin:0 auto 14px;border-radius:18px;overflow:hidden;border:3px solid var(--gold);background:#070e1e;box-shadow:0 0 24px rgba(215,169,40,.25)">
        ${PORTRAIT(cur.id)}
      </div>
      <h3 style="font-size:19px;margin:0 0 3px;color:var(--gold-bright)">${esc(cur.name)}</h3>
      <div style="font-size:12.5px;color:var(--gold);font-weight:600;letter-spacing:.06em;margin-bottom:10px">${esc(cur.role)}</div>
      <p class="muted small" style="margin:0 0 12px;line-height:1.6;font-size:12px">${esc(cur.desc||cur.focus)}</p>
      ${cur.style?`<div style="font-size:11px;color:var(--cream-dim);font-style:italic;line-height:1.5;padding:8px;background:rgba(215,169,40,.04);border-radius:8px;border:1px solid var(--line-soft)">${esc(cur.style)}</div>`:''}
    </div>
    <div class="panel ornate">
      <div style="font-size:11px;letter-spacing:.1em;color:var(--gold);text-transform:uppercase;margin-bottom:10px">Focus Areas</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        ${(cur.focus||'').split(',').map(f=>`<span class="chip" style="font-size:11px">${esc(f.trim())}</span>`).join('')}
      </div>
      <div style="margin-top:12px;font-size:12px;color:var(--cream-dim);line-height:1.6;padding:10px;background:rgba(215,169,40,.04);border-radius:8px">
        💡 Paste writing or transcript here for targeted feedback from ${esc(cur.name)}.
      </div>
    </div>
  </div>

  <!-- Right: Chat Studio -->
  <div class="panel ornate" style="display:flex;flex-direction:column">

    <!-- Studio header with ALL action buttons -->
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;flex-wrap:wrap">
      <b style="font-family:var(--font-display);font-size:14px;flex:1;min-width:120px">${esc(cur.name)}'s Studio</b>
      <button class="btn primary" id="btnFeedback" style="padding:7px 14px;font-size:12.5px">✦ Get Feedback</button>
      <button class="btn small" id="btnPlay"  title="Play last response aloud">${Icons.play}&nbsp;Play</button>
      <button class="btn small" id="btnStop"  title="Stop speech">${Icons.stopIc}&nbsp;Stop</button>
      <button class="btn small" id="btnRec"   title="Record voice input">${Icons.mic}&nbsp;<span id="recLbl">Record</span></button>
      <button class="btn small" id="btnSave"  title="Save chat as text file">💾&nbsp;Save</button>
      <button class="btn small" id="btnClear" title="Clear conversation">🗑&nbsp;Clear</button>
    </div>

    <!-- Chat log -->
    <div id="chatLog" class="chatLog" style="flex:1;min-height:200px;max-height:360px;overflow-y:auto">
      ${chat.length
        ? chat.map(msgBubble).join('')
        : `<div class="bubble ai">
             <span class="who">${esc(cur.name)} &middot; ${esc(cur.role)}</span>
             ${esc(cur.opener||'Hello! I am '+cur.name+'. Share your English with me.')}
           </div>`}
    </div>

    <!-- Input area -->
    <div style="margin-top:12px">
      <textarea id="mentorInput" class="input" style="min-height:88px;margin-bottom:10px;width:100%;box-sizing:border-box;resize:vertical"
        placeholder="Write a sentence, paragraph, or question for ${esc(cur.name)}… (Ctrl+Enter to send)"></textarea>
      <div style="font-size:11.5px;color:var(--cream-dim);display:flex;align-items:center;gap:8px">
        <span id="recStatus" style="color:var(--warn)"></span>
        <span style="margin-left:auto">${state.apiKey?'<span class="chip teal" style="font-size:10px">Live AI</span>':'<span style="opacity:.5">Add Anthropic API key in Settings for live AI</span>'}</span>
      </div>
    </div>
  </div>
</div>`;

  const log   = document.getElementById('chatLog');
  const input = document.getElementById('mentorInput');
  const scrollEnd = ()=>{ if(log) log.scrollTop = log.scrollHeight; };
  scrollEnd();

  /* ── Character card clicks ── */
  document.querySelectorAll('.mcCard').forEach(card=>{
    card.addEventListener('click', ()=>{
      if(card.dataset.mentor) { App.ctx.mentorId=card.dataset.mentor; Views.mentors(el); }
    });
  });

  /* ── Get Feedback ── */
  async function doFeedback(){
    const txt = input?.value?.trim();
    if(!txt){ toast('Write something for '+cur.name+' first.'); return; }

    chat.push({role:'user',text:txt,date:new Date().toISOString()});
    if(log) log.insertAdjacentHTML('beforeend', msgBubble(chat.at(-1)));
    if(input) input.value='';
    scrollEnd();

    const thinking = document.createElement('div');
    thinking.className='bubble ai';
    thinking.innerHTML=`<span class="who">${esc(cur.name)}</span><span style="opacity:.5;font-style:italic">Thinking…</span>`;
    if(log) log.appendChild(thinking);
    scrollEnd();

    let reply = null;
    if(state.apiKey){
      try{ reply = await Mentor.liveReply(cur, chat, txt, lesson); }catch(e){}
    }
    if(!reply) reply = getResponse(cur.id, txt);

    thinking.remove();
    chat.push({role:'ai',text:reply,date:new Date().toISOString()});
    if(log) log.insertAdjacentHTML('beforeend', msgBubble(chat.at(-1)));
    scrollEnd();
    addXP(25,'Mentor consultation'); save();
  }

  document.getElementById('btnFeedback')?.addEventListener('click', doFeedback);
  document.getElementById('mentorInput')?.addEventListener('keydown', e=>{
    if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){ e.preventDefault(); doFeedback(); }
  });

  /* ── Play last AI response ── */
  document.getElementById('btnPlay')?.addEventListener('click', ()=>{
    const last=[...chat].reverse().find(m=>m.role==='ai');
    Speech.speak(last?last.text:(cur.opener||'Hello, I am '+cur.name));
  });

  /* ── Stop ── */
  document.getElementById('btnStop')?.addEventListener('click', ()=>Speech.stop());

  /* ── Voice Record ── */
  document.getElementById('btnRec')?.addEventListener('click', ()=>{
    const lbl = document.getElementById('recLbl');
    const sts = document.getElementById('recStatus');
    if(!Speech.recAvailable){ toast('Speech recognition requires Chrome/Edge browser.'); return; }
    if(!isRecording){
      isRecording=true;
      if(lbl) lbl.textContent='Stop';
      if(sts) sts.textContent='🎤 Listening…';
      Speech.startRecognition({
        onPartial: t=>{ if(input) input.value=t; },
        onEnd: t=>{ isRecording=false; if(lbl) lbl.textContent='Record'; if(sts) sts.textContent=t?'✓ Voice captured':''; if(t&&input) input.value=t; },
        onError: ()=>{ isRecording=false; if(lbl) lbl.textContent='Record'; if(sts) sts.textContent='Mic error'; }
      });
    } else {
      Speech.stopRecognition(); isRecording=false;
      if(lbl) lbl.textContent='Record'; if(sts) sts.textContent='';
    }
  });

  /* ── Save chat ── */
  document.getElementById('btnSave')?.addEventListener('click', ()=>{
    if(!chat.length){ toast('No conversation yet.'); return; }
    const lines=[`Wayang Lingua Nusantara — Mentor Session`,`Mentor: ${cur.name} (${cur.role})`,`Date: ${new Date().toLocaleString()}`,'─'.repeat(50),...chat.map(m=>`[${m.role==='user'?'You':cur.name}]\n${m.text}\n`)];
    download(`WLN_${cur.name}_${Date.now()}.txt`,lines.join('\n'),'text/plain');
    toast('Chat saved.');
  });

  /* ── Clear ── */
  document.getElementById('btnClear')?.addEventListener('click', ()=>{
    if(!confirm('Clear conversation with '+cur.name+'?')) return;
    r.mentorChats[cur.id]=[]; save(); Views.mentors(el);
  });
};

/* ====================== PROGRESS ====================== */
Views.progress = function(el){
  const r = rec(), u = me();
  const lvl = levelFor(r.xp);
  const axes = Object.entries(r.skills).map(([label,value])=>({label,value}));
  const weekSessions = r.speakingSessions.filter(s=>new Date(s.date)>Date.now()-7*864e5).length + Math.min(r.streak,7);

  el.innerHTML = `
    <div class="grid2">
      <div class="panel ornate">
        <h3 class="panelTitle">Performance Overview<span class="chip">${lvl.level} \u2014 ${lvl.name}</span></h3>
        <div style="display:grid;place-items:center">${Charts.radar(axes,{size:270})}</div>
      </div>
      <div class="panel">
        <h3 class="panelTitle">Skill Breakdown</h3>
        ${Charts.skillBars(r.skills)}
        <hr class="divider">
        <div class="grid3" style="gap:10px">
          <div class="stat" style="padding:12px"><div><b>${weekSessions}</b><span>Sessions / wk</span></div></div>
          <div class="stat" style="padding:12px"><div><b>${r.xp.toLocaleString()}</b><span>Total XP</span></div></div>
          <div class="stat" style="padding:12px"><div><b>${r.vocabCount}</b><span>Words mastered</span></div></div>
        </div>
      </div>
    </div>
    <div class="grid2" style="margin-top:16px">
      <div class="panel">
        <h3 class="panelTitle">Learning Growth ${r.preTest?'<span class="chip dim">Pre vs Current</span>':''}</h3>
        ${r.preTest ? Charts.bars(
            ['Listening','Speaking','Reading','Writing'],
            [{name:'Pre-test',color:'#4a6a9a',values:['Listening','Speaking','Reading','Writing'].map(k=>r.preTest[k]||0)},
             {name:'Current',color:Charts.C.gold,values:['Listening','Speaking','Reading','Writing'].map(k=>r.skills[k]||0)}],
            {h:200})
          + `<div class="legend" style="flex-direction:row;gap:18px;margin-top:4px">
              <span class="li"><span class="dot" style="background:#4a6a9a"></span>Pre-test</span>
              <span class="li"><span class="dot" style="background:${Charts.C.gold}"></span>Current</span></div>`
          : `<p class="small muted">Take the placement pre-test to unlock growth tracking for research.</p>
             <button class="btn primary small" id="takePre">Take Pre-Test (10 min)</button>`}
      </div>
      <div class="panel">
        <h3 class="panelTitle">Lakon Completion</h3>
        ${Charts.line(WLN.MEETINGS.slice(0,8).map(m=>({label:'L'+m.id, value:lessonPct(m.id)})),{h:170,max:100,unit:'%'})}
        <p class="small muted" style="margin:4px 0 0">${r.lessonsDone} of 16 lakon completed \u2022 ${r.writingCount} reflections submitted</p>
      </div>
    </div>`;

  $('#takePre')?.addEventListener('click',()=>runPlacement('preTest'));
};

function runPlacement(kind){
  const qs = [
    { q:'Choose the correct sentence:', opts:['She go to campus every day.','She goes to campus every day.','She going campus every day.','She gone to campus every day.'], a:1, skill:'Writing' },
    { q:'\u201cWayang is a UNESCO-recognised _____ of Indonesia.\u201d', opts:['heritage','hesitate','heritage\u2019s','heriting'], a:0, skill:'Reading' },
    { q:'Which reply is most polite in a formal discussion?', opts:['No, wrong.','I see your point, however the evidence suggests otherwise.','Whatever you say.','You don\u2019t understand.'], a:1, skill:'Speaking' },
    { q:'\u201cThe dalang paused ____ the audience could feel the moment.\u201d', opts:['so that','because of','despite','unless'], a:0, skill:'Writing' },
    { q:'A \u201cturning point\u201d in a story is\u2026', opts:['the list of characters','the moment everything changes','the closing music','the stage decoration'], a:1, skill:'Listening' },
    { q:'Choose the best academic upgrade for \u201cvery important\u201d:', opts:['super important','really very important','essential','importantful'], a:2, skill:'Writing' },
    { q:'\u201cShe has lived in Java ____ 2019.\u201d', opts:['since','for','during','from'], a:0, skill:'Reading' },
    { q:'In word stress, \u201cphoTOgraphy\u201d has stress on syllable\u2026', opts:['1st','2nd','3rd','4th'], a:1, skill:'Speaking' },
  ];
  modal(kind==='preTest'?'Placement Pre-Test':'Post-Test', `<div id="quizBox"></div>`);
  let idx=0, correct=0, bySkill={Listening:[],Speaking:[],Reading:[],Writing:[]};
  function step(){
    const box=$('#quizBox');
    if(idx>=qs.length){
      const pct=k=>{const a=bySkill[k];return a.length?Math.round(a.reduce((x,y)=>x+y,0)/a.length*100):Math.round(correct/qs.length*100)};
      const result={Listening:pct('Listening'),Speaking:pct('Speaking'),Reading:pct('Reading'),Writing:pct('Writing'),Overall:Math.round(correct/qs.length*100)};
      rec()[kind]=result; checkBadges(); save();
      box.innerHTML=`<p>Done! Overall: <b class="gold">${result.Overall}%</b></p><p class="small muted">Saved to your Research Passport. ${kind==='preTest'?'Your growth will now be tracked against this baseline.':''}</p>`;
      setTimeout(()=>{ closeModal(); App.refresh(); }, 1800);
      return;
    }
    const q=qs[idx];
    box.innerHTML=`<p class="small muted">Question ${idx+1}/${qs.length}</p><p style="font-weight:600">${esc(q.q)}</p>
      ${q.opts.map((o,i)=>`<button class="quizOpt" data-i="${i}">${esc(o)}</button>`).join('')}`;
    $$('.quizOpt',box).forEach(b=>b.addEventListener('click',()=>{
      const ok=+b.dataset.i===q.a; if(ok)correct++;
      bySkill[q.skill].push(ok?1:0);
      b.classList.add(ok?'right':'wrong');
      setTimeout(()=>{idx++;step()},500);
    }));
  }
  step();
}
window.runPlacement = runPlacement;

/* ====================== BADGES ====================== */
Views.badges = function(el){
  const r = rec();
  el.innerHTML = `
    <p class="sub" style="margin:0 0 16px">Honours of the kelir \u2014 earned through practice, performance, and persistence.</p>
    <div class="badgeGrid">
      ${WLN.BADGES.map(b=>{
        const got = r.badges.includes(b.id);
        return `<div class="badgeCard ${got?'earned':''}">
          <div class="shield">${b.icon}</div>
          <b>${esc(b.name)}</b><span>${esc(b.how)}</span>
          ${got?'<span class="chip" style="margin-top:8px">Earned</span>':''}
        </div>`;
      }).join('')}
    </div>`;
};
