// Phoenix foundations: variables (primitives, color semantics, spacing, radius), text styles, effect styles. Idempotent.
function hex(h){const c=h.replace('#','');return{r:parseInt(c.slice(0,2),16)/255,g:parseInt(c.slice(2,4),16)/255,b:parseInt(c.slice(4,6),16)/255};}
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const allVars = await figma.variables.getLocalVariablesAsync();
function coll(name){let c=cols.find(x=>x.name===name); if(!c){c=figma.variables.createVariableCollection(name); c.renameMode(c.modes[0].modeId,'Value'); cols.push(c);} return c;}
function upsert(c,name,type,value,scopes,css){
  let v=allVars.find(x=>x.variableCollectionId===c.id&&x.name===name);
  if(!v){v=figma.variables.createVariable(name,c,type); allVars.push(v);}
  v.setValueForMode(c.modes[0].modeId,value); v.scopes=scopes; v.setVariableCodeSyntax('WEB',`var(${css})`); return v;
}
const prim=coll('Primitives'), color=coll('Color'), space=coll('Spacing'), radius=coll('Radius');
const P={
 'red/500':'#E31B24','red/700':'#B8121B','red/50':'#FDECEC','red/300':'#FF5A60',
 'charcoal/900':'#232022','charcoal/700':'#3F3C3D','charcoal/500':'#6C6466','charcoal/300':'#CFC6C4',
 'stone/100':'#F5F2F1','stone/200':'#E6DFDD','white':'#FFFFFF',
 'green/50':'#E5F4EA','green/700':'#1B6B35','amber/50':'#FFF4D6','amber/800':'#7A5800','yellow/400':'#FFCF33'};
const pv={};
for(const [n,h] of Object.entries(P)) pv[n]=upsert(prim,n,'COLOR',hex(h),[],'--p-'+n.replace('/','-'));
const A=n=>figma.variables.createVariableAlias(pv[n]);
const BG=['FRAME_FILL','SHAPE_FILL'], TX=['TEXT_FILL'], ST=['STROKE_COLOR'], IC=['SHAPE_FILL','STROKE_COLOR'];
const S=[
 ['bg/page','white',BG,'--paper'],['bg/subtle','stone/100',BG,'--stone'],['bg/inverse','charcoal/900',BG,'--ink'],
 ['bg/brand','red/500',BG,'--red'],['bg/brand-hover','red/700',BG,'--red-deep'],['bg/brand-tint','red/50',BG,'--red-tint'],
 ['bg/success','green/50',BG,'--success-bg'],['bg/example','amber/50',BG,'--example-bg'],
 ['text/primary','charcoal/900',TX,'--ink'],['text/secondary','charcoal/700',TX,'--char'],['text/muted','charcoal/500',TX,'--muted'],
 ['text/brand','red/500',TX,'--red'],['text/on-dark','white',TX,'--paper'],['text/on-dark-accent','red/300',TX,'--red-on-dark'],
 ['text/success','green/700',TX,'--success'],['text/example','amber/800',TX,'--example'],
 ['border/default','stone/200',ST,'--line'],['border/input','charcoal/300',ST,'--input-line'],['border/strong','charcoal/900',ST,'--ink'],['border/brand','red/500',ST,'--red'],
 ['icon/brand','red/500',IC,'--red'],['icon/hazard','yellow/400',IC,'--hazard'],['icon/inverse','white',IC,'--paper']];
const sv={};
for(const [n,p,sc,css] of S) sv[n]=upsert(color,n,'COLOR',A(p),sc,css);
const sp={};
for(const [n,v] of [['xs',4],['sm',8],['md',12],['lg',16],['xl',24],['2xl',32],['3xl',48],['4xl',64],['section',120]]) sp[n]=upsert(space,'space/'+n,'FLOAT',v,['GAP'],'--space-'+n);
const rd={};
for(const [n,v] of [['sm',4],['md',6],['lg',8],['full',999]]) rd[n]=upsert(radius,'radius/'+n,'FLOAT',v,['CORNER_RADIUS'],'--radius-'+n);

// Fonts: verify and pick closest available styles
const fonts=await figma.listAvailableFontsAsync();
const has=(f,s)=>fonts.some(x=>x.fontName.family===f&&x.fontName.style===s);
function pick(f,prefs,fb){for(const s of prefs) if(has(f,s)) return {family:f,style:s}; return fb;}
const INTER_R={family:'Inter',style:'Regular'}, INTER_B={family:'Inter',style:'Bold'};
const F={
 display: pick('Anton',['Regular'],INTER_B),
 body: pick('Jost',['Regular'],INTER_R), bodyM: pick('Jost',['Medium'],{family:'Inter',style:'Medium'}),
 bodySB: pick('Jost',['SemiBold','Semi Bold'],{family:'Inter',style:'Semi Bold'}),
 mono: pick('IBM Plex Mono',['Regular'],{family:'Roboto Mono',style:'Regular'}), monoM: pick('IBM Plex Mono',['Medium'],{family:'Roboto Mono',style:'Medium'}),
 zh: pick('Noto Sans SC',['Black','Bold'],INTER_B)};
for(const f of Object.values(F)) await figma.loadFontAsync(f);
const T=[
 ['Display/Hero',F.display,96,94,0.5,'UPPER'],['Display/H2',F.display,60,59,0.3,'UPPER'],['Display/H3',F.display,32,32,0.2,'UPPER'],['Display/Stat',F.display,44,44,0,'ORIGINAL'],
 ['Heading/Card',F.bodySB,20,26,0,'ORIGINAL'],['Heading/Small',F.bodySB,17,22,0,'ORIGINAL'],
 ['Body/Lede',F.body,20,31,0,'ORIGINAL'],['Body/Default',F.body,17,27,0,'ORIGINAL'],['Body/Small',F.body,15,23,0,'ORIGINAL'],
 ['Label/Button',F.bodySB,16,16,0.16,'ORIGINAL'],['Label/Field',F.bodySB,14,18,0,'ORIGINAL'],
 ['Mono/Eyebrow',F.monoM,12,16,1.44,'UPPER'],['Mono/Tag',F.mono,11.5,16,0.5,'ORIGINAL'],['Mono/Data',F.monoM,17,22,0.7,'ORIGINAL'],
 ['Chinese/Display',F.zh,56,64,0,'ORIGINAL']];
const existingTS=await figma.getLocalTextStylesAsync(); const ts={};
for(const [n,f,size,lh,ls,cs] of T){let s=existingTS.find(x=>x.name===n)||figma.createTextStyle(); s.name=n; s.fontName=f; s.fontSize=size; s.lineHeight={unit:'PIXELS',value:lh}; s.letterSpacing={unit:'PIXELS',value:ls}; s.textCase=cs; ts[n]=s.id;}
const existingES=await figma.getLocalEffectStylesAsync(); const es={};
for(const [n,eff] of [
 ['Shadow/Card',[{type:'DROP_SHADOW',color:{r:0,g:0,b:0,a:0.6},offset:{x:0,y:30},radius:60,spread:-30,visible:true,blendMode:'NORMAL'}]],
 ['Shadow/Header',[{type:'DROP_SHADOW',color:{r:35/255,g:32/255,b:34/255,a:0.5},offset:{x:0,y:6},radius:24,spread:-18,visible:true,blendMode:'NORMAL'}]]]){
 let s=existingES.find(x=>x.name===n)||figma.createEffectStyle(); s.name=n; s.effects=eff; es[n]=s.id;}
return {collections:[prim.id,color.id,space.id,radius.id], counts:{prim:Object.keys(pv).length,color:Object.keys(sv).length,space:Object.keys(sp).length,radius:Object.keys(rd).length},
 fonts:F, textStyles:ts, effectStyles:es};
