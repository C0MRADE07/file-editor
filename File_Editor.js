// Clock
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2,'0');
  const m = String(now.getMinutes()).padStart(2,'0');
  document.getElementById('clock').textContent = `${h}:${m}`;
}
updateClock();
setInterval(updateClock, 10000);

// Counter animation
function animateCount(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  let start = 0;
  const dur = 1800, step = 16;
  const inc = target / (dur / step);
  const timer = setInterval(() => {
    start += inc;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start) + suffix;
  }, step);
}

const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('[data-target]').forEach(animateCount);
      obs.disconnect();
    }
  });
});
obs.observe(document.querySelector('.metrics'));

// Activity bars
const heights = [45, 70, 55, 85, 40, 62, 90];
const barsEl = document.getElementById('bars');
heights.forEach((h, i) => {
  const bar = document.createElement('div');
  bar.className = 'bar';
  bar.style.height = '4px';
  bar.style.transition = `height 0.6s ${i * 0.08}s ease`;
  barsEl.appendChild(bar);
  setTimeout(() => { bar.style.height = h + '%'; }, 200);
});
setInterval(() => {
  const bars = document.querySelectorAll('.bar');
  const idx = Math.floor(Math.random() * bars.length);
  bars[idx].style.height = (Math.random() * 70 + 20) + '%';
}, 2000);

// Terminal cycling
const lines = [
  '// initializing file_editor.core — all systems nominal_',
  '// encryption_module loaded — AES-256 active_',
  '// 240+ formats indexed — converter ready_',
  '// neural_repair engine online — standby_',
];
let lineIdx = 0;
setInterval(() => {
  lineIdx = (lineIdx + 1) % lines.length;
  const el = document.getElementById('terminal-line');
  el.style.opacity = '0';
  setTimeout(() => { el.textContent = lines[lineIdx]; el.style.opacity = '1'; }, 300);
}, 4000);

// ── HAMBURGER DRAWER ──
const hamburger     = document.querySelector('.hamburger');
const drawer        = document.getElementById('drawer');
const drawerOverlay = document.getElementById('drawerOverlay');

function openDrawer() {
  drawer.classList.add('open');
  drawerOverlay.classList.add('open');
  hamburger.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  drawer.classList.remove('open');
  drawerOverlay.classList.remove('open');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  drawer.classList.contains('open') ? closeDrawer() : openDrawer();
});
drawerOverlay.addEventListener('click', closeDrawer);

// Drawer nav items also switch tabs and close drawer
drawer.querySelectorAll('.drawer-nav-item[data-tab]').forEach(item => {
  item.addEventListener('click', function() {
    const tab = this.dataset.tab;
    // update drawer active state
    drawer.querySelectorAll('.drawer-nav-item').forEach(x => x.classList.remove('active'));
    this.classList.add('active');
    // sync bottom nav
    const idx = tabKeys.indexOf(tab);
    document.querySelectorAll('.nav-item').forEach((x,i) => {
      x.classList.toggle('active', i === idx);
    });
    switchTab(tab);
    closeDrawer();
  });
});

// ── TAB SWITCHING ──
const tabContents = {
  home: document.querySelector('.wrapper'),
  files: null,
  upload: null,
  alerts: null,
  profile: null,
};

// Build FILES page
tabContents.files = (() => {
  const el = document.createElement('div');
  el.className = 'tab-page';
  el.id = 'tab-files';
  el.innerHTML = `
    <div class="tab-inner">
      <div class="tab-hero">
        <div class="tab-tag">Storage Module</div>
        <h2 class="tab-title">YOUR <span class="grad">FILES</span></h2>
        <p class="tab-sub">All processed and stored files in one place.</p>
      </div>
      <div class="file-search">
        <span class="search-icon"><svg class="icon-svg"><use href="#icon-inspect"></use></svg></span>
        <input class="search-input" placeholder="Search files..." oninput="filterFiles(this.value)" />
      </div>
      <div class="filter-row">
        <div class="filter-chip active" onclick="filterByType(this)">All</div>
        <div class="filter-chip" onclick="filterByType(this)">PDF</div>
        <div class="filter-chip" onclick="filterByType(this)">Images</div>
        <div class="filter-chip" onclick="filterByType(this)">Docs</div>
        <div class="filter-chip" onclick="filterByType(this)">Video</div>
      </div>
      <div class="files-list">
        ${[
          {ext:'PDF',name:'annual_report_final.pdf',size:'3.8 MB',date:'Today',cls:'ext-pdf'},
          {ext:'JS', name:'dashboard_v3.bundle.js',size:'1.2 MB',date:'Today',cls:'ext-js'},
          {ext:'PNG',name:'wireframe_mockup.png',size:'4.4 MB',date:'Yesterday',cls:'ext-img'},
          {ext:'MD', name:'CHANGELOG_v5.md',size:'8 KB',date:'Yesterday',cls:'ext-md'},
          {ext:'PDF',name:'invoice_march2026.pdf',size:'512 KB',date:'Mar 23',cls:'ext-pdf'},
          {ext:'PNG',name:'logo_export_2x.png',size:'2.1 MB',date:'Mar 22',cls:'ext-img'},
        ].map(f=>`
          <div class="file-item">
            <div class="file-ext ${f.cls}">${f.ext}</div>
            <div class="file-info">
              <div class="file-name">${f.name}</div>
              <div class="file-meta"><span>${f.size}</span><span>${f.date}</span></div>
            </div>
            <div class="file-action">⋯</div>
          </div>`).join('')}
      </div>
    </div>`;
  return el;
})();

// Build UPLOAD page
tabContents.upload = (() => {
  const el = document.createElement('div');
  el.className = 'tab-page';
  el.id = 'tab-upload';
  el.innerHTML = `
    <div class="tab-inner">
      <div class="tab-hero">
        <div class="tab-tag">Ingestion Bay</div>
        <h2 class="tab-title">UPLOAD <span class="grad">FILE</span></h2>
        <p class="tab-sub">Drop, pick, or paste any file to begin.</p>
      </div>
      <div class="upload-zone big-zone" onclick="document.getElementById('file-upload-input').click()">
        <div class="upload-icon" style="width:72px;height:72px;font-size:30px"><svg class="icon-svg" style="width:1em;height:1em"><use href="#icon-upload"></use></svg></div>
        <div class="upload-title" style="font-size:15px">TAP TO BROWSE</div>
        <div class="upload-sub">Supports 240+ file formats</div>
        <div class="upload-types" style="margin-top:20px">
          <span class="type-badge">PDF</span><span class="type-badge">DOCX</span>
          <span class="type-badge">JPG</span><span class="type-badge">MP4</span>
          <span class="type-badge">CSV</span><span class="type-badge">SVG</span><span class="type-badge">+200</span>
        </div>
      </div>
      <div class="or-divider"><span>OR PASTE A URL</span></div>
      <div class="url-input-row">
        <input class="url-input" placeholder="https://example.com/file.pdf" />
        <button class="url-go">→</button>
      </div>
      <div class="upload-options">
        <div class="opt-row"><span class="opt-label">Auto-convert on upload</span><div class="toggle on"></div></div>
        <div class="opt-row"><span class="opt-label">Encrypt after upload</span><div class="toggle"></div></div>
        <div class="opt-row"><span class="opt-label">Compress automatically</span><div class="toggle on"></div></div>
      </div>
    </div>`;
  // Toggle logic
  el.querySelectorAll('.toggle').forEach(t => {
    t.addEventListener('click', () => t.classList.toggle('on'));
  });
  return el;
})();

// Build ALERTS page
tabContents.alerts = (() => {
  const el = document.createElement('div');
  el.className = 'tab-page';
  el.id = 'tab-alerts';
  el.innerHTML = `
    <div class="tab-inner">
      <div class="tab-hero">
        <div class="tab-tag">Notification Center</div>
        <h2 class="tab-title">SYSTEM <span class="grad">ALERTS</span></h2>
        <p class="tab-sub">Real-time processing updates and events.</p>
      </div>
      <div class="alert-list">
        ${[
          {icon:'<svg class="icon-svg"><use href="#icon-check"></use></svg>',color:'var(--teal)',  title:'Conversion Complete',  body:'quarterly_report.pdf → DOCX', time:'2m ago'},
          {icon:'<svg class="icon-svg"><use href="#icon-zap"></use></svg>',color:'var(--cyan)',  title:'File Uploaded',         body:'hero_banner_4k.png — 5.1 MB', time:'18m ago'},
          {icon:'<svg class="icon-svg"><use href="#icon-lock"></use></svg>',color:'var(--gold)',  title:'Encryption Applied',    body:'invoice_march2026.pdf secured', time:'1h ago'},
          {icon:'<svg class="icon-svg"><use href="#icon-warn"></use></svg>',color:'var(--red)',   title:'Repair Needed',         body:'corrupted_data.xlsx detected', time:'3h ago'},
          {icon:'<svg class="icon-svg"><use href="#icon-check"></use></svg>',color:'var(--teal)',  title:'Compression Done',      body:'Size reduced by 62%', time:'5h ago'},
          {icon:'<svg class="icon-svg"><use href="#icon-zap"></use></svg>',color:'var(--cyan)',  title:'Batch Job Complete',    body:'12 files processed', time:'Yesterday'},
        ].map(a=>`
          <div class="alert-item">
            <div class="alert-dot" style="background:${a.color};box-shadow:0 0 8px ${a.color}">${a.icon}</div>
            <div class="alert-body">
              <div class="alert-title">${a.title}</div>
              <div class="alert-desc">${a.body}</div>
            </div>
            <div class="alert-time">${a.time}</div>
          </div>`).join('')}
      </div>
    </div>`;
  return el;
})();

// Build PROFILE page
tabContents.profile = (() => {
  const el = document.createElement('div');
  el.className = 'tab-page';
  el.id = 'tab-profile';
  el.innerHTML = `
    <div class="tab-inner">
      <div class="profile-header">
        <div class="avatar">⬡</div>
        <div class="profile-name">OPERATOR_01</div>
        <div class="profile-handle">@usr.fileed.sys</div>
        <div class="profile-badge">PRO TIER</div>
      </div>
      <div class="profile-stats">
        <div class="pstat"><span class="pstat-val">1,284</span><span class="pstat-label">Files</span></div>
        <div class="pstat"><span class="pstat-val">42 GB</span><span class="pstat-label">Processed</span></div>
        <div class="pstat"><span class="pstat-val">99.8%</span><span class="pstat-label">Uptime</span></div>
      </div>
      <div class="profile-section-title">SETTINGS</div>
      <div class="profile-options">
        <div class="opt-row"><span class="opt-label">Dark Mode</span><div class="toggle on" onclick="document.body.classList.toggle('light-mode')"></div></div>
        <div class="opt-row"><span class="opt-label">Push Notifications</span><div class="toggle on"></div></div>
        <div class="opt-row"><span class="opt-label">Auto-Backup</span><div class="toggle"></div></div>
        <div class="opt-row"><span class="opt-label">Biometric Lock</span><div class="toggle on"></div></div>
      </div>
      <div class="profile-section-title" style="margin-top:24px">ACCOUNT</div>
      <div class="profile-links">
        <div class="profile-link"><svg class="icon-svg" style="vertical-align:middle;margin-right:6px"><use href="#icon-lock"></use></svg> Security &amp; Privacy</div>
        <div class="profile-link"><svg class="icon-svg" style="vertical-align:middle;margin-right:6px"><use href="#icon-inspect"></use></svg> Billing &amp; Plan</div>
        <div class="profile-link"><svg class="icon-svg" style="vertical-align:middle;margin-right:6px"><use href="#icon-file"></use></svg> Storage Usage</div>
        <div class="profile-link" style="color:var(--red);cursor:pointer" onclick="handleLogout()"><svg class="icon-svg" style="vertical-align:middle;margin-right:6px"><use href="#icon-sign"></use></svg> Sign Out</div>
      </div>
    </div>`;
  el.querySelectorAll('.toggle').forEach(t => {
    t.addEventListener('click', () => t.classList.toggle('on'));
  });
  return el;
})();

// Inject pages into body
const mainBody = document.querySelector('body');
['files','upload','alerts','profile'].forEach(key => {
  mainBody.insertBefore(tabContents[key], document.querySelector('.bottom-nav'));
});

// Tab switch function
let currentTab = 'home';
function switchTab(tab) {
  if (tab === currentTab) return;

  const outEl = tab === 'home' ? tabContents[currentTab] : (currentTab === 'home' ? tabContents.home : tabContents[currentTab]);
  const inEl  = tab === 'home' ? tabContents.home : tabContents[tab];

  // Slide out current
  outEl.classList.add('tab-exit');
  setTimeout(() => { outEl.style.display = 'none'; outEl.classList.remove('tab-exit'); }, 300);

  // Slide in new
  inEl.style.display = 'block';
  inEl.classList.add('tab-enter');
  setTimeout(() => inEl.classList.remove('tab-enter'), 350);

  currentTab = tab;
}

// Wire nav items
const tabKeys = ['home','files','upload','alerts','profile'];
document.querySelectorAll('.nav-item').forEach((item, i) => {
  item.addEventListener('click', function() {
    document.querySelectorAll('.nav-item').forEach(x => x.classList.remove('active'));
    this.classList.add('active');
    // sync drawer highlight
    document.querySelectorAll('.drawer-nav-item').forEach(x => x.classList.remove('active'));
    const match = document.querySelector(`.drawer-nav-item[data-tab="${tabKeys[i]}"]`);
    if (match) match.classList.add('active');
    switchTab(tabKeys[i]);
  });
});

// ── FILE UPLOAD ──
let originalUploadHTML = {};

window.handleFileUpload = function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const name = file.name;
  const type = file.type || 'Unknown Format';
  const ext = name.includes('.') ? name.split('.').pop().toUpperCase() : 'FILE';
  const sizeMB = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

  let colorClass = 'ext-md';
  if(ext === 'PDF') colorClass = 'ext-pdf';
  else if(['JPG','PNG','SVG','GIF','WEBP'].includes(ext)) colorClass = 'ext-img';
  else if(['JS','TS','HTML','CSS','JSON'].includes(ext)) colorClass = 'ext-js';

  document.querySelectorAll('.upload-zone').forEach((zone, idx) => {
    if(!originalUploadHTML[idx]) {
      originalUploadHTML[idx] = zone.innerHTML;
    }
    
    zone.innerHTML = `
      <div class="file-preview-card" style="display:flex; flex-direction:column; align-items:center; position:relative; padding:10px 0; animation: fade-up 0.4s ease both;">
        <div class="close-btn" onclick="clearFile(event, ${idx})" style="position:absolute; top:-24px; right:-14px; width:26px; height:26px; border-radius:50%; background:var(--red); color:white; display:flex; align-items:center; justify-content:center; font-family:var(--font-head); font-size:12px; font-weight:bold; cursor:pointer; box-shadow:0 0 12px rgba(255,45,85,0.4); z-index:10;">✕</div>
        <div class="file-ext ${colorClass}" style="width:54px; height:60px; font-size:14px; margin-bottom:16px;">${ext.substring(0,4)}</div>
        <div class="upload-title" style="font-size:16px; word-break:break-all; max-width:80%;">${name}</div>
        <div class="upload-sub" style="margin-top:8px; font-size:13px;">${sizeMB} — ${type}</div>
      </div>
    `;
    zone.removeAttribute('onclick'); 
  });
};

window.clearFile = function(e, idx) {
  e.stopPropagation();
  document.querySelectorAll('.upload-zone').forEach((zone, i) => {
    if(originalUploadHTML[i]) {
      zone.innerHTML = originalUploadHTML[i];
      zone.setAttribute('onclick', "document.getElementById('file-upload-input').click()");
    }
  });
  document.getElementById('file-upload-input').value = "";
};

// ── LOGIN HANDLER ──
// Helper: apply logged-in user details across the UI
function applyUserUI(displayName) {
  document.getElementById('login-overlay').classList.add('hidden');

  const upperUser = displayName.toUpperCase();
  const handle = '@' + displayName.toLowerCase().replace(/\s+/g, '') + '.sys';
  const initial = upperUser.charAt(0);

  const drawerUser = document.querySelector('.drawer-username');
  if (drawerUser) drawerUser.textContent = upperUser;

  const profileNameEl = document.querySelector('.profile-name');
  if (profileNameEl) profileNameEl.textContent = upperUser;

  const profileHandleEl = document.querySelector('.profile-handle');
  if (profileHandleEl) profileHandleEl.textContent = handle;

  const drawerAvatarEl = document.querySelector('.drawer-avatar');
  if (drawerAvatarEl) drawerAvatarEl.textContent = initial;

  const profileAvatarEl = document.querySelector('.avatar');
  if (profileAvatarEl) profileAvatarEl.textContent = initial;

  if (displayName.toLowerCase() === 'admin' || displayName.toLowerCase() === 'root') {
    document.querySelectorAll('.drawer-tier').forEach(el => {
      el.textContent = 'SYS_ADMIN';
      el.style.color = 'var(--red)';
      el.style.borderColor = 'var(--red)';
      el.style.background = 'rgba(255,45,85,0.07)';
    });
  }
}

window.handleLogin = function() {
  const userEl = document.getElementById('login-username');
  const pwdEl = document.getElementById('login-password');
  const btn = document.getElementById('login-btn');
  const user = userEl.value.trim();
  const pwd = pwdEl.value.trim();

  // Reset borders
  userEl.style.borderColor = '';
  pwdEl.style.borderColor = '';

  if (!user || !pwd) {
    if (!user) userEl.style.borderColor = 'var(--red)';
    if (!pwd) pwdEl.style.borderColor = 'var(--red)';
    flashButton(btn, 'ACCESS DENIED', 'var(--red)', 1500);
    return;
  }

  const email = user.toLowerCase().replace(/\s+/g, '') + '@fileed.app';
  flashButton(btn, 'AUTHENTICATING...', '', 10000);

  firebase.auth().signInWithEmailAndPassword(email, pwd)
    .then((cred) => {
      const displayName = cred.user.displayName || user;
      applyUserUI(displayName);
    })
    .catch((err) => {
      btn.disabled = false;
      btn.textContent = 'INITIALIZE';
      btn.style.background = '';

      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        showAuthError('login-error', '⚠ UNKNOWN OPERATOR — REGISTER FIRST');
        userEl.style.borderColor = 'var(--red)';
      } else if (err.code === 'auth/wrong-password') {
        showAuthError('login-error', '⚠ INVALID ACCESS CODE');
        pwdEl.style.borderColor = 'var(--red)';
      } else {
        showAuthError('login-error', '⚠ ACCESS DENIED — ' + err.message.toUpperCase());
      }
      flashButton(btn, 'ACCESS DENIED', 'var(--red)', 1500);
    });
};

// Guest Login Bypass
window.guestLogin = function() {
  const randomGuest = 'GUEST_' + Math.floor(Math.random() * 900 + 100);
  applyUserUI(randomGuest);
};

// ── AUTH HELPERS ──
function showAuthError(panelId, message) {
  const el = document.getElementById(panelId);
  if (!el) return;
  el.textContent = message;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 4000);
}

function flashButton(btn, text, color, duration) {
  if (!btn) return;
  const oldText = btn.textContent;
  const oldBg = btn.style.background;
  btn.textContent = text;
  if (color) btn.style.background = color;
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = oldText;
    btn.style.background = oldBg;
    btn.disabled = false;
  }, duration || 1500);
}

// Toggle between login and signup panels
window.toggleAuthView = function(view) {
  const loginPanel = document.getElementById('login-panel');
  const signupPanel = document.getElementById('signup-panel');

  if (view === 'signup') {
    loginPanel.style.display = 'none';
    signupPanel.style.display = 'block';
    signupPanel.style.animation = 'fade-up 0.4s ease both';
  } else {
    signupPanel.style.display = 'none';
    loginPanel.style.display = 'block';
    loginPanel.style.animation = 'fade-up 0.4s ease both';
  }
};

// SIGN UP — Firebase
window.handleSignUp = function() {
  const userEl = document.getElementById('signup-username');
  const pwdEl = document.getElementById('signup-password');
  const confirmEl = document.getElementById('signup-confirm');
  const btn = document.getElementById('signup-btn');

  const user = userEl.value.trim();
  const pwd = pwdEl.value.trim();
  const confirmPwd = confirmEl.value.trim();

  // Reset borders
  userEl.style.borderColor = '';
  pwdEl.style.borderColor = '';
  confirmEl.style.borderColor = '';

  if (!user || !pwd || !confirmPwd) {
    if (!user) userEl.style.borderColor = 'var(--red)';
    if (!pwd) pwdEl.style.borderColor = 'var(--red)';
    if (!confirmPwd) confirmEl.style.borderColor = 'var(--red)';
    showAuthError('signup-error', '⚠ ALL FIELDS REQUIRED');
    return;
  }

  if (pwd.length < 6) {
    pwdEl.style.borderColor = 'var(--red)';
    showAuthError('signup-error', '⚠ ACCESS CODE MUST BE 6+ CHARACTERS');
    return;
  }

  if (pwd !== confirmPwd) {
    confirmEl.style.borderColor = 'var(--red)';
    showAuthError('signup-error', '⚠ ACCESS CODES DO NOT MATCH');
    return;
  }

  const email = user.toLowerCase().replace(/\s+/g, '') + '@fileed.app';
  flashButton(btn, 'REGISTERING...', '', 10000);

  firebase.auth().createUserWithEmailAndPassword(email, pwd)
    .then((cred) => {
      return cred.user.updateProfile({ displayName: user }).then(() => {
        flashButton(btn, 'REGISTERED ✓', 'var(--teal)', 1500);
        setTimeout(() => {
          toggleAuthView('login');
          document.getElementById('login-username').value = user;
          document.getElementById('login-password').value = '';
          document.getElementById('login-password').focus();
        }, 1600);
      });
    })
    .catch((err) => {
      btn.disabled = false;
      btn.textContent = 'REGISTER';
      btn.style.background = '';
      if (err.code === 'auth/email-already-in-use') {
        showAuthError('signup-error', '⚠ OPERATOR HANDLE ALREADY TAKEN');
        userEl.style.borderColor = 'var(--red)';
      } else {
        showAuthError('signup-error', '⚠ ' + err.message.toUpperCase());
      }
    });
};

// ── SEARCH & FILTER ──
// Real-time File Search
window.filterFiles = function(query) {
  const term = query.toLowerCase();
  const items = document.querySelectorAll('.file-item');
  items.forEach(item => {
    const name = item.querySelector('.file-name').textContent.toLowerCase();
    item.style.display = name.includes(term) ? 'flex' : 'none';
    if(name.includes(term)) {
      item.style.animation = 'fade-up 0.3s ease both';
    }
  });
};

// Category Filter Function
window.filterByType = function(chip) {
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  
  const type = chip.textContent.trim().toLowerCase();
  const items = document.querySelectorAll('.file-item');
  
  items.forEach(item => {
    const name = item.querySelector('.file-name').textContent.toLowerCase();
    let match = false;
    
    if (type === 'all') match = true;
    else if (type === 'pdf') match = name.endsWith('.pdf');
    else if (type === 'images') match = name.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i);
    else if (type === 'docs') match = name.match(/\.(doc|docx|txt|rtf|md|csv|xls|xlsx)$/i);
    else if (type === 'video') match = name.match(/\.(mp4|mov|avi|mkv|webm)$/i);
    
    item.style.display = match ? 'flex' : 'none';
    if(match) item.style.animation = 'fade-up 0.3s ease both';
  });
};

// ── LOGOUT ──
window.handleLogout = function() {
  // Sign out of Firebase, then force a full page reload for a clean slate
  if (typeof firebase !== 'undefined' && firebase.auth) {
    firebase.auth().signOut().then(() => {
      window.location.reload();
    }).catch(() => {
      window.location.reload();
    });
  } else {
    window.location.reload();
  }
};
