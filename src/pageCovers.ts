export type PageCover = { src: string; alt: string; position?: string };

export const pageCovers: Record<string, PageCover> = {
  "/": { src: '/assets/cover-home.webp', alt: "Phoenix freight truck leaving a warehouse loading bay", position: '60% center' },
  "/why-phoenix": { src: '/assets/cover-why-phoenix.webp', alt: "Warehouse operator scanning a carton at a red inspection bench", position: '65% center' },
  "/about": { src: '/assets/cover-about.webp', alt: "Phoenix logistics colleagues coordinating a work schedule at the depot", position: '72% center' },
  "/tracking": { src: '/assets/cover-tracking.webp', alt: "Dispatcher matching a parcel barcode with a digital shipment record", position: '65% center' },
  "/services/amazon-fba-logistics": { src: '/assets/cover-amazon-fba.webp', alt: "Warehouse worker applying a barcode label to an inbound carton", position: '65% center' },
  "/services/warehousing-and-3pl": { src: '/assets/cover-warehousing.webp', alt: "Organised pallet storage aisles in a 3PL warehouse", position: '65% center' },
  "/services/road-freight-and-transport": { src: '/assets/cover-road-freight.webp', alt: "Blue Phoenix curtainsider travelling through Australian countryside", position: '65% center' },
  "/services/international-freight": { src: '/assets/cover-international-freight.webp', alt: "Container ship and quay cranes at an Australian freight port", position: '65% center' },
  "/services/customs-clearance": { src: '/assets/cover-customs.webp', alt: "Import coordinator reviewing shipment documents", position: '65% center' },
  "/services/dangerous-goods": { src: '/assets/cover-dangerous-goods.webp', alt: "Worker checking protective packaging for battery-related freight", position: '65% center' },
  "/contact": { src: '/assets/cover-contact.webp', alt: "Phoenix operations coordinator taking a shipment enquiry", position: '65% center' },
  "/privacy": { src: '/assets/cover-privacy.webp', alt: "Organised document folders and a closed laptop at a depot office", position: '65% center' },
  "/terms": { src: '/assets/cover-terms.webp', alt: "Freight paperwork and a sealed carton at a dispatch counter", position: '65% center' },
};
