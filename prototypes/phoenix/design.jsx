import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { List, X } from '@phosphor-icons/react';
import { company, importEmail, services, trackingDestination, transportEmail } from '../../src/data';
import assets from './data/assets.json';
import paints from './data/paints.json';
import process from './data/process.json';
import { photos } from '../option2/photos';
import { serviceIcons } from '../option2/icons';
import { ArrowUpRight } from '@phosphor-icons/react';
import { phoenixPaths } from './routes.mjs';
import { usePageMotion } from './motion';
import { FeedbackPart, HeroVideo } from './feedback-ui';

const link = (page, params = {}) => {
 const query = new URLSearchParams(params).toString();
 return phoenixPaths[page] + (query ? '?' + query : '');
};
const assetURL = file => file.startsWith('/') ? file : '/phoenix-prototype/' + file;
const searchParams = () => new URLSearchParams(typeof location === 'undefined' ? '' : location.search);
const State = createContext(null);
const px = n => n+'px';
const rgb = (c,opacity=1) => typeof c==='string' ? 'color-mix(in srgb,'+c+' '+opacity*100+'%, transparent)' : 'rgba('+[c.r*255,c.g*255,c.b*255,(c.a??1)*opacity].join(',')+')';
const kids = n => (n?.children??[]).filter(c=>c.styles?.visible!==false);
const words = n => n?.characters ?? kids(n).map(words).join(' ').trim();
const normalized = (s='') => s.toLowerCase().replace(/[’']/g,'').replace(/\s+/g,' ').trim();
// Serif display faces read like a cookbook to the client; headings use a bold sans instead.
const serif = f => /DM Serif|Sawarabi/.test(f||'');
// Owner (round 6): one family, Geist, and nothing heavier than semibold.
const font = f => 'Geist Variable';
const weight = s => /semi|bold/i.test(s)?600:/medium/i.test(s)?500:400;
// Body sizes snap to one scale: 12 legal · 14 small · 16 body · 18 lead.
const textSize = n => n >= 24 || !n ? n : n <= 12 ? 12 : n <= 14 ? 14 : n <= 16 ? 16 : 18;
const textLeading = n => n >= 24 ? null : n <= 12 ? '18px' : n <= 14 ? '22px' : n <= 16 ? '26px' : '29px';
const isVector = n => /^(VECTOR|BOOLEAN_OPERATION|LINE|POLYGON|STAR)$/.test(n.type);

function gradient(p,w,h){
 const [a,b,c]=p.gradientTransform[0];
 const u=a/w,v=b/h,dist=Math.abs(u)*w+Math.abs(v)*h;
 if(!dist)return;
 const origin=c+Math.min(0,u*w)+Math.min(0,v*h);
 return 'linear-gradient('+Math.atan2(u,-v)*180/Math.PI+'deg,'+p.gradientStops.map(s=>rgb(s.color)+' '+100*(s.position-origin)/dist+'%').join(',')+')';
}

function Paint({p,b,eager}){
 if(p.visible===false)return null;
 if(p.type==='SOLID')return <span className="paint" style={{background:rgb(p.color,p.opacity)}}/>;
 if(p.type==='GRADIENT_LINEAR')return <span className="paint" style={{background:gradient(p,b.width,b.height),opacity:p.opacity??1}}/>;
 const asset=p.url ? { file: p.url } : assets[p.imageHash];
 if(p.type!=='IMAGE'||!asset)return null;
 const srcSet = p.responsive
   ? [640, 1200].map(width => asset.file.replace(/\.webp$/, '@'+width+'.webp')+' '+width+'w').concat(asset.file+' 2400w').join(', ')
   : undefined;
 const m=p.imageTransform;
 let style={objectFit:p.scaleMode==='FIT'?'contain':'cover'};
 if(p.scaleMode==='CROP'&&m&&!m[0][1]&&!m[1][0]){
   const [[x,,dx],[,y,dy]]=m;
   style={width:100/x+'%',height:100/y+'%',left:-100*dx/x+'%',top:-100*dy/y+'%',objectFit:'cover'};
 }
 const f=p.filters??{};
 style.filter='brightness('+(1+(f.exposure||0)*.55)+') saturate('+(1+(f.saturation||0)*.7)+') contrast('+(1+(f.contrast||0)*.55)+')';
 return <span className="paint image-paint" style={{opacity:p.opacity??1}}>
   <img src={assetURL(asset.file)} srcSet={srcSet} sizes={srcSet?'100vw':undefined} alt="" width={asset.width} height={asset.height} draggable="false" style={style} loading={eager?'eager':'lazy'} fetchPriority={eager&&b.width>1000?'high':undefined}/>
 </span>;
}

function buttonVariant(fills,onDark){
 const solid=fills.find(p=>p.type==='SOLID');
 if(!solid||(solid.opacity??1)<.2)return onDark?'ghost-dark':'ghost';
 const c=typeof solid.color==='string'?solid.color.toLowerCase():'#'+['r','g','b'].map(k=>Math.round(solid.color[k]*255).toString(16).padStart(2,'0')).join('');
 const [r,g,b]=[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));
 if(r>180&&g<80&&b<80)return 'primary';
 if(r+g+b<200)return 'dark';
 return 'light';
}

function hrefFor(value,name,page){
 const v=normalized(value);
 if(/^[\w.]+@[\w.]+$/.test(v))return 'mailto:'+v;
 if(v.includes('client login'))return company.clientLogin;
 if(/^(get a quote|request a quote|contact|contact us|get started|lets get started|contact our depots)$/.test(v))return link('contact');
 if(/^(track|track shipment|track a shipment)$/.test(v))return link('tracking');
 if(v==='why phoenix')return link('why');
 if(/^(about|about us|about phoenix)$/.test(v))return link('about');
 if(v==='view services'||(v==='explore our services'&&page==='services'))return '/#services';
 if(/^(services|explore our services)$/.test(v))return page==='home'&&name!=='Services'?'#services':link('services');
 if(v==='privacy policy')return '/privacy';
 if(v.startsWith('terms of carriage'))return '/terms';
 if(v.startsWith('customs clearance'))return '/services/customs-clearance';
 if(/carrier credentials/.test(v))return link('services')+'#carrier-credentials';
 if(/sydney & melbourne depots/.test(v))return link('contact')+'#depots';
 if(name==='Logo')return link('home');
 const service=services.find(s=>[normalized(s.title),normalized(s.shortTitle)].includes(v));
 if(service)return service.slug==='amazon-fba-logistics'?link('services'):'/services/'+service.slug;
}

function findServiceLink(n,page){
 for(const c of kids(n)){
  if(c.characters){const href=hrefFor(c.characters,c.name,page);if(href)return href;}
  else{const href=findServiceLink(c,page);if(href)return href;}
 }
}

const anchors = {
 '187:477': 'services', '69:1497': 'quote-form', '187:441': 'shipment-tools-panel',
 '179:1245': 'carrier-credentials', '66:952': 'depots', '113:434': 'quality-process',
};
const trackForms=new Set(['187:441','61:858','127:276']);
const trackButtons=new Set(['187:444','61:862','127:279']);
const fieldNames={'187:442':'consignment','61:861':'consignment','127:277':'consignment','67:1063':'name','67:1064':'company','67:1089':'email','67:1090':'phone','67:1133':'service','67:1188':'from','67:1189':'to','67:1202':'quantity','67:1203':'weight','67:1321':'date','67:1343':'details'};

function Field({name,node,parent}){
 const label=words(kids(parent).find(n=>n.name==='Label'));
 const attr={name,'aria-label':label || (name==='consignment'?'Consignment number':name),required:label.includes('*')||name==='consignment'};
 const input = useRef(null);
 useLayoutEffect(() => {
   const value = searchParams().get(name);
   if (value && input.current && !input.current.value) input.current.value = value;
 }, [name]);
 const placeholder=({
   from:'Origin suburb or postcode',
   to:'Destination suburb or postcode',
   quantity:'Number of pallets or boxes',
   weight:'E.g. palletised freight or cartons',
   details:'Include dimensions, total weight and any handling requirements.',
 })[name]||words(node);
 if(name==='service')return <select {...attr} defaultValue=""><option value="" disabled>Choose a service</option>{services.map(s=><option key={s.slug} value={s.slug}>{s.title}</option>)}</select>;
 if(name==='details')return <textarea {...attr} placeholder={placeholder}/>;
 return <input {...attr} ref={input} type={({email:'email',phone:'tel',date:'date'})[name]||'text'} placeholder={placeholder} maxLength={name==='consignment'?80:undefined}/>;
}

function Node({n,parent,root=false,section=false,inactive=false}){
 const ctx=useContext(State);
 if(!n.bounds||n.styles?.visible===false)return null;
 const {id,name,characters:value}=n;
 const b=n.bounds,s=n.styles??{},extra=paints[id]??{};
 const layers=kids(n);
 const children=[...layers.filter(c=>c.name==='Site header'),...layers.filter(c=>c.name!=='Site header')];
 const sourceFills=(n.plainCard?[{type:'SOLID',color:'#ffffff'}]:(extra.fills??s.fills??[])).filter(p=>p.visible!==false);
 const fills=n.photoUrl
   ? [{ type: 'IMAGE', url: n.photoUrl, responsive: n.responsivePhoto, scaleMode: n.photoFit }, ...sourceFills.filter(p=>p.type!=='IMAGE')]
   : sourceFills;
 const image=fills.some(p=>p.type==='IMAGE');
 const svg=isVector(n)&&assets[id];
 const isText=n.type==='TEXT';
 const rollText=isText&&/^button(\s|$|\/)/i.test(parent?.name||'');
 const cardArrow=parent?.name==='Icon / H More'&&n.type==='VECTOR';
 const header=name==='Site header';
 const footer=section&&/footer/i.test(name);
 const hero=section&&/banner|hero ·/i.test(name);
 const button=/^(button|tab)(\s|$|\/)/i.test(name);
 const tab=id==='187:439'||id==='187:440';
 const submit=trackButtons.has(id)||id==='67:1065';
 const previous=id==='119:728',next=id==='119:731';
 const form=trackForms.has(id)||children.some(c=>c.id==='69:1497');
 const fillCard = !isText && parent?.id==='187:609' ? 'industry' : name==='Type-Card' && parent?.id==='62:893' ? 'tracking' : undefined;
 const serviceWorkRow = parent?.id==='61:264' && children.length===2 && children[0].styles?.fills?.some(p=>p.type==='IMAGE');
 const relatedCard = parent?.id==='209:445' && !!n.link;
 const serviceCard = /^Service row \//.test(name) || parent?.id==='323:1069';
 const cardLink = serviceCard ? findServiceLink(n,ctx.page) : undefined;
 const field=name==='Box'?fieldNames[parent?.id]:undefined;
 const heading=isText&&(s.fontSize??0)>=45&&!/^\d/.test(value);
 const activeTab=tab&&ctx.quickQuote===(id==='187:440');
 const carousel=id==='113:434';
 const actions=tab||submit||previous||next;
 const inline=ctx.header&&isText&&/^(Why Phoenix|About|Contact)$/.test(value);
 const logo=name==='Logo'||name==='Brand / Phoenix home link';
 const href=!inactive&&!actions&&(n.link||cardLink) ? n.link||cardLink : !inactive&&!actions&&(button||inline||logo||isText&&(ctx.footer||value?.includes('@')))?hrefFor(button?words(n):value,logo?'Logo':name,ctx.page):undefined;
 const currentNavLink=ctx.header&&href===link(ctx.page)&&(inline||name==='Logo'||words(n)==='Track');
 const tag=href?'a':actions?'button':form?'form':header?'header':footer?'footer':section?'section':heading?ctx.hero?'h1':'h2':'div';
 const Tag=tag;
 const stroke=extra.strokes?.find(p=>p.type==='SOLID'&&p.visible!==false);
 const edges=extra.stroke??Array(4).fill(typeof s.strokeWeight==='number'?s.strokeWeight:0);
 const effect=extra.effects?.find(e=>e.type==='DROP_SHADOW'&&e.visible);
 const row=s.autoLayout?.direction==='HORIZONTAL'&&!section&&(children.every(k=>k.bounds?.width<250)||b.height<=85);
 const isShape=!children.length&&!isText&&!svg&&!image&&!n.after&&!n.custom;
 const subheading=isText&&(s.fontSize??0)>=24&&(s.fontSize??0)<45;
 const numeric=isText&&/^\d[\d,.+%k]*$/i.test(value?.trim()||'');
 const metric=numeric&&name==='Proof / Number';
 const icon=!isText&&children.length>0&&b.width<=72&&b.height<=72&&!button;
 const cls=['fig-node',root&&'fig-root',section&&'fig-section',isText&&'fig-text',heading&&'fig-heading',subheading&&'fig-subheading',numeric&&'fig-number',metric&&'fig-stat-value',hero&&'fig-hero',header&&'fig-header',footer&&'fig-footer',svg&&'fig-vector',image&&!children.length&&'fig-photo',row&&'fig-row',button&&'fig-button',field&&'fig-field',isShape&&'fig-shape',b.width<=72&&!children.length&&!isText&&'fig-small',name==='Blur'&&'fig-blur',section&&/cta/i.test(name)&&'fig-cta',icon&&'fig-icon',isText&&serif(s.fontFamily)&&'fig-display'].filter(Boolean).join(' ');
 const style={'--x':px(b.x),'--y':px(b.y),'--w':px(b.width),'--h':px(b.height),'--gap':px(s.autoLayout?.gap||10),'--ratio':b.width/Math.max(1,b.height),borderRadius:n.type==='ELLIPSE'?'50%':typeof s.cornerRadius==='number'?s.cornerRadius:undefined,overflow:s.clipsContent?'hidden':undefined,opacity:s.opacity??undefined,boxShadow:effect?[px(effect.offset.x),px(effect.offset.y),px(effect.radius),px(effect.spread||0),rgb(effect.color)].join(' '):undefined};
 if(isText)Object.assign(style,{fontFamily:font(s.fontFamily),fontWeight:inline?(currentNavLink?600:400):serif(s.fontFamily)?600:Math.min(600,Number(s.fontWeight)||weight(s.fontStyle)),'--text-size':px(textSize(s.fontSize||14)),'--leading':textLeading(s.fontSize||14)||(s.lineHeight?.unit==='PIXELS'?px(s.lineHeight.value):s.lineHeight?.unit==='PERCENT'?s.lineHeight.value+'%':'1.3'),textAlign:(s.textAlignHorizontal||'LEFT').toLowerCase(),color:fills[0]?rgb(fills[0].color??'#232022',fills[0].opacity):'#232022',letterSpacing:s.letterSpacing?.unit==='PIXELS'?px(s.letterSpacing.value):s.letterSpacing?.value?(s.letterSpacing.value/100)+'em':undefined,textDecoration:s.textDecoration==='UNDERLINE'?'underline':undefined});
 const cta=section&&/cta/i.test(name);
 const scope={...ctx,header:ctx.header||header,footer:ctx.footer||footer,hero:ctx.hero||hero,dark:ctx.dark||hero||footer||cta};
 const variant=(href||actions)&&!tab&&(button||submit||previous||next)?buttonVariant(fills,ctx.dark&&!ctx.header):undefined;
 const oneLine=isText && s.lineHeight?.unit==="PIXELS" && b.height<=s.lineHeight.value+1 && !/[\n\u2028]/.test(value);
 const text=extra.segments?.length?extra.segments.map((q,j)=><span key={j} style={{fontFamily:font(q.fontName?.family),fontWeight:weight(q.fontName?.style),color:q.fills?.[0]?.color?rgb(q.fills[0].color):undefined}}>{q.characters}</span>):(id==='187:418' ? value?.replace('\u2028to ','\u2028To ') : value)?.replaceAll('\u2028','\n');
 const motionSection = section && !header && name!=='smooth fade';
 const heroTitle = heading && ctx.hero && typeof text==='string';
 return <Tag data-variant={variant} data-motion-section={motionSection?'':undefined} data-fill-card={fillCard} data-feedback={n.custom||n.after||undefined} data-work-row={serviceWorkRow || undefined} data-related-card={relatedCard || undefined} className={cls} data-layer={id} data-name={name} data-one-line={oneLine||undefined} style={style} id={anchors[id]} href={href}
   aria-label={n.linkLabel ?? (id==='323:1069'?'Logistics services':previous?'Previous process step':next?'Next process step':logo&&href?'Phoenix Global Logistics home':undefined)}
   role={tab?'tab':id==='187:438'?'tablist':carousel||id==='323:1069'?'region':undefined}
   aria-roledescription={carousel?'carousel':undefined}
   aria-selected={tab?activeTab:undefined} aria-controls={tab?'shipment-tools-panel':undefined}
   aria-current={currentNavLink?'page':undefined}
   tabIndex={tab&&!activeTab?-1:undefined}
   onKeyDown={tab?ctx.tabKeys:carousel?ctx.carouselKeys:undefined}
   onTouchStart={carousel?ctx.touchStart:undefined} onTouchEnd={carousel?ctx.touchEnd:undefined}
   type={tag==='button'?submit?'submit':'button':undefined}
   onClick={tab?()=>ctx.setQuickQuote(id==='187:440'):previous?event=>ctx.step(-1,event.detail!==0):next?event=>ctx.step(1,event.detail!==0):undefined}
   onSubmit={form?trackForms.has(id)?ctx.track:ctx.quoteSubmit:undefined}>
   {isText&&rollText&&!heroTitle?<span className="btn-roll"><span>{text}</span><span aria-hidden="true">{text}</span></span>:isText?(heroTitle?text.split('\n').map((line,i,all)=><span className="hero-line" key={i}><span>{line}{i<all.length-1?' ':null}</span></span>):text):cardArrow?<svg viewBox="0 0 10 8" className="fig-svg" aria-hidden="true"><path d="M0 4h9M5.5.5 9 4 5.5 7.5" fill="none" stroke="currentColor" /></svg>:svg?<img src={assetURL(svg.file)} alt="" width={b.width} height={b.height} className="fig-svg"/>:<>
     <span className="paint-group" aria-hidden="true">
       {fills.map((p,i)=><Paint key={i} p={p} b={b} eager={hero||header||logo}/>)}
       {!!stroke&&edges.some(Boolean)&&<span className="paint fig-stroke" style={{borderColor:rgb(stroke.color,stroke.opacity),borderWidth:edges.map(px).join(' ')}}/>}
     </span>
     {hero&&ctx.heroVideo&&<HeroVideo/>}
     {n.custom ? <FeedbackPart name={n.custom} n={n} page={ctx.page}/> :
     ctx.header && children.some(child=>child.characters==='Services') ? <ServicesMenu currentPath={ctx.path} mega /> :
     field?<Field name={field} node={n} parent={parent}/>:
     id==='187:441'&&ctx.quickQuote?<QuoteStarter/>:
     id==='67:1289'?<div className="fig-radios"><label><input name="frequency" type="radio" value="One-off shipment" defaultChecked/> One-off shipment</label><label><input name="frequency" type="radio" value="Regular contract"/> Regular contract</label></div>:
     id==='119:677'?<ProcessCards n={n}/>:
     <State.Provider value={scope}>{id==='187:477'?<div className="pin-stage">{children.map(c=><Node key={c.id} n={c} parent={n} section={root||c.name==='Site header'} inactive={inactive||!!href||tag==='button'}/>)}</div>:children.map(c=><Node key={c.id} n={c} parent={n} section={root||c.name==='Site header'} inactive={inactive||!!href||tag==='button'}/>)}</State.Provider>}
   </>}
   {n.after&&<FeedbackPart name={n.after} n={n} page={ctx.page}/>}
   {relatedCard&&<span className="related-card-label" aria-hidden="true">{n.linkLabel}</span>}
   {id==='119:727'&&<span className="process-index" aria-live="polite" aria-label={'Step '+(ctx.index+1)+' of '+STEPS}>{String(ctx.index+1).padStart(2,'0')} <span>/ {String(STEPS).padStart(2,'0')}</span></span>}
   {id==='61:858'&&ctx.reference&&<div className="track-result" role="status">For {ctx.reference}, use the link on your booking confirmation or <a href={'mailto:'+transportEmail+'?subject='+encodeURIComponent('Tracking '+ctx.reference)}>email operations</a>.</div>}
 </Tag>;
}

function QuoteStarter(){
 return <div className="quick-quote">
   <label>
     Origin
     <span className="quick-quote-field">
       <input name="from" required placeholder="Suburb or postcode" aria-describedby="quick-quote-hint"/>
     </span>
   </label>
   <p id="quick-quote-hint">For one-off shipments and regular work.</p>
   <label>
     Destination
     <span className="quick-quote-field">
       <input name="to" required placeholder="Suburb or postcode"/>
     </span>
   </label>
   <button type="submit">Request a Quote</button>
 </div>;
}

// The Phoenix Red Table step (third card) was removed at the client's request.
const processCards=process.children[0].children.filter(c=>c.name==='Card').filter((c,i)=>i!==2);
const STEPS=processCards.length;
function ProcessCards({n}){
 const ctx=useContext(State);
 return <>{[(ctx.index+STEPS-1)%STEPS,ctx.index,(ctx.index+1)%STEPS].map((v,i)=>{
   const card=processCards[v], slot=kids(n)[i].bounds;
   const [photo, copy] = kids(card);
   const photoHeight = i===1 ? 437 : 325;
   return <div className={'process-spot '+(i===1?'process-center':'')} key={i} aria-hidden={i!==1||undefined}
     style={{'--x':px(slot.x),'--y':px(slot.y),'--w':px(slot.width),'--h':px(slot.height),'--direction':ctx.direction}}>
     <div className="process-swap" data-direction={ctx.direction||undefined} key={v}>
       <Node n={{...photo,photoUrl:photos.whySteps[v],bounds:{...photo.bounds,width:slot.width,height:photoHeight}}} parent={card} inactive/>
       <Node n={{...copy,bounds:{...copy.bounds,x:(slot.width-copy.bounds.width)/2,y:photoHeight+20}}} parent={card} inactive/>
     </div>
   </div>;
 })}</>;
}

export function Design({tree,page,path}){
 const [quickQuote,setQuickQuote]=useState(false),[index,setIndex]=useState(0),[direction,setDirection]=useState(0);
 const [reference,setReference]=useState('');
 const [review,setReview]=useState(null);
 const start=useRef(null);
 const trigger=useRef(null);
 const modal=useRef(null);
 const viewport=useRef(null);
 usePageMotion(viewport);
 useLayoutEffect(() => {
   setReference(searchParams().get('consignment') || '');
 }, []);

 useEffect(()=>{
   if(review&&!modal.current?.open)modal.current?.showModal();
 },[review]);
 function closeReview(){
   setReview(null);
   trigger.current?.focus();
 }
 function tabKeys(e){
   if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
   e.preventDefault();
   const quote=e.key==='End'||(e.key!=='Home'&&!quickQuote);
   setQuickQuote(quote);
   document.querySelector('[data-layer="'+(quote?'187:440':'187:439')+'"]')?.focus();
 }
 function carouselKeys(e){
   if(!['ArrowLeft','ArrowRight'].includes(e.key)||e.altKey||e.metaKey||e.ctrlKey)return;
   e.preventDefault();e.stopPropagation();
   step(e.key==='ArrowLeft'?-1:1,false);
 }
 function touchStart(e){ const t=e.changedTouches[0];start.current=[t.clientX,t.clientY]; }
 function touchEnd(e){
   if(!start.current)return;
   const t=e.changedTouches[0], [x,y]=start.current;
   start.current=null;
   const dx=t.clientX-x,dy=t.clientY-y;
   if(Math.abs(dx)>54&&Math.abs(dx)>1.4*Math.abs(dy))step(dx>0?-1:1);
 }
 const step=(delta, animate=true)=>{setDirection(animate?delta:0);setIndex(i=>(i+delta+STEPS)%STEPS)};
 function track(e){
   e.preventDefault();
   const data=new FormData(e.currentTarget);
   if(quickQuote&&data.has('from')){location.href=link('contact',{from:data.get('from'),to:data.get('to')})+'#quote-form';return;}
   const ref=String(data.get('consignment')||'').trim();
   if(!/^[a-zA-Z0-9 _./-]{1,80}$/.test(ref)){const input=e.currentTarget.querySelector('input');input?.setCustomValidity('Enter the consignment reference from your booking confirmation.');input?.reportValidity();input?.addEventListener('input',()=>input.setCustomValidity(''),{once:true});return;}
   const url=trackingDestination(ref);
   if(url){location.assign(url);return;}
   if(page==='tracking'){setReference(ref);return;}
   location.href=link('tracking',{consignment:ref});
 }
 function quoteSubmit(e){
   e.preventDefault();
   const values=new FormData(e.currentTarget);
   const target=['international-freight','customs-clearance'].includes(values.get('service'))?importEmail:transportEmail;
   const body=[...values].map(([key,val])=>key[0].toUpperCase()+key.slice(1)+': '+(val||'—')).join('\n');
   trigger.current=e.nativeEvent.submitter;
   setReview({body,target});
 }
 return <State.Provider value={{heroVideo:tree.heroVideo,page,path,quickQuote,setQuickQuote,index,step,direction,track,quoteSubmit,reference,tabKeys,carouselKeys,touchStart,touchEnd}}>
   <a className="skip" href="#phoenix-design">Skip to content</a>
   <MobileHeader page={page} path={path}/>
   <main ref={viewport} id="phoenix-design" tabIndex={-1} className="fig-viewport"><Node n={tree} root/></main>
   {review&&<dialog ref={modal} onClose={closeReview} className="quote-review" aria-labelledby="review-title">
     <h2 id="review-title">Review your quote request</h2><p>Open the draft in your email app to send your enquiry.</p><pre>{review.body}</pre>
     <a href={'mailto:'+review.target+'?subject=Phoenix%20freight%20quote&body='+encodeURIComponent(review.body)}>Open email draft</a>
     <button onClick={()=>modal.current?.close()} autoFocus>Back to form</button>
   </dialog>}
 </State.Provider>;
}

function ServicesMenu({ currentPath, mega }) {
 const root = useRef(null);
 const [active, setActive] = useState(services[0].slug);
 const [open, setOpen] = useState(false);
 // Desktop: the Option 2 mega menu (list with icons and a photo that follows the hovered service),
 // laid out under the full header bar rather than under the Services label.
 const place = () => {
   const el = root.current, header = el?.closest('.fig-header');
   if (!mega || !el || !header) return;
   const h = header.getBoundingClientRect(), d = el.getBoundingClientRect(), k = h.width / header.offsetWidth || 1;
   el.style.setProperty('--mega-x', (h.left - d.left) / k + 'px');
   el.style.setProperty('--mega-y', (h.bottom - d.top) / k + 10 + 'px');
   el.style.setProperty('--mega-w', header.offsetWidth + 'px');
 };
 useEffect(() => {
   if (!mega) return;
   const close = event => { if (root.current?.open && !root.current.contains(event.target)) root.current.open = false; };
   document.addEventListener('pointerdown', close);
   return () => document.removeEventListener('pointerdown', close);
 }, [mega]);
 const current = services.find(s => s.slug === active);
 return <details ref={root} className={'services-menu' + (mega ? ' has-mega' : '')} onToggle={event => { setOpen(event.currentTarget.open); place(); }} onKeyDown={event => {
   if (event.key !== 'Escape' || !event.currentTarget.open) return;
   event.stopPropagation();
   event.currentTarget.open = false;
   event.currentTarget.querySelector('summary').focus();
 }}>
   <summary aria-current={services.some(service => currentPath==='/services/'+service.slug)?'location':undefined}><span>Services</span></summary>
   {mega ? <div className={'svc-mega' + (open ? ' is-open' : '')}>
     <ul className="svc-mega-list">{services.map((service, i) => {
       const path = '/services/' + service.slug, Ico = serviceIcons[service.slug];
       return <li key={path} style={{ '--i': i }}><a href={path} aria-current={path===currentPath?'page':undefined} className={active===service.slug?'is-active':undefined}
         onPointerEnter={() => setActive(service.slug)} onFocus={() => setActive(service.slug)}>
         {Ico && <Ico size={26} weight={active===service.slug?'fill':'light'} aria-hidden="true" />}
         <span>{service.title}</span>
         <ArrowUpRight className="svc-mega-go" size={18} aria-hidden="true" />
       </a></li>;
     })}</ul>
     <a className="svc-mega-media" href={'/services/' + current.slug} tabIndex={-1} aria-hidden="true">
       {services.map(s => <img key={s.slug} src={photos.services[s.slug]} alt="" className={s.slug===active?'is-on':undefined} loading="lazy" />)}
       <span className="svc-mega-caption"><b>{current.shortTitle}</b><small>{current.description}</small></span>
     </a>
   </div> : <ul>{services.map(service => {
     const path = '/services/' + service.slug;
     return <li key={path}><a href={path} aria-current={path===currentPath?'page':undefined}>{service.title}</a></li>;
   })}</ul>}
 </details>;
}

function MobileHeader({page: currentPage, path}){
 const menu = useRef(null);
 useEffect(() => {
   function closeOutside(event) {
     if (menu.current?.open && !menu.current.contains(event.target)) menu.current.open = false;
   }
   document.addEventListener('pointerdown', closeOutside);
   return () => document.removeEventListener('pointerdown', closeOutside);
 }, []);
 return <header className="mobile-header">
   <a href={link('home')} aria-label="Phoenix Global Logistics home"><img src="/assets/phoenix-logo-light.png" width="51" height="44" alt=""/></a>
   <a href={link('tracking')} aria-current={currentPage==='tracking'?'page':undefined}>Track</a>
   <a className="mobile-quote" href={link('contact')}>Get a quote</a>
   <details ref={menu} className="mobile-navigation" onKeyDown={event=>{
     if(event.key==='Escape'&&event.currentTarget.open){
       event.preventDefault();
       event.currentTarget.open=false;
       event.currentTarget.querySelector('summary')?.focus();
     }
   }}>
     <summary aria-label="Menu"><List className="mobile-menu-open" size={24} aria-hidden="true"/><X className="mobile-menu-close" size={24} aria-hidden="true"/></summary>
     <nav aria-label="Main navigation">
       <a href={link('home')} aria-current={currentPage==='home'?'page':undefined}>Home</a>
       <ServicesMenu currentPath={path}/>
       {[[ 'Why Phoenix','why'],['About','about'],['Contact','contact']].map(([label,page])=><a key={page} href={link(page)} aria-current={currentPage===page?'page':undefined}>{label}</a>)}
     </nav>
   </details>
 </header>;
}
