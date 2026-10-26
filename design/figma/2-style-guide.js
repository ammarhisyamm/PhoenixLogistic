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
// Style guide board. Requires foundations. Removes a previous board with the same name first? No: skip if exists.
const existing = figma.currentPage.findChild(n=>n.name==='Phoenix · Style guide');
if (existing) return {status:'exists', id: existing.id};
const W=1440, INNER=1280;
const board = al('VERTICAL',{name:'Phoenix · Style guide'}); fill(board,'bg/page');
board.x = rightmostX()+200; board.y = 0;
board.counterAxisSizingMode='FIXED'; board.resize(W, 100); board.primaryAxisSizingMode='AUTO';
board.paddingTop=0; board.paddingBottom=120; board.itemSpacing=0;

function section(name, bgVar){
  const s=al('VERTICAL',{name}); fill(s,bgVar||'bg/page'); board.appendChild(s); s.layoutSizingHorizontal='FILL';
  s.paddingLeft=s.paddingRight=80; s.paddingTop=s.paddingBottom=96; bindNum(s,'itemSpacing','3xl'); return s;
}
async function head(parent, eyebrow, title, lede, onDark){
  const h=al('VERTICAL',{name:'Section head'}); bindNum(h,'itemSpacing','lg'); parent.appendChild(h);
  h.appendChild(await text('— '+eyebrow,'Mono/Eyebrow', onDark?'text/on-dark-accent':'text/brand'));
  h.appendChild(await text(title,'Display/H2', onDark?'text/on-dark':'text/primary',{width:900}));
  if(lede) h.appendChild(await text(lede,'Body/Lede', onDark?'text/on-dark':'text/secondary',{width:760}));
  return h;
}
const created=[];

// ---------- Cover ----------
const cover=section('Cover','bg/inverse'); cover.paddingTop=120; cover.paddingBottom=120;
cover.appendChild(await text('— Brand style guide · v1 · 2026','Mono/Eyebrow','text/on-dark-accent'));
const ct=await text('Phoenix Global Logistics','Display/Hero','text/on-dark',{width:1000}); cover.appendChild(ct);
cover.appendChild(await text('The colours, type, spacing and components behind phoenixgloballogistics.com.au. Built from the 2025 brand deck and the live website code, so design and development use the same names.','Body/Lede','text/on-dark',{width:760}));
const logoRow=al('HORIZONTAL',{name:'Logo slots'}); logoRow.itemSpacing=24; cover.appendChild(logoRow);
const logoSlots={};
for (const [k,bg] of [['Logo/On light','bg/page'],['Logo/On dark','bg/inverse'],['Logo/On red','bg/brand']]){
  const tile=al('VERTICAL',{name:k}); fill(tile,bg); tile.counterAxisSizingMode='FIXED'; tile.primaryAxisSizingMode='FIXED'; tile.resize(300,220);
  tile.primaryAxisAlignItems='CENTER'; tile.counterAxisAlignItems='CENTER'; radius(tile,'radius/lg'); stroke(tile,'border/default');
  const r=figma.createRectangle(); r.name=k+' image'; r.resize(188,160); r.fills=[]; tile.appendChild(r); logoRow.appendChild(tile); logoSlots[k]=r.id;
}

// ---------- Logo rules ----------
const logo=section('Logo');
await head(logo,'Logo','Use the full lockup','The phoenix mark sits in the red oval above the wordmark. Keep it whole, keep it upright, and give it room.');
const rules=al('HORIZONTAL',{name:'Logo rules'}); rules.itemSpacing=24; logo.appendChild(rules); rules.layoutSizingHorizontal='FILL';
for (const [t,b,ok] of [
 ['Clear space','Keep at least the height of the “P” clear on every side.',true],
 ['Minimum size','44 px tall on screen (header). 64 px in the footer.',true],
 ['Backgrounds','Full colour on white or stone. White wordmark version on charcoal and photos.',true],
 ['Don’t','Recolour the oval, stretch the lockup, add effects, or separate the mark from the wordmark.',false]]){
  const c=al('VERTICAL',{name:t}); c.itemSpacing=8; c.paddingTop=c.paddingBottom=c.paddingLeft=c.paddingRight=24; fill(c, ok?'bg/subtle':'bg/brand-tint'); radius(c,'radius/lg');
  rules.appendChild(c); c.layoutSizingHorizontal='FILL';
  c.appendChild(await text(t,'Heading/Small', ok?'text/primary':'text/brand'));
  c.appendChild(await text(b,'Body/Small','text/secondary',{width:240}));
  c.children[1].layoutSizingHorizontal='FILL';
}

// ---------- Colour ----------
const colour=section('Colour','bg/subtle');
await head(colour,'Colour','Phoenix red, used with intent','Red is for action and emphasis: buttons, key numbers, the accent word in a headline. Charcoal and white carry everything else. Avoid large red areas except one full-width band per page.');
const groups=[
 ['Brand',[['red/500','#E31B24','Phoenix red','Buttons, links, accents'],['red/700','#B8121B','Red deep','Hover and pressed'],['red/50','#FDECEC','Red tint','Icon wells, warnings'],['red/300','#FF5A60','Red on dark','Eyebrows on charcoal']]],
 ['Neutrals',[['charcoal/900','#232022','Ink','Headlines, dark sections'],['charcoal/700','#3F3C3D','Charcoal','Body text'],['charcoal/500','#6C6466','Muted','Captions, hints'],['charcoal/300','#CFC6C4','Input line','Field borders'],['stone/200','#E6DFDD','Line','Dividers, card borders'],['stone/100','#F5F2F1','Stone','Alternate sections'],['white','#FFFFFF','Paper','Page background']]],
 ['Status',[['green/700','#1B6B35','Delivered','Status text'],['green/50','#E5F4EA','Delivered tint','Status pill'],['amber/800','#7A5800','Example','Sample-data label'],['yellow/400','#FFCF33','Hazard','Dangerous goods icon']]]];
for (const [g,list] of groups){
  const gr=al('VERTICAL',{name:g}); gr.itemSpacing=16; colour.appendChild(gr); gr.layoutSizingHorizontal='FILL';
  gr.appendChild(await text(g,'Mono/Eyebrow','text/muted'));
  const row=al('HORIZONTAL',{name:g+' swatches'}); row.itemSpacing=16; row.layoutWrap='WRAP'; row.counterAxisSpacing=16; gr.appendChild(row); row.layoutSizingHorizontal='FILL';
  for (const [v,h,n,use] of list){
    const card=al('VERTICAL',{name:v}); card.itemSpacing=0; fill(card,'bg/page'); radius(card,'radius/lg'); stroke(card,'border/default'); card.clipsContent=true;
    card.counterAxisSizingMode='FIXED'; card.resize(168,10); row.appendChild(card);
    const sw=figma.createRectangle(); sw.name='Swatch'; sw.resize(168,104); sw.fills=[figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',V(v))]; card.appendChild(sw); sw.layoutSizingHorizontal='FILL';
    const meta=al('VERTICAL',{name:'Meta'}); meta.itemSpacing=2; meta.paddingTop=meta.paddingBottom=14; meta.paddingLeft=meta.paddingRight=14; card.appendChild(meta); meta.layoutSizingHorizontal='FILL';
    meta.appendChild(await text(n,'Heading/Small','text/primary'));
    meta.appendChild(await text(h+' · '+v,'Mono/Tag','text/muted'));
    const u=await text(use,'Body/Small','text/muted',{width:140}); meta.appendChild(u); u.layoutSizingHorizontal='FILL';
  }
}
colour.appendChild(await text('Contrast: red #E31B24 on white is 4.7:1 (AA for all text). White on red passes AA for 16 px semibold buttons. Never set muted grey text on stone below 15 px.','Body/Small','text/secondary',{width:900}));

// ---------- Typography ----------
const type=section('Typography');
await head(type,'Typography','Condensed, confident headlines','Anton comes from the brand deck and is always uppercase. Jost stands in for Futura in body copy. IBM Plex Mono carries labels and anything a scanner would read: consignment numbers, scan events, eyebrows.');
const specimens=[
 ['Display/Hero','Freight handled like it’s our own','Anton · 96/94 · uppercase · hero only'],
 ['Display/H2','From the container to the doorstep','Anton · 60/59 · uppercase · section titles'],
 ['Display/H3','Talk to us','Anton · 32/32 · uppercase · card titles, CTA band'],
 ['Display/Stat','55,000','Anton · 44 · tabular figures · proof numbers'],
 ['Heading/Card','Warehousing & 3PL','Jost SemiBold · 20/26 · card and step titles'],
 ['Body/Lede','Every shipment follows the same steps, and each one leaves a record you can check.','Jost Regular · 20/31 · section intros, max 60ch'],
 ['Body/Default','Receiving, storage, sorting, inventory handling and distribution from our depots, scanned in and out at every move.','Jost Regular · 17/27 · running text'],
 ['Label/Button','Get a quote','Jost SemiBold · 16 · buttons'],
 ['Mono/Eyebrow','How it works','IBM Plex Mono Medium · 12 · +12% tracking · uppercase'],
 ['Mono/Data','PGL000123456','IBM Plex Mono Medium · 17 · consignment numbers'],
 ['Chinese/Display','中澳之间，值得信赖的物流桥梁','Noto Sans SC Black · 56/64 · Chinese headlines']];
for (const [st,sample,spec] of specimens){
  const row=al('HORIZONTAL',{name:st}); row.itemSpacing=40; row.paddingTop=row.paddingBottom=24; row.counterAxisAlignItems='CENTER';
  row.strokes=[paint('border/default')]; row.strokeTopWeight=1; row.strokeBottomWeight=0; row.strokeLeftWeight=0; row.strokeRightWeight=0;
  type.appendChild(row); row.layoutSizingHorizontal='FILL';
  const m=al('VERTICAL',{name:'Spec'}); m.itemSpacing=4; row.appendChild(m); m.counterAxisSizingMode='FIXED'; m.resize(300,10);
  m.appendChild(await text(st,'Heading/Small','text/primary'));
  const sp=await text(spec,'Mono/Tag','text/muted',{width:300}); m.appendChild(sp);
  const s=await text(sample, st, 'text/primary',{width:900}); row.appendChild(s); s.layoutSizingHorizontal='FILL';
}

// ---------- Spacing & radius ----------
const spacing=section('Spacing & shape','bg/subtle');
await head(spacing,'Spacing & shape','A 4-point scale','Gaps and padding come from this scale. Sections breathe at 120 px on desktop, 64 px on phones. Corners stay tight: 6 px for controls, 8 px for cards, full round only for pills and chips.');
const scale=al('VERTICAL',{name:'Spacing scale'}); scale.itemSpacing=12; spacing.appendChild(scale);
for (const [n,v] of [['xs',4],['sm',8],['md',12],['lg',16],['xl',24],['2xl',32],['3xl',48],['4xl',64],['section',120]]){
  const r=al('HORIZONTAL',{name:'space/'+n}); r.itemSpacing=20; r.counterAxisAlignItems='CENTER'; scale.appendChild(r);
  const lab=await text('space/'+n+' · '+v,'Mono/Tag','text/secondary',{width:160}); r.appendChild(lab);
  const bar=figma.createRectangle(); bar.name='bar'; bar.resize(v*4,16); fill(bar,'bg/brand'); bar.cornerRadius=2; r.appendChild(bar);
}
const radii=al('HORIZONTAL',{name:'Radius'}); radii.itemSpacing=24; spacing.appendChild(radii);
for (const [n,v,use] of [['radius/sm',4,'Tags'],['radius/md',6,'Buttons, inputs'],['radius/lg',8,'Cards, panels'],['radius/full',999,'Pills, chips']]){
  const c=al('VERTICAL',{name:n}); c.itemSpacing=10; c.counterAxisAlignItems='CENTER'; radii.appendChild(c);
  const sq=figma.createRectangle(); sq.resize(120,80); fill(sq,'bg/page'); stroke(sq,'border/strong',2); radius(sq,n); c.appendChild(sq);
  c.appendChild(await text(n+' · '+(v>99?'full':v),'Mono/Tag','text/secondary'));
  c.appendChild(await text(use,'Body/Small','text/muted'));
}

// ---------- Voice & imagery ----------
const voice=section('Voice & imagery','bg/inverse');
await head(voice,'Voice & imagery','Plain, practical, hands-on', 'We sound like the family that runs the depot: direct, warm and specific. We show real freight, our own trucks and our own floor.', true);
const cols=al('HORIZONTAL',{name:'Principles'}); cols.itemSpacing=24; voice.appendChild(cols); cols.layoutSizingHorizontal='FILL';
for (const [t,b] of [
 ['Say what happens','“Track shipment”, “Get a quote”, “Signed for”. Name the action, not the system.'],
 ['Use real numbers','55,000 boxes a month beats “high volume”. Mark approximate figures as approximate.'],
 ['Claim only what’s true','Amazon lists us as a carrier; it doesn’t endorse anyone. Say “listed by”, never “official”.'],
 ['Real photos only','Our depot, fleet and pallets. Dark overlay on hero photos, no stock imagery, no illustrations of people.']]){
  const c=al('VERTICAL',{name:t}); c.itemSpacing=10; c.paddingTop=c.paddingBottom=c.paddingLeft=c.paddingRight=24; c.fills=[{type:'SOLID',color:{r:1,g:1,b:1},opacity:0.06}]; radius(c,'radius/lg');
  cols.appendChild(c); c.layoutSizingHorizontal='FILL';
  c.appendChild(await text(t,'Heading/Small','text/on-dark'));
  const tb=await text(b,'Body/Small','text/on-dark',{width:240}); tb.opacity=0.8; c.appendChild(tb); tb.layoutSizingHorizontal='FILL';
}
return {boardId: board.id, logoSlots, sections: board.children.map(c=>c.name)};
