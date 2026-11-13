import { createRoot, hydrateRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import '@fontsource-variable/oswald';
import '@fontsource/sawarabi-mincho/latin-400.css';
import '@fontsource/dm-serif-display/400.css';
import { App } from './app';
import './site.css';

// Old preview links (/?page=about) still land on the right page.
const url = new URL(location.href);
const legacy = { services: '/services/amazon-fba-logistics', tracking: '/tracking', contact: '/contact', about: '/about', why: '/why-phoenix', home: '/' };
if (url.searchParams.has('page') || url.searchParams.has('compare')) {
  const page = url.searchParams.get('page');
  if (legacy[page]) url.pathname = legacy[page];
  for (const key of ['page', 'compare', 'v']) url.searchParams.delete(key);
  history.replaceState(null, '', url);
}

// Every route is prerendered, so the client hydrates the existing markup: the first paint
// (and the hero image) never has to be replaced once scripts arrive.
const root = document.getElementById('root');
if (root?.firstElementChild) hydrateRoot(root, <App />);
else if (root) createRoot(root).render(<App />);
