import { useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom';
import '@fontsource-variable/inter';
import '@fontsource/sawarabi-mincho/latin-400.css';
import { company, faqs, importEmail, qualitySteps, sectors, services, trackingDestination, transportEmail } from '../../src/data';
import { photos } from './photos';
import { useHeader, usePageMotion } from './motion';
import './option2.css';

const nav = [['Services', '/services/amazon-fba-logistics'], ['Why Phoenix', '/why-phoenix'], ['About', '/about'], ['Contact', '/contact']];

/* ---------- Small building blocks ---------- */

// Headline with each line in its own mask so it can rise into place.
function Lines({ as: Tag = 'h2', lines, className = '' }) {
  return <Tag className={className} data-lines>
    {lines.map((line, i) => <span className="ln" key={i}><span>{line}</span>{i < lines.length - 1 ? ' ' : null}</span>)}
  </Tag>;
}

function Label({ children, light }) {
  return <p className={'label' + (light ? ' label-light' : '')}><span className="label-dot" aria-hidden="true" />{children}</p>;
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

function Photo({ src, alt = '', className = '', reveal = true, parallax = 8, eager }) {
  return <figure className={'photo ' + className} data-reveal={reveal ? '' : undefined}>
    <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" data-parallax={parallax || undefined} />
  </figure>;
}

function PageHero({ label, lines, text, image, alt, children, tall }) {
  return <section className={'page-hero' + (tall ? ' page-hero-tall' : '')} data-hero>
    <div className="page-hero-media"><img src={image} alt={alt || ''} data-hero-media /></div>
    <div className="page-hero-shade" aria-hidden="true" />
    <div className="wrap page-hero-inner">
      <Label light>{label}</Label>
      <Lines as="h1" className="display" lines={lines} />
      {text && <p className="page-hero-text" data-fade="0.5">{text}</p>}
      {children}
    </div>
  </section>;
}

function Stats({ dark }) {
  const items = [[600, '+', 'Containers handled every year'], [660, 'k+', 'Boxes processed every year'], [20, '+', 'Years of cargo experience']];
  return <div className={'stats' + (dark ? ' stats-dark' : '')}>
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
      <Label light>Get a quote</Label>
      <Lines className="display display-xl" lines={heading} />
      <p data-fade>{text}</p>
      <div className="cta-actions" data-fade="0.1">
        <Button to="/contact">Request a quote</Button>
        <Button href={'mailto:' + transportEmail} variant="ghost-light">Email operations</Button>
      </div>
    </div>
  </section>;
}

/* ---------- Header & footer ---------- */

function Header() {
  const [state, setRaw] = useState({ solid: false, hidden: false });
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const set = useCallback(next => setRaw(prev => ({ solid: next.solid, hidden: next.hidden === undefined ? prev.hidden : next.hidden })), []);
  useHeader(set);
  useEffect(() => setOpen(false), [pathname]);
  return <header className={'header' + (state.solid || open ? ' is-solid' : '') + (state.hidden && !open ? ' is-hidden' : '')}>
    <div className="header-inner">
      <Link to="/" className="brand" aria-label="Phoenix Global Logistics home">
        <img className="logo-dark" src="/assets/phoenix-logo.png" alt="" width="56" height="48" /><img className="logo-light" src="/assets/phoenix-logo-light.png" alt="" width="56" height="48" />
        <span>Phoenix<br />Global Logistics</span>
      </Link>
      <nav className="nav" aria-label="Main">
        {nav.map(([label, to]) => <NavLink key={to} to={to} className={({ isActive }) => isActive || (to.startsWith('/services') && pathname.startsWith('/services')) ? 'is-current' : undefined}>{label}</NavLink>)}
      </nav>
      <div className="header-actions">
        <Link className="header-link" to="/tracking">Track</Link>
        <Link className="btn btn-primary btn-small" to="/contact"><BtnText>Get a quote</BtnText></Link>
        <button className="menu-toggle" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(o => !o)}><span /><span /><span className="sr-only">Menu</span></button>
      </div>
    </div>
    <div id="menu" className={'menu' + (open ? ' is-open' : '')} hidden={!open}>
      {[['Home', '/'], ...nav, ['Track a shipment', '/tracking']].map(([label, to], i) => <Link key={to} to={to} style={{ '--i': i }}>{label}</Link>)}
    </div>
  </header>;
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

/* ---------- Home ---------- */

function Home() {
  return <>
    <section className="hero" data-hero>
      <div className="hero-media"><img src={photos.hero} alt={photos.heroAlt} data-hero-media fetchpriority="high" /></div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="wrap hero-inner">
        <Label light>Australian family-owned logistics</Label>
        <Lines as="h1" className="display display-hero" lines={['From container', 'to customer', 'on docket.']} />
        <div className="hero-foot">
          <p data-fade="0.5">Warehousing, road freight and approved Amazon FBA deliveries, connected under one team from Sydney and Melbourne.</p>
          <div className="hero-actions" data-fade="0.6"><Button to="/contact">Get a quote</Button><Button to="/services/amazon-fba-logistics" variant="ghost-light">Explore services</Button></div>
        </div>
      </div>
      <div className="hero-ticker" aria-hidden="true">
        <div className="ticker-track">{[0, 1].map(k => <span key={k}>Amazon Partner Carrier · NSW, QLD & VIC <i /> Sydney & Melbourne depots <i /> China–Australia trade bridge <i /> 20+ years of cargo experience <i /></span>)}</div>
      </div>
    </section>

    <section className="section intro">
      <div className="wrap intro-grid">
        <Label>About Phoenix</Label>
        <div>
          <Lines className="display display-l statement" lines={['Experience carried', 'forward into a', 'new chapter.']} />
          <div className="intro-copy">
            <p data-fade>Phoenix Global Logistics evolved from Phoenix International Cargo in 2021, building on more than 20 years of cargo and logistics experience.</p>
            <p data-fade="0.1">Today, our Australian family-owned business links international arrivals with warehouse processing, national road freight and final delivery.</p>
            <div data-fade="0.2"><Button to="/about" variant="ghost">About us</Button></div>
          </div>
        </div>
      </div>
      <div className="wrap"><Stats /></div>
    </section>

    <section className="section-flush tracker-band">
      <div className="wrap tracker-grid">
        <div>
          <Label>Track a shipment</Label>
          <Lines className="display display-m" lines={['Where is my', 'freight right now?']} />
        </div>
        <div data-fade><TrackForm /><a className="text-link" href={company.clientLogin} rel="noopener">Client login <Arrow /></a></div>
      </div>
    </section>

    <section className="services-h" data-horizontal>
      <div className="services-h-head wrap">
        <Label>Our services</Label>
        <Lines className="display display-l" lines={['Six services,', 'one team accountable', 'for your freight.']} />
        <p data-fade>From international arrivals and inbound preparation to storage, transport and delivery.</p>
      </div>
      <div className="h-track">
        {services.map((s, i) => <Link className="h-card" to={'/services/' + s.slug} key={s.slug}>
          <span className="h-num">{String(i + 1).padStart(2, '0')}</span>
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
        <Label light>Why Phoenix</Label>
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
        <div className="route"><span className="route-line" data-route /></div>
        <ol className="steps" data-stagger>
          {qualitySteps.map((s, i) => <li key={s.title}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><h3>{s.title}</h3><p>{s.text}</p></li>)}
        </ol>
      </div>
    </section>

    <Depots />
    <Sectors />
    <Faq />
    <Cta />
  </>;
}

function Depots() {
  const depots = [['Sydney', 'Wetherill Park, NSW', 'Warehousing, 3PL and Amazon FBA prep. Warehouse 06:00–17:30.'], ['Melbourne', 'Victoria', 'Warehousing and distribution for Victorian customers.'], ['China', 'Supply-chain partners', 'Consolidation and air & sea freight into Australia.']];
  const [hover, setHover] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return <section className="section depots" onPointerMove={e => setPos({ x: e.clientX, y: e.clientY })}>
    <div className="wrap">
      <div className="split-head">
        <div><Label>Network</Label><Lines className="display display-l" lines={['Two depots, national', 'linehaul and a trade', 'bridge to China.']} /></div>
        <div data-fade><p>Sydney and Melbourne depots, Australian linehaul and established China supply-chain connections.</p><Button to="/contact" variant="ghost">Contact our depots</Button></div>
      </div>
      <ul className="depot-list">
        {depots.map(([city, place, text]) => <li key={city} onPointerEnter={() => setHover(city)} onPointerLeave={() => setHover(null)} data-fade>
          <h3>{city}</h3><p className="depot-place">{place}</p><p>{text}</p><Arrow />
        </li>)}
      </ul>
    </div>
    <div className={'depot-float' + (hover ? ' is-on' : '')} style={{ translate: `${pos.x}px ${pos.y}px` }} aria-hidden="true">
      {Object.entries(photos.depots).map(([city, src]) => <img key={city} src={src} alt="" className={hover === city ? 'is-on' : ''} loading="lazy" />)}
    </div>
  </section>;
}

function Sectors() {
  return <section className="section sectors">
    <div className="wrap">
      <div className="split-head">
        <div><Label>Industries</Label><Lines className="display display-l" lines={['Freight behind', 'Australian business.']} /></div>
        <p data-fade>Operational experience across retail, e-commerce, renewable technology, FMCG and international imports.</p>
      </div>
      <div className="sector-grid" data-stagger>
        {sectors.map(s => <article className="sector" key={s}>
          <img src={photos.sectors[s]} alt="" loading="lazy" />
          <h3>{s}</h3>
        </article>)}
      </div>
    </div>
  </section>;
}

function Faq() {
  return <section className="section faq">
    <div className="wrap faq-grid">
      <div><Label>FAQ</Label><Lines className="display display-l" lines={['Questions,', 'answered.']} /></div>
      <div className="faq-list" data-stagger>
        {faqs.map(f => <details key={f.question}><summary>{f.question}<span className="plus" aria-hidden="true" /></summary><p>{f.answer}</p></details>)}
      </div>
    </div>
  </section>;
}

/* ---------- Services ---------- */

function ServicePage() {
  const { slug } = useParams();
  const service = services.find(s => s.slug === slug) || services[0];
  const others = services.filter(s => s !== service);
  return <>
    <PageHero label="Services" lines={service.title.split(/ (?=&)/)} text={service.intro} image={photos.serviceHero[service.slug]} alt={service.imageAlt}>
      <ul className="tags" data-fade="0.6">{service.tags.map(t => <li key={t}>{t}</li>)}</ul>
    </PageHero>

    <section className="section">
      <div className="wrap included">
        <div className="included-head">
          <Label>What's included</Label>
          <Lines className="display display-l" lines={['Everything your', 'freight needs.']} />
          <p data-fade>{service.audience}</p>
          <div data-fade><Button to="/contact">Request a quote</Button></div>
        </div>
        <ol className="included-list" data-stagger>
          {service.includes.map((item, i) => <li key={item}><span>{String(i + 1).padStart(2, '0')}</span>{item}</li>)}
        </ol>
      </div>
      <div className="wrap"><Stats /></div>
    </section>

    <section className="section dark how">
      <div className="wrap">
        <div className="split-head">
          <div><Label light>How we work</Label><Lines className="display display-l" lines={['Built around', 'the detail.']} /></div>
          <Photo src={photos.quality} className="how-photo" />
        </div>
        <div className="how-grid" data-stagger>
          {service.details.map((d, i) => <article key={d.title}><span>{String(i + 1).padStart(2, '0')}</span><h3>{d.title}</h3><p>{d.text}</p></article>)}
        </div>
      </div>
    </section>

    <section className="section">
      <div className="wrap">
        <div className="split-head"><div><Label>Connected services</Label><Lines className="display display-l" lines={['Support for the next', 'stage of your shipment.']} /></div></div>
        <ul className="service-index">
          {others.map((s, i) => <li key={s.slug} data-focus><Link to={'/services/' + s.slug}>
            <span className="idx">{String(i + 1).padStart(2, '0')}</span><span className="idx-title">{s.title}</span><span className="idx-text">{s.description}</span>
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
  return <>
    <PageHero label="Why Phoenix" lines={['Good freight', 'handling starts', 'before dispatch.']} text="Our fleet, operator network and depot processes help keep freight moving from receiving through to delivery." image={photos.why} />

    <section className="section">
      <div className="wrap split-head">
        <div><Label>Quality at every step</Label><Lines className="display display-l" lines={['From office intake', 'to signed delivery.']} /></div>
        <p data-fade>Depot scans, the Phoenix Red Table check and automated wrapping help identify preparation issues and protect freight before dispatch.</p>
      </div>
      <div className="wrap step-stack">
        {qualitySteps.map((s, i) => <article className="step-row" key={s.title} data-focus>
          <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
          <div><h3>{s.title}</h3><p>{s.text}</p></div>
          <Photo src={photos.steps[i]} parallax={6} />
        </article>)}
      </div>
    </section>

    <section className="section dark">
      <div className="wrap"><Label light>By the numbers</Label><Stats dark /></div>
    </section>

    <section className="section">
      <div className="wrap tracker-grid">
        <div><Label>Tracking</Label><Lines className="display display-l" lines={['Tracking and', 'direct support.']} />
          <p data-fade>Scans recorded as freight moves feed the shipment updates available in Transvirtual. Check your consignment online, or speak with our operations team for help with the details.</p></div>
        <div data-fade><TrackForm /><a className="text-link" href={company.clientLogin} rel="noopener">Already a client? Access Transvirtual <Arrow /></a></div>
      </div>
    </section>

    <section className="section tint">
      <div className="wrap">
        <div className="split-head"><div><Label>Talk to us</Label><Lines className="display display-l" lines={['Contact operations', 'directly.']} /></div></div>
        <div className="contact-cards" data-stagger>
          <a className="contact-card" href={'mailto:' + transportEmail}><h3>Email operations</h3><p>{transportEmail}</p><Arrow /></a>
          <a className="contact-card" href={'mailto:' + transportEmail + '?subject=Callback%20request'}><h3>Request a callback</h3><p>Send your phone number and shipment reference.</p><Arrow /></a>
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
    <PageHero label="About" lines={['A family business.', 'An established', 'operation.']} text="Australian-owned logistics with more than 20 years of cargo experience and a hands-on approach to every shipment." image={photos.about} />

    <section className="section">
      <div className="wrap story">
        <Photo src={photos.team} alt={photos.teamAlt} className="story-photo" />
        <div>
          <Label>Our story</Label>
          <Lines className="display display-l" lines={['Experience carried', 'forward into a', 'new chapter.']} />
          <p data-fade>Phoenix Global Logistics evolved from Phoenix International Cargo in 2021, building on more than 20 years of cargo and logistics experience.</p>
          <p data-fade="0.1">Today, our Australian family-owned business links international arrivals with warehouse processing, national road freight and final delivery.</p>
        </div>
      </div>
      <div className="wrap"><Stats /></div>
    </section>

    <section className="section tint">
      <div className="wrap">
        <div className="split-head"><div><Label>Our people</Label><Lines className="display display-l" lines={['Family-owned.', 'Supported by', 'hands-on teams.']} /></div></div>
        <div className="team-grid" data-stagger>
          {teams.map(([title, text, src]) => <article key={title}><figure className="photo"><img src={src} alt="" loading="lazy" /></figure><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </div>
    </section>

    <section className="section dark">
      <div className="wrap">
        <div className="split-head"><div><Label light>Our values</Label><Lines className="display display-l" lines={['Carrier capability with', 'the care of a family', 'business.']} /></div></div>
        <div className="values" data-stagger>{values.map(([t, d], i) => <article key={t}><span>{String(i + 1).padStart(2, '0')}</span><h3>{t}</h3><p>{d}</p></article>)}</div>
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
    <PageHero label="Contact" lines={['Request a', 'freight quote.']} text="One-off shipment or regular contract. Connect with the right operational team and start your quote." image={photos.contact} />
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
  const stages = [['Depot-in', 'Freight received and scanned into the depot.'], ['Sorting', 'Goods checked, sorted and allocated for their next move.'], ['Out for delivery', 'Scanned out at the depot and loaded with a driver for delivery.'], ['Signed POD', 'Delivery signature recorded as proof of delivery.']];
  return <>
    <PageHero label="Tracking" lines={['Track your', 'shipment.']} text="Use your Transvirtual consignment number or the tracking link issued with your booking confirmation." image={photos.tracking} tall>
      <div className="hero-track" data-fade="0.6"><TrackForm /></div>
    </PageHero>
    <section className="section">
      <div className="wrap">
        <div className="split-head"><div><Label>Shipment stages</Label><Lines className="display display-l" lines={['From depot', 'to delivery.']} /></div>
          <p data-fade>Each scan along the way updates the record linked to your consignment.</p></div>
        <div className="route"><span className="route-line" data-route /></div>
        <ol className="steps steps-4" data-stagger>{stages.map(([t, d], i) => <li key={t}><span className="step-num">{String(i + 1).padStart(2, '0')}</span><h3>{t}</h3><p>{d}</p></li>)}</ol>
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

function App() {
  return <BrowserRouter basename="/option-2">
    <a className="skip" href="#main">Skip to content</a>
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
