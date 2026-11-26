// Layout check for the deck, run with ?check (scripts/check-deck.mjs does it headless).
// Measures every rendered line of text in each scene, plus the solid objects (phone, icon
// discs, images), and reports:
//   - two different text blocks whose lines overlap or come closer than 16 px;
//   - two positioned text boxes (absolute elements holding text) that overlap, even if the
//     text inside does not touch today: a wider fallback font or a longer word would collide;
//   - the brand fonts (Sora, Figtree) not loaded, since a fallback font changes every measure;
//   - a scene title that wraps to a second line;
//   - text that overlaps a solid object it does not belong to;
//   - anything that leaves the 1920x1080 frame or sits closer than 24 px to its edge.
// Every element is checked fully visible, which is the last frame of each scene in the video.
(function () {
  if (!new URLSearchParams(location.search).has('check')) return;
  var TOL = 1;      // px of overlap tolerated (antialiasing)
  var EDGE = 24;    // minimum distance from the frame edge
  var GAP = 16;     // minimum air between two text blocks

  function owner(el) {
    return el.closest('text, [data-reveal], h1, h2, h3, p, li, .lb, .total, figcaption') || el;  // each SVG label is its own block
  }
  // the text block a piece of text belongs to: lines of the same paragraph are allowed to be close
  function block(el) { return el.closest('text, p, li, .lb, h1, h2, h3, figcaption, .total') || el; }
  // the unit that enters the screen together (outermost reveal that is not an inline mark or
  // counter): a heading and its description inside one unit are designed to sit close
  function unit(el) {
    var u = el.closest('[data-reveal]');
    while (u && /^(MARK|SPAN)$/.test(u.tagName) && u.parentElement && u.parentElement.closest('[data-reveal]')) u = u.parentElement.closest('[data-reveal]');
    return u || block(el);
  }
  function related(a, b) { return a === b || a.contains(b) || b.contains(a) || block(a) === block(b); }
  // same unit: the 16 px air is not required (heading over its description), but touching still fails
  function sameUnit(a, b) { return unit(a) === unit(b); }
  function hit(a, b, pad) {
    pad = pad || 0;
    var w = Math.min(a.right, b.right) - Math.max(a.left, b.left) + pad;
    var h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) + pad;
    return w > TOL && h > TOL ? Math.round(w - pad) + 'x' + Math.round(h - pad) : null;
  }
  function name(el) {
    return (el.dataset && el.dataset.reveal) || el.getAttribute('class') || el.tagName.toLowerCase();  // className is an object on SVG
  }
  function text(el) { return (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40); }

  function checkScene(scene) {
    var origin = scene.getBoundingClientRect();
    function rel(r) { return { left: r.left - origin.left, right: r.right - origin.left, top: r.top - origin.top, bottom: r.bottom - origin.top }; }
    var lines = [], solids = [], problems = [];

    var walker = document.createTreeWalker(scene, NodeFilter.SHOW_TEXT, {
      // text inside SVG counts too (map labels), except the hidden <symbol> sprites
      acceptNode: function (n) { var p = n.parentElement; return n.nodeValue.trim() && !p.closest('style, script, symbol') && (!p.closest('svg') || p.closest('text')) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; }
    });
    var range = document.createRange();
    for (var n = walker.nextNode(); n; n = walker.nextNode()) {
      range.selectNodeContents(n);
      var o = owner(n.parentElement);
      Array.prototype.forEach.call(range.getClientRects(), function (r) {
        if (r.width > 0 && r.height > 0) lines.push({ r: rel(r), owner: o });
      });
    }
    scene.querySelectorAll('.phone, .ev, img').forEach(function (el) {
      solids.push({ r: rel(el.getBoundingClientRect()), owner: el });
    });

    for (var i = 0; i < lines.length; i++) {
      for (var j = i + 1; j < lines.length; j++) {
        var a = lines[i], b = lines[j];
        if (related(a.owner, b.owner)) continue;
        var near = sameUnit(a.owner, b.owner) ? 0 : GAP;
        var o2 = hit(a.r, b.r, near);
        if (o2) problems.push((near ? 'texto a menos de ' + GAP + ' px de outro (' : 'texto encostado em outro do mesmo bloco (') + o2 + ')' + ': "' + text(a.owner) + '" [' + name(a.owner) + '] x "' + text(b.owner) + '" [' + name(b.owner) + ']');
      }
      solids.forEach(function (s) {
        if (related(lines[i].owner, s.owner)) return;
        var o3 = hit(lines[i].r, s.r);
        if (o3) problems.push('texto sobre objeto ' + o3 + ': "' + text(lines[i].owner) + '" x [' + name(s.owner) + ']');
      });
    }
    // positioned text boxes: leaf absolute elements that hold text
    var boxes = Array.prototype.filter.call(scene.querySelectorAll('*'), function (el) {
      if (el.closest('svg') || getComputedStyle(el).position !== 'absolute' || !el.textContent.trim()) return false;
      return !Array.prototype.some.call(el.querySelectorAll('*'), function (d) { return getComputedStyle(d).position === 'absolute' && d.textContent.trim(); });
    }).map(function (el) { return { r: rel(el.getBoundingClientRect()), owner: el }; });
    for (var p = 0; p < boxes.length; p++) for (var q = p + 1; q < boxes.length; q++) {
      if (related(boxes[p].owner, boxes[q].owner)) continue;
      var o4 = hit(boxes[p].r, boxes[q].r);
      if (o4) problems.push('caixas de texto sobrepostas ' + o4 + ': "' + text(boxes[p].owner) + '" [' + name(boxes[p].owner) + '] x "' + text(boxes[q].owner) + '" [' + name(boxes[q].owner) + ']');
    }
    // every title fits on one line: same place, same weight on every scene
    scene.querySelectorAll('.title').forEach(function (h) {
      var r = document.createRange(); r.selectNodeContents(h);
      var tops = {}; Array.prototype.forEach.call(r.getClientRects(), function (x) { tops[Math.round(x.top)] = 1; });
      if (Object.keys(tops).length > 1) problems.push('título em mais de uma linha: "' + text(h) + '"');
    });
    lines.concat(solids).forEach(function (x) {
      var r = x.r;
      if (r.left < EDGE || r.top < EDGE || r.right > 1920 - EDGE || r.bottom > 1080 - EDGE)
        problems.push('fora da margem de ' + EDGE + ' px: "' + text(x.owner) + '" [' + name(x.owner) + '] em ' + [r.left, r.top, r.right, r.bottom].map(Math.round).join(','));
    });
    // one line per problem, without repeating the same pair for each wrapped line
    return problems.filter(function (p, k) { return problems.indexOf(p) === k; });
  }

  // Ask for the brand faces explicitly: document.fonts.ready alone can resolve before layout
  // has requested any font, and then every measure would be taken with a fallback font.
  Promise.all(['700 30px Sora', '400 30px Figtree'].map(function (f) { return document.fonts.load(f); }))
    .then(function () { return document.fonts.ready; }).then(function () {
    var out = [], fail = 0;
    // document.fonts.check() answers true when a family is not declared at all, so look for a
    // loaded face of each brand family instead.
    ['Sora', 'Figtree'].forEach(function (fam) {
      var ok = false;  // FontFaceSet is set-like, not array-like: iterate with forEach
      document.fonts.forEach(function (f) { if (f.family.replace(/["']/g, '') === fam && f.status === 'loaded') ok = true; });
      if (!ok) { fail++; out.push('fonte não carregada: ' + fam + ' (o navegador usaria uma fonte reserva)'); }
    });
    document.querySelectorAll('.deck section.scene').forEach(function (scene) {
      scene.style.transform = 'none';
      var p = checkScene(scene);
      fail += p.length;
      out.push('cena ' + scene.dataset.scene + ' (' + scene.dataset.label + '): ' + (p.length ? p.length + ' problema(s)' : 'ok'));
      p.forEach(function (x) { out.push('  - ' + x); });
    });
    var pre = document.createElement('pre');
    pre.id = 'layout-report';
    pre.textContent = (fail ? 'LAYOUT FALHOU' : 'LAYOUT OK') + '\n' + out.join('\n');
    document.body.appendChild(pre);
  });
})();
