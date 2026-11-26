// Son du voyage, généré en direct (Web Audio) : aucun fichier à charger.
// Une nappe grave qui change de couleur selon la station, et de petits sons d'interface.
// Coupé par défaut : le navigateur n'autorise le son qu'après un geste du visiteur.
export function createAudio() {
  let ctx = null, master = null, filter = null, shimmer = null, shimmerGain = null, on = false;
  const NOTES = [392, 440, 523.25, 587.33, 659.25, 783.99]; // pentatonique : une note par station

  function init() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 520; filter.Q.value = 0.7;
    filter.connect(master);
    // nappe : deux oscillateurs légèrement désaccordés
    [55, 82.41, 110.3].forEach((f, i) => {
      const o = ctx.createOscillator(); o.type = i === 2 ? 'triangle' : 'sine'; o.frequency.value = f;
      const g = ctx.createGain(); g.gain.value = i === 2 ? 0.05 : 0.16;
      o.connect(g).connect(filter); o.start();
    });
    // souffle filtré
    const len = ctx.sampleRate * 2, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    let b0 = 0; for (let i = 0; i < len; i++) { b0 = 0.985 * b0 + 0.015 * (Math.random() * 2 - 1); d[i] = b0 * 3.5; }
    const noise = ctx.createBufferSource(); noise.buffer = buf; noise.loop = true;
    const ng = ctx.createGain(); ng.gain.value = 0.22; noise.connect(ng).connect(filter); noise.start();
    // respiration lente du filtre
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.07;
    const lfoG = ctx.createGain(); lfoG.gain.value = 140; lfo.connect(lfoG).connect(filter.frequency); lfo.start();
    // scintillement aigu, audible seulement dans la fibre
    shimmer = ctx.createOscillator(); shimmer.type = 'sine'; shimmer.frequency.value = 1760;
    shimmerGain = ctx.createGain(); shimmerGain.gain.value = 0;
    const trem = ctx.createOscillator(); trem.frequency.value = 6; const tg = ctx.createGain(); tg.gain.value = 0.004;
    trem.connect(tg).connect(shimmerGain.gain); trem.start();
    shimmer.connect(shimmerGain).connect(master); shimmer.start();
    document.addEventListener('visibilitychange', () => {
      if (!ctx) return;
      if (document.hidden) ctx.suspend(); else if (on) ctx.resume();
    });
  }

  function blip(freq, dur = 0.5, type = 'sine', vol = 0.12) {
    if (!on || !ctx) return;
    const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(master); o.start(t); o.stop(t + dur + 0.05);
  }

  return {
    get on() { return on; },
    enable() {
      init(); if (!ctx) return false;
      on = true; ctx.resume();
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0.5, ctx.currentTime, 0.6);
      return true;
    },
    disable() {
      on = false; if (!ctx) return;
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.2);
      setTimeout(() => { if (!on) ctx.suspend(); }, 900);
    },
    // ambiance selon la station : sombre = filtre plus fermé, fibre = scintillement
    mood(i, dark) {
      if (!ctx || !on) return;
      const t = ctx.currentTime;
      filter.frequency.setTargetAtTime(dark > 0.5 ? 380 + i * 60 : 900, t, 0.8);
      shimmerGain.gain.setTargetAtTime(i === 1 ? 0.012 : 0, t, 0.5);
    },
    station(i) { blip(NOTES[i % NOTES.length], 1.2, 'sine', 0.09); blip(NOTES[i % NOTES.length] * 1.5, 0.9, 'sine', 0.04); },
    plug(onState) {
      if (!on || !ctx) return;
      if (onState) { blip(2200, 0.06, 'square', 0.05); setTimeout(() => { blip(660, 0.5); blip(990, 0.7, 'sine', 0.06); }, 90); }
      else blip(330, 0.3, 'triangle', 0.06);
    },
    hover() { blip(1320, 0.12, 'sine', 0.03); },
    click() { blip(880, 0.18, 'triangle', 0.06); },
  };
}
