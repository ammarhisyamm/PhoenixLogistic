import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { company, importEmail, services, trackingDestination, transportEmail } from '../../src/data';
import assets from './data/assets.json';
import paints from './data/paints.json';
import process from './data/process.json';
import { phoenixPaths } from './routes.mjs';
import { isMetric, Metric, usePageMotion } from './motion';

const link = (page, params = {}) => {
 const query = new URLSearchParams(params).toString();
 return phoenixPaths[page] + (query ? '?' + query : '');
};
const assetURL = file => '/phoenix-prototype/' + file;
const State = createContext(null);
const px = n => n+'px';
const rgb = (c,opacity=1) => typeof c==='string' ? 'color-mix(in srgb,'+c+' '+opacity*100+'%, transparent)' : 'rgba('+[c.r*255,c.g*255,c.b*255,(c.a??1)*opacity].join(',')+')';
const kids = n => (n?.children??[]).filter(c=>c.styles?.visible!==false);
const words = n => n?.characters ?? kids(n).map(words).join(' ').trim();
const normalized = (s='') => s.toLowerCase().replace(/[’']/g,'').replace(/\s+/g,' ').trim();
const font = f => ({Inter:'Inter Variable',Oswald:'Oswald Variable',mixed:'Inter Variable'})[f] || f || 'Inter Variable';
const weight = s => /semi/i.test(s)?600:/bold/i.test(s)?700:/medium/i.test(s)?500:400;
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
 const asset=assets[p.imageHash];
 if(p.type!=='IMAGE'||!asset)return null;
 const m=p.imageTransform;
 let style={objectFit:p.scaleMode==='FIT'?'contain':'cover'};
 if(p.scaleMode==='CROP'&&m&&!m[0][1]&&!m[1][0]){
   const [[x,,dx],[,y,dy]]=m;
   style={width:100/x+'%',height:100/y+'%',left:-100*dx/x+'%',top:-100*dy/y+'%',objectFit:'cover'};
 }
 const f=p.filters??{};
 style.filter='brightness('+(1+(f.exposure||0)*.55)+') saturate('+(1+(f.saturation||0)*.7)+') contrast('+(1+(f.contrast||0)*.55)+')';
 return <span className="paint image-paint" style={{opacity:p.opacity??1}}>
   <img src={assetURL(asset.file)} alt="" width={asset.width} height={asset.height} draggable="false" style={style} onLoad={e=>{e.currentTarget.dataset.loaded=""}} loading={eager?'eager':'lazy'} fetchPriority={eager&&b.width>1000?'high':undefined}/>
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
 if(v==='view services')return '/#services';
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
 const value=new URLSearchParams(location.search).get(name)||undefined;
 const placeholder=({
   from:'Origin suburb or postcode',
   to:'Destination suburb or postcode',
   quantity:'Number of pallets or boxes',
   weight:'E.g. palletised freight or cartons',
   details:'Include dimensions, total weight and any handling requirements.',
 })[name]||words(node);
 if(name==='service')return <select {...attr} defaultValue=""><option value="" disabled>Choose a service</option>{services.map(s=><option key={s.slug} value={s.slug}>{s.title}</option>)}</select>;
 if(name==='details')return <textarea {...attr} placeholder={placeholder}/>;
 return <input {...attr} type={({email:'email',phone:'tel',date:'date'})[name]||'text'} placeholder={placeholder} defaultValue={value} maxLength={name==='consignment'?80:undefined}/>;
}

function Node({n,parent,root=false,section=false,inactive=false}){
 const ctx=useContext(State);
 if(!n.bounds||n.styles?.visible===false)return null;
 const {id,name,characters:value}=n;
 const b=n.bounds,s=n.styles??{},extra=paints[id]??{};
 const layers=kids(n);
 const children=[...layers.filter(c=>c.name==='Site header'),...layers.filter(c=>c.name!=='Site header')];
 const fills=(extra.fills??s.fills??[]).filter(p=>p.visible!==false);
 const image=fills.some(p=>p.type==='IMAGE');
 const svg=isVector(n)&&assets[id];
 const isText=n.type==='TEXT';
 const header=name==='Site header';
 const footer=section&&/footer/i.test(name);
 const hero=section&&/banner|hero ·/i.test(name);
 const button=/^(button|tab)(\s|$|\/)/i.test(name);
 const tab=id==='187:439'||id==='187:440';
 const submit=trackButtons.has(id)||id==='67:1065';
 const previous=id==='119:728',next=id==='119:731';
 const form=trackForms.has(id)||children.some(c=>c.id==='69:1497');
 const serviceCard = /^Service row \//.test(name);
 const motionCard = serviceCard || /^(Sector \/|Type-Card$|Depot \/|Trade bridge \/|Proof \/|Quality standard \/|Footer \/ (Company|Services|Operations|Contact))/.test(name) && !isText
   || ['61:530','209:473','209:479','209:446','209:450','209:452'].includes(id);
 const cardLink = serviceCard ? findServiceLink(n,ctx.page) : undefined;
 const field=name==='Box'?fieldNames[parent?.id]:undefined;
 const heading=isText&&(s.fontSize??0)>=45&&!/^\d/.test(value);
 const activeTab=tab&&ctx.quickQuote===(id==='187:440');
 const carousel=id==='113:434';
 const actions=tab||submit||previous||next;
 const inline=ctx.header&&isText&&/^(Services|Why Phoenix|About|Contact)$/.test(value);
 const href=!inactive&&!actions&&cardLink ? cardLink : !inactive&&!actions&&(button||inline||name==='Logo'||isText&&(ctx.footer||value?.includes('@')))?hrefFor(button?words(n):value,name,ctx.page):undefined;
 const tag=href?'a':actions?'button':form?'form':header?'header':footer?'footer':section?'section':heading?ctx.hero?'h1':'h2':'div';
 const Tag=tag;
 const stroke=extra.strokes?.find(p=>p.type==='SOLID'&&p.visible!==false);
 const edges=extra.stroke??Array(4).fill(typeof s.strokeWeight==='number'?s.strokeWeight:0);
 const effect=extra.effects?.find(e=>e.type==='DROP_SHADOW'&&e.visible);
 const row=s.autoLayout?.direction==='HORIZONTAL'&&!section&&(children.every(k=>k.bounds?.width<250)||b.height<=85);
 const isShape=!children.length&&!isText&&!svg&&!image;
 const icon=!isText&&children.length>0&&b.width<=72&&b.height<=72&&!button;
 const cls=['fig-node',root&&'fig-root',section&&'fig-section',isText&&'fig-text',heading&&'fig-heading',hero&&'fig-hero',header&&'fig-header',footer&&'fig-footer',svg&&'fig-vector',image&&!children.length&&'fig-photo',row&&'fig-row',button&&'fig-button',field&&'fig-field',isShape&&'fig-shape',b.width<=72&&!children.length&&!isText&&'fig-small',name==='Blur'&&'fig-blur',section&&/cta/i.test(name)&&'fig-cta',icon&&'fig-icon'].filter(Boolean).join(' ');
 const style={'--x':px(b.x),'--y':px(b.y),'--w':px(b.width),'--h':px(b.height),'--gap':px(s.autoLayout?.gap||10),'--ratio':b.width/Math.max(1,b.height),borderRadius:n.type==='ELLIPSE'?'50%':typeof s.cornerRadius==='number'?s.cornerRadius:undefined,overflow:s.clipsContent?'hidden':undefined,opacity:s.opacity??undefined,boxShadow:effect?[px(effect.offset.x),px(effect.offset.y),px(effect.radius),px(effect.spread||0),rgb(effect.color)].join(' '):undefined};
 if(isText)Object.assign(style,{fontFamily:font(s.fontFamily),fontWeight:weight(s.fontStyle),'--text-size':px(s.fontSize||14),'--leading':s.lineHeight?.unit==='PIXELS'?px(s.lineHeight.value):s.lineHeight?.unit==='PERCENT'?s.lineHeight.value+'%':'1.3',textAlign:(s.textAlignHorizontal||'LEFT').toLowerCase(),color:fills[0]?rgb(fills[0].color??'#232022',fills[0].opacity):'#232022',letterSpacing:s.letterSpacing?.unit==='PIXELS'?px(s.letterSpacing.value):s.letterSpacing?.value?(s.letterSpacing.value/100)+'em':undefined,textDecoration:s.textDecoration==='UNDERLINE'?'underline':undefined});
 const cta=section&&/cta/i.test(name);
 const scope={...ctx,header:ctx.header||header,footer:ctx.footer||footer,hero:ctx.hero||hero,dark:ctx.dark||hero||footer||cta};
 const variant=(href||actions)&&!tab&&(button||submit||previous||next)?buttonVariant(fills,ctx.dark&&!ctx.header):undefined;
 const oneLine=isText && s.lineHeight?.unit==="PIXELS" && b.height<=s.lineHeight.value+1 && !/[\n\u2028]/.test(value);
 const text=extra.segments?.length?extra.segments.map((q,j)=><span key={j} style={{fontFamily:font(q.fontName?.family),fontWeight:weight(q.fontName?.style),color:q.fills?.[0]?.color?rgb(q.fills[0].color):undefined}}>{q.characters}</span>):(id==='187:418' ? value?.replace('\u2028to ','\u2028To ') : value)?.replaceAll('\u2028','\n');
 const motionSection = section && !header && !hero && name!=='smooth fade';
 const heroTitle = heading && ctx.hero && typeof text==='string';
 return <Tag data-variant={variant} data-motion-section={motionSection?'':undefined} data-motion-card={motionCard?'':undefined} className={cls} data-layer={id} data-name={name} data-one-line={oneLine||undefined} style={style} id={anchors[id]} href={href}
   aria-label={previous?'Previous process step':next?'Next process step':name==='Logo'&&href?'Phoenix Global Logistics home':undefined}
   role={tab?'tab':id==='187:438'?'tablist':carousel?'region':undefined}
   aria-roledescription={carousel?'carousel':undefined}
   aria-selected={tab?activeTab:undefined} aria-controls={tab?'shipment-tools-panel':undefined}
   aria-current={ctx.header&&href===link(ctx.page)?'page':undefined}
   tabIndex={tab&&!activeTab?-1:undefined}
   onKeyDown={tab?ctx.tabKeys:carousel?ctx.carouselKeys:undefined}
   onTouchStart={carousel?ctx.touchStart:undefined} onTouchEnd={carousel?ctx.touchEnd:undefined}
   type={tag==='button'?submit?'submit':'button':undefined}
   onClick={tab?()=>ctx.setQuickQuote(id==='187:440'):previous?event=>ctx.step(-1,event.detail!==0):next?event=>ctx.step(1,event.detail!==0):undefined}
   onSubmit={form?trackForms.has(id)?ctx.track:ctx.quoteSubmit:undefined}>
   {motionSection&&<span className="motion-seam" aria-hidden="true"/>}
   {id==='62:893'&&<span className="delivery-route" aria-hidden="true"><span className="delivery-route-fill"/></span>}
   {isText?(isMetric(value)?<Metric value={value}/>:heroTitle?text.split('\n').map((line,i,all)=><span className="hero-line" key={i}><span>{line}{i<all.length-1?' ':null}</span></span>):text):svg?<img src={assetURL(svg.file)} alt="" width={b.width} height={b.height} className="fig-svg"/>:<>
     <span className="paint-group" aria-hidden="true">
       {fills.map((p,i)=><Paint key={i} p={p} b={b} eager={hero||header||name==='Logo'}/>)}
       {tab&&ctx.quickQuote&&<span className={'paint '+(activeTab?'tab-selected':'tab-deselected')}/>}
       {!!stroke&&edges.some(Boolean)&&<span className="paint fig-stroke" style={{borderColor:rgb(stroke.color,stroke.opacity),borderWidth:edges.map(px).join(' ')}}/>}
     </span>
     {field?<Field name={field} node={n} parent={parent}/>:
     id==='187:441'&&ctx.quickQuote?<QuoteStarter/>:
     id==='67:1289'?<div className="fig-radios"><label><input name="frequency" type="radio" value="One-off shipment" defaultChecked/> One-off shipment</label><label><input name="frequency" type="radio" value="Regular contract"/> Regular contract</label></div>:
     id==='119:677'?<ProcessCards n={n}/>:
     <State.Provider value={scope}>{children.map(c=><Node key={c.id} n={c} parent={n} section={root||c.name==='Site header'} inactive={inactive||!!href||tag==='button'}/>)}</State.Provider>}
   </>}
   {id==='119:727'&&<span className="process-index" aria-live="polite" aria-label={'Step '+(ctx.index+1)+' of 6'}>{String(ctx.index+1).padStart(2,'0')} <span>/ 06</span></span>}
   {id==='61:858'&&ctx.reference&&<div className="track-result" role="status">For {ctx.reference}, use the link on your booking confirmation or <a href={'mailto:'+transportEmail+'?subject='+encodeURIComponent('Tracking '+ctx.reference)}>email operations</a>.</div>}
 </Tag>;
}

function QuoteStarter(){
 return <div className="quick-quote"><label>Origin<input name="from" required placeholder="Suburb or postcode"/></label><label>Destination<input name="to" required placeholder="Suburb or postcode"/></label><button type="submit">Request a quote</button></div>;
}

const processCards=process.children[0].children.filter(c=>c.name==='Card');
function ProcessCards({n}){
 const ctx=useContext(State);
 return <>{[(ctx.index+5)%6,ctx.index,(ctx.index+1)%6].map((v,i)=>{
   const card=processCards[v], slot=kids(n)[i].bounds;
   const [photo, copy] = kids(card);
   const photoHeight = i===1 ? 437 : 325;
   return <div className={'process-spot '+(i===1?'process-center':'')} key={i} aria-hidden={i!==1||undefined}
     style={{'--x':px(slot.x),'--y':px(slot.y),'--w':px(slot.width),'--h':px(slot.height),'--direction':ctx.direction}}>
     <div className="process-swap" data-direction={ctx.direction||undefined} key={v}>
       <Node n={{...photo,bounds:{...photo.bounds,width:slot.width,height:photoHeight}}} parent={card} inactive/>
       <Node n={{...copy,bounds:{...copy.bounds,x:(slot.width-copy.bounds.width)/2,y:photoHeight+20}}} parent={card} inactive/>
     </div>
   </div>;
 })}</>;
}

export function Design({tree,page}){
 const [quickQuote,setQuickQuote]=useState(false),[index,setIndex]=useState(0),[direction,setDirection]=useState(0);
 const [reference,setReference]=useState(new URLSearchParams(location.search).get('consignment')||'');
 const [review,setReview]=useState(null);
 const start=useRef(null);
 const trigger=useRef(null);
 const modal=useRef(null);
 const viewport=useRef(null);
 usePageMotion(viewport);

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
 const step=(delta, animate=true)=>{setDirection(animate?delta:0);setIndex(i=>(i+delta+6)%6)};
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
 return <State.Provider value={{page,quickQuote,setQuickQuote,index,step,direction,track,quoteSubmit,reference,tabKeys,carouselKeys,touchStart,touchEnd}}>
   <a className="skip" href="#phoenix-design">Skip to content</a>
   <MobileHeader page={page}/>
   <main ref={viewport} id="phoenix-design" tabIndex={-1} className="fig-viewport"><Node n={tree} root/></main>
   {review&&<dialog ref={modal} onClose={closeReview} className="quote-review" aria-labelledby="review-title">
     <h2 id="review-title">Review your quote request</h2><p>Open the draft in your email app to send your enquiry.</p><pre>{review.body}</pre>
     <a href={'mailto:'+review.target+'?subject=Phoenix%20freight%20quote&body='+encodeURIComponent(review.body)}>Open email draft</a>
     <button onClick={()=>modal.current?.close()} autoFocus>Back to form</button>
   </dialog>}
 </State.Provider>;
}

function MobileHeader({page: currentPage}){
 return <header className="mobile-header"><a href={link('home')} aria-label="Phoenix Global Logistics home"><img src="/assets/phoenix-logo.png" width="51" height="44" alt="Phoenix"/></a>
 <a href={link('tracking')} aria-current={currentPage==='tracking'?'page':undefined}>Track</a><a className="mobile-quote" href={link('contact')}>Get a quote</a>
 <details onKeyDown={e=>{
   if(e.key==='Escape'&&e.currentTarget.open){e.currentTarget.open=false;e.currentTarget.querySelector('summary')?.focus();}
 }}><summary>Menu</summary><nav aria-label="Main navigation">{[['Home','home'],['Services','services'],['Why Phoenix','why'],['About','about'],['Contact','contact']].map(([label,page])=><a key={page} href={link(page)} aria-current={currentPage===page?'page':undefined}>{label}</a>)}</nav></details></header>;
}
