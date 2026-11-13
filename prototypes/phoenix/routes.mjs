// Pages served by the main site app (prerendered at build time, then client-routed).
export const serviceSlugs = ['amazon-fba-logistics', 'warehousing-and-3pl', 'road-freight-and-transport', 'international-freight', 'customs-clearance', 'dangerous-goods'];

export const phoenixPaths = {
  home: '/',
  services: '/services/amazon-fba-logistics',
  tracking: '/tracking',
  contact: '/contact',
  about: '/about',
  why: '/why-phoenix',
};

export const phoenixRoutes = [...new Set([...Object.values(phoenixPaths), ...serviceSlugs.map(slug => `/services/${slug}`)])];
