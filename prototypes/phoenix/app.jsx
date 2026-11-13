import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, StaticRouter, Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  AmazonLogo, ArrowLeft, ArrowRight, ArrowUpRight, BatteryCharging, BookBookmark, CaretDown, ChatCircleText, Check, Clock,
  Crosshair, EnvelopeSimple, FileText, Globe, Handshake, MapPin, Package, Phone, Plant, ShoppingCart, SolarPanel, Storefront,
  Basket, Boat, GlobeHemisphereEast, Truck, Warehouse, X,
} from '@phosphor-icons/react';
import { company, importEmail, services, trackingDestination, transportEmail } from '../../src/data';
import { coverThen, scrollToEl, useCursor, useHeaderScroll, usePageMotion } from './motion';
import { footerLogo, logo, logoLight, photos, servicePhotos, wechatQr, wechatQrFooter } from './photos';
import { phoenixRoutes } from './routes.mjs';

/* ---------- Content ---------- */

const serviceOrder = ['amazon-fba-logistics', 'road-freight-and-transport', 'warehousing-and-3pl', 'international-freight', 'customs-clearance', 'dangerous-goods'];
const orderedServices = serviceOrder.map(slug => services.find(s => s.slug === slug));
const serviceIcons = {
  'amazon-fba-logistics': Package, 'warehousing-and-3pl': Warehouse, 'road-freight-and-transport': Truck,
  'international-freight': Globe, 'customs-clearance': FileText, 'dangerous-goods': BatteryCharging,
};
const footerServiceNames = {
  'amazon-fba-logistics': 'Amazon FBA Inbound & Prep', 'warehousing-and-3pl': 'Warehousing & 3PL Distribution',
  'road-freight-and-transport': 'Road Freight & Interstate Transport', 'international-freight': 'International Air & Sea Freight',
  'customs-clearance': 'Customs Clearance & Documentation', 'dangerous-goods': 'Dangerous Goods Handling',
};
const stats = [
  { value: 600, suffix: '+', label: 'containers / year' },
  { value: 660, suffix: 'k+', label: 'boxes processed / year' },
  { value: 20, suffix: '+', label: 'years logistic experience' },
];
const sectors = [
  { name: 'E-Commerce', icon: ShoppingCart }, { name: 'Retail', icon: Storefront }, { name: 'FMCG', icon: Basket },
  { name: 'Solar & renewable technology', icon: SolarPanel }, { name: 'International imports', icon: Boat },
];
const depots = [
  { name: 'Sydney', text: 'Wetherill Park. Warehousing, 3PL and Amazon FBA prep. Warehouse 06:00–17:30.' },
  { name: 'Melbourne', text: 'Warehousing and distribution for Victorian customers.' },
  { name: 'China', text: 'Established supply-chain partners, consolidation and air & sea freight into Australia.' },
];
const processSteps = [
  { title: 'Office intake', text: 'Import documents and shipment information are prepared before freight arrives.' },
  { title: 'Depot-in scan', text: 'Incoming freight is unloaded, sorted and recorded against its consignment.' },
  { title: 'Phoenix Red Table', text: 'Hands-on quality checks help identify handling and preparation issues.' },
  { title: 'Wrap & prepare', text: 'Automated stretch wrapping helps secure goods for their next move.' },
  { title: 'Depot-out scan', text: 'Dispatch movements are scanned as drivers load the freight.' },
  { title: 'Signed proof of delivery', text: 'Customer signatures complete the delivery record in Transvirtual.' },
];
const aboutCopy = 'Experience carried forward into a new chapter. Phoenix Global Logistics evolved from Phoenix International Cargo in 2021, building on more than 20 years of cargo and logistics experience. Today, our Australian family-owned business links international arrivals with warehouse processing, national road freight and final delivery.';
const PAGE_NAMES = { '/': 'Home', '/why-phoenix': 'Why Phoenix', '/about': 'About', '/contact': 'Contact', '/tracking': 'Tracking' };
const pageName = to => PAGE_NAMES[to] || services.find(s => to === '/services/' + s.slug)?.title || '';
const nav = [['Why Phoenix', '/why-phoenix'], ['About', '/about'], ['Contact', '/contact']];

/* ---------- Building blocks ---------- */

function Lines({ as: Tag = 'h2', lines, className = '' }) {
  return <Tag className={className} data-lines>
    {lines.map((line, i) => <span className="ln" key={i}><span>{line}</span>{i < lines.length - 1 ? ' ' : null}</span>)}
  </Tag>;
}

function BtnText({ children }) {
  return <span className="btn-text"><span>{children}</span><span aria-hidden="true">{children}</span></span>;
}

function Btn({ to, href, children, variant = 'primary', icon: Ico = ArrowRight, type, onClick, className = '' }) {
  const inner = <><BtnText>{children}</BtnText>{Ico && <Ico className="btn-ico" size={16} weight="bold" aria-hidden="true" />}</>;
  const cls = `btn btn-${variant} ${className}`.trim();
  if (to) return <Link className={cls} to={to}>{inner}</Link>;
  if (href) return <a className={cls} href={href} {...(/^https?:/.test(href) ? { target: '_blank', rel: 'noreferrer' } : {})}>{inner}</a>;
  return <button className={cls} type={type || 'button'} onClick={onClick}>{inner}</button>;
}

function Photo({ image, alt = '', sizes = '(max-width: 767px) 100vw, 50vw', className = '', reveal = true, parallax, eager, ratio }) {
  return <figure className={'photo ' + className} data-reveal={reveal ? '' : undefined} style={ratio ? { aspectRatio: ratio } : undefined}>
    <img src={image.src} srcSet={image.set} sizes={image.set ? sizes : undefined} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async"
      width={image.width || 1200} height={Math.round((image.width || 1200) * 0.66)} data-parallax={parallax || undefined} />
  </figure>;
}

function Credential({ light }) {
  return <div className={'credential' + (light ? ' credential-light' : '')} data-fade="0.6">
    <AmazonLogo size={40} weight="light" aria-hidden="true" />
    <div><strong>Amazon Partner Carrier</strong><span>Small-parcel deliveries · NSW, QLD &amp; VIC</span></div>
  </div>;
}

function PageHero({ lines, text, image, alt, children, size = 'short', titleClass = 't-h1' }) {
  return <section className={'page-hero page-hero-' + size} data-hero>
    <div className="page-hero-media">
      <img src={image.src} srcSet={image.set} sizes="100vw" width="2200" height="1238" alt={alt || ''} fetchPriority="high" data-hero-media />
    </div>
    <div className="page-hero-shade" aria-hidden="true" />
    <div className="wrap page-hero-inner">
      <div className="page-hero-copy">
        <Lines as="h1" className={titleClass} lines={lines} />
        {text && <p className="page-hero-text" data-fade="0.4">{text}</p>}
      </div>
      {children}
    </div>
  </section>;
}

function SectionHead({ lines, text, children, className = '', titleClass = 't-h2' }) {
  return <div className={'section-head ' + className}>
    <Lines className={titleClass} lines={lines} />
    {(text || children) && <div className="section-head-aside" data-fade="0.15">
      {text && <p className="t-lead">{text}</p>}
      {children}
    </div>}
  </div>;
}

function Stat({ value, suffix, label, index }) {
  return <div className="stat">
    {index && <span className="stat-index">{index}</span>}
    <p className="stat-value"><span data-count={value}>{value}</span>{suffix}</p>
    <p className="stat-label">{label}</p>
  </div>;
}

/* ---------- Forms ---------- */

function useTrack() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (e, onLocal) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector('input[name="consignment"]');
    const ref = String(input?.value || '').trim();
    if (!/^[a-zA-Z0-9 _./-]{1,80}$/.test(ref)) {
      input?.setCustomValidity('Enter the consignment reference from your booking confirmation.');
      input?.reportValidity();
      input?.addEventListener('input', () => input.setCustomValidity(''), { once: true });
      return;
    }
    const url = trackingDestination(ref);
    if (url) { location.assign(url); return; }
    if (pathname === '/tracking' && onLocal) { onLocal(ref); return; }
    coverThen(() => navigate('/tracking?consignment=' + encodeURIComponent(ref)), 'Tracking');
  };
}

function TrackFields({ id, placeholder = 'E.g. PGL000123456', hint = true, button = 'Track shipment', inline }) {
  return <>
    <label className="field" htmlFor={id}>
      <span className="field-label">Consignment number</span>
      <input id={id} name="consignment" required maxLength={80} placeholder={placeholder} autoComplete="off" />
      {hint && <span className="field-hint">Use the reference on your booking confirmation.</span>}
    </label>
    <Btn type="submit" className={inline ? '' : 'btn-block'} icon={Crosshair}>{button}</Btn>
  </>;
}

function QuickTools() {
  const [quote, setQuote] = useState(false);
  const track = useTrack();
  const navigate = useNavigate();
  const tabs = useRef([]);
  const keys = e => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const next = e.key === 'End' || (e.key !== 'Home' && !quote);
    setQuote(next);
    tabs.current[next ? 1 : 0]?.focus();
  };
  const quoteSubmit = e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const query = new URLSearchParams({ from: data.get('from'), to: data.get('to') }).toString();
    coverThen(() => navigate('/contact?' + query + '#quote-form'), 'Contact');
  };
  return <div className="tools" data-fade="0.5">
    <div className="tools-strip"><span>Shipment tools</span><img src={logoLight} alt="" width="28" height="24" /></div>
    <div className="tools-tabs" role="tablist" aria-label="Shipment tools" onKeyDown={keys}>
      {['Track a shipment', 'Quick quote'].map((label, i) => <button key={label} ref={el => { tabs.current[i] = el; }} role="tab" type="button"
        id={'tools-tab-' + i} aria-selected={quote === !!i} aria-controls="shipment-tools-panel" tabIndex={quote === !!i ? 0 : -1}
        onClick={() => setQuote(!!i)}>{label}</button>)}
      <span className="tools-tab-bar" style={{ transform: `translateX(${quote ? 100 : 0}%)` }} aria-hidden="true" />
    </div>
    <div id="shipment-tools-panel" role="tabpanel" aria-labelledby={'tools-tab-' + (quote ? 1 : 0)} className="tools-panel">
      {quote
        ? <form className="tools-form" onSubmit={quoteSubmit} key="quote">
          <div className="field-pair">
            <label className="field"><span className="field-label">Origin</span><input name="from" required placeholder="Suburb or postcode" /></label>
            <label className="field"><span className="field-label">Destination</span><input name="to" required placeholder="Suburb or postcode" /></label>
          </div>
          <Btn type="submit" className="btn-block">Request a quote</Btn>
          <p className="tools-note">We’ll carry these details into the full quote form.</p>
        </form>
        : <form className="tools-form" onSubmit={e => track(e)} key="track">
          <TrackFields id="hero-consignment" />
          <a className="tools-login" href={company.clientLogin} target="_blank" rel="noreferrer">Client Login <ArrowUpRight size={14} weight="bold" aria-hidden="true" /></a>
        </form>}
    </div>
  </div>;
}

function QuoteForm() {
  const { search } = useLocation();
  const [review, setReview] = useState(null);
  const modal = useRef(null);
  const trigger = useRef(null);
  const form = useRef(null);
  // Details carried over from the quick quote (?from=…&to=…) are filled in after hydration.
  useEffect(() => {
    const params = new URLSearchParams(search);
    for (const [key, value] of params) {
      const el = form.current?.elements.namedItem(key);
      if (el && 'value' in el && !el.value) el.value = value;
    }
  }, [search]);
  useEffect(() => { if (review && !modal.current?.open) modal.current?.showModal(); }, [review]);
  const submit = e => {
    e.preventDefault();
    const values = new FormData(e.currentTarget);
    const target = ['international-freight', 'customs-clearance'].includes(values.get('service')) ? importEmail : transportEmail;
    const labels = { name: 'Name', company: 'Business', email: 'Email', phone: 'Phone', service: 'Service', from: 'Origin', to: 'Destination', quantity: 'Pallet / box count', type: 'Freight type', frequency: 'Frequency', date: 'Preferred timing', details: 'Details' };
    const body = [...values].map(([key, val]) => `${labels[key] || key}: ${key === 'service' ? services.find(s => s.slug === val)?.title || val : val || '—'}`).join('\n');
    trigger.current = e.nativeEvent.submitter;
    setReview({ body, target });
  };
  const close = () => { setReview(null); trigger.current?.focus(); };
  const field = (label, name, props = {}) => <label className="field"><span className="field-label">{label}<b aria-hidden="true">*</b></span><input name={name} required {...props} /></label>;
  return <div className="quote-panel" id="quote-form" data-fade>
    <div className="quote-head">
      <h2 className="t-h2">Request a quote</h2>
      <p className="t-lead">Share the details below, then send your request using your email app.</p>
    </div>
    <form className="quote-form" onSubmit={submit} ref={form}>
      <div className="field-grid">
        {field('Your name', 'name', { autoComplete: 'name', placeholder: 'Your name' })}
        {field('Business', 'company', { autoComplete: 'organization', placeholder: 'Business name' })}
        {field('Email', 'email', { type: 'email', autoComplete: 'email', placeholder: 'name@company.com.au' })}
        {field('Phone number', 'phone', { type: 'tel', autoComplete: 'tel', placeholder: 'Best contact number' })}
      </div>
      <label className="field"><span className="field-label">Service<b aria-hidden="true">*</b></span>
        <select name="service" required defaultValue="">
          <option value="" disabled>Choose a service</option>
          {orderedServices.map(s => <option key={s.slug} value={s.slug}>{s.title}</option>)}
        </select>
        <span className="field-hint">International freight and customs enquiries go to our import team. Other services go to our transport team.</span>
      </label>
      <div className="field-grid">
        {field('Origin', 'from', { placeholder: 'Origin suburb or postcode' })}
        {field('Destination', 'to', { placeholder: 'Destination suburb or postcode' })}
        {field('Pallet / box count', 'quantity', { inputMode: 'numeric', placeholder: 'Number of pallets or boxes' })}
        {field('Freight type', 'type', { placeholder: 'E.g. palletised freight or cartons' })}
      </div>
      <fieldset className="field">
        <legend className="field-label">Frequency<b aria-hidden="true">*</b></legend>
        <div className="radios">
          <label><input type="radio" name="frequency" value="One-off shipment" defaultChecked /> One-off shipment</label>
          <label><input type="radio" name="frequency" value="Regular contract" /> Regular contract</label>
        </div>
      </fieldset>
      {field('Preferred timing', 'date', { type: 'date' })}
      <label className="field"><span className="field-label">Dimensions, weight and shipment details<b aria-hidden="true">*</b></span>
        <textarea name="details" required rows={5} placeholder="Include dimensions, total weight and any handling requirements." />
      </label>
      <Btn type="submit" className="btn-block" icon={EnvelopeSimple}>Prepare quote request</Btn>
      <p className="quote-privacy">We use your details to respond to your enquiry. <a href="/privacy">Privacy Policy</a>.</p>
    </form>
    {review && <dialog ref={modal} onClose={close} className="quote-review" aria-labelledby="review-title">
      <button className="review-close" onClick={() => modal.current?.close()} aria-label="Close"><X size={20} /></button>
      <h2 id="review-title" className="t-h3">Review your quote request</h2>
      <p>Open the draft in your email app to send your enquiry to {review.target}.</p>
      <pre>{review.body}</pre>
      <div className="review-actions">
        <Btn href={'mailto:' + review.target + '?subject=Phoenix%20freight%20quote&body=' + encodeURIComponent(review.body)} icon={EnvelopeSimple}>Open email draft</Btn>
        <Btn variant="outline" icon={null} onClick={() => modal.current?.close()}>Back to form</Btn>
      </div>
    </dialog>}
  </div>;
}

/* ---------- Shared sections ---------- */

function AboutBlock({ image = photos.aboutHome }) {
  return <section className="section about-block">
    <div className="wrap about-grid">
      <div className="about-left">
        <Lines className="t-h2-lg" lines={['About Phoenix']} />
        <Photo image={image} alt="Phoenix depot and fleet" className="about-photo" sizes="(max-width: 899px) 100vw, 40vw" parallax={6} />
      </div>
      <div className="about-right">
        <p className="t-lead" data-fade>{aboutCopy}</p>
        <div data-fade="0.1"><Btn to="/about" variant="outline">About Us</Btn></div>
        <div className="stat-list" data-stagger>
          {stats.map(s => <Stat key={s.label} {...s} />)}
        </div>
      </div>
    </div>
  </section>;
}

function ServiceCard({ service }) {
  const img = servicePhotos[service.slug].card;
  return <Link className="service-card" to={'/services/' + service.slug} data-cursor="View">
    <div className="service-card-media"><img src={img.src} srcSet={img.set} sizes="(max-width: 639px) 84vw, (max-width: 1023px) 46vw, 540px" alt="" loading="lazy" width="720" height="540" draggable="false" /></div>
    <h3 className="service-card-title">{footerServiceNames[service.slug]}</h3>
    <p>{service.description}</p>
    <span className="service-card-link">View service <ArrowRight size={16} weight="bold" aria-hidden="true" /></span>
  </Link>;
}

// Six service cards on a rail that runs off the right edge; swipe, trackpad or the arrows move it.
function ServiceRail() {
  const rail = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const update = () => {
    const el = rail.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  };
  useEffect(() => { update(); addEventListener('resize', update); return () => removeEventListener('resize', update); }, []);
  const move = d => {
    const el = rail.current;
    const card = el?.querySelector('.service-card');
    if (!card) return;
    el.scrollBy({ left: d * (card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || 0)), behavior: 'smooth' });
  };
  return <>
    <div className="wrap rail-head">
      <SectionHead className="section-head-stack" lines={['Six services, one team', 'accountable for your freight']} text="From international arrivals and inbound preparation to storage, transport and delivery." />
      <div className="rail-controls" data-fade="0.2">
        <button type="button" className="round-btn" onClick={() => move(-1)} disabled={edge.start} aria-label="Previous services"><ArrowLeft size={22} /></button>
        <button type="button" className="round-btn round-btn-dark" onClick={() => move(1)} disabled={edge.end} aria-label="More services"><ArrowRight size={22} /></button>
      </div>
    </div>
    <div className="service-rail" ref={rail} onScroll={update} data-lenis-prevent-wheel="" data-stagger>
      {orderedServices.map(s => <ServiceCard key={s.slug} service={s} />)}
    </div>
  </>;
}

function Cta({ lines = ["Let's plan your next shipment."], text = 'Send your origin, destination and freight details to our team.', image = photos.ctaRoad, red }) {
  return <section className={'cta' + (red ? ' cta-red' : '')}>
    {!red && <div className="cta-media"><img src={image.src} srcSet={image.set} sizes="100vw" alt="" loading="lazy" width="2200" height="1238" data-parallax="9" /></div>}
    <div className="wrap cta-inner">
      <Lines className="t-h2-lg" lines={lines} />
      <p className="t-lead" data-fade="0.2">{text}</p>
      <div data-fade="0.3"><Btn to="/contact" variant="light">Request a quote</Btn></div>
    </div>
  </section>;
}

/* ---------- Header and footer ---------- */

function Header() {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const { pathname } = useLocation();
  const ref = useRef(null);
  useHeaderScroll(ref);
  useEffect(() => { setOpen(false); setMega(false); }, [pathname]);
  useEffect(() => {
    const esc = e => { if (e.key === 'Escape') { setMega(false); setOpen(false); } };
    addEventListener('keydown', esc);
    return () => removeEventListener('keydown', esc);
  }, []);
  useEffect(() => { document.documentElement.classList.toggle('menu-open', open); }, [open]);
  return <>
    <div className={'backdrop' + (mega || open ? ' is-on' : '')} onClick={() => { setMega(false); setOpen(false); }} aria-hidden="true" />
    <header ref={ref} className={'header' + (open ? ' is-open' : '') + (mega ? ' has-mega' : '')}>
      <div className="header-bar">
        <Link to="/" className="brand" aria-label="Phoenix Global Logistics home"><img src={logo} alt="" width="52" height="44" /></Link>
        <nav className="nav" aria-label="Main">
          <button type="button" className={'nav-link' + (pathname.startsWith('/services') ? ' is-current' : '')} aria-expanded={mega} aria-controls="mega" onClick={() => setMega(m => !m)}>
            Services<CaretDown size={14} weight="bold" aria-hidden="true" className="caret" />
          </button>
          {nav.map(([label, to]) => <NavLink key={to} to={to} className={({ isActive }) => 'nav-link' + (isActive ? ' is-current' : '')}>{label}</NavLink>)}
        </nav>
        <div className="header-actions">
          <Link className="btn btn-outline btn-sm header-track" to="/tracking"><BtnText>Track</BtnText></Link>
          <Link className="btn btn-primary btn-sm" to="/contact"><BtnText>Get a quote</BtnText></Link>
          <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(o => !o)}>
            <span /><span /><span className="sr-only">Menu</span>
          </button>
        </div>
      </div>
      <div id="mega" className={'mega' + (mega ? ' is-open' : '')} hidden={!mega}>
        <div className="mega-grid">
          {orderedServices.map(s => {
            const Ico = serviceIcons[s.slug];
            return <Link key={s.slug} to={'/services/' + s.slug} className={'mega-item' + (pathname === '/services/' + s.slug ? ' is-current' : '')}>
              <Ico size={26} weight="light" className="ico" aria-hidden="true" />
              <span><strong>{s.title}</strong><small>{s.description}</small></span>
            </Link>;
          })}
        </div>
      </div>
      <div id="menu" className={'menu' + (open ? ' is-open' : '')} hidden={!open}>
        <Link to="/" style={{ '--i': 0 }}>Home</Link>
        <details style={{ '--i': 1 }} open={pathname.startsWith('/services') || undefined}>
          <summary>Services<CaretDown size={18} aria-hidden="true" /></summary>
          <div className="menu-services">{orderedServices.map(s => {
            const Ico = serviceIcons[s.slug];
            return <Link key={s.slug} to={'/services/' + s.slug}><Ico size={20} weight="light" className="ico" aria-hidden="true" />{s.title}</Link>;
          })}</div>
        </details>
        {[...nav, ['Track a shipment', '/tracking']].map(([label, to], i) => <Link key={to} to={to} style={{ '--i': i + 2 }} aria-current={pathname === to ? 'page' : undefined}>{label}</Link>)}
      </div>
    </header>
  </>;
}

function Footer() {
  return <footer className="footer">
    <div className="wrap">
      <div className="footer-grid">
        <div className="footer-col footer-company">
          <Link to="/" aria-label="Phoenix Global Logistics home"><img src={footerLogo} alt="Phoenix Global Logistics" width="112" height="96" loading="lazy" /></Link>
          <p>Australian family-owned logistics, with more than 20 years of cargo experience.</p>
          <p>ABN {company.abn}</p>
        </div>
        <div className="footer-col">
          <h2>Services</h2>
          <ul>{services.map(s => <li key={s.slug}><Link to={'/services/' + s.slug}>{footerServiceNames[s.slug]}</Link></li>)}</ul>
        </div>
        <div className="footer-col">
          <h2>Operations &amp; tracking</h2>
          <ul>
            <li><Link to="/why-phoenix">Why Phoenix</Link></li>
            <li><Link to="/tracking">Track Shipment</Link></li>
            <li><a href={company.clientLogin} target="_blank" rel="noreferrer">Transvirtual client login</a></li>
            <li><Link to="/services/amazon-fba-logistics#carrier-credentials">Amazon carrier credentials</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact#depots">Sydney &amp; Melbourne depots</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h2>Contact</h2>
          <ul>
            <li><a href={'mailto:' + transportEmail}>{transportEmail}</a></li>
            <li><a href={'mailto:' + importEmail}>{importEmail}</a></li>
            <li>Office: {company.officeHours}<br />Warehouse: {company.warehouseHours}</li>
          </ul>
          <div className="footer-wechat"><img src={wechatQrFooter} alt="WeChat QR code for Phoenix Global Logistics" width="72" height="72" loading="lazy" /><span>WeChat<br />Scan to connect</span></div>
        </div>
      </div>
      <div className="footer-legal">
        <span>© 2026 Phoenix Global Logistics</span>
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Carriage &amp; Conditions</a>
      </div>
    </div>
  </footer>;
}

/* ---------- Pages ---------- */

function Home() {
  return <>
    <section className="hero" data-hero>
      <div className="page-hero-media"><img src={photos.homeHero.src} srcSet={photos.homeHero.set} sizes="100vw" width="2200" height="1238" alt="Phoenix Global Logistics trucks at the Sydney depot" fetchPriority="high" data-hero-media /></div>
      <div className="page-hero-shade hero-shade" aria-hidden="true" />
      <div className="wrap hero-inner">
        <div className="hero-copy">
          <Lines as="h1" className="t-display" lines={['From Container', 'To Customer on Docket']} />
          <p className="t-lead hero-text" data-fade="0.3">Australian family-owned logistics, connecting warehousing, road freight and approved Amazon FBA deliveries.</p>
          <div className="btn-row" data-fade="0.45">
            <Btn to="/contact">Lets Get Started</Btn>
            <Btn href="#services" variant="light" icon={null}>Explore our services</Btn>
          </div>
          <Credential light />
        </div>
        <QuickTools />
      </div>
    </section>

    <AboutBlock />

    <section className="section services-home" id="services">
      <ServiceRail />
    </section>

    <section className="section depots">
      <div className="wrap">
        <SectionHead lines={['Two depots, national linehaul', 'and a trade bridge to China']} text="Sydney and Melbourne depots, Australian linehaul and established China supply-chain connections.">
          <Btn to="/contact#depots" variant="dark">Contact our depots</Btn>
        </SectionHead>
        <ul className="depot-list">
          {depots.map(d => <li key={d.name} className="depot">
            <span className="depot-line" data-line aria-hidden="true" />
            <h3 className="depot-name">{d.name}</h3>
            <p data-fade>{d.text}</p>
            <MapPin size={22} weight="light" className="ico depot-pin" aria-hidden="true" />
          </li>)}
        </ul>
      </div>
    </section>

    <section className="section tint sectors">
      <div className="wrap">
        <SectionHead lines={['Freight behind', 'Australian business.']} text="Operational experience across retail, e-commerce, renewable technology, FMCG and international imports." />
        <ul className="sector-grid" data-stagger>
          {sectors.map(({ name, icon: Ico }) => <li key={name} className="sector">
            <svg className="sector-wave" viewBox="0 0 246 222" preserveAspectRatio="none" aria-hidden="true"><path d="M150 0h96v0c-30 70-60 95-110 95S60 70 20 95 0 160 10 222H70c-10-40 0-70 40-80s90 10 120-40c10-20 16-50 16-102z" /></svg>
            <span className="sector-icon"><Ico size={24} weight="regular" aria-hidden="true" /></span>
            <h3 className="t-h3">{name}</h3>
          </li>)}
        </ul>
      </div>
    </section>

    <Cta />
  </>;
}

function ServicePage() {
  const { slug } = useParams();
  const service = services.find(s => s.slug === slug) || services[0];
  const pics = servicePhotos[service.slug];
  const others = orderedServices.filter(s => s.slug !== service.slug).slice(0, 3);
  const fba = service.slug === 'amazon-fba-logistics';
  return <>
    <PageHero lines={[service.title]} text={service.intro} image={pics.hero} alt={service.imageAlt} size="tall" titleClass="t-h1 t-dm">
      <ul className="tags" data-fade="0.55">{service.tags.map(t => <li key={t}>{t}</li>)}</ul>
    </PageHero>

    <section className="section">
      <div className="wrap split">
        <div>
          <Lines className="t-h2 t-dm" lines={['What’s included']} />
          <p className="t-lead muted" data-fade="0.1">{service.audience}</p>
        </div>
        <ul className="checklist" data-stagger>
          {service.includes.map(item => <li key={item}><span className="check"><Check size={14} weight="bold" aria-hidden="true" /></span>{item}</li>)}
        </ul>
      </div>
    </section>

    <section className="section tint proof" id={fba ? 'carrier-credentials' : undefined}>
      <div className="wrap">
        <div className="proof-grid" data-stagger>
          {stats.map((s, i) => <Stat key={s.label} {...s} label={s.label.replace('logistic ', 'logistics ')} index={String(i + 1)} />)}
        </div>
      </div>
    </section>

    <section className="section">
      <div className="wrap">
        <SectionHead lines={['How we work']} text="Sydney and Melbourne depots, Australian linehaul and established China supply-chain connections." />
        <div className="work-list">
          {service.details.map((d, i) => <article key={d.title} className="work-row">
            <Photo image={pics.work[i]} alt="" className="work-photo" sizes="(max-width: 767px) 100vw, 34vw" />
            <div className="work-copy">
              <span className="work-index">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="t-h3-lg" data-fade>{d.title}</h3>
              <p data-fade="0.1">{d.text}</p>
            </div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="section tint">
      <div className="wrap">
        <SectionHead lines={['Connected logistics services']} text="Support for the next stage of your shipment.">
          <Btn to="/#services" variant="outline" icon={ArrowUpRight}>Explore our services</Btn>
        </SectionHead>
        <div className="connected" data-stagger>
          {others.map(s => {
            const img = servicePhotos[s.slug].card;
            return <Link key={s.slug} to={'/services/' + s.slug} className="connected-card" data-cursor="View">
              <img src={img.src} srcSet={img.set} sizes="(max-width: 767px) 100vw, 50vw" alt="" loading="lazy" width="720" height="480" />
              <span className="connected-shade" aria-hidden="true" />
              <span className="connected-copy"><span className="t-h3">{footerServiceNames[s.slug]}</span><ArrowUpRight size={22} aria-hidden="true" /></span>
            </Link>;
          })}
        </div>
      </div>
    </section>

    <Cta />
  </>;
}

function ProcessCarousel() {
  const [index, setIndex] = useState(0);
  const start = useRef(null);
  const prev = useRef(0);
  const n = processSteps.length;
  // Slides sit around the active one (-2 … +3) so there is always a neighbour on both sides;
  // a slide that wraps from one end to the other moves without a transition, off screen.
  const offset = (i, at) => ((i - at + n + Math.floor(n / 2)) % n) - Math.floor(n / 2);
  useEffect(() => { prev.current = index; }, [index]);
  const go = d => setIndex(i => (i + d + n) % n);
  const keys = e => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    e.preventDefault();
    go(e.key === 'ArrowLeft' ? -1 : 1);
  };
  const down = e => { start.current = [e.clientX, e.clientY]; };
  const up = e => {
    if (!start.current) return;
    const dx = e.clientX - start.current[0], dy = e.clientY - start.current[1];
    start.current = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > 1.3 * Math.abs(dy)) go(dx > 0 ? -1 : 1);
  };
  return <div className="carousel" id="quality-process" role="region" aria-roledescription="carousel" aria-label="Freight handling process" tabIndex={0} onKeyDown={keys}>
    <div className="carousel-viewport" onPointerDown={down} onPointerUp={up} onPointerCancel={() => { start.current = null; }}>
      <ol className="carousel-track">
        {processSteps.map((step, i) => <li key={step.title} className={'slide' + (i === index ? ' is-active' : '') + (Math.abs(offset(i, index) - offset(i, prev.current)) > 1 ? ' is-jump' : '')}
          style={{ '--o': offset(i, index) }} aria-hidden={i !== index || undefined}
          onClick={() => i !== index && setIndex(i)} aria-roledescription="slide" aria-label={`${i + 1} of ${n}`}>
          <div className="slide-media"><img src={photos.process[i].src} srcSet={photos.process[i].set} sizes="(max-width: 767px) 80vw, 46vw" alt={photos.process[i].alt} loading="lazy" draggable="false" width="1200" height="800" /></div>
          <div className="slide-copy">
            <h3 className="t-h3-lg">{step.title}</h3>
            <p>{step.text}</p>
          </div>
        </li>)}
      </ol>
    </div>
    <div className="carousel-controls">
      <button type="button" className="round-btn" onClick={() => go(-1)} aria-label="Previous process step"><ArrowLeft size={22} /></button>
      <button type="button" className="round-btn round-btn-dark" onClick={() => go(1)} aria-label="Next process step"><ArrowRight size={22} /></button>
      <span className="sr-only" aria-live="polite">Step {index + 1} of {n}: {processSteps[index].title}</span>
    </div>
  </div>;
}

function Why() {
  const track = useTrack();
  return <>
    <PageHero lines={['Good freight handling', 'starts before dispatch.']} text="Our fleet, operator network and depot processes help keep freight moving from receiving through to delivery." image={photos.whyHero} alt="Forklift moving palletised freight in the Phoenix warehouse">
      <Credential light />
    </PageHero>

    <section className="section process">
      <div className="wrap">
        <SectionHead className="section-head-center" lines={['From office intake', 'to signed delivery.']} text="Depot scans, the Phoenix Red Table check and automated wrapping help identify preparation issues and protect freight before dispatch." />
      </div>
      <ProcessCarousel />
    </section>

    <AboutBlock image={photos.aboutBuilding} />

    <section className="section tint">
      <div className="wrap support-grid">
        <div className="support-copy">
          <Lines className="t-h2" lines={['Tracking and direct support.']} />
          <p className="t-lead" data-fade="0.1">Scans recorded as freight moves feed the shipment updates available in Transvirtual. Check your consignment online, or speak with our operations team for help with the details.</p>
          <div data-fade="0.2"><Btn to="/tracking">Track a Shipment</Btn></div>
        </div>
        <div className="card track-card" data-fade="0.2">
          <p className="card-label"><Crosshair size={18} weight="bold" aria-hidden="true" /> Track a Shipment</p>
          <form className="tools-form" onSubmit={e => track(e)}>
            <TrackFields id="why-consignment" button="Track shipment" />
          </form>
          <div className="client-row">
            <div><h3 className="t-h3">Already a client?</h3><p>Access your Transvirtual account.</p></div>
            <Btn href={company.clientLogin} variant="outline" icon={ArrowUpRight}>Client Login</Btn>
          </div>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="wrap">
        <SectionHead lines={['Contact operations directly.']} />
        <div className="contact-cards" data-stagger>
          <a className="contact-card" href={'mailto:' + transportEmail}>
            <span className="contact-icon"><EnvelopeSimple size={24} aria-hidden="true" /></span>
            <h3 className="t-h3">Email Operations</h3>
            <p className="break">{transportEmail}</p>
          </a>
          <a className="contact-card" href={'mailto:' + transportEmail + '?subject=' + encodeURIComponent('Callback request') + '&body=' + encodeURIComponent('Phone number:\nShipment reference:\n')}>
            <span className="contact-icon"><Phone size={24} aria-hidden="true" /></span>
            <h3 className="t-h3">Request a Callback</h3>
            <p>Send your phone number and shipment reference.</p>
          </a>
          <div className="contact-card contact-card-qr">
            <span className="contact-icon"><ChatCircleText size={24} aria-hidden="true" /></span>
            <div><h3 className="t-h3">Scan to Connect</h3><p>Local and cross-border enquiries.</p></div>
            <img src={wechatQr} alt="WeChat QR code for Phoenix Global Logistics" width="112" height="112" loading="lazy" />
          </div>
        </div>
      </div>
    </section>

    <Cta />
  </>;
}

function About() {
  const teams = [
    { title: 'Warehouse', text: 'Receiving, inspecting, preparing and storing freight.', icon: Package },
    { title: 'Operations', text: 'Coordinating shipment information, bookings and depot movements.', icon: BookBookmark },
    { title: 'Logistics', text: 'Connecting collections, transport and delivery with our fleet and operator network.', icon: Truck },
  ];
  const values = [
    { title: 'Our mission', text: 'Connect international arrivals, warehousing and Australian transport through coordination and careful freight handling.', icon: Crosshair },
    { title: 'How we grow', text: 'Build long-term relationships, strengthen our Australian operation and keep communication at the center of our service.', icon: Handshake },
    { title: 'Our foundations', text: 'Teams in Sydney and Melbourne, an owned fleet, contracted operators and established China–Australia trade connections.', icon: GlobeHemisphereEast },
  ];
  return <>
    <PageHero lines={['A family business.', 'An established operation.']} text="Australian-owned logistics with more than 20 years of cargo experience and a hands-on approach to every shipment." image={photos.aboutHero} alt="Two Phoenix team members walking through the warehouse racking" />

    <section className="section story">
      <div className="wrap story-inner">
        <Lines className="t-h2" lines={['Experience carried forward', 'into a new chapter.']} />
        <div className="story-text" data-fade="0.1">
          <p className="t-lead">Phoenix Global Logistics evolved from Phoenix International Cargo in 2021, building on more than 20 years of cargo and logistics experience.</p>
          <p className="t-lead">Today, our Australian family-owned business links international arrivals with warehouse processing, national road freight and final delivery.</p>
        </div>
      </div>
      <div className="story-truck" data-truck><img src={photos.truck} alt="Phoenix fleet truck with a white cab and branded box" width="1200" height="675" loading="lazy" /></div>
    </section>

    <section className="section">
      <div className="wrap">
        <SectionHead lines={['Family-owned. Supported', 'by hands-on teams.']} text="Phoenix Global Logistics evolved from Phoenix International Cargo in 2021, building on more than 20 years of cargo and logistics experience." />
        <div className="team-grid" data-stagger>
          {teams.map(({ title, text, icon: Ico }, i) => <article key={title} className="team">
            <Ico size={36} weight="fill" className="ico" aria-hidden="true" />
            <h3 className="t-h3">{title}</h3>
            <p>{text}</p>
            <div className="team-media"><img src={photos.teams[i].src} srcSet={photos.teams[i].set} sizes="(max-width: 767px) 100vw, 33vw" alt="" loading="lazy" width="720" height="480" /></div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="section tint">
      <div className="wrap values-grid">
        <div className="values-left">
          <p className="eyebrow" data-fade>Our Values</p>
          <Photo image={photos.aboutBuilding} alt="The Phoenix Global Logistics building" className="values-photo" sizes="(max-width: 899px) 100vw, 34vw" parallax={6} />
        </div>
        <div className="values-right">
          <Lines className="t-h2-lg" lines={['Carrier capability with the', 'care of a family business.']} />
          <p className="t-lead" data-fade="0.1">{aboutCopy}</p>
          <ul className="value-list">
            {values.map(({ title, text, icon: Ico }) => <li key={title} className="value" data-fade>
              <Ico size={40} weight="fill" className="ico" aria-hidden="true" />
              <h3 className="t-h3">{title}</h3>
              <p>{text}</p>
            </li>)}
          </ul>
        </div>
      </div>
    </section>

    <Cta />
  </>;
}

function Contact() {
  const items = [
    { title: 'Transport enquiries', text: 'FBA, warehousing, road freight and dangerous goods.', email: transportEmail, icon: Truck },
    { title: 'Import enquiries', text: 'International freight and customs documentation.', email: importEmail, icon: Globe },
  ];
  return <>
    <PageHero lines={['Request a freight quote']} text="One-off shipment or regular contract. Connect with the right operational team and start your quote." image={photos.contactHero} alt="Phoenix truck at the loading dock" />
    <section className="section">
      <div className="wrap contact-grid">
        <div className="contact-side">
          <Lines className="t-h2" lines={['Direct to our team.']} />
          <ul className="contact-list" data-stagger>
            {items.map(({ title, text, email, icon: Ico }) => <li key={title}>
              <span className="contact-icon"><Ico size={22} aria-hidden="true" /></span>
              <div><h3 className="t-h3">{title}</h3><p>{text}</p><a className="text-link break" href={'mailto:' + email}>{email}</a></div>
            </li>)}
            <li>
              <span className="contact-icon"><Clock size={22} aria-hidden="true" /></span>
              <div><h3 className="t-h3">Operational hours</h3><p>Office: <strong>{company.officeHours}</strong><br />Warehouse: <strong>{company.warehouseHours}</strong></p><p className="abn">ABN {company.abn}</p></div>
            </li>
            <li id="depots">
              <span className="contact-icon"><MapPin size={22} aria-hidden="true" /></span>
              <div><h3 className="t-h3">Our depots</h3><p><strong>Sydney</strong><br />{company.sydneyAddress}</p><p><strong>Melbourne</strong><br />Victoria</p></div>
            </li>
          </ul>
          <div className="wechat-card" data-fade>
            <img src={wechatQr} alt="WeChat QR code for Phoenix Global Logistics" width="88" height="88" loading="lazy" />
            <div><h3 className="t-h3">Connect on WeChat</h3><p>Scan for cross-border and international shipping enquiries.</p></div>
          </div>
        </div>
        <QuoteForm />
      </div>
    </section>
  </>;
}

function Tracking() {
  const { search } = useLocation();
  const [reference, setReference] = useState('');
  useEffect(() => { setReference(new URLSearchParams(search).get('consignment') || ''); }, [search]);
  const track = useTrack();
  const stages = [
    { title: 'Depot-In', text: 'Freight received and scanned into the depot.' },
    { title: 'Sorting', text: 'Goods checked, sorted and allocated for their next move.' },
    { title: 'Out for Delivery', text: 'Scanned out at the depot and loaded with a driver for delivery.' },
    { title: 'Signed POD', text: 'Delivery signature recorded as proof of delivery.' },
  ];
  return <>
    <PageHero lines={['Track your shipment']} text="Use your Transvirtual consignment number or the tracking link issued with your booking confirmation." image={photos.trackingHero} alt="Forklift moving freight through the Phoenix warehouse">
      <form className="track-inline" onSubmit={e => track(e, setReference)} data-fade="0.5">
        <label className="sr-only" htmlFor="tracking-consignment">Consignment number</label>
        <input id="tracking-consignment" name="consignment" required maxLength={80} placeholder="E.g. PGL000123456" defaultValue={reference} key={reference} autoComplete="off" />
        <Btn type="submit" icon={Crosshair}>Track Shipment</Btn>
      </form>
      {reference && <p className="track-result" role="status">For <strong>{reference}</strong>, use the link on your booking confirmation or <a href={'mailto:' + transportEmail + '?subject=' + encodeURIComponent('Tracking ' + reference)}>email operations</a>.</p>}
    </PageHero>
    <section className="section">
      <div className="wrap">
        <SectionHead lines={['From Depot to Delivery']} text="Sydney and Melbourne depots, Australian linehaul and established China supply-chain connections." />
        <ol className="stage-grid" data-stagger>
          {stages.map((s, i) => <li key={s.title} className="stage">
            <span className="stage-num">{i + 1}</span>
            <h3 className="t-h3">{s.title}</h3>
            <p>{s.text}</p>
          </li>)}
        </ol>
      </div>
    </section>
    <Cta lines={['Need help with a', 'consignment?']} text="For urgent enquiries, include your consignment number and shipment details." image={photos.ctaTracking} />
  </>;
}

/* ---------- App shell ---------- */

function Page({ children }) {
  const { pathname } = useLocation();
  usePageMotion(pathname);
  return <main id="main" key={pathname} tabIndex={-1}>{children}</main>;
}

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
      if (url.origin !== location.origin) return;
      const to = url.pathname.replace(/\/$/, '') || '/';
      if (!phoenixRoutes.includes(to)) return;
      e.preventDefault();
      e.stopPropagation();
      if (to === pathname && !url.search) {
        if (url.hash) { history.replaceState(null, '', url.hash); scrollToEl(document.getElementById(url.hash.slice(1))); }
        else scrollToEl(document.body, 0);
        return;
      }
      coverThen(() => navigate(to + url.search + url.hash), pageName(to));
    };
    document.addEventListener('click', click, true);
    return () => document.removeEventListener('click', click, true);
  }, [navigate, pathname]);
  useEffect(() => {
    const service = services.find(s => pathname === '/services/' + s.slug);
    const titles = { '/': 'Phoenix Global Logistics | National 3PL, road freight & Amazon FBA', '/why-phoenix': 'Why Phoenix | Fleet, quality & operations', '/about': 'About Phoenix Global Logistics', '/contact': 'Contact & request a quote | Phoenix Global Logistics', '/tracking': 'Track a shipment | Phoenix Global Logistics' };
    const title = service ? `${service.title} | Phoenix Global Logistics` : titles[pathname];
    if (title && document.title !== title && document.readyState === 'complete') document.title = title;
  }, [pathname]);
  return <>
    <div className="curtain" aria-hidden="true">
      <div className="curtain-panel" />
      <div className="curtain-inner"><img className="curtain-mark" src={logoLight} alt="" width="64" height="55" /><p className="curtain-label" /></div>
      <span className="curtain-bar" />
    </div>
    <div className="cursor" aria-hidden="true" />
  </>;
}

export function App({ url }) {
  const Router = url ? StaticRouter : BrowserRouter;
  return <Router {...(url ? { location: url } : {})}>
    <a className="skip" href="#main">Skip to content</a>
    <Transitions />
    <Header />
    <Routes>
      <Route path="/" element={<Page><Home /></Page>} />
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
