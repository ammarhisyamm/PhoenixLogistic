export type Service = {
  slug: string; title: string; shortTitle: string; icon: string; description: string;
  intro: string; tags: string[]; includes: string[]; image: string; imageAlt: string;
  audience: string; department: 'transport' | 'import'; details: { title: string; text: string }[];
};
export const transportEmail = 'transport@phoenixgloballogistics.com.au';
export const importEmail = 'import@phoenixgloballogistics.com.au';
export const company = {
  abn: '11 649 618 244', sydneyAddress: '1–7 Cavasinni Pl, Wetherill Park, NSW 2164', officeHours: '08:00–17:30', warehouseHours: '06:00–17:30',
  clientLogin: 'https://portal.transvirtual.com/Public/Home/Login',
};
export const trackingUrlTemplate = import.meta.env.VITE_TRANSVIRTUAL_TRACKING_URL || '';
export function trackingDestination(reference: string) {
  if (!trackingUrlTemplate.includes('{consignment}')) return null;
  try {
    const url = new URL(trackingUrlTemplate.replaceAll('{consignment}', encodeURIComponent(reference)));
    return url.protocol === 'https:' ? url.href : null;
  } catch { return null; }
}
export const services: Service[] = [
  {
    slug: 'amazon-fba-logistics', title: 'Amazon FBA inbound & prep', shortTitle: 'Amazon FBA', icon: 'parcel', department: 'transport',
    description: 'Container arrival, FBA preparation and delivery into Australian fulfilment centres.',
    intro: 'Approved Amazon inbound logistics, from container unloading and FNSKU labelling to pallet preparation, delivery slot booking and fulfilment-centre delivery.',
    tags: ['FBA preparation', 'Palletising', 'FC delivery'], image: 'phoenix-fba', imageAlt: 'Warehouse team unloading palletised cartons from a shipping container',
    includes: ['Container unloading and carton sorting', 'FBA palletising and FNSKU barcoding', 'Delivery slot booking and inbound documentation', 'Quality checks to help prevent damage and avoidable FC rejections'],
    audience: 'Amazon sellers, importers and overseas partners moving inventory into Australian fulfilment centres.',
    details: [{title:'Approved carrier',text:'Amazon Approved Carrier for small-parcel deliveries in NSW, QLD and VIC. Preparation and delivery follow the relevant Amazon inbound requirements.'},{title:'Built for volume',text:'Approximately 50 containers and 55,000 cartons processed monthly for Amazon-related operations.'},{title:'Inbound compliance',text:'Shipment identification, barcodes, pallet preparation and booking details are checked before dispatch to help prevent avoidable rejections.'}],
  },
  {
    slug: 'warehousing-and-3pl', title: 'Warehousing & 3PL distribution', shortTitle: 'Warehousing & 3PL', icon: 'warehouse', department: 'transport',
    description: 'Storage, inventory processing and pick, pack and ship from Sydney and Melbourne.',
    intro: 'Short- and long-term pallet storage, container devanning, inventory processing and distribution through our Sydney and Melbourne warehouse operations.',
    tags: ['Pallet storage', 'Pick & pack', 'Distribution'], image: 'phoenix-warehouse', imageAlt: 'Warehouse team checking palletised stock among storage racking',
    includes: ['Short- and long-term pallet storage', 'Pick, pack and ship', 'Inventory processing and distribution', 'Container devanning and freight receiving'],
    audience: 'Retailers, e-commerce businesses, importers and distributors needing hands-on warehouse support.',
    details:[{title:'Two Australian bases',text:'Warehouse operations in Sydney and Melbourne connect storage and processing with onward transport.'},{title:'Warehouse hours',text:'06:00–17:30. Office enquiries: 08:00–17:30.'},{title:'From receiving to distribution',text:'Goods are received, checked, sorted and prepared for storage, order fulfilment or dispatch.'}],
  },
  {
    slug:'road-freight-and-transport',title:'Road freight & interstate transport',shortTitle:'Road freight',icon:'truck',department:'transport',
    description:'Metro delivery, interstate transport and national linehaul, for LTL and FTL freight.',
    intro:'Connect local deliveries with interstate transport and national linehaul. Our owned fleet and contracted operator network support less-than-truckload and full-truckload requirements.',
    tags:['Metro delivery','LTL & FTL','Interstate'],image:'phoenix-road',imageAlt:'Blue freight truck travelling on an Australian highway',
    includes:['Metropolitan collection and delivery','Interstate transport and national linehaul','Less-than-truckload (LTL) and full-truckload (FTL)','Contracted transport for regular freight requirements'],
    audience:'Australian businesses moving pallets, cartons and regular freight between local and interstate destinations.',
    details:[{title:'Owned fleet',text:'12 vehicles: three vans, two small trucks and seven heavy vehicles. The wider network includes tautliner combinations.'},{title:'Additional capacity',text:'A contracted network of more than 20 operators supports freight movements as required.'},{title:'Shipment visibility',text:'Depot-in and depot-out scanning, consignment records and signed proof of delivery are supported through Transvirtual.'}],
  },
  {
    slug:'international-freight',title:'International air & sea freight',shortTitle:'International freight',icon:'globe',department:'import',
    description:'Air freight, FCL and LCL sea freight, with established China–Australia supply-chain connections.',
    intro:'Air and sea freight coordination, including full-container-load and less-than-container-load shipments. Established China trade connections link overseas consolidation with Australian warehousing and transport.',
    tags:['Air freight','FCL & LCL','China–Australia'],image:'phoenix-port',imageAlt:'Container ship and cranes at an Australian freight port',
    includes:['International air freight coordination','FCL and LCL sea freight coordination','China-to-Australia freight consolidation','Overseas partner coordination and Australian distribution'],
    audience:'Importers, exporters and international partners seeking an Australian logistics operation.',
    details:[{title:'China trade connections',text:'Established relationships in China support consolidation and shipment coordination into Australia.'},{title:'Air and sea options',text:'Shipment timing, size and destination guide the air freight, FCL or LCL requirements.'},{title:'Connected after arrival',text:'International movements connect with customs coordination, warehouse processing and local delivery.'}],
  },
  {
    slug:'customs-clearance',title:'Customs clearance & documentation',shortTitle:'Customs clearance',icon:'document',department:'import',
    description:'Import documentation, tariff compliance and biosecurity coordination for arriving freight.',
    intro:'Coordinate import paperwork, tariff requirements and biosecurity or quarantine processes with the relevant customs and clearance partners.',
    tags:['Import documents','Tariff requirements','Biosecurity'],image:'phoenix-customs',imageAlt:'Import logistics professional reviewing shipment documents at a warehouse office',
    includes:['Import documentation processing','Tariff compliance coordination','Biosecurity and quarantine coordination','Clearance coordination with the relevant partners'],
    audience:'Importers and international shippers preparing goods for arrival in Australia.',
    details:[{title:'Documentation first',text:'Import documents and shipment information are reviewed as part of office intake before incoming freight is processed.'},{title:'Coordinated clearance',text:'Our import team works with the relevant clearance partners on documentation and release requirements.'},{title:'Next-stage planning',text:'Released freight can connect with container handling, storage and Australian distribution.'}],
  },
  {
    slug:'dangerous-goods',title:'Dangerous goods handling',shortTitle:'Dangerous goods',icon:'hazard',department:'transport',
    description:'Handling for lithium batteries and selected Class 9 cargo, assessed before booking.',
    intro:'Battery-related products and selected Class 9 cargo require additional planning. Our team reviews the goods, documentation and transport requirements before confirming acceptance.',
    tags:['Lithium batteries','Class 9','Shipment assessment'],image:'phoenix-dangerous-goods',imageAlt:'Warehouse worker checking secured palletised battery cargo',
    includes:['Lithium battery and selected Class 9 shipment assessment','Review of product details and supplied documentation','Coordination of suitable handling and transport','Acceptance confirmation before collection or booking'],
    audience:'Businesses moving battery-related products or selected Class 9 cargo.',
    details:[{title:'Product assessment',text:'Send the product type, quantities, packaging details and available dangerous goods documentation.'},{title:'Handling requirements',text:'Accepted freight is planned around the relevant handling and transport standards.'},{title:'Confirm before collection',text:'Acceptance depends on the specific cargo and transport requirements. Contact the team before arranging a shipment.'}],
  },
];
export const legacyServiceSlugs: Record<string,string> = {
  'amazon-fba':'amazon-fba-logistics','warehousing-3pl':'warehousing-and-3pl','road-freight':'road-freight-and-transport',
  'container-handling':'warehousing-and-3pl','last-mile-delivery':'road-freight-and-transport',
};
export const qualitySteps = [
  {title:'Office intake',text:'Import documents and shipment information are prepared before freight arrives.',icon:'document'},
  {title:'Depot-in scan',text:'Incoming freight is unloaded, sorted and recorded against its consignment.',icon:'warehouse'},
  {title:'Phoenix Red Table',text:'Hands-on quality checks help identify handling and preparation issues.',icon:'parcel'},
  {title:'Wrap & prepare',text:'Automated stretch wrapping helps secure goods for their next move.',icon:'container'},
  {title:'Depot-out scan',text:'Dispatch movements are scanned as drivers load the freight.',icon:'truck'},
  {title:'Signed proof of delivery',text:'Customer signatures complete the delivery record in Transvirtual.',icon:'pin'},
];
export const sectors = ['Retail','E-commerce','Solar & renewable technology','FMCG','International imports'];
export const faqs = [
 {question:'What services does Phoenix provide?',answer:'Amazon FBA inbound and preparation, warehousing and 3PL distribution, road and interstate freight, international air and sea freight, customs clearance coordination and selected dangerous goods handling.'},
 {question:'Where are your operations based?',answer:'Our depots are in Sydney and Melbourne, supported by a wider Australian linehaul network and established supply-chain connections in China.'},
 {question:'How do I track my shipment?',answer:'Use the Transvirtual tracking link issued with your consignment. Your available scan updates and signed proof of delivery are linked to that shipment record.'},
 {question:'What do you need for a quote?',answer:'Your service type, origin and destination, pallet or box count, dimensions and weight, and whether the shipment is a one-off or a regular contract.'},
];
