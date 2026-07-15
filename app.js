(()=>{

const ICON_PATHS={
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 4.5 6 4.5 9S15 18 12 21M12 3C9 6 7.5 9 7.5 12S9 18 12 21"/>',
 plane:'<path d="M22 2 13.5 10.5 4 7l-2 2 8 5-4 4 3 1 3-3 5 8 2-2-3.5-9.5L24 4z"/>',
 ship:'<path d="M4 14h16l-2 5H6z"/><path d="M8 14V7h8v7M10 7V4h4v3M3 21c1.5 1 3 1 4.5 0 1.5 1 3 1 4.5 0 1.5 1 3 1 4.5 0 1.5 1 3 1 4.5 0"/>',
 factory:'<path d="M3 21V10l6 3V9l6 4V6h6v15z"/><path d="M7 17h2M12 17h2M17 17h2"/>',
 warehouse:'<path d="m3 10 9-6 9 6v11H3z"/><path d="M7 21v-7h10v7M7 10h10"/>',
 dollar:'<path d="M12 2v20M17 6.5c-1-1.2-2.7-2-5-2-3 0-5 1.5-5 3.7 0 5.8 10 2.6 10 7.6 0 2.2-2 3.7-5 3.7-2.4 0-4.3-.8-5.5-2.2"/>',
 package:'<path d="m3 7 9-4 9 4-9 4z"/><path d="M3 7v10l9 4 9-4V7M12 11v10"/>',
 chart:'<path d="M4 19V5M4 19h16M7 15l4-4 3 2 5-7"/>',
 refresh:'<path d="M20 11a8 8 0 0 0-14.8-4M4 3v5h5M4 13a8 8 0 0 0 14.8 4M20 21v-5h-5"/>',
 truck:'<path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>',
 wrench:'<path d="M14.7 6.3a4 4 0 0 0-5-5L12 3.6 8.6 7 6.3 4.7a4 4 0 0 0 5 5L4 17l3 3 7.7-7.7a4 4 0 0 0 5-5L17.4 9.6 14 6.2z"/>',
 leaf:'<path d="M20 4C12 4 5 8 5 15c0 3 2 5 5 5 7 0 10-8 10-16z"/><path d="M4 21c3-6 7-9 13-12"/>',
 smile:'<circle cx="12" cy="12" r="9"/><path d="M8 10h.01M16 10h.01M8 15c1 2 3 3 4 3s3-1 4-3"/>',
 handshake:'<path d="m8 12 3 3c1 1 2 1 3 0l5-5M3 10l5-5 4 2 4-2 5 5M3 10l4 7 3-2M21 10l-4 7-3-2"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 warning:'<path d="M12 3 2.5 20h19zM12 9v4M12 17h.01"/>',
 lightbulb:'<path d="M9 18h6M10 22h4M8.5 14.5A6 6 0 1 1 15.5 14.5c-1 1-1.5 2-1.5 3.5h-4c0-1.5-.5-2.5-1.5-3.5z"/>',
 scale:'<path d="M12 3v18M5 7h14M7 7l-4 7h8zM17 7l-4 7h8zM8 21h8"/>',
 inventory:'<path d="M4 4h16v16H4zM4 9h16M9 9v11"/>'
};
function iconSVG(name,label=''){return `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="${label?'false':'true'}"${label?` role="img"><title>${label}</title>`:'>'}${ICON_PATHS[name]||ICON_PATHS.globe}</svg>`}

const TOTAL=4300, LA_REQ=2500, RTM_REQ=1800, BUDGET=150000, COMMITTED_UNIT_REVENUE=72, INCREMENTAL_UNIT_REVENUE=78, SAFETY_STOCK_REPLENISH_COST_PER_UNIT=14;
const strategies=[
{id:'air',name:'100% Air Freight',tag:'Speed First',air:1,sea:0,blurb:'Maximum schedule buffer, highest spend and emissions.'},
{id:'sea',name:'100% Sea Freight',tag:'Sustainability First',air:0,sea:1,blurb:'Lowest cost and carbon, minimal disruption buffer.'},
{id:'balanced',name:'40% Air / 60% Sea',tag:'Balanced',air:.4,sea:.6,blurb:'Protects core demand while preserving budget flexibility.'},
{id:'cost',name:'20% Air / 80% Sea',tag:'Cost Focused',air:.2,sea:.8,blurb:'Strong unit economics with moderate schedule exposure.'}
];
const crises=[
{day:3,title:'Port Strike in Shanghai',desc:"A five-day port workers' strike begins. Your Shanghai shipment is ready to load but blocked.",options:[
{title:'Wait out the strike',summary:'Preserve cash, accept a full five-day delay.',impact:['Cost: +$0','Schedule: +5 days','Network risk: +15%'],fx:{delay:5,risk:15,resilience:-10,speed:-12,customer:-4},result:'You protect the budget, but both routes lose valuable schedule buffer.'},
{title:'Divert through Hong Kong',summary:'Truck cargo 400 km and secure alternate port capacity.',impact:['Cost: +$3,200','Schedule: +1 day','Network risk: +8%'],fx:{cost:3200,delay:1,risk:8,resilience:4,carbon:2400},result:'The detour keeps the program moving with a manageable cost premium.'},
{title:'Convert 30% to air freight',summary:'Buy speed and reduce exposure to the port shutdown.',impact:['Cost: +$28,000','Schedule: +3 days','Network risk: -12%'],fx:{cost:28000,delay:3,risk:-12,resilience:10,speed:8,carbon:155000,airShift:.3},result:'Air capacity protects priority demand, but consumes budget and carbon headroom.'}
]},
{day:7,title:'Supplier Price Increase',desc:'Your primary Chinese supplier raises prices 18% because of a raw material shortage.',options:[
{title:'Accept the increase',summary:'Protect continuity and the primary supplier relationship.',impact:['Cost: +$16,200','Supplier relationship: +5','No additional lead time'],fx:{cost:16200,supplier:5,resilience:5},result:'Continuity is secured and supplier trust improves, at a meaningful cost.'},
{title:'Switch to secondary supplier',summary:'Reduce the increase, but introduce quality and ramp-up risk.',impact:['Cost: +$8,100','Lead time: +2 days','Quality risk: +10%'],fx:{cost:8100,delay:2,risk:10,supplier:-10,riskControl:-10},result:'You reduce spend, but the new source adds qualification and execution risk.'},
{title:'Negotiate commercially',summary:'A 50/50 outcome: save $8,100 or lose the supplier.',impact:['Success: price increase limited to $8,100','Failure: supplier exits','Relationship risk: high'],chance:[
{p:.5,fx:{cost:8100,supplier:8,resilience:4},result:'Negotiation succeeds. The price increase is limited to $8,100.'},
{p:.5,fx:{cost:8100,delay:3,supplier:-30,risk:18,resilience:-12},result:'Negotiation breaks down. The supplier withdraws capacity and you scramble for coverage.'}
]}
]},
{day:10,title:'Quality Issue Detected',desc:'Quality assurance finds packaging defects in 15% of units. Full correction requires four days.',options:[
{title:'Rework every affected unit',summary:'Protect the brand, absorb cost and schedule impact.',impact:['Cost: +$6,500','Schedule: +4 days','Quality risk: minimized'],fx:{cost:6500,delay:4,customer:2,riskControl:12,speed:-10},result:'The product is corrected before release, but your schedule buffer narrows sharply.'},
{title:'Ship as-is and manage returns',summary:'Prioritize speed while accepting downstream service failures.',impact:['Cost: +$12,000 expected','Schedule: no delay','Customer satisfaction: -25'],fx:{cost:12000,customer:-25,risk:16,riskControl:-22,lossUnits:120},result:'You maintain departure timing, but complaints and returns damage service performance.'},
{title:'Use a mixed disposition',summary:'Rework most units and release a controlled exception batch.',impact:['Cost: +$3,250','Schedule: +2 days','Moderate quality exposure'],fx:{cost:3250,delay:2,customer:-8,risk:7,riskControl:-4,lossUnits:45},result:'The compromise limits delay and cost, but some customer exposure remains.'}
]},
{day:13,title:'Suez Canal Congestion',desc:'Your Rotterdam-bound ocean vessel is projected to arrive 12 days late because of severe Suez Canal congestion. The trans-Pacific route to Los Angeles is unaffected.',options:[
{title:'Accept the vessel delay',summary:'Preserve cash and absorb significant deadline exposure.',impact:['Cost: +$0','Rotterdam sea schedule: +12 days','Potential retailer chargebacks: $45,000'],fx:{rtmSeaDelay:12,risk:24,customer:-12,resilience:-18,speed:-20,contractPenalty:45000},result:'The network stays inexpensive, but the Rotterdam sea batch is now critically exposed. The Los Angeles route remains unchanged.'},
{title:'Convert 35% of the Rotterdam batch to air',summary:'Shift 35% of the Rotterdam-bound volume to air and recover five days of buffer at a major premium.',impact:['Cost: +$35,000','Remaining Rotterdam sea batch: +7 days','Carbon: high increase'],fx:{cost:35000,rtmSeaDelay:7,risk:-15,resilience:14,speed:18,carbon:185000,rtmAirShift:.35},result:'You shift 35% of the Rotterdam-bound volume to air. Those units move on the air schedule, while the remaining sea batch absorbs a seven-day congestion delay.'},
{title:'Shift 18% to air, 82% stays at sea',summary:'Protect priority units while retaining lower-cost capacity.',impact:['Cost: +$18,400','Rotterdam sea delay: +6 days','Risk: moderate'],fx:{cost:18400,rtmSeaDelay:6,risk:-4,resilience:10,speed:8,carbon:96000,rtmAirShift:.18},result:'You shift 18% of the Rotterdam-bound volume to air, while the remaining 82% stays at sea.'}
]},
{day:16,title:'Rotterdam Warehouse Capacity Full',desc:'Your Rotterdam warehouse is at 95% capacity. The remaining Rotterdam-bound inventory is approaching the warehouse while capacity is already at 95%.',options:[
{title:'Rush delivery to retailers',summary:'Create space through expedited outbound distribution.',impact:['Cost: +$8,000','Outbound warehouse clearance accelerated by 2 days','Service protection: high'],fx:{cost:8000,resilience:10,customer:4,carbon:9000},result:'Expedited outbound delivery clears warehouse capacity two days faster and protects the incoming Rotterdam volume.'},
{title:'Lease temporary overflow storage',summary:'Protect inventory with a flexible but costly buffer.',impact:['Cost: +$8,400 (4 days)','Operational resilience: -10','Extra handling risk'],fx:{cost:8400,risk:6,resilience:-10,carbon:1600},result:'Overflow capacity prevents a hard stop, but adds handling complexity and cost.'},
{title:'Cancel 300 Rotterdam units',summary:'Remove the capacity problem by cutting the shipment.',impact:['Delivered-volume revenue decreases','Rotterdam units: -300','No storage expense'],fx:{lossRTM:300,customer:-12,supplier:-6,riskControl:-8},result:'Capacity pressure disappears, but Europe service and delivered-volume revenue decline.'}
]},
{day:19,title:'Unexpected US Demand Spike',desc:'US retail partners report a 40% pre-event demand surge and request additional inventory.',options:[
{title:'Reallocate 500 units from Europe',summary:'Prioritize the US event at Europe’s expense.',impact:['Reallocation and handling cost: +$7,500','LA incremental volume accepted: 500',`Potential incremental revenue: +$${(500*INCREMENTAL_UNIT_REVENUE).toLocaleString()}`,'Rotterdam allocation: -500'],fx:{cost:7500,incrementalFulfillmentCost:7500,incrementalDemandLA:1000,incrementalAcceptedLA:500,moveRtmToLa:500,supplier:-15,risk:20,customer:-3,speed:6,carbon:12000},result:'US coverage improves, but Rotterdam now faces a material service shortfall.'},
{title:'Expedite an emergency shipment',summary:'Cover part of the spike with premium backup capacity.',impact:['Cost: +$22,000',`Potential incremental revenue: +$${(300*INCREMENTAL_UNIT_REVENUE).toLocaleString()}`,'US spike coverage: 30%','Dedicated emergency air capacity'],fx:{incrementalDemandLA:1000,incrementalAcceptedLA:300,incrementalFulfillmentCost:22000,cost:22000,addLAAir:300,risk:-4,carbon:72000,resilience:8},result:'The dedicated emergency air lot protects part of the upside without reducing Rotterdam capacity.'},
{title:'Decline the incremental demand',summary:'Protect committed Europe volume and existing plan.',impact:['Customer satisfaction: -20',`Incremental revenue opportunity declined: $${(1000*INCREMENTAL_UNIT_REVENUE).toLocaleString()}`,'No incremental cost','Europe plan protected'],fx:{incrementalDemandLA:1000,incrementalAcceptedLA:0,customer:-20,risk:5,resilience:2},result:'You defend the original network, but US partners are frustrated by the lost sales opportunity.'}
]},
{day:22,title:'Immediate US Tariff Change',desc:'A new 15% tariff is imposed on imports from China to the United States, effective immediately. The US-bound shipment has a declared customs value of $150,000, creating a $22,500 tariff exposure.',options:[
{title:'Absorb the tariff',summary:'Protect customer pricing and accept the full tariff cost.',impact:['Cost: +$22,500','Operating contribution: -$22,500','Customer pricing protected'],fx:{cost:22500,customer:4},result:'Commercial relationships remain stable, but operating contribution falls by $22,500 and the budget moves under severe pressure.'},
{title:'Pass the tariff to customers',summary:'Recover the cost through a negotiated price increase.',impact:['Tariff cost: +$22,500','Revenue recovery: +$22,500','Customer satisfaction: -10'],fx:{cost:22500,revenueRecovery:22500,customer:-10,supplier:1},result:'The tariff is paid and then recovered through higher customer pricing. Operating contribution is protected, but retailer trust declines.'},
{title:'Qualify a Vietnam routing option',summary:'Protect future shipments; current in-transit goods remain unchanged.',impact:['Tariff + qualification cost: +$24,000','Current load receives no relief','Future risk: reduced'],fx:{cost:24000,risk:-8,resilience:10,supplier:-2},result:'The current shipment still incurs the tariff, while the Vietnam option improves flexibility for future cycles.'}
]},
{day:24,title:'Cargo Damage',desc:'Port handling damage affects 8% of the shipment. Insurance covers 60% of the assessed value.',options:[
{title:'File the claim and rework',summary:'Use insurance proceeds and repair the affected cargo.',impact:['Net cost: +$4,200','Schedule: +3 days','Units preserved'],fx:{cost:4200,delay:3,risk:3,riskControl:6},result:'Insurance limits the financial loss, while rework consumes remaining schedule buffer.'},
{title:'Expedite replacement units',summary:'Protect delivery quantity with backup supply.',impact:['Cost: +$14,000','Schedule: +2 days','Quantity protected'],fx:{cost:14000,delay:2,risk:-5,resilience:8,carbon:36000},result:'Replacement stock protects service levels, but adds premium transport expense.'},
{title:'Accept the loss and ship remainder',summary:'Avoid delay and release undamaged cargo immediately.',impact:['Cost/loss: +$4,200','Delivery quantity: -8%','No rework delay'],fx:{cost:4200,lossUnits:344,customer:-10,riskControl:-15},result:'The remaining cargo moves on time, but the network can no longer deliver the full plan.'}
]},
{day:26,title:'Supplier Bankruptcy',desc:'Your secondary supplier files for bankruptcy. Four hundred backup units are now uncertain.',options:[
{title:'Engage a tertiary supplier',summary:'Replace the units at a premium and accept a small gap.',impact:['Cost: +$18,000','Shortfall: 1 day','Supply restored'],fx:{cost:18000,addRTM:400,delay:1,risk:-5,resilience:10,supplier:-4},result:'A new source supplies all 400 backup units, though qualification and premium pricing reduce efficiency.'},
{title:'Negotiate with the liquidator',summary:'Attempt to salvage the inventory at a lower cost.',impact:['Cost: +$7,200','50% chance to recover all 400 units','Execution risk: high'],chance:[
{p:.5,fx:{cost:7200,addRTM:400,risk:-3,resilience:6},result:'The liquidator releases all 400 backup units and the recovery plan works.'},
{p:.5,fx:{cost:7200,risk:14,resilience:-10},result:'The salvage attempt fails. The 400 backup units are not recovered, but committed inventory already in the network is unchanged.'}
]},
{title:'Reallocate 400 units from Europe',summary:'Use committed stock to protect the most urgent requirement.',impact:['Cost: +$0','Rotterdam units: -400','Europe deadline missed'],fx:{moveRtmToLa:400,customer:-14,supplier:-5,risk:10,speed:4},result:'Urgent US demand is protected, but Rotterdam becomes structurally under-supplied.'}
]},
{day:28,title:'Last-Minute LA Event Shortfall',desc:'The Los Angeles retail event is beginning, and the final requirement is now locked based on the live network projection.',options:[
{title:'Air freight an emergency batch',summary:'Buy immediate capacity and protect the event.',impact:['Cost: +$8,400','LA units: +200','Arrival: on time'],fx:{cost:8400,addLA:200,risk:-6,speed:12,carbon:29000},result:'The emergency lot closes the LA gap and protects the event launch.'},
{title:'Partially fulfill the retailer',summary:'Avoid premium freight and accept a committed-volume shortfall.',impact:['Delivered-volume revenue decreases','No emergency cost','Customer satisfaction: -12'],fx:{customer:-12,lossLA:200,riskControl:-8},result:'The event receives a partial allocation, preserving cash but reducing delivered-volume revenue and service performance.'},
{title:'Negotiate a three-day postponement',summary:'Preserve the standard shipment plan through commercial flexibility.',impact:['Cost: +$0','Customer satisfaction: -15','LA deadline: +3 days'],fx:{customer:-15,laDeadlineShift:3,resilience:5,speed:-8},result:'The retailer accepts a later event, protecting inventory economics at the cost of trust.'}
]}
];
let state,selectedStrategy=null,runId=0,decisionLocked=false,launchLocked=false,activeCrisis=null;
function freshState(){return{day:0,cost:0,customer:100,supplier:75,carbon:0,risk:20,delay:0,seaDelay:0,rtmSeaDelay:0,laDelay:0,rtmAirDelay:0,lossUnits:0,lossLA:0,lossRTM:0,addLA:0,addLAAir:0,addRTM:0,moveRtmToLa:0,usSafetyStock:200,incrementalDemandLA:0,incrementalAcceptedLA:0,incrementalFulfillmentCost:0,contractPenalty:0,revenueRecovery:0,rtmAirShift:0,airShare:0,seaShare:1,history:[],resilience:60,speed:60,riskControl:65,costScore:70,laDeadlineShift:0,initialCost:0,lastDelta:{},crisisIndex:0};}
function money(n){return (n<0?'-$': '$')+Math.abs(Math.round(n)).toLocaleString()}
function clamp(v,min=0,max=100){return Math.max(min,Math.min(max,v))}
function initialCost(s){return TOTAL*(s.air*12+s.sea*2.8)+1500}
function initialCarbon(s){return TOTAL*(s.air*92+s.sea*7)}
function renderStrategies(){const g=document.getElementById('strategyGrid');g.innerHTML=strategies.map((s,i)=>`<div class="strategy" data-id="${s.id}"><div class="strategy-mode">${s.id==='air'?iconSVG('plane'):s.id==='sea'?iconSVG('ship'):s.id==='balanced'?iconSVG('plane')+iconSVG('ship'):iconSVG('ship')+iconSVG('ship')}</div><span class="tag">${s.tag}</span><h4>${String.fromCharCode(65+i)}) ${s.name}</h4><div class="route-preview"><svg class="track" viewBox="0 0 240 94" preserveAspectRatio="none" aria-hidden="true"><path class="seaL" d="M186 36 C144 30 114 33 56 50"/><path class="airL" d="M186 36 Q124 4 56 50"/><path class="seaR" d="M186 36 C175 50 164 66 128 32"/><path class="airR" d="M186 36 Q156 13 128 32"/></svg><span class="pin sh"></span><span class="pin la"></span><span class="pin rt"></span></div><div class="strategy-badges"><span class="badge air-badge">${iconSVG('plane')} ${Math.round(s.air*100)}% Air</span><span class="badge sea-badge">${iconSVG('ship')} ${Math.round(s.sea*100)}% Sea</span><span class="badge carb-badge">${iconSVG('leaf')} ${Math.round(initialCarbon(s)).toLocaleString()} kg CO₂e</span></div><div class="splitbar"><i class="air" style="width:${s.air*100}%"></i><i class="sea" style="width:${s.sea*100}%"></i></div><p class="subtle">${s.blurb}</p><ul><li>Estimated spend: ${money(initialCost(s))}</li><li>Transit profile: ${Math.round(s.air*100)}% air, ${Math.round(s.sea*100)}% sea</li><li>Handling & documentation included</li></ul></div>`).join('');g.querySelectorAll('.strategy').forEach(el=>el.onclick=()=>selectStrategy(el.dataset.id));}
function selectStrategy(id){selectedStrategy=strategies.find(s=>s.id===id);document.querySelectorAll('.strategy').forEach(x=>x.classList.toggle('selected',x.dataset.id===id));const c=initialCost(selectedStrategy),e=initialCarbon(selectedStrategy);document.getElementById('strategyEstimate').innerHTML=`Initial spend <b class="mono">${money(c)}</b> • Remaining budget <b class="mono">${money(BUDGET-c)}</b> • Base emissions <b class="mono">${Math.round(e).toLocaleString()} kg CO₂e</b>`;document.getElementById('launchBtn').disabled=false;}
function launch(){
  if(!selectedStrategy||launchLocked)return;
  launchLocked=true;
  runId++;
  const thisRun=runId;
  state=freshState();
  state.airShare=selectedStrategy.air;
  state.seaShare=selectedStrategy.sea;
  state.cost=initialCost(selectedStrategy);
  state.initialCost=state.cost;
  state.carbon=initialCarbon(selectedStrategy);
  state.speed=clamp(45+selectedStrategy.air*50);
  state.resilience=clamp(52+Math.min(selectedStrategy.air,selectedStrategy.sea)*35);
  state.riskControl=clamp(72-Math.abs(.45-selectedStrategy.air)*30);
  state.costScore=clamp(95-(state.cost/BUDGET)*35);

  // Deliberately synchronous launch. No loading timers or chained transitions.
  // This prevents the game from ever becoming stranded on Day 0.
  const lo=document.getElementById('launchOverlay');
  if(lo)lo.classList.remove('active');
  const intro=document.getElementById('introScreen');
  const phase=document.getElementById('phaseScreen');
  const game=document.getElementById('gameScreen');
  const result=document.getElementById('resultScreen');
  if(intro){intro.classList.add('hidden');intro.classList.remove('is-active','is-leaving','is-entering')}
  if(phase){phase.classList.add('hidden');phase.classList.remove('is-active','is-leaving','is-entering')}
  if(result){result.classList.add('hidden');result.classList.remove('is-active','is-leaving','is-entering')}
  if(game){game.classList.remove('hidden','is-entering','is-leaving');game.classList.add('is-active')}

  document.getElementById('activityLog').innerHTML='';const logCount=document.getElementById('logCount');if(logCount)logCount.textContent='0 decisions';
  addLog(0,'Initial strategy launched',`${selectedStrategy.name} • ${money(state.cost)}`);
  renderAll();
  showCrisis(0);
  launchLocked=false;
  window.scrollTo({top:0,behavior:'auto'});

  // Visible recovery control only appears if Crisis 1 somehow fails to open.
  setTimeout(()=>{
    if(thisRun!==runId)return;
    const overlay=document.getElementById('crisisOverlay');
    const recovery=document.getElementById('emergencyStartBtn');
    if(state.day===0||!overlay?.classList.contains('active')){
      if(recovery)recovery.classList.remove('hidden');
    }else if(recovery){
      recovery.classList.add('hidden');
    }
  },300);
}
function computeInventory(){
  const grossLA=Math.max(0,LA_REQ+state.addLA+state.addLAAir+state.moveRtmToLa-state.lossLA);
  const grossRTM=Math.max(0,RTM_REQ+state.addRTM-state.moveRtmToLa-state.lossRTM);
  const grossAllocated=grossLA+grossRTM;
  const globalLoss=Math.min(Math.max(0,state.lossUnits),grossAllocated);
  const globalLossLA=grossAllocated>0?globalLoss*(grossLA/grossAllocated):0;
  const globalLossRTM=grossAllocated>0?globalLoss*(grossRTM/grossAllocated):0;
  const laAlloc=Math.max(0,grossLA-globalLossLA);
  const rtmAlloc=Math.max(0,grossRTM-globalLossRTM);
  const physicalNetworkUnits=laAlloc+rtmAlloc;
  return{
    totalAvailable:Math.max(0,physicalNetworkUnits+state.usSafetyStock),
    networkUnits:Math.max(0,physicalNetworkUnits),
    laAlloc,
    rtmAlloc,
    usSafetyStock:Math.max(0,state.usSafetyStock)
  }
}
function deliveryProjection(){
  const inv=computeInventory();
  const laAirShare=clamp(state.airShare,0,1), laSeaShare=1-laAirShare;
  const rtmAirShare=clamp(state.airShare+state.rtmAirShift,0,1), rtmSeaShare=1-rtmAirShare;
  const laDeadline=28+state.laDeadlineShift, rtmDeadline=30;
  const laAirEta=Math.max(0,5+state.delay+state.laDelay);
  const laSeaEta=Math.max(0,18+state.delay+state.seaDelay+state.laDelay);
  const rtmAirEta=Math.max(0,5+state.delay+state.rtmAirDelay);
  const rtmSeaEta=Math.max(0,18+state.delay+state.seaDelay+state.rtmSeaDelay);
  const serviceFactor=(eta,deadline,floor)=>eta<=deadline?1:Math.max(floor,1-(eta-deadline)*.12);
  const dedicatedLAAirUnits=Math.min(Math.max(0,state.addLAAir),inv.laAlloc);
  const regularLAUnits=Math.max(0,inv.laAlloc-dedicatedLAAirUnits);
  const laAirUnits=regularLAUnits*laAirShare+dedicatedLAAirUnits, laSeaUnits=regularLAUnits*laSeaShare;
  const rtmAirUnits=inv.rtmAlloc*rtmAirShare, rtmSeaUnits=inv.rtmAlloc*rtmSeaShare;
  const laAirDelivered=regularLAUnits*laAirShare*serviceFactor(laAirEta,laDeadline,.35)+dedicatedLAAirUnits;
  const laSeaDelivered=laSeaUnits*serviceFactor(laSeaEta,laDeadline,.35);
  const rtmAirDelivered=rtmAirUnits*serviceFactor(rtmAirEta,rtmDeadline,.3);
  const rtmSeaDelivered=rtmSeaUnits*serviceFactor(rtmSeaEta,rtmDeadline,.3);
  const laInboundDelivered=Math.max(0,Math.round(laAirDelivered+laSeaDelivered));
  const safetyStockUsed=Math.min(inv.usSafetyStock,Math.max(0,LA_REQ-laInboundDelivered));
  const laCommittedDelivered=Math.min(LA_REQ,laInboundDelivered+safetyStockUsed);
  const incrementalSupplyAvailable=Math.max(0,laInboundDelivered-LA_REQ);
  const laIncrementalDelivered=Math.min(Math.max(0,state.incrementalAcceptedLA),incrementalSupplyAvailable);
  const rtmDelivered=Math.min(RTM_REQ,Math.round(rtmAirDelivered+rtmSeaDelivered));
  const rate=(laCommittedDelivered+rtmDelivered)/(LA_REQ+RTM_REQ)*100;
  const laEta=laAirShare===1?laAirEta:laSeaShare===1?laSeaEta:Math.max(laAirEta,laSeaEta);
  const rtmEta=rtmAirShare===1?rtmAirEta:rtmSeaShare===1?rtmSeaEta:Math.max(rtmAirEta,rtmSeaEta);
  return{
    laEta,rtmEta,laAirEta,laSeaEta,rtmAirEta,rtmSeaEta,laAirShare,laSeaShare,rtmAirShare,rtmSeaShare,
    dedicatedLAAirUnits:Math.round(dedicatedLAAirUnits),laAirUnits:Math.round(laAirUnits),laSeaUnits:Math.round(laSeaUnits),rtmAirUnits:Math.round(rtmAirUnits),rtmSeaUnits:Math.round(rtmSeaUnits),
    laAirDelivered:Math.round(laAirDelivered),laSeaDelivered:Math.round(laSeaDelivered),rtmAirDelivered:Math.round(rtmAirDelivered),rtmSeaDelivered:Math.round(rtmSeaDelivered),
    laInboundDelivered,laDelivered:laCommittedDelivered,laCommittedDelivered,laIncrementalDelivered,
    incrementalDemandLA:state.incrementalDemandLA,incrementalAcceptedLA:state.incrementalAcceptedLA,
    safetyStockUsed,safetyStockRemaining:inv.usSafetyStock-safetyStockUsed,safetyStockReplenishmentCost:safetyStockUsed*SAFETY_STOCK_REPLENISH_COST_PER_UNIT,rtmDelivered,rate
  };
}
function effectiveTotalCost(){const p=deliveryProjection();return state.cost+p.safetyStockReplenishmentCost}
function metricData(){const p=deliveryProjection(),inv=computeInventory(),effectiveCost=effectiveTotalCost(),remaining=BUDGET-effectiveCost;return[
{name:'Total Cost',icon:'$',color:'#ff8c42',value:money(effectiveCost),sub:`Remaining budget: ${money(remaining)} · includes ${money(p.safetyStockReplenishmentCost)} safety-stock replenishment reserve`,pct:clamp((effectiveCost/BUDGET)*100),status:remaining>=0?'good':'bad',alert:(effectiveCost/BUDGET*100)>80,alertText:'Budget utilization above 80%',delta:state.lastDelta.cost?`${state.lastDelta.cost>0?'+':''}${money(state.lastDelta.cost)}`:'—'},
{name:'Delivery Rate',icon:'✓',color:'#00b884',value:`${p.rate.toFixed(1)}%`,sub:`Projected on-time delivery`,pct:p.rate,status:p.rate>=95?'good':p.rate>=80?'warn':'bad',alert:p.rate<20,alertText:'Delivery projection below 20%',delta:state.lastDelta.delivery||'Live'},
{name:'Inventory',icon:'◫',color:'#0066cc',value:`${inv.totalAvailable.toLocaleString()}`,sub:`Network inventory · US safety stock ${deliveryProjection().safetyStockRemaining} remaining`,pct:clamp(inv.totalAvailable/(TOTAL+200)*100),status:inv.totalAvailable>=4200?'good':inv.totalAvailable>=3600?'warn':'bad',alert:(inv.totalAvailable/(TOTAL+200)*100)<20,alertText:'Available inventory below 20%',delta:state.lastDelta.inventory||'Units'},
{name:'Carbon',icon:'carbon',color:'#26a6b1',value:`${Math.round(state.carbon).toLocaleString()}`,sub:'kg CO₂e estimated',pct:clamp(state.carbon/420000*100),status:state.carbon<140000?'good':state.carbon<290000?'warn':'bad',alert:(state.carbon/420000*100)>80,alertText:'Carbon exposure above 80%',delta:state.lastDelta.carbon?`${state.lastDelta.carbon>0?'+':''}${Math.round(state.lastDelta.carbon).toLocaleString()}`:'—'},
{name:'Customer Satisfaction',icon:'☺',color:'#7f7ce1',value:`${clamp(state.customer).toFixed(0)}%`,sub:'Retailer and customer confidence',pct:clamp(state.customer),status:state.customer>=90?'good':state.customer>=70?'warn':'bad',alert:state.customer<20,alertText:'Customer satisfaction below 20%',delta:state.lastDelta.customer?`${state.lastDelta.customer>0?'+':''}${state.lastDelta.customer}`:'—'},
{name:'Supplier Relationship',icon:'relationship',color:'#ff6b5b',value:`${clamp(state.supplier).toFixed(0)}`,sub:'Score out of 100',pct:clamp(state.supplier),status:state.supplier>=80?'good':state.supplier>=50?'warn':'bad',alert:state.supplier<20,alertText:'Supplier relationship below 20%',delta:state.lastDelta.supplier?`${state.lastDelta.supplier>0?'+':''}${state.lastDelta.supplier}`:'—'}
]}

function iconSvg(name){const icons={cost:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 12h10M12 8v8"/></svg>',delivery:'<svg viewBox="0 0 24 24"><path d="M3 7h11v10H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="18" r="1.5"/><circle cx="18" cy="18" r="1.5"/></svg>',inventory:'<svg viewBox="0 0 24 24"><path d="M4 7l8-4 8 4-8 4z"/><path d="M4 7v10l8 4 8-4V7M12 11v10"/></svg>',carbon:'<svg viewBox="0 0 24 24"><path d="M19 3C12 3 5 7 5 14c0 4 3 7 7 7 7 0 9-8 7-18z"/><path d="M6 18c4-4 7-7 11-10"/></svg>',customer:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>',supplier:'<svg viewBox="0 0 24 24"><path d="M8 12l3 3a2 2 0 0 0 3 0l2-2M3 8l4-3 4 3M21 8l-4-3-4 3M5 10l-2 2 5 5 2-2M19 10l2 2-5 5-2-2"/></svg>'};return icons[name]||icons.inventory}
function transitionScreens(fromId,toId,after){const token=runId,from=document.getElementById(fromId),to=document.getElementById(toId);if(!to)return;if(from){from.classList.add('is-leaving');from.classList.remove('is-active')}setTimeout(()=>{if(token!==runId)return;if(from){from.classList.add('hidden');from.classList.remove('is-leaving')}to.classList.remove('hidden');to.classList.add('is-entering');requestAnimationFrame(()=>requestAnimationFrame(()=>{if(token!==runId)return;to.classList.remove('is-entering');to.classList.add('is-active');if(after)after()}))},300)}
function renderMetrics(){const panel=document.getElementById('metricsPanel');const expanded=panel.classList.contains('metrics-expanded');const icons=['dollar','check','inventory','leaf','smile','handshake'];panel.innerHTML=metricData().map((m,i)=>`<div class="metric status-${m.status}${m.alert?' threshold-alert':''}" style="--metric:${m.color}"${m.alert?` title="${m.alertText}"`:''}><div class="metric-top"><div class="metric-top-left"><span class="metric-icon">${iconSVG(icons[i])}</span><span class="metric-name-wrap"><span class="metric-name">${m.name}</span>${m.alert?'<span class="metric-alert-icon" aria-label="Threshold warning">!</span>':''}</span></div><span class="metric-delta mono">${m.delta}</span></div><div class="metric-value mono" data-value="${m.pct}">${m.value}</div><div class="metric-sub">${m.sub}${m.alert?` · ${iconSVG('warning')} ${m.alertText}`:''}</div><div class="meter"><i style="width:${m.pct}%;background:${m.color}"></i></div></div>`).join('')+`<button class="metrics-toggle" type="button" aria-expanded="${expanded}">${expanded?'Show primary metrics':'Show all metrics'}<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></button><div class="metrics-note">Primary metrics stay visible throughout the simulation.</div>`;panel.classList.toggle('metrics-expanded',expanded);panel.querySelector('.metrics-toggle').onclick=()=>{panel.classList.toggle('metrics-expanded');renderMetrics()};requestAnimationFrame(()=>panel.querySelectorAll('.metric').forEach(m=>m.classList.add('flash')))}
function moveMarker(id,pathId,ratio){const marker=document.getElementById(id),path=document.getElementById(pathId);if(!marker||!path||!path.getTotalLength)return;const len=path.getTotalLength();const pt=path.getPointAtLength(len*Math.max(0,Math.min(1,ratio)));marker.setAttribute('transform',`translate(${pt.x},${pt.y})`)}
function renderMap(){const p=deliveryProjection();const etaText=state.airShare>0&&state.seaShare>0?`LA A${Math.round(p.laAirEta)}/S${Math.round(p.laSeaEta)} · RTM A${Math.round(p.rtmAirEta)}/S${Math.round(p.rtmSeaEta)}`:`LA D${Math.round(p.laEta)} / RTM D${Math.round(p.rtmEta)}`;document.getElementById('networkEta').textContent=etaText;document.getElementById('latestCost').textContent=state.lastDelta.cost?`${state.lastDelta.cost>=0?'+':''}${money(state.lastDelta.cost)}`:'+$0';document.getElementById('riskLabel').textContent=`${clamp(state.risk).toFixed(0)}%`;document.getElementById('routeModeLabel').textContent=state.rtmAirShift?`LA A${Math.round(p.laAirShare*100)}/S${Math.round(p.laSeaShare*100)} • RTM A${Math.round(p.rtmAirShare*100)}/S${Math.round(p.rtmSeaShare*100)}`:`AIR ${Math.round(state.airShare*100)}% • SEA ${Math.round(state.seaShare*100)}%`;document.getElementById('airLA').style.opacity=Math.max(.08,p.laAirShare);document.getElementById('airRTM').style.opacity=Math.max(.08,p.rtmAirShare);document.getElementById('seaLA').style.opacity=Math.max(.08,p.laSeaShare);document.getElementById('seaRTM').style.opacity=Math.max(.08,p.rtmSeaShare);document.getElementById('seaLA').classList.toggle('delayed',state.seaDelay>3);document.getElementById('seaRTM').classList.toggle('delayed',(state.seaDelay+state.rtmSeaDelay)>3);['airLA','airRTM','seaLA','seaRTM'].forEach(id=>document.getElementById(id).classList.toggle('danger',state.risk>65));const airRatio=Math.min(1,state.day/Math.max(5,p.laEta||5));const seaRatio=Math.min(1,state.day/Math.max(18,p.rtmEta||18));moveMarker('planeMarker', state.airShare>=.15 ? (p.laEta<=p.rtmEta?'airLA':'airRTM') : 'airLA', airRatio);moveMarker('shipMarker', state.seaShare>=.15 ? (p.rtmEta>=p.laEta?'seaRTM':'seaLA') : 'seaRTM', seaRatio);document.getElementById('planeMarker').style.opacity=Math.max(p.laAirShare,p.rtmAirShare)>.05?1:.18;document.getElementById('shipMarker').style.opacity=Math.max(p.laSeaShare,p.rtmSeaShare)>.05?1:.18;}
function logIcon(title){const t=title.toLowerCase();if(t.includes('air'))return'plane';if(t.includes('ship')||t.includes('vessel')||t.includes('sea'))return'ship';if(t.includes('supplier'))return'factory';if(t.includes('warehouse'))return'warehouse';if(t.includes('tariff')||t.includes('price')||t.includes('cost'))return'dollar';if(t.includes('quality')||t.includes('damage'))return'package';if(t.includes('demand'))return'chart';return'globe'}
function transportIcon(text){const t=(text||'').toLowerCase();if(t.includes('air')||t.includes('flight'))return'plane';if(t.includes('ship')||t.includes('sea')||t.includes('vessel')||t.includes('port')||t.includes('suez'))return'ship';if(t.includes('warehouse')||t.includes('factory'))return'factory';if(t.includes('supplier'))return'wrench';if(t.includes('tariff')||t.includes('cargo')||t.includes('quality')||t.includes('damage'))return'package';if(t.includes('reallocate')||t.includes('switch')||t.includes('divert'))return'refresh';return'truck'}
function addLog(day,title,impact){const log=document.getElementById('activityLog');const row=document.createElement('div');row.className='log';row.innerHTML=`<span class="log-icon" aria-hidden="true">${iconSVG(transportIcon(title))}</span><span class="daytag mono">DAY ${day}</span><span class="copy"><strong>${title}</strong><small>Operational action recorded in the network log.</small></span><span class="impact mono">${impact}</span>`;log.prepend(row);const count=document.getElementById('logCount');if(count)count.textContent=`${state.history.length||1} decision${(state.history.length||1)===1?'':'s'}`}
function renderAll(){
  if(!state)return;
  const currentDay=document.getElementById('currentDay');
  const daysLeft=document.getElementById('daysLeft');
  const dayProgress=document.getElementById('dayProgress');
  const statusLine=document.getElementById('statusLine');
  if(currentDay)currentDay.textContent=state.day;
  if(daysLeft)daysLeft.textContent=Math.max(0,30-state.day);
  if(dayProgress)dayProgress.style.width=`${clamp(state.day/30*100)}%`;
  if(statusLine)statusLine.textContent=state.day<28
    ?'Protect schedule buffer while preserving cash, carbon and supplier trust.'
    :'Final execution window: secure both destination commitments.';
  renderMetrics();
  renderMap();
}
function updateCrisisProgress(index,resolved=false){const completed=index+(resolved?1:0),pct=completed/crises.length*100;document.getElementById('crisisProgressLabel').textContent=`Crisis ${Math.min(index+1,10)} of ${crises.length}`;document.getElementById('crisisRemainingLabel').textContent=`${crises.length-completed} crises remaining · ${Math.max(0,30-crises[index].day)} days left`;document.getElementById('crisisProgressFill').style.width=`${pct}%`;document.getElementById('crisisSegments').innerHTML=crises.map((c,i)=>`<span title="Day ${c.day}" class="${i<completed?'done':i===index&&!resolved?'current':''}"></span>`).join('')}
function crisisForCurrentState(index){
  const base=crises[index];
  if(index===0){
    const convertibleShare=Math.min(.3,Math.max(0,state.seaShare));
    const scale=convertibleShare/.3;
    const convertedPct=Math.round(convertibleShare*100);
    const remainingSeaPct=Math.round((state.seaShare-convertibleShare)*100);
    const convertedUnits=Math.round(TOTAL*convertibleShare);
    const conversionCost=Math.round(28000*scale);
    const conversionCarbon=Math.round(155000*scale);
    const conversionDelay=convertibleShare>0?3:0;
    const options=base.options.map((o,i)=>{
      if(i!==2)return o;
      if(convertibleShare<=.001)return{
        ...o,
        title:'Maintain the existing all-air plan',
        summary:'No sea freight remains to convert; preserve the current premium-capacity plan.',
        impact:['Convertible sea volume: 0 units','Additional cost: +$0','Additional carbon: +0 kg CO₂e'],
        fx:{resilience:2,risk:-2},
        result:'The network is already fully allocated to air freight, so no additional conversion cost or carbon is incurred.'
      };
      return{
        ...o,
        title:`Convert ${convertedPct}% of total volume from sea to air`,
        summary:`Move the remaining convertible sea volume—${convertedUnits.toLocaleString()} units—to air capacity.`,
        impact:[`Cost: +${money(conversionCost)}`,`Converted volume: ${convertedUnits.toLocaleString()} units`,`Remaining sea share: ${remainingSeaPct}%`,`Carbon: +${conversionCarbon.toLocaleString()} kg CO₂e`],
        fx:{...o.fx,cost:conversionCost,delay:conversionDelay,carbon:conversionCarbon,airShift:convertibleShare},
        result:`You convert ${convertedUnits.toLocaleString()} units (${convertedPct}% of total volume) from sea to air. Cost and carbon are scaled to the volume actually converted.`
      };
    });
    return{...base,options};
  }
  if(index===3){
    const projection=deliveryProjection();
    const seaShare=Math.max(0,projection.rtmSeaShare);
    const seaPct=Math.round(seaShare*100);
    const seaUnits=Math.round(projection.rtmSeaUnits);
    if(seaShare<=.001)return{
      ...base,
      title:'Suez Canal Congestion — No Direct Ocean Exposure',
      desc:'Severe Suez Canal congestion is disrupting Europe-bound ocean services, but your Rotterdam allocation is currently 100% air freight and has no direct vessel exposure.',
      options:[
        {title:'Maintain the current air plan',summary:'Keep the existing allocation and avoid unnecessary intervention.',impact:['Direct Suez exposure: 0 units','Additional cost: +$0','Rotterdam schedule unchanged'],fx:{resilience:3,risk:-3},result:'You avoid unnecessary action because the Rotterdam allocation has no ocean exposure.'},
        {title:'Lock backup air handling capacity',summary:'Reserve contingency handling in case airport or ground operations tighten.',impact:['Cost: +$6,000','Schedule protection: moderate','Carbon: +8,000 kg CO₂e'],fx:{cost:6000,risk:-6,resilience:7,carbon:8000},result:'Backup handling capacity protects the all-air Rotterdam plan against a secondary disruption.'},
        {title:'Invest the unused contingency in supplier resilience',summary:'Use part of the avoided ocean-recovery spend to strengthen upstream continuity.',impact:['Cost: +$4,000','Supplier relationship: +6','Resilience: +7'],fx:{cost:4000,supplier:6,resilience:7,risk:-2},result:'The absence of ocean exposure lets you redirect contingency spend toward upstream resilience.'}
      ]
    };
    const makeShift=(targetShare,baseCost,baseCarbon,seaDelay,risk,resilience,speed)=>{
      const actualShift=Math.min(targetShare,seaShare);
      const ratio=actualShift/targetShare;
      const cost=Math.round(baseCost*ratio);
      const carbon=Math.round(baseCarbon*ratio);
      const afterAir=Math.min(1,projection.rtmAirShare+actualShift);
      const afterSea=Math.max(0,1-afterAir);
      const pct=Math.round(actualShift*100);
      const units=Math.round(computeInventory().rtmAlloc*actualShift);
      return{actualShift,cost,carbon,afterAir,afterSea,pct,units,fx:{cost,rtmSeaDelay:afterSea>0.001?seaDelay:0,risk:Math.round(risk*ratio),resilience:Math.round(resilience*ratio),speed:Math.round(speed*ratio),carbon,rtmAirShift:actualShift}};
    };
    const shift35=makeShift(.35,35000,185000,7,-15,14,18);
    const shift18=makeShift(.18,18400,96000,6,-4,10,8);
    const penalty=Math.round(45000*seaShare);
    const exposureScale=seaShare;
    return{
      ...base,
      desc:`Severe Suez Canal congestion is projected to delay the Rotterdam ocean allocation by 12 days. Current ocean exposure is ${seaUnits.toLocaleString()} units (${seaPct}% of the Rotterdam batch); the air allocation is unaffected.`,
      options:[
        {
          ...base.options[0],
          title:'Accept the delay on the exposed ocean volume',
          summary:`Preserve cash and absorb the delay on ${seaUnits.toLocaleString()} ocean units.`,
          impact:['Cost: +$0',`Affected Rotterdam ocean volume: ${seaUnits.toLocaleString()} units`,'Ocean schedule: +12 days',`Estimated chargeback exposure: ${money(penalty)}`],
          fx:{rtmSeaDelay:12,risk:Math.round(24*exposureScale),customer:Math.round(-12*exposureScale),resilience:Math.round(-18*exposureScale),speed:Math.round(-20*exposureScale),contractPenalty:penalty},
          result:`The ${seaUnits.toLocaleString()}-unit Rotterdam ocean allocation absorbs the 12-day delay. Estimated chargeback exposure is scaled to the volume actually affected.`
        },
        {
          ...base.options[1],
          title:`Shift ${shift35.pct}% of the Rotterdam batch from sea to air`,
          summary:`Convert ${shift35.units.toLocaleString()} units—the maximum available up to 35% of the Rotterdam batch—to air.`,
          impact:[`Cost: +${money(shift35.cost)}`,`Converted volume: ${shift35.units.toLocaleString()} units`,`Post-decision mix: ${Math.round(shift35.afterAir*100)}% air / ${Math.round(shift35.afterSea*100)}% sea`,'Remaining ocean schedule: +7 days'],
          fx:shift35.fx,
          result:`You shift ${shift35.units.toLocaleString()} units (${shift35.pct}% of the Rotterdam batch) from sea to air. The resulting mix is ${Math.round(shift35.afterAir*100)}% air and ${Math.round(shift35.afterSea*100)}% sea.`
        },
        {
          ...base.options[2],
          title:`Shift ${shift18.pct}% of the Rotterdam batch from sea to air`,
          summary:`Convert ${shift18.units.toLocaleString()} units while retaining the remaining lower-cost ocean capacity.`,
          impact:[`Cost: +${money(shift18.cost)}`,`Converted volume: ${shift18.units.toLocaleString()} units`,`Post-decision mix: ${Math.round(shift18.afterAir*100)}% air / ${Math.round(shift18.afterSea*100)}% sea`,'Remaining ocean schedule: +6 days'],
          fx:shift18.fx,
          result:`You shift ${shift18.units.toLocaleString()} units (${shift18.pct}% of the Rotterdam batch) from sea to air. The resulting mix is ${Math.round(shift18.afterAir*100)}% air and ${Math.round(shift18.afterSea*100)}% sea.`
        }
      ]
    };
  }
  if(index===4){
    const projection=deliveryProjection();
    const crisisDay=base.day;
    const arrivals=[];
    if(projection.rtmAirShare>0.001)arrivals.push({mode:'air',eta:projection.rtmAirEta,units:projection.rtmAirUnits});
    if(projection.rtmSeaShare>0.001)arrivals.push({mode:'sea',eta:projection.rtmSeaEta,units:projection.rtmSeaUnits});
    const future=arrivals.filter(a=>a.eta>=crisisDay).sort((a,b)=>a.eta-b.eta);
    const next=future[0]||arrivals.sort((a,b)=>b.eta-a.eta)[0];
    const rawDaysToArrival=next?Math.round(next.eta-crisisDay):0;
    const daysToArrival=Math.max(0,rawDaysToArrival);
    const modeLabel=next?`${next.mode==='air'?'air':'ocean'} batch (${Math.round(next.units).toLocaleString()} units)`: 'remaining inbound volume';
    const timingText=rawDaysToArrival<0
      ?'has already arrived'
      :rawDaysToArrival===0
        ?'is arriving today'
        :rawDaysToArrival===1
          ?'is expected tomorrow'
          :`is expected in ${rawDaysToArrival} days`;
    const storageDays=Math.max(1,Math.min(7,daysToArrival||1));
    const storageCost=storageDays*2100;
    return{
      ...base,
      title:rawDaysToArrival<0?'Rotterdam Warehouse Capacity Constraint':'Rotterdam Warehouse Capacity Full',
      desc:rawDaysToArrival<0
        ?`Rotterdam warehouse utilization has reached 95%. The ${modeLabel} ${timingText}, and the recently received inventory is consuming the remaining capacity. Outbound clearance is now urgent.`
        :`Rotterdam warehouse utilization has reached 95%. The next ${modeLabel} ${timingText}, leaving limited receiving capacity and no room for an unplanned dwell-time extension.`,
      options:base.options.map((o,i)=>{
        if(i===0)return{
          ...o,
          summary:rawDaysToArrival<0?'Accelerate outbound retailer deliveries to release occupied warehouse positions.':'Create receiving space through expedited outbound distribution.',
          impact:['Cost: +$8,000','Outbound warehouse clearance accelerated by 2 days','Service protection: high'],
          result:rawDaysToArrival<0?'Expedited retailer delivery releases occupied capacity two days faster and reduces the risk of further congestion.':'Expedited outbound delivery creates receiving capacity two days faster and protects the next Rotterdam batch.'
        };
        if(i===1)return{
          ...o,
          summary:rawDaysToArrival<0?`Move recently arrived inventory to temporary off-site storage for ${storageDays} day${storageDays===1?'':'s'}.`:`Protect the inbound batch with temporary overflow capacity for ${storageDays} day${storageDays===1?'':'s'}.`,
          impact:[`Cost: +${money(storageCost)} (${storageDays} day${storageDays===1?'':'s'})`,'Operational resilience: -10','Extra handling risk'],
          fx:{...o.fx,cost:storageCost},
          result:rawDaysToArrival<0?`Off-site storage relieves the warehouse for ${storageDays} day${storageDays===1?'':'s'}, but adds handling complexity and cost.`:`Overflow capacity protects the ${modeLabel} for ${storageDays} day${storageDays===1?'':'s'}, but adds handling complexity and cost.`
        };
        return o;
      })
    };
  }
  if(index!==crises.length-1)return base;
  const projection=deliveryProjection();
  const actualShortfall=Math.max(0,LA_REQ-projection.laDelivered);
  const gap=actualShortfall>0?actualShortfall:200;
  const unitAirCost=42;
  const emergencyCost=Math.round(gap*unitAirCost);
  const hasCommittedShortfall=actualShortfall>0;
  const physicalLAAvailable=computeInventory().laAlloc+computeInventory().usSafetyStock;
  const isPhysicalShortfall=hasCommittedShortfall&&physicalLAAvailable<LA_REQ;
  const revenueAtRisk=Math.round(gap*(hasCommittedShortfall?COMMITTED_UNIT_REVENUE:INCREMENTAL_UNIT_REVENUE));
  const description=hasCommittedShortfall
    ?`The Los Angeles retail event is beginning. Based on the live network projection, LA is ${gap.toLocaleString()} unit${gap===1?'':'s'} short of the committed requirement.`
    :`The Los Angeles commitment is currently covered, but the retailer has submitted a last-minute request for ${gap.toLocaleString()} additional event units.`;
  return{
    ...base,
    title:hasCommittedShortfall?'Last-Minute LA Event Shortfall':'Last-Minute LA Demand Increase',
    desc:description,
    options:[
      {
        ...base.options[0],
        title:hasCommittedShortfall?'Air freight the exact recovery quantity':'Air freight the incremental request',
        summary:`Secure ${gap.toLocaleString()} units with emergency air capacity.`,
        impact:[`Cost: +${money(emergencyCost)}`,`LA units: +${gap.toLocaleString()}`,...(!hasCommittedShortfall?[`Incremental revenue: +${money(gap*INCREMENTAL_UNIT_REVENUE)}`]:[]),'Arrival: on time'],
        fx:{...base.options[0].fx,cost:emergencyCost,addLAAir:gap,carbon:Math.round(gap*145),...(!hasCommittedShortfall?{incrementalDemandLA:gap,incrementalAcceptedLA:gap,incrementalFulfillmentCost:emergencyCost}:{})},
        result:hasCommittedShortfall
          ?`The emergency lot closes the projected ${gap.toLocaleString()}-unit LA gap and protects the event launch.`
          :`The emergency lot covers the retailer's ${gap.toLocaleString()}-unit incremental request and protects the commercial upside.`
      },
      {
        ...base.options[1],
        title:hasCommittedShortfall?'Accept the projected shortfall':'Decline the incremental request',
        summary:hasCommittedShortfall?'Avoid premium freight and partially fulfill the committed order.':'Protect the original commitment and decline the late volume increase.',
        impact:[hasCommittedShortfall?`Delivered-volume revenue decreases by approximately ${money(revenueAtRisk)}`:`Incremental revenue opportunity declined: ${money(revenueAtRisk)}`,'No emergency freight cost',`Customer satisfaction: ${hasCommittedShortfall?'-12':'-8'}`],
        fx:{...(!hasCommittedShortfall?{incrementalDemandLA:gap,incrementalAcceptedLA:0}:{}),customer:hasCommittedShortfall?-12:-8,riskControl:hasCommittedShortfall?-8:-3},
        result:hasCommittedShortfall
          ?`LA receives a partial allocation with a ${gap.toLocaleString()}-unit gap, preserving cash but damaging service.`
          :`The original LA commitment remains protected, but the retailer loses the incremental sales opportunity.`
      },
      {
        ...base.options[2],
        title:hasCommittedShortfall?(isPhysicalShortfall?'Negotiate partial fulfillment and a recovery plan':'Negotiate a three-day event postponement'):'Negotiate a later delivery for the extra units',
        summary:hasCommittedShortfall?(isPhysicalShortfall?'Acknowledge the physical inventory gap and agree a staged commercial recovery.':'Use commercial flexibility to recover volume that is available but arriving late.'):'Accept the additional request with a revised delivery window.',
        impact:hasCommittedShortfall
          ?(isPhysicalShortfall?['Cost: +$0',`Physical inventory gap: ${gap.toLocaleString()} units`,'Customer satisfaction: -10','No false promise of full recovery']:['Cost: +$0','Customer satisfaction: -15','LA delivery window: +3 days'])
          :['Cost: +$0','Customer satisfaction: -6','LA delivery window: +3 days'],
        fx:isPhysicalShortfall
          ?{customer:-10,resilience:3,riskControl:4,speed:-5}
          :{customer:hasCommittedShortfall?-15:-6,laDeadlineShift:3,resilience:5,speed:-8,...(!hasCommittedShortfall?{incrementalDemandLA:gap,incrementalAcceptedLA:gap,addLA:gap}:{})},
        result:hasCommittedShortfall
          ?(isPhysicalShortfall
            ?`The retailer accepts a staged recovery plan for the ${gap.toLocaleString()}-unit physical inventory gap. The shortfall remains visible rather than being treated as a timing problem.`
            :`The retailer accepts a three-day postponement, allowing the available but delayed volume to arrive within the revised window.`)
          :`The retailer accepts the additional units on a revised three-day delivery window, preserving the opportunity without emergency freight.`
      }
    ]
  };
}
function showCrisis(index){if(!Number.isInteger(index)||index<0||index>=crises.length)return;document.getElementById('emergencyStartBtn')?.classList.add('hidden');decisionLocked=false;const c=crisisForCurrentState(index);activeCrisis=c;state.crisisIndex=index;state.day=c.day;renderAll();updateCrisisProgress(index,false);document.getElementById('crisisKicker').innerHTML=`<span class="crisis-badge">${iconSVG(transportIcon(c.title))} Crisis ${index+1} · Day ${c.day}</span>`;document.getElementById('crisisTitle').textContent=c.title;document.getElementById('crisisDescription').textContent=c.desc;document.getElementById('decisionCounter').textContent=`Decision ${index+1} of ${crises.length}`;document.getElementById('crisisOptions').innerHTML=c.options.map((o,i)=>`<button type="button" class="option" data-i="${i}"><span class="option-mode">${iconSVG(transportIcon(o.title))}</span><span class="option-letter">${String.fromCharCode(65+i)}</span><h4>${o.title}</h4><p>${o.summary}</p><ul class="impact-list">${o.impact.map(x=>`<li>${x}</li>`).join('')}</ul></button>`).join('');document.querySelectorAll('.option').forEach(b=>b.onclick=()=>chooseOption(index,+b.dataset.i));document.querySelector('.map')?.classList.add('crisis-dimmed');document.getElementById('emergencyStartBtn')?.classList.add('hidden');const optionPane=document.getElementById('crisisOptions');optionPane.scrollTop=0;const crisisCard=document.querySelector('.crisis-card');if(crisisCard)crisisCard.scrollTop=0;document.getElementById('crisisOverlay').classList.add('active')}
function resolveOption(o){
  if(!o.chance)return{fx:o.fx||{},result:o.result,randomMeta:{isRandom:false,probability:1,outcomeIndex:0}};
  const r=Math.random();let cum=0;
  for(let i=0;i<o.chance.length;i++){
    const outcome=o.chance[i];cum+=outcome.p;
    if(r<=cum)return{...outcome,randomMeta:{isRandom:true,probability:outcome.p,outcomeIndex:i,draw:r}};
  }
  const i=o.chance.length-1,outcome=o.chance[i];
  return{...outcome,randomMeta:{isRandom:true,probability:outcome.p,outcomeIndex:i,draw:r}};
}
function decisionSnapshot(){const p=deliveryProjection();return{day:state.day,cost:effectiveTotalCost(),budgetRemaining:BUDGET-effectiveTotalCost(),deliveryRate:p.rate,laDelivered:p.laDelivered,rtmDelivered:p.rtmDelivered,customer:state.customer,supplier:state.supplier,risk:state.risk,carbon:state.carbon,resilience:state.resilience,speed:state.speed,riskControl:state.riskControl,inventory:computeInventory().totalAvailable,safetyStockUsed:p.safetyStockUsed,incrementalDemandLA:p.incrementalDemandLA,incrementalAcceptedLA:p.incrementalAcceptedLA,incrementalDeliveredLA:p.laIncrementalDelivered,incrementalFulfillmentCost:state.incrementalFulfillmentCost}}
function expectedFx(option){if(!option.chance)return option.fx||{};const out={};option.chance.forEach(result=>Object.entries(result.fx||{}).forEach(([k,v])=>out[k]=(out[k]||0)+v*result.p));return out}
function optionContextScore(option,before,day){const f=expectedFx(option),daysLeft=Math.max(1,30-day),budgetBase=Math.max(15000,before.budgetRemaining);let score=0;score+=(f.resilience||0)*1.2+(f.speed||0)*1.15+(f.riskControl||0)*1.15+(f.customer||0)*.8+(f.supplier||0)*.55;score-=(f.risk||0)*.65;score-=Math.max(0,f.delay||0)*(daysLeft<=10?4.5:2.3);score-=Math.max(0,f.rtmAirDelay||0)*(daysLeft<=17?3.5:2.2);score-=Math.max(0,f.rtmSeaDelay||0)*(daysLeft<=17?3.2:2);score-=Math.max(0,f.lossUnits||0)/18+Math.max(0,f.lossLA||0)/15+Math.max(0,f.lossRTM||0)/15;score-=Math.max(0,f.contractPenalty||0)/3500;score+=Math.max(0,f.revenueRecovery||0)/4200;score+=(Math.max(0,f.addLA||0)+Math.max(0,f.addLAAir||0)+Math.max(0,f.addRTM||0))/22;const costPressure=Math.max(0,f.cost||0)/budgetBase*18;score-=costPressure*(before.deliveryRate<90&&daysLeft<12?.55:1);score-=Math.max(0,f.carbon||0)/70000;if(before.deliveryRate<85)score+=(f.speed||0)*.7+(Math.max(0,f.addLA||0)+Math.max(0,f.addLAAir||0)+Math.max(0,f.addRTM||0))/30;if(before.customer<75)score+=(f.customer||0)*.6;if(before.supplier<55)score+=(f.supplier||0)*.5;return score}
function impactSummary(h){const b=h.before||{},a=h.after||{},f=h.fx||{},parts=[];if(Number.isFinite(a.deliveryRate)&&Number.isFinite(b.deliveryRate)){const d=a.deliveryRate-b.deliveryRate;if(Math.abs(d)>=.1)parts.push(`projected delivery ${d>0?'+':''}${d.toFixed(1)} pts`)}if(f.cost)parts.push(`cost ${f.cost>0?'+':''}${money(f.cost)}`);if(f.customer)parts.push(`customer satisfaction ${f.customer>0?'+':''}${f.customer}`);if(f.supplier)parts.push(`supplier relationship ${f.supplier>0?'+':''}${f.supplier}`);if(f.risk)parts.push(`network risk ${f.risk>0?'+':''}${f.risk}`);if(f.delay)parts.push(`schedule ${f.delay>0?'+':''}${f.delay} day${Math.abs(f.delay)===1?'':'s'}`);if(f.rtmAirDelay)parts.push(`Rotterdam air ETA ${f.rtmAirDelay>0?'+':''}${f.rtmAirDelay} days`);if(f.rtmSeaDelay)parts.push(`Rotterdam sea ETA ${f.rtmSeaDelay>0?'+':''}${f.rtmSeaDelay} days`);if(f.revenueRecovery)parts.push(`price recovery +${money(f.revenueRecovery)}`);if(f.incrementalAcceptedLA)parts.push(`incremental demand accepted +${Math.round(f.incrementalAcceptedLA)} units`);if(f.contractPenalty)parts.push(`contract penalty +${money(f.contractPenalty)}`);return parts.slice(0,4).join(' · ')||'The decision primarily changed qualitative resilience and execution flexibility.'}
function decisionAssessment(h){
  const before=h.before||{budgetRemaining:BUDGET,deliveryRate:100,customer:100,supplier:75,risk:20};
  const options=h.options||[];
  const scored=options.map((o,i)=>({i,title:o.title,score:optionContextScore(o,before,h.day),fx:expectedFx(o)})).sort((a,b)=>b.score-a.score);
  const chosenOption=options[h.optionIndex]||{fx:h.fx||{}};
  const decisionQualityScore=optionContextScore(chosenOption,before,h.day);
  const outcomeQualityScore=optionContextScore({fx:h.fx||{}},before,h.day);
  const best=scored[0];
  const chosenWasBest=best&&best.i===h.optionIndex;
  const gap=best?best.score-decisionQualityScore:0;
  const luckDelta=outcomeQualityScore-decisionQualityScore;
  const isRandom=Boolean(h.randomMeta?.isRandom||chosenOption.chance);
  let luckFactor='Not applicable — this option had a deterministic outcome.';
  let luckLabel='Deterministic';
  if(isRandom){
    if(luckDelta>3){luckLabel='Positive luck';luckFactor=`The realized outcome was more favorable than the probability-weighted expectation by ${luckDelta.toFixed(1)} decision-quality points.`}
    else if(luckDelta<-3){luckLabel='Negative luck';luckFactor=`The downside scenario materialized, producing an outcome ${Math.abs(luckDelta).toFixed(1)} points worse than the probability-weighted expectation.`}
    else{luckLabel='Neutral luck';luckFactor='The realized outcome was close to the probability-weighted expectation.'}
  }
  const daysLeft=30-h.day;
  const context=`At Day ${h.day}, you had ${money(before.budgetRemaining)} of budget remaining, ${Number(before.deliveryRate||0).toFixed(1)}% projected on-time delivery, and ${daysLeft} days left in the simulation.`;
  let recommendation;
  if(chosenWasBest||gap<2.5)recommendation=isRandom&&luckDelta<-3
    ?'The decision was strategically reasonable under the information available, but the downside outcome materialized. Keep the decision discipline while considering a contingency for the adverse branch.'
    :'Your choice was well aligned with the operating conditions at that point. Preserve this decision discipline in the next run.';
  else recommendation=`A stronger context-adjusted alternative was “${best.title}.” It offered a better balance of service protection, remaining budget, and late-stage risk under the conditions you faced.`;
  return{...h,quality:decisionQualityScore,decisionQuality:decisionQualityScore,outcomeQuality:outcomeQualityScore,luckDelta,luckFactor,luckLabel,isRandom,context,impact:impactSummary(h),bestAlternative:best?.title||'',chosenWasBest,recommendation,tradeoffMagnitude:Math.abs(h.fx?.cost||0)/3500+Math.abs((h.after?.deliveryRate||0)-(h.before?.deliveryRate||0))*1.5+Math.abs(h.fx?.customer||0)+Math.abs(h.fx?.supplier||0)+Math.abs(h.fx?.risk||0)+Math.abs(h.fx?.delay||0)*3+Math.abs(h.fx?.rtmAirDelay||0)*3+Math.abs(h.fx?.rtmSeaDelay||0)*3};
}
function chooseOption(ci,oi){if(decisionLocked)return;const current=(activeCrisis&&state.crisisIndex===ci)?activeCrisis:crises[ci];if(!current||!current.options[oi])return;decisionLocked=true;const token=runId;const buttons=[...document.querySelectorAll('.option')];buttons.forEach((b,i)=>{b.disabled=true;if(i===oi)b.classList.add('loading')});const c=current,o=c.options[oi],resolved=resolveOption(o),fx=resolved.fx||{},before=decisionSnapshot();setTimeout(()=>{if(token!==runId)return;try{state.lastDelta={};Object.entries(fx).forEach(([k,v])=>{state.lastDelta[k]=v;switch(k){case'cost':state.cost+=v;break;case'customer':state.customer=clamp(state.customer+v);break;case'supplier':state.supplier=clamp(state.supplier+v);break;case'carbon':state.carbon=Math.max(0,state.carbon+v);break;case'risk':state.risk=clamp(state.risk+v);break;case'delay':state.delay+=v;break;case'seaDelay':state.seaDelay+=v;break;case'rtmSeaDelay':state.rtmSeaDelay+=v;break;case'laDelay':state.laDelay+=v;break;case'rtmAirDelay':state.rtmAirDelay+=v;break;case'lossUnits':{const grossLA=Math.max(0,LA_REQ+state.addLA+state.addLAAir+state.moveRtmToLa-state.lossLA),grossRTM=Math.max(0,RTM_REQ+state.addRTM-state.moveRtmToLa-state.lossRTM),grossTotal=grossLA+grossRTM,applied=Math.min(Math.max(0,v),grossTotal);if(grossTotal>0){state.lossLA+=applied*(grossLA/grossTotal);state.lossRTM+=applied*(grossRTM/grossTotal)}}break;case'lossLA':state.lossLA+=v;break;case'lossRTM':state.lossRTM+=v;break;case'addLA':state.addLA+=v;break;case'addLAAir':state.addLAAir+=v;break;case'addRTM':state.addRTM+=v;break;case'moveRtmToLa':state.moveRtmToLa+=v;break;case'contractPenalty':state.contractPenalty+=v;break;case'revenueRecovery':state.revenueRecovery+=v;break;case'incrementalDemandLA':state.incrementalDemandLA+=v;break;case'incrementalAcceptedLA':state.incrementalAcceptedLA+=v;break;case'incrementalFulfillmentCost':state.incrementalFulfillmentCost+=v;break;case'resilience':state.resilience=clamp(state.resilience+v);break;case'speed':state.speed=clamp(state.speed+v);break;case'riskControl':state.riskControl=clamp(state.riskControl+v);break;case'costScore':state.costScore=clamp(state.costScore+v);break;case'airShift':state.airShare=clamp(state.airShare+v,0,1);state.seaShare=1-state.airShare;break;case'rtmAirShift':state.rtmAirShift=clamp(state.rtmAirShift+v,-state.airShare,1-state.airShare);break;case'laDeadlineShift':state.laDeadlineShift+=v;break;}});const p=deliveryProjection();state.lastDelta.delivery=`${p.rate.toFixed(1)}%`;state.lastDelta.inventory=`${computeInventory().totalAvailable.toLocaleString()}`;const after=decisionSnapshot();state.history.push({day:c.day,crisis:c.title,choice:o.title,result:resolved.result,fx,before,after,crisisIndex:ci,optionIndex:oi,randomMeta:resolved.randomMeta||{isRandom:false,probability:1,outcomeIndex:0},options:c.options.map(opt=>({title:opt.title,summary:opt.summary,fx:opt.fx||null,chance:opt.chance||null}))});addLog(c.day,o.title,fx.cost?`${fx.cost>=0?'+':''}${money(fx.cost)}`:'Operational impact');updateCrisisProgress(ci,true);const overlay=document.getElementById('crisisOverlay');overlay.classList.add('resolving');setTimeout(()=>{overlay.classList.remove('active','resolving');document.querySelector('.map')?.classList.remove('crisis-dimmed');renderAll();showConsequence(o.title,resolved.result,()=>advanceAfterDecision(ci))},380)}catch(err){console.error('Decision processing failed:',err);decisionLocked=false;buttons.forEach(b=>{b.disabled=false;b.classList.remove('loading')});document.getElementById('crisisOverlay')?.classList.remove('resolving')}},520)}
function advanceAfterDecision(ci){const token=runId;document.getElementById('consequence').classList.remove('show');if(ci>=crises.length-1){const f=document.getElementById('finalizingOverlay');f.classList.add('active');setTimeout(()=>{if(token!==runId)return;f.classList.remove('active');finishGame()},1900);return}const next=crises[ci+1],inter=document.getElementById('interludeOverlay');document.getElementById('interludeDay').textContent=`Day ${next.day}: Status Check`;const p=deliveryProjection();document.getElementById('interludeText').textContent=`Current spend ${money(effectiveTotalCost())}, projected delivery ${p.rate.toFixed(1)}%, ${30-next.day} days remain.`;inter.classList.add('active');setTimeout(()=>{if(token!==runId)return;inter.classList.remove('active');setTimeout(()=>{if(token===runId)showCrisis(ci+1)},300)},1350)}
function showConsequence(title,text,onContinue){const n=document.getElementById('consequence'),btn=document.getElementById('nextCrisisBtn'),fallback=document.getElementById('emergencyStartBtn');const label=state.crisisIndex>=crises.length-1?'View Final Assessment':'Continue to Next Crisis';let continued=false;const proceed=()=>{if(continued)return;continued=true;btn.classList.add('hidden');fallback?.classList.add('hidden');n.classList.remove('show');onContinue&&onContinue()};document.getElementById('consequenceTitle').innerHTML=`${iconSVG(transportIcon(title))} ${title}`;document.getElementById('consequenceText').textContent=text;btn.classList.remove('hidden');btn.textContent=label;btn.onclick=proceed;if(fallback){fallback.classList.remove('hidden');fallback.textContent=label;fallback.setAttribute('aria-label',label);fallback.onclick=proceed}n.classList.add('show');requestAnimationFrame(()=>{if(!n.classList.contains('show')||getComputedStyle(n).opacity==='0'){fallback?.classList.remove('hidden')}})}
function scores(){const p=deliveryProjection(),effectiveCost=effectiveTotalCost();const costEff=clamp(100-(Math.max(0,effectiveCost-BUDGET)/BUDGET*100)-((100-p.rate)*.45)+(effectiveCost<BUDGET?8:0));const resilience=clamp(state.resilience-(Math.max(0,state.risk-45)*.25)-p.safetyStockUsed/25);const sustainability=clamp(100-state.carbon/420000*100);const speed=clamp((p.rate*.7)+(state.speed*.3));const supplier=clamp(state.supplier);const riskControl=clamp(state.riskControl-(state.risk*.25)+(p.rate*.18)-p.safetyStockUsed/20);return{CostEfficiency:Math.round(costEff),Resilience:Math.round(resilience),Sustainability:Math.round(sustainability),Speed:Math.round(speed),SupplierManagement:Math.round(supplier),RiskControl:Math.round(riskControl)}}
function archetype(s){const vals=Object.entries(s).sort((a,b)=>b[1]-a[1]),top=vals.slice(0,2).map(x=>x[0]),spread=Math.max(...Object.values(s))-Math.min(...Object.values(s));if(spread<16&&Object.values(s).reduce((a,b)=>a+b,0)/6>=68)return['The Balanced Manager','You maintained strong performance across competing objectives without over-optimizing a single dimension.'];if(top.includes('CostEfficiency')&&top.includes('RiskControl'))return['The Cost Guardian','You protected economics while maintaining disciplined exposure control.'];if(top.includes('Resilience')&&top.includes('RiskControl'))return['The Resilient Operator','You built recovery options and contained operational shocks, even when they required selective premiums.'];if(top.includes('Speed')&&s.Speed>=72)return['The Speed Champion','You consistently prioritized service continuity and deadline protection.'];if(top.includes('Sustainability')&&top.includes('SupplierManagement'))return['The Ethical Supply Chain Leader','You favored lower-carbon logistics and durable partner relationships.'];return['The Firefighter','You responded decisively to disruptions, but the overall pattern was more reactive than portfolio-based.']}

function buildDebrief(s,arch){
  const names={CostEfficiency:'Cost Efficiency',Resilience:'Resilience',Sustainability:'Sustainability',Speed:'Speed',SupplierManagement:'Supplier Management',RiskControl:'Risk Control'},ideal={CostEfficiency:80,Resilience:76,Sustainability:72,Speed:82,SupplierManagement:76,RiskControl:78};
  const assessed=state.history.map(decisionAssessment);
  const ranked=[...assessed].sort((a,b)=>b.quality-a.quality);
  const best=ranked.filter(x=>x.chosenWasBest||x.quality>=0).slice(0,3).length?ranked.filter(x=>x.chosenWasBest||x.quality>=0).slice(0,3):ranked.slice(0,3);
  const worst=[...assessed].filter(x=>!x.chosenWasBest).sort((a,b)=>a.quality-b.quality).slice(0,2);
  const trade=[...assessed].sort((a,b)=>b.tradeoffMagnitude-a.tradeoffMagnitude).slice(0,3);
  const weakest=Object.entries(s).sort((a,b)=>a[1]-b[1]).slice(0,2).map(([k])=>names[k]);
  const strongest=Object.entries(s).sort((a,b)=>b[1]-a[1])[0];
  const strategyAdvice={
    'Cost Efficiency':'Reserve a defined contingency budget early and avoid spending that does not measurably improve service or risk.',
    'Resilience':'Build schedule and sourcing options before Day 13 so later disruptions do not force emergency responses.',
    'Sustainability':'Use air freight selectively for priority units and preserve sea capacity for volume that still has schedule buffer.',
    'Speed':'Protect deadline-critical batches early and make ETA decisions by lane rather than by network average.',
    'Supplier Management':'Preserve leverage with primary and backup suppliers through collaborative negotiation and qualified alternatives.',
    'Risk Control':'Choose options that reduce irreversible unit loss, quality exposure, and single-source dependency.'
  };
  return `<section class="report-wrap" id="debriefReport"><div class="report-header"><div class="eyebrow">Strategic Debrief Report</div><h2>Analysis & Recommendations for Your Next Simulation</h2><p>Manager profile: <strong>${arch[0]}</strong> · Strongest dimension: <strong>${names[strongest[0]]} (${strongest[1]})</strong></p></div>
  <article class="report-card good"><h3 class="icon-label">${iconSVG('check')} What You Did Well</h3>${best.map(h=>`<div class="analysis-item"><h4>Decision Excellence: ${h.crisis} (Day ${h.day})</h4><div class="analysis-context"><span class="analysis-chip">Budget before: ${money(h.before?.budgetRemaining||0)}</span><span class="analysis-chip">Delivery before: ${Number(h.before?.deliveryRate||0).toFixed(1)}%</span><span class="analysis-chip">${30-h.day} days remaining</span></div><p><strong>Your choice:</strong> ${h.choice}</p><p><strong>Decision Quality:</strong> ${h.decisionQuality.toFixed(1)} — ${h.chosenWasBest?'Best context-adjusted option':'Reasonable but not the strongest available option'}</p><p><strong>Outcome:</strong> ${h.result}</p><p><strong>Luck Factor:</strong> ${h.luckLabel}. ${h.luckFactor}</p><div class="analysis-impact"><strong>Measured impact:</strong> ${h.impact}</div></div>`).join('')}</article>
  <article class="report-card mistake"><h3 class="icon-label">${iconSVG('warning')} Critical Mistake${worst.length===1?'':'s'} / Missed Opportunities</h3>${worst.length?worst.map(h=>`<div class="analysis-item"><h4>${h.crisis} (Day ${h.day})</h4><p>${h.context}</p><p><strong>Your choice:</strong> ${h.choice}</p><p><strong>Decision Quality:</strong> ${h.decisionQuality.toFixed(1)}</p><p><strong>Outcome:</strong> ${h.result}</p><p><strong>Luck Factor:</strong> ${h.luckLabel}. ${h.luckFactor}</p><div class="analysis-impact"><strong>Observed impact:</strong> ${h.impact}</div><div class="analysis-recommendation"><strong>Better approach:</strong> ${h.recommendation}</div></div>`).join(''):'<p>Your major decisions were generally aligned with the context. The primary opportunity is consistency rather than correcting one severe mistake.</p>'}</article>
  <article class="report-card tradeoffs"><h3 class="icon-label">${iconSVG('scale')} Key Tradeoff Insights</h3>${trade.map((h,i)=>`<div class="analysis-item"><div class="tradeoff-score">Tradeoff intensity ${Math.round(h.tradeoffMagnitude)}</div><h4>Tradeoff #${i+1}: ${h.crisis}</h4><p><strong>Your choice:</strong> ${h.choice}</p><p>${h.context}</p><div class="analysis-impact"><strong>What changed:</strong> ${h.impact}</div><p><strong>General principle:</strong> ${h.day<=13?'Early decisions should buy reversible buffer at a controlled price; late recovery is usually more expensive.':h.day<=22?'Mid-cycle decisions should protect committed service while preserving at least one recovery option.':'Late-stage decisions should prioritize executable service outcomes over theoretical cost optimization.'}</p></div>`).join('')}</article>
  <article class="report-card strategy-plan"><h3 class="icon-label">${iconSVG('lightbulb')} What a Better Strategy Would Look Like</h3><div class="timeline-grid"><div class="timeline-phase"><strong>Day 3–13: Build Optionality</strong><p>Use selective detours, quality controls, and supplier collaboration to create schedule and sourcing buffer before the network becomes constrained.</p></div><div class="timeline-phase"><strong>Day 13–22: Protect Commitments</strong><p>Evaluate LA and Rotterdam independently, deploy premium transport only where it changes on-time delivery, and maintain contingency cash.</p></div><div class="timeline-phase"><strong>Day 22–30: Execute Precisely</strong><p>Separate cost incurred from revenue recovered, protect irreversible customer events, and avoid sacrificing one lane without quantifying the service loss.</p></div></div><p><strong>Your two priority improvements:</strong> ${weakest.map(x=>`${x}: ${strategyAdvice[x]}`).join(' ')}</p>${deliveryProjection().safetyStockUsed>0?`<div class="analysis-recommendation"><strong>Safety-stock consequence:</strong> ${deliveryProjection().safetyStockUsed} units were deployed, creating a ${money(deliveryProjection().safetyStockReplenishmentCost)} replenishment reserve and reducing future resilience until stock is restored.</div>`:''}</article>
  <article class="report-card benchmark"><h3>Your Manager Profile vs. Target Operating Profile</h3><div class="comparison-chart">${Object.entries(s).map(([k,v])=>`<div class="compare-row"><strong>${names[k]}</strong><div class="compare-bars"><div class="compare-bar yours"><i style="width:${v}%"></i></div><div class="compare-bar ideal"><i style="width:${ideal[k]}%"></i></div></div><span class="mono">${v}</span></div>`).join('')}</div><p>Blue bars show your score; gray bars show the simulator-defined target operating profile. This benchmark is an internal learning reference, not an external industry survey. The most valuable next-run improvement is to close the largest gap without sacrificing ${names[strongest[0]]}, your current advantage.</p></article><article class="feedback-card" id="feedbackModule"><h3>Share Your Opinion</h3><p>How useful and realistic did this simulation feel? Your suggestions can guide the next version.</p><div class="feedback-rating" role="group" aria-label="Rate the simulation from 1 to 5"><button type="button" data-rating="1" aria-label="1 out of 5">1</button><button type="button" data-rating="2" aria-label="2 out of 5">2</button><button type="button" data-rating="3" aria-label="3 out of 5">3</button><button type="button" data-rating="4" aria-label="4 out of 5">4</button><button type="button" data-rating="5" aria-label="5 out of 5">5</button></div><textarea id="feedbackText" maxlength="1200" placeholder="What worked well? What should be clearer, more realistic, or more challenging?"></textarea><div class="feedback-actions"><button class="btn btn-secondary" type="button" id="saveFeedback">Submit Feedback</button><span class="feedback-status" id="feedbackStatus" role="status" aria-live="polite"></span></div><p class="feedback-note">Your feedback helps improve future versions of the simulator.</p></article><div class="report-actions"><button type="button" class="btn btn-primary" id="tryAgainReport">Try Again</button><button type="button" class="btn btn-secondary" id="downloadReport">Download PDF</button><button type="button" class="btn btn-secondary" id="shareReport">Share Results</button></div></section>`
}
function reportPayload(s,arch,p){const analysis=state.history.map(decisionAssessment);return{title:'Strategic Debrief Report',archetype:arch[0],scores:s,delivery:{losAngeles:p.laDelivered,rotterdam:p.rtmDelivered,rate:p.rate,incrementalDemand:p.incrementalDemandLA,incrementalAccepted:p.incrementalAcceptedLA,incrementalDelivered:p.laIncrementalDelivered,safetyStockUsed:p.safetyStockUsed,safetyStockRemaining:p.safetyStockRemaining,safetyStockReplenishmentCost:p.safetyStockReplenishmentCost},financials:{totalCost:effectiveTotalCost(),safetyStockReplenishmentCost:p.safetyStockReplenishmentCost,contractPenalty:state.contractPenalty,priceRecovery:state.revenueRecovery,incrementalFulfillmentCost:state.incrementalFulfillmentCost,incrementalUnitRevenue:INCREMENTAL_UNIT_REVENUE,incrementalUnitCost:p.laIncrementalDelivered?state.incrementalFulfillmentCost/p.laIncrementalDelivered:0,incrementalContribution:p.laIncrementalDelivered*INCREMENTAL_UNIT_REVENUE-state.incrementalFulfillmentCost},totalCost:effectiveTotalCost(),decisions:state.history,analysis}}

function pdfSafeText(value){return String(value??'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[–—]/g,'-').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/[^\x20-\x7E]/g,' ')}
function pdfEscape(value){return pdfSafeText(value).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)')}
function wrapPdfText(text,maxChars){const words=pdfSafeText(text).split(/\s+/).filter(Boolean),lines=[];let line='';for(const word of words){if(word.length>maxChars){if(line){lines.push(line);line=''}for(let i=0;i<word.length;i+=maxChars)lines.push(word.slice(i,i+maxChars));continue}const next=line?`${line} ${word}`:word;if(next.length>maxChars){if(line)lines.push(line);line=word}else line=next}if(line)lines.push(line);return lines.length?lines:['']}
function createDebriefPdf(payload){
  const W=595,H=842,margin=48,contentW=W-margin*2;
  const scoreEntries=Object.entries(payload.scores||{});
  const decisions=payload.decisions||[];
  const analysis=(payload.analysis||[]).slice();
  const excellent=analysis.slice().sort((a,b)=>b.quality-a.quality).slice(0,3);
  const mistakes=analysis.filter(a=>!a.chosenWasBest).sort((a,b)=>a.quality-b.quality).slice(0,2);
  const tradeoffs=analysis.slice().sort((a,b)=>b.tradeoffMagnitude-a.tradeoffMagnitude).slice(0,3);
  const scoreNames={CostEfficiency:'Cost Efficiency',Resilience:'Resilience',Sustainability:'Sustainability',Speed:'Speed',SupplierManagement:'Supplier Management',RiskControl:'Risk Control'};
  const ideal={CostEfficiency:76,Resilience:75,Sustainability:70,Speed:78,SupplierManagement:74,RiskControl:76};
  const sortedScores=scoreEntries.slice().sort((a,b)=>b[1]-a[1]);
  const lines=[];
  const add=(text,size=10,bold=false,color=[32,48,64],gap=4,indent=0)=>lines.push({text,size,bold,color,gap,indent});
  add('STRATEGIC DEBRIEF REPORT',20,true,[0,102,204],10);
  add('AI Supply Chain Simulator',12,true,[32,48,64],3);
  add(`Manager Profile: ${payload.archetype}`,15,true,[32,48,64],8);
  add(`On-time Committed Delivery: ${Number(payload.delivery?.rate||0).toFixed(1)}%`,11,true,[0,140,100],2);
  add(`Los Angeles committed: ${payload.delivery?.losAngeles||0} / 2,500 units`,10,false,[62,82,101],1);
  add(`Rotterdam committed: ${payload.delivery?.rotterdam||0} / 1,800 units`,10,false,[62,82,101],1);
  add(`US safety stock deployed: ${payload.delivery?.safetyStockUsed||0} / 200 units`,10,false,[62,82,101],1);
  add(`Safety-stock replenishment reserve: $${Math.round(payload.financials?.safetyStockReplenishmentCost||0).toLocaleString('en-US')}; remaining stock: ${payload.delivery?.safetyStockRemaining??200} units`,10,false,[62,82,101],1);
  add(`Incremental LA demand: ${payload.delivery?.incrementalDelivered||0} delivered / ${payload.delivery?.incrementalDemand||0} requested`,10,false,[62,82,101],1);
  add(`Incremental unit revenue: $${payload.financials?.incrementalUnitRevenue||78} per delivered unit`,10,false,[62,82,101],1);
  add(`Attributed incremental fulfillment cost: $${Math.round(payload.financials?.incrementalFulfillmentCost||0).toLocaleString('en-US')}`,10,false,[62,82,101],1);
  add(`Incremental unit cost: $${Number(payload.financials?.incrementalUnitCost||0).toFixed(2)} per delivered unit`,10,false,[62,82,101],1);
  add(`Incremental contribution: $${Math.round(payload.financials?.incrementalContribution||0).toLocaleString('en-US')}`,10,false,[62,82,101],1);
  add(`Total Cost: $${Math.round(payload.financials?.totalCost||0).toLocaleString('en-US')}`,10,false,[62,82,101],1);
  add(`Contract penalties: $${Math.round(payload.financials?.contractPenalty||0).toLocaleString('en-US')}`,10,false,[62,82,101],1);
  add(`Customer price recovery: $${Math.round(payload.financials?.priceRecovery||0).toLocaleString('en-US')}`,10,false,[62,82,101],10);
  add('MANAGER SCORECARD',13,true,[0,102,204],5);
  scoreEntries.forEach(([k,v])=>add(`${scoreNames[k]||k}: ${v}/100 | Target operating profile: ${ideal[k]||'-'}`,10,true,[32,48,64],2));
  add('',6,false,[32,48,64],8);
  add('WHAT YOU DID WELL',13,true,[0,140,100],6);
  excellent.forEach((d,i)=>{
    add(`${i+1}. Decision Excellence: ${d.crisis} (Day ${d.day})`,11,true,[32,48,64],2);
    add(`Your choice: ${d.choice}`,10,true,[0,102,204],1,12);
    add(d.context,9,false,[62,82,101],1,12);
    add(`Decision quality: ${Number(d.decisionQuality||0).toFixed(1)} | Outcome quality: ${Number(d.outcomeQuality||0).toFixed(1)}`,9,false,[62,82,101],1,12);
    add(`Outcome: ${d.result}`,9,false,[62,82,101],1,12);
    add(`Luck factor: ${d.luckLabel}. ${d.luckFactor}`,9,false,[62,82,101],1,12);
    add(`Measured impact: ${d.impact}`,9,false,[62,82,101],1,12);
    add(d.recommendation,9,false,[62,82,101],6,12);
  });
  add('CRITICAL MISTAKES / MISSED OPPORTUNITIES',13,true,[196,70,70],6);
  if(mistakes.length){mistakes.forEach((d,i)=>{
    add(`${i+1}. ${d.crisis} (Day ${d.day})`,11,true,[32,48,64],2);
    add(`Your choice: ${d.choice}`,10,true,[196,70,70],1,12);
    add(d.context,9,false,[62,82,101],1,12);
    add(`Decision quality: ${Number(d.decisionQuality||0).toFixed(1)} | Outcome quality: ${Number(d.outcomeQuality||0).toFixed(1)}`,9,false,[62,82,101],1,12);
    add(`Outcome: ${d.result}`,9,false,[62,82,101],1,12);
    add(`Luck factor: ${d.luckLabel}. ${d.luckFactor}`,9,false,[62,82,101],1,12);
    add(`What changed: ${d.impact}`,9,false,[62,82,101],1,12);
    add(`Better approach: ${d.recommendation}`,9,false,[62,82,101],6,12);
  })}else add('No single decision materially underperformed the available alternatives. Focus on consistency and portfolio balance.',9,false,[62,82,101],8);
  add('KEY TRADEOFF INSIGHTS',13,true,[0,102,204],6);
  tradeoffs.forEach((d,i)=>{
    add(`Tradeoff ${i+1}: ${d.crisis} (Day ${d.day})`,11,true,[32,48,64],2);
    add(`Choice: ${d.choice}`,10,true,[0,102,204],1,12);
    add(d.context,9,false,[62,82,101],1,12);
    add(`Metric impact: ${d.impact}`,9,false,[62,82,101],6,12);
  });
  add('BETTER STRATEGY FOR THE NEXT RUN',13,true,[112,82,170],6);
  add('Day 3-13 - Build optionality: pay selectively for reversible schedule and sourcing buffer before constraints compound.',10,false,[62,82,101],2);
  add('Day 13-22 - Protect commitments: evaluate LA and Rotterdam separately and deploy premium capacity only where it changes on-time delivery.',10,false,[62,82,101],2);
  add('Day 22-30 - Execute precisely: separate delivered-volume revenue, incremental demand, price recovery, and contract penalties before making late-stage tradeoffs.',10,false,[62,82,101],8);
  add('PROFILE VS TARGET OPERATING PROFILE',13,true,[0,102,204],6);
  add('This benchmark is a simulator-defined target profile for learning purposes, not an external industry survey.',9,false,[62,82,101],4);
  sortedScores.forEach(([k,v])=>add(`${scoreNames[k]||k}: ${v} vs target ${ideal[k]||'-'} (${v-(ideal[k]||0)>=0?'+':''}${v-(ideal[k]||0)})`,10,false,[62,82,101],2));
  add('FULL DECISION HISTORY',13,true,[0,102,204],6);
  decisions.forEach((d,i)=>{
    add(`${i+1}. Day ${d.day}: ${d.crisis}`,11,true,[32,48,64],2);
    add(`Decision: ${d.choice}`,10,true,[0,102,204],1,12);
    add(`Outcome: ${d.result}`,9,false,[62,82,101],6,12);
  });
  const pages=[];let page=[],y=H-margin;
  for(const item of lines){
    const maxChars=Math.max(22,Math.floor((contentW-item.indent)/(item.size*.53)));
    const wrapped=wrapPdfText(item.text,maxChars);
    for(const text of wrapped){
      const lineHeight=item.size*1.38;
      if(y-lineHeight<margin){pages.push(page);page=[];y=H-margin}
      page.push({...item,text,y});y-=lineHeight;
    }
    y-=item.gap;
  }
  if(page.length)pages.push(page);
  const objects=[];
  const addObj=s=>{objects.push(s);return objects.length};
  addObj('<< /Type /Catalog /Pages 2 0 R >>');
  addObj('PAGES_PLACEHOLDER');
  addObj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  addObj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
  const kids=[];
  pages.forEach((items,index)=>{
    const pageId=5+index*2,contentId=pageId+1;kids.push(`${pageId} 0 R`);
    const commands=['q','1 1 1 rg','0 0 595 842 re f','Q'];
    items.forEach(it=>{
      const [r,g,b]=it.color.map(v=>(v/255).toFixed(3));
      commands.push('BT',`/${it.bold?'F2':'F1'} ${it.size} Tf`,`${r} ${g} ${b} rg`,`1 0 0 1 ${margin+it.indent} ${it.y.toFixed(1)} Tm`,`(${pdfEscape(it.text)}) Tj`,'ET');
    });
    const footer=`Page ${index+1} of ${pages.length}`;
    commands.push('BT','/F1 8 Tf','0.45 0.52 0.60 rg',`1 0 0 1 500 24 Tm`,`(${pdfEscape(footer)}) Tj`,'ET');
    const stream=commands.join('\n');
    addObj(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`);
    addObj(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  });
  objects[1]=`<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${pages.length} >>`;
  let pdf='%PDF-1.4\n%SCDEBRIEF\n',offsets=[0];
  objects.forEach((obj,i)=>{offsets.push(pdf.length);pdf+=`${i+1} 0 obj\n${obj}\nendobj\n`});
  const xref=pdf.length;pdf+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`;
  for(let i=1;i<offsets.length;i++)pdf+=`${String(offsets[i]).padStart(10,'0')} 00000 n \n`;
  pdf+=`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf],{type:'application/pdf'});
}
function downloadDebriefPdf(payload){const blob=createDebriefPdf(payload),a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download='supply-chain-strategic-debrief.pdf';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2500)}

function wireReportActions(s,arch,p){const retry=document.getElementById('tryAgainReport'),download=document.getElementById('downloadReport'),share=document.getElementById('shareReport'),view=document.getElementById('viewDebrief');if(retry)retry.onclick=reset;if(download)download.onclick=()=>downloadDebriefPdf(reportPayload(s,arch,p));if(share)share.onclick=async()=>{const text=`AI Supply Chain Simulator: ${arch[0]}, ${p.rate.toFixed(1)}% on-time delivery, total cost ${money(effectiveTotalCost())}.`;try{if(navigator.share){await navigator.share({title:'AI Supply Chain Simulator Results',text})}else if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);alert('Results copied to clipboard.')}else{const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();alert('Results copied to clipboard.')}}catch(e){console.warn('Share unavailable:',e)}};if(view)view.onclick=()=>{const report=document.getElementById('debriefReport');if(!report)return;report.scrollIntoView({behavior:'smooth'});document.querySelectorAll('.report-card').forEach((el,i)=>setTimeout(()=>el.classList.add('revealed'),i*140))};bindFeedbackModule()}

function bindFeedbackModule(){const module=document.getElementById('feedbackModule');if(!module)return;const buttons=[...module.querySelectorAll('[data-rating]')],text=document.getElementById('feedbackText'),status=document.getElementById('feedbackStatus'),save=document.getElementById('saveFeedback');let rating=0;const setStatus=(message,isError=false)=>{status.textContent=message;status.style.color=isError?'#e7a578':'#8fcbbd'};try{const saved=JSON.parse(localStorage.getItem('supplyChainSimulatorFeedback')||'null');if(saved){rating=Number(saved.rating)||0;text.value=saved.comment||'';buttons.forEach(b=>{const active=Number(b.dataset.rating)===rating;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active))})}}catch(e){}buttons.forEach(button=>button.onclick=()=>{rating=Number(button.dataset.rating);buttons.forEach(b=>{const active=Number(b.dataset.rating)===rating;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active))});setStatus(`Rating selected: ${rating}/5`)});text.addEventListener('input',()=>{text.removeAttribute('aria-invalid');if(status.textContent.startsWith('Please'))setStatus('')});save.onclick=()=>{const comment=text.value.trim();if(!rating){setStatus('Please select a rating before submitting.',true);buttons[0].focus();return}if(!comment){setStatus('Please enter your feedback before submitting.',true);text.setAttribute('aria-invalid','true');text.focus();return}const payload={rating,comment,savedAt:new Date().toISOString()};try{localStorage.setItem('supplyChainSimulatorFeedback',JSON.stringify(payload));text.removeAttribute('aria-invalid');setStatus('Thank you — your feedback has been recorded.')}catch(e){setStatus('Feedback could not be submitted. Please try again.',true)}}}
function animateResultScore(score){const ring=document.querySelector('.result-hero .score'),num=document.getElementById('resultScoreValue');if(!ring||!num)return;const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduce){ring.style.background=`conic-gradient(var(--green) ${score*3.6}deg,#dfe9f2 0)`;num.textContent=score;return;}const start=performance.now(),duration=1050;function tick(now){const t=Math.min(1,(now-start)/duration),ease=1-Math.pow(1-t,3),v=Math.round(score*ease);num.textContent=v;ring.style.background=`conic-gradient(var(--green) ${score*3.6*ease}deg,#dfe9f2 0)`;if(t<1)requestAnimationFrame(tick)}requestAnimationFrame(tick)}
function finishGame(){state.day=30;renderAll();const p=deliveryProjection(),s=scores(),arch=archetype(s),delivered=p.laDelivered+p.rtmDelivered,committedRevenue=Math.round(delivered*COMMITTED_UNIT_REVENUE),incrementalRevenue=Math.round(p.laIncrementalDelivered*INCREMENTAL_UNIT_REVENUE),revenue=Math.round(committedRevenue+incrementalRevenue-state.contractPenalty+state.revenueRecovery),effectiveCost=effectiveTotalCost(),profit=revenue-effectiveCost;const avg={CostEfficiency:66,Resilience:68,Sustainability:61,Speed:70,SupplierManagement:67,RiskControl:65};const names={CostEfficiency:'Cost Efficiency',Resilience:'Resilience',Sustainability:'Sustainability',Speed:'Speed',SupplierManagement:'Supplier Management',RiskControl:'Risk Control'};const totalScore=Math.round(Object.values(s).reduce((a,b)=>a+b,0)/6);const sorted=Object.entries(s).sort((a,b)=>b[1]-a[1]);const rs=document.getElementById('resultScreen');rs.innerHTML=`<div class="result-hero"><div class="result-hero-main"><div class="score mono"><span id="resultScoreValue">0</span></div><div class="result-copy"><div class="eyebrow">Final Executive Assessment</div><h2>${arch[0]}</h2><p>${arch[1]} Over the 30-day simulation, you prioritized <b>${names[sorted[0][0]]}</b> over <b>${names[sorted[sorted.length-1][0]]}</b>. Your choices delivered ${p.rate.toFixed(1)}% of committed units on time.</p></div></div><aside class="result-cta"><div class="result-cta-label">Next Step</div><h3>Understand the decisions behind your score.</h3><p>Open your strategic debrief for decision-by-decision feedback, critical tradeoffs, and a stronger plan for the next run.</p><div class="result-quick-stats"><div class="quick-stat"><span>On-time delivery</span><strong class="mono">${p.rate.toFixed(1)}%</strong></div><div class="quick-stat"><span>Total spent</span><strong class="mono">${money(effectiveCost)}</strong></div><div class="quick-stat"><span>Top strength</span><strong>${names[sorted[0][0]]}</strong></div><div class="quick-stat"><span>Priority gap</span><strong>${names[sorted[sorted.length-1][0]]}</strong></div></div><button type="button" class="btn btn-primary" id="viewDebrief">View Strategic Debrief</button></aside></div>
<div class="result-grid"><div class="panel"><div class="panel-head"><h3>Delivery & Financial Summary</h3><span class="subtle mono">DAY 30</span></div><div class="summary-cards"><div class="summary-card"><span>Los Angeles</span><strong class="mono">${p.laDelivered.toLocaleString()} / ${LA_REQ.toLocaleString()}</strong><small>${(p.laDelivered/LA_REQ*100).toFixed(1)}% committed on time · ${p.safetyStockUsed} safety-stock units used · ${p.safetyStockRemaining} remain</small></div><div class="summary-card"><span>Rotterdam</span><strong class="mono">${p.rtmDelivered.toLocaleString()} / ${RTM_REQ.toLocaleString()}</strong><small>${(p.rtmDelivered/RTM_REQ*100).toFixed(1)}% on time</small></div><div class="summary-card"><span>Net Realized Revenue</span><strong class="mono">${money(revenue)}</strong><small>${p.laIncrementalDelivered} incremental LA units at $${INCREMENTAL_UNIT_REVENUE}/unit · net of contract penalties</small></div><div class="summary-card"><span>Operating Contribution</span><strong class="mono">${money(profit)}</strong><small>Safety stock used: ${p.safetyStockUsed} · Replenishment reserve: ${money(p.safetyStockReplenishmentCost)} · Incremental unit cost: ${p.laIncrementalDelivered?money(state.incrementalFulfillmentCost/p.laIncrementalDelivered):'$0.00'}</small></div></div><div class="mini-world result-world-map" style="margin-top:16px"><svg viewBox="0 0 560 170" preserveAspectRatio="none"><path d="M30 70L90 28 172 35 202 72 169 106 98 111 54 93Z" fill="#263b4d" stroke="#426078"/><path d="M162 104L205 120 220 154 191 170 157 144Z" fill="#263b4d" stroke="#426078"/><path d="M246 42L332 24 422 42 487 73 528 66 540 111 476 129 414 112 365 140 296 126 255 95Z" fill="#263b4d" stroke="#426078"/><path d="M312 116L362 119 394 164 348 172 304 145Z" fill="#263b4d" stroke="#426078"/><path d="M458 140L511 135 536 156 512 175 468 173 446 155Z" fill="#263b4d" stroke="#426078"/><path d="M432 76 Q282 18 115 92" fill="none" stroke="#b7835a" stroke-width="3" stroke-dasharray="8 8"/><path d="M432 76 C402 104 380 132 315 77" fill="none" stroke="#4faf9d" stroke-width="3" stroke-dasharray="8 8"/><circle cx="432" cy="76" r="7" fill="#b7835a" stroke="#0b1623" stroke-width="4"/><circle cx="115" cy="92" r="7" fill="#4faf9d" stroke="#0b1623" stroke-width="4"/><circle cx="315" cy="77" r="7" fill="#4faf9d" stroke="#0b1623" stroke-width="4"/><text x="443" y="73" fill="#eaf1f7" font-size="12" font-weight="800">Shanghai</text><text x="55" y="88" fill="#eaf1f7" font-size="12" font-weight="800">Los Angeles ${p.laDelivered>=LA_REQ?'✓':'⚠'}</text><text x="326" y="71" fill="#eaf1f7" font-size="12" font-weight="800">Rotterdam ${p.rtmDelivered>=RTM_REQ?'✓':'⚠'}</text></svg></div></div>
<div class="panel"><div class="panel-head"><h3>Manager Profile</h3><span class="subtle">Compared with simulation benchmark</span></div><div class="score-bars">${Object.entries(s).map(([k,v])=>`<div class="score-row"><div class="score-row-head"><span>${names[k]}</span><b class="mono">${v}</b></div><div class="scorebar"><i style="width:${v}%"></i></div><div class="avg">Simulation benchmark ${avg[k]} • ${v-avg[k]>=0?'+':''}${v-avg[k]} points</div></div>`).join('')}</div></div></div>
<div class="panel" style="margin-top:18px"><div class="panel-head"><h3>Decision History</h3><span class="subtle">10 disruption responses</span></div><div style="overflow:auto"><table class="history-table"><thead><tr><th>Day</th><th>Crisis</th><th>Decision</th><th>Consequence</th></tr></thead><tbody>${state.history.map(h=>`<tr><td class="mono">${h.day}</td><td>${h.crisis}</td><td>${h.choice}</td><td>${h.result}</td></tr>`).join('')}</tbody></table></div></div>${buildDebrief(s,arch)}`;transitionScreens('gameScreen','resultScreen',()=>{window.scrollTo({top:0,behavior:'smooth'});requestAnimationFrame(()=>{document.querySelector('.result-hero')?.classList.add('result-ready');rs.classList.add('results-ready');animateResultScore(totalScore);});});wireReportActions(s,arch,p);setTimeout(()=>document.querySelectorAll('.scorebar i').forEach(i=>i.style.width=i.style.width),100)}
function reset(){runId++;decisionLocked=false;launchLocked=false;activeCrisis=null;selectedStrategy=null;state=freshState();['launchOverlay','crisisOverlay','interludeOverlay','finalizingOverlay'].forEach(id=>document.getElementById(id)?.classList.remove('active','resolving'));document.getElementById('consequence')?.classList.remove('show');document.querySelector('.map')?.classList.remove('crisis-dimmed');const game=document.getElementById('gameScreen'),result=document.getElementById('resultScreen'),intro=document.getElementById('introScreen'),phase=document.getElementById('phaseScreen'),rules=document.getElementById('rulesScreen');[game,result,phase,rules].forEach(el=>{if(!el)return;el.classList.add('hidden');el.classList.remove('is-active','is-entering','is-leaving')});if(result)result.innerHTML='';intro.classList.remove('hidden','is-entering','is-leaving');intro.classList.add('is-active');const launchBtn=document.getElementById('launchBtn');launchBtn.disabled=true;document.getElementById('strategyEstimate').textContent='Select a strategy to calculate initial spend, ETA and emissions.';document.getElementById('activityLog').innerHTML='';document.getElementById('metricsPanel').innerHTML='';document.getElementById('emergencyStartBtn')?.classList.add('hidden');renderStrategies();window.scrollTo({top:0,behavior:'smooth'})}
document.getElementById('enterPhaseBtn').onclick=()=>transitionScreens('introScreen','rulesScreen',()=>window.scrollTo({top:0,behavior:'smooth'}));document.getElementById('backToIntroBtn').onclick=()=>transitionScreens('rulesScreen','introScreen',()=>window.scrollTo({top:0,behavior:'smooth'}));document.getElementById('continueToPhaseBtn').onclick=()=>transitionScreens('rulesScreen','phaseScreen',()=>window.scrollTo({top:0,behavior:'smooth'}));document.getElementById('backToProductBtn').onclick=()=>transitionScreens('phaseScreen','rulesScreen',()=>window.scrollTo({top:0,behavior:'smooth'}));document.getElementById('launchBtn').onclick=launch;document.getElementById('resetBtn').onclick=reset;document.getElementById('emergencyStartBtn').onclick=()=>{decisionLocked=false;renderAll();showCrisis(state.crisisIndex||0)};document.getElementById('crisisCloseBtn').onclick=()=>{document.getElementById('crisisOverlay').classList.remove('active','resolving');document.querySelector('.map')?.classList.remove('crisis-dimmed');const resume=document.getElementById('emergencyStartBtn');resume.classList.remove('hidden');resume.textContent=`Resume Crisis ${(state.crisisIndex||0)+1} — decision required`;resume.setAttribute('aria-label',`Resume Crisis ${(state.crisisIndex||0)+1}. A decision is still required.`);resume.onclick=()=>{decisionLocked=false;renderAll();showCrisis(state.crisisIndex||0)};resume.scrollIntoView({behavior:'smooth',block:'center'})};state=freshState();renderStrategies();
})();
