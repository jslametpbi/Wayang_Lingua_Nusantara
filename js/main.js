/* main.js — Wayang Lingua Nusantara
   Complete rebuild: auth, shell, nav, topbar, router, community, boot
   © Dr. Joko Slamet 2026 — All rights reserved */
'use strict';

/* ═══════════════════════════════════════════════════
   APP — single source of truth for routing
═══════════════════════════════════════════════════ */
const App = {
  route: 'auth',
  ctx: {},
  go(route, ctx) {
    this.route = route;
    if (ctx) Object.assign(this.ctx, ctx);
    this.render();
  },
  refresh() { this.render(); },
  render() {
    const user = me();
    if (!user || this.route === 'auth') { renderAuth(); }
    else { renderShell(user); }
  }
};

/* ═══════════════════════════════════════════════════
   NAV DEFINITIONS
═══════════════════════════════════════════════════ */
const NAV_STUDENT = [
  { route:'home',     label:'Home',             icon:'dashboard'  },
  { route:'stories',  label:'Story Library',    icon:'story'      },
  { route:'theatre',  label:'Speaking Theatre', icon:'theatre'    },
  { route:'mentors',  label:'AI Mentors',       icon:'mentor'     },
  { route:'progress', label:'My Progress',      icon:'progress'   },
  { route:'badges',   label:'My Badges',        icon:'badge'      },
  { route:'community',label:'Community',        icon:'community'  },
  { route:'settings', label:'Settings',         icon:'settings'   },
];
const NAV_LECTURER = [
  { route:'dashboard',  label:'Dashboard',        icon:'dashboard'  },
  { route:'classes',    label:'Classes',          icon:'classes'    },
  { route:'students',   label:'Students',         icon:'students'   },
  { route:'assessments',label:'Assessments',      icon:'assignment' },
  { route:'analytics',  label:'Analytics',        icon:'analytics'  },
  { route:'passport',   label:'Research Passport',icon:'passport'   },
  { route:'rooms',      label:'Virtual Rooms',    icon:'room'       },
  { route:'certificate',label:'Certificates',     icon:'cert'       },
  { route:'resource',   label:'Resources',        icon:'resource'   },
  { route:'community',  label:'Community',        icon:'community'  },
  { route:'settings',   label:'Settings',         icon:'settings'   },
];
const NAV_ADMIN = [
  ...NAV_LECTURER,
  { route:'users',        label:'User Management', icon:'users'    },
  { route:'adminConsole', label:'Admin Console',   icon:'builder'  },
];

const ROUTE_TITLES = {
  home:'Home', stories:'Story Library', theatre:'Speaking Theatre',
  mentors:'AI Mentors', progress:'My Progress', badges:'My Badges',
  lesson:'Lesson Journey', dashboard:'Dashboard', classes:'Classes',
  students:'Students', assessments:'Assessments', analytics:'Analytics',
  passport:'Research Passport', rooms:'Virtual Rooms', certificate:'Certificates',
  resource:'Resources', community:'Community', users:'User Management',
  adminConsole:'Admin Console', settings:'Settings',
};

function navFor(u)  { return u.role==='Admin'?NAV_ADMIN:u.role==='Lecturer'?NAV_LECTURER:NAV_STUDENT; }
function homeFor(u) { return u.role==='Student'?'home':'dashboard'; }

/* ═══════════════════════════════════════════════════
   AUTH LANDING — cinematic wayang split-panel
═══════════════════════════════════════════════════ */
function renderAuth() {
  const app = document.getElementById('app');
  const tab = App.ctx._authTab || 'signin';

  const features = [
    ['🎭','Shadow Speaking Theatre','Live pronunciation scoring with AI feedback'],
    ['🧙','5 Wayang AI Mentors','Semar, Gareng, Petruk, Bagong & Dalang AI'],
    ['📊','Research Passport','Export pre/post data: CSV, SPSS, JSON'],
    ['🏆','Gamified A1 → C2','XP, badges, streaks & 16 lakon stories'],
  ];

  app.innerHTML = `
  <div style="min-height:100dvh;display:grid;grid-template-columns:55% 45%;background:#060c18">

    <!-- ═══ LEFT HERO ═══ -->
    <div style="position:relative;min-height:100dvh;overflow:hidden">
      <div style="position:absolute;inset:0;background:url('assets/stage-atmosphere.png') center 30%/cover no-repeat"></div>
      <div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(6,12,24,.88),rgba(8,16,34,.7),rgba(6,12,24,.92))"></div>
      <div style="position:absolute;inset:0;background:linear-gradient(to right,transparent 55%,#060c18 100%)"></div>
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse 55% 40% at 35% 55%,rgba(215,169,40,.13),transparent 70%)"></div>

      <div style="position:relative;z-index:2;min-height:100dvh;display:flex;flex-direction:column;
                  justify-content:center;padding:clamp(36px,6vw,88px) clamp(28px,5vw,68px)">

        <div style="display:flex;align-items:center;gap:14px;margin-bottom:28px">
          <img src="assets/logo-mark.png" style="width:54px;filter:drop-shadow(0 0 18px rgba(215,169,40,.65))">
          <div>
            <div style="font-size:10px;letter-spacing:.22em;color:#d7a928;text-transform:uppercase;margin-bottom:3px">Universitas Nusantara Indonesia</div>
            <div style="font-family:'Cinzel',serif;font-size:12px;letter-spacing:.12em;color:rgba(242,231,201,.5)">EFL Platform</div>
          </div>
        </div>

        <h1 style="font-family:'Cinzel',serif;font-size:clamp(28px,3.8vw,54px);line-height:1.06;letter-spacing:.12em;text-transform:uppercase;margin:0 0 4px;color:#f2e7c9">Wayang Lingua</h1>
        <h1 style="font-family:'Cinzel',serif;font-size:clamp(28px,3.8vw,54px);line-height:1.06;letter-spacing:.12em;text-transform:uppercase;margin:0 0 14px;color:#f3cf63">Nusantara</h1>

        <p style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(15px,1.6vw,20px);color:#d7a928;margin:0 0 8px;letter-spacing:.05em">
          AI-Powered Wayang Storytelling for EFL Skills
        </p>
        <p style="font-size:clamp(12px,1.1vw,14px);color:rgba(203,189,151,.6);margin:0 0 28px;max-width:420px;line-height:1.6">
          Where Indonesian Heritage Meets Global Communication.
        </p>

        <div style="width:50px;height:2px;background:linear-gradient(90deg,#d7a928,transparent);border-radius:1px;margin-bottom:28px"></div>

        <div style="display:flex;flex-direction:column;gap:14px">
          ${features.map(([ic,t,d])=>`
            <div style="display:flex;gap:13px;align-items:flex-start">
              <div style="width:38px;height:38px;border-radius:10px;flex:none;background:rgba(215,169,40,.08);border:1px solid rgba(215,169,40,.2);display:flex;align-items:center;justify-content:center;font-size:17px">${ic}</div>
              <div>
                <b style="display:block;font-size:13px;color:#f2e7c9;margin-bottom:2px">${t}</b>
                <span style="font-size:11.5px;color:rgba(203,189,151,.58)">${d}</span>
              </div>
            </div>`).join('')}
        </div>

        <div style="margin-top:auto;padding-top:40px">
          <p style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:14px;color:rgba(215,169,40,.5);margin:0 0 8px">"Bahasa adalah jembatan budaya · Language is the bridge of culture."</p>
          <p style="font-size:11px;color:rgba(203,189,151,.28);letter-spacing:.07em;margin:0">© Dr. Joko Slamet 2026 · All rights reserved</p>
        </div>
      </div>
    </div>

    <!-- ═══ RIGHT AUTH CARD ═══ -->
    <div style="display:flex;align-items:center;justify-content:center;padding:clamp(24px,4vw,56px) clamp(20px,4vw,52px);background:#0a1428;border-left:1px solid rgba(215,169,40,.1)">
      <div style="width:100%;max-width:380px">

        <div style="text-align:center;margin-bottom:26px">
          <img src="assets/logo-mark.png" style="width:40px;margin-bottom:12px;filter:drop-shadow(0 0 10px rgba(215,169,40,.4))">
          <h2 style="font-family:'Cinzel',serif;font-size:17px;letter-spacing:.12em;color:#f2e7c9;margin:0 0 4px;text-transform:uppercase">
            ${tab==='signin'?'Sign In':'Create Account'}
          </h2>
          <p style="font-size:13px;color:rgba(203,189,151,.5);margin:0">
            ${tab==='signin'?'Welcome back to the kelir':'Join the Wayang Lingua community'}
          </p>
          <div style="width:34px;height:2px;background:#d7a928;border-radius:1px;margin:11px auto 0"></div>
        </div>

        <!-- Tab switcher -->
        <div style="display:grid;grid-template-columns:1fr 1fr;background:rgba(255,255,255,.04);border-radius:12px;padding:4px;gap:4px;margin-bottom:22px;border:1px solid rgba(255,255,255,.07)">
          <button id="tabSignin" style="padding:9px;border-radius:9px;border:none;cursor:pointer;font-family:'Cinzel',serif;font-size:12px;letter-spacing:.08em;font-weight:600;transition:all .18s;background:${tab==='signin'?'rgba(215,169,40,.15)':'transparent'};color:${tab==='signin'?'#f3cf63':'rgba(203,189,151,.4)'}">Sign In</button>
          <button id="tabRegister" style="padding:9px;border-radius:9px;border:none;cursor:pointer;font-family:'Cinzel',serif;font-size:12px;letter-spacing:.08em;font-weight:600;transition:all .18s;background:${tab==='register'?'rgba(215,169,40,.15)':'transparent'};color:${tab==='register'?'#f3cf63':'rgba(203,189,151,.4)'}">Register</button>
        </div>

        ${tab==='signin'?`
          <div style="display:flex;flex-direction:column;gap:13px">
            <div>
              <label style="display:block;font-size:11px;color:rgba(203,189,151,.5);letter-spacing:.1em;text-transform:uppercase;margin-bottom:7px">Email Address</label>
              <input id="liEmail" type="email" class="input" placeholder="your@email.com" autocomplete="email" style="width:100%;box-sizing:border-box">
            </div>
            <div>
              <label style="display:block;font-size:11px;color:rgba(203,189,151,.5);letter-spacing:.1em;text-transform:uppercase;margin-bottom:7px">Password</label>
              <input id="liPw" type="password" class="input" placeholder="••••••••" autocomplete="current-password" style="width:100%;box-sizing:border-box">
            </div>
            <div id="liErr" style="font-size:13px;color:#e07070;min-height:16px"></div>
            <button id="signInBtn" class="btn primary" style="width:100%;padding:13px;font-size:14px;letter-spacing:.06em;margin-top:2px">Sign In →</button>
          </div>` : `
          <div style="display:flex;flex-direction:column;gap:12px">
            <div>
              <label style="display:block;font-size:11px;color:rgba(203,189,151,.5);letter-spacing:.1em;text-transform:uppercase;margin-bottom:7px">Full Name</label>
              <input id="regName" class="input" placeholder="Dr. / Your full name" autocomplete="name" style="width:100%;box-sizing:border-box">
            </div>
            <div>
              <label style="display:block;font-size:11px;color:rgba(203,189,151,.5);letter-spacing:.1em;text-transform:uppercase;margin-bottom:7px">Email Address</label>
              <input id="regEmail" type="email" class="input" placeholder="your@email.com" autocomplete="email" style="width:100%;box-sizing:border-box">
            </div>
            <div>
              <label style="display:block;font-size:11px;color:rgba(203,189,151,.5);letter-spacing:.1em;text-transform:uppercase;margin-bottom:7px">Password</label>
              <input id="regPw" type="password" class="input" placeholder="Minimum 6 characters" style="width:100%;box-sizing:border-box">
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
              <div>
                <label style="display:block;font-size:11px;color:rgba(203,189,151,.5);letter-spacing:.1em;text-transform:uppercase;margin-bottom:7px">Role</label>
                <select id="regRole" class="input" style="width:100%;box-sizing:border-box"><option value="Student">Student</option><option value="Lecturer">Lecturer</option></select>
              </div>
              <div>
                <label style="display:block;font-size:11px;color:rgba(203,189,151,.5);letter-spacing:.1em;text-transform:uppercase;margin-bottom:7px">CEFR Level</label>
                <select id="regCefr" class="input" style="width:100%;box-sizing:border-box"><option>A1</option><option>A2</option><option selected>B1</option><option>B2</option><option>C1</option><option>C2</option></select>
              </div>
            </div>
            <div id="regErr" style="font-size:13px;color:#e07070;min-height:16px"></div>
            <button id="registerBtn" class="btn primary" style="width:100%;padding:13px;font-size:14px;letter-spacing:.06em">Create Account →</button>
          </div>`}

      </div>
    </div>
  </div>`;

  document.getElementById('tabSignin')?.addEventListener('click',   () => { App.ctx._authTab='signin';   renderAuth(); });
  document.getElementById('tabRegister')?.addEventListener('click', () => { App.ctx._authTab='register'; renderAuth(); });

  function doSignIn(){
    const email = document.getElementById('liEmail')?.value?.trim();
    const pw    = document.getElementById('liPw')?.value;
    const err   = document.getElementById('liErr');
    if(!email||!pw){ if(err) err.textContent='Please enter your email and password.'; return; }
    const r = login(email, pw);
    if(r.ok){ App.ctx={}; App.go(homeFor(me())); }
    else if(err){ err.textContent=r.msg; }
  }
  document.getElementById('signInBtn')?.addEventListener('click', doSignIn);
  document.getElementById('liPw')?.addEventListener('keydown',    e=>{ if(e.key==='Enter') doSignIn(); });
  document.getElementById('liEmail')?.addEventListener('keydown', e=>{ if(e.key==='Enter') document.getElementById('liPw')?.focus(); });

  document.getElementById('registerBtn')?.addEventListener('click', ()=>{
    const name  = document.getElementById('regName')?.value?.trim();
    const email = document.getElementById('regEmail')?.value?.trim();
    const pw    = document.getElementById('regPw')?.value;
    const role  = document.getElementById('regRole')?.value;
    const cefr  = document.getElementById('regCefr')?.value;
    const err   = document.getElementById('regErr');
    const r = register({name,email,password:pw,role,cefr});
    if(r.ok){ App.ctx={}; App.go(homeFor(me())); }
    else if(err){ err.textContent=r.msg; }
  });
}

/* ═══════════════════════════════════════════════════
   APP SHELL — sidebar + topbar + viewRoot
═══════════════════════════════════════════════════ */
function renderShell(user){
  const app  = document.getElementById('app');
  const nav  = navFor(user);
  if(App.route==='auth') App.route = homeFor(user);
  const isStudent = user.role==='Student';
  const xp  = isStudent ? (rec()?.xp||0)  : 0;
  const str = isStudent ? (rec()?.streak||0) : 0;

  app.innerHTML = `
  <div class="shell">

    <!-- ══ SIDEBAR ══ -->
    <aside class="side" id="sidebar">
      <div class="sideBrand">
        <img src="assets/logo-mark.png" style="width:36px;height:44px;object-fit:contain;filter:drop-shadow(0 0 8px rgba(215,169,40,.45))">
        <div>
          <div style="font-family:var(--font-display);font-size:13px;letter-spacing:.1em;color:var(--gold-bright)">WLN</div>
          <div style="font-size:9.5px;color:var(--cream-dim);letter-spacing:.06em;text-transform:uppercase">Wayang Lingua</div>
        </div>
      </div>

      <nav class="nav" id="mainNav">
        ${nav.map(n=>`
          <button class="${App.route===n.route?'active':''}" data-go="${n.route}" title="${n.label}">
            ${Icons[n.icon]||''}
            <span>${n.label}</span>
          </button>`).join('')}
      </nav>

      <div class="sideUser">
        <div class="avatar">${esc(user.name.charAt(0))}</div>
        <b>${esc(user.name)}</b>
        <span class="role">${esc(user.role)}${isStudent?' · '+esc(user.cefr||''):''}</span>
        <button class="btn primary" id="logoutBtn"
          style="width:100%;margin-top:10px;font-size:12px;padding:8px;display:flex;align-items:center;justify-content:center;gap:7px">
          ${Icons.logout}<span>Sign Out</span>
        </button>
      </div>
    </aside>

    <!-- ══ MAIN CONTENT ══ -->
    <div class="main">

      <!-- TOP BAR -->
      <header class="topBar">
        <button class="menuBtn" id="menuBtn" aria-label="Open navigation">${Icons.menu}</button>

        <div class="titleBlock">
          <h1 style="font-size:clamp(16px,1.8vw,20px);margin:0;letter-spacing:.06em;font-family:var(--font-display)">
            ${ROUTE_TITLES[App.route]||'Wayang Lingua Nusantara'}
          </h1>
          <div class="sub" style="font-size:13px;margin-top:2px">
            ${isStudent
              ? `${esc(user.name)} &ensp;·&ensp; <span style="color:var(--gold)">⚡ ${xp} XP</span> &ensp; 🔥 ${str}-day streak`
              : esc(user.institution||'Wayang Lingua Nusantara')}
          </div>
        </div>

        <!-- Right actions: Chat / Forum / Help / Bell -->
        <div style="margin-left:auto;display:flex;align-items:center;gap:6px">
          <button class="topIconBtn" id="topChat"  title="Messages">${Icons.chat}</button>
          <button class="topIconBtn" id="topForum" title="Forum">${Icons.forum}</button>
          <button class="topIconBtn" id="topHelp"  title="Help Desk">${Icons.help}</button>
          <button class="topIconBtn" id="topBell"  title="Notifications" style="position:relative">
            ${Icons.bell}
            <span style="position:absolute;top:6px;right:6px;width:7px;height:7px;border-radius:50%;background:var(--rust);border:1.5px solid var(--navy-2)"></span>
          </button>
        </div>
      </header>

      <div id="viewRoot" style="max-width:1100px;margin:0 auto;padding:0 2px 32px"></div>
    </div>
  </div>`;

  /* ── Mobile sidebar toggle ── */
  document.getElementById('menuBtn')?.addEventListener('click', ()=>{
    document.getElementById('sidebar')?.classList.toggle('open');
  });
  document.querySelector('.main')?.addEventListener('click', ()=>{
    if(window.innerWidth<=900) document.getElementById('sidebar')?.classList.remove('open');
  });

  /* ── Logout ── */
  document.getElementById('logoutBtn')?.addEventListener('click', ()=>{
    logout(); App.route='auth'; App.ctx={}; renderAuth();
  });

  /* ── Nav buttons ── */
  document.getElementById('mainNav')?.querySelectorAll('button[data-go]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      App.ctx = { _authTab: App.ctx._authTab };  // preserve tab pref only
      App.go(btn.dataset.go);
    });
  });

  /* ── Topbar quick actions ── */
  document.getElementById('topChat')?.addEventListener('click', ()=>showChat());
  document.getElementById('topForum')?.addEventListener('click', ()=>{ App.go('community'); });
  document.getElementById('topHelp')?.addEventListener('click', ()=>showHelp());
  document.getElementById('topBell')?.addEventListener('click', ()=>showNotifications());

  routeToView();
}

/* ── Quick overlay modals ── */
function showChat(){
  modal('Messages & Chat',`
    <div style="display:flex;flex-direction:column;gap:10px">
      <p class="muted small" style="margin:0 0 10px">Direct messages to students and colleagues.</p>
      <div class="feedItem"><span style="width:36px;height:36px;border-radius:50%;background:var(--gold);display:inline-flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:14px;color:#1d1604;flex:none">S</span><div><b style="font-size:13px">Siti Nurhaliza</b><div class="muted small">How do I improve my speaking score?</div></div><span class="when">5m</span></div>
      <div class="feedItem"><span style="width:36px;height:36px;border-radius:50%;background:var(--teal);display:inline-flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:14px;color:#fff;flex:none">A</span><div><b style="font-size:13px">Ahmad Fadli</b><div class="muted small">Lakon 5 is submitted, sir.</div></div><span class="when">1h</span></div>
      <div style="display:flex;gap:8px;margin-top:6px">
        <input class="input" placeholder="Type a message…" style="flex:1">
        <button class="btn primary small">Send</button>
      </div>
    </div>`);
}
function showHelp(){
  modal('Help Desk',`
    <div style="display:flex;flex-direction:column;gap:12px">
      <p class="muted small" style="margin:0">Welcome to the Wayang Lingua Nusantara Help Desk. How can we assist you?</p>
      ${[['🎭','Shadow Speaking Theatre','How to record and submit speaking tasks'],['📊','Research Passport','How to export data for academic publication'],['🧙','AI Mentors','How to get feedback from wayang mentors'],['🏆','Gamification','How XP, badges and streaks work']].map(([ic,t,d])=>`
        <div style="display:flex;gap:12px;align-items:center;padding:12px;background:rgba(215,169,40,.05);border-radius:10px;border:1px solid var(--line-soft);cursor:pointer" onclick="toast('Opening: ${t}')">
          <span style="font-size:20px">${ic}</span><div><b style="font-size:13px">${t}</b><div class="muted small" style="margin-top:2px">${d}</div></div>
        </div>`).join('')}
      <div style="padding:12px;background:rgba(47,139,125,.08);border-radius:10px;border:1px solid rgba(47,139,125,.2)">
        <b style="font-size:13px;color:var(--teal)">📧 Contact Support</b>
        <p class="muted small" style="margin:4px 0 0">support@wayanglingua.id · Response within 24 hours</p>
      </div>
    </div>`);
}
function showNotifications(){
  modal('Notifications',`
    <div style="display:flex;flex-direction:column;gap:1px">
      ${[['🎤','Siti Nurhaliza submitted Speaking Assignment','2m ago','var(--gold)'],['📝','Dewi Lestari submitted Argumentative Essay','1h ago','var(--gold)'],['🏆','Rizky Pratama earned Researcher badge','2h ago','var(--teal)'],['✅','Ahmad Fadli completed Listening Quiz','3h ago','var(--cream-dim)'],['📋','New student registered: Budi Santoso','1d ago','var(--cream-dim)']].map(([ic,t,w,c])=>`
        <div class="feedItem" style="padding:12px 4px">
          <span style="font-size:18px">${ic}</span>
          <div class="grow"><span style="font-size:13px;color:${c}">${t}</span></div>
          <span class="when">${w}</span>
        </div>`).join('')}
      <button class="btn small" style="margin-top:10px;width:100%" onclick="closeModal()">Mark all as read</button>
    </div>`);
}

/* ═══════════════════════════════════════════════════
   VIEWS — Community / Resources (inline, no extra file needed)
═══════════════════════════════════════════════════ */
function renderCommunity(el){
  const tab = App.ctx._comTab || 'forum';
  el.innerHTML = `
    <div class="topActions" style="margin-bottom:18px">
      <h2 style="margin:0;flex:1">Community</h2>
      <button class="btn small${tab==='forum'?' primary':''}" id="comForum">Forum</button>
      <button class="btn small${tab==='chat'?' primary':''}" id="comChat">Group Chat</button>
      <button class="btn small${tab==='help'?' primary':''}" id="comHelp">Help Desk</button>
    </div>
    ${tab==='forum'?`
      <div style="display:flex;flex-direction:column;gap:14px">
        ${[['B1 Speaking Tips — How I got from 68% to 82%','Siti Nurhaliza','23 replies','2h ago','🎤'],
           ['Lakon 7 Writing Task — share your reflection here','Ahmad Fadli','11 replies','5h ago','✍️'],
           ['Wayang Culture: The significance of Semar in modern EFL','Dr. Joko Slamet','34 replies','1d ago','🧙'],
           ['Study group for B2 Academic Speaking — anyone interested?','Dewi Lestari','8 replies','2d ago','📚'],
           ['Tips for using the Research Passport for your thesis','Andi Pratama','16 replies','3d ago','📊']].map(([t,a,r,w,ic])=>`
          <div class="panel ornate" style="cursor:pointer" onclick="toast('Opening forum thread…')">
            <div style="display:flex;gap:12px;align-items:flex-start">
              <span style="font-size:22px;flex:none;margin-top:2px">${ic}</span>
              <div style="flex:1">
                <b style="font-size:14px;display:block;margin-bottom:4px">${t}</b>
                <div class="muted small">${a} · ${r} · ${w}</div>
              </div>
              <span class="chip" style="font-size:11px;flex:none">${r}</span>
            </div>
          </div>`).join('')}
        <button class="btn primary" style="width:max-content" onclick="toast('New post editor opening…')">+ New Post</button>
      </div>` :
    tab==='chat'?`
      <div class="panel ornate" style="display:flex;flex-direction:column;height:420px;max-width:680px">
        <h3 class="panelTitle">Group Chat — Indonesian for Global Communication B1</h3>
        <div id="gcLog" style="flex:1;overflow-y:auto;padding:4px 0;margin-bottom:12px;display:flex;flex-direction:column;gap:10px">
          ${[['Siti Nurhaliza','Does anyone have tips for the Shadow Speaking Theatre?','10m','me'],
             ['Ahmad Fadli','Try speaking slower and focus on keywords! Helped me a lot.','8m',''],
             ['Dr. Joko Slamet','Great advice Ahmad. Remember to use the Hint button for keywords.','5m','']].map(([name,msg,t,cls])=>`
            <div style="display:flex;gap:10px;align-items:flex-end${cls?' flex-direction:row-reverse':''}" class="${cls}">
              <div style="width:32px;height:32px;border-radius:50%;background:var(--gold);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:13px;color:#1d1604;flex:none">${name.charAt(0)}</div>
              <div>
                ${cls?'':''}<b style="font-size:11px;color:var(--cream-dim);display:block;margin-bottom:3px">${name}</b>
                <div style="background:${cls?'rgba(215,169,40,.15)':'var(--navy-3)'};padding:10px 14px;border-radius:12px;font-size:13.5px;max-width:380px">${msg}</div>
                <span style="font-size:11px;color:var(--cream-dim)">${t} ago</span>
              </div>
            </div>`).join('')}
        </div>
        <div style="display:flex;gap:8px">
          <input class="input" id="gcInput" placeholder="Type a message…" style="flex:1">
          <button class="btn primary" id="gcSend">Send</button>
        </div>
      </div>` :
    `<div style="display:flex;flex-direction:column;gap:14px;max-width:680px">
        <div class="panel ornate">
          <h3 class="panelTitle">📧 Contact Support</h3>
          <p class="muted small" style="margin:0 0 14px">Our team responds within 24 hours during working days.</p>
          <input class="input" placeholder="Subject" style="margin-bottom:10px">
          <textarea class="input" rows="4" placeholder="Describe your issue or question…" style="margin-bottom:12px"></textarea>
          <button class="btn primary" onclick="toast('Support ticket submitted. We will reply within 24 hours.')">Submit Ticket</button>
        </div>
        <div class="grid2">
          ${[['🎭','Speaking Theatre Help','Issues with recording, scoring, or playback'],['📊','Research Passport','Data export, SPSS, CSV formatting'],['🧙','AI Mentor Chat','API connection, feedback quality'],['🏆','Badges & XP','Gamification and progress tracking']].map(([ic,t,d])=>`
            <div class="panel ornate" style="cursor:pointer;text-align:center;padding:20px" onclick="toast('FAQ: ${t}')">
              <div style="font-size:28px;margin-bottom:10px">${ic}</div>
              <b style="font-size:13.5px;display:block;margin-bottom:6px">${t}</b>
              <p class="muted small" style="margin:0">${d}</p>
            </div>`).join('')}
        </div>
      </div>`}`;

  document.getElementById('comForum')?.addEventListener('click', ()=>{ App.ctx._comTab='forum';  App.go('community'); });
  document.getElementById('comChat')?.addEventListener('click',  ()=>{ App.ctx._comTab='chat';   App.go('community'); });
  document.getElementById('comHelp')?.addEventListener('click',  ()=>{ App.ctx._comTab='help';   App.go('community'); });
  document.getElementById('gcSend')?.addEventListener('click', ()=>{ const i=$('#gcInput'); if(i?.value?.trim()){ toast('Message sent!'); i.value=''; } });
}

function renderResource(el){
  el.innerHTML = `
    <div class="topActions" style="margin-bottom:18px"><h2 style="margin:0;flex:1">Resources</h2></div>
    <div class="grid3" style="margin-bottom:18px">
      ${[['📖','Teaching Materials','Lesson plans, slides, and activity worksheets for each lakon'],['🎬','Video Guides','Tutorial videos for each platform feature'],['📋','Research Templates','Pre/post test templates, rubrics, and observation forms']].map(([ic,t,d])=>`
        <div class="panel ornate" style="text-align:center;padding:22px;cursor:pointer" onclick="toast('Downloading: ${t}…')">
          <div style="font-size:32px;margin-bottom:12px">${ic}</div>
          <b style="display:block;margin-bottom:8px">${t}</b>
          <p class="muted small" style="margin:0 0 14px;line-height:1.5">${d}</p>
          <button class="btn small">Download</button>
        </div>`).join('')}
    </div>
    <div class="panel ornate">
      <h3 class="panelTitle">Resource Library</h3>
      <table class="table">
        <thead><tr><th>Title</th><th>Type</th><th>CEFR</th><th>Updated</th><th></th></tr></thead>
        <tbody>
          ${[['Lakon Guide: Semar\'s Wisdom','PDF','A1-B1','Jun 2026'],['Academic Vocabulary List — 500 Words','XLSX','B1-C1','May 2026'],['CEFR Speaking Rubric Template','DOCX','All','Apr 2026'],['Research Consent Form Template','DOCX','—','Mar 2026'],['Wayang Cultural Background Notes','PDF','All','Mar 2026']].map(([t,f,c,d])=>`
            <tr><td><b>${t}</b></td><td class="muted small">${f}</td><td>${c}</td><td class="muted small">${d}</td>
            <td><button class="btn small" onclick="toast('Downloading ${t}…')">Download</button></td></tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

/* ═══════════════════════════════════════════════════
   ROUTER
═══════════════════════════════════════════════════ */
function routeToView(){
  const el = document.getElementById('viewRoot');
  if(!el) return;
  const user = me();
  if(!user){ renderAuth(); return; }
  const r = App.route;

  const teacherOnly = ['dashboard','classes','students','assessments','analytics','passport','rooms','certificate','resource'];
  const adminOnly   = ['users','adminConsole'];
  if(user.role==='Student' && teacherOnly.includes(r)){ App.go('home'); return; }
  if(user.role!=='Admin'   && adminOnly.includes(r))  { App.go('dashboard'); return; }

  el.innerHTML = '';
  try{
    switch(r){
      case 'home':         Views.home(el);                    break;
      case 'stories':      Views.stories(el);                 break;
      case 'lesson':       Views.lesson(el,App.ctx.lessonId); break;
      case 'theatre':      Views.theatre(el);                 break;
      case 'mentors':      Views.mentors(el);                 break;
      case 'progress':     Views.progress(el);                break;
      case 'badges':       Views.badges(el);                  break;
      case 'dashboard':    Views.dashboard(el);               break;
      case 'classes':      Views.classes(el);                 break;
      case 'students':     Views.students(el);                break;
      case 'assessments':  Views.assessments(el);             break;
      case 'analytics':    Views.analytics(el);               break;
      case 'passport':     Views.passport(el);                break;
      case 'rooms':        Views.rooms(el);                   break;
      case 'certificate':  Views.certificate(el);             break;
      case 'resource':     renderResource(el);                break;
      case 'community':    renderCommunity(el);               break;
      case 'users':        Views.users(el);                   break;
      case 'adminConsole': Views.adminConsole(el);            break;
      case 'settings':     Views.settings(el);                break;
      default:
        el.innerHTML=`<div class="panel ornate"><b>Page not found.</b><br><button class="btn small" style="margin-top:10px" data-go="${homeFor(user)}">Go Home</button></div>`;
    }
  }catch(err){
    console.error('Route error:',err);
    el.innerHTML=`<div class="panel ornate" style="border-color:var(--rust)"><b style="color:var(--rust)">Something went wrong</b><p class="muted small" style="margin:8px 0 12px">${esc(String(err.message))}</p><button class="btn small" data-go="${homeFor(user)}">Go Home</button></div>`;
  }
  window.scrollTo(0,0);
}

/* ═══════════════════════════════════════════════════
   GLOBAL CLICK DELEGATION — data-go anywhere
═══════════════════════════════════════════════════ */
document.addEventListener('click', e=>{
  const el = e.target.closest('[data-go]');
  if(!el) return;
  if(el.closest('#mainNav')) return; /* handled in renderShell */
  const route = el.dataset.go;
  if(!route) return;
  if(el.dataset.id)      App.ctx.lessonId      = el.dataset.id;
  if(el.dataset.classid) App.ctx.classId       = el.dataset.classid;
  if(el.dataset.stuid)   App.ctx.studentId     = el.dataset.stuid;
  if(el.dataset.subid)   App.ctx.submissionId  = el.dataset.subid;
  if(el.dataset.roomid)  App.ctx.roomId        = el.dataset.roomid;
  if(el.dataset.mentor)  App.ctx.mentorId      = el.dataset.mentor;
  App.go(route);
});

/* ═══════════════════════════════════════════════════
   BOOT
═══════════════════════════════════════════════════ */
function boot(){
  const user = me();
  if(user){ App.route=homeFor(user); renderShell(user); }
  else { renderAuth(); }
}

if('serviceWorker' in navigator){
  window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
}

boot();
