/* main.js — Wayang Lingua Nusantara
   App shell · Router · Auth landing · Global event delegation · Boot
   © Dr. Joko Slamet 2026 — All rights reserved */
'use strict';

/* ═══════════════════════════════════════════════════════════
   APP OBJECT — single routing source of truth
════════════════════════════════════════════════════════════ */
const App = {
  route: 'auth',
  ctx: {},

  go(route, ctx){
    this.route = route;
    if(ctx) Object.assign(this.ctx, ctx);
    this.render();
  },

  refresh(){
    this.render();
  },

  render(){
    const user = me();
    if(!user || this.route==='auth'){
      renderAuth();
    } else {
      renderShell(user);
    }
  }
};

/* ═══════════════════════════════════════════════════════════
   NAV CONFIG — per role
════════════════════════════════════════════════════════════ */
const NAV_STUDENT = [
  { route:'home',      label:'Home',             icon:'dashboard' },
  { route:'stories',   label:'Story Library',    icon:'story'     },
  { route:'theatre',   label:'Speaking Theatre', icon:'theatre'   },
  { route:'mentors',   label:'AI Mentors',       icon:'mentor'    },
  { route:'progress',  label:'My Progress',      icon:'progress'  },
  { route:'badges',    label:'My Badges',        icon:'badge'     },
  { route:'settings',  label:'Settings',         icon:'settings'  },
];
const NAV_LECTURER = [
  { route:'dashboard',  label:'Dashboard',       icon:'dashboard'   },
  { route:'classes',    label:'My Classes',      icon:'classes'     },
  { route:'students',   label:'Students',        icon:'students'    },
  { route:'assessments',label:'Assessments',     icon:'assignment'  },
  { route:'analytics',  label:'Analytics',       icon:'analytics'   },
  { route:'passport',   label:'Research Passport',icon:'passport'   },
  { route:'rooms',      label:'Virtual Rooms',   icon:'room'        },
  { route:'certificate',label:'Certificates',    icon:'cert'        },
  { route:'settings',   label:'Settings',        icon:'settings'    },
];
const NAV_ADMIN = [
  ...NAV_LECTURER,
  { route:'users',        label:'User Management',icon:'users'   },
  { route:'adminConsole', label:'Admin Console',  icon:'builder' },
];

function navFor(user){
  if(user.role==='Admin')    return NAV_ADMIN;
  if(user.role==='Lecturer') return NAV_LECTURER;
  return NAV_STUDENT;
}

function defaultRoute(user){
  return user.role==='Student' ? 'home' : 'dashboard';
}

const ROUTE_TITLES = {
  home:'Home', stories:'Story Library', theatre:'Speaking Theatre',
  mentors:'AI Mentors', progress:'My Progress', badges:'My Badges',
  lesson:'Lesson Journey', dashboard:'Dashboard', classes:'Classes',
  students:'Students', assessments:'Assessments', analytics:'Analytics',
  passport:'Research Passport', rooms:'Virtual Rooms', certificate:'Certificates',
  users:'User Management', adminConsole:'Admin Console', settings:'Settings',
};

/* ═══════════════════════════════════════════════════════════
   AUTH LANDING PAGE
════════════════════════════════════════════════════════════ */
function renderAuth(){
  const app = document.getElementById('app');
  const tab = App.ctx._authTab || 'signin';

  app.innerHTML = `
    <div class="auth">
      <!-- ── left brand stage ── -->
      <div class="authStage">
        <div class="brandHero">
          <img src="assets/logo-mark.png" alt="WLN Logo" style="width:68px;margin-bottom:18px;filter:drop-shadow(0 0 14px rgba(215,169,40,.45))">
          <h1 style="font-size:clamp(1.4rem,3vw,2.1rem);line-height:1.15;margin:0 0 10px">Wayang Lingua<br>Nusantara</h1>
          <p class="sub" style="margin:0 0 24px;font-size:1.05em">Master English through the art of wayang.<br>Perform. Speak. Grow.</p>
          <div class="metricRow" style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center;margin-bottom:28px">
            <div class="metric"><b>16</b><span>Lakon Stories</span></div>
            <div class="metric"><b>10</b><span>AI Mentors</span></div>
            <div class="metric"><b>6</b><span>CEFR Levels</span></div>
          </div>
          <div class="pillarRow" style="display:flex;flex-direction:column;gap:8px;width:100%;max-width:340px">
            ${[
              ['🎭','Shadow Speaking Theatre','Live pronunciation scoring with AI feedback'],
              ['🧙','Wayang AI Mentors','Semar, Gareng, Petruk & more as your language guides'],
              ['📊','Research Passport','Export pre/post data in CSV, SPSS, and JSON formats'],
              ['🏆','Gamified Journey','XP, badges, streaks — from A1 to C2'],
            ].map(([ic,t,d])=>`
              <div style="display:flex;gap:12px;align-items:flex-start;text-align:left;padding:10px;background:rgba(255,255,255,.04);border-radius:10px;border:1px solid var(--line-soft)">
                <span style="font-size:18px;flex:none">${ic}</span>
                <div><b style="font-size:13.5px">${t}</b><div class="muted small" style="margin-top:2px">${d}</div></div>
              </div>`).join('')}
          </div>
        </div>
      </div>

      <!-- ── right auth card ── -->
      <div style="display:flex;align-items:center;justify-content:center;padding:40px 24px">
        <div class="authCard">
          <div class="authTabs">
            <button class="btn small${tab==='signin'?' primary':''}" id="tabSignin">Sign In</button>
            <button class="btn small${tab==='register'?' primary':''}" id="tabRegister">Register</button>
            <button class="btn small${tab==='admin'?' primary':''}" id="tabAdmin">Admin</button>
          </div>

          ${tab==='signin'?`
            <h2 style="font-size:20px;margin:0 0 18px">Welcome back</h2>
            <label class="small muted" style="display:block;margin-bottom:5px">Email</label>
            <input class="input" id="liEmail" type="email" placeholder="your@email.com" style="margin-bottom:10px">
            <label class="small muted" style="display:block;margin-bottom:5px">Password</label>
            <input class="input" id="liPw" type="password" placeholder="Password" style="margin-bottom:16px">
            <div id="liErr" class="authMsg" style="display:none"></div>
            <button class="btn primary" style="width:100%" id="signInBtn">Enter the Kelir</button>`:

          tab==='register'?`
            <h2 style="font-size:20px;margin:0 0 18px">Create Account</h2>
            <label class="small muted" style="display:block;margin-bottom:5px">Full Name</label>
            <input class="input" id="regName" placeholder="Your name" style="margin-bottom:10px">
            <label class="small muted" style="display:block;margin-bottom:5px">Email</label>
            <input class="input" id="regEmail" type="email" placeholder="your@email.com" style="margin-bottom:10px">
            <label class="small muted" style="display:block;margin-bottom:5px">Password</label>
            <input class="input" id="regPw" type="password" placeholder="Min. 6 characters" style="margin-bottom:10px">
            <label class="small muted" style="display:block;margin-bottom:5px">Role</label>
            <select class="input" id="regRole" style="margin-bottom:10px"><option value="Student">Student</option><option value="Lecturer">Lecturer</option></select>
            <label class="small muted" style="display:block;margin-bottom:5px">Starting Level</label>
            <select class="input" id="regCefr" style="margin-bottom:16px">
              <option>A1</option><option>A2</option><option selected>B1</option><option>B2</option><option>C1</option><option>C2</option>
            </select>
            <div id="regErr" class="authMsg" style="display:none"></div>
            <button class="btn primary" style="width:100%" id="registerBtn">Create Account</button>`:
          `
            <h2 style="font-size:20px;margin:0 0 8px">Administrator</h2>
            <p class="muted small" style="margin:0 0 18px">Full system access for platform management.</p>
            <label class="small muted" style="display:block;margin-bottom:5px">Admin Email</label>
            <input class="input" id="adEmail" type="email" placeholder="admin@wayanglingua.id" style="margin-bottom:10px">
            <label class="small muted" style="display:block;margin-bottom:5px">Password</label>
            <input class="input" id="adPw" type="password" placeholder="Admin password" style="margin-bottom:16px">
            <div id="adErr" class="authMsg" style="display:none"></div>
            <button class="btn primary" style="width:100%" id="adminSignIn">Admin Sign In</button>`}

          <div class="demoHint">
            <b style="display:block;margin-bottom:6px;color:var(--gold)">Demo Credentials</b>
            <div style="font-size:12px;line-height:1.8;color:var(--cream-dim)">
              🎓 <b style="color:var(--cream)">Student:</b> siti.nur@student.ac.id / Student@2026<br>
              📋 <b style="color:var(--cream)">Lecturer:</b> lecturer@wayanglingua.id / Lecturer@2026<br>
              🔑 <b style="color:var(--cream)">Admin:</b> admin@wayanglingua.id / Admin@JS2026
            </div>
          </div>
        </div>
      </div>
    </div>`;

  /* tab switching */
  const setTab = t => { App.ctx._authTab=t; renderAuth(); };
  document.getElementById('tabSignin')?.addEventListener('click',()=>setTab('signin'));
  document.getElementById('tabRegister')?.addEventListener('click',()=>setTab('register'));
  document.getElementById('tabAdmin')?.addEventListener('click',()=>setTab('admin'));

  /* sign in */
  function tryLogin(emailId, pwId, errId, adminOnly=false){
    const email = document.getElementById(emailId)?.value?.trim();
    const pw    = document.getElementById(pwId)?.value;
    const r     = login(email, pw, adminOnly);
    if(r.ok){ App.ctx={};  App.go(defaultRoute(me())); }
    else{ const el=document.getElementById(errId); if(el){ el.textContent=r.msg; el.style.display='block'; } }
  }
  document.getElementById('signInBtn')?.addEventListener('click',()=>tryLogin('liEmail','liPw','liErr'));
  document.getElementById('adminSignIn')?.addEventListener('click',()=>tryLogin('adEmail','adPw','adErr',true));
  ['liEmail','liPw','adEmail','adPw'].forEach(id=>{
    document.getElementById(id)?.addEventListener('keydown',e=>{ if(e.key==='Enter') (id.startsWith('ad')?tryLogin('adEmail','adPw','adErr',true):tryLogin('liEmail','liPw','liErr')); });
  });

  /* register */
  document.getElementById('registerBtn')?.addEventListener('click',()=>{
    const name  = document.getElementById('regName')?.value?.trim();
    const email = document.getElementById('regEmail')?.value?.trim();
    const pw    = document.getElementById('regPw')?.value;
    const role  = document.getElementById('regRole')?.value;
    const cefr  = document.getElementById('regCefr')?.value;
    const r = register({name,email,password:pw,role,cefr});
    if(r.ok){ App.go(defaultRoute(me())); }
    else{ const el=document.getElementById('regErr'); if(el){ el.textContent=r.msg; el.style.display='block'; } }
  });
}

/* ═══════════════════════════════════════════════════════════
   APP SHELL — sidebar + topbar + view root
════════════════════════════════════════════════════════════ */
function renderShell(user){
  const app = document.getElementById('app');
  const nav  = navFor(user);
  const route = App.route === 'auth' ? defaultRoute(user) : App.route;
  if(App.route === 'auth') App.route = route;

  app.innerHTML = `
    <div class="shell">
      <!-- ── sidebar ── -->
      <aside class="side" id="sidebar">
        <div class="sideBrand">
          <img src="assets/logo-mark.png" alt="WLN" style="width:32px;filter:drop-shadow(0 0 6px rgba(215,169,40,.4))">
          <span style="font-family:var(--font-display);font-size:14px;letter-spacing:.08em;color:var(--gold)">WLN</span>
        </div>
        <nav class="nav" id="mainNav">
          ${nav.map(n=>`
            <a class="navItem${App.route===n.route?' active':''}" data-go="${n.route}" role="button" tabindex="0" aria-label="${n.label}">
              <span class="navIc">${Icons[n.icon]||''}</span>
              <span class="navLabel">${n.label}</span>
            </a>`).join('')}
        </nav>
        <div class="sideFoot">
          <div class="sideUser">
            <div style="width:32px;height:32px;border-radius:50%;background:var(--navy-3);border:1px solid var(--gold);display:flex;align-items:center;justify-content:center;font-size:14px;flex:none">
              ${user.name.charAt(0).toUpperCase()}
            </div>
            <div style="min-width:0">
              <b style="font-size:12.5px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(user.name)}</b>
              <span style="font-size:11px;color:var(--cream-dim)">${esc(user.role)}</span>
            </div>
          </div>
          <button class="btn small" id="logoutBtn" title="Sign out" style="width:100%;margin-top:8px;font-size:12px">
            ${Icons.logout} Sign Out
          </button>
        </div>
      </aside>

      <!-- ── main area ── -->
      <div class="main">
        <header class="topBar">
          <button class="menuBtn" id="menuBtn" aria-label="Toggle menu">${Icons.menu}</button>
          <div>
            <div style="font-family:var(--font-display);font-size:16px;font-weight:600;color:var(--cream)">
              ${ROUTE_TITLES[App.route] || 'Wayang Lingua Nusantara'}
            </div>
            ${user.role==='Student'?`<div class="sub" style="font-size:13px">${esc(user.name)}</div>`:''}
          </div>
          <div style="margin-left:auto;display:flex;align-items:center;gap:10px">
            ${user.role==='Student'?`
              <span style="font-size:13px;color:var(--gold)">⚡ ${rec()?.xp||0} XP</span>
              <span style="font-size:13px;color:var(--cream-dim)">🔥 ${rec()?.streak||0}</span>`:''}
          </div>
        </header>

        <div id="viewRoot" style="padding:22px 24px;max-width:1100px;margin:0 auto"></div>
      </div>
    </div>`;

  /* sidebar overlay close */
  document.getElementById('menuBtn')?.addEventListener('click',()=>{
    document.getElementById('sidebar')?.classList.toggle('open');
  });
  document.querySelector('.main')?.addEventListener('click',e=>{
    if(window.innerWidth<=900) document.getElementById('sidebar')?.classList.remove('open');
  });

  /* logout */
  document.getElementById('logoutBtn')?.addEventListener('click',()=>{
    logout(); App.route='auth'; App.ctx={}; renderAuth();
  });

  /* nav item clicks (keyboard + mouse) */
  document.getElementById('mainNav')?.querySelectorAll('[data-go]').forEach(a=>{
    const go=()=>{ App.ctx.classId=null; App.ctx.studentId=null; App.ctx.submissionId=null; App.ctx.roomId=null; App.go(a.dataset.go); };
    a.addEventListener('click',go);
    a.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); go(); } });
  });

  /* render current route into viewRoot */
  routeToView();
}

/* ═══════════════════════════════════════════════════════════
   ROUTER
════════════════════════════════════════════════════════════ */
function routeToView(){
  const el = document.getElementById('viewRoot');
  if(!el) return;
  const user = me();
  if(!user) { renderAuth(); return; }
  const r = App.route;

  /* guard: students can't access teacher routes */
  const teacherRoutes = ['dashboard','classes','students','assessments','analytics','passport','rooms','certificate','users','adminConsole'];
  if(user.role==='Student' && teacherRoutes.includes(r)){ App.go('home'); return; }
  /* guard: non-admins can't access admin routes */
  if(user.role!=='Admin' && (r==='users'||r==='adminConsole')){ App.go('dashboard'); return; }

  el.innerHTML = '';
  try{
    switch(r){
      /* Student */
      case 'home':        Views.home(el);                        break;
      case 'stories':     Views.stories(el);                     break;
      case 'lesson':      Views.lesson(el, App.ctx.lessonId);    break;
      case 'theatre':     Views.theatre(el);                     break;
      case 'mentors':     Views.mentors(el);                     break;
      case 'progress':    Views.progress(el);                    break;
      case 'badges':      Views.badges(el);                      break;
      /* Lecturer / Admin */
      case 'dashboard':   Views.dashboard(el);                   break;
      case 'classes':     Views.classes(el);                     break;
      case 'students':    Views.students(el);                    break;
      case 'assessments': Views.assessments(el);                 break;
      case 'analytics':   Views.analytics(el);                   break;
      case 'passport':    Views.passport(el);                    break;
      case 'rooms':       Views.rooms(el);                       break;
      case 'certificate': Views.certificate(el);                 break;
      /* Admin only */
      case 'users':       Views.users(el);                       break;
      case 'adminConsole':Views.adminConsole(el);                break;
      /* Shared */
      case 'settings':    Views.settings(el);                    break;
      default:
        el.innerHTML = `<p class="muted">Page not found. <button class="btn small" data-go="${defaultRoute(user)}">Go Home</button></p>`;
    }
  } catch(err){
    console.error('Route render error:', err);
    el.innerHTML = `<div class="panel ornate"><b style="color:var(--rust)">Something went wrong</b><p class="muted small" style="margin:8px 0 12px">${esc(String(err.message))}</p><button class="btn small" data-go="${defaultRoute(user)}">Go Home</button></div>`;
  }

  /* scroll to top on route change */
  el.scrollTop = 0;
  window.scrollTo(0,0);
}

/* ═══════════════════════════════════════════════════════════
   GLOBAL CLICK DELEGATION — [data-go] anywhere in the page
════════════════════════════════════════════════════════════ */
document.addEventListener('click', e=>{
  const el = e.target.closest('[data-go]');
  if(!el) return;
  const route = el.dataset.go;
  if(!route) return;

  /* if handled by a specific view's own listener, don't double-fire */
  if(el.closest('#mainNav')) return; /* nav handled in renderShell */

  const ctx = {};
  if(el.dataset.id)      ctx.lessonId   = el.dataset.id;
  if(el.dataset.classid) ctx.classId    = el.dataset.classid;
  if(el.dataset.stuid)   ctx.studentId  = el.dataset.stuid;
  if(el.dataset.subid)   ctx.submissionId=el.dataset.subid;
  if(el.dataset.roomid)  ctx.roomId     = el.dataset.roomid;
  if(el.dataset.mentor)  ctx.mentorId   = el.dataset.mentor;

  Object.assign(App.ctx, ctx);
  App.go(route);
});

/* ═══════════════════════════════════════════════════════════
   BOOT
════════════════════════════════════════════════════════════ */
function boot(){
  const user = me();
  if(user){
    App.route = defaultRoute(user);
    renderShell(user);
  } else {
    renderAuth();
  }
}

/* register service worker for PWA if supported */
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('sw.js').catch(()=>{/* offline OK without SW */});
  });
}

boot();
