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

  /* ── Feature list for hero panel ── */
  const features = [
    ['🎭','Shadow Speaking Theatre','Live pronunciation scoring with wayang AI feedback'],
    ['🧙','5 Wayang AI Mentors','Semar, Gareng, Petruk, Bagong & Dalang AI guide your journey'],
    ['📊','Research Passport','Export pre/post data in CSV, SPSS and JSON for publication'],
    ['🏆','Gamified A1 → C2','XP, badges, streaks and a 16-lakon storytelling journey'],
  ];

  app.innerHTML = `<div style="min-height:100dvh;display:grid;grid-template-columns:55% 45%;background:#060c18;font-family:'Inter',sans-serif">

    <!-- ════ LEFT HERO ════ -->
    <div style="position:relative;min-height:100dvh;overflow:hidden">
      <!-- Atmospheric background -->
      <div style="position:absolute;inset:0;
                  background:url('assets/stage-atmosphere.png') center 30%/cover no-repeat"></div>
      <!-- Dark gradient overlays -->
      <div style="position:absolute;inset:0;
                  background:linear-gradient(135deg,rgba(6,12,24,.88) 0%,rgba(8,16,34,.72) 45%,rgba(6,12,24,.92) 100%)"></div>
      <div style="position:absolute;inset:0;
                  background:linear-gradient(to right,transparent 55%,#060c18 100%)"></div>
      <!-- Golden radial glow -->
      <div style="position:absolute;inset:0;
                  background:radial-gradient(ellipse 55% 40% at 35% 55%,rgba(215,169,40,.14),transparent 70%)"></div>

      <!-- Content -->
      <div style="position:relative;z-index:2;height:100%;min-height:100dvh;
                  display:flex;flex-direction:column;justify-content:center;
                  padding:clamp(36px,6vw,88px) clamp(28px,5vw,68px)">

        <!-- Logo row -->
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:28px">
          <img src="assets/logo-mark.png" alt="WLN Logo"
               style="width:54px;filter:drop-shadow(0 0 18px rgba(215,169,40,.65))">
          <div>
            <div style="font-size:10.5px;letter-spacing:.22em;color:#d7a928;text-transform:uppercase;margin-bottom:3px">
              Universitas Nusantara Indonesia
            </div>
            <div style="font-family:'Cinzel',serif;font-size:13px;letter-spacing:.12em;color:rgba(242,231,201,.55)">
              EFL Platform
            </div>
          </div>
        </div>

        <!-- Main title -->
        <h1 style="font-family:'Cinzel',serif;font-size:clamp(28px,3.8vw,54px);
                   line-height:1.06;letter-spacing:.12em;text-transform:uppercase;
                   margin:0 0 6px;color:#f2e7c9">
          Wayang Lingua
        </h1>
        <h1 style="font-family:'Cinzel',serif;font-size:clamp(28px,3.8vw,54px);
                   line-height:1.06;letter-spacing:.12em;text-transform:uppercase;
                   margin:0 0 18px;color:#f3cf63">
          Nusantara
        </h1>

        <!-- Tagline -->
        <p style="font-family:'Cormorant Garamond',serif;font-style:italic;
                  font-size:clamp(15px,1.7vw,20px);color:#d7a928;
                  margin:0 0 10px;letter-spacing:.05em">
          AI-Powered Wayang Storytelling for EFL Skills
        </p>
        <p style="font-size:clamp(12.5px,1.1vw,14.5px);color:rgba(203,189,151,.62);
                  margin:0 0 32px;max-width:440px;line-height:1.6">
          Where Indonesian Heritage Meets Global Communication.
          Master English through 16 lakon stories with wayang mentors.
        </p>

        <!-- Gold divider -->
        <div style="width:52px;height:2px;background:linear-gradient(90deg,#d7a928,transparent);
                    border-radius:1px;margin-bottom:30px"></div>

        <!-- Feature list -->
        <div style="display:flex;flex-direction:column;gap:16px">
          ${features.map(([ic,t,d])=>`
            <div style="display:flex;gap:14px;align-items:flex-start">
              <div style="width:40px;height:40px;border-radius:11px;flex:none;
                          background:rgba(215,169,40,.08);border:1px solid rgba(215,169,40,.2);
                          display:flex;align-items:center;justify-content:center;font-size:18px">
                ${ic}
              </div>
              <div>
                <b style="display:block;font-size:13.5px;color:#f2e7c9;margin-bottom:2px">${t}</b>
                <span style="font-size:12px;color:rgba(203,189,151,.6);line-height:1.45">${d}</span>
              </div>
            </div>`).join('')}
        </div>

        <!-- Quote + copyright -->
        <div style="margin-top:auto;padding-top:44px">
          <p style="font-family:'Cormorant Garamond',serif;font-style:italic;
                    font-size:15px;color:rgba(215,169,40,.55);margin:0 0 8px">
            "Bahasa adalah jembatan budaya · Language is the bridge of culture."
          </p>
          <p style="font-size:11.5px;color:rgba(203,189,151,.3);letter-spacing:.07em;margin:0">
            © Dr. Joko Slamet 2026 · All rights reserved
          </p>
        </div>
      </div>
    </div>

    <!-- ════ RIGHT AUTH PANEL ════ -->
    <div style="display:flex;align-items:center;justify-content:center;
                padding:clamp(24px,4vw,56px) clamp(20px,4vw,52px);
                background:#0a1428;border-left:1px solid rgba(215,169,40,.1)">
      <div style="width:100%;max-width:380px">

        <!-- Card header -->
        <div style="text-align:center;margin-bottom:28px">
          <img src="assets/logo-mark.png" alt="WLN"
               style="width:40px;margin-bottom:14px;filter:drop-shadow(0 0 10px rgba(215,169,40,.45))">
          <h2 style="font-family:'Cinzel',serif;font-size:17px;letter-spacing:.12em;
                     color:#f2e7c9;margin:0 0 5px;text-transform:uppercase">
            ${tab==='signin'?'Sign In':'Create Account'}
          </h2>
          <p style="font-size:13px;color:rgba(203,189,151,.55);margin:0">
            ${tab==='signin'?'Welcome back to the kelir':'Join the Wayang Lingua community'}
          </p>
          <div style="width:36px;height:2px;background:#d7a928;border-radius:1px;margin:12px auto 0"></div>
        </div>

        <!-- Tab switcher -->
        <div style="display:grid;grid-template-columns:1fr 1fr;background:rgba(255,255,255,.04);
                    border-radius:12px;padding:4px;gap:4px;margin-bottom:24px;
                    border:1px solid rgba(255,255,255,.07)">
          <button id="tabSignin"
                  style="padding:9px 14px;border-radius:9px;border:none;cursor:pointer;
                         font-family:'Cinzel',serif;font-size:12px;letter-spacing:.08em;font-weight:600;
                         transition:all .2s;
                         ${tab==='signin'
                           ? 'background:rgba(215,169,40,.15);color:#f3cf63;'
                           : 'background:transparent;color:rgba(203,189,151,.45);'}">
            Sign In
          </button>
          <button id="tabRegister"
                  style="padding:9px 14px;border-radius:9px;border:none;cursor:pointer;
                         font-family:'Cinzel',serif;font-size:12px;letter-spacing:.08em;font-weight:600;
                         transition:all .2s;
                         ${tab==='register'
                           ? 'background:rgba(215,169,40,.15);color:#f3cf63;'
                           : 'background:transparent;color:rgba(203,189,151,.45);'}">
            Register
          </button>
        </div>

        <!-- Sign In Form -->
        ${tab==='signin' ? `
          <div style="display:flex;flex-direction:column;gap:14px">
            <div>
              <label style="display:block;font-size:11px;color:rgba(203,189,151,.55);
                            letter-spacing:.1em;text-transform:uppercase;margin-bottom:7px">
                Email Address
              </label>
              <input id="liEmail" type="email" class="input"
                     placeholder="your@email.com" autocomplete="email"
                     style="width:100%;box-sizing:border-box">
            </div>
            <div>
              <label style="display:block;font-size:11px;color:rgba(203,189,151,.55);
                            letter-spacing:.1em;text-transform:uppercase;margin-bottom:7px">
                Password
              </label>
              <input id="liPw" type="password" class="input"
                     placeholder="••••••••" autocomplete="current-password"
                     style="width:100%;box-sizing:border-box">
            </div>
            <div id="liErr" style="font-size:13px;color:#e07070;min-height:16px"></div>
            <button id="signInBtn" class="btn primary"
                    style="width:100%;padding:13px 20px;font-size:14px;letter-spacing:.06em;margin-top:2px">
              Enter the Kelir &nbsp;→
            </button>
          </div>` :

        /* Register form */
        `<div style="display:flex;flex-direction:column;gap:12px">
            <div>
              <label style="display:block;font-size:11px;color:rgba(203,189,151,.55);
                            letter-spacing:.1em;text-transform:uppercase;margin-bottom:7px">
                Full Name
              </label>
              <input id="regName" class="input" placeholder="Dr. / Your full name"
                     autocomplete="name" style="width:100%;box-sizing:border-box">
            </div>
            <div>
              <label style="display:block;font-size:11px;color:rgba(203,189,151,.55);
                            letter-spacing:.1em;text-transform:uppercase;margin-bottom:7px">
                Email Address
              </label>
              <input id="regEmail" type="email" class="input"
                     placeholder="your@email.com" autocomplete="email"
                     style="width:100%;box-sizing:border-box">
            </div>
            <div>
              <label style="display:block;font-size:11px;color:rgba(203,189,151,.55);
                            letter-spacing:.1em;text-transform:uppercase;margin-bottom:7px">
                Password
              </label>
              <input id="regPw" type="password" class="input"
                     placeholder="Minimum 6 characters" style="width:100%;box-sizing:border-box">
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
              <div>
                <label style="display:block;font-size:11px;color:rgba(203,189,151,.55);
                              letter-spacing:.1em;text-transform:uppercase;margin-bottom:7px">
                  Role
                </label>
                <select id="regRole" class="input" style="width:100%;box-sizing:border-box">
                  <option value="Student">Student</option>
                  <option value="Lecturer">Lecturer</option>
                </select>
              </div>
              <div>
                <label style="display:block;font-size:11px;color:rgba(203,189,151,.55);
                              letter-spacing:.1em;text-transform:uppercase;margin-bottom:7px">
                  CEFR Level
                </label>
                <select id="regCefr" class="input" style="width:100%;box-sizing:border-box">
                  <option>A1</option><option>A2</option>
                  <option selected>B1</option><option>B2</option>
                  <option>C1</option><option>C2</option>
                </select>
              </div>
            </div>
            <div id="regErr" style="font-size:13px;color:#e07070;min-height:16px"></div>
            <button id="registerBtn" class="btn primary"
                    style="width:100%;padding:13px 20px;font-size:14px;letter-spacing:.06em">
              Create Account &nbsp;→
            </button>
          </div>`}

      </div>
    </div>
  </div>`;

  /* Tab switching */
  document.getElementById('tabSignin')?.addEventListener('click',   () => { App.ctx._authTab='signin';   renderAuth(); });
  document.getElementById('tabRegister')?.addEventListener('click', () => { App.ctx._authTab='register'; renderAuth(); });

  /* Sign In */
  function doSignIn(){
    const email  = document.getElementById('liEmail')?.value?.trim();
    const pw     = document.getElementById('liPw')?.value;
    const errEl  = document.getElementById('liErr');
    if(!email||!pw){ if(errEl) errEl.textContent='Please enter your email and password.'; return; }
    const r = login(email, pw);
    if(r.ok){ App.ctx={}; App.go(defaultRoute(me())); }
    else if(errEl){ errEl.textContent=r.msg; }
  }
  document.getElementById('signInBtn')?.addEventListener('click', doSignIn);
  document.getElementById('liPw')?.addEventListener('keydown',    e => { if(e.key==='Enter') doSignIn(); });
  document.getElementById('liEmail')?.addEventListener('keydown', e => { if(e.key==='Enter') document.getElementById('liPw')?.focus(); });

  /* Register */
  document.getElementById('registerBtn')?.addEventListener('click', () => {
    const name  = document.getElementById('regName')?.value?.trim();
    const email = document.getElementById('regEmail')?.value?.trim();
    const pw    = document.getElementById('regPw')?.value;
    const role  = document.getElementById('regRole')?.value;
    const cefr  = document.getElementById('regCefr')?.value;
    const errEl = document.getElementById('regErr');
    const r = register({name,email,password:pw,role,cefr});
    if(r.ok){ App.ctx={}; App.go(defaultRoute(me())); }
    else if(errEl){ errEl.textContent=r.msg; }
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
      <!-- sidebar -->
      <aside class="side" id="sidebar">
        <div class="sideBrand">
          <img src="assets/logo-mark.png" alt="WLN"
               style="width:36px;height:44px;object-fit:contain;filter:drop-shadow(0 0 8px rgba(215,169,40,.45))">
          <div>
            <div style="font-family:var(--font-display);font-size:14px;letter-spacing:.1em;color:var(--gold-bright)">WLN</div>
            <div style="font-size:10px;color:var(--cream-dim);letter-spacing:.06em">Wayang Lingua</div>
          </div>
        </div>
        <nav class="nav" id="mainNav">
          ${nav.map(n=>`
            <button class="${App.route===n.route?'active':''}" data-go="${n.route}" aria-label="${n.label}">
              ${Icons[n.icon]||''}
              <span>${n.label}</span>
            </button>`).join('')}
        </nav>
        <div class="sideUser">
          <div class="avatar">${esc(user.name.charAt(0).toUpperCase())}</div>
          <b>${esc(user.name)}</b>
          <span class="role">${esc(user.role)}</span>
          <button class="btn small" id="logoutBtn"
                  style="width:100%;margin-top:10px;font-size:12px;display:flex;align-items:center;justify-content:center;gap:6px">
            ${Icons.logout}<span>Sign Out</span>
          </button>
        </div>
      </aside>

      <!-- main area -->
      <div class="main">
        <header class="topBar">
          <button class="menuBtn" id="menuBtn" aria-label="Toggle menu">${Icons.menu}</button>
          <div class="titleBlock">
            <h1 style="font-size:clamp(17px,2vw,22px);margin:0;letter-spacing:.04em">
              ${ROUTE_TITLES[App.route] || 'Wayang Lingua Nusantara'}
            </h1>
            ${user.role==='Student'
              ? `<div class="sub" style="font-size:13px;margin-top:2px">
                   ${esc(user.name)} &ensp;&middot;&ensp;
                   <span style="color:var(--gold)">&#9889; ${rec()?.xp||0} XP</span>&ensp;
                   <span>&#128293; ${rec()?.streak||0} day streak</span>
                 </div>`
              : `<div class="sub" style="font-size:13px;margin-top:2px">${esc(user.institution||'Wayang Lingua Nusantara')}</div>`}
          </div>
        </header>
        <div id="viewRoot" style="max-width:1100px;margin:0 auto"></div>
      </div>
    </div>`;

  document.getElementById('menuBtn')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.toggle('open');
  });
  document.querySelector('.main')?.addEventListener('click', () => {
    if(window.innerWidth <= 900) document.getElementById('sidebar')?.classList.remove('open');
  });
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    logout(); App.route = 'auth'; App.ctx = {}; renderAuth();
  });
  document.getElementById('mainNav')?.querySelectorAll('[data-go]').forEach(btn => {
    btn.addEventListener('click', () => {
      App.ctx.classId = null; App.ctx.studentId = null;
      App.ctx.submissionId = null; App.ctx.roomId = null;
      App.go(btn.dataset.go);
    });
  });
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
