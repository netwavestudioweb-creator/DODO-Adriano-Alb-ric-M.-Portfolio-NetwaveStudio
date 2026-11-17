// L'orbe-signal : trois fibres (bleu web, orange réseau, vert IA) qui convergent vers un nuage
// de particules lumineuses. Objet signature du portfolio, en 3D temps réel (Three.js).
import * as THREE from 'three';

function dotTexture(inner, outer) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, inner); grd.addColorStop(0.45, outer); grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export function mountSignal(host, opts = {}) {
  const reduce = !!opts.reduce;
  const small = window.innerWidth < 760;
  const canvas = document.createElement('canvas');
  canvas.className = 'orb-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 7.2);

  const world = new THREE.Group();
  scene.add(world);

  // ---------- Nuage de particules ----------
  const N = small ? 1800 : 3600;
  const pos = new Float32Array(N * 3), col = new Float32Array(N * 3), seed = new Float32Array(N);
  const palette = [new THREE.Color('#2f6fe4'), new THREE.Color('#e8731f'), new THREE.Color('#1fa463'), new THREE.Color('#9aa6bb'), new THREE.Color('#c9d3e3')];
  const weights = [0.24, 0.2, 0.18, 0.2, 0.18];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = golden * i;
    const rad = 1.55 * (0.72 + Math.pow(Math.random(), 0.6) * 0.38);
    pos[i * 3] = Math.cos(th) * r * rad; pos[i * 3 + 1] = y * rad; pos[i * 3 + 2] = Math.sin(th) * r * rad;
    let p = Math.random(), k = 0; while (p > weights[k] && k < weights.length - 1) { p -= weights[k]; k++; }
    const cc = palette[k]; col[i * 3] = cc.r; col[i * 3 + 1] = cc.g; col[i * 3 + 2] = cc.b;
    seed[i] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const base = pos.slice();
  const points = new THREE.Points(geo, new THREE.PointsMaterial({
    size: small ? 0.06 : 0.05, map: dotTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0.85)'),
    vertexColors: true, transparent: true, opacity: 0.92, depthWrite: false, sizeAttenuation: true,
  }));
  world.add(points);

  // ---------- Cœur lumineux ----------
  const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: dotTexture('rgba(255,236,214,1)', 'rgba(255,140,60,0.55)'), transparent: true, depthWrite: false }));
  core.scale.set(2.3, 2.3, 1); world.add(core);
  const heart = new THREE.Sprite(new THREE.SpriteMaterial({ map: dotTexture('rgba(255,255,255,1)', 'rgba(255,214,170,0.8)'), transparent: true, depthWrite: false }));
  heart.scale.set(0.8, 0.8, 1); world.add(heart);

  // ---------- Trois fibres qui arrivent dans l'orbe ----------
  const fibreCols = ['#2f6fe4', '#e8731f', '#1fa463'];
  const curves = fibreCols.map((c, i) => {
    const o = (i - 1) * 0.16;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.25, -2.0 + o, 0.1), new THREE.Vector3(-1.8, -1.55 + o, 0.25),
      new THREE.Vector3(-1.35, -1.05 + o * 0.6, 0.3), new THREE.Vector3(-0.9, -0.55 + o * 0.3, 0.2),
    ]);
    // la fibre apparaît en fondu : 12 tronçons dont l'opacité monte de 0 à 1
    const parts = 12;
    for (let s = 0; s < parts; s++) {
      const t0 = s / parts, t1 = (s + 1) / parts + 0.004;
      const pts = []; for (let q = 0; q <= 6; q++) pts.push(curve.getPoint(Math.min(1, t0 + (t1 - t0) * q / 6)));
      const seg = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 8, 0.035, 8, false),
        new THREE.MeshBasicMaterial({ color: c, transparent: true, depthWrite: false, opacity: 0.95 * THREE.MathUtils.smoothstep(s / (parts - 1), 0, 0.65) })
      );
      world.add(seg);
    }
    const spark = new THREE.Sprite(new THREE.SpriteMaterial({ map: dotTexture('rgba(255,255,255,1)', c), transparent: true, depthWrite: false }));
    spark.scale.set(0.42, 0.42, 1); world.add(spark);
    return { curve, spark, off: i / 3 };
  });

  // ---------- Interaction : l'orbe suit doucement la souris ----------
  let mx = 0, my = 0, tx = 0, ty = 0;
  window.addEventListener('pointermove', (e) => { tx = (e.clientX / window.innerWidth - 0.5) * 0.5; ty = (e.clientY / window.innerHeight - 0.5) * 0.35; }, { passive: true });

  function resize() {
    const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    world.position.x = w < 520 ? 0 : 0.35;
    render(performance.now());
  }
  new ResizeObserver(resize).observe(host);

  function render(t) {
    const s = t * 0.001;
    const p = geo.attributes.position.array;
    for (let i = 0; i < N; i++) {
      const b = 1 + Math.sin(s * 1.3 + seed[i] * 6.28) * 0.035;
      p[i * 3] = base[i * 3] * b; p[i * 3 + 1] = base[i * 3 + 1] * b; p[i * 3 + 2] = base[i * 3 + 2] * b;
    }
    geo.attributes.position.needsUpdate = true;
    points.rotation.y = s * 0.12; points.rotation.x = Math.sin(s * 0.2) * 0.12;
    const breathe = 1 + Math.sin(s * 1.6) * 0.06;
    core.scale.set(2.3 * breathe, 2.3 * breathe, 1);
    curves.forEach((f) => { const q = (s * 0.35 + f.off) % 1; f.spark.position.copy(f.curve.getPoint(q)); f.spark.material.opacity = Math.sin(q * Math.PI); });
    mx += (tx - mx) * 0.05; my += (ty - my) * 0.05;
    world.rotation.y = mx; world.rotation.x = my;
    renderer.render(scene, camera);
  }

  let visible = true, raf = 0;
  function loop(t) { raf = 0; render(t); if (visible && !reduce) raf = requestAnimationFrame(loop); }
  new IntersectionObserver((en) => { visible = en[0].isIntersecting; if (visible && !raf && !reduce) raf = requestAnimationFrame(loop); }).observe(host);
  resize();
  host.classList.add('is-3d');
  if (!reduce) raf = requestAnimationFrame(loop);
}
