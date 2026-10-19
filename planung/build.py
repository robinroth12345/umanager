#!/usr/bin/env python3
"""Baut planung.js aus planung/src (Planungsmodul fuer Lehrerpult).
Aufruf im Repo-Hauptordner:  python3 planung/build.py"""
import json, os
here = os.path.dirname(os.path.abspath(__file__))
src = os.path.join(here, 'src')
rd = lambda n: open(os.path.join(src, n), encoding='utf-8').read()

app = rd('app.js').replace('/*@@CAL@@*/', rd('cal.js'))

def sub(a, b, cnt=1):
    global app
    assert app.count(a) == cnt, (a, app.count(a))
    app = app.replace(a, b)

# Rahmen: eigene Instanz im Shadow DOM, Zustand liegt in Lehrerpults S.planung
sub("(function(){\n'use strict';\nconst DATA=JSON.parse(document.getElementById('plan-data').textContent);\n", "")
sub("const $=(s,r=document)=>r.querySelector(s);", "const $=(s,r=ROOT)=>r.querySelector(s);")
sub("const today=iso(new Date());", "let today=iso(new Date());")
sub("try{S=normS(JSON.parse(lsGet(LS)||'null'));}catch(e){S=emptyS();}", "S=emptyS();")
sub("function save(){S.saved=now();const ok=lsSet(LS,JSON.stringify(S));setSaveState(ok);}",
    "function save(){S.saved=now();host.set(S);host.save();setSaveState(true);}")
sub("  else if(S.saved){e.className='savestate';e.textContent='Lokal im Browser gespeichert, '+fmtT(S.saved).slice(11);}",
    "  else if(S.saved){e.className='savestate';e.textContent='Gespeichert '+fmtT(S.saved).slice(11);}")
i = app.index("try{const t=lsGet('uebersicht-theme')"); j = app.index("$('#stand').textContent")
app = app[:i] + app[j:]
sub("let current=(location.hash||'').slice(1);if(!tabs.find(t=>t.id===current))current='start';", "let current='start';")
sub("function go(id){current=id;history.replaceState(null,'','#'+id);render();}", "function go(id){current=id;render();}")
sub("document.querySelectorAll('.brow')", "ROOT.querySelectorAll('.brow')")
sub("document.querySelector('input[name=impMode]:checked')", "ROOT.querySelector('input[name=impMode]:checked')")
sub("lsSet(LS,JSON.stringify(S));try{localStorage.removeItem(LSP);}catch(e){}", "host.set(S);host.save();try{localStorage.removeItem(LSP);}catch(e){}")
sub("window.addEventListener('hashchange',()=>{const h=location.hash.slice(1);if(tabs.find(t=>t.id===h)&&h!==current){current=h;render();}});\nrender();\n})();",
    "return {el:HOST,reload(){S=normS(host.get());today=iso(new Date());SCH={};HOST.classList.toggle('dark',isDark());render();}};")

css = rd('vars.css') + rd('base.css') + rd('extra_scoped.css')
skeleton = ('<style>' + css + '</style>' + rd('symbols.svg') +
  '<div class="pl"><div class="plhead"><span id="stand"></span><span id="savestate" class="savestate"></span></div>'
  '<nav class="tabs" id="tabs" role="tablist"></nav><main id="main"></main></div>'
  '<dialog id="dlg"><div class="dlg" id="dlgBody"></div></dialog><dialog id="impDlg"><div class="dlg" id="impBody"></div></dialog>')

DOC_CSS = ("@media print{body[data-view=planung] #side,body[data-view=planung] .topbar{display:none!important}"
           "body[data-view=planung] #view{padding:0!important}.plhost{page:planung}}"
           "@page planung{size:A4 landscape;margin:8mm}")

out = f"""/* Planung: Jahresuebersicht, Stoffverteilung mit Bildungsplan, Kalender.
   GENERIERT aus planung/src mit planung/build.py - bitte nicht von Hand aendern. */
window.PLANUNG=(function(){{
'use strict';
const SKELETON={json.dumps(skeleton, ensure_ascii=False)};
const DOC_CSS={json.dumps(DOC_CSS)};
let inst=null,styled=false;
function isDark(){{const t=document.documentElement.getAttribute('data-theme');return t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);}}
function docStyle(){{
  if(styled)return;styled=true;
  const s=document.createElement('style');s.textContent=DOC_CSS;document.head.appendChild(s);
  let fb=null;
  window.addEventListener('beforeprint',()=>{{if(document.body.dataset.view!=='planung')return;fb=document.createElement('style');fb.textContent='@page{{size:A4 landscape;margin:8mm}}';document.head.appendChild(fb);}});
  window.addEventListener('afterprint',()=>{{if(fb){{fb.remove();fb=null;}}}});
}}
function create(DATA,host){{
const HOST=document.createElement('div');HOST.className='plhost';
const ROOT=HOST.attachShadow({{mode:'open'}});ROOT.innerHTML=SKELETON;
{app}
}}
return {{
  mount(ph,api){{
    const show=()=>{{ph.replaceChildren(inst.el);inst.reload();}};
    if(inst){{show();return;}}
    ph.textContent='Planung wird geladen …';
    fetch('plan.json',{{cache:'no-cache'}}).then(r=>{{if(!r.ok)throw new Error('HTTP '+r.status);return r.json();}})
      .then(d=>{{inst=create(d,api);docStyle();show();}})
      .catch(e=>{{ph.innerHTML='<div class="card empty"><h3>Planung nicht verfügbar</h3><p>plan.json konnte nicht geladen werden ('+String(e.message)+'). Bei fehlender Verbindung die App einmal online öffnen.</p></div>';}});
  }}
}};
}})();
"""
open(os.path.join(here, '..', 'planung.js'), 'w', encoding='utf-8').write(out)
print('planung.js', len(out))
