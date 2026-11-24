/* ================= DUELS (1-tegen-1: Sprint en Kasteelstrijd) ================= */
const DOND = RKDUEL.DUEL_ONDERWERPEN;
const ondLijst = o => RKDUEL.duelKeuze(o).map(id => DOND.find(x => x.id === id));
const ondNaam = o => { const l = ondLijst(o); return l.length ? l.map(x => x.naam).join(', ') : String(o); };
const ondChips = o => `<span class="ondchips">${ondLijst(o).map(x => `<span class="ondchip">${esc(x.naam)}</span>`).join('')}</span>`;
const MODI = { sprint: { ic: '⏱️', naam: 'Sprint', oms: '3 minuten: wie de meeste sommen goed heeft, wint.' }, kasteel: { ic: '🏰', naam: 'Kasteelstrijd', oms: 'Elk goed antwoord beschiet het kasteel van de ander. Wie het eerst het andere kasteel verwoest, wint.' } };
const DU = { poll: null, tik: null, code: null, s: null, keuze: { ond: ['afr', 'groot'], mode: 'sprint' }, vraagIdx: -1, bezig: false, vorigeHpTegen: 100, vorigeHpIk: 100 };
const vandaag = () => new Date().toISOString().slice(0, 10);
function duelState() { if (!st.duel) st.duel = { gespeeld: 0, gewonnen: 0, gewonnenTelt: 0, besteSprint: 0, verwoest: 0, onneembaar: 0, dag: {}, verwerkt: {}, ond: {} }; return st.duel; }
BADGES.push(
  ['duellist', '🤺', 'Duellist', 'Je eerste duel gewonnen', s => !!s.duel && s.duel.gewonnenTelt >= 1],
  ['sprintkampioen', '⏱️', 'Sprintkampioen', '15 of meer goed in één sprint', s => !!s.duel && s.duel.besteSprint >= 15],
  ['kasteelbreker', '💥', 'Kasteelbreker', 'Een kasteel volledig verwoest', s => !!s.duel && s.duel.verwoest >= 1],
  ['onneembaar', '🏯', 'Onneembaar', 'Een kasteelstrijd gewonnen met 50+ levenspunten over', s => !!s.duel && s.duel.onneembaar >= 1],
  ['duelkoning', '👑', 'Duelkoning', '10 duels gewonnen', s => !!s.duel && s.duel.gewonnenTelt >= 10]
);
function stopDuel() { clearInterval(DU.poll); clearInterval(DU.tik); DU.poll = null; DU.tik = null; }

/* ---------- arena ---------- */
async function schermDuel(melding) {
  stopDuel(); ui.scherm = 'duel'; duelState();
  app().innerHTML = kop() + `<main class="wrap"><div class="terugrij"><button class="knop licht klein" data-act="home">← Terug</button><h2>🤺 Duelarena</h2></div>
    ${melding ? `<div class="melding fout">${esc(melding)}</div>` : ''}<div id="duelInhoud"><div class="kaart">Laden…</div></div></main>`;
  zetOpslag(saveState);
  await laadDuelLijst(true);
  DU.poll = setInterval(() => laadDuelLijst(false), 3000);
}
async function laadDuelLijst(eerste) {
  if (ui.scherm !== 'duel') return stopDuel();
  let L; try { L = await API.call('rk_duel_lijst', { p_lln: S.lln, p_pin: S.pin }); } catch (e) { if (eerste) $('#duelInhoud').innerHTML = '<div class="melding fout">Geen verbinding met de server.</div>'; return; }
  if (ui.scherm !== 'duel') return;
  if (!L.ok) return schermLogin(L.msg);
  if (L.mijn) { stopDuel(); return openDuel(L.mijn); }
  const D2 = duelState(); const k = DU.keuze;
  const lijstHTML = L.open.length ? `<ul class="duellijst">${L.open.map(o => `<li><span class="dl-ic">${MODI[o.mode].ic}</span><span class="dl-tekst"><b>${esc(o.naam)}</b><small>${MODI[o.mode].naam}</small>${ondChips(o.onderwerp)}</span><button class="knop accent klein" data-act="duel-join" data-code="${o.code}">Accepteer</button></li>`).join('')}</ul>`
    : '<p style="color:var(--zacht)">Er staan nu geen uitdagingen open. Maak er zelf een!</p>';
  const el = $('#duelInhoud');
  const geblokt = L.blok_ms > 0;
  if (!eerste && DU.geblokt !== geblokt) eerste = true;
  DU.geblokt = geblokt;
  if (geblokt) {
    DU.blokEind = Date.now() + L.blok_ms;
    if (eerste || !el.querySelector('#blokTijd')) el.innerHTML = `<div class="kaart" style="text-align:center"><div style="font-size:3rem">⛔</div><h3>Even geen duels</h3>
      <p>Je hebt 3 keer achter elkaar een duel opgegeven. Daarom kun je even geen duels maken of accepteren.</p><p>Weer beschikbaar over <b id="blokTijd">–</b></p><button class="knop" data-act="home">Naar de kaartenkamer</button></div>`;
    const r = Math.ceil(L.blok_ms / 1000); $('#blokTijd').textContent = `${Math.floor(r / 60)}:${String(r % 60).padStart(2, '0')}`;
    return;
  }
  if (!eerste && el.querySelector('#duelOpen')) { el.querySelector('#duelOpen').innerHTML = lijstHTML; return; }
  if (!L.aan) { el.innerHTML = `<div class="kaart" style="text-align:center"><div style="font-size:3rem">🔒</div><h3>Duels staan op dit moment uit</h3><p>Je docent heeft de duels uitgezet. Werk verder op je kaart!</p><button class="knop" data-act="home">Terug</button></div>`; return; }
  el.innerHTML = `
    <div class="grid2">
      <div class="kaart"><h3 style="margin-top:0">Nieuwe uitdaging</h3>
        <div class="stapkop"><span class="stapnr">1</span>Vink de stof aan die je wilt oefenen</div>
        <div id="duelOnd">${[1, 2].map(h => `<div class="ondgroep"><div class="ondgroepkop"><b>Hoofdstuk ${h} · ${h === 1 ? 'Rekenen' : 'Procenten'}</b><button type="button" class="knop klein licht" data-act="duel-alles" data-h="${h}">Alles van H${h}</button></div>
          ${DOND.filter(x => x.h === h).map(x => `<label class="ondvak"><input type="checkbox" value="${x.id}" ${k.ond.includes(x.id) ? 'checked' : ''}><span class="ondtekst"><b>${esc(x.naam)}</b> <small>§ ${x.par}</small><span class="ondvb">bijv. ${esc(x.vb)}</span></span></label>`).join('')}</div>`).join('')}</div>
        <div class="stapkop"><span class="stapnr">2</span>Kies de spelvorm</div>
        <div class="moduskeuze">${Object.entries(MODI).map(([m, x]) => `<button class="moduskaart ${k.mode === m ? 'gekozen' : ''}" data-act="duel-modus" data-m="${m}"><span class="mi">${x.ic}</span><b>${x.naam}</b><small>${x.oms}</small></button>`).join('')}</div>
        <button class="knop accent vol" data-act="duel-maak" id="duelMaakKnop" style="margin-top:12px">Uitdaging maken</button></div>
      <div class="kaart"><h3 style="margin-top:0">Open uitdagingen in ${esc(L.klas)}</h3><div id="duelOpen">${lijstHTML}</div>
        <form id="duelCodeForm" class="knoprij" style="margin-top:10px"><input id="duelCode" class="antwoord-invoer" inputmode="numeric" maxlength="4" placeholder="code" style="flex:0 1 130px;letter-spacing:.2em;text-align:center"><button class="knop" type="submit">Meedoen met code</button></form></div>
    </div>
    <div class="kaart"><h3 style="margin-top:0">Jouw duels</h3><p>Gespeeld: <b>${D2.gespeeld}</b> · Gewonnen: <b>${D2.gewonnen}</b> · Beste sprint: <b>${D2.besteSprint}</b> goed</p>
      <div class="badges">${BADGES.filter(b => ['duellist', 'sprintkampioen', 'kasteelbreker', 'onneembaar', 'duelkoning'].includes(b[0])).map(([id, ic, nm, oms]) => `<div class="badge ${st.bd[id] ? 'behaald' : ''}"><div class="ic">${ic}</div><div class="bn">${nm}</div><div class="bo">${oms}</div></div>`).join('')}</div>
      <p style="font-size:.85rem;color:var(--zacht);margin-bottom:0">Je verdient met maximaal 5 duels per dag XP. Een overwinning telt voor badges als je tegenstander minstens 3 sommen goed had.</p></div>`;
  $('#duelOnd').addEventListener('change', () => { DU.keuze.ond = [...document.querySelectorAll('#duelOnd input:checked')].map(i => i.value); duelKeuzeKnop(); });
  duelKeuzeKnop();
  $('#duelCodeForm').addEventListener('submit', e => { e.preventDefault(); const c = $('#duelCode').value.trim(); if (/^\d{4}$/.test(c)) duelJoin(c); });
}
function duelKeuzeKnop() {
  const b = $('#duelMaakKnop'); if (!b) return; const n = DU.keuze.ond.length;
  b.disabled = n === 0; b.textContent = n === 0 ? 'Vink eerst minstens één onderwerp aan' : `Uitdaging maken (${n} ${n === 1 ? 'onderwerp' : 'onderwerpen'})`;
}
async function duelMaak() {
  if (!DU.keuze.ond.length) return;
  const knop = document.querySelector('[data-act=duel-maak]'); if (knop) { knop.disabled = true; knop.textContent = 'Sommen maken…'; }
  try {
    const res = await API.fn('rk-duel-maak', { lln: S.lln, pin: S.pin, mode: DU.keuze.mode, onderwerp: DU.keuze.ond.join(',') });
    if (!res.ok) return schermDuel(res.msg);
    openDuel(res.code);
  } catch (e) { schermDuel('Het maken van de uitdaging is mislukt. Probeer het opnieuw.'); }
}
async function duelJoin(code) {
  try { const res = await API.call('rk_duel_join', { p_lln: S.lln, p_pin: S.pin, p_code: code }); if (!res.ok) return schermDuel(res.msg); openDuel(res.code); }
  catch (e) { schermDuel('Geen verbinding met de server.'); }
}

/* ---------- spel ---------- */
function openDuel(code) {
  stopDuel(); ui.scherm = 'duelspel'; DU.code = code; DU.s = null; DU.vraagIdx = -1; DU.laatste = null; DU.vorigeHpTegen = 100; DU.vorigeHpIk = 100; DU.blokTot = 0;
  app().innerHTML = `<div class="duelscherm" id="duelScherm"><div class="wrap"><div class="kaart" style="text-align:center">Laden…</div></div></div>`;
  pollDuel(); DU.poll = setInterval(pollDuel, 1000);
  DU.tik = setInterval(duelTik, 250);
}
async function pollDuel() {
  if (ui.scherm !== 'duelspel' || DU.bezig) return;
  let s; try { s = await API.call('rk_duel_state', { p_lln: S.lln, p_pin: S.pin, p_code: DU.code }); } catch (e) { return; }
  if (ui.scherm !== 'duelspel') return;
  if (!s.ok) { stopDuel(); return schermDuel(s.msg); }
  s.ontvangen = Date.now(); DU.s = s; renderDuel();
}
function renderDuel() {
  const s = DU.s; const box = $('#duelScherm'); if (!box) return;
  if (s.status === 'geannuleerd') { stopDuel(); return schermDuel('De uitdaging is geannuleerd.'); }
  if (s.status === 'open') {
    if (box.dataset.fase !== 'open') { box.dataset.fase = 'open'; box.innerHTML = `<div class="wrap"><div class="kaart" style="text-align:center"><div style="font-size:3rem">${MODI[s.mode].ic}</div><h2>${MODI[s.mode].naam}</h2><p>Deze stof wordt getest:</p>${ondChips(s.onderwerp)}
      <p>Wachten op een tegenstander… Je uitdaging staat in de lijst van je klas. Je klasgenoot kan ook deze code gebruiken:</p><div class="spelcode" style="color:var(--kl-blauw)">${s.code}</div>
      <p style="color:var(--zacht);font-size:.9rem">De uitdaging verloopt na 10 minuten.</p><button class="knop licht" data-act="duel-annuleer">Annuleren</button></div></div>`; }
    return;
  }
  if (s.status === 'klaar') return duelUitslag();
  // bezig
  if (box.dataset.fase !== 'bezig') {
    box.dataset.fase = 'bezig';
    const tegen = s.tegen ? esc(s.tegen.naam) : 'Tegenstander';
    box.innerHTML = `<div class="wrap duelwrap"><div class="duelkop"><span>${MODI[s.mode].ic} <b>${MODI[s.mode].naam}</b> · <small>${esc(ondNaam(s.onderwerp))}</small></span><span class="duelrechts"><span class="dueltimer" id="duelTimer">–</span><button class="knop klein opgeefknop" data-act="duel-opgeven">🏳️ Opgeven</button></span></div><div id="duelBanner"></div>
      ${s.mode === 'kasteel' ? `<div class="kastelen"><div class="kasteelvak" id="kIk">${kasteelSVG('ik')}<div class="knaam">Jij</div><div class="hpbalk"><div id="hpIk"></div></div><div class="kinfo" id="kInfoIk"></div></div>
          <div class="kogelbaan"><span class="kogel" id="kogel">●</span></div>
          <div class="kasteelvak" id="kTegen">${kasteelSVG('tegen')}<div class="knaam">${tegen}</div><div class="hpbalk"><div id="hpTegen"></div></div><div class="kinfo" id="kInfoTegen"></div></div></div>`
        : `<div class="sprintstand"><div class="sp-rij"><span>Jij</span><div class="spbalk"><div id="spIk" class="ik"></div></div><b id="spIkN">0</b></div><div class="sp-rij"><span>${tegen}</span><div class="spbalk"><div id="spTegen"></div></div><b id="spTegenN">0</b></div></div>`}
      <div class="kaart duelvraag" id="duelVraag"></div></div><div class="aftel verborgen" id="aftel"></div>`;
    DU.vraagIdx = -1;
  }
  duelStand();
  const ban = $('#duelBanner');
  if (ban && s.tegen && s.tegen.opgegeven && !ban.dataset.getoond) {
    ban.dataset.getoond = '1';
    ban.innerHTML = `<div class="opgeefbanner"><span class="ob-tekst">🏳️ <b>${esc(s.tegen.naam)}</b> heeft opgegeven. Jij wint dit duel. Je mag doorspelen tot de tijd om is${s.mode === 'kasteel' ? ' of het kasteel verwoest is' : ''}: elk goed antwoord levert nog XP op.</span>
      <button class="knop klein" data-act="duel-afronden">Nu afronden</button></div>`;
    const kn = document.querySelector('[data-act=duel-opgeven]'); if (kn) kn.remove();
  }
  if (s.vraag && s.me.idx !== DU.vraagIdx && !DU.toonResultaat) toonDuelVraag();
}
function kasteelSVG(wie) {
  const ik = wie === 'ik';
  return `<svg viewBox="0 0 140 120" class="kasteel ${ik ? 'k-ik' : 'k-tegen'}"><g stroke="#4a3726" stroke-width="2.5" fill="${ik ? '#e9dcbc' : '#e2d2c8'}" stroke-linejoin="round">
    <path d="M14 112V52h22v60M104 112V52h22v60" /><path d="M10 52l15-24 15 24M100 52l15-24 15 24" fill="${ik ? '#12355b' : '#8a2b1d'}"/>
    <path d="M36 112V62h68v50z"/><path d="M36 62h68v-8h-8v6h-8v-6h-8v6h-8v-6h-8v6h-8v-6h-8v6h-12z"/>
    <path d="M58 112V90a12 12 0 0 1 24 0v22" fill="#4a3726"/><rect x="48" y="72" width="8" height="10"/><rect x="84" y="72" width="8" height="10"/>
    <path d="M70 54V24" fill="none"/><path d="M70 24l20 6-20 6z" fill="${ik ? '#f4a300' : '#c8412d'}"/></g></svg>`;
}
function duelStand() {
  const s = DU.s; if (!s || !s.me) return; const t = s.tegen || { goed: 0, hp: 100, schild: 0 };
  if (s.mode === 'kasteel') {
    const hi = $('#hpIk'), ht = $('#hpTegen'); if (!hi) return;
    hi.style.width = s.me.hp + '%'; ht.style.width = t.hp + '%';
    $('#kInfoIk').innerHTML = `${s.me.hp} ❤ ${s.me.schild ? '· 🛡️' : ''} ${s.me.reeks >= 2 ? `· 🔥 ${s.me.reeks}` : ''}`;
    $('#kInfoTegen').innerHTML = `${t.hp} ❤ ${t.schild ? '· 🛡️' : ''}`;
    if (t.hp < DU.vorigeHpTegen) schot('tegen'); if (s.me.hp < DU.vorigeHpIk) schot('ik');
    DU.vorigeHpTegen = t.hp; DU.vorigeHpIk = s.me.hp;
  } else {
    const max = Math.max(10, s.me.goed, t.goed) + 2; const a = $('#spIk'); if (!a) return;
    a.style.width = (100 * s.me.goed / max) + '%'; $('#spTegen').style.width = (100 * t.goed / max) + '%'; $('#spIkN').textContent = s.me.goed; $('#spTegenN').textContent = t.goed;
  }
}
function schot(doel) {
  const k = $('#kogel'); const v = doel === 'tegen' ? $('#kTegen') : $('#kIk'); if (!k || !v) return;
  k.className = 'kogel vlieg-' + (doel === 'tegen' ? 'r' : 'l'); void k.offsetWidth;
  setTimeout(() => { v.classList.remove('geraakt'); void v.offsetWidth; v.classList.add('geraakt'); k.className = 'kogel'; }, 550);
}
function toonDuelVraag() {
  const s = DU.s; const q = s.vraag; DU.vraagIdx = s.me.idx; const el = $('#duelVraag'); if (!el) return;
  el.innerHTML = `<div class="vraaglabel">SOM ${s.me.idx + 1}</div><div class="vraagtekst">${q.tekst}</div>
    <div class="invoerrij"><div class="invoer-wrap"><input id="duelAnt" class="antwoord-invoer" type="text" inputmode="decimal" autocomplete="off" placeholder="jouw antwoord" enterkeyhint="send"><button class="teken" data-act="duel-teken">±</button></div>${q.unit ? `<span class="eenheid-vast">${esc(q.unit)}</span>` : ''}</div>
    <div class="knoprij"><button class="knop accent" data-act="duel-verstuur">${s.mode === 'kasteel' ? '💥 Vuur!' : 'Verstuur'}</button><button class="knop licht" data-act="duel-skip">Overslaan</button></div><div id="duelFb"></div>`;
  const i = $('#duelAnt'); if (i && !('ontouchstart' in window)) i.focus();
}
async function duelVerstuur(skip) {
  const s = DU.s; if (!s || DU.bezig || Date.now() < DU.blokTot) return;
  let waarde = null;
  if (!skip) { const [x] = E.parseNum(($('#duelAnt') || {}).value); if (isNaN(x)) { $('#duelFb').innerHTML = '<div class="melding fout">Typ een getal.</div>'; return; } waarde = x; }
  DU.bezig = true;
  let res; try { res = await API.call('rk_duel_antwoord', { p_lln: S.lln, p_pin: S.pin, p_code: DU.code, p_idx: s.me.idx, p_waarde: waarde, p_skip: !!skip }); } catch (e) { DU.bezig = false; $('#duelFb').innerHTML = '<div class="melding fout">Versturen mislukt, probeer opnieuw.</div>'; return; }
  DU.bezig = false;
  if (!res.ok) { if (res.klaar) return pollDuel(); $('#duelFb').innerHTML = `<div class="melding fout">${esc(res.msg)}</div>`; return pollDuel(); }
  const o = ondKey(s.onderwerp); const d = duelState(); d.ond[o] = d.ond[o] || { goed: 0, fout: 0 }; if (res.correct) d.ond[o].goed++; else if (!skip) d.ond[o].fout++;
  if (res.correct) {
    DU.toonResultaat = true;
    $('#duelFb').innerHTML = `<div class="feedback goed"><b>✓ Goed!</b>${s.mode === 'kasteel' ? (res.geblokt ? ' 🛡️ Het schild van je tegenstander hield de kogel tegen.' : ` 💥 ${res.dmg} schade${res.dmg >= 20 ? ' (voltreffer!)' : ''}`) : ''}</div>`;
    setTimeout(() => { DU.toonResultaat = false; pollDuel(); }, 650);
  } else {
    DU.blokTot = Date.now() + res.blok_ms; DU.toonResultaat = true;
    $('#duelFb').innerHTML = `<div class="feedback ${skip ? 'bijna' : 'fout'}"><b>${skip ? 'Overgeslagen.' : '✗ Helaas.'}</b> Antwoord: <b>${esc(res.antwoordTekst)}</b><div class="blokbalk"><div style="animation-duration:${res.blok_ms}ms"></div></div><small>${s.mode === 'kasteel' ? '🔄 Je kanon herlaadt…' : 'Even wachten…'}</small></div>`;
    document.querySelectorAll('#duelVraag .knop').forEach(b => b.disabled = true);
    setTimeout(() => { DU.toonResultaat = false; pollDuel(); }, res.blok_ms + 50);
  }
  bewaar();
  if (res.klaar) setTimeout(pollDuel, 700);
}
const ondKey = o => o;
function duelTik() {
  const s = DU.s; if (!s || ui.scherm !== 'duelspel') return;
  const verstreken = Date.now() - s.ontvangen;
  const af = $('#aftel');
  if (s.status === 'bezig' && s.tot_start_ms != null) {
    const totStart = s.tot_start_ms - verstreken;
    if (af) { if (totStart > 0) { af.classList.remove('verborgen'); af.textContent = Math.ceil(totStart / 1000); } else af.classList.add('verborgen'); }
    if (totStart <= 0 && !s.vraag && !DU.bezig) { s.tot_start_ms = 1e9; pollDuel(); }
  }
  const t = $('#duelTimer'); if (t && s.resterend_ms != null) { const rest = Math.max(0, Math.ceil((s.resterend_ms - verstreken) / 1000)); t.textContent = `${Math.floor(rest / 60)}:${String(rest % 60).padStart(2, '0')}`; t.classList.toggle('bijna-om', rest <= 15); }
}
function duelUitslag() {
  stopDuel(); const s = DU.s; const d = duelState(); const box = $('#duelScherm'); const t = s.tegen || { goed: 0, hp: 0, naam: '?' };
  let beloning = '';
  if (!d.verwerkt[s.code]) {
    d.verwerkt[s.code] = 1; d.gespeeld++;
    const dag = vandaag(); d.dag = { [dag]: (d.dag[dag] || 0) + 1 };
    const gewonnen = s.uitslag === 'gewonnen';
    if (gewonnen) { d.gewonnen++; if (s.telt) d.gewonnenTelt++; }
    if (s.mode === 'sprint') d.besteSprint = Math.max(d.besteSprint, s.me.goed);
    if (gewonnen && s.telt && s.mode === 'kasteel') { if (t.hp === 0) d.verwoest++; if (s.me.hp >= 50) d.onneembaar++; }
    if (d.dag[dag] <= 5) { const xp = s.me.goed * 2 + (gewonnen ? 15 : s.uitslag === 'gelijk' ? 5 : 0); geefXP(xp, 'duel'); beloning = `+${xp} XP`; }
    else beloning = 'Je hebt vandaag al 5 duels gespeeld: dit duel levert geen XP meer op (badges wel).';
    checkBadges(); bewaar();
  }
  const kop = { gewonnen: '🏆 Gewonnen!', verloren: '😤 Verloren…', gelijk: '🤝 Gelijkspel' }[s.uitslag];
  box.dataset.fase = 'klaar';
  box.innerHTML = `<div class="wrap"><div class="kaart" style="text-align:center"><div style="font-size:3.5rem">${s.uitslag === 'gewonnen' ? '🏆' : s.uitslag === 'gelijk' ? '🤝' : '🛡️'}</div><h2>${kop}</h2>
    <p>${MODI[s.mode].naam} · ${esc(ondNaam(s.onderwerp))}</p>
    <div class="vs" style="color:var(--tekst)"><div style="background:#eef3fa"><div>Jij</div><div class="sc" style="color:var(--kl-blauw)">${s.mode === 'kasteel' ? s.me.hp + ' ❤' : s.me.goed}</div><small>${s.me.goed} goed · ${s.me.fout} fout</small></div>
      <div style="background:#f6eeee"><div>${esc(t.naam)}</div><div class="sc" style="color:#8a2b1d">${s.mode === 'kasteel' ? t.hp + ' ❤' : t.goed}</div><small>${t.goed} goed · ${t.fout} fout</small></div></div>
    ${t.opgegeven ? `<p>🏳️ ${esc(t.naam)} heeft opgegeven.</p>` : ''}
    ${beloning ? `<p style="margin-top:14px"><b>${beloning}</b></p>` : ''}${s.uitslag === 'gewonnen' && !s.telt ? '<p style="font-size:.85rem;color:var(--zacht)">Deze overwinning telt niet voor badges: je tegenstander had minder dan 3 sommen goed.</p>' : ''}
    <div class="knoprij" style="justify-content:center;margin-top:12px"><button class="knop accent" data-act="duel-arena">Nieuw duel</button><button class="knop licht" data-act="home">Naar de kaartenkamer</button></div></div></div>`;
}
Object.assign(ACT, {
  'duel-arena': () => schermDuel(),
  'duel-alles': el => { const h = +el.dataset.h; const ids = DOND.filter(x => x.h === h).map(x => x.id); const alleAan = ids.every(i => DU.keuze.ond.includes(i));
    DU.keuze.ond = alleAan ? DU.keuze.ond.filter(i => !ids.includes(i)) : [...new Set(DU.keuze.ond.concat(ids))];
    document.querySelectorAll('#duelOnd input').forEach(i => { i.checked = DU.keuze.ond.includes(i.value); }); duelKeuzeKnop(); },
  'duel-modus': el => { DU.keuze.mode = el.dataset.m; document.querySelectorAll('.moduskaart').forEach(b => b.classList.toggle('gekozen', b.dataset.m === DU.keuze.mode)); },
  'duel-maak': () => duelMaak(),
  'duel-join': el => duelJoin(el.dataset.code),
  'duel-annuleer': async () => { try { await API.call('rk_duel_annuleer', { p_lln: S.lln, p_pin: S.pin, p_code: DU.code }); } catch (e) { /* */ } stopDuel(); schermDuel(); },
  'duel-opgeven': () => {
    const s = DU.s; if (!s || s.status !== 'bezig') return;
    const r = (s.me.opgeef_reeks || 0) + 1;
    modal(`<h3 style="margin-top:0">🏳️ Duel opgeven?</h3>
      <ul style="padding-left:1.2em;line-height:1.5"><li>Je krijgt <b>geen XP</b> voor dit duel en het telt als verloren.</li>
      <li>Je tegenstander mag doorspelen en wint het duel.</li>
      <li>Geef je <b>3 keer achter elkaar</b> op, dan kun je <b>5 minuten</b> geen duels spelen.${r >= 3 ? ' <b style="color:#c8412d">Dit is je 3e keer op rij: na opgeven ben je 5 minuten geblokkeerd.</b>' : r === 2 ? ' Dit zou je 2e keer op rij zijn.' : ''}</li></ul>
      <div class="knoprij" style="justify-content:flex-end"><button class="knop licht" data-act="sluit-modal">Doorspelen</button><button class="knop rood" data-act="duel-opgeven-ok">Opgeven</button></div>`);
  },
  'duel-opgeven-ok': async () => {
    sluitModal(); const s = DU.s; let res;
    try { res = await API.call('rk_duel_opgeven', { p_lln: S.lln, p_pin: S.pin, p_code: DU.code }); } catch (e) { toast('Opgeven mislukt: geen verbinding.'); return; }
    stopDuel();
    if (res.ok && !res.afgerond) { const d = duelState(); if (!d.verwerkt[s.code]) { d.verwerkt[s.code] = 1; d.gespeeld++; d.opgegeven = (d.opgegeven || 0) + 1; bewaar(); } }
    ui.cur = null; ui.node = null; schermHome();
    toast(res.ok && res.blok_ms ? '⛔ Je hebt 3 keer achter elkaar opgegeven: 5 minuten geen duels.' : '🏳️ Je hebt het duel opgegeven. Geen XP voor dit duel.');
  },
  'duel-afronden': async () => { try { await API.call('rk_duel_opgeven', { p_lln: S.lln, p_pin: S.pin, p_code: DU.code }); } catch (e) { /* */ } pollDuel(); },
  'sluit-modal': () => sluitModal(),
  'duel-verstuur': () => duelVerstuur(false),
  'duel-skip': () => duelVerstuur(true),
  'duel-teken': () => { const i = $('#duelAnt'); if (i) i.value = i.value.trim().startsWith('-') ? i.value.trim().slice(1) : '-' + i.value.trim(); }
});
document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'duelAnt') { e.preventDefault(); duelVerstuur(false); } });
