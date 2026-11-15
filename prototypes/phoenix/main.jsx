import { useLayoutEffect } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import '@fontsource-variable/inter/wght.css';
import '@fontsource-variable/oswald';
import '@fontsource/sawarabi-mincho/latin-400.css';
import '@fontsource/dm-serif-display/400.css';
import { Design } from './design';
import { phoenixPaths } from './routes.mjs';
import { photos } from '../option2/photos';
import { applyServiceTemplate, serviceForPath } from './service-template';
import './style.css';
import './motion.css';
import './polish.css';
import './experience.css';
import './mobile.css';

const pages = import.meta.glob('./data/{home,services,tracking,contact,about,why}.json', { import: 'default' });
export function designPageForPath(path) {
  if (serviceForPath(path)) return 'services';
  return Object.keys(phoenixPaths).find(key => phoenixPaths[key] === path);
}

export async function loadDesign(page, path) {
  const tree = await pages['./data/' + page + '.json']();
  if (page === 'services') return applyServiceTemplate(tree, serviceForPath(path ?? phoenixPaths.services));
  if (page !== 'why') return tree;
  return {
    ...tree,
    children: tree.children.map(section => section.name === 'Banner'
      ? { ...section, photoUrl: photos.why, responsivePhoto: true }
      : section),
  };
}

export function App({ tree, page, path }) {
  useLayoutEffect(() => {
    if (!location.hash || performance.getEntriesByType('navigation')[0]?.type === 'back_forward') return;
    document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
  }, []);

  return <div className="prototype-shell">
    <Design tree={tree} page={page} path={path} />
  </div>;
}

if (typeof document !== 'undefined') {
  const url = new URL(location.href);
  const path = url.pathname.replace(/\/$/, '') || '/';
  const legacyPage = path === '/' && url.searchParams.get('page');
  const page = Object.hasOwn(phoenixPaths, legacyPage)
    ? legacyPage
    : designPageForPath(path) || 'home';

  if (url.searchParams.has('page') || url.searchParams.has('compare')) {
    url.pathname = legacyPage ? phoenixPaths[page] : path;
    for (const key of ['page', 'compare', 'v']) url.searchParams.delete(key);
    history.replaceState(null, '', url);
  }
  const container = document.getElementById('root');
  let root;
  let active = true;
  loadDesign(page, legacyPage ? undefined : path).then(tree => {
    if (!active) return;
    const app = <App tree={tree} page={page} path={path} />;
    if (container.dataset.phoenixRoute === path) {
      root = hydrateRoot(container, app);
    } else {
      root = createRoot(container);
      root.render(app);
    }
  }).catch(() => {
    if (active && !container.hasChildNodes()) createRoot(container).render(<p role="alert">The page could not load. <a href={location.href}>Try again</a></p>);
  });
  if (import.meta.hot) import.meta.hot.dispose(() => { active = false; root?.unmount(); });
}
