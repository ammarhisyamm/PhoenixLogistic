import { services } from '../../src/data';
import { photos } from '../option2/photos';

// How-we-work photos: three different scenes per service, none repeating the page's cover photo (owner, round 4).
const card = name => `/option2/photos/${name}@1200.webp`;
const DETAIL_PHOTOS = {
  'amazon-fba-logistics': ['warehouse-109', 'drone-05', 'warehouse-139'],
  'warehousing-and-3pl': ['warehouse-81', 'warehouse-96', 'warehouse-131'],
  'road-freight-and-transport': ['rollers-02', 'night-08', 'night-11'],
  'international-freight': ['warehouse-10', 'drone-06', 'night-03'],
  'customs-clearance': ['warehouse-138', 'warehouse-127', 'warehouse-98'],
  'dangerous-goods': ['warehouse-87', 'warehouse-50', 'warehouse-37'],
};

const servicePaths = new Map(services.map(service => ['/services/' + service.slug, service]));

export function serviceForPath(path) {
  return servicePaths.get(path);
}

export function applyServiceTemplate(tree, service) {
  const amazon = service === services[0];
  const related = services.filter(item => item !== service).slice(0, 3);
  const text = {
    '61:432': service.title,
    '61:435': service.intro,
    '61:155': service.audience,
    '61:592': 'Explore our services',
    '209:448': related[0].title,
    ...Object.fromEntries(['61:454', '61:459', '61:484', '61:490'].map((id, index) => [id, service.includes[index]])),
    ...Object.fromEntries(['209:465', '209:476', '209:482'].map((id, index) => [id, service.details[index].title])),
    ...Object.fromEntries(['209:466', '209:477', '209:483'].map((id, index) => [id, service.details[index].text])),
  };
  if (!amazon) {
    ['61:439', '61:441', '61:443'].forEach((id, index) => { text[id] = service.tags[index]; });
  }
  const cover = photos.serviceHero[service.slug];
  // Each service gets its own three How-we-work photos (client asked for the repeated ones to change).
  const detailPhotos = (DETAIL_PHOTOS[service.slug] ?? []).map(card).concat(photos.serviceDetails[service.slug]).slice(0, 3);
  const images = {
    '209:446': photos.services[related[0].slug],
    '209:451': photos.services[related[1].slug],
    '209:453': photos.services[related[2].slug],
    '61:542': detailPhotos[0], '209:474': detailPhotos[1], '209:480': detailPhotos[2],
    ...(!amazon && { '61:96': cover }),
  };
  const links = Object.fromEntries(['209:446', '209:450', '209:452'].map((id, index) => [id, related[index]]));
  function adapt(node) {
    const item = links[node.id];
    return {
      ...node,
      characters: text[node.id] ?? node.characters,
      photoUrl: images[node.id],
      link: item ? '/services/' + item.slug : undefined,
      linkLabel: item?.title,
      children: node.children?.map(adapt),
    };
  }
  return adapt(tree);
}
