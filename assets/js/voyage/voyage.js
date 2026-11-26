// Chef d'orchestre du voyage : niveau d'affichage, porte d'entrée, défilement → caméra,
// titres (GSAP SplitText), tableau de bord, son, curseur, surveillance de la fluidité.
import { createAudio } from './audio.js?v=1';

const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const HOLD = 0.55;
const NAMES = ['Émission', 'La fibre', 'La box', 'Le Raspberry Pi', 'Production', 'Réception'];
const DARK = [0, 1, 1, 1, 1, 0];
const sections = [...document.querySelectorAll('.voyage > .st')];
const panels = sections.map((s) => s.querySelector('.st-panel'));
const canvas = document.getElementById('world');
const hud = document.querySelector('.hud');
const gate = document.getElementById('gate');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* stockage indisponible */ } },
  sget(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
  sset(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* idem */ } },
};
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (x, a, b) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

/* ---------- 1. Choisir le niveau : complet, allégé ou léger ---------- */
function detectTier() {
  const forced = (location.search.match(/[?&]tier=(full|lite|static)/) || [])[1];
  if (forced) return forced;
  if (root.classList.contains('is-static')) return 'static';
  const conn = navigator.connection || {};
  if (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '')) return 'static';
  if (navigator.deviceMemory && navigator.deviceMemory <= 2) return 'static';
  let gl = null;
  try { const c = document.createElement('canvas'); gl = c.getContext('webgl2') || c.getContext('webgl'); } catch (e) { gl = null; }
  if (!gl) return 'static';
  const dbg = gl.getExtension('WEBGL_debug_renderer_info');
  const gpu = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
  if (/swiftshader|llvmpipe|software|basic render/i.test(gpu)) return 'static';
  const coarse = matchMedia('(pointer: coarse)').matches || innerWidth < 860;
  if (coarse) return 'lite';
  // lueurs et pleine résolution : cartes graphiques dédiées ou puces Apple seulement
  const strong = /nvidia|geforce|quadro|radeon(?! (hd|r[2-5]))|rtx|gtx|apple (m\d|gpu)/i.test(gpu);
  return strong && (navigator.hardwareConcurrency || 4) > 4 ? 'full' : 'lite';
}
let tier = detectTier();
if (tier === 'static') root.classList.add('is-static');
else root.classList.add('is-3d', 'tier-' + tier);

/* ---------- 2. Titres et panneaux (communs à tous les niveaux) ---------- */
const audio = createAudio();
const lenis = () => window.__lenis || null;
function scrollToStation(i, local = 0.28) {
  const s = sections[i]; if (!s) return;
  const y = s.offsetTop + (root.classList.contains('is-static') ? 0 : local * Math.max(0, s.offsetHeight - innerHeight));
  if (lenis()) lenis().scrollTo(y, { duration: 1.6 }); else scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
}
document.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); scrollToStation(+b.dataset.go); }));

// un lien au clavier dans un panneau caché : on amène la caméra sur l'étape
sections.forEach((s, i) => s.addEventListener('focusin', () => {
  if (root.classList.contains('is-static')) return;
  const r = s.getBoundingClientRect(), range = s.offsetHeight - innerHeight;
  const l = range > 0 ? -r.top / range : 0;
  if (l < 0.05 || l > HOLD - 0.02) scrollToStation(i, 0.25);
}));

if (tier === 'static') {
  // rien d'autre à faire : le CSS montre la version légère
} else {
  start().catch((err) => { console.warn('Voyage 3D indisponible :', err); goStatic(); });
}

function goStatic(at) {
  tier = 'static';
  root.classList.remove('is-3d', 'tier-full', 'tier-lite', 'gate-open');
  root.classList.add('is-static');
  if (gate) gate.hidden = true;
  if (lenis()) lenis().start();
  panels.forEach((p) => { p.style.opacity = ''; p.style.transform = ''; p.classList.remove('is-off'); });
  if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  if (at > 0 && sections[at]) requestAnimationFrame(() => scrollTo({ top: sections[at].offsetTop, behavior: 'auto' }));
}

async function start() {
  /* ---------- 3. Porte d'entrée ---------- */
  const showGate = !reduce && !store.sget('ad-gate') && scrollY < 60 && !location.hash;
  let progress = 0;
  const bar = gate && gate.querySelector('.gate-bar');
  const pct = gate && gate.querySelector('.gate-pct');
  const setPct = (p) => { progress = Math.max(progress, p); if (bar) bar.style.setProperty('--p', Math.round(progress) + '%'); if (pct) pct.textContent = Math.round(progress) + ' %'; };
  if (showGate) {
    gate.hidden = false; root.classList.add('gate-open');
    if (lenis()) lenis().stop();
    gate.querySelector('[data-enter="sound"]').focus({ preventScroll: true });
  }
  setPct(8);

  /* ---------- 4. Le monde 3D ---------- */
  // la page s'affiche d'abord ; le monde 3D se construit ensuite, quand le navigateur est libre
  if (document.readyState !== 'complete') await new Promise((r) => addEventListener('load', r, { once: true }));
  await new Promise((r) => ('requestIdleCallback' in window ? requestIdleCallback(r, { timeout: 700 }) : setTimeout(r, 120)));
  setPct(16);
  if (document.fonts && document.fonts.ready) await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]);
  setPct(25);
  let assets = 0, ready = false;
  const { createWorld } = await import('./world.js?v=16');
  setPct(55);
  const world = await createWorld({
    canvas, tier,
    onEvent(type, data) {
      if (type === 'asset') { assets++; setPct(55 + assets * 9); }
      else if (!ready) return;
      else if (type === 'plug') onPlug(data);
      else if (type === 'frame') onFrame(data);
    },
  });
  setPct(Math.max(progress, 82));
  setTimeout(() => setPct(100), 600);

  /* ---------- 5. Défilement → caméra (GSAP ScrollTrigger) ---------- */
  const prog = sections.map(() => 0);
  function globalP() { let P = 0; for (let i = 0; i < prog.length; i++) if (prog[i] > 0) P = i + prog[i]; return P; }
  function sync() { world.setTarget(globalP()); updatePanels(); }
  const ST = window.ScrollTrigger;
  if (window.gsap && ST) {
    window.gsap.registerPlugin(ST);
    if (lenis()) lenis().on('scroll', ST.update);
    sections.forEach((s, i) => ST.create({ trigger: s, start: 'top top', end: 'bottom bottom', onUpdate(self) { prog[i] = self.progress; sync(); }, onRefresh(self) { prog[i] = self.progress; sync(); } }));
  } else {
    const measure = () => {
      sections.forEach((s, i) => { const r = s.getBoundingClientRect(), range = s.offsetHeight - innerHeight; prog[i] = range > 0 ? clamp(-r.top / range, 0, 1) : 0; });
      sync();
    };
    addEventListener('scroll', measure, { passive: true }); addEventListener('resize', measure); measure();
  }
  world.jump(globalP());

  function updatePanels() {
    const P = globalP();
    panels.forEach((p, i) => {
      const l = P - i;
      let o;
      if (l < -0.02 || l > 1.02) o = i === 0 && P < 0.02 ? 1 : 0;
      else {
        const fin = i === 0 ? 1 : smooth(l, 0.0, 0.09);
        const fout = i === sections.length - 1 ? 1 : 1 - smooth(l, HOLD - 0.03, HOLD + 0.1);
        o = Math.min(fin, fout);
        p.style.transform = `translate3d(0,${((1 - fin) * 40 - (1 - fout) * 40).toFixed(1)}px,0)`;
      }
      p.style.opacity = o.toFixed(3);
      p.classList.toggle('is-off', o < 0.02);
    });
  }

  /* ---------- 6. Titres : SplitText ---------- */
  const reveals = new Map();
  if (window.gsap && window.SplitText) {
    window.gsap.registerPlugin(window.SplitText);
    document.querySelectorAll('.st-title').forEach((el) => {
      const split = window.SplitText.create(el, { type: 'words', mask: 'words', wordsClass: 'sw' });
      window.gsap.set(split.words, { yPercent: 110 });
      reveals.set(el.closest('.st'), () => window.gsap.to(split.words, { yPercent: 0, duration: 1.05, stagger: 0.06, ease: 'expo.out' }));
    });
    const ot = document.querySelector('.otdr-line');
    if (ot) { window.gsap.set(ot, { '--draw': 1 }); reveals.set(sections[1], ((prev) => () => { prev && prev(); window.gsap.to(ot, { '--draw': 0, duration: 2.2, ease: 'power2.inOut', delay: 0.3 }); })(reveals.get(sections[1]))); }
  }

  /* ---------- 7. Tableau de bord, son, pause ---------- */
  let current = -1;
  const hudN = hud.querySelector('.hud-n'), hudName = hud.querySelector('.hud-name'), dots = [...hud.querySelectorAll('.hud-map button')];
  function onFrame({ P, i, dark }) {
    const idx = clamp(Math.floor(P + (1 - HOLD) * 0.5), 0, sections.length - 1);
    if (idx !== current) {
      current = idx;
      hudN.textContent = String(idx + 1).padStart(2, '0') + ' / 06';
      hudName.textContent = NAMES[idx];
      dots.forEach((d, k) => { if (k === idx) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current'); });
      const r = reveals.get(sections[idx]); if (r) { r(); reveals.delete(sections[idx]); }
      audio.station(idx);
    }
    hud.classList.toggle('on-dark', dark > 0.5);
    const tc = dark > 0.5 ? '#05070d' : '#f4f6f9';
    if (themeMeta && themeMeta.content !== tc) themeMeta.content = tc;
    audio.mood(i, dark);
    // la scène s'efface quand le voyage est fini
    const end = smooth(P, 5.66, 5.96);
    canvas.style.opacity = String(1 - end);
    hud.classList.toggle('off', P > 5.7 || (gate && !gate.hidden));
  }

  const soundBtn = hud.querySelector('[data-act="sound"]'), pauseBtn = hud.querySelector('[data-act="pause"]');
  function setSound(v) {
    const ok = v ? audio.enable() : (audio.disable(), false);
    soundBtn.setAttribute('aria-pressed', ok ? 'true' : 'false');
    soundBtn.querySelector('.lbl').textContent = ok ? 'SON ACTIVÉ' : 'SON';
    store.set('ad-sound', ok ? '1' : '0');
  }
  soundBtn.addEventListener('click', () => setSound(!audio.on));
  pauseBtn.addEventListener('click', () => {
    const v = pauseBtn.getAttribute('aria-pressed') !== 'true';
    pauseBtn.setAttribute('aria-pressed', v ? 'true' : 'false');
    pauseBtn.querySelector('.lbl').textContent = v ? 'REPRENDRE' : 'PAUSE';
    root.classList.toggle('paused', v); world.setPaused(v);
  });

  /* ---------- 8. La box : état de la liaison ---------- */
  const status = document.querySelector('.ont-status');
  function onPlug(on) {
    if (status) { status.classList.toggle('on', on); status.querySelector('span').textContent = on ? 'PON · liaison optique établie' : 'LOS · pas de signal optique'; }
    audio.plug(on);
  }

  /* ---------- 9. Souris : parallaxe, écrans cliquables, curseur ---------- */
  const fine = matchMedia('(pointer: fine)').matches;
  const cursor = document.querySelector('.cursor'), ring = cursor.querySelector('.cursor-ring'), ringLabel = ring.querySelector('b'), dot = cursor.querySelector('.cursor-dot');
  let cx = innerWidth / 2, cy = innerHeight / 2, rx = cx, ry = cy, hoverScreen = null;
  if (fine && tier === 'full') document.body.classList.add('has-cursor');
  addEventListener('pointermove', (e) => {
    cx = e.clientX; cy = e.clientY;
    world.setPointer(cx / innerWidth - 0.5, cy / innerHeight - 0.5);
    const overUI = e.target !== canvas;
    const s = overUI ? null : world.pick(cx, cy);
    if (s !== hoverScreen) { hoverScreen = s; world.setHover(s); if (s) audio.hover(); }
    canvas.style.cursor = s ? 'pointer' : '';
    const link = !s && e.target.closest && e.target.closest('a, button');
    cursor.classList.toggle('is-label', !!s); cursor.classList.toggle('is-link', !!link);
    ringLabel.textContent = s ? 'OUVRIR' : '';
  }, { passive: true });
  canvas.addEventListener('click', (e) => {
    const s = world.pick(e.clientX, e.clientY);
    if (!s) return;
    audio.click();
    if (/^https?:/.test(s.href)) window.open(s.href, '_blank', 'noopener'); else location.href = s.href;
  });
  (function follow() {
    rx += (cx - rx) * 0.18; ry += (cy - ry) * 0.18;
    dot.style.transform = `translate3d(${cx}px,${cy}px,0)`;
    ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
    requestAnimationFrame(follow);
  })();

  ready = true;
  window.__voyage = { world, get tier() { return tier; } };

  /* ---------- 10. N'animer que si on regarde ---------- */
  let inView = true;
  new IntersectionObserver((en) => { inView = en[0].isIntersecting; toggleRun(); }, { rootMargin: '0px' }).observe(document.getElementById('voyage'));
  function toggleRun() { if (inView && !document.hidden) world.start(); else world.stop(); }
  document.addEventListener('visibilitychange', toggleRun);
  toggleRun();

  /* ---------- 11. Surveillance de la fluidité ---------- */
  let strikes = 0;
  if (!/[?&]nowatch/.test(location.search)) setInterval(() => {
    if (!inView || document.hidden || (gate && !gate.hidden)) return;
    const fps = world.fps();
    if (fps < 26) strikes++; else strikes = Math.max(0, strikes - 1);
    if (strikes >= 2 && tier === 'full') { tier = 'lite'; world.degrade(); document.body.classList.remove('has-cursor'); strikes = 0; }
    else if (strikes >= 3 && tier === 'lite') { world.dispose(); goStatic(current); }
  }, 2000);

  /* ---------- 12. Ouvrir les portes ---------- */
  if (store.get('ad-sound') === '1' && !showGate) {
    // le navigateur exige un geste : on rallume au premier clic
    addEventListener('pointerdown', () => setSound(true), { once: true });
  }
  if (showGate) {
    const open = (withSound) => {
      store.sset('ad-gate', '1');
      if (withSound) setSound(true);
      const g = window.gsap;
      const done = () => { gate.hidden = true; root.classList.remove('gate-open'); if (lenis()) lenis().start(); hud.classList.remove('off'); };
      if (g) {
        const tl = g.timeline({ onComplete: done });
        tl.to(gate.querySelector('.gate-in'), { autoAlpha: 0, scale: 0.96, duration: 0.45, ease: 'power2.in' })
          .to(gate.querySelector('.seam'), { scaleX: 6, autoAlpha: 0, duration: 0.5, ease: 'power2.out' }, '<0.2')
          .to(gate.querySelector('.door-l'), { xPercent: -100, duration: 1.3, ease: 'expo.inOut' }, '<')
          .to(gate.querySelector('.door-r'), { xPercent: 100, duration: 1.3, ease: 'expo.inOut' }, '<');
      } else done();
    };
    gate.querySelectorAll('[data-enter]').forEach((b) => b.addEventListener('click', () => open(b.dataset.enter === 'sound')));
    gate.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') open(false);
      if (e.key === 'Tab') { // garder le focus dans la porte
        const f = [...gate.querySelectorAll('button, a')]; const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }
  updatePanels();
}
