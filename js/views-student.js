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
  const all = [...WLN.MENTORS, ...WLN.HEROES];
  const cur = all.find(x=>x.id===App.ctx.mentorId) || WLN.MENTORS[0];
  App.ctx.mentorId = cur.id;
  const chat = r.mentorChats[cur.id] || (r.mentorChats[cur.id]=[]);
  const lesson = WLN.MEETINGS.find(x=>x.id==App.ctx.lessonId);

  el.innerHTML = `
    <p class="sub" style="margin:0 0 14px">Your wayang mentors guide your journey \u2014 choose a guide, write or paste your English, and receive feedback in their voice.</p>
    <div class="mentorGrid" style="margin-bottom:18px">
      ${all.map(c=>`
        <div class="mentorCard ${c.id===cur.id?'active':''}" data-mentor="${c.id}">
          <div class="portraitWrap">${portrait(c)}</div>
          <b>${esc(c.name)}</b><span class="mRole">${esc(c.role)}</span>
          <p>${esc(c.focus)}</p>
        </div>`).join('')}
    </div>
    <div class="gridMain">
      <div class="panel ornate">
        <h3 class="panelTitle">${esc(cur.name)} \u2014 ${esc(cur.role)}
          <span class="chip ${state.apiKey?'teal':'dim'}">${state.apiKey?'Live AI':'Built-in coach'}</span></h3>
        <div class="chatLog" id="chatLog">
          ${chat.length? chat.map(msgBubble).join('') :
            `<div class="bubble ai"><span class="who">${esc(cur.name)}</span>${esc(cur.opener||cur.focus)}</div>`}
        </div>
        <textarea class="input" id="mentorInput" placeholder="Write a sentence, paragraph, speech script, or question for ${esc(cur.name)}..." style="min-height:84px"></textarea>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn primary" id="askMentor">Get Feedback</button>
          <button class="btn" id="listenLast">${Icons.play} Listen</button>
          <button class="btn" id="stopTts">${Icons.stopIc} Stop</button>
          <button class="btn" id="clearChat">Clear</button>
        </div>
      </div>
      <div class="panel">
        <h3 class="panelTitle">About this Mentor</h3>
        <div style="text-align:center;margin-bottom:12px"><div class="portraitWrap lg" style="margin:0 auto">${portrait(cur)}</div></div>
        <p class="small" style="line-height:1.65">${esc(cur.desc||cur.focus)}</p>
        <p class="small muted">Style: ${esc(cur.style||'supportive and clear')}.</p>
        <hr class="divider">
        <p class="small muted">Tip: paste your writing from the Studio, or a transcript from the Theatre, and ${esc(cur.name)} will review it through the lens of <b>${esc(cur.focus.split(',')[0])}</b>.</p>
      </div>
    </div>`;

  function msgBubble(mn){
    return mn.role==='user'
      ? `<div class="bubble user">${esc(mn.text)}</div>`
      : `<div class="bubble ai"><span class="who">${esc(cur.name)}</span>${esc(mn.text)}</div>`;
  }
  const log = $('#chatLog');
  const scrollEnd=()=>{ log.scrollTop=log.scrollHeight; };

  $$('[data-mentor]').forEach(c=>c.addEventListener('click',()=>{ App.ctx.mentorId=c.dataset.mentor; Views.mentors(el); }));
  $('#askMentor').addEventListener('click', async ()=>{
    const txt=$('#mentorInput').value.trim();
    if(!txt){ toast('Write something for your mentor first.'); return; }
    chat.push({role:'user',text:txt,date:new Date().toISOString()});
    log.insertAdjacentHTML('beforeend', msgBubble(chat.at(-1)));
    $('#mentorInput').value=''; scrollEnd();
    log.insertAdjacentHTML('beforeend', `<div class="bubble ai thinking"><span class="who">${esc(cur.name)}</span>\u2026</div>`); scrollEnd();
    let reply=null;
    if(state.apiKey){ try{ reply = await Mentor.liveReply(cur, chat, txt, lesson); }catch(e){ reply=null; } }
    if(!reply) reply = Mentor.reply(cur, txt, lesson?lesson.vocab:[]);
    $('.thinking',log)?.remove();
    chat.push({role:'ai',text:reply,date:new Date().toISOString()});
    log.insertAdjacentHTML('beforeend', msgBubble(chat.at(-1))); scrollEnd();
    addXP(25,'Mentor session'); save();
  });
  $('#listenLast').addEventListener('click',()=>{
    const last=[...chat].reverse().find(c=>c.role==='ai');
    Speech.speak(last? last.text : (cur.opener||'Hello, I am '+cur.name));
  });
  $('#stopTts').addEventListener('click',()=>Speech.stop());
  $('#clearChat').addEventListener('click',()=>{ r.mentorChats[cur.id]=[]; save(); Views.mentors(el); });
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
