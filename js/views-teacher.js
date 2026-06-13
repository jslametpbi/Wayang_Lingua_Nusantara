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
  const ss = WLN.SEED_STUDENTS;
  let certStuId = App.ctx.certStudentId || ss[0].id;

  function makeCertId(s){ let h=7; for(let i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))>>>0; return 'WLN-2026-'+String(h).slice(0,4).padStart(4,'0'); }

  /* QR grid 21×21 */
  function qrHTML(seed){
    let h=5381; for(let i=0;i<seed.length;i++) h=((h<<5)+h+seed.charCodeAt(i))|0;
    const C=21; let cells='';
    for(let r=0;r<C;r++) for(let c=0;c<C;c++){
      const finder=(r<7&&c<7)||(r<7&&c>=C-7)||(r>=C-7&&c<7);
      const on=finder||((Math.abs(h^(r*31^c*17))%5)>1);
      cells+=`<i${on?'':' class="off"'}></i>`;
    }
    return `<div class="qr" style="margin:0 auto">${cells}</div>`;
  }

  /* Batik/wayang decorative side panel SVG */
  function sidePanel(mirror){
    const mx = mirror ? -1 : 1;
    const T = mirror ? 'transform="scale(-1,1) translate(-110,0)"' : '';
    return `<svg viewBox="0 0 110 480" preserveAspectRatio="none" style="width:18%;min-width:105px;flex:none" xmlns="http://www.w3.org/2000/svg">
      <!-- dark background -->
      <rect width="110" height="480" fill="#060d1c"/>
      <!-- outer gold border lines -->
      <rect x="1" y="1" width="108" height="478" fill="none" stroke="#d7a928" stroke-width="3"/>
      <rect x="6" y="6" width="98" height="468" fill="none" stroke="#d7a928" stroke-width="1" opacity=".5"/>
      <rect x="10" y="10" width="90" height="460" fill="none" stroke="#d7a928" stroke-width=".4" opacity=".3"/>
      <!-- vertical stripe lines inner edge -->
      <line x1="16" y1="14" x2="16" y2="466" stroke="#d7a928" stroke-width=".6" opacity=".35"/>
      <line x1="20" y1="14" x2="20" y2="466" stroke="#d7a928" stroke-width=".3" opacity=".2"/>
      <line x1="94" y1="14" x2="94" y2="466" stroke="#d7a928" stroke-width=".6" opacity=".35"/>
      <line x1="90" y1="14" x2="90" y2="466" stroke="#d7a928" stroke-width=".3" opacity=".2"/>

      <!-- ═══ TOP LOTUS ORNAMENT ═══ -->
      <g fill="#d7a928">
        <!-- petals radiating -->
        <ellipse cx="55" cy="30" rx="5" ry="12" fill="#d7a928" opacity=".9"/>
        <ellipse cx="55" cy="30" rx="12" ry="5" fill="#d7a928" opacity=".9"/>
        <ellipse cx="55" cy="30" rx="4" ry="11" transform="rotate(45 55 30)" fill="#d7a928" opacity=".7"/>
        <ellipse cx="55" cy="30" rx="4" ry="11" transform="rotate(-45 55 30)" fill="#d7a928" opacity=".7"/>
        <circle cx="55" cy="30" r="6" fill="#f3cf63"/>
        <circle cx="55" cy="30" r="3" fill="#d7a928"/>
        <!-- small petals outer -->
        <ellipse cx="55" cy="14" rx="3" ry="6" fill="#d7a928" opacity=".6"/>
        <ellipse cx="55" cy="46" rx="3" ry="6" fill="#d7a928" opacity=".6"/>
        <ellipse cx="39" cy="30" rx="6" ry="3" fill="#d7a928" opacity=".6"/>
        <ellipse cx="71" cy="30" rx="6" ry="3" fill="#d7a928" opacity=".6"/>
        <!-- corner leaves -->
        <path d="M35 14 Q42 20 38 28 Q30 24 35 14Z" fill="#d7a928" opacity=".65"/>
        <path d="M75 14 Q68 20 72 28 Q80 24 75 14Z" fill="#d7a928" opacity=".65"/>
      </g>

      <!-- ═══ UPPER VINE SECTION ═══ -->
      <g fill="#d7a928" opacity=".85">
        <!-- central vine -->
        <path d="M55 52 Q48 65 55 78 Q62 91 55 104 Q48 117 55 130" fill="none" stroke="#d7a928" stroke-width="1.8" opacity=".6"/>
        <!-- leaf pairs -->
        <!-- leaf pair 1 -->
        <path d="M55 60 Q38 55 30 62 Q38 70 55 66Z"/>
        <path d="M55 60 Q72 55 80 62 Q72 70 55 66Z"/>
        <!-- small dots -->
        <circle cx="55" cy="63" r="2.5"/>
        <!-- leaf pair 2 -->
        <path d="M55 80 Q36 74 28 82 Q37 90 55 87Z" opacity=".9"/>
        <path d="M55 80 Q74 74 82 82 Q73 90 55 87Z" opacity=".9"/>
        <circle cx="55" cy="83" r="2.5"/>
        <!-- leaf pair 3 -->
        <path d="M55 100 Q39 94 31 102 Q40 111 55 107Z" opacity=".8"/>
        <path d="M55 100 Q71 94 79 102 Q70 111 55 107Z" opacity=".8"/>
        <circle cx="55" cy="103" r="2.5"/>
        <!-- stem connector buds -->
        <circle cx="55" cy="72" r="1.8" opacity=".6"/>
        <circle cx="55" cy="92" r="1.8" opacity=".6"/>
        <circle cx="55" cy="112" r="1.8" opacity=".6"/>
      </g>

      <!-- ═══ CENTRAL WAYANG DEITY FIGURE ═══ -->
      <g fill="#d7a928">
        <!-- elaborate multi-tier crown/headdress -->
        <!-- tier 3 (top spike) -->
        <path d="M55 120 L52 135 L55 132 L58 135 Z"/>
        <!-- tier 2 -->
        <path d="M48 134 L55 124 L62 134 L60 142 L55 139 L50 142 Z" opacity=".95"/>
        <!-- tier 1 large -->
        <path d="M40 140 L46 132 L55 136 L64 132 L70 140 L68 152 L55 148 L42 152 Z"/>
        <!-- crown jewels -->
        <circle cx="55" cy="136" r="3" fill="#f3cf63"/>
        <circle cx="46" cy="143" r="1.8" fill="#f3cf63" opacity=".8"/>
        <circle cx="64" cy="143" r="1.8" fill="#f3cf63" opacity=".8"/>
        <!-- crown decorative lines -->
        <path d="M42 148 Q55 144 68 148" fill="none" stroke="#f3cf63" stroke-width="1" opacity=".6"/>

        <!-- face oval -->
        <ellipse cx="55" cy="168" rx="16" ry="18" fill="#d7a928"/>
        <!-- face shading (slightly darker) -->
        <ellipse cx="55" cy="170" rx="12" ry="14" fill="#c8932a" opacity=".4"/>
        <!-- stylised eyes -->
        <ellipse cx="47" cy="165" rx="4.5" ry="3.5" fill="#0a0f1e"/>
        <ellipse cx="48" cy="164" rx="1.5" ry="1.5" fill="#f3cf63" opacity=".4"/>
        <ellipse cx="63" cy="165" rx="4.5" ry="3.5" fill="#0a0f1e"/>
        <ellipse cx="64" cy="164" rx="1.5" ry="1.5" fill="#f3cf63" opacity=".4"/>
        <!-- brows -->
        <path d="M41 160 Q47 156 53 160" fill="none" stroke="#0a0f1e" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M57 160 Q63 156 69 160" fill="none" stroke="#0a0f1e" stroke-width="2.5" stroke-linecap="round"/>
        <!-- nose -->
        <path d="M53 168 L51 178 L55 181 L59 178 L57 168" fill="#9a7020" opacity=".7"/>
        <!-- mouth / smile -->
        <path d="M48 182 Q55 188 62 182" fill="none" stroke="#0a0f1e" stroke-width="2.5" stroke-linecap="round"/>

        <!-- neck and collar -->
        <rect x="50" y="184" width="10" height="10" rx="2" fill="#c8932a" opacity=".8"/>
        <!-- decorative collar ring -->
        <ellipse cx="55" cy="197" rx="16" ry="5" fill="#d7a928" opacity=".6"/>
        <ellipse cx="55" cy="197" rx="13" ry="3.5" fill="#f3cf63" opacity=".4"/>

        <!-- body robe -->
        <path d="M36 196 Q28 218 30 248 L38 258 L55 254 L72 258 L80 248 Q82 218 74 196 Z" fill="#c8932a" opacity=".9"/>
        <path d="M36 196 Q40 210 55 208 Q70 210 74 196" fill="none" stroke="#f3cf63" stroke-width="1.5" opacity=".7"/>

        <!-- body inner robe detail -->
        <path d="M40 200 Q55 214 70 200 L68 248 Q55 252 42 248 Z" fill="#d7a928" opacity=".35"/>

        <!-- left arm -->
        <path d="M36 205 Q22 198 16 210 Q20 224 34 220 Q38 216 36 210" fill="#c8932a" opacity=".9"/>
        <!-- left hand holding flower -->
        <circle cx="18" cy="212" r="5" fill="#d7a928" opacity=".7"/>
        <circle cx="18" cy="212" r="3" fill="#f3cf63" opacity=".5"/>
        <path d="M15 207 Q18 202 21 207" fill="#d7a928" opacity=".5"/>

        <!-- right arm -->
        <path d="M74 205 Q88 198 94 210 Q90 224 76 220 Q72 216 74 210" fill="#c8932a" opacity=".9"/>
        <!-- right hand raised gesture -->
        <path d="M90 206 L94 200 L98 206 L95 212" fill="#d7a928" opacity=".7"/>

        <!-- legs/lower robe -->
        <path d="M42 254 Q38 278 40 300 L52 302 L55 270 Z" fill="#c8932a" opacity=".85"/>
        <path d="M68 254 Q72 278 70 300 L58 302 L55 270 Z" fill="#c8932a" opacity=".85"/>
        <!-- foot ornaments -->
        <ellipse cx="44" cy="300" rx="8" ry="4" fill="#d7a928" opacity=".7"/>
        <ellipse cx="66" cy="300" rx="8" ry="4" fill="#d7a928" opacity=".7"/>

        <!-- waist belt/sash -->
        <path d="M38 238 Q55 242 72 238" fill="none" stroke="#f3cf63" stroke-width="2" opacity=".8"/>
        <rect x="51" y="235" width="8" height="8" rx="1.5" fill="#f3cf63" opacity=".6"/>
      </g>

      <!-- ═══ LOWER VINE SECTION (mirror of upper) ═══ -->
      <g fill="#d7a928" opacity=".85">
        <path d="M55 308 Q62 321 55 334 Q48 347 55 360 Q62 373 55 386" fill="none" stroke="#d7a928" stroke-width="1.8" opacity=".6"/>
        <!-- leaf pairs (mirror) -->
        <path d="M55 316 Q72 311 80 318 Q72 327 55 323Z"/>
        <path d="M55 316 Q38 311 30 318 Q38 327 55 323Z"/>
        <circle cx="55" cy="319" r="2.5"/>
        <path d="M55 336 Q73 330 81 338 Q72 347 55 343Z" opacity=".9"/>
        <path d="M55 336 Q37 330 29 338 Q38 347 55 343Z" opacity=".9"/>
        <circle cx="55" cy="339" r="2.5"/>
        <path d="M55 356 Q71 350 79 358 Q70 367 55 363Z" opacity=".8"/>
        <path d="M55 356 Q39 350 31 358 Q40 367 55 363Z" opacity=".8"/>
        <circle cx="55" cy="359" r="2.5"/>
        <circle cx="55" cy="329" r="1.8" opacity=".6"/>
        <circle cx="55" cy="349" r="1.8" opacity=".6"/>
      </g>

      <!-- ═══ BOTTOM LOTUS ORNAMENT ═══ -->
      <g fill="#d7a928">
        <ellipse cx="55" cy="430" rx="5" ry="11" opacity=".9"/>
        <ellipse cx="55" cy="430" rx="11" ry="5" opacity=".9"/>
        <ellipse cx="55" cy="430" rx="4" ry="10" transform="rotate(45 55 430)" opacity=".7"/>
        <ellipse cx="55" cy="430" rx="4" ry="10" transform="rotate(-45 55 430)" opacity=".7"/>
        <circle cx="55" cy="430" r="6" fill="#f3cf63"/>
        <circle cx="55" cy="430" r="3" fill="#d7a928"/>
        <!-- petals -->
        <ellipse cx="55" cy="416" rx="2.5" ry="5" opacity=".6"/>
        <ellipse cx="55" cy="444" rx="2.5" ry="5" opacity=".6"/>
        <ellipse cx="41" cy="430" rx="5" ry="2.5" opacity=".6"/>
        <ellipse cx="69" cy="430" rx="5" ry="2.5" opacity=".6"/>
        <path d="M35 416 Q40 422 37 429 Q30 426 35 416Z" opacity=".6"/>
        <path d="M75 416 Q70 422 73 429 Q80 426 75 416Z" opacity=".6"/>
        <!-- base stripes -->
        <rect x="32" y="448" width="46" height="3" rx="1.5" opacity=".7"/>
        <rect x="36" y="453" width="38" height="2" rx="1" opacity=".5"/>
        <rect x="40" y="457" width="30" height="1.5" rx=".75" opacity=".35"/>
        <!-- corner stars -->
        <path d="M22 460 L24 452 L26 460 L18 456 L30 456Z" fill="#d7a928" opacity=".5"/>
        <path d="M88 460 L86 452 L84 460 L92 456 L80 456Z" fill="#d7a928" opacity=".5"/>
      </g>
    </svg>`;
  }

  /* Cursive signature SVG — Dr. Joko Slamet */
  const signatureSVG = `<svg viewBox="0 0 160 45" style="width:160px;height:45px;display:block" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 28 C14 20 18 16 22 22 C26 28 24 34 20 32 C16 30 20 24 28 20 C36 16 40 22 38 28 C37 32 44 26 50 24 C56 22 60 26 58 32 C56 36 62 28 68 26 C74 24 76 30 74 34 C80 28 86 24 92 26 C96 28 94 34 90 32 C96 26 102 22 108 24 C114 26 116 32 120 30 C124 28 126 22 132 20 C138 18 142 24 140 30 C138 34 144 28 150 26 C154 24 156 28 154 32"
      fill="none" stroke="#d7a928" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 35 Q55 40 100 38 Q130 37 152 35"
      fill="none" stroke="#d7a928" stroke-width="0.8" opacity=".4" stroke-linecap="round"/>
  </svg>`;

  function render(){
    const stu    = ss.find(s=>s.id===certStuId) || ss[0];
    const certId = makeCertId(stu.id);
    const cls    = WLN.SEED_CLASSES.find(c=>c.id===stu.classId);
    const d      = new Date();
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const certDate = `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

    el.innerHTML = `
    <!-- Controls (no-print) -->
    <div class="topActions noprint" style="margin-bottom:18px;flex-wrap:wrap;gap:10px">
      <h2 style="margin:0;flex:1;min-width:160px">Certificates</h2>
      <select class="input noprint" id="certStuSel" style="width:auto">
        ${ss.map(s=>`<option value="${s.id}"${s.id===certStuId?' selected':''}>${esc(s.name)}</option>`).join('')}
      </select>
      <button class="btn primary noprint" id="issueCertBtn">✦ Issue &amp; Archive</button>
      <button class="btn noprint" id="printCertBtn">🖨 Print / PDF</button>
      <button class="btn small noprint" id="verifyBtn">✓ Verify</button>
    </div>

    <!-- CERTIFICATE (landscape) -->
    <div id="certDoc" style="
      display:flex;
      background:#070d1c;
      border:3px solid #d7a928;
      border-radius:4px;
      overflow:hidden;
      box-shadow:0 0 80px rgba(215,169,40,.18),0 24px 64px rgba(0,0,0,.7);
      max-width:860px;
      min-height:420px;
      position:relative;
      margin-bottom:18px;
    ">
      <!-- LEFT DECORATIVE PANEL -->
      ${sidePanel(false)}

      <!-- CENTER CONTENT -->
      <div style="flex:1;padding:32px 28px;text-align:center;display:flex;flex-direction:column;justify-content:space-between;min-width:0;position:relative">

        <!-- Top: Logo + Title -->
        <div>
          <div style="display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:14px">
            <!-- Circular emblem -->
            <div style="width:60px;height:60px;border-radius:50%;border:2px solid #d7a928;background:rgba(215,169,40,.08);display:flex;align-items:center;justify-content:center;flex:none;box-shadow:0 0 14px rgba(215,169,40,.25)">
              <img src="assets/logo-mark.png" style="width:40px;height:40px;object-fit:contain;filter:drop-shadow(0 0 6px rgba(215,169,40,.5))">
            </div>
            <div style="text-align:left">
              <div style="font-family:'Cinzel',serif;font-size:clamp(15px,2.2vw,21px);color:#f2e7c9;letter-spacing:.1em;line-height:1.1">Wayang Lingua</div>
              <div style="font-family:'Cinzel',serif;font-size:clamp(15px,2.2vw,21px);color:#f2e7c9;letter-spacing:.1em">Nusantara</div>
            </div>
          </div>

          <!-- Gold rule -->
          <div style="display:flex;align-items:center;gap:8px;margin:0 auto 10px;max-width:420px">
            <div style="flex:1;height:1px;background:linear-gradient(to right,transparent,#d7a928 50%,transparent)"></div>
          </div>

          <!-- Main title -->
          <div style="font-family:'Cinzel',serif;font-size:clamp(13px,1.8vw,17px);color:#d7a928;letter-spacing:.22em;text-transform:uppercase;margin-bottom:14px">
            Certificate of Achievement
          </div>

          <!-- Certify text -->
          <p style="font-size:12px;color:rgba(242,231,201,.6);letter-spacing:.05em;margin:0 0 6px">This is to certify that</p>

          <!-- Student Name -->
          <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(26px,4vw,40px);color:#f2e7c9;margin:4px 0 10px;letter-spacing:.04em;line-height:1.1">
            ${esc(stu.name)}
          </div>

          <!-- Course description -->
          <p style="font-size:12px;color:rgba(242,231,201,.62);margin:0 0 5px">has successfully completed the course</p>
          <div style="font-family:'Cinzel',serif;font-size:clamp(12px,1.6vw,15px);color:#f3cf63;letter-spacing:.07em;margin-bottom:5px">
            ${esc(cls?cls.title:'English Language Programme')} (${esc(stu.cefr)})
          </div>
          <p style="font-size:11.5px;color:rgba(242,231,201,.55);margin:0 0 14px;line-height:1.5">
            and has demonstrated proficiency in language skills<br>aligned with the CEFR.
          </p>

          <!-- Award date -->
          <p style="font-size:11.5px;color:rgba(242,231,201,.6);letter-spacing:.04em;margin:0 0 16px">
            Awarded on &nbsp;<b style="color:#f2e7c9">${certDate}</b>
          </p>
        </div>

        <!-- Bottom: Signature + QR -->
        <div style="display:flex;align-items:flex-end;justify-content:space-between;padding-top:12px;border-top:1px solid rgba(215,169,40,.2)">

          <!-- Signature left -->
          <div style="text-align:left">
            ${signatureSVG}
            <div style="width:150px;height:1px;background:rgba(215,169,40,.5);margin:6px 0 6px"></div>
            <div style="font-family:'Cormorant Garamond',serif;font-size:16px;color:#f3cf63;letter-spacing:.04em">Dr. Joko Slamet</div>
            <div style="font-size:11px;color:rgba(242,231,201,.5);letter-spacing:.06em">Lecturer</div>
          </div>

          <!-- QR + Verify right -->
          <div style="text-align:center">
            <div style="background:#f6f1e2;padding:6px;border-radius:4px;display:inline-block;margin-bottom:6px">
              ${qrHTML(certId)}
            </div>
            <div style="font-size:10px;color:rgba(215,169,40,.5);display:block;margin-bottom:4px;letter-spacing:.05em">${certId}</div>
            <button id="verifyBtn2" style="font-size:11px;color:#d7a928;background:none;border:1px solid rgba(215,169,40,.35);border-radius:4px;padding:3px 12px;cursor:pointer;letter-spacing:.06em;font-family:'Cinzel',serif">Verify Certificate</button>
          </div>
        </div>
      </div>

      <!-- RIGHT DECORATIVE PANEL -->
      ${sidePanel(true)}
    </div>

    <!-- Certificate details panel -->
    <div class="panel ornate noprint" style="max-width:860px">
      <div style="display:flex;gap:20px;flex-wrap:wrap;align-items:flex-start">
        <div style="flex:1;min-width:180px">
          <div style="font-size:11px;letter-spacing:.1em;color:var(--gold);text-transform:uppercase;margin-bottom:10px">Certificate Details</div>
          <div style="display:flex;flex-direction:column;gap:7px;font-size:13px">
            <div style="display:flex;gap:8px"><span class="muted" style="width:110px">Recipient</span><b>${esc(stu.name)}</b></div>
            <div style="display:flex;gap:8px"><span class="muted" style="width:110px">Programme</span><b>EFL via Wayang Storytelling</b></div>
            <div style="display:flex;gap:8px"><span class="muted" style="width:110px">CEFR Level</span><b>${esc(stu.cefr)}</b></div>
            <div style="display:flex;gap:8px"><span class="muted" style="width:110px">Score</span><b style="color:var(--gold-bright)">${stu.post.Overall}%</b></div>
            <div style="display:flex;gap:8px"><span class="muted" style="width:110px">Certificate No.</span><b>${certId}</b></div>
            <div style="display:flex;gap:8px"><span class="muted" style="width:110px">Issued</span><b>${certDate}</b></div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;min-width:180px">
          <button class="btn primary" id="issueCertFinal" style="width:100%">✦ Issue Certificate</button>
          <button class="btn" id="printCertBtn2" style="width:100%">🖨 Print / Save PDF</button>
          <button class="btn small" data-go="students" style="width:100%">View Student Record</button>
        </div>
        ${state.certificates.length>0?`
        <div style="flex:2;min-width:200px">
          <div style="font-size:11px;letter-spacing:.1em;color:var(--gold);text-transform:uppercase;margin-bottom:10px">Recently Issued</div>
          ${state.certificates.slice(-4).reverse().map(c=>`
            <div class="feedItem"><span style="font-size:16px">🎓</span>
              <div class="grow"><b style="font-size:12.5px">${esc(c.student)}</b><div class="muted small">${esc(c.certId)} · ${esc(c.level)}</div></div>
            </div>`).join('')}
        </div>`:''}
      </div>
    </div>`;

    /* events */
    document.getElementById('certStuSel')?.addEventListener('change', e=>{ certStuId=e.target.value; App.ctx.certStudentId=certStuId; render(); });

    const doPrint = ()=>window.print();
    document.getElementById('printCertBtn')?.addEventListener('click', doPrint);
    document.getElementById('printCertBtn2')?.addEventListener('click', doPrint);

    function doVerify(){
      modal('Certificate Verification',`
        <div style="padding:14px;background:rgba(47,139,125,.1);border-radius:10px;border:1px solid rgba(47,139,125,.3);margin-bottom:14px;display:flex;gap:12px;align-items:center">
          <span style="font-size:26px">✅</span>
          <div><b style="color:var(--teal);font-size:15px">Verified Authentic</b><br><span class="muted small">Issued by Wayang Lingua Nusantara</span></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:7px;font-size:13px">
          <div style="display:flex;gap:8px"><span class="muted" style="width:110px">Recipient</span><b>${esc(stu.name)}</b></div>
          <div style="display:flex;gap:8px"><span class="muted" style="width:110px">Certificate</span><b>${certId}</b></div>
          <div style="display:flex;gap:8px"><span class="muted" style="width:110px">Level</span><b>${esc(stu.cefr)}</b></div>
          <div style="display:flex;gap:8px"><span class="muted" style="width:110px">Issued</span><b>${certDate}</b></div>
          <div style="display:flex;gap:8px"><span class="muted" style="width:110px">Lecturer</span><b>Dr. Joko Slamet · Universitas Nusantara</b></div>
        </div>`);
    }
    document.getElementById('verifyBtn')?.addEventListener('click', doVerify);
    document.getElementById('verifyBtn2')?.addEventListener('click', doVerify);

    function doIssue(){
      if(state.certificates.some(c=>c.certId===certId)){ toast('Already issued and archived.'); return; }
      const cls2 = WLN.SEED_CLASSES.find(c=>c.id===stu.classId);
      state.certificates.push({ certId, student:stu.name, level:stu.cefr, course:cls2?.title||'EFL Programme', date:new Date().toISOString(), issuedBy:'Dr. Joko Slamet' });
      save(); toast('Certificate issued and archived. ✦'); render();
    }
    document.getElementById('issueCertBtn')?.addEventListener('click', doIssue);
    document.getElementById('issueCertFinal')?.addEventListener('click', doIssue);
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
