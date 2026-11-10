import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { pageCovers } from './pageCovers';

export function PageCoverHero({ label, title, description, children, service = false }: { label: string; title: string; description: string; children?: ReactNode; service?: boolean }) {
  const { pathname } = useLocation();
  const cover = pageCovers[pathname.replace(/\/$/, '') || '/'];
  const compact = pathname === '/privacy' || pathname === '/terms';
  return <section className={`brand-cover-hero${compact ? ' brand-cover-hero--compact' : ''}${!cover ? ' brand-cover-hero--plain' : ''}`} data-cover-path={pathname}>
    {cover && <img className="brand-cover-image" src={cover.src} width="1600" height="800" style={{objectPosition: cover.position}} alt={cover.alt} fetchPriority="high" />}
    <div className="container brand-cover-content">
      <nav className="breadcrumb" aria-label="Breadcrumb"><Link reloadDocument to="/">Home</Link><span aria-hidden="true">/</span>{service && <><Link reloadDocument to="/#services">Services</Link><span aria-hidden="true">/</span></>}<span aria-current="page">{label}</span></nav>
      <div className="brand-cover-copy"><h1>{title}</h1><p>{description}</p>{children}</div>
    </div>
  </section>;
}
