/* Truvia shared motion engine — restores the cursor-reactive 3D card tilt +
   glow hover motion that the split pages lost. Focused & additive: it only
   adds hover motion (tilt, glow, button magnetism, gold shimmer) and never
   hides content, touches scroll reveals, counters, or existing cursor glows.
   Self-initializing, idempotent, and guarded per element. */
(function () {
  if (window.__truviaTilt) return;
  window.__truviaTilt = true;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function injectCSS() {
    if (document.getElementById('om-tilt-css')) return;
    var s = document.createElement('style');
    s.id = 'om-tilt-css';
    s.textContent = [
      '@keyframes omShimmer{0%{transform:translateX(-100%) skewX(-20deg);}100%{transform:translateX(400%) skewX(-20deg);}}',
      '.om-btn-gold{position:relative;overflow:hidden;}',
      '.om-btn-gold::after{content:"";position:absolute;top:0;left:0;width:35%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent);transform:translateX(-120%) skewX(-20deg);pointer-events:none;}',
      '.om-btn-gold:hover::after{animation:omShimmer 0.7s ease forwards;}'
    ].join('\n');
    (document.head || document.documentElement).appendChild(s);
  }

  // Skip cards that already run their own transform animation (floating hero cards)
  // or that another engine already wired with a glow overlay (avoid double-binding).
  function isAnimated(card) {
    var st = card.getAttribute('style') || '';
    if (/animation\s*:/i.test(st) || card.hasAttribute('data-om-tilt') || card.hasAttribute('data-om-tagged-anim')) return true;
    var fc = card.firstElementChild;
    if (fc && fc.style && fc.style.pointerEvents === 'none' && (fc.style.position === 'absolute' || getComputedStyle(fc).position === 'absolute')) return true;
    return false;
  }

  function addCardTilt(cards, opts) {
    opts = opts || {};
    cards.forEach(function (card) {
      if (isAnimated(card)) return;
      card.setAttribute('data-om-tilt', '1');
      var mo = card.getAttribute('onmouseover') || '';
      if (mo.indexOf('translateY') !== -1) { card.removeAttribute('onmouseover'); card.removeAttribute('onmouseout'); }
      var gl = document.createElement('div');
      gl.style.cssText = 'position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity 0.4s;z-index:1;';
      if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
      card.insertBefore(gl, card.firstChild);
      var t = opts.maxTilt || 6, gc = opts.glow || 'rgba(158,133,72,0.12)';
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var cx = (e.clientX - r.left) / r.width, cy = (e.clientY - r.top) / r.height;
        var rx = (cy - 0.5) * -t, ry = (cx - 0.5) * t;
        card.style.transition = 'transform 0.1s linear,box-shadow 0.1s linear';
        card.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateZ(10px)';
        card.style.boxShadow = '0 24px 56px rgba(0,0,0,0.2),0 8px 20px rgba(0,0,0,0.1)';
        gl.style.background = 'radial-gradient(circle at ' + (cx * 100).toFixed(1) + '% ' + (cy * 100).toFixed(1) + '%,' + gc + ' 0%,transparent 55%)';
        gl.style.opacity = '1';
      }, { passive: true });
      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform 0.7s cubic-bezier(.16,1,.3,1),box-shadow 0.7s cubic-bezier(.16,1,.3,1)';
        card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateZ(0)';
        card.style.boxShadow = ''; gl.style.opacity = '0';
      });
    });
  }

  function run() {
    injectCSS();

    // The DC runtime re-serialises inline styles (e.g. "border-radius: 16px"),
    // so attribute-substring selectors are unreliable. Gather candidates and
    // filter in JS with a whitespace-tolerant regex, bucketing by radius.
    var candidates = Array.prototype.slice.call(document.querySelectorAll('section *'));
    var buckets = { big: [], mid: [], small: [] };
    candidates.forEach(function (el) {
      var s = el.getAttribute('style') || '';
      if (!/padding\s*:/.test(s)) return;
      var m = s.match(/border-radius\s*:\s*(\d+)px/);
      if (!m) return;
      var r = parseInt(m[1], 10);
      if (r < 12 || r > 24) return;            // skip pills, chips, tiny/huge radii
      if (el.querySelector('section')) return; // don't tilt whole sections
      if (r >= 19) buckets.big.push(el);
      else if (r >= 15) buckets.mid.push(el);
      else buckets.small.push(el);
    });
    addCardTilt(buckets.big, { maxTilt: 7, glow: 'rgba(158,133,72,0.12)' });
    addCardTilt(buckets.mid, { maxTilt: 6, glow: 'rgba(158,133,72,0.11)' });
    addCardTilt(buckets.small, { maxTilt: 5, glow: 'rgba(47,72,109,0.1)' });

    // Magnetic buttons
    document.querySelectorAll('.btn-primary, .btn-gold, .btn-outline, a[class*="btn"]').forEach(function (btn) {
      if (btn.getAttribute('data-om-mag')) return;
      btn.setAttribute('data-om-mag', '1');
      var base = btn.style.transition || '';
      btn.style.transition = (base ? base + ',' : '') + 'transform .3s cubic-bezier(.16,1,.3,1)';
      btn.addEventListener('mousemove', function (e) { var r = btn.getBoundingClientRect(); btn.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.2) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.3) + 'px)'; });
      btn.addEventListener('mouseleave', function () { btn.style.transform = 'translate(0,0)'; });
    });

    // Gold shimmer sweep on CTA-style buttons
    document.querySelectorAll('section a, section button').forEach(function (btn) {
      var s = btn.getAttribute('style') || '';
      var c = btn.className || '';
      if (s.indexOf('#9E8548') !== -1 || s.indexOf('#2F486D') !== -1 || s.indexOf('#C09040') !== -1 || c.indexOf('btn-gold') !== -1 || c.indexOf('btn-primary') !== -1) btn.classList.add('om-btn-gold');
    });
  }

  function boot() {
    if (reduce) return;
    var tries = 0;
    (function wait() {
      if (document.querySelector('section [style*="border-radius"]')) { setTimeout(run, 140); return; }
      if (tries++ > 140) return; // ~4.5s cap
      requestAnimationFrame(wait);
    })();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
