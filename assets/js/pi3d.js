// Raspberry Pi 3 Model B en 3D temps réel (Three.js), à l'échelle : 1 unité = 1 mm.
// L'éclatement suit la variable CSS --k posée par main.js sur .pi-scene ; on peut le faire tourner à la souris.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export function mountPi(host, scene3d) {
  const canvas = document.createElement('canvas');
  canvas.className = 'pi-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.85;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(23, 1, 1, 2000);
  camera.position.set(215, 245, 265);
  camera.lookAt(0, 6, 0);

  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(60, 160, 80);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -150, right: 150, top: 150, bottom: -150, near: 1, far: 500 });
  scene.add(key, new THREE.HemisphereLight(0xffffff, 0xdfe5ee, 0.6));

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), new THREE.ShadowMaterial({ opacity: 0.14 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -48; ground.receiveShadow = true;
  scene.add(ground);

  // ---------- Textures dessinées en code ----------
  function canvasTexture(w, h, draw) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    return t;
  }
  // PCB : vernis vert, pistes cuivrées, sérigraphie
  const pcbTex = canvasTexture(1700, 1120, (g, w, h) => {
    const s = w / 85;
    g.fillStyle = '#125c2b'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(70,170,100,0.55)'; g.lineWidth = 0.35 * s; g.lineCap = 'round';
    const tr = (pts) => { g.beginPath(); g.moveTo(pts[0] * s, pts[1] * s); for (let i = 2; i < pts.length; i += 2) g.lineTo(pts[i] * s, pts[i + 1] * s); g.stroke(); };
    for (let i = 0; i < 14; i++) tr([22 + i, 21, 22 + i, 12 - (i % 3), 10 + i * 3, 9]);
    for (let i = 0; i < 10; i++) tr([36, 23 + i * 1.2, 50, 23 + i * 1.2, 57, 29 + i * 0.5]);
    for (let i = 0; i < 8; i++) tr([29, 36, 29 - i * 1.4, 44, 32 - i, 51]);
    for (let i = 0; i < 6; i++) tr([65, 30 + i, 68, 30 + i, 68, 10 + i * 3]);
    g.fillStyle = 'rgba(240,240,230,0.85)'; g.font = `${2.2 * s}px monospace`;
    g.fillText('Raspberry Pi 3 Model B V1.2', 8 * s, 18 * s);
    g.font = `${1.4 * s}px monospace`; g.fillText('© Raspberry Pi 2015', 8 * s, 20.5 * s);
    g.strokeStyle = 'rgba(240,240,230,0.7)'; g.lineWidth = 0.25 * s; g.strokeRect(21.3 * s, 20.8 * s, 15.4 * s, 15.4 * s);
  });
  const socTex = canvasTexture(256, 256, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, w, h); grd.addColorStop(0, '#d4d8de'); grd.addColorStop(1, '#a7aeb8');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
    g.fillStyle = '#4b525c'; g.font = 'bold 30px monospace'; g.fillText('BCM2837', 48, 120); g.font = '20px monospace'; g.fillText('RIFBG', 80, 156);
  });

  const M = {
    pcb: new THREE.MeshStandardMaterial({ map: pcbTex, roughness: 0.55, metalness: 0.05 }),
    pcbSide: new THREE.MeshStandardMaterial({ color: 0x0f4d24, roughness: 0.6 }),
    metal: new THREE.MeshStandardMaterial({ color: 0xd5dae1, roughness: 0.28, metalness: 0.95 }),
    alu: new THREE.MeshStandardMaterial({ color: 0xc9ced6, roughness: 0.35, metalness: 0.9 }),
    black: new THREE.MeshStandardMaterial({ color: 0x17191e, roughness: 0.6 }),
    chip: new THREE.MeshStandardMaterial({ color: 0x2a2d33, roughness: 0.45 }),
    soc: new THREE.MeshStandardMaterial({ map: socTex, roughness: 0.3, metalness: 0.6 }),
    gold: new THREE.MeshStandardMaterial({ color: 0xd8b14a, roughness: 0.25, metalness: 1 }),
    beige: new THREE.MeshStandardMaterial({ color: 0xf1ece0, roughness: 0.6 }),
    red: new THREE.MeshStandardMaterial({ color: 0x9e0f36, roughness: 0.42 }),
    white: new THREE.MeshStandardMaterial({ color: 0xe9e9e4, roughness: 0.38 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x0c0d10, roughness: 0.8 }),
    sd: new THREE.MeshStandardMaterial({ color: 0x1d2a44, roughness: 0.5 }),
  };
  function box(w, h, d, mat, x, y, z, parent, r = 0) {
    const g = r > 0 ? new RoundedBoxGeometry(w, h, d, 3, r) : new THREE.BoxGeometry(w, h, d);
    const m = new THREE.Mesh(g, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true;
    parent.add(m); return m;
  }
  const X = (x) => x - 42.5, Z = (z) => z - 28, top = 0.8;

  // ---------- Carte ----------
  const board = new THREE.Group();
  const pcb = new THREE.Mesh(new THREE.BoxGeometry(85, 1.6, 56), [M.pcbSide, M.pcbSide, M.pcb, M.pcbSide, M.pcbSide, M.pcbSide]);
  pcb.castShadow = pcb.receiveShadow = true; board.add(pcb);
  for (const [x, z] of [[3.5, 3.5], [61.5, 3.5], [3.5, 52.5], [61.5, 52.5]]) {
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.9, 1.7, 24), M.gold); ring.position.set(X(x), 0, Z(z)); board.add(ring);
    const hole = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.35, 1.8, 24), M.dark); hole.position.set(X(x), 0, Z(z)); board.add(hole);
  }
  box(50.8, 2.5, 5.1, M.black, X(32.5), top + 1.25, Z(3.55), board);
  const pins = new THREE.InstancedMesh(new THREE.BoxGeometry(0.64, 6, 0.64), M.gold, 40);
  let k = 0; const mtx = new THREE.Matrix4();
  for (let i = 0; i < 20; i++) for (const zz of [2.27, 4.81]) { mtx.setPosition(X(8.37 + 2.54 * i), top + 3, Z(zz)); pins.setMatrixAt(k++, mtx); }
  pins.castShadow = true; board.add(pins);
  box(14, 1.2, 14, M.soc, X(29), top + 0.6, Z(28.5), board, 0.3);
  box(8, 1, 8, M.chip, X(61), top + 0.5, Z(32), board, 0.2);
  box(12, 1, 12, M.chip, X(29), -1.3, Z(28.5), board, 0.2); // mémoire LPDDR2, sous la carte
  for (const zc of [9.5, 27.5]) {
    box(17.5, 16, 15, M.metal, X(78), top + 8, Z(zc), board, 0.5);
    for (const dy of [-3.6, 3.6]) box(1, 5.2, 12.5, M.dark, X(86.8), top + 8 + dy, Z(zc), board);
  }
  box(21, 13.5, 16, M.metal, X(76.5), top + 6.75, Z(46), board, 0.5);
  box(1, 8.5, 11.5, M.dark, X(87.05), top + 6, Z(46), board);
  box(0.6, 1.6, 2, new THREE.MeshStandardMaterial({ color: 0xf2c94c, emissive: 0x9a7a10 }), X(87.4), top + 11.5, Z(40.5), board);
  box(0.6, 1.6, 2, new THREE.MeshStandardMaterial({ color: 0x3ddc84, emissive: 0x1a7a45 }), X(87.4), top + 11.5, Z(51.5), board);
  box(8, 3, 5.6, M.metal, X(10.6), top + 1.5, Z(54.3), board, 0.4);
  box(15, 6, 11.6, M.metal, X(32), top + 3, Z(51.6), board, 0.4);
  box(11, 3, 0.8, M.dark, X(32), top + 3.4, Z(57.45), board);
  box(7, 6, 13, M.black, X(53.5), top + 3, Z(50.5), board, 0.6);
  const jack = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 3, 24), M.black);
  jack.rotation.x = Math.PI / 2; jack.position.set(X(53.5), top + 3, Z(57.5)); board.add(jack);
  box(3, 5.5, 17, M.beige, X(45), top + 2.75, Z(42.5), board, 0.3);
  box(3, 5.5, 17, M.beige, X(3), top + 2.75, Z(25.5), board, 0.3);
  box(5, 1, 2.4, M.beige, X(4), top + 0.5, Z(47.7), board);
  // carte microSD (Debian), dépassant du bord gauche sous la carte
  const sd = box(15, 1, 11, M.sd, X(-2), -1.4, Z(28), board, 0.3);

  const sink = new THREE.Group();
  box(15, 1.6, 15, M.alu, X(29), 0, Z(28.5), sink, 0.3);
  for (let i = 0; i < 6; i++) box(1, 6, 15, M.alu, X(29) - 6.25 + i * 2.5, 3.8, Z(28.5), sink);

  const base = new THREE.Group();
  box(92, 2, 63, M.red, 0, 0, 0, base, 1.5);
  box(92, 9, 2, M.red, 0, 5.5, -30.5, base, 0.8);
  box(92, 9, 2, M.red, 0, 5.5, 30.5, base, 0.8);
  box(2, 9, 63, M.red, -45, 5.5, 0, base, 0.8);
  box(2, 9, 63, M.red, 45, 5.5, 0, base, 0.8);
  const lid = new THREE.Group();
  box(92, 2.4, 63, M.white, 0, 0, 0, lid, 1.6);
  box(52, 0.6, 6, M.dark, X(32.5), 1.0, Z(3.55), lid);

  const pi = new THREE.Group();
  pi.add(base, board, sink, lid);
  pi.position.set(-4, 6, 4);
  scene.add(pi);

  // ---------- Interaction : rotation à la souris, retour en douceur ----------
  let yaw = 0, targetYaw = 0, drag = false, lastX = 0;
  canvas.style.cursor = 'grab';
  canvas.addEventListener('pointerdown', (e) => { drag = true; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); canvas.style.cursor = 'grabbing'; });
  canvas.addEventListener('pointermove', (e) => { if (!drag) return; targetYaw += (e.clientX - lastX) * 0.01; lastX = e.clientX; wake(); });
  const release = () => { drag = false; canvas.style.cursor = 'grab'; targetYaw = 0; wake(); };
  canvas.addEventListener('pointerup', release); canvas.addEventListener('pointercancel', release);

  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); wake();
  }
  new ResizeObserver(resize).observe(host);

  let visible = false, raf = 0, lastK = -1;
  new IntersectionObserver((en) => { visible = en[0].isIntersecting; if (visible) wake(); }, { rootMargin: '200px' }).observe(host);
  function wake() { if (!raf && visible) raf = requestAnimationFrame(frame); }
  function frame() {
    raf = 0;
    const kv = parseFloat(getComputedStyle(scene3d).getPropertyValue('--k')) || 0;
    const e = THREE.MathUtils.clamp(kv, 0, 1);
    base.position.y = -34 * e - 9.5 * (1 - e);
    sink.position.y = top + 1.4 + 26 * e;
    lid.position.y = 12 + 58 * e;
    sd.position.x = X(-2) - 10 * e;
    yaw += (targetYaw - yaw) * 0.12;
    pi.rotation.y = -0.18 + yaw + e * 0.25;
    renderer.render(scene, camera);
    if (Math.abs(targetYaw - yaw) > 0.001 || drag || e !== lastK) { lastK = e; wake(); }
  }
  window.addEventListener('scroll', wake, { passive: true });
  resize();
  host.classList.add('is-3d');
  return { wake };
}
