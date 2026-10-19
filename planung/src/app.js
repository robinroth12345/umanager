(function(){
'use strict';
const DATA=JSON.parse(document.getElementById('plan-data').textContent);
const SV=DATA.stoff;
const DAYS=['Mo','Di','Mi','Do','Fr'];
const $=(s,r=document)=>r.querySelector(s);
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const icon=id=>`<svg aria-hidden="true"><use href="#${id}"/></svg>`;
const pad=n=>String(n).padStart(2,'0');
const iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const fmt=s=>{const [y,m,d]=s.split('-');return `${+d}.${+m}.`;};
const fmtL=s=>{const dt=new Date(s+'T12:00:00');return ['So','Mo','Di','Mi','Do','Fr','Sa'][dt.getDay()]+' '+fmt(s);};
const fmtT=ms=>{const d=new Date(ms);return `${iso(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;};
const now=()=>Date.now();
const today=iso(new Date());
const faecher=DATA.faecher;
const FIDS=Object.keys(faecher);
const clone=o=>JSON.parse(JSON.stringify(o));

/* ---------- Zustand (nur lokal im Browser, Export/Import siehe Reiter Daten) ---------- */
const LS='uebersicht-unterricht-v1', LSP='uebersicht-unterricht-prev';
let lsOK=true;
function lsGet(k){try{return localStorage.getItem(k);}catch(e){lsOK=false;return null;}}
function lsSet(k,v){try{localStorage.setItem(k,v);return true;}catch(e){lsOK=false;return false;}}
function emptyF(){return {order:null,uo:0,h:{},d:{},n:{},t:{},c:{},x:{},u:{},soll:null,imp:null,bpx:{}};}
function normF(o){const e=emptyF();if(!o||typeof o!=='object')return e;for(const k of Object.keys(e)){if(o[k]!==undefined&&o[k]!==null)e[k]=o[k];}return e;}
function emptyS(){return {app:'uebersicht-unterricht',v:1,saved:0,wochen:null,st:{},ls:{},kal:{e:{},x:{}},sj:null};}
function normS(r){const s=emptyS();if(!r||typeof r!=='object')return s;s.saved=+r.saved||0;s.wochen=r.wochen||null;
  Object.keys(r.st||{}).forEach(f=>{s.st[f]=normF(r.st[f]);});
  s.ls=(r.ls&&typeof r.ls==='object')?r.ls:{};
  if(r.kal&&typeof r.kal==='object')s.kal={e:r.kal.e||{},x:r.kal.x||{}};
  if(r.sj&&r.sj.von&&r.sj.bis)s.sj=r.sj;return s;}
let S;
try{S=normS(JSON.parse(lsGet(LS)||'null'));}catch(e){S=emptyS();}
function fs(f){return S.st[f]||(S.st[f]=emptyF());}
function save(){S.saved=now();const ok=lsSet(LS,JSON.stringify(S));setSaveState(ok);}
function setSaveState(ok){const e=$('#savestate');if(!e)return;
  if(!ok||!lsOK){e.className='savestate warn';e.textContent='Browser blockiert das Speichern: bitte regelmäßig exportieren (Reiter Daten)';}
  else if(S.saved){e.className='savestate';e.textContent='Lokal im Browser gespeichert, '+fmtT(S.saved).slice(11);}
  else{e.className='savestate';e.textContent='Noch keine eigenen Änderungen';}}

/* ---------- Thema hell/dunkel ---------- */
try{const t=lsGet('uebersicht-theme');if(t)document.documentElement.dataset.theme=t;}catch(e){}
$('#themeBtn').onclick=()=>{
  const cur=document.documentElement.dataset.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  const nxt=cur==='dark'?'light':'dark';document.documentElement.dataset.theme=nxt;lsSet('uebersicht-theme',nxt);};
$('#stand').textContent='Stand '+fmt(DATA.meta.stand)+DATA.meta.stand.slice(0,4);

/* ---------- Stoffverteilung: effektive Daten ---------- */
function baseF(f){const s=S.st[f];return (s&&s.imp)||SV.faecher[f];}
function bpTexts(f){const s=S.st[f];return Object.assign({},SV.faecher[f].bp,(s&&s.imp&&s.imp.bp)||{},(s&&s.bpx)||{});}
function sollOf(f){const st=S.st[f];if(st&&st.soll!=null)return st.soll;return (S.wochen||SV.wochen)*SV.faecher[f].stdProWoche;}
function eff(f){
  const st=fs(f),b=baseF(f),map={},baseIds=b.bloecke.map(x=>x.id);
  b.bloecke.forEach(x=>map[x.id]=x);Object.keys(st.c).forEach(id=>map[id]=st.c[id]);
  let order=(st.order||[]).filter(id=>map[id]&&!st.x[id]);const have=new Set(order);
  baseIds.forEach((id,i)=>{if(have.has(id)||st.x[id])return;let pos=-1;
    for(let j=i-1;j>=0;j--){const k=order.indexOf(baseIds[j]);if(k>=0){pos=k;break;}}
    order.splice(pos+1,0,id);have.add(id);});
  Object.keys(st.c).forEach(id=>{if(!have.has(id)&&!st.x[id]){order.push(id);have.add(id);}});
  return order.map(id=>{const x=map[id];const dv=st.d[id];
    return {id,b:x.b||'',t:st.t[id]!==undefined?st.t[id]:x.t,std:st.h[id]!==undefined?st.h[id]:x.std,ref:x.ref||'',inhalt:x.inhalt||'',prakt:x.prakt||'',
      bp:x.bp||[],done:dv!==undefined?!!dv:!!x.done,doneAt:typeof dv==='string'?dv:'',note:st.n[id]!==undefined?st.n[id]:(x.note||''),custom:!!st.c[id],typ:x.typ||''};});
}
function touch(f,id){fs(f).u[id]=now();save();}
function setOrder(f,ids){const st=fs(f);st.order=ids;st.uo=now();save();}
function sums(f){
  const bl=eff(f),soll=sollOf(f);let tot=0,done=0;bl.forEach(b=>{tot+=b.std;if(b.done)done+=b.std;});
  const nxt=bl.find(b=>!b.done&&b.std>0);
  return {bl,soll,tot,done,plan:tot-done,rest:soll-tot,nxt};
}
function bereichOf(f,id){return baseF(f).bereiche.find(x=>x.id===id);}

const ui={open:{},openG:{},adding:{},drag:null,wk:0,jv:'jahr',jc:'alle',jz:'alle',sec:-1,mon:'',kedit:null,kcand:null,kmsg:''};
let SCH={};
/*@@CAL@@*/
/* ---------- Legende, Wochenraster ---------- */
function legend(){const d=el('div','legend');
  Object.entries(DATA.status).forEach(([k,s])=>d.appendChild(el('span','item',`<span class="chip st-${k}">${icon(s.icon)}</span>${esc(s.label)}`)));
  d.appendChild(el('span','item',`<span class="chip ab">${icon('i-doc')}</span>Arbeitsblatt bereit`));return d;}
function lkey(l){return l.datum+'|'+l.std+'|'+l.klasse;}
function lessons(){return DATA.stunden.map(l=>{const o=S.ls[lkey(l)];return o?Object.assign({},l,{status:o.status,ab:o.ab,notiz:o.notiz,_edit:true}):l;});}
function weekDates(w){const out=[];const s=new Date(w.von+'T12:00:00');for(let i=0;i<5;i++){const d=new Date(s);d.setDate(s.getDate()+i);out.push(iso(d));}return out;}
let view=lsGet('uebersicht-view')||(innerWidth<760?'liste':'raster');
function cellHTML(l){const s=DATA.status[l.status];const dbl=l.dauer>1?' <small>Doppelstd.</small>':'';
  return `<div class="top"><span class="kl">${esc(l.klasse)} · ${esc(l.fach.replace(/-\d+$/,''))}${dbl}</span><span class="icons">${l.ab?`<span class="abic" title="Arbeitsblatt bereit">${icon('i-doc')}</span>`:''}<span title="${esc(s.label)}">${icon(s.icon)}</span></span></div><div class="th">${esc(l.kurz)}</div>`;}
function openCell(l){const b=el('button','cell st-'+l.status,cellHTML(l));
  b.setAttribute('aria-label',`${l.klasse} ${l.fach}, ${l.kurz}, ${DATA.status[l.status].label}${l.ab?', Arbeitsblatt bereit':''}`);
  if(l.dauer>1)b.style.minHeight=`calc(68px * ${l.dauer} + 4px * ${l.dauer-1})`;
  b.onclick=()=>showLesson(l);return b;}
function weekCard(w,idx,LS_){
  const dates=weekDates(w),isNow=dates.includes(today),wk=el('section','week');
  const rel=ui.wk===0?(idx===0?'aktuelle KW':'nächste KW'):(isNow?'aktuelle KW':(today<w.von?'kommende KW':'vergangene KW'));
  wk.appendChild(el('h2','',`<span>KW ${w.kw} <span class="sub">${fmt(w.von)}–${fmt(w.bis)}</span></span><span class="badge">${rel}</span>`));
  const holder=el('div',view==='liste'?'view-list':'');
  let h='<table class="plan"><thead><tr><th></th>';
  dates.forEach((d,i)=>{const bk=blockedGlobal(d);h+=`<th class="${d===today?'today':''}">${DAYS[i]}<span class="d">${fmt(d)}${i===2?' · frei':''}</span>${bk?`<span class="kn" title="${esc(bk.name)}">${esc(bk.name)}</span>`:''}</th>`;});
  h+='</tr></thead><tbody></tbody></table>';holder.innerHTML=h;
  const tb=$('tbody',holder),skip={};
  for(let std=1;std<=6;std++){const tr=el('tr');
    tr.appendChild(el('td','time',`<b>${std}</b>${DATA.zeiten[std].replace('–','–<br>')}`));
    dates.forEach((d,i)=>{const key=d+'|'+std;if(skip[key])return;
      const l=LS_.find(x=>x.datum===d&&x.std===std);const td=el('td');
      if(l){if(l.dauer>1){td.rowSpan=l.dauer;td.style.height='auto';for(let k=1;k<l.dauer;k++)skip[d+'|'+(std+k)]=true;}td.appendChild(openCell(l));}
      else{const bk=blockedGlobal(d);td.className='empty'+((i===2||bk)?' frei':'')+(d===today?' todaycol':'');if(bk)td.title=bk.name;}
      tr.appendChild(td);});
    tb.appendChild(tr);}
  const list=el('div','list');
  dates.forEach((d,i)=>{const ls=LS_.filter(x=>x.datum===d).sort((a,b)=>a.std-b.std);
    const card=el('div','daycard'+(d===today?' today':''),`<h3><span>${DAYS[i]} ${fmt(d)}</span><span class="muted">${ls.length?'':'frei'}</span></h3>`);
    ls.forEach(l=>{const r=el('div','row');const end=l.std+l.dauer-1;
      r.appendChild(el('div','t',`<b>${l.std}${l.dauer>1?'+'+end:''}. Std</b>${DATA.zeiten[l.std].split('–')[0]}–${DATA.zeiten[end].split('–')[1]}`));
      const wrap=el('div','cellwrap');wrap.appendChild(openCell(l));r.appendChild(wrap);card.appendChild(r);});
    list.appendChild(card);});
  holder.appendChild(list);wk.appendChild(holder);return wk;}

/* ---------- Stunden-Dialog (mit händischer Korrektur) ---------- */
function showLesson(l){
  const s=DATA.status[l.status],f=faecher[l.fach]||{};
  const mats=(l.material||[]).map(p=>`<li><a href="${encodeURI(p)}" target="_blank" rel="noopener">${esc(p)}</a></li>`).join('');
  const tEnd=l.std+l.dauer-1;
  const opts=Object.entries(DATA.status).map(([k,v])=>`<option value="${k}"${k===l.status?' selected':''}>${esc(v.label)}</option>`).join('');
  $('#dlgBody').innerHTML=`<button class="btn close" id="dlgClose">Schließen</button>
    <h3>${esc(l.klasse)} · ${esc(f.name||l.fach)}</h3>
    <div class="meta">${fmtL(l.datum)} · ${l.std}${l.dauer>1?'.–'+tEnd+'.':'.'} Std (${DATA.zeiten[l.std].split('–')[0]}–${DATA.zeiten[tEnd].split('–')[1]})</div>
    <div class="stline st-${l.status}"><span class="chip st-${l.status}" style="border:none;background:none">${icon(s.icon)}</span>${esc(s.label)}</div>
    ${l.ab?`<div class="stline" style="color:var(--ab);border-color:var(--ab);margin-left:6px"><span class="chip" style="border:none">${icon('i-doc')}</span>Arbeitsblatt bereit</div>`:''}
    <p><b>${esc(l.thema)}</b></p>${l.notiz?`<p class="muted">${esc(l.notiz)}</p>`:''}
    ${mats?`<div class="muted" style="font-size:.8rem">Material (relativ zum Ordner Unterricht)</div><ul>${mats}</ul>`:'<p class="muted">Kein Material hinterlegt.</p>'}
    <details class="lessonedit"><summary>Händisch ändern</summary>
      <div class="field-row"><label>Status <select class="fld" id="leSt">${opts}</select></label>
      <label><input type="checkbox" id="leAb"${l.ab?' checked':''}> Arbeitsblatt bereit</label></div>
      <textarea class="fld" id="leNo" placeholder="Notiz">${esc(l.notiz||'')}</textarea>
      <div class="field-row"><button class="btn primary sm" id="leSave">Speichern</button>${l._edit?'<button class="btn sm" id="leReset">Auf Vorgabe zurück</button>':''}</div>
    </details>`;
  const dlg=$('#dlg');
  $('#dlgClose').onclick=()=>dlg.close();
  $('#leSave').onclick=()=>{S.ls[lkey(l)]={status:$('#leSt').value,ab:$('#leAb').checked,notiz:$('#leNo').value,u:now()};save();dlg.close();render();};
  const rs=$('#leReset');if(rs)rs.onclick=()=>{delete S.ls[lkey(l)];save();dlg.close();render();};
  dlg.showModal();}
$('#dlg').addEventListener('click',e=>{if(e.target.id==='dlg')e.target.close();});

/* ---------- Tabs ---------- */
const tabs=[{id:'start',label:'Übersicht'},{id:'jahr',label:'Jahresübersicht'}].concat(FIDS.map(k=>({id:k,label:k,farbe:faecher[k].farbe}))).concat([{id:'kal',label:'Kalender'},{id:'daten',label:'Daten: Export und Import'}]);
let current=(location.hash||'').slice(1);if(!tabs.find(t=>t.id===current))current='start';
function go(id){current=id;history.replaceState(null,'','#'+id);render();}
function renderTabs(){const nav=$('#tabs');nav.innerHTML='';
  tabs.forEach(t=>{const b=el('button','tab',(t.farbe?`<span class="dot" style="background:${t.farbe}"></span>`:'')+esc(t.label));
    b.setAttribute('role','tab');b.setAttribute('aria-selected',t.id===current);b.onclick=()=>go(t.id);nav.appendChild(b);});}
function viewToggle(){const d=el('div','viewtoggle');
  ['raster','liste'].forEach(v=>{const b=el('button','btn',v==='raster'?'Stundenplan':'Liste');b.setAttribute('aria-pressed',view===v);
    b.onclick=()=>{view=v;lsSet('uebersicht-view',v);render();};d.appendChild(b);});return d;}

function miniBar(sm){const m=Math.max(sm.soll,sm.tot,1);
  return `<div class="bar small"><i class="done" style="width:${100*sm.done/m}%"></i><i class="plan" style="width:${100*sm.plan/m}%"></i></div>`;}
function viewStart(m){
  const lg=legend();lg.appendChild(viewToggle());m.appendChild(lg);
  const nav=el('div','field-row noprint');
  nav.innerHTML='<button class="btn sm" id="wkP" aria-label="Woche zurück">◀</button><button class="btn sm" id="wkT">Aktuelle Woche</button><button class="btn sm" id="wkN" aria-label="Woche vor">▶</button><span class="hint">Ab Samstag springt die Ansicht automatisch auf die kommende Woche.</span>';
  m.appendChild(nav);
  nav.querySelector('#wkP').onclick=()=>{ui.wk--;render();};nav.querySelector('#wkN').onclick=()=>{ui.wk++;render();};nav.querySelector('#wkT').onclick=()=>{ui.wk=0;render();};
  const weeks=el('div','weeks'),LL=lessons(),base=addD(refMonday(),7*ui.wk);
  [base,addD(base,7)].forEach((mon,k)=>{const w=DATA.wochen.find(x=>x.von===mon)||{kw:isoKw(mon),von:mon,bis:addD(mon,4)};weeks.appendChild(weekCard(w,k,LL));});m.appendChild(weeks);
  const c=el('div','card');c.style.marginTop='18px';c.appendChild(el('h2','','Stand je Fach'));
  const g=el('div','cols');
  FIDS.forEach(k=>{const f=faecher[k],sm=sums(k);
    const bx=el('div','',`<h3><span class="tab" style="padding:0;border:0"><span class="dot" style="background:${f.farbe}"></span></span>${esc(f.name)} <span class="muted" style="font-weight:400">· ${esc(f.klassen)}</span></h3>
      <div class="muted" style="font-size:.88rem">${esc(f.stand)}</div>
      <div class="mini">${miniBar(sm)}</div><div class="hint">${sm.done} von ${sm.soll} Std erledigt · Reserve ${sm.rest>=0?sm.rest:'minus '+(-sm.rest)} Std</div>`);
    bx.style.cursor='pointer';bx.onclick=()=>go(k);g.appendChild(bx);});
  c.appendChild(g);m.appendChild(c);}

/* ---------- Fach-Reiter ---------- */

function summaryCard(k){
  const sm=sums(k),F=SV.faecher[k],wo=S.wochen||SV.wochen,m=Math.max(sm.soll,sm.tot,1);
  const c=el('div','card sv-sum');
  c.appendChild(el('h2','','Stoffverteilung'));
  c.appendChild(el('div','sv-top',`<div class="big">${sm.done}<small> von ${sm.soll} Std erledigt</small></div>
    <div class="hint">${wo} Unterrichtswochen × ${F.stdProWoche} Std</div>`));
  c.appendChild(el('div','',`<div class="bar"><i class="done" style="width:${100*sm.done/m}%"></i><i class="plan" style="width:${100*sm.plan/m}%"></i></div>`));
  const restTxt=sm.rest>=0?`Reserve (Puffer) ${sm.rest} Std`:`überbucht um ${-sm.rest} Std`;
  c.appendChild(el('div','pills',`<span class="pill ok">erledigt ${sm.done} Std</span><span class="pill">noch verplant ${sm.plan} Std</span><span class="pill ${sm.rest>=0?'warn':'bad'}">${restTxt}</span>`));
  if(hasCal()){const sc=schedule(k);c.appendChild(el('div','pills',`<span class="pill ${sc.reserve>=0?'':'bad'}">Kalender: ${sc.reserve>=0?sc.reserve+' Std frei':'überbucht um '+(-sc.reserve)+' Std'} bis Schuljahresende</span>`));}
  if(sm.nxt)c.appendChild(el('div','nextup',`<b>Als Nächstes:</b> ${esc(sm.nxt.t)}`));
  const row=el('div','field-row');
  row.innerHTML=`<label>Soll (Std) <input class="num" type="number" min="1" max="400" value="${sm.soll}" id="sollIn"></label><button class="btn sm" id="sollReset" title="Soll aus Wochen × Wochenstunden">Standard</button>`;
  c.appendChild(row);
  setTimeout(()=>{const i=$('#sollIn');if(!i)return;
    i.onchange=()=>{const v=parseInt(i.value,10);if(v>0){fs(k).soll=v;save();render();}};
    $('#sollReset').onclick=()=>{fs(k).soll=null;save();render();};},0);
  c.appendChild(el('div','hint','Reserve = Soll minus alle Blöcke. Ferien und Feiertage kommen mit dem Kalender-Import.'));
  return c;}

function blockRow(k,b,pos,sm,F){
  const st=fs(k),bl=sm.bl,idx=bl.indexOf(b),stdw=F.stdProWoche;
  const row=el('div','brow'+(b.done?' done':'')+(sm.nxt&&sm.nxt.id===b.id?' next':'')+(b.typ==='puffer'?' puf':''));
  row.dataset.id=b.id;
  const rng=b.std>0?`<b>Std ${pos}${b.std>1?'–'+(pos+b.std-1):''}</b><br>${placeTxt(k,b.id)||('UW '+Math.ceil(pos/stdw)+(Math.ceil((pos+b.std-1)/stdw)!==Math.ceil(pos/stdw)?'–'+Math.ceil((pos+b.std-1)/stdw):''))}`:`<span class="zero">integriert</span>`;
  const main=el('div','bmain');
  main.innerHTML=`<span class="grip" title="Ziehen zum Verschieben">⋮⋮</span>
    <input type="checkbox" ${b.done?'checked':''} aria-label="erledigt">
    <span class="rng${b.std?'':' zero'}">${rng}</span>
    <div class="tc"><div class="bt">${esc(b.t)}</div><div class="bmeta">${b.ref?`<span>${esc(b.ref)}</span>`:''}${b.bp.length?`<span>BP ${b.bp.length}</span>`:''}${b.typ==='puffer'?'<span>Puffer</span>':''}${b.custom?'<span>eigener Block</span>':''}${b.done&&b.doneAt?`<span>erledigt ${fmt(b.doneAt)}</span>`:''}${b.note?`<span class="nt">${esc(b.note)}</span>`:''}</div></div>
    <span class="stp"><button type="button" data-a="m" ${b.std<=0?'disabled':''} aria-label="eine Stunde weniger">−</button><output>${b.std} Std</output><button type="button" data-a="p" ${b.std>=40?'disabled':''} aria-label="eine Stunde mehr">+</button></span>
    <span class="ract"><button class="ib" data-a="u" ${idx===0?'disabled':''} aria-label="nach oben">↑</button><button class="ib" data-a="d" ${idx===bl.length-1?'disabled':''} aria-label="nach unten">↓</button><button class="ib" data-a="o" aria-label="Details">${ui.open[b.id]?'▴':'▾'}</button></span>`;
  row.appendChild(main);
  main.querySelector('input').onchange=e=>{st.d[b.id]=e.target.checked?today:0;touch(k,b.id);render();};
  main.querySelectorAll('[data-a]').forEach(btn=>btn.onclick=()=>{const a=btn.dataset.a;
    if(a==='m'||a==='p'){st.h[b.id]=Math.max(0,Math.min(40,b.std+(a==='p'?1:-1)));touch(k,b.id);render();}
    else if(a==='u'||a==='d'){const ids=bl.map(x=>x.id);const j=ids.indexOf(b.id),t=a==='u'?j-1:j+1;[ids[j],ids[t]]=[ids[t],ids[j]];setOrder(k,ids);render();}
    else if(a==='o'){ui.open[b.id]=!ui.open[b.id];render();}});
  const grip=main.querySelector('.grip');
  grip.onmousedown=()=>{row.draggable=true;};grip.onmouseup=()=>{row.draggable=false;};
  row.ondragstart=e=>{ui.drag=b.id;row.classList.add('dragging');try{e.dataTransfer.setData('text/plain',b.id);e.dataTransfer.effectAllowed='move';}catch(x){}};
  row.ondragend=()=>{row.draggable=false;ui.drag=null;document.querySelectorAll('.brow').forEach(r=>r.classList.remove('dragging','dropb','dropa'));};
  row.ondragover=e=>{if(!ui.drag||ui.drag===b.id)return;e.preventDefault();const r=row.getBoundingClientRect();const after=e.clientY>r.top+r.height/2;
    row.classList.toggle('dropa',after);row.classList.toggle('dropb',!after);};
  row.ondragleave=()=>row.classList.remove('dropa','dropb');
  row.ondrop=e=>{e.preventDefault();const after=row.classList.contains('dropa');const id=ui.drag;if(!id||id===b.id)return;
    const ids=bl.map(x=>x.id).filter(x=>x!==id);const j=ids.indexOf(b.id);ids.splice(after?j+1:j,0,id);setOrder(k,ids);ui.drag=null;render();};
  if(ui.open[b.id]){
    const T=bpTexts(k);
    const det=el('div','bdet');
    det.innerHTML=`${b.inhalt?`<div><h4>Inhalt laut Vorgabe</h4>${esc(b.inhalt)}</div>`:''}
      ${b.prakt?`<div><h4>Praktika / fächerverbindend</h4>${esc(b.prakt)}</div>`:''}
      ${b.bp.length?`<div><h4>Bildungsplan</h4><ul>${b.bp.map(id=>`<li><span class="bpid">${esc(id)}</span> ${esc(T[id]||'(Wortlaut nicht hinterlegt)')}</li>`).join('')}</ul></div>`:'<div class="hint">Kein Bildungsplan-Bezug hinterlegt.</div>'}
      <div class="field-row"><label style="flex:1;min-width:220px">Titel<input class="fld" id="ti-${esc(b.id)}" value="${esc(b.t)}"></label>
        <label>Bereich <select class="fld" id="be-${esc(b.id)}">${baseF(k).bereiche.map(x=>`<option value="${esc(x.id)}"${x.id===b.b?' selected':''}>${esc(x.t)}</option>`).join('')}</select></label></div>
      <label>Notiz<textarea class="fld" id="no-${esc(b.id)}">${esc(b.note)}</textarea></label>
      <div class="field-row"><button class="btn sm danger" id="rm-${esc(b.id)}">${b.custom?'Block löschen':'Block ausblenden'}</button></div>`;
    row.appendChild(det);
    setTimeout(()=>{
      const ti=$('#ti-'+CSS.escape(b.id)),no=$('#no-'+CSS.escape(b.id)),rm=$('#rm-'+CSS.escape(b.id)),be=$('#be-'+CSS.escape(b.id));
      if(ti)ti.onchange=()=>{st.t[b.id]=ti.value.trim()||b.t;touch(k,b.id);render();};
      if(no)no.onchange=()=>{st.n[b.id]=no.value;touch(k,b.id);render();};
      if(be)be.onchange=()=>{ // Bereich nur für eigene Blöcke änderbar, sonst als eigener Block kopieren nicht nötig
        if(b.custom){st.c[b.id].b=be.value;touch(k,b.id);render();}};
      if(rm)rm.onclick=()=>{if(!confirm('Block „'+b.t+'“ '+(b.custom?'löschen?':'ausblenden?')))return;
        if(b.custom){delete st.c[b.id];}else{st.x[b.id]=now();}
        st.order=(st.order||bl.map(x=>x.id)).filter(x=>x!==b.id);st.uo=now();save();render();};
    },0);}
  return row;}

function viewFach(m,k){
  const f=faecher[k],F=SV.faecher[k],sm=sums(k);
  m.appendChild(el('h2','',`<span class="tab" style="padding:0;border:0"><span class="dot" style="background:${f.farbe}"></span></span>${esc(f.name)} <span class="muted" style="font-weight:400;font-size:.9rem">· ${esc(f.klassen)} · ${esc(f.buch)}</span>`));
  const cols=el('div','cols');
  const a=el('div','card');a.appendChild(el('h3','','Aktueller Stand'));a.appendChild(el('p','',esc(f.stand)));
  a.appendChild(el('h3','','Nächste Schritte'));a.appendChild(el('ul','steps',f.naechste.map(x=>`<li>${esc(x)}</li>`).join('')));
  cols.appendChild(a);cols.appendChild(summaryCard(k));m.appendChild(cols);

  const imp=S.st[k]&&S.st[k].imp;
  const panel=el('div','card');
  panel.appendChild(el('h2','','Stoffverteilung als Blöcke'));
  panel.appendChild(el('div','hint',`Quelle: ${esc(imp?('KI-Import vom '+fmtT(imp.at)):F.quelle)}. Reihenfolge per Ziehen am Griff oder mit den Pfeilen; Stunden mit − und +; Haken = erledigt.`));
  const tools=el('div','sv-tools');
  const addB=el('button','btn sm primary','+ Block hinzufügen');
  const rsB=el('button','btn sm','Auf Vorgabe zurücksetzen');
  tools.appendChild(addB);tools.appendChild(rsB);panel.appendChild(tools);
  addB.onclick=()=>{ui.adding[k]=!ui.adding[k];render();};
  rsB.onclick=()=>{if(!confirm('Alle eigenen Änderungen an der Stoffverteilung von '+k+' (Reihenfolge, Stunden, Haken, Notizen, eigene Blöcke'+(imp?', KI-Import':'')+') verwerfen?'))return;
    pushPrev();S.st[k]=emptyF();save();render();};
  if(ui.adding[k]){
    const bo=baseF(k).bereiche.map(x=>`<option value="${esc(x.id)}">${esc(x.t)}</option>`).join('');
    const ab=el('div','addbox',`<label style="flex:1;min-width:200px">Titel<input class="fld" id="abT" placeholder="z. B. Wiederholung und Klassenarbeit"></label>
      <label>Std<input class="num" type="number" id="abH" min="0" max="40" value="1"></label>
      <label>Art<select class="fld" id="abY"><option value="">Thema</option><option value="puffer">Puffer</option></select></label>
      <label>Bereich<select class="fld" id="abB">${bo}</select></label><button class="btn primary sm" id="abOk">Hinzufügen</button>`);
    panel.appendChild(ab);
    setTimeout(()=>{$('#abOk').onclick=()=>{const t=$('#abT').value.trim();if(!t){$('#abT').focus();return;}
      const id='c-'+now().toString(36);const st=fs(k);
      st.c[id]={id,b:$('#abB').value,t,std:Math.max(0,Math.min(40,parseInt($('#abH').value,10)||0)),typ:$('#abY').value,ref:'',inhalt:''};
      touch(k,id);ui.adding[k]=false;render();};},0);}
  const list=el('div','blist');let pos=1,prevB=null;
  sm.bl.forEach(b=>{
    if(b.b!==prevB){prevB=b.b;const be=bereichOf(k,b.b);const grp=sm.bl.filter(x=>x.b===b.b);const gs=grp.reduce((a,x)=>a+x.std,0),gd=grp.reduce((a,x)=>a+(x.done?x.std:0),0);
      const curr=be&&be.curr!=null?be.curr:null;const key=k+'|'+b.b;
      const head=el('div','bgroup',`<b>${esc(be?be.t:'Weitere Blöcke')}</b><span>${gd}/${gs} Std erledigt</span>${curr!=null?`<span class="pill ${curr===gs?'ok':'warn'}">Curriculum ${curr} Std${curr===gs?'':', hier '+gs}</span>`:''}${be&&be.seiten?`<span>${esc(be.seiten)}</span>`:''}<span class="line"></span><button type="button">Bildungsplan ${ui.openG[key]?'ausblenden':'zeigen'}</button>`);
      head.querySelector('button').onclick=()=>{ui.openG[key]=!ui.openG[key];render();};
      list.appendChild(head);
      if(ui.openG[key]){const T=bpTexts(k);const ids=[];grp.forEach(x=>x.bp.forEach(i=>{if(ids.indexOf(i)<0)ids.push(i);}));
        list.appendChild(el('div','bpbox',ids.length?`<b>Teilkompetenzen laut Bildungsplan (verwendet in diesem Bereich)</b><ul>${ids.map(i=>`<li><span class="bpid">${esc(i)}</span> ${esc(T[i]||'')}</li>`).join('')}</ul>`:'Kein Bildungsplan-Bezug hinterlegt.'));}}
    list.appendChild(blockRow(k,b,pos,sm,F));pos+=b.std;});
  const rest=sm.rest;
  list.appendChild(el('div','rest'+(rest<0?' bad':''),`<span>${rest>=0?'Freie Reserve (rechnerisch, nicht verplant)':'Überbucht'}</span><b>${rest>=0?rest:-rest} Std</b>`));
  panel.appendChild(list);m.appendChild(panel);

  const c=el('div','card');c.appendChild(el('h2','','Stunden in dieser Übersicht'));
  const ls=lessons().filter(l=>l.fach===k).sort((a,b)=>a.datum.localeCompare(b.datum)||a.std-b.std);
  c.insertAdjacentHTML('beforeend','<table class="tl"><thead><tr><th>Datum</th><th>Std</th><th>Klasse</th><th>Thema</th><th>Status</th><th>AB</th></tr></thead><tbody></tbody></table>');
  const tb=$('tbody',c);
  ls.forEach(l=>{const s=DATA.status[l.status];
    const tr=el('tr','cl',`<td class="nowrap">${fmtL(l.datum)}</td><td>${l.std}${l.dauer>1?'+'+(l.std+1):''}</td><td>${esc(l.klasse)}</td><td>${esc(l.kurz)}</td><td><span class="chip st-${l.status}" title="${esc(s.label)}">${icon(s.icon)}</span> <span class="muted">${esc(s.label)}</span></td><td>${l.ab?`<span class="chip ab">${icon('i-doc')}</span>`:''}</td>`);
    tr.onclick=()=>showLesson(l);tb.appendChild(tr);});
  m.appendChild(c);}

/* ---------- Export, Import, Merge ---------- */
function pushPrev(){lsSet(LSP,JSON.stringify(S));}
function download(name,text,type){const b=new Blob([text],{type:type||'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);}
function exportJson(){const o={app:'uebersicht-unterricht',v:1,exportedAt:now(),state:S};download('UEBERSICHT_Export_'+iso(new Date())+'.json',JSON.stringify(o,null,1),'application/json');}
function csvCell(v){v=String(v==null?'':v);return /[;"\n\r]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;}
function exportCsv(){
  const rows=[['Fach','Nr','Std von','Std bis','UW','Anzahl Std','Thema','Bereich','Buchbezug','Bildungsplan','Typ','Status','Erledigt am','Notiz','ID','Geändert']];
  FIDS.forEach(k=>{const sm=sums(k),stdw=SV.faecher[k].stdProWoche,st=fs(k);let pos=1;
    sm.bl.forEach((b,i)=>{const be=bereichOf(k,b.b);
      rows.push([k,i+1,b.std?pos:'',b.std?pos+b.std-1:'',b.std?Math.ceil(pos/stdw):'',b.std,b.t,be?be.t:'',b.ref,b.bp.join(', '),b.typ||'',b.done?'erledigt':'offen',b.doneAt,b.note,b.id,st.u[b.id]?fmtT(st.u[b.id]):'']);pos+=b.std;});});
  download('UEBERSICHT_Stoffverteilung_'+iso(new Date())+'.csv','﻿'+rows.map(r=>r.map(csvCell).join(';')).join('\r\n'),'text/csv');}
function parseCsv(text,dl){dl=dl||';';text=text.replace(/^﻿/,'');const rows=[];let row=[],cell='',q=false;
  for(let i=0;i<text.length;i++){const c=text[i];
    if(q){if(c==='"'){if(text[i+1]==='"'){cell+='"';i++;}else q=false;}else cell+=c;}
    else if(c==='"')q=true;else if(c===dl){row.push(cell);cell='';}
    else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);cell='';rows.push(row);row=[];}else cell+=c;}
  if(cell!==''||row.length){row.push(cell);rows.push(row);}return rows.filter(r=>r.some(x=>x!==''));}
function stateFromCsv(text,stamp){
  const rows=parseCsv(text);if(!rows.length||rows[0][0]!=='Fach'||rows[0].indexOf('Thema')<0)throw new Error('Das ist keine CSV-Datei aus diesem Tool.');
  const h=rows[0],c=n=>h.indexOf(n),s=emptyS();let count=0;
  rows.slice(1).forEach(r=>{const f=r[c('Fach')];if(FIDS.indexOf(f)<0)return;const st=s.st[f]||(s.st[f]=emptyF());
    const id=r[c('ID')];if(!id)return;const known=baseF(f).bloecke.some(x=>x.id===id)||(S.st[f]&&S.st[f].c[id]);
    const std=parseInt(r[c('Anzahl Std')],10);let u=Date.parse((r[c('Geändert')]||'').replace(' ','T'));if(isNaN(u))u=0;
    if(!known)st.c[id]={id,b:'',t:r[c('Thema')]||'Eigener Block',std:isNaN(std)?1:std,typ:r[c('Typ')]||'',ref:r[c('Buchbezug')]||'',inhalt:''};
    st.order=(st.order||[]);st.order.push(id);if(!isNaN(std))st.h[id]=Math.max(0,Math.min(40,std));
    st.t[id]=r[c('Thema')]||'';st.d[id]=r[c('Status')]==='erledigt'?(/^\d{4}-\d{2}-\d{2}$/.test(r[c('Erledigt am')]||'')?r[c('Erledigt am')]:today):0;
    st.n[id]=r[c('Notiz')]||'';st.u[id]=u;st.uo=Math.max(st.uo,u);count++;});
  if(!count)throw new Error('In der Datei wurden keine bekannten Blöcke gefunden.');
  s.saved=stamp||0;return s;}
function mergeF(a,b){const r=emptyF();const ids=new Set([].concat(Object.keys(a.u),Object.keys(b.u),Object.keys(a.h),Object.keys(b.h),Object.keys(a.d),Object.keys(b.d),Object.keys(a.n),Object.keys(b.n),Object.keys(a.t),Object.keys(b.t),Object.keys(a.c),Object.keys(b.c)));
  ids.forEach(id=>{const ua=a.u[id]||0,ub=b.u[id]||0,w=ub>ua?b:a;
    ['h','d','n','t','c'].forEach(m=>{if(w[m][id]!==undefined)r[m][id]=clone(w[m][id]);});if(Math.max(ua,ub))r.u[id]=Math.max(ua,ub);});
  Object.keys(a.x).concat(Object.keys(b.x)).forEach(id=>{r.x[id]=Math.max(a.x[id]||0,b.x[id]||0);});
  const nb=(b.uo||0)>(a.uo||0);r.order=(nb?b.order:a.order)||a.order||b.order;r.uo=Math.max(a.uo||0,b.uo||0);
  const so=nb?b:a;r.soll=(so.soll!=null?so.soll:(a.soll!=null?a.soll:b.soll));
  r.imp=((b.imp&&b.imp.at||0)>(a.imp&&a.imp.at||0))?b.imp:a.imp;
  r.bpx=Object.assign({},a.bpx,b.bpx);return r;}
function mergeS(a,b){const r=emptyS();r.saved=Math.max(a.saved,b.saved);r.wochen=a.wochen||b.wochen;
  new Set(Object.keys(a.st).concat(Object.keys(b.st))).forEach(f=>{r.st[f]=mergeF(a.st[f]||emptyF(),b.st[f]||emptyF());});
  new Set(Object.keys(a.ls).concat(Object.keys(b.ls))).forEach(k=>{const x=a.ls[k],y=b.ls[k];r.ls[k]=!x?y:(!y?x:((y.u||0)>(x.u||0)?y:x));});
  r.kal=mergeKal(a.kal,b.kal);r.sj=!a.sj?b.sj:(!b.sj?a.sj:((b.sj.u||0)>(a.sj.u||0)?b.sj:a.sj));return r;}
function mergeKal(a,b){const r={e:{},x:{}};
  new Set(Object.keys(a.e).concat(Object.keys(b.e))).forEach(id=>{const x=a.e[id],y=b.e[id];r.e[id]=clone(!x?y:(!y?x:((y.u||0)>(x.u||0)?y:x)));});
  new Set(Object.keys(a.x).concat(Object.keys(b.x))).forEach(id=>{r.x[id]=Math.max(a.x[id]||0,b.x[id]||0);});
  Object.keys(r.x).forEach(id=>{if(r.e[id]&&(r.e[id].u||0)>r.x[id])delete r.x[id];else delete r.e[id];});return r;}
function describeImport(o){const f=Object.keys(o.st);let ch=0;f.forEach(k=>{ch+=Object.keys(o.st[k].u).length;});return `${f.length} Fach/Fächer, ${ch} geänderte Blöcke, ${Object.keys(o.ls).length} Stunden-Korrekturen`;}
let pendingImp=null;
function openImport(imp,label,exportedAt,fromCsv){
  pendingImp={imp,fromCsv};const d=$('#impDlg');
  $('#impBody').innerHTML=`<h3>Import: ${esc(label)}</h3>
    <p class="hint">${exportedAt?'Export vom '+fmtT(exportedAt)+'. ':''}Enthält ${esc(describeImport(imp))}.</p>
    <label class="field-row" style="align-items:flex-start"><input type="radio" name="impMode" value="merge" checked> <span><b>Zusammenführen</b><br><span class="hint">Je Block gewinnt die neuere Änderung. Was du nach dem Datum der Datei hier geändert hast, bleibt erhalten; Älteres wird durch die Datei ersetzt. Reihenfolge: die Version mit der neueren Umsortierung.</span></span></label>
    <label class="field-row" style="align-items:flex-start"><input type="radio" name="impMode" value="replace"> <span><b>Alles überschreiben</b><br><span class="hint">${fromCsv?'Ersetzt die Stoffverteilung der Fächer, die in der CSV vorkommen.':'Ersetzt alle lokalen Änderungen durch den Stand der Datei.'}</span></span></label>
    <div class="field-row"><button class="btn primary" id="impOk">Importieren</button><button class="btn" id="impNo">Abbrechen</button></div>`;
  $('#impNo').onclick=()=>d.close();
  $('#impOk').onclick=()=>{const mode=document.querySelector('input[name=impMode]:checked').value;pushPrev();
    if(mode==='merge'){S=mergeS(S,pendingImp.imp);}
    else if(pendingImp.fromCsv){Object.keys(pendingImp.imp.st).forEach(f=>{const o=pendingImp.imp.st[f],old=S.st[f]||emptyF();o.imp=old.imp;o.bpx=old.bpx;o.soll=old.soll;S.st[f]=o;});}
    else{S=pendingImp.imp;}
    save();d.close();flash('Import abgeschlossen ('+(mode==='merge'?'zusammengeführt':'überschrieben')+').');render();};
  d.showModal();}
let flashMsg='';function flash(t){flashMsg=t;}
function readFile(file){const rd=new FileReader();
  rd.onload=()=>{try{const txt=String(rd.result);
    if(/\.csv$/i.test(file.name)||txt.charCodeAt(0)===0xFEFF||/^Fach;/.test(txt)){openImport(stateFromCsv(txt,file.lastModified||0),'CSV Stoffverteilung',file.lastModified||0,true);}
    else{const o=JSON.parse(txt);if(!o||o.app!=='uebersicht-unterricht'||!o.state)throw new Error('Das ist keine Export-Datei dieser Übersicht.');openImport(normS(o.state),'Gesamt-Export (JSON)',o.exportedAt,false);}
  }catch(e){flash('Import nicht möglich: '+e.message);render();}};
  rd.onerror=()=>{flash('Import nicht möglich: Datei nicht lesbar.');render();};rd.readAsText(file,'utf-8');}

/* ---------- KI-Import (Prompt + JSON einfügen) ---------- */
const PROMPT=`Du bekommst gleich ein Dokument (zum Beispiel Stoffverteilungsplan, Schulcurriculum, Inhaltsverzeichnis eines Schulbuchs; als Text, HTML oder PDF) für EIN Unterrichtsfach und EINE Klassenstufe. Lies es vollständig und gib AUSSCHLIESSLICH einen JSON-Block im unten stehenden Übergabeformat aus (kein Text davor oder danach, keine Erklärungen).

Regeln:
- Die Reihenfolge der Blöcke entspricht der empfohlenen Unterrichtsreihenfolge im Dokument.
- "std" ist eine ganze Zahl Unterrichtsstunden (je 45 Minuten) pro Block; 0 ist erlaubt für integrierte oder optionale Themen. Nennt das Dokument Stunden nur je Themenbereich, verteile sie sinnvoll auf die Blöcke; die Summe je Bereich muss dann "std_soll" entsprechen.
- "jahresstunden" ist die Gesamtzahl der Stunden im Schuljahr, nur angeben, wenn das Dokument sie nennt oder eindeutig ableitbar macht.
- "typ": "kern" für Stoff, "puffer" für Wiederholung, Test, Reserve oder Praktikum ohne neuen Stoff.
- Bildungsplan: Bezüge als Kürzel "Abschnitt(Nr.)", zum Beispiel "3.2.3(6)", in "bildungsplan"; den Wortlaut dazu in "bildungsplan_texte". Nennt das Dokument keine, bleiben die Listen leer. Erfinde nichts, was nicht im Dokument steht.
- Keine personenbezogenen Daten.

Übergabeformat:
{
 "format": "stoffverteilung-v1",
 "fach": "Ph-08",
 "jahresstunden": 70,
 "bereiche": [ {"id": "b1", "titel": "Energie", "std_soll": 14} ],
 "bloecke": [
  {"titel": "Energie messen und vergleichen", "std": 2, "bereich": "b1", "buch": "Kap. 4.4, S. 80-83",
   "inhalt": "Ein Satz Kurzbeschreibung", "bildungsplan": ["3.2.3(7)"], "praktika": "", "typ": "kern"}
 ],
 "bildungsplan_texte": {"3.2.3(7)": "Wortlaut der Teilkompetenz"}
}`;
let kiObj=null,kiMsg='';
function parseKi(txt,fach){
  txt=txt.trim().replace(/^```(?:json)?/i,'').replace(/```$/,'').trim();
  const a=txt.indexOf('{'),z=txt.lastIndexOf('}');if(a<0||z<a)throw new Error('Kein JSON-Block gefunden.');
  const o=JSON.parse(txt.slice(a,z+1));
  if(o.format!=='stoffverteilung-v1')throw new Error('Feld "format" muss "stoffverteilung-v1" sein.');
  if(!Array.isArray(o.bloecke)||!o.bloecke.length)throw new Error('Die Liste "bloecke" fehlt oder ist leer.');
  const ts=now(),bere=[],bmap={};
  (o.bereiche||[]).forEach((b,i)=>{const id='ib'+i;bmap[b.id!=null?b.id:id]=id;bere.push({id,t:String(b.titel||('Bereich '+(i+1))),curr:(b.std_soll!=null&&!isNaN(+b.std_soll))?+b.std_soll:null});});
  const warn=[];const bl=o.bloecke.map((b,i)=>{
    if(!b||typeof b.titel!=='string'||!b.titel.trim())throw new Error('Block '+(i+1)+': "titel" fehlt.');
    const h=Number(b.std);if(!(h>=0&&h<=40)||Math.floor(h)!==h)throw new Error('Block '+(i+1)+' ("'+b.titel+'"): "std" muss eine ganze Zahl von 0 bis 40 sein.');
    let bid='';if(b.bereich!=null){if(bmap[b.bereich])bid=bmap[b.bereich];else{const nid='ib'+bere.length;bere.push({id:nid,t:String(b.bereich),curr:null});bmap[b.bereich]=nid;bid=nid;}}
    const bp=Array.isArray(b.bildungsplan)?b.bildungsplan.map(String):[];
    return {id:'i'+ts.toString(36)+'-'+(i+1),b:bid,t:b.titel.trim(),std:h,ref:String(b.buch||''),inhalt:String(b.inhalt||''),prakt:String(b.praktika||''),bp,typ:b.typ==='puffer'?'puffer':''};});
  bere.forEach(b=>{if(b.curr!=null){const s=bl.filter(x=>x.b===b.id).reduce((a,x)=>a+x.std,0);if(s!==b.curr)warn.push(`Bereich „${b.t}“: Blöcke ergeben ${s} Std, std_soll ist ${b.curr}.`);}});
  const T=(o.bildungsplan_texte&&typeof o.bildungsplan_texte==='object')?o.bildungsplan_texte:{};
  return {fach:FIDS.indexOf(o.fach)>=0?o.fach:fach,jahresstunden:o.jahresstunden>0?+o.jahresstunden:null,imp:{at:ts,bereiche:bere,bloecke:bl,bp:T},warn};}

function viewDaten(m){
  const c1=el('div','card');
  c1.innerHTML=`<h2>Sichern und Laden (ganzes Tool)</h2>
    <p class="hint">Alle deine Änderungen liegen nur in diesem Browser. Zum Sichern oder für ein anderes Gerät exportieren, später wieder importieren. Die Seite selbst (Stunden, Stoffverteilungs-Vorschlag) pflegt Claude.</p>
    <div class="field-row"><button class="btn primary" id="exJ">Alles exportieren (JSON)</button><button class="btn" id="exC">Stoffverteilung als CSV</button>
    <label class="btn" style="cursor:pointer">Datei importieren (JSON oder CSV)<input type="file" id="imF" accept=".json,.csv,text/csv,application/json" hidden></label>
    ${lsGet(LSP)?'<button class="btn" id="imUndo">Letzten Import / Zurücksetzen rückgängig</button>':''}</div>
    <p class="hint">JSON enthält alles (Blöcke, Stunden-Korrekturen, KI-Importe). CSV enthält nur die Stoffverteilung (zum Bearbeiten in Excel, Spalte „Geändert“ steuert das Zusammenführen).</p>
    ${flashMsg?`<div class="${/nicht möglich/.test(flashMsg)?'err':'okmsg'}">${esc(flashMsg)}</div>`:''}`;
  m.appendChild(c1);flashMsg='';
  const c2=el('div','card');
  const opt=FIDS.map(k=>`<option value="${k}">${esc(k)}: ${esc(faecher[k].name)}</option>`).join('');
  c2.innerHTML=`<h2>Stoffverteilung per KI importieren</h2>
    <p class="hint">1. Prompt kopieren und zusammen mit deiner Quelle (PDF, HTML, Word …) in eine KI geben. 2. Den JSON-Block der Antwort unten einfügen. 3. Prüfen und übernehmen.</p>
    <div class="field-row"><button class="btn sm" id="kiCopy">Prompt kopieren</button><button class="btn sm" id="kiShow">Prompt anzeigen</button></div>
    <pre class="prompt" id="kiPrompt" hidden></pre>
    <div class="field-row"><label>Zielfach <select class="fld" id="kiFach">${opt}</select></label></div>
    <textarea class="fld" id="kiText" style="min-height:130px" placeholder="JSON-Block der KI hier einfügen"></textarea>
    <div class="field-row"><button class="btn primary sm" id="kiCheck">Prüfen</button></div>
    <div id="kiOut"></div>`;
  m.appendChild(c2);
  const c3=el('div','card');
  c3.innerHTML=`<h2>Ferienkalender und Feiertage</h2><p class="hint">Import (iCal oder CSV) und manuelle Pflege sind im Reiter Kalender. Der Kalender ist Teil des Gesamt-Exports.</p>`;
  m.appendChild(c3);
  const c4=el('div','card');
  c4.innerHTML=`<h2>Lokale Änderungen zurücksetzen</h2><p class="hint">Verwirft alle eigenen Änderungen in diesem Browser (Stoffverteilung, Stunden-Korrekturen). Vorher exportieren, falls du sie behalten willst.</p><button class="btn danger" id="resetAll">Alles zurücksetzen</button>`;
  m.appendChild(c4);

  $('#exJ').onclick=exportJson;$('#exC').onclick=exportCsv;
  $('#imF').onchange=e=>{const f=e.target.files[0];if(f)readFile(f);e.target.value='';};
  const un=$('#imUndo');if(un)un.onclick=()=>{try{S=normS(JSON.parse(lsGet(LSP)));lsSet(LS,JSON.stringify(S));try{localStorage.removeItem(LSP);}catch(e){}flash('Vorheriger Stand wiederhergestellt.');render();}catch(e){}};
  $('#resetAll').onclick=()=>{if(!confirm('Wirklich alle lokalen Änderungen verwerfen?'))return;pushPrev();S=emptyS();save();flash('Zurückgesetzt. Rückgängig ist oben möglich.');render();};
  $('#kiCopy').onclick=()=>{const done=()=>{$('#kiCopy').textContent='Kopiert';setTimeout(()=>{const b=$('#kiCopy');if(b)b.textContent='Prompt kopieren';},1500);};
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(PROMPT).then(done,()=>{$('#kiPrompt').hidden=false;$('#kiPrompt').textContent=PROMPT;});}
    else{$('#kiPrompt').hidden=false;$('#kiPrompt').textContent=PROMPT;}};
  $('#kiShow').onclick=()=>{const p=$('#kiPrompt');p.textContent=PROMPT;p.hidden=!p.hidden;};
  $('#kiCheck').onclick=()=>{const out=$('#kiOut');out.innerHTML='';kiObj=null;
    try{const r=parseKi($('#kiText').value,$('#kiFach').value);kiObj=r;
      if(r.fach!==$('#kiFach').value)$('#kiFach').value=r.fach;
      const tot=r.imp.bloecke.reduce((a,x)=>a+x.std,0),soll=r.jahresstunden||sollOf(r.fach);
      let h=`<div class="okmsg">Format in Ordnung: ${r.imp.bloecke.length} Blöcke, ${tot} Std (Soll ${soll}).</div>`;
      r.warn.forEach(w=>h+=`<div class="err">${esc(w)}</div>`);
      if(tot>soll)h+=`<div class="err">Die Blöcke übersteigen das Soll um ${tot-soll} Std.</div>`;
      h+=`<div class="prev"><table class="tl"><thead><tr><th>Std</th><th>Titel</th><th>Bereich</th></tr></thead><tbody>${r.imp.bloecke.map(b=>{const be=r.imp.bereiche.find(x=>x.id===b.b);return `<tr><td>${b.std}</td><td>${esc(b.t)}</td><td>${esc(be?be.t:'')}</td></tr>`;}).join('')}</tbody></table></div>
        <div class="field-row"><button class="btn primary sm" id="kiApply">Übernehmen für ${esc(r.fach)} (ersetzt dessen Blöcke)</button></div>`;
      out.innerHTML=h;
      $('#kiApply').onclick=()=>{const f=$('#kiFach').value;if(!confirm('Stoffverteilung von '+f+' durch den Import ersetzen? (Rückgängig ist möglich.)'))return;
        pushPrev();const st=emptyF();st.imp=kiObj.imp;if(kiObj.jahresstunden)st.soll=kiObj.jahresstunden;st.uo=now();S.st[f]=st;save();flash('KI-Import übernommen für '+f+'.');go(f);};
    }catch(e){out.innerHTML=`<div class="err">${esc(e.message)}</div>`;}};
}

function render(){
  renderTabs();const m=$('#main');m.innerHTML='';
  SCH={};if(current==='start')viewStart(m);else if(current==='daten')viewDaten(m);else if(current==='jahr')viewJahr(m);else if(current==='kal')viewKal(m);else viewFach(m,current);
  setSaveState(lsOK);}
window.addEventListener('hashchange',()=>{const h=location.hash.slice(1);if(tabs.find(t=>t.id===h)&&h!==current){current=h;render();}});
render();
})();
