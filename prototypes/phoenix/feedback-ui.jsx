// Components added for client feedback round 1. Each one is placed by feedback.js against a
// Figma layer and positioned in that layer's own artboard coordinates.
import { useEffect, useRef, useState } from 'react';
import { company, services } from '../../src/data';
import { MAP } from '../option2/mapData';
import { photos } from '../option2/photos';
import { FreightDefs, Box, Pallet, Film, Container } from './freight-art';

const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const card = name => `/option2/photos/${name}@1200.webp`;

// Amazon smile mark (Simple Icons, CC0).
function AmazonMark({ size = 40 }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="currentColor">
    <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726a17.617 17.617 0 0 1-10.951-.577 17.88 17.88 0 0 1-5.43-3.35c-.1-.074-.151-.15-.151-.22 0-.047.021-.09.051-.13zm6.565-6.218c0-1.005.247-1.863.743-2.577.495-.71 1.17-1.25 2.04-1.615.796-.335 1.756-.575 2.912-.72.39-.046 1.033-.103 1.92-.174v-.37c0-.93-.105-1.558-.3-1.875-.302-.43-.78-.65-1.44-.65h-.182c-.48.046-.896.196-1.246.46-.35.27-.575.63-.675 1.096-.06.3-.206.465-.435.51l-2.52-.315c-.248-.06-.372-.18-.372-.39 0-.046.007-.09.022-.15.247-1.29.855-2.25 1.82-2.88.976-.616 2.1-.975 3.39-1.05h.54c1.65 0 2.957.434 3.888 1.29.135.15.27.3.405.48.12.165.224.314.283.45.075.134.15.33.195.57.06.254.105.42.135.51.03.104.062.3.076.615.01.313.02.493.02.553v5.28c0 .376.06.72.165 1.036.105.313.21.54.315.674l.51.674c.09.136.136.256.136.36 0 .12-.06.226-.18.314-1.2 1.05-1.86 1.62-1.963 1.71-.165.135-.375.15-.627.045a6.517 6.517 0 0 1-.52-.496l-.317-.347a9.072 9.072 0 0 1-.31-.42l-.3-.435c-.81.886-1.603 1.44-2.4 1.665-.494.15-1.093.227-1.83.227-1.11 0-2.04-.343-2.76-1.034-.72-.69-1.08-1.665-1.08-2.94l-.05-.076zm3.753-.438c0 .566.14 1.02.425 1.364.285.34.675.512 1.155.512.045 0 .106-.007.195-.02.09-.016.134-.023.166-.023.614-.16 1.08-.553 1.424-1.178.165-.28.285-.58.36-.91.09-.32.12-.59.135-.8.015-.195.015-.54.015-1.005v-.54c-.84 0-1.484.06-1.92.18-1.275.36-1.92 1.17-1.92 2.43l-.035-.02zm9.162 7.027c.03-.06.075-.11.132-.17.362-.243.714-.41 1.05-.5a8.094 8.094 0 0 1 1.612-.24c.14-.012.28 0 .41.03.65.06 1.05.168 1.172.33.063.09.099.228.099.39v.15c0 .51-.149 1.11-.424 1.8-.278.69-.664 1.248-1.156 1.68-.073.06-.14.09-.197.09-.03 0-.06 0-.09-.012-.09-.044-.107-.12-.064-.24.54-1.26.806-2.143.806-2.64 0-.15-.03-.27-.087-.344-.145-.166-.55-.257-1.224-.257-.243 0-.533.016-.87.046-.363.045-.7.09-1 .135-.09 0-.148-.014-.18-.044-.03-.03-.036-.047-.02-.077 0-.017.006-.03.02-.063v-.06z"/>
  </svg>;
}

export function HeroVideo() {
  const video = useRef(null);
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (reduced()) { v.pause(); return; }
    // Play only while the hero is on screen; decoding off screen costs frames elsewhere on the page.
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  // H.264 first: hardware-decoded almost everywhere (AV1 falls back to slow software decoding on many laptops).
  return <span className="hero-video" aria-hidden="true">
    <video ref={video} muted loop playsInline preload="metadata" poster="/option2/media/cine-poster.webp">
      <source src="/option2/media/cine-540.mp4" type="video/mp4" />
    </video>
    <span className="hero-video-shade" />
  </span>;
}

// Home: Australia with red routes from the two depots, and the sea lane from China.
const CITIES = {
  Sydney: [786.7, 837.8], Melbourne: [709.4, 898.1], Brisbane: [809.2, 745.3], Adelaide: [630.7, 853.7],
  Perth: [349.4, 809.4], Darwin: [534.7, 546.4], Townsville: [732.4, 634.2], 'Alice Springs': [572.3, 693.5],
  China: [322, 99],
};
const ROUTES = [
  ['Sydney', 'Brisbane'], ['Brisbane', 'Townsville'], ['Sydney', 'Melbourne'], ['Melbourne', 'Adelaide'],
  ['Adelaide', 'Perth'], ['Adelaide', 'Alice Springs'], ['Alice Springs', 'Darwin'], ['Sydney', 'Alice Springs'],
];
const arc = ([x1, y1], [x2, y2], bend = .12) => {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1;
  return `M${x1} ${y1}Q${mx - dy * bend} ${my + dx * bend} ${x2} ${y2}`;
};

const PLACES = [
  { id: 'Sydney', title: 'Sydney', text: 'Head depot · Wetherill Park, NSW', routes: ['Sydney'] },
  { id: 'Melbourne', title: 'Melbourne', text: 'Warehouse · Truganina, VIC', routes: ['Melbourne'] },
  { id: 'Australia', title: 'Australia-wide', text: 'Metro, interstate and linehaul', routes: ['Sydney', 'Melbourne', 'Brisbane', 'Adelaide', 'Perth', 'Darwin', 'Townsville', 'Alice Springs'] },
  { id: 'China', title: 'China', text: 'Air and sea freight partners', routes: ['China'] },
];
// Trucks that loop along routes so the map reads as a live network.

// Pause looping CSS and SVG animations while their block is off screen (keeps scrolling smooth).
function useOffscreenPause(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      el.toggleAttribute('data-offscreen', !e.isIntersecting);
      el.querySelectorAll('svg').forEach(svg => { try { e.isIntersecting ? svg.unpauseAnimations() : svg.pauseAnimations(); } catch { /* not an SMIL root */ } });
    }, { rootMargin: '200px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
}

// Home: the network as a 3D globe on a 2D canvas, projected by hand (orthographic) so a frame
// costs ~1ms. Land, borders and Australia come from world-atlas, pre-simplified into
// /option2/media/globe.json by scripts/build-globe.mjs. Drag to spin; the places list turns the
// globe to that place. The loop only runs while the globe is on screen.
const GEO = {
  China: [121.47, 31.23], Sydney: [151.21, -33.87], Melbourne: [144.96, -37.81], Brisbane: [153.03, -27.47],
  Adelaide: [138.6, -34.93], Perth: [115.86, -31.95], Darwin: [130.84, -12.46], Townsville: [146.8, -19.26],
  'Alice Springs': [133.88, -23.7],
};
const KEY_PINS = ['China', 'Sydney', 'Melbourne'];
const VIEW = { null: [-136, 2], Sydney: [-150, 24], Melbourne: [-144, 28], Australia: [-134, 22], China: [-122, -16] };
const ZOOM = { null: 1, Sydney: 1.14, Melbourne: 1.14, Australia: 1.06, China: 1.08 };
const LEFT_LABEL = ['Melbourne', 'Adelaide', 'Perth'];
const RAD = Math.PI / 180;
const unit = (lon, lat) => { const c = Math.cos(lat * RAD); return [c * Math.cos(lon * RAD), c * Math.sin(lon * RAD), Math.sin(lat * RAD)]; };
const toXYZ = flat => { const out = new Float32Array(flat.length * 1.5); for (let i = 0, j = 0; i < flat.length; i += 2, j += 3) { const u = unit(flat[i], flat[i + 1]); out[j] = u[0]; out[j + 1] = u[1]; out[j + 2] = u[2]; } return out; };
const slerp = (a, b, t) => {
  const d = Math.acos(Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])), s = Math.sin(d) || 1;
  const ka = Math.sin((1 - t) * d) / s, kb = Math.sin(t * d) / s;
  return [a[0] * ka + b[0] * kb, a[1] * ka + b[1] * kb, a[2] * ka + b[2] * kb];
};
// A ring's bounding cap, so rings on the far side are skipped without projecting them.
const capOf = xyz => {
  let x = 0, y = 0, z = 0; for (let i = 0; i < xyz.length; i += 3) { x += xyz[i]; y += xyz[i + 1]; z += xyz[i + 2]; }
  const n = Math.hypot(x, y, z) || 1; x /= n; y /= n; z /= n;
  let min = 1; for (let i = 0; i < xyz.length; i += 3) min = Math.min(min, x * xyz[i] + y * xyz[i + 1] + z * xyz[i + 2]);
  return { c: [x, y, z], r: Math.acos(Math.max(-1, min)) };
};
let globeData = null;
const loadGlobe = () => globeData ??= fetch('/option2/media/globe.json').then(r => r.json()).then(d => {
  const polys = list => list.map(p => { const rings = p.map(toXYZ); return { rings, cap: capOf(rings[0]) }; });
  const grat = [];
  for (let lon = -180; lon < 180; lon += 15) { const f = []; for (let lat = -80; lat <= 80; lat += 2) f.push(lon, lat); grat.push(toXYZ(f)); }
  for (let lat = -75; lat <= 75; lat += 15) { const f = []; for (let lon = -180; lon <= 180; lon += 2) f.push(lon, lat); grat.push(toXYZ(f)); }
  return { land: polys(d.land), au: polys(d.au), borders: d.borders.map(toXYZ), grat };
});

function NetworkGlobe({ focus, lit, routeLit }) {
  const canvas = useRef(null);
  const state = useRef({});
  Object.assign(state.current, { focus, lit, routeLit });
  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const still = reduced();
    let data = null, raf = 0, visible = false, alive = true, w = 0, h = 0, dpr = 1;
    const rot = [...VIEW.null], vel = [0, 0];
    let zoom = 1, drag = null, idleAt = -1e4;
    const t0 = performance.now();
    const pins = Object.fromEntries(Object.entries(GEO).map(([k, [lon, lat]]) => [k, unit(lon, lat)]));
    const routes = [['China', 'Sydney', true], ...ROUTES.map(([a, b]) => [a, b, false])].map(([a, b, sea]) => {
      const A = pins[a], B = pins[b], d = Math.acos(A[0] * B[0] + A[1] * B[1] + A[2] * B[2]);
      const N = sea ? 90 : 36, lift = sea ? 0.3 : 0.015 + d * 0.32;
      const pts = Array.from({ length: N + 1 }, (_, j) => { const u = j / N, p = slerp(A, B, u), k = 1 + lift * Math.sin(Math.PI * u); return [p[0] * k, p[1] * k, p[2] * k]; });
      return { a, b, sea, pts, N };
    });

    const resize = () => {
      const r = cv.getBoundingClientRect();
      const z = cv.offsetWidth ? r.width / cv.offsetWidth : 1;
      dpr = Math.min(3, Math.max(1, (devicePixelRatio || 1) * z));
      w = cv.offsetWidth; h = cv.offsetHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    };
    const ro = new ResizeObserver(() => { resize(); if (!raf) draw(performance.now()); });
    ro.observe(cv);
    resize();

    function draw(now) {
      if (!data || !w) return;
      const s = state.current, t = (now - t0) / 1000, key = s.focus ?? 'null';
      const target = VIEW[key] || VIEW.null, sway = still || s.focus ? 0 : Math.sin(t / 6) * 10;
      if (!drag) {
        rot[0] += vel[0]; rot[1] += vel[1]; vel[0] *= 0.9; vel[1] *= 0.9;
        if (now - idleAt > 1600) { rot[0] += (target[0] + sway - rot[0]) * 0.05; rot[1] += (target[1] - rot[1]) * 0.05; }
      }
      rot[1] = Math.max(-70, Math.min(70, rot[1]));
      zoom += ((ZOOM[key] || 1) - zoom) * 0.06;

      const R = Math.min(w, h) * 0.46 * zoom, cx = w / 2, cy = h / 2;
      const cl = Math.cos(rot[0] * RAD), sl = Math.sin(rot[0] * RAD), cp = Math.cos(rot[1] * RAD), sp = Math.sin(rot[1] * RAD);
      // Rotated: X across, Y up, D toward the viewer (D > 0 is the near side).
      const rotate = (x, y, z) => { const x1 = x * cl - y * sl, y1 = x * sl + y * cl; return [y1, z * cp + x1 * sp, x1 * cp - z * sp]; };
      const depth = v => { const x1 = v[0] * cl - v[1] * sl; return x1 * cp - v[2] * sp; };
      // One ring, clipped at the horizon: the hidden part is replaced by the shorter arc of the rim.
      const ring = xyz => {
        const n = xyz.length / 3, P = new Array(n);
        let start = -1;
        for (let i = 0; i < n; i++) { P[i] = rotate(xyz[i * 3], xyz[i * 3 + 1], xyz[i * 3 + 2]); if (start < 0 && P[i][2] > 0) start = i; }
        if (start < 0) return;
        const rimAt = (a, b) => { const k = a[2] / (a[2] - b[2]); const X = a[0] + (b[0] - a[0]) * k, Y = a[1] + (b[1] - a[1]) * k, m = Math.hypot(X, Y) || 1; return [X / m, Y / m]; };
        let exitAng = 0, prev = P[start];
        ctx.moveTo(cx + R * prev[0], cy - R * prev[1]);
        for (let s2 = 1; s2 <= n; s2++) {
          const q = P[(start + s2) % n];
          if (prev[2] > 0 && q[2] > 0) ctx.lineTo(cx + R * q[0], cy - R * q[1]);
          else if (prev[2] > 0) { const [X, Y] = rimAt(prev, q); ctx.lineTo(cx + R * X, cy - R * Y); exitAng = Math.atan2(-Y, X); }
          else if (q[2] > 0) {
            const [X, Y] = rimAt(prev, q), a1 = Math.atan2(-Y, X);
            let d = a1 - exitAng; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
            ctx.arc(cx, cy, R, exitAng, a1, d < 0);
            ctx.lineTo(cx + R * q[0], cy - R * q[1]);
          }
          prev = q;
        }
        ctx.closePath();
      };
      const fill = (list, style) => {
        ctx.beginPath();
        for (const { rings, cap } of list) {
          if (Math.acos(Math.max(-1, Math.min(1, depth(cap.c)))) - cap.r > Math.PI / 2) continue;
          for (const xyz of rings) ring(xyz);
        }
        ctx.fillStyle = style; ctx.fill();
      };
      const lines = (list, style, width) => {
        ctx.beginPath();
        for (const xyz of list) {
          let pen = false;
          for (let i = 0; i < xyz.length; i += 3) {
            const [X, Y, D] = rotate(xyz[i], xyz[i + 1], xyz[i + 2]);
            if (D < 0.02) { pen = false; continue; }
            pen ? ctx.lineTo(cx + R * X, cy - R * Y) : ctx.moveTo(cx + R * X, cy - R * Y); pen = true;
          }
        }
        ctx.strokeStyle = style; ctx.lineWidth = width; ctx.stroke();
      };
      const disc = r => { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); };

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      // Contact shadow and a faint red halo.
      ctx.save(); ctx.translate(cx, cy + R * 1.03); ctx.scale(1, 0.12);
      let g = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.85); g.addColorStop(0, '#23202226'); g.addColorStop(1, '#23202200');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R * 0.85, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      g = ctx.createRadialGradient(cx, cy, R * 0.98, cx, cy, R * 1.1); g.addColorStop(0, '#e31b241f'); g.addColorStop(1, '#e31b2400');
      ctx.fillStyle = g; disc(R * 1.1); ctx.fill();
      // Ocean, lit from the upper left.
      g = ctx.createRadialGradient(cx - R * 0.4, cy - R * 0.45, R * 0.05, cx - R * 0.1, cy - R * 0.1, R * 1.15);
      g.addColorStop(0, '#ffffff'); g.addColorStop(0.5, '#f6f2f1'); g.addColorStop(1, '#e4dbd9');
      ctx.fillStyle = g; disc(R); ctx.fill();
      lines(data.grat, '#23202212', 0.7);
      fill(data.land, '#c9bcb8');
      lines(data.borders, '#faf6f5cc', 0.6);
      const auOn = s.lit('Sydney') || s.lit('Melbourne') || s.focus === 'Australia';
      fill(data.au, auOn ? '#dcb1ad' : '#cdbcb9');
      // Shade toward the rim so the ball reads round, then a crisp rim line.
      g = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.15, cx, cy, R);
      g.addColorStop(0, '#ffffff38'); g.addColorStop(0.55, '#ffffff00'); g.addColorStop(0.85, '#2320220f'); g.addColorStop(1, '#23202238');
      ctx.fillStyle = g; disc(R); ctx.fill();
      ctx.strokeStyle = '#23202224'; ctx.lineWidth = 1; ctx.stroke();

      // Routes lifted off the surface; a comet with a white head runs along each.
      const scr = ([x, y, z]) => { const [X, Y, D] = rotate(x, y, z); const vis = D > 0 || X * X + Y * Y > 1; return [cx + R * X, cy - R * Y, vis]; };
      ctx.lineCap = 'round';
      routes.forEach(({ a, b, sea, pts, N }, i) => {
        const on = sea ? s.lit('China') || s.lit('Sydney') : s.routeLit([a, b]);
        const P = pts.map(scr);
        ctx.globalAlpha = on ? 1 : 0.15;
        const path = (from, to) => { ctx.beginPath(); let pen = false; for (let j = from; j <= to; j++) { const [x, y, v] = P[j]; if (!v) { pen = false; continue; } pen ? ctx.lineTo(x, y) : ctx.moveTo(x, y); pen = true; } };
        if (sea) ctx.setLineDash([3, 5]);
        path(0, N); ctx.strokeStyle = sea ? '#e31b24cc' : '#e31b2470'; ctx.lineWidth = sea ? 1.6 : 1.5; ctx.stroke();
        ctx.setLineDash([]);
        if (on && !still) {
          const phase = (t * (sea ? 0.12 : 0.24) + i * 0.37) % 1, span = N * (sea ? 0.25 : 0.4);
          const head = phase * (N + span), tail = head - span;
          for (let j = Math.max(1, Math.ceil(tail)); j <= Math.min(N, Math.floor(head)); j++) {
            if (!P[j - 1][2] || !P[j][2]) continue;
            const f = (j - tail) / span;
            ctx.beginPath(); ctx.moveTo(P[j - 1][0], P[j - 1][1]); ctx.lineTo(P[j][0], P[j][1]);
            ctx.strokeStyle = `rgba(227,27,36,${f.toFixed(3)})`; ctx.lineWidth = 1 + f * 2.2; ctx.stroke();
          }
          const hj = Math.floor(head);
          if (hj <= N && hj >= 0 && P[hj][2]) {
            ctx.beginPath(); ctx.arc(P[hj][0], P[hj][1], 3.4, 0, Math.PI * 2);
            ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#e31b24'; ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
      });

      // Pins and labels, fading out toward the rim.
      Object.entries(pins).forEach(([name, v]) => {
        const [X, Y, D] = rotate(v[0], v[1], v[2]);
        if (D <= 0.05) return;
        const isKey = KEY_PINS.includes(name), x = cx + R * X, y = cy - R * Y;
        ctx.globalAlpha = Math.min(1, (D - 0.05) / 0.25) * (s.lit(name) ? 1 : 0.22);
        if (isKey && !still) {
          const ph = (t * 0.5 + name.length * 0.13) % 1;
          ctx.beginPath(); ctx.arc(x, y, 6 + ph * 20, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(227,27,36,${(0.3 * (1 - ph)).toFixed(3)})`; ctx.fill();
        }
        ctx.beginPath(); ctx.arc(x, y, isKey ? 6 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = isKey ? '#e31b24' : '#232022'; ctx.fill();
        ctx.lineWidth = isKey ? 2.5 : 1.8; ctx.strokeStyle = '#fff'; ctx.stroke();
        if (!isKey && R < 230) { ctx.globalAlpha = 1; return; }
        const left = LEFT_LABEL.includes(name), lx = x + (left ? -1 : 1) * (isKey ? 12 : 8);
        ctx.font = isKey ? "700 15px 'Manrope Variable', sans-serif" : "600 12px 'Manrope Variable', sans-serif";
        ctx.textAlign = left ? 'right' : 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
        ctx.lineWidth = 4; ctx.strokeStyle = '#faf6f5e6'; ctx.strokeText(name, lx, y);
        ctx.fillStyle = isKey ? '#232022' : '#5c5557'; ctx.fillText(name, lx, y);
        ctx.globalAlpha = 1;
      });
    }

    const loop = () => {
      if (raf || !visible || !data) return;
      const tick = now => { raf = 0; draw(now); if (visible && (!still || drag)) raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (!visible) { cancelAnimationFrame(raf); raf = 0; return; }
      if (data) loop(); else loadGlobe().then(d => { if (alive) { data = d; draw(performance.now()); loop(); } });
    }, { rootMargin: '300px 0px' });
    io.observe(cv);

    // Drag to spin, with a little inertia; it eases back to the network after a pause.
    const down = e => { drag = { x: e.clientX, y: e.clientY, id: e.pointerId }; vel[0] = vel[1] = 0; cv.setPointerCapture?.(e.pointerId); cv.classList.add('is-dragging'); loop(); };
    const move = e => {
      if (!drag || e.pointerId !== drag.id) return;
      const k = 70 / Math.max(120, Math.min(w, h) * 0.46);
      const dx = (e.clientX - drag.x) * k, dy = (e.clientY - drag.y) * k;
      rot[0] += dx; rot[1] -= dy; vel[0] = dx * 0.5; vel[1] = -dy * 0.5;
      drag.x = e.clientX; drag.y = e.clientY;
    };
    const up = () => { if (!drag) return; drag = null; idleAt = performance.now(); cv.classList.remove('is-dragging'); };
    cv.addEventListener('pointerdown', down); cv.addEventListener('pointermove', move);
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    // Re-render once when the focus changes under reduced motion (no loop then).
    state.current.kick = () => { if (still && data) { rot[0] = (VIEW[state.current.focus ?? 'null'] || VIEW.null)[0]; rot[1] = (VIEW[state.current.focus ?? 'null'] || VIEW.null)[1]; zoom = ZOOM[state.current.focus ?? 'null'] || 1; draw(performance.now()); } };
    return () => { alive = false; io.disconnect(); ro.disconnect(); cancelAnimationFrame(raf); cv.removeEventListener('pointerdown', down); cv.removeEventListener('pointermove', move); cv.removeEventListener('pointerup', up); cv.removeEventListener('pointercancel', up); };
  }, []);
  useEffect(() => { state.current.kick?.(); }, [focus]);
  return <canvas ref={canvas} className="fb-globe" role="img" aria-label="Globe showing Phoenix routes across Australia and the sea lane from China. Drag to spin." />;
}

function NetworkMap() {
  const [focus, setFocus] = useState(null);
  const lit = name => !focus || PLACES.find(p => p.id === focus).routes.includes(name);
  const routeLit = ([a, b]) => !focus || (focus === 'Australia' ? true : [a, b].includes(focus));
  const root = useRef(null);
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setDrawn(true); io.disconnect(); } }, { threshold: .25 });
    io.observe(root.current);
    return () => io.disconnect();
  }, []);
  useOffscreenPause(root);
  return <div ref={root} className={'fb-network' + (focus ? ' has-focus' : '') + (drawn ? ' is-drawn' : '')}>
    <p className="fb-network-live"><span className="fb-live-dot" />Live network · NSW, VIC, QLD, SA, WA, NT</p>
    <ul className="fb-network-places" aria-label="Where we operate">
      {PLACES.map(place => <li key={place.id}>
        <button type="button" className={focus === place.id ? 'is-on' : ''} aria-pressed={focus === place.id}
          onMouseEnter={() => setFocus(place.id)} onMouseLeave={() => setFocus(null)}
          onFocus={() => setFocus(place.id)} onBlur={() => setFocus(null)}
          onClick={() => setFocus(f => f === place.id ? null : place.id)}>
          <b>{place.title}</b><span>{place.text}</span>
        </button>
      </li>)}
    </ul>
    <div className="fb-network-frame"><NetworkGlobe focus={focus} lit={lit} routeLit={routeLit} /></div>
  </div>;
}

// Home / Why: Amazon partner card in the empty left column, moved down from the hero.
function PartnerPanel() {
  return <div className="fb-partner">
    <div className="fb-partner-sticky">
      <figure className="fb-partner-hero">
        <img src={card('rollers-03')} alt="Phoenix curtainsider truck on the motorway at golden hour" loading="lazy" />
        <figcaption>Linehaul fleet · Sydney ⇄ Melbourne</figcaption>
      </figure>
      <div className="fb-partner-row">
        <img src={card('warehouse-58')} alt="Phoenix Global Logistics signage on the Wetherill Park depot" loading="lazy" />
        <div className="fb-partner-card">
          <span className="fb-partner-logo"><AmazonMark size={40} /></span>
          <div>
            <p className="fb-partner-title">Amazon Partner Carrier</p>
            <p className="fb-partner-text">Approved for small-parcel deliveries into Amazon fulfilment centres across NSW, QLD and VIC.</p>
          </div>
        </div>
      </div>
    </div>
  </div>;
}

// Tracking: a truck drives the four stages; the stage it reaches lights up.
const STAGE_CARDS = ['62:875', '62:884', '62:894', '62:903'];
function StageRoute() {
  const [stage, setStage] = useState(0);
  const root = useRef(null);
  useEffect(() => {
    if (reduced()) return;
    let timer;
    const io = new IntersectionObserver(([entry]) => {
      clearInterval(timer);
      if (entry.isIntersecting) timer = setInterval(() => setStage(s => (s + 1) % 4), 2200);
    }, { threshold: .3 });
    io.observe(root.current);
    return () => { clearInterval(timer); io.disconnect(); };
  }, []);
  useEffect(() => {
    STAGE_CARDS.forEach((id, i) => {
      const el = document.querySelector(`[data-layer="${id}"]`);
      if (el) el.toggleAttribute('data-stage-active', i === stage);
    });
  }, [stage]);
  return <div ref={root} className="fb-route-bar" style={{ '--stage': stage }} aria-hidden="true">
    <span className="fb-route-line"><span className="fb-route-lane" /><span className="fb-route-fill" /></span>
    {STAGE_CARDS.map((id, i) => <span key={id} className={'fb-route-stop' + (i <= stage ? ' is-done' : '')} style={{ '--n': i }} />)}
    <span className="fb-route-truck"><img src="/option2/media/truck-top@360.webp" alt="" /></span>
  </div>;
}

// About: pallets go in, the curtain closes, the truck drives off, all on scroll.
const CURTAIN = [[41.6, 6], [98.9, 30.5], [98.9, 67.3], [41.6, 69.2]]; // trailer side in % of truck.webp
function curtainClip(p) {
  // The curtain is pulled shut from the back of the trailer (right) towards the cab.
  const [tl, tr, br, bl] = CURTAIN;
  const x = tr[0] - (tr[0] - tl[0]) * p;
  const yt = tr[1] - (tr[1] - tl[1]) * p, yb = br[1] - (br[1] - bl[1]) * p;
  return `polygon(${x}% ${yt}%, ${tr[0]}% ${tr[1]}%, ${br[0]}% ${br[1]}%, ${x}% ${yb}%)`;
}
function TruckLoad() {
  const stage = useRef(null);
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const curtain = el.querySelector('.fb-truck-curtain');
    const pallets = [...el.querySelectorAll('.fb-pallet')];
    const vehicle = el.querySelector('.fb-truck-vehicle');
    const set = p => {
      const load = Math.min(1, p / .4), close = Math.min(1, Math.max(0, (p - .4) / .25)), drive = Math.max(0, (p - .7) / .3);
      pallets.forEach((pl, i) => {
        const t = Math.min(1, Math.max(0, load * 3 - (2 - i))); // front pallet first, loaded from the back
        pl.style.transform = `translate(${(1 - t) * 220}%, 0)`;
        pl.style.opacity = String(t);
      });
      curtain.style.clipPath = curtainClip(close);
      vehicle.style.transform = `translateX(${drive * drive * -75}vw)`; // cab faces left, so forward is left
      vehicle.style.opacity = String(1 - Math.max(0, drive - .6) / .4);
    };
    if (reduced()) { set(.66); return; }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect(), vh = innerHeight;
      // 0 when the truck enters from below, 1 when it is near the top of the screen
      set(Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height * .2))));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={stage} className="fb-truck" aria-hidden="true">
    <div className="fb-truck-vehicle">
      <img src="/option2/media/truck.webp" alt="" className="fb-truck-base" />
      <span className="fb-truck-inside">
        <FreightDefs />
        <TruckInterior />
        <span className="fb-pallet fb-load-0"><LoadPallet id="a" /></span>
        <span className="fb-pallet fb-load-1"><LoadStack /></span>
        <span className="fb-pallet fb-load-2"><LoadPallet id="c" tall={false} /></span>
      </span>
      <img src="/option2/media/truck.webp" alt="" className="fb-truck-curtain" />
    </div>
  </div>;
}

// About truck: a lit cargo bay (ribs, ceiling light, timber floor) drawn over the curtainsider's opening.
const BAY = { x0: 381, x1: 907, top0: 31.5, top1: 160, floor0: 363, floor1: 353 };
const bayAt = t => ({ x: BAY.x0 + (BAY.x1 - BAY.x0) * t, top: BAY.top0 + (BAY.top1 - BAY.top0) * t, floor: BAY.floor0 + (BAY.floor1 - BAY.floor0) * t });
function TruckInterior() {
  const ribs = Array.from({ length: 10 }, (_, i) => bayAt(i / 9));
  const deck = 14;
  return <svg className="fb-bay" viewBox="0 0 917 525" preserveAspectRatio="none">
    <defs>
      <linearGradient id="bay-wall" x1="0" x2="1"><stop offset="0" stopColor="#3a3435" /><stop offset=".45" stopColor="#262223" /><stop offset="1" stopColor="#121011" /></linearGradient>
      <linearGradient id="bay-shade" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity=".55" /><stop offset=".25" stopColor="#000" stopOpacity="0" /><stop offset=".8" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".5" /></linearGradient>
      <radialGradient id="bay-light" cx=".5" cy="0" r=".9"><stop offset="0" stopColor="#fff4dc" stopOpacity=".55" /><stop offset=".35" stopColor="#ffe9c2" stopOpacity=".16" /><stop offset="1" stopColor="#ffe9c2" stopOpacity="0" /></radialGradient>
      <linearGradient id="bay-floor" x1="0" x2="1"><stop offset="0" stopColor="#8a6440" /><stop offset=".6" stopColor="#5e432b" /><stop offset="1" stopColor="#3a2a1c" /></linearGradient>
      <linearGradient id="bay-rib" x1="0" x2="1"><stop offset="0" stopColor="#000" stopOpacity=".5" /><stop offset=".4" stopColor="#5a5253" /><stop offset=".6" stopColor="#7a7071" /><stop offset="1" stopColor="#000" stopOpacity=".35" /></linearGradient>
    </defs>
    <rect width="917" height="525" fill="url(#bay-wall)" />
    {[.18, .52, .84].map(t => { const b = bayAt(t); return <ellipse key={t} cx={b.x} cy={b.top + 6} rx={150 - t * 60} ry={(b.floor - b.top) * .9} fill="url(#bay-light)" />; })}
    {ribs.map((r, i) => <polygon key={i} points={`${r.x - 4},${r.top} ${r.x + 4},${r.top} ${r.x + 4},${r.floor} ${r.x - 4},${r.floor}`} fill="url(#bay-rib)" opacity={1 - i * .06} />)}
    {[.33, .62].map(k => <polyline key={k} points={`${BAY.x0},${BAY.top0 + (BAY.floor0 - BAY.top0) * k} ${BAY.x1},${BAY.top1 + (BAY.floor1 - BAY.top1) * k}`} stroke="#8a8081" strokeOpacity=".35" strokeWidth="3" fill="none" />)}
    {[.18, .52, .84].map(t => { const b = bayAt(t); return <rect key={t} x={b.x - 26 + t * 8} y={b.top + 2} width={52 - t * 16} height="4" rx="2" fill="#fff8e8" opacity=".9" />; })}
    <rect width="917" height="525" fill="url(#bay-shade)" />
    <polygon points={`${BAY.x0},${BAY.floor0 - deck} ${BAY.x1},${BAY.floor1 - deck * .7} ${BAY.x1},${BAY.floor1 + 4} ${BAY.x0},${BAY.floor0 + 4}`} fill="url(#bay-floor)" />
    {Array.from({ length: 4 }, (_, i) => { const k = (i + 1) / 5; return <line key={i} x1={BAY.x0} y1={BAY.floor0 - deck + deck * k} x2={BAY.x1} y2={BAY.floor1 - deck * .7 + deck * .7 * k} stroke="#2a1c11" strokeOpacity=".55" strokeWidth=".8" />; })}
    <line x1={BAY.x0} y1={BAY.floor0 - deck} x2={BAY.x1} y2={BAY.floor1 - deck * .7} stroke="#c9a476" strokeOpacity=".6" strokeWidth="1.2" />
  </svg>;
}
function LoadPallet({ id, tall = true }) {
  const w = 150, rows = tall ? 3 : 2, rh = 52, top = 182 - rows * rh;
  return <svg className="fb-load" viewBox="0 -12 160 212" preserveAspectRatio="xMidYMax meet">
    <ellipse cx={w / 2 + 4} cy="198" rx={w * .54} ry="3.2" fill="#000" opacity=".6" />
    <Pallet x={1} y={182} w={w} d={7} />
    {Array.from({ length: rows }, (_, r) => [0, 1, 2].map(c => <Box key={id + r + c} x={2 + c * 49.5} y={top + r * rh} w={48.5} h={rh - .5} d={7} tone={r * 3 + c + (tall ? 0 : 2)} tape={(r + c) % 3 === 0 ? 'red' : 'clear'} label={r === rows - 1 && c !== 1} marks={r === 0 && c === 2} />))}
    <Film x={1} y={top - 1} w={w + 1} h={183 - top} d={7} />
    <g transform={`translate(${w - 52} ${top + 12})`}><rect width="44" height="15" fill="#e31b24" /><rect width="44" height=".6" fill="#ff8a8f" /><text x="22" y="10.4" textAnchor="middle" fontSize="7.6" fontWeight="700" fill="#fff" fontFamily="Geist Variable, sans-serif" letterSpacing=".5">PHOENIX</text></g>
  </svg>;
}
function LoadStack() {
  return <svg className="fb-load" viewBox="0 -12 160 212" preserveAspectRatio="xMidYMax meet">
    <ellipse cx="80" cy="197" rx="82" ry="3.2" fill="#000" opacity=".6" />
    <Box x={2} y={128} w={72} h={69} d={7} tone={1} tape="red" label marks />
    <Box x={78} y={136} w={70} h={61} d={7} tone={3} tape="clear" label />
    <Box x={10} y={76} w={58} h={51.5} d={7} tone={2} dg tape="clear" />
    <Box x={74} y={92} w={60} h={43.5} d={7} tone={4} tape="red" marks fragile />
    <Box x={26} y={40} w={50} h={35.5} d={7} tone={0} tape="clear" />
  </svg>;
}

// About: Our Values gets a sticky photo with the depot caption.
function ValuesPhoto() {
  return <div className="fb-values">
    <figure className="fb-values-sticky">
      <img src={card('warehouse-58')} alt="Phoenix Global Logistics signage on the Wetherill Park depot" loading="lazy" />
      <figcaption><b>Wetherill Park, Sydney</b><span>Head depot · Warehouse 06:00–17:30</span></figcaption>
      <dl className="fb-values-facts">
        <div><dt>2021</dt><dd>Phoenix Global Logistics founded</dd></div>
        <div><dt>20+</dt><dd>years in cargo and logistics</dd></div>
      </dl>
    </figure>
  </div>;
}

// Services: the checklist reveals line by line with a live status pill.
function IncludePulse() {
  const root = useRef(null);
  useEffect(() => {
    const list = root.current?.closest('[data-layer="61:152"]')?.querySelector('[data-layer="61:450"]');
    if (!list) return;
    if (reduced()) { list.setAttribute('data-live', ''); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { list.setAttribute('data-live', ''); io.disconnect(); } }, { threshold: .35 });
    io.observe(list);
    return () => io.disconnect();
  }, []);
  return <span ref={root} className="fb-live"><span className="fb-live-dot" />Handled in-house, every shipment</span>;
}

// Footer: a slim conveyor of cartons, a container and DG-labelled boxes in place of the link columns.
// Footer: detailed vector parcels on a roller conveyor (client: small parcels should look more real).
// Footer conveyor items, drawn with the shared freight art (freight-art.jsx).
function Carton({ w = 64, h = 54, tape = 'red', label = true, fragile = false, tone = 0 }) {
  const d = 9, dy = d * .72;
  return <svg className="fb-parcel" width={w} height={h + dy} viewBox={`0 0 ${w} ${h + dy}`}>
    <Box x={.3} y={dy} w={w - d - .6} h={h - .3} d={d} tone={tone} tape={tape} label={label} marks fragile={fragile} />
  </svg>;
}
function DgParcel() {
  const d = 8, dy = d * .72, w = 54, h = 56;
  return <svg className="fb-parcel" width={w + d} height={h + dy} viewBox={`0 0 ${w + d} ${h + dy}`}>
    <Box x={.3} y={dy} w={w} h={h - .3} d={d} tone={3} tape="clear" />
    <g transform={`translate(${w / 2} ${dy + h * .46}) rotate(45)`}>
      <rect x="-14" y="-14" width="28" height="28" rx=".8" fill="#fbfaf7" stroke="#1d1a1b" strokeWidth=".9" />
      <rect x="-12.6" y="-12.6" width="25.2" height="25.2" fill="none" stroke="#1d1a1b" strokeWidth=".35" />
      <g transform="rotate(-45)" fill="#1d1a1b">{[-7.5, -5, -2.5, 0, 2.5, 5, 7.5].map(o => <rect key={o} x={o - .7} y={-13 + Math.abs(o) * .95} width="1.4" height={11 - Math.abs(o) * .95} />)}</g>
    </g>
    <text x={w / 2} y={dy + h * .46 + 14} textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#1d1a1b" fontFamily="Geist Variable, sans-serif">9</text>
    <text x={w / 2} y={dy + h - 3} textAnchor="middle" fontSize="2.8" fontWeight="700" letterSpacing=".2" fill="#3d2610" fillOpacity=".8" fontFamily="Geist Variable, sans-serif">UN3480 · LITHIUM ION BATTERIES</text>
  </svg>;
}
function WrappedPallet() {
  const d = 7, dy = d * .72, w = 86;
  return <svg className="fb-parcel" width={w + d} height="80" viewBox={`0 0 ${w + d} 80`}>
    <Pallet x={.3} y={65} w={w} d={d} />
    {[[1, 37, 28, 28, 0], [29.5, 37, 28, 28, 2], [58, 37, 27.5, 28, 4]].map(([x, y, bw, bh, t]) => <Box key={x} x={x} y={y} w={bw} h={bh} d={d} tone={t} tape={t === 2 ? 'red' : 'clear'} />)}
    {[[6, 13, 37, 24, 1], [44, 13, 36, 24, 3]].map(([x, y, bw, bh, t]) => <Box key={x} x={x} y={y} w={bw} h={bh} d={d} tone={t} tape="clear" label={t === 1} />)}
    <Film x={.3} y={12} w={w - .3} h={53} d={d} />
  </svg>;
}
function MiniContainer() {
  return <svg className="fb-parcel" width="170" height="74" viewBox="0 0 170 74">
    <Container x={.5} y={8} w={158} h={64} d={10} />
  </svg>;
}
function Conveyor() {
  const root = useRef(null);
  useOffscreenPause(root);
  const items = ['box', 'tall', 'dg', 'container', 'box', 'pallet', 'dg', 'tall', 'container', 'box'];
  const draw = (t, i) => t === 'dg' ? <DgParcel /> : t === 'container' ? <MiniContainer /> : t === 'pallet' ? <WrappedPallet /> : t === 'tall' ? <Carton w={54} h={70} fragile tape="clear" tone={i % 5} /> : <Carton tone={(i * 2) % 5} tape={i % 4 === 0 ? 'red' : 'clear'} />;
  return <div ref={root} className="fb-conveyor" aria-hidden="true">
    <FreightDefs />
    <div className="fb-belt-track">
      {[0, 1].map(k => <div key={k} className="fb-belt-run">
        {items.map((t, i) => <span key={i} className="fb-item">{draw(t, i)}</span>)}
      </div>)}
    </div>
    <span className="fb-belt"><span className="fb-belt-rollers" /></span>
    <p className="fb-conveyor-caption">Freight moving across Australia, every day.</p>
  </div>;
}

// Contact: a shorter quote form (client: name, company and country, phone, services, freight type, notes).
const freightTypes = ['Pallets', 'Cartons / loose cargo', 'Full container (20ft or 40ft)', 'Amazon FBA shipment', 'Dangerous goods', 'Other'];
function QuoteForm() {
  return <div className="fb-quote">
    <label><span>Your name*</span><input name="name" required autoComplete="name" placeholder="Full name" /></label>
    <label><span>Company*</span><input name="company" required autoComplete="organization" placeholder="Business name" /></label>
    <label><span>Country*</span><input name="country" required autoComplete="country-name" placeholder="E.g. Australia" /></label>
    <label><span>Phone*</span><input name="phone" type="tel" required autoComplete="tel" placeholder="+61" /></label>
    <label className="fb-wide"><span>Email*</span><input name="email" type="email" required autoComplete="email" placeholder="So we can send your quote" /></label>
    <label><span>Service*</span><select name="service" required defaultValue=""><option value="" disabled>Choose a service</option>{services.map(s => <option key={s.slug} value={s.slug}>{s.title}</option>)}</select></label>
    <label><span>Freight type*</span><select name="freight" required defaultValue=""><option value="" disabled>Choose a freight type</option>{freightTypes.map(f => <option key={f}>{f}</option>)}</select></label>
    <label className="fb-wide"><span>Special requests</span><textarea name="notes" rows="5" placeholder="Pick-up and delivery locations, timing, dimensions or anything we should know." /></label>
  </div>;
}


// Home / Why: About Phoenix as a bento (client: the section felt empty).
const STATS = [['1,200+', 'containers handled a year'], ['960k+', 'boxes processed a year'], ['20+', 'years in cargo and logistics']];
function AboutBento() {
  return <div className="fb-about">
    <div className="fb-about-copy">
      <h2>About Phoenix</h2>
      <p>Experience carried forward into a new chapter. Phoenix Global Logistics evolved from Phoenix International Cargo in 2021, building on more than 20 years of cargo and logistics experience.</p>
      <p>Today, our Australian family-owned business links international arrivals with warehouse processing, national road freight and final delivery.</p>
      <a className="fb-btn" href="/about">About us <span aria-hidden="true">→</span></a>
    </div>
    <figure className="fb-about-hero"><img src={card('warehouse-58')} alt="Phoenix Global Logistics signage on the Wetherill Park depot" loading="lazy" /><figcaption>Wetherill Park, Sydney · Head depot</figcaption></figure>
    <div className="fb-about-amazon">
      <span className="fb-partner-logo"><AmazonMark size={40} /></span>
      <p className="fb-partner-title">Amazon Partner Carrier</p>
      <p className="fb-partner-text">Approved for small-parcel deliveries into fulfilment centres across NSW, QLD and VIC.</p>
    </div>
    {STATS.map(([n, l]) => <div key={n} className="fb-about-stat"><b>{n}</b><span>{l}</span></div>)}
    <figure className="fb-about-wide"><img src={card('rollers-03')} alt="Phoenix curtainsider truck on the motorway at golden hour" loading="lazy" /></figure>
  </div>;
}

// About: Our Values as photo cards with a fact strip (client: layout felt sparse).
const VALUES = [
  ['Our mission', 'Connect international arrivals, warehousing and Australian transport through coordination and careful freight handling.', 'warehouse-136'],
  ['How we grow', 'Build long-term relationships, strengthen our Australian operation and keep communication at the centre of our service.', 'warehouse-101'],
  ['Our foundations', 'Teams in Sydney and Melbourne, an owned fleet, contracted operators and established China–Australia trade connections.', 'rollers-01'],
];
function Values() {
  return <div className="fb-values2">
    <div className="fb-values2-head">
      <p className="fb-values2-label">Our values</p>
      <h2>Carrier capability with the care of a family business.</h2>
      <p>Phoenix Global Logistics evolved from Phoenix International Cargo in 2021, building on more than 20 years of cargo and logistics experience.</p>
    </div>
    <div className="fb-values2-grid">
      {VALUES.map(([t, d, img], i) => <article key={t} className="fb-value">
        <img src={card(img)} alt="" loading="lazy" />
        <div><span className="fb-value-n">0{i + 1}</span><h3>{t}</h3><p>{d}</p></div>
      </article>)}
    </div>
    <dl className="fb-values2-facts">
      <div><dt>2021</dt><dd>Phoenix Global Logistics founded</dd></div>
      <div><dt>20+</dt><dd>years in cargo and logistics</dd></div>
      <div><dt>2</dt><dd>depots, Sydney and Melbourne</dd></div>
      <div><dt>12</dt><dd>owned vehicles, plus contracted operators</dd></div>
    </dl>
  </div>;
}

// Services: hovering a related service expands it; clicking still opens it.
function RelatedHover() {
  const root = useRef(null);
  useEffect(() => {
    const row = root.current?.parentElement;
    if (!row) return;
    const cards = [...row.querySelectorAll(':scope > [data-related-card]')];
    if (cards.length < 2) return;
    const W = 1280, gap = 12, big = 700;
    const small = (W - big - gap * (cards.length - 1)) / (cards.length - 1);
    const desktop = matchMedia('(min-width: 1000px)');
    const layout = active => {
      if (!desktop.matches) { cards.forEach(c => { c.style.left = ''; c.style.width = ''; c.removeAttribute('data-expanded'); }); return; }
      let x = 0;
      cards.forEach((c, i) => {
        const w = i === active ? big : small;
        c.style.left = x + 'px'; c.style.width = w + 'px';
        c.toggleAttribute('data-expanded', i === active);
        x += w + gap;
      });
    };
    layout(0);
    const onChange = () => layout(0);
    desktop.addEventListener('change', onChange);
    const enter = i => () => layout(i);
    const handlers = cards.map((c, i) => { const h = enter(i); c.addEventListener('mouseenter', h); c.addEventListener('focus', h); return h; });
    return () => { desktop.removeEventListener('change', onChange); cards.forEach((c, i) => { c.removeEventListener('mouseenter', handlers[i]); c.removeEventListener('focus', handlers[i]); }); };
  }, []);
  return <span ref={root} hidden />;
}

// Home services: the section pins while the card row scrolls sideways to its end, then the page moves on.
export const SERVICES_PIN = 1100; // extra section height (Figma px) that the sideways scroll consumes
function ServicesPin() {
  const ref = useRef(null);
  useEffect(() => {
    const section = ref.current?.parentElement;
    const track = section?.querySelector('[data-layer="323:1069"]');
    if (!section || !track) return;
    const desktop = matchMedia('(min-width: 1000px)');
    let raf = 0;
    // The stage itself is CSS sticky (no scroll-linked transforms); only the row's scrollLeft follows the page.
    const update = () => {
      raf = 0;
      if (!desktop.matches) return;
      const r = section.getBoundingClientRect();
      const zoom = r.width / section.offsetWidth || 1;
      const extra = SERVICES_PIN * zoom, content = r.height - extra;
      const start = Math.max(0, content - innerHeight);
      const pinned = Math.min(extra, Math.max(0, -r.top - start));
      const max = track.scrollWidth - track.clientWidth;
      const left = Math.round((pinned / extra) * max);
      if (Math.abs(track.scrollLeft - left) > .5) track.scrollLeft = left;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { addEventListener('scroll', onScroll, { passive: true }); update(); }
      else removeEventListener('scroll', onScroll);
    });
    io.observe(section);
    addEventListener('resize', onScroll);
    return () => { io.disconnect(); removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, []);
  return <span ref={ref} className="fb-services-pin" hidden />;
}

const parts = {
  network: NetworkMap, 'partner-panel': PartnerPanel, 'stage-route': StageRoute, 'truck-load': TruckLoad,
  'values-photo': ValuesPhoto, 'include-pulse': IncludePulse, conveyor: Conveyor, 'quote-form': QuoteForm,
  'about-bento': AboutBento, values: Values, 'related-hover': RelatedHover, 'services-pin': ServicesPin,
};

export function FeedbackPart({ name }) {
  const Part = parts[name];
  return Part ? <Part /> : null;
}

export { company };
