/* ---------- Kalender: Datum ---------- */
const pd=s=>new Date(s+'T12:00:00');
const addD=(s,n)=>{const d=pd(s);d.setDate(d.getDate()+n);return iso(d);};
const mondayOf=s=>{const d=pd(s);const w=(d.getDay()+6)%7;d.setDate(d.getDate()-w);return iso(d);};
function isoKw(s){const d=pd(mondayOf(s));d.setDate(d.getDate()+3);const y=d.getFullYear();const j=new Date(y,0,4);return 1+Math.round(((d-j)/864e5-3+((j.getDay()+6)%7))/7);}
function refMonday(){const d=new Date();const wd=d.getDay();if(wd===6)d.setDate(d.getDate()+2);else if(wd===0)d.setDate(d.getDate()+1);return mondayOf(iso(d));}
const MON=['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
const MONS=['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];

/* ---------- Kalender: Modell ---------- */
const KT={ferien:{l:'Ferien',blk:1},feiertag:{l:'Feiertag',blk:1},frei:{l:'Unterrichtsfrei',blk:1},ausfall:{l:'Ausfall',blk:1},termin:{l:'Termin',blk:0}};
function sj(){const b=DATA.schuljahr||{von:'2026-09-14',bis:'2027-07-28'};return S.sj?{von:S.sj.von,bis:S.sj.bis}:b;}
function calAll(){const out={};((DATA.kalender&&DATA.kalender.basis)||[]).forEach(e=>out[e.id]=e);Object.keys(S.kal.e).forEach(id=>out[id]=S.kal.e[id]);
  return Object.values(out).filter(e=>!(S.kal.x[e.id]&&S.kal.x[e.id]>=(e.u||0))).sort((a,b)=>a.von.localeCompare(b.von)||a.bis.localeCompare(b.bis));}
function hasCal(){return calAll().some(e=>e.typ==='ferien');}
function blockedGlobal(d){return calAll().find(e=>KT[e.typ].blk&&!e.f&&e.von<=d&&d<=e.bis)||null;}
function weeksList(){const s=sj(),w=[];let m=mondayOf(s.von);while(m<=s.bis){w.push({mon:m,fri:addD(m,4),kw:isoKw(m)});m=addD(m,7);}return w;}
function patternOf(k){const p=(DATA.wochenplan&&DATA.wochenplan[k])||null;if(p)return p;
  const r={},n=SV.faecher[k].stdProWoche;[0,1,3,4,2].slice(0,Math.min(n,5)).forEach(d=>r[d]=1);return r;}
/* Stundenraster: jede Unterrichtsstunde laut Wochenplan an einem nicht blockierten Tag ist ein Platz; Blöcke füllen die Plätze der Reihe nach */
function schedule(k){
  if(SCH[k])return SCH[k];
  const s=sj(),list=calAll().filter(e=>KT[e.typ].blk&&(!e.f||e.f===k)),pat=patternOf(k);
  const slots=[];
  for(let d=s.von;d<=s.bis;d=addD(d,1)){const wd=(pd(d).getDay()+6)%7,n=pat[wd];
    if(n&&!list.some(e=>e.von<=d&&d<=e.bis))slots.push({d,n});}
  const ref=refMonday();let cs=slots.findIndex(x=>x.d>=ref);if(cs<0)cs=slots.length;
  const bl=eff(k),place={},fillBy={};let si=0,used=0,over=0;
  bl.forEach(b=>{
    if(!b.done&&si<cs){si=cs;used=0;}
    let h=b.std,d1='',d2='';
    if(h===0){const d=slots[Math.min(si,slots.length-1)];place[b.id]={d1:d?d.d:'',d2:d?d.d:'',h:0};return;}
    while(h>0){
      if(si>=slots.length){over+=h;h=0;break;}
      const free=slots[si].n-used;
      if(free<=0){si++;used=0;continue;}
      const t=Math.min(free,h),d=slots[si].d;(fillBy[d]=fillBy[d]||[]).push({id:b.id,h:t});used+=t;h-=t;if(!d1)d1=d;d2=d;}
    place[b.id]={d1,d2,h:b.std};});
  const resBy={};let reserve=0;
  for(let i=si;i<slots.length;i++){const free=slots[i].n-(i===si?used:0);if(free>0){resBy[slots[i].d]=free;reserve+=free;}}
  reserve-=over;
  const byWeek={};slots.forEach(x=>{(byWeek[mondayOf(x.d)]=byWeek[mondayOf(x.d)]||[]).push(x);});
  return SCH[k]={slots,fillBy,resBy,reserve,over,place,bl,byWeek,cs};}
function placeTxt(k,id){if(!hasCal())return '';const p=schedule(k).place[id];if(!p||!p.d1||p.h===0)return '';
  const a=isoKw(p.d1),z=isoKw(p.d2);return 'KW '+a+(z!==a?'–'+z:'');}

/* ---------- iCal / CSV lesen ---------- */
function icsDate(v){v=v.trim();const dOnly=v.length===8;return {d:v.slice(0,4)+'-'+v.slice(4,6)+'-'+v.slice(6,8),dOnly,midnight:/T000000/.test(v)};}
function guessTyp(n,von,bis){const days=(pd(bis)-pd(von))/864e5+1;
  if(/studientag|pädagogisch|paedagogisch|beweglicher ferientag|brückentag|bruecken/i.test(n))return 'frei';
  if(/ferien/i.test(n)||days>=5)return 'ferien';return 'feiertag';}
function normDate(v){v=String(v||'').trim();let m=v.match(/^(\d{4})-(\d{2})-(\d{2})/);if(m)return m[0];
  m=v.match(/^(\d{1,2})\.(\d{1,2})\.(\d{2,4})$/);if(m){const y=m[3].length===2?'20'+m[3]:m[3];return y+'-'+pad(+m[2])+'-'+pad(+m[1]);}return '';}
function parseIcs(txt){
  const lines=txt.replace(/\r\n?/g,'\n').replace(/\n[ \t]/g,'').split('\n');const evs=[];let ev=null;
  lines.forEach(l=>{if(/^BEGIN:VEVENT/i.test(l))ev={};else if(/^END:VEVENT/i.test(l)){if(ev&&ev.s)evs.push(ev);ev=null;}
    else if(ev){const i=l.indexOf(':');if(i<0)return;const key=l.slice(0,i).split(';')[0].toUpperCase(),val=l.slice(i+1);
      if(key==='SUMMARY')ev.n=val.replace(/\\,/g,',').replace(/\;/g,';').replace(/\\n/gi,' ').replace(/\\\\/g,'\\').trim();
      else if(key==='DTSTART')ev.s=icsDate(val);else if(key==='DTEND')ev.e=icsDate(val);}});
  return evs.map(e=>{const von=e.s.d;let bis=e.e?e.e.d:von;if(e.e&&(e.e.dOnly||e.e.midnight))bis=addD(bis,-1);if(bis<von)bis=von;
    const name=e.n||'Ohne Titel';return {typ:guessTyp(name,von,bis),name,von,bis,f:'',ok:true};});}
function parseKalCsv(txt){
  txt=txt.replace(/^﻿/,'');const first=txt.split(/\r?\n/)[0]||'';
  const dl=(first.split(';').length>=first.split(',').length&&first.split(';').length>1)?';':(first.indexOf('\t')>=0?'\t':(first.indexOf(',')>=0?',':';'));
  const rows=parseCsv(txt,dl);if(!rows.length)throw new Error('Die Datei ist leer.');
  let idx={typ:0,name:1,von:2,bis:3,fach:4};
  if(/^typ$/i.test(rows[0][0].trim())||rows[0].some(c=>/^(von|name)$/i.test(c.trim()))){const h=rows.shift().map(c=>c.trim().toLowerCase());
    ['typ','name','von','bis','fach'].forEach(n=>{const j=h.indexOf(n);if(j>=0)idx[n]=j;});}
  const out=[],bad=[];
  rows.forEach((r,i)=>{const von=normDate(r[idx.von]),bis=normDate(r[idx.bis])||von,name=(r[idx.name]||'').trim();
    if(!von||!name){bad.push(i+1);return;}
    let typ=(r[idx.typ]||'').trim().toLowerCase();if(!KT[typ])typ=guessTyp(name,von,bis);
    const f=(r[idx.fach]||'').trim();out.push({typ,name,von,bis:bis<von?von:bis,f:FIDS.indexOf(f)>=0?f:'',ok:true});});
  if(!out.length)throw new Error('Keine gültigen Zeilen. Erwartet: typ;name;von;bis (Datum 2026-10-26 oder 26.10.2026).');
  out.bad=bad;return out;}
function hash(s){let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))>>>0;return h.toString(36);}
function kalId(e){return 'k-'+hash([e.typ,e.name,e.von,e.bis,e.f].join('|'));}
function rangeTxt(e){return e.von===e.bis?fmtL(e.von):fmt(e.von)+'–'+fmt(e.bis);}
function exportKalCsv(){const rows=[['typ','name','von','bis','fach','quelle']].concat(calAll().map(e=>[e.typ,e.name,e.von,e.bis,e.f||'',e.src||'manuell']));
  download('UEBERSICHT_Kalender_'+iso(new Date())+'.csv','﻿'+rows.map(r=>r.map(csvCell).join(';')).join('\r\n'),'text/csv');}

/* ---------- Reiter Kalender ---------- */
function viewKal(m){
  const s=sj(),all=calAll();
  const c0=el('div','card');
  c0.innerHTML=`<h2>Schuljahr</h2><p class="hint">Zeitraum für Jahresübersicht und Kalender-Reserve. Beginn und Ende bitte mit dem Kultusministerium abgleichen.</p>
    <div class="field-row"><label>Erster Schultag <input class="fld" type="date" id="sjV" value="${s.von}"></label><label>Letzter Schultag <input class="fld" type="date" id="sjB" value="${s.bis}"></label></div>`;
  m.appendChild(c0);
  const c1=el('div','card');
  c1.innerHTML=`<h2>Einträge <span class="muted" style="font-weight:400">(${all.length})</span></h2>
    <p class="hint">Ferien, Feiertage, Unterrichtsfrei und Ausfall verringern die Unterrichtsstunden in der Woche (Ausfall und Unterrichtsfrei optional nur für ein Fach). Termine (z. B. Klassenarbeit) erscheinen nur als Markierung.</p>
    <div class="field-row noprint"><button class="btn primary sm" id="kNew">+ Eintrag</button><button class="btn sm" id="kCsv">Als CSV exportieren</button></div>
    <div id="kForm"></div><div id="kList"></div>`;
  m.appendChild(c1);
  const fopt=['<option value="">alle Fächer</option>'].concat(FIDS.map(k=>`<option value="${k}">${esc(k)}</option>`)).join('');
  function form(e,isNew){
    const f=$('#kForm');f.innerHTML=`<div class="addbox"><label>Art <select class="fld" id="kT">${Object.keys(KT).map(t=>`<option value="${t}">${KT[t].l}</option>`).join('')}</select></label>
      <label style="flex:1;min-width:180px">Name <input class="fld" id="kN" value="${esc(e.name||'')}"></label>
      <label>Von <input class="fld" type="date" id="kV" value="${e.von||''}"></label><label>Bis <input class="fld" type="date" id="kB" value="${e.bis||''}"></label>
      <label>Fach <select class="fld" id="kF">${fopt}</select></label>
      <button class="btn primary sm" id="kOk">${isNew?'Hinzufügen':'Speichern'}</button><button class="btn sm" id="kNo">Abbrechen</button></div>`;
    $('#kT').value=e.typ||'ferien';$('#kF').value=e.f||'';
    $('#kNo').onclick=()=>{f.innerHTML='';ui.kedit=null;};
    $('#kOk').onclick=()=>{const n=$('#kN').value.trim(),v=$('#kV').value,b=$('#kB').value||v;
      if(!n||!v){(n?$('#kV'):$('#kN')).focus();return;}if(b<v){$('#kB').focus();return;}
      const id=isNew?'m-'+now().toString(36):e.id;
      S.kal.e[id]={id,typ:$('#kT').value,name:n,von:v,bis:b,f:$('#kF').value,src:e.src||'manuell',u:now()};delete S.kal.x[id];save();ui.kedit=null;render();};
  }
  $('#kNew').onclick=()=>{form({},true);$('#kN').focus();};$('#kCsv').onclick=exportKalCsv;
  const lst=$('#kList');
  if(!all.length)lst.innerHTML='<p class="hint">Noch keine Einträge. Importiere unten eine Datei oder lege Einträge von Hand an.</p>';
  else{lst.innerHTML='<table class="tl"><thead><tr><th>Art</th><th>Name</th><th>Zeitraum</th><th>Fach</th><th>Quelle</th><th></th></tr></thead><tbody></tbody></table>';
    const tb=$('tbody',lst);
    all.forEach(e=>{const tr=el('tr','',`<td><span class="kchip k-${e.typ}">${KT[e.typ].l}</span></td><td>${esc(e.name)}</td><td class="nowrap">${rangeTxt(e)}</td><td>${esc(e.f||'alle')}</td><td class="muted">${esc(e.src||'manuell')}</td><td class="nowrap"><button class="btn sm" data-a="e">Bearbeiten</button> <button class="btn sm danger" data-a="d">Löschen</button></td>`);
      tr.querySelector('[data-a=e]').onclick=()=>{form(e,false);};
      tr.querySelector('[data-a=d]').onclick=()=>{if(!confirm('„'+e.name+'“ löschen?'))return;S.kal.x[e.id]=now();delete S.kal.e[e.id];save();render();};
      tb.appendChild(tr);});}
  $('#sjV').onchange=$('#sjB').onchange=()=>{const v=$('#sjV').value,b=$('#sjB').value;if(!v||!b||b<=v)return;S.sj={von:v,bis:b,u:now()};save();render();};

  const c2=el('div','card');
  c2.innerHTML=`<h2>Import (iCal oder CSV)</h2>
    <p class="hint">iCal (.ics) von einem Ferien-Kalender oder CSV mit den Spalten <code>typ;name;von;bis</code> (optional <code>fach</code>). Art: ferien, feiertag, frei, ausfall, termin. Datum 2026-10-26 oder 26.10.2026. Die Art lässt sich vor dem Übernehmen je Zeile ändern. Das Tool lädt nichts selbst aus dem Netz.</p>
    <div class="field-row"><label class="btn" style="cursor:pointer">Datei wählen<input type="file" id="kFile" accept=".ics,.csv,text/calendar,text/csv,text/plain" hidden></label><span class="hint">oder Text einfügen:</span></div>
    <textarea class="fld" id="kTxt" style="min-height:90px" placeholder="BEGIN:VCALENDAR … oder typ;name;von;bis"></textarea>
    <div class="field-row"><button class="btn primary sm" id="kChk">Prüfen</button></div>
    ${ui.kmsg?`<div class="${/nicht|Keine|leer/.test(ui.kmsg)?'err':'okmsg'}">${esc(ui.kmsg)}</div>`:''}<div id="kPrev"></div>`;
  m.appendChild(c2);ui.kmsg='';
  function check(txt){const out=$('#kPrev');out.innerHTML='';
    try{const t=txt.trim();if(!t)throw new Error('Nichts zum Prüfen.');
      const cand=/BEGIN:VCALENDAR|BEGIN:VEVENT/i.test(t)?parseIcs(t):parseKalCsv(t);
      if(!cand.length)throw new Error('Keine Einträge gefunden.');ui.kcand=cand;
      const exist=new Set(all.map(e=>[e.typ,e.name,e.von,e.bis,e.f||''].join('|')));
      out.innerHTML=`<div class="okmsg">${cand.length} Einträge erkannt.${cand.bad&&cand.bad.length?' Übersprungene Zeilen: '+cand.bad.join(', ')+'.':''}</div>
        <div class="prev"><table class="tl"><thead><tr><th></th><th>Art</th><th>Name</th><th>Zeitraum</th></tr></thead><tbody>${cand.map((e,i)=>`<tr><td><input type="checkbox" data-i="${i}" ${exist.has([e.typ,e.name,e.von,e.bis,e.f].join('|'))?'':'checked'}></td><td><select class="fld" data-t="${i}">${Object.keys(KT).map(t=>`<option value="${t}"${t===e.typ?' selected':''}>${KT[t].l}</option>`).join('')}</select></td><td>${esc(e.name)}</td><td class="nowrap">${rangeTxt(e)}${exist.has([e.typ,e.name,e.von,e.bis,e.f].join('|'))?' <span class="muted">(schon vorhanden)</span>':''}</td></tr>`).join('')}</tbody></table></div>
        <label class="field-row" style="align-items:flex-start"><input type="radio" name="kMode" value="add" checked> <span><b>Nur ergänzen</b><br><span class="hint">Vorhandene Einträge bleiben.</span></span></label>
        <label class="field-row" style="align-items:flex-start"><input type="radio" name="kMode" value="replace"> <span><b>Frühere Importe ersetzen</b><br><span class="hint">Löscht früher importierte Einträge, die nicht mehr in dieser Datei stehen. Eigene (manuelle) Einträge bleiben.</span></span></label>
        <div class="field-row"><button class="btn primary sm" id="kApply">Übernehmen</button></div>`;
      out.querySelectorAll('[data-t]').forEach(sel=>sel.onchange=()=>{cand[+sel.dataset.t].typ=sel.value;});
      $('#kApply').onclick=()=>{const mode=out.querySelector('input[name=kMode]:checked').value;pushPrev();const ids=new Set();let n=0;
        out.querySelectorAll('[data-i]').forEach(cb=>{if(!cb.checked)return;const e=cand[+cb.dataset.i],id=kalId(e);ids.add(id);
          if(all.some(x=>x.typ===e.typ&&x.von===e.von&&x.bis===e.bis&&x.name===e.name&&(x.f||'')===e.f&&x.id!==id))return;
          S.kal.e[id]={id,typ:e.typ,name:e.name,von:e.von,bis:e.bis,f:e.f,src:'Import',u:now()};delete S.kal.x[id];n++;});
        if(mode==='replace')all.forEach(x=>{if(x.src==='Import'&&!ids.has(x.id)){S.kal.x[x.id]=now();delete S.kal.e[x.id];}});
        save();ui.kmsg=n+' Einträge übernommen.';render();};
    }catch(e){out.innerHTML=`<div class="err">${esc(e.message)}</div>`;}}
  $('#kChk').onclick=()=>check($('#kTxt').value);
  $('#kFile').onchange=e=>{const f=e.target.files[0];if(!f)return;const rd=new FileReader();rd.onload=()=>{$('#kTxt').value=String(rd.result).slice(0,200000);check(String(rd.result));};rd.readAsText(f,'utf-8');e.target.value='';};
}

/* ---------- Reiter Jahresübersicht (Spalten = Klassen/Fächer, Zeilen = Zeit) ---------- */
const WD=['Mo','Di','Mi','Do','Fr'];
const TONES=[62,44,30,54,38,24,50,34];
function tone(k,bid){const bs=baseF(k).bereiche,i=Math.max(0,bs.findIndex(x=>x.id===bid));return TONES[i%TONES.length];}
function tint(k,bid){return `--fc:${faecher[k].farbe};--tn:${tone(k,bid)}%`;}
function fachOrder(){return FIDS.slice().sort((a,b)=>(parseInt(faecher[a].klassen,10)||0)-(parseInt(faecher[b].klassen,10)||0));}
function klassenList(){const r=[];fachOrder().forEach(k=>{if(r.indexOf(faecher[k].klassen)<0)r.push(faecher[k].klassen);});return r;}
function colsSel(){const o=fachOrder();return o.indexOf(ui.jc)>=0?[ui.jc]:o;}
function calMarks(w){return calAll().filter(e=>e.von<=w.fri&&e.bis>=w.mon);}
function ferienAll(w){return calAll().find(e=>e.typ==='ferien'&&!e.f&&e.von<=w.mon&&e.bis>=w.fri)||null;}
function sections(W){const out=[];let cur=null,before=null,run=null;
  W.forEach((w,i)=>{const fe=ferienAll(w);if(fe){if(cur){cur.after=fe;out.push(cur);cur=null;}if(!run)run=fe.von;before={name:fe.name,von:run,bis:fe.bis};return;}run=null;
    if(!cur)cur={a:i,z:i,after:null,before};cur.z=i;});
  if(cur)out.push(cur);return out;}
function weekAgg(k,mon){ // Blöcke und Reserve einer Woche
  const sch=schedule(k),sl=sch.byWeek[mon];if(!sl)return null;
  const items=[];let res=0;sl.forEach(x=>{(sch.fillBy[x.d]||[]).forEach(f=>{let it=items.find(y=>y.id===f.id);if(!it){it={id:f.id,h:0};items.push(it);}it.h+=f.h;});res+=sch.resBy[x.d]||0;});
  return {items,res};}
function blockOf(k,id){return schedule(k).bl.find(b=>b.id===id);}
function line(k,cls,style,html,title){const d=el('div','bl '+cls,html);if(style)d.style.cssText=style;if(title)d.title=title;return d;}
function slotLine(k,sl,prefix){
  const sch=schedule(k),items=sch.fillBy[sl.d]||[],res=sch.resBy[sl.d]||0;
  const real=lessons().filter(l=>l.fach===k&&l.datum===sl.d);
  const first=items[0]?blockOf(k,items[0].id):null;
  const done=items.length&&items.every(x=>blockOf(k,x.id).done);
  let txt;
  if(real.length)txt=real.map(l=>l.kurz).join(' / ');
  else{txt=items.map(it=>{const b=blockOf(k,it.id);return b.t+(items.length>1?' ['+it.h+']':'');}).join(' · ');if(res)txt+=(txt?' · ':'')+'Reserve';if(!txt)txt='–';}
  const n=real.length?real.reduce((a,l)=>a+l.dauer,0):sl.n;
  const full=(first?items.map(it=>blockOf(k,it.id).t).join(' · '):'Reserve')+(real.length?'\nStunde: '+real.map(l=>l.thema).join(' / '):'');
  return line(k,(first?'':'res ')+(done?'dn':''),first?tint(k,first.b):`--fc:${faecher[k].farbe}`,`${prefix||''}<i class="nn">(${n})</i> ${done?'✓ ':''}${esc(txt)}`,full);}
function colHead(ks){return ks.map(k=>`<th class="cf" style="--fc:${faecher[k].farbe}"><b>${esc(k)}</b><small>${esc(faecher[k].klassen)}</small></th>`).join('');}
function legendBlocks(m,ks){
  const d=el('div','jleg');
  ks.forEach(k=>{const g=el('div','jlg');g.innerHTML=`<b>${esc(k)}</b> `;baseF(k).bereiche.forEach(b=>{const c=el('span','chip2',esc(b.t));c.style.cssText=tint(k,b.id);g.appendChild(c);});d.appendChild(g);});
  d.appendChild(el('div','jlg','<span class="chip2 res">Reserve</span><span class="chip2 ferien">Ferien/frei</span><span class="muted">(n) = Stunden · ✓ erledigt (blass) · Ton = Bereich</span>'));
  m.appendChild(d);}
function viewJahr(m){
  const W=weeksList(),ks=colsSel(),ref=refMonday();
  const ctl=el('div','field-row noprint');
  const klOpt=['<option value="alle">alle Fächer</option>'].concat(fachOrder().map(k=>`<option value="${esc(k)}">${esc(k)} (${esc(faecher[k].klassen)})</option>`)).join('');
  ctl.innerHTML=`<label>Ansicht <select class="fld" id="jV"><option value="jahr">Jahr (Themen je Woche)</option><option value="abschnitt">Ferien zu Ferien (Tage)</option><option value="monat">Monat (Kalender)</option></select></label>
    <label>Fach <select class="fld" id="jC">${klOpt}</select></label>
    <label>Zeitraum <select class="fld" id="jZ"><option value="alle">alles</option><option value="kuenftig">nur künftige</option>${ui.jv==='jahr'?'':'<option value="einzeln">einzelner</option>'}</select></label>
    <span id="jOne"></span>
    <button class="btn primary sm" id="jP">PDF / Drucken (A4 quer)</button>`;
  m.appendChild(ctl);
  if(ui.jv==='jahr'&&ui.jz==='einzeln')ui.jz='alle';
  $('#jV',ctl).value=ui.jv;$('#jC',ctl).value=ui.jc;$('#jZ',ctl).value=ui.jz;
  $('#jV',ctl).onchange=e=>{ui.jv=e.target.value;render();};$('#jC',ctl).onchange=e=>{ui.jc=e.target.value;render();};$('#jZ',ctl).onchange=e=>{ui.jz=e.target.value;render();};$('#jP',ctl).onclick=()=>window.print();
  const secs=sections(W);
  const monsAll=[];{let y=+sj().von.slice(0,4),mo=+sj().von.slice(5,7);const e=sj().bis.slice(0,7);for(;;){const k=y+'-'+pad(mo);monsAll.push(k);if(k>=e)break;mo++;if(mo>12){mo=1;y++;}}}
  if(ui.jz==='einzeln'){const one=$('#jOne',ctl);
    if(ui.jv==='monat'){if(monsAll.indexOf(ui.mon)<0){const t=today.slice(0,7);ui.mon=monsAll.indexOf(t)>=0?t:monsAll[0];}
      one.innerHTML=`<select class="fld" id="jM">${monsAll.map(x=>`<option value="${x}">${MON[+x.slice(5)-1]} ${x.slice(0,4)}</option>`).join('')}</select>`;$('#jM',one).value=ui.mon;$('#jM',one).onchange=e=>{ui.mon=e.target.value;render();};}
    else{if(ui.sec>=secs.length)ui.sec=0;const idx=secs.findIndex(x=>W[x.z].fri>=today);if(ui.sec<0)ui.sec=Math.max(0,idx);
      one.innerHTML=`<select class="fld" id="jS">${secs.map((x,i)=>`<option value="${i}">${fmt(W[x.a].mon)}–${fmt(W[x.z].fri)}</option>`).join('')}</select>`;$('#jS',one).value=ui.sec;$('#jS',one).onchange=e=>{ui.sec=+e.target.value;render();};}}
  const vname={jahr:'Jahr',abschnitt:'Ferien zu Ferien',monat:'Monat'}[ui.jv];
  m.appendChild(el('div','printhead',`<b>Jahresübersicht ${esc(DATA.meta.schuljahr)}</b> · ${vname} · ${colsSel().length>1?'alle Fächer':esc(ui.jc)+' ('+esc(faecher[ui.jc].klassen)+')'} · Stand ${fmt(today)}${today.slice(0,4)}`));
  if(!hasCal())m.appendChild(el('div','hint noprint','Hinweis: Im Kalender sind noch keine Ferien eingetragen. Ohne Ferien wirken alle Wochen als Unterrichtswochen. Import im Reiter Kalender.'));
  if(ui.jv==='jahr')jahrView(m,W,ks,ref);else if(ui.jv==='abschnitt')abschnittView(m,W,ks,ref,secs);else monatView(m,W,ks,ref,monsAll);
  legendBlocks(m,ks);}
function jahrView(m,W,ks,ref){
  const weeks=W.filter(w=>ui.jz!=='kuenftig'||w.fri>=ref);
  const aggs=ks.map(k=>weeks.map(w=>{if(ferienAll(w))return null;const a=weekAgg(k,w.mon);
    if(!a){const bk=calAll().find(e=>KT[e.typ].blk&&(!e.f||e.f===k)&&e.von<=w.mon&&e.bis>=w.fri);return {key:'blk:'+(bk?bk.name:''),blk:bk?bk.name:'frei',items:[],res:0};}
    return {key:a.items.map(x=>x.id).join('+')+(a.res?'|r':''),items:a.items,res:a.res};}));
  const spans=ks.map((k,c)=>{const sp=[];let i=0;while(i<weeks.length){const d=aggs[c][i];if(!d){sp.push({n:1});i++;continue;}let j=i+1;while(j<weeks.length&&aggs[c][j]&&aggs[c][j].key===d.key&&d.key!==''&&d.key!=='|r')j++;
    const items=[];let res=0;for(let r=i;r<j;r++){aggs[c][r].items.forEach(x=>{let it=items.find(y=>y.id===x.id);if(!it){it={id:x.id,h:0};items.push(it);}it.h+=x.h;});res+=aggs[c][r].res;}
    sp.push({n:j-i,items,res,d});for(let r=i+1;r<j;r++)sp.push({skip:true});i=j;}return sp;});
  const tbl=el('table','jtab');
  tbl.innerHTML=`<thead><tr><th class="cm">Monat</th><th class="cw">Woche</th><th class="ck">Kalender</th>${colHead(ks)}</tr></thead>`;
  const tb=el('tbody');
  let mi=0;
  const monOf=w=>pd(addD(w.mon,3)).getMonth()+'-'+pd(addD(w.mon,3)).getFullYear();
  weeks.forEach((w,i)=>{
    const tr=el('tr','jw'+(w.mon===ref?' now':''));
    const fe=ferienAll(w);
    if(i===0||monOf(weeks[i-1])!==monOf(w)){let n=1;while(i+n<weeks.length&&monOf(weeks[i+n])===monOf(w))n++;const td=el('td','cm',MONS[pd(addD(w.mon,3)).getMonth()]);td.rowSpan=n;tr.appendChild(td);}
    tr.appendChild(el('td','cw',`<b>${w.kw}</b> <span>${fmt(w.mon)}</span>`));
    tr.appendChild(el('td','ck',calMarks(w).filter(e=>e.typ!=='ferien').map(e=>`<span class="ev k-${e.typ}" title="${esc(e.name)} ${rangeTxt(e)}">${esc(e.name)}</span>`).join('')));
    if(fe){const td=el('td','ferien',esc(fe.name));td.colSpan=ks.length;tr.appendChild(td);}
    else ks.forEach((k,c)=>{const sp=spans[c][i];if(sp.skip)return;const d=sp.d;const td=el('td','jc');if(sp.n>1)td.rowSpan=sp.n;
      if(d.blk!==undefined){td.className+=' blkc';td.textContent=d.blk;}
      else{sp.items.forEach(it=>{const b=blockOf(k,it.id);td.appendChild(line(k,b.done?'dn':(b.typ==='puffer'?'res':''),tint(k,b.b),`${b.done?'✓ ':''}${esc(b.t)} <i class="nn">${it.h}</i>`,b.t+' ('+it.h+' Std)'));});
        if(sp.res>0)td.appendChild(line(k,'res',`--fc:${faecher[k].farbe}`,`Reserve <i class="nn">${sp.res}</i>`));
        if(!sp.items.length&&!sp.res)td.className+=' empty';}
      tr.appendChild(td);});
    tb.appendChild(tr);});
  tbl.appendChild(tb);m.appendChild(tbl);}
function abschnittView(m,W,ks,ref,secs){
  let list=secs.map((s0,i)=>({s0,i}));
  if(ui.jz==='kuenftig')list=list.filter(x=>W[x.s0.z].fri>=ref);else if(ui.jz==='einzeln')list=list.filter(x=>x.i===ui.sec);
  list.forEach(({s0})=>{
    const a=W[s0.a],z=W[s0.z],n=s0.z-s0.a+1;
    const card=el('div','sect');
    card.appendChild(el('h3','',`${s0.before?`<b>${esc(s0.before.name)}</b> <span class="muted" style="font-weight:400">(${rangeTxt(s0.before)})</span>`:'<b>Schuljahresbeginn</b>'}<span class="muted" style="font-weight:400"> · KW ${a.kw}–${z.kw} · ${fmt(a.mon)}–${fmt(z.fri)} · ${n} Woche${n>1?'n':''}${s0.after?' · (danach '+esc(s0.after.name)+')':''}</span>`));
    const tbl=el('table','jtab');tbl.innerHTML=`<thead><tr><th class="cw">Woche</th>${colHead(ks)}</tr></thead>`;const tb=el('tbody');
    for(let i=s0.a;i<=s0.z;i++){const w=W[i];if(ui.jz==='kuenftig'&&w.fri<ref)continue;
      const tr=el('tr','jw'+(w.mon===ref?' now':''));
      tr.appendChild(el('td','cw',`<b>KW ${w.kw}</b> <span>${fmt(w.mon)}–${fmt(w.fri)}</span>${calMarks(w).filter(e=>e.typ!=='ferien').map(e=>`<span class="ev k-${e.typ}">${esc(e.name)}</span>`).join('')}`));
      ks.forEach(k=>{const sch=schedule(k),sl=sch.byWeek[w.mon]||[],td=el('td','jc');
        sl.forEach(x=>td.appendChild(slotLine(k,x,`<b>${WD[(pd(x.d).getDay()+6)%7]}</b> `)));
        if(!sl.length){td.className+=' empty';td.textContent='kein Unterricht';}tr.appendChild(td);});
      tb.appendChild(tr);}
    tbl.appendChild(tb);card.appendChild(tbl);m.appendChild(card);});
  if(!list.length)m.appendChild(el('p','hint','Keine Abschnitte im gewählten Zeitraum.'));}
function monatView(m,W,ks,ref,mons){
  let list=mons.slice();const tm=ref.slice(0,7);
  if(ui.jz==='kuenftig')list=list.filter(x=>x>=tm);else if(ui.jz==='einzeln')list=[ui.mon];
  list.forEach((mk,idx)=>{
    const [y,mo]=mk.split('-').map(Number),first=mk+'-01',last=iso(new Date(y,mo,0));
    const box=el('div','mmonth'+(idx<list.length-1?' pb':''));
    box.appendChild(el('h3','',`${MON[mo-1]} ${y}`));
    const tbl=el('table','jtab mmat');tbl.innerHTML=`<thead><tr><th class="cw">KW</th><th class="cd">Tag</th>${colHead(ks)}</tr></thead>`;
    W.filter(w=>w.fri>=first&&w.mon<=last).forEach(w=>{
      const days=[0,1,2,3,4].map(d=>addD(w.mon,d)).filter(d=>d>=first&&d<=last);if(!days.length)return;
      const tb=el('tbody','wkgrp'+(w.mon===ref?' now':''));
      days.forEach((date,j)=>{
        const tr=el('tr'+(date===today?' today':''));tr.className='md'+(date===today?' today':'');
        if(j===0){const td=el('td','cw',`<b>${w.kw}</b>`);td.rowSpan=days.length;tr.appendChild(td);}
        const es=calAll().filter(e=>e.von<=date&&date<=e.bis),bk=es.find(e=>KT[e.typ].blk&&!e.f);
        tr.appendChild(el('td','cd',`<b>${WD[(pd(date).getDay()+6)%7]}</b> ${+date.slice(8)}.${+date.slice(5,7)}.${es.filter(e=>!(bk&&e===bk)).map(e=>`<span class="ev k-${e.typ}" title="${esc(e.name)}">${esc(e.name)}${e.f?' ('+esc(e.f)+')':''}</span>`).join('')}`));
        if(bk){const td=el('td','ferien',esc(bk.name));td.colSpan=ks.length;tr.appendChild(td);}
        else ks.forEach(k=>{const td=el('td','jc'),x=(schedule(k).byWeek[w.mon]||[]).find(s=>s.d===date);
          if(x)td.appendChild(slotLine(k,x,''));else td.className+=' empty';
          if(!x&&es.some(e=>KT[e.typ].blk&&e.f===k)){td.className='blkc';td.textContent=es.find(e=>KT[e.typ].blk&&e.f===k).name;}
          tr.appendChild(td);});
        tb.appendChild(tr);});
      tbl.appendChild(tb);});
    box.appendChild(tbl);m.appendChild(box);});}
