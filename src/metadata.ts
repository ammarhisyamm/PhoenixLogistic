import { services } from './data';
import { pageCovers } from './pageCovers';

export const siteOrigin = import.meta.env.VITE_SITE_ORIGIN || 'https://phoenix-logistic.vercel.app';
export const staticPaths = ['/', ...services.map(service => `/services/${service.slug}`), '/about', '/why-phoenix', '/terms', '/contact', '/tracking', '/privacy', '/zh'];

export function pageCoverImage(path: string) {
  return `${siteOrigin}${pageCovers[path.replace(/\/$/, '') || '/']?.src || '/assets/phoenix-fleet.webp'}`;
}

export function pageMeta(path: string) {
  path = path.replace(/\/$/, '') || '/';
  const service = services.find(item => path === `/services/${item.slug}`);
  const pages: Record<string, {title: string; description: string}> = {
    '/': { title: 'Phoenix Global Logistics | National 3PL, road freight & Amazon FBA', description: 'Australian family-owned freight forwarding, road transport, warehousing and Amazon FBA logistics. Teams in Sydney and Melbourne.' },
    '/why-phoenix': { title: 'Why Phoenix | Fleet, quality & operations', description: 'Phoenix owned fleet, contracted transport network, Red Table quality checks, scanning and Transvirtual shipment visibility.' },
    '/terms': { title: 'Terms of Carriage & Conditions | Phoenix Global Logistics', description: 'Request current Phoenix Global Logistics terms of carriage and service conditions.' },
    '/about': { title: 'About Phoenix | Phoenix Global Logistics', description: 'Meet the Australian family-owned logistics business connecting freight, warehousing and delivery from Sydney and Melbourne.' },
    '/contact': { title: 'Request a Quote | Phoenix Global Logistics', description: 'Discuss your freight, warehousing or import requirements with the Phoenix team. Prepare an email enquiry for your next shipment.' },
    '/tracking': { title: 'Track shipment | Phoenix Global Logistics', description: 'Track Phoenix consignments through Transvirtual, understand delivery statuses and access shipment support.' },
    '/privacy': { title: 'Website privacy | Phoenix Global Logistics', description: 'How quote enquiries and shipment support information are handled by the Phoenix Global Logistics website.' },
    '/zh': { title: '凤凰环球物流 | 澳大利亚货运与仓储', description: '凤凰环球物流是一家澳大利亚家族企业，团队位于悉尼和墨尔本，提供国际货运、仓储与配送协调服务。' },
  };
  return service ? { title: `${service.title} | Phoenix Global Logistics`, description: service.description } : pages[path] || {title: 'Page not found | Phoenix Global Logistics', description: 'Find freight, warehousing and delivery services from Phoenix Global Logistics.'};
}
