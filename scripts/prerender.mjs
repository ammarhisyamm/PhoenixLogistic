import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import { createElement } from 'react';
import { phoenixPaths } from '../prototypes/phoenix/routes.mjs';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

try {
  const { render, pageCoverImage, pageMeta, siteOrigin, staticPaths } = await server.ssrLoadModule('/src/prerender.tsx');
  const phoenixTemplate = await readFile('dist/index.html', 'utf8');
  const legacyTemplate = await readFile('dist/legacy.html', 'utf8');
  const phoenixRoutes = new Set(Object.values(phoenixPaths));
  for (const route of [...staticPaths, '/404']) {
    const meta = pageMeta(route);
    let html = (phoenixRoutes.has(route) ? phoenixTemplate : legacyTemplate)
      .replace('<html lang="en-AU">', `<html lang="${route === '/zh' ? 'zh-Hans' : 'en-AU'}">`)
      .replace(/<title>.*?<\/title>/, `<title>${escape(meta.title)}</title>`)
      .replace(/<meta name="description" content="[^"]*"\s*\/?\s*>/, `<meta name="description" content="${escape(meta.description)}" />`)
      .replace(/<meta property="og:title" content="[^"]*"\s*\/?\s*>/, `<meta property="og:title" content="${escape(meta.title)}" />`)
      .replace(/<meta property="og:description" content="[^"]*"\s*\/?\s*>/, `<meta property="og:description" content="${escape(meta.description)}" />`)
      .replace(/<meta property="og:image" content="[^"]*"\s*\/?\s*>/, `<meta property="og:image" content="${escape(pageCoverImage(route))}" />`);
    if (!phoenixRoutes.has(route)) {
      html = html.replace('<div id="root"></div>', `<div id="root" data-prerender-path="${route}">${render(route)}</div>`);
    }
    const extraHead = route === '/404' ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${siteOrigin}${route === '/' ? '/' : route}" /><meta property="og:url" content="${siteOrigin}${route}" />`;
    html = html.replace('</head>', `${extraHead}</head>`);
    const filename = route === '/404' ? 'dist/404.html' : route === '/' ? 'dist/index.html' : path.join('dist', route.slice(1), 'index.html');
    await mkdir(path.dirname(filename), { recursive: true });
    await writeFile(filename, html);
    // Support hosts that resolve clean paths using either .html files or directory indexes.
    if (route !== '/' && route !== '/404') await writeFile(path.join('dist', `${route.slice(1)}.html`), html);
  }
  await unlink('dist/legacy.html');
  const urls = staticPaths.filter(route => route !== '/privacy' && route !== '/tracking');
  await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(route=>`  <url><loc>${siteOrigin}${route}</loc></url>`).join('\n')}\n</urlset>\n`);
  await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${siteOrigin}/sitemap.xml\n`);
  // Prerender each Option 2 route so its content is available on direct visits.
  const option2 = await readFile('dist/option-2/index.html', 'utf8');
  const { renderToString } = await import('react-dom/server');
  const { App: Option2App } = await server.ssrLoadModule('/prototypes/option2/main.jsx');
  // React 19 prepends <link rel="preload"> hints for images to the markup; inside #root they would
  // break hydration, so they are dropped (the hero image carries fetchpriority="high" instead).
  const option2Page = route => {
    const body = renderToString(createElement(Option2App, { url: '/option-2' + (route ? '/' + route : '') })).replace(/^(<link [^>]*\/>)+/, '');
    const html = option2.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
    if (route !== 'privacy' && route !== 'terms') return html;
    const meta = pageMeta('/' + route);
    return html.replace(/<title>.*?<\/title>/, `<title>${escape(meta.title)}</title>`)
      .replace('</head>', `<meta name="description" content="${escape(meta.description)}" /></head>`);
  };
  await writeFile('dist/option-2/index.html', option2Page(''));
  const option2Routes = ['services', 'why-phoenix', 'about', 'contact', 'tracking', 'privacy', 'terms', ...['amazon-fba-logistics', 'warehousing-and-3pl', 'road-freight-and-transport', 'international-freight', 'customs-clearance', 'dangerous-goods'].map(slug => `services/${slug}`)];
  for (const route of option2Routes) {
    await mkdir(path.join('dist/option-2', route), { recursive: true });
    const html = option2Page(route);
    await writeFile(path.join('dist/option-2', route, 'index.html'), html);
    await writeFile(path.join('dist/option-2', `${route}.html`), html);
  }
  console.log(`Prerendered ${staticPaths.length} pages, a 404 page and sitemap.`);
} finally {
  await server.close();
}
