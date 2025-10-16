import React, { useEffect, useMemo, useState } from "react";
// v0.4.2 — fixes card font color contrast
function useMinimalCSS() {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'ready72-mincss';
    style.textContent = `
      html, body, #root { height: 100%; }
      body { margin: 0; background: #020817; color: #FFFFFF; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; }
      .r72-card-title { color: #FFFFFF; }
      .r72-card-blurb { color: #CBD5E1; }
      .r72-card-list li { color: #E5E7EB; }
    `;
    document.head.appendChild(style);
    return () => { const el = document.getElementById('ready72-mincss'); if (el) el.remove(); };
  }, []);
}
const HA={bg:"#020817",surface:"#0B1220",border:"#1E293B",text:"#FFFFFF",muted:"#94A3B8",accent:"#F97316"};
const Shell=({title,children})=>{useMinimalCSS();return <div style={{minHeight:'100vh',backgroundColor:HA.bg,color:HA.text}}><header style={{borderBottom:`1px solid ${HA.border}`,padding:'12px 16px',fontWeight:600}}><span style={{color:HA.accent}}>GoBag:</span> Ready72 · {title}</header><main style={{padding:'24px 16px'}}>{children}</main></div>};
const Card=({children})=><div style={{border:`1px solid ${HA.border}`,borderRadius:16,background:HA.surface,padding:16,marginBottom:12}}>{children}</div>;
const GradientBar=()=> <div style={{height:6,borderRadius:9999,background:`linear-gradient(90deg,#22C55E,#EAB308,#EF4444)`}}/>;
const AdvisorChat=({lines})=><Card><div style={{fontSize:12,color:HA.muted,textTransform:'uppercase',marginBottom:8}}>HazAssist · System Advisor</div>{lines.map((l,i)=><div key={i} style={{background:HA.bg,border:`1px solid ${HA.border}`,borderRadius:10,padding:'6px 8px',marginBottom:4}}>{l}</div>)}</Card>;
const PERSONA=[{key:'EC',title:'Everyday Civilian',cash:300,blurb:'Older store-bought kit. Some parts may be missing. You learn as you go.',stats:['Start level: about ten to twenty percent of the standard','Bag weight goal: about one tenth of your body weight','Morale: low at first, improves after small wins']},{key:'PR',title:'Prepper',cash:150,blurb:'Fitter but often carries too much. Strong early. Slows down later.',stats:['Start level: about sixty to seventy percent of the standard','Bag weight goal: about one sixth to one fifth of your body weight','Carrying too much can slow your travel speed']}];
export default function Ready72WireframesV042(){const[picked,setPicked]=useState(null);return <Shell title="Scene 1 · Choose your profile"><div style={{display:'flex',gap:20}}><AdvisorChat lines={['Choose a profile or let the system pick for you.','Everyday Civilian starts with more cash and less gear.','Prepper starts with more gear and less cash.']}/><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,flex:2}}>{PERSONA.map(p=><button key={p.key} onClick={()=>setPicked(p.key)} style={{textAlign:'left',border:`1px solid ${picked===p.key?HA.accent:HA.border}`,borderRadius:16,background:HA.surface,padding:16}}><div className="r72-card-title" style={{fontSize:18,fontWeight:600}}>{p.title}</div><div className="r72-card-blurb" style={{fontSize:14,marginTop:4}}>{p.blurb}</div><div style={{fontSize:12,textTransform:'uppercase',color:HA.muted,marginTop:8}}>What to expect</div><ul className="r72-card-list" style={{fontSize:14,marginTop:6,paddingLeft:18}}>{p.stats.map((s,i)=><li key={i}>{s}</li>)}</ul><div style={{marginTop:10,display:'flex',alignItems:'center',justifyContent:'space-between'}}><GradientBar/><div style={{fontSize:14,fontWeight:600,marginLeft:8}}>Cash on hand: ${p.cash}</div></div></button>)}</div></div><div style={{marginTop:16,display:'flex',justifyContent:'space-between'}}><button style={{border:`1px solid ${HA.border}`,borderRadius:8,padding:'8px 12px',background:'transparent',color:HA.text}}>Pick for me</button><button disabled={!picked} style={{borderRadius:8,padding:'8px 12px',background:picked?HA.accent:HA.border,color:HA.text,opacity:picked?1:0.5}}>Continue</button></div></Shell>;}
