/**
 * SportConnect — Interactive Mobile-First Controller
 * Zero dependencies, pure ES6+, Netlify Forms ready.
 */

const VALID_TABS = new Set(['home', 'products', 'commercial', 'roadmap', 'access']);
const VALID_PRODUCTS = new Set(['match', 'pt', 'tri', 'academy', 'safeguard', 'recovery']);

const state = {
  mainTab: 'home',
  productTab: 'match',
};

/* ==========================================================================
   Navigation & Hash Routing
   ========================================================================== */
function setMainTab(tabId, subProduct = null, updateHash = true) {
  if (!VALID_TABS.has(tabId)) tabId = 'home';
  state.mainTab = tabId;

  // Toggle sections
  document.querySelectorAll('.main-section').forEach((sec) => {
    const isMatch = sec.id === `section-${tabId}`;
    sec.classList.toggle('is-active', isMatch);
    sec.hidden = !isMatch;
  });

  // Update desktop & bottom nav buttons
  document.querySelectorAll('[data-nav-tab]').forEach((btn) => {
    const active = btn.dataset.navTab === tabId;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-current', active ? 'page' : 'false');
  });

  // Toggle products subnav bar
  const subnav = document.getElementById('products-subnav');
  if (subnav) {
    subnav.classList.toggle('is-hidden', tabId !== 'products');
  }

  if (tabId === 'products') {
    setProductTab(subProduct || state.productTab, false);
  }

  if (updateHash) {
    const hash = tabId === 'products' ? `#products/${state.productTab}` : `#${tabId}`;
    if (window.location.hash !== hash) {
      history.replaceState(null, '', hash);
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setProductTab(productId, updateHash = true) {
  if (!VALID_PRODUCTS.has(productId)) productId = 'match';
  state.productTab = productId;

  document.querySelectorAll('.product-view').forEach((view) => {
    const isMatch = view.id === `view-${productId}`;
    view.classList.toggle('is-active', isMatch);
    view.hidden = !isMatch;
  });

  document.querySelectorAll('[data-product-tab]').forEach((pill) => {
    const active = pill.dataset.productTab === productId;
    pill.classList.toggle('is-active', active);
    pill.setAttribute('aria-selected', String(active));
    if (active) {
      pill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  });

  if (updateHash && state.mainTab === 'products') {
    const hash = `#products/${productId}`;
    if (window.location.hash !== hash) {
      history.replaceState(null, '', hash);
    }
  }
}

function applyHashRoute() {
  const raw = window.location.hash.replace(/^#/, '');
  if (!raw) {
    setMainTab('home', null, false);
    return;
  }
  const [tab, sub] = raw.split('/');
  if (VALID_TABS.has(tab)) {
    setMainTab(tab, sub && VALID_PRODUCTS.has(sub) ? sub : null, false);
  } else {
    setMainTab('home', null, false);
  }
}

/* ==========================================================================
   Phone Mockup Carousels (Swipe + Dots + Prev/Next)
   ========================================================================== */
function initPhoneCarousels() {
  document.querySelectorAll('.phone-device').forEach((device) => {
    const track = device.querySelector('.phone-carousel');
    const slides = Array.from(device.querySelectorAll('.phone-slide'));
    const dots = Array.from(device.querySelectorAll('.carousel-dot'));
    const prevBtn = device.querySelector('[data-carousel-prev]');
    const nextBtn = device.querySelector('[data-carousel-next]');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;

    function updateDots(index) {
      currentIndex = index;
      dots.forEach((dot, i) => {
        const active = i === index;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-current', active ? 'true' : 'false');
      });
    }

    function goToSlide(index) {
      const clamped = (index + slides.length) % slides.length;
      slides[clamped].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      updateDots(clamped);
    }

    // Observe active slide as user swipes
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const idx = slides.indexOf(entry.target);
            if (idx !== -1) updateDots(idx);
          }
        });
      },
      { root: track, threshold: 0.6 }
    );

    slides.forEach((slide) => observer.observe(slide));

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => goToSlide(i));
    });

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
  });
}

/* ==========================================================================
   Interactive In-Phone Micro-Demos
   ========================================================================== */

// 1. Match Day Formation Switcher
const FORMATIONS = {
  '4-3-3': [
    { label: 'GK', top: 88, left: 50 },
    { label: 'LB', top: 68, left: 16 },
    { label: 'CB', top: 72, left: 38 },
    { label: 'CB', top: 72, left: 62 },
    { label: 'RB', top: 68, left: 84 },
    { label: 'CM', top: 48, left: 28 },
    { label: 'CDM', top: 54, left: 50 },
    { label: 'CM', top: 48, left: 72 },
    { label: 'LW', top: 24, left: 20 },
    { label: 'ST', top: 18, left: 50 },
    { label: 'RW', top: 24, left: 80 },
  ],
  '3-5-2': [
    { label: 'GK', top: 88, left: 50 },
    { label: 'CB', top: 72, left: 26 },
    { label: 'CB', top: 75, left: 50 },
    { label: 'CB', top: 72, left: 74 },
    { label: 'LWB', top: 48, left: 14 },
    { label: 'CM', top: 52, left: 36 },
    { label: 'CAM', top: 40, left: 50 },
    { label: 'CM', top: 52, left: 64 },
    { label: 'RWB', top: 48, left: 86 },
    { label: 'ST', top: 20, left: 36 },
    { label: 'ST', top: 20, left: 64 },
  ],
  '4-4-2': [
    { label: 'GK', top: 88, left: 50 },
    { label: 'LB', top: 70, left: 16 },
    { label: 'CB', top: 73, left: 38 },
    { label: 'CB', top: 73, left: 62 },
    { label: 'RB', top: 70, left: 84 },
    { label: 'LM', top: 46, left: 16 },
    { label: 'CM', top: 49, left: 39 },
    { label: 'CM', top: 49, left: 61 },
    { label: 'RM', top: 46, left: 84 },
    { label: 'ST', top: 21, left: 37 },
    { label: 'ST', top: 21, left: 63 },
  ],
};

function initMatchDayDemo() {
  const pitch = document.getElementById('tactical-pitch');
  const note = document.getElementById('formation-ai-note');
  if (!pitch) return;

  const aiHints = {
    '4-3-3': 'AI Tactical Engine: High press exploits opponent wing-backs (+14% xG).',
    '3-5-2': 'AI Tactical Engine: Midfield overload counters narrow diamond setups.',
    '4-4-2': 'AI Tactical Engine: Compact two-bank block locks down central lanes.',
  };

  function renderFormation(name) {
    const coords = FORMATIONS[name];
    if (!coords) return;

    const existing = pitch.querySelectorAll('.pitch-node');
    if (existing.length === coords.length) {
      coords.forEach((p, idx) => {
        existing[idx].textContent = p.label;
        existing[idx].style.top = `${p.top}%`;
        existing[idx].style.left = `${p.left}%`;
      });
    } else {
      existing.forEach((n) => n.remove());
      coords.forEach((p) => {
        const el = document.createElement('div');
        el.className = 'pitch-node';
        el.textContent = p.label;
        el.style.top = `${p.top}%`;
        el.style.left = `${p.left}%`;
        pitch.appendChild(el);
      });
    }

    if (note) note.textContent = aiHints[name] || '';
  }

  document.querySelectorAll('[data-formation]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-formation]').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      renderFormation(btn.dataset.formation);
    });
  });

  renderFormation('4-3-3');
}

// 2. Triathlon First Aid Dispatch Toggle
function initTriathlonDemo() {
  const btn = document.getElementById('medic-deploy-btn');
  const status = document.getElementById('medic-status');
  if (!btn || !status) return;

  let dispatched = false;
  btn.addEventListener('click', () => {
    dispatched = !dispatched;
    btn.classList.toggle('is-done', dispatched);
    btn.textContent = dispatched ? 'Dispatched — ETA 2m 15s (Tap to Recall)' : 'Deploy to Sector 4';
    status.textContent = dispatched ? 'En Route to Sector 4 • GPS Live' : 'On Standby • Sector 2 Base';
  });
}

// 3. Academy Format Switcher (5v5 / 6v6 / 7v7) & Export
function initAcademyDemo() {
  const caption = document.getElementById('academy-split-note');
  const exportBtn = document.getElementById('academy-export-btn');

  const formatNotes = {
    '5v5': '5v5 Fair Grid • 8 squad players • Guaranteed 62.5% min play time.',
    '6v6': '6v6 Fair Grid • 9 squad players • Guaranteed 66.7% min play time.',
    '7v7': '7v7 Fair Grid • 11 squad players • Mid-quarter 50/50 auto-swap.',
  };

  document.querySelectorAll('[data-academy-format]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-academy-format]').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      if (caption) caption.textContent = formatNotes[btn.dataset.academyFormat] || '';
    });
  });

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      exportBtn.classList.add('is-done');
      exportBtn.textContent = 'Team Sheet PNG Ready to Share ✓';
      setTimeout(() => {
        exportBtn.classList.remove('is-done');
        exportBtn.textContent = 'Export Visual Team Sheet';
      }, 2400);
    });
  }
}

// 4. Safeguard Zero-Trust Toggle
function initSafeguardDemo() {
  const toggle = document.getElementById('safeguard-toggle');
  const msg = document.getElementById('safeguard-toggle-msg');
  if (!toggle || !msg) return;

  toggle.addEventListener('click', () => {
    const active = toggle.getAttribute('aria-pressed') === 'true';
    const next = !active;
    toggle.setAttribute('aria-pressed', String(next));
    msg.textContent = next
      ? 'Roster access unlocked automatically — Police & Garda Vetting verified through Oct 2028.'
      : 'Access locked by Zero-Trust RBAC — awaiting updated safeguarding certification.';
  });
}

// 5. Recovery Thermal Logger
function initRecoveryDemo() {
  const saunaBtn = document.getElementById('log-sauna-btn');
  const iceBtn = document.getElementById('log-ice-btn');
  const saunaVal = document.getElementById('sauna-time');
  const iceVal = document.getElementById('ice-time');

  let saunaMins = 15;
  let iceSecs = 210; // 3m 30s

  if (saunaBtn && saunaVal) {
    saunaBtn.addEventListener('click', () => {
      saunaMins = saunaMins >= 30 ? 15 : saunaMins + 5;
      saunaVal.textContent = `${String(saunaMins).padStart(2, '0')}m 00s`;
    });
  }

  if (iceBtn && iceVal) {
    iceBtn.addEventListener('click', () => {
      iceSecs = iceSecs >= 360 ? 180 : iceSecs + 30;
      const m = Math.floor(iceSecs / 60);
      const s = iceSecs % 60;
      iceVal.textContent = `${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
    });
  }
}

/* ==========================================================================
   Commercial White-Label Live Previewer & RBAC Drawer
   ========================================================================== */
function initCommercialDemos() {
  const themes = {
    default: {
      primary: '#0891b2',
      secondary: '#10b981',
      club: 'SportConnect Native',
      sub: 'Default Enterprise Theme • com.sportconnect.app',
      cta: 'Member App Live',
      storeName: 'SportConnect Pro',
      pushCopy: 'Squad sheet published for Sat 14:00',
      sponsorCopy: 'Official Kit Partner Banner Active',
      logoSvg: `
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs><linearGradient id="wlLgSC" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0891b2"/><stop offset="100%" stop-color="#10b981"/></linearGradient></defs>
          <rect width="80" height="80" rx="20" fill="url(#wlLgSC)"/>
          <circle cx="40" cy="44" r="23" stroke="#fff" stroke-width="4"/>
          <path d="M40 21v-7M33 14h14M58 26l4-4" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/>
          <g stroke="rgba(255,255,255,0.65)" stroke-width="1.8">
            <line x1="27" y1="36" x2="40" y2="32"/><line x1="40" y1="32" x2="53" y2="39"/>
            <line x1="53" y1="39" x2="46" y2="55"/><line x1="46" y1="55" x2="32" y2="56"/>
            <line x1="32" y1="56" x2="27" y2="36"/>
          </g>
          <circle cx="27" cy="36" r="2.6" fill="#fff"/><circle cx="40" cy="32" r="2.6" fill="#fff"/>
          <circle cx="53" cy="39" r="2.6" fill="#fff"/><circle cx="46" cy="55" r="2.6" fill="#fff"/>
          <circle cx="32" cy="56" r="2.6" fill="#fff"/>
          <circle cx="40" cy="44" r="4" fill="#fff"/>
          <path d="M40 44V33M40 44l9 6" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/>
        </svg>`,
    },
    rovers: {
      primary: '#059669',
      secondary: '#84cc16',
      club: 'Emerald Rovers FC',
      sub: 'Custom Football Club Crest • com.emeraldrovers.fc',
      cta: 'Rovers App Live',
      storeName: 'Emerald Rovers Official',
      pushCopy: 'U14 & Senior 4-3-3 match lineups posted',
      sponsorCopy: 'Greenfield Physio — Matchday Sponsor',
      logoSvg: `
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs><linearGradient id="wlLgER" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#047857"/><stop offset="100%" stop-color="#84cc16"/></linearGradient></defs>
          <rect width="80" height="80" rx="20" fill="url(#wlLgER)"/>
          <path d="M40 12L62 20v19c0 15-10 24-22 29-12-5-22-14-22-29V20L40 12z" fill="rgba(255,255,255,0.16)" stroke="#fff" stroke-width="3.4" stroke-linejoin="round"/>
          <path d="M22 44L58 26" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
          <path d="M24 51L56 35" stroke="rgba(255,255,255,0.55)" stroke-width="2.4" stroke-linecap="round"/>
          <polygon points="40,18 42,23 47,23 43,26 44.5,31 40,28 35.5,31 37,26 33,23 38,23" fill="#fff"/>
          <circle cx="40" cy="47" r="6" fill="#fff"/>
          <circle cx="40" cy="47" r="2.6" fill="#047857"/>
        </svg>`,
    },
    royal: {
      primary: '#2563eb',
      secondary: '#38bdf8',
      club: 'Royal Athletic Union',
      sub: 'Multi-Club Federation App • org.royalathletic.union',
      cta: 'Federation Hub Live',
      storeName: 'Royal Athletic Hub',
      pushCopy: '99.1% Garda & Safeguard compliance verified',
      sponsorCopy: 'BluePeak Hydration — Official Partner',
      logoSvg: `
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs><linearGradient id="wlLgRA" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1d4ed8"/><stop offset="100%" stop-color="#38bdf8"/></linearGradient></defs>
          <rect width="80" height="80" rx="20" fill="url(#wlLgRA)"/>
          <circle cx="40" cy="40" r="28" stroke="rgba(255,255,255,0.35)" stroke-width="2" stroke-dasharray="4 4"/>
          <path d="M20 46l5-20 15 10 15-10 5 20H20z" fill="rgba(255,255,255,0.22)" stroke="#fff" stroke-width="3.2" stroke-linejoin="round"/>
          <path d="M23 53h34" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
          <path d="M28 60l12 5 12-5" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="40" cy="21" r="3.6" fill="#fff"/>
          <circle cx="25" cy="23" r="2.6" fill="#fff"/>
          <circle cx="55" cy="23" r="2.6" fill="#fff"/>
        </svg>`,
    },
    crimson: {
      primary: '#e11d48',
      secondary: '#f97316',
      club: 'Crimson United AC',
      sub: 'Zero SportConnect Branding • com.crimsonunited.ac',
      cta: 'Crimson App Live',
      storeName: 'Crimson United Pro',
      pushCopy: 'Recovery check-in: Sauna & HRV targets ready',
      sponsorCopy: 'Apex Performance Labs — Featured Offer',
      logoSvg: `
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs><linearGradient id="wlLgCU" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#be123c"/><stop offset="100%" stop-color="#f97316"/></linearGradient></defs>
          <rect width="80" height="80" rx="20" fill="url(#wlLgCU)"/>
          <polygon points="40,10 64,24 64,56 40,70 16,56 16,24" fill="rgba(255,255,255,0.16)" stroke="#fff" stroke-width="3.4" stroke-linejoin="round"/>
          <polygon points="40,17 58,27.5 58,52.5 40,63 22,52.5 22,27.5" stroke="rgba(255,255,255,0.4)" stroke-width="1.6"/>
          <path d="M44 20L28 42h11l-4 18 17-22H41l3-18z" fill="#fff"/>
        </svg>`,
    },
  };

  const crestEl = document.getElementById('wl-club-crest');
  const nameEl = document.getElementById('wl-club-name');
  const subEl = document.getElementById('wl-club-sub');
  const ctaEl = document.getElementById('wl-pill-cta');
  const storeEl = document.getElementById('wl-store-name');
  const pushEl = document.getElementById('wl-push-copy');
  const sponsorEl = document.getElementById('wl-sponsor-copy');

  function applyBrandTheme(key) {
    const t = themes[key];
    if (!t) return;
    document.documentElement.style.setProperty('--wl-primary', t.primary);
    document.documentElement.style.setProperty('--wl-secondary', t.secondary);
    if (crestEl) {
      crestEl.innerHTML = t.logoSvg;
      crestEl.style.transform = 'scale(0.92)';
      requestAnimationFrame(() => {
        crestEl.style.transform = 'scale(1)';
      });
    }
    if (nameEl) nameEl.textContent = t.club;
    if (subEl) subEl.textContent = t.sub;
    if (ctaEl) ctaEl.textContent = t.cta;
    if (storeEl) storeEl.textContent = t.storeName;
    if (pushEl) pushEl.textContent = t.pushCopy;
    if (sponsorEl) sponsorEl.textContent = t.sponsorCopy;
  }

  document.querySelectorAll('[data-wl-theme]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-wl-theme]').forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      applyBrandTheme(btn.dataset.wlTheme);
    });
  });

  // Render default logo on load
  applyBrandTheme('default');

  // RBAC Exception Drawer
  const rbacBtn = document.getElementById('rbac-review-btn');
  const rbacDrawer = document.getElementById('rbac-drawer');
  if (rbacBtn && rbacDrawer) {
    rbacBtn.addEventListener('click', () => {
      const isOpen = rbacDrawer.classList.toggle('is-open');
      rbacBtn.setAttribute('aria-expanded', String(isOpen));
      rbacBtn.textContent = isOpen ? 'Hide (2)' : 'Review (2)';
    });
  }
}

/* ==========================================================================
   Netlify Forms Submission Handler
   ========================================================================== */
function initEarlyAccessForm() {
  const form = document.getElementById('early-access-form');
  const statusEl = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit-btn');
  if (!form || !statusEl || !submitBtn) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    const formData = new FormData(form);
    const body = new URLSearchParams(formData).toString();

    try {
      // On Netlify, POSTing URL-encoded form data to "/" records the submission.
      const isLocalFile = window.location.protocol === 'file:';
      if (!isLocalFile) {
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body,
        });
        if (!res.ok) throw new Error('Network response was not ok');
      }

      statusEl.textContent =
        "You're on the SportConnect priority list! We'll reach out shortly with early-access details and demo credentials.";
      statusEl.classList.add('is-visible');
      form.reset();
    } catch {
      // Friendly confirmation fallback for local dev servers that don't handle POST /
      statusEl.textContent =
        'Preview mode: your details validated cleanly! Once hosted on Netlify, this form automatically saves leads to Netlify Forms.';
      statusEl.classList.add('is-visible');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

/* ==========================================================================
   Theme Switcher (Light Default + Dark Athletic Toggle)
   ========================================================================== */
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle-btn');
  const meta = document.getElementById('theme-color-meta');
  if (!btn) return;

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    btn.setAttribute('aria-pressed', String(isDark));
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    btn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    if (meta) meta.setAttribute('content', isDark ? '#050911' : '#f8fafc');
    try {
      localStorage.setItem('sportconnect-theme', isDark ? 'dark' : 'light');
    } catch {}
  }

  // Sync button state with initial attribute
  const initial = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  applyTheme(initial);

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

/* ==========================================================================
   Bootstrap
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  // Bind all main nav triggers
  document.querySelectorAll('[data-nav-tab]').forEach((el) => {
    el.addEventListener('click', () => {
      setMainTab(el.dataset.navTab, el.dataset.subProduct || null);
    });
  });

  // Bind quick-jump buttons anywhere in content
  document.querySelectorAll('[data-jump-tab]').forEach((el) => {
    el.addEventListener('click', () => {
      setMainTab(el.dataset.jumpTab, el.dataset.jumpProduct || null);
    });
  });

  // Bind product sub-nav pills
  document.querySelectorAll('[data-product-tab]').forEach((el) => {
    el.addEventListener('click', () => {
      setProductTab(el.dataset.productTab);
    });
  });

  window.addEventListener('hashchange', applyHashRoute);

  initPhoneCarousels();
  initMatchDayDemo();
  initTriathlonDemo();
  initAcademyDemo();
  initSafeguardDemo();
  initRecoveryDemo();
  initCommercialDemos();
  initEarlyAccessForm();

  applyHashRoute();
});
