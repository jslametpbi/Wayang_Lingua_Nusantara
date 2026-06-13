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
  const SIG_URI = "data:image/png;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAA+qADAAQAAAABAAAAugAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgAugD6AwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/bAEMAAQEBAQEBAgEBAgMCAgIDBAMDAwMEBgQEBAQEBgcGBgYGBgYHBwcHBwcHBwgICAgICAkJCQkJCwsLCwsLCwsLC//bAEMBAgICAwMDBQMDBQsIBggLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLC//dAAQAEP/aAAwDAQACEQMRAD8A/wA/+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//0P8AP/ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACinIjSMEQZJ4AFaM2kX9tHvuIyh/unhvrigDMooooAKKKKACiiigAooooA//0f8AP/ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDY1PRLvS7e2u5irR3Sb0ZTkcdR9RWUqFmUHgMcZNdPpniSOHTDourQC6tQ2+MZwyMeuD7/Sug8b2QtdH0q6hx5VzGXUY5UDoPw70iraXOZ1Xw+unWYu4p1mG7awAxg/4VBoF1cWd29xDbi4VEJkBGcJxk+2KzJL67lgFtI5Ma9B9K0dA1c6NfGdl3xSoYpV/vI3UfpTFfU1/Emq3VzfJfWWEgi/1RQYAP8AjVi3ll177NK7gfZ+J2Y4JHrTdf0uzs9IhnsC/kyYdN4w2G/Lj0rjIQzSBF/iIFA3ozode0f7NO1xbsGVhvKDqoPrXNojOwRBkk4AFd5fSR3Hiq7iPCOhXA/3eK5/Qw0V7JOoDeUjnB56CgLamI8bxOY5AVYdQetMrX1ND5cM8mfMlXc2eO5/SsigTCiiigQUUUUAf//S/wA/+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACvXfEduZ/hRoGpP95ZZ4vqNx/wAK8ir2i5WO5+EWj27Hn+0GX8GLUn0KXU8Xrb8O6PJrusQ6cnCscu2MhVHUn2rq/EfhOFPGU3h/TMRJGoJLdsDmo7OMeHfB8upk7brUmMEY6ERL98/icYouK3c1PFGoW2reHprmzXbbwXIigHcRjOBXmNowW5jY9AwrqLacSeCrq3x/q7iM/wDfQP8AhXIAkHI7UIGztjC//CWz4P3NzHPoBmsnQ5UXUJEk+7KrIcejcV1viSO20ma/vQ6mW6ISJRyQmBuJ9M1j6Tp8Ntpyy3RImvWCwqOuB3+hPFC2K6nP61ei+v2kj+4uFQewrJqSVSkrI3UEio6ZLCiiigQUUUUAf//T/wA/+iiigAooooAKKKKACiiigAoqWCCe6mW3tkaSRzhVUZJJ7ACvfvDn7MXxb1yFb/UbAaNZY3Pcak4tUVfX94VzSbS3Gk3sfPlFfWkfwz/Z28CSs3xB8Wvrkq/dttHTgn3kYOuPpUZ+OXwp8GkN8LvBVsLhcj7VqjNPJj2VWC/pS5uyHy92fOOgeEPFXimbyPDWm3OoP6W8TSH/AMdBr1Ky/Zr+NV4u99Cnth63A8r/ANCxWprP7Uvxi1MNDp2oR6XAw2mKyhSIYPvgt+teQah448Zaq5k1HVbuYnk7pm/xo94PdPWJf2afiPbAfb5dNtSe019Ch/Vqev7NXj6U7La70qV+u1b+En8t1eCy319Od08zuf8AaYn+dNS7uo23JK6n1DGiz7jvHsevax+z/wDFfR0MjaU90o5JtSJx/wCOZryG6tLqxuGtL2NoZUOGRwVYH3B5rZsPFvijS5RPp+oXETL02yN/LNet6d8Z7bXbRdE+KmmxatbdrhFEd0h6bgwwDx6g0ah7r2PA69st1D/CfTpP7mqKPz3VB4p+GWntpj+LPhzef2rpa8yR4xcW/s68HH+0BipLORD8IYFXqurR5/JqG7hFNM6TVIEuvihqryEAR2pbPQZBUV434u1ebVNU8llVIrUeTGi9AF4z9TXr1zby3fxFvhJws0ZQkemQR/KuW1Hw5Jf2RtZcW5guJnZ2XPyOeDxyelJMqSON0+Mt4P1GT+7Nb/rvroNM0XS7lrea5UOYoC3lA7TIw6Zz29a0YLfRNE8L3Ets/wDaNvPIgkLIUUPHnGPzNU9chgje6fHlyRo6/L2OBgVRKQX+iDUJX+3OVk3I4xyAjcdR9K5ya/8AtviKCe3XEFvIioAOFUH/ABrstQ1OG10bR/sxDS3ESxyZ7DJrDs9PW1MsWnSH984VtyHjbzQNo4zVofI1KeP0cn8+azq7rV/D1xfalNcW80AyQNryqjdB2JzXG3VtLZ3DW02NyHBwc00Q0V6KKKBBRRRQB//U/wA/+iiigAoopVVmYKoyTwAKAEor6B8Ifs5eN9dsV8QeKni8NaORn7ZqR8rI7bI2Id8/7Irpj4i+AXwrJj8LWT+L9Wi6Xd5mOzDjusY2uce+RSuPlPI/Avwg+InxGbf4W02SW3H3rmT93brj+9K2EH5164vw0+Cnw4zP8TvEJ1m8QAjT9HIYbu4aYhk/IivNPG3xw+I3jofZtSvzbWY+7a2gEEKj02pjP45ryOjUd0fU8n7SkfhRHsPg74fstBgI4ndPtFyT6lnLKD9BXhHiTx/428X3Ml14l1S5vHlOWEkh2nP+yPl/SuPoosgcmwooopkhRRRQAUUV13hXwF4y8b3H2bwrptxekHDNGhKL/vNjC/iaGwscjSqrMwVRkngAV9DH4PeEPCEH2r4o+I4LedOTp9gRcTt7b03Ip+tQn4weG/CQMPwr0KGyZl2m7vB59wfwOYx+C1PNfYrl7lLwD4F+KGiXMfimzjGlWwGWkvmEEboeo2vjcCPSuvvv+EN/sprWwje6t7u/SRzCwCJcYPCjrt64r5/8QeLvE3im4a58QXst0zHOHb5R9FGAPwFe6/CPQ7jXfBrraJuNvqcckhHZVic5/lUy7suLWyK/jDVmtIY7uw+Sc3pgfdgk7SQfwrR8WXA0WbURGN32TbvXsQ3T+VcJ4qcy6dpd8xyLq/uX/KQf412nj4CTxD4nsFH3raKUf8Az/jS7FX3MjT0F9asnh9YHsZY/MMZYb1mPUMuc/Q1myWNxfT6i14pDWz/uCwwHH9a5L4YXkVn4pQzDcrxsoHYk9Kki1K8uV1Vbidi8Xzx+xUmqtYlbXFvJtQsVtbgbZJpzsIQBgGB5H1we1WZt0d9Kk5UAnMeXCqMDoTx3qrP4i1JvD66raqkLmVkcqvsPm5zgnvj0qn4vls7i0tbq1yTLl3J7tgA4/KqFcdqN5Z6PMbmOJZryZQyyZyi9sqPX61wkkjzSGWU5Zjkk+tdHrKRtpWmyx8t5RVvqGNV9P8L6/qhH2O1kKn+IrtX8zxTJe5g0VPc20tncPaz4DocHBzyPpUFBIUUUUAf/1f8AP/ooooA95+FXwD8RfEe2k8RancRaH4ft8mbUrz5Yxjsg4Lk9BjNeuXfxS+BXwWzZfBjSBr+rxrsOsampZAT1McXC/Qla5bRvif4R+JXg+x+GPxRvZ9Egscm2u7Vd0G4jjzowCT9VFTy/sna1rlsLz4WeItJ8TqT/AKuK4W2mx/1znKMfwFT6l9NDwPxv8R/GvxF1NtV8YahLeSMeFY4jUdgqDCj8BXEV6Hrvwm+JPhue4g1bRLtPsp2yusTOi/VlBXHvmuLk0rVIQGmtpVBGQShGR+VUS79ShRVyLTtQnbbBBI59FUmuisvh/wCPNR40/RL+fP8AzztpG/kpoFY5GivZNO/Z8+M2pHEfh68h4zmeMwj83xXT2X7NvieDdN4w1bStFhX7xlvIpXH/AGzidm/SldD5X2PnSivo+fwH8APDSNJrvi+bWZEP+p0u3eMn/gUybajPxN+EHhuNf+EI8Hrc3KHK3WqSu7r77I2EZ/FaLj5e7PH/AA34F8ZeMJhB4X0u6vie8MTOo+pAwPxr0Fvgvc6EJJPiFq1nogQf6suLiYn08uIsyn6gUzxX+0D8U/FgWGfUvsMCcJFYxpaqB6ZiCk/iTXjlxc3F5M1zdyNLI5yzOSzE+5PNGoaHsEXiL4T+FkVtC0mXWbtT80moviHI6FFjKN+DZqr4j+OPxG8RWo00X32GzXhYLNFt1A9CUAZvxJryOiiyFzMc7vI5kkJZmOSTySabRV/TtL1LV7kWelW8lzM3RIlLsfwFMRQr64/Zx16PRfCnidrpgIzD8g7+YVIH6Zrx+D4NeL0UTa6bfS4yM5upkRv++N279K9A8O+HNI0LRL/TbPWYr43AzIbdWHl4U9cjn8KidmrGkE07s4TxGvlfD/wox+873Tf+PrWn8RdW1O18bXLabGZHurNInABY4bqePpWprGs+FtL8HeGkvdPN+qRyshdigzld3Qjv0rM8XfEbxRpd4LbS5Uhiuolmz5aM+JOcbiCRj2NC3+8rS2/Y5nwn4Q8T2msWurXdnLbwROGdpF2fL3OGwTWpY+HYoNQvtS1a7gt7aVZEUGQM5LdPlByPxFcXpevatd6zbtqN3NKhkXcHckY+mag8YWbaf4nvbJhgxykc0yLqx1kmn6JbaCLH+0BcQ+aHmeJCNmeAOR1OKbfat8P1iighivLv7Ou1PMKqhHvgA5rL8Iqk+matZMu4yQgqPdc4rhiCDg0xNnd6neW9/oEV5pduLdLSbGOvXBHWudufEWt3SCKS5cIvRVO0D8q7PStJe5+GOo6krA+TcoNv8X8PP0rzKmDFJLHc3JNJRRQSFFFFAH//1v8AP/ooooAKs2l5d2E4urGV4ZV6PGxVh+I5qtRQB07+NvGckMlvJq960cvDqZ3Ib6jPNben/FPxzpkEdva3oKRDCh4o5MD/AIEprz2igd2es2Pxv+JOm+b9hvYozMwZiLaHqPT5OPwqpffGb4o6hMZ5dbuo2bqYX8n9E215jRRYLs7C5+IXj68BW81zUJQeoe5kb+bVycsss8hlmYu7HJZjkk/Wo6KBBRRRQAUUUUAFFFFABXeP8RfEkWmRaRpLpYQRDj7OoSQnuTIBv5+tcHRQNOxcvdR1DUpfO1GeS4f+9Ixc/mc17b8FLKC7h1pplz5VozA+leDV7r8IJjaaPr94TtRbUhz6A/8A16mWxVP4jzfWdeg1LwzpGkKD5tgJw5PQiRgVx9AK5aSWWUgysWIAAyc4A7VHRVEt3HxMUkVx1BBr074vRQjxcbuAgrcwxy5HcnOf5V5dXceMdQ07UrXTJ7SXzJVtVWYf3XHak9xrZk/w5Bl1uW1yAJLeTOfYVws6lJ3Q9mIqzpuoT6XfRX9v96Ngcdj7H2NQ3Vw13cvcuAC5JIHTmmK+h3HhS/8A+JJqOlO4VGjMmCcbjjgD6Yrz+iigGwooooEFFFFAH//X/wA/+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACvcPh5crH8NPF1uoBeSCP6hQwzXh9W7e+vLSOWG2laNJ12SBTgMuc4Pr0pNDi7FSiiimIKKKKACiiigAooooAKKKKACiiigD/9D/AD/6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP//R/wA/+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//0v8AP/ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//9k=";

  function makeCertId(s){ let h=7; for(let i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))>>>0; return 'WLN-2026-'+String(h).slice(0,4).padStart(4,'0'); }

  function realQR(certId){
    const url = encodeURIComponent('https://wayanglingua.id/verify/'+certId);
    return `<img src="https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${url}&format=png&color=000000&bgcolor=f0ead8&margin=2"
                 style="width:110px;height:110px;display:block;image-rendering:pixelated"
                 alt="Scan QR to verify ${certId}">`;
  }

  const bpSVG = `<svg viewBox="0 0 200 560" xmlns="http://www.w3.org/2000/svg"
      style="width:210px;min-width:200px;flex:none;display:block;height:100%;min-height:480px"
      preserveAspectRatio="xMidYMid slice">
    <rect width="200" height="560" fill="#070d1c"/>
    <rect x="0" y="0" width="200" height="560" fill="none" stroke="#c8902a" stroke-width="4"/>
    <rect x="5" y="5" width="190" height="550" fill="none" stroke="#d7a928" stroke-width="1.5" opacity=".8"/>
    <rect x="9" y="9" width="182" height="542" fill="none" stroke="#d7a928" stroke-width=".7" opacity=".4"/>
    <line x1="24" y1="12" x2="24" y2="548" stroke="#d7a928" stroke-width="1" opacity=".35"/>
    <line x1="29" y1="12" x2="29" y2="548" stroke="#d7a928" stroke-width=".4" opacity=".2"/>
    <line x1="171" y1="12" x2="171" y2="548" stroke="#d7a928" stroke-width="1" opacity=".35"/>
    <line x1="176" y1="12" x2="176" y2="548" stroke="#d7a928" stroke-width=".4" opacity=".2"/>
    <!-- TOP CROWN -->
    <g fill="#d7a928">
      <path d="M100 14 L97 30 L100 27 L103 30 Z" opacity=".95"/>
      <path d="M91 29 L100 19 L109 29 L107 40 L100 38 L93 40 Z" opacity=".9"/>
      <path d="M80 38 L88 28 L100 34 L112 28 L120 38 L118 53 L100 49 L82 53 Z"/>
      <path d="M70 50 L78 40 L100 46 L122 40 L130 50 L127 66 L100 62 L73 66 Z"/>
      <circle cx="100" cy="29" r="4" fill="#f3cf63"/>
      <circle cx="87" cy="40" r="2.5" fill="#f3cf63" opacity=".75"/>
      <circle cx="113" cy="40" r="2.5" fill="#f3cf63" opacity=".75"/>
      <path d="M70 56 Q55 49 45 57 Q40 66 48 70 Q58 72 66 64 Q70 60 70 56Z" opacity=".85"/>
      <path d="M130 56 Q145 49 155 57 Q160 66 152 70 Q142 72 134 64 Q130 60 130 56Z" opacity=".85"/>
      <path d="M55 62 Q42 57 34 65 Q30 74 38 78 Q48 80 54 71 Q57 67 55 62Z" opacity=".72"/>
      <path d="M145 62 Q158 57 166 65 Q170 74 162 78 Q152 80 146 71 Q143 67 145 62Z" opacity=".72"/>
      <path d="M52 72 Q100 83 148 72 L148 81 Q100 92 52 81 Z" opacity=".6"/>
    </g>
    <!-- UPPER SCROLLWORK -->
    <g fill="#d7a928" opacity=".88">
      <path d="M100 90 C87 102 113 117 100 133 C87 149 113 163 100 178" fill="none" stroke="#d7a928" stroke-width="2.2" opacity=".45"/>
      <path d="M100 97 C85 91 67 98 52 91 C42 86 33 94 29 90" fill="none" stroke="#d7a928" stroke-width="1.7" opacity=".68" stroke-linecap="round"/>
      <path d="M100 97 C115 91 133 98 148 91 C158 86 167 94 171 90" fill="none" stroke="#d7a928" stroke-width="1.7" opacity=".68" stroke-linecap="round"/>
      <circle cx="29" cy="91" r="5.5" fill="none" stroke="#d7a928" stroke-width="1.4" opacity=".75"/>
      <circle cx="29" cy="91" r="2.5" opacity=".5"/>
      <circle cx="171" cy="91" r="5.5" fill="none" stroke="#d7a928" stroke-width="1.4" opacity=".75"/>
      <circle cx="171" cy="91" r="2.5" opacity=".5"/>
      <g transform="translate(100,110)"><circle r="6" fill="#f3cf63" opacity=".75"/><ellipse rx="4" ry="11" opacity=".7"/><ellipse rx="4" ry="11" transform="rotate(60)" opacity=".7"/><ellipse rx="4" ry="11" transform="rotate(120)" opacity=".7"/><ellipse rx="4" ry="11" transform="rotate(90)" opacity=".65"/><ellipse rx="4" ry="11" transform="rotate(30)" opacity=".65"/><ellipse rx="4" ry="11" transform="rotate(150)" opacity=".65"/><circle r="3.5" fill="#f3cf63" opacity=".55"/></g>
      <path d="M54 93 Q46 85 40 93 Q46 103 54 97Z" opacity=".8"/>
      <path d="M68 93 Q58 83 52 93 Q60 105 68 97Z" opacity=".78"/>
      <path d="M83 91 Q74 81 66 91 Q75 103 83 96Z" opacity=".76"/>
      <path d="M146 93 Q154 85 160 93 Q154 103 146 97Z" opacity=".8"/>
      <path d="M132 93 Q142 83 148 93 Q140 105 132 97Z" opacity=".78"/>
      <path d="M117 91 Q126 81 134 91 Q125 103 117 96Z" opacity=".76"/>
      <path d="M100 120 C84 113 66 121 50 114 C40 109 31 117 27 113" fill="none" stroke="#d7a928" stroke-width="1.7" opacity=".62" stroke-linecap="round"/>
      <path d="M100 120 C116 113 134 121 150 114 C160 109 169 117 173 113" fill="none" stroke="#d7a928" stroke-width="1.7" opacity=".62" stroke-linecap="round"/>
      <path d="M38 116 Q28 108 22 116 Q28 127 38 120Z" opacity=".7"/>
      <path d="M162 116 Q172 108 178 116 Q172 127 162 120Z" opacity=".7"/>
    </g>
    <!-- CENTRAL WAYANG FIGURE -->
    <g fill="#d7a928">
      <path d="M100 152 L97 168 L100 165 L103 168 Z"/>
      <path d="M92 167 L100 157 L108 167 L106 178 L100 175 L94 178 Z" opacity=".95"/>
      <path d="M83 176 L91 166 L100 172 L109 166 L117 176 L115 190 L100 186 L85 190 Z"/>
      <path d="M73 188 L81 178 L100 184 L119 178 L127 188 L124 204 L100 200 L76 204 Z"/>
      <circle cx="100" cy="168" r="3.5" fill="#f3cf63"/>
      <circle cx="88" cy="180" r="2.2" fill="#f3cf63" opacity=".8"/>
      <circle cx="112" cy="180" r="2.2" fill="#f3cf63" opacity=".8"/>
      <rect x="77" y="202" width="46" height="6" rx="2"/>
      <path d="M77 205 Q100 208 123 205" fill="none" stroke="#f3cf63" stroke-width="1" opacity=".6"/>
      <path d="M77 192 Q61 186 52 196 Q54 208 67 206 Q74 202 77 196Z" opacity=".85"/>
      <path d="M123 192 Q139 186 148 196 Q146 208 133 206 Q126 202 123 196Z" opacity=".85"/>
      <circle cx="70" cy="228" r="5.5" fill="#c8932a"/>
      <circle cx="70" cy="228" r="3" fill="#f3cf63" opacity=".6"/>
      <circle cx="130" cy="228" r="5.5" fill="#c8932a"/>
      <circle cx="130" cy="228" r="3" fill="#f3cf63" opacity=".6"/>
      <ellipse cx="100" cy="226" rx="23" ry="25" fill="#c8932a"/>
      <ellipse cx="100" cy="228" rx="18" ry="20" fill="#d4a030"/>
      <ellipse cx="88" cy="222" rx="6.5" ry="5" fill="#0a0f1e"/>
      <ellipse cx="89" cy="221" rx="2" ry="1.5" fill="#c8932a" opacity=".25"/>
      <ellipse cx="112" cy="222" rx="6.5" ry="5" fill="#0a0f1e"/>
      <ellipse cx="113" cy="221" rx="2" ry="1.5" fill="#c8932a" opacity=".25"/>
      <path d="M80 216 Q88 212 96 216" fill="none" stroke="#0a0f1e" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M104 216 Q112 212 120 216" fill="none" stroke="#0a0f1e" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M97 227 L95 238 L100 241 L105 238 L103 227" fill="#9a7020" opacity=".6"/>
      <path d="M90 244 Q100 250 110 244" fill="none" stroke="#0a0f1e" stroke-width="2.5" stroke-linecap="round"/>
      <rect x="94" y="249" width="12" height="11" rx="2" fill="#c8932a"/>
      <ellipse cx="100" cy="266" rx="24" ry="6.5" fill="#d7a928" opacity=".7"/>
      <ellipse cx="100" cy="266" rx="19" ry="4.5" fill="#f3cf63" opacity=".35"/>
      <path d="M64 274 Q52 299 54 336 L64 350 L100 346 L136 350 L146 336 Q148 299 136 274 Z" fill="#c8932a" opacity=".92"/>
      <path d="M64 274 Q100 287 136 274 L134 338 Q100 345 66 338 Z" fill="#d7a928" opacity=".28"/>
      <path d="M64 274 Q100 283 136 274" fill="none" stroke="#f3cf63" stroke-width="2" opacity=".8"/>
      <path d="M68 290 Q100 296 132 290" fill="none" stroke="#f3cf63" stroke-width="1" opacity=".44"/>
      <path d="M66 308 Q100 314 134 308" fill="none" stroke="#f3cf63" stroke-width="1" opacity=".38"/>
      <path d="M66 325 Q100 330 134 325" fill="none" stroke="#f3cf63" stroke-width="1" opacity=".32"/>
      <path d="M60 318 Q100 324 140 318 L138 330 Q100 336 62 330 Z" fill="#d7a928" opacity=".5"/>
      <circle cx="100" cy="324" r="5.5" fill="#f3cf63" opacity=".5"/>
      <path d="M64 283 Q48 276 36 287 Q30 299 36 309 Q46 317 58 311 Q66 305 64 295 Q66 287 64 283Z" fill="#c8932a" opacity=".9"/>
      <circle cx="30" cy="303" r="9" fill="#c8932a" opacity=".75"/>
      <circle cx="22" cy="299" r="7" fill="#d7a928" opacity=".7"/>
      <circle cx="22" cy="299" r="4" fill="#f3cf63" opacity=".5"/>
      <path d="M18 293 L22 286 L26 293" fill="#d7a928" opacity=".65"/>
      <path d="M136 283 Q152 276 164 287 Q170 299 164 309 Q154 317 142 311 Q134 305 136 295 Q134 287 136 283Z" fill="#c8932a" opacity=".9"/>
      <path d="M170 287 L166 272 L170 277 L174 272 Z" fill="#f3cf63" opacity=".8"/>
      <ellipse cx="170" cy="272" rx="5" ry="6" fill="#d7a928" opacity=".5"/>
      <path d="M72 346 Q66 374 68 402 L80 406 L84 378 L100 374 Z" fill="#c8932a" opacity=".9"/>
      <path d="M128 346 Q134 374 132 402 L120 406 L116 378 L100 374 Z" fill="#c8932a" opacity=".9"/>
      <path d="M60 346 Q100 354 140 346 L142 362 Q100 370 58 362 Z" fill="#d7a928" opacity=".4"/>
      <ellipse cx="74" cy="404" rx="14" ry="5.5" fill="#d7a928" opacity=".75"/>
      <ellipse cx="126" cy="404" rx="14" ry="5.5" fill="#d7a928" opacity=".75"/>
    </g>
    <!-- LOWER SCROLLWORK -->
    <g fill="#d7a928" opacity=".88">
      <path d="M100 414 C87 427 113 442 100 456 C87 471 113 481 100 493" fill="none" stroke="#d7a928" stroke-width="2.2" opacity=".44"/>
      <path d="M100 420 C85 413 67 421 51 414 C41 409 32 417 28 413" fill="none" stroke="#d7a928" stroke-width="1.7" opacity=".68" stroke-linecap="round"/>
      <path d="M100 420 C115 413 133 421 149 414 C159 409 168 417 172 413" fill="none" stroke="#d7a928" stroke-width="1.7" opacity=".68" stroke-linecap="round"/>
      <circle cx="28" cy="415" r="5.5" fill="none" stroke="#d7a928" stroke-width="1.4" opacity=".72"/><circle cx="28" cy="415" r="2.5" opacity=".52"/>
      <circle cx="172" cy="415" r="5.5" fill="none" stroke="#d7a928" stroke-width="1.4" opacity=".72"/><circle cx="172" cy="415" r="2.5" opacity=".52"/>
      <g transform="translate(100,432)"><circle r="6" fill="#f3cf63" opacity=".72"/><ellipse rx="4" ry="11" opacity=".68"/><ellipse rx="4" ry="11" transform="rotate(60)" opacity=".68"/><ellipse rx="4" ry="11" transform="rotate(120)" opacity=".68"/><ellipse rx="4" ry="11" transform="rotate(90)" opacity=".63"/><ellipse rx="4" ry="11" transform="rotate(30)" opacity=".63"/><ellipse rx="4" ry="11" transform="rotate(150)" opacity=".63"/><circle r="3.5" fill="#f3cf63" opacity=".52"/></g>
      <path d="M54 417 Q46 409 40 417 Q46 427 54 421Z" opacity=".78"/>
      <path d="M68 416 Q59 407 52 416 Q60 428 68 420Z" opacity=".76"/>
      <path d="M83 413 Q74 403 67 413 Q75 425 83 418Z" opacity=".74"/>
      <path d="M146 417 Q154 409 160 417 Q154 427 146 421Z" opacity=".78"/>
      <path d="M132 416 Q141 407 148 416 Q140 428 132 420Z" opacity=".76"/>
      <path d="M117 413 Q126 403 133 413 Q125 425 117 418Z" opacity=".74"/>
      <path d="M100 448 C84 441 66 449 50 442 C40 437 31 445 27 441" fill="none" stroke="#d7a928" stroke-width="1.7" opacity=".6" stroke-linecap="round"/>
      <path d="M100 448 C116 441 134 449 150 442 C160 437 169 445 173 441" fill="none" stroke="#d7a928" stroke-width="1.7" opacity=".6" stroke-linecap="round"/>
      <path d="M38 443 Q28 435 22 443 Q28 454 38 447Z" opacity=".68"/>
      <path d="M162 443 Q172 435 178 443 Q172 454 162 447Z" opacity=".68"/>
    </g>
    <!-- BOTTOM LOTUS -->
    <g fill="#d7a928">
      <path d="M100 475 Q96 489 87 495 Q79 499 75 494 Q71 488 77 482 Q86 478 100 475Z" opacity=".9"/>
      <path d="M100 475 Q104 489 113 495 Q121 499 125 494 Q129 488 123 482 Q114 478 100 475Z" opacity=".9"/>
      <path d="M77 484 Q67 488 61 498 Q59 507 66 510 Q74 512 78 505 Q76 497 77 491Z" opacity=".8"/>
      <path d="M123 484 Q133 488 139 498 Q141 507 134 510 Q126 512 122 505 Q124 497 123 491Z" opacity=".8"/>
      <path d="M63 499 Q53 504 49 514 Q47 523 55 526 Q63 528 65 521 Q63 512 64 506Z" opacity=".7"/>
      <path d="M137 499 Q147 504 151 514 Q153 523 145 526 Q137 528 135 521 Q137 512 136 506Z" opacity=".7"/>
      <circle cx="100" cy="490" r="13" fill="#d7a928" opacity=".48"/>
      <circle cx="100" cy="490" r="9" fill="#f3cf63" opacity=".6"/>
      <circle cx="100" cy="490" r="5.5" fill="#d7a928"/>
      <circle cx="100" cy="490" r="2.5" fill="#f3cf63" opacity=".65"/>
      <rect x="32" y="525" width="136" height="4" rx="2" opacity=".68"/>
      <rect x="38" y="531" width="124" height="3" rx="1.5" opacity=".52"/>
      <rect x="46" y="536" width="108" height="2.5" rx="1.2" opacity=".38"/>
      <rect x="56" y="541" width="88" height="2" rx="1" opacity=".28"/>
      <path d="M26 530 L28 520 L30 530 L20 526 L36 526Z" opacity=".58"/>
      <path d="M174 530 L172 520 L170 530 L180 526 L164 526Z" opacity=".58"/>
    </g>
    <!-- SIDE FILIGREE -->
    <g fill="#d7a928" opacity=".48">
      <ellipse cx="20" cy="175" rx="6" ry="10" transform="rotate(15 20 175)"/>
      <ellipse cx="20" cy="208" rx="5" ry="9" transform="rotate(-10 20 208)"/>
      <ellipse cx="20" cy="242" rx="6" ry="10" transform="rotate(15 20 242)"/>
      <ellipse cx="20" cy="275" rx="5" ry="9" transform="rotate(-10 20 275)"/>
      <ellipse cx="20" cy="308" rx="6" ry="10" transform="rotate(15 20 308)"/>
      <ellipse cx="20" cy="342" rx="5" ry="9" transform="rotate(-10 20 342)"/>
      <ellipse cx="20" cy="375" rx="6" ry="10" transform="rotate(15 20 375)"/>
      <ellipse cx="180" cy="175" rx="6" ry="10" transform="rotate(-15 180 175)"/>
      <ellipse cx="180" cy="208" rx="5" ry="9" transform="rotate(10 180 208)"/>
      <ellipse cx="180" cy="242" rx="6" ry="10" transform="rotate(-15 180 242)"/>
      <ellipse cx="180" cy="275" rx="5" ry="9" transform="rotate(10 180 275)"/>
      <ellipse cx="180" cy="308" rx="6" ry="10" transform="rotate(-15 180 308)"/>
      <ellipse cx="180" cy="342" rx="5" ry="9" transform="rotate(10 180 342)"/>
      <ellipse cx="180" cy="375" rx="6" ry="10" transform="rotate(-15 180 375)"/>
    </g>
  </svg>`;

  function render(){
    const stu    = ss.find(s=>s.id===certStuId) || ss[0];
    const certId = makeCertId(stu.id);
    const cls    = WLN.SEED_CLASSES.find(c=>c.id===stu.classId);
    const d      = new Date();
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const certDate = months[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear();

    el.innerHTML = `
    <div class="topActions noprint" style="margin-bottom:18px;flex-wrap:wrap;gap:10px">
      <h2 style="margin:0;flex:1;min-width:140px">Certificates</h2>
      <select class="input noprint" id="certStuSel" style="width:auto">
        ${ss.map(s=>`<option value="${s.id}"${s.id===certStuId?' selected':''}>${esc(s.name)}</option>`).join('')}
      </select>
      <button class="btn primary noprint" id="issueCertBtn">&#10022; Issue &amp; Archive</button>
      <button class="btn noprint" id="printCertBtn">Print / PDF</button>
      <button class="btn small noprint" id="verifyBtn">&#10003; Verify</button>
    </div>

    <div id="certDoc" style="display:flex;flex-direction:row;background:linear-gradient(160deg,#08112a 0%,#0a1630 40%,#080e22 100%);border:3.5px solid #c8902a;border-radius:3px;overflow:hidden;box-shadow:0 0 100px rgba(215,169,40,.2),0 24px 72px rgba(0,0,0,.75);max-width:900px;min-height:480px;position:relative;margin-bottom:18px">

      ${bpSVG}

      <div style="flex:1;min-width:0;position:relative;display:flex;flex-direction:column">
        <div style="position:absolute;inset:5px 5px 5px 0;border:1px solid rgba(200,144,42,.45);border-left:none;pointer-events:none;z-index:1"></div>
        <div style="position:absolute;inset:9px 9px 9px 0;border:1px solid rgba(200,144,42,.2);border-left:none;pointer-events:none;z-index:1"></div>

        <div style="padding:28px 34px 26px 28px;flex:1;display:flex;flex-direction:column;justify-content:space-between;position:relative;z-index:2">
          <div>
            <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px">
              <div style="width:56px;height:56px;border-radius:50%;border:2px solid #d7a928;background:rgba(215,169,40,.07);display:flex;align-items:center;justify-content:center;flex:none;box-shadow:0 0 18px rgba(215,169,40,.28)">
                <img src="assets/logo-mark.png" style="width:36px;height:36px;object-fit:contain;filter:drop-shadow(0 0 6px rgba(215,169,40,.5))">
              </div>
              <div>
                <div style="font-family:'Cinzel',serif;font-size:clamp(17px,2.2vw,23px);color:#f2e7c9;letter-spacing:.09em;line-height:1.1">Wayang Lingua</div>
                <div style="font-family:'Cinzel',serif;font-size:clamp(17px,2.2vw,23px);color:#f2e7c9;letter-spacing:.09em">Nusantara</div>
              </div>
            </div>
            <div style="height:1px;background:linear-gradient(to right,#d7a928 60%,transparent);margin-bottom:14px"></div>
            <div style="font-family:'Cinzel',serif;font-size:clamp(12px,1.7vw,16px);color:#d7a928;letter-spacing:.28em;text-transform:uppercase;margin-bottom:16px;text-align:center">Certificate of Achievement</div>
            <p style="font-size:12.5px;color:rgba(242,231,201,.6);letter-spacing:.04em;margin:0 0 4px;text-align:center">This is to certify that</p>
            <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(28px,3.8vw,42px);color:#f2e7c9;margin:4px 0 10px;letter-spacing:.04em;line-height:1.1;text-align:center">
              ${esc(stu.name)}
            </div>
            <p style="font-size:12.5px;color:rgba(242,231,201,.65);margin:0 0 4px;text-align:center">has successfully completed the course</p>
            <div style="font-family:'Cinzel',serif;font-size:clamp(12px,1.55vw,15px);color:#f3cf63;letter-spacing:.06em;margin-bottom:5px;text-align:center">
              ${esc(cls?cls.title:'English Language Programme')} (${esc(stu.cefr)})
            </div>
            <p style="font-size:12px;color:rgba(242,231,201,.55);margin:0 0 12px;line-height:1.55;text-align:center">and has demonstrated proficiency in language skills<br>aligned with the CEFR.</p>
            <p style="font-size:12px;color:rgba(242,231,201,.62);letter-spacing:.04em;margin:0 0 14px;text-align:center">Awarded on &emsp;<b style="color:#f2e7c9;font-size:13px">${certDate}</b></p>
            <div style="height:1px;background:rgba(215,169,40,.22);margin-bottom:18px"></div>
          </div>
          <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:16px">
            <div style="flex:1;text-align:left">
              <div style="background:#f0ead8;padding:10px 14px;border-radius:4px;display:inline-block;margin-bottom:8px;min-width:160px;min-height:54px;box-shadow:0 2px 8px rgba(0,0,0,.4)">
                <img id="sigImg" src="${SIG_URI}" style="height:50px;max-width:180px;display:block;filter:brightness(1.2) contrast(1.5) saturate(0.4)" alt="Signature">
              </div>
              <div style="width:190px;height:1px;background:rgba(215,169,40,.6);margin:4px 0 7px"></div>
              <div style="font-family:'Cormorant Garamond',serif;font-size:17px;color:#f3cf63;letter-spacing:.03em">Dr. Joko Slamet</div>
              <div style="font-size:11px;color:rgba(242,231,201,.5);letter-spacing:.1em;text-transform:uppercase;margin-top:2px">Lecturer</div>
            </div>
            <div style="text-align:center;flex:none">
              <div style="background:#f0ead8;padding:8px;border-radius:4px;display:inline-block;margin-bottom:6px;box-shadow:0 2px 8px rgba(0,0,0,.4)">
                ${realQR(certId)}
              </div>
              <div style="font-size:10px;color:rgba(215,169,40,.55);display:block;margin-bottom:5px;letter-spacing:.05em">${certId}</div>
              <button id="verifyBtn2" style="font-size:11px;color:#d7a928;background:rgba(215,169,40,.06);border:1px solid rgba(215,169,40,.45);border-radius:4px;padding:5px 16px;cursor:pointer;letter-spacing:.07em;font-family:'Cinzel',serif;display:block;width:100%;transition:all .18s">Verify Certificate</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="panel ornate noprint" style="max-width:900px">
      <div style="display:flex;gap:20px;flex-wrap:wrap;align-items:flex-start">
        <div style="flex:2;min-width:200px">
          <div class="panelTitle">Certificate Details</div>
          <div style="display:flex;flex-direction:column;gap:7px;font-size:13px">
            <div style="display:flex;gap:8px"><span class="muted" style="width:110px">Recipient</span><b>${esc(stu.name)}</b></div>
            <div style="display:flex;gap:8px"><span class="muted" style="width:110px">Institution</span><b>Universitas Nusantara</b></div>
            <div style="display:flex;gap:8px"><span class="muted" style="width:110px">Programme</span><b>EFL via Wayang Storytelling</b></div>
            <div style="display:flex;gap:8px"><span class="muted" style="width:110px">CEFR Level</span><b>${esc(stu.cefr)}</b></div>
            <div style="display:flex;gap:8px"><span class="muted" style="width:110px">Score</span><b style="color:var(--gold-bright)">${stu.post.Overall}%</b></div>
            <div style="display:flex;gap:8px"><span class="muted" style="width:110px">Certificate</span><b>${certId}</b></div>
            <div style="display:flex;gap:8px"><span class="muted" style="width:110px">Date</span><b>${certDate}</b></div>
          </div>
        </div>
        <div style="flex:1;min-width:160px;display:flex;flex-direction:column;gap:8px">
          <button class="btn primary" id="issueCertFinal" style="width:100%">Issue Certificate</button>
          <button class="btn" id="printCertBtn2" style="width:100%">Print / PDF</button>
          <button class="btn small" data-go="students" style="width:100%">Student Record</button>
        </div>
      </div>
    </div>`;

    document.getElementById('certStuSel')?.addEventListener('change',e=>{ certStuId=e.target.value; App.ctx.certStudentId=certStuId; render(); });
    const doPrint=()=>window.print();
    document.getElementById('printCertBtn')?.addEventListener('click',doPrint);
    document.getElementById('printCertBtn2')?.addEventListener('click',doPrint);

    function doVerify(){
      modal('Certificate Verification',`
        <div style="padding:14px;background:rgba(47,139,125,.1);border-radius:10px;border:1px solid rgba(47,139,125,.3);margin-bottom:14px;display:flex;gap:12px;align-items:center">
          <span style="font-size:28px">&#9989;</span>
          <div><b style="color:var(--teal);font-size:15px">Verified Authentic</b><br>
          <span class="muted small">Issued by Wayang Lingua Nusantara &middot; Dr. Joko Slamet</span></div>
        </div>
        <div style="display:flex;flex-direction:column;gap:7px;font-size:13px">
          <div style="display:flex;gap:8px"><span class="muted" style="min-width:100px">Recipient</span><b>${esc(stu.name)}</b></div>
          <div style="display:flex;gap:8px"><span class="muted" style="min-width:100px">Certificate</span><b>${certId}</b></div>
          <div style="display:flex;gap:8px"><span class="muted" style="min-width:100px">Level</span><b>${esc(stu.cefr)}</b></div>
          <div style="display:flex;gap:8px"><span class="muted" style="min-width:100px">Issued</span><b>${certDate}</b></div>
          <div style="display:flex;gap:8px"><span class="muted" style="min-width:100px">By</span><b>Dr. Joko Slamet &middot; Universitas Nusantara</b></div>
        </div>`);
    }
    document.getElementById('verifyBtn')?.addEventListener('click',doVerify);
    document.getElementById('verifyBtn2')?.addEventListener('click',doVerify);

    function doIssue(){
      if(state.certificates.some(c=>c.certId===certId)){ toast('Already issued and archived.'); return; }
      state.certificates.push({certId,student:stu.name,level:stu.cefr,
        course:WLN.SEED_CLASSES.find(c=>c.id===stu.classId)?.title||'EFL Programme',
        date:new Date().toISOString(),issuedBy:'Dr. Joko Slamet'});
      save(); toast('Certificate issued and archived.'); render();
    }
    document.getElementById('issueCertBtn')?.addEventListener('click',doIssue);
    document.getElementById('issueCertFinal')?.addEventListener('click',doIssue);
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
