// Dotted Asia-Pacific map for the home network section (round 7): a grid of dots over land,
// with Australia and China flagged so they can be tinted. Output: public/option2/media/dotmap.json
import * as topo from 'topojson-client';
import { readFileSync, writeFileSync } from 'fs';
const load = f => JSON.parse(readFileSync('node_modules/world-atlas/' + f));
const W = [40, 180], N = 56, S = -48, STEP = 1.25;
const c = load('countries-50m.json');
const feats = topo.feature(c, c.objects.countries).features;
const polysOf = g => g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
const inRing = (x, y, r) => { let o = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const [xi, yi] = r[i], [xj, yj] = r[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) o = !o; } return o; };
const inPoly = (x, y, p) => inRing(x, y, p[0]) && !p.slice(1).some(h => inRing(x, y, h));
const shapes = feats.map(f => ({ id: f.id, polys: polysOf(f.geometry) }));
const dots = [];
for (let lat = N; lat >= S; lat -= STEP) for (let lon = W[0]; lon <= W[1]; lon += STEP) {
  const hit = shapes.find(s => s.polys.some(p => inPoly(lon, lat, p)));
  if (hit) dots.push([Math.round((lon - W[0]) / STEP), Math.round((N - lat) / STEP), hit.id === '036' ? 1 : hit.id === '156' ? 2 : 0]);
}
const cols = Math.round((W[1] - W[0]) / STEP) + 1, rows = Math.round((N - S) / STEP) + 1;
writeFileSync('public/option2/media/dotmap.json', JSON.stringify({ west: W[0], north: N, step: STEP, cols, rows, dots }));
console.log(cols, rows, dots.length);
