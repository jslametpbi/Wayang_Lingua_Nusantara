/* views-teacher.js — Wayang Lingua Nusantara
   Lecturer · Admin interface
   © Dr. Joko Slamet 2026 — All rights reserved */
'use strict';
window.Views = window.Views || {};

/* ─────────────────────── HELPERS ─────────────────────── */
const _CC = {A1:'#4caf7d',A2:'#66bb6a',B1:'#ffa726',B2:'#ef6c00',C1:'#ab47bc',C2:'#e53935'};
function cefrChip(lv){ return `<span class="cefr" style="background:${_CC[lv]||'#888'};font-size:11px;padding:2px 9px">${esc(lv)}</span>`; }
function stChip(s){ const c={pending:'var(--warn)',done:'var(--teal)',info:'var(--plum)'}; return `<span class="chip" style="background:${c[s]||'var(--navy-3)'};font-size:11px;text-transform:capitalize">${s}</span>`; }
function barFill(v,color='var(--gold)'){ return `<div class="bar"><i style="width:${v}%;background:${color}"></i></div>`; }
function avgArr(arr){ return arr.length ? Math.round(arr.reduce((a,b)=>a+b,0)/arr.length) : 0; }
function pendingCount(){ return state.submissions.filter(s=>s.status==='pending').length; }
function totalStudents(){ return state.classes.reduce((a,c)=>a+c.students,0); }
function avgProg(){ return avgArr(state.classes.map(c=>c.progress)); }
function stuName(sid){ const s=WLN.SEED_STUDENTS.find(x=>x.id===sid); return s?s.name:'Student'; }
function skillAvg(key){ return avgArr(WLN.SEED_STUDENTS.map(s=>s.skills[key])); }
function preAvg(key){ return avgArr(WLN.SEED_STUDENTS.map(s=>s.pre[key]||s.pre.Overall)); }

/* QR-style HTML grid (uses .qr CSS class) */
function qrHTML(seed){
  let h=5381; for(let i=0;i<seed.length;i++) h=((h<<5)+h+seed.charCodeAt(i))|0;
  const C=21;
  let cells='';
  for(let r=0;r<C;r++) for(let c=0;c<C;c++){
    const inFinder=(r<7&&c<7)||(r<7&&c>=C-7)||(r>=C-7&&c<7);
    const finderEdge=inFinder&&(r===0||r===6||c===0||c===6||(r>=C-7&&(r===C-7||r===C-1))||(c>=C-7&&(c===C-7||c===C-1)));
    const finderInner=inFinder&&(r>=2&&r<=4&&c>=2&&c<=4)&&!(r>=C-5&&c<7);
    const finderInner2=inFinder&&r>=C-5&&r<=C-3&&c>=2&&c<=4;
    const timing=!inFinder&&(r===6||c===6)&&(r+c)%2===0;
    const data=!inFinder&&r!==6&&c!==6&&((Math.abs(h^(r*31^c*17)^(r*c*7))%5)>1);
    const on=finderEdge||finderInner||finderInner2||timing||data;
    cells+=`<i${on?'':' class="off"'}></i>`;
  }
  return `<div class="qr">${cells}</div>`;
}

/* ═══════════════════════ DASHBOARD ═══════════════════════ */
Views.dashboard = function(el){
  const u = me();
  const name = u ? u.name : 'Lecturer';
  const classes = state.classes;
  const pend = state.submissions.filter(s=>s.status==='pending');

  el.innerHTML = `
    <div class="topActions" style="margin-bottom:18px">
      <div>
        <div class="eyebrow" style="color:var(--gold);font-size:11px;letter-spacing:.12em;margin-bottom:4px">SELAMAT DATANG KEMBALI</div>
        <h2 style="font-size:21px;margin:0">${esc(name)}</h2>
      </div>
      <button class="btn small primary" data-go="assessments">+ New Assessment</button>
    </div>

    <div class="statGrid">
      <div class="stat"><span class="ic">${Icons.classes}</span><b>${classes.length}</b><span>Classes</span></div>
      <div class="stat"><span class="ic">${Icons.students}</span><b>${totalStudents()}</b><span>Students</span></div>
      <div class="stat"><span class="ic">${Icons.progress}</span><b>${avgProg()}%</b><span>Avg Progress</span></div>
      <div class="stat"><span class="ic">${Icons.assignment}</span><b>${pendingCount()}</b><span>Pending Reviews</span></div>
    </div>

    <div class="gridMain">
      <div style="display:flex;flex-direction:column;gap:16px">

        <div class="panel ornate">
          <h3 class="panelTitle">Class Overview <span class="link" data-go="classes">View All</span></h3>
          ${classes.map(c=>`
            <div class="rowItem" data-go="classes" data-classid="${c.id}" style="cursor:pointer">
              <div class="grow">
                <b>${esc(c.title)}</b>
                <div class="meta">${cefrChip(c.level)} &nbsp;${c.students} students</div>
                ${barFill(c.progress,'var(--gold)')}
              </div>
              <span style="font-size:13px;color:var(--gold-bright);font-weight:700;margin-left:12px">${c.progress}%</span>
            </div>`).join('')}
        </div>

        <div class="panel ornate">
          <h3 class="panelTitle">Achievement Overview</h3>
          ${['Listening','Speaking','Reading','Writing','Culture'].map(sk=>`
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
              <span style="width:72px;font-size:12.5px;color:var(--cream-dim)">${sk}</span>
              <div class="bar" style="flex:1"><i style="width:${skillAvg(sk)}%"></i></div>
              <b style="width:36px;text-align:right;font-size:13px;color:var(--gold-bright)">${skillAvg(sk)}%</b>
            </div>`).join('')}
        </div>

        <div class="panel ornate">
          <h3 class="panelTitle">Pending Reviews <span class="chip" style="font-size:11px;padding:2px 8px">${pend.length}</span></h3>
          ${pend.length===0?'<p class="muted" style="font-size:13px">All caught up — no pending submissions.</p>':pend.map(s=>`
            <div class="rowItem" style="cursor:pointer" data-go="assessments" data-subid="${s.id}">
              <div class="grow">
                <b>${esc(s.title)}</b>
                <div class="meta">${esc(stuName(s.student))} · ${s.type} · ${cefrChip(s.cls)} · <span style="color:var(--cream-dim)">${s.when}</span></div>
              </div>
              ${stChip(s.status)}
            </div>`).join('')}
        </div>

      </div>
      <div style="display:flex;flex-direction:column;gap:16px">

        <div class="panel ornate">
          <h3 class="panelTitle">CEFR Distribution</h3>
          <div style="display:flex;justify-content:center;margin-bottom:12px">
            ${Charts.donut(
              WLN.CEFR_DIST.map(d=>({label:d[0],value:d[2],color:_CC[d[0]]})),
              {size:160,thick:22,centerTop:`${totalStudents()}`,centerSub:'students'}
            )}
          </div>
          <div class="legend">
            ${WLN.CEFR_DIST.map(d=>`
              <div class="li">
                <span class="dot" style="background:${_CC[d[0]]}"></span>
                <span>${d[0]}</span>
                <span class="pct">${d[1]} students (${d[2]}%)</span>
              </div>`).join('')}
          </div>
        </div>

        <div class="panel ornate">
          <h3 class="panelTitle">Recent Activity</h3>
          ${(state.activity.length? state.activity.slice(0,8) : [
            {text:'Siti Nurhaliza completed Lakon 4',date:new Date(Date.now()-600000).toISOString()},
            {text:'Ahmad Fadli submitted Quiz — Lakon 5',date:new Date(Date.now()-2100000).toISOString()},
            {text:'Dr. Joko Slamet signed in',date:new Date(Date.now()-3600000).toISOString()},
            {text:'Dewi Lestari earned Clear Speaker badge',date:new Date(Date.now()-7200000).toISOString()},
          ]).map(a=>`
            <div class="feedItem">
              <span style="width:8px;height:8px;border-radius:50%;background:var(--gold);flex:none;margin-top:5px"></span>
              <span>${esc(a.text)}</span>
              <span class="when">${timeAgo(a.date)}</span>
            </div>`).join('')}
        </div>

      </div>
    </div>`;

  // sub-row click delegation (classId passthrough)
  $$('[data-go][data-classid]',el).forEach(el2=>{
    el2.addEventListener('click',()=>{ App.ctx.classId=el2.dataset.classid; App.go('classes'); });
  });
  $$('[data-go][data-subid]',el).forEach(el2=>{
    el2.addEventListener('click',()=>{ App.ctx.submissionId=el2.dataset.subid; App.go('assessments'); });
  });
};

/* ═══════════════════════ CLASSES ═══════════════════════ */
Views.classes = function(el){
  const cid = App.ctx.classId;
  if(cid){
    const cls = state.classes.find(c=>c.id===cid);
    const stus = WLN.SEED_STUDENTS.filter(s=>s.classId===cid);
    el.innerHTML = `
      <div class="topActions" style="margin-bottom:16px">
        <button class="btn small" data-go="classes" id="backCls">← All Classes</button>
        <h2 style="margin:0;flex:1">${esc(cls?.title||'Class')}</h2>
        ${cefrChip(cls?.level||'B1')}
      </div>
      <div class="statGrid" style="margin-bottom:18px">
        <div class="stat"><b>${cls?.students||0}</b><span>Students</span></div>
        <div class="stat"><b>${cls?.progress||0}%</b><span>Avg Progress</span></div>
        <div class="stat"><b>${stus.length}</b><span>Tracked</span></div>
        <div class="stat"><b>${stus.length ? avgArr(stus.map(s=>s.post.Overall))+'%': '--'}</b><span>Avg Post-Test</span></div>
      </div>
      <div class="panel ornate">
        <h3 class="panelTitle">Student Roster</h3>
        <table class="table">
          <thead><tr><th>Student</th><th>CEFR</th><th>Sessions/wk</th><th>Vocab Gained</th><th>Post-Test</th><th></th></tr></thead>
          <tbody>
            ${stus.map(s=>`<tr>
              <td><b style="font-size:13.5px">${esc(s.name)}</b><br><span class="muted small">${esc(s.email)}</span></td>
              <td>${cefrChip(s.cefr)}</td>
              <td>${s.sessionsWk}</td>
              <td>+${s.vocabGained}</td>
              <td><b style="color:var(--gold-bright)">${s.post.Overall}%</b></td>
              <td><button class="btn small" data-stuview="${s.id}">Detail →</button></td>
            </tr>`).join('')}
            ${stus.length===0?`<tr><td colspan="6" class="muted" style="text-align:center;padding:20px">No tracked students in this class.</td></tr>`:''}
          </tbody>
        </table>
      </div>`;
    $('#backCls')?.addEventListener('click',()=>{ App.ctx.classId=null; App.go('classes'); });
    $$('[data-stuview]',el).forEach(btn=>btn.addEventListener('click',()=>{
      App.ctx.studentId=btn.dataset.stuview; App.go('students');
    }));
    return;
  }

  el.innerHTML = `
    <div class="topActions" style="margin-bottom:18px">
      <h2 style="margin:0;flex:1">My Classes</h2>
      <button class="btn small primary">+ New Class</button>
    </div>
    <div class="grid2">
      ${state.classes.map(c=>`
        <div class="panel ornate" style="cursor:pointer" data-clscard="${c.id}">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
            <span style="font-size:22px">${Icons.classes}</span>
            <div>
              <b style="font-size:15px">${esc(c.title)}</b>
              <div class="meta" style="font-size:12px;margin-top:2px">${cefrChip(c.level)} · ${c.students} students</div>
            </div>
          </div>
          <div style="margin:10px 0 4px;font-size:12px;color:var(--cream-dim)">Progress</div>
          ${barFill(c.progress)}
          <div style="text-align:right;font-size:13px;color:var(--gold-bright);font-weight:700;margin-top:4px">${c.progress}%</div>
          <button class="btn small" style="margin-top:12px" data-clscard="${c.id}">View Class →</button>
        </div>`).join('')}
    </div>`;
  $$('[data-clscard]',el).forEach(el2=>el2.addEventListener('click',()=>{
    App.ctx.classId=el2.dataset.clscard; App.go('classes');
  }));
};

/* ═══════════════════════ STUDENTS ═══════════════════════ */
Views.students = function(el){
  const sid = App.ctx.studentId;
  if(sid){
    const s = WLN.SEED_STUDENTS.find(x=>x.id===sid) || WLN.SEED_STUDENTS[0];
    const gains = Object.fromEntries(
      Object.entries(s.skills).map(([k,v])=>[k,v-(s.pre[k]||s.pre.Overall)])
    );
    el.innerHTML = `
      <div class="topActions" style="margin-bottom:16px">
        <button class="btn small" id="backStu">← All Students</button>
        <h2 style="margin:0;flex:1">${esc(s.name)}</h2>
        ${cefrChip(s.cefr)}
      </div>
      <div class="statGrid" style="margin-bottom:20px">
        <div class="stat"><b>${s.sessionsWk}</b><span>Sessions / wk</span></div>
        <div class="stat"><b>${s.studyTime}</b><span>Study Time / wk</span></div>
        <div class="stat"><b>${s.activities}%</b><span>Activities Done</span></div>
        <div class="stat"><b>+${s.vocabGained}</b><span>Vocab Gained</span></div>
      </div>
      <div class="gridMain">
        <div style="display:flex;flex-direction:column;gap:16px">
          <div class="panel ornate">
            <h3 class="panelTitle">Skill Profile</h3>
            <div style="display:flex;justify-content:center">
              ${Charts.radar(Object.entries(s.skills).map(([label,value])=>({label,value})))}
            </div>
          </div>
          <div class="panel ornate">
            <h3 class="panelTitle">Pre → Post Comparison</h3>
            ${['Listening','Speaking','Reading','Writing'].map(k=>`
              <div style="margin-bottom:12px">
                <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--cream-dim);margin-bottom:4px">
                  <span>${k}</span><span>+${gains[k]||0} points</span>
                </div>
                <div style="display:flex;gap:6px;align-items:center">
                  <span style="width:24px;font-size:11.5px;color:var(--cream-dim)">${s.pre[k]||s.pre.Overall}</span>
                  ${barFill(s.pre[k]||s.pre.Overall,'rgba(215,169,40,.35)')}
                </div>
                <div style="display:flex;gap:6px;align-items:center;margin-top:4px">
                  <span style="width:24px;font-size:11.5px;color:var(--gold-bright)">${s.skills[k]}</span>
                  ${barFill(s.skills[k],'var(--gold)')}
                </div>
              </div>`).join('')}
            <div style="display:flex;gap:16px;font-size:11.5px;margin-top:4px">
              <span style="display:flex;align-items:center;gap:6px"><i style="width:14px;height:6px;border-radius:3px;background:rgba(215,169,40,.35);display:inline-block"></i> Pre-Test</span>
              <span style="display:flex;align-items:center;gap:6px"><i style="width:14px;height:6px;border-radius:3px;background:var(--gold);display:inline-block"></i> Current</span>
            </div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:16px">
          <div class="panel ornate">
            <h3 class="panelTitle">Overall Scores</h3>
            <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
              ${Charts.ring(s.pre.Overall,{size:88,thick:8,color:'rgba(215,169,40,.45)',label:'Pre'})}
              ${Charts.ring(s.post.Overall,{size:88,thick:8,color:'var(--gold)',label:'Post'})}
            </div>
            <div style="display:flex;gap:24px;justify-content:center;font-size:11.5px;margin-top:8px">
              <span class="muted">Pre-Test: <b style="color:var(--cream)">${s.pre.Overall}</b></span>
              <span class="muted">Post-Test: <b style="color:var(--gold-bright)">${s.post.Overall}</b></span>
            </div>
          </div>
          <div class="panel ornate">
            <h3 class="panelTitle">Contact</h3>
            <p style="font-size:13px;color:var(--cream-dim);margin:0 0 8px">${esc(s.email)}</p>
            <p style="font-size:13px;color:var(--cream-dim);margin:0">
              Class: <b style="color:var(--cream)">${state.classes.find(c=>c.id===s.classId)?.title||s.classId}</b>
            </p>
          </div>
          <div class="panel ornate">
            <h3 class="panelTitle">Actions</h3>
            <div style="display:flex;flex-direction:column;gap:8px">
              <button class="btn small" id="issueCertBtn">Issue Certificate</button>
              <button class="btn small" id="msgStudentBtn">Send Feedback</button>
              <button class="btn small" data-go="passport">Research Passport</button>
            </div>
          </div>
        </div>
      </div>`;
    $('#backStu')?.addEventListener('click',()=>{ App.ctx.studentId=null; App.go('students'); });
    $('#issueCertBtn')?.addEventListener('click',()=>{ App.ctx.certStudentId=s.id; App.go('certificate'); });
    $('#msgStudentBtn')?.addEventListener('click',()=>toast('Message sent to '+s.name));
    return;
  }

  el.innerHTML = `
    <div class="topActions" style="margin-bottom:18px">
      <h2 style="margin:0;flex:1">Students</h2>
    </div>
    <div class="panel ornate">
      <table class="table">
        <thead><tr><th>Name</th><th>Class</th><th>CEFR</th><th>Sessions/wk</th><th>Vocab</th><th>Post-Test</th><th></th></tr></thead>
        <tbody>
          ${WLN.SEED_STUDENTS.map(s=>`<tr>
            <td><b>${esc(s.name)}</b><br><span class="muted small">${esc(s.email)}</span></td>
            <td class="small muted">${state.classes.find(c=>c.id===s.classId)?.title||s.classId}</td>
            <td>${cefrChip(s.cefr)}</td>
            <td>${s.sessionsWk}</td>
            <td>+${s.vocabGained}</td>
            <td><b style="color:var(--gold-bright)">${s.post.Overall}%</b></td>
            <td><button class="btn small" data-stuview="${s.id}">View →</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
  $$('[data-stuview]',el).forEach(btn=>btn.addEventListener('click',()=>{
    App.ctx.studentId=btn.dataset.stuview; App.go('students');
  }));
};

/* ═══════════════════════ ASSESSMENTS ═══════════════════════ */
Views.assessments = function(el){
  const subId = App.ctx.submissionId;
  if(subId){
    const sub = state.submissions.find(s=>s.id===subId) || state.submissions[0];
    const sname = stuName(sub.student);
    let activeTab = App.ctx._asmTab || 'feedback';

    function renderReview(){
      el.innerHTML = `
        <div class="topActions" style="margin-bottom:16px">
          <button class="btn small" id="backAsm">← Assessments</button>
          <h2 style="margin:0;flex:1">${esc(sub.title)}</h2>
          ${stChip(sub.status)}
        </div>
        <div class="gridMain">
          <div style="display:flex;flex-direction:column;gap:16px">
            <div class="panel ornate" style="display:flex;gap:20px;align-items:center">
              <div style="text-align:center;flex:none">
                ${Charts.ring(sub.score||78,{size:92,thick:10,color:'var(--gold)',label:'Score'})}
                <div style="font-size:12px;color:var(--cream-dim);margin-top:6px">Overall Score</div>
              </div>
              <div style="flex:1">
                <div style="font-size:18px;font-weight:700;margin-bottom:4px">${esc(sname)}</div>
                <div class="meta muted small">${sub.type} · ${cefrChip(sub.cls)} · Submitted ${sub.when}</div>
                <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
                  <span class="chip teal">Submitted on time</span>
                  <span class="chip">${sub.type}</span>
                  ${cefrChip(sub.cls)}
                </div>
              </div>
            </div>
            <div class="panel ornate">
              <div style="display:flex;gap:0;border-bottom:1px solid var(--line-soft);margin-bottom:16px">
                ${['feedback','rubric','insights'].map(t=>`
                  <button class="btn small" id="tab_${t}" style="border-radius:0;border:none;padding:10px 18px;background:${activeTab===t?'rgba(215,169,40,.12)':'transparent'};color:${activeTab===t?'var(--gold-bright)':'var(--cream-dim)'};border-bottom:2px solid ${activeTab===t?'var(--gold)':'transparent'}">
                    ${t==='feedback'?'Feedback':t==='rubric'?'Rubric':'AI Insights'}
                  </button>`).join('')}
              </div>
              ${activeTab==='feedback'?`
                <div style="margin-bottom:14px">
                  <div style="font-size:12px;color:var(--gold);letter-spacing:.1em;margin-bottom:8px">STRENGTHS</div>
                  <div style="display:flex;flex-wrap:wrap;gap:6px">
                    <span class="chip teal">Clear Pronunciation</span>
                    <span class="chip teal">Relevant Vocabulary</span>
                    <span class="chip teal">Natural Fluency</span>
                  </div>
                </div>
                <div style="margin-bottom:16px">
                  <div style="font-size:12px;color:var(--warn);letter-spacing:.1em;margin-bottom:8px">AREAS FOR IMPROVEMENT</div>
                  <div style="display:flex;flex-wrap:wrap;gap:6px">
                    <span class="chip" style="border-color:var(--warn);color:var(--warn)">Sentence Complexity</span>
                    <span class="chip" style="border-color:var(--warn);color:var(--warn)">Reduce Filler Words</span>
                  </div>
                </div>
                <label style="font-size:12px;color:var(--cream-dim);display:block;margin-bottom:6px">Instructor Comments</label>
                <textarea class="input" id="asmComment" rows="4" placeholder="Add your feedback for the student…"></textarea>
                <div style="margin-top:12px;display:flex;gap:8px">
                  <select class="input" id="asmGrade" style="width:auto">
                    <option>Distinction</option><option selected>Merit</option><option>Pass</option><option>Needs Improvement</option>
                  </select>
                  <button class="btn primary" id="markDoneBtn">Mark Reviewed</button>
                  <button class="btn small" id="reqResubBtn">Request Resubmission</button>
                </div>`:
              activeTab==='rubric'?`
                <table class="table">
                  <thead><tr><th>Criterion</th><th>Weight</th><th>Score</th></tr></thead>
                  <tbody>
                    ${[['Pronunciation & Clarity','30%',22],['Vocabulary Range','25%',19],['Fluency & Pace','25%',20],['Cultural Engagement','20%',17]].map(([c,w,s])=>`
                    <tr><td>${c}</td><td class="muted">${w}</td><td><b style="color:var(--gold-bright)">${s}/${parseInt(w)*1}</b></td></tr>`).join('')}
                  </tbody>
                </table>`:
              `
                <div id="insightBox" style="min-height:80px">
                  <div class="muted small" style="margin-bottom:12px">
                    ${state.apiKey ? 'Generating AI analysis…' : 'Connect an Anthropic API key in Settings to enable live AI insights.'}
                  </div>
                  ${!state.apiKey?`
                    <div style="padding:14px;background:rgba(215,169,40,.07);border-radius:10px;font-size:13.5px">
                      <b style="display:block;margin-bottom:6px;color:var(--gold)">Sample AI Insight</b>
                      The student demonstrates solid phonemic awareness, particularly with fricatives and nasals. 
                      Vocabulary use aligns with B1 descriptors, with occasional B2-level collocations. 
                      Recommend focusing on subordinate clause variety and reducing discourse markers 
                      ("like", "you know") through structured practice with Petruk's pronunciation module.
                    </div>`:''
                  }
                </div>`}
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:14px">
            <div class="panel ornate">
              <h3 class="panelTitle">Score Breakdown</h3>
              ${[['Pronunciation',74],['Fluency',81],['Vocabulary',80],['Development',77]].map(([k,v])=>`
                <div style="margin-bottom:10px">
                  <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--cream-dim);margin-bottom:4px"><span>${k}</span><b style="color:var(--gold-bright)">${v}%</b></div>
                  ${barFill(v)}
                </div>`).join('')}
            </div>
            <div class="panel ornate">
              <h3 class="panelTitle">Other Submissions</h3>
              ${state.submissions.filter(x=>x.id!==subId).slice(0,4).map(x=>`
                <div class="feedItem" style="cursor:pointer" data-subid="${x.id}">
                  <span style="width:8px;height:8px;border-radius:50%;background:${x.status==='pending'?'var(--warn)':'var(--teal)'};flex:none;margin-top:4px"></span>
                  <div class="grow"><b style="font-size:12.5px">${esc(x.title)}</b><div class="muted small">${esc(stuName(x.student))}</div></div>
                </div>`).join('')}
            </div>
          </div>
        </div>`;
      $('#backAsm')?.addEventListener('click',()=>{ App.ctx.submissionId=null; App.go('assessments'); });
      ['feedback','rubric','insights'].forEach(t=>{
        $(`#tab_${t}`)?.addEventListener('click',()=>{ App.ctx._asmTab=t; activeTab=t; renderReview(); });
      });
      $('#markDoneBtn')?.addEventListener('click',()=>{
        const sub2=state.submissions.find(s=>s.id===subId);
        if(sub2){ sub2.status='done'; sub2.score=$('#asmGrade')?.value==='Distinction'?92:$('#asmGrade')?.value==='Merit'?78:$('#asmGrade')?.value==='Pass'?68:55; save(); }
        toast('Submission marked as reviewed'); App.ctx.submissionId=null; App.go('assessments');
      });
      $('#reqResubBtn')?.addEventListener('click',()=>{ toast('Resubmission request sent'); });
      $$('[data-subid]',el).forEach(item=>item.addEventListener('click',()=>{
        App.ctx.submissionId=item.dataset.subid; App.ctx._asmTab='feedback'; renderReview();
      }));
      if(activeTab==='insights' && state.apiKey){
        Mentor.liveReply(WLN.MENTORS[0],[],'Analyse this speaking submission: strong pronunciation, B1 vocabulary, needs complex sentences.',null)
          .then(r=>{ const box=$('#insightBox'); if(box) box.innerHTML=`<div style="font-size:13.5px;line-height:1.6">${esc(r)}</div>`; })
          .catch(()=>{});
      }
    }
    renderReview();
    return;
  }

  /* Assessment list + Builder tabs */
  const tab = App.ctx._asmListTab || 'list';
  el.innerHTML = `
    <div class="topActions" style="margin-bottom:16px">
      <h2 style="margin:0;flex:1">Assessments</h2>
      <button class="btn small${tab==='list'?' primary':''}" id="tabList">Submissions</button>
      <button class="btn small${tab==='build'?' primary':''}" id="tabBuild">+ Build New</button>
    </div>
    ${tab==='list'?`
      <div class="panel ornate">
        <table class="table">
          <thead><tr><th>Title</th><th>Student</th><th>Type</th><th>Level</th><th>Status</th><th>When</th><th></th></tr></thead>
          <tbody>
            ${state.submissions.map(s=>`<tr>
              <td><b>${esc(s.title)}</b></td>
              <td class="small">${esc(stuName(s.student))}</td>
              <td class="small muted">${s.type}</td>
              <td>${cefrChip(s.cls)}</td>
              <td>${stChip(s.status)}</td>
              <td class="small muted">${s.when}</td>
              <td><button class="btn small" data-subid="${s.id}">Review</button></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>`:
    `
      <div class="panel ornate" style="max-width:640px">
        <h3 class="panelTitle">New Assessment Builder</h3>
        <label class="small muted" style="display:block;margin-bottom:5px">Assessment Title</label>
        <input class="input" id="bldTitle" placeholder="e.g. Speaking Performance — Lakon 7" style="margin-bottom:12px">
        <div class="grid2" style="margin-bottom:12px">
          <div>
            <label class="small muted" style="display:block;margin-bottom:5px">Type</label>
            <select class="input" id="bldType"><option>Speaking</option><option>Writing</option><option>Quiz</option><option>Listening</option></select>
          </div>
          <div>
            <label class="small muted" style="display:block;margin-bottom:5px">CEFR Level</label>
            <select class="input" id="bldLevel"><option>A1</option><option>A2</option><option selected>B1</option><option>B2</option><option>C1</option><option>C2</option></select>
          </div>
        </div>
        <label class="small muted" style="display:block;margin-bottom:5px">Skill Focus</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">
          ${['Listening','Speaking','Reading','Writing','Culture'].map(sk=>`
            <label style="display:flex;align-items:center;gap:5px;font-size:13px;cursor:pointer">
              <input type="checkbox" style="accent-color:var(--gold)"> ${sk}
            </label>`).join('')}
        </div>
        <label class="small muted" style="display:block;margin-bottom:5px">Instructions</label>
        <textarea class="input" id="bldInst" rows="4" placeholder="Provide clear instructions for students…" style="margin-bottom:12px"></textarea>
        <label class="small muted" style="display:block;margin-bottom:5px">Rubric / Criteria</label>
        <textarea class="input" id="bldRubric" rows="3" placeholder="Pronunciation 30%, Vocabulary 25%, Fluency 25%, Engagement 20%" style="margin-bottom:16px"></textarea>
        <button class="btn primary" id="saveAsmBtn">Save Assessment</button>
      </div>`}`;
  $('#tabList')?.addEventListener('click',()=>{ App.ctx._asmListTab='list'; App.go('assessments'); });
  $('#tabBuild')?.addEventListener('click',()=>{ App.ctx._asmListTab='build'; App.go('assessments'); });
  $$('[data-subid]',el).forEach(btn=>btn.addEventListener('click',()=>{ App.ctx.submissionId=btn.dataset.subid; App.ctx._asmTab='feedback'; App.go('assessments'); }));
  $('#saveAsmBtn')?.addEventListener('click',()=>{
    const t=$('#bldTitle')?.value?.trim();
    if(!t){ toast('Please add a title.'); return; }
    state.assessments.push({ id:'a'+Date.now(), title:t, type:$('#bldType')?.value, level:$('#bldLevel')?.value, instructions:$('#bldInst')?.value, rubric:$('#bldRubric')?.value, created:new Date().toISOString() });
    save(); toast('Assessment saved.'); App.ctx._asmListTab='list'; App.go('assessments');
  });
};

/* ═══════════════════════ ANALYTICS ═══════════════════════ */
Views.analytics = function(el){
  const skills=['Listening','Speaking','Reading','Writing','Culture'];
  const prePts=skills.map(k=>preAvg(k));
  const postPts=skills.map(k=>skillAvg(k));

  el.innerHTML = `
    <div class="topActions" style="margin-bottom:18px">
      <h2 style="margin:0;flex:1">Analytics</h2>
      <span class="muted small">Cohort: All Classes · Academic Year 2025/2026</span>
    </div>
    <div class="statGrid" style="margin-bottom:18px">
      <div class="stat"><b>${avgArr(postPts)}%</b><span>Avg Post-Score</span></div>
      <div class="stat"><b>+${avgArr(postPts)-avgArr(prePts)}</b><span>Avg Gain (pts)</span></div>
      <div class="stat"><b>${WLN.SEED_STUDENTS.filter(s=>s.post.Overall>=75).length}</b><span>Students ≥ 75%</span></div>
      <div class="stat"><b>${avgArr(WLN.SEED_STUDENTS.map(s=>s.sessionsWk))}</b><span>Avg Sessions / wk</span></div>
    </div>
    <div class="grid2" style="margin-bottom:16px">
      <div class="panel ornate">
        <h3 class="panelTitle">Pre vs Post by Skill</h3>
        ${Charts.bars(skills,[
          {name:'Pre-Test',color:'rgba(215,169,40,.4)',values:prePts},
          {name:'Current',color:'var(--gold)',values:postPts}
        ],{w:400,h:200,max:100})}
        <div class="legend" style="flex-direction:row;gap:16px;margin-top:10px">
          <div class="li"><span class="dot" style="background:rgba(215,169,40,.4)"></span><span>Pre-Test</span></div>
          <div class="li"><span class="dot" style="background:var(--gold)"></span><span>Current</span></div>
        </div>
      </div>
      <div class="panel ornate">
        <h3 class="panelTitle">CEFR Distribution</h3>
        <div style="display:flex;justify-content:center;margin-bottom:10px">
          ${Charts.donut(WLN.CEFR_DIST.map(d=>({label:d[0],value:d[2],color:_CC[d[0]]})),{size:160,thick:22,centerTop:'124',centerSub:'students'})}
        </div>
        <div class="legend">
          ${WLN.CEFR_DIST.map(d=>`<div class="li"><span class="dot" style="background:${_CC[d[0]]}"></span><span>${d[0]}</span><span class="pct">${d[1]} (${d[2]}%)</span></div>`).join('')}
        </div>
      </div>
    </div>
    <div class="grid2">
      <div class="panel ornate">
        <h3 class="panelTitle">Class Progress Comparison</h3>
        ${Charts.bars(state.classes.map(c=>c.title.split(' ').slice(0,2).join(' ')+'…'),
          [{name:'Progress',color:'var(--gold)',values:state.classes.map(c=>c.progress)}],
          {w:400,h:180,max:100})}
      </div>
      <div class="panel ornate">
        <h3 class="panelTitle">Engagement — Sessions per Student</h3>
        ${Charts.bars(WLN.SEED_STUDENTS.map(s=>s.name.split(' ')[0]),
          [{name:'Sessions/wk',color:'var(--teal)',values:WLN.SEED_STUDENTS.map(s=>Math.round(s.sessionsWk*10)/10)}],
          {w:400,h:180,max:6})}
      </div>
    </div>`;
};

/* ═══════════════════════ RESEARCH PASSPORT ═══════════════════════ */
Views.passport = function(el){
  const ss = WLN.SEED_STUDENTS;
  const skills=['Listening','Speaking','Reading','Writing'];
  const vocabGrowth=[
    {label:'Aug',value:0},{label:'Sep',value:38},{label:'Oct',value:92},
    {label:'Nov',value:168},{label:'Dec',value:248},{label:'Jan',value:312}
  ];
  const avgSessions = (ss.reduce((a,s)=>a+s.sessionsWk,0)/ss.length).toFixed(1);
  const avgVocab = Math.round(ss.reduce((a,s)=>a+s.vocabGained,0)/ss.length);

  function exportCSV(){
    const hdr='StudentID,Name,CEFR,Class,PreL,PreS,PreR,PreW,PreTotal,PostL,PostS,PostR,PostW,PostTotal,VocabGained,SessionsWk,StudyTime,Activities';
    const rows=ss.map(s=>[s.id,`"${s.name}"`,s.cefr,s.classId,s.pre.Listening,s.pre.Speaking,s.pre.Reading,s.pre.Writing,s.pre.Overall,s.post.Listening,s.post.Speaking,s.post.Reading,s.post.Writing,s.post.Overall,s.vocabGained,s.sessionsWk,`"${s.studyTime}"`,s.activities].join(','));
    download('WLN_Research_Data.csv',[hdr,...rows].join('\n'),'text/csv');
  }
  function exportSPSS(){
    const syntax=`DATA LIST FREE\n  / StudentID (A10) Name (A30) CEFR (A2) PreL PreS PreR PreW PreTotal PostL PostS PostR PostW PostTotal VocabGained SessionsWk Activities.\nBEGIN DATA\n${ss.map(s=>`${s.id} "${s.name}" ${s.cefr} ${s.pre.Listening} ${s.pre.Speaking} ${s.pre.Reading} ${s.pre.Writing} ${s.pre.Overall} ${s.post.Listening} ${s.post.Speaking} ${s.post.Reading} ${s.post.Writing} ${s.post.Overall} ${s.vocabGained} ${s.sessionsWk} ${s.activities}`).join('\n')}\nEND DATA.\n\nVARIABLE LABELS\n  StudentID 'Student Identifier'\n  PreTotal 'Pre-Test Overall Score'\n  PostTotal 'Post-Test Overall Score'\n  VocabGained 'Vocabulary Items Acquired'\n  SessionsWk 'Weekly Learning Sessions'.\n\nDESCRIPTIVES VARIABLES=PreTotal PostTotal VocabGained SessionsWk\n  /STATISTICS=MEAN STDDEV MIN MAX.\n\nPAIRED SAMPLES T TEST\n  PAIRS = PreTotal WITH PostTotal.\n`;
    download('WLN_SPSS_Syntax.sps',syntax,'text/plain');
  }
  function exportJSON(){
    download('WLN_Research_Export.json',JSON.stringify({meta:{exported:new Date().toISOString(),tool:'Wayang Lingua Nusantara',researcher:me()?.name||'Lecturer'},students:ss,vocabGrowth},null,2),'application/json');
  }

  el.innerHTML = `
    <div class="topActions" style="margin-bottom:18px;align-items:flex-start">
      <div style="flex:1">
        <h2 style="margin:0 0 4px">Research Passport</h2>
        <p class="muted small" style="margin:0">Authenticated learning evidence for pedagogical research</p>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn small" id="expCsv">Export CSV</button>
        <button class="btn small" id="expSpss">SPSS Syntax</button>
        <button class="btn small primary" id="expJson">JSON Backup</button>
      </div>
    </div>

    <div class="statGrid" style="margin-bottom:18px">
      <div class="stat"><b>${avgSessions}</b><span>Avg Sessions / wk</span></div>
      <div class="stat"><b>4h 28m</b><span>Avg Study Time</span></div>
      <div class="stat"><b>91%</b><span>Activity Completion</span></div>
      <div class="stat"><b>+${avgVocab}</b><span>Avg Vocab Gained</span></div>
    </div>

    <div class="gridMain">
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="panel ornate">
          <h3 class="panelTitle">Pre → Post Test Comparison</h3>
          ${skills.map(k=>{
            const pre=Math.round(ss.reduce((a,s)=>a+(s.pre[k]||s.pre.Overall),0)/ss.length);
            const post=Math.round(ss.reduce((a,s)=>a+(s.skills[k]||0),0)/ss.length);
            return `
              <div style="margin-bottom:13px">
                <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--cream-dim);margin-bottom:4px">
                  <span>${k}</span><span style="color:var(--teal)">+${post-pre} pts gain</span>
                </div>
                <div style="display:flex;gap:6px;align-items:center;margin-bottom:3px">
                  <span style="width:28px;font-size:11px;color:var(--cream-dim)">${pre}</span>${barFill(pre,'rgba(215,169,40,.35)')}
                </div>
                <div style="display:flex;gap:6px;align-items:center">
                  <span style="width:28px;font-size:11px;color:var(--gold-bright)">${post}</span>${barFill(post,'var(--gold)')}
                </div>
              </div>`;}).join('')}
          <div style="display:flex;gap:14px;font-size:11.5px;margin-top:4px">
            <span><i style="width:12px;height:5px;background:rgba(215,169,40,.35);display:inline-block;border-radius:2px;vertical-align:middle"></i> Pre-Test</span>
            <span><i style="width:12px;height:5px;background:var(--gold);display:inline-block;border-radius:2px;vertical-align:middle"></i> Post-Test</span>
          </div>
        </div>
        <div class="panel ornate">
          <h3 class="panelTitle">Vocabulary Growth Trajectory</h3>
          ${Charts.line(vocabGrowth,{w:420,h:170,color:'var(--gold)',unit:'words',max:380})}
          <p class="muted small" style="margin:8px 0 0;text-align:center">Cumulative unique vocab items acquired (avg per student)</p>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="panel ornate">
          <h3 class="panelTitle">Cohort Overview</h3>
          ${ss.map(s=>`
            <div class="rowItem" style="cursor:pointer" data-stuview="${s.id}">
              <div class="grow">
                <b style="font-size:13px">${esc(s.name)}</b>
                <div class="meta" style="font-size:11.5px">${cefrChip(s.cefr)} +${s.vocabGained} vocab · ${s.sessionsWk}×/wk</div>
              </div>
              <div style="text-align:right;font-size:12px">
                <b style="color:var(--gold-bright)">${s.post.Overall}%</b>
                <div class="muted" style="font-size:11px">post-test</div>
              </div>
            </div>`).join('')}
        </div>
        <div class="panel ornate">
          <h3 class="panelTitle">Research Notes</h3>
          <p class="muted small" style="line-height:1.6;margin:0">
            All data is collected with informed consent under the Wayang Lingua Nusantara 
            research framework. Export formats comply with APA 7th edition reporting 
            standards. Pair this dataset with classroom observation notes for triangulation.
          </p>
          <div style="margin-top:12px;padding:10px;background:rgba(215,169,40,.06);border-radius:8px;font-size:12.5px">
            <b style="display:block;color:var(--gold);margin-bottom:4px">Effect Size (Cohen's d)</b>
            Estimated d ≈ <b style="color:var(--gold-bright)">1.42</b> — large effect across all skills.
          </div>
        </div>
      </div>
    </div>`;
  $('#expCsv')?.addEventListener('click',exportCSV);
  $('#expSpss')?.addEventListener('click',exportSPSS);
  $('#expJson')?.addEventListener('click',exportJSON);
  $$('[data-stuview]',el).forEach(btn=>btn.addEventListener('click',()=>{ App.ctx.studentId=btn.dataset.stuview; App.go('students'); }));
};

/* ═══════════════════════ VIRTUAL ROOMS ═══════════════════════ */
Views.rooms = function(el){
  const rid = App.ctx.roomId;
  const rooms = state.rooms;

  if(rid){
    const room = rooms.find(r=>r.id===rid);
    if(!room){ App.ctx.roomId=null; Views.rooms(el); return; }
    el.innerHTML = `
      <div class="topActions" style="margin-bottom:16px">
        <button class="btn small" id="backRoom">← All Rooms</button>
        <h2 style="margin:0;flex:1">${esc(room.title)}</h2>
      </div>
      <div class="gridMain">
        <div style="display:flex;flex-direction:column;gap:16px">
          <div class="panel ornate">
            <h3 class="panelTitle">Session Agenda</h3>
            <p style="font-size:13.5px;line-height:1.7;color:var(--cream-dim);margin:0">${esc(room.agenda)}</p>
            <a href="${esc(room.url)}" target="_blank" rel="noopener" class="btn primary" style="display:inline-block;margin-top:16px;text-decoration:none">
              🎬 Join Jitsi Room
            </a>
          </div>
          <div class="panel ornate">
            <h3 class="panelTitle">Attendance (${room.attendance.length} / ${Math.max(room.attendance.length,18)})</h3>
            ${room.attendance.length===0?
              `<p class="muted small">No attendance recorded yet. Students are marked present on join.</p>
               <button class="btn small" id="mockAttend">Simulate Student Join</button>`:
              room.attendance.map(a=>`<div class="feedItem"><span>👤</span><span>${esc(a.name)}</span><span class="when">${timeAgo(a.at)}</span></div>`).join('')
            }
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:16px">
          <div class="panel ornate" style="display:flex;flex-direction:column;height:340px">
            <h3 class="panelTitle">Room Chat</h3>
            <div id="chatLog" class="chatLog" style="flex:1;overflow-y:auto;margin-bottom:10px">
              ${room.chat.length===0?`<p class="muted small" style="text-align:center;margin-top:20px">No messages yet.</p>`:room.chat.map(m=>`<div class="bubble ${m.from===me()?.name?'me':''}" style="margin-bottom:8px"><b style="font-size:11px;color:var(--gold)">${esc(m.from)}</b><p style="margin:2px 0;font-size:13px">${esc(m.text)}</p></div>`).join('')}
            </div>
            <div style="display:flex;gap:8px">
              <input class="input" id="chatInput" placeholder="Type a message…" style="flex:1;padding:8px 12px">
              <button class="btn small primary" id="sendChat">Send</button>
            </div>
          </div>
        </div>
      </div>`;
    $('#backRoom')?.addEventListener('click',()=>{ App.ctx.roomId=null; App.go('rooms'); });
    $('#mockAttend')?.addEventListener('click',()=>{
      room.attendance.push({name:WLN.SEED_STUDENTS[Math.floor(Math.random()*WLN.SEED_STUDENTS.length)].name,at:new Date().toISOString()});
      save(); App.go('rooms');
    });
    function sendMsg(){
      const inp=$('#chatInput'); if(!inp?.value?.trim()) return;
      room.chat.push({from:me()?.name||'Instructor',text:inp.value.trim(),at:new Date().toISOString()});
      save(); inp.value=''; Views.rooms(el);
    }
    $('#sendChat')?.addEventListener('click',sendMsg);
    $('#chatInput')?.addEventListener('keydown',e=>{ if(e.key==='Enter') sendMsg(); });
    return;
  }

  el.innerHTML = `
    <div class="topActions" style="margin-bottom:18px"><h2 style="margin:0;flex:1">Virtual Rooms</h2></div>
    <div class="grid2">
      ${rooms.map(r=>`
        <div class="panel ornate">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
            ${Icons.room}
            <b style="font-size:14.5px">${esc(r.title)}</b>
          </div>
          <p class="muted small" style="margin:0 0 14px;line-height:1.5">${esc(r.agenda.slice(0,80))}…</p>
          <div style="display:flex;gap:8px">
            <button class="btn small primary" data-roomid="${r.id}">Open Room</button>
            <a href="${esc(r.url)}" target="_blank" rel="noopener" class="btn small" style="text-decoration:none">Quick Join ↗</a>
          </div>
        </div>`).join('')}
    </div>`;
  $$('[data-roomid]',el).forEach(btn=>btn.addEventListener('click',()=>{ App.ctx.roomId=btn.dataset.roomid; App.go('rooms'); }));
};

/* ═══════════════════════ CERTIFICATE ═══════════════════════ */
Views.certificate = function(el){
  const u  = me();
  const ss = WLN.SEED_STUDENTS;
  let certStuId = App.ctx.certStudentId || ss[0].id;

  function makeCertId(sid){ let h=7; for(let i=0;i<sid.length;i++) h=(h*31+sid.charCodeAt(i))>>>0; return 'WLN-2026-'+String(h).slice(0,4).padStart(4,'0'); }

  /* ── QR grid (21x21) ── */
  function qrHTML(seed){
    let h=5381; for(let i=0;i<seed.length;i++) h=((h<<5)+h+seed.charCodeAt(i))|0;
    const C=21; let cells='';
    for(let r=0;r<C;r++) for(let c=0;c<C;c++){
      const finder=(r<7&&c<7)||(r<7&&c>=C-7)||(r>=C-7&&c<7);
      const data=!finder&&((Math.abs(h^(r*31^c*17))%5)>1);
      cells+=`<i${(finder||data)?'':' class="off"'}></i>`;
    }
    return `<div class="qr">${cells}</div>`;
  }

  function render(){
    const stu    = ss.find(s=>s.id===certStuId) || ss[0];
    const certId = makeCertId(stu.id);
    const cls    = WLN.SEED_CLASSES.find(c=>c.id===stu.classId);
    const d      = new Date();
    const certDate = new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric'}).format(d);
    const certDateShort = `${d.toLocaleString('default',{month:'short'})} ${d.getDate()}, ${d.getFullYear()}`;

    el.innerHTML = `
    <div class="topActions noprint" style="margin-bottom:18px">
      <h2 style="margin:0;flex:1">Certificates</h2>
      <select class="input noprint" id="certStuSel" style="width:auto">
        ${ss.map(s=>`<option value="${s.id}"${s.id===certStuId?' selected':''}>${esc(s.name)}</option>`).join('')}
      </select>
      <button class="btn small primary noprint" id="printCertBtn">🖨 Print / PDF</button>
      <button class="btn small noprint" id="issueCertBtn">Issue &amp; Archive</button>
      <button class="btn small noprint" id="verifyBtn">✓ Verify</button>
    </div>

    <div class="certWrap" style="gap:22px">

      <!-- ══════════════════════════════════════
           CERTIFICATE — matches design board
      ════════════════════════════════════════ -->
      <div id="certDoc" style="
        background:linear-gradient(160deg,#0a1428 0%,#0d1c3a 50%,#0a1428 100%);
        border:3px solid #d7a928;
        border-radius:6px;
        padding:0;
        position:relative;
        overflow:hidden;
        box-shadow:0 0 60px rgba(215,169,40,.2), 0 20px 60px rgba(0,0,0,.6);
        min-width:0;
        font-family:var(--font-body);
      ">
        <!-- Outer decorative border (inset) -->
        <div style="position:absolute;inset:8px;border:1px solid rgba(215,169,40,.4);border-radius:2px;pointer-events:none"></div>

        <!-- Corner ornaments -->
        <svg style="position:absolute;top:0;left:0;width:80px;height:80px;pointer-events:none" viewBox="0 0 80 80">
          <path d="M2 40 L2 2 L40 2" fill="none" stroke="#d7a928" stroke-width="2.5"/>
          <path d="M6 36 L6 6 L36 6" fill="none" stroke="rgba(215,169,40,.4)" stroke-width="1"/>
          <circle cx="2" cy="2" r="3" fill="#d7a928"/>
          <path d="M14 2 Q2 2 2 14" fill="none" stroke="#f3cf63" stroke-width="1.5" opacity=".6"/>
          <circle cx="20" cy="2" r="1.5" fill="#d7a928" opacity=".7"/>
          <circle cx="2" cy="20" r="1.5" fill="#d7a928" opacity=".7"/>
          <path d="M8 14 L14 8 L20 14 L14 20 Z" fill="rgba(215,169,40,.15)" stroke="#d7a928" stroke-width="1"/>
        </svg>
        <svg style="position:absolute;top:0;right:0;width:80px;height:80px;pointer-events:none" viewBox="0 0 80 80">
          <path d="M78 40 L78 2 L40 2" fill="none" stroke="#d7a928" stroke-width="2.5"/>
          <path d="M74 36 L74 6 L44 6" fill="none" stroke="rgba(215,169,40,.4)" stroke-width="1"/>
          <circle cx="78" cy="2" r="3" fill="#d7a928"/>
          <path d="M66 2 Q78 2 78 14" fill="none" stroke="#f3cf63" stroke-width="1.5" opacity=".6"/>
          <circle cx="60" cy="2" r="1.5" fill="#d7a928" opacity=".7"/>
          <circle cx="78" cy="20" r="1.5" fill="#d7a928" opacity=".7"/>
          <path d="M72 14 L66 8 L60 14 L66 20 Z" fill="rgba(215,169,40,.15)" stroke="#d7a928" stroke-width="1"/>
        </svg>
        <svg style="position:absolute;bottom:0;left:0;width:80px;height:80px;pointer-events:none" viewBox="0 0 80 80">
          <path d="M2 40 L2 78 L40 78" fill="none" stroke="#d7a928" stroke-width="2.5"/>
          <path d="M6 44 L6 74 L36 74" fill="none" stroke="rgba(215,169,40,.4)" stroke-width="1"/>
          <circle cx="2" cy="78" r="3" fill="#d7a928"/>
          <path d="M14 78 Q2 78 2 66" fill="none" stroke="#f3cf63" stroke-width="1.5" opacity=".6"/>
          <circle cx="20" cy="78" r="1.5" fill="#d7a928" opacity=".7"/>
          <circle cx="2" cy="60" r="1.5" fill="#d7a928" opacity=".7"/>
          <path d="M8 66 L14 72 L20 66 L14 60 Z" fill="rgba(215,169,40,.15)" stroke="#d7a928" stroke-width="1"/>
        </svg>
        <svg style="position:absolute;bottom:0;right:0;width:80px;height:80px;pointer-events:none" viewBox="0 0 80 80">
          <path d="M78 40 L78 78 L40 78" fill="none" stroke="#d7a928" stroke-width="2.5"/>
          <path d="M74 44 L74 74 L44 74" fill="none" stroke="rgba(215,169,40,.4)" stroke-width="1"/>
          <circle cx="78" cy="78" r="3" fill="#d7a928"/>
          <path d="M66 78 Q78 78 78 66" fill="none" stroke="#f3cf63" stroke-width="1.5" opacity=".6"/>
          <circle cx="60" cy="78" r="1.5" fill="#d7a928" opacity=".7"/>
          <circle cx="78" cy="60" r="1.5" fill="#d7a928" opacity=".7"/>
          <path d="M72 66 L66 72 L60 66 L66 60 Z" fill="rgba(215,169,40,.15)" stroke="#d7a928" stroke-width="1"/>
        </svg>

        <!-- Background watermark wayang silhouette -->
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;opacity:.04">
          <svg viewBox="0 0 200 280" width="200" height="280">
            <ellipse cx="100" cy="60" rx="30" ry="35" fill="#d7a928"/>
            <path d="M70 95 Q50 140 60 220 L100 230 L140 220 Q150 140 130 95 Z" fill="#d7a928"/>
            <path d="M60 110 Q30 90 20 120 Q15 140 40 145" fill="#d7a928"/>
            <path d="M140 110 Q170 90 180 120 Q185 140 160 145" fill="#d7a928"/>
            <path d="M80 230 Q70 260 85 275 L100 270 L115 275 Q130 260 120 230 Z" fill="#d7a928"/>
          </svg>
        </div>

        <!-- Content -->
        <div style="padding:40px 44px;text-align:center;position:relative;z-index:2">

          <!-- Emblem -->
          <div style="margin-bottom:16px">
            <div style="width:72px;height:72px;margin:0 auto;border-radius:50%;background:linear-gradient(135deg,rgba(215,169,40,.2),rgba(215,169,40,.05));border:2px solid #d7a928;display:flex;align-items:center;justify-content:center;box-shadow:0 0 20px rgba(215,169,40,.3)">
              <img src="assets/logo-mark.png" style="width:48px;height:48px;object-fit:contain;filter:drop-shadow(0 0 8px rgba(215,169,40,.5))">
            </div>
          </div>

          <!-- Institution name -->
          <div style="font-size:10px;letter-spacing:.22em;color:rgba(215,169,40,.7);text-transform:uppercase;margin-bottom:6px">
            Universitas Nusantara Indonesia
          </div>

          <!-- Main title -->
          <h2 style="font-family:'Cinzel',serif;font-size:clamp(18px,2.5vw,26px);letter-spacing:.16em;text-transform:uppercase;color:#f3cf63;margin:0 0 4px">
            Wayang Lingua Nusantara
          </h2>

          <!-- Gold rule -->
          <div style="display:flex;align-items:center;gap:10px;margin:10px 0">
            <div style="flex:1;height:1px;background:linear-gradient(to right,transparent,#d7a928)"></div>
            <span style="color:#d7a928;font-size:14px">✦</span>
            <div style="flex:1;height:1px;background:linear-gradient(to left,transparent,#d7a928)"></div>
          </div>

          <div style="font-family:'Cormorant Garamond',serif;font-size:clamp(14px,1.8vw,18px);color:#d7a928;letter-spacing:.1em;margin-bottom:18px">
            Certificate of Achievement
          </div>

          <!-- This is to certify -->
          <p style="font-size:12.5px;color:rgba(203,189,151,.65);letter-spacing:.06em;margin:0 0 8px">
            This is to certify that
          </p>

          <!-- Student name — large italic -->
          <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(28px,4vw,42px);color:#f2e7c9;margin:6px 0 14px;letter-spacing:.04em;line-height:1.1">
            ${esc(stu.name)}
          </div>

          <!-- Gold rule small -->
          <div style="width:80px;height:1px;background:#d7a928;margin:0 auto 16px;opacity:.6"></div>

          <!-- Description -->
          <p style="font-size:13px;color:rgba(203,189,151,.75);margin:0 0 6px;line-height:1.6;max-width:420px;margin-left:auto;margin-right:auto">
            has successfully completed the course
          </p>
          <div style="font-family:'Cinzel',serif;font-size:clamp(12px,1.6vw,15px);color:#f3cf63;letter-spacing:.08em;margin-bottom:6px">
            ${esc(cls?cls.title:'English Language Programme')} (${esc(stu.cefr)})
          </div>
          <p style="font-size:12.5px;color:rgba(203,189,151,.6);margin:0 0 22px;line-height:1.6;max-width:380px;margin-left:auto;margin-right:auto">
            and has demonstrated proficiency in language skills<br>aligned with the CEFR.
          </p>

          <!-- Award date -->
          <p style="font-size:12px;color:rgba(203,189,151,.55);letter-spacing:.06em;margin:0 0 24px">
            Awarded on: <b style="color:var(--cream)">${certDateShort}</b>
            &ensp;·&ensp; Certificate No. <b style="color:var(--gold)">${certId}</b>
          </p>

          <!-- Signatures + QR -->
          <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:8px;padding-top:18px;border-top:1px solid rgba(215,169,40,.2)">
            <div style="text-align:center;flex:1">
              <div style="width:130px;height:1px;background:rgba(215,169,40,.5);margin:0 auto 8px"></div>
              <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:17px;color:#f3cf63">Dr. Joko Slamet</div>
              <div style="font-size:11px;color:rgba(203,189,151,.55);margin-top:3px;letter-spacing:.05em">Programme Director &amp; Lecturer</div>
            </div>
            <div style="text-align:center;padding:0 16px">
              ${qrHTML(certId)}
              <div style="font-size:10px;color:rgba(203,189,151,.4);margin-top:5px;letter-spacing:.06em">Scan to verify</div>
              <button onclick="document.getElementById('verifyBtn').click()" style="margin-top:6px;font-size:10px;color:#d7a928;background:none;border:1px solid rgba(215,169,40,.3);border-radius:4px;padding:3px 10px;cursor:pointer;letter-spacing:.05em">Verify Certificate</button>
            </div>
            <div style="text-align:center;flex:1">
              <div style="width:130px;height:1px;background:rgba(215,169,40,.5);margin:0 auto 8px"></div>
              <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:17px;color:#f3cf63">Universitas Nusantara</div>
              <div style="font-size:11px;color:rgba(203,189,151,.55);margin-top:3px;letter-spacing:.05em">Wayang Lingua Nusantara</div>
            </div>
          </div>

        </div>
      </div>

      <!-- Right panel: details & actions -->
      <div style="display:flex;flex-direction:column;gap:14px;min-width:220px;max-width:280px">
        <div class="panel ornate">
          <h3 class="panelTitle">Certificate Details</h3>
          <div style="display:flex;flex-direction:column;gap:9px;font-size:13px">
            <div><span class="muted small">Recipient</span><br><b>${esc(stu.name)}</b></div>
            <div><span class="muted small">Institution</span><br><b>Universitas Nusantara</b></div>
            <div><span class="muted small">Programme</span><br><b>EFL via Wayang Storytelling</b></div>
            <div><span class="muted small">CEFR Level</span><br><b>${esc(stu.cefr)}</b></div>
            <div><span class="muted small">Final Score</span><br><b style="color:var(--gold-bright);font-size:15px">${stu.post.Overall}%</b></div>
            <div><span class="muted small">Certificate No.</span><br><b style="font-size:11.5px">${certId}</b></div>
            <div><span class="muted small">Date Issued</span><br><b>${certDate}</b></div>
          </div>
        </div>
        <div class="panel ornate">
          <h3 class="panelTitle">Actions</h3>
          <div style="display:flex;flex-direction:column;gap:8px">
            <button class="btn primary" id="issueCertFinal" style="width:100%">✦ Issue Certificate</button>
            <button class="btn small" id="printCertBtn2" style="width:100%">🖨 Print / Save PDF</button>
            <button class="btn small" id="verifyBtn2" style="width:100%">✓ Verify Authenticity</button>
            <button class="btn small" data-go="students" style="width:100%">View Student Record</button>
          </div>
        </div>
        ${state.certificates.length>0?`
        <div class="panel ornate">
          <h3 class="panelTitle">Issued Certificates</h3>
          ${state.certificates.slice(-4).reverse().map(c=>`
            <div class="feedItem">
              <span style="font-size:16px">🎓</span>
              <div class="grow"><b style="font-size:12.5px">${esc(c.student)}</b><div class="muted small">${esc(c.certId)} · ${esc(c.level)}</div></div>
            </div>`).join('')}
        </div>`:''}
      </div>
    </div>`;

    /* event handlers */
    document.getElementById('certStuSel')?.addEventListener('change', e=>{ certStuId=e.target.value; App.ctx.certStudentId=certStuId; render(); });

    const doPrint = ()=>window.print();
    document.getElementById('printCertBtn')?.addEventListener('click', doPrint);
    document.getElementById('printCertBtn2')?.addEventListener('click', doPrint);

    const doVerify = ()=>modal('Certificate Verification — '+certId,`
      <div style="padding:16px;background:rgba(47,139,125,.1);border-radius:12px;border:1px solid rgba(47,139,125,.3);margin-bottom:14px">
        <div style="display:flex;gap:12px;align-items:center">
          <span style="font-size:28px">✅</span>
          <div><b style="color:var(--teal);font-size:15px">Certificate Verified</b><br>
          <span class="muted small">Authentic certificate issued by Wayang Lingua Nusantara</span></div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;font-size:13px">
        <div style="display:flex;gap:8px"><span class="muted" style="width:110px">Recipient</span><b>${esc(stu.name)}</b></div>
        <div style="display:flex;gap:8px"><span class="muted" style="width:110px">Certificate</span><b>${certId}</b></div>
        <div style="display:flex;gap:8px"><span class="muted" style="width:110px">Level</span><b>${esc(stu.cefr)}</b></div>
        <div style="display:flex;gap:8px"><span class="muted" style="width:110px">Issued</span><b>${certDate}</b></div>
        <div style="display:flex;gap:8px"><span class="muted" style="width:110px">Issuer</span><b>Dr. Joko Slamet · Universitas Nusantara</b></div>
      </div>`);
    document.getElementById('verifyBtn')?.addEventListener('click', doVerify);
    document.getElementById('verifyBtn2')?.addEventListener('click', doVerify);

    document.getElementById('issueCertBtn')?.addEventListener('click', doIssue);
    document.getElementById('issueCertFinal')?.addEventListener('click', doIssue);
    function doIssue(){
      if(state.certificates.some(c=>c.certId===certId)){ toast('Already issued and archived.'); return; }
      state.certificates.push({ certId, student:stu.name, level:stu.cefr, course:cls?.title||'EFL Programme', date:new Date().toISOString(), issuedBy:u?.name||'Dr. Joko Slamet' });
      save(); toast('Certificate issued and archived. ✦'); render();
    }
  }

  render();
};
/* ═══════════════════════ USER MANAGEMENT (Admin) ═══════════════════════ */
Views.users = function(el){
  const users = state.users;
  el.innerHTML = `
    <div class="topActions" style="margin-bottom:18px">
      <h2 style="margin:0;flex:1">User Management</h2>
      <button class="btn small primary" id="addUserBtn">+ Add User</button>
    </div>
    <div class="panel ornate">
      <table class="table">
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>CEFR</th><th>Institution</th><th></th></tr></thead>
        <tbody>
          ${users.map((u,i)=>`<tr>
            <td><b>${esc(u.name)}</b></td>
            <td class="small muted">${esc(u.email)}</td>
            <td><span class="chip" style="font-size:11px">${esc(u.role)}</span></td>
            <td>${cefrChip(u.cefr||'B1')}</td>
            <td class="small muted">${esc(u.institution||'—')}</td>
            <td><button class="btn small" data-delidx="${i}" ${u.email===me()?.email?'disabled title="Cannot remove yourself"':''}>Remove</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
  $$('[data-delidx]',el).forEach(btn=>btn.addEventListener('click',()=>{
    const i=+btn.dataset.delidx;
    if(state.users[i]?.email===me()?.email){ toast('Cannot remove your own account.'); return; }
    if(!confirm(`Remove ${state.users[i]?.name}?`)) return;
    state.users.splice(i,1); save(); toast('User removed.'); App.go('users');
  }));
  $('#addUserBtn')?.addEventListener('click',()=>{
    modal('Add New User',`
      <div style="display:flex;flex-direction:column;gap:10px">
        <input class="input" id="nuName" placeholder="Full Name">
        <input class="input" id="nuEmail" placeholder="Email" type="email">
        <input class="input" id="nuPw" placeholder="Password" type="password">
        <select class="input" id="nuRole"><option>Student</option><option>Lecturer</option><option>Admin</option></select>
        <button class="btn primary" id="nuSave">Add User</button>
      </div>`);
    setTimeout(()=>{
      $('#nuSave')?.addEventListener('click',()=>{
        const r=register({name:$('#nuName')?.value?.trim(),email:$('#nuEmail')?.value?.trim(),password:$('#nuPw')?.value,role:$('#nuRole')?.value,cefr:'B1'});
        if(!r.ok){ toast(r.msg); return; }
        closeModal(); toast('User added.'); App.go('users');
      });
    },50);
  });
};

/* ═══════════════════════ ADMIN CONSOLE ═══════════════════════ */
Views.adminConsole = function(el){
  el.innerHTML = `
    <div class="topActions" style="margin-bottom:18px"><h2 style="margin:0;flex:1">Admin Console</h2></div>
    <div class="grid2">
      <div class="panel ornate">
        <h3 class="panelTitle">Anthropic API Key</h3>
        <p class="muted small" style="margin:0 0 10px;line-height:1.6">Enable live AI feedback, mentor responses, and assessment insights throughout the app.</p>
        <input class="input" id="apiKeyIn" type="password" placeholder="sk-ant-…" value="${esc(state.apiKey||'')}" style="margin-bottom:10px">
        <button class="btn primary" id="saveKey">Save Key</button>
        ${state.apiKey?`<span class="chip teal" style="margin-left:8px">Active</span>`:''}
      </div>
      <div class="panel ornate">
        <h3 class="panelTitle">System Stats</h3>
        <div style="display:flex;flex-direction:column;gap:8px;font-size:13px">
          <div style="display:flex;justify-content:space-between"><span class="muted">Total Users</span><b>${state.users.length}</b></div>
          <div style="display:flex;justify-content:space-between"><span class="muted">Classes</span><b>${state.classes.length}</b></div>
          <div style="display:flex;justify-content:space-between"><span class="muted">Certificates Issued</span><b>${state.certificates.length}</b></div>
          <div style="display:flex;justify-content:space-between"><span class="muted">Assessments</span><b>${state.assessments.length}</b></div>
          <div style="display:flex;justify-content:space-between"><span class="muted">Activity Log Entries</span><b>${state.activity.length}</b></div>
          <div style="display:flex;justify-content:space-between"><span class="muted">App Version</span><b>1.0.0</b></div>
        </div>
      </div>
      <div class="panel ornate">
        <h3 class="panelTitle">Activity Log</h3>
        <div style="max-height:220px;overflow-y:auto">
          ${(state.activity.length? state.activity.slice(0,20):[{text:'No activity yet',date:new Date().toISOString()}]).map(a=>`
            <div class="feedItem">
              <span style="width:7px;height:7px;border-radius:50%;background:var(--gold);flex:none;margin-top:4px"></span>
              <span style="font-size:12.5px">${esc(a.text)}</span>
              <span class="when">${timeAgo(a.date)}</span>
            </div>`).join('')}
        </div>
      </div>
      <div class="panel ornate">
        <h3 class="panelTitle" style="color:var(--rust)">Danger Zone</h3>
        <p class="muted small" style="margin:0 0 12px;line-height:1.6">This permanently resets all app data to the factory default. All progress, certificates, and messages will be lost.</p>
        <button class="btn" style="border-color:var(--rust);color:var(--rust)" id="resetBtn">Reset All Data…</button>
      </div>
    </div>`;
  $('#saveKey')?.addEventListener('click',()=>{ state.apiKey=$('#apiKeyIn')?.value?.trim()||''; save(); toast('API key saved.'); App.go('adminConsole'); });
  $('#resetBtn')?.addEventListener('click',()=>{
    if(confirm('Reset ALL data? This cannot be undone.')) resetAll();
  });
};

/* ═══════════════════════ SETTINGS (all roles) ═══════════════════════ */
Views.settings = function(el){
  const u = me();
  if(!u){ App.go('auth'); return; }
  const isAdmin = u.role==='Admin';
  const isLecturer = u.role==='Lecturer' || isAdmin;
  el.innerHTML = `
    <div class="topActions" style="margin-bottom:18px"><h2 style="margin:0;flex:1">Settings</h2></div>
    <div style="max-width:580px;display:flex;flex-direction:column;gap:16px">
      <div class="panel ornate">
        <h3 class="panelTitle">Profile</h3>
        <div style="display:flex;gap:16px;align-items:center;margin-bottom:18px">
          <div style="width:64px;height:64px;border-radius:50%;background:var(--navy-3);border:2px solid var(--gold);display:flex;align-items:center;justify-content:center;font-size:26px;flex:none">
            ${u.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <b style="font-size:16px">${esc(u.name)}</b>
            <div class="muted small">${esc(u.email)} · ${esc(u.role)}</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px">
          <div>
            <label class="small muted" style="display:block;margin-bottom:5px">Full Name</label>
            <input class="input" id="setName" value="${esc(u.name)}">
          </div>
          <div>
            <label class="small muted" style="display:block;margin-bottom:5px">Institution</label>
            <input class="input" id="setInst" value="${esc(u.institution||'')}">
          </div>
          <div>
            <label class="small muted" style="display:block;margin-bottom:5px">Bio</label>
            <textarea class="input" id="setBio" rows="2">${esc(u.bio||'')}</textarea>
          </div>
          <button class="btn primary" id="saveProfile">Save Profile</button>
        </div>
      </div>

      <div class="panel ornate">
        <h3 class="panelTitle">Password</h3>
        <div style="display:flex;flex-direction:column;gap:10px">
          <input class="input" id="setPwCur" type="password" placeholder="Current password">
          <input class="input" id="setPwNew" type="password" placeholder="New password">
          <button class="btn small" id="savePw">Change Password</button>
        </div>
      </div>

      ${isLecturer?`
      <div class="panel ornate">
        <h3 class="panelTitle">Anthropic API Key <span class="chip" style="font-size:11px">Optional</span></h3>
        <p class="muted small" style="margin:0 0 10px;line-height:1.6">Powers live AI mentor responses and assessment insights.</p>
        <input class="input" id="setApiKey" type="password" placeholder="sk-ant-…" value="${esc(state.apiKey||'')}">
        <button class="btn small" style="margin-top:8px" id="saveApiKey">Save Key</button>
        ${state.apiKey?`<span class="chip teal" style="margin-left:8px">Active</span>`:''}
      </div>`:''}

      ${u.role==='Student'?`
      <div class="panel ornate">
        <h3 class="panelTitle" style="color:var(--warn)">Reset Progress</h3>
        <p class="muted small" style="margin:0 0 12px;line-height:1.6">Resets your XP, lesson progress, badges, and speaking history. Your account remains active.</p>
        <button class="btn" style="border-color:var(--warn);color:var(--warn)" id="resetProgress">Reset My Progress</button>
      </div>`:''}
    </div>`;
  $('#saveProfile')?.addEventListener('click',()=>{
    u.name=$('#setName')?.value?.trim()||u.name;
    u.institution=$('#setInst')?.value?.trim();
    u.bio=$('#setBio')?.value?.trim();
    save(); toast('Profile updated.'); App.refresh();
  });
  $('#savePw')?.addEventListener('click',()=>{
    const cur=$('#setPwCur')?.value, nw=$('#setPwNew')?.value;
    if(cur!==u.password){ toast('Current password is incorrect.'); return; }
    if(!nw||nw.length<6){ toast('New password must be at least 6 characters.'); return; }
    u.password=nw; save(); toast('Password changed.');
  });
  $('#saveApiKey')?.addEventListener('click',()=>{ state.apiKey=$('#setApiKey')?.value?.trim()||''; save(); toast('API key saved.'); App.refresh(); });
  $('#resetProgress')?.addEventListener('click',()=>{
    if(!confirm('Reset all your learning progress?')) return;
    const u2=me(); if(u2) u2.record=newStudentRecord(); save(); toast('Progress reset.'); App.go('home');
  });
};
