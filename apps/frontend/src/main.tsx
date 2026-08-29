import React, { useMemo, useState } from 'react';
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

const menu = [
  {id:'m1',name:'Lomo saltado',cat:'Fondos',price:38,prep:18},
  {id:'m2',name:'Ají de gallina',cat:'Fondos',price:32,prep:15},
  {id:'m3',name:'Ceviche clásico',cat:'Entradas',price:36,prep:12},
  {id:'m4',name:'Tequeños',cat:'Entradas',price:20,prep:8},
  {id:'m5',name:'Chicha morada',cat:'Bebidas',price:9,prep:2},
  {id:'m6',name:'Suspiro limeño',cat:'Postres',price:16,prep:4},
];
const inventorySeed = [
  ['Carne de res',18.4,'kg',8,'Carnes'],['Pescado',4.2,'kg',6,'Pescados'],['Papa amarilla',26,'kg',10,'Verduras'],['Cebolla roja',7,'kg',5,'Verduras'],['Arroz',31,'kg',12,'Secos'],['Aceite',9,'lt',6,'Insumos']
] as const;

type Tab='dashboard'|'pos'|'tables'|'kitchen'|'inventory'|'team'|'analytics';

type CartItem={id:string,name:string,price:number,qty:number};

function App(){
  const [tab,setTab]=useState<Tab>('dashboard');
  const [tables,setTables]=useState(initialTables);
  const [edit,setEdit]=useState(false);
  const [cart,setCart]=useState<CartItem[]>([]);
  const [selectedTable,setSelectedTable]=useState('2');

  const moveTable=(id:string,x:number,y:number)=>setTables(prev=>prev.map(t=>t.id===id?{...t,x,y}:t));
  const createTable=(x:number,y:number)=>{
    if(!edit) return;
    const n=String(tables.length+1);
    setTables(prev=>[...prev,{id:'t'+Date.now(),number:n,floorPlanId:'demo',capacity:4,minCapacity:1,x,y,width:110,height:90,shape:TableShape.SQUARE,section:'Salon',status:TableStatus.AVAILABLE,currentOrder:null,createdAt:now,updatedAt:now}]);
  };
  const add=(m:any)=>setCart(prev=>{
    const hit=prev.find(x=>x.id===m.id);
    return hit?prev.map(x=>x.id===m.id?{...x,qty:x.qty+1}:x):[...prev,{id:m.id,name:m.name,price:m.price,qty:1}];
  });
  const total=useMemo(()=>cart.reduce((s,x)=>s+x.price*x.qty,0),[cart]);

  return <div style={{fontFamily:'Inter,system-ui,sans-serif',background:'#f3f4f6',minHeight:'100vh',color:'#172033'}}>
    <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,padding:'14px 22px',background:'#fff',borderBottom:'1px solid #e5e7eb',position:'sticky',top:0,zIndex:20}}>
      <div><strong style={{fontSize:20}}>Restaurant POS Benchmark</strong><div style={{fontSize:12,color:'#6b7280'}}>Realtime · multi-role · laboratorio</div></div>
      <nav style={{display:'flex',gap:7,flexWrap:'wrap',justifyContent:'flex-end'}}>
        {([['dashboard','Inicio'],['pos','POS'],['tables','Mesas'],['kitchen','Cocina'],['inventory','Inventario'],['team','Personal'],['analytics','Analítica']] as [Tab,string][]).map(([k,l])=><button key={k} onClick={()=>setTab(k)} style={btn(tab===k)}>{l}</button>)}
      </nav>
    </header>
    <main style={{padding:20,maxWidth:1440,margin:'0 auto'}}>
      {tab==='dashboard' && <Dashboard onGo={setTab}/>} 
      {tab==='pos' && <POS cart={cart} add={add} total={total} selectedTable={selectedTable} setSelectedTable={setSelectedTable} setCart={setCart}/>} 
      {tab==='tables' && <TablesView tables={tables} edit={edit} setEdit={setEdit} moveTable={moveTable} createTable={createTable}/>} 
      {tab==='kitchen' && <KitchenView/>}
      {tab==='inventory' && <InventoryView/>}
      {tab==='team' && <TeamView/>}
      {tab==='analytics' && <AnalyticsView/>}
    </main>
  </div>;
}

function Dashboard({onGo}:{onGo:(t:Tab)=>void}){
  const cards=[['Ventas hoy','S/ 3,842'],['Órdenes','86'],['Ticket promedio','S/ 44.67'],['Mesas ocupadas','2 / 6']];
  return <><h2>Centro operativo</h2><div style={grid4}>{cards.map(([a,b])=><div style={card} key={a}><span style={muted}>{a}</span><strong style={{fontSize:28}}>{b}</strong></div>)}</div><div style={{...grid4,marginTop:18}}>{[['pos','Cobrar / tomar pedido','Caja'],['tables','Gestionar salón','Host / mozo'],['kitchen','Ver producción','Cocina'],['inventory','Controlar stock','Administrador']] .map(([t,a,b])=><button key={t} onClick={()=>onGo(t as Tab)} style={{...card,textAlign:'left',cursor:'pointer'}}><strong>{a}</strong><span style={muted}>{b}</span></button>)}</div></>;
}

function POS({cart,add,total,selectedTable,setSelectedTable,setCart}:any){
  return <><div style={titleRow}><div><h2 style={{margin:0}}>Punto de venta</h2><span style={muted}>Pedido por mesa · demo funcional</span></div><select value={selectedTable} onChange={e=>setSelectedTable(e.target.value)} style={selectStyle}>{['1','2','3','4','5','6'].map(n=><option key={n}>Mesa {n}</option>)}</select></div><div style={{display:'grid',gridTemplateColumns:'1fr 360px',gap:18,alignItems:'start'}}><div><div style={{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap'}}>{['Todos','Entradas','Fondos','Bebidas','Postres'].map(x=><span key={x} style={chip}>{x}</span>)}</div><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:12}}>{menu.map(m=><button key={m.id} onClick={()=>add(m)} style={{...card,textAlign:'left',cursor:'pointer'}}><strong>{m.name}</strong><span style={muted}>{m.cat} · {m.prep} min</span><b style={{fontSize:19}}>S/ {m.price.toFixed(2)}</b></button>)}</div></div><aside style={{...card,position:'sticky',top:92}}><strong>Cuenta · Mesa {selectedTable}</strong><div style={{display:'grid',gap:8,marginTop:14}}>{cart.length===0?<span style={muted}>Agrega productos para iniciar.</span>:cart.map((x:any)=><div key={x.id} style={{display:'flex',justifyContent:'space-between',gap:10,borderBottom:'1px solid #eee',paddingBottom:8}}><span>{x.qty}× {x.name}</span><b>S/ {(x.qty*x.price).toFixed(2)}</b></div>)}</div><div style={{display:'flex',justifyContent:'space-between',fontSize:22,marginTop:18}}><strong>Total</strong><strong>S/ {total.toFixed(2)}</strong></div><button disabled={!cart.length} onClick={()=>{alert('Pedido enviado a cocina');setCart([])}} style={{...primary,width:'100%',marginTop:14,opacity:cart.length?1:.45}}>Enviar a cocina</button></aside></div></>;
}

function TablesView({tables,edit,setEdit,moveTable,createTable}:any){return <><div style={titleRow}><div><h2 style={{margin:0}}>Plano de mesas</h2><span style={muted}>Estados, formas, secciones y drag & drop.</span></div><button onClick={()=>setEdit((v:boolean)=>!v)} style={btn(edit)}>{edit?'Finalizar edición':'Editar plano'}</button></div><div style={{overflow:'auto',background:'#fff',border:'1px solid #e5e7eb',borderRadius:14,padding:16}}><FloorPlanEditor tables={tables} onTableMove={moveTable} onTableClick={(t)=>alert(`Mesa ${t.number} · ${t.status} · ${t.capacity} personas`)} onTableCreate={createTable} editorMode={edit?'edit':'view'} width={760} height={430}/></div><div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:14}}>{Object.values(TableStatus).map(s=><span key={s} style={chip}>{s}: {tables.filter((t:Table)=>t.status===s).length}</span>)}</div></>}

function KitchenView(){return <><div style={titleRow}><div><h2 style={{margin:0}}>Cocina KDS</h2><span style={muted}>El componente original usa WebSocket; abajo se conserva junto con una vista demo visible.</span></div></div><div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:18}}>{[['Recepción',['#104 · Mesa 2 · 3 items','#107 · Delivery · 2 items']],['Preparación',['#099 · Mesa 4 · 4 items','#102 · Mesa 1 · 2 items']],['Listo',['#096 · Mesa 6 · 2 items']]].map(([title,items]:any)=><div key={title} style={card}><strong>{title}</strong><div style={{display:'grid',gap:8,marginTop:12}}>{items.map((x:string)=><div key={x} style={{padding:12,border:'1px solid #e5e7eb',borderRadius:10,background:'#fafafa'}}>{x}</div>)}</div></div>)}</div><div style={{display:'none'}}><KitchenDisplay/></div></>}

function InventoryView(){return <><div style={titleRow}><div><h2 style={{margin:0}}>Inventario</h2><span style={muted}>Stock, mínimos y alertas.</span></div><button style={primary}>+ Nuevo insumo</button></div><div style={card}><table style={{width:'100%',borderCollapse:'collapse'}}><thead><tr>{['Insumo','Categoría','Stock','Mínimo','Estado'].map(x=><th key={x} style={th}>{x}</th>)}</tr></thead><tbody>{inventorySeed.map(([n,q,u,min,c])=><tr key={n}><td style={td}><b>{n}</b></td><td style={td}>{c}</td><td style={td}>{q} {u}</td><td style={td}>{min} {u}</td><td style={td}><span style={{...chip,background:Number(q)<=Number(min)?'#fee2e2':'#dcfce7'}}>{Number(q)<=Number(min)?'Bajo':'Normal'}</span></td></tr>)}</tbody></table></div></>}

function TeamView(){const staff=[['Ana Torres','Manager','Activo'],['Luis Ramos','Server','Activo'],['Micaela Díaz','Chef','Activo'],['Pedro León','Host','Activo']];return <><div style={titleRow}><div><h2 style={{margin:0}}>Personal y roles</h2><span style={muted}>Admin / Manager / Server / Chef / Host.</span></div><button style={primary}>+ Colaborador</button></div><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>{staff.map(([n,r,s])=><div key={n} style={card}><strong>{n}</strong><span style={muted}>{r}</span><span style={{...chip,width:'fit-content'}}>{s}</span></div>)}</div></>}

function AnalyticsView(){return <><h2>Analítica</h2><div style={grid4}>{[['Ventas semana','S/ 24,680'],['Órdenes','548'],['Food cost','31.4%'],['Tiempo cocina','14 min']].map(([a,b])=><div style={card} key={a}><span style={muted}>{a}</span><strong style={{fontSize:27}}>{b}</strong></div>)}</div><div style={{...card,marginTop:18}}><strong>Ventas por hora</strong><div style={{display:'flex',alignItems:'end',gap:12,height:180,marginTop:18}}>{[25,42,68,54,90,76,61,44].map((h,i)=><div key={i} title={`${h}`} style={{height:`${h}%`,flex:1,background:'#111827',borderRadius:'7px 7px 0 0',minWidth:24}}/>)}</div></div></>}

function btn(active:boolean):React.CSSProperties{return {border:'1px solid '+(active?'#111827':'#d1d5db'),background:active?'#111827':'#fff',color:active?'#fff':'#111827',borderRadius:9,padding:'9px 12px',cursor:'pointer',fontWeight:650}}
const card:React.CSSProperties={background:'#fff',border:'1px solid #e5e7eb',borderRadius:14,padding:16,display:'flex',flexDirection:'column',gap:8,boxShadow:'0 1px 2px rgba(0,0,0,.03)'};
const grid4:React.CSSProperties={display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:12};
const muted:React.CSSProperties={fontSize:13,color:'#6b7280'};
const chip:React.CSSProperties={background:'#f3f4f6',border:'1px solid #e5e7eb',borderRadius:999,padding:'6px 10px',fontSize:12};
const primary:React.CSSProperties={border:0,background:'#111827',color:'#fff',borderRadius:9,padding:'10px 14px',fontWeight:700,cursor:'pointer'};
const titleRow:React.CSSProperties={display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,marginBottom:14};
const selectStyle:React.CSSProperties={padding:'9px 12px',borderRadius:9,border:'1px solid #d1d5db',background:'#fff'};
const th:React.CSSProperties={textAlign:'left',padding:'10px 8px',fontSize:12,color:'#6b7280',borderBottom:'1px solid #e5e7eb'};
const td:React.CSSProperties={padding:'12px 8px',borderBottom:'1px solid #f0f1f3',fontSize:14};

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
