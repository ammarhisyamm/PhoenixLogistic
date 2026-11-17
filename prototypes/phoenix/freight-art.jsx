// Freight illustrations shared by the footer conveyor and the About truck: corrugated cartons,
// timber pallets, stretch wrap and a shipping container. Pure SVG with fine detail (fibre, flap
// seams, tape sheen, labels, nail heads, corrugation) so it stays sharp when zoomed in.
// Every shape references the gradients and patterns in <FreightDefs/>, which must be on the page.

export const KRAFT = ['#cfa673', '#c69b65', '#d6b07e', '#bf935c', '#caa06b'];

export function FreightDefs() {
  return <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false"><defs>
    {/* Face shading: light from the top left, edges a touch darker (crushed board). */}
    <linearGradient id="fa-front" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".16" /><stop offset=".45" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#3b2410" stopOpacity=".22" /></linearGradient>
    <linearGradient id="fa-edge-x" x1="0" x2="1"><stop offset="0" stopColor="#3b2410" stopOpacity=".18" /><stop offset=".06" stopColor="#3b2410" stopOpacity="0" /><stop offset=".94" stopColor="#3b2410" stopOpacity="0" /><stop offset="1" stopColor="#3b2410" stopOpacity=".22" /></linearGradient>
    <linearGradient id="fa-edge-y" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".2" /><stop offset=".05" stopColor="#fff" stopOpacity="0" /><stop offset=".92" stopColor="#3b2410" stopOpacity="0" /><stop offset="1" stopColor="#3b2410" stopOpacity=".28" /></linearGradient>
    <linearGradient id="fa-top" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity=".34" /><stop offset="1" stopColor="#fff" stopOpacity=".12" /></linearGradient>
    <linearGradient id="fa-side" x1="0" x2="1"><stop offset="0" stopColor="#2a1708" stopOpacity=".3" /><stop offset="1" stopColor="#2a1708" stopOpacity=".48" /></linearGradient>
    {/* Kraft fibre: short faint strokes, tiled in user space so they keep their size. */}
    <pattern id="fa-fibre" width="23" height="17" patternUnits="userSpaceOnUse">
      <path d="M1 2.5h4.2M9 6.2h3.1M15.5 1.4h5M3 9.6h2.6M12.4 12.8h4.4M18.7 8.3h2.8M6.4 14.9h3.3" stroke="#5a3a1b" strokeOpacity=".11" strokeWidth=".35" strokeLinecap="round" />
      <path d="M4.5 5.4h2.4M13.2 3.9h3.6M8.6 11.2h2.9M17.3 15.1h3.4M1.6 13.2h2.1" stroke="#fff" strokeOpacity=".11" strokeWidth=".3" strokeLinecap="round" />
    </pattern>
    {/* Tape: Phoenix red, and clear packing tape. */}
    <linearGradient id="fa-tape-red" x1="0" x2="1"><stop offset="0" stopColor="#b8141c" /><stop offset=".22" stopColor="#e2262f" /><stop offset=".55" stopColor="#d81f28" /><stop offset=".8" stopColor="#ef4a52" /><stop offset="1" stopColor="#b8141c" /></linearGradient>
    <linearGradient id="fa-tape-clear" x1="0" x2="1"><stop offset="0" stopColor="#8a5e2c" stopOpacity=".35" /><stop offset=".3" stopColor="#fff2d8" stopOpacity=".28" /><stop offset=".7" stopColor="#c08c50" stopOpacity=".18" /><stop offset="1" stopColor="#8a5e2c" stopOpacity=".38" /></linearGradient>
    {/* Timber */}
    <pattern id="fa-grain" width="40" height="6" patternUnits="userSpaceOnUse">
      <path d="M0 1.2c8 .4 14-.5 22 .2s12 .3 18-.1M0 3.6c6-.3 13 .5 20 .1s14-.4 20 .2M0 5.2c9 .2 15-.3 24 .1" stroke="#6b4824" strokeOpacity=".28" strokeWidth=".35" fill="none" />
    </pattern>
    <linearGradient id="fa-board" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e2bd86" /><stop offset=".25" stopColor="#c99d62" /><stop offset="1" stopColor="#a87d47" /></linearGradient>
    <linearGradient id="fa-block" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b58a52" /><stop offset="1" stopColor="#8a6436" /></linearGradient>
    {/* Stretch wrap */}
    <linearGradient id="fa-film" x1="0" y1="0" x2="1" y2=".35"><stop offset="0" stopColor="#fff" stopOpacity=".42" /><stop offset=".14" stopColor="#fff" stopOpacity=".1" /><stop offset=".38" stopColor="#e9f2f7" stopOpacity=".05" /><stop offset=".62" stopColor="#fff" stopOpacity=".2" /><stop offset=".7" stopColor="#fff" stopOpacity=".06" /><stop offset="1" stopColor="#fff" stopOpacity=".24" /></linearGradient>
    <pattern id="fa-film-bands" width="60" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(-7)">
      <rect y="0" width="60" height="1.2" fill="#fff" fillOpacity=".3" /><rect y="7" width="60" height=".6" fill="#fff" fillOpacity=".22" /><rect y="13.5" width="60" height="2" fill="#fff" fillOpacity=".12" />
    </pattern>
    {/* Container corrugation: one trapezoid rib per tile. */}
    <linearGradient id="fa-rib" x1="0" x2="1">
      <stop offset="0" stopColor="#c31d25" /><stop offset=".18" stopColor="#ee434a" /><stop offset=".42" stopColor="#da2a32" /><stop offset=".5" stopColor="#c11c24" />
      <stop offset=".62" stopColor="#8f1218" /><stop offset=".82" stopColor="#a8161d" /><stop offset="1" stopColor="#c31d25" />
    </linearGradient>
    <pattern id="fa-ribs" width="7.2" height="10" patternUnits="userSpaceOnUse"><rect width="7.2" height="10" fill="url(#fa-rib)" /></pattern>
    <linearGradient id="fa-ctr-light" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".18" /><stop offset=".35" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".3" /></linearGradient>
    <linearGradient id="fa-steel" x1="0" x2="1"><stop offset="0" stopColor="#c8c2bf" /><stop offset=".5" stopColor="#f2eeec" /><stop offset="1" stopColor="#8e8784" /></linearGradient>
  </defs></svg>;
}

// Barcode with uneven bars, like a real Code 128 print.
const BARS = [2, 1, 1, 3, 1, 2, 2, 1, 1, 1, 3, 2, 1, 1, 2, 3, 1, 1, 2, 1, 1, 2, 1, 3, 1, 1, 2, 2, 1, 1];
export function Barcode({ x, y, w, h, fill = '#231e1f' }) {
  const total = BARS.reduce((a, b) => a + b, 0), u = w / total;
  let cx = x;
  return <g fill={fill}>{BARS.map((b, i) => { const r = i % 2 === 0 ? <rect key={i} x={cx} y={y} width={b * u} height={h} /> : null; cx += b * u; return r; })}</g>;
}

// Courier label: dark header, address lines, barcode and a 2D code.
export function ShipLabel({ x, y, w, h, tilt = 0 }) {
  const pad = w * .07, lh = Math.max(.5, h * .045);
  return <g transform={`rotate(${tilt} ${x + w / 2} ${y + h / 2})`}>
    <rect x={x + .4} y={y + .6} width={w} height={h} fill="#2a1708" opacity=".18" />
    <rect x={x} y={y} width={w} height={h} fill="#fbfaf7" />
    <rect x={x} y={y} width={w} height={h * .17} fill="#231e1f" />
    <rect x={x + pad} y={y + h * .06} width={w * .16} height={h * .06} fill="#e31b24" />
    <text x={x + pad + w * .2} y={y + h * .118} fontSize={h * .07} fontWeight="600" fill="#fff" fontFamily="Geist Variable, sans-serif" letterSpacing=".2">PHOENIX</text>
    {[.26, .34, .42].map((k, i) => <rect key={k} x={x + pad} y={y + h * k} width={w * (i === 0 ? .55 : i === 1 ? .7 : .45)} height={lh} fill="#8d8582" />)}
    <rect x={x + pad} y={y + h * .5} width={w - pad * 2} height=".3" fill="#cfc8c4" />
    <Barcode x={x + pad} y={y + h * .56} w={w * .6} h={h * .26} />
    <g fill="#231e1f">{[[0, 0], [2, 0], [0, 2], [1, 1], [2, 2], [3, 1], [1, 3], [3, 3], [2, 1]].map(([a, b], i) => <rect key={i} x={x + w * .74 + a * w * .045} y={y + h * .58 + b * w * .045} width={w * .045} height={w * .045} />)}</g>
    <rect x={x + pad} y={y + h * .87} width={w * .5} height={lh * .8} fill="#a59d99" />
  </g>;
}

// Printed handling marks (this way up, keep dry, fragile) in brown ink.
function Marks({ x, y, s, fragile }) {
  return <g fill="none" stroke="#3d2610" strokeOpacity=".72" strokeWidth={s * .07} strokeLinecap="round" strokeLinejoin="round">
    <rect x={x - s * .1} y={y - s * .1} width={s * (fragile ? 3.3 : 2.2) + s * .2} height={s * 1.2} strokeWidth={s * .045} />
    <path d={`M${x + s * .25} ${y + s} v${-s * .8} m${-s * .2} ${s * .25} l${s * .2} ${-s * .25} l${s * .2} ${s * .25} M${x + s * .65} ${y + s} v${-s * .8} m${-s * .2} ${s * .25} l${s * .2} ${-s * .25} l${s * .2} ${s * .25}`} />
    <path d={`M${x + s * 1.15} ${y + s * .5} q${s * .45} ${-s * .55} ${s * .9} 0 z M${x + s * 1.6} ${y + s * .5} v${s * .4} q0 ${s * .12} ${-s * .12} ${s * .1}`} />
    {fragile && <path d={`M${x + s * 2.35} ${y + s * .05} h${s * .7} l${-s * .08} ${s * .4} q${-s * .27} ${s * .22} ${-s * .54} 0 z M${x + s * 2.7} ${y + s * .6} v${s * .35} m${-s * .2} 0 h${s * .4}`} />}
  </g>;
}

// A corrugated carton seen from the front-left-top. (x, y) is the front face's top-left corner.
export function Box({ x, y, w, h, d = 8, tone = 0, tape = 'red', label = false, marks = false, fragile = false, dg = false, worn = 0 }) {
  const dy = d * .72, base = KRAFT[tone % KRAFT.length];
  const tw = Math.max(3, Math.min(w * .2, 9)), tx = x + w / 2 - tw / 2;
  const front = `M${x} ${y}h${w}v${h}h${-w}z`;
  const top = `M${x} ${y}l${d} ${-dy}h${w}l${-d} ${dy}z`;
  const side = `M${x + w} ${y}l${d} ${-dy}v${h}l${-d} ${dy}z`;
  return <g>
    <path d={side} fill={base} /><path d={side} fill="url(#fa-side)" /><path d={side} fill="url(#fa-fibre)" />
    <path d={top} fill={base} /><path d={top} fill="url(#fa-top)" /><path d={top} fill="url(#fa-fibre)" />
    {/* flap seam across the top, front to back */}
    <path d={`M${x + w / 2} ${y}l${d} ${-dy}`} stroke="#5b3c1c" strokeOpacity=".55" strokeWidth=".45" />
    <path d={front} fill={base} /><path d={front} fill="url(#fa-fibre)" /><path d={front} fill="url(#fa-front)" />
    <path d={front} fill="url(#fa-edge-x)" /><path d={front} fill="url(#fa-edge-y)" />
    {/* score lines a hair below the top edge, where the flaps fold */}
    <path d={`M${x + .6} ${y + Math.min(2.2, h * .05)}h${w - 1.2}`} stroke="#5b3c1c" strokeOpacity=".22" strokeWidth=".35" />
    {worn > 0 && <path d={`M${x + w * .18} ${y + h * .62}q${w * .08} ${h * .04} ${w * .14} ${-h * .01}`} stroke="#3b2410" strokeOpacity=".22" strokeWidth=".5" fill="none" />}
    {marks && <Marks x={x + w * .58} y={y + h * .1} s={Math.min(w, h) * .085} fragile={fragile} />}
    {tape && <g>
      <path d={`M${tx} ${y}l${d} ${-dy}h${tw}l${-d} ${dy}z`} fill={tape === 'red' ? 'url(#fa-tape-red)' : 'url(#fa-tape-clear)'} opacity={tape === 'red' ? .95 : 1} />
      <rect x={tx} y={y} width={tw} height={h * .36} fill={tape === 'red' ? 'url(#fa-tape-red)' : 'url(#fa-tape-clear)'} opacity={tape === 'red' ? .95 : 1} />
      <path d={`M${tx} ${y + h * .36}l${tw * .25} ${-.5}l${tw * .25} .6l${tw * .25} -.4l${tw * .25} .4`} stroke={tape === 'red' ? '#8f0f15' : '#7a5328'} strokeOpacity=".5" strokeWidth=".3" fill="none" />
      <rect x={tx + tw * .18} y={y + .4} width={tw * .12} height={h * .34} fill="#fff" opacity={tape === 'red' ? .28 : .35} />
      {tape === 'red' && w > 40 && <text x={tx + tw / 2} y={y + h * .2} fontSize={tw * .42} fontWeight="600" fill="#fff" fillOpacity=".85" textAnchor="middle" fontFamily="Geist Variable, sans-serif" transform={`rotate(90 ${tx + tw / 2} ${y + h * .18})`} letterSpacing=".2">PHOENIX</text>}
    </g>}
    {label && <ShipLabel x={x + w * .07} y={y + h * .56} w={Math.min(w * .44, 34)} h={Math.min(w * .44, 34) * .64} tilt={-1.2} />}
    {dg && <g transform={`translate(${x + w * .72} ${y + h * .55}) rotate(45)`}>
      <rect x={-w * .11} y={-w * .11} width={w * .22} height={w * .22} fill="#fff" stroke="#1d1a1b" strokeWidth=".6" />
      <rect x={-w * .11} y={-w * .11} width={w * .22} height={w * .09} fill="#d8262e" />
      <rect x={-w * .095} y={-w * .095} width={w * .19} height={w * .19} fill="none" stroke="#1d1a1b" strokeWidth=".3" />
    </g>}
    {/* crisp edges: lit top edges, dark bottom */}
    <path d={`M${x} ${y}h${w}l${d} ${-dy}`} stroke="#fff3dc" strokeOpacity=".7" strokeWidth=".55" fill="none" />
    <path d={`M${x} ${y}l${d} ${-dy}h${w}`} stroke="#fff3dc" strokeOpacity=".4" strokeWidth=".45" fill="none" />
    <path d={`M${x} ${y}v${h}h${w}l${d} ${-dy}`} stroke="#3b2410" strokeOpacity=".45" strokeWidth=".5" fill="none" />
  </g>;
}

// A timber pallet (front view with a little depth). (x, y) is the top of the deck; it is 15 tall.
export function Pallet({ x, y, w, d = 8 }) {
  const dy = d * .72, blocks = [0, w / 2 - w * .07, w - w * .14], bw = w * .14;
  return <g>
    <path d={`M${x + w} ${y}l${d} ${-dy}v4l${-d} ${dy}z`} fill="#8a6436" />
    <rect x={x} y={y} width={w} height="4" fill="url(#fa-board)" /><rect x={x} y={y} width={w} height="4" fill="url(#fa-grain)" />
    {[.2, .4, .6, .8].map(k => <rect key={k} x={x + w * k} y={y} width=".5" height="4" fill="#5c3e1d" opacity=".55" />)}
    <rect x={x} y={y} width={w} height=".6" fill="#f6dcae" opacity=".8" />
    <rect x={x} y={y + 4} width={w} height="7" fill="#1a1412" opacity=".9" />
    {blocks.map(bx => <g key={bx}>
      <rect x={x + bx} y={y + 4} width={bw} height="7.5" fill="url(#fa-block)" /><rect x={x + bx} y={y + 4} width={bw} height="7.5" fill="url(#fa-grain)" />
      <rect x={x + bx} y={y + 4} width={bw} height="1" fill="#000" opacity=".25" />
      {[.25, .75].map(k => <circle key={k} cx={x + bx + bw * k} cy={y + 2} r=".45" fill="#4a463f" />)}
      {[.3, .7].map(k => <circle key={k} cx={x + bx + bw * k} cy={y + 13} r=".4" fill="#4a463f" />)}
    </g>)}
    <rect x={x} y={y + 11.5} width={w} height="3.5" fill="url(#fa-board)" /><rect x={x} y={y + 11.5} width={w} height="3.5" fill="url(#fa-grain)" />
    <rect x={x} y={y + 14.4} width={w} height=".6" fill="#3d2810" opacity=".6" />
  </g>;
}

// Stretch film over a load: sheen, banding, and folds at the edges.
export function Film({ x, y, w, h, d = 8 }) {
  const dy = d * .72;
  return <g>
    <path d={`M${x} ${y}h${w}v${h}h${-w}z`} fill="url(#fa-film)" />
    <path d={`M${x} ${y}h${w}v${h}h${-w}z`} fill="url(#fa-film-bands)" />
    <path d={`M${x + w} ${y}l${d} ${-dy}v${h}l${-d} ${dy}z`} fill="#fff" fillOpacity=".1" />
    <path d={`M${x} ${y}l${d} ${-dy}h${w}l${-d} ${dy}z`} fill="#fff" fillOpacity=".08" />
    <path d={`M${x + .8} ${y}v${h}`} stroke="#fff" strokeOpacity=".55" strokeWidth="1.1" />
    <path d={`M${x + w - .6} ${y}v${h}`} stroke="#fff" strokeOpacity=".35" strokeWidth=".7" />
    {[.18, .47, .73].map((k, i) => <path key={k} d={`M${x} ${y + h * k}c${w * .3} ${-h * .03} ${w * .62} ${h * .05} ${w} ${-h * .015}`} stroke="#fff" strokeOpacity={.32 - i * .05} strokeWidth=".6" fill="none" />)}
    <path d={`M${x} ${y + h * .3}l${w * .1} ${h * .05}M${x + w} ${y + h * .62}l${-w * .08} ${h * .04}`} stroke="#fff" strokeOpacity=".4" strokeWidth=".5" />
  </g>;
}

// A 20ft box, long side on, with the door end visible on the right.
export function Container({ x = 0, y = 0, w = 160, h = 62, d = 9 }) {
  const dy = d * .72, rail = h * .07, post = w * .022;
  const casting = (cx, cy) => <g key={cx + ',' + cy}><rect x={cx - 2.2} y={cy - 1.8} width="4.4" height="3.6" fill="#7a0d12" /><ellipse cx={cx} cy={cy} rx="1.2" ry=".7" fill="#2a0507" /></g>;
  return <g>
    {/* door end */}
    <path d={`M${x + w} ${y}l${d} ${-dy}v${h}l${-d} ${dy}z`} fill="#8e1218" />
    {[.22, .4, .62, .8].map(k => <g key={k}>
      <path d={`M${x + w + d * k} ${y - dy * k + 2}v${h - 4}`} stroke="#d9d2cf" strokeOpacity=".85" strokeWidth=".9" />
      <path d={`M${x + w + d * k - .5} ${y - dy * k + h * .55}h1.4`} stroke="#d8d2cf" strokeWidth=".6" />
    </g>)}
    {/* roof */}
    <path d={`M${x} ${y}l${d} ${-dy}h${w}l${-d} ${dy}z`} fill="#e8474e" />
    {Array.from({ length: Math.floor(w / 9) }, (_, i) => <path key={i} d={`M${x + 4 + i * 9} ${y}l${d} ${-dy}`} stroke="#b51920" strokeOpacity=".5" strokeWidth=".6" />)}
    {/* corrugated side */}
    <rect x={x} y={y} width={w} height={h} fill="url(#fa-ribs)" />
    <rect x={x} y={y} width={w} height={h} fill="url(#fa-ctr-light)" />
    <rect x={x} y={y} width={w} height={rail} fill="#b3171e" /><rect x={x} y={y} width={w} height=".6" fill="#ff8a8f" opacity=".7" />
    <rect x={x} y={y + h - rail} width={w} height={rail} fill="#7d0f14" />
    <rect x={x} y={y} width={post} height={h} fill="#9a1318" /><rect x={x + w - post} y={y} width={post} height={h} fill="#9a1318" />
    {casting(x + post / 2 + 1, y + rail / 2 + .3)}{casting(x + w - post / 2 - 1, y + rail / 2 + .3)}
    {casting(x + post / 2 + 1, y + h - rail / 2)}{casting(x + w - post / 2 - 1, y + h - rail / 2)}
    {/* markings */}
    <text x={x + w * .5} y={y + h * .57} textAnchor="middle" fontSize={h * .2} fontWeight="600" letterSpacing="-.3" fill="#fff" fillOpacity=".92" fontFamily="Geist Variable, sans-serif">PHOENIX</text>
    <text x={x + w * .5} y={y + h * .7} textAnchor="middle" fontSize={h * .065} fontWeight="500" letterSpacing="1.2" fill="#fff" fillOpacity=".7" fontFamily="Geist Variable, sans-serif">GLOBAL LOGISTICS</text>
    <text x={x + w - post - 3} y={y + rail + h * .1} textAnchor="end" fontSize={h * .075} fontWeight="600" fill="#fff" fillOpacity=".85" fontFamily="ui-monospace, monospace">PHXU 204871 2</text>
    <text x={x + w - post - 3} y={y + rail + h * .19} textAnchor="end" fontSize={h * .06} fill="#fff" fillOpacity=".7" fontFamily="ui-monospace, monospace">22G1</text>
    <text x={x + post + 3} y={y + h - rail - h * .12} fontSize={h * .045} fill="#fff" fillOpacity=".6" fontFamily="ui-monospace, monospace">MAX GROSS 30,480 KG</text>
    <text x={x + post + 3} y={y + h - rail - h * .05} fontSize={h * .045} fill="#fff" fillOpacity=".6" fontFamily="ui-monospace, monospace">TARE 2,200 KG</text>
    <rect x={x + w * .78} y={y + h - rail - h * .17} width={h * .14} height={h * .1} fill="#e6e1de" /><rect x={x + w * .78 + .6} y={y + h - rail - h * .17 + .6} width={h * .14 - 1.2} height=".5" fill="#8d8582" />
    <path d={`M${x} ${y}v${h}h${w}`} stroke="#4a070a" strokeOpacity=".6" strokeWidth=".6" fill="none" />
  </g>;
}
