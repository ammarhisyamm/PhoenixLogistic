import { useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { Arrow, Button, Header, Footer } from './components';
import { importEmail, transportEmail } from './data';
import { pageCoverImage, pageMeta, siteOrigin } from './metadata';
import { ScrollMotion } from './ScrollMotion';
import { PageHero, Home, ServicePage, AboutPage, WhyPhoenixPage, ContactPage, TrackingPage, TermsPage } from './SitePages';

function PageBehaviour() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const meta = pageMeta(pathname);
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', meta.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', meta.description);
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', pageCoverImage(pathname));
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); }
    canonical.href = `${siteOrigin}${pathname}`;
    document.documentElement.lang = pathname.replace(/\/$/, '') === '/zh' ? 'zh-Hans' : 'en-AU';
    if (hash) requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
    else window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
}

function ChinesePage() {
  return <div lang="zh-Hans" className="chinese-page"><section className="chinese-hero"><img src="/assets/phoenix-road.webp" width="1774" height="887" alt="澳大利亚公路上的蓝色货运卡车" /><div className="container"><span className="section-index">PHOENIX GLOBAL LOGISTICS</span><h1>立足澳大利亚，<br /><span>连接您的物流需求。</span></h1><p>凤凰环球物流是一家澳大利亚家族企业，团队位于悉尼和墨尔本，为进口商、电商、零售商及国际合作伙伴提供货运与仓储协调服务。</p><a className="button button--primary" href={`mailto:${importEmail}`}>联系进口业务团队 <Arrow diagonal /></a></div></section><section className="section"><div className="container"><h2>从货物到港，到最终交付。</h2><p className="lede">通过澳大利亚本地运营及国际合作网络，衔接供应链的各个环节。</p><div className="values-grid">{[['国际货运', '空运、海运、进出口及清关协调服务。'],['仓储与配送', '收货、分拣、存储及后续配送安排。'],['亚马逊 FBA 物流', '支持入库货物的接收、处理及履约中心配送协调。']].map(([title,text])=><div key={title}><h3>{title}</h3><p>{text}</p></div>)}</div><div className="chinese-contact"><h3>与我们的团队沟通您的货运需求。</h3><a href={`mailto:${importEmail}`}>{importEmail}</a><Button to="/contact">Request a Quote in English <Arrow /></Button></div></div></section></div>;
}

function PrivacyPage() {
  return <><PageHero label="Website privacy" title="Your enquiry details." description="How information is handled by this website." /><section className="section"><div className="container prose"><h2>Quote enquiries</h2><p>The quote form prepares an email on your device. The website does not submit your form details to a server. Your enquiry reaches Phoenix when you send the prepared email using your email provider.</p><h2>Shipment support</h2><p>Consignment references entered into the tracking form appear in the page address and in a prepared email if you choose to request a tracking link. Enter only the shipment reference, not passwords or other account credentials.</p><h2>Your browser</h2><p>This website does not use advertising analytics or non-essential cookies. Fonts and website imagery are served with the website. Your hosting and email providers may process technical information as part of delivering their services.</p><h2>Contact Phoenix</h2><p>For questions about information you provide to our team, contact <a href={`mailto:${transportEmail}`}>{transportEmail}</a>.</p></div></section></>;
}


function NotFound() { return <section className="pgl-section"><div className="container"><h1>Page not found.</h1><p>Explore Phoenix services or return to the homepage.</p><Button to="/">Back to home <Arrow /></Button></div></section>; }
export default function App() {
 return <div id="top"><PageBehaviour /><ScrollMotion /><Header /><main id="main" tabIndex={-1}><Routes>
 <Route path="/" element={<Home />} /><Route path="/services/:slug" element={<ServicePage />} />
 <Route path="/why-phoenix" element={<WhyPhoenixPage />} /><Route path="/about" element={<AboutPage />} />
 <Route path="/contact" element={<ContactPage />} /><Route path="/tracking" element={<TrackingPage />} />
 <Route path="/privacy" element={<PrivacyPage />} /><Route path="/terms" element={<TermsPage />} />
 <Route path="/zh" element={<ChinesePage />} /><Route path="*" element={<NotFound />} />
 </Routes></main><Footer /></div>;
}
