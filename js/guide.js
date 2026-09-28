/* F.T.T.U Marketing Playbook — renders guide.html from js/data.js and js/catalog.js. */
(function () {
  var F = window.FTTU, M = window.FTTU_MKT;
  if (!F || !M) return;
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function onActivate(el, fn) {
    el.addEventListener('click', fn);
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } });
  }
  var FITLABEL = { yes: 'Ready', maybe: 'With care', no: 'Not yet' };
  function designs(key) { var l = F.inCategory(key); return l.length ? l : F.inCategory('sneakers'); }
  function shots(key) {
    return designs(key).map(function (d) { return { src: d.image, title: d.name, caption: d.colorwayLabel + ' colorway \u2014 AI concept render', alt: d.name + ', AI concept render' }; });
  }
  /* the best way to start for a product: the first way marked ready, else with care */
  function bestWay(p) {
    var keys = ['organic', 'presale', 'paid'];
    var k = keys.filter(function (x) { return p.fit[x][0] === 'yes'; })[0] || keys.filter(function (x) { return p.fit[x][0] === 'maybe'; })[0] || 'organic';
    return M.route(k);
  }

  /* hero + DIY */
  $('heroImg').src = designs('sneakers')[0].image;
  onActivate($('heroFig'), function () { Lightbox.open(shots('sneakers'), 0); });
  $('diyText').textContent = M.DIY;

  /* where every product stands */
  $('ladderKey').innerHTML = M.LADDER.map(function (r, i) {
    return '<li><b><span class="n">' + (i + 1) + '</span>' + esc(r.label) + '</b><span>' + esc(r.means) + '</span></li>';
  }).join('');
  var boardOrder = M.PRODUCTS.map(function (p, i) { return i; }).sort(function (a, b) {
    var ha = M.PRODUCTS[a].signal.indexOf('None') !== 0, hb = M.PRODUCTS[b].signal.indexOf('None') !== 0;
    return ha === hb ? a - b : (ha ? -1 : 1);
  });
  $('board').innerHTML = boardOrder.map(function (idx) {
    var p = M.PRODUCTS[idx];
    var at = M.rung(p.stage), d = designs(p.key), way = bestWay(p), hot = p.signal.indexOf('None') !== 0;
    var bar = M.LADDER.map(function (r, i) { return '<i class="' + (i < at ? 'done' : i === at ? 'now' : '') + '" title="' + esc(r.label) + '"></i>'; }).join('');
    return '<article class="stand' + (hot ? ' hot' : '') + '">' +
      '<div class="stand-shots"><button class="stand-shot" type="button" data-i="' + idx + '" aria-label="View the ' + esc(p.label.toLowerCase()) + ' colorways full screen"><img src="' + esc(d[0].image) + '" alt="" width="1264" height="848" loading="lazy" decoding="async"></button>' +
      (hot ? '<button class="stand-shot bd" type="button" data-i="' + idx + '" data-bd="1" aria-label="View the ' + esc(p.label.toLowerCase()) + ' taken apart, full screen"><img src="' + esc(p.breakdown) + '" alt="" width="1264" height="847" loading="lazy" decoding="async"></button>' : '') + '</div>' +
      '<div class="stand-body"><div class="stand-top"><h3>' + esc(p.label) + '</h3><span class="stand-stage">' + esc(M.LADDER[at].label) + '</span></div>' +
      '<div class="stand-bar" role="img" aria-label="Rung ' + (at + 1) + ' of ' + M.LADDER.length + ': ' + esc(M.LADDER[at].label) + '">' + bar + '</div>' +
      '<dl class="stand-facts">' +
        '<div><dt>Demand so far</dt><dd>' + esc(p.signal) + '</dd></div>' +
        '<div><dt>Fastest to make</dt><dd>' + esc(p.makeable) + '</dd></div>' +
        '<div><dt>Start with</dt><dd><strong>' + esc(way.name) + '.</strong> ' + esc(p.fit[way.key][1]) + '</dd></div>' +
        '<div><dt>Colorways</dt><dd>' + d.length + ' \u00b7 plus a taken-apart view</dd></div>' +
      '</dl></div></article>';
  }).join('');
  $('board').addEventListener('click', function (e) {
    var b = e.target.closest('.stand-shot'); if (!b) return;
    var p = M.PRODUCTS[+b.dataset.i], list = shots(p.key);
    list.push({ src: p.breakdown, title: 'F.T.T.U ' + p.label + ' \u2014 taken apart', caption: 'AI concept render', alt: 'Exploded view of the F.T.T.U ' + p.label.toLowerCase() + ', AI concept render' });
    Lightbox.open(list, b.dataset.bd ? list.length - 1 : 0);
  });

  /* the three ways, 5 W's each */
  $('ways').innerHTML = M.ROUTES.map(function (r, i) {
    var links = r.partners.map(M.partner).map(function (p) { return '<a href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.name) + '</a>'; }).join('');
    return '<article class="way"><span class="way-num">Way ' + (i + 1) + '</span><h3>' + esc(r.name) + '</h3><p class="one">' + esc(r.oneLine) + '</p><dl class="ws5">' +
      '<div><dt>Who</dt><dd>' + esc(r.w.who) + '</dd></div>' +
      '<div><dt>What</dt><dd>' + esc(r.w.what) + '</dd></div>' +
      '<div><dt>When</dt><dd>' + esc(r.w.when) + '</dd></div>' +
      '<div><dt>Where</dt><dd>' + esc(r.w.where) + '</dd></div>' +
      '<div><dt>Why</dt><dd>' + esc(r.w.why) + '</dd></div>' +
      '<div class="money"><dt>The money</dt><dd>' + esc(r.money) + '</dd></div>' +
      '<div class="catch"><dt>The catch</dt><dd>' + esc(r.catch) + '</dd></div>' +
      '</dl><div class="way-links">' + links + '</div></article>';
  }).join('');

  /* side-by-side glance */
  var rows = [['Up front', 'upfront'], ['Speed', 'speed'], ['What it proves', 'proves'], ['Risk', 'risk']];
  $('glance').innerHTML = '<thead><tr><th scope="col"><span class="sr-only">Way</span></th>' + rows.map(function (r) { return '<th scope="col">' + esc(r[0]) + '</th>'; }).join('') + '</tr></thead><tbody>' +
    M.ROUTES.map(function (r) {
      return '<tr><th scope="row">' + esc(r.short) + '</th>' + rows.map(function (c) { return '<td data-l="' + esc(c[0]) + '">' + esc(r[c[1]]) + '</td>'; }).join('') + '</tr>';
    }).join('') + '</tbody>';

  /* every product, three ways */
  $('matrix').innerHTML = '<thead><tr><th scope="col">Product</th>' + M.ROUTES.map(function (r) { return '<th scope="col">' + esc(r.short) + '</th>'; }).join('') + '</tr></thead><tbody>' +
    M.PRODUCTS.map(function (p) {
      return '<tr><th scope="row">' + esc(p.label) + '</th>' + M.ROUTES.map(function (r) {
        var f = p.fit[r.key];
        return '<td data-l="' + esc(r.short) + '"><span class="fitb ' + f[0] + '">' + FITLABEL[f[0]] + '</span><span class="fit-text">' + esc(f[1]) + '</span></td>';
      }).join('') + '</tr>';
    }).join('') + '</tbody>';

  /* story explorer */
  var current = 0, tabs = $('tabs');
  tabs.innerHTML = M.PRODUCTS.map(function (p, i) {
    return '<button class="tab" type="button" role="tab" id="tab-' + p.key + '" aria-controls="explorer" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '" data-i="' + i + '">' + esc(p.label) + '</button>';
  }).join('');
  function showStory(i, focus) {
    current = i;
    var p = M.PRODUCTS[i], btns = tabs.querySelectorAll('.tab'), d = designs(p.key)[0];
    for (var k = 0; k < btns.length; k++) { btns[k].setAttribute('aria-selected', String(k === i)); btns[k].tabIndex = k === i ? 0 : -1; }
    if (focus) btns[i].focus();
    $('explorer').setAttribute('aria-labelledby', 'tab-' + p.key);
    $('storyImg').src = d.image; $('storyImg').alt = d.name + ', AI concept render';
    var n = designs(p.key).length;
    $('storyCap').textContent = n > 1 ? 'The ' + p.label.toLowerCase() + ', ' + n + ' colorways' : 'The ' + p.label.toLowerCase();
    $('storyTitle').textContent = p.label + ' \u2014 ' + M.LADDER[M.rung(p.stage)].label.toLowerCase();
    $('storyAngle').textContent = p.angle;
    $('storyFacts').innerHTML =
      '<div><dt>Who it\u2019s for</dt><dd>' + esc(p.audience) + '</dd></div>' +
      '<div><dt>Demand so far</dt><dd>' + esc(p.signal) + '</dd></div>' +
      '<div><dt>Fastest to make</dt><dd>' + esc(p.makeable) + '</dd></div>';
    $('fitStrip').innerHTML = M.ROUTES.map(function (r) {
      var f = p.fit[r.key];
      return '<div><b>' + esc(r.short) + '</b><span class="fitb ' + f[0] + '">' + FITLABEL[f[0]] + '</span><span class="fit-text">' + esc(f[1]) + '</span></div>';
    }).join('');
    $('storyIdeas').innerHTML = p.ideas.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
    $('storyFlags').innerHTML = M.RULES.filter(function (r) { return r.applies !== 'all' && r.applies.indexOf(p.key) > -1; }).map(function (r) { return '<p class="flag"><strong>' + esc(r.title) + '.</strong> ' + esc(r.body) + '</p>'; }).join('');
  }
  tabs.addEventListener('click', function (e) { var b = e.target.closest('.tab'); if (b) showStory(+b.dataset.i); });
  tabs.addEventListener('keydown', function (e) {
    var n = M.PRODUCTS.length;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); showStory((current + 1) % n, true); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); showStory((current - 1 + n) % n, true); }
    else if (e.key === 'Home') { e.preventDefault(); showStory(0, true); }
    else if (e.key === 'End') { e.preventDefault(); showStory(n - 1, true); }
  });
  onActivate($('storyFig'), function () {
    var p = M.PRODUCTS[current], list = shots(p.key);
    list.push({ src: p.breakdown, title: 'F.T.T.U ' + p.label + ' \u2014 taken apart', caption: 'AI concept render', alt: 'Exploded view of the F.T.T.U ' + p.label.toLowerCase() + ', AI concept render' });
    Lightbox.open(list, 0);
  });
  showStory(0);

  /* helpers */
  $('helpers').innerHTML = M.PARTNERS.filter(function (p) { return p.route === 'help'; }).map(function (p) {
    return '<article class="partner"><h4><a href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.name) + '</a></h4><p>' + esc(p.what) + '</p>' +
      '<p class="ok"><strong>Confirmed:</strong> ' + esc(p.checked) + '</p><p class="unk"><strong>Not confirmed:</strong> ' + esc(p.caveat) + '</p></article>';
  }).join('');

  /* path */
  $('stageList').innerHTML = M.STAGES.map(function (s) {
    return '<li class="stage"><h3>' + esc(s.title) + '</h3><p class="st-route">' + esc(M.route(s.route).short) + '</p><p>' + esc(s.body) + '</p></li>';
  }).join('');

  /* rules */
  $('ruleList').innerHTML = M.RULES.map(function (r) { return '<article class="rule' + (r.key === 'eyes' ? ' lead' : '') + '"><h3>' + esc(r.title) + '</h3><p>' + esc(r.body) + '</p></article>'; }).join('');

  /* reads */
  $('readList').innerHTML = M.READS.map(function (v, i) {
    return '<li class="video' + (i === 0 ? ' lead' : '') + '"><a href="' + esc(v.url) + '" target="_blank" rel="noopener"><span class="play doc" aria-hidden="true"></span><div><h3>' + esc(v.title) + '</h3><span class="who">' + esc(v.who) + ' \u2014 ' + esc(M.route(v.route).short) + ' way</span><p>' + esc(v.why) + '</p></div></a></li>';
  }).join('');
})();
