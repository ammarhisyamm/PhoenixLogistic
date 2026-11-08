import { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowUpRight, CaretDown, CheckCircle, Crosshair, EnvelopeSimple, SealCheck } from '@phosphor-icons/react';
import '@fontsource-variable/inter';
import '@fontsource/sawarabi-mincho/latin-400.css';
import { company, faqs, importEmail, qualitySteps, sectors, services, trackingDestination, transportEmail } from '../../src/data';
import { photos } from './photos';
import { detailIcons, sectorIcons, serviceIcons, stageIcons, stepIcons, valueIcons } from './icons';
import { coverThen, isStatic, scrollToEl, useCursor, useHeader, usePageMotion } from './motion';
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

function Icon({ as: Cmp, size = 32, className = 'ico' }) {
  return Cmp ? <Cmp className={className} size={size} weight="light" aria-hidden="true" /> : null;
}

function Photo({ src, alt = '', className = '', reveal = true, parallax = 8, eager }) {
  return <figure className={'photo ' + className} data-reveal={reveal ? '' : undefined}>
    <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" data-parallax={parallax || undefined} />
  </figure>;
}

function PageHero({ lines, text, image, alt, children, tall }) {
  return <section className={'page-hero' + (tall ? ' page-hero-tall' : '')} data-hero>
    <div className="page-hero-media"><img src={image} alt={alt || ''} data-hero-media /></div>
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
      <input id={compact ? 'track-c' : 'track'} name="consignment" placeholder="E.g. PGL000123456" autoComplete="off" onChange={() => setNote('')} />
      <button type="submit">Track<Arrow /></button>
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
            <Icon as={serviceIcons[s.slug]} size={26} />
            <span><strong>{s.title}</strong><small>{s.description}</small></span>
            <ArrowUpRight className="mega-go" size={18} aria-hidden="true" />
          </Link>
        </li>)}
      </ul>
      <Link to={'/services/' + current.slug} className="mega-media" onClick={onClose} tabIndex={-1}>
        {services.map(s => <img key={s.slug} src={photos.services[s.slug]} alt="" className={s.slug === active ? 'is-on' : ''} loading="lazy" />)}
        <span className="mega-caption"><span>{current.shortTitle}</span><small>{current.tags.join(' · ')}</small></span>
      </Link>
    </div>
    <div className="mega-foot">
      <span><SealCheck size={18} weight="light" aria-hidden="true" />Amazon Partner Carrier · NSW, QLD & VIC</span>
      <Link to="/tracking" onClick={onClose}><Crosshair size={18} weight="light" aria-hidden="true" />Track a shipment</Link>
      <a href={'mailto:' + transportEmail}><EnvelopeSimple size={18} weight="light" aria-hidden="true" />{transportEmail}</a>
    </div>
  </div>;
}

function Header() {
  const [state, setRaw] = useState({ solid: false, hidden: false });
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const timer = useRef(0);
  const { pathname } = useLocation();
  const set = useCallback(next => setRaw(prev => ({ solid: next.solid, hidden: next.hidden === undefined ? prev.hidden : next.hidden })), []);
  useHeader(set);
  useEffect(() => { setOpen(false); setMega(false); }, [pathname]);
  useEffect(() => {
    const esc = e => { if (e.key === 'Escape') { setMega(false); setOpen(false); } };
    addEventListener('keydown', esc);
    return () => removeEventListener('keydown', esc);
  }, []);
  const hover = on => { clearTimeout(timer.current); timer.current = setTimeout(() => setMega(on), on ? 60 : 180); };
  const solid = state.solid || open || mega;
  return <>
    <div className={'mega-backdrop' + (mega ? ' is-on' : '')} onClick={() => setMega(false)} aria-hidden="true" />
    <header className={'header' + (solid ? ' is-solid' : '') + (state.hidden && !open && !mega ? ' is-hidden' : '') + (mega ? ' has-mega' : '')}>
      <div className="header-bar" onPointerLeave={() => hover(false)}>
        <div className="header-inner">
          <Link to="/" className="brand" aria-label="Phoenix Global Logistics home">
            <img className="logo-dark" src="/assets/phoenix-logo.png" alt="" width="56" height="48" /><img className="logo-light" src="/assets/phoenix-logo-light.png" alt="" width="56" height="48" />
            <span>Phoenix<br />Global Logistics</span>
          </Link>
          <nav className="nav" aria-label="Main">
            <button type="button" className={'nav-services' + (pathname.startsWith('/services') ? ' is-current' : '')} aria-expanded={mega} aria-controls="mega" onClick={() => setMega(m => !m)} onPointerEnter={() => hover(true)}>
              Services<CaretDown size={14} weight="bold" aria-hidden="true" />
            </button>
            {nav.map(([label, to]) => <NavLink key={to} to={to} onPointerEnter={() => hover(false)} className={({ isActive }) => isActive ? 'is-current' : undefined}>{label}</NavLink>)}
          </nav>
          <div className="header-actions">
            <Link className="header-link" to="/tracking">Track</Link>
            <Link className="btn btn-primary btn-small" to="/contact"><BtnText>Get a quote</BtnText></Link>
            <button className="menu-toggle" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(o => !o)}><span /><span /><span className="sr-only">Menu</span></button>
          </div>
        </div>
        <MegaMenu open={mega} onClose={() => setMega(false)} />
      </div>
      <div id="menu" className={'menu' + (open ? ' is-open' : '')} hidden={!open}>
        <Link to="/" style={{ '--i': 0 }}>Home</Link>
        <details style={{ '--i': 1 }}>
          <summary>Services<CaretDown size={18} aria-hidden="true" /></summary>
          <div className="menu-services">{services.map(s => <Link key={s.slug} to={'/services/' + s.slug}><Icon as={serviceIcons[s.slug]} size={22} />{s.title}</Link>)}</div>
        </details>
        {[...nav, ['Track a shipment', '/tracking']].map(([label, to], i) => <Link key={to} to={to} style={{ '--i': i + 2 }}>{label}</Link>)}
      </div>
    </header>
  </>;
}

function Footer() {
  return <footer className="footer">
    <div className="wrap">
      <div className="footer-top">
        <div>
          <Lines className="display footer-heading" lines={['From container', 'to customer.']} />
          <p className="footer-summary">Australian family-owned logistics, with more than 20 years of cargo experience. ABN {company.abn}</p>
        </div>
        <TrackForm compact />
      </div>
      <div className="footer-cols">
        <div><h3>Services</h3>{services.map(s => <Link key={s.slug} to={'/services/' + s.slug}>{s.title}</Link>)}</div>
        <div><h3>Operations & tracking</h3>
          <Link to="/why-phoenix">Why Phoenix</Link><Link to="/tracking">Track shipment</Link>
          <a href={company.clientLogin} rel="noopener">Transvirtual client login</a><Link to="/about">About us</Link><Link to="/contact">Sydney & Melbourne depots</Link>
        </div>
        <div><h3>Contact</h3>
          <a href={'mailto:' + transportEmail}>{transportEmail}</a><a href={'mailto:' + importEmail}>{importEmail}</a>
          <p>Office {company.officeHours}<br />Warehouse {company.warehouseHours}</p>
        </div>
        <div className="footer-wechat"><img src="/assets/wechat-qr.png" alt="WeChat QR code for Phoenix Global Logistics" loading="lazy" width="96" height="96" /><p>WeChat<br />Scan to connect</p></div>
      </div>
      <div className="footer-legal"><p>© 2026 Phoenix Global Logistics</p><a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Carriage & Conditions</a></div>
    </div>
    <div className="wordmark-wrap" aria-hidden="true"><p className="wordmark" data-wordmark>PHOENIX</p></div>
  </footer>;
}

/* ---------- Shared scenes ---------- */

// The Phoenix truck drives across the screen as you scroll; the headline is written in its wake.
function Drive({ words = ['On the road across', 'NSW, QLD & VIC.'], text, cta }) {
  return <section className="drive" data-drive>
    <div className="drive-stage">
      <div className="wrap drive-copy">
        <div className="drive-head">
          <h2 className="display display-xl drive-ghost" aria-hidden="true">{words.map((w, i) => <span key={i}>{w}</span>)}</h2>
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

function Network() {
  const depots = [
    { city: 'Sydney', place: 'Wetherill Park, NSW', text: 'Head depot. Warehousing, 3PL and Amazon FBA prep, open 06:00–17:30.', x: 466, y: 264, photo: photos.depots.Sydney },
    { city: 'Melbourne', place: 'Victoria', text: 'Warehousing and distribution for Victorian customers, linked by overnight linehaul.', x: 401, y: 305, photo: photos.depots.Melbourne },
    { city: 'China', place: 'Supply-chain partners', text: 'Consolidation plus air and sea freight into Sydney, cleared and moved on by our team.', x: 236, y: -34, photo: photos.depots.China },
  ];
  const [active, setActive] = useState('Sydney');
  return <section className="section network">
    <div className="wrap">
      <div className="split-head">
        <Lines className="display display-l" lines={['Two depots, national', 'linehaul and a trade', 'bridge to China.']} />
        <div data-fade><p>Hover a depot to see where it sits and what it handles. Coverage runs across NSW, QLD and VIC.</p><Button to="/contact" variant="ghost">Contact our depots</Button></div>
      </div>
      <div className={'net-grid is-' + active.toLowerCase()}>
        <div className="net-map">
          <img src="/assets/australia-relief-cutout.svg" alt="Map of Australia showing Phoenix depots in Sydney and Melbourne" width="650" height="400" loading="lazy" />
          <svg viewBox="0 0 650 400" data-routes aria-hidden="true">
            <path className="route-path r-mel" pathLength="1" d="M466 264 Q452 296 401 305" />
            <path className="route-path r-bne" pathLength="1" d="M466 264 Q492 232 485 197" />
            <path className="route-path r-chn" pathLength="1" d="M236 -34 C 520 -40, 610 140, 466 264" />
            <path className="route-flow r-mel" d="M466 264 Q452 296 401 305" />
            <path className="route-flow r-bne" d="M466 264 Q492 232 485 197" />
            <path className="route-flow r-chn" d="M236 -34 C 520 -40, 610 140, 466 264" />
            <g className="pin pin-minor"><circle cx="485" cy="197" r="3" /><text x="497" y="201">Brisbane linehaul</text></g>
            {depots.map(d => <g key={d.city} className={'pin' + (active === d.city ? ' is-active' : '')} onPointerEnter={() => setActive(d.city)}>
              <circle className="pin-pulse" cx={d.x} cy={d.y} r="14" />
              <circle className="pin-dot" cx={d.x} cy={d.y} r="5" />
              <text x={d.x + (d.city === 'Melbourne' ? -84 : 14)} y={d.y + (d.city === 'Melbourne' ? 26 : 5)}>{d.city === 'China' ? 'China · air & sea' : d.city}</text>
            </g>)}
          </svg>
          <ul className="net-chips"><li><b data-count="2">2</b> depots</li><li><b data-count="3">3</b> states covered</li><li><span><b data-count="20">20</b>+</span> contracted operators</li></ul>
        </div>
        <ul className="net-list">
          {depots.map(d => <li key={d.city} className={active === d.city ? 'is-active' : undefined} onPointerEnter={() => setActive(d.city)} onFocus={() => setActive(d.city)} tabIndex={0} data-cursor="Depot">
            <div className="net-head"><h3>{d.city}</h3><p className="net-place">{d.place}</p></div>
            <div className="net-more"><div><p>{d.text}</p><figure><img src={d.photo} alt="" loading="lazy" /></figure></div></div>
          </li>)}
        </ul>
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
  const [active, setActive] = useState(0);
  return <section className="section sectors">
    <div className="wrap">
      <div className="split-head">
        <Lines className="display display-l" lines={['Freight behind', 'Australian business.']} />
        <p data-fade>Operational experience across retail, e-commerce, renewable technology, FMCG and international imports.</p>
      </div>
      <div className="sector-row" data-stagger>
        {sectors.map((s, i) => <article className={'sector' + (active === i ? ' is-active' : '')} key={s} onPointerEnter={() => setActive(i)} onFocus={() => setActive(i)} tabIndex={0} data-cursor="Explore">
          <img src={photos.sectors[s]} alt="" loading="lazy" />
          <div className="sector-body">
            <Icon as={sectorIcons[s]} size={34} />
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

function Home() {
  const video = useRef(null);
  useEffect(() => { if (isStatic()) video.current?.pause(); }, []);
  return <>
    <section className="hero" data-hero>
      <div className="hero-media" data-hero-media>
        <video ref={video} src="/option2/media/hero.mp4" poster="/option2/media/hero-poster.webp" autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="wrap hero-inner">
        <Lines as="h1" className="display display-hero" lines={['From container', 'to customer,', 'on docket.']} />
        <p className="hero-text" data-fade="0.4">Warehousing, road freight and approved Amazon FBA deliveries, connected under one team from Sydney and Melbourne.</p>
        <div className="hero-actions" data-fade="0.55"><Button to="/contact">Get a quote</Button><Button to="/tracking" variant="ghost-light">Track a shipment</Button></div>
      </div>
      <p className="hero-badge" data-fade="0.7"><SealCheck size={20} weight="light" aria-hidden="true" /><span>Amazon Partner Carrier<small>Small parcels · NSW, QLD & VIC</small></span></p>
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
          <div className="h-meta"><Icon as={serviceIcons[s.slug]} size={30} /><span className="h-tags">{s.tags.join(' · ')}</span></div>
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

    <section className="section-flush tracker-band">
      <div className="wrap tracker-grid">
        <Lines className="display display-m" lines={['Where is my', 'freight right now?']} />
        <div data-fade><TrackForm /><a className="text-link" href={company.clientLogin} rel="noopener">Client login <Arrow /></a></div>
      </div>
    </section>

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
  const blocks = useRef([]);
  return <>
    <PageHero lines={['Good freight', 'handling starts', 'before dispatch.']} text="Our fleet, operator network and depot processes help keep freight moving from receiving through to delivery." image={photos.why} />

    <section className="section">
      <div className="wrap split-head">
        <Lines className="display display-l" lines={['From office intake', 'to signed delivery.']} />
        <p data-fade>Depot scans, the Phoenix Red Table check and automated wrapping help identify preparation issues and protect freight before dispatch.</p>
      </div>
      <div className="wrap focus" data-focus-list>
        <aside className="focus-aside">
          <ol className="focus-index">
            <span className="focus-bar" aria-hidden="true" />
            {qualitySteps.map((s, i) => <li key={s.title} className={i === 0 ? 'is-active' : undefined}><button type="button" onClick={() => scrollToEl(blocks.current[i], -160)}><Icon as={stepIcons[i]} size={22} />{s.title}</button></li>)}
          </ol>
        </aside>
        <div className="focus-blocks">
          {qualitySteps.map((s, i) => <article className="focus-block" key={s.title} data-block ref={el => { blocks.current[i] = el; }}>
            <figure className="focus-photo focus-fade"><img src={photos.steps[i]} alt="" loading="lazy" /></figure>
            <div className="focus-text">
              <Icon as={stepIcons[i]} size={48} className="ico focus-fade" />
              <h3 className="focus-fade">{s.title}</h3>
              <p className="focus-fade">{s.text}</p>
            </div>
          </article>)}
        </div>
      </div>
    </section>

    <Drive words={['Our trucks,', 'our drivers.']} text="An owned fleet for metro and interstate freight, with a contracted operator network for extra capacity." />

    <section className="section dark">
      <div className="wrap"><Stats dark /></div>
    </section>

    <section className="section">
      <div className="wrap tracker-grid">
        <div><Lines className="display display-l" lines={['Tracking and', 'direct support.']} />
          <p data-fade>Scans recorded as freight moves feed the shipment updates available in Transvirtual. Check your consignment online, or speak with our operations team for help with the details.</p></div>
        <div data-fade><TrackForm /><a className="text-link" href={company.clientLogin} rel="noopener">Already a client? Access Transvirtual <Arrow /></a></div>
      </div>
    </section>

    <section className="section tint">
      <div className="wrap">
        <div className="split-head"><Lines className="display display-l" lines={['Contact operations', 'directly.']} /></div>
        <div className="contact-cards" data-stagger>
          <a className="contact-card" href={'mailto:' + transportEmail}><EnvelopeSimple size={36} weight="light" className="ico" aria-hidden="true" /><h3>Email operations</h3><p>{transportEmail}</p><Arrow /></a>
          <a className="contact-card" href={'mailto:' + transportEmail + '?subject=Callback%20request'}><Icon as={detailIcons['Confirm before collection']} size={36} /><h3>Request a callback</h3><p>Send your phone number and shipment reference.</p><Arrow /></a>
          <div className="contact-card"><h3>Scan to connect</h3><p>Local and cross-border enquiries on WeChat.</p><img src="/assets/wechat-qr.png" alt="WeChat QR code" width="88" height="88" loading="lazy" /></div>
        </div>
      </div>
    </section>
    <Cta />
  </>;
}

/* ---------- About ---------- */

function About() {
  const teams = [['Warehouse', 'Receiving, inspecting, preparing and storing freight.', photos.warehouse], ['Operations', 'Coordinating shipment information, bookings and depot movements.', photos.ops], ['Logistics', 'Connecting collections, transport and delivery with our fleet and operator network.', photos.fleet]];
  const values = [['Our mission', 'Connect international arrivals, warehousing and Australian transport through coordination and careful freight handling.'], ['How we grow', 'Build long-term relationships, strengthen our Australian operation and keep communication at the center of our service.'], ['Our foundations', 'Teams in Sydney and Melbourne, an owned fleet, contracted operators and established China–Australia trade connections.']];
  return <>
    <PageHero lines={['A family business.', 'An established', 'operation.']} text="Australian-owned logistics with more than 20 years of cargo experience and a hands-on approach to every shipment." image={photos.about} />

    <section className="section">
      <div className="wrap story">
        <Photo src={photos.team} alt={photos.teamAlt} className="story-photo" />
        <div>
          <Lines className="display display-l" lines={['Experience carried', 'forward into a', 'new chapter.']} />
          <p data-fade>Phoenix Global Logistics evolved from Phoenix International Cargo in 2021, building on more than 20 years of cargo and logistics experience.</p>
          <p data-fade="0.1">Today, our Australian family-owned business links international arrivals with warehouse processing, national road freight and final delivery.</p>
        </div>
      </div>
      <div className="wrap"><Stats /></div>
    </section>

    <section className="section tint">
      <div className="wrap">
        <div className="split-head"><Lines className="display display-l" lines={['Family-owned.', 'Supported by', 'hands-on teams.']} /></div>
        <div className="team-grid" data-stagger>
          {teams.map(([title, text, src]) => <article key={title}><figure className="photo"><img src={src} alt="" loading="lazy" /></figure><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </div>
    </section>

    <section className="section dark">
      <div className="wrap">
        <div className="split-head"><Lines className="display display-l" lines={['Carrier capability with', 'the care of a family', 'business.']} /></div>
        <div className="how-grid" data-stagger>{values.map(([t, d], i) => <article key={t} tabIndex={0}><Icon as={valueIcons[i]} size={44} /><h3>{t}</h3><p>{d}</p></article>)}</div>
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
  const stages = [
    ['Depot-in', 'Freight received and scanned into the depot.', 'In depot', 'Mon 07:42 · Wetherill Park'],
    ['Sorting', 'Goods checked, sorted and allocated for their next move.', 'Sorting', 'Mon 09:15 · Red Table'],
    ['Out for delivery', 'Scanned out at the depot and loaded with a driver for delivery.', 'On the road', 'Tue 06:30 · Linehaul'],
    ['Signed POD', 'Delivery signature recorded as proof of delivery.', 'Delivered', 'Tue 14:08 · Signed'],
  ];
  return <>
    <PageHero lines={['Track your', 'shipment.']} text="Use your Transvirtual consignment number or the tracking link issued with your booking confirmation." image={photos.tracking} tall>
      <div className="hero-track" data-fade="0.6"><TrackForm /></div>
    </PageHero>
    <section className="tracker" data-tracker>
      <div className="wrap tk-grid">
        <div className="tk-side">
          <Lines className="display display-l" lines={['From depot', 'to delivery.']} />
          <div className="tk-copy">{stages.map(([t, d], i) => <div key={t}><Icon as={stageIcons[i]} size={40} /><h3>{t}</h3><p>{d}</p></div>)}</div>
          <p className="tk-hint">Each scan along the way updates the record linked to your consignment. Example shown.</p>
        </div>
        <div className="tk-card">
          <div className="tk-top">
            <div><small>Consignment</small><strong>PGL000123456</strong></div>
            <p className="tk-status">{stages.map(([, , s]) => <span key={s}>{s}</span>)}</p>
          </div>
          <div className="tk-lane"><span>Sydney</span><div className="tk-lane-line"><i className="tk-van"><Icon as={stageIcons[2]} size={22} /></i></div><span>Melbourne</span></div>
          <ol className="tk-rows">
            <span className="tk-rail" aria-hidden="true"><span className="tk-fill" /></span>
            {stages.map(([t, , , when], i) => <li className="tk-row" key={t}>
              <span className="tk-node"><Icon as={stageIcons[i]} size={24} /></span>
              <div><h4>{t}</h4><p>{when}</p></div>
              <CheckCircle className="tk-check" size={24} weight="fill" aria-hidden="true" />
            </li>)}
          </ol>
        </div>
      </div>
    </section>
    <Cta heading={['Need help with', 'a consignment?']} text="For urgent enquiries, include your consignment number and shipment details." />
  </>;
}

/* ---------- Shell ---------- */

function Page({ children }) {
  const { pathname } = useLocation();
  usePageMotion(pathname);
  return <main id="main">{children}</main>;
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
      if (to === pathname && !url.hash) return;
      coverThen(() => navigate(to + url.search + url.hash));
    };
    document.addEventListener('click', click, true);
    return () => document.removeEventListener('click', click, true);
  }, [navigate, pathname]);
  return <>
    <div className="curtain" aria-hidden="true"><img className="curtain-mark" src="/assets/phoenix-logo-light.png" alt="" width="84" height="72" /></div>
    <div className="cursor" aria-hidden="true" />
  </>;
}

function App() {
  return <BrowserRouter basename={BASE}>
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
  </BrowserRouter>;
}

createRoot(document.getElementById('root')).render(<App />);
