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

function NetworkMap() {
  return <div className="fb-network">
    <ul className="fb-network-places" aria-label="Where we operate">
      <li><b>Sydney</b><span>Head depot · Wetherill Park</span></li>
      <li><b>Melbourne</b><span>Truganina, VIC</span></li>
      <li><b>Australia-wide</b><span>Metro, interstate and linehaul</span></li>
      <li><b>China</b><span>Air and sea freight partners</span></li>
    </ul>
    <svg className="fb-network-map" viewBox="270 20 610 940" role="img" aria-label="Map of China and Australia with Phoenix routes from Sydney and Melbourne across Australia and a sea route from China">
      <path d={MAP.rest} className="fb-land" />
      <path d={MAP.cn} className="fb-land fb-land-key" />
      <path d={MAP.au} className="fb-land fb-land-key" />
      <path d={arc(CITIES.China, CITIES.Sydney, -.18)} className="fb-route fb-route-sea" pathLength="1" />
      {ROUTES.map(([a, b], i) => <path key={a + b} d={arc(CITIES[a], CITIES[b])} className="fb-route" pathLength="1" style={{ '--i': i }} />)}
      {Object.entries(CITIES).map(([name, [x, y]]) => {
        const key = ['Sydney', 'Melbourne', 'China'].includes(name);
        return <g key={name} transform={`translate(${x} ${y})`} className={key ? 'fb-pin fb-pin-key' : 'fb-pin'}>
          {key && <circle r="18" className="fb-pulse" />}
          <circle r={key ? 8 : 5} />
          {key && <text x={name === 'Melbourne' ? -14 : 14} y="5" textAnchor={name === 'Melbourne' ? 'end' : 'start'}>{name}</text>}
        </g>;
      })}
    </svg>
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
    <span className="fb-route-line"><span className="fb-route-fill" /></span>
    {STAGE_CARDS.map((id, i) => <span key={id} className={'fb-route-stop' + (i <= stage ? ' is-done' : '')} style={{ '--n': i }} />)}
    <span className="fb-route-truck">
      <svg viewBox="0 0 40 24"><path d="M1 4h23v15H1z" fill="#e31b24"/><path d="M24 9h8l7 6v4H24z" fill="#232022"/><circle cx="8" cy="20" r="3.3" fill="#232022" stroke="#fff" strokeWidth="1.4"/><circle cx="31" cy="20" r="3.3" fill="#232022" stroke="#fff" strokeWidth="1.4"/></svg>
    </span>
  </div>;
}

// About: pallets go in, the curtain closes, the truck drives off, all on scroll.
const CURTAIN = [[41.6, 6], [98.9, 30.5], [98.9, 67.3], [41.6, 69.2]]; // trailer side in % of truck.webp
function curtainClip(p) {
  const [tl, tr, br, bl] = CURTAIN;
  const x = tl[0] + (tr[0] - tl[0]) * p;
  const yt = tl[1] + (tr[1] - tl[1]) * p, yb = bl[1] + (br[1] - bl[1]) * p;
  return `polygon(${tl[0]}% ${tl[1]}%, ${x}% ${yt}%, ${x}% ${yb}%, ${bl[0]}% ${bl[1]}%)`;
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
        const t = Math.min(1, Math.max(0, load * 3 - i));
        pl.style.transform = `translate(${(1 - t) * -180}%, 0)`;
        pl.style.opacity = String(t);
      });
      curtain.style.clipPath = curtainClip(close);
      vehicle.style.transform = `translateX(${drive * drive * 70}vw)`;
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
    const list = root.current?.parentElement;
    if (!list) return;
    if (reduced()) { list.setAttribute('data-live', ''); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { list.setAttribute('data-live', ''); io.disconnect(); } }, { threshold: .35 });
    io.observe(list);
    return () => io.disconnect();
  }, []);
  return <span ref={root} className="fb-live"><span className="fb-live-dot" />Handled in-house, every shipment</span>;
}

// Footer: a slim conveyor of cartons, a container and DG-labelled boxes in place of the link columns.
function Conveyor() {
  const items = ['box', 'box-tall', 'dg', 'container', 'box', 'box-wrap', 'dg', 'box-tall', 'container', 'box'];
  return <div className="fb-conveyor" aria-hidden="true">
    <div className="fb-belt-track">
      {[0, 1].map(k => <div key={k} className="fb-belt-run">
        {items.map((t, i) => <span key={i} className={'fb-item fb-' + t}>{t === 'dg' && <i>9</i>}</span>)}
      </div>)}
    </div>
    <span className="fb-belt" />
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

const parts = {
  network: NetworkMap, 'partner-panel': PartnerPanel, 'stage-route': StageRoute, 'truck-load': TruckLoad,
  'values-photo': ValuesPhoto, 'include-pulse': IncludePulse, conveyor: Conveyor, 'quote-form': QuoteForm,
};

export function FeedbackPart({ name }) {
  const Part = parts[name];
  return Part ? <Part /> : null;
}

export { company };
