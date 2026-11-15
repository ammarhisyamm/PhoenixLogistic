// Components added for client feedback round 1. Each one is placed by feedback.js against a
// Figma layer and positioned in that layer's own artboard coordinates.
import { useEffect, useRef, useState } from 'react';
import { company, services } from '../../src/data';
import { MAP } from '../option2/mapData';
import { photos } from '../option2/photos';

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
    v.play().catch(() => {});
  }, []);
  return <span className="hero-video" aria-hidden="true">
    <video ref={video} muted loop playsInline preload="metadata" poster="/option2/media/cine-poster.webp">
      <source src="/option2/media/cine-720.av1.mp4" type='video/mp4; codecs="av01.0.05M.08"' />
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
const TRAFFIC = [[0, 7], [2, 9], [4, 11], [6, 8], [3, 10], [7, 12]];

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
    <div className="fb-network-frame">
      <svg className="fb-network-map" viewBox="230 -20 700 990" role="img" aria-label="Map of China and Australia with Phoenix road routes across Australia and a sea route from China">
        <defs>
          <radialGradient id="fb-fade" cx="55%" cy="55%" r="70%"><stop offset="72%" stopColor="#fff" /><stop offset="100%" stopColor="#fff" stopOpacity="0" /></radialGradient>
          <mask id="fb-mask"><rect x="230" y="-20" width="700" height="990" fill="url(#fb-fade)" /></mask>
        </defs>
        <g mask="url(#fb-mask)">
          <path d={MAP.rest} className="fb-land" />
          <path d={MAP.cn} className="fb-land fb-land-key" />
          <path d={MAP.au} className="fb-land fb-land-au" />
        </g>
        <path id="fb-sea" d={arc(CITIES.China, CITIES.Sydney, -.18)} className={'fb-route fb-route-sea' + (lit('China') || lit('Sydney') ? '' : ' is-dim')} />
        {ROUTES.map(([a, b], i) => <path key={a + b} id={'fb-r' + i} d={arc(CITIES[a], CITIES[b])} className={'fb-route' + (routeLit([a, b]) ? '' : ' is-dim')} pathLength="1" style={{ '--i': i }} />)}
        {TRAFFIC.map(([route, dur], k) => <circle key={k} r="5" className="fb-traffic">
          <animateMotion dur={dur + 's'} repeatCount="indefinite" begin={(k * 1.3) + 's'} keyPoints={k % 2 ? '1;0' : '0;1'} keyTimes="0;1" calcMode="linear"><mpath href={'#fb-r' + route} /></animateMotion>
        </circle>)}
        <g className="fb-ship"><animateMotion dur="16s" repeatCount="indefinite" rotate="auto"><mpath href="#fb-sea" /></animateMotion><rect x="-11" y="-4" width="22" height="8" rx="3" /></g>
        {Object.entries(CITIES).map(([name, [x, y]]) => {
          const key = ['Sydney', 'Melbourne', 'China'].includes(name);
          return <g key={name} transform={`translate(${x} ${y})`} className={'fb-pin' + (key ? ' fb-pin-key' : '') + (lit(name) ? '' : ' is-dim')}>
            {key && <circle r="18" className="fb-pulse" />}
            <circle r={key ? 9 : 5} />
            <text x={name === 'Melbourne' || name === 'Adelaide' || name === 'Perth' ? -14 : 14} y="5" textAnchor={name === 'Melbourne' || name === 'Adelaide' || name === 'Perth' ? 'end' : 'start'} className={key ? '' : 'fb-pin-minor'}>{name}</text>
          </g>;
        })}
      </svg>
    </div>
  </div>;
}

// Home / Why: Amazon partner card in the empty left column, moved down from the hero.
function PartnerPanel() {
  return <div className="fb-partner">
    <div className="fb-partner-sticky">
      <img src={card('rollers-03')} alt="Phoenix curtainsider truck on the motorway at golden hour" loading="lazy" />
      <div className="fb-partner-card">
        <span className="fb-partner-logo"><AmazonMark size={44} /></span>
        <div>
          <p className="fb-partner-title">Amazon Partner Carrier</p>
          <p className="fb-partner-text">Approved for small-parcel deliveries into Amazon fulfilment centres across NSW, QLD and VIC.</p>
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
        {[0, 1, 2].map(i => <span key={i} className="fb-pallet" style={{ '--n': i }} />)}
      </span>
      <img src="/option2/media/truck.webp" alt="" className="fb-truck-curtain" />
    </div>
  </div>;
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
function Barcode({ x, y, w, h }) {
  const bars = [2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1];
  let cx = x;
  const unit = w / bars.reduce((a, b) => a + b + 1, 0);
  return <g fill="#2b2526">{bars.map((b, i) => { const r = <rect key={i} x={cx} y={y} width={b * unit} height={h} />; cx += (b + 1) * unit; return r; })}</g>;
}
function Carton({ w = 64, h = 54, tape = true, label = true, fragile = false }) {
  return <svg className="fb-parcel" width={w} height={h + 8} viewBox={`0 0 ${w} ${h + 8}`}>
    <defs>
      <linearGradient id={`cb${w}${h}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d9b384" /><stop offset=".55" stopColor="#c69a66" /><stop offset="1" stopColor="#a87d4e" /></linearGradient>
    </defs>
    <path d={`M0 8 L8 0 H${w} V${h} L${w - 8} ${h + 8} H0 Z`} fill="#8f6a41" />
    <rect x="0" y="8" width={w - 8} height={h} rx="2" fill={`url(#cb${w}${h})`} />
    <path d={`M0 8 L8 0 H${w} L${w - 8} 8 Z`} fill="#e4c597" />
    <path d={`M${w - 8} 8 L${w} 0 V${h} L${w - 8} ${h + 8} Z`} fill="#9c7447" />
    {tape && <>
      <rect x={(w - 8) / 2 - 5} y="8" width="10" height={h} fill="#d8262e" opacity=".92" />
      <path d={`M${(w - 8) / 2 - 5 + 2} 8 L${(w - 8) / 2 + 2 + 3} 0 H${(w - 8) / 2 + 13} L${(w - 8) / 2 + 5} 8 Z`} fill="#ef4249" />
      <rect x={(w - 8) / 2 - 5} y="8" width="10" height={h} fill="url(#fb-sheen)" />
    </>}
    {label && <g>
      <rect x="5" y={h - 14} width={(w - 8) / 2 - 13} height="16" rx="1.5" fill="#fbf8f4" />
      <Barcode x={7} y={h - 11} w={(w - 8) / 2 - 17} h={6} />
      <rect x="7" y={h - 3} width={(w - 8) / 2 - 22} height="1.6" fill="#9a908c" />
    </g>}
    {fragile && <g fill="none" stroke="#5b4129" strokeWidth="1.4" strokeLinecap="round"><path d={`M${w - 22} 22 v-8 m-3 3 l3 -3 l3 3`} /><path d={`M${w - 15} 22 v-8 m-3 3 l3 -3 l3 3`} /></g>}
  </svg>;
}
function DgParcel() {
  return <svg className="fb-parcel" width="62" height="64" viewBox="0 0 62 64">
    <path d="M0 8 L8 0 H62 V56 L54 64 H0 Z" fill="#8f6a41" />
    <rect x="0" y="8" width="54" height="56" rx="2" fill="url(#cb6456)" />
    <path d="M0 8 L8 0 H62 L54 8 Z" fill="#e4c597" />
    <path d="M54 8 L62 0 V56 L54 64 Z" fill="#9c7447" />
    <g transform="translate(27 36) rotate(45)"><rect x="-13" y="-13" width="26" height="26" rx="1.5" fill="#fff" stroke="#1d1a1b" strokeWidth="1.6" />
      <g stroke="#1d1a1b" strokeWidth="1.2">{[-8, -4, 0].map(o => <line key={o} x1={-10} y1={o} x2={10} y2={o} transform="rotate(-45)" />)}</g></g>
    <text x="27" y="47" textAnchor="middle" fontSize="8" fontWeight="700" fill="#1d1a1b" fontFamily="Geist Variable, sans-serif">9</text>
  </svg>;
}
function WrappedPallet() {
  return <svg className="fb-parcel" width="92" height="78" viewBox="0 0 92 78">
    <rect x="2" y="68" width="84" height="5" fill="#b78a57" /><rect x="2" y="73" width="10" height="5" fill="#9c7447" /><rect x="39" y="73" width="10" height="5" fill="#9c7447" /><rect x="76" y="73" width="10" height="5" fill="#9c7447" />
    {[[4, 40, 26, 28], [31, 40, 26, 28], [58, 40, 26, 28], [10, 14, 34, 26], [45, 14, 34, 26]].map(([x, y, w, h], i) => <g key={i}>
      <rect x={x} y={y} width={w} height={h} rx="1.5" fill="url(#cb6456)" stroke="#9c7447" strokeWidth=".8" />
      <rect x={x} y={y + h * .38} width={w} height="3" fill="#d8262e" opacity=".85" />
    </g>)}
    <path d="M2 12 H86 V68 H2 Z" fill="url(#fb-wrap)" />
    <path d="M6 20 L84 30 M4 44 L86 52 M6 58 L82 64" stroke="#ffffff6e" strokeWidth="1.2" />
  </svg>;
}
function MiniContainer() {
  return <svg className="fb-parcel" width="168" height="72" viewBox="0 0 168 72">
    <defs><linearGradient id="fb-ctr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e5333b" /><stop offset="1" stopColor="#a5141b" /></linearGradient></defs>
    <path d="M0 8 L8 0 H168 V62 L160 70 H0 Z" fill="#7d0f14" />
    <rect x="0" y="8" width="160" height="62" rx="2" fill="url(#fb-ctr)" />
    <path d="M0 8 L8 0 H168 L160 8 Z" fill="#ef5359" />
    {Array.from({ length: 22 }, (_, i) => <rect key={i} x={6 + i * 6.8} y="12" width="3" height="54" fill="#00000026" />)}
    <rect x="0" y="8" width="160" height="4" fill="#ffffff2e" /><rect x="0" y="66" width="160" height="4" fill="#00000033" />
    <rect x="4" y="12" width="2" height="54" fill="#5f0b0f" /><rect x="154" y="12" width="2" height="54" fill="#5f0b0f" />
    <text x="80" y="44" textAnchor="middle" fontSize="13" fontWeight="700" letterSpacing="-.3" fill="#ffffffe6" fontFamily="Geist Variable, sans-serif">PHOENIX</text>
    <text x="146" y="22" textAnchor="end" fontSize="5.5" fill="#ffffffb3" fontFamily="monospace">PHXU 204871 2</text>
  </svg>;
}
function Conveyor() {
  const items = ['box', 'tall', 'dg', 'container', 'box', 'pallet', 'dg', 'tall', 'container', 'box'];
  const draw = t => t === 'dg' ? <DgParcel /> : t === 'container' ? <MiniContainer /> : t === 'pallet' ? <WrappedPallet /> : t === 'tall' ? <Carton w={52} h={70} fragile /> : <Carton />;
  return <div className="fb-conveyor" aria-hidden="true">
    <svg width="0" height="0" style={{ position: 'absolute' }}><defs>
      <linearGradient id="cb6456" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d9b384" /><stop offset=".55" stopColor="#c69a66" /><stop offset="1" stopColor="#a87d4e" /></linearGradient>
      <linearGradient id="fb-sheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".5" stopColor="#fff" stopOpacity=".28" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
      <linearGradient id="fb-wrap" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".34" /><stop offset=".5" stopColor="#fff" stopOpacity=".08" /><stop offset="1" stopColor="#fff" stopOpacity=".26" /></linearGradient>
    </defs></svg>
    <div className="fb-belt-track">
      {[0, 1].map(k => <div key={k} className="fb-belt-run">
        {items.map((t, i) => <span key={i} className="fb-item">{draw(t)}</span>)}
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

const parts = {
  network: NetworkMap, 'partner-panel': PartnerPanel, 'stage-route': StageRoute, 'truck-load': TruckLoad,
  'values-photo': ValuesPhoto, 'include-pulse': IncludePulse, conveyor: Conveyor, 'quote-form': QuoteForm,
  'about-bento': AboutBento, values: Values, 'related-hover': RelatedHover,
};

export function FeedbackPart({ name }) {
  const Part = parts[name];
  return Part ? <Part /> : null;
}

export { company };
