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
// Atoms: icons, Button, Input, Chip, Tag, Status pill, Tab, Eyebrow. Placed in a "Phoenix · Components" board.
let board = figma.currentPage.findChild(n=>n.name==='Phoenix · Components');
if (board) return {status:'exists', id: board.id};
const sg = figma.currentPage.findChild(n=>n.name==='Phoenix · Style guide');
board = figma.createFrame(); board.name='Phoenix · Components'; fill(board,'bg/subtle');
board.x = sg ? sg.x + sg.width + 200 : rightmostX()+200; board.y = 0; board.resize(1600, 3200);
const out = {sets:{}, comps:{}};
let cursorY = 96;
async function label(t, y){ const tx=await text(t,'Mono/Eyebrow','text/brand'); board.appendChild(tx); tx.x=80; tx.y=y; return tx; }
await (async()=>{ const h=await text('Components','Display/H2','text/primary'); board.appendChild(h); h.x=80; h.y=cursorY; cursorY+=110;
  const d=await text('Main components for the website. Every fill, stroke, gap, padding and corner is bound to the Phoenix variables. Use instances; don’t detach.','Body/Lede','text/secondary',{width:900}); board.appendChild(d); d.x=80; d.y=cursorY; cursorY+=110; })();

function place(node, x, y){ board.appendChild(node); node.x=x; node.y=y; }
function grid(set, cols, gapX=24, gapY=24){
  const kids=set.children; let x=0,y=0,rowH=0,maxW=0;
  kids.forEach((k,i)=>{ if(i%cols===0 && i>0){ y+=rowH+gapY; x=0; rowH=0; } k.x=x+24; k.y=y+24; x+=k.width+gapX; rowH=Math.max(rowH,k.height); maxW=Math.max(maxW,x); });
  set.resize(maxW+24, y+rowH+48); set.fills=[]; stroke(set,'border/brand'); set.dashPattern=[6,4]; radius(set,'radius/lg');
}

// ---------- Icons ----------
const ICONS={
 'Truck':'<svg viewBox="0 0 48 48" fill="none" stroke="#E31B24" stroke-width="2.4" stroke-linejoin="round"><path d="M4 12h24v22H4zM28 19h8l7 7v8H28z"/><circle cx="12" cy="36" r="4" fill="#fff"/><circle cx="36" cy="36" r="4" fill="#fff"/></svg>',
 'Warehouse':'<svg viewBox="0 0 48 48" fill="none" stroke="#E31B24" stroke-width="2.4" stroke-linejoin="round"><path d="M4 18L24 6l20 12v24H4z"/><path d="M12 42V24h24v18M12 30h24M12 36h24"/></svg>',
 'Parcel':'<svg viewBox="0 0 48 48" fill="none" stroke="#E31B24" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"><path d="M6 14l18-8 18 8v20l-18 8-18-8z"/><path d="M6 14l18 8 18-8M24 22v20"/></svg>',
 'Globe':'<svg viewBox="0 0 48 48" fill="none" stroke="#E31B24" stroke-width="2.4" stroke-linejoin="round"><circle cx="24" cy="24" r="18"/><path d="M6 24h36M24 6c6 6 6 30 0 36M24 6c-6 6-6 30 0 36"/></svg>',
 'Document':'<svg viewBox="0 0 48 48" fill="none" stroke="#E31B24" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"><path d="M12 4h18l8 8v32H12z"/><path d="M30 4v8h8M18 22h14M18 29h14M18 36h8"/></svg>',
 'Pin':'<svg viewBox="0 0 48 48" fill="none" stroke="#E31B24" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"><path d="M24 44s14-12 14-24a14 14 0 10-28 0c0 12 14 24 14 24z"/><path d="M18 18l6-3 6 3v7l-6 3-6-3z"/></svg>',
 'Container':'<svg viewBox="0 0 48 48" fill="none" stroke="#E31B24" stroke-width="2.4" stroke-linejoin="round"><path d="M4 10h40v28H4z"/><path d="M12 10v28M20 10v28M28 10v28M36 10v28"/></svg>',
 'Hazard':'<svg viewBox="0 0 48 48" fill="none" stroke="#E31B24" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"><path d="M24 3l21 21-21 21L3 24z"/><path d="M26 14l-6 11h8l-6 11"/></svg>'};
await label('Icons · 48 px · stroke 2.4', cursorY); cursorY+=36;
let ix=80;
for (const [n,svg] of Object.entries(ICONS)){
  const node=figma.createNodeFromSvg(svg);
  const c=figma.createComponent(); c.name='Icon/'+n; c.resize(48,48); c.fills=[];
  for (const ch of [...node.children]) c.appendChild(ch);
  node.remove();
  c.findAll(x=>'strokes' in x && x.strokes.length>0).forEach(x=>{ x.strokes=[paint('icon/brand')]; });
  c.description='Outline icon. Colour follows icon/brand; swap to icon/inverse or icon/hazard on dark cards.';
  place(c, ix, cursorY); out.comps['Icon/'+n]=c.id; ix+=80;
}
cursorY+=48+72;

// ---------- Button ----------
await label('Button', cursorY); cursorY+=36;
const btnVariants=[];
const BV={Primary:{bg:'bg/brand',hover:'bg/brand-hover',fg:'text/on-dark',st:'border/brand'},
          Secondary:{bg:null,hover:'bg/inverse',fg:'text/primary',hfg:'text/on-dark',st:'border/strong'},
          'On dark':{bg:'bg/page',hover:null,fg:'text/brand',hfg:'text/on-dark',st:'border/default'}};
for (const v of Object.keys(BV)) for (const size of ['Default','Small']) for (const state of ['Default','Hover']){
  const c=figma.createComponent(); c.name=`Variant=${v}, Size=${size}, State=${state}`;
  c.layoutMode='HORIZONTAL'; c.primaryAxisSizingMode='AUTO'; c.counterAxisSizingMode='FIXED'; c.resize(100, size==='Default'?48:40);
  c.primaryAxisAlignItems='CENTER'; c.counterAxisAlignItems='CENTER';
  bindNum(c,'paddingLeft', size==='Default'?'xl':'lg'); bindNum(c,'paddingRight', size==='Default'?'xl':'lg'); bindNum(c,'itemSpacing','sm'); radius(c,'radius/md');
  const cfg=BV[v]; const hover=state==='Hover';
  const bgv = hover ? cfg.hover : cfg.bg;
  if (bgv) fill(c,bgv); else c.fills=[];
  if (v==='On dark' && hover) { c.fills=[]; c.strokes=[{type:'SOLID',color:{r:1,g:1,b:1}}]; c.strokeWeight=2; c.strokeAlign='INSIDE'; }
  else stroke(c, hover && cfg.hover ? (v==='Primary'?'bg/brand-hover':'border/strong') : cfg.st, 2);
  if (v==='Primary' && hover) c.strokes=[paint('bg/brand-hover')];
  const t=await text('Get a quote','Label/Button', hover && cfg.hfg ? cfg.hfg : cfg.fg, {name:'Label'});
  if (size==='Small') t.fontSize=15;
  c.appendChild(t); btnVariants.push(c);
}
const btnSet=figma.combineAsVariants(btnVariants, board); btnSet.name='Button';
const btnLabelKey=btnSet.addComponentProperty('Label','TEXT','Get a quote');
for (const c of btnSet.children) { const t=c.findOne(n=>n.name==='Label'); t.componentPropertyReferences={characters:btnLabelKey}; }
grid(btnSet,4); btnSet.x=80; btnSet.y=cursorY;
btnSet.description='Primary for the main action on a view (Get a quote, Track shipment). Secondary for the alternative. On dark sits on red or charcoal bands. One primary per group.';
out.sets.Button=btnSet.id; cursorY+=btnSet.height+72;

// ---------- Input ----------
await label('Text field', cursorY); cursorY+=36;
const inVariants=[];
for (const type of ['Text','Consignment']) for (const state of ['Default','Focus','Error']){
  const c=figma.createComponent(); c.name=`Type=${type}, State=${state}`;
  c.layoutMode='VERTICAL'; c.primaryAxisSizingMode='AUTO'; c.counterAxisSizingMode='FIXED'; c.resize(360,10); c.itemSpacing=6; c.fills=[];
  const lab=await text(type==='Consignment'?'Consignment number':'Pick-up suburb','Label/Field','text/secondary',{name:'Label'}); c.appendChild(lab);
  const box=al('HORIZONTAL',{name:'Box'}); c.appendChild(box); box.layoutSizingHorizontal='FILL'; box.counterAxisSizingMode='FIXED'; box.resize(360,50);
  box.counterAxisAlignItems='CENTER'; bindNum(box,'paddingLeft','md'); bindNum(box,'paddingRight','md'); fill(box,'bg/page'); radius(box,'radius/md');
  stroke(box, state==='Default'?'border/input': state==='Focus'?'border/strong':'border/brand', 1.5);
  if (state==='Focus') box.effects=[{type:'DROP_SHADOW',color:{r:227/255,g:27/255,b:36/255,a:0.18},offset:{x:0,y:0},radius:0,spread:3,visible:true,blendMode:'NORMAL'}];
  const ph=await text(type==='Consignment'?'E.G. PGL000123456':'Wetherill Park NSW', type==='Consignment'?'Mono/Data':'Body/Default', state==='Default'?'text/muted':'text/primary',{name:'Value'});
  if (type==='Consignment') ph.fontSize=15;
  box.appendChild(ph);
  const hint=await text(state==='Error'?'Enter your consignment number to track it.':'It’s on your booking confirmation.', 'Body/Small', state==='Error'?'text/brand':'text/muted',{name:'Hint'});
  c.appendChild(hint); inVariants.push(c);
}
const inSet=figma.combineAsVariants(inVariants, board); inSet.name='Text field';
const kL=inSet.addComponentProperty('Label','TEXT','Consignment number');
const kV=inSet.addComponentProperty('Value','TEXT','E.G. PGL000123456');
const kH=inSet.addComponentProperty('Hint','TEXT','It’s on your booking confirmation.');
const kShowHint=inSet.addComponentProperty('Show hint','BOOLEAN',true);
for (const c of inSet.children){ c.findOne(n=>n.name==='Label').componentPropertyReferences={characters:kL}; c.findOne(n=>n.name==='Value').componentPropertyReferences={characters:kV}; c.findOne(n=>n.name==='Hint').componentPropertyReferences={characters:kH, visible:kShowHint}; }
grid(inSet,3); inSet.x=80; inSet.y=cursorY;
inSet.description='Label above, hint below. Consignment type uses mono uppercase. Error replaces the hint with a fix-it message in red.';
out.sets['Text field']=inSet.id; cursorY+=inSet.height+72;

// ---------- Small parts row: Chip, Tag, Status pill, Tab ----------
await label('Chip · Tag · Status pill · Tab', cursorY); cursorY+=36;
let rx=80;
// Chip
const chipV=[];
for (const sel of ['False','True']){
  const c=figma.createComponent(); c.name='Selected='+sel; c.layoutMode='HORIZONTAL'; c.primaryAxisSizingMode='AUTO'; c.counterAxisSizingMode='FIXED'; c.resize(100,40);
  c.counterAxisAlignItems='CENTER'; bindNum(c,'paddingLeft','lg'); bindNum(c,'paddingRight','lg'); radius(c,'radius/full');
  if (sel==='True'){ fill(c,'bg/inverse'); stroke(c,'border/strong',1.5); } else { fill(c,'bg/page'); stroke(c,'border/input',1.5); }
  const t=await text('Road freight','Body/Small', sel==='True'?'text/on-dark':'text/primary',{name:'Label'}); c.appendChild(t); chipV.push(c);
}
const chipSet=figma.combineAsVariants(chipV, board); chipSet.name='Chip'; const kc=chipSet.addComponentProperty('Label','TEXT','Road freight');
for (const c of chipSet.children) c.findOne(n=>n.name==='Label').componentPropertyReferences={characters:kc};
grid(chipSet,2); chipSet.x=rx; chipSet.y=cursorY; rx+=chipSet.width+40; chipSet.description='Multi-select service picker in the quote form.'; out.sets.Chip=chipSet.id;
// Tag
const tagV=[];
for (const tone of ['Light','Dark']){
  const c=figma.createComponent(); c.name='Tone='+tone; c.layoutMode='HORIZONTAL'; c.primaryAxisSizingMode='AUTO'; c.counterAxisSizingMode='AUTO';
  c.paddingTop=c.paddingBottom=3; bindNum(c,'paddingLeft','sm'); bindNum(c,'paddingRight','sm'); radius(c,'radius/sm');
  if (tone==='Light') fill(c,'bg/subtle'); else c.fills=[{type:'SOLID',color:{r:1,g:1,b:1},opacity:0.1}];
  const t=await text('Linehaul','Mono/Tag', tone==='Light'?'text/secondary':'text/on-dark',{name:'Label'}); c.appendChild(t); tagV.push(c);
}
const tagSet=figma.combineAsVariants(tagV, board); tagSet.name='Tag'; const kt=tagSet.addComponentProperty('Label','TEXT','Linehaul');
for (const c of tagSet.children) c.findOne(n=>n.name==='Label').componentPropertyReferences={characters:kt};
grid(tagSet,2); tagSet.fills=[]; tagSet.x=rx; tagSet.y=cursorY; rx+=tagSet.width+40; tagSet.description='Capability keywords under a service card.'; out.sets.Tag=tagSet.id;
// Status pill
const pillV=[];
for (const [s,bg,fg,lab] of [['Delivered','bg/success','text/success','Delivered'],['Example','bg/example','text/example','EXAMPLE OF WHAT YOU’LL SEE']]){
  const c=figma.createComponent(); c.name='Status='+s; c.layoutMode='HORIZONTAL'; c.primaryAxisSizingMode='AUTO'; c.counterAxisSizingMode='AUTO';
  c.counterAxisAlignItems='CENTER'; c.paddingTop=c.paddingBottom=4; bindNum(c,'paddingLeft', s==='Delivered'?'md':'sm'); bindNum(c,'paddingRight', s==='Delivered'?'md':'sm'); bindNum(c,'itemSpacing','sm');
  radius(c, s==='Delivered'?'radius/full':'radius/sm'); fill(c,bg);
  if (s==='Delivered'){ const d=figma.createEllipse(); d.name='Dot'; d.resize(8,8); d.fills=[paint('text/success')]; c.appendChild(d); }
  const t=await text(lab, s==='Delivered'?'Label/Field':'Mono/Tag', fg,{name:'Label'}); c.appendChild(t); pillV.push(c);
}
const pillSet=figma.combineAsVariants(pillV, board); pillSet.name='Status pill';
grid(pillSet,2); pillSet.x=rx; pillSet.y=cursorY; rx+=pillSet.width+40; pillSet.description='Delivered for consignment status. Example labels any sample data so it’s never mistaken for a real record.'; out.sets['Status pill']=pillSet.id;
// Tab
const tabV=[];
for (const sel of ['True','False']){
  const c=figma.createComponent(); c.name='Selected='+sel; c.layoutMode='HORIZONTAL'; c.primaryAxisSizingMode='FIXED'; c.counterAxisSizingMode='AUTO'; c.resize(200,10);
  c.primaryAxisAlignItems='CENTER'; c.paddingTop=16; c.paddingBottom=13; fill(c, sel==='True'?'bg/page':'bg/subtle');
  c.strokes=[paint(sel==='True'?'border/brand':'border/default')]; c.strokeTopWeight=0; c.strokeLeftWeight=0; c.strokeRightWeight=0; c.strokeBottomWeight= sel==='True'?3:1; c.strokeAlign='INSIDE';
  const t=await text('Track a shipment','Label/Button', sel==='True'?'text/primary':'text/muted',{name:'Label'}); c.appendChild(t); tabV.push(c);
}
const tabSet=figma.combineAsVariants(tabV, board); tabSet.name='Tab'; const kb=tabSet.addComponentProperty('Label','TEXT','Track a shipment');
for (const c of tabSet.children) c.findOne(n=>n.name==='Label').componentPropertyReferences={characters:kb};
grid(tabSet,2,0); tabSet.x=rx; tabSet.y=cursorY; tabSet.description='Two-up tabs in the quick-tools card.'; out.sets.Tab=tabSet.id;
cursorY+=Math.max(chipSet.height,tagSet.height,pillSet.height,tabSet.height)+72;

// Eyebrow
await label('Eyebrow', cursorY); cursorY+=36;
const ebV=[];
for (const tone of ['Light','Dark']){
  const c=figma.createComponent(); c.name='Tone='+tone; c.layoutMode='HORIZONTAL'; c.primaryAxisSizingMode='AUTO'; c.counterAxisSizingMode='AUTO'; c.counterAxisAlignItems='CENTER'; c.itemSpacing=10;
  if (tone==='Dark') fill(c,'bg/inverse'); else c.fills=[];
  if (tone==='Dark'){ c.paddingTop=c.paddingBottom=c.paddingLeft=c.paddingRight=8; }
  const line=figma.createRectangle(); line.name='Rule'; line.resize(22,2); line.fills=[paint(tone==='Light'?'text/brand':'text/on-dark-accent')]; c.appendChild(line);
  const t=await text('How it works','Mono/Eyebrow', tone==='Light'?'text/brand':'text/on-dark-accent',{name:'Label'}); c.appendChild(t); ebV.push(c);
}
const ebSet=figma.combineAsVariants(ebV, board); ebSet.name='Eyebrow'; const ke=ebSet.addComponentProperty('Label','TEXT','How it works');
for (const c of ebSet.children) c.findOne(n=>n.name==='Label').componentPropertyReferences={characters:ke};
grid(ebSet,2); ebSet.x=80; ebSet.y=cursorY; ebSet.description='Small label above every section title.'; out.sets.Eyebrow=ebSet.id;
cursorY+=ebSet.height+72;
board.resize(1600, cursorY);
out.boardId=board.id; out.nextY=cursorY;
return out;
