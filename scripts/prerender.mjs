import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

try {
  const { render, pageCoverImage, pageMeta, siteOrigin, staticPaths } = await server.ssrLoadModule('/src/prerender.tsx');
  const template = await readFile('dist/index.html', 'utf8');
  for (const route of [...staticPaths, '/404']) {
    const meta = pageMeta(route);
    let html = template
      .replace('<html lang="en-AU">', `<html lang="${route === '/zh' ? 'zh-Hans' : 'en-AU'}">`)
      .replace(/<title>.*?<\/title>/, `<title>${escape(meta.title)}</title>`)
      .replace(/<meta name="description" content="[^"]*"\s*\/?\s*>/, `<meta name="description" content="${escape(meta.description)}" />`)
      .replace(/<meta property="og:title" content="[^"]*"\s*\/?\s*>/, `<meta property="og:title" content="${escape(meta.title)}" />`)
      .replace(/<meta property="og:description" content="[^"]*"\s*\/?\s*>/, `<meta property="og:description" content="${escape(meta.description)}" />`)
      .replace(/<meta property="og:image" content="[^"]*"\s*\/?\s*>/, `<meta property="og:image" content="${escape(pageCoverImage(route))}" />`)
      .replace('<div id="root"></div>', `<div id="root" data-prerender-path="${route}">${render(route)}</div>`);
    const extraHead = route === '/404' ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${siteOrigin}${route === '/' ? '/' : route}" /><meta property="og:url" content="${siteOrigin}${route}" />`;
    html = html.replace('</head>', `${extraHead}</head>`);
    const filename = route === '/404' ? 'dist/404.html' : route === '/' ? 'dist/index.html' : path.join('dist', route.slice(1), 'index.html');
    await mkdir(path.dirname(filename), { recursive: true });
    await writeFile(filename, html);
    // Support hosts that resolve clean paths using either .html files or directory indexes.
    if (route !== '/' && route !== '/404') await writeFile(path.join('dist', `${route.slice(1)}.html`), html);
  }
  const urls = staticPaths.filter(route => route !== '/privacy' && route !== '/tracking');
  await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(route=>`  <url><loc>${siteOrigin}${route}</loc></url>`).join('\n')}\n</urlset>\n`);
  await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${siteOrigin}/sitemap.xml\n`);
  console.log(`Prerendered ${staticPaths.length} pages, a 404 page and sitemap.`);
} finally {
  await server.close();
}
