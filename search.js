/* Site search — client-side, powered by search-index.json.
   Regenerate the index with: python3 build-search-index.py */
(function () {
  var index = null;
  var loading = false;

  var overlay = document.createElement('div');
  overlay.id = 'siteSearchOverlay';
  overlay.setAttribute('hidden', '');
  overlay.innerHTML =
    '<div class="ss-backdrop"></div>' +
    '<div class="ss-panel" role="dialog" aria-modal="true" aria-label="Search this site">' +
      '<div class="ss-inputwrap">' +
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="#9E8548" stroke-width="2"/><path d="M16.5 16.5L21 21" stroke="#9E8548" stroke-width="2" stroke-linecap="round"/></svg>' +
        '<input type="search" id="ssInput" placeholder="Search visas, occupations, training…" autocomplete="off" aria-label="Search">' +
        '<button type="button" id="ssClose" aria-label="Close search">Esc</button>' +
      '</div>' +
      '<div id="ssResults" class="ss-results"></div>' +
    '</div>';

  var styles = document.createElement('style');
  styles.textContent =
    '#siteSearchOverlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:flex-start;justify-content:center;}' +
    '#siteSearchOverlay[hidden]{display:none;}' +
    '.ss-backdrop{position:absolute;inset:0;background:rgba(6,13,26,0.62);backdrop-filter:blur(4px);}' +
    '.ss-panel{position:relative;width:min(640px,92vw);margin-top:12vh;background:#fff;border-radius:16px;box-shadow:0 24px 70px rgba(6,13,26,0.4);overflow:hidden;}' +
    '.ss-inputwrap{display:flex;align-items:center;gap:12px;padding:16px 18px;border-bottom:1px solid #E2DDD9;}' +
    '#ssInput{flex:1;border:none;outline:none;font-family:Inter,system-ui,sans-serif;font-size:16px;color:#1C2B3A;background:none;}' +
    '#ssClose{border:1px solid #E2DDD9;background:#F7F5F2;color:#6B7A8D;font-family:Inter,system-ui,sans-serif;font-size:11px;font-weight:600;padding:5px 9px;border-radius:6px;cursor:pointer;}' +
    '.ss-results{max-height:56vh;overflow-y:auto;}' +
    '.ss-item{display:block;padding:14px 18px;text-decoration:none;border-bottom:1px solid #F0EDEA;}' +
    '.ss-item:hover,.ss-item:focus{background:#F7F5F2;outline:none;}' +
    '.ss-item-top{display:flex;align-items:baseline;gap:10px;}' +
    '.ss-title{font-family:Manrope,system-ui,sans-serif;font-weight:700;font-size:15px;color:#1C2B3A;}' +
    '.ss-section{font-family:Inter,system-ui,sans-serif;font-size:10px;font-weight:700;color:#9E8548;text-transform:uppercase;letter-spacing:0.08em;}' +
    '.ss-snippet{font-family:Inter,system-ui,sans-serif;font-size:13px;color:#6B7A8D;line-height:1.6;margin-top:4px;}' +
    '.ss-snippet mark{background:rgba(158,133,72,0.22);color:#1C2B3A;padding:0 2px;border-radius:2px;}' +
    '.ss-empty{padding:28px 18px;text-align:center;font-family:Inter,system-ui,sans-serif;font-size:14px;color:#6B7A8D;}' +
    '.ss-trigger{background:none;border:none;cursor:pointer;padding:7px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;transition:background 0.2s;}' +
    '.ss-trigger:hover{background:rgba(47,72,109,0.08);}' +
    '@media(max-width:860px){.ss-panel{margin-top:6vh;}}';

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function snippet(entry, query) {
    var haystack = entry.description || entry.body || '';
    var pos = haystack.toLowerCase().indexOf(query.toLowerCase());
    var text;
    if (pos === -1) {
      text = haystack.slice(0, 150);
    } else {
      var start = Math.max(0, pos - 55);
      text = (start > 0 ? '…' : '') + haystack.slice(start, start + 165);
    }
    var safe = escapeHtml(text.trim());
    var terms = query.trim().split(/\s+/).filter(Boolean).map(function (t) {
      return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    });
    if (terms.length) {
      safe = safe.replace(new RegExp('(' + terms.join('|') + ')', 'gi'), '<mark>$1</mark>');
    }
    return safe + (text.length >= 150 ? '…' : '');
  }

  function score(entry, query) {
    var q = query.toLowerCase();
    var total = 0;
    if (entry.title.toLowerCase().indexOf(q) !== -1) total += 100;
    if ((entry.description || '').toLowerCase().indexOf(q) !== -1) total += 40;
    for (var i = 0; i < entry.headings.length; i++) {
      if (entry.headings[i].toLowerCase().indexOf(q) !== -1) { total += 25; break; }
    }
    if ((entry.body || '').toLowerCase().indexOf(q) !== -1) total += 10;
    // Also credit individual words so multi-word queries still match
    var words = q.split(/\s+/).filter(function (w) { return w.length > 2; });
    for (var w = 0; w < words.length; w++) {
      if (entry.title.toLowerCase().indexOf(words[w]) !== -1) total += 12;
      if ((entry.body || '').toLowerCase().indexOf(words[w]) !== -1) total += 3;
    }
    return total;
  }

  function render(query) {
    var box = document.getElementById('ssResults');
    if (!query.trim()) { box.innerHTML = ''; return; }
    if (!index) { box.innerHTML = '<div class="ss-empty">Loading…</div>'; return; }

    var hits = index
      .map(function (e) { return { e: e, s: score(e, query) }; })
      .filter(function (r) { return r.s > 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .slice(0, 8);

    if (!hits.length) {
      box.innerHTML = '<div class="ss-empty">No results for “' + escapeHtml(query) + '”.<br>Try “189”, “nurse”, “points”, or “IELTS”.</div>';
      return;
    }

    box.innerHTML = hits.map(function (r) {
      return '<a class="ss-item" href="' + r.e.url + '">' +
        '<div class="ss-item-top"><span class="ss-title">' + escapeHtml(r.e.title) + '</span>' +
        '<span class="ss-section">' + escapeHtml(r.e.section) + '</span></div>' +
        '<div class="ss-snippet">' + snippet(r.e, query) + '</div></a>';
    }).join('');
  }

  function loadIndex() {
    if (index || loading) return;
    loading = true;
    fetch('search-index.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        index = data;
        loading = false;
        var input = document.getElementById('ssInput');
        if (input && input.value) render(input.value);
      })
      .catch(function () {
        loading = false;
        document.getElementById('ssResults').innerHTML =
          '<div class="ss-empty">Search is unavailable right now.</div>';
      });
  }

  function open() {
    overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    loadIndex();
    setTimeout(function () { document.getElementById('ssInput').focus(); }, 20);
  }

  function close() {
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
    document.getElementById('ssInput').value = '';
    document.getElementById('ssResults').innerHTML = '';
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.head.appendChild(styles);
    document.body.appendChild(overlay);

    overlay.querySelector('.ss-backdrop').addEventListener('click', close);
    document.getElementById('ssClose').addEventListener('click', close);
    document.getElementById('ssInput').addEventListener('input', function (e) {
      render(e.target.value);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !overlay.hasAttribute('hidden')) close();
      // Cmd/Ctrl+K opens search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        overlay.hasAttribute('hidden') ? open() : close();
      }
    });

    var triggers = document.querySelectorAll('[data-site-search]');
    for (var i = 0; i < triggers.length; i++) {
      triggers[i].addEventListener('click', function (e) { e.preventDefault(); open(); });
    }
  });
})();
