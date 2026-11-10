import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { Arrow, Button, CtaBand, Icon, QuickTools, TrackingForm } from './components';
import { company, faqs, importEmail, legacyServiceSlugs, qualitySteps, services, trackingDestination, transportEmail } from './data';
import { AustraliaMap } from './AustraliaMap';
import { ArrowSquareOut, Check, EnvelopeSimple, MagnifyingGlass, Phone, WechatLogo } from '@phosphor-icons/react';
import type { Service } from './data';
import { IndustrySectors } from './IndustrySectors';
import { PageCoverHero } from './PageCoverHero';
import { pageCovers } from './pageCovers';

export function PageHero({ label, title, description }: { label: string; title: string; description: string }) {
  return <PageCoverHero label={label} title={title} description={description} />;
}
export function CarrierCredential() {
  return <div className="pgl-carrier-credential"><Icon name="parcel" /><div><strong>Amazon Approved Carrier</strong><span>Small-parcel deliveries · NSW, QLD & VIC</span></div></div>;
}
export function OperationsMap() {
  return <section className="pgl-section pgl-network" id="network" data-home-section="network"><div className="container pgl-network-layout"><div className="pgl-network-copy"><h2>Australian operations.<br />International connections.</h2><p>Depots in Sydney and Melbourne, network linehaul across Australia, and established China supply-chain trade bridges.</p><div className="pgl-locations"><div><Icon name="pin" /><h3>Sydney</h3><p>New South Wales</p></div><div><Icon name="pin" /><h3>Melbourne</h3><p>Victoria</p></div></div><div className="pgl-trade-bridge"><Icon name="globe" /><div><strong>China–Australia</strong><p>Consolidation, international freight and local distribution.</p></div></div><Button to="/contact#depots" variant="secondary">Contact our depots <Arrow /></Button></div><AustraliaMap /></div></section>;
}
const homeServicePhotography: Record<string, { image: string; alt: string }> = {
  'amazon-fba-logistics': { image: 'freight-loading', alt: 'Cartons loaded in a Phoenix freight vehicle' },
  'warehousing-and-3pl': { image: 'phoenix-depot', alt: 'Phoenix warehouse, yard and loading bays' },
  'road-freight-and-transport': { image: 'phoenix-fleet', alt: 'Phoenix freight truck and wrapped pallets at the depot' },
};
function ServiceCatalogCard({ service, compact = false, photography }: { service: Service; compact?: boolean; photography?: { image: string; alt: string } }) {
  const photo = photography || { image: service.image, alt: service.imageAlt };
  return <Link reloadDocument className={`service-catalog-card${compact ? ' service-catalog-card--compact' : ''}`} to={`/services/${service.slug}`}>
    <div className="service-catalog-photo"><img src={`/assets/${photo.image}.webp`} width="640" height="420" alt={photo.alt} loading="lazy" /></div>
    <div className="service-catalog-copy">
      <h3>{service.title}</h3>
      {!compact && <><p>{service.description}</p><ul className="service-scope-tags">{service.tags.map(tag => <li key={tag}>{tag}</li>)}</ul><span className="service-catalog-action">View service <Arrow /></span></>}
    </div>
  </Link>;
}

function FreightQuotePanel({ service, showFaq = false }: { service?: Service; showFaq?: boolean }) {
  const destination = service ? `/contact?service=${service.slug}#quote-form` : '/contact#quote-form';
  const email = service?.department === 'import' ? importEmail : transportEmail;
  return <section className="freight-quote-section" id="request-quote" data-home-section={showFaq ? 'contact' : undefined}>
    {showFaq && <div className="container homepage-quote-questions"><div className="pgl-faq-layout"><div data-reveal><h2>Frequently asked questions</h2><p>Find answers about our services and your shipment.</p><Link reloadDocument to="/contact" className="text-link">Contact us <Arrow /></Link></div><div className="pgl-faq-list" data-reveal>{faqs.map(faq => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div></div></div>}
    <div className="container freight-quote-panel">
      <div className="freight-quote-copy" data-reveal>
        <h2>Tell us what you’re moving.</h2>
        <p>Share your origin, destination, freight quantities and preferred timing with our team.</p>
        <Button to={destination}>Request a quote <Arrow /></Button>
        <div className="freight-quote-contacts"><a href={`mailto:${email}`}>{email}</a>{!service && <a href={`mailto:${importEmail}`}>{importEmail}</a>}</div>
      </div>
      <img src="/assets/phoenix-port.webp" width="1774" height="887" alt="Shipping containers and cargo operations at port" loading="lazy" />
    </div>
  </section>;
}

export function Home() {
  const steps = [
    ['Receive & coordinate', 'We review your shipment documents and arrange collection or depot receiving.', 'document'],
    ['Check & prepare', 'We unload, check and prepare your freight for storage or transport.', 'warehouse'],
    ['Process & dispatch', 'We assign consignment numbers and scan freight as it leaves the depot.', 'parcel'],
    ['Deliver', 'Your goods are delivered and the signature is recorded as proof of delivery.', 'truck'],
  ];
  return <div className="pgl-home phoenix-home">
    <section className="phoenix-home-hero" data-home-section="hero">
      <div className="container">
        <div className="phoenix-home-intro">
          <h1>Freight, warehousing<br />and Amazon FBA.</h1>
          <div><p>National 3PL, interstate road freight and approved Amazon FBA inbound logistics. Australian family-owned, with teams in Sydney and Melbourne.</p><div className="phoenix-intro-actions"><Button to="/contact#quote-form">Request a quote <Arrow /></Button><Link reloadDocument to="#services" className="text-link">Explore services <Arrow /></Link></div></div>
        </div>
        <figure className="phoenix-home-photo"><img src={pageCovers['/'].src} width="1600" height="800" alt={pageCovers['/'].alt} fetchPriority="high" /></figure>
        <div className="phoenix-shipment-tools" role="group" aria-label="Shipment tools"><QuickTools /></div>
      </div>
    </section>

    <section className="phoenix-home-trust" id="trust" aria-label="Accreditation and operational scale" data-home-section="trust">
      <div className="container">
        <div className="phoenix-home-proof"><CarrierCredential /><div><strong>600+</strong><span>containers / year</span></div><div><strong>660k+</strong><span>boxes processed / year</span></div><div><strong>20+</strong><span>years of logistics experience</span></div></div>
        <p className="phoenix-proof-note">Annual container and box volumes reflect current monthly Amazon throughput. Experience relates to our founders.</p>
        <div className="phoenix-trust-context"><p>Established in 2021, Phoenix Global Logistics grew from Phoenix International Cargo. Our Australian family-owned business operates from Sydney and Melbourne.</p><div><Link reloadDocument to="/about" className="text-link">About Phoenix <Arrow /></Link><Link reloadDocument to="/services/amazon-fba-logistics#carrier-credentials" className="text-link">View carrier credentials <Arrow /></Link></div></div>
      </div>
    </section>

    <section className="marketing-section phoenix-services" id="services" data-home-section="capabilities">
      <div className="container">
        <div className="marketing-heading" data-reveal><h2>Logistics services</h2><p>From international arrivals and inbound preparation to storage, transport and delivery.</p></div>
        <div className="service-catalog">{services.map(service => <ServiceCatalogCard key={service.slug} service={service} photography={homeServicePhotography[service.slug]} />)}</div>
        <div className="phoenix-additional-handling"><span><Icon name="container" />Container handling</span><span><Icon name="truck" />Last-mile delivery</span></div>
      </div>
      <article className="phoenix-fba-feature phoenix-capabilities-highlight">
        <div className="container phoenix-fba-layout">
          <div className="phoenix-fba-copy" data-reveal><CarrierCredential /><h2>Amazon FBA inbound & prep</h2><p>From container unloading to fulfilment-centre delivery, we prepare your freight for its next step.</p><ul className="phoenix-feature-list">{['Container unloading and FBA palletising','FNSKU barcoding and shipment preparation','Delivery slot booking and fulfilment-centre coordination'].map(item => <li key={item}><Check size={18} aria-hidden="true" />{item}</li>)}</ul><Button to="/services/amazon-fba-logistics">Explore Amazon FBA <Arrow /></Button></div>
          <div className="phoenix-fba-visual" data-reveal><img src="/assets/phoenix-fba.webp" width="1536" height="1024" alt="Warehouse team unloading palletised cartons from a shipping container" loading="lazy" /><div className="phoenix-fba-figures"><div><strong>~50</strong><span>containers / month</span></div><div><strong>~55,000</strong><span>cartons / month</span></div></div><p>Figures relate to Amazon operations.</p></div>
        </div>
      </article>
    </section>

    <section className="marketing-section phoenix-quality-feature" id="quality" data-home-section="difference">
      <div className="container">
        <div className="phoenix-quality-layout">
          <div className="phoenix-quality-visual" data-reveal><img src="/assets/phoenix-quality.webp" width="1536" height="1024" alt="Warehouse team member inspecting a carton at a red quality-control table" loading="lazy" /></div>
          <div className="phoenix-quality-copy" data-reveal><h2>The Phoenix difference</h2><p>Inspection, secure wrapping and depot scans help prevent transit damage and avoidable Amazon fulfilment-centre rejections.</p><div className="phoenix-quality-points">{[['Phoenix Red Table','Our inspection standard helps identify freight handling and preparation issues.','parcel'],['Automated stretch wrapping','Goods secured for storage and transport.','container'],['Depot-in and depot-out scanning','Consignments recorded as they enter and leave the depot.','document']].map(([title,text,icon]) => <div key={title}><Icon name={icon} /><div><h3>{title}</h3><p>{text}</p></div></div>)}</div><Link reloadDocument to="/why-phoenix" className="text-link">See our quality process <Arrow /></Link></div>
        </div>
        <div className="phoenix-process-layout phoenix-quality-process"><div data-reveal><h2>How it works</h2><p>From office intake and depot scans to signed proof of delivery.</p><Link reloadDocument className="text-link" to="/tracking">Track a shipment <Arrow /></Link></div><ol className="phoenix-process-steps">{steps.map(([title,text,icon],index) => <li key={title} data-reveal><div className="phoenix-process-step-heading"><Icon name={icon} /><span aria-hidden="true">{String(index + 1).padStart(2,'0')}</span></div><h3>{title}</h3><p>{text}</p></li>)}</ol></div>
      </div>
    </section>

    <OperationsMap />
    <IndustrySectors />
    <FreightQuotePanel showFaq />
  </div>;
}

const serviceOperationImages: Record<string, { image: string; alt: string }> = {
  'amazon-fba-logistics': { image:'phoenix-quality', alt:'Carton inspection at a red warehouse quality-control table' },
  'warehousing-and-3pl': { image:'phoenix-fba', alt:'Palletised cartons being unloaded at a warehouse dock' },
  'road-freight-and-transport': { image:'phoenix-fleet', alt:'Phoenix truck and secured pallets at the depot' },
  'international-freight': { image:'phoenix-fba', alt:'Shipping container unloading at an Australian warehouse' },
  'customs-clearance': { image:'phoenix-port', alt:'Shipping containers and cargo operations at port' },
  'dangerous-goods': { image:'phoenix-quality', alt:'Warehouse staff checking cartons before dispatch' },
};

export function ServicePage() {
  const { slug = '' } = useParams();
  if (legacyServiceSlugs[slug]) return <Navigate to={`/services/${legacyServiceSlugs[slug]}`} replace />;
  const service = services.find(item => item.slug === slug);
  if (!service) return <PageHero label="Services" title="Service not found" description="Explore Phoenix freight, warehousing and transport services using the Services menu." />;
  const operation = serviceOperationImages[service.slug];
  return <article className="phoenix-service" data-service={service.slug}>
    <PageCoverHero label={service.shortTitle} title={service.title} description={service.intro} service><div className="phoenix-intro-actions"><Button to={`/contact?service=${service.slug}#quote-form`}>Request a quote <Arrow /></Button><a className="text-link" href="#included">What’s included <Arrow /></a></div><ul className="service-scope-tags">{service.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></PageCoverHero>
    <nav className="phoenix-service-section-nav" aria-label="On this page"><div className="container"><a href="#included">What’s included</a><a href="#service-operations">How we work</a><a href="#related-services">Other services</a><a href="#request-quote">Request a quote</a></div></nav>

    <section className="marketing-section phoenix-service-scope" id="included"><div className="container phoenix-service-scope-layout"><div data-reveal><h2>What’s included</h2><div className="phoenix-service-audience"><h3>Who this service is for</h3><p>{service.audience}</p></div></div><ul className="phoenix-service-inclusions">{service.includes.map(item => <li key={item} data-reveal><Check size={22} aria-hidden="true" /><span>{item}</span></li>)}</ul></div></section>

    {service.slug === 'amazon-fba-logistics' && <section className="phoenix-carrier-strip" id="carrier-credentials"><div className="container" data-reveal><CarrierCredential /><div><strong>~50</strong><span>containers / month</span></div><div><strong>~55,000</strong><span>cartons / month</span></div><p>Figures relate to Amazon operations.</p></div></section>}

    <section className="marketing-section phoenix-service-operations" id="service-operations"><div className="container phoenix-service-operations-layout"><div className="phoenix-service-operation-photo" data-reveal><img src={`/assets/${operation.image}.webp`} width="768" height="720" alt={operation.alt} loading="lazy" /></div><div data-reveal><h2>How we work</h2><div className="phoenix-service-details">{service.details.map(item => <section key={item.title}><h3>{item.title}</h3><p>{item.text}</p></section>)}</div></div></div></section>

    <section className="marketing-section phoenix-related-services" id="related-services"><div className="container"><div className="marketing-heading" data-reveal><h2>Connected logistics services</h2><p>Support for the next stage of your shipment.</p></div><div className="service-catalog service-catalog--related">{services.filter(item => item.slug !== slug).map(item => <ServiceCatalogCard key={item.slug} service={item} compact />)}</div></div></section>
    <FreightQuotePanel service={service} />
  </article>;
}
export function WhyPhoenixPage() {
  return <article className="company-page why-page">
    <PageCoverHero label="Why Phoenix" title="Good freight handling starts before dispatch." description="Our fleet, operator network and depot processes help keep freight moving from receiving through to delivery."><div className="phoenix-intro-actions"><Button to="/contact#quote-form">Talk to our team <Arrow /></Button><Link reloadDocument className="text-link" to="#quality-process">See how we work <Arrow /></Link></div></PageCoverHero>

    <section className="why-capacity-section" id="fleet" aria-label="Operational scale and fleet">
      <div className="container why-capacity-grid">
        <div className="why-capacity-intro" data-reveal><p className="company-kicker">Operational scale & fleet</p><h2>Owned equipment. A connected transport network.</h2></div>
        <div className="why-capacity-facts">{[['12','owned vehicles','Three vans, two small rigid trucks and seven heavy vehicles.'],['20+','contracted operators','Additional transport capacity through our operator network.'],['18+','internal staff','Warehouse, operations and logistics teams.']].map(([number,label,text]) => <div key={label} data-reveal><strong>{number}</strong><h3>{label}</h3><p>{text}</p></div>)}</div>
      </div>
      <div className="container why-carrier-context" data-reveal><CarrierCredential /><Link reloadDocument className="text-link" to="/services/amazon-fba-logistics#carrier-credentials">View carrier credentials <Arrow /></Link></div>
    </section>

    <section className="company-section why-quality-section" id="quality-process">
      <div className="container">
        <div className="company-section-heading" data-reveal><div><p className="company-kicker">Quality assurance process</p><h2>From office intake to signed delivery.</h2></div><p>Depot scans, the Phoenix Red Table check and automated wrapping help identify preparation issues and protect freight before dispatch.</p></div>
        <ol className="why-process-gallery">{qualitySteps.map((step,i) => <li key={step.title} data-reveal><div className="why-process-gallery-photo"><img src={`/assets/process-${['office-intake','depot-in','red-table','wrap-prepare','depot-out','signed-pod'][i]}.webp`} width="1200" height="800" alt={['Coordinator reviewing shipment documents in the depot office','Warehouse receiver scanning a carton at the receiving bay','Quality inspector checking a carton at the Phoenix Red Table','Operator using an automated pallet stretch-wrapping machine','Driver scanning outbound freight beside a blue curtainsider','Customer signing proof of delivery on the driver’s tablet'][i]} loading="lazy" /></div><div className="why-process-gallery-copy"><div className="why-process-gallery-heading"><span>{String(i+1).padStart(2,'0')}</span><h3>{step.title}</h3></div><p>{step.text}</p></div></li>)}</ol>
      </div>
    </section>

    <section className="shipment-access" id="technology-visibility" aria-labelledby="shipment-access-title">
      <div className="container">
        <div className="shipment-access-heading" data-reveal><div><p className="shipment-access-label">Technology & visibility</p><h2 id="shipment-access-title">Tracking and direct support.</h2></div><p>Scans recorded as freight moves feed the shipment updates available in Transvirtual. Check your consignment online, or speak with our operations team for help with the details.</p></div>
        <div className="shipment-access-lookup" data-reveal>
          <div className="shipment-access-tool"><div className="shipment-access-tool-heading"><MagnifyingGlass size={25} weight="regular" aria-hidden="true" /><h3>Track through Transvirtual</h3></div><TrackingForm id="why-phoenix-track" /></div>
          <div className="shipment-access-portal"><h3>Already a client?</h3><p>Access your Transvirtual account.</p><a href={company.clientLogin} target="_blank" rel="noreferrer">Client login <ArrowSquareOut size={18} aria-hidden="true" /></a></div>
        </div>
        <div className="shipment-access-contact-heading" data-reveal><h3>Contact operations directly.</h3><p>Have your consignment number ready so we can find your shipment.</p></div>
        <div className="shipment-access-channels">
          <a className="shipment-access-channel" href={`mailto:${transportEmail}`} data-reveal><span className="shipment-access-channel-label"><EnvelopeSimple size={23} aria-hidden="true" />Email</span><strong>Email operations</strong><span className="shipment-access-email">{transportEmail}</span></a>
          <a className="shipment-access-channel" href={`mailto:${transportEmail}?subject=Callback%20request&body=Please%20call%20me%20about%20my%20shipment.%0A%0AName%3A%0APhone%3A%0AConsignment%20number%3A`} data-reveal><span className="shipment-access-channel-label"><Phone size={23} aria-hidden="true" />Phone</span><strong>Request a callback</strong><span>Send your phone number and shipment reference.</span></a>
          <a className="shipment-access-channel shipment-access-wechat" href="/assets/wechat-qr.png" target="_blank" rel="noreferrer" data-reveal><div><span className="shipment-access-channel-label"><WechatLogo size={23} aria-hidden="true" />WeChat</span><strong>Scan to connect</strong><span>Local and cross-border enquiries.</span></div><img src="/assets/wechat-qr.png" width="96" height="96" alt="Phoenix WeChat contact QR code" loading="lazy" /></a>
        </div>
      </div>
    </section>
    <CtaBand />
  </article>;
}
export function AboutPage() {
  return <article className="company-page about-page">
    <PageCoverHero label="About us" title="A family business with an operational foundation." description="Phoenix Global Logistics connects international freight, warehouse processing and Australian road transport."><div className="phoenix-intro-actions"><Button to="/contact#depots">Our depots <Arrow /></Button><Link reloadDocument className="text-link" to="/why-phoenix">Why Phoenix <Arrow /></Link></div></PageCoverHero>
    <section className="about-history-section" aria-label="Company history"><div className="container about-history-rail"><div data-reveal><strong>2021</strong><span>Phoenix Global Logistics established</span></div><div data-reveal><strong>20+ years</strong><span>Founders’ logistics experience</span></div><div data-reveal><strong>Two cities</strong><span>Operations in Sydney and Melbourne</span></div></div></section>

    <section className="company-section about-story-section" id="company-heritage">
      <div className="container about-story-layout">
        <div className="about-story-marker" data-reveal><span>01</span><p>Company heritage</p></div>
        <div className="about-story-copy" data-reveal><h2>Experience carried forward into a new chapter.</h2><p>Phoenix Global Logistics evolved from Phoenix International Cargo in 2021, building on more than 20 years of cargo and logistics experience.</p><p>Today, our Australian family-owned business links international arrivals with warehouse processing, national road freight and final delivery.</p></div>
        <figure className="about-story-photo" data-reveal><img src="/assets/freight-loading.webp" width="1706" height="1280" alt="Freight loaded and secured in a Phoenix transport vehicle" loading="lazy" /><figcaption>Connecting freight arrivals with local transport</figcaption></figure>
      </div>
    </section>

    <section className="about-people-section" id="leadership-team">
      <div className="container about-people-layout">
        <div className="about-people-photo" data-reveal><img src="/assets/phoenix-fleet.webp" width="1707" height="1280" alt="Phoenix fleet and palletised freight at the depot" loading="lazy" /></div>
        <div className="about-people-copy" data-reveal><p className="company-kicker">Leadership & team</p><h2>Family-owned. Supported by hands-on teams.</h2><p>Our founders bring more than 20 years of cargo experience to an Australian family-owned business. More than 18 internal staff support our warehouse, operations and logistics work.</p><div className="about-team-roles">{[['warehouse','Warehouse','Receiving, inspecting, preparing and storing freight.'],['document','Operations','Coordinating shipment information, bookings and depot movements.'],['truck','Logistics','Connecting collections, transport and delivery with our fleet and operator network.']].map(([icon,title,text])=><div key={title}><Icon name={icon} /><div><h3>{title}</h3><p>{text}</p></div></div>)}</div><Link reloadDocument to="/why-phoenix" className="text-link">Explore our operation <Arrow /></Link></div>
      </div>
    </section>

    <section className="company-section about-mission-section" id="mission-growth">
      <div className="container about-mission-layout">
        <div data-reveal><p className="company-kicker">Mission & growth vision</p><h2>Carrier capability with the care of a family business.</h2><p>Our goal is to combine the capacity of a larger carrier with personal, hands-on attention to the businesses and freight we handle.</p><Button to="/contact#quote-form">Talk about your freight <Arrow /></Button></div>
        <div className="about-growth-priorities">{[['Our mission','Connect international arrivals, warehousing and Australian transport through practical coordination and careful freight handling.'],['How we grow','Build long-term relationships, strengthen our Australian operation and keep direct communication at the centre of our service.'],['Our foundations','Teams in Sydney and Melbourne, an owned fleet, contracted operators and established China–Australia trade connections.']].map(([title,text])=><div key={title} data-reveal><h3>{title}</h3><p>{text}</p></div>)}<Link reloadDocument className="text-link" to="/contact#depots">Find our depots <Arrow /></Link></div>
      </div>
    </section>
    <CtaBand />
  </article>;
}
function QuoteForm() {
  const [search] = useSearchParams();
  const [prepared, setPrepared] = useState<{body:string;href:string;recipient:string} | null>(null);
  const [copied,setCopied] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (prepared) resultRef.current?.focus(); }, [prepared]);
  const selectedDefault = services.find(s => s.slug === search.get('service') || s.shortTitle === search.get('service'))?.slug || '';
  function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = new FormData(event.currentTarget); const selected = services.find(s => s.slug === data.get('service'));
    const recipient = selected?.department === 'import' ? importEmail : transportEmail;
    const body = `Hello Phoenix team,\n\nPlease quote for the following shipment.\n\nService: ${selected?.title || 'Multiple services / Not sure yet'}\nName: ${data.get('name')}\nBusiness: ${data.get('business') || 'Not supplied'}\nEmail: ${data.get('email')}\nPhone: ${data.get('phone') || 'Not supplied'}\nOrigin: ${data.get('from')}\nDestination: ${data.get('to')}\nFreight: ${data.get('quantity')} ${data.get('unit')}\nFrequency: ${data.get('frequency')}\nPreferred timing: ${data.get('timing') || 'To be discussed'}\n\nDimensions, weight and shipment details:\n${data.get('details')}\n\nThank you,\n${data.get('name')}`;
    setPrepared({body,recipient,href:`mailto:${recipient}?subject=${encodeURIComponent(`Quote request: ${selected?.shortTitle || 'Freight services'}`)}&body=${encodeURIComponent(body)}`});
  }
  return <div id="quote-form" className="quote-form-wrap"><div className="form-heading"><h2>Request a quote</h2><p>Share the details below, then send your request using your email app.</p></div>{prepared && <div className="quote-result" ref={resultRef} tabIndex={-1}><h3>Your quote request is ready</h3><p>Your email app will open a draft addressed to {prepared.recipient}. Review it and send it to our team.</p><pre className="pgl-quote-preview">{prepared.body}</pre><a className="button button--primary" href={prepared.href}>Open email request <Arrow /></a><button className="button button--secondary" type="button" onClick={async()=>{try{await navigator.clipboard.writeText(prepared.body);setCopied('Request copied.');}catch{setCopied('Select the request text to copy it.');}}}>Copy request</button><p aria-live="polite">{copied}</p><button type="button" className="text-button" onClick={()=>setPrepared(null)}>Edit details</button></div>}
    <form className="quote-form" hidden={!!prepared} onSubmit={submit}>
      <div className="form-row"><div><label htmlFor="quote-name">Your name *</label><input id="quote-name" name="name" required autoComplete="name" maxLength={100} /></div><div><label htmlFor="quote-business">Business</label><input id="quote-business" name="business" autoComplete="organization" maxLength={160} /></div></div>
      <div className="form-row"><div><label htmlFor="quote-email">Email *</label><input id="quote-email" name="email" type="email" required autoComplete="email" maxLength={254} /></div><div><label htmlFor="quote-phone">Phone</label><input id="quote-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} /></div></div>
      <div><label htmlFor="quote-service">Service *</label><select id="quote-service" name="service" defaultValue={selectedDefault} required><option value="" disabled>Choose a service</option>{services.map(s=><option key={s.slug} value={s.slug}>{s.title}</option>)}<option value="other">Multiple services / Not sure yet</option></select><p className="field-help">International freight and customs enquiries go to our import team. Other services go to our transport team.</p></div>
      <div className="form-row"><div><label htmlFor="quote-from">Origin *</label><input id="quote-from" name="from" required defaultValue={search.get('from') || ''} placeholder="Suburb or postcode" maxLength={160} /></div><div><label htmlFor="quote-to">Destination *</label><input id="quote-to" name="to" required defaultValue={search.get('to') || ''} placeholder="Suburb or postcode" maxLength={160} /></div></div>
      <div className="form-row"><div><label htmlFor="quote-quantity">Pallet / box count *</label><input id="quote-quantity" name="quantity" type="number" min="1" step="1" required /></div><div><label htmlFor="quote-unit">Freight type *</label><select id="quote-unit" name="unit" required><option value="pallets">Pallets</option><option value="boxes">Boxes</option><option value="containers">Containers</option><option value="items">Other items</option></select></div></div>
      <fieldset className="pgl-frequency"><legend>Frequency *</legend><label><input type="radio" name="frequency" value="One-off" required defaultChecked /> One-off</label><label><input type="radio" name="frequency" value="Regular contract" /> Regular contract</label></fieldset>
      <div><label htmlFor="quote-timing">Preferred timing</label><input id="quote-timing" name="timing" maxLength={160} placeholder="Date or collection schedule" /></div>
      <div><label htmlFor="quote-details">Dimensions, weight and shipment details *</label><textarea id="quote-details" name="details" required rows={4} maxLength={2500} placeholder="Include dimensions, total weight and any handling requirements." /><p className="field-help">For lithium batteries or Class 9 cargo, include the product type and available documentation.</p></div>
      <p className="form-privacy">We use your details to respond to your enquiry. <Link reloadDocument to="/privacy">Privacy Policy</Link>.</p><button type="submit" className="button button--primary">Prepare quote request <Arrow /></button>
    </form></div>;
}
export function ContactPage() {
  const location = useLocation();
  return <><PageHero label="Contact & quote" title="Request a freight quote" description="One-off shipment or regular contract. Connect with the right operational team and start your quote." /><section className="pgl-section"><div className="container contact-layout"><aside className="contact-info"><h2>Direct to our team.</h2><div className="contact-block"><Icon name="truck" /><div><h3>Transport enquiries</h3><a href={`mailto:${transportEmail}`}>{transportEmail}</a><p>FBA, warehousing, road freight and dangerous goods.</p></div></div><div className="contact-block"><Icon name="globe" /><div><h3>Import enquiries</h3><a href={`mailto:${importEmail}`}>{importEmail}</a><p>International freight and customs documentation.</p></div></div><div className="pgl-contact-hours"><h3>Operational hours</h3><p>Office: {company.officeHours}<br />Warehouse: {company.warehouseHours}</p><p>ABN {company.abn}</p></div><div id="depots" className="pgl-depot-details"><h3>Our depots</h3><div><Icon name="pin" /><p><strong>Sydney</strong><br />{company.sydneyAddress}</p></div><div><Icon name="pin" /><p><strong>Melbourne</strong><br />Victoria</p></div><p>Contact our team for depot directions and delivery arrangements.</p></div><div className="pgl-contact-wechat"><img src="/assets/wechat-qr.png" width="135" height="136" alt="Phoenix WeChat contact QR code" /><div><h3>Connect on WeChat</h3><p>Scan for cross-border and international shipping enquiries.</p></div></div></aside><QuoteForm key={location.search} /></div></section></>;
}
export function TrackingPage() {
  const [search,setSearch] = useSearchParams();const reference = search.get('consignment') || '';
  const valid = /^[a-zA-Z0-9 _./-]{1,80}$/.test(reference) ? reference : '';
  const support = `mailto:${transportEmail}?subject=${encodeURIComponent(`Consignment enquiry${valid ? ': '+valid : ''}`)}`;
  return <><PageHero label="Track shipment" title="Track your shipment" description="Use your Transvirtual consignment number or the tracking link issued with your booking confirmation." /><section className="pgl-section"><div className="container pgl-two-column"><div className="pgl-inset"><Icon name="parcel" /><h2>Track shipment</h2><TrackingForm id="page-track" initialValue={valid} onTrack={ref=>setSearch({consignment:ref})} />{valid && !trackingDestination(valid) && <div className="pgl-tracking-support" role="status"><h3>Consignment {valid}</h3><p>Open the Transvirtual tracking link supplied with your booking to view shipment updates. If you need the link, contact our transport team with this reference.</p><a className="text-link" href={support}>Ask about this shipment <Arrow /></a></div>}<a className="text-link" href={company.clientLogin} target="_blank" rel="noreferrer">Transvirtual client login <Arrow /></a></div><div><h2>From depot to delivery.</h2><ol className="pgl-status-guide">{[['Depot-In','Freight received and scanned into the depot.'],['Sorting','Goods checked, sorted and allocated for their next move.'],['Out for Delivery','Freight dispatched for delivery.'],['Signed POD','Delivery signature recorded as proof of delivery.']].map(([title,text])=><li key={title}><h3>{title}</h3><p>{text}</p></li>)}</ol><div className="pgl-support-box"><h3>Need help with a consignment?</h3><p>For urgent enquiries, include your consignment number and shipment details.</p><a href={support}>{transportEmail}</a><p>Office hours: {company.officeHours}</p></div></div></div></section></>;
}
export function TermsPage() {
  return <><PageHero label="Terms of Carriage & Conditions" title="Terms for your shipment." description="Request the current Phoenix Global Logistics terms of carriage and service conditions before booking." /><section className="pgl-section"><div className="container prose"><h2>Request the current terms</h2><p>Contact the relevant operational team for the terms and conditions that apply to your freight service.</p><p><a className="text-link" href={`mailto:${transportEmail}?subject=Terms%20of%20carriage%20request`}>Transport terms <Arrow /></a></p><p><a className="text-link" href={`mailto:${importEmail}?subject=Service%20conditions%20request`}>Import service conditions <Arrow /></a></p></div></section></>;
}
