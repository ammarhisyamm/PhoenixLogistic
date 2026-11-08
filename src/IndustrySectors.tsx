import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Arrow, Icon } from './components';

const industries = [
  {
    id: 'retail', title: 'Retail', icon: 'warehouse', image: 'industry-retail',
    alt: 'Retail stock being checked and packed in a warehouse',
    heading: 'Stock receiving, storage and store distribution.',
    description: 'Warehouse processing and transport for replenishment freight and regular deliveries.',
    links: [{ slug: 'warehousing-and-3pl', label: 'Warehousing & 3PL' }, { slug: 'road-freight-and-transport', label: 'Road freight' }],
  },
  {
    id: 'ecommerce', title: 'E-commerce', icon: 'parcel', image: 'phoenix-quality',
    alt: 'A warehouse team member checking a parcel before dispatch',
    heading: 'From inventory arrival to order dispatch.',
    description: 'Pick, pack and ship support, with Amazon FBA preparation and inbound delivery when needed.',
    links: [{ slug: 'warehousing-and-3pl', label: 'Warehousing & 3PL' }, { slug: 'amazon-fba-logistics', label: 'Amazon FBA' }],
  },
  {
    id: 'renewables', title: 'Solar & renewable technology', icon: 'sun', image: 'industry-renewables',
    alt: 'Solar panels secured in transport racks alongside palletised equipment',
    heading: 'Storage and transport for renewable technology.',
    description: 'Warehouse and road freight support for solar-related products. Battery-related shipments are assessed before acceptance.',
    links: [{ slug: 'road-freight-and-transport', label: 'Road freight' }, { slug: 'dangerous-goods', label: 'Battery & Class 9 handling' }],
  },
  {
    id: 'fmcg', title: 'FMCG', icon: 'container', image: 'industry-fmcg',
    alt: 'Packaged consumer goods and secured cartons in a distribution warehouse',
    heading: 'Keep stock moving through the supply chain.',
    description: 'Receiving, storage and distribution for fast-moving consumer goods, connected with local and interstate transport.',
    links: [{ slug: 'warehousing-and-3pl', label: 'Warehousing & 3PL' }, { slug: 'road-freight-and-transport', label: 'Road freight' }],
  },
  {
    id: 'imports', title: 'International imports', icon: 'globe', image: 'phoenix-port',
    alt: 'Container handling and cargo operations at an Australian port',
    heading: 'Connect overseas freight with local distribution.',
    description: 'Air and sea freight coordination, customs documentation and onward warehousing, with established China–Australia trade connections.',
    links: [{ slug: 'international-freight', label: 'International freight' }, { slug: 'customs-clearance', label: 'Customs clearance' }],
  },
];

/** Sector navigation describes service fit; it does not assert client endorsements. */
export function IndustrySectors() {
  const [selected, setSelected] = useState(0);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const industry = industries[selected];
  return <section className="marketing-section phoenix-industry-feature" id="industries" aria-labelledby="industry-heading" data-home-section="industries">
    <div className="container">
      <div className="marketing-heading" data-reveal><h2 id="industry-heading">Industries we support</h2><p>Explore the logistics services that fit your products and supply chain.</p></div>
      <div className="industry-explorer" data-reveal>
        <div className="industry-tabs" role="tablist" aria-label="Industry sectors" aria-orientation="vertical">
          {industries.map((item, index) => <button key={item.id} ref={element => { buttons.current[index] = element; }} type="button" role="tab" id={`industry-tab-${item.id}`} aria-selected={index === selected} aria-controls="industry-panel" tabIndex={index === selected ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={event => {
            let next: number;
            if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % industries.length;
            else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + industries.length) % industries.length;
            else if (event.key === 'Home') next = 0;
            else if (event.key === 'End') next = industries.length - 1;
            else return;
            event.preventDefault(); setSelected(next); buttons.current[next]?.focus();
          }}><Icon name={item.icon} /><span>{item.title}</span></button>)}
        </div>
        <div className="industry-panel" role="tabpanel" id="industry-panel" aria-labelledby={`industry-tab-${industry.id}`} tabIndex={0}>
          <img key={industry.image} src={`/assets/${industry.image}.webp`} width="1536" height="1024" alt={industry.alt} loading="lazy" />
          <div className="industry-panel-copy"><h3>{industry.heading}</h3><p>{industry.description}</p><div className="industry-service-links">{industry.links.map(link => <Link key={link.slug} to={`/services/${link.slug}`}>{link.label}<Arrow /></Link>)}</div></div>
        </div>
      </div>
    </div>
  </section>;
}
