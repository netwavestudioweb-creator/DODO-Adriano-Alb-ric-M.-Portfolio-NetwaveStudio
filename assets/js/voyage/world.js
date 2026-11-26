// Le voyage du signal : un seul monde 3D, une caméra qui suit le défilement.
// 6 stations : 0 Émission (orbe) · 1 Fibre · 2 Box ONT · 3 Raspberry Pi · 4 Serveurs et projets · 5 Écran.
// Tout est construit en code (aucun modèle à télécharger). Niveaux : 'full' (lueurs, détails) ou 'lite'.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { buildPi } from './pi-model.js';

export const STATIONS = 6;
const HOLD = 0.55; // part de chaque station où la caméra reste sur place avant de repartir

const COL = { blue: new THREE.Color('#2f6fe4'), orange: new THREE.Color('#e8731f'), green: new THREE.Color('#1fa463') };
const FIBRES = [COL.blue, COL.orange, COL.green];
const BG = ['#f4f6f9', '#03050a', '#060911', '#060911', '#05070d', '#f4f6f9'].map((c) => new THREE.Color(c));
const DARK = [0, 1, 1, 1, 1, 0];
const FOG = [[14, 46], [1.5, 30], [7, 34], [6, 30], [8, 36], [8, 40]];
const SHIFT = [1, 0.25, 1, 1, 0.15, 0]; // décalage du sujet vers la droite (ordinateur) ou le haut (mobile)

const v3 = (x, y, z) => new THREE.Vector3(x, y, z);
const clamp = THREE.MathUtils.clamp;
const smooth = (x, a, b) => THREE.MathUtils.smoothstep(x, a, b);
const easeIO = (e) => (e < 0.5 ? 4 * e * e * e : 1 - Math.pow(-2 * e + 2, 3) / 2);

function dotTexture(inner, outer) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, inner); grd.addColorStop(0.45, outer); grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function canvasTexture(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

/* ---------- Poses de caméra : arrêt sur chaque station (h de 0 à 1) ---------- */
function holdPose(i, h, out) {
  const p = out.pos, l = out.look;
  switch (i) {
    case 0: p.set(Math.sin(h * Math.PI) * 0.7, 0.05, 8.2 - h * 1.4); l.set(0, 0, 0); break;
    case 1: p.set(0, 0, -19 - h * 15); l.set(0, 0, -40 - h * 15); break;
    case 2: { const a = 0.62 - h * 0.6, r = 9.2; p.set(Math.sin(a) * r, 0.7 + h * 0.5, -76 + Math.cos(a) * r); l.set(0, -0.55, -76); break; }
    case 3: { const a = 0.85 - h * 0.95, r = 8; p.set(Math.sin(a) * r, 3.6 - h * 1.0, -100 + Math.cos(a) * r); l.set(0, 0.4, -100); break; }
    case 4: p.set(-4.2 + h * 8.4, 0.7, -125.5); l.set(-2.2 + h * 4.4, 0.45, -136); break;
    default: p.set(0, 0, -149.5 - h * 10.1); l.set(0, 0, -161); break;
  }
  return out;
}
// Points de passage entre deux stations
const VIA = [
  [v3(2.0, 0.5, 3.6), v3(0.8, 0.1, -6), v3(0, 0, -13.5)],
  [v3(0, 0, -50), v3(0, 0.2, -59), v3(2.6, 1.5, -65)],
  [v3(0.6, 3.3, -75.5), v3(2.2, 4.2, -88)],
  [v3(0, 1.4, -105), v3(0, 0.7, -114), v3(-2.8, 0.7, -121)],
  [v3(2.6, 2.5, -133), v3(1.2, 1.4, -142), v3(0, 0.2, -147)],
];

export async function createWorld({ canvas, tier = 'full', onEvent = () => {} }) {
  const full = tier === 'full';
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: full, powerPreference: 'high-performance', alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, full ? 1.75 : 1.25));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;

  const scene = new THREE.Scene();
  scene.background = BG[0].clone();
  scene.fog = new THREE.Fog(BG[0].clone(), 14, 46);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;
  const hemi = new THREE.HemisphereLight(0xffffff, 0x8a96aa, 0.9); scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(4, 8, 6); scene.add(key);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 220);
  const groups = []; // [{ group, at }] : at = indice de station, pour masquer ce qui est loin
  const updaters = [];
  function station(at) { const g = new THREE.Group(); scene.add(g); groups.push({ group: g, at }); return g; }

  const glow = dotTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0.55)');
  const additive = (color, opacity) => new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });

  /* ===== 0 · Émission : l'orbe-signal ===== */
  {
    const g = station(0);
    const N = full ? 3600 : 1600;
    const pos = new Float32Array(N * 3), col = new Float32Array(N * 3), seed = new Float32Array(N);
    const palette = [COL.blue, COL.orange, COL.green, new THREE.Color('#9aa6bb'), new THREE.Color('#c9d3e3')];
    const weights = [0.24, 0.2, 0.18, 0.2, 0.18];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = golden * i;
      const rad = 1.55 * (0.72 + Math.pow(Math.random(), 0.6) * 0.38);
      pos[i * 3] = Math.cos(th) * r * rad; pos[i * 3 + 1] = y * rad; pos[i * 3 + 2] = Math.sin(th) * r * rad;
      let q = Math.random(), k = 0; while (q > weights[k] && k < weights.length - 1) { q -= weights[k]; k++; }
      col[i * 3] = palette[k].r; col[i * 3 + 1] = palette[k].g; col[i * 3 + 2] = palette[k].b; seed[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const basePos = pos.slice();
    const points = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.055, map: glow, vertexColors: true, transparent: true, opacity: 0.92, depthWrite: false }));
    g.add(points);
    const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: dotTexture('rgba(255,236,214,1)', 'rgba(255,140,60,0.55)'), transparent: true, depthWrite: false }));
    core.scale.set(2.3, 2.3, 1); g.add(core);
    const heart = new THREE.Sprite(new THREE.SpriteMaterial({ map: dotTexture('rgba(255,255,255,1)', 'rgba(255,214,170,0.8)'), transparent: true, depthWrite: false }));
    heart.scale.set(0.8, 0.8, 1); g.add(heart);
    // trois fibres sortent de l'orbe et partent vers la fibre (station 1)
    const sparks = FIBRES.map((c, i) => {
      const o = (i - 1) * 0.22;
      const curve = new THREE.CatmullRomCurve3([v3(0.2, -0.2, -0.4), v3(1.6 + o, -1.1 + o, -3.5), v3(1.2 + o, -1.7 + o * 0.5, -8.5), v3(o * 0.5, -2.1 + o * 0.3, -13.5), v3(o * 0.3, -2.4 + o * 0.2, -16.5)]);
      const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 160, 0.032, 8, false), new THREE.MeshBasicMaterial({ color: c, toneMapped: false }));
      g.add(tube);
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: c, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      s.scale.set(0.5, 0.5, 1); g.add(s);
      return { curve, s, off: i / 3 };
    });
    updaters.push((t, P, dark) => {
      if (Math.abs(P) > 1.7) return;
      const p = geo.attributes.position.array;
      for (let i = 0; i < N; i++) {
        const b = 1 + Math.sin(t * 1.3 + seed[i] * 6.28) * 0.035;
        p[i * 3] = basePos[i * 3] * b; p[i * 3 + 1] = basePos[i * 3 + 1] * b; p[i * 3 + 2] = basePos[i * 3 + 2] * b;
      }
      geo.attributes.position.needsUpdate = true;
      points.rotation.y = t * 0.12; points.rotation.x = Math.sin(t * 0.2) * 0.12;
      const br = 1 + Math.sin(t * 1.6) * 0.06; core.scale.set(2.3 * br, 2.3 * br, 1);
      sparks.forEach((f) => { const q = (((t * 0.22 + f.off) % 1) + 1) % 1; f.s.position.copy(f.curve.getPoint(q)); });
      points.material.blending = dark > 0.5 ? THREE.AdditiveBlending : THREE.NormalBlending;
    });
  }

  /* ===== Flux de lumière réutilisable (impulsions dans un tube) ===== */
  function stream(parent, { z0, z1, radius, count, colors, speed, len = 0.7 }) {
    const geo = new THREE.CapsuleGeometry(0.03, len, 3, 6); geo.rotateX(Math.PI / 2);
    const mesh = new THREE.InstancedMesh(geo, new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }), count);
    const data = [], m = new THREE.Matrix4(), c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * radius;
      data.push({ x: Math.cos(a) * r, y: Math.sin(a) * r, z: z0 + Math.random() * (z1 - z0), v: speed * (0.6 + Math.random() * 0.8) });
      c.copy(colors[i % colors.length]).multiplyScalar(2.6); mesh.setColorAt(i, c);
    }
    parent.add(mesh);
    return (dt) => {
      for (let i = 0; i < count; i++) {
        const d = data[i]; d.z -= d.v * dt; if (d.z < z1) d.z = z0;
        m.makeTranslation(d.x, d.y, d.z); mesh.setMatrixAt(i, m);
      }
      mesh.instanceMatrix.needsUpdate = true;
    };
  }
  function rings(parent, { z0, z1, step, radius, color, opacity }) {
    const n = Math.floor((z0 - z1) / step) + 1;
    const mesh = new THREE.InstancedMesh(new THREE.TorusGeometry(radius, 0.012, 6, 96), additive(color, opacity), n);
    const m = new THREE.Matrix4();
    for (let i = 0; i < n; i++) { m.makeTranslation(0, 0, z0 - i * step); mesh.setMatrixAt(i, m); }
    parent.add(mesh); return mesh;
  }

  /* ===== 1 · La fibre : on voyage dans le cœur d'une fibre monomode ===== */
  {
    const g = station(1);
    const shell = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 50, 48, 1, true), new THREE.MeshBasicMaterial({ color: 0x2f6fe4, transparent: true, opacity: 0.06, side: THREE.BackSide, depthWrite: false }));
    shell.rotation.x = Math.PI / 2; shell.position.z = -40; g.add(shell);
    rings(g, { z0: -16, z1: -64, step: 2, radius: 3, color: 0x5b8cff, opacity: 0.32 });
    rings(g, { z0: -17, z1: -63, step: 4, radius: 0.62, color: 0xffffff, opacity: 0.18 });
    const coreGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 50, 24, 1, true), additive(0x9fc0ff, 0.05));
    coreGlow.rotation.x = Math.PI / 2; coreGlow.position.z = -40; g.add(coreGlow);
    const tick = stream(g, { z0: -14, z1: -66, radius: 0.55, count: full ? 260 : 110, colors: FIBRES, speed: 14 });
    // réflexion totale interne : la lumière rebondit sur la gaine
    const zz = [], zig = [];
    for (let z = -16, s = 1; z >= -64; z -= 2.4, s = -s) zig.push(v3(0.55 * s, 0, z));
    const zigCurve = new THREE.CatmullRomCurve3(zig, false, 'catmullrom', 0);
    const zigLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(zig), new THREE.LineBasicMaterial({ color: 0xffa35c, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, toneMapped: false }));
    g.add(zigLine);
    const runner = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: 0xffb070, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    runner.scale.set(0.6, 0.6, 1); g.add(runner); zz.push(runner);
    updaters.push((t, P, dark, dt) => {
      if (P < 0.2 || P > 2.4) return;
      tick(dt);
      runner.position.copy(zigCurve.getPointAt((((t * 0.09) % 1) + 1) % 1));
    });
  }

  /* ===== 2 · La box : le connecteur SC/APC se branche, les voyants s'allument ===== */
  let plugged = false;
  const ont = {};
  {
    const g = station(2); g.position.set(0, 0, -76);
    const white = new THREE.MeshStandardMaterial({ color: 0xd6dbe2, roughness: 0.5, metalness: 0.02, envMapIntensity: 0.35 });
    const body = new THREE.Mesh(new RoundedBoxGeometry(3.2, 4.2, 0.9, 4, 0.2), white); g.add(body);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 4.0), new THREE.MeshStandardMaterial({
      transparent: true, roughness: 0.5,
      map: canvasTexture(600, 800, (c, w, h) => {
        c.fillStyle = '#5f6878'; c.font = '600 38px Geist, system-ui, sans-serif'; c.fillText('GPON · ONT', 70, 110);
        c.font = '500 30px "Geist Mono", ui-monospace, monospace';
        ['POWER', 'PON', 'LOS', 'LAN'].forEach((s, i) => c.fillText(s, 150, 252 + i * 90));
        c.strokeStyle = 'rgba(13,19,32,0.12)'; c.lineWidth = 4; c.strokeRect(40, 40, w - 80, h - 80);
        c.fillStyle = '#9aa3b2'; c.font = '500 24px "Geist Mono", monospace'; c.fillText('Fibre · 1490 / 1310 nm', 70, 700);
      }),
    }));
    face.position.z = 0.452; g.add(face);
    const ledGeo = new THREE.SphereGeometry(0.07, 16, 12);
    const mk = (hex) => new THREE.MeshStandardMaterial({ color: 0x2a2f38, emissive: new THREE.Color(hex), emissiveIntensity: 0, toneMapped: false });
    ont.leds = { power: mk('#3ddc84'), pon: mk('#3ddc84'), los: mk('#ff3b3b'), lan: mk('#3ddc84') };
    ['power', 'pon', 'los', 'lan'].forEach((k, i) => {
      const led = new THREE.Mesh(ledGeo, ont.leds[k]); led.position.set(-0.98, 0.8 - i * 0.45, 0.47); g.add(led);
    });
    // adaptateur SC/APC vert sous la box
    const adapter = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.28, 0.5), new THREE.MeshStandardMaterial({ color: 0x1f9d4c, roughness: 0.4 }));
    adapter.position.set(0.6, -2.22, 0); g.add(adapter);
    // connecteur : corps vert, manchon gris, câble jaune monomode
    const plug = new THREE.Group();
    const green = new THREE.MeshStandardMaterial({ color: 0x24b058, roughness: 0.38 });
    const pBody = new THREE.Mesh(new RoundedBoxGeometry(0.36, 0.95, 0.36, 2, 0.04), green); pBody.position.y = 0.0; plug.add(pBody);
    const ferrule = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.22, 12), new THREE.MeshStandardMaterial({ color: 0xf4efe2, roughness: 0.3 }));
    ferrule.position.y = 0.58; plug.add(ferrule);
    const boot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.07, 0.8, 16), new THREE.MeshStandardMaterial({ color: 0x8b929c, roughness: 0.6 }));
    boot.position.y = -0.88; plug.add(boot);
    g.add(plug);
    const yellow = new THREE.MeshStandardMaterial({ color: 0xf2c230, roughness: 0.5 });
    let cable = null, lastY = null;
    function placePlug(k) {
      const y = -4.1 + k * 1.37; // -4.1 débranché → -2.73 branché
      plug.position.set(0.6, y, 0);
      if (lastY !== null && Math.abs(lastY - y) < 0.004) return;
      lastY = y;
      const curve = new THREE.CatmullRomCurve3([v3(0.6, y - 1.25, 0), v3(0.6, y - 2.4, 0.2), v3(0.2, -6, 6), v3(0, -3, 14), v3(0, 0, 18)]);
      if (cable) { cable.geometry.dispose(); g.remove(cable); }
      cable = new THREE.Mesh(new THREE.TubeGeometry(curve, 64, 0.05, 8, false), yellow); g.add(cable);
    }
    ont.placePlug = placePlug; placePlug(0);
    // câble Ethernet bleu : de la box au Raspberry Pi
    const eth = new THREE.CatmullRomCurve3([v3(0.2, 1.4, -0.46), v3(0.4, 1.9, -3), v3(-0.5, 0.2, -12), v3(-0.9, 0.6, -21), v3(-1.1, 0.75, -23.6)]);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(eth, 100, 0.045, 8, false), new THREE.MeshStandardMaterial({ color: 0x2f6fe4, roughness: 0.45 })));
    ont.group = g;
  }

  /* ===== 3 · Le Raspberry Pi : il se démonte, une onde vocale le traverse ===== */
  const piRef = {};
  {
    const g = station(3); g.position.set(0, 0.3, -100);
    const { group, setExplode, materials } = buildPi();
    Object.values(materials).forEach((m) => { m.envMapIntensity = m.metalness > 0.5 ? 0.7 : 0.35; });
    group.scale.setScalar(0.034); g.add(group);
    piRef.group = group; piRef.setExplode = setExplode;
    const waves = FIBRES.map((c, i) => {
      const n = 160, geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
      const line = new THREE.LineLoop(geo, new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, toneMapped: false }));
      line.position.y = -0.2 + i * 0.05; g.add(line);
      return { geo, n, r: 2.55 + i * 0.32, ph: i * 1.7 };
    });
    piRef.waves = waves;
    updaters.push((t, P) => {
      if (P < 2.2 || P > 4.3) return;
      const talk = 0.5 + 0.5 * Math.sin(t * 2.1) * Math.sin(t * 0.7 + 1); // parole simulée : salves et silences
      waves.forEach((w) => {
        const a = w.geo.attributes.position.array;
        for (let i = 0; i < w.n; i++) {
          const th = (i / w.n) * Math.PI * 2;
          const r = w.r + talk * 0.16 * Math.sin(th * 9 + t * 5 + w.ph) * Math.sin(th * 3 - t * 2.3);
          a[i * 3] = Math.cos(th) * r; a[i * 3 + 1] = 0; a[i * 3 + 2] = Math.sin(th) * r;
        }
        w.geo.attributes.position.needsUpdate = true;
      });
    });
  }

  /* ===== Tunnel WireGuard : du Pi au serveur, chiffré ===== */
  {
    const g = station(3.5); g.position.y = 0.7;
    rings(g, { z0: -105, z1: -123, step: 2.25, radius: 1.9, color: 0x3ddc84, opacity: 0.4 });
    const tick = stream(g, { z0: -104, z1: -124, radius: 1.2, count: full ? 90 : 40, colors: [COL.green, new THREE.Color('#bff5d7')], speed: 9, len: 0.4 });
    updaters.push((t, P, d, dt) => { if (P > 2.8 && P < 4.6) tick(dt); });
  }

  /* ===== 4 · Serveurs et projets : des écrans qui flottent ===== */
  const screens = [];
  {
    const g = station(4);
    const rackMat = new THREE.MeshStandardMaterial({ color: 0x1b202b, roughness: 0.45, metalness: 0.6 });
    const unitMat = new THREE.MeshStandardMaterial({ color: 0x2a3140, roughness: 0.5, metalness: 0.5 });
    const ledsMesh = [];
    for (const [x, z] of [[-3.8, -141.5], [4.2, -143]]) {
      const rack = new THREE.Group(); rack.position.set(x, 0, z); g.add(rack);
      rack.add(new THREE.Mesh(new RoundedBoxGeometry(2.2, 5.2, 1.6, 3, 0.06), rackMat));
      const leds = new THREE.InstancedMesh(new THREE.BoxGeometry(0.06, 0.06, 0.02), new THREE.MeshBasicMaterial({ toneMapped: false }), 10 * 6);
      const m = new THREE.Matrix4(); let k = 0;
      for (let u = 0; u < 10; u++) {
        const unit = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.4, 0.04), unitMat);
        unit.position.set(0, 2.2 - u * 0.48, 0.81); rack.add(unit);
        for (let j = 0; j < 6; j++) { m.makeTranslation(0.45 + j * 0.1, 2.2 - u * 0.48, 0.84); leds.setMatrixAt(k++, m); }
      }
      rack.add(leds); ledsMesh.push(leds);
    }
    const ledCols = [new THREE.Color('#3ddc84').multiplyScalar(2), new THREE.Color('#4d8dff').multiplyScalar(2), new THREE.Color('#1a2230')];
    let ledClock = 0;
    const PROJ = [
      { name: 'PITCHMYSITE', kind: 'SaaS · 2026', img: 'assets/img/site-pitchmysite.webp', href: 'pitchmysite.html', aspect: 1.6 },
      { name: 'AL KAREEM', kind: 'E-commerce · 3G', img: 'assets/img/site-alkareem.webp', href: 'alkareem.html', aspect: 2.0 },
      { name: 'FLEET COMMANDER', kind: 'SaaS · gestion de flotte', img: 'assets/img/site-fleet.webp', href: 'https://manager-pro-weld.vercel.app/', aspect: 1.6 },
      { name: 'NETWAVE STUDIO', kind: 'Studio · 2023', img: 'assets/img/site-netwave.webp', href: 'https://www.netwave-studio.company/', aspect: 1.6 },
      { name: 'SCRAPER LÉGENDE', kind: 'Python · veille', img: 'assets/img/scraper-1.webp', href: 'projets.html', aspect: 1.333 },
    ];
    const loader = new THREE.TextureLoader();
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x10141c, roughness: 0.35, metalness: 0.6, emissive: new THREE.Color('#2f6fe4'), emissiveIntensity: 0 });
    PROJ.forEach((p, i) => {
      const x = (i - 2) * 3.65;
      const sg = new THREE.Group(); sg.position.set(x, [0.25, 0.95, 0.35, 1.0, 0.25][i], -134 - Math.abs(x) * 0.18); sg.rotation.y = -x * 0.05;
      const frame = new THREE.Mesh(new RoundedBoxGeometry(3.36, 2.16, 0.08, 2, 0.04), frameMat.clone()); sg.add(frame);
      const tex = loader.load(p.img, () => onEvent('asset'));
      tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
      if (p.aspect > 1.6) { tex.repeat.x = 1.6 / p.aspect; tex.offset.x = (1 - tex.repeat.x) / 2; }
      if (p.aspect < 1.6) { tex.repeat.y = p.aspect / 1.6; tex.offset.y = 1 - tex.repeat.y; }
      const shot = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 2.0), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
      shot.position.z = 0.045; sg.add(shot);
      const label = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 0.4), new THREE.MeshBasicMaterial({
        transparent: true, toneMapped: false, depthWrite: false,
        map: canvasTexture(640, 80, (c) => {
          c.fillStyle = '#eef1f6'; c.font = '600 30px "Geist Mono", ui-monospace, monospace'; c.fillText(p.name, 0, 34);
          c.fillStyle = '#93a0b5'; c.font = '400 24px "Geist Mono", ui-monospace, monospace'; c.fillText(p.kind + '  →', 0, 70);
        }),
      }));
      label.position.set(0, -1.38, 0.02); sg.add(label);
      g.add(sg);
      screens.push({ ...p, group: sg, frame, shot, baseY: sg.position.y, hover: 0, i });
    });
    updaters.push((t, P, d, dt) => {
      if (P < 3.3 || P > 5.4) return;
      screens.forEach((s) => {
        s.group.position.y = s.baseY + Math.sin(t * 0.9 + s.i) * 0.08;
        const sc = 1 + s.hover * 0.07; s.group.scale.setScalar(sc);
        s.frame.material.emissiveIntensity = s.hover * 1.4;
      });
      ledClock += dt;
      if (ledClock > 0.12) {
        ledClock = 0;
        ledsMesh.forEach((lm) => { for (let i = 0; i < lm.count; i++) if (Math.random() < 0.25) lm.setColorAt(i, ledCols[Math.random() < 0.6 ? 2 : (Math.random() < 0.6 ? 0 : 1)]); lm.instanceColor.needsUpdate = true; });
      }
    });
  }

  /* ===== 5 · L'écran : on plonge dans le téléphone ===== */
  {
    const g = station(5); g.position.set(0, 0, -161);
    g.add(new THREE.Mesh(new RoundedBoxGeometry(2.3, 4.7, 0.24, 4, 0.3), new THREE.MeshStandardMaterial({ color: 0x14171c, roughness: 0.3, metalness: 0.7 })));
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.12, 4.5), new THREE.MeshBasicMaterial({
      toneMapped: false,
      map: canvasTexture(424, 900, (c, w, h) => {
        c.fillStyle = '#f4f6f9'; c.fillRect(0, 0, w, h);
        ['#2f6fe4', '#e8731f', '#1fa463'].forEach((col, i) => {
          c.strokeStyle = col; c.lineWidth = 5; c.beginPath(); c.moveTo(-10, 560 + i * 16);
          c.bezierCurveTo(140, 470 + i * 16, 260, 700 + i * 16, 440, 600 + i * 16); c.stroke();
        });
        c.fillStyle = '#0d1320'; c.beginPath(); c.roundRect(40, 70, 64, 64, 16); c.fill();
        c.fillStyle = '#fff'; c.font = '800 26px "Bricolage Grotesque", system-ui, sans-serif'; c.fillText('AD', 53, 112);
        c.fillStyle = '#0d1320'; c.font = '800 60px "Bricolage Grotesque", system-ui, sans-serif';
        c.fillText('Le signal', 40, 260); c.fillText('est arrivé.', 40, 326);
        c.fillStyle = '#5f6878'; c.font = '400 26px Geist, system-ui, sans-serif'; c.fillText('Branchons la conversation.', 40, 385);
        c.fillStyle = '#0d1320'; c.beginPath(); c.roundRect(40, 760, 344, 72, 36); c.fill();
        c.fillStyle = '#fff'; c.font = '500 22px "Geist Mono", monospace'; c.fillText('ME CONTACTER →', 118, 805);
      }),
    }));
    screen.position.z = 0.125; g.add(screen);
  }

  /* ===== Poussière lumineuse le long du trajet (profondeur, vitesse) ===== */
  const dust = (() => {
    const n = full ? 1800 : 700, a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { a[i * 3] = (Math.random() - 0.5) * 22; a[i * 3 + 1] = (Math.random() - 0.5) * 12; a[i * 3 + 2] = 6 - Math.random() * 175; }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(a, 3));
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.045, map: glow, color: 0xbfd2ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
    scene.add(pts); return pts;
  })();

  /* ===== Le signal que l'on suit ===== */
  const guide = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: 0xffffff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  guide.scale.set(0.42, 0.42, 1); scene.add(guide);
  const guideHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: 0x2f6fe4, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending }));
  guideHalo.scale.set(1.4, 1.4, 1); scene.add(guideHalo);
  const GUIDE_COL = [COL.blue, COL.blue, COL.orange, COL.green, COL.blue, COL.blue];

  /* ===== Lueurs (bloom), niveau complet seulement ===== */
  let composer = null, bloom = null;
  if (full) {
    try {
      const [{ EffectComposer }, { RenderPass }, { UnrealBloomPass }, { OutputPass }] = await Promise.all([
        import('three/addons/postprocessing/EffectComposer.js'), import('three/addons/postprocessing/RenderPass.js'),
        import('three/addons/postprocessing/UnrealBloomPass.js'), import('three/addons/postprocessing/OutputPass.js'),
      ]);
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.55, 0.5, 1.15);
      composer.addPass(bloom); composer.addPass(new OutputPass());
    } catch (e) { composer = null; }
  }

  /* ===== Caméra : progression continue P (0 → 5,99) ===== */
  const pose = { pos: new THREE.Vector3(), look: new THREE.Vector3() };
  const A = { pos: new THREE.Vector3(), look: new THREE.Vector3() }, B = { pos: new THREE.Vector3(), look: new THREE.Vector3() };
  const curves = VIA.map((via, i) => {
    holdPose(i, 1, A); holdPose(i + 1, 0, B);
    return new THREE.CatmullRomCurve3([A.pos.clone(), ...via, B.pos.clone()], false, 'centripetal');
  });
  function cameraAt(P) {
    const i = Math.min(STATIONS - 1, Math.floor(P)), l = P - i;
    if (i === STATIONS - 1 || l <= HOLD) return { ...holdPose(i, i === STATIONS - 1 ? clamp(l / 0.75, 0, 1) : l / HOLD, pose), i, e: 0 };
    const e = easeIO((l - HOLD) / (1 - HOLD));
    holdPose(i, 1, A); holdPose(i + 1, 0, B);
    pose.pos.copy(curves[i].getPointAt(e));
    pose.look.copy(A.look).lerp(B.look, smooth(e, 0.15, 0.85));
    return { ...pose, i, e };
  }

  /* ===== État, entrées ===== */
  let target = 0, P = 0, paused = false, running = false, raf = 0, last = performance.now(), time = 0;
  let pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  let W = 1, H = 1, narrow = false, shift = 0;
  const bgCol = new THREE.Color(), tmp = new THREE.Vector3(), fwd = new THREE.Vector3();
  const raycaster = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let hovered = null;
  const frameTimes = [];

  function resize() {
    W = canvas.clientWidth || window.innerWidth; H = canvas.clientHeight || window.innerHeight;
    narrow = W < 860;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.fov = narrow ? 58 : 42;
    applyShift(shift);
    if (composer) { composer.setSize(W, H); bloom.resolution.set(W / 2, H / 2); }
  }
  function applyShift(s) {
    shift = s;
    if (narrow) camera.setViewOffset(W, H, 0, H * 0.23 * s, W, H);
    else camera.setViewOffset(W, H, -W * 0.2 * s, 0, W, H);
    camera.updateProjectionMatrix();
  }

  function render(dt) {
    P += (target - P) * Math.min(1, dt * 6);
    if (Math.abs(target - P) < 1e-4) P = target;
    const cam = cameraAt(P);
    const i = cam.i, l = P - i;
    // couleur du ciel et brouillard
    const j = Math.min(STATIONS - 1, i + 1);
    const mix = cam.e;
    bgCol.copy(BG[i]).lerp(BG[j], mix);
    scene.background.copy(bgCol); scene.fog.color.copy(bgCol);
    scene.fog.near = THREE.MathUtils.lerp(FOG[i][0], FOG[j][0], mix);
    scene.fog.far = THREE.MathUtils.lerp(FOG[i][1], FOG[j][1], mix);
    const dark = THREE.MathUtils.lerp(DARK[i], DARK[j], mix);
    hemi.intensity = 0.9 - dark * 0.45; key.intensity = 1.6 - dark * 0.6;
    applyShift(THREE.MathUtils.lerp(SHIFT[i], SHIFT[j], mix));
    // caméra + léger mouvement à la souris
    pointer.sx += (pointer.x - pointer.sx) * 0.05; pointer.sy += (pointer.y - pointer.sy) * 0.05;
    camera.position.copy(cam.pos);
    camera.lookAt(cam.look);
    camera.translateX(pointer.sx * 0.35); camera.translateY(-pointer.sy * 0.22);
    // stations proches seulement
    groups.forEach((gr) => { gr.group.visible = Math.abs(gr.at - P) < 1.75; });
    // animations
    const t = paused ? time : (time += dt);
    updaters.forEach((u) => u(t, P, dark, paused ? 0 : dt));
    // box : le connecteur suit le défilement
    if (P > 1.3 && P < 3.2) {
      const k = i === 2 ? smooth(l, 0.06, 0.4) : (i < 2 ? 0 : 1);
      ont.placePlug(k);
      const on = k > 0.985;
      if (on !== plugged) { plugged = on; onEvent('plug', on); }
      const L = ont.leds, blink = (Math.sin(t * 9) > 0 ? 1 : 0.15);
      L.power.emissiveIntensity = 2.2;
      L.pon.emissiveIntensity = on ? 2.4 : 0;
      L.los.emissiveIntensity = on ? 0 : 2.4 * blink;
      L.lan.emissiveIntensity = on ? 2.4 * (0.4 + 0.6 * Math.abs(Math.sin(t * 13) * Math.sin(t * 5.3))) : 0;
    }
    // Pi : éclatement et rotation
    if (P > 2.2 && P < 4.3) {
      const k = i === 3 ? easeIO(smooth(l, 0.04, 0.45)) : (i < 3 ? 0 : 1);
      piRef.setExplode(k);
      piRef.group.rotation.y = -0.5 + k * 0.9 + Math.sin(t * 0.3) * 0.08;
    }
    // poussière et guide
    dust.material.opacity = 0.55 * dark;
    fwd.set(0, 0, -1).applyQuaternion(camera.quaternion);
    tmp.copy(camera.position).addScaledVector(fwd, 3.2);
    tmp.y -= 0.5 + Math.sin(t * 1.7) * 0.05; tmp.x += Math.sin(t * 1.1) * 0.08;
    guide.position.lerp(tmp, 0.09); guideHalo.position.copy(guide.position);
    const gc = GUIDE_COL[i].clone().lerp(GUIDE_COL[j], mix);
    guideHalo.material.color.copy(gc);
    const gOn = (i === 0 && l < 0.5) || i === STATIONS - 1 ? 0 : 1;
    guide.material.opacity += ((gOn ? 0.95 : 0) - guide.material.opacity) * 0.08;
    guideHalo.material.opacity = guide.material.opacity * 0.55 * (0.8 + 0.2 * Math.sin(t * 4));
    // rendu
    if (composer && dark > 0.04) { bloom.strength = 0.6 * dark; composer.render(); }
    else renderer.render(scene, camera);
    onEvent('frame', { P, i, l, dark });
  }

  function loop(now) {
    raf = 0;
    const dt = clamp((now - last) / 1000, 0, 0.05); last = now;
    frameTimes.push(dt); if (frameTimes.length > 90) frameTimes.shift();
    render(dt);
    if (running) raf = requestAnimationFrame(loop);
  }

  function pick(clientX, clientY) {
    if (Math.abs(P - 4.3) > 0.9) return null;
    const r = canvas.getBoundingClientRect();
    ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(screens.map((s) => s.shot), false)[0];
    return hit ? screens.find((s) => s.shot === hit.object) : null;
  }
  function setHover(s) {
    if (s === hovered) return; hovered = s;
    screens.forEach((x) => { const to = x === s ? 1 : 0; x._to = to; });
  }
  updaters.push((t, Pp, d, dt) => { screens.forEach((x) => { x.hover += ((x._to || 0) - x.hover) * Math.min(1, (dt || 0.016) * 10); }); });

  window.addEventListener('resize', resize);
  resize();
  render(0.016);

  return {
    tier,
    setTarget(v) { if (Number.isFinite(v)) target = clamp(v, 0, STATIONS - 0.001); },
    jump(v) { if (Number.isFinite(v)) target = P = clamp(v, 0, STATIONS - 0.001); },
    setPointer(x, y) { pointer.x = x; pointer.y = y; },
    setPaused(v) { paused = v; },
    start() { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(loop); },
    stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; },
    fps() { if (frameTimes.length < 60) return 60; return 1 / (frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length); },
    degrade() { renderer.setPixelRatio(1); composer = null; dust.visible = false; resize(); },
    pick, setHover,
    screens,
    get plugged() { return plugged; },
    dispose() { this.stop(); renderer.dispose(); },
  };
}
