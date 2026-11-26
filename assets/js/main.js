/* Portfolio « Signal » — interactions
   A · fibre lumineuse   B · Raspberry Pi éclaté   C · schéma → application
   D · tirer le câble    E · pile réseau OSI        + menu mobile, filtres projets */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function ease(e) { return e < 0.5 ? 2 * e * e : 1 - Math.pow(-2 * e + 2, 2) / 2; } // power2.inOut

  /* ---------- Menu mobile ---------- */
  var menuBtn = document.querySelector('.menu-btn');
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      var open = document.querySelector('.nav-links').classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---------- C · Schéma → application ---------- */
  var hero = document.querySelector('.hero');
  var plan = document.querySelector('.plan-frame');
  var pLabel = document.querySelector('.plabel');
  function updateHero() {
    if (!hero || !plan) return;
    var range = hero.offsetHeight - window.innerHeight;
    var p = range > 0 ? clamp(-hero.getBoundingClientRect().top / range, 0, 1) : 1;
    if (reduce) p = 1;
    // 0–15 % : le plan seul · 15–85 % : balayage · 85–100 % : l'application seule
    var w = p <= 0.15 ? 0 : (p >= 0.85 ? 100 : (p - 0.15) / 0.7 * 100);
    plan.style.setProperty('--edge', (100 - w) + '%');
    plan.style.setProperty('--wipe-o', w > 0 && w < 100 ? '1' : '0');
    if (pLabel) pLabel.textContent = w <= 0 ? 'LE PLAN' : (w >= 100 ? "L'APPLICATION" : 'p = ' + p.toFixed(2));
  }

  /* ---------- A · Fibre lumineuse ---------- */
  var svg = document.getElementById('fibre');
  var pulse = document.getElementById('pulse');
  var mainPath = svg ? svg.querySelector('.f1') : null;
  var samples = [];
  var stations = Array.prototype.slice.call(document.querySelectorAll('[data-station]'));
  function layoutFibre() {
    if (!svg || !mainPath) return;
    // Hauteur réelle du contenu (jusqu'au bas du pied de page), sans compter la fibre elle-même :
    // sinon la fibre agrandit la page à chaque calcul et crée un grand vide en bas.
    var foot = document.querySelector('.foot') || document.querySelector('main');
    var H = Math.ceil(foot.getBoundingClientRect().bottom + window.scrollY);
    svg.style.height = H + 'px';
    svg.setAttribute('height', H);
    var len = mainPath.getTotalLength();
    var W = svg.clientWidth;
    samples = [];
    for (var i = 0; i <= 600; i++) {
      var pt = mainPath.getPointAtLength(len * i / 600);
      samples.push({ x: pt.x / 100 * W, y: pt.y / 1000 * H });
    }
  }
  function updateFibre() {
    if (!samples.length || !pulse) return;
    var target = window.scrollY + window.innerHeight * 0.45;
    var lo = 0, hi = samples.length - 1;
    while (lo < hi) { var mid = (lo + hi) >> 1; if (samples[mid].y < target) lo = mid + 1; else hi = mid; }
    var s = samples[lo];
    pulse.style.transform = 'translate(' + s.x.toFixed(1) + 'px,' + s.y.toFixed(1) + 'px)';
    stations.forEach(function (el) {
      var top = el.getBoundingClientRect().top + window.scrollY;
      el.classList.toggle('lit', s.y >= top - 40);
    });
  }

  /* ---------- B · Raspberry Pi éclaté ---------- */
  var pi = document.querySelector('.pi');
  var piScene = document.querySelector('.pi-scene');
  var piCount = document.querySelector('.pi-count');
  if (piCount) piCount.textContent = '4 PIÈCES · MODÉLISÉES À L’ÉCHELLE 1:1 (85 × 56 MM)';
  // Séquence d'images rendue en 3D (tools/render-pi.html) : 12 étapes, du Pi fermé au Pi éclaté
  var seq = document.querySelector('.pi-seq');
  var frames = [], frameIdx = -1, framesLoaded = false;
  function loadFrames() {
    if (framesLoaded || !seq) return;
    framesLoaded = true;
    var n = Number(seq.dataset.frames), path = seq.dataset.path;
    for (var i = 0; i < n; i++) { var im = new Image(); im.src = path + (i < 10 ? '0' : '') + i + '.webp'; frames.push(im.src); }
  }
  function updatePi() {
    if (!pi || !piScene) return;
    var rect = pi.getBoundingClientRect();
    if (seq && (reduce || window.innerWidth <= 860)) {
      // mobile ou animations réduites : une seule image, le Pi complètement éclaté
      var last = seq.dataset.path + (Number(seq.dataset.frames) - 1) + '.webp';
      if (seq.getAttribute('src') !== last) seq.setAttribute('src', last);
    } else if (rect.top < window.innerHeight * 2) loadFrames();
    var range = pi.offsetHeight - window.innerHeight;
    var e = range > 0 ? clamp(-rect.top / range, 0, 1) : 0.7;
    if (reduce || window.innerWidth <= 860) e = 1;
    var k = ease(e);
    if (seq && frames.length) {
      var idx = Math.round(k * (frames.length - 1));
      if (idx !== frameIdx) { frameIdx = idx; seq.src = frames[idx]; }
    }
    piScene.style.setProperty('--k', k.toFixed(3));
    piScene.style.setProperty('--lab-o', clamp((k - 0.25) * 3, 0, 1).toFixed(2));
    piScene.style.setProperty('--lab-x', Math.round((1 - k) * 30) + 'px');
  }

  /* ---------- E · Pile réseau OSI ---------- */
  var OSI = [
    { n: 7, name: 'Application', short: 'React · Next.js', c: '#1f5cc9', title: 'Ce que vous touchez', text: 'Interfaces web rapides sur mobile : boutiques, outils de gestion, SaaS avec paiement local.', tools: ['React', 'Next.js', 'TypeScript', 'Tailwind'], proof: 'PitchMySite, Al Kareem, Fleet Commander' },
    { n: 6, name: 'Présentation', short: 'TLS · audio', c: '#1f5cc9', title: 'Chiffrer et encoder', text: "Chiffrement des échanges, encodage des données et des flux audio entre l'appelant et l'IA.", tools: ['TLS', 'JSON', 'codecs audio'], proof: "Centre d'appels vocal IA" },
    { n: 5, name: 'Session', short: 'SIP · auth', c: '#127a45', title: 'Ouvrir et tenir une session', text: "Sessions d'appel SIP gérées par Asterisk, sessions utilisateur et connexions sécurisées côté web.", tools: ['SIP', 'PJSIP', 'Supabase Auth'], proof: "Centre d'appels vocal IA, PitchMySite" },
    { n: 4, name: 'Transport', short: 'TCP · UDP', c: '#127a45', title: 'Faire arriver les paquets', text: "TCP pour le web, UDP et RTP pour la voix. Audit des ports ouverts d'une machine.", tools: ['TCP', 'UDP', 'RTP'], proof: 'Suite cybersécurité : scanner de ports multi-thread' },
    { n: 3, name: 'Réseau', short: 'IP · VPN', c: '#a94e0c', title: 'Router et protéger', text: 'Adressage IP, routage et tunnels VPN chiffrés entre un site client et un serveur distant.', tools: ['IP', 'WireGuard', 'Routage'], proof: 'Tunnel WireGuard Raspberry Pi → VPS' },
    { n: 2, name: 'Liaison', short: 'VLAN · Ethernet', c: '#a94e0c', title: 'Organiser le réseau local', text: "Segmentation par VLAN, configuration des équipements d'accès, maintenance de réseaux de surveillance.", tools: ['VLAN', 'Ethernet', 'LAN/WAN'], proof: 'SoBAPS, Ministère de la Santé du Bénin' },
    { n: 1, name: 'Physique', short: 'Fibre · OTDR', c: '#a94e0c', title: 'Le câble lui-même', text: "Raccordement d'abonnés en fibre optique, soudure, mesures au réflectomètre pour valider chaque liaison.", tools: ['FTTH', 'Soudure optique', 'OTDR'], proof: 'Premium Company Bénin, 2022–2023' }
  ];
  var osiList = document.getElementById('osi-list');
  var osiPanel = document.getElementById('osi-panel');
  function selectOsi(n) {
    var cur = OSI.filter(function (l) { return l.n === n; })[0];
    osiPanel.style.setProperty('--c', cur.c);
    osiPanel.querySelector('.k').textContent = 'COUCHE ' + cur.n + ' · ' + cur.name.toUpperCase();
    osiPanel.querySelector('h3').textContent = cur.title;
    osiPanel.querySelector('p').textContent = cur.text;
    osiPanel.querySelector('.chips').innerHTML = cur.tools.map(function (t) { return '<span class="chip">' + t + '</span>'; }).join('');
    osiPanel.querySelector('.proof').textContent = 'PREUVE · ' + cur.proof;
    Array.prototype.forEach.call(osiList.querySelectorAll('button'), function (b) {
      b.setAttribute('aria-pressed', Number(b.dataset.n) === n ? 'true' : 'false');
    });
  }
  if (osiList && osiPanel) {
    osiList.innerHTML = OSI.map(function (l) {
      return '<li><button type="button" class="osi" data-n="' + l.n + '" aria-pressed="false" style="--c:' + l.c + '"><span class="mono">' + l.n + '</span><b>' + l.name + '</b><span class="mono">' + l.short + '</span></button></li>';
    }).join('');
    Array.prototype.forEach.call(osiList.querySelectorAll('button'), function (b) {
      var n = Number(b.dataset.n);
      b.addEventListener('click', function () { selectOsi(n); });
      b.addEventListener('mouseenter', function () { selectOsi(n); });
      b.addEventListener('focus', function () { selectOsi(n); });
    });
    selectOsi(1);
  }

  /* ---------- D · Tirer le câble ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.rx'), function (rx) {
    var plug = rx.querySelector('.plug');
    var cable = rx.querySelector('.cable');
    var status = rx.querySelector('.ont .st');
    var form = rx.querySelector('.form');
    var note = rx.querySelector('.form .note');
    var fields = rx.querySelectorAll('.form input, .form textarea, .form button[type=submit]');
    var BASE = 140, LINKED = 332, THRESHOLD = 120;
    var ledPon = rx.querySelector('.led-pon'), ledLos = rx.querySelector('.led-los'), ledLan = rx.querySelector('.led-lan');
    function leds(on) {
      if (ledPon) ledPon.classList.toggle('on', on);
      if (ledLan) ledLan.classList.toggle('on', on);
      if (ledLos) ledLos.classList.toggle('alarm', !on);
    }
    var startY = 0, dy = 0, dragging = false, linked = false;
    function place(top, spring) {
      plug.classList.toggle('spring', !!spring);
      cable.classList.toggle('spring', !!spring);
      plug.style.top = top + 'px';
      cable.style.height = (top + 6) + 'px';
    }
    function setFields(on) { Array.prototype.forEach.call(fields, function (f) { f.disabled = !on; }); }
    function link() {
      linked = true;
      rx.classList.add('linked');
      place(LINKED, true);
      leds(true);
      status.textContent = 'PON · liaison optique établie';
      plug.setAttribute('aria-label', 'Câble branché');
      setFields(true);
      if (note) note.textContent = 'Liaison établie. Le formulaire est actif.';
    }
    function unlink() {
      linked = false;
      rx.classList.remove('linked');
      place(BASE, true);
      leds(false);
      status.textContent = 'LOS · pas de signal optique';
      plug.setAttribute('aria-label', 'Connecteur fibre : tirez-le vers le bas pour brancher le formulaire');
      setFields(false);
      if (note) note.textContent = "Formulaire inactif tant que le câble n'est pas branché.";
    }
    place(BASE, false);
    setFields(false);
    plug.addEventListener('pointerdown', function (e) {
      if (linked) return;
      dragging = true; startY = e.clientY; dy = 0;
      try { plug.setPointerCapture(e.pointerId); } catch (x) {}
      plug.classList.add('drag');
      place(BASE, false);
    });
    plug.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      dy = Math.max(0, e.clientY - startY);
      place(BASE + dy / (1 + dy / 300), false); // résistance, comme une vraie corde
    });
    function end() {
      if (!dragging) return;
      dragging = false; plug.classList.remove('drag');
      var pull = dy / (1 + dy / 300); dy = 0;
      if (pull >= THRESHOLD) link(); else place(BASE, true);
    }
    plug.addEventListener('pointerup', end);
    plug.addEventListener('pointercancel', end);
    plug.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); if (!linked) link(); }
    });
    var unlinkBtn = rx.querySelector('.unlink');
    if (unlinkBtn) unlinkBtn.addEventListener('click', unlink);
    // Choix du profil (recruteur / client / autre)
    Array.prototype.forEach.call(rx.querySelectorAll('.seg button'), function (b) {
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(rx.querySelectorAll('.seg button'), function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
        var subj = rx.querySelector('#f-subject');
        if (subj) subj.placeholder = b.dataset.hint || '';
      });
    });
    // Envoi : la messagerie du visiteur s'ouvre avec le message rédigé, WhatsApp en solution de rechange
    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!linked) return;
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var val = function (sel) { var el = rx.querySelector(sel); return el ? el.value.trim() : ''; };
      var who = rx.querySelector('.seg button[aria-pressed="true"]');
      var profile = who ? who.textContent.trim() : '';
      var subject = '[Portfolio] ' + (val('#f-subject') || (profile ? profile : 'Prise de contact')) + (val('#f-name') ? ' · ' + val('#f-name') : '');
      var NL = String.fromCharCode(10);
      var body = val('#f-msg') + NL + NL + val('#f-name') + (val('#f-mail') ? ' <' + val('#f-mail') + '>' : '') + (profile ? NL + 'Profil : ' + profile : '');
      var mail = 'mailto:adrrianododo@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      var wa = 'https://wa.me/2290150884670?text=' + encodeURIComponent(subject + NL + NL + body);
      if (typeof window.va === 'function') window.va('event', { name: 'formulaire_envoye', data: { page: location.pathname } });
      location.href = mail;
      note.innerHTML = 'Votre messagerie s’ouvre avec le message prêt à partir. Rien ne s’ouvre ? <a href="' + wa + '">Envoyez-le sur WhatsApp ↗</a> ou écrivez à adrrianododo@gmail.com.';
    });
  });

  /* ---------- Filtres de la page Projets ---------- */
  var filterBtns = document.querySelectorAll('.filters button');
  Array.prototype.forEach.call(filterBtns, function (b) {
    b.addEventListener('click', function () {
      var f = b.dataset.f;
      Array.prototype.forEach.call(filterBtns, function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      Array.prototype.forEach.call(document.querySelectorAll('[data-tags]'), function (card) {
        card.hidden = !(f === 'all' || card.dataset.tags.split(' ').indexOf(f) >= 0);
      });
      layoutFibre(); updateFibre();
    });
  });

  /* ---------- Le nom : DODO se décode comme un signal ---------- */
  var last = document.querySelector('.name .last');
  function startDecode() {
    var target = last.dataset.name, noise = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/<>_';
    var frameN = 0, total = 6 + target.length * 4;
    // largeur figée pendant le décodage : les lettres aléatoires ne font pas bouger la mise en page
    last.style.width = last.getBoundingClientRect().width + 'px';
    last.style.whiteSpace = 'nowrap';
    last.classList.add('decoding');
    var timer = setInterval(function () {
      frameN++;
      last.innerHTML = target.split('').map(function (ch, i) {
        if (frameN >= 6 + i * 4) return ch;                       // lettre verrouillée
        return '<span class="glitch">' + noise[Math.floor(Math.random() * noise.length)] + '</span>';
      }).join('');
      if (frameN >= total) {
        clearInterval(timer);
        last.textContent = target;
        last.classList.remove('decoding');                       // le balayage de lumière prend le relais
        last.style.width = ''; last.style.whiteSpace = '';
      }
    }, 55);
  }
  if (last && !reduce) {
    // on attend la vraie police (1,5 s au plus) pour mesurer la largeur finale
    var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    Promise.race([fontsReady, new Promise(function (r) { setTimeout(r, 1500); })]).then(startDecode);
  }

  /* ---------- Variante de titres (?titres=fins) ---------- */
  if (/[?&]titres=fins/.test(location.search)) document.documentElement.classList.add('titres-fins');

  /* ---------- Boutons animés lettre par lettre ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.btn-roll'), function (b) {
    var txt = b.textContent;
    b.setAttribute('aria-label', txt.trim());
    b.innerHTML = '<span class="roll">' + txt.trim().split('').map(function (c, i) {
      var safe = c === ' ' ? ' ' : c.replace(/[&<>"]/g, function (x) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[x]; });
      return '<span class="ch" aria-hidden="true"><span data-c="' + safe + '" style="--i:' + i + '">' + safe + '</span></span>';
    }).join('') + '</span>';
  });

  /* ---------- Défilement fluide (Lenis) ---------- */
  var lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    window.__lenis = lenis;
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
    Array.prototype.forEach.call(document.querySelectorAll('a[href^="#"]'), function (a) {
      if (a.hasAttribute('data-go')) return;
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -20 }); }
      });
    });
  }

  /* ---------- Titres mot par mot et apparitions ---------- */
  function splitWords(el) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var nodes = [], n, i = 0;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(function (node) {
      var frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        var w = document.createElement('span'); w.className = 'w';
        var inner = document.createElement('span'); inner.textContent = part;
        inner.style.setProperty('--d', (i++ * 70) + 'ms');
        w.appendChild(inner); frag.appendChild(w);
      });
      node.parentNode.replaceChild(frag, node);
    });
    el.classList.add('split');
  }
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.15 });
    Array.prototype.forEach.call(document.querySelectorAll('.h2, .pi-text h2, .rx-text h2, .page-hero h1, .scene-l, .scene-r'), function (el) {
      el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
      splitWords(el); io.observe(el);
    });
    Array.prototype.forEach.call(document.querySelectorAll('.card, .osi-panel, .feat-grid > div, .stats > div'), function (el) {
      el.classList.add('reveal'); io.observe(el);
    });
  }

  /* ---------- Statistiques : clics qui mènent à un contact (Vercel Analytics) ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || typeof window.va !== 'function') return;
    var h = a.getAttribute('href'), name = null;
    if (/\.pdf$/i.test(h)) name = 'cv';
    else if (/wa\.me/.test(h)) name = 'whatsapp';
    else if (/linkedin\.com/.test(h)) name = 'linkedin';
    else if (/contact(\.html)?$/.test(h)) name = 'contact';
    else if (/^mailto:/.test(h)) name = 'email';
    if (name) window.va('event', { name: 'clic_' + name, data: { page: location.pathname } });
  }, true);

  /* ---------- Transitions entre les pages ---------- */
  requestAnimationFrame(function () { document.body.classList.add('ready'); });
  window.addEventListener('pageshow', function () { document.body.classList.remove('leaving'); document.body.classList.add('ready'); });
  var nativeVT = 'onpagereveal' in window;
  if (!reduce && !nativeVT) {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || a.target || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      var url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname || /\.pdf$/i.test(url.pathname)) return;
      e.preventDefault();
      document.body.classList.add('leaving');
      setTimeout(function () { location.href = url.href; }, 280);
    });
  }

  /* ---------- Boucle ---------- */
  var ticking = false;
  function frame() { ticking = false; updateHero(); updatePi(); updateFibre(); }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { layoutFibre(); onScroll(); });
  window.addEventListener('load', function () { layoutFibre(); frame(); });
  layoutFibre(); frame();
})();
