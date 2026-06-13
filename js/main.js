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

      <!-- ══ LEFT: Full-height hero panel ══ -->
      <div class="authHero">
        <div class="authHeroInner">
          <div class="authLogoMark"></div>

          <p style="font-size:11px;letter-spacing:.22em;color:var(--gold);text-transform:uppercase;margin:0 0 16px">
            Universitas Nusantara
          </p>

          <h1 class="authHeroTitle">
            Wayang Lingua<span>Nusantara</span>
          </h1>
          <p class="authHeroSub">
            Master English through the art of wayang
          </p>

          <div class="authDivider"></div>

          <div class="authFeatureList">
            <div class="authFeatureItem">
              <div class="afi">🎭</div>
              <div>
                <b>Shadow Speaking Theatre</b>
                Live pronunciation scoring with AI feedback
              </div>
            </div>
            <div class="authFeatureItem">
              <div class="afi">🧙</div>
              <div>
                <b>Wayang AI Mentors</b>
                Semar, Gareng, Petruk &amp; more as language guides
              </div>
            </div>
            <div class="authFeatureItem">
              <div class="afi">📊</div>
              <div>
                <b>Research Passport</b>
                Export pre/post data in CSV, SPSS &amp; JSON
              </div>
            </div>
            <div class="authFeatureItem">
              <div class="afi">🏆</div>
              <div>
                <b>Gamified Journey</b>
                XP, badges &amp; streaks — A1 through C2
              </div>
            </div>
          </div>

          <div class="authHeroCopy">
            © Dr. Joko Slamet 2026 · All rights reserved
          </div>
        </div>
      </div>

      <!-- ══ RIGHT: Auth card ══ -->
      <div class="authRight">
        <div class="authCard">

          <div class="authCardHead">
            <h2>${tab === 'signin' ? 'Sign In' : 'Create Account'}</h2>
            <p>${tab === 'signin'
              ? 'Welcome back to the kelir'
              : 'Join the Wayang Lingua community'}</p>
            <div class="authGoldLine"></div>
          </div>

          <div class="authTabs">
            <button class="tab${tab === 'signin' ? ' active' : ''}" id="tabSignin">Sign In</button>
            <button class="tab${tab === 'register' ? ' active' : ''}" id="tabRegister">Register</button>
          </div>

          ${tab === 'signin' ? `
            <div>
              <label class="small muted" style="display:block;margin-bottom:6px">Email Address</label>
              <input class="input" id="liEmail" type="email" placeholder="your@email.com"
                style="margin-bottom:14px" autocomplete="email">

              <label class="small muted" style="display:block;margin-bottom:6px">Password</label>
              <input class="input" id="liPw" type="password" placeholder="Enter your password"
                style="margin-bottom:6px" autocomplete="current-password">

              <div id="liErr" class="authMsg"></div>

              <button class="btn primary" style="width:100%;margin-top:10px;padding:13px" id="signInBtn">
                Enter the Kelir →
              </button>
            </div>` : `
            <div>
              <label class="small muted" style="display:block;margin-bottom:6px">Full Name</label>
              <input class="input" id="regName" placeholder="Dr. / Your full name"
                style="margin-bottom:14px" autocomplete="name">

              <label class="small muted" style="display:block;margin-bottom:6px">Email Address</label>
              <input class="input" id="regEmail" type="email" placeholder="your@email.com"
                style="margin-bottom:14px" autocomplete="email">

              <label class="small muted" style="display:block;margin-bottom:6px">Password</label>
              <input class="input" id="regPw" type="password" placeholder="Minimum 6 characters"
                style="margin-bottom:14px" autocomplete="new-password">

              <div class="grid2" style="margin-bottom:14px;gap:10px">
                <div>
                  <label class="small muted" style="display:block;margin-bottom:6px">Role</label>
                  <select class="input" id="regRole">
                    <option value="Student">Student</option>
                    <option value="Lecturer">Lecturer</option>
                  </select>
                </div>
                <div>
                  <label class="small muted" style="display:block;margin-bottom:6px">CEFR Level</label>
                  <select class="input" id="regCefr">
                    <option>A1</option><option>A2</option>
                    <option selected>B1</option><option>B2</option>
                    <option>C1</option><option>C2</option>
                  </select>
                </div>
              </div>

              <div id="regErr" class="authMsg"></div>

              <button class="btn primary" style="width:100%;margin-top:4px;padding:13px" id="registerBtn">
                Create Account →
              </button>
            </div>`}

        </div>
      </div>

    </div>`;

  /* ── Tab switching ── */
  document.getElementById('tabSignin')?.addEventListener('click',   () => { App.ctx._authTab = 'signin';    renderAuth(); });
  document.getElementById('tabRegister')?.addEventListener('click', () => { App.ctx._authTab = 'register';  renderAuth(); });

  /* ── Sign In ── */
  function doSignIn(){
    const email = document.getElementById('liEmail')?.value?.trim();
    const pw    = document.getElementById('liPw')?.value;
    const errEl = document.getElementById('liErr');
    if(!email || !pw){ if(errEl) errEl.textContent = 'Please enter your email and password.'; return; }
    const r = login(email, pw); /* requireAdmin=false — works for all roles */
    if(r.ok){
      App.ctx = {};
      App.go(defaultRoute(me()));
    } else {
      if(errEl) errEl.textContent = r.msg;
    }
  }
  document.getElementById('signInBtn')?.addEventListener('click', doSignIn);
  document.getElementById('liPw')?.addEventListener('keydown', e => { if(e.key === 'Enter') doSignIn(); });
  document.getElementById('liEmail')?.addEventListener('keydown', e => { if(e.key === 'Enter') document.getElementById('liPw')?.focus(); });

  /* ── Register ── */
  document.getElementById('registerBtn')?.addEventListener('click', () => {
    const name  = document.getElementById('regName')?.value?.trim();
    const email = document.getElementById('regEmail')?.value?.trim();
    const pw    = document.getElementById('regPw')?.value;
    const role  = document.getElementById('regRole')?.value;
    const cefr  = document.getElementById('regCefr')?.value;
    const errEl = document.getElementById('regErr');
    const r = register({ name, email, password: pw, role, cefr });
    if(r.ok){
      App.ctx = {};
      App.go(defaultRoute(me()));
    } else {
      if(errEl) errEl.textContent = r.msg;
    }
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
