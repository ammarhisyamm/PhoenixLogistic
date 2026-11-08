import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, CaretDown } from '@phosphor-icons/react';
import { company, importEmail, services, trackingDestination, transportEmail } from './data';

export function Arrow(_props: { diagonal?: boolean }) {
  return <ArrowRight className="arrow" size={18} weight="regular" aria-hidden="true" />;
}
export function Icon({ name, className = '' }: { name: string; className?: string }) {
  return <img className={`service-icon ${className}`} src={`/assets/icon-${name}.svg`} width="48" height="48" alt="" aria-hidden="true" />;
}
export function Button({ to, children, variant = 'primary', className = '' }: { to: string; children: ReactNode; variant?: 'primary' | 'secondary' | 'light' | 'outline-light'; className?: string }) {
  return <Link reloadDocument className={`button button--${variant} ${className}`} to={to}>{children}</Link>;
}
export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { setOpen(false); navRef.current?.querySelectorAll('details[open]').forEach(el => el.removeAttribute('open')); }, [location]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); navRef.current?.querySelectorAll('details[open]').forEach(el => el.removeAttribute('open')); if (open) toggleRef.current?.focus(); } };
    document.addEventListener('keydown', close); return () => document.removeEventListener('keydown', close);
  }, [open]);
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header pgl-header">
      <div className="container pgl-header-inner">
        <Link reloadDocument to="/" className="brand" aria-label="Phoenix Global Logistics home"><img src="/assets/phoenix-logo.png" width="94" height="80" alt="Phoenix Global Logistics" /></Link>
        <nav ref={navRef} id="primary-navigation" className={`pgl-navigation${open ? ' is-open' : ''}`} aria-label="Main navigation">
          <details className="pgl-service-menu"><summary>Services <CaretDown size={14} aria-hidden="true" /></summary><div className="pgl-service-dropdown">{services.map(service => <Link reloadDocument key={service.slug} to={`/services/${service.slug}`}><Icon name={service.icon} /><span>{service.title}{service.slug === 'dangerous-goods' && <small> Lithium Batteries & Class 9</small>}</span></Link>)}</div></details>
          <Link reloadDocument to="/why-phoenix">Why Phoenix</Link><Link reloadDocument to="/tracking">Track shipment</Link><Link reloadDocument to="/about">About us</Link><Link reloadDocument to="/contact">Contact</Link>
        </nav>
        <div className="pgl-header-actions"><Button to="/contact#quote-form">Request a quote <Arrow /></Button><button ref={toggleRef} type="button" className="pgl-menu-toggle" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}<span aria-hidden="true">{open ? '×' : '☰'}</span></button></div>
      </div>
    </header>
  </>;
}
export function TrackingForm({ initialValue = '', onTrack, id = 'tracking', compact = false }: { initialValue?: string; onTrack?: (value: string) => void; id?: string; compact?: boolean }) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  useEffect(() => setValue(initialValue), [initialValue]);
  function submit(event: FormEvent) {
    event.preventDefault(); const cleaned = value.trim();
    if (!/^[a-zA-Z0-9 _./-]{1,80}$/.test(cleaned)) { setError('Enter the consignment number from your booking confirmation.'); ref.current?.focus(); return; }
    setError(''); const destination = trackingDestination(cleaned);
    if (destination) { window.location.assign(destination); return; }
    if (onTrack) onTrack(cleaned); else navigate(`/tracking?consignment=${encodeURIComponent(cleaned)}`);
  }
  return <form className={`tracking-form${compact ? ' tracking-form--compact' : ''}`} onSubmit={submit} noValidate>
    <label htmlFor={`${id}-number`}>Consignment number</label><input ref={ref} id={`${id}-number`} name="consignment" placeholder="E.g. PGL000123456" value={value} onChange={e => {setValue(e.target.value);setError('');}} maxLength={80} autoComplete="off" aria-invalid={!!error} aria-describedby={`${id}-help`} />
    <p id={`${id}-help`} className={error ? 'field-error' : 'field-help'}>{error || 'Use the reference on your booking confirmation.'}</p>
    <button className="button button--primary" type="submit">Track shipment <Arrow /></button>
  </form>;
}
export function QuickTools() {
  const navigate = useNavigate();
  return <div className="pgl-utility-card">
    <div className="pgl-utility-panel"><div className="pgl-tool-heading"><Icon name="parcel" /><div><h2>Track your shipment</h2><p>Use your Transvirtual consignment number.</p></div></div><TrackingForm id="home-track" compact /><a className="text-link" href={company.clientLogin} target="_blank" rel="noreferrer">Transvirtual client login <Arrow /></a></div>
    <div className="pgl-utility-panel"><div className="pgl-tool-heading"><Icon name="truck" /><div><h2>Start your quote</h2><p>Tell us where your freight needs to go.</p></div></div><form className="pgl-quote-starter" onSubmit={event => {event.preventDefault();const data = new FormData(event.currentTarget);navigate(`/contact?from=${encodeURIComponent(String(data.get('from') || ''))}&to=${encodeURIComponent(String(data.get('to') || ''))}#quote-form`);}}><div className="form-row"><div><label htmlFor="quick-from">Origin</label><input id="quick-from" name="from" placeholder="Suburb or postcode" required maxLength={160} /></div><div><label htmlFor="quick-to">Destination</label><input id="quick-to" name="to" placeholder="Suburb or postcode" required maxLength={160} /></div></div><p className="field-help">For one-off shipments and regular work.</p><button className="button button--primary" type="submit">Request a quote <Arrow /></button></form></div>
  </div>;
}
export function CtaBand() {
  return <section className="pgl-cta"><div className="container pgl-cta-layout"><div><h2>Ready to request a quote?</h2><p>Send your origin, destination and freight details to our team.</p><div className="pgl-direct-contacts"><a href={`mailto:${transportEmail}`}>{transportEmail}</a><a href={`mailto:${importEmail}`}>{importEmail}</a></div></div><Button to="/contact#quote-form" variant="light">Request a quote <Arrow /></Button></div></section>;
}
export function Footer() {
  return <footer className="pgl-footer"><div className="container"><div className="pgl-footer-grid">
    <div className="pgl-footer-company"><Link reloadDocument to="/" aria-label="Phoenix Global Logistics home"><img src="/assets/phoenix-logo-light.png" width="112" height="96" alt="Phoenix Global Logistics" loading="lazy" /></Link><p>Australian family-owned logistics, with more than 20 years of cargo experience.</p><p>ABN {company.abn}</p></div>
    <div><h3>Services</h3>{services.map(s => <Link reloadDocument key={s.slug} to={`/services/${s.slug}`}>{s.title}</Link>)}</div>
    <div><h3>Operations & tracking</h3><Link reloadDocument to="/why-phoenix">Why Phoenix</Link><Link reloadDocument to="/tracking">Track shipment</Link><a href={company.clientLogin} target="_blank" rel="noreferrer">Transvirtual client login</a><Link reloadDocument to="/services/amazon-fba-logistics#carrier-credentials">Amazon carrier credentials</Link><Link reloadDocument to="/about">About us</Link><Link reloadDocument to="/contact#depots">Sydney & Melbourne depots</Link></div>
    <div><h3>Contact</h3><a href={`mailto:${transportEmail}`}>{transportEmail}</a><a href={`mailto:${importEmail}`}>{importEmail}</a><p>Office: {company.officeHours}<br />Warehouse: {company.warehouseHours}</p><a className="pgl-wechat-link" href="/assets/wechat-qr.png" target="_blank" rel="noreferrer"><img src="/assets/wechat-qr.png" width="80" height="80" alt="Phoenix WeChat QR code" loading="lazy" /><span>WeChat<br />Scan to connect</span></a></div>
  </div><div className="pgl-legal"><p>© {new Date().getFullYear()} Phoenix Global Logistics</p><div><Link reloadDocument to="/privacy">Privacy Policy</Link><Link reloadDocument to="/terms">Terms of Carriage & Conditions</Link></div></div></div></footer>;
}
