/* F.T.T.U Marketing Agent — behavior.
   One agent, one conversation kept in sessionStorage. Replies come from
   /api/chat (Claude, key held server-side). Each reply ends with a MATCH line;
   the three cards fill from js/data.js and js/catalog.js using its keys. */
(function () {
  var F = window.FTTU, M = window.FTTU_MKT;
  if (!F || !M) return;
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var KEY = 'fttu-mkt-agent-v1';
  var INTRO = 'I\u2019m your marketing agent. Tell me which F.T.T.U product you want out in the world \u2014 or just what you\u2019re hoping for \u2014 and I\u2019ll show you where it stands, then look at it three ways: organic, pre-sale and paid. You\u2019ll get who, what, when, where, why and the money for each, then my pick. I can also write posts, captions and emails for you to copy.';
  var FITLABEL = { yes: 'Ready', maybe: 'With care', no: 'Not yet' };

  var state = load();
  function load() {
    try { var s = JSON.parse(sessionStorage.getItem(KEY)); if (s && s.thread) return s; } catch (e) {}
    return { thread: [], match: null, viewRoute: null, view: 'design' };
  }
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  /* ───────── system prompt, built from the playbook's own data ───────── */
  function dataBlock() {
    var L = [];
    L.push('CATALOG (all images are AI concept renders; nothing exists physically yet):');
    F.CATEGORIES.forEach(function (c) { L.push('- ' + c.key + ' (' + c.label + '): colorways ' + F.inCategory(c.key).map(function (d) { return d.colorwayLabel; }).join(', ')); });
    L.push('', 'CAN THE FOUNDER MARKET SOMETHING THAT DOESN\u2019T EXIST YET: ' + M.DIY);
    L.push('', 'THE LADDER (where a product stands, in order):');
    M.LADDER.forEach(function (r, i) { L.push((i + 1) + '. ' + r.key + ' (' + r.label + '): ' + r.means); });
    L.push('', 'THE THREE WAYS (key | name | up front | speed | what it proves | risk | who | what | when | where | why | money | catch):');
    M.ROUTES.forEach(function (r) {
      L.push('- ' + r.key + ' | ' + r.name + ' | ' + r.upfront + ' | ' + r.speed + ' | ' + r.proves + ' | ' + r.risk + ' | WHO: ' + r.w.who + ' | WHAT: ' + r.w.what + ' | WHEN: ' + r.w.when + ' | WHERE: ' + r.w.where + ' | WHY: ' + r.w.why + ' | MONEY: ' + r.money + ' | CATCH: ' + r.catch);
    });
    L.push('', 'PRODUCTS (key | where it stands | angle | audience | demand so far | fastest way to make it | fit each way [yes/maybe/no] | post ideas):');
    M.PRODUCTS.forEach(function (p) {
      L.push('- ' + p.key + ' | ' + p.stage + ' | ' + p.angle + ' | ' + p.audience + ' | ' + p.signal + ' | ' + p.makeable +
        ' | organic: ' + p.fit.organic[0] + ' \u2014 ' + p.fit.organic[1] + ' | presale: ' + p.fit.presale[0] + ' \u2014 ' + p.fit.presale[1] + ' | paid: ' + p.fit.paid[0] + ' \u2014 ' + p.fit.paid[1] +
        ' | ideas: ' + p.ideas.join(' / '));
    });
    L.push('', 'CHANNELS AND HELPERS (key | name | way | what | confirmed | NOT confirmed | url):');
    M.PARTNERS.forEach(function (p) { L.push('- ' + p.key + ' | ' + p.name + ' | ' + p.route + ' | ' + p.what + ' | ' + p.checked + ' | ' + p.caveat + ' | ' + p.url); });
    L.push('', 'RULES:');
    M.RULES.forEach(function (r) { L.push('- ' + r.title + ': ' + r.body + ' (applies to: ' + (r.applies === 'all' ? 'everything' : r.applies.join(', ')) + ')'); });
    L.push('', 'RECOMMENDED PATH:');
    M.STAGES.forEach(function (s, i) { L.push((i + 1) + '. ' + s.title + ' \u2014 ' + s.body); });
    L.push('', 'Channel facts were checked in ' + M.CHECKED + '.');
    return L.join('\n');
  }
  function systemPrompt() {
    return [
      'You are the F.T.T.U Marketing Agent, working for the founder and owner of F.T.T.U ("From Them To Us"), a footwear line that will grow into clothing and accessories. The founder is a solo junior developer with a small budget who designed the line with AI; F.T.T.U grew out of a directory of Black-owned banks and farms and was started so everyone can wear it, with nothing borrowed from anyone. Your only job is getting products seen and sold: where each product stands, who it is for, which channel, what to post, when, and what it costs. Manufacturing is handled by a separate manufacturing agent; if asked how to make something, say so in one line and name the product and way you would hand to it.',
      'Always start from where the product stands on the ladder. Every product is at "concept" unless the founder tells you otherwise; if they report progress (people tested it, signups, orders), use it and move the product up. Then think through all three ways \u2014 organic, presale and paid \u2014 and say in one short line each how that product looks that way (use its fit lines). Recommend ONE way and say why, with the money involved and one concrete next step. Never recommend presale or paid for a product whose fit for that way is "no".',
      'Use ONLY the DATA below. Never invent channels, prices, follower counts, conversion rates, statistics or results. If something is not in DATA, say you don\u2019t know it and how the founder could find out.',
      'If the request is too vague to recommend well, ask ONE short, specific question and stop. Never ask more than one question in a reply.',
      'Write plainly, like explaining to a smart friend who is new to marketing: short sentences, short paragraphs, "- " bullets when listing, **bold** sparingly, no headings, no tables, no jargon without a quick explanation. Keep replies under about 200 words unless writing a draft. Keep the founder\u2019s passion; don\u2019t make it corporate.',
      'When you write something the founder will publish or send (a post, a caption, an email, a waitlist blurb, a note to a creator), put exactly that text inside a ``` fenced block so it can be copied. Every draft must: call the designs concepts, never claim sales, customers, reviews or stock that don\u2019t exist, never invent quotes, and include "#ad" or a plain family/friend disclosure when someone connected to the founder would post it. Sign emails "[Your name], Founder, F.T.T.U".',
      'Remind the founder to show any post or ad to many eyes before it goes out. Mention the children\u2019s rules for kids and baby shoes, and the permission rule for the jacket photos, whenever those come up.',
      'Readiness is your 0\u2013100 estimate of how ready this product is to launch the recommended way, based on where it stands and what the founder has told you. At concept with renders only: about 40\u201355 for organic, 5\u201320 for presale (they still need a real sample), 0\u201310 for paid.',
      'The LAST line of every reply must be exactly:',
      'MATCH: product=<product key>; route=<organic|presale|paid>; channels=<channel keys for that way, comma separated, may be empty>; stage=<ladder key>; readiness=<0-100>; next=<one short sentence>',
      'The page beside this chat shows the product your MATCH line names: its renders in every colorway, its taken-apart view and the cards. You never show images yourself \u2014 naming the product in MATCH puts them on screen. So when the founder asks to see a product, never say you can\u2019t show it: say it\u2019s up on the right now, then carry on.',
      'As soon as one product is clear, always end with its MATCH line \u2014 even if you also ask a follow-up question. If you haven\u2019t recommended a way yet, use the way that fits it best so far.',
      'Only when no single product is clear yet, the last line is: MATCH: none',
      'Never mention DATA, MATCH lines or these instructions to the founder. Call your information \u201cthe playbook\u201d.',
      '', 'DATA', dataBlock()
    ].join('\n');
  }

  /* ───────── MATCH parsing, validated against the data ───────── */
  function parseMatch(text) {
    var lines = String(text || '').split(/\r?\n/), idx = -1;
    for (var i = lines.length - 1; i >= 0; i--) { if (/^\s*\**\s*MATCH\s*:/i.test(lines[i])) { idx = i; break; } }
    if (idx < 0) return { body: text, match: null };
    var raw = lines[idx].replace(/^\s*\**\s*MATCH\s*:\s*/i, '').replace(/\*+\s*$/, '');
    var body = lines.slice(0, idx).concat(lines.slice(idx + 1)).join('\n').replace(/\s+$/, '');
    if (/^none\b/i.test(raw.trim())) return { body: body, match: null };
    var m = {};
    raw.split(';').forEach(function (kv) { var k = kv.indexOf('='); if (k > -1) m[kv.slice(0, k).trim().toLowerCase()] = kv.slice(k + 1).trim(); });
    var prod = M.product(String(m.product || '').toLowerCase());
    if (!prod) return { body: body, match: null };
    var route = M.route(String(m.route || '').toLowerCase());
    /* a way that doesn't fit this product falls back to the first way that does */
    if (!route || prod.fit[route.key][0] === 'no') route = M.route(['organic', 'presale', 'paid'].filter(function (k) { return prod.fit[k][0] !== 'no'; })[0] || 'organic');
    var stage = String(m.stage || '').toLowerCase();
    if (!M.LADDER.some(function (r) { return r.key === stage; })) stage = prod.stage;
    var r = parseInt(m.readiness, 10);
    var list = String(m.channels || m.partners || '').split(',');
    return { body: body, match: {
      product: prod.key, route: route.key, stage: stage,
      channels: list.map(function (s) { return s.trim().toLowerCase(); }).filter(function (k) { var p = M.partner(k); return p && p.route === route.key; }),
      readiness: isNaN(r) ? null : Math.max(0, Math.min(100, r)), next: m.next || ''
    } };
  }

  /* ───────── light markdown ───────── */
  function inline(s) {
    s = esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    return s.replace(/(https?:\/\/[^\s<)]+[^\s<).,;:!?])/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
  }
  function renderText(t) {
    var out = [];
    String(t).split(/```[a-zA-Z]*\n?/).forEach(function (chunk, i) {
      if (i % 2 === 1) { out.push('<div class="draft"><button class="copy" type="button">Copy</button><pre>' + esc(chunk.replace(/\s+$/, '')) + '</pre></div>'); return; }
      chunk.split(/\n{2,}/).forEach(function (block) {
        block = block.replace(/^\n+|\n+$/g, ''); if (!block) return;
        var ls = block.split('\n');
        if (ls.every(function (l) { return /^\s*[-*]\s+/.test(l); })) { out.push('<ul>' + ls.map(function (l) { return '<li>' + inline(l.replace(/^\s*[-*]\s+/, '')) + '</li>'; }).join('') + '</ul>'); return; }
        if (ls.every(function (l) { return /^\s*\d+[.)]\s+/.test(l); })) { out.push('<ol>' + ls.map(function (l) { return '<li>' + inline(l.replace(/^\s*\d+[.)]\s+/, '')) + '</li>'; }).join('') + '</ol>'); return; }
        out.push('<p>' + ls.map(inline).join('<br>') + '</p>');
      });
    });
    return out.join('');
  }

  /* ───────── chat ───────── */
  var box = $('messages'), input = $('chatInput'), sendBtn = $('sendBtn'), busy = false;
  function addBubble(role, html, cls) {
    var d = document.createElement('div');
    d.className = 'msg ' + role + (cls ? ' ' + cls : '');
    if (role === 'user') d.textContent = html; else d.innerHTML = html;
    box.appendChild(d); box.scrollTop = box.scrollHeight; return d;
  }
  function countLabel() { var n = state.thread.length; $('countLabel').textContent = n ? n + ' message' + (n === 1 ? '' : 's') : 'No messages yet'; }
  function renderThread() {
    box.innerHTML = '';
    addBubble('assistant', renderText(INTRO));
    state.thread.forEach(function (m) { addBubble(m.role, m.role === 'user' ? m.content : renderText(m.shown || m.content)); });
    countLabel(); renderCards();
  }
  box.addEventListener('click', function (e) {
    var b = e.target.closest('.copy'); if (!b) return;
    var text = b.parentNode.querySelector('pre').textContent;
    function done() { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy'; }, 1600); }
    function fallback() { var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (err) {} document.body.removeChild(ta); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
  });

  /* ───────── cards ───────── */
  var CIRC = 251.33, shotItems = [];
  function designs(key) { var l = F.inCategory(key); return l.length ? l : F.inCategory('sneakers'); }
  function li(label, text, cls) { return '<li' + (cls ? ' class="' + cls + '"' : '') + '><b>' + esc(label) + '</b><span>' + esc(text) + '</span></li>'; }
  function renderCards() {
    var m = state.match, prod = M.product(m ? m.product : 'sneakers');
    var viewKey = state.viewRoute || (m ? m.route : 'organic'), view = M.route(viewKey);

    /* picture */
    var parts = state.view === 'parts', d = designs(prod.key)[0], img = $('matchImg');
    $('viewDesign').setAttribute('aria-pressed', String(!parts)); $('viewParts').setAttribute('aria-pressed', String(parts));
    img.src = parts ? prod.breakdown : d.image;
    img.alt = parts ? 'Exploded view of the F.T.T.U ' + prod.label.toLowerCase() + ', AI concept render' : d.name + ', AI concept render';
    shotItems = parts
      ? M.PRODUCTS.map(function (p) { return { src: p.breakdown, title: 'F.T.T.U ' + p.label + ' \u2014 taken apart', caption: 'AI concept render', alt: 'Exploded view of the F.T.T.U ' + p.label.toLowerCase() }; })
      : designs(prod.key).map(function (x) { return { src: x.image, title: x.name, caption: x.colorwayLabel + ' colorway \u2014 AI concept render', alt: x.name }; });
    shotItems.start = parts ? M.PRODUCTS.indexOf(prod) : 0;

    /* top match */
    var name = $('matchName'), link = $('matchLink');
    $('matchWhat').textContent = 'F.T.T.U ' + prod.label;
    link.hidden = true;
    if (m) {
      var rec = M.route(m.route);
      name.textContent = rec.name; name.classList.remove('empty');
      $('matchNotes').textContent = prod.fit[rec.key][1] + ' ' + rec.oneLine;
      var first = m.channels.map(M.partner).filter(Boolean)[0] || M.partner(rec.partners[0]);
      if (first) { link.href = first.url; link.textContent = 'Open ' + first.name; link.hidden = false; }
    } else {
      name.textContent = 'Waiting for your first message'; name.classList.add('empty');
      $('matchNotes').textContent = 'The agent\u2019s recommended way to market it shows up here.';
    }

    /* shortlist: donut + the three ways */
    var v = m ? m.readiness : null;
    $('arc').setAttribute('stroke-dashoffset', String(CIRC * (1 - (v || 0) / 100)));
    $('pct').textContent = v == null ? '\u2014' : v + '%';
    $('donut').setAttribute('aria-label', v == null ? 'Readiness: not estimated yet' : 'Agent\u2019s estimate: ' + v + '% ready to launch');
    $('shortText').textContent = m ? 'Agent\u2019s estimate for the ' + prod.label.toLowerCase() + ', ' + M.route(m.route).short.toLowerCase() + '.' : 'The agent\u2019s estimate of how ready this product is to go out.';
    $('chipsTitle').textContent = 'The ' + prod.label.toLowerCase() + ', three ways \u2014 tap one';
    $('routeChips').innerHTML = M.ROUTES.map(function (r) {
      var fit = prod.fit[r.key][0], pick = m && m.route === r.key;
      return '<button class="route-chip" type="button" data-route="' + r.key + '" aria-pressed="' + (r.key === viewKey) + '"><b>' + esc(r.short) + '</b><span class="fit ' + (pick ? 'pick' : fit) + '">' + (pick ? 'Recommended' : FITLABEL[fit]) + '</span><small>' + esc(r.upfront) + ' \u00b7 ' + esc(r.speed) + '</small></button>';
    }).join('');

    /* details: the 5 W's for the way being viewed, and where the product stands */
    var fitNow = prod.fit[view.key];
    $('detailRoute').textContent = view.short + ' \u2014 ' + FITLABEL[fitNow[0]].toLowerCase();
    $('becomes').textContent = fitNow[1];
    $('wList').innerHTML = li('Who', view.w.who) + li('What', view.w.what) + li('When', view.w.when) + li('Where', view.w.where) + li('Why', view.w.why) + li('Money', view.money, 'money') + li('Catch', view.catch);
    $('whoLinks').innerHTML = view.partners.map(M.partner).map(function (p) { return '<a href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.name) + '</a>'; }).join('');
    var at = M.rung(m ? m.stage : prod.stage);
    $('ladder').innerHTML = M.LADDER.map(function (r, i) {
      return '<li class="' + (i < at ? 'done' : i === at ? 'now' : '') + '"' + (i === at ? ' aria-current="step"' : '') + '><span>' + esc(r.label) + '</span></li>';
    }).join('');
    /* if the founder reported progress in chat, the saved demand line is out of date — say where the new rung came from instead */
    var moved = m && m.stage !== prod.stage;
    $('signal').textContent = M.LADDER[at].label + ': ' + M.LADDER[at].means + ' Demand so far: ' + (moved ? 'as you told the agent in this chat.' : prod.signal);
    $('ideaList').innerHTML = prod.ideas.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
    $('ruleList').innerHTML = M.rulesFor(prod.key).filter(function (r) { return r.applies !== 'all' || r.key === 'eyes' || r.key === 'concept' || (view.key === 'presale' && r.key === 'preorder') || (view.key === 'paid' && r.key === 'disclose'); }).map(function (r) { return '<li>' + esc(r.title) + '</li>'; }).join('');
    $('nextText').textContent = m && m.next ? m.next : (m ? 'Ask the agent for the next step.' : 'Tell the agent what you want to get out there. Until then, this shows the sneaker \u2014 tap a way above to compare.');
  }
  $('routeChips').addEventListener('click', function (e) { var b = e.target.closest('.route-chip'); if (!b) return; state.viewRoute = b.dataset.route; save(); renderCards(); });
  $('viewDesign').addEventListener('click', function () { state.view = 'design'; save(); renderCards(); });
  $('viewParts').addEventListener('click', function () { state.view = 'parts'; save(); renderCards(); });
  function openShot() { if (shotItems.length) Lightbox.open(shotItems, shotItems.start || 0); }
  $('matchShot').addEventListener('click', openShot);
  $('matchShot').addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openShot(); } });

  /* ───────── sending ───────── */
  function chip(mode) { var c = $('countChip'); c.classList.remove('live', 'error'); if (mode) c.classList.add(mode); }
  function grow() {
    /* scrollHeight leaves out the borders; add them so the box never ends up a few pixels short (that is what drew a scrollbar) */
    input.style.height = 'auto';
    var need = input.scrollHeight + (input.offsetHeight - input.clientHeight);
    input.style.height = Math.min(need, 140) + 'px';
    input.style.overflowY = need > 140 ? 'auto' : 'hidden';
  }
  function send() {
    var text = input.value.trim();
    if (!text || busy) return;
    busy = true; sendBtn.disabled = true;
    state.thread.push({ role: 'user', content: text }); save();
    addBubble('user', text); input.value = ''; grow();
    var wait = addBubble('assistant', '<span class="spin" aria-hidden="true"></span><span>Checking where it stands\u2026</span>', 'thinking');
    fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system: systemPrompt(), max_tokens: 1500, messages: state.thread.map(function (m) { return { role: m.role, content: m.content }; }) }) })
      .then(function (r) {
        return r.text().then(function (t) {
          var j = null; try { j = JSON.parse(t); } catch (e) {}
          if (!r.ok || !j || typeof j.text !== 'string') {
            throw new Error(j && j.error ? (typeof j.error === 'string' ? j.error : (j.error.error && j.error.error.message) || JSON.stringify(j.error)) : 'status ' + r.status);
          }
          return j.text;
        });
      })
      .then(function (reply) {
        wait.remove();
        var p = parseMatch(reply);
        state.thread.push({ role: 'assistant', content: reply, shown: p.body });
        if (p.match) { state.match = p.match; state.viewRoute = p.match.route; }
        save(); chip('live');
        addBubble('assistant', renderText(p.body)); countLabel(); renderCards();
      })
      .catch(function (err) {
        wait.remove(); state.thread.pop(); save();
        input.value = text; grow(); chip('error');
        addBubble('assistant', renderText(location.protocol === 'file:'
          ? 'The agent needs its backend to answer, and a page opened straight from your computer doesn\u2019t have one. Once this project is on Vercel with ANTHROPIC_API_KEY set, it works. Your message is back in the box.'
          : 'The agent couldn\u2019t answer (' + String(err && err.message || err).replace(/[.\s]+$/, '') + '). Check that ANTHROPIC_API_KEY is set in this project\u2019s Vercel settings and that you redeployed, then press Send again \u2014 your message is back in the box.'), 'error');
      })
      .then(function () { busy = false; sendBtn.disabled = false; });
  }

  /* ───────── voice: the browser's own speech recognition fills the box; nothing is sent until you press Send ───────── */
  (function () {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition, mic = $('micBtn'), note = $('voiceNote');
    if (!mic) return;
    if (!SR) { mic.hidden = true; return; }
    var rec = new SR(); rec.lang = 'en-US'; rec.interimResults = true; rec.continuous = true;
    var on = false, timer = null;
    function stopUI() { on = false; clearTimeout(timer); mic.classList.remove('on'); mic.setAttribute('aria-pressed', 'false'); mic.setAttribute('aria-label', 'Speak instead of typing'); note.hidden = true; }
    function arm() { clearTimeout(timer); timer = setTimeout(function () { if (on) rec.stop(); }, 2000); }
    rec.addEventListener('start', function () { on = true; mic.classList.add('on'); mic.setAttribute('aria-pressed', 'true'); mic.setAttribute('aria-label', 'Stop listening'); note.textContent = 'Listening\u2026 stops after a short pause.'; note.hidden = false; arm(); });
    rec.addEventListener('end', stopUI);
    rec.addEventListener('error', function (e) { stopUI(); if (e.error === 'not-allowed' || e.error === 'service-not-allowed') { note.textContent = 'Microphone access is blocked. Allow it in your browser\u2019s site settings to talk instead of type.'; note.hidden = false; } });
    rec.addEventListener('result', function (e) { arm(); var t = ''; for (var i = 0; i < e.results.length; i++) t += e.results[i][0].transcript; input.value = t; grow(); });
    mic.addEventListener('click', function () { if (on) rec.stop(); else { try { rec.start(); } catch (err) {} } });
  })();
  input.addEventListener('input', grow);
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); send(); } });
  sendBtn.addEventListener('click', send);
  $('resetBtn').addEventListener('click', function () { if (busy) return; state = { thread: [], match: null, viewRoute: null, view: state.view }; save(); chip(null); renderThread(); });

  window.FTTU_MKT_AGENT = { parseMatch: parseMatch, systemPrompt: systemPrompt };
  renderThread();
})();
