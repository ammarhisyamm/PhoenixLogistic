import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/oswald';
import '@fontsource-variable/inter';
import './tokens.css';
import './styles.css';
import './structure.css';
import './marketing.css';
import App from './App';

const root = document.getElementById('root')!;
const app = <React.StrictMode><BrowserRouter><App /></BrowserRouter></React.StrictMode>;
// Query-prefilled forms must initialise from the visitor's URL rather than the static page.
const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
if (root.hasChildNodes() && root.dataset.prerenderPath === currentPath && !window.location.search) ReactDOM.hydrateRoot(root, app);
else ReactDOM.createRoot(root).render(app);
