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
    default: { primary: '#22d3ee', secondary: '#10b981', code: 'SC', club: 'SportConnect Native', sub: 'Default Enterprise Theme' },
    rovers: { primary: '#10b981', secondary: '#a3e635', code: 'ER', club: 'Emerald Rovers FC', sub: 'Custom Crest & App Store Bundle' },
    royal: { primary: '#3b82f6', secondary: '#60a5fa', code: 'RA', club: 'Royal Athletic Union', sub: 'White-Label Federation App' },
    crimson: { primary: '#f43f5e', secondary: '#fb923c', code: 'CU', club: 'Crimson United AC', sub: 'Zero SportConnect Branding' },
  };

  const crestEl = document.getElementById('wl-club-crest');
  const nameEl = document.getElementById('wl-club-name');
  const subEl = document.getElementById('wl-club-sub');

  document.querySelectorAll('[data-wl-theme]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const t = themes[btn.dataset.wlTheme];
      if (!t) return;
      document.querySelectorAll('[data-wl-theme]').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      document.documentElement.style.setProperty('--wl-primary', t.primary);
      document.documentElement.style.setProperty('--wl-secondary', t.secondary);
      if (crestEl) crestEl.textContent = t.code;
      if (nameEl) nameEl.textContent = t.club;
      if (subEl) subEl.textContent = t.sub;
    });
  });

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
   Bootstrap
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
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
