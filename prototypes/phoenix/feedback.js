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
  '198:556',            // static truck cut-out, replaced by the loading animation
  '252:406',            // small Our Values photo, replaced by the sticky photo panel
]);

// Photo swaps (client: "change photo" on service rows and the related-services card).
const photo = {
  '109:285': card('warehouse-136'),   // About > Operations (was a cropped forklift shot)
  '109:287': card('rollers-04'),      // About > Transport
};

// Components rendered in place of, or after, a layer's own children.
const replace = {
  '69:1497': 'quote-form',   // Contact: shorter quote form
};
const after = {
  '193:854': 'network',        // Home network section: map on the right, places on the left
  '191:764': 'partner-panel',  // Home About: Amazon partner card in the empty left column
  '208:581': 'partner-panel',  // Why Phoenix About: same
  '62:893': 'stage-route',     // Tracking: truck moving through the four stages
  '198:545': 'truck-load',     // About: pallets loaded, curtain closes, truck drives off
  '252:404': 'values-photo',   // About: sticky photo for Our Values
  '61:450': 'include-pulse',   // Services: live checklist accent
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
  if (page === 'home' || page === 'services') out.heroVideo = true;
  return out;
}
