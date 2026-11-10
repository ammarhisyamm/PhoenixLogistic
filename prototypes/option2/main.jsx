import { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, StaticRouter, Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowUpRight, ArrowsOut, CaretDown, CheckCircle, Crosshair, EnvelopeSimple } from '@phosphor-icons/react';
import '@fontsource-variable/inter';
import '@fontsource-variable/manrope';
import { company, faqs, importEmail, qualitySteps, sectors, services, trackingDestination, transportEmail } from '../../src/data';
import { photos } from './photos';
import { MAP } from './mapData';
import { detailIcons, sectorIcons, serviceIcons, stageIcons, stepIcons, valueIcons } from './icons';
import { Boat, ClipboardText, Globe, Package, Plant, Truck, Users, Warehouse } from '@phosphor-icons/react';
import { coverThen, isStatic, scrollToEl, useCursor, usePageMotion } from './motion';
import './option2.css';

const BASE = '/option-2';
const nav = [['Why Phoenix', '/why-phoenix'], ['About', '/about'], ['Contact', '/contact']];

/* ---------- Small building blocks ---------- */

// Headline with each line in its own mask so it can wipe and rise into place.
function Lines({ as: Tag = 'h2', lines, className = '' }) {
  return <Tag className={className} data-lines>
    {lines.map((line, i) => <span className="ln" key={i}><span>{line}</span>{i < lines.length - 1 ? ' ' : null}</span>)}
  </Tag>;
}

function Arrow() {
  return <svg className="arrow" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>;
}

function BtnText({ children }) {
  return <span className="btn-text"><span>{children}</span><span aria-hidden="true">{children}</span></span>;
}

function Button({ to, href, children, variant = 'primary' }) {
  const inner = <><BtnText>{children}</BtnText><Arrow /></>;
  const cls = 'btn btn-' + variant;
  return href ? <a className={cls} href={href}>{inner}</a> : <Link className={cls} to={to}>{inner}</Link>;
}

// Amazon mark (Simple Icons, CC0) for the Amazon Partner Carrier badge.
function AmazonLogo({ size = 28 }) {
  return <svg className="badge-logo" viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true"><path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726a17.617 17.617 0 01-10.951-.577 17.88 17.88 0 01-5.43-3.35c-.1-.074-.151-.15-.151-.22 0-.047.021-.09.051-.13zm6.565-6.218c0-1.005.247-1.863.743-2.577.495-.71 1.17-1.25 2.04-1.615.796-.335 1.756-.575 2.912-.72.39-.046 1.033-.103 1.92-.174v-.37c0-.93-.105-1.558-.3-1.875-.302-.43-.78-.65-1.44-.65h-.182c-.48.046-.896.196-1.246.46-.35.27-.575.63-.675 1.096-.06.3-.206.465-.435.51l-2.52-.315c-.248-.06-.372-.18-.372-.39 0-.046.007-.09.022-.15.247-1.29.855-2.25 1.82-2.88.976-.616 2.1-.975 3.39-1.05h.54c1.65 0 2.957.434 3.888 1.29.135.15.27.3.405.48.12.165.224.314.283.45.075.134.15.33.195.57.06.254.105.42.135.51.03.104.062.3.076.615.01.313.02.493.02.553v5.28c0 .376.06.72.165 1.036.105.313.21.54.315.674l.51.674c.09.136.136.256.136.36 0 .12-.06.226-.18.314-1.2 1.05-1.86 1.62-1.963 1.71-.165.135-.375.15-.63.045a6.062 6.062 0 01-.526-.496l-.31-.347a9.391 9.391 0 01-.317-.42l-.3-.435c-.81.886-1.603 1.44-2.4 1.665-.494.15-1.093.227-1.83.227-1.11 0-2.04-.343-2.76-1.034-.72-.69-1.08-1.665-1.08-2.94l-.05-.076zm3.753-.438c0 .566.14 1.02.425 1.364.285.34.675.512 1.155.512.045 0 .106-.007.195-.02.09-.016.134-.023.166-.023.614-.16 1.08-.553 1.424-1.178.165-.28.285-.58.36-.91.09-.32.12-.59.135-.8.015-.195.015-.54.015-1.005v-.54c-.84 0-1.484.06-1.92.18-1.275.36-1.92 1.17-1.92 2.43l-.035-.02zm9.162 7.027c.03-.06.075-.11.132-.17.362-.243.714-.41 1.05-.5a8.094 8.094 0 011.612-.24c.14-.012.28 0 .41.03.65.06 1.05.168 1.172.33.063.09.099.228.099.39v.15c0 .51-.149 1.11-.424 1.8-.278.69-.664 1.248-1.156 1.68-.073.06-.14.09-.197.09-.03 0-.06 0-.09-.012-.09-.044-.107-.12-.064-.24.54-1.26.806-2.143.806-2.64 0-.15-.03-.27-.087-.344-.145-.166-.55-.257-1.224-.257-.243 0-.533.016-.87.046-.363.045-.7.09-1 .135-.09 0-.148-.014-.18-.044-.03-.03-.036-.047-.02-.077 0-.017.006-.03.02-.063v-.06z" /></svg>;
}

function Icon({ as: Cmp, size = 32, className = 'ico', weight = 'light' }) {
  return Cmp ? <Cmp className={className} size={size} weight={weight} aria-hidden="true" /> : null;
}

function Photo({ src, alt = '', className = '', reveal = true, parallax = 8, eager }) {
  return <figure className={'photo ' + className} data-reveal={reveal ? '' : undefined}>
    <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" data-parallax={parallax || undefined} />
  </figure>;
}

function PageHero({ lines, text, image, alt, children, tall }) {
  return <section className={'page-hero' + (tall ? ' page-hero-tall' : '')} data-hero>
    <div className="page-hero-media"><img src={image} srcSet={/@1200\.webp$/.test(image) ? undefined : `${image.replace(/\.webp$/, '@640.webp')} 640w, ${image.replace(/\.webp$/, '@1200.webp')} 1200w, ${image} 2400w`} sizes="(max-width: 767px) 80vw, 100vw" width="2400" height="1600" alt={alt || ''} fetchPriority="high" data-hero-media /></div>
    <div className="page-hero-shade" aria-hidden="true" />
    <div className="wrap page-hero-inner">
      <Lines as="h1" className="display" lines={lines} />
      {text && <p className="page-hero-text" data-fade="0.5">{text}</p>}
      {children}
    </div>
  </section>;
}

function Stats({ dark }) {
  const items = [[600, '+', 'Containers handled every year'], [660, 'k+', 'Boxes processed every year'], [20, '+', 'Years of cargo experience']];
  return <div className={'stats' + (dark ? ' stats-dark' : '')}>
    <span className="stats-rule" data-line aria-hidden="true" />
    {items.map(([n, suffix, label]) => <div className="stat" key={label}>
      <p className="stat-number"><span data-count={n}>{n}</span>{suffix}</p>
      <p className="stat-label">{label}</p>
    </div>)}
  </div>;
}

function TrackForm({ compact }) {
  const [note, setNote] = useState('');
  const submit = e => {
    e.preventDefault();
    const ref = String(new FormData(e.currentTarget).get('consignment') || '').trim();
    if (!/^[a-zA-Z0-9 _./-]{1,80}$/.test(ref)) { setNote('Enter the consignment reference from your booking confirmation.'); return; }
    const url = trackingDestination(ref);
    if (url) { location.assign(url); return; }
    setNote(`For ${ref}, use the tracking link on your booking confirmation or email ${transportEmail}.`);
  };
  return <form className={'track' + (compact ? ' track-compact' : '')} onSubmit={submit}>
    <label htmlFor={compact ? 'track-c' : 'track'}>Consignment number</label>
    <div className="track-row">
      <input id={compact ? 'track-c' : 'track'} name="consignment" placeholder="PGL000123456" autoComplete="off" onChange={() => setNote('')} />
      <button type="submit" className="track-go"><BtnText>Track</BtnText><Arrow /></button>
    </div>
    <p className="track-note" role="status">{note || 'Use the reference on your booking confirmation.'}</p>
  </form>;
}

function Cta({ heading = ["Let's plan your", 'next shipment.'], text = 'Send your origin, destination and freight details to our team.' }) {
  return <section className="cta">
    <div className="cta-media"><img src={photos.night} alt="" loading="lazy" data-parallax="12" /></div>
    <div className="cta-shade" aria-hidden="true" />
    <div className="wrap cta-inner">
      <Lines className="display display-xl" lines={heading} />
      <p data-fade>{text}</p>
      <div className="cta-actions" data-fade="0.1">
        <Button to="/contact">Request a quote</Button>
        <Button href={'mailto:' + transportEmail} variant="ghost-light">Email operations</Button>
      </div>
    </div>
  </section>;
}

/* ---------- Header with services mega menu ---------- */

function MegaMenu({ open, onClose }) {
  const [active, setActive] = useState(services[0].slug);
  const current = services.find(s => s.slug === active);
  return <div id="mega" className={'mega' + (open ? ' is-open' : '')} aria-hidden={!open} inert={!open || undefined}>
    <div className="mega-body">
      <ul className="mega-list">
        {services.map((s, i) => <li key={s.slug} style={{ '--i': i }}>
          <Link to={'/services/' + s.slug} onPointerEnter={() => setActive(s.slug)} onFocus={() => setActive(s.slug)} onClick={onClose} className={active === s.slug ? 'is-active' : undefined}>
            <Icon as={serviceIcons[s.slug]} size={28} weight={active === s.slug ? 'fill' : 'light'} />
            <span><strong>{s.title}</strong></span>
            <ArrowUpRight className="mega-go" size={18} aria-hidden="true" />
          </Link>
        </li>)}
      </ul>
      <Link to={'/services/' + current.slug} className="mega-media" onClick={onClose} tabIndex={-1}>
        {services.map(s => <img key={s.slug} src={photos.services[s.slug]} alt="" className={s.slug === active ? 'is-on' : ''} loading="lazy" />)}
        <span className="mega-caption"><span>{current.shortTitle}</span><small>{current.description}</small></span>
      </Link>
    </div>
  </div>;
}

// Floating pill navigation, fixed at the top of the screen.
function Header() {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); setMega(false); }, [pathname]);
  useEffect(() => {
    const esc = e => { if (e.key === 'Escape') { setMega(false); setOpen(false); } };
    addEventListener('keydown', esc);
    return () => removeEventListener('keydown', esc);
  }, []);
  // Services opens and closes on click only (no hover timers fighting the click); the backdrop,
  // Escape or any nav link closes it.
  return <>
    <div className={'mega-backdrop' + (mega || open ? ' is-on' : '')} onClick={() => { setMega(false); setOpen(false); }} aria-hidden="true" />
    <header className={'header' + (mega ? ' has-mega' : '') + (open ? ' has-menu' : '')}>
      <div className="header-bar">
        <div className="header-inner">
          <Link to="/" className="brand" aria-label="Phoenix Global Logistics home">
            <img src="/assets/phoenix-logo.png" alt="" width="52" height="44" />
          </Link>
          <nav className="nav" aria-label="Main">
            <button type="button" className={'nav-services' + (pathname.startsWith('/services') ? ' is-current' : '')} aria-expanded={mega} aria-controls="mega" onClick={() => { setOpen(false); setMega(m => !m); }}>
              Services<CaretDown size={12} weight="bold" aria-hidden="true" />
            </button>
            {nav.map(([label, to]) => <NavLink key={to} to={to} onClick={() => setMega(false)} className={({ isActive }) => isActive ? 'is-current' : undefined}>{label}</NavLink>)}
          </nav>
          <div className="header-actions">
            <Link className="header-link" to="/tracking" aria-label="Track a shipment"><Crosshair size={18} weight="regular" aria-hidden="true" /><span>Track</span></Link>
            <Link className="header-quote" to="/contact"><BtnText>Get a quote</BtnText><ArrowUpRight size={14} weight="bold" aria-hidden="true" /></Link>
            <button className="menu-toggle" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(o => !o)}><span /><span /><span className="sr-only">Menu</span></button>
          </div>
        </div>
        <MegaMenu open={mega} onClose={() => setMega(false)} />
        <div id="menu" className={'menu' + (open ? ' is-open' : '')} hidden={!open}>
          <Link to="/" style={{ '--i': 0 }}>Home</Link>
          <details style={{ '--i': 1 }}>
            <summary>Services<CaretDown size={18} aria-hidden="true" /></summary>
            <div className="menu-services">{services.map(s => <Link key={s.slug} to={'/services/' + s.slug}><Icon as={serviceIcons[s.slug]} size={22} />{s.title}</Link>)}</div>
          </details>
          {[...nav, ['Track a shipment', '/tracking']].map(([label, to], i) => <Link key={to} to={to} style={{ '--i': i + 2 }}>{label}</Link>)}
        </div>
      </div>
    </header>
  </>;
}

// Grid footer: every block sits in its own cell of one hairline grid.
function Footer() {
  return <footer className="footer">
    <div className="wrap">
      <div className="fgrid">
        <div className="fcell fcell-lead">
          <Link to="/" className="footer-logo" aria-label="Phoenix Global Logistics home"><img src="/assets/phoenix-logo-light.png" alt="" width="128" height="109" /></Link>
          <Lines className="display footer-heading" lines={['From container', 'to customer.']} />
          <p className="footer-summary">Australian family-owned logistics, with more than 20 years of cargo experience.</p>
        </div>
        <div className="fcell fcell-track"><p className="flabel">Track a shipment</p><TrackForm compact /></div>

        <div className="fcell"><p className="flabel">Services</p>{services.map(s => <Link key={s.slug} to={'/services/' + s.slug}>{s.title}</Link>)}</div>
        <div className="fcell"><p className="flabel">Company</p>
          <Link to="/why-phoenix">Why Phoenix</Link><Link to="/about">About us</Link><Link to="/contact">Contact</Link><Link to="/tracking">Track shipment</Link>
          <a href={company.clientLogin} rel="noopener">Transvirtual client login</a>
        </div>
        <div className="fcell"><p className="flabel">Contact</p>
          <a href={'mailto:' + transportEmail}>{transportEmail}</a><a href={'mailto:' + importEmail}>{importEmail}</a>
          <p>Office {company.officeHours}<br />Warehouse {company.warehouseHours}</p>
        </div>
        <div className="fcell footer-wechat"><p className="flabel">WeChat</p><img src="/assets/wechat-qr.png" alt="WeChat QR code for Phoenix Global Logistics" loading="lazy" width="96" height="96" /><p>Scan to connect</p></div>

        <div className="fcell fcell-depot"><p className="flabel">Head depot</p><strong>Sydney</strong><span>Wetherill Park, NSW</span></div>
        <div className="fcell fcell-depot"><p className="flabel">Depot</p><strong>Melbourne</strong><span>Victoria</span></div>
        <div className="fcell fcell-depot"><p className="flabel">Partners</p><strong>China</strong><span>Air and sea freight</span></div>
        <div className="fcell fcell-depot fcell-badge"><AmazonLogo size={30} /><span>Amazon Partner Carrier<small>NSW, QLD & VIC</small></span></div>

        

        <div className="fcell fcell-legal"><p>© 2026 Phoenix Global Logistics · ABN {company.abn}</p></div>
        <div className="fcell fcell-legal"><a href="/privacy">Privacy Policy</a></div>
        <div className="fcell fcell-legal"><a href="/terms">Terms of Carriage</a></div>
        <div className="fcell fcell-legal"><button type="button" className="to-top" onClick={() => scrollToEl(document.body, 0)}>Back to top <ArrowUpRight size={14} weight="bold" aria-hidden="true" /></button></div>
      </div>
    </div>
  </footer>;
}

/* ---------- Shared scenes ---------- */

// Two-tone statement beside a stack of big numbers that count up (sticky heading on desktop).
function Outcome({ muted, lines, thumb, intro, items, cta }) {
  return <section className="section outcome">
    <div className="wrap outcome-grid">
      <div className="outcome-head">
        <figure className="outcome-thumb" data-reveal><img src={thumb} alt="" loading="lazy" /></figure>
        <Lines className={'display display-xl two-tone tt-' + muted} lines={lines} />
      </div>
      <div className="outcome-side">
        <p className="outcome-intro" data-fade>{intro}</p>
        {cta && <div data-fade="0.1">{cta}</div>}
        <ul className="outcome-stats">
          {items.map(([n, suffix, label]) => <li key={label} data-focus>
            <p className="outcome-num">{n > 1900 ? n : <span data-count={n}>{n}</span>}{suffix}</p>
            <p className="outcome-label">{label}</p>
          </li>)}
        </ul>
      </div>
    </div>
  </section>;
}

// The Phoenix truck drives on a road that runs into the dark band: the lane markings stream past
// under the wheels while the chapters scroll sideways (pinned on wide screens).
function StoryRoad({ muted, lines, text, chapters }) {
  return <section className="sroad" data-sroad>
    <div className="sroad-top" aria-hidden="true">
      <div className="sroad-road"><span className="sroad-kerb" /><span className="sroad-lane" /><span className="sroad-lane sroad-lane-far" /></div>
      <div className="sroad-truck">
        <span className="sroad-shadow" />
        <div className="sroad-body"><img src="/option2/media/truck@700.webp" srcSet="/option2/media/truck@700.webp 700w, /option2/media/truck.webp 1400w" sizes="(max-width: 999px) 70vw, 34vw" width="700" height="401" alt="" loading="lazy" /></div>
      </div>
    </div>
    <div className="sroad-band">
      <div className="sroad-inner">
        <div className="sroad-intro">
          <Lines className={'display display-l two-tone tt-' + muted} lines={lines} />
          <p>{text}</p>
        </div>
        <div className="sroad-view">
          <ol className="sroad-track">
            {chapters.map(([tag, title, body, icon], i) => <li key={title} style={{ '--i': i }}>
              <span className="sroad-tag">{tag}</span>
              <Icon as={icon} size={30} />
              <h3>{title}</h3>
              <p>{body}</p>
            </li>)}
          </ol>
        </div>
      </div>
    </div>
  </section>;
}

// Pinned stepper: a blurred copy of the photo fills the screen, the sharp photo sits in a
// square frame, and the counter, title and text change step by step as you scroll.
function Forge({ items, cta }) {
  const total = String(items.length).padStart(2, '0');
  return <section className="forge" data-forge>
    <ol className="forge-stage">
      {items.map(([title, text, icon, image], i) => <li className="forge-step" key={title} style={{ '--i': i }}>
        <div className="forge-bg" aria-hidden="true"><img src={image} alt="" loading="lazy" /></div>
        <div className="wrap forge-grid">
          <figure className="forge-photo"><img src={image} alt="" loading="lazy" /></figure>
          <div className="forge-copy">
            <p className="forge-count"><b>{String(i + 1).padStart(2, '0')}</b> / {total}</p>
            <Icon as={icon} size={34} />
            <h3>{title}</h3>
            <p className="forge-text">{text}</p>
            {cta && <div className="forge-cta">{cta}</div>}
          </div>
        </div>
      </li>)}
      <li className="forge-progress" aria-hidden="true"><span /></li>
    </ol>
  </section>;
}

const STAGES = [
  ['Depot-in', 'Freight received and scanned into the depot.', 'In depot', 'Mon 07:42 · Wetherill Park'],
  ['Sorting', 'Goods checked on the Red Table, sorted and allocated for their next move.', 'Sorting', 'Mon 09:15 · Red Table'],
  ['Out for delivery', 'Scanned out at the depot and loaded with a driver for delivery.', 'On the road', 'Tue 06:30 · Linehaul'],
  ['Signed POD', 'Delivery signature recorded as proof of delivery.', 'Delivered', 'Tue 14:08 · Signed'],
];

// The Phoenix truck drives across the screen as you scroll; the headline is written in its wake.
function Drive({ words = ['On the road across', 'NSW, QLD & VIC.'], text, cta }) {
  return <section className="drive" data-drive>
    <div className="drive-stage">
      <div className="wrap drive-copy">
        <div className="drive-head">
          <h2 className="display display-xl drive-base" aria-hidden="true">{words.map((w, i) => <span key={i}>{w}</span>)}</h2>
          <h2 className="display display-xl drive-words">{words.map((w, i) => <span key={i}>{w}</span>)}</h2>
        </div>
        {text && <p className="drive-after">{text}</p>}
        {cta && <div className="drive-after">{cta}</div>}
      </div>
      <div className="drive-road" aria-hidden="true" />
      <div className="drive-truck" aria-hidden="true"><img src="/option2/media/truck.webp" srcSet="/option2/media/truck@700.webp 700w, /option2/media/truck.webp 1400w" sizes="(max-width: 999px) 70vw, 46vw" alt="" /></div>
      <p className="drive-speed" aria-hidden="true"><b>00</b><span>km/h<br />Linehaul</span></p>
    </div>
  </section>;
}

// Six quality steps as cards that stack on top of each other.
function StepStack() {
  return <ol className="stack" data-stack>
    {qualitySteps.map((s, i) => <li className="stack-card" key={s.title} style={{ '--i': i }}>
      <div className="stack-inner">
        <div className="stack-copy">
          <Icon as={stepIcons[i]} size={56} />
          <h3>{s.title}</h3>
          <p className="stack-desc">{s.text}</p>
          <p className="stack-count">Step {i + 1} of {qualitySteps.length}</p>
        </div>
        <figure className="stack-photo"><img src={photos.steps[i]} alt="" loading="lazy" /></figure>
      </div>
    </li>)}
  </ol>;
}

// Real Asia-Pacific map. Pick a location and the map flies to it; "All locations" pulls back out.
const DEPOTS = [
  { city: 'Sydney', place: 'Wetherill Park, NSW', text: 'Head depot. Warehousing, 3PL and Amazon FBA prep, open 06:00–17:30.', photo: photos.depots.Sydney, zoom: 3.4 },
  { city: 'Melbourne', place: 'Victoria', text: 'Warehousing and distribution for Victorian customers, linked to Sydney by overnight linehaul.', photo: photos.depots.Melbourne, zoom: 3.4 },
  { city: 'China', place: 'Supply-chain partners', text: 'Consolidation plus air and sea freight into Sydney, cleared and moved on by our team.', photo: photos.depots.China, zoom: 2.6 },
];
function Network() {
  const [active, setActive] = useState(null);
  const focus = DEPOTS.find(d => d.city === active);
  const S = MAP.W;
  // Camera: scale and offset that put the chosen city in the middle of the frame.
  const cam = focus ? (() => { const [x, y] = MAP.cities[focus.city]; const s = focus.zoom; return { s, tx: S / 2 - x * s, ty: S / 2 - y * s }; })() : { s: 1, tx: 0, ty: 0 };
  const at = name => { const [x, y] = MAP.cities[name]; return `translate(${x * cam.s + cam.tx}px, ${y * cam.s + cam.ty}px)`; };
  const pick = city => setActive(a => (a === city ? null : city));
  return <section className="section network">
    <div className="wrap">
      <div className="split-head">
        <Lines className="display display-l" lines={['Two depots and a', 'trade bridge to China.']} />
        <div data-fade><p>Select a location to fly to it on the map. Our road coverage runs across NSW, QLD and VIC.</p><Button to="/contact" variant="ghost">Contact our depots</Button></div>
      </div>
      <div className={'net-grid' + (active ? ' is-' + active.toLowerCase() : ' is-all')}>
        <div className="net-map">
          <svg viewBox={`0 0 ${S} ${S}`} role="img" aria-label="Map of the Asia-Pacific showing Phoenix depots in Sydney and Melbourne and partners in China">
            <g className="net-cam" style={{ transform: `translate(${cam.tx}px, ${cam.ty}px) scale(${cam.s})` }}>
              <rect width={S} height={S} className="net-sea" />
              <path d={MAP.rest} className="land" />
              <path d={MAP.cn} className="land land-key land-cn" />
              <path d={MAP.au} className="land land-key" />
              <path d={MAP.nsw} className="land-state land-nsw" />
              <path d={MAP.vic} className="land-state land-vic" />
            </g>
            {DEPOTS.map(d => <g key={d.city} className={'net-pin' + (active === d.city ? ' is-active' : '')} style={{ transform: at(d.city) }} onClick={() => pick(d.city)}>
              <circle className="net-pulse" r="18" /><circle className="net-dot" r="8" />
              <text x={d.city === 'Melbourne' ? -16 : 16} y={d.city === 'Melbourne' ? 30 : 5} textAnchor={d.city === 'Melbourne' ? 'end' : 'start'}>{d.city}</text>
            </g>)}
          </svg>
          <button type="button" className={'net-reset' + (active ? ' is-on' : '')} onClick={() => setActive(null)}><ArrowsOut size={16} aria-hidden="true" />All locations</button>
        </div>
        <div className="net-side">
        <ul className="net-list">
          {DEPOTS.map(d => <li key={d.city} className={active === d.city ? 'is-active' : undefined}>
            <button type="button" className="net-head" aria-expanded={active === d.city} onClick={() => pick(d.city)}><span className="net-city">{d.city}</span><span className="net-place">{d.place}</span></button>
            <div className="net-more"><div><p>{d.text}</p></div></div>
          </li>)}
        </ul>
        </div>
      </div>
    </div>
  </section>;
}

function Sectors() {
  const copy = {
    Retail: 'Store replenishment, pallet storage and scheduled deliveries for retail stock.',
    'E-commerce': 'Pick, pack and ship, plus Amazon FBA inbound for online sellers.',
    'Solar & renewable technology': 'Careful handling for panels, inverters and lithium battery freight, assessed before booking.',
    FMCG: 'Regular freight for fast-turning goods between depots, distribution centres and stores.',
    'International imports': 'Container arrivals, customs coordination and onward distribution across Australia.',
  };
  const [active, setActive] = useState(-1);
  return <section className="section sectors">
    <div className="wrap">
      <div className="split-head">
        <Lines className="display display-l" lines={['Freight behind', 'Australian business.']} />
        <p data-fade>Operational experience across retail, e-commerce, renewable technology, FMCG and international imports.</p>
      </div>
      <div className={'sector-row' + (active >= 0 ? ' has-active' : '')} data-stagger onPointerLeave={e => { if (e.pointerType === 'mouse') setActive(-1); }}>
        {sectors.map((s, i) => <article className={'sector' + (active === i ? ' is-active' : '')} key={s} onPointerEnter={e => { if (e.pointerType === 'mouse') setActive(i); }} onClick={() => setActive(a => (a === i ? -1 : i))} onFocus={() => setActive(i)} tabIndex={0}>
          <img src={photos.sectors[s]} alt="" loading="lazy" />
          <span className="sector-shade" aria-hidden="true" />
          <div className="sector-body">
            <span className="sector-ico"><Icon as={sectorIcons[s]} size={26} /></span>
            <h3>{s}</h3>
            <div className="sector-more"><div><p>{copy[s]}</p><Link to="/contact" className="text-link">Talk to our team <Arrow /></Link></div></div>
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}

function Faq() {
  return <section className="section faq">
    <div className="wrap faq-grid">
      <Lines className="display display-l" lines={['Questions,', 'answered.']} />
      <div className="faq-list" data-stagger>
        {faqs.map(f => <details key={f.question}><summary>{f.question}<span className="plus" aria-hidden="true" /></summary><p>{f.answer}</p></details>)}
      </div>
    </div>
  </section>;
}

/* ---------- Home ---------- */

// Brand film behind the hero. The poster image paints first (it is the LCP image); the film is
// fetched only after the page has loaded, sized for the screen (AV1 where supported), and paused
// whenever the hero is off screen. Reduced motion and Save-Data keep the still poster.
const HERO_FILM = {
  small: [['/option2/media/cine-m.mp4', 'video/mp4']],
  large: [['/option2/media/cine-720.av1.mp4', 'video/mp4; codecs="av01.0.05M.08"'], ['/option2/media/cine-540.mp4', 'video/mp4']],
};

function HeroFilm() {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const v = ref.current;
    const net = navigator.connection;
    if (!v || isStatic() || (net && (net.saveData || /2g/.test(net.effectiveType || '')))) return;
    let idle, io, started = false;
    const sources = matchMedia('(max-width: 767px)').matches ? HERO_FILM.small : HERO_FILM.large;
    const start = () => {
      if (started) return;
      started = true;
      const [src] = sources.find(([, type]) => v.canPlayType(type)) || sources[sources.length - 1];
      v.src = src;
      io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); });
      io.observe(v);
    };
    // Wait a beat after load so the film never competes with the first screen's images.
    const kick = () => { idle = setTimeout(() => ('requestIdleCallback' in window ? requestIdleCallback(start, { timeout: 1500 }) : start()), 1200); };
    const playing = () => setOn(true);
    v.addEventListener('playing', playing);
    if (document.readyState === 'complete') kick(); else addEventListener('load', kick, { once: true });
    return () => {
      removeEventListener('load', kick);
      v.removeEventListener('playing', playing);
      clearTimeout(idle);
      io?.disconnect();
    };
  }, []);
  return <>
    <picture>
      <source media="(max-width: 767px)" srcSet="/option2/media/cine-poster-m.webp" width="540" height="960" />
      <img src="/option2/media/cine-poster.webp" alt="" width="1600" height="900" fetchPriority="high" />
    </picture>
    <video ref={ref} className={on ? 'is-on' : undefined} muted loop playsInline preload="none" aria-hidden="true" />
  </>;
}

function Home() {
  return <>
    <section className="hero" data-hero>
      <div className="hero-media" data-hero-media><HeroFilm /></div>
      <div className="hero-blur" aria-hidden="true" />
      <div className="hero-shade" aria-hidden="true" />
      <div className="wrap hero-inner">
        <Lines as="h1" className="display display-hero" lines={['From container to customer,', 'on docket.']} />
        <p className="hero-text" data-fade="0.4">Warehousing, road freight and approved Amazon FBA deliveries, connected under one team from Sydney and Melbourne.</p>
        <div className="hero-actions" data-fade="0.55"><Button to="/contact">Get a quote</Button><Button to="/tracking" variant="ghost-light">Track a shipment</Button></div>
        <p className="hero-badge" data-fade="0.7"><AmazonLogo /><span>Amazon Partner Carrier<small>Small parcels · NSW, QLD & VIC</small></span></p>
      </div>
    </section>

    <section className="section intro">
      <div className="wrap">
        <Lines className="display display-l statement" lines={['Experience carried', 'forward into a', 'new chapter.']} />
        <div className="intro-copy">
          <p data-fade>Phoenix Global Logistics evolved from Phoenix International Cargo in 2021, building on more than 20 years of cargo and logistics experience.</p>
          <p data-fade="0.1">Today, our Australian family-owned business links international arrivals with warehouse processing, national road freight and final delivery.</p>
          <div data-fade="0.2"><Button to="/about" variant="ghost">About us</Button></div>
        </div>
        <Stats />
      </div>
    </section>

    <Drive text="Our own fleet of 12 vehicles and more than 20 contracted operators keep metro, interstate and linehaul freight moving." cta={<Button to="/services/road-freight-and-transport" variant="ghost">Road freight</Button>} />

    <section className="services-h" data-horizontal>
      <div className="services-h-head wrap">
        <Lines className="display display-l" lines={['Six services,', 'one team accountable', 'for your freight.']} />
        <p data-fade>From international arrivals and inbound preparation to storage, transport and delivery.</p>
      </div>
      <div className="h-track">
        {services.map(s => <Link className="h-card" to={'/services/' + s.slug} key={s.slug} data-cursor="View">
          <figure className="photo"><img src={photos.services[s.slug]} alt={s.imageAlt} loading="lazy" /></figure>
          <h3>{s.title}</h3>
          <p>{s.description}</p>
          <span className="h-more">View service <Arrow /></span>
        </Link>)}
      </div>
    </section>

    <section className="expand" data-expand>
      <div className="expand-media"><img src={photos.aerial} alt={photos.aerialAlt} loading="lazy" /></div>
      <div className="expand-copy">
        <h2 className="display display-xl">Good freight handling starts before dispatch.</h2>
        <Button to="/why-phoenix" variant="ghost-light">See how we work</Button>
      </div>
    </section>

    <section className="section process">
      <div className="wrap">
        <div className="split-head">
          <Lines className="display display-l" lines={['From office intake', 'to signed delivery.']} />
          <p data-fade>Depot scans, the Phoenix Red Table check and automated wrapping help identify preparation issues and protect freight before dispatch.</p>
        </div>
        <StepStack />
      </div>
    </section>

    <Network />
    <Sectors />

    <Faq />
    <Cta />
  </>;
}

/* ---------- Services ---------- */

function ServicePage() {
  const { slug } = useParams();
  const service = services.find(s => s.slug === slug) || services[0];
  const others = services.filter(s => s !== service);
  return <>
    <PageHero lines={service.title.split(/ (?=&)/)} text={service.intro} image={photos.serviceHero[service.slug]} alt={service.imageAlt}>
      <ul className="tags" data-fade="0.6">{service.tags.map(t => <li key={t}>{t}</li>)}</ul>
    </PageHero>

    <section className="section">
      <div className="wrap included">
        <div className="included-head">
          <Icon as={serviceIcons[service.slug]} size={48} />
          <Lines className="display display-l" lines={['Everything your', 'freight needs.']} />
          <p data-fade>{service.audience}</p>
          <div data-fade><Button to="/contact">Request a quote</Button></div>
        </div>
        <ul className="included-list" data-stagger>
          {service.includes.map(item => <li key={item}><CheckCircle size={28} weight="light" aria-hidden="true" />{item}</li>)}
        </ul>
      </div>
      <div className="wrap"><Stats /></div>
    </section>

    <section className="section dark how">
      <div className="wrap">
        <div className="split-head">
          <Lines className="display display-l" lines={['Built around', 'the detail.']} />
          <Photo src={photos.quality} className="how-photo" />
        </div>
        <div className="how-grid" data-stagger>
          {service.details.map(d => <article key={d.title} tabIndex={0}>
            <Icon as={detailIcons[d.title]} size={44} />
            <h3>{d.title}</h3><p>{d.text}</p>
          </article>)}
        </div>
      </div>
    </section>

    {service.slug === 'road-freight-and-transport' && <Drive words={['Owned fleet,', 'contracted reach.']} text="Twelve vehicles of our own, from vans to heavy vehicles, backed by more than 20 contracted operators." />}

    <section className="section">
      <div className="wrap">
        <div className="split-head"><Lines className="display display-l" lines={['Support for the next', 'stage of your shipment.']} /></div>
        <ul className="service-index">
          {others.map(s => <li key={s.slug} data-focus><Link to={'/services/' + s.slug} data-cursor="View">
            <Icon as={serviceIcons[s.slug]} size={30} /><span className="idx-title">{s.title}</span><span className="idx-text">{s.description}</span>
            <img src={photos.services[s.slug]} alt="" loading="lazy" /><Arrow />
          </Link></li>)}
        </ul>
      </div>
    </section>
    <Cta />
  </>;
}

/* ---------- Why Phoenix ---------- */

function Why() {
  const checks = qualitySteps.map((st, i) => [st.title, st.text, stepIcons[i], photos.whySteps[i]]);
  return <>
    <PageHero lines={['Good freight handling', 'starts before dispatch.']} text="Our fleet, operator network and depot processes help keep freight moving from receiving through to delivery." image={photos.why} />

    <section className="section forge-intro">
      <div className="wrap split-head">
        <Lines className="display display-l two-tone tt-1" lines={['Six checks before', 'freight leaves the depot.']} />
        <p data-fade>Every consignment passes the same six steps, from the paperwork in the office to the signature at the door.</p>
      </div>
    </section>
    <Forge items={checks} cta={<Button to="/contact" variant="ghost-light">Request a quote</Button>} />

    <Outcome muted={1} lines={['Our fleet, our people.', 'Our responsibility.']} thumb={photos.fleet}
      intro="An owned fleet for metro and interstate freight, a contracted operator network for extra capacity, and depot teams who handle every pallet in between."
      items={[[12, '', 'Owned vehicles, from vans to heavy rigid trucks'], [20, '+', 'Contracted operators for extra capacity'], [600, '+', 'Containers handled every year'], [660, 'k+', 'Boxes processed every year']]} />

    <section className="section tint cells-section">
      <div className="wrap">
        <div className="split-head"><Lines className="display display-l two-tone tt-1" lines={['Need an answer?', 'Talk to operations.']} /><p data-fade>Already a client? <a className="text-link" href={company.clientLogin} rel="noopener">Access Transvirtual <Arrow /></a></p></div>
        <div className="cells" data-stagger>
          <a className="cell" href={'mailto:' + transportEmail}><span className="cell-label">Email</span><EnvelopeSimple size={32} weight="light" className="ico" aria-hidden="true" /><h3>Email operations</h3><p>{transportEmail}</p><Arrow /></a>
          <a className="cell" href={'mailto:' + transportEmail + '?subject=Callback%20request'}><span className="cell-label">Callback</span><Icon as={detailIcons['Confirm before collection']} size={32} /><h3>Request a callback</h3><p>Send your phone number and shipment reference.</p><Arrow /></a>
          <Link className="cell" to="/tracking"><span className="cell-label">Tracking</span><Crosshair size={32} weight="light" className="ico" aria-hidden="true" /><h3>Track a shipment</h3><p>Use your Transvirtual consignment number.</p><Arrow /></Link>
          <div className="cell"><span className="cell-label">WeChat</span><img src="/assets/wechat-qr.png" alt="WeChat QR code" width="88" height="88" loading="lazy" /><h3>Scan to connect</h3><p>Local and cross-border enquiries.</p></div>
        </div>
      </div>
    </section>
    <Cta />
  </>;
}

/* ---------- About ---------- */

function About() {
  const chapters = [
    ['Where it started', 'Phoenix International Cargo', 'More than 20 years of cargo and logistics experience behind the business.', Boat],
    ['2021', 'Phoenix Global Logistics', 'Phoenix International Cargo evolves into a broader logistics operation.', Plant],
    ['Two bases', 'Sydney & Melbourne', 'Teams and warehousing at Wetherill Park, NSW and in Victoria.', Warehouse],
    ['Trade bridge', 'China to Australia', 'Established supply-chain partners for consolidation, air and sea freight.', Globe],
    ['Approved', 'Amazon Partner Carrier', 'Small parcel deliveries across NSW, QLD and VIC.', Package],
    ['Today', 'Container to customer', 'International arrivals, warehousing, road freight and delivery under one team.', Truck],
  ];
  const teams = [
    ['Warehouse', 'Receiving, inspecting, preparing and storing freight in Sydney and Melbourne.', Warehouse, photos.teams[0]],
    ['Operations', 'Coordinating shipment information, bookings and depot movements.', ClipboardText, photos.teams[1]],
    ['Logistics', 'Connecting collections, transport and delivery with our fleet and operators.', Truck, photos.teams[2]],
    ['Family-owned', 'An Australian family business that stays close to every shipment.', Users, photos.teams[3]],
  ];
  const values = [['Our mission', 'Connect international arrivals, warehousing and Australian transport through coordination and careful freight handling.'], ['How we grow', 'Build long-term relationships, strengthen our Australian operation and keep communication at the center of our service.'], ['Our foundations', 'Teams in Sydney and Melbourne, an owned fleet, contracted operators and established China–Australia trade connections.']];
  return <>
    <PageHero lines={['A family business.', 'An established operation.']} text="Australian-owned logistics with more than 20 years of cargo experience and a hands-on approach to every shipment." image={photos.about} />

    <Outcome muted={1} lines={['Twenty years of cargo.', 'One family team', 'accountable for it.']} thumb={photos.team}
      intro="Phoenix Global Logistics evolved from Phoenix International Cargo in 2021. Today our Australian family-owned business links international arrivals with warehouse processing, national road freight and final delivery."
      cta={<Button to="/contact" variant="ghost">Talk to our team</Button>}
      items={[[20, '+', 'Years of cargo experience'], [2021, '', 'Phoenix Global Logistics is formed'], [2, '', 'Australian bases, Sydney and Melbourne'], [12, '', 'Owned vehicles on the road']]} />

    <StoryRoad muted={1} lines={['From cargo agent', 'to logistics partner.']} text="How Phoenix grew from international cargo into a connected Australian logistics operation." chapters={chapters} />

    <section className="section forge-intro">
      <div className="wrap split-head">
        <Lines className="display display-l two-tone tt-1" lines={['Hands-on teams', 'behind every shipment.']} />
        <p data-fade>Four teams, one family business, and the same people answering for your freight from arrival to delivery.</p>
      </div>
    </section>
    <Forge items={teams} cta={<Button to="/contact" variant="ghost-light">Talk to our team</Button>} />

    <section className="section values">
      <div className="wrap">
        <div className="split-head"><Lines className="display display-l two-tone tt-1" lines={['Carrier capability,', 'family care.']} /><p data-fade>What guides the way we work with customers, partners and each other.</p></div>
        <ol className="values-list">
          {values.map(([t, d], i) => <li key={t} data-focus><span className="values-n">{String(i + 1).padStart(2, '0')}</span><h3>{t}</h3><p>{d}</p><Icon as={valueIcons[i]} size={40} /></li>)}
        </ol>
      </div>
    </section>
    <Cta />
  </>;
}

/* ---------- Contact ---------- */

function Contact() {
  const [review, setReview] = useState(null);
  const submit = e => {
    e.preventDefault();
    const v = new FormData(e.currentTarget);
    const target = ['international-freight', 'customs-clearance'].includes(v.get('service')) ? importEmail : transportEmail;
    const body = [['Name', 'name'], ['Business', 'company'], ['Email', 'email'], ['Phone', 'phone'], ['Service', 'service'], ['Origin', 'from'], ['Destination', 'to'], ['Pallet / box count', 'quantity'], ['Frequency', 'frequency'], ['Preferred timing', 'date'], ['Details', 'details']].map(([l, k]) => `${l}: ${v.get(k) || '-'}`).join('\n');
    setReview({ target, body });
  };
  return <>
    <PageHero lines={['Request a', 'freight quote.']} text="One-off shipment or regular contract. Connect with the right operational team and start your quote." image={photos.contact} />
    <section className="section">
      <div className="wrap contact-grid">
        <aside className="contact-info">
          <Lines className="display display-m" lines={['Direct to', 'our team.']} />
          <dl data-stagger>
            <div><dt>Transport enquiries</dt><dd>FBA, warehousing, road freight and dangerous goods.<br /><a href={'mailto:' + transportEmail}>{transportEmail}</a></dd></div>
            <div><dt>Import enquiries</dt><dd>International freight and customs documentation.<br /><a href={'mailto:' + importEmail}>{importEmail}</a></dd></div>
            <div><dt>Operational hours</dt><dd>Office {company.officeHours}<br />Warehouse {company.warehouseHours}<br />ABN {company.abn}</dd></div>
            <div><dt>Our depots</dt><dd>Sydney: {company.sydneyAddress}<br />Melbourne: Victoria</dd></div>
            <div className="contact-wechat"><dt>Connect on WeChat</dt><dd>Scan for cross-border and international shipping enquiries.<img src="/assets/wechat-qr.png" alt="WeChat QR code" width="96" height="96" loading="lazy" /></dd></div>
          </dl>
        </aside>
        <form className="quote" id="quote-form" onSubmit={submit} data-fade>
          <h2 className="display display-m">Request a quote</h2>
          <p className="quote-intro">Share the details below, then send your request using your email app.</p>
          <div className="fields">
            <Field label="Your name" name="name" />
            <Field label="Business" name="company" />
            <Field label="Email" name="email" type="email" />
            <Field label="Phone number" name="phone" type="tel" />
            <label className="field field-wide"><span>Service*</span><select name="service" required defaultValue=""><option value="" disabled>Choose a service</option>{services.map(s => <option key={s.slug} value={s.slug}>{s.title}</option>)}</select></label>
            <Field label="Origin" name="from" />
            <Field label="Destination" name="to" />
            <Field label="Pallet / box count" name="quantity" />
            <Field label="Preferred timing" name="date" placeholder="Date or collection schedule" />
            <fieldset className="field field-wide radios"><legend>Frequency*</legend><label><input type="radio" name="frequency" value="One-off" required />One-off</label><label><input type="radio" name="frequency" value="Regular contract" />Regular contract</label></fieldset>
            <label className="field field-wide"><span>Dimensions, weight and shipment details*</span><textarea name="details" rows="4" required placeholder="Include dimensions, total weight and any handling requirements." /></label>
          </div>
          <button className="btn btn-primary" type="submit"><BtnText>Prepare quote request</BtnText><Arrow /></button>
          <p className="fine">We use your details to respond to your enquiry. <a href="/privacy">Privacy Policy</a>.</p>
          {review && <div className="review" role="status"><p>Your request is ready for <strong>{review.target}</strong>.</p><pre>{review.body}</pre><a className="btn btn-primary" href={'mailto:' + review.target + '?subject=Phoenix%20freight%20quote&body=' + encodeURIComponent(review.body)}><BtnText>Open email draft</BtnText><Arrow /></a></div>}
        </form>
      </div>
    </section>
  </>;
}

function Field({ label, name, type = 'text', placeholder }) {
  return <label className="field"><span>{label}*</span><input name={name} type={type} required placeholder={placeholder} /></label>;
}

/* ---------- Tracking ---------- */

function Tracking() {
  return <>
    <PageHero lines={['Track your', 'shipment.']} text="Use your Transvirtual consignment number or the tracking link issued with your booking confirmation." image={photos.tracking} tall>
      <div className="hero-track" data-fade="0.6"><TrackForm /></div>
    </PageHero>
    <section className="section road" data-road>
      <div className="wrap split-head">
        <Lines className="display display-l" lines={['From depot', 'to delivery.']} />
        <p data-fade>Each milestone is a scan that updates the record linked to your consignment number.</p>
      </div>
      <div className="wrap road-body">
        <div className="road-lane" aria-hidden="true">
          <span className="road-asphalt" />
          <span className="road-done" />
          <img className="road-truck" src="/option2/media/truck-top@360.webp" srcSet="/option2/media/truck-top@360.webp 360w, /option2/media/truck-top.webp 427w" sizes="120px" alt="" />
        </div>
        <ol className="road-stops">
          {STAGES.map(([t, d, status, when], i) => <li className="road-stop" key={t} data-stop>
            <span className="road-pin" aria-hidden="true"><Icon as={stageIcons[i]} size={22} /></span>
            <div className="road-card">
              <p className="road-meta"><span>{String(i + 1).padStart(2, '0')}</span><span className="road-status">{status}</span></p>
              <h3>{t}</h3>
              <p>{d}</p>
              <p className="road-when"><CheckCircle size={18} weight="fill" aria-hidden="true" />{when}</p>
            </div>
          </li>)}
        </ol>
      </div>
    </section>
    <Cta heading={['Need help with', 'a consignment?']} text="For urgent enquiries, include your consignment number and shipment details." />
  </>;
}

/* ---------- Shell ---------- */

function Page({ children }) {
  const { pathname } = useLocation();
  usePageMotion(pathname);
  // Keyed by path so a route change swaps the whole <main>; GSAP pin wrappers inside
  // the old page then never confuse React when it removes the old sections.
  return <main id="main" key={pathname}>{children}</main>;
}

const PAGE_NAMES = { '/': 'Home', '/why-phoenix': 'Why Phoenix', '/about': 'About', '/contact': 'Contact', '/tracking': 'Tracking' };
function pageName(to) {
  if (to.startsWith('/services/')) return services.find(s => '/services/' + s.slug === to)?.shortTitle || 'Services';
  return PAGE_NAMES[to] || 'Phoenix';
}

// Internal links play the curtain before the route changes.
function Transitions() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useCursor();
  useEffect(() => {
    const click = e => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.('a[href]');
      if (!a || a.target || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !url.pathname.startsWith(BASE)) return;
      const to = url.pathname.slice(BASE.length) || '/';
      e.preventDefault();
      e.stopPropagation();
      if (to === pathname) {
        if (url.hash) scrollToEl(document.querySelector(url.hash));
        else scrollToEl(document.body, 0);
        return;
      }
      coverThen(() => navigate(to + url.search + url.hash), pageName(to));
    };
    document.addEventListener('click', click, true);
    return () => document.removeEventListener('click', click, true);
  }, [navigate, pathname]);
  return <>
    <div className="curtain" aria-hidden="true">
      <div className="curtain-panel" />
      <div className="curtain-inner"><img className="curtain-mark" src="/assets/phoenix-logo-light.png" alt="" width="64" height="55" /><p className="curtain-label" /></div>
      <span className="curtain-bar" />
    </div>
    <div className="cursor" aria-hidden="true" />
  </>;
}

// `url` is only passed while prerendering: each route is rendered to HTML at build time so the
// first paint never waits for the scripts.
export function App({ url }) {
  const Router = url ? StaticRouter : BrowserRouter;
  return <Router basename={BASE} {...(url ? { location: url } : {})}>
    <a className="skip" href="#main">Skip to content</a>
    <Transitions />
    <Header />
    <Routes>
      <Route path="/" element={<Page><Home /></Page>} />
      <Route path="/services" element={<Page><ServicePage /></Page>} />
      <Route path="/services/:slug" element={<Page><ServicePage /></Page>} />
      <Route path="/why-phoenix" element={<Page><Why /></Page>} />
      <Route path="/about" element={<Page><About /></Page>} />
      <Route path="/contact" element={<Page><Contact /></Page>} />
      <Route path="/tracking" element={<Page><Tracking /></Page>} />
      <Route path="*" element={<Page><Home /></Page>} />
    </Routes>
    <Footer />
  </Router>;
}

// The prerendered markup gives the first paint; the client then renders over it (same markup,
// so nothing visibly changes) instead of hydrating, which keeps GSAP's DOM changes out of React's way.
if (typeof document !== 'undefined') {
  const root = document.getElementById('root');
  if (root) createRoot(root).render(<App />);
}
