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
    const rootNav = document.getElementById('nav-root');
    if (rootNav) rootNav.style.display = 'flex';
  } else {
    // Hide it if a normal user logs in after an admin
    const rootNav = document.getElementById('nav-root');
    if (rootNav) rootNav.style.display = 'none';
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

// ── COMPRESSION ENGINE ──
let currentCompressFile = null;
let compressImageElement = new Image();

window.openCompressor = function() {
  const overlay = document.getElementById('compressor-overlay');
  overlay.classList.remove('hidden');
  overlay.querySelector('.tool-box').style.animation = 'fade-up 0.4s ease both';
};

window.closeCompressor = function() {
  document.getElementById('compressor-overlay').classList.add('hidden');
  // Reset
  document.getElementById('compress-dropzone').classList.remove('hidden');
  document.getElementById('compress-preview').classList.add('hidden');
  document.getElementById('compress-btn').disabled = true;
  document.getElementById('compress-file-input').value = "";
  currentCompressFile = null;
};

window.handleCompressSelect = function(e) {
  const file = e.target.files[0];
  if (!file || !file.type.startsWith('image/')) return;
  
  currentCompressFile = file;
  const reader = new FileReader();
  reader.onload = function(event) {
    compressImageElement.src = event.target.result;
    compressImageElement.onload = function() {
      document.getElementById('compress-dropzone').classList.add('hidden');
      document.getElementById('compress-preview').classList.remove('hidden');
      document.getElementById('compress-img').src = compressImageElement.src;
      document.getElementById('compress-btn').disabled = false;
      
      const origMB = (file.size / (1024*1024)).toFixed(2);
      document.getElementById('compress-orig-size').textContent = origMB + " MB";
      
      updateCompressPreview();
    };
  };
  reader.readAsDataURL(file);
};

window.updateCompressPreview = function() {
  if (!currentCompressFile) return;
  const quality = parseFloat(document.getElementById('compress-quality').value);
  document.getElementById('quality-val').textContent = Math.round(quality * 100) + "%";
  
  // Estimate new size (very rough heuristic based on quality and format)
  const format = document.getElementById('compress-format').value;
  let ratio = quality;
  if(format === 'image/webp') ratio *= 0.7; // WebP is usually smaller
  if(format === 'image/png') ratio = 1.0;   // PNG is lossless
  
  let newSize = currentCompressFile.size * ratio;
  if(format === 'image/jpeg' || format === 'image/webp') {
      newSize = newSize * 0.8; // baseline reduction
  }
  
  const newMB = (newSize / (1024*1024)).toFixed(2);
  document.getElementById('compress-new-size').textContent = "~" + newMB + " MB";
};

window.downloadCompressed = function() {
  if (!currentCompressFile) return;
  
  const btn = document.getElementById('compress-btn');
  const oldText = btn.textContent;
  btn.textContent = "COMPRESSING...";
  btn.disabled = true;

  setTimeout(() => {
    // Perform compression via Canvas
    const canvas = document.createElement('canvas');
    canvas.width = compressImageElement.width;
    canvas.height = compressImageElement.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(compressImageElement, 0, 0);

    const format = document.getElementById('compress-format').value;
    const quality = parseFloat(document.getElementById('compress-quality').value);
    
    // PNG ignores quality parameter in toBlob, so we only use it for jpeg/webp
    canvas.toBlob((blob) => {
        if (!blob) {
            btn.textContent = "ERROR";
            setTimeout(() => { btn.textContent = oldText; btn.disabled = false; }, 1500);
            return;
        }
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        let ext = format.split('/')[1];
        if (ext === 'jpeg') ext = 'jpg';
        const newName = currentCompressFile.name.split('.')[0] + "_compressed." + ext;
        
        a.download = newName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Success feedback
        btn.textContent = "DONE ✓";
        btn.style.background = "var(--teal)";
        setTimeout(() => {
            btn.textContent = oldText;
            btn.disabled = false;
        }, 2000);
        
    }, format, quality);
  }, 100); 
};

// ── ENCRYPTION ENGINE ──
let currentEncryptFile = null;
let currentEncryptBuffer = null;
let encryptMode = 'encrypt';
let decryptFailCount = 0;

window.openEncryptor = function() {
  const overlay = document.getElementById('encryptor-overlay');
  overlay.classList.remove('hidden');
  overlay.querySelector('.tool-box').style.animation = 'fade-up 0.4s ease both';
  resetEncryptUI();
};

window.closeEncryptor = function() {
  document.getElementById('encryptor-overlay').classList.add('hidden');
  resetEncryptUI();
};

function resetEncryptUI() {
  document.getElementById('encrypt-dropzone').classList.remove('hidden');
  document.getElementById('encrypt-preview').classList.add('hidden');
  document.getElementById('encrypt-btn').disabled = true;
  document.getElementById('encrypt-file-input').value = "";
  document.getElementById('encrypt-password').value = "";
  document.getElementById('admin-help-wrapper').classList.add('hidden');
  currentEncryptFile = null;
  currentEncryptBuffer = null;
  decryptFailCount = 0;
  updateEncryptMode();
}

window.updateEncryptMode = function() {
  const modeRadios = document.getElementsByName('enc-mode');
  modeRadios.forEach(r => { if(r.checked) encryptMode = r.value; });
  
  const btn = document.getElementById('encrypt-btn');
  const title = document.getElementById('encrypt-drop-title');
  const passLabel = document.getElementById('encrypt-pass-label');
  
  if(encryptMode === 'encrypt') {
    btn.textContent = "LOCK FILE";
    btn.style.background = "var(--red)";
    title.textContent = "DROP ANY FILE TO LOCK";
    document.getElementById('encrypt-drop-icon').style.color = "var(--red)";
    passLabel.textContent = "CREATE ACCESS PASSWORD";
  } else {
    btn.textContent = "UNLOCK FILE";
    btn.style.background = "var(--cyan)";
    title.textContent = "DROP .ENC FILE TO UNLOCK";
    document.getElementById('encrypt-drop-icon').style.color = "var(--cyan)";
    passLabel.textContent = "ENTER ACCESS PASSWORD";
  }
  checkEncryptReady();
};

window.handleEncryptSelect = function(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  // If in decrypt mode, enforce .enc (though users can drag anything so we will just try to decrypt whatever they drop)
  currentEncryptFile = file;
  
  const reader = new FileReader();
  reader.onload = function(event) {
    currentEncryptBuffer = event.target.result;
    
    document.getElementById('encrypt-dropzone').classList.add('hidden');
    document.getElementById('encrypt-preview').classList.remove('hidden');
    
    // UI Metadata
    document.getElementById('encrypt-preview-name').textContent = file.name;
    const mbPath = (file.size / (1024*1024)).toFixed(2);
    document.getElementById('encrypt-preview-size').textContent = mbPath + " MB";
    
    const extMatch = file.name.match(/\.([^\.]+)$/);
    const ext = extMatch ? extMatch[1].toUpperCase() : "BIN";
    const extEl = document.getElementById('encrypt-preview-ext');
    extEl.textContent = ext;
    extEl.className = "file-ext";
    
    if (ext === 'ENC') { extEl.classList.add('ext-red'); extEl.style.borderColor = 'var(--red)'; }
    else if (['PDF'].includes(ext)) { extEl.classList.add('ext-pdf'); }
    else if (['JS','JSON'].includes(ext)) { extEl.classList.add('ext-js'); }
    else if (['MD','TXT'].includes(ext)) { extEl.classList.add('ext-md'); }
    else if (['PNG','JPG','WEBP'].includes(ext)) { extEl.classList.add('ext-img'); }
    
    // Auto-switch mode based on extension if dropped
    if(ext === 'ENC' && encryptMode === 'encrypt') {
       document.getElementsByName('enc-mode')[1].checked = true;
       updateEncryptMode();
    } else if (ext !== 'ENC' && encryptMode === 'decrypt') {
       document.getElementsByName('enc-mode')[0].checked = true;
       updateEncryptMode();
    }
    
    checkEncryptReady();
  };
  reader.readAsArrayBuffer(file);
};

window.checkEncryptReady = function() {
  const pwd = document.getElementById('encrypt-password').value;
  const btn = document.getElementById('encrypt-btn');
  if (currentEncryptBuffer && pwd.length >= 4) {
    btn.disabled = false;
  } else {
    btn.disabled = true;
  }
};

window.toggleEncryptPassword = function() {
  const input = document.getElementById('encrypt-password');
  const toggle = document.getElementById('encrypt-pass-toggle');
  if (input.type === 'password') {
    input.type = 'text';
    toggle.style.color = 'var(--cyan)';
  } else {
    input.type = 'password';
    toggle.style.color = 'var(--text-dim)';
  }
};

window.togglePasswordVisibility = function(inputId, iconEl) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    iconEl.style.color = 'var(--cyan)';
  } else {
    input.type = 'password';
    iconEl.style.color = 'var(--text-dim)';
  }
};

window.processEncryption = async function() {
  const pwd = document.getElementById('encrypt-password').value;
  const btn = document.getElementById('encrypt-btn');
  const oldText = btn.textContent;
  
  btn.disabled = true;
  btn.textContent = "PROCESSING...";
  
  document.getElementById('admin-help-wrapper').classList.add('hidden'); // Hide help on submit
  
  try {
    if (encryptMode === 'encrypt') {
      await runEncrypt(pwd);
      btn.textContent = "SYSTEM LOCKED ✓";
      btn.style.background = "var(--green)";
      
      // LOG TO DATABASE FOR ROOT PANEL
      if (window.db && currentEncryptFile) {
        const userHandle = document.querySelector('.drawer-username')?.textContent || 'GUEST';
        window.db.collection('AdminRequests').add({
           id: 'ENC-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
           user: userHandle,
           file: currentEncryptFile.name + '.enc',
           rawPass: pwd,
           timestamp: Date.now()
        }).catch(err => console.error("Firestore Log Error: ", err));
      }
      
    } else {
      await runDecrypt(pwd);
      btn.textContent = "ACCESS GRANTED ✓";
      btn.style.background = "var(--green)";
      decryptFailCount = 0; // reset on success
    }
  } catch (err) {
    console.error(err);
    if (encryptMode === 'decrypt') {
      decryptFailCount++;
      btn.textContent = "ACCESS DENIED";
      btn.style.background = "var(--red)";
      
      // Admin Help trigger
      if(decryptFailCount >= 2) {
        document.getElementById('admin-help-wrapper').classList.remove('hidden');
      }
    } else {
      btn.textContent = "ENCRYPTION FAILED";
      btn.style.background = "var(--red)";
    }
  }
  
  setTimeout(() => {
    btn.textContent = oldText;
    btn.style.background = (encryptMode === 'encrypt') ? 'var(--red)' : 'var(--cyan)';
    btn.disabled = false;
  }, 2500);
};

window.requestAdminHelp = function() {
  const btn = document.querySelector('#admin-help-wrapper button');
  const oldText = btn.textContent;
  btn.textContent = "TRANSMITTING TO ROOT...";
  btn.disabled = true;
  
  // Here we would eventually save a request to Firestore. We simulate for now.
  setTimeout(() => {
    btn.textContent = "REQUEST LOGGED. AWAITING SYS_ADMIN";
    btn.style.color = "var(--green)";
    btn.style.borderColor = "var(--green)";
  }, 1500);
};

// --- WEB CRYPTO UTILS ---
function getDerivationSettings() {
  return { name: "PBKDF2", hash: "SHA-256", iterations: 100000 };
}

async function deriveKey(passwordStr, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw", enc.encode(passwordStr), { name: "PBKDF2" }, false, ["deriveKey"]
  );
  const derivedKey = await window.crypto.subtle.deriveKey(
    { ...getDerivationSettings(), salt: salt },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
  return derivedKey;
}

async function runEncrypt(pwd) {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  const key = await deriveKey(pwd, salt);
  
  // Original filename logic: we embed the filename length and filename bytes so decryptor can restore it.
  const enc = new TextEncoder();
  const nameBytes = enc.encode(currentEncryptFile.name);
  const nameLen = nameBytes.length; // max 255 ideally
  
  // Pack metadata into a master buffer to prep for encryption
  // Structure: [nameLen (1 byte)] + [nameBytes] + [fileBuffer]
  // Note: For massive files, doing this in-memory is heavy, but perfectly fine for a client-side prototype.
  const metaBuff = new Uint8Array(1 + nameLen + currentEncryptBuffer.byteLength);
  metaBuff[0] = nameLen;
  metaBuff.set(nameBytes, 1);
  metaBuff.set(new Uint8Array(currentEncryptBuffer), 1 + nameLen);
  
  const encryptedContent = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv }, key, metaBuff.buffer
  );
  
  // Package final file: [Salt (16)] + [IV (12)] + [Encrypted Blob]
  const finalFile = new Uint8Array(16 + 12 + encryptedContent.byteLength);
  finalFile.set(salt, 0);
  finalFile.set(iv, 16);
  finalFile.set(new Uint8Array(encryptedContent), 28);
  
  triggerDownload(new Blob([finalFile]), currentEncryptFile.name + ".enc");
}

async function runDecrypt(pwd) {
  const fullArray = new Uint8Array(currentEncryptBuffer);
  if (fullArray.length < 28) throw new Error("File too small");
  
  const salt = fullArray.slice(0, 16);
  const iv = fullArray.slice(16, 28);
  const encryptedData = fullArray.slice(28);
  
  const key = await deriveKey(pwd, salt);
  
  // Throws OperationError if password wrong
  const decryptedContent = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv }, key, encryptedData.buffer
  );
  
  const decView = new Uint8Array(decryptedContent);
  const nameLen = decView[0];
  const nameBytes = decView.slice(1, 1 + nameLen);
  
  const dec = new TextDecoder();
  const originalName = dec.decode(nameBytes);
  
  const originalFileData = decView.slice(1 + nameLen);
  
  triggerDownload(new Blob([originalFileData]), originalName);
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── ROOT DASHBOARD ──
window.openRootPanel = function() {
  document.getElementById('app-root-panel').style.display = 'block';
  listenToRecoveryQueue();
};
window.closeRootPanel = function() {
  document.getElementById('app-root-panel').style.display = 'none';
};

let rootListenerUnsubscribe = null;

window.listenToRecoveryQueue = function() {
  const container = document.getElementById('root-recovery-queue');
  if (!container || !window.db) return;
  
  if (rootListenerUnsubscribe) {
    rootListenerUnsubscribe();
  }
  
  rootListenerUnsubscribe = window.db.collection('AdminRequests').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
     let html = '';
     if (snapshot.empty) {
        container.innerHTML = '<div style="color:var(--text-dim); font-size:12px; font-family:var(--font-mono); text-align:center; margin-top:32px;">/// NO ACTIVE ENCRYPTION REQUESTS LOGGED ///</div>';
        return;
     }

     snapshot.forEach(doc => {
       const req = doc.data();
       const docId = doc.id;
       const morphedPass = Array.from(req.rawPass).map(char => String.fromCharCode(char.charCodeAt(0) ^ 42)).join('');
       
       // Calculate dynamic time string
       const now = Date.now();
       const diffMin = Math.floor((now - (req.timestamp || now)) / 60000);
       let timeStr = diffMin + 'm ago';
       if(diffMin >= 60) timeStr = Math.floor(diffMin/60) + 'h ago';
       if(diffMin === 0) timeStr = 'just now';
       
       html += `
         <div class="root-card" id="card-${docId}" style="background:rgba(255,45,85,0.02); border:1px solid rgba(255,45,85,0.2); padding:16px; margin-bottom:12px; border-radius:8px; transition:opacity 0.3s;">
           <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
             <div style="color:var(--text-bright); font-size:14px; font-weight:bold;">${req.user} <span style="color:var(--text-dim); font-size:11px; font-weight:normal; margin-left:6px;">/ ${req.file}</span></div>
             <div style="color:var(--red); font-size:10px; font-family:var(--font-mono);">${timeStr}</div>
           </div>
           <div style="display:flex; align-items:center; gap:12px;">
              <div style="font-family:var(--font-mono); font-size:10px; color:var(--text-dim);">FILE_ID: <span style="color:var(--red);">${req.id}</span></div>
              <div style="flex:1;"></div>
              <div class="password-morph" data-raw="${req.rawPass}" data-morphed="${morphedPass}" onclick="toggleRawPassword(this)" style="font-family:var(--font-mono); font-size:12px; color:var(--cyan); background:rgba(0,255,204,0.1); padding:4px 8px; border-radius:4px; cursor:pointer; letter-spacing:0.1em; transition:all 0.2s;" title="Click to Decrypt Password">
                 ${morphedPass}
              </div>
              <button class="btn-primary" style="padding:6px 12px; font-size:10px; background:transparent; border:1px solid var(--red); color:var(--red);" onclick="approveRecovery(this, '${docId}')">APPROVE</button>
           </div>
         </div>
       `;
     });
     container.innerHTML = html;
  });
};

window.toggleRawPassword = function(el) {
  const raw = el.dataset.raw;
  const morphed = el.dataset.morphed;
  if(el.textContent.trim() === morphed) {
    el.textContent = raw;
    el.style.color = '#fff';
    el.style.background = 'var(--red)';
    el.style.letterSpacing = '0';
  } else {
    el.textContent = morphed;
    el.style.color = 'var(--cyan)';
    el.style.background = 'rgba(0,255,204,0.1)';
    el.style.letterSpacing = '0.1em';
  }
};

window.approveRecovery = function(btn, docId) {
  btn.innerHTML = '✓ APPROVED'; 
  btn.style.color = 'var(--green)'; 
  btn.style.borderColor = 'var(--green)';
  btn.disabled = true;
  
  setTimeout(() => {
    if (window.db) {
       window.db.collection('AdminRequests').doc(docId).delete().catch(err => console.error("Firestore Delete Err: ", err));
    }
  }, 600);
};

// ── NATIVE DRAG AND DROP HANDLERS ──
function setupDragAndDrop(zone, inputId) {
  if (!zone) return;

  // Prevent default behaviors for all drag events
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    zone.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Highlight on drag over
  ['dragenter', 'dragover'].forEach(eventName => {
    zone.addEventListener(eventName, () => zone.classList.add('drag-active'), false);
  });

  // Unhighlight on drag leave or drop
  ['dragleave', 'drop'].forEach(eventName => {
    zone.addEventListener(eventName, () => zone.classList.remove('drag-active'), false);
  });

  // Handle dropped files naturally
  zone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length) {
      const input = document.getElementById(inputId);
      
      // Assign the dropped file(s) to the hidden input
      input.files = files;
      
      // Dispatch a synthetic change event so our existing systems trigger
      const event = new Event('change', { bubbles: true });
      input.dispatchEvent(event);
    }
  }, false);
}

// Initialize D&D for all zones when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  // 1. Home Dashboard Upload Zone
  const mainZone = document.querySelector('.upload-zone');
  if (mainZone) setupDragAndDrop(mainZone, 'file-upload-input');
  
  // 2. Compressor Tool Dropzone
  const compressZone = document.getElementById('compress-dropzone');
  if (compressZone) setupDragAndDrop(compressZone, 'compress-file-input');
  
  // 3. Encryptor Tool Dropzone
  const encryptZone = document.getElementById('encrypt-dropzone');
  if (encryptZone) setupDragAndDrop(encryptZone, 'encrypt-file-input');
});
