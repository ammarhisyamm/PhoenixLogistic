// Client feedback round 1 (Brandon, 14 Nov): copy, photo and layout patches applied to the
// exported Figma tree before it renders. Keyed by Figma node id, or by layer name where the
// same layer repeats across pages (footer instances, proof numbers).
import { importEmail, transportEmail } from '../../src/data';

const card = name => `/option2/photos/${name}@1200.webp`;

// Copy changes by node id.
const text = {
  // Home: proof figures (client: ~1,200 containers and close to 1 million boxes a year).
  '192:831': '1,200+', '192:836': '960k+',
  '179:1250': '1,200+', '179:1255': '960k+',
  '208:596': '1,200+', '208:601': '960k+',
  // Home: the network section now tells the China to Australia story.
  '193:857': 'Connecting China with Australia.',
  '193:858': 'Supply-chain partners in China, and road coverage across practically all of Australia from Sydney and Melbourne.',
  '193:860': 'Talk to our team',
  // About: team card renamed.
  '108:280': 'Transport',
  // Why Phoenix: the Red Table step is removed, so the intro no longer names it.
  '113:439': 'Depot scans, careful checks and automated wrapping help identify preparation issues and protect freight before dispatch.',
};

// Layers hidden outright.
const hidden = new Set([
  '187:428', '192:812', // Amazon badge leaves the hero; it moves down the page
  '193:863',            // depot list, replaced by the network map
  '193:855',            // network title block: the globe section draws its own centred heading
  '198:556',            // static truck cut-out, replaced by the loading animation
  '252:406',            // small Our Values photo, replaced by the sticky photo panel
  '187:437',            // AI texture behind the quick tools card (round 6: no generated imagery)
]);

// Photo swaps (client: "change photo" on service rows and the related-services card).
const photo = {
  '109:285': card('warehouse-136'),   // About > Operations (was a cropped forklift shot)
  '109:287': card('rollers-04'),      // About > Transport
  // Round 6: no AI imagery. The desk shot on the tracking CTA and the Why/process panels
  // becomes a real photo from the Phoenix shoot.
  '158:398': card('warehouse-26'),
  '119:670': card('warehouse-100'),
  '119:688': card('warehouse-100'),
};

// Components rendered in place of, or after, a layer's own children.
const replace = {
  '191:764': 'home-about',  // Home About, rebuilt clean (round 6)
  '208:581': 'home-about',  // Why Phoenix About: same layout, its own photos
  '69:1497': 'quote-form',   // Contact: shorter quote form
  '129:308': 'ops-cards',    // Why Phoenix: contact operations as platform cards (round 6)
};
// Sections whose height changes with the new layouts; later sections move up or down to match.
const sectionHeight = { '187:477': 884 + 1100, '193:854': 1180, '187:446': 1110, '208:580': 1110 }; // Home services: room for the pinned sideways scroll (see SERVICES_PIN)
const after = {
  '193:854': 'network',        // Home network section: map on the right, places on the left
  '252:404': 'values-photo',   // About: Our Values photo and facts in the left column
  '62:893': 'stage-route',     // Tracking: truck moving through the four stages
  '198:545': 'truck-load',     // About: pallets loaded, curtain closes, truck drives off
  '61:153': 'include-pulse',   // Services: checklist status sits under the intro, not in the corner
  '187:477': 'services-pin',    // Home services: pin while the cards scroll sideways
  '209:445': 'related-hover',  // Services: hovering a related service makes it the large card
};

const emailSwap = {
  'transport@phoenixgloballogistics.com.au': transportEmail,
  'import@phoenixgloballogistics.com.au': importEmail,
};

function swapEmails(value) {
  if (!value) return value;
  return Object.entries(emailSwap).reduce((v, [from, to]) => v.replaceAll(from, to), value);
}

export function applyFeedback(tree, page) {
  function adapt(node) {
    const n = { ...node };
    if (text[n.id] != null) n.characters = text[n.id];
    n.characters = swapEmails(n.characters);
    // Home service cards: copy wraps to the card, not to hard breaks from the Figma file.
    if (n.id?.startsWith('323:') && n.characters) n.characters = n.characters.replace(/\n/g, ' ');
    if (hidden.has(n.id)) n.styles = { ...n.styles, visible: false };
    if (photo[n.id]) n.photoUrl = photo[n.id];
    if (replace[n.id]) n.custom = replace[n.id];
    if (after[n.id]) n.after = after[n.id];
    // Footer: services and operations columns make way for the conveyor animation.
    if (n.name === 'Footer / Services') n.custom = 'conveyor';
    if (n.name === 'Footer / Operations & tracking') n.styles = { ...n.styles, visible: false };
    // Melbourne depot address on the contact page.
    if (n.characters === 'Victoria' && page === 'contact') n.characters = 'Warehouse D, 5 Logic Court, Truganina VIC 3029';
    // Tracking: every stage card starts plain; the red fill only appears on hover.
    if (n.id === '62:903') n.plainCard = true;
    // Header: matte black bar, so the logo switches to the light version.
    if (n.name === 'Logo' && /Site header/.test(n.parentName || '')) { n.photoUrl = '/assets/phoenix-logo-light.png'; n.photoFit = 'FIT'; }
    if (n.children) n.children = n.children.map(c => adapt({ ...c, parentName: n.name }));
    return n;
  }
  const out = adapt(tree);
  resizeSections(out);
  // The hero film belongs to the home page; service pages show their own photo.
  if (page === 'home') out.heroVideo = true;
  return out;
}

function resizeSections(root) {
  const resized = root.children
    .filter(section => sectionHeight[section.id] != null && section.bounds)
    .map(section => ({ id: section.id, y: section.bounds.y, delta: sectionHeight[section.id] - section.bounds.height }));
  if (!resized.length) return;
  root.children = root.children.map(section => {
    const b = section.bounds;
    if (!b) return section;
    // Only layers below a resized section move; the fixed header (y 16) stays put.
    const shift = resized.filter(r => r.y < b.y).reduce((sum, r) => sum + r.delta, 0);
    const own = resized.find(r => r.id === section.id);
    return { ...section, bounds: { ...b, y: b.y + shift, height: b.height + (own ? own.delta : 0) } };
  });
  root.bounds = { ...root.bounds, height: root.bounds.height + resized.reduce((sum, r) => sum + r.delta, 0) };
}
