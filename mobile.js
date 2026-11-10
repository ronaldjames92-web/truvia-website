/* Truvia Consultants — mobile responsive layer.
   Injected on every page. Phone rules live inside max-width:860px; a small
   861-1440px block only tightens the header so it fits laptop screens. */
(function () {
  'use strict';

  var CSS = [
    '@media (max-width: 860px){',
    /* ---- horizontal padding: 48px gutters -> comfortable mobile gutters ---- */
    '  section, footer{ padding-left:22px !important; padding-right:22px !important; }',
    '  [style*="padding:0 48px"], [style*="padding: 0 48px"]{ padding-left:22px !important; padding-right:22px !important; }',
    '  [style*="padding:0 40px"], [style*="padding:0 60px"], [style*="padding:0 64px"]{ padding-left:22px !important; padding-right:22px !important; }',
    /* ---- stack every multi-column grid into a single column ---- */
    '  [style*="grid-template-columns"]{ grid-template-columns:1fr !important; }',
    '  [style*="grid-template-columns"]{ gap:28px !important; }',
    /* ---- media never overflows ---- */
    '  img{ max-width:100% !important; }',
    /* ---- kill sticky columns (they overlap content once grids stack to 1fr) ---- */
    '  section [style*="position:sticky"]{ position:static !important; top:auto !important; }',
    /* ---- hero: let it breathe instead of forcing full viewport ---- */
    '  #hero{ min-height:auto !important; padding-top:110px !important; padding-bottom:72px !important; }',
    '  #hero [style*="inline-flex"][style*="overflow:hidden"]{ display:flex !important; flex-wrap:wrap !important; }',
    /* ---- large hero card / fixed second column shrinks with the grid (handled above) ---- */
    /* ---- shrink oversized vertical section padding a touch ---- */
    '  section[style*="120px"], section[style*="140px"], section[style*="160px"]{ padding-top:64px !important; padding-bottom:64px !important; }',
    /* ================= NAV ================= */
    '  #navbar{ padding-left:20px !important; padding-right:20px !important; flex-wrap:wrap !important; height:auto !important; min-height:68px !important; padding-top:10px !important; padding-bottom:10px !important; row-gap:8px !important; }',
    '  #navbar > div{ display:none !important; }',
    '  #navbar > a[href]{ margin-right:0 !important; }',
    '  #mnav-btn{ display:flex !important; }',
    /* single-row header: logo | search | menu. The MARA badge is left to the headline and trust section on mobile. */
    '  #navbar > div:has(.mara-chip){ display:flex !important; margin-left:auto; gap:2px !important; }',
    '  #navbar > div:has(.mara-chip) > a{ display:none !important; }',
    '  #navbar .ss-trigger{ width:44px; height:44px; }',
    '  #navbar #mnav-btn{ margin-left:0; }',
    /* ---- bottom action bar replaces the floating WhatsApp bubble on phones ---- */
    '  #mbar{ display:flex !important; }',
    '  a[href^="https://wa.me/"][style*="position:fixed"]{ display:none !important; }',
    '  body{ padding-bottom:calc(70px + env(safe-area-inset-bottom)) !important; }',
    '}',
    /* ---- laptop / tablet widths: the full desktop header is ~1370px wide, so tighten it to avoid sideways scrolling ---- */
    '@media (min-width: 861px) and (max-width: 1440px){',
    '  #navbar{ padding-left:28px !important; padding-right:28px !important; }',
    '  #navbar a[href^="tel:"]{ display:none !important; }',
    '  #navbar .nav-link{ padding-left:9px !important; padding-right:9px !important; }',
    '}',
    '@media (min-width: 861px) and (max-width: 1180px){',
    '  #navbar{ padding-left:20px !important; padding-right:20px !important; }',
    '  #navbar .mara-chip{ display:none !important; }',
    '  #navbar .nav-link{ padding-left:6px !important; padding-right:6px !important; font-size:12.5px !important; }',
    '}',
    '@media (min-width: 861px) and (max-width: 1000px){',
    '  #navbar{ padding-left:14px !important; padding-right:14px !important; }',
    '  #navbar .nav-link[href="index.html"]{ display:none !important; }',
    '  #navbar .nav-link{ padding-left:4px !important; padding-right:4px !important; font-size:12px !important; }',
    '}',
    /* ---- phone action bar (Call / WhatsApp / Free Assessment) ---- */
    '#mbar{ display:none; position:fixed; left:0; right:0; bottom:0; z-index:990; gap:8px; padding:8px 10px calc(8px + env(safe-area-inset-bottom)); background:rgba(255,255,255,0.97); -webkit-backdrop-filter:blur(14px); backdrop-filter:blur(14px); border-top:1px solid rgba(47,72,109,0.12); box-shadow:0 -6px 24px rgba(7,15,28,0.08); }',
    '#mbar a{ flex:1; display:flex; align-items:center; justify-content:center; gap:6px; height:46px; border-radius:11px; font-family:Inter,sans-serif; font-size:13.5px; font-weight:700; text-decoration:none; white-space:nowrap; }',
    '#mbar .mb-call{ color:#2F486D; border:1.5px solid rgba(47,72,109,0.25); background:#fff; flex:0.8; }',
    '#mbar .mb-wa{ color:#fff; background:#25D366; flex:1; }',
    '#mbar .mb-book{ color:#fff; background:linear-gradient(135deg,#9E8548,#B8994E); flex:1.25; }',
    '#mbar svg{ flex-shrink:0; }',
    /* ---- hamburger button (hidden until mobile media query flips it on) ---- */
    '#mnav-btn{ display:none; margin-left:auto; flex-direction:column; justify-content:center; gap:5px; width:44px; height:44px; padding:0; border:none; background:transparent; cursor:pointer; flex-shrink:0; }',
    '#mnav-btn span{ display:block; width:24px; height:2px; border-radius:2px; background:#2F486D; transition:transform .3s cubic-bezier(.16,1,.3,1), opacity .2s; }',
    '#mnav-btn.open span:nth-child(1){ transform:translateY(7px) rotate(45deg); }',
    '#mnav-btn.open span:nth-child(2){ opacity:0; }',
    '#mnav-btn.open span:nth-child(3){ transform:translateY(-7px) rotate(-45deg); }',
    /* ---- overlay ---- */
    '#mnav-overlay{ position:fixed; inset:0; background:rgba(7,15,28,0.5); backdrop-filter:blur(3px); -webkit-backdrop-filter:blur(3px); opacity:0; pointer-events:none; transition:opacity .35s ease; z-index:998; }',
    '#mnav-overlay.open{ opacity:1; pointer-events:auto; }',
    /* ---- drawer ---- */
    '#mnav-drawer{ position:fixed; top:0; right:0; height:100%; width:min(86vw,360px); background:#ffffff; box-shadow:-24px 0 60px rgba(7,15,28,0.28); z-index:999; transform:translateX(100%); transition:transform .38s cubic-bezier(.16,1,.3,1); display:flex; flex-direction:column; overflow-y:auto; -webkit-overflow-scrolling:touch; }',
    '#mnav-drawer.open{ transform:translateX(0); }',
    '#mnav-drawer .mnav-head{ display:flex; align-items:center; justify-content:space-between; padding:20px 22px; border-bottom:1px solid rgba(47,72,109,0.09); position:sticky; top:0; background:#fff; z-index:2; }',
    '#mnav-drawer .mnav-head img{ height:42px; width:auto; }',
    '#mnav-drawer .mnav-close{ width:40px; height:40px; border:none; background:rgba(47,72,109,0.06); border-radius:10px; font-size:22px; line-height:1; color:#2F486D; cursor:pointer; display:flex; align-items:center; justify-content:center; }',
    '#mnav-drawer nav{ padding:12px 14px 20px; display:flex; flex-direction:column; }',
    '#mnav-drawer .mnav-group{ border-bottom:1px solid rgba(47,72,109,0.07); }',
    '#mnav-drawer .mnav-toplink{ display:flex; align-items:center; justify-content:space-between; font-family:Inter,sans-serif; font-size:15.5px; font-weight:600; color:#1C2B3A; text-decoration:none; padding:15px 10px; cursor:pointer; }',
    '#mnav-drawer .mnav-toplink .mnav-caret{ transition:transform .3s ease; color:#9E8548; }',
    '#mnav-drawer .mnav-group.open .mnav-caret{ transform:rotate(180deg); }',
    '#mnav-drawer .mnav-sub{ display:grid; grid-template-rows:0fr; transition:grid-template-rows .32s cubic-bezier(.16,1,.3,1); }',
    '#mnav-drawer .mnav-group.open .mnav-sub{ grid-template-rows:1fr; }',
    '#mnav-drawer .mnav-sub > div{ overflow:hidden; }',
    '#mnav-drawer .mnav-sub a{ display:block; font-family:Inter,sans-serif; font-size:13.5px; font-weight:500; color:#4A5568; text-decoration:none; padding:11px 10px 11px 22px; }',
    '#mnav-drawer .mnav-sub a:active{ color:#2F486D; }',
    '#mnav-drawer .mnav-cta{ margin:20px 10px 8px; display:flex; flex-direction:column; gap:12px; }',
    '#mnav-drawer .mnav-cta a.call{ font-family:Inter,sans-serif; font-size:14px; font-weight:600; color:#2F486D; text-decoration:none; text-align:center; padding:13px; border:1.5px solid rgba(47,72,109,0.25); border-radius:10px; }',
    '#mnav-drawer .mnav-cta a.book{ font-family:Inter,sans-serif; font-size:14px; font-weight:700; color:#fff; text-decoration:none; text-align:center; padding:15px; border-radius:10px; background:linear-gradient(135deg,#9E8548,#B8994E); box-shadow:0 8px 24px rgba(158,133,72,0.3); }',
    'body.mnav-lock{ overflow:hidden !important; }'
  ].join('\n');

  var MENU = [
    ['Home', 'index.html', null],
    ['About Us', 'about.html', [
      ['Company Profile', 'about.html'],
      ['Why Choose Truvia', 'about.html#why']
    ]],
    ['Australia', 'australia-migration.html', [
      ['Australia Overview', 'australia-migration.html'],
      ['General Skilled Migration (GSM)', 'australia-gsm.html'],
      ['Employer Sponsored Visas', 'australia-employer-sponsored.html'],
      ['Visitor Visa (Subclass 600)', 'australia-visitor-visa.html'],
      ['National Innovation Visa', 'australia-national-innovation-visa.html'],
      ['Skills Assessment Authorities', 'australia-skills-assessment.html'],
      ['Appeals & Reviews', 'australia-appeals.html'],
      ['Salaries in Australia', 'australia-salaries.html'],
      ['Cost of Living in Australia', 'australia-cost-of-living.html'],
      ['PR Points Calculator', 'australia-pr-points-calculator.html'],
      ['Processing Times', 'australia-processing-times.html'],
      ['Occupations in Demand', 'australia-occupations-in-demand.html'],
      ['— Engineers', 'australia-engineer-pr.html'],
      ['— IT Professionals', 'australia-it-jobs.html'],
      ['— Nurses & Medical', 'australia-nurse-salary.html'],
      ['— Nurse Pathway to Australia', 'australia-nurse-pathway.html'],
      ['— Trades & Welding', 'australia-trades-pr.html'],
      ['— Accountants', 'australia-accountant-pr.html'],
      ['— Chefs & Hospitality', 'australia-chef-hospitality-pr.html']
    ]],
    ['Canada', 'canada-immigration.html', [
      ['Express Entry', 'canada-immigration.html'],
      ['Provincial Nominee (PNP)', 'canada-immigration.html#pnp'],
      ['AIP & RCIP', 'canada-immigration.html#aip']
    ]],
    ['Training', 'training.html', [
      ['IELTS Preparation', 'training.html'],
      ['PTE Academic Training', 'training.html#pte'],
      ['OET Preparation', 'training.html#oet'],
      ['NCLEX Training', 'training.html#nclex']
    ]],
    ['Other Services', 'other-services.html', [
      ['Study Visa', 'other-services.html'],
      ['Visitor Visas', 'other-services.html#visitor'],
      ['Residency by Investment', 'other-services.html#investment']
    ]],
    ['Success Stories', 'success-stories.html', null],
    ['Blog', 'blog.html', null]
  ];

  var CARET = '<svg class="mnav-caret" width="12" height="12" viewBox="0 0 9 9" fill="none"><path d="M1 3L4.5 6.5L8 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  function buildMenu() {
    var html = '';
    MENU.forEach(function (item) {
      var label = esc(item[0]), href = item[1], subs = item[2];
      if (!subs) {
        html += '<div class="mnav-group"><a class="mnav-toplink" href="' + href + '">' + label + '</a></div>';
      } else {
        var subHtml = subs.map(function (s) {
          return '<a href="' + s[1] + '">' + esc(s[0]) + '</a>';
        }).join('');
        html += '<div class="mnav-group">' +
          '<div class="mnav-toplink" data-toggle>' + label + CARET + '</div>' +
          '<div class="mnav-sub"><div>' + subHtml + '</div></div>' +
          '</div>';
      }
    });
    return html;
  }

  function initBar() {
    if (document.getElementById('mbar')) return;
    // the homepage has the form on the page; everywhere else goes to it
    var book = document.getElementById('ctaForm') ? '#contact' : 'index.html#contact';
    var bar = document.createElement('div');
    bar.id = 'mbar';
    bar.innerHTML =
      '<a class="mb-call" href="tel:+96550610991" aria-label="Call Truvia"><svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 4C4 3 5 2 6 2h2l2 5-1.5 1.5S9 10 11 12s3.5 2.5 3.5 2.5L16 13l5 2v2c0 1-1 2-2 2C8 19 1 12 4 4z" stroke="#2F486D" stroke-width="1.6"/></svg>Call</a>' +
      '<a class="mb-wa" href="https://wa.me/96550610991" target="_blank" rel="noopener"><svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M12 .2C5.5.2.2 5.5.2 12c0 2.1.5 4.1 1.6 5.9L.1 24l6.3-1.6c1.7.9 3.7 1.4 5.6 1.4 6.5 0 11.8-5.3 11.8-11.8S18.5.2 12 .2zm5.5 14.2c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 2.4 1 2.9.8 3.4.7.6-.1 1.8-.7 2-1.5.2-.7.2-1.3.2-1.5-.1-.1-.3-.2-.6-.3z"/></svg>WhatsApp</a>' +
      '<a class="mb-book" href="' + book + '">Free Assessment</a>';
    document.body.appendChild(bar);
  }

  function init() {
    initBar();
    var nav = document.getElementById('navbar');
    if (!nav || document.getElementById('mnav-btn')) return;

    // logo source for the drawer header
    var logo = nav.querySelector('img');
    var logoSrc = logo ? logo.getAttribute('src') : 'uploads/truvia-logo.png';

    var btn = document.createElement('button');
    btn.id = 'mnav-btn';
    btn.setAttribute('aria-label', 'Open menu');
    btn.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(btn);

    var overlay = document.createElement('div');
    overlay.id = 'mnav-overlay';
    document.body.appendChild(overlay);

    var drawer = document.createElement('div');
    drawer.id = 'mnav-drawer';
    drawer.innerHTML =
      '<div class="mnav-head">' +
        '<img src="' + logoSrc + '" alt="Truvia Consultants">' +
        '<button class="mnav-close" aria-label="Close menu">&times;</button>' +
      '</div>' +
      '<nav>' + buildMenu() +
        '<div class="mnav-cta">' +
          '<a class="call" href="tel:+96550610991">Call +965 5061 0991</a>' +
          '<a class="book" href="index.html#contact">Free Consultation</a>' +
        '</div>' +
      '</nav>';
    document.body.appendChild(drawer);

    function open() {
      drawer.classList.add('open');
      overlay.classList.add('open');
      btn.classList.add('open');
      document.body.classList.add('mnav-lock');
    }
    function close() {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      btn.classList.remove('open');
      document.body.classList.remove('mnav-lock');
    }

    btn.addEventListener('click', function () {
      drawer.classList.contains('open') ? close() : open();
    });
    overlay.addEventListener('click', close);
    drawer.querySelector('.mnav-close').addEventListener('click', close);

    // accordion toggles
    drawer.querySelectorAll('[data-toggle]').forEach(function (t) {
      t.addEventListener('click', function () {
        t.parentElement.classList.toggle('open');
      });
    });

    // close when a real link is tapped
    drawer.querySelectorAll('a[href]').forEach(function (a) {
      a.addEventListener('click', close);
    });

    // if resized back to desktop, ensure drawer is closed/unlocked
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) close();
    });
  }

  // inject CSS as early as possible to avoid mobile flash
  var style = document.createElement('style');
  style.id = 'mnav-style';
  style.textContent = CSS;
  (document.head || document.documentElement).appendChild(style);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ── Motion failsafe ──────────────────────────────────────────────
   Reveal-on-scroll sections start hidden (opacity:0) and depend on JS
   to become visible. If an IntersectionObserver never fires (some mobile
   browsers, back/forward cache, JS timing), that content would stay blank.
   This net force-reveals anything still hidden shortly after load, so no
   section can ever be stuck invisible. Normal animations are unaffected. */
(function () {
  'use strict';
  function revealAll() {
    // CSS-class based reveals (.reveal / .reveal-left / .reveal-right)
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(function (el) {
      el.classList.add('visible');
    });
    // Inline-style motion engine (elements it tagged but never showed)
    document.querySelectorAll('[data-om-tagged]:not([data-om-shown])').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.setAttribute('data-om-shown', '1');
    });
  }
  function run() { setTimeout(revealAll, 1600); }
  if (document.readyState === 'complete') {
    run();
  } else {
    window.addEventListener('load', run);
    // hard backstop in case load never fires
    setTimeout(revealAll, 4000);
  }
})();
