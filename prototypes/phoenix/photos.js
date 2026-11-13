// Every image the main site uses. Phoenix shoot photos exported from the Figma file live in
// /phoenix-prototype (with @1200 and @720 copies for cards); a few extra frames come from the
// Option 2 photo set so that every service page has its own pictures.
const P = '/phoenix-prototype/';
const O = '/option2/photos/';

// `src` is the full frame; `set` adds the smaller copies when they exist.
function img(file, sizes = { 720: true, 1200: true }, width = 2200) {
  const base = file.replace(/\.webp$/, '');
  const set = [sizes[720] && `${base}@720.webp 720w`, sizes[1200] && `${base}@1200.webp 1200w`, `${file} ${width}w`].filter(Boolean).join(', ');
  return { src: file, set };
}
const ph = (hash, sizes, width) => img(P + hash + '.webp', sizes, width);
const op = name => ({ src: O + name + '.webp', set: `${O}${name}@1200.webp 1200w, ${O}${name}.webp 2400w` });
const small = (hash, width) => ({ src: P + hash + '.webp', set: undefined, width });

export const logo = '/assets/phoenix-logo-sm.webp';
export const logoLight = '/assets/phoenix-logo-light-sm.webp';
export const footerLogo = '/assets/phoenix-logo-footer.webp';
export const wechatQr = P + 'a485409f0d78530d44d5ad3b329e6b01b6089637.png';
export const wechatQrFooter = '/assets/wechat-qr-sm.webp';

export const photos = {
  homeHero: ph('11958fb343cbe744ab8c83b8c8453915a2c3f1da'),
  toolsStrip: P + 'b5412d27a8d564954d2102a69a415143af0e8baa@1200.webp',
  aboutHome: ph('a4f5de75bd6c6d9945d9d1f2a9a65baba1157c36'),
  aboutBuilding: ph('d8b1a3477528c1eef1bdd725e52d2322d2862767', undefined, 1800),
  ctaRoad: ph('7e9fabec41c8fc5c4052f96779ee0264474129da'),
  ctaTracking: ph('0372be51480b7767b2e1eb99b2680753d578da82'),
  whyHero: ph('b9421ed653f48f7d5999583db3bac97cf2915bfc'),
  aboutHero: ph('09445c1e0faf987225a9c223d03627222f866cd0'),
  contactHero: ph('609ab62862a3dc41c582a4f7cd3be11fff895722'),
  trackingHero: ph('13ef57acee602a4df33245a6d724ff0a76d7e919'),
  truck: P + '7f38010dd7c664416537da721dc941cabedf88d3@1200.webp',
  teams: [
    ph('34e66e3fbda9b26073f83706d51f6319bd260293'),
    ph('540beaec06fb5157843343b5439c88135a35d508'),
    ph('28b01dff2b08985699bb0c58d90ae8eef01141cd'),
  ],
  process: [
    { ...ph('4d85808114abc8ade2ca8f331ae9b06759d4b656', { 720: true, 1200: true }, 1536), alt: 'Phoenix office team member preparing import documents' },
    { ...ph('f09eba6b3589f4d6964a6a4559e1b988fa44c4a7', { 720: true }, 1200), alt: 'Freight being scanned into the depot' },
    { ...ph('15c0fdc43f06d94ba59a23d5fe61092b5332bfa3', { 720: true, 1200: true }, 1536), alt: 'Cartons checked on the Phoenix Red Table' },
    { ...ph('81d48974de076fa323c0bec171cb26b4ae760fc4', { 720: true, 1200: true }, 1536), alt: 'Pallet secured on the automated stretch wrapper' },
    { ...ph('14353d44ed5f4fd552abc44caae391ccb481da60', { 720: true, 1200: true }, 1800), alt: 'Freight scanned out as a driver loads the truck' },
    { ...ph('f641228e5b140300fad613975d75eb214d81b54b', { 720: true, 1200: true }, 1536), alt: 'Driver collecting a signature for proof of delivery' },
  ],
};

// Per service: the card photo, the page banner, and the three "How we work" frames.
export const servicePhotos = {
  'amazon-fba-logistics': {
    card: ph('503aa3850698e287a9dca87e41d05bccbefe9839'),
    hero: ph('c2a6cd495373ea11d070f6cff4a9b6372bb7b89e'),
    work: [ph('bd7d667cee0809680af2e2817db835008ae32d77', { 720: true, 1200: true }, 1467), ph('b3ab78ec48e3b787f8a9ba314ea27df36f0cf5e8'), ph('a50ce265ae6860d6230f6ff0cfac148460331630', { 720: true, 1200: true }, 2100)],
  },
  'road-freight-and-transport': {
    card: ph('e51c78bfe1196e9dd033ef48d2dafd8f77ff2e98'),
    hero: op('rollers-05'),
    work: [op('rollers-03'), op('night-10'), op('warehouse-37')],
  },
  'warehousing-and-3pl': {
    card: ph('27b310a72862046a664cd4510c20b61101236d8d'),
    hero: op('warehouse-124'),
    work: [op('warehouse-58'), op('warehouse-146'), op('warehouse-87')],
  },
  'international-freight': {
    card: small('237f001444bbd2a050b5558bc3617018ba0e6115', 683),
    hero: { src: '/option2/generated/container-ship.webp', set: '/option2/generated/container-ship@1200.webp 1200w, /option2/generated/container-ship.webp 2400w' },
    work: [op('drone-05'), op('warehouse-145'), op('warehouse-33')],
  },
  'customs-clearance': {
    card: small('6877bc789d6e0b9857ad5d623390ded8f3173ecb', 1195),
    hero: op('warehouse-20'),
    work: [ph('4d85808114abc8ade2ca8f331ae9b06759d4b656', { 720: true, 1200: true }, 1536), op('warehouse-127'), op('warehouse-03')],
  },
  'dangerous-goods': {
    card: small('16692308f58e99c4ed6478bd6457921c0cc509a2', 854),
    hero: op('warehouse-45'),
    work: [op('warehouse-49'), op('warehouse-01'), op('rollers-01')],
  },
};
