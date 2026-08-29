import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import FloorPlanEditor from './components/FloorPlanEditor';
import KitchenDisplay from './components/KitchenDisplay';
import { Table, TableShape, TableStatus } from './types/table.types';

const now = new Date().toISOString();
const initialTables: Table[] = [
  { id:'t1', number:'1', floorPlanId:'demo', capacity:4, minCapacity:1, x:60, y:70, width:110, height:90, shape:TableShape.SQUARE, section:'Salon', status:TableStatus.AVAILABLE, currentOrder:null, createdAt:now, updatedAt:now },
  { id:'t2', number:'2', floorPlanId:'demo', capacity:4, minCapacity:1, x:240, y:70, width:110, height:90, shape:TableShape.SQUARE, section:'Salon', status:TableStatus.OCCUPIED, currentOrder:'o2', createdAt:now, updatedAt:now },
  { id:'t3', number:'3', floorPlanId:'demo', capacity:2, minCapacity:1, x:430, y:70, width:90, height:90, shape:TableShape.CIRCLE, section:'Ventana', status:TableStatus.RESERVED, currentOrder:null, createdAt:now, updatedAt:now },
  { id:'t4', number:'4', floorPlanId:'demo', capacity:6, minCapacity:2, x:60, y:230, width:150, height:95, shape:TableShape.RECTANGLE, section:'Salon', status:TableStatus.OCCUPIED, currentOrder:'o4', createdAt:now, updatedAt:now },
  { id:'t5', number:'5', floorPlanId:'demo', capacity:4, minCapacity:1, x:300, y:230, width:110, height:90, shape:TableShape.SQUARE, section:'Terraza', status:TableStatus.CLEANING, currentOrder:null, createdAt:now, updatedAt:now },
  { id:'t6', number:'6', floorPlanId:'demo', capacity:4, minCapacity:1, x:500, y:230, width:110, height:90, shape:TableShape.BOOTH, section:'Terraza', status:TableStatus.AVAILABLE, currentOrder:null, createdAt:now, updatedAt:now },
];

function App(){
  const [tab,setTab]=useState<'tables'|'kitchen'>('tables');
  const [tables,setTables]=useState(initialTables);
  const [edit,setEdit]=useState(false);

  const moveTable=(id:string,x:number,y:number)=>setTables(prev=>prev.map(t=>t.id===id?{...t,x,y}:t));
  const createTable=(x:number,y:number)=>{
    if(!edit) return;
    const n=String(tables.length+1);
    setTables(prev=>[...prev,{id:'t'+Date.now(),number:n,floorPlanId:'demo',capacity:4,minCapacity:1,x,y,width:110,height:90,shape:TableShape.SQUARE,section:'Salon',status:TableStatus.AVAILABLE,currentOrder:null,createdAt:now,updatedAt:now}]);
  };

  return <div style={{fontFamily:'Inter,system-ui,sans-serif',background:'#f6f7f9',minHeight:'100vh',color:'#172033'}}>
    <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 22px',background:'#fff',borderBottom:'1px solid #e7e9ee',position:'sticky',top:0,zIndex:10}}>
      <div><strong style={{fontSize:20}}>Restaurant POS Benchmark</strong><div style={{fontSize:12,color:'#6b7280'}}>Realtime / multi-role evaluation</div></div>
      <nav style={{display:'flex',gap:8}}>
        <button onClick={()=>setTab('tables')} style={btn(tab==='tables')}>Mesas</button>
        <button onClick={()=>setTab('kitchen')} style={btn(tab==='kitchen')}>Cocina KDS</button>
      </nav>
    </header>
    <main style={{padding:20}}>
      {tab==='tables' ? <>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
          <div><h2 style={{margin:'0 0 4px'}}>Plano de mesas</h2><span style={{fontSize:13,color:'#6b7280'}}>Demo visual para revisar tarjetas, estados y drag & drop.</span></div>
          <button onClick={()=>setEdit(v=>!v)} style={btn(edit)}>{edit?'Finalizar edición':'Editar plano'}</button>
        </div>
        <div style={{overflow:'auto',background:'#fff',border:'1px solid #e5e7eb',borderRadius:14,padding:16}}>
          <FloorPlanEditor tables={tables} onTableMove={moveTable} onTableClick={(t)=>alert(`Mesa ${t.number} · ${t.status} · ${t.capacity} personas`)} onTableCreate={createTable} editorMode={edit?'edit':'view'} width={760} height={430}/>
        </div>
        <div style={{display:'flex',gap:14,flexWrap:'wrap',marginTop:14,fontSize:13}}>
          {Object.values(TableStatus).map(s=><span key={s} style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:999,padding:'7px 10px'}}>{s}: {tables.filter(t=>t.status===s).length}</span>)}
        </div>
      </> : <KitchenDisplay/>}
    </main>
  </div>;
}

function btn(active:boolean):React.CSSProperties{
  return {border:'1px solid '+(active?'#111827':'#d1d5db'),background:active?'#111827':'#fff',color:active?'#fff':'#111827',borderRadius:9,padding:'9px 13px',cursor:'pointer',fontWeight:600};
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
