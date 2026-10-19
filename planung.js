/* Planung: Jahresuebersicht, Stoffverteilung mit Bildungsplan, Kalender.
   GENERIERT aus planung/src mit planung/build.py - bitte nicht von Hand aendern. */
window.PLANUNG=(function(){
'use strict';
const SKELETON="<style>:host{--gehalten-bg:#eceef2;--gehalten-fg:#586174;--gehalten-bd:#c9cfda;--geplant-bg:#e3f4e8;--geplant-fg:#17703a;--geplant-bd:#8fcfa5;--idee-bg:#fff3d6;--idee-fg:#8a5a00;--idee-bd:#efc46a;--offen-bg:transparent;--offen-fg:#6b7385;--offen-bd:#a9b0bf;--ab:#1d6fd1;--today:var(--accent-soft);--ka-bg:#f8d7d3;--ka-fg:#8a1f16;--kt-bg:#dde8fb;--kt-fg:#1d4a9a}\n:host(.dark){--gehalten-bg:#222a39;--gehalten-fg:#9aa5ba;--gehalten-bd:#364157;--geplant-bg:#143a25;--geplant-fg:#7fdca1;--geplant-bd:#276843;--idee-bg:#42330f;--idee-fg:#f1c768;--idee-bd:#7a5f1c;--offen-fg:#8e98ad;--offen-bd:#4b566e;--ab:#6db0ff;--ka-bg:#4a1f1b;--ka-fg:#f4b5ae;--kt-bg:#1c3157;--kt-fg:#a9c6f5}\n.plhead{display:flex;justify-content:flex-end;gap:14px;font-size:.8rem;color:var(--muted);padding:0 4px 6px}\n*{box-sizing:border-box}\n:host{display:block;color:var(--ink);font-size:15px;line-height:1.45;font-family:inherit}\nheader{display:flex;flex-wrap:wrap;gap:10px 18px;align-items:center;justify-content:space-between;padding:14px 20px 0}\nh1{margin:0;font-size:1.35rem;letter-spacing:.2px}\nh1 small{font-weight:400;color:var(--muted);font-size:.8rem;margin-left:8px}\n.tools{display:flex;gap:8px}\nbutton{font:inherit;color:inherit;cursor:pointer}\n.btn{background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:6px 12px}\n.btn:hover{border-color:var(--accent)}\nnav.tabs{display:flex;gap:4px;padding:12px 20px 0;overflow-x:auto;border-bottom:1px solid var(--line)}\n.tab{background:none;border:none;border-bottom:3px solid transparent;padding:8px 14px;white-space:nowrap;color:var(--muted);font-weight:500}\n.tab[aria-selected=\"true\"]{color:var(--ink);border-bottom-color:var(--accent)}\n.tab .dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:6px;vertical-align:baseline}\n.tab.soon{opacity:.6}\nmain{padding:18px 20px 40px;max-width:1500px;margin:0 auto}\n.legend{display:flex;flex-wrap:wrap;gap:8px 16px;margin:0 0 16px;font-size:.85rem;color:var(--muted);align-items:center}\n.legend span.item{display:inline-flex;align-items:center;gap:6px}\n.chip{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:6px;border:1px solid}\n.chip svg{width:14px;height:14px}\n.st-gehalten{background:var(--gehalten-bg);color:var(--gehalten-fg);border-color:var(--gehalten-bd)}\n.st-geplant{background:var(--geplant-bg);color:var(--geplant-fg);border-color:var(--geplant-bd)}\n.st-idee{background:var(--idee-bg);color:var(--idee-fg);border-color:var(--idee-bd)}\n.st-offen{background:var(--offen-bg);color:var(--offen-fg);border-color:var(--offen-bd);border-style:dashed}\n.chip.ab{background:var(--panel);color:var(--ab);border-color:var(--ab)}\n.viewtoggle{margin-left:auto;display:flex;gap:4px}\n.viewtoggle .btn[aria-pressed=\"true\"]{border-color:var(--accent);color:var(--accent)}\n.weeks{display:grid;grid-template-columns:repeat(auto-fit,minmax(520px,1fr));gap:18px}\n.week{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:12px 12px 14px;min-width:0}\n.week h2{margin:2px 4px 10px;font-size:1.05rem;display:flex;justify-content:space-between;align-items:baseline;gap:8px;flex-wrap:wrap}\n.week h2 .badge{font-size:.72rem;font-weight:600;color:var(--accent);border:1px solid var(--accent);border-radius:20px;padding:1px 9px}\n.week h2 .sub{font-weight:400;color:var(--muted);font-size:.85rem}\ntable.plan{width:100%;border-collapse:separate;border-spacing:4px;table-layout:fixed}\ntable.plan th{font-weight:600;font-size:.82rem;padding:4px 2px;color:var(--muted)}\ntable.plan th.today{color:var(--accent)}\ntable.plan th .d{display:block;font-weight:400;font-size:.74rem}\ntable.plan td.time{width:62px;font-size:.74rem;color:var(--muted);text-align:right;padding-right:4px;white-space:nowrap;line-height:1.15}\ntable.plan td.time b{display:block;font-size:.95rem;color:var(--ink)}\ntable.plan td{height:68px;vertical-align:top;padding:0}\ntd.empty{border:1px dashed var(--line);border-radius:8px;opacity:.6}\ntd.empty.frei{background:repeating-linear-gradient(45deg,transparent 0 8px,var(--line) 8px 9px);opacity:.35}\ntd.todaycol.empty{background:var(--today)}\n.cell{display:flex;flex-direction:column;width:100%;height:100%;min-height:68px;text-align:left;border:1px solid;border-radius:8px;padding:5px 7px;gap:2px}\n.cell:hover,.cell:focus-visible{outline:2px solid var(--accent);outline-offset:1px}\n.cell .top{display:flex;justify-content:space-between;align-items:center;gap:4px}\n.cell .kl{font-weight:700;font-size:.95rem;line-height:1.1}\n.cell .kl small{font-weight:500;font-size:.72rem;opacity:.85;margin-left:3px}\n.cell .th{font-size:.76rem;line-height:1.25;opacity:.95;overflow-wrap:anywhere;hyphens:auto}\n.cell .icons{display:flex;gap:3px;align-items:center}\n.cell .icons svg{width:15px;height:15px}\n.cell .icons .abic{color:var(--ab)}\n.cell.st-offen .kl{font-weight:600}\n.pause td{height:8px}\n.list{display:none}\n.daycard{border:1px solid var(--line);border-radius:10px;margin:8px 0;overflow:hidden}\n.daycard h3{margin:0;padding:6px 10px;font-size:.88rem;background:var(--gehalten-bg);display:flex;justify-content:space-between}\n.daycard.today h3{background:var(--today);color:var(--accent)}\n.row{display:flex;gap:10px;align-items:stretch;border-top:1px solid var(--line)}\n.row .t{width:78px;padding:8px;font-size:.78rem;color:var(--muted);flex:none}\n.row .t b{display:block;color:var(--ink);font-size:.9rem}\n.row .cell{min-height:0!important;border-radius:0;border-width:0 0 0 4px;min-height:0;height:auto}\n.row .cellwrap{flex:1}\n.view-list .plan{display:none}\n.view-list .list{display:block}\n.card{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin-bottom:16px}\n.card h2,.card h3{margin:0 0 8px;font-size:1.02rem}\n.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px}\n.muted{color:var(--muted)}\n.bar{height:14px;border-radius:8px;background:var(--gehalten-bg);border:1px solid var(--line);overflow:hidden;margin:6px 0}\n.bar>i{display:block;height:100%;background:var(--accent)}\n.bar.placeholder{background:repeating-linear-gradient(45deg,transparent 0 7px,var(--line) 7px 14px);border-style:dashed}\n.ph-tag{display:inline-block;font-size:.7rem;border:1px dashed var(--muted);color:var(--muted);border-radius:12px;padding:0 8px;margin-left:6px;vertical-align:middle}\nul.steps{margin:6px 0 0;padding-left:20px}\nul.steps li{margin:3px 0}\ntable.tl{width:100%;border-collapse:collapse;font-size:.88rem}\ntable.tl td,table.tl th{padding:6px 8px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}\ntable.tl th{color:var(--muted);font-weight:600;font-size:.78rem}\ntable.tl tr.cl{cursor:pointer}\ntable.tl tr.cl:hover{background:var(--today)}\npre.code{background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:10px;overflow:auto;font-size:.78rem}\ndialog{border:1px solid var(--line);border-radius:14px;background:var(--panel);color:var(--ink);padding:0;max-width:560px;width:calc(100% - 32px)}\ndialog::backdrop{background:rgba(10,14,22,.55)}\n.dlg{padding:18px 20px 16px}\n.dlg h3{margin:0 0 4px;font-size:1.15rem}\n.dlg .meta{color:var(--muted);font-size:.85rem;margin-bottom:10px}\n.dlg .stline{display:inline-flex;align-items:center;gap:7px;padding:3px 10px 3px 6px;border-radius:20px;border:1px solid;font-size:.85rem;font-weight:600;margin-bottom:10px}\n.dlg ul{margin:4px 0 10px;padding-left:20px}\n.dlg a{color:var(--accent);word-break:break-all}\n.dlg .close{float:right}\nfooter{color:var(--muted);font-size:.78rem;padding:0 20px 24px;max-width:1500px;margin:0 auto}\n@media (max-width:760px){\n  .weeks{grid-template-columns:1fr}\n  main{padding:14px 12px 32px}\n  header,nav.tabs{padding-left:12px;padding-right:12px}\n}\n/* ---- Stoffverteilung ---- */\n.sv-sum{display:grid;gap:10px}\n.sv-top{display:flex;flex-wrap:wrap;gap:6px 24px;align-items:baseline;justify-content:space-between}\n.big{font-weight:700;font-size:1.7rem;font-variant-numeric:tabular-nums;letter-spacing:-.01em}\n.big small{font-size:.9rem;font-weight:500;color:var(--muted)}\n.bar{height:14px;border-radius:8px;background:var(--gehalten-bg);border:1px solid var(--line);overflow:hidden;position:relative;display:flex}\n.bar>i{display:block;height:100%}\n.bar>i.done{background:var(--accent)}\n.bar>i.plan{background:color-mix(in srgb,var(--accent) 35%,transparent)}\n.bar.small{height:8px;margin:6px 0 2px}\n.pills{display:flex;flex-wrap:wrap;gap:6px}\n.pill{font-size:.8rem;padding:2px 10px;border-radius:999px;border:1px solid var(--line);background:var(--bg);color:var(--muted);font-variant-numeric:tabular-nums}\n.pill.ok{background:var(--geplant-bg);color:var(--geplant-fg);border-color:var(--geplant-bd);font-weight:600}\n.pill.warn{background:var(--idee-bg);color:var(--idee-fg);border-color:var(--idee-bd);font-weight:600}\n.pill.bad{background:#fbdcd9;color:#a1261d;border-color:#e9a39c;font-weight:600}\n:host(.dark) .pill.bad{background:#4d2320;color:#ff9a90;border-color:#7a3a35}\n.nextup{background:var(--today);border-radius:8px;padding:6px 10px;font-size:.9rem}\n.sv-tools{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:4px 0 12px}\n.sv-tools label{font-size:.82rem;color:var(--muted);display:inline-flex;gap:6px;align-items:center}\ninput.num,select.fld,input.fld,textarea.fld{font:inherit;color:inherit;background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:5px 8px}\ninput.num{width:64px}\ntextarea.fld{width:100%;min-height:70px;resize:vertical}\n.bgroup{display:flex;align-items:center;gap:8px;margin:14px 2px 6px;font-size:.86rem;color:var(--muted)}\n.bgroup b{color:var(--ink);font-size:.98rem}\n.bgroup .line{flex:1;height:1px;background:var(--line)}\n.bgroup button{border:0;background:none;color:var(--accent);cursor:pointer;font-size:.82rem}\n.bpbox{border:1px solid var(--line);border-radius:8px;padding:8px 12px;background:var(--bg);font-size:.84rem;margin:0 0 8px}\n.bpbox ul{margin:4px 0 0;padding-left:18px}\n.blist{display:grid;gap:6px}\n.brow{background:var(--panel);border:1px solid var(--line);border-radius:10px;position:relative}\n.brow.done .bt{text-decoration:line-through;text-decoration-color:color-mix(in srgb,var(--muted) 60%,transparent);color:var(--muted)}\n.brow.next{border-color:var(--accent);box-shadow:0 0 0 1px var(--accent)}\n.brow.puf{border-style:dashed}\n.brow.dragging{opacity:.4}\n.brow.dropb::before,.brow.dropa::after{content:\"\";position:absolute;left:0;right:0;height:3px;background:var(--accent);border-radius:2px}\n.brow.dropb::before{top:-5px}.brow.dropa::after{bottom:-5px}\n.bmain{display:grid;grid-template-columns:20px 24px 96px minmax(0,1fr) auto auto;gap:6px 10px;align-items:center;padding:8px 10px}\n.grip{cursor:grab;color:var(--muted);user-select:none;text-align:center;touch-action:none}\n.brow input[type=checkbox]{width:19px;height:19px;accent-color:var(--accent);margin:0;cursor:pointer}\n.rng{font-size:.78rem;color:var(--muted);font-variant-numeric:tabular-nums;line-height:1.25;white-space:nowrap}\n.rng b{color:var(--ink);font-size:.86rem}\n.rng.zero{opacity:.6}\n.bt{font-weight:600;line-height:1.25}\n.bmeta{font-size:.8rem;color:var(--muted);margin-top:2px;display:flex;flex-wrap:wrap;gap:2px 10px}\n.bmeta .nt{color:var(--idee-fg);font-style:italic}\n.stp{display:inline-flex;align-items:center;border:1px solid var(--line);border-radius:8px;background:var(--bg)}\n.stp button{border:0;background:none;width:26px;height:28px;cursor:pointer;color:var(--muted);font-size:1rem}\n.stp button:hover:not([disabled]){color:var(--ink)}\n.stp button[disabled]{opacity:.3;cursor:default}\n.stp output{min-width:34px;text-align:center;font-size:.88rem;font-variant-numeric:tabular-nums}\n.ract{display:inline-flex}\n.ib{border:1px solid transparent;background:none;width:28px;height:28px;border-radius:6px;cursor:pointer;color:var(--muted)}\n.ib:hover:not([disabled]){background:var(--bg);border-color:var(--line);color:var(--ink)}\n.ib[disabled]{opacity:.3;cursor:default}\n.bdet{border-top:1px solid var(--line);padding:10px 14px 12px 44px;background:var(--bg);border-radius:0 0 10px 10px;display:grid;gap:10px;font-size:.9rem}\n.bdet h4{margin:0 0 2px;font-size:.72rem;text-transform:uppercase;letter-spacing:.07em;color:var(--muted)}\n.bdet ul{margin:0;padding-left:18px}\n.bdet .bpid{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:.78rem;color:var(--muted)}\n.rest{border:1px dashed var(--line);border-radius:10px;padding:10px 14px;display:flex;justify-content:space-between;gap:10px;color:var(--muted)}\n.rest.bad{border-color:#e9a39c;color:#a1261d}\n.addbox{border:1px solid var(--line);border-radius:10px;padding:12px;margin:10px 0;display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end;background:var(--panel)}\n.addbox label{display:grid;gap:3px;font-size:.8rem;color:var(--muted)}\n.btn.primary{background:var(--accent);color:#fff;border-color:var(--accent)}\n.btn.danger{color:#b3261e}\n.btn.sm{padding:3px 9px;font-size:.84rem}\n.hint{color:var(--muted);font-size:.84rem}\npre.prompt{white-space:pre-wrap;background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:10px 12px;font-size:.8rem;max-height:260px;overflow:auto;margin:6px 0}\n.rows3{display:grid;gap:14px}\ntable.tl td.nowrap{white-space:nowrap}\n.savestate{font-size:.78rem;color:var(--muted)}\n.savestate.warn{color:var(--idee-fg);font-weight:600}\n.err{color:#b3261e;font-size:.86rem;margin:6px 0}\n.okmsg{color:var(--geplant-fg);font-size:.86rem;margin:6px 0}\n.prev{max-height:240px;overflow:auto;border:1px solid var(--line);border-radius:8px}\n.mini .bar{height:7px}\n@media (max-width:680px){\n .bmain{grid-template-columns:20px 24px minmax(0,1fr)}\n .rng{grid-column:3;grid-row:1}\n .bmain .tc{grid-column:1/-1}\n .bmain .stp{grid-column:1/3;justify-self:start}\n .ract{grid-column:3;justify-self:end}\n .bdet{padding-left:14px}\n}\n.field-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:8px 0}\n.lessonedit{display:grid;gap:8px;margin-top:10px;border-top:1px solid var(--line);padding-top:10px}\n/* Kalender und Jahresübersicht */\ntable.plan th .kn{display:block;font-weight:500;font-size:.64rem;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.kchip{display:inline-block;border-radius:10px;padding:0 8px;font-size:.78rem;border:1px solid var(--line);background:var(--gehalten-bg)}\n.k-ferien{background:var(--idee-bg);color:var(--idee-fg)}.k-feiertag{background:var(--geplant-bg);color:var(--geplant-fg)}.k-frei{background:var(--gehalten-bg)}.k-ausfall{background:var(--ka-bg);color:var(--ka-fg)}.k-termin{background:var(--kt-bg);color:var(--kt-fg)}\n.jy-wrap{overflow-x:auto;margin-top:8px}\n.jy{--n:46;min-width:900px}\n.jr{display:grid;grid-template-columns:96px repeat(var(--n),minmax(14px,1fr));gap:1px;align-items:stretch;margin-bottom:3px}\n.jl{padding:2px 6px 2px 0;font-size:.8rem;display:flex;flex-direction:column;justify-content:center;line-height:1.15}\n.jl small{color:var(--muted);font-size:.68rem}\n.jm .mh{font-size:.72rem;font-weight:600;color:var(--muted);border-bottom:1px solid var(--line);padding-left:2px;overflow:hidden;white-space:nowrap}\n.jw .kw{font-size:.6rem;text-align:center;color:var(--muted)}.jw .kw.now{color:var(--accent);font-weight:700}\n.jgh{font-size:.78rem;font-weight:700;margin:8px 0 2px;color:var(--muted);text-transform:none}\n.seg{min-height:30px;border-radius:5px;padding:2px 4px;font-size:.68rem;line-height:1.15;overflow:hidden;background:color-mix(in srgb,var(--fc,var(--accent)) var(--tn,40%),var(--panel));border:1px solid color-mix(in srgb,var(--fc,var(--accent)) 60%,var(--panel));display:flex;align-items:center}\n.seg.dn{opacity:.55}\n.seg.dn::before{content:\"✓ \";font-weight:700}\n.seg.res{background:repeating-linear-gradient(45deg,transparent 0 5px,var(--line) 5px 6px);border:1px dashed var(--muted);color:var(--muted)}\n.seg.blk,.seg.ferien{background:var(--gehalten-bg);border-color:var(--gehalten-bd);color:var(--gehalten-fg)}\n.jk .seg{min-height:22px}\n.mk{font-size:.7rem;text-align:center;color:var(--accent);align-self:center}\n.jleg{display:flex;flex-wrap:wrap;gap:6px 16px;margin-top:10px;font-size:.78rem;color:var(--muted)}\n.jleg .item{display:inline-flex;align-items:center;gap:6px}\n.swatch{display:inline-block;width:14px;height:12px;border-radius:3px;border:1px solid var(--line)}\n.swatch.res{background:repeating-linear-gradient(45deg,transparent 0 3px,var(--muted) 3px 4px)}\n.swatch.ferien{background:var(--gehalten-bg)}\n.sects{display:grid;grid-template-columns:repeat(auto-fit,minmax(380px,1fr));gap:12px;margin-top:8px}\n.sect{margin-bottom:0;break-inside:avoid}\n.srow{display:flex;gap:8px;padding:3px 0;border-top:1px solid var(--line);align-items:flex-start}\n.srow .jl{width:58px;flex:none;padding-top:3px}\n.chips{display:flex;flex-wrap:wrap;gap:4px;flex:1}\n.chip2{display:inline-block;border-radius:6px;padding:1px 7px;font-size:.76rem;background:color-mix(in srgb,var(--fc,var(--accent)) var(--tn,40%),var(--panel));border:1px solid color-mix(in srgb,var(--fc,var(--accent)) 60%,var(--panel))}\n.chip2.dn{opacity:.55}.chip2 i{font-style:normal;font-weight:700;margin-right:2px}\n.chip2.res{background:transparent;border-style:dashed;color:var(--muted)}\ntable.mtab{width:100%;border-collapse:collapse;table-layout:fixed;margin-top:6px}\ntable.mtab th{font-size:.8rem;color:var(--muted);padding:3px;text-align:left}\ntable.mtab th.kwc,table.mtab td.kwc{width:34px;text-align:center;color:var(--muted)}\ntable.mtab td.md{border:1px solid var(--line);height:58px;vertical-align:top;padding:2px 4px;font-size:.72rem;background:var(--panel)}\ntable.mtab td.md.out{opacity:.45}table.mtab td.md.blk{background:var(--gehalten-bg)}table.mtab td.md.today{outline:2px solid var(--accent);outline-offset:-2px}\ntable.mtab .dn{font-weight:700;display:block}\ntable.mtab .ev{display:block;border-radius:4px;padding:0 4px;margin-top:1px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}\ntable.mtab tr.mb td{padding:3px 2px 8px;border-bottom:1px solid var(--line)}\ntable.mtab tr.mb .chip2{margin:1px 2px 1px 0}\n.printhead,.printonly{display:none}\n@media print{\n  *{-webkit-print-color-adjust:exact;print-color-adjust:exact}\n  body{background:#fff;font-size:10px}\n  header,nav.tabs,footer,.noprint,.savestate,.tools{display:none!important}\n  main{padding:0;max-width:none}\n  .printhead{display:block;font-size:12px;margin-bottom:4px}.printonly{display:block}\n  .jy-wrap{overflow:visible}.jy{min-width:0}\n  .seg{min-height:22px;font-size:7px}.jl{font-size:8px}\n  .jleg{font-size:8px}\n  .sects{grid-template-columns:1fr 1fr;gap:6px}\n  .card{border:1px solid var(--line)}\n  table.mtab td.md{height:46px}\n  .week,.card,.sect{break-inside:avoid}\n}\n/* Jahresübersicht neu: Spalten = Fächer, Zeilen = Zeit */\n.jtab{width:100%;border-collapse:collapse;table-layout:fixed;font-size:.76rem;margin:8px 0}\n.jtab th,.jtab td{border:1px solid var(--line);vertical-align:top;padding:1px 2px}\n.jtab th{font-size:.78rem;background:var(--panel);text-align:left;padding:3px 5px}\n.jtab th.cf{background:color-mix(in srgb,var(--fc) 30%,var(--panel));border-bottom:3px solid var(--fc)}\n.jtab th.cf small{display:block;font-weight:400;color:var(--muted);font-size:.68rem}\n.jtab th.cm,.jtab td.cm{width:34px;text-align:center;font-weight:700;color:var(--muted);vertical-align:middle}\n.jtab th.cw,.jtab td.cw{width:92px}\n.jtab th.ck,.jtab td.ck{width:100px}\n.jtab td.cw span{color:var(--muted);font-size:.7rem}\n.jtab tr.now td.cw{box-shadow:inset 3px 0 var(--accent)}\n.jtab td.ferien,.jtab td.blkc{background:var(--gehalten-bg);color:var(--gehalten-fg);text-align:center;vertical-align:middle;font-size:.74rem}\n.jtab td.empty{color:var(--muted);text-align:center;font-size:.7rem}\n.jtab td.ck .ev,.jtab td.cw .ev{display:block;font-size:.66rem;border-radius:4px;padding:0 4px;margin-top:1px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}\n.bl{border-radius:4px;padding:1px 5px;margin:1px 0;line-height:1.2;background:color-mix(in srgb,var(--fc,var(--accent)) var(--tn,40%),var(--panel));border-left:3px solid var(--fc,var(--accent));overflow-wrap:anywhere}\n.bl.dn{opacity:.55}\n.bl.res{background:repeating-linear-gradient(45deg,transparent 0 5px,var(--line) 5px 6px);border-left:3px dashed var(--muted);color:var(--muted)}\n.nn{font-style:normal;font-weight:700;margin:0 2px}\n.kf{font-weight:700}\n.jlg{display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin:3px 0;font-size:.76rem}\n.chip2.ferien{background:var(--gehalten-bg);border:1px solid var(--gehalten-bd)}\n.sect h3{margin:14px 0 2px;font-size:1rem}\n.mmonth h3{margin:14px 0 2px}\ntable.mtab td.md .bl{font-size:.68rem;margin-top:2px}\ntable.mtab td.md{height:auto;min-height:58px}\n@media print{\n  .jtab{font-size:7px}.jtab th{font-size:7px}\n  .jtab tr{break-inside:avoid}.jtab thead{display:table-header-group}\n  .mmonth.pb{break-after:page}\n  table.mtab td.md .bl{font-size:6.5px}\n  .bl{padding:0 3px;margin:0 0 1px}\n}\n.mmat td.cd{width:96px;white-space:nowrap;overflow:hidden}\n.mmat th.cd{width:96px}\n.mmat tbody.wkgrp{border-top:2px solid var(--muted)}\n.mmat tbody.wkgrp.now td.cw{box-shadow:inset 3px 0 var(--accent)}\n.mmat td.cd .ev{display:inline-block;margin-left:4px;max-width:120px;vertical-align:bottom}\n.mmat tr.md.today td.cd{background:var(--today)}\n.mmat td.jc.empty{background:transparent}\n.mmat td.jc{height:20px}\n@media print{.mmat tbody.wkgrp{break-inside:avoid}.mmat td.jc{height:14px}}\n</style><svg width=\"0\" height=\"0\" style=\"position:absolute\" aria-hidden=\"true\">\n  <symbol id=\"i-check\" viewBox=\"0 0 16 16\"><path d=\"M3 8.5l3.2 3.2L13 4.8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></symbol>\n  <symbol id=\"i-done\" viewBox=\"0 0 16 16\"><path d=\"M1.5 8.5l3 3 5-6M7.5 11.5l1 1 6-7\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></symbol>\n  <symbol id=\"i-bulb\" viewBox=\"0 0 16 16\"><path d=\"M8 1.8a4.2 4.2 0 0 0-2.3 7.7c.5.4.8.9.8 1.5h3c0-.6.3-1.1.8-1.5A4.2 4.2 0 0 0 8 1.8zM6.5 13h3M7 14.6h2\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></symbol>\n  <symbol id=\"i-open\" viewBox=\"0 0 16 16\"><circle cx=\"8\" cy=\"8\" r=\"5.6\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-dasharray=\"2.6 2.4\"/></symbol>\n  <symbol id=\"i-doc\" viewBox=\"0 0 16 16\"><path d=\"M3.8 1.8h5.6l3 3v9.4H3.8z M9.2 1.8v3.2h3.2 M6 8.4h4.2M6 10.9h4.2\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/></symbol>\n  <symbol id=\"i-slide\" viewBox=\"0 0 16 16\"><rect x=\"1.8\" y=\"3\" width=\"12.4\" height=\"8\" rx=\"1.2\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\"/><path d=\"M8 11v3M5.5 14h5\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\"/></symbol>\n</svg><div class=\"pl\"><div class=\"plhead\"><span id=\"stand\"></span><span id=\"savestate\" class=\"savestate\"></span></div><nav class=\"tabs\" id=\"tabs\" role=\"tablist\"></nav><main id=\"main\"></main></div><dialog id=\"dlg\"><div class=\"dlg\" id=\"dlgBody\"></div></dialog><dialog id=\"impDlg\"><div class=\"dlg\" id=\"impBody\"></div></dialog>";
const DOC_CSS="@media print{body[data-view=planung] #side,body[data-view=planung] .topbar{display:none!important}body[data-view=planung] #view{padding:0!important}.plhost{page:planung}}@page planung{size:A4 landscape;margin:8mm}";
let inst=null,styled=false;
function isDark(){const t=document.documentElement.getAttribute('data-theme');return t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);}
function docStyle(){
  if(styled)return;styled=true;
  const s=document.createElement('style');s.textContent=DOC_CSS;document.head.appendChild(s);
  let fb=null;
  window.addEventListener('beforeprint',()=>{if(document.body.dataset.view!=='planung')return;fb=document.createElement('style');fb.textContent='@page{size:A4 landscape;margin:8mm}';document.head.appendChild(fb);});
  window.addEventListener('afterprint',()=>{if(fb){fb.remove();fb=null;}});
}
function create(DATA,host){
const HOST=document.createElement('div');HOST.className='plhost';
const ROOT=HOST.attachShadow({mode:'open'});ROOT.innerHTML=SKELETON;
const SV=DATA.stoff;
const DAYS=['Mo','Di','Mi','Do','Fr'];
const $=(s,r=ROOT)=>r.querySelector(s);
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const icon=id=>`<svg aria-hidden="true"><use href="#${id}"/></svg>`;
const pad=n=>String(n).padStart(2,'0');
const iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const fmt=s=>{const [y,m,d]=s.split('-');return `${+d}.${+m}.`;};
const fmtL=s=>{const dt=new Date(s+'T12:00:00');return ['So','Mo','Di','Mi','Do','Fr','Sa'][dt.getDay()]+' '+fmt(s);};
const fmtT=ms=>{const d=new Date(ms);return `${iso(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;};
const now=()=>Date.now();
let today=iso(new Date());
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
S=emptyS();
function fs(f){return S.st[f]||(S.st[f]=emptyF());}
function save(){S.saved=now();host.set(S);host.save();setSaveState(true);}
function setSaveState(ok){const e=$('#savestate');if(!e)return;
  if(!ok||!lsOK){e.className='savestate warn';e.textContent='Browser blockiert das Speichern: bitte regelmäßig exportieren (Reiter Daten)';}
  else if(S.saved){e.className='savestate';e.textContent='Gespeichert '+fmtT(S.saved).slice(11);}
  else{e.className='savestate';e.textContent='Noch keine eigenen Änderungen';}}

/* ---------- Thema hell/dunkel ---------- */
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
let current='start';
function go(id){current=id;render();}
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
  row.ondragend=()=>{row.draggable=false;ui.drag=null;ROOT.querySelectorAll('.brow').forEach(r=>r.classList.remove('dragging','dropb','dropa'));};
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
  $('#impOk').onclick=()=>{const mode=ROOT.querySelector('input[name=impMode]:checked').value;pushPrev();
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
  const un=$('#imUndo');if(un)un.onclick=()=>{try{S=normS(JSON.parse(lsGet(LSP)));host.set(S);host.save();try{localStorage.removeItem(LSP);}catch(e){}flash('Vorheriger Stand wiederhergestellt.');render();}catch(e){}};
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
return {el:HOST,reload(){S=normS(host.get());today=iso(new Date());SCH={};HOST.classList.toggle('dark',isDark());render();}};

}
return {
  mount(ph,api){
    const show=()=>{ph.replaceChildren(inst.el);inst.reload();};
    if(inst){show();return;}
    ph.textContent='Planung wird geladen …';
    fetch('plan.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json();})
      .then(d=>{inst=create(d,api);docStyle();show();})
      .catch(e=>{ph.innerHTML='<div class="card empty"><h3>Planung nicht verfügbar</h3><p>plan.json konnte nicht geladen werden ('+String(e.message)+'). Bei fehlender Verbindung die App einmal online öffnen.</p></div>';});
  }
};
})();
