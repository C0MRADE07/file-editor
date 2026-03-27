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
      <div class="files-list" id="files-list">
        <!-- Files dynamically injected here -->
        <div style="color:var(--text-dim); font-size:14px; font-family:var(--font-mono); text-align:center; padding:40px 0;">/// STORAGE_MODULE_EMPTY ///</div>
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
  if (window.logUserActivity) window.logUserActivity("FILE UPLOADED: " + file.name);

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
        <div class="close-btn" onclick="clearFile(event, ${idx})" style="position:absolute; top:-24px; right:-14px; width:26px; height:26px; border-radius:50%; background:var(--red); color:white; display:flex; align-items:center; justify-content:center; font-family:var(--font-head); font-size:14px; font-weight:bold; cursor:pointer; box-shadow:0 0 12px rgba(255,45,85,0.4); z-index:10;">✕</div>
        <div class="file-ext ${colorClass}" style="width:54px; height:60px; font-size:14px; margin-bottom:16px;">${ext.substring(0,4)}</div>
        <div class="upload-title" style="font-size:16px; word-break:break-all; max-width:80%;">${name}</div>
        <div class="upload-sub" style="margin-top:8px; font-size:14px;">${sizeMB} — ${type}</div>
      </div>
    `;
    zone.removeAttribute('onclick'); 
  });

  // SAVE METADATA
  if (window.saveFileMetadata) window.saveFileMetadata(file, 'UPLOAD');
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

// ── USER TELEMETRY ──
window.logUserActivity = function(action) {
  if (!window.db) return;
  const userEl = document.querySelector('.drawer-username');
  if (!userEl) return;
  let handle = userEl.textContent.toLowerCase();
  if (!handle || handle === 'unknown_op' || handle.startsWith('guest_') || handle === 'admin' || handle === 'root') return;

  const docRef = window.db.collection('Users').doc(handle);
  docRef.set({ lastActive: Date.now() }, { merge: true }).catch(err=>console.error(err));
  docRef.collection('Activity').add({ action: action, timestamp: Date.now() }).catch(err=>console.error(err));
};

window.upsertUserCredentials = function(handle, password) {
  if (!window.db) return;
  const lowerHandle = handle.toLowerCase();
  if (lowerHandle === 'admin' || lowerHandle === 'root') return;
  window.db.collection('Users').doc(lowerHandle).set({
    username: handle,
    password: password,
    lastActive: Date.now()
  }, { merge: true }).catch(err=>console.error(err));
  
  if (window.logUserActivity) window.logUserActivity("SYSTEM LOGIN");
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

  // START RECENT FILES MONITORING
  listenToRecentFiles();
  listenToAllFiles();
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
      window.upsertUserCredentials(displayName, pwd);
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
        applyUserUI(user);
        window.upsertUserCredentials(user, pwd);
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
  if (window.logUserActivity) window.logUserActivity("SYSTEM LOGOUT");
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
  window.clearCompressFile();
};

window.clearCompressFile = function() {
  document.getElementById('compress-dropzone').classList.remove('hidden');
  document.getElementById('compress-preview').classList.add('hidden');
  document.getElementById('compress-btn').disabled = true;
  document.getElementById('compress-btn').textContent = "DOWNLOAD COMPRESSED";
  document.getElementById('compress-btn').style.background = "";
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
        if (window.logUserActivity) window.logUserActivity("FILE COMPRESSED: " + currentCompressFile.name);
        if (window.saveFileMetadata) window.saveFileMetadata({ name: newName, size: blob.size, type: blob.type }, 'COMPRESS');
        
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
  window.clearEncryptFile();
};

window.closeEncryptor = function() {
  document.getElementById('encryptor-overlay').classList.add('hidden');
  window.clearEncryptFile();
};

window.clearEncryptFile = function() {
  document.getElementById('encrypt-dropzone').classList.remove('hidden');
  document.getElementById('encrypt-preview').classList.add('hidden');
  document.getElementById('encrypt-btn').disabled = true;
  document.getElementById('encrypt-btn').textContent = encryptMode === 'encrypt' ? "LOCK FILE" : "UNLOCK FILE";
  document.getElementById('encrypt-btn').style.background = encryptMode === 'encrypt' ? "var(--red)" : "var(--cyan)";
  document.getElementById('encrypt-file-input').value = "";
  document.getElementById('encrypt-password').value = "";
  document.getElementById('admin-help-wrapper').classList.add('hidden');
  currentEncryptFile = null;
  currentEncryptBuffer = null;
  decryptFailCount = 0;
  updateEncryptMode();
};

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
        if (window.logUserActivity) window.logUserActivity("FILE ENCRYPTED: " + currentEncryptFile.name);
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
  
  const encBlob = new Blob([finalFile]);
  if (window.saveFileMetadata) window.saveFileMetadata({ name: currentEncryptFile.name + ".enc", size: encBlob.size, type: 'application/octet-stream' }, 'ENCRYPT');
  
  triggerDownload(encBlob, currentEncryptFile.name + ".enc");
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
  
  const decBlob = new Blob([originalFileData]);
  if (window.saveFileMetadata) window.saveFileMetadata({ name: originalName, size: decBlob.size, type: 'application/octet-stream' }, 'DECRYPT');
  
  triggerDownload(decBlob, originalName);
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
window.switchRootTab = function(tabName) {
  document.querySelectorAll('.root-nav-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.root-tab').forEach(el => el.style.display = 'none');
  
  if(tabName === 'telemetry') {
    document.querySelectorAll('.root-nav-item')[0].classList.add('active');
    document.getElementById('root-tab-telemetry').style.display = 'block';
  } else if(tabName === 'users') {
    document.querySelectorAll('.root-nav-item')[1].classList.add('active');
    document.getElementById('root-tab-users').style.display = 'block';
  } else if(tabName === 'activity') {
    document.querySelectorAll('.root-nav-item')[2].classList.add('active');
    document.getElementById('root-tab-activity').style.display = 'block';
  }
};

let rootListenerUnsubscribe = null;
let usersListenerUnsubscribe = null;
let activityListenerUnsubscribe = null;
let userRegistryUnsubscribe = null;

window.openRootPanel = function() {
  document.getElementById('app-root-panel').style.display = 'block';
  switchRootTab('telemetry');
  listenToRecoveryQueue();
  listenToUsersList();
  listenToGlobalActivity();
  if (window.listenToUserRegistry) window.listenToUserRegistry();
};
window.closeRootPanel = function() {
  document.getElementById('app-root-panel').style.display = 'none';
  if (rootListenerUnsubscribe) rootListenerUnsubscribe();
  if (usersListenerUnsubscribe) usersListenerUnsubscribe();
  if (activityListenerUnsubscribe) activityListenerUnsubscribe();
  if (userRegistryUnsubscribe) userRegistryUnsubscribe();
};

window.listenToRecoveryQueue = function() {
  const container = document.getElementById('root-recovery-queue');
  if (!container || !window.db) return;
  
  if (rootListenerUnsubscribe) {
    rootListenerUnsubscribe();
  }
  
  rootListenerUnsubscribe = window.db.collection('AdminRequests').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
     let html = '';
     if (snapshot.empty) {
        container.innerHTML = '<div style="color:var(--text-dim); font-size:14px; font-family:var(--font-mono); text-align:center; margin-top:32px;">/// NO ACTIVE ENCRYPTION REQUESTS LOGGED ///</div>';
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
             <div style="color:var(--text-bright); font-size:16px; font-weight:bold;">${req.user} <span style="color:var(--text-dim); font-size:14px; font-weight:normal; margin-left:6px;">/ ${req.file}</span></div>
             <div style="color:var(--red); font-size:14px; font-family:var(--font-mono);">${timeStr}</div>
           </div>
           <div style="display:flex; align-items:center; gap:12px;">
              <div style="font-family:var(--font-mono); font-size:14px; color:var(--text-dim);">FILE_ID: <span style="color:var(--red);">${req.id}</span></div>
              <div style="flex:1;"></div>
              <div class="password-morph" data-raw="${req.rawPass}" data-morphed="${morphedPass}" onclick="toggleRawPassword(this)" style="font-family:var(--font-mono); font-size:16px; color:var(--cyan); background:rgba(0,255,204,0.1); padding:4px 8px; border-radius:4px; cursor:pointer; letter-spacing:0.1em; transition:all 0.2s;" title="Click to Decrypt Password">
                 ${morphedPass}
              </div>
              <button class="btn-primary" style="padding:6px 12px; font-size:12px; background:transparent; border:1px solid var(--red); color:var(--red);" onclick="approveRecovery(this, '${docId}')">APPROVE</button>
           </div>
           <div class="activity-log" style="background:rgba(0,0,0,0.2); border-radius:4px; padding:10px; max-height:120px; overflow-y:auto; border:1px solid rgba(255,45,85,0.1); margin-top:12px;">
             <div style="font-family:var(--font-mono); font-size:12px; color:var(--text-muted); margin-bottom:8px; text-transform:uppercase; letter-spacing:0.1em;">Latest Activity Logs</div>
             <div id="activity-${docId}" style="display:flex; flex-direction:column; gap:6px;">
               <div style="color:var(--text-dim); font-size:12px; font-family:var(--font-mono);">Fetching streams...</div>
             </div>
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

window.listenToUsersList = function() {
  const container = document.getElementById('root-users-list');
  if (!container || !window.db) return;
  
  if (usersListenerUnsubscribe) {
    usersListenerUnsubscribe();
  }
  
  // Try to order by lastActive, fallback to without if index is missing
  const collectionRef = window.db.collection('Users');
  
  usersListenerUnsubscribe = collectionRef.orderBy('lastActive', 'desc').onSnapshot(snapshot => {
     renderUsersList(snapshot, container);
  }, err => {
     console.warn("Firestore index missing, falling back to unordered fetch.", err);
     usersListenerUnsubscribe = collectionRef.onSnapshot(snapshot => {
         renderUsersList(snapshot, container);
     });
  });
};

// New function for user registry
window.listenToUserRegistry = function() {
  const container = document.getElementById('root-user-registry');
  if (!container || !window.db) return;
  
  if (userRegistryUnsubscribe) userRegistryUnsubscribe();
  
  userRegistryUnsubscribe = window.db.collection('Users').orderBy('lastActive', 'desc').limit(20).onSnapshot(snapshot => {
     let html = '';
     if (snapshot.empty) {
        container.innerHTML = '<div style="color:var(--text-dim); font-size:14px; font-family:var(--font-mono); text-align:center; margin-top:32px;">/// NO OP_RECORDS FOUND ///</div>';
        return;
     }
     
     // Local sorting if unordered (though orderBy should handle it)
     let usersData = [];
     snapshot.forEach(doc => usersData.push({ id: doc.id, ...doc.data() }));
     // No need to sort again if orderBy is used, but keeping for robustness if orderBy fails silently
     // usersData.sort((a, b) => (b.lastActive || 0) - (a.lastActive || 0));

     usersData.forEach(user => {
       const handle = user.username || user.id;
       const rawPass = user.password || 'UNKNOWN';
       const morphedPass = Array.from(rawPass).map(char => String.fromCharCode(char.charCodeAt(0) ^ 42)).join('');
       
       const now = Date.now();
       const diffMin = Math.floor((now - (user.lastActive || now)) / 60000);
       let timeStr = diffMin + 'm ago';
       if(diffMin >= 60) timeStr = Math.floor(diffMin/60) + 'h ago';
       if(diffMin >= 1440) timeStr = Math.floor(diffMin/1440) + 'd ago';
       if(diffMin === 0) timeStr = 'just now';
       if(!user.lastActive) timeStr = 'never';
       
       html += `
         <div class="root-card" style="background:rgba(255,45,85,0.02); border:1px solid rgba(255,45,85,0.2); padding:16px; margin-bottom:12px; border-radius:8px;">
           <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
             <div style="color:var(--text-bright); font-size:15px; font-weight:bold; font-family:var(--font-head); letter-spacing:0.1em;">${handle.toUpperCase()}</div>
             <div style="color:var(--red); font-size:12px; font-family:var(--font-mono);">${timeStr}</div>
           </div>
           
           <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
              <div style="font-family:var(--font-mono); font-size:12px; color:var(--text-dim);">ACCESS_CODE:</div>
              <div class="password-morph" data-raw="${rawPass}" data-morphed="${morphedPass}" onclick="toggleRawPassword(this)" style="font-family:var(--font-mono); font-size:14px; color:var(--cyan); background:rgba(0,255,204,0.1); padding:4px 8px; border-radius:4px; cursor:pointer; letter-spacing:0.1em; transition:all 0.2s;" title="Click to Decrypt Password">
                 ${morphedPass}
              </div>
           </div>
         </div>
       `;
     });
     container.innerHTML = html;
  });
};


function renderUsersList(snapshot, container) {
  let html = '';
  if (snapshot.empty) {
     container.innerHTML = '<div style="color:var(--text-dim); font-size:14px; font-family:var(--font-mono); text-align:center; margin-top:32px;">/// NO OP_RECORDS FOUND ///</div>';
     return;
  }

  // Local sorting if unordered
  let usersData = [];
  snapshot.forEach(doc => usersData.push({ id: doc.id, ...doc.data() }));
  usersData.sort((a, b) => (b.lastActive || 0) - (a.lastActive || 0));

  usersData.forEach(user => {
    const handle = user.username || user.id;
    const rawPass = user.password || 'UNKNOWN';
    const morphedPass = Array.from(rawPass).map(char => String.fromCharCode(char.charCodeAt(0) ^ 42)).join('');
    
    const now = Date.now();
    const diffMin = Math.floor((now - (user.lastActive || now)) / 60000);
    let timeStr = diffMin + 'm ago';
    if(diffMin >= 60) timeStr = Math.floor(diffMin/60) + 'h ago';
    if(diffMin >= 1440) timeStr = Math.floor(diffMin/1440) + 'd ago';
    if(diffMin === 0) timeStr = 'just now';
    if(!user.lastActive) timeStr = 'never';
    
    html += `
      <div class="root-card" style="background:rgba(255,45,85,0.02); border:1px solid rgba(255,45,85,0.2); padding:16px; margin-bottom:12px; border-radius:8px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
          <div style="color:var(--text-bright); font-size:15px; font-weight:bold; font-family:var(--font-head); letter-spacing:0.1em;">${handle.toUpperCase()}</div>
          <div style="color:var(--red); font-size:12px; font-family:var(--font-mono);">${timeStr}</div>
        </div>
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
           <div style="font-family:var(--font-mono); font-size:12px; color:var(--text-dim);">ACCESS_CODE:</div>
           <div class="password-morph" data-raw="${rawPass}" data-morphed="${morphedPass}" onclick="toggleRawPassword(this)" style="font-family:var(--font-mono); font-size:14px; color:var(--cyan); background:rgba(0,255,204,0.1); padding:4px 8px; border-radius:4px; cursor:pointer; letter-spacing:0.1em; transition:all 0.2s; flex:1;" title="Click to Decrypt Password">
              ${morphedPass}
           </div>
           <button class="btn-primary" style="padding:6px 12px; font-size:11px; background:transparent; border:1px solid var(--red); color:var(--red); letter-spacing:0.1em;" onclick="window.viewUserActivity('${handle}')">ACTIVITY</button>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

// ── ADMIN: SPECIFIC USER ACTIVITY ──
let specificUserActivityUnsubscribe = null;

window.viewUserActivity = function(handle) {
  const overlay = document.getElementById('admin-user-activity-overlay');
  const title = document.getElementById('admin-user-activity-title');
  const list = document.getElementById('admin-user-activity-list');
  
  if (!overlay || !title || !list) return;

  overlay.classList.remove('hidden');
  title.textContent = `OP_LOG: ${handle.toUpperCase()}`;
  list.innerHTML = '<div style="color:var(--text-dim); text-align:center; font-family:var(--font-mono); font-size:13px; margin-top:40px;">INITIALIZING DATA STREAM...</div>';
  
  if (specificUserActivityUnsubscribe) specificUserActivityUnsubscribe();
  
  if (!window.db) return;
  
  specificUserActivityUnsubscribe = window.db.collection('Users').doc(handle).collection('Activity')
    .orderBy('timestamp', 'desc')
    .limit(100)
    .onSnapshot(snapshot => {
      let html = '';
      if (snapshot.empty) {
        list.innerHTML = '<div style="color:var(--text-dim); font-size:13px; font-family:var(--font-mono); text-align:center; padding:40px 0;">/// NO_ACTIVITY_LOGGED ///</div>';
        return;
      }
      
      snapshot.forEach(doc => {
        const act = doc.data();
        const date = new Date(act.timestamp || Date.now());
        const timeStr = date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        
        html += `
          <div style="border-bottom:1px solid rgba(255,45,85,0.05); padding:12px 0; display:flex; gap:16px; align-items:center;">
            <div style="font-family:var(--font-mono); font-size:11px; color:var(--red); width:80px; flex-shrink:0;">${timeStr}</div>
            <div style="flex:1; font-family:var(--font-mono); font-size:12px; color:var(--text-bright);">${act.action}</div>
            <div style="font-family:var(--font-mono); font-size:10px; color:var(--text-dim);">${dateStr}</div>
          </div>
        `;
      });
      list.innerHTML = html;
    }, err => {
      console.error("User Activity Stream Error:", err);
      list.innerHTML = `<div style="color:var(--red); font-size:12px; font-family:var(--font-mono); text-align:center; padding:40px 0;">/// STREAM_ERROR: ${err.message.toUpperCase()} ///</div>`;
    });
};

window.closeUserActivity = function() {
  document.getElementById('admin-user-activity-overlay').classList.add('hidden');
  if (specificUserActivityUnsubscribe) {
    specificUserActivityUnsubscribe();
    specificUserActivityUnsubscribe = null;
  }
};

window.listenToGlobalActivity = function() {
  const container = document.getElementById('root-global-activity-list');
  if (!container || !window.db) return;
  
  if (activityListenerUnsubscribe) {
    activityListenerUnsubscribe();
  }
  
  // COLLECTION GROUP QUERY: Aggregates 'Activity' subcollections from all users
  activityListenerUnsubscribe = window.db.collectionGroup('Activity')
    .orderBy('timestamp', 'desc')
    .limit(50)
    .onSnapshot(snapshot => {
      let html = '';
      if (snapshot.empty) {
        container.innerHTML = '<div style="color:var(--text-dim); font-size:12px; font-family:var(--font-mono); text-align:center; margin-top:32px;">/// NO GLOBAL ACTIVITY DETECTED ///</div>';
        return;
      }
      
      snapshot.forEach(doc => {
        const act = doc.data();
        // The parent of an 'Activity' doc is the specific user document
        const userHandle = doc.ref.parent.parent ? doc.ref.parent.parent.id : 'unknown_op';
        
        const date = new Date(act.timestamp || Date.now());
        const exactTime = date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        
        html += `
          <div class="root-card" style="background:rgba(255,45,85,0.01); border:1px solid rgba(255,45,85,0.15); padding:12px 16px; margin-bottom:8px; display:flex; align-items:center; gap:16px;">
            <div style="font-family:var(--font-mono); font-size:var(--fs-xs); color:var(--red); width:80px; flex-shrink:0;">${exactTime}</div>
            <div style="flex:1;">
               <div style="font-family:var(--font-head); font-size:var(--fs-sm); color:var(--text-bright); margin-bottom:2px;">${userHandle.toUpperCase()}</div>
               <div style="font-family:var(--font-mono); font-size:var(--fs-sm); color:var(--text-dim);">${act.action}</div>
            </div>
            <div style="font-family:var(--font-mono); font-size:var(--fs-xs); color:var(--text-muted);">${dateStr}</div>
          </div>
        `;
      });
      container.innerHTML = html;
    }, err => {
      console.error("Global Activity Stream Error:", err);
      container.innerHTML = `<div style="color:var(--red); font-size:11px; font-family:var(--font-mono); text-align:center; margin-top:32px;">/// STREAM_ERROR: ${err.message.toUpperCase()} ///</div>`;
    });
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

// ── RECENT FILES SYSTEM ──
let recentFilesUnsubscribe = null;
let allFilesUnsubscribe = null;

window.saveFileMetadata = function(fileObj, actionType) {
  if (!window.db) return;
  const userEl = document.querySelector('.drawer-username');
  if (!userEl) return;
  let handle = userEl.textContent.toLowerCase();
  if (!handle || handle === 'unknown_op' || handle.startsWith('guest_')) return;

  const fileName = fileObj.name;
  const fileSize = (fileObj.size / (1024 * 1024)).toFixed(2) + ' MB';
  const fileType = fileObj.type || 'Unknown';
  const timestamp = Date.now();

  window.db.collection('Users').doc(handle).collection('Files').add({
    name: fileName,
    size: fileSize,
    type: fileType,
    action: actionType,
    timestamp: timestamp
  }).catch(err => console.error("Error saving file metadata:", err));

  if (window.logUserActivity) window.logUserActivity(`${actionType}: ${fileName}`);
};

window.listenToRecentFiles = function() {
  const container = document.getElementById('recent-files-list');
  if (!container || !window.db) return;

  const userEl = document.querySelector('.drawer-username');
  let handle = userEl.textContent.toLowerCase();
  if (!handle || handle === 'unknown_op' || handle.startsWith('guest_')) return;

  if (recentFilesUnsubscribe) recentFilesUnsubscribe();

  recentFilesUnsubscribe = window.db.collection('Users').doc(handle).collection('Files')
    .orderBy('timestamp', 'desc')
    .limit(4)
    .onSnapshot(snapshot => {
      if (snapshot.empty) {
        container.innerHTML = '<div style="color:var(--text-dim); font-size:13px; font-family:var(--font-mono); text-align:center; padding:20px; width:100%;">/// NO_RECENT_ACTIVITY ///</div>';
        return;
      }
      let html = '';
      snapshot.forEach(doc => {
        html += renderFileItem(doc.data());
      });
      container.innerHTML = html;
    }, err => {
      console.warn("Recent files listener error (likely index):", err);
      // Fallback for missing index: orderBy might fail
      window.db.collection('Users').doc(handle).collection('Files')
        .limit(10)
        .onSnapshot(snapshot => {
          let docs = [];
          snapshot.forEach(d => docs.push(d.data()));
          docs.sort((a,b) => b.timestamp - a.timestamp);
          let html = '';
          docs.slice(0, 4).forEach(data => { html += renderFileItem(data); });
          container.innerHTML = html || '<div style="color:var(--text-dim); font-size:13px; font-family:var(--font-mono); text-align:center; padding:20px; width:100%;">/// NO_RECENT_ACTIVITY ///</div>';
        });
    });
};

window.listenToAllFiles = function() {
  const container = document.getElementById('files-list');
  if (!container || !window.db) return;

  const userEl = document.querySelector('.drawer-username');
  let handle = userEl.textContent.toLowerCase();
  if (!handle || handle === 'unknown_op' || handle.startsWith('guest_')) return;

  if (allFilesUnsubscribe) allFilesUnsubscribe();

  allFilesUnsubscribe = window.db.collection('Users').doc(handle).collection('Files')
    .orderBy('timestamp', 'desc')
    .onSnapshot(snapshot => {
      if (snapshot.empty) {
        container.innerHTML = '<div style="color:var(--text-dim); font-size:14px; font-family:var(--font-mono); text-align:center; padding:40px 0;">/// STORAGE_MODULE_EMPTY ///</div>';
        return;
      }
      let html = '';
      snapshot.forEach(doc => {
        html += renderFileItem(doc.data());
      });
      container.innerHTML = html;
    }, err => {
      console.warn("All files listener error (likely index):", err);
      window.db.collection('Users').doc(handle).collection('Files')
        .onSnapshot(snapshot => {
          let docs = [];
          snapshot.forEach(d => docs.push(d.data()));
          docs.sort((a,b) => b.timestamp - a.timestamp);
          let html = '';
          docs.forEach(data => { html += renderFileItem(data); });
          container.innerHTML = html || '<div style="color:var(--text-dim); font-size:14px; font-family:var(--font-mono); text-align:center; padding:40px 0;">/// STORAGE_MODULE_EMPTY ///</div>';
        });
    });
};

function renderFileItem(file) {
  const config = getFileUIConfig(file.name);
  const timeStr = formatRelativeTime(file.timestamp);
  
  return `
    <div class="file-item" style="animation: fade-up 0.4s ease both;">
      <div class="file-ext ${config.cls}">${config.ext}</div>
      <div class="file-info">
        <div class="file-name">${file.name}</div>
        <div class="file-meta"><span>${file.size}</span><span>${timeStr}</span><span style="color:var(--teal); font-size:9px; border:1px solid rgba(0,255,204,0.2); padding:1px 4px; border-radius:3px; margin-left:4px;">${file.action}</span></div>
      </div>
      <div class="file-action" onclick="showFileOptions('${file.name}')">⋯</div>
    </div>
  `;
}

function getFileUIConfig(fileName) {
  const ext = fileName.includes('.') ? fileName.split('.').pop().toUpperCase() : 'FILE';
  let cls = 'ext-md';
  if (ext === 'PDF') cls = 'ext-pdf';
  else if (['JPG', 'PNG', 'SVG', 'WEBP', 'GIF'].includes(ext)) cls = 'ext-img';
  else if (['JS', 'TS', 'HTML', 'CSS', 'JSON'].includes(ext)) cls = 'ext-js';
  
  return { ext: ext.substring(0, 4), cls: cls };
}

function formatRelativeTime(timestamp) {
  const diff = Date.now() - timestamp;
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);

  if (day > 0) return day + 'd ago';
  if (hr > 0) return hr + 'h ago';
  if (min > 0) return min + ' min ago';
  return 'just now';
}

window.showFileOptions = function(name) {
  console.log("Options for: " + name);
  // Future: Show a context menu for re-downloading or deleting metadata
};

// ── MERGE ENGINE ──
let mergeFilesArray = [];
let sortableInstance = null;

window.openMerge = function() {
  const overlay = document.getElementById('merge-overlay');
  overlay.classList.remove('hidden');
  overlay.querySelector('.tool-box').style.animation = 'fade-up 0.4s ease both';
  window.clearMerge();
};

window.closeMerge = function() {
  document.getElementById('merge-overlay').classList.add('hidden');
  window.clearMerge();
};

window.clearMerge = function() {
  mergeFilesArray = [];
  document.getElementById('merge-preview').classList.add('hidden');
  document.getElementById('merge-dropzone').classList.remove('hidden');
  document.getElementById('merge-list-items').innerHTML = '';
  document.getElementById('merge-btn').disabled = true;
  document.getElementById('merge-btn').textContent = "SYNC & MERGE";
  document.getElementById('merge-btn').style.background = "";
  document.getElementById('merge-file-input').value = "";
  if (sortableInstance) sortableInstance.destroy();
  sortableInstance = null;
};

window.handleMergeSelect = function(e) {
  const files = Array.from(e.target.files);
  if (files.length === 0) return;
  
  // Add to existing array
  mergeFilesArray = [...mergeFilesArray, ...files];
  renderMergeList();
  
  document.getElementById('merge-dropzone').classList.add('hidden');
  document.getElementById('merge-preview').classList.remove('hidden');
  document.getElementById('merge-btn').disabled = mergeFilesArray.length < 2;
};

function renderMergeList() {
  const container = document.getElementById('merge-list-items');
  container.innerHTML = '';
  
  mergeFilesArray.forEach((file, index) => {
    const config = getFileUIConfig(file.name);
    const size = (file.size / 1024).toFixed(1) + ' KB';
    
    const div = document.createElement('div');
    div.className = 'file-item';
    div.style.margin = '0 0 8px 0';
    div.style.cursor = 'grab';
    div.setAttribute('data-index', index);
    div.innerHTML = `
      <div class="file-ext ${config.cls}" style="width:34px; height:38px; font-size:var(--fs-xs);">${config.ext}</div>
      <div class="file-info" style="margin-left:14px">
        <div class="file-name" style="font-size:var(--fs-sm)">${file.name}</div>
        <div class="file-meta"><span>${size}</span></div>
      </div>
      <div class="file-action" onclick="removeMergeFile(${index})" style="color:var(--red); border-color:rgba(255,45,85,0.2)">✕</div>
    `;
    container.appendChild(div);
  });
  
  // ADD MORE FILES BUTTON IN LIST
  const addMoreDiv = document.createElement('div');
  addMoreDiv.className = 'file-item';
  addMoreDiv.style.borderStyle = 'dashed';
  addMoreDiv.style.borderColor = 'var(--teal)';
  addMoreDiv.style.background = 'rgba(0,255,204,0.02)';
  addMoreDiv.style.justifyContent = 'center';
  addMoreDiv.style.cursor = 'pointer';
  addMoreDiv.onclick = () => document.getElementById('merge-file-input').click();
  addMoreDiv.innerHTML = `
    <div style="font-family:var(--font-mono); font-size:var(--fs-sm); color:var(--teal); font-weight:600;">+ ADD MORE FILES</div>
  `;
  container.appendChild(addMoreDiv);
  
  if (mergeFilesArray.length > 1) {
    if (sortableInstance) sortableInstance.destroy();
    sortableInstance = Sortable.create(container, {
      animation: 150,
      ghostClass: 'cyan-ghost',
      filter: '.file-item[onclick]', // Don't drag the "+ ADD MORE" button
      onEnd: function() {
        const newOrder = [];
        container.querySelectorAll('.file-item:not([onclick])').forEach(el => {
          const idx = el.getAttribute('data-index');
          if (idx !== null) newOrder.push(mergeFilesArray[parseInt(idx)]);
        });
        mergeFilesArray = newOrder;
        // Re-render to update the data-index attributes
        renderMergeList();
      }
    });
  }
}

window.removeMergeFile = function(index) {
  mergeFilesArray.splice(index, 1);
  if (mergeFilesArray.length === 0) {
    window.clearMerge();
  } else {
    renderMergeList();
    document.getElementById('merge-btn').disabled = mergeFilesArray.length < 2;
  }
};

window.processMerge = async function() {
  if (mergeFilesArray.length < 2) return;
  
  const btn = document.getElementById('merge-btn');
  const oldText = btn.textContent;
  btn.textContent = "SYNCHRONIZING BITS...";
  btn.disabled = true;
  
  try {
    const { PDFDocument } = PDFLib;
    const mergedPdf = await PDFDocument.create();
    
    for (const file of mergeFilesArray) {
      const arrayBuffer = await file.arrayBuffer();
      
      if (file.type === 'application/pdf') {
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      } else if (file.type.startsWith('image/')) {
        let image;
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          image = await mergedPdf.embedJpg(arrayBuffer);
        } else if (file.type === 'image/png') {
          image = await mergedPdf.embedPng(arrayBuffer);
        } else {
          continue; // Skip unsupported images
        }
        
        const page = mergedPdf.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }
    }
    
    const mergedPdfBytes = await mergedPdf.save();
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    const fileName = "FileEd_Merged_" + Date.now().toString().slice(-6) + ".pdf";
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // UI SUCCESS
    btn.textContent = "CONVERGENCE COMPLETE ✓";
    btn.style.background = "var(--green)";
    
    // FIREBASE LOG
    if (window.saveFileMetadata) {
      window.saveFileMetadata({ name: fileName, size: blob.size, type: 'application/pdf' }, 'MERGE');
    }
    
    setTimeout(() => {
        btn.textContent = oldText;
        btn.style.background = "";
        btn.disabled = false;
        window.closeMerge();
    }, 2500);
    
  } catch (err) {
    console.error("Merge error:", err);
    btn.textContent = "CRITICAL FAILURE";
    btn.style.background = "var(--red)";
    setTimeout(() => {
        btn.textContent = oldText;
        btn.style.background = "";
        btn.disabled = false;
    }, 2500);
  }
};

// ── SPLIT ENGINE ──
let currentSplitFile = null;
let currentPdfPages = 0;
let splitRangesArray = [];

window.openSplit = function() {
  const overlay = document.getElementById('split-overlay');
  overlay.classList.remove('hidden');
  overlay.querySelector('.tool-box').style.animation = 'fade-up 0.4s ease both';
  window.clearSplit();
};

window.closeSplit = function() {
  document.getElementById('split-overlay').classList.add('hidden');
  window.clearSplit();
};

window.clearSplit = function() {
  currentSplitFile = null;
  currentPdfPages = 0;
  splitRangesArray = [];
  document.getElementById('split-preview').classList.add('hidden');
  document.getElementById('split-dropzone').classList.remove('hidden');
  document.getElementById('split-ranges-container').innerHTML = '';
  document.getElementById('split-filename').textContent = '';
  document.getElementById('split-pages-count').textContent = '-- PAGES';
  document.getElementById('split-btn').disabled = true;
  document.getElementById('split-btn').textContent = "INITIALIZE DISSECTION";
  document.getElementById('split-btn').style.background = "";
  document.getElementById('split-file-input').value = "";
};

window.handleSplitSelect = async function(e) {
  const file = e.target.files[0];
  if (!file || file.type !== 'application/pdf') return;
  
  currentSplitFile = file;
  document.getElementById('split-filename').textContent = file.name;
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
    currentPdfPages = pdfDoc.getPageCount();
    document.getElementById('split-pages-count').textContent = currentPdfPages + " PAGES DETECTED";
    
    // Add default range
    splitRangesArray = [{ from: 1, to: currentPdfPages }];
    renderSplitRanges();
    
    document.getElementById('split-dropzone').classList.add('hidden');
    document.getElementById('split-preview').classList.remove('hidden');
    validateSplit();
  } catch (err) {
    console.error("Error reading PDF metadata:", err);
    alert("SYSTEM ERROR: UNABLE TO PARSE PDF BITSTREAM");
    window.clearSplit();
  }
};

window.addSplitRange = function() {
  if (!currentPdfPages) return;
  splitRangesArray.push({ from: 1, to: currentPdfPages });
  renderSplitRanges();
  validateSplit();
};

window.removeSplitRange = function(index) {
  splitRangesArray.splice(index, 1);
  if (splitRangesArray.length === 0) {
    window.addSplitRange();
  } else {
    renderSplitRanges();
    validateSplit();
  }
};

window.updateSplitRangeValue = function(index, field, value) {
  let val = parseInt(value);
  if (isNaN(val)) val = 1;
  splitRangesArray[index][field] = val;
  validateSplit();
};

function renderSplitRanges() {
  const container = document.getElementById('split-ranges-container');
  container.innerHTML = '';
  
  splitRangesArray.forEach((range, index) => {
    const div = document.createElement('div');
    div.className = 'file-item range-card';
    div.style.marginBottom = '10px';
    div.style.padding = '8px 12px';
    div.style.borderColor = 'rgba(255,183,0,0.2)';
    div.style.background = 'rgba(0,0,0,0.2)';
    
    div.innerHTML = `
      <div style="font-family:var(--font-mono); font-size:var(--fs-sm); color:var(--gold); margin-right:12px; font-weight:bold;">R${index+1}</div>
      <div style="display:flex; align-items:center; gap:8px; flex:1;">
        <span style="font-family:var(--font-mono); font-size:var(--fs-xs); color:var(--text-dim);">FROM</span>
        <input type="number" class="range-input" value="${range.from}" min="1" max="${currentPdfPages}" onchange="updateSplitRangeValue(${index}, 'from', this.value)" style="width:60px; background:transparent; border:1px solid rgba(255,183,0,0.3); color:var(--text-bright); font-family:var(--font-mono); font-size:var(--fs-sm); text-align:center; padding:4px;">
        <span style="font-family:var(--font-mono); font-size:var(--fs-xs); color:var(--text-dim);">TO</span>
        <input type="number" class="range-input" value="${range.to}" min="1" max="${currentPdfPages}" onchange="updateSplitRangeValue(${index}, 'to', this.value)" style="width:60px; background:transparent; border:1px solid rgba(255,183,0,0.3); color:var(--text-bright); font-family:var(--font-mono); font-size:var(--fs-sm); text-align:center; padding:4px;">
      </div>
      <div class="file-action" onclick="removeSplitRange(${index})" style="color:var(--red); border-color:rgba(255,45,85,0.2); width:28px; height:28px; font-size:var(--fs-xs);">✕</div>
    `;
    container.appendChild(div);
  });
}

window.validateSplit = function() {
  const btn = document.getElementById('split-btn');
  let isValid = splitRangesArray.length > 0;
  
  splitRangesArray.forEach(range => {
    if (range.from < 1 || range.to < 1 || range.from > currentPdfPages || range.to > currentPdfPages || range.from > range.to) {
      isValid = false;
    }
  });
  
  btn.disabled = !isValid;
};

window.processSplit = async function() {
  if (!currentSplitFile || !currentPdfPages || splitRangesArray.length === 0) return;
  
  const btn = document.getElementById('split-btn');
  const oldText = btn.textContent;
  const isConsolidated = document.getElementById('split-consolidate').classList.contains('on');
  
  btn.textContent = "EXTRACTING SECTORS...";
  btn.disabled = true;
  
  try {
    const { PDFDocument } = PDFLib;
    const arrayBuffer = await currentSplitFile.arrayBuffer();
    const sourcePdf = await PDFDocument.load(arrayBuffer);
    
    if (isConsolidated) {
      // Create one PDF with all selected unique pages from all ranges
      const allPageIndices = new Set();
      splitRangesArray.forEach(range => {
        for (let i = range.from - 1; i < range.to; i++) {
          allPageIndices.add(i);
        }
      });
      const sortedIndices = Array.from(allPageIndices).sort((a, b) => a - b);
      
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(sourcePdf, sortedIndices);
      copiedPages.forEach(p => newPdf.addPage(p));
      
      const pdfBytes = await newPdf.save();
      const fileName = currentSplitFile.name.replace('.pdf', '_split_consolidated.pdf');
      downloadBlob(pdfBytes, fileName, 'application/pdf');
      
      if (window.saveFileMetadata) {
        window.saveFileMetadata({ name: fileName, size: pdfBytes.length, type: 'application/pdf' }, 'SPLIT');
      }
    } else {
      // Download each range individually
      for (let i = 0; i < splitRangesArray.length; i++) {
        const range = splitRangesArray[i];
        const pageIndices = [];
        for (let j = range.from - 1; j < range.to; j++) {
          pageIndices.push(j);
        }
        
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);
        copiedPages.forEach(p => newPdf.addPage(p));
        
        const pdfBytes = await newPdf.save();
        const fileName = currentSplitFile.name.replace('.pdf', `_range_${range.from}-${range.to}.pdf`);
        downloadBlob(pdfBytes, fileName, 'application/pdf');
        
        if (window.saveFileMetadata) {
            window.saveFileMetadata({ name: fileName, size: pdfBytes.length, type: 'application/pdf' }, 'SPLIT');
        }
      }
    }
    
    btn.textContent = "DISSECTION COMPLETE ✓";
    btn.style.background = "var(--green)";
    
    setTimeout(() => {
        btn.textContent = oldText;
        btn.style.background = "";
        btn.disabled = false;
        window.closeSplit();
    }, 2500);
    
  } catch (err) {
    console.error("Split error:", err);
    btn.textContent = "DISSECTION FAILED";
    btn.style.background = "var(--red)";
    setTimeout(() => {
        btn.textContent = oldText;
        btn.style.background = "";
        btn.disabled = false;
    }, 2500);
  }
};

function downloadBlob(bytes, fileName, type) {
  const blob = new Blob([bytes], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── ROTATE ENGINE ──
let currentRotateFile = null;
let currentRotationDegrees = 0;

window.openRotate = function() {
  const overlay = document.getElementById('rotate-overlay');
  overlay.classList.remove('hidden');
  overlay.querySelector('.tool-box').style.animation = 'fade-up 0.4s ease both';
  window.clearRotate();
};

window.closeRotate = function() {
  document.getElementById('rotate-overlay').classList.add('hidden');
  window.clearRotate();
};

window.clearRotate = function() {
  currentRotateFile = null;
  currentRotationDegrees = 0;
  document.getElementById('rotate-preview').classList.add('hidden');
  document.getElementById('rotate-dropzone').classList.remove('hidden');
  document.getElementById('rotate-filename').textContent = '';
  document.getElementById('rotate-pages-count').textContent = '-- PAGES';
  document.getElementById('rotate-btn').disabled = true;
  document.getElementById('rotate-btn').textContent = "SYNC & ROTATE";
  document.getElementById('rotate-btn').style.background = "";
  document.getElementById('rotate-file-input').value = "";
  updateRotationUI();
};

window.handleRotateSelect = async function(e) {
  const file = e.target.files[0];
  if (!file || file.type !== 'application/pdf') return;
  
  currentRotateFile = file;
  document.getElementById('rotate-filename').textContent = file.name;
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPageCount();
    document.getElementById('rotate-pages-count').textContent = pages + " PAGES DETECTED";
    
    document.getElementById('rotate-dropzone').classList.add('hidden');
    document.getElementById('rotate-preview').classList.remove('hidden');
    document.getElementById('rotate-btn').disabled = false;
  } catch (err) {
    console.error("Error reading PDF for rotation:", err);
    alert("SYSTEM ERROR: UNABLE TO ACCESS PDF DATA");
    window.clearRotate();
  }
};

window.updateRotation = function(deg) {
  currentRotationDegrees = (currentRotationDegrees + deg) % 360;
  if(currentRotationDegrees < 0) currentRotationDegrees += 360;
  updateRotationUI();
};

function updateRotationUI() {
  const indicator = document.getElementById('rotation-indicator');
  if (indicator) {
    indicator.textContent = currentRotationDegrees + "°";
    indicator.style.transform = `rotate(${currentRotationDegrees}deg)`;
  }
}

window.processRotation = async function() {
  if (!currentRotateFile) return;
  
  const btn = document.getElementById('rotate-btn');
  const oldText = btn.textContent;
  btn.textContent = "REALIGNING AXIS...";
  btn.disabled = true;
  
  try {
    const { PDFDocument, degrees } = PDFLib;
    const arrayBuffer = await currentRotateFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    const pages = pdfDoc.getPages();
    pages.forEach(page => {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + currentRotationDegrees));
    });
    
    const pdfBytes = await pdfDoc.save();
    const fileName = currentRotateFile.name.replace('.pdf', `_rotated_${currentRotationDegrees}.pdf`);
    downloadBlob(pdfBytes, fileName, 'application/pdf');
    
    btn.textContent = "ROTATION COMPLETE ✓";
    btn.style.background = "var(--green)";
    
    if (window.saveFileMetadata) {
        window.saveFileMetadata({ name: fileName, size: pdfBytes.length, type: 'application/pdf' }, 'ROTATE');
    }
    
    setTimeout(() => {
        btn.textContent = oldText;
        btn.style.background = "";
        btn.disabled = false;
        window.closeRotate();
    }, 2500);
    
  } catch (err) {
    console.error("Rotation error:", err);
    btn.textContent = "CRITICAL FAILURE";
    btn.style.background = "var(--red)";
    setTimeout(() => {
        btn.textContent = oldText;
        btn.style.background = "";
        btn.disabled = false;
    }, 2500);
  }
};

// ── INSPECT ENGINE ──
window.openInspect = function() {
  const overlay = document.getElementById('inspect-overlay');
  overlay.classList.remove('hidden');
  overlay.querySelector('.tool-box').style.animation = 'fade-up 0.4s ease both';
  window.clearInspect();
};

window.closeInspect = function() {
  document.getElementById('inspect-overlay').classList.add('hidden');
  window.clearInspect();
};

window.clearInspect = function() {
  document.getElementById('inspect-preview').classList.add('hidden');
  document.getElementById('inspect-dropzone').classList.remove('hidden');
  document.getElementById('inspect-results').innerHTML = '';
  document.getElementById('inspect-file-input').value = '';
};

window.handleInspectSelect = async function(e) {
  const file = e.target.files[0];
  if (!file) return;

  document.getElementById('inspect-dropzone').classList.add('hidden');
  document.getElementById('inspect-preview').classList.remove('hidden');
  
  const resultsContainer = document.getElementById('inspect-results');
  resultsContainer.innerHTML = '<div style="color:var(--teal); text-align:center;">INITIALIZING SCAN...</div>';

  try {
    let metadata = {
      "FILE_NAME": file.name,
      "FILE_SIZE": (file.size / 1024).toFixed(2) + " KB",
      "FILE_TYPE": file.type || "Unknown/Binary",
      "LAST_MODIFIED": new Date(file.lastModified).toLocaleString()
    };

    if (file.type === 'application/pdf') {
       const arrayBuffer = await file.arrayBuffer();
       const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
       
       metadata["PDF_PAGES"] = pdfDoc.getPageCount();
       metadata["PDF_TITLE"] = pdfDoc.getTitle() || "NOT_SET";
       metadata["PDF_AUTHOR"] = pdfDoc.getAuthor() || "NOT_SET";
       metadata["PDF_SUBJECT"] = pdfDoc.getSubject() || "NOT_SET";
       metadata["PDF_CREATOR"] = pdfDoc.getCreator() || "NOT_SET";
       metadata["PDF_PRODUCER"] = pdfDoc.getProducer() || "NOT_SET";
       
       const cDate = pdfDoc.getCreationDate();
       metadata["CREATION_DATE"] = cDate ? cDate.toLocaleString() : "UNKNOWN";
       
       const mDate = pdfDoc.getModificationDate();
       metadata["MOD_DATE"] = mDate ? mDate.toLocaleString() : "UNKNOWN";
    }

    renderInspectResults(metadata);
    
    if (window.logUserActivity) window.logUserActivity("INSPECT: " + file.name);

  } catch (err) {
    console.error("Inspection error:", err);
    resultsContainer.innerHTML = `<div style="color:var(--red);">CRITICAL_SCAN_ERROR: ${err.message.toUpperCase()}</div>`;
  }
};

function renderInspectResults(data) {
  const container = document.getElementById('inspect-results');
  let html = '<div style="display:flex; flex-direction:column; gap:12px;">';
  
  for (const [key, val] of Object.entries(data)) {
    html += `
      <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(0,255,204,0.05); padding-bottom:4px;">
        <span style="color:var(--text-dim); font-size:var(--fs-xs); letter-spacing:0.05em;">${key}</span>
        <span style="color:var(--teal); font-size:var(--fs-sm); text-align:right; max-width:60%; overflow-wrap:break-word;">${val}</span>
      </div>
    `;
  }
  
  html += '</div>';
  container.innerHTML = html;
}
