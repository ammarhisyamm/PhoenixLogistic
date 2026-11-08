import { useEffect, useLayoutEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import '@fontsource-variable/oswald';
import '@fontsource/sawarabi-mincho/latin-400.css';
import '@fontsource/dm-serif-display/400.css';
import { Design } from './design';
import { phoenixPaths } from './routes.mjs';
import './style.css';
import './motion.css';
import './polish.css';

const pages = import.meta.glob('./data/{home,services,tracking,contact,about,why}.json', { import: 'default' });
const url = new URL(location.href);
const path = url.pathname.replace(/\/$/, '') || '/';
const legacyPage = path === '/' && url.searchParams.get('page');
const page = Object.hasOwn(phoenixPaths, legacyPage)
  ? legacyPage
  : Object.keys(phoenixPaths).find(key => phoenixPaths[key] === path) || 'home';

if (url.searchParams.has('page') || url.searchParams.has('compare')) {
  url.pathname = phoenixPaths[page];
  for (const key of ['page', 'compare', 'v']) url.searchParams.delete(key);
  history.replaceState(null, '', url);
}

function App({ tree }) {
  const getScale = () => document.documentElement.clientWidth / 1440;
  const [scale, setScale] = useState(getScale);
  useLayoutEffect(() => {
    const resize = () => setScale(getScale());
    const observer = new ResizeObserver(resize);
    observer.observe(document.documentElement);
    resize();
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
    // Lift the loading screen once the hero photograph and fonts are ready.
    const heroImage = document.querySelector('.fig-hero > .paint-group img');
    const image = heroImage && !heroImage.complete ? new Promise(done => { heroImage.addEventListener('load', done, { once: true }); heroImage.addEventListener('error', done, { once: true }); }) : null;
    const timeout = new Promise(done => setTimeout(done, 2500));
    Promise.race([Promise.all([image, document.fonts?.ready]), timeout]).then(() => window.__phoenixReady?.());
  }, []);

  return <div className="prototype-shell" style={{ '--desktop-scale': scale }}>
    <div className="dispatch-progress" aria-hidden="true" />
    <Design tree={tree} page={page} />
  </div>;
}

const root = createRoot(document.getElementById('root'));
let active = true;
pages['./data/' + page + '.json']().then(tree => {
  if (active) root.render(<App tree={tree} />);
}).catch(() => {
  window.__phoenixReady?.();
  if (active) root.render(<p className="dispatch-loader" role="alert">The page could not load. <a href={location.href}>Try again</a></p>);
});
if (import.meta.hot) import.meta.hot.dispose(() => { active = false; root.unmount(); });
