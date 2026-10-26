// ---- shared helpers (prepended to each build script) ----
const __vars = await figma.variables.getLocalVariablesAsync();
const __ts = await figma.getLocalTextStylesAsync();
const __es = await figma.getLocalEffectStylesAsync();
for (const s of __ts) await figma.loadFontAsync(s.fontName);
await figma.loadFontAsync({family:'Inter',style:'Regular'});
function V(name){ const v=__vars.find(x=>x.name===name); if(!v) throw new Error('Missing variable '+name); return v; }
function TS(name){ const s=__ts.find(x=>x.name===name); if(!s) throw new Error('Missing text style '+name); return s; }
function ES(name){ return __es.find(x=>x.name===name); }
function paint(varName){ return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',V(varName)); }
function fill(node,varName){ node.fills = varName ? [paint(varName)] : []; return node; }
function stroke(node,varName,w=1){ node.strokes=[paint(varName)]; node.strokeWeight=w; node.strokeAlign='INSIDE'; return node; }
function bindNum(node,prop,varName){ node.setBoundVariable(prop, V(varName)); }
function pad(node,y,x){ for(const p of ['paddingTop','paddingBottom']) bindNum(node,p,y); for(const p of ['paddingLeft','paddingRight']) bindNum(node,p,x); }
function radius(node,varName){ for(const p of ['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius']) bindNum(node,p,varName); }
async function text(str, style, colorVar, opts={}){
  const t=figma.createText(); await t.setTextStyleIdAsync(TS(style).id); t.characters=str; fill(t,colorVar||'text/primary');
  if(opts.width){ t.resize(opts.width, t.height); t.textAutoResize='HEIGHT'; }
  if(opts.name) t.name=opts.name; return t;
}
function al(dir, props={}){ const f=figma.createAutoLayout(dir, props); f.fills=[]; return f; }
function rightmostX(){ let x=0; for(const n of figma.currentPage.children) x=Math.max(x,n.x+n.width); return x; }
// Molecules: Service card, Stat, Process step, Tracking event, Site header, Quick tools card. Needs c1 board.
const board = figma.currentPage.findChild(n=>n.name==='Phoenix · Components');
if (!board) throw new Error('Run atoms first');
if (board.findChild(n=>n.name==='Service card')) return {status:'exists'};
const setBy = n => board.findChild(x=>x.type==='COMPONENT_SET'&&x.name===n);
const compBy = n => board.findChild(x=>x.type==='COMPONENT'&&x.name===n);
function variant(setName, props){ const s=setBy(setName); return s.children.find(c=>Object.entries(props).every(([k,v])=>c.name.includes(`${k}=${v}`))); }
let cursorY = board.height; const out={sets:{},comps:{}};
async function label(t){ const tx=await text(t,'Mono/Eyebrow','text/brand'); board.appendChild(tx); tx.x=80; tx.y=cursorY; cursorY+=36; }
function grid(set, cols, gapX=24, gapY=24){
  const kids=set.children; let x=0,y=0,rowH=0,maxW=0;
  kids.forEach((k,i)=>{ if(i%cols===0 && i>0){ y+=rowH+gapY; x=0; rowH=0; } k.x=x+24; k.y=y+24; x+=k.width+gapX; rowH=Math.max(rowH,k.height); maxW=Math.max(maxW,x); });
  set.resize(maxW+24, y+rowH+48); set.fills=[]; stroke(set,'border/brand'); set.dashPattern=[6,4]; radius(set,'radius/lg');
}

// ---------- Service card ----------
await label('Service card');
const svcV=[];
for (const tone of ['Light','Dark']){
  const c=figma.createComponent(); c.name='Tone='+tone; c.layoutMode='VERTICAL'; c.primaryAxisSizingMode='AUTO'; c.counterAxisSizingMode='FIXED'; c.resize(296,10);
  bindNum(c,'itemSpacing','md'); c.paddingTop=28; c.paddingBottom=30; bindNum(c,'paddingLeft','xl'); bindNum(c,'paddingRight','xl');
  fill(c, tone==='Light'?'bg/page':'bg/inverse'); stroke(c,'border/default');
  const icon=compBy(tone==='Light'?'Icon/Truck':'Icon/Hazard').createInstance(); icon.name='Icon'; c.appendChild(icon);
  if (tone==='Dark') icon.findAll(x=>'strokes' in x && x.strokes.length>0).forEach(x=>{ x.strokes=[paint('icon/hazard')]; });
  const h=await text(tone==='Light'?'Transport & road freight':'Dangerous goods','Heading/Card', tone==='Light'?'text/primary':'text/on-dark',{name:'Title',width:248}); c.appendChild(h); h.layoutSizingHorizontal='FILL';
  const p=await text(tone==='Light'?'Local runs, interstate freight, national linehaul and contracted transport.':'We can move certain dangerous goods, mainly battery-related products.','Body/Small', tone==='Light'?'text/muted':'text/on-dark',{name:'Description',width:248}); c.appendChild(p); p.layoutSizingHorizontal='FILL';
  const tags=al('HORIZONTAL',{name:'Tags'}); tags.itemSpacing=6; tags.layoutWrap='WRAP'; tags.counterAxisSpacing=6; c.appendChild(tags); tags.layoutSizingHorizontal='FILL';
  for (const w of (tone==='Light'?['Metro','Interstate','Linehaul']:['Lithium batteries','Case by case'])){ const t=variant('Tag',{Tone:tone}).createInstance(); t.setProperties({[Object.keys(t.componentProperties).find(k=>k.startsWith('Label'))]:w}); tags.appendChild(t); }
  svcV.push(c);
}
const svcSet=figma.combineAsVariants(svcV, board); svcSet.name='Service card';
const kT=svcSet.addComponentProperty('Title','TEXT','Transport & road freight');
const kD=svcSet.addComponentProperty('Description','TEXT','Local runs, interstate freight, national linehaul and contracted transport.');
const kI=svcSet.addComponentProperty('Icon','INSTANCE_SWAP', compBy('Icon/Truck').id);
for (const c of svcSet.children){ c.findOne(n=>n.name==='Title').componentPropertyReferences={characters:kT}; c.findOne(n=>n.name==='Description').componentPropertyReferences={characters:kD}; c.findOne(n=>n.name==='Icon').componentPropertyReferences={mainComponent:kI}; }
grid(svcSet,2); svcSet.x=80; svcSet.y=cursorY; svcSet.description='One per service in the 4-column services grid. Dark tone is reserved for dangerous goods. Swap the icon from Icon/*.'; out.sets['Service card']=svcSet.id;
let rowX = 80 + svcSet.width + 40;

// ---------- Stat ----------
const stat=figma.createComponent(); stat.name='Stat'; stat.layoutMode='VERTICAL'; stat.primaryAxisSizingMode='AUTO'; stat.counterAxisSizingMode='FIXED'; stat.resize(220,10);
stat.itemSpacing=4; stat.paddingTop=stat.paddingBottom=28; bindNum(stat,'paddingLeft','xl'); bindNum(stat,'paddingRight','xl'); fill(stat,'bg/page');
stat.strokes=[paint('border/default')]; stat.strokeLeftWeight=1; stat.strokeTopWeight=0; stat.strokeRightWeight=0; stat.strokeBottomWeight=0; stat.strokeAlign='INSIDE';
const sn=await text('55,000','Display/Stat','text/primary',{name:'Value'}); stat.appendChild(sn);
const sl=await text('boxes processed a month for Amazon work alone','Body/Small','text/muted',{name:'Caption',width:172}); stat.appendChild(sl); sl.layoutSizingHorizontal='FILL';
const kSV=stat.addComponentProperty('Value','TEXT','55,000'); const kSC=stat.addComponentProperty('Caption','TEXT','boxes processed a month for Amazon work alone');
sn.componentPropertyReferences={characters:kSV}; sl.componentPropertyReferences={characters:kSC};
stat.description='Proof-strip figure. Use real, approximate-where-stated numbers only.';
board.appendChild(stat); stat.x=rowX; stat.y=cursorY+24; out.comps.Stat=stat.id; rowX+=stat.width+40;

// ---------- Process step ----------
const step=figma.createComponent(); step.name='Process step'; step.layoutMode='VERTICAL'; step.primaryAxisSizingMode='AUTO'; step.counterAxisSizingMode='FIXED'; step.resize(200,10); step.itemSpacing=10; step.fills=[];
const mk=al('HORIZONTAL',{name:'Marker'}); mk.counterAxisAlignItems='CENTER'; step.appendChild(mk); mk.layoutSizingHorizontal='FILL';
const num=al('HORIZONTAL',{name:'Number'}); num.primaryAxisSizingMode='FIXED'; num.counterAxisSizingMode='FIXED'; num.resize(44,44); num.primaryAxisAlignItems='CENTER'; num.counterAxisAlignItems='CENTER';
num.cornerRadius=22; fill(num,'bg/subtle'); stroke(num,'border/brand',2); mk.appendChild(num);
const nt=await text('01','Mono/Eyebrow','text/brand',{name:'Step number'}); nt.textCase='ORIGINAL'; num.appendChild(nt);
const ln=figma.createRectangle(); ln.name='Connector'; ln.resize(100,2); ln.fills=[paint('border/brand')]; ln.opacity=0.45; mk.appendChild(ln); ln.layoutSizingHorizontal='FILL';
const sc=await text('Depot in · Depot out','Mono/Tag','text/muted',{name:'Scan'}); sc.textCase='UPPER'; step.appendChild(sc);
const stt=await text('Scanned at every move','Heading/Small','text/primary',{name:'Title',width:180}); step.appendChild(stt); stt.layoutSizingHorizontal='FILL';
const sd=await text('Warehouse scans record each movement before drivers load for delivery.','Body/Small','text/muted',{name:'Description',width:180}); step.appendChild(sd); sd.layoutSizingHorizontal='FILL';
const kn=step.addComponentProperty('Number','TEXT','01'), ks=step.addComponentProperty('Scan','TEXT','Depot in · Depot out'), kt2=step.addComponentProperty('Title','TEXT','Scanned at every move'), kd2=step.addComponentProperty('Description','TEXT','Warehouse scans record each movement before drivers load for delivery.'), kc=step.addComponentProperty('Show connector','BOOLEAN',true);
nt.componentPropertyReferences={characters:kn}; sc.componentPropertyReferences={characters:ks}; stt.componentPropertyReferences={characters:kt2}; sd.componentPropertyReferences={characters:kd2}; ln.componentPropertyReferences={visible:kc};
step.description='Six in a row for How it works. Hide the connector on the last step.';
board.appendChild(step); step.x=rowX; step.y=cursorY+24; out.comps['Process step']=step.id;
cursorY+=Math.max(svcSet.height, stat.height+24, step.height+24)+72;

// ---------- Tracking event ----------
await label('Tracking event · Site header · Quick tools card');
const evV=[];
for (const st of ['Done','Pending']){
  const c=figma.createComponent(); c.name='State='+st; c.layoutMode='HORIZONTAL'; c.primaryAxisSizingMode='FIXED'; c.counterAxisSizingMode='AUTO'; c.resize(420,10); c.itemSpacing=14; c.paddingBottom=18; c.fills=[];
  const dot=figma.createEllipse(); dot.name='Dot'; dot.resize(18,18); c.appendChild(dot);
  if (st==='Done'){ dot.fills=[paint('bg/brand')]; dot.strokes=[{type:'SOLID',color:{r:1,g:1,b:1}}]; dot.strokeWeight=3; dot.strokeAlign='INSIDE'; } else { fill(dot,'bg/page'); stroke(dot,'border/input',2); }
  const col=al('VERTICAL',{name:'Text'}); col.itemSpacing=2; c.appendChild(col); col.layoutSizingHorizontal='FILL';
  col.appendChild(await text('Depot in scan','Heading/Small', st==='Done'?'text/primary':'text/muted',{name:'Event'}));
  col.appendChild(await text('Melbourne depot','Body/Small','text/muted',{name:'Place'}));
  const w=await text('Wed 19:30','Mono/Tag','text/muted',{name:'Time'}); c.appendChild(w);
  evV.push(c);
}
const evSet=figma.combineAsVariants(evV, board); evSet.name='Tracking event';
const kE=evSet.addComponentProperty('Event','TEXT','Depot in scan'), kP=evSet.addComponentProperty('Place','TEXT','Melbourne depot'), kW=evSet.addComponentProperty('Time','TEXT','Wed 19:30');
for (const c of evSet.children){ c.findOne(n=>n.name==='Event').componentPropertyReferences={characters:kE}; c.findOne(n=>n.name==='Place').componentPropertyReferences={characters:kP}; c.findOne(n=>n.name==='Time').componentPropertyReferences={characters:kW}; }
grid(evSet,1,0,0); evSet.x=80; evSet.y=cursorY; evSet.description='One row per Transvirtual scan, newest first.'; out.sets['Tracking event']=evSet.id;

// ---------- Site header ----------
const hdr=figma.createComponent(); hdr.name='Site header'; hdr.layoutMode='HORIZONTAL'; hdr.primaryAxisSizingMode='FIXED'; hdr.counterAxisSizingMode='FIXED'; hdr.resize(1000,76);
hdr.counterAxisAlignItems='CENTER'; hdr.itemSpacing=28; bindNum(hdr,'paddingLeft','xl'); bindNum(hdr,'paddingRight','xl'); fill(hdr,'bg/page');
hdr.strokes=[paint('border/default')]; hdr.strokeBottomWeight=1; hdr.strokeTopWeight=0; hdr.strokeLeftWeight=0; hdr.strokeRightWeight=0; hdr.strokeAlign='INSIDE';
const lg=figma.createRectangle(); lg.name='Logo'; lg.resize(61,52); fill(lg,'bg/brand-tint'); lg.cornerRadius=4; hdr.appendChild(lg);
const nav=al('HORIZONTAL',{name:'Nav'}); nav.itemSpacing=20; hdr.appendChild(nav); nav.layoutGrow=1; nav.primaryAxisAlignItems='MAX';
for (const n of ['Services','How it works','Amazon FBA','Quality','About','Contact']) nav.appendChild(await text(n,'Body/Small','text/secondary'));
const acts=al('HORIZONTAL',{name:'Actions'}); acts.itemSpacing=10; acts.counterAxisAlignItems='CENTER'; hdr.appendChild(acts);
const lang=al('HORIZONTAL',{name:'Language'}); lang.paddingTop=lang.paddingBottom=6; lang.paddingLeft=lang.paddingRight=12; radius(lang,'radius/full'); stroke(lang,'border/default'); acts.appendChild(lang);
lang.appendChild(await text('中文','Mono/Tag','text/secondary'));
const b1=variant('Button',{Variant:'Secondary',Size:'Small',State:'Default'}).createInstance(); acts.appendChild(b1);
b1.setProperties({[Object.keys(b1.componentProperties).find(k=>k.startsWith('Label'))]:'Track'});
const b2=variant('Button',{Variant:'Primary',Size:'Small',State:'Default'}).createInstance(); acts.appendChild(b2);
hdr.description='Sticky desktop header. Replace the Logo rectangle with the logo image. Under 940 px the nav collapses into a menu button.';
board.appendChild(hdr); hdr.x=80+evSet.width+40; hdr.y=cursorY; out.comps['Site header']=hdr.id;

// ---------- Quick tools card ----------
const card=figma.createComponent(); card.name='Quick tools card'; card.layoutMode='VERTICAL'; card.primaryAxisSizingMode='AUTO'; card.counterAxisSizingMode='FIXED'; card.resize(440,10); card.itemSpacing=0;
fill(card,'bg/page'); radius(card,'radius/lg'); card.clipsContent=true; const sh=ES('Shadow/Card'); if (sh) await card.setEffectStyleIdAsync(sh.id);
const top=al('HORIZONTAL',{name:'Label strip'}); card.appendChild(top); top.layoutSizingHorizontal='FILL'; top.primaryAxisAlignItems='SPACE_BETWEEN'; top.paddingTop=top.paddingBottom=14; bindNum(top,'paddingLeft','xl'); bindNum(top,'paddingRight','xl'); fill(top,'bg/brand');
top.appendChild(await text('Phoenix · Quick tools','Mono/Eyebrow','text/on-dark')); top.appendChild(await text('PGL','Mono/Eyebrow','text/on-dark'));
const tabs=al('HORIZONTAL',{name:'Tabs'}); card.appendChild(tabs); tabs.layoutSizingHorizontal='FILL';
const t1=variant('Tab',{Selected:'True'}).createInstance(); tabs.appendChild(t1); t1.layoutSizingHorizontal='FILL';
const t2=variant('Tab',{Selected:'False'}).createInstance(); tabs.appendChild(t2); t2.layoutSizingHorizontal='FILL';
t2.setProperties({[Object.keys(t2.componentProperties).find(k=>k.startsWith('Label'))]:'Quick quote'});
const body=al('VERTICAL',{name:'Panel'}); card.appendChild(body); body.layoutSizingHorizontal='FILL'; body.paddingTop=22; body.paddingBottom=20; bindNum(body,'paddingLeft','xl'); bindNum(body,'paddingRight','xl'); bindNum(body,'itemSpacing','lg');
const fld=variant('Text field',{Type:'Consignment',State:'Default'}).createInstance(); body.appendChild(fld); fld.layoutSizingHorizontal='FILL';
const go=variant('Button',{Variant:'Primary',Size:'Default',State:'Default'}).createInstance(); body.appendChild(go); go.layoutSizingHorizontal='FILL';
go.setProperties({[Object.keys(go.componentProperties).find(k=>k.startsWith('Label'))]:'Track shipment'});
const bcWrap=al('HORIZONTAL',{name:'Barcode'}); card.appendChild(bcWrap); bcWrap.layoutSizingHorizontal='FILL'; bindNum(bcWrap,'paddingLeft','xl'); bindNum(bcWrap,'paddingRight','xl'); bcWrap.paddingTop=4;
const bars=al('HORIZONTAL',{name:'Bars'}); bars.itemSpacing=2; bars.clipsContent=true; bcWrap.appendChild(bars); bars.layoutSizingHorizontal='FILL'; bars.counterAxisSizingMode='FIXED'; bars.resize(392,34); bars.opacity=0.85;
const pattern=[2,1,3,1,1,2,3,1,2,2,1,3,1,1,2,1,3,2,1,1];
for (let i=0;i<130;i++){ const r=figma.createRectangle(); r.resize(pattern[i%pattern.length],34); r.fills=[paint('text/primary')]; bars.appendChild(r); }
const foot=al('HORIZONTAL',{name:'Foot'}); card.appendChild(foot); foot.layoutSizingHorizontal='FILL'; foot.primaryAxisAlignItems='SPACE_BETWEEN'; foot.paddingTop=12; foot.paddingBottom=18; bindNum(foot,'paddingLeft','xl'); bindNum(foot,'paddingRight','xl');
foot.appendChild(await text('SYD · MEL · AUS','Mono/Tag','text/muted')); foot.appendChild(await text('Handle with care','Mono/Tag','text/muted'));
card.description='Hero card styled like a consignment label: tracking first, quick quote second.';
board.appendChild(card); card.x=hdr.x; card.y=cursorY+hdr.height+40; out.comps['Quick tools card']=card.id;
cursorY = Math.max(cursorY+evSet.height, card.y+card.height)+96;
board.resize(Math.max(board.width, hdr.x+hdr.width+80), cursorY);
out.boardId=board.id;
return out;
