import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter';
import '@fontsource-variable/oswald';
import '@fontsource/sawarabi-mincho/latin-400.css';
import '@fontsource/dm-serif-display/400.css';
import { Design } from './design';
import './style.css';
import './picker.css';

const pages=import.meta.glob('./data/{home,services,tracking,contact,about,why}.json',{import:'default'});
const variants=[['Directional','directional'],['Crossfade','crossfade'],['Instant','instant']];
const query=new URLSearchParams(location.search);
const requested=query.get('page');
const page=Object.hasOwn(pages,'./data/'+requested+'.json')?requested:'home';
const loadTree=pages['./data/'+page+'.json'];
const compare=page==='why'&&query.get('compare')==='motion';
document.title=({home:'Phoenix Global Logistics',services:'Amazon FBA inbound & prep',tracking:'Track your shipment',contact:'Request a freight quote',about:'About Phoenix',why:'Why Phoenix'})[page];

function Picker({index,setIndex,replay}){
 const picker=useRef(null),highlight=useRef(null),buttons=useRef([]);
 useLayoutEffect(()=>{
   const move=()=>{const el=buttons.current[index];highlight.current.style.width=el.offsetWidth+'px';highlight.current.style.transform='translateX('+el.offsetLeft+'px)'};
   move();const observer=new ResizeObserver(move);observer.observe(picker.current);return ()=>observer.disconnect();
 },[index]);
 useEffect(()=>{
   const el=picker.current;
   requestAnimationFrame(()=>requestAnimationFrame(()=>el.setAttribute('data-ready','')));
 },[]);
 useEffect(()=>{
   const key=e=>{
     if(e.target.closest?.('input, textarea, select, [contenteditable]')||e.metaKey||e.ctrlKey||e.altKey)return;
     const num=Number(e.key);
     if(num>=1&&num<=variants.length)setIndex(num-1);
     else if(e.key==='ArrowRight')setIndex((index+1)%variants.length);
     else if(e.key==='ArrowLeft')setIndex((index+variants.length-1)%variants.length);
     else if(e.key.toLowerCase()==='r')replay();
   };
   window.addEventListener('keydown',key);return ()=>window.removeEventListener('keydown',key);
 },[index,setIndex,replay]);
 return <nav className="proto-picker" aria-label="Prototype variants" ref={picker}>
   <span className="proto-picker-highlight" aria-hidden="true" ref={highlight}/>
   {variants.map(([name],i)=><button type="button" className="proto-picker-item" key={name} data-active={i===index?'':undefined} aria-current={i===index?'true':undefined} ref={node=>{buttons.current[i]=node}} onClick={()=>setIndex(i)}>{name}</button>)}
   <span className="proto-picker-divider" aria-hidden="true"/>
   <button type="button" className="proto-picker-item proto-picker-replay" aria-label="Replay animation (R)" onClick={replay}>↻</button>
 </nav>;
}

function App({tree}){
 const [variant,setVariant]=useState(()=>Math.min(variants.length-1,Math.max(0,(Number(query.get('v'))||1)-1)));
 const [replay,setReplay]=useState(0);
 const [scale,setScale]=useState(()=>Math.min(1,window.innerWidth/1440));
 useEffect(()=>{const handle=()=>setScale(Math.min(1,document.documentElement.clientWidth/1440));handle();window.addEventListener('resize',handle);return ()=>window.removeEventListener('resize',handle)},[]);
 useEffect(()=>{if(compare){const url=new URL(location.href);url.searchParams.set('v',String(variant+1));history.replaceState(null,'',url)}},[variant]);
 return <div className="prototype-shell" style={{'--desktop-scale':scale}}>
   <Design tree={tree} page={page} key={variant} motion={variants[compare?variant:0][1]} replay={replay}/>
   {compare&&<Picker index={variant} setIndex={setVariant} replay={()=>setReplay(i=>i+1)}/>}
 </div>;
}
const root=createRoot(document.getElementById('root'));
let active=true;
loadTree().then(tree=>{if(active)root.render(<App tree={tree}/>)}).catch(()=>{if(active)root.render(<p>The prototype could not load. <a href="./">Reload the page</a>.</p>)});
if(import.meta.hot)import.meta.hot.dispose(()=>{active=false;root.unmount()});
