import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import '@fontsource-variable/oswald';
import '@fontsource/sawarabi-mincho/latin-400.css';
import '@fontsource/dm-serif-display/400.css';
import { Design } from './design';
import { phoenixPaths } from './routes.mjs';
import './style.css';
import './motion.css';
import './experience.css';
import { startExperience } from './experience.js';

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
  useEffect(() => {
    // The artboard scales to the window width; --vw is the layout width in artboard pixels (used by the fixed header).
    const measure = () => {
      const width = document.documentElement.clientWidth, next = getScale();
      document.documentElement.style.setProperty('--vw', width / next + 'px');
      setScale(next);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  useEffect(() => startExperience(), []);
  useEffect(() => {
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }, []);

  return <div className="prototype-shell" style={{ '--desktop-scale': scale }}>
    <Design tree={tree} page={page} />
  </div>;
}

const root = createRoot(document.getElementById('root'));
let active = true;
pages['./data/' + page + '.json']().then(tree => {
  if (active) root.render(<App tree={tree} />);
}).catch(() => {
  if (active) root.render(<p className="dispatch-loader" role="alert">The page could not load. <a href={location.href}>Try again</a></p>);
});
if (import.meta.hot) import.meta.hot.dispose(() => { active = false; root.unmount(); });
