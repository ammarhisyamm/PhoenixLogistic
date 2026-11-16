// Every photograph option 2 uses, from the Phoenix PGL Drive shoot
// (public/option2/photos). Large frames use the 2400px file, cards the 1200px one.
const big = name => `/option2/photos/${name}.webp`;
const card = name => `/option2/photos/${name}@1200.webp`;
const ai = name => `/option2/generated/${name}@1200.webp`;

export const photos = {
  hero: big('drone-01'),
  heroAlt: 'Golden-hour aerial over the western Sydney industrial estate where Phoenix operates',
  aerial: big('drone-05'),
  aerialAlt: 'Top-down aerial of a distribution yard with rows of trailers at the docks',
  night: big('night-08'),
  fleet: card('rollers-01'),
  warehouse: card('warehouse-124'),
  quality: card('warehouse-01'),
  team: card('warehouse-136'),
  teamAlt: 'Two Phoenix staff in hi-vis vests checking rack labels',
  ops: card('warehouse-127'),
  why: big('drone-07'),
  about: big('warehouse-58'),
  contact: big('warehouse-144'),
  tracking: big('rollers-02'),
  services: {
    'amazon-fba-logistics': card('warehouse-33'),
    'warehousing-and-3pl': card('warehouse-124'),
    'road-freight-and-transport': card('rollers-05'),
    'international-freight': card('warehouse-145'),
    'customs-clearance': card('warehouse-20'),
    'dangerous-goods': card('warehouse-45'),
  },
  serviceDetails: {
    'amazon-fba-logistics': [card('warehouse-109'), card('drone-05'), card('warehouse-139')],
    'warehousing-and-3pl': [card('warehouse-124'), card('warehouse-85'), card('warehouse-142')],
    'road-freight-and-transport': [card('rollers-03'), card('night-08'), card('rollers-01')],
    'international-freight': [card('warehouse-10'), card('drone-06'), card('night-03')],
    'customs-clearance': [card('warehouse-20'), card('warehouse-22'), card('warehouse-136')],
    'dangerous-goods': [card('warehouse-45'), card('warehouse-50'), card('warehouse-37')],
  },
  serviceHero: {
    'amazon-fba-logistics': big('warehouse-33'),
    'warehousing-and-3pl': big('warehouse-70'),
    'road-freight-and-transport': big('rollers-06'),
    'international-freight': big('warehouse-76'),
    'customs-clearance': big('warehouse-104'),
    'dangerous-goods': big('warehouse-54'),
  },
  // Red Table step removed (client feedback); depot-out uses a full-frame loading shot.
  whySteps: [card('warehouse-16'), card('warehouse-11'), card('warehouse-02'), card('warehouse-41'), card('night-10')],
  teams: [card('warehouse-81'), card('warehouse-101'), card('rollers-04'), card('warehouse-127')],
  steps: [card('warehouse-20'), card('warehouse-03'), card('warehouse-45'), card('warehouse-73'), card('rollers-01')],
  sectors: { Retail: card('warehouse-85'), 'E-commerce': card('warehouse-69'), 'Solar & renewable technology': card('drone-04'), FMCG: card('warehouse-14'), 'International imports': card('warehouse-144') },
  depots: { Sydney: card('warehouse-58'), Melbourne: card('warehouse-124'), China: card('warehouse-145') },
};
