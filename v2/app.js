/* Truvia v2 — page behaviour. Vanilla, no dependencies. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* Hero intro: start once fonts are in so the mask reveal doesn't jump. */
  function ready() { document.documentElement.classList.add('is-ready'); }
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(ready); setTimeout(ready, 900); } else { ready(); }

  /* Header border on scroll */
  var header = $('#header');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Mobile menu */
  var menuBtn = $('#menuBtn'), menu = $('#mobileMenu');
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });

  /* Ticker: duplicate content so the loop is seamless */
  var ticker = $('#ticker');
  if (ticker) ticker.innerHTML += ticker.innerHTML;

  /* In-view reveals */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  $$('.io').forEach(function (el) { io.observe(el); });

  /* Process rail: gold line fills with scroll, active step drives the sticky counter */
  var rail = $('#rail'), steps = $$('.step', rail);
  var stepNum = $('#stepNum'), stepTitle = $('#stepTitle'), stepNote = $('#stepNote');
  function updateRail() {
    var r = rail.getBoundingClientRect();
    var focus = window.innerHeight * 0.55;
    var p = Math.max(0, Math.min(1, (focus - r.top) / r.height));
    rail.style.setProperty('--progress', (p * 100).toFixed(1) + '%');
    var active = 0;
    steps.forEach(function (s, i) { if (s.getBoundingClientRect().top < focus) active = i; });
    steps.forEach(function (s, i) { s.classList.toggle('is-active', i === active); });
    var cur = steps[active];
    if (stepNum && cur && stepNum.textContent !== cur.querySelector('.num').textContent) {
      stepNum.textContent = cur.querySelector('.num').textContent;
      stepTitle.textContent = cur.dataset.title;
      stepNote.textContent = cur.dataset.note;
    }
  }
  window.addEventListener('scroll', updateRail, { passive: true });
  window.addEventListener('resize', updateRail); updateRail();

  /* Points estimator */
  var calc = $('#calc'), scoreEl = $('#score'), verdict = $('#verdict'), note = $('#verdictNote'), bars = $('#bars');
  var CATS = [['age', 'Age', 30], ['english', 'English', 20], ['experience', 'Experience', 15], ['education', 'Qualification', 20], ['partner', 'Partner', 10], ['nomination', 'Nomination', 15]];
  var shown = 0, raf;
  function tween(to) {
    cancelAnimationFrame(raf);
    if (reduce) { scoreEl.textContent = to; shown = to; return; }
    var from = shown, t0 = performance.now(), dur = 600;
    (function frame(t) {
      var k = Math.min(1, (t - t0) / dur); k = 1 - Math.pow(1 - k, 3);
      shown = Math.round(from + (to - from) * k); scoreEl.textContent = shown;
      if (k < 1) raf = requestAnimationFrame(frame);
    })(t0);
  }
  function score() {
    var total = 0, vals = {};
    CATS.forEach(function (c) { var v = +calc.elements[c[0]].value; vals[c[0]] = v; total += v; });
    tween(total);
    bars.innerHTML = CATS.map(function (c) {
      return '<div class="bar"><span>' + c[1] + '</span><i><b style="width:' + (vals[c[0]] / c[2] * 100) + '%"></b></i><em>' + vals[c[0]] + '</em></div>';
    }).join('');
    var nom = vals.nomination, eng = vals.english;
    var tips = [];
    if (eng < 20) tips.push('Superior English would add ' + (20 - eng) + ' points');
    if (nom === 0) tips.push('state nomination adds 5, regional adds 15');
    var tip = tips.length ? tips.join('; ') + '.' : 'You are at the top of the points table.';
    tip = tip.charAt(0).toUpperCase() + tip.slice(1);
    verdict.classList.toggle('ok', total >= 65);
    if (total < 65) { verdict.textContent = 'Below the 65-point threshold, for now.'; note.textContent = 'You cannot lodge an EOI at this score. ' + tip + ' We map the fastest way up in a free consultation.'; }
    else if (total < 80) { verdict.textContent = 'Eligible to lodge an Expression of Interest.'; note.textContent = 'Competitive for Subclass 190 or 491 in several states; 189 invitations usually go higher. ' + tip; }
    else { verdict.textContent = 'A competitive score across 189, 190 and 491.'; note.textContent = 'Occupation ceilings and state rounds still decide timing. ' + tip; }
  }
  calc.addEventListener('change', score); score();

  /* Pathways: image follows the hovered or focused row on desktop */
  var pathImgs = $$('.path-visual img'), pathCap = $('#pathCap');
  function showPath(a) {
    pathImgs.forEach(function (img) { img.classList.toggle('on', img.dataset.for === a.dataset.img); });
    if (pathCap) pathCap.textContent = a.dataset.cap;
  }
  $$('.path').forEach(function (a) { a.addEventListener('mouseenter', function () { showPath(a); }); a.addEventListener('focus', function () { showPath(a); }); });

  /* Photo band parallax (transform only, cheap) */
  var band = $('#band'), bandImg = band && band.querySelector('img');
  function parallax() {
    if (reduce || !band) return;
    var r = band.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    var p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
    bandImg.style.transform = 'translateY(' + (p * -40).toFixed(1) + 'px)';
  }
  window.addEventListener('scroll', parallax, { passive: true }); parallax();

  /* Stories carousel */
  var track = $('#storyTrack');
  function slide(dir) {
    var w = track.querySelector('.story').getBoundingClientRect().width + 16;
    track.scrollBy({ left: dir * w, behavior: reduce ? 'auto' : 'smooth' });
  }
  $('#storyPrev').addEventListener('click', function () { slide(-1); });
  $('#storyNext').addEventListener('click', function () { slide(1); });

  /* FAQ accordion */
  $$('.q').forEach(function (q) {
    q.querySelector('button').addEventListener('click', function () {
      var open = q.getAttribute('aria-expanded') === 'true';
      $$('.q').forEach(function (o) { o.setAttribute('aria-expanded', 'false'); });
      q.setAttribute('aria-expanded', String(!open));
    });
  });

  /* Lead form: async submit with inline status */
  var form = $('#leadForm'), status = $('#formStatus'), submitBtn = $('#submitBtn');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.classList.add('was-validated');
    if (!form.checkValidity()) { status.className = 'status err'; status.textContent = 'Please complete the highlighted fields.'; return; }
    submitBtn.disabled = true; status.className = 'status'; status.textContent = 'Sending…';
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d.success) { status.className = 'status ok'; status.textContent = 'Received. A consultant will reply on WhatsApp or email within 24 hours.'; form.reset(); form.classList.remove('was-validated'); }
        else { throw new Error(d.message || 'failed'); }
      })
      .catch(function () { status.className = 'status err'; status.textContent = 'Could not send. WhatsApp us on +965 5061 0991 and we will take it from there.'; })
      .then(function () { submitBtn.disabled = false; });
  });

  $('#year').textContent = new Date().getFullYear();
})();
