/* ================= KAART (Slay-the-Spire-achtige tocht per hoofdstuk) =================
   Wordt door build.py binnen de app-IIFE ingevoegd en heeft dus toegang tot st, ui, ACT, enz. */

/* ---------- kaartdefinities (vast, voor de hele klas gelijk) ----------
   t: opd | elite | event | schat | rust | winkel | boss ;  ref: opdrachtnummer of eventsoort ;  r: rij ; x: 0..1 ; to: volgende vakjes */
const KAARTEN = {
  h1: {
    titel: 'Hoofdstuk 1 · Rekenen', sub: 'Van afronden tot lichtjaren', banden: [[0, 3, '1.1'], [4, 7, '1.2']],
    boss: { naam: 'De Afrondingsdraak', rondes: [['1.11', '1.12'], ['1.13'], ['1.14']], par: '1.3' },
    nodes: [
      { id: 'a', t: 'opd', ref: '1.1', r: 0, x: .3, to: ['c', 'd'] }, { id: 'b', t: 'opd', ref: '1.3', r: 0, x: .7, to: ['d', 'e'] },
      { id: 'c', t: 'opd', ref: '1.2', r: 1, x: .12, to: ['f'] }, { id: 'd', t: 'event', ref: 'krant', r: 1, x: .5, to: ['f', 'g'] }, { id: 'e', t: 'opd', ref: '1.4', r: 1, x: .88, to: ['g'] },
      { id: 'f', t: 'schat', r: 2, x: .3, to: ['h', 'i'] }, { id: 'g', t: 'opd', ref: '1.5', r: 2, x: .7, to: ['i', 'j'] },
      { id: 'h', t: 'rust', r: 3, x: .15, to: ['k'] }, { id: 'i', t: 'winkel', r: 3, x: .5, to: ['k', 'l'] }, { id: 'j', t: 'event', ref: 'gok', r: 3, x: .85, to: ['l', 'm'] },
      { id: 'k', t: 'opd', ref: '1.6', r: 4, x: .2, to: ['n'] }, { id: 'l', t: 'event', ref: 'snel', r: 4, x: .5, to: ['n', 'o'] }, { id: 'm', t: 'opd', ref: '1.8', r: 4, x: .82, to: ['o'] },
      { id: 'n', t: 'elite', ref: '1.7', r: 5, x: .3, to: ['p', 'q'] }, { id: 'o', t: 'opd', ref: '1.9', r: 5, x: .7, to: ['q', 's'] },
      { id: 'p', t: 'schat', r: 6, x: .12, to: ['u'] }, { id: 'q', t: 'elite', ref: '1.10', r: 6, x: .5, to: ['u', 'v'] }, { id: 's', t: 'event', ref: 'krant', r: 6, x: .88, to: ['v'] },
      { id: 'u', t: 'rust', r: 7, x: .32, to: ['boss'] }, { id: 'v', t: 'winkel', r: 7, x: .68, to: ['boss'] },
      { id: 'boss', t: 'boss', r: 8, x: .5, to: [] }
    ],
    landmarks: [['school', 'l', .06], ['duinen', 'r', .1], ['molen', 'l', .36], ['vuurtoren', 'r', .45], ['kerk', 'l', .7], ['poort', 'r', .8]]
  },
  h2: {
    titel: 'Hoofdstuk 2 · Procenten', sub: 'Van btw tot truffels', banden: [[0, 3, '2.1'], [4, 8, '2.2'], [9, 10, '2.3'], [11, 12, '2.4']],
    boss: { naam: 'De Procentenhydra', rondes: [['2.19'], ['2.21', '2.22'], ['2.24', '2.29']], par: '2.4' },
    nodes: [
      { id: 'a', t: 'opd', ref: '2.1', r: 0, x: .3, to: ['c', 'd'] }, { id: 'b', t: 'opd', ref: '2.2', r: 0, x: .7, to: ['d', 'e'] },
      { id: 'c', t: 'opd', ref: '2.3', r: 1, x: .12, to: ['f'] }, { id: 'd', t: 'event', ref: 'krant', r: 1, x: .5, to: ['f', 'g'] }, { id: 'e', t: 'opd', ref: '2.4', r: 1, x: .88, to: ['g'] },
      { id: 'f', t: 'opd', ref: '2.5', r: 2, x: .3, to: ['h', 'i'] }, { id: 'g', t: 'schat', r: 2, x: .7, to: ['i', 'j'] },
      { id: 'h', t: 'rust', r: 3, x: .15, to: ['k'] }, { id: 'i', t: 'opd', ref: '2.6', r: 3, x: .5, to: ['k', 'l'] }, { id: 'j', t: 'event', ref: 'gok', r: 3, x: .85, to: ['l', 'm'] },
      { id: 'k', t: 'opd', ref: '2.7', r: 4, x: .15, to: ['n'] }, { id: 'l', t: 'opd', ref: '2.8', r: 4, x: .5, to: ['n', 'o'] }, { id: 'm', t: 'winkel', r: 4, x: .85, to: ['o'] },
      { id: 'n', t: 'opd', ref: '2.9', r: 5, x: .3, to: ['p', 'q'] }, { id: 'o', t: 'elite', ref: '2.11', r: 5, x: .7, to: ['q', 's'] },
      { id: 'p', t: 'opd', ref: '2.10', r: 6, x: .15, to: ['u'] }, { id: 'q', t: 'event', ref: 'snel', r: 6, x: .5, to: ['u', 'v'] }, { id: 's', t: 'opd', ref: '2.12', r: 6, x: .85, to: ['v'] },
      { id: 'u', t: 'opd', ref: '2.13', r: 7, x: .3, to: ['w', 'y'] }, { id: 'v', t: 'elite', ref: '2.14', r: 7, x: .7, to: ['y', 'z'] },
      { id: 'w', t: 'rust', r: 8, x: .15, to: ['a2'] }, { id: 'y', t: 'opd', ref: '2.15', r: 8, x: .5, to: ['a2', 'b2'] }, { id: 'z', t: 'schat', r: 8, x: .85, to: ['b2', 'c2'] },
      { id: 'a2', t: 'opd', ref: '2.16', r: 9, x: .15, to: ['d2'] }, { id: 'b2', t: 'opd', ref: '2.17', r: 9, x: .5, to: ['d2', 'e2'] }, { id: 'c2', t: 'event', ref: 'krant', r: 9, x: .85, to: ['e2'] },
      { id: 'd2', t: 'opd', ref: '2.18', r: 10, x: .3, to: ['f2', 'g2'] }, { id: 'e2', t: 'elite', ref: '2.23', r: 10, x: .7, to: ['g2', 'h2'] },
      { id: 'f2', t: 'elite', ref: '2.26', r: 11, x: .15, to: ['i2', 'j2'] }, { id: 'g2', t: 'winkel', r: 11, x: .5, to: ['j2', 'k2'] }, { id: 'h2', t: 'elite', ref: '2.27', r: 11, x: .85, to: ['k2'] },
      { id: 'i2', t: 'rust', r: 12, x: .15, to: ['boss'] }, { id: 'j2', t: 'elite', ref: '2.28', r: 12, x: .5, to: ['boss'] }, { id: 'k2', t: 'elite', ref: '2.25', r: 12, x: .85, to: ['boss'] },
      { id: 'boss', t: 'boss', r: 13, x: .5, to: [] }
    ],
    landmarks: [['school', 'l', .04], ['duinen', 'r', .08], ['vuurtoren', 'l', .25], ['molen', 'r', .3], ['teylers', 'l', .5], ['poort', 'r', .56], ['kerk', 'l', .78], ['school2', 'r', .86]]
  }
};
const VT = { // vakjestypes
  opd: { ic: '⚔️', naam: 'Opdracht', kleur: '#6b4a2b' },
  elite: { ic: '💀', naam: 'Elite', kleur: '#8a2b1d' },
  event: { ic: '❓', naam: 'Onbekend', kleur: '#6b4a2b' },
  schat: { ic: '🧰', naam: 'Schatkist', kleur: '#6b4a2b' },
  rust: { ic: '🔥', naam: 'Rustplaats', kleur: '#8a4b12' },
  winkel: { ic: '🛒', naam: 'Winkel', kleur: '#2f5d3a' },
  boss: { ic: '🐉', naam: 'Eindbaas', kleur: '#7a1414' }
};
const BOONS = {
  sprong: { ic: '🦘', naam: 'Sprong', oms: 'Sla een vakje over (niet de eindbaas). Tik op de kaart op een vakje en kies "Overslaan".', prijs: 40 },
  schild: { ic: '🛡️', naam: 'Schild', oms: 'Vangt automatisch je volgende foute antwoord op: je verliest geen hart.', prijs: 25 },
  lampje: { ic: '💡', naam: 'Lampje', oms: 'Wordt gebruikt als je op Hint tikt: een gratis hint zonder XP-aftrek.', prijs: 15 },
  klaver: { ic: '🍀', naam: 'Klavertje', oms: 'Dubbele munten bij het volgende opdracht- of elitevakje dat je betreedt.', prijs: 30 }
};
const MAXHP = 5, MAXBOONS = 3;
const KRANT = {
  h1: [
    { tekst: 'Jesse staat gemiddeld een 6,45. Hij roept: "Afgerond is dat een 7, want 6,45 wordt 6,5 en dat wordt 7!" De school rondt af op hele cijfers.', ok: false, uitleg: 'Je rondt maar één keer af en kijkt naar het eerste cijfer achter de komma: een 4. Het wordt dus een 6. Twee keer afronden mag niet.' },
    { tekst: 'Een krant schrijft: "Het bbp van Nederland is ongeveer € 1.030 miljard, dat is ruim 10 biljoen euro."', ok: false, uitleg: '€ 1.030 miljard = € 1,03 biljoen. Een biljoen is duizend miljard, dus het is ruim 1 biljoen euro, geen 10 biljoen.' },
    { tekst: 'Een leerling berekent (17,3 ÷ 6) × 9.000 en rondt de deling eerst af op 2,9. Hij zegt: "Dat maakt niks uit, het antwoord blijft hetzelfde."', ok: false, uitleg: 'Met 2,9 krijg je 26.100; zonder tussentijds afronden 25.950. Tussentijds afronden geeft dus een ander antwoord.' },
    { tekst: 'Een journalist schrijft: "Een bedrag van 45.000 miljoen euro is hetzelfde als 45 miljard euro."', ok: true, uitleg: 'Klopt: duizend miljoen = één miljard, dus 45.000 miljoen = 45 miljard.' }
  ],
  h2: [
    { tekst: 'Krantenkop: "De werkloosheid steeg van 4% naar 5%, een stijging van 1%."', ok: false, uitleg: 'Het verschil is 1 procent<b>punt</b>. In procenten is het een stijging van (5 − 4) ÷ 4 × 100% = 25%.' },
    { tekst: 'Een winkel geeft eerst 20% korting en verhoogt daarna de nieuwe prijs met 20%. De verkoper zegt: "Nu is de prijs weer precies hetzelfde."', ok: false, uitleg: '0,80 × 1,20 = 0,96. De prijs is 4% lager dan eerst, omdat de basis verandert.' },
    { tekst: 'Een koptelefoon kost € 121 inclusief 21% btw. Iemand zegt: "De btw is dus € 25,41 (21% van € 121)."', ok: false, uitleg: '€ 121 is 121%. De btw is 121 ÷ 121 × 21 = € 21,00.' },
    { tekst: 'Lisa verdient 25% meer dan Tim. Dus verdient Tim 20% minder dan Lisa.', ok: true, uitleg: 'Klopt: als Tim 100 verdient, verdient Lisa 125. (100 − 125) ÷ 125 × 100% = −20%.' }
  ]
};

/* ---------- staat ---------- */
const leegKaart = () => ({ pos: null, cur: null, done: {}, hp: MAXHP, boss: false, reeks: 0, pad: [], fout: false, ronde: 0, bossHp0: true });
function mapState() {
  if (!st.m) st.m = { munten: 0, boons: [], klaver: false };
  for (const h of ['h1', 'h2']) if (!st.m[h]) st.m[h] = leegKaart();
  return st.m;
}
const kaartVan = h => KAARTEN[h];
const nodeVan = (h, id) => KAARTEN[h].nodes.find(n => n.id === id);
const opdrachtVan = nr => { for (const p of PAR) for (const o of p.opdrachten) if (o.nr === nr) return { par: p, o }; return null; };
const vragenVanOpdrachten = nrs => nrs.flatMap(nr => { const x = opdrachtVan(nr); return x ? x.o.vragen : []; });
const isKlaar = q => !!(st.q[q.id] && st.q[q.id].s);
function bandPar(h, r) { const b = KAARTEN[h].banden.find(([a, z]) => r >= a && r <= z); return b ? b[2] : KAARTEN[h].boss.par; }
function bereikbaar(h) {
  const M = mapState()[h]; const K = KAARTEN[h];
  if (M.boss) return K.nodes.filter(n => n.t !== 'boss' && M.done[n.id] !== 'klaar').map(n => n.id);   // vrij spel
  if (M.cur) return [M.cur];
  if (!M.pos) return K.nodes.filter(n => n.r === 0).map(n => n.id);
  return nodeVan(h, M.pos).to.slice();
}
const h2Open = () => mapState().h1.boss;

/* ---------- kaarttekening (SVG) ---------- */
const INKT = '#4a3726', INKT2 = '#7a5c3c';
const LM = { // landmarks: eenvoudige inkttekeningen in een vak van 140 × 130
  school: ['Kennemer Lyceum', `<path d="M10 115h120M18 115V58h104v57M18 58l52-22 52 22" /><path d="M58 115V88h24v27M70 88v27"/>${[28, 42, 92, 106].map(x => `<rect x="${x}" y="68" width="8" height="10"/><rect x="${x}" y="92" width="8" height="10"/>`).join('')}<rect x="64" y="64" width="12" height="14"/><path d="M70 36V12"/><path d="M70 12l20 5-20 5" fill="${INKT2}"/><text x="70" y="54" text-anchor="middle" font-size="11" font-weight="bold" fill="${INKT}" stroke="none">KL</text>`],
  school2: ['Overveen', `<path d="M8 115h124"/><path d="M20 115V70h40v45M20 70l20-16 20 16"/><rect x="34" y="88" width="12" height="27"/><path d="M80 115V82h44v33M78 82l24-20 24 20"/><rect x="88" y="92" width="10" height="10"/><rect x="106" y="92" width="10" height="10"/><path d="M68 115c0-18 8-30 2-44M70 71c-10 6-14 14-12 22M70 76c8 4 12 10 12 18"/>`],
  molen: ['Molen De Adriaan', `<path d="M48 120l8-62h28l8 62z"/><path d="M52 58l18-16 18 16"/><path d="M36 92h68"/><path d="M64 120v-16h12v16"/><g transform="rotate(20 70 50)"><path d="M70 50V4M70 50V96M70 50H24M70 50h46"/><path d="M70 8h8v38h-8M70 92h-8V54h8M28 50v-8h38v8M112 50v8H74v-8"/></g><circle cx="70" cy="50" r="3" fill="${INKT}"/><path d="M0 122c20-4 40 2 60-2s50 2 80-2" stroke-dasharray="4 4"/>`],
  kerk: ['Sint-Bavokerk', `<path d="M4 118h132M10 118V84l30-14 30 14M70 84l30-14 30 14v34"/><path d="M10 84h120"/><path d="M58 84V44h24v40M58 44l12-10 12 10M64 34h12v-8l-6-18-6 18z"/>${[20, 34, 100, 114].map(x => `<path d="M${x} 112v-14a4 4 0 0 1 8 0v14"/>`).join('')}<path d="M65 76v-14a5 5 0 0 1 10 0v14"/>`],
  poort: ['Amsterdamse Poort', `<path d="M10 120h120"/><path d="M38 120V60h64v60"/><path d="M58 120V96a12 12 0 0 1 24 0v24"/><path d="M38 60l32-26 32 26"/><path d="M16 120V56h22M124 120V56h-22"/><path d="M12 56l15-26 15 26M98 56l15-26 15 26"/><path d="M66 34V20l4-8 4 8v14"/><rect x="48" y="70" width="8" height="10"/><rect x="84" y="70" width="8" height="10"/><path d="M0 126c25-5 45 3 70-1s45 3 70-1" stroke-dasharray="4 4"/>`],
  vuurtoren: ['Vuurtoren Zandvoort', `<path d="M58 112l4-74h16l4 74z"/><path d="M60 80h20M61 60h18"/><path d="M56 38h28M60 38V26h20v12M58 26l12-10 12 10"/><path d="M84 30l30-8M84 34l32 4M56 30l-30-8M56 34l-32 4" stroke-dasharray="3 4"/><path d="M0 116c12-6 22 6 34 0s22 6 34 0 22 6 34 0 22 6 38 0M8 126c12-6 22 6 34 0s22 6 34 0 22 6 34 0"/>`],
  duinen: ['Kennemerduinen', `<path d="M0 116c18-30 40-38 60-20 14-26 44-30 80 6"/><path d="M0 126h140"/>${[[22, 96], [30, 92], [80, 80], [88, 78], [96, 82], [116, 92]].map(([x, y]) => `<path d="M${x} ${y}l-4-14M${x} ${y}l2-15M${x} ${y}l7-12"/>`).join('')}<path d="M100 40c6-6 12-6 18 0M110 34c4-4 8-4 12 0" /><circle cx="36" cy="30" r="10"/>`],
  teylers: ['Teylers Museum', `<path d="M8 118h124M14 118V64h112v54M10 64h120l-60-30z"/>${[26, 44, 62, 80, 98, 116].map(x => `<path d="M${x} 112V70"/>`).join('')}<path d="M14 112h112"/><path d="M58 34c0-12 24-12 24 0" /><path d="M0 126c25-5 45 3 70-1s45 3 70-1" stroke-dasharray="4 4"/>`]
};
function kompas(x, y) {
  return `<g transform="translate(${x} ${y})" stroke="${INKT}" fill="none" stroke-width="1.5"><circle r="34"/><circle r="28" stroke-dasharray="2 3"/>
    <path d="M0-44L7 0 0 44-7 0z" fill="#e9d7ae"/><path d="M0-44L7 0H-7z" fill="${INKT}"/><path d="M-44 0L0 6 44 0 0-6z" fill="#e9d7ae"/>
    <text y="-48" text-anchor="middle" font-size="14" fill="${INKT}" stroke="none" font-weight="bold">N</text></g>`;
}
function kaartSVG(h, opts = {}) {
  const K = KAARTEN[h]; const M = mapState()[h]; const rows = Math.max(...K.nodes.map(n => n.r));
  const W = 800, ROWH = 108, TOP = 230, BOT = 135, H = TOP + (rows - 1) * ROWH + BOT;
  const pos = n => n.t === 'boss' ? [W / 2, 150] : [190 + n.x * 420, H - BOT - n.r * ROWH + 40];
  const ber = opts.counts ? [] : bereikbaar(h);
  const padSet = new Set(); (M.pad || []).forEach((id, i, a) => { if (i > 0) padSet.add(a[i - 1] + '>' + id); });
  let s = `<svg class="kaartsvg" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" font-family="'IM Fell English', Georgia, serif">`;
  // titel-cartouche
  s += `<g transform="translate(${W / 2} 46)"><path d="M-190-28h380l-16 28 16 28h-380l16-28z" fill="#ecdcb4" stroke="${INKT}" stroke-width="2"/>
    <text text-anchor="middle" y="-2" font-size="24" fill="${INKT}" font-weight="bold">${esc(K.titel)}</text><text text-anchor="middle" y="18" font-size="14" fill="${INKT2}" font-style="italic">${esc(K.sub)}</text></g>`;
  s += kompas(W - 70, H - 90);
  // landmarks
  for (const [type, kant, f] of K.landmarks) {
    const [label, g] = LM[type]; const y = 110 + f * (H - 260); const x = kant === 'l' ? 12 : W - 152;
    s += `<g class="landmark" transform="translate(${x} ${y})"><g stroke="${INKT2}" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".85">${g}</g>
      <text x="70" y="146" text-anchor="middle" font-size="13" fill="${INKT2}" font-style="italic">${label}</text></g>`;
  }
  // paden
  for (const n of K.nodes) for (const t of n.to) {
    const m = nodeVan(h, t); const [x1, y1] = pos(n), [x2, y2] = pos(m); const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    const r1 = 30, r2 = m.t === 'boss' ? 54 : 30; const a = [x1 + dx * r1 / L, y1 + dy * r1 / L], b = [x2 - dx * r2 / L, y2 - dy * r2 / L];
    const gelopen = padSet.has(n.id + '>' + t);
    s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${gelopen ? '#2b1d12' : INKT2}" stroke-width="${gelopen ? 4 : 3.2}" stroke-linecap="round" stroke-dasharray="${gelopen ? '0' : '0.1 10'}" opacity="${gelopen ? .9 : .75}"/>`;
  }
  // band-labels
  for (const [a, , p] of K.banden) { const y = H - BOT - a * ROWH + 40 + 74; const par = PAR.find(x => x.id === p); const tekst = `§ ${p} ${par.titel}`; const w = tekst.length * 6.6 + 24;
    s += `<g opacity=".85"><line x1="170" x2="${W / 2 - w / 2 - 6}" y1="${y - 4}" y2="${y - 4}" stroke="${INKT2}" stroke-dasharray="6 6"/><line x1="${W / 2 + w / 2 + 6}" x2="630" y1="${y - 4}" y2="${y - 4}" stroke="${INKT2}" stroke-dasharray="6 6"/>
      <rect x="${W / 2 - w / 2}" y="${y - 16}" width="${w}" height="22" rx="11" fill="#ecdcb4" stroke="${INKT2}" stroke-width="1"/><text x="${W / 2}" y="${y}" text-anchor="middle" font-size="13" fill="${INKT}" font-style="italic">${esc(tekst)}</text></g>`; }
  // vakjes
  for (const n of K.nodes) {
    const [x, y] = pos(n); const v = VT[n.t]; const d = M.done[n.id]; const kan = ber.includes(n.id); const R = n.t === 'boss' ? 50 : 28;
    const vervaagd = !opts.counts && !d && !kan && !M.boss && (M.pos && n.r <= (nodeVan(h, M.pos) || { r: -1 }).r);
    s += `<g class="vakje ${kan ? 'kan' : ''}" ${kan ? `data-act="vakje" data-id="${n.id}" role="button" aria-label="${v.naam}${n.ref && n.t !== 'event' ? ' ' + n.ref : ''}"` : ''} opacity="${vervaagd ? .45 : 1}">`;
    if (kan) s += `<circle cx="${x}" cy="${y}" r="${R + 10}" class="puls" fill="none" stroke="#b5832a" stroke-width="3"/>`;
    s += `<circle cx="${x}" cy="${y}" r="${R + 14}" fill="transparent"/>`;
    s += `<circle cx="${x}" cy="${y}" r="${R}" fill="${n.t === 'boss' ? '#e6cfa0' : '#efe1bd'}" stroke="${v.kleur}" stroke-width="${n.t === 'elite' || n.t === 'boss' ? 3.5 : 2.5}"/>`;
    s += `<text x="${x}" y="${y + (n.t === 'boss' ? 16 : 9)}" text-anchor="middle" font-size="${n.t === 'boss' ? 48 : 26}" class="ic">${v.ic}</text>`;
    if ((n.t === 'opd' || n.t === 'elite') && n.ref) s += `<text x="${x}" y="${y + R + 15}" text-anchor="middle" font-size="12.5" fill="${INKT}" font-weight="bold">${n.ref}</text>`;
    if (n.t === 'boss') s += `<text x="${x}" y="${y + R + 20}" text-anchor="middle" font-size="16" fill="#7a1414" font-weight="bold">${esc(K.boss.naam)}</text>`;
    if (d === 'klaar') s += `<ellipse cx="${x + 1}" cy="${y}" rx="${R + 9}" ry="${R + 6}" transform="rotate(-10 ${x} ${y})" fill="none" stroke="#2b1d12" stroke-width="3.2"/>`;
    if (d === 'sprong') s += `<ellipse cx="${x}" cy="${y}" rx="${R + 9}" ry="${R + 6}" fill="none" stroke="#2b1d12" stroke-width="2.4" stroke-dasharray="5 5"/><text x="${x + R + 6}" y="${y - R + 4}" font-size="18">🦘</text>`;
    if (!opts.counts && (M.cur === n.id || (!M.cur && M.pos === n.id && !M.boss))) s += `<text x="${x + R - 4}" y="${y - R + 8}" font-size="26" fill="#b3261e" font-weight="bold" class="kruis">✕</text>`;
    if (opts.counts && opts.counts[n.id]) s += `<g><circle cx="${x + R}" cy="${y - R}" r="13" fill="#12355b"/><text x="${x + R}" y="${y - R + 5}" text-anchor="middle" font-size="13" fill="#fff" font-family="Arial" font-weight="bold">${opts.counts[n.id]}</text></g>`;
    s += `</g>`;
  }
  return s + `</svg>`;
}

/* ---------- HUD ---------- */
function hudHTML(h) {
  const m = mapState(); const M = m[h];
  const harten = Array.from({ length: MAXHP }, (_, i) => `<span class="hart ${i < M.hp ? '' : 'leeg'}">${i < M.hp ? '❤️' : '🤍'}</span>`).join('');
  const boons = Array.from({ length: MAXBOONS }, (_, i) => { const b = m.boons[i]; return b ? `<button class="boon" data-act="boon-info" data-b="${b}" title="${BOONS[b].naam}">${BOONS[b].ic}</button>` : `<span class="boon leeg"></span>`; }).join('');
  return `<header class="hud"><button class="knop-kop" data-act="home" aria-label="Kaartenkamer">⟵</button>
    <div class="hud-titel">${esc(KAARTEN[h].titel)}</div><div class="ruimte"></div>
    <div class="hud-harten" aria-label="${M.hp} harten">${harten}</div>
    <div class="hud-munten">🪙 ${m.munten}</div>
    <div class="hud-boons">${boons}${m.klaver ? '<span class="klaver-actief" title="Klavertje actief">🍀</span>' : ''}</div>
    <button class="knop-kop" data-act="kaart-theorie" data-h="${h}">📖</button><button class="knop-kop" data-act="legenda">?</button>
    <span class="opslag" id="opslag"></span></header>`;
}

/* ---------- legenda in de zijkant ---------- */
const LEGENDA = [
  ['opd', 'Opdracht uit het boekje'], ['elite', 'Pittige opdracht: dubbele munten + blessing'], ['event', 'Verrassing: krantenbericht, snelle som of gok'],
  ['schat', 'Eén som maken, dan een blessing kiezen'], ['rust', 'Harten terug of oefenen voor een blessing'], ['winkel', 'Blessings en harten kopen'], ['boss', 'De zelftest: niet over te slaan']
];
function legendaDicht() { try { const v = localStorage.getItem('rk_legenda'); return v === null ? window.innerWidth < 700 : v === 'dicht'; } catch (e) { return false; } }
function legendaPaneel() {
  const dicht = legendaDicht();
  return `<aside class="legenda-paneel ${dicht ? 'dicht' : ''}" id="legendaPaneel">
    <button class="legenda-kop" data-act="legenda-toggle" aria-expanded="${!dicht}"><span>📜 Legenda</span><span class="pijl">${dicht ? '◂' : '▾'}</span></button>
    <div class="legenda-inhoud">
      <p class="legenda-tip">Tik op een vakje met een <b>gouden ring</b>: daar kun je nu heen.</p>
      <ul>${LEGENDA.map(([t, oms]) => `<li><span class="lg-ic" style="border-color:${VT[t].kleur}">${VT[t].ic}</span><span><b>${VT[t].naam}</b><small>${oms}</small></span></li>`).join('')}</ul>
      <ul class="lg-tekens">
        <li><span class="lg-ic lg-ring"></span><span>Hier kun je heen</span></li>
        <li><span class="lg-teken" style="color:#b3261e;font-weight:bold">✕</span><span>Jouw plek</span></li>
        <li><span class="lg-ic lg-klaar"></span><span>Voltooid</span></li>
        <li><span class="lg-teken">🦘</span><span>Overgeslagen</span></li>
      </ul>
      <button class="link lg-meer" data-act="legenda">Meer uitleg over blessings</button>
    </div></aside>`;
}

/* ---------- schermen ---------- */
function openKaart(h, scrollNaarPos = true) {
  mapState(); ui.scherm = 'kaart'; ui.h = h; ui.node = null; ui.cur = null;
  const M = st.m[h];
  app().innerHTML = `<div class="kaartscherm">${hudHTML(h)}<div class="kaartrol" id="kaartrol"><div class="kaartlayout"><div class="kaartkolom"><div class="perkament">${kaartSVG(h)}</div>
    ${M.boss ? `<div class="vrijspel">🏆 Eindbaas verslagen! <b>Vrij spel</b>: je mag alle overige vakjes nog bezoeken voor extra XP.</div>` : ''}</div>${legendaPaneel()}</div></div></div>`;
  zetOpslag(saveState);
  if (scrollNaarPos) requestAnimationFrame(() => {
    const rol = $('#kaartrol'); const doel = document.querySelector('.vakje.kan') || document.querySelector('.kruis');
    if (rol && doel) { const r = doel.getBoundingClientRect(); rol.scrollTop += r.top - rol.getBoundingClientRect().top - rol.clientHeight * 0.55; }
    else if (rol) rol.scrollTop = rol.scrollHeight;
  });
}
function kiesVakje(id) {
  const h = ui.h; const m = mapState(); const M = m[h]; const n = nodeVan(h, id);
  if (!bereikbaar(h).includes(id)) return;
  if (M.cur === id) return betreed(id);
  const v = VT[n.t];
  const titel = n.t === 'opd' || n.t === 'elite' ? `${v.ic} ${v.naam} · opdracht ${n.ref}` : n.t === 'boss' ? `🐉 ${esc(KAARTEN[h].boss.naam)}` : `${v.ic} ${v.naam}`;
  const uitleg = { opd: 'Maak de opdracht uit het boekje. Elk fout antwoord kost een hart.', elite: 'Een pittige opdracht. Lukt het? Dan krijg je dubbele munten en een blessing naar keuze.', event: 'Wat hier gebeurt, zie je pas als je het vakje betreedt…', schat: 'Open de kist met de juiste sleutel (één som) en kies een blessing.', rust: 'Rust uit (+2 harten) of oefen voor een blessing.', winkel: 'Koop blessings of een hart met je munten.', boss: 'De zelftest in drie rondes. Je kunt de eindbaas niet overslaan.' }[n.t];
  const magSpringen = m.boons.includes('sprong') && n.t !== 'boss' && !M.boss;
  modal(`<div class="perkament-modal"><h2>${titel}</h2><p>${uitleg}</p>${!M.boss && M.pos ? '<p style="font-size:.88rem;color:#6b4a2b">Let op: je kunt daarna niet meer terug naar de andere paden.</p>' : ''}
    <div class="knoprij"><button class="knop accent" data-act="betreed" data-id="${id}">Betreden</button>${magSpringen ? `<button class="knop licht" data-act="spring" data-id="${id}">🦘 Overslaan met Sprong</button>` : ''}<button class="knop licht" data-act="sluit">Annuleren</button></div></div>`);
}
function betreed(id) {
  sluitModal(); const h = ui.h; const m = mapState(); const M = m[h]; const n = nodeVan(h, id);
  if (!M.boss && M.cur !== id) { M.cur = id; M.fout = false; if (!M.pad.includes(id)) M.pad.push(id); if ((n.t === 'opd' || n.t === 'elite' || n.t === 'boss') && m.klaver) { m.klaver = false; M.klaverHier = id; } bewaar(); }
  if (M.boss && M.cur !== id) { M.cur = id; M.fout = false; bewaar(); }
  ui.node = { h, id, t: n.t }; ui.cur = null; ui.ev = null;
  if (n.t === 'opd' || n.t === 'elite') return renderOpdrachtVakje();
  if (n.t === 'boss') return renderBoss();
  if (n.t === 'event') return startEvent(n);
  if (n.t === 'schat') return startSchat();
  if (n.t === 'rust') return renderRust();
  if (n.t === 'winkel') return renderWinkel();
}
function spring(id) {
  sluitModal(); const h = ui.h; const m = mapState(); const M = m[h];
  const i = m.boons.indexOf('sprong'); if (i < 0) return; m.boons.splice(i, 1);
  M.done[id] = 'sprong'; M.pos = id; M.cur = null; M.pad.push(id); bewaar();
  toast('🦘 Vakje overgeslagen'); openKaart(h);
}
function vakjeScherm(inhoud, ondertitel) {
  const h = ui.node.h; const n = nodeVan(h, ui.node.id); const v = VT[n.t];
  app().innerHTML = `<div class="kaartscherm">${hudHTML(h)}<main class="wrap vakjewrap">
    <div class="vakjekop"><span class="vakje-ic">${v.ic}</span><div><div class="vakje-type">${v.naam}${n.t === 'elite' ? ' · dubbele munten' : ''}</div><h2>${ondertitel}</h2></div>
    <button class="knop licht klein" data-act="naar-kaart">🗺️ Kaart</button></div>${inhoud}</main></div>`;
  zetOpslag(saveState);
}

/* ---------- opdracht- en elitevakje ---------- */
function nodeVragen() { const n = nodeVan(ui.node.h, ui.node.id); return n.t === 'boss' ? vragenVanOpdrachten(KAARTEN[ui.node.h].boss.rondes[mapState()[ui.node.h].ronde] || []) : vragenVanOpdrachten([n.ref]); }
function renderOpdrachtVakje() {
  const n = nodeVan(ui.node.h, ui.node.id); const vr = nodeVragen();
  if (vr.every(isKlaar)) return vakjeVoltooid();
  const x = opdrachtVan(n.ref); ui.par = x.par;
  if (!ui.qid || !vr.some(q => q.id === ui.qid) || isKlaar(vr.find(q => q.id === ui.qid))) ui.qid = (vr.find(q => !isKlaar(q)) || vr[0]).id;
  vakjeScherm(opdrachtInhoud(vr), `Opdracht ${n.ref} <small>· Rekonomie blz. ${x.o.p}</small>`);
}
function opdrachtInhoud(vr) {
  const q = vr.find(v => v.id === ui.qid) || vr[0];
  const chips = `<div class="chips">${vr.map(v => { const s = st.q[v.id]; const cls = s && s.s ? (s.s === 'getoond' ? 'getoond' : 'klaar') : ''; return `<button class="chip ${cls} ${v.id === q.id ? 'actief' : ''}" data-act="kies-vraag" data-id="${v.id}">${v.id}</button>`; }).join('')}</div>`;
  if (!ui.cur || ui.cur.q !== q || ui.cur.mode !== 'boek') ui.cur = { q, mode: 'boek', unit: null, fb: '', hint: false };
  return chips + `<div class="kaart" id="vraagkaart">${vraagHTML(ui.cur)}</div>`;
}
function nodeVolgendeKnop() {
  const vr = nodeVragen(); const open = vr.find(v => !isKlaar(v));
  if (open) return `<button class="knop" data-act="kies-vraag" data-id="${open.id}">Volgende vraag →</button>`;
  return `<button class="knop accent" data-act="vakje-klaar">${ui.node.t === 'boss' ? 'Volgende ronde ⚔️' : 'Vakje voltooid! ✓'}</button>`;
}
function nodeNaFout() { // aangeroepen bij elk fout antwoord in een kaartvakje
  const m = mapState(); const M = m[ui.node.h];
  M.fout = true;
  if (ui.node.t === 'boss') M.bossHp0 = false;
  const si = m.boons.indexOf('schild');
  if (si >= 0) { m.boons.splice(si, 1); toast('🛡️ Je schild vangt de fout op!'); return; }
  M.hp = Math.max(0, M.hp - 1); toast('💔 −1 hart');
  if (M.hp === 0) setTimeout(uitgeput, 500);
}
function uitgeput() {
  const h = ui.node.h; const n = nodeVan(h, ui.node.id); const p = PAR.find(x => x.id === (n.t === 'boss' ? KAARTEN[h].boss.par : bandPar(h, n.r)));
  modal(`<div class="perkament-modal"><h2>🔥 Je bent uitgeput!</h2><p>Je harten zijn op. Je rust uit bij het kampvuur en leest eerst de theorie. Daarna ga je verder met 3 harten, op dezelfde plek.</p>
    <div class="theorie" style="max-height:45vh;overflow:auto;background:#fffaf0;padding:10px 14px;border-radius:10px">${p.theorie}</div>
    <div class="knoprij" style="margin-top:12px"><button class="knop accent" id="uitgerust" data-act="uitgerust" disabled>Even lezen… (10)</button></div></div>`);
  let t = 10; const iv = setInterval(() => { t--; const b = $('#uitgerust'); if (!b) return clearInterval(iv); if (t <= 0) { clearInterval(iv); b.disabled = false; b.textContent = 'Ik heb de theorie gelezen → verder'; } else b.textContent = `Even lezen… (${t})`; }, 1000);
}
function nodeMunten(q, rec) { // munten na een goed antwoord in een kaartvakje
  const m = mapState(); const M = m[ui.node.h]; let n = (rec && rec.a === 0) ? 5 : 2;
  if (ui.node.t === 'elite') n *= 2; if (M.klaverHier === ui.node.id) n *= 2;
  m.munten += n;
}
function vakjeVoltooid() {
  const h = ui.node.h; const m = mapState(); const M = m[h]; const n = nodeVan(h, ui.node.id); const id = n.id;
  if (n.t === 'boss') return bossRondeKlaar();
  const nieuw = M.done[id] !== 'klaar';
  M.done[id] = 'klaar'; if (!M.boss) { M.pos = id; } M.cur = null; M.klaverHier = null;
  const beloningen = [];
  if (nieuw) {
    let verhoogd = false;
    if (!M.fout && (n.t === 'opd' || n.t === 'elite' || n.t === 'event')) { M.reeks = (M.reeks || 0) + 1; verhoogd = true; } else if (M.fout) M.reeks = 0;
    if (M.boss) { geefXP(5, 'vrij spel'); }
    bewaar();
    if (n.t === 'elite') return kiesBoon('Elite verslagen! Kies een blessing.', () => naVoltooid(h), 3);
    if (verhoogd && M.reeks % 3 === 0) return kiesBoon('Drie vakjes op rij zonder fout! Kies een blessing.', () => naVoltooid(h), 2);
  }
  bewaar(); naVoltooid(h, beloningen);
}
function naVoltooid(h) { checkBadges(); bewaar(); sluitModal(); toast('✓ Vakje voltooid'); openKaart(h); }

/* ---------- blessings ---------- */
function geefBoon(b) {
  const m = mapState();
  if (m.boons.length >= MAXBOONS) { toast('Je tas met blessings is vol (max. 3).'); return false; }
  m.boons.push(b); st.c.boons = (st.c.boons || 0) + 1; bewaar(); toast(`${BOONS[b].ic} ${BOONS[b].naam} gekregen`, 'badge'); return true;
}
function kiesBoon(titel, verder, aantal = 2) {
  const keys = Object.keys(BOONS); const opties = []; while (opties.length < Math.min(aantal, keys.length)) { const k = keys[Math.floor(Math.random() * keys.length)]; if (!opties.includes(k)) opties.push(k); }
  ui.naBoon = verder; const vol = mapState().boons.length >= MAXBOONS;
  modal(`<div class="perkament-modal"><h2>${titel}</h2>${vol ? '<p class="melding info">Je tas is vol (max. 3 blessings). Gebruik eerst een blessing, of sla deze beloning over.</p>' : ''}
    <div class="boonkeuze">${opties.map(k => `<button class="boonkaart" data-act="boon-kies" data-b="${k}" ${vol ? 'disabled' : ''}><span class="bi">${BOONS[k].ic}</span><b>${BOONS[k].naam}</b><small>${BOONS[k].oms}</small></button>`).join('')}</div>
    <div class="knoprij" style="margin-top:10px"><button class="knop licht" data-act="boon-kies" data-b="">${vol ? 'Verder' : 'Overslaan'}</button></div></div>`);
}

/* ---------- eindbaas ---------- */
function renderBoss() {
  const h = ui.node.h; const K = KAARTEN[h]; const M = mapState()[h];
  const vr = nodeVragen(); ui.par = PAR.find(p => p.id === K.boss.par);
  if (vr.length && vr.every(isKlaar)) return bossRondeKlaar();
  if (!ui.qid || !vr.some(q => q.id === ui.qid) || isKlaar(vr.find(q => q.id === ui.qid))) ui.qid = (vr.find(q => !isKlaar(q)) || vr[0]).id;
  const totaal = K.boss.rondes.length; const klaarVr = vr.filter(isKlaar).length;
  const hp = Math.round(100 * ((totaal - M.ronde) - klaarVr / vr.length) / totaal);
  vakjeScherm(`<div class="bossbalk"><div class="bossnaam">🐉 ${esc(K.boss.naam)} · ronde ${M.ronde + 1}/${totaal}</div><div class="hpbalk"><div style="width:${hp}%"></div></div></div>` + opdrachtInhoud(vr), `Eindbaas: zelftest`);
}
function bossRondeKlaar() {
  const h = ui.node.h; const K = KAARTEN[h]; const M = mapState()[h];
  M.ronde++; bewaar();
  if (M.ronde < K.boss.rondes.length) { toast(`⚔️ Ronde ${M.ronde} gewonnen!`, 'badge'); ui.qid = null; ui.cur = null; return renderBoss(); }
  const eerste = !M.boss; M.boss = true; M.done.boss = 'klaar'; M.pos = 'boss'; M.cur = null; M.pad.includes('boss') || M.pad.push('boss');
  M.hp = MAXHP;
  if (eerste) { geefXP(50, 'eindbaas verslagen'); mapState().munten += 50; if (M.bossHp0) st.c.ongeschonden = 1; }
  checkBadges(); bewaar();
  modal(`<div class="perkament-modal" style="text-align:center"><div style="font-size:4rem">🏆</div><h2>${esc(K.boss.naam)} is verslagen!</h2>
    <p>${h === 'h1' ? 'De kaart van <b>hoofdstuk 2</b> is nu open.' : 'Je hebt beide hoofdstukken uitgespeeld!'} Op deze kaart mag je nu in <b>vrij spel</b> alle overige vakjes bezoeken.</p>
    <div class="knoprij" style="justify-content:center">${h === 'h1' ? '<button class="knop accent" data-act="open-kaart" data-h="h2">Naar hoofdstuk 2 →</button>' : ''}<button class="knop licht" data-act="open-kaart" data-h="${h}">Bekijk de kaart</button></div></div>`);
}

/* ---------- events, schat, rust, winkel ---------- */
function variantVraag(par, label) { const q = genereer(par); return { q, mode: 'event', unit: null, fb: '', label }; }
function startEvent(n) {
  const h = ui.node.h; const soort = n.ref; const par = bandPar(h, n.r);
  if (soort === 'krant') {
    const lijst = KRANT[h]; const k = lijst[(n.r + n.id.charCodeAt(0)) % lijst.length];
    ui.ev = { soort, k };
    return vakjeScherm(`<div class="kaart"><div class="krant"><div class="krantkop">📰 Klopt dit?</div><p>${k.tekst}</p></div>
      <div class="knoprij"><button class="knop groen" data-act="krant" data-a="1">Klopt</button><button class="knop" data-act="krant" data-a="0">Klopt niet</button></div><div id="evfb"></div></div>`, 'Klopt dit krantenbericht?');
  }
  if (soort === 'snel') { ui.ev = { soort, eind: Date.now() + 60000 }; ui.cur = variantVraag(par, '⏱️ SNELLE SOM · 60 SECONDEN'); renderEvent(); startEvTimer(); return; }
  if (soort === 'gok') {
    ui.ev = { soort };
    return vakjeScherm(`<div class="kaart"><p class="groot">🎲 Een vreemdeling biedt je een gok aan.</p><p>Neem het zekere voor het onzekere en krijg <b>15 munten</b>. Of waag het: maak één som in één keer goed en kies een <b>blessing</b>. Is je antwoord fout, dan kost het een hart.</p>
      <div class="knoprij"><button class="knop licht" data-act="gok" data-k="veilig">🪙 15 munten</button><button class="knop accent" data-act="gok" data-k="waag">🎲 Waag het!</button></div></div>`, 'Een gok');
  }
}
function renderEvent() {
  const sub = ui.ev && ui.ev.soort === 'snel' ? `Snelle som <span class="evtimer" id="evtimer"></span>` : ui.ev && ui.ev.soort === 'schat' ? 'Schatkist' : ui.ev && ui.ev.soort === 'rust' ? 'Oefenen bij het kampvuur' : 'Gok';
  vakjeScherm(`<div class="kaart" id="vraagkaart">${vraagHTML(ui.cur)}</div>`, sub);
}
function startEvTimer() {
  clearInterval(ui.evIv);
  ui.evIv = setInterval(() => {
    const el = $('#evtimer'); if (!ui.ev || ui.ev.soort !== 'snel') return clearInterval(ui.evIv);
    const rest = Math.max(0, Math.ceil((ui.ev.eind - Date.now()) / 1000)); if (el) el.textContent = rest + 's';
    if (rest <= 0 && !ui.cur.klaar) { clearInterval(ui.evIv); ui.cur.klaar = true; ui.ev.tijdOm = true; ui.cur.fb = fbHTML('bijna', '⏱️ De tijd is om.', `Antwoord: <b>${esc(E.antwoordTekst(ui.cur.q))}</b><div class="uitleg">${ui.cur.q.uitleg || ''}</div>`); herteken(); }
  }, 500);
}
function eventAntwoord(res) { // controleren in een event/schat/rust-som
  const c = ui.cur; const ev = ui.ev || {};
  if (res.status === 'leeg' || res.status === 'kies-eenheid') { c.fb = fbHTML('info', '', res.tekst); return herteken(); }
  if (res.status === 'bijna' || res.status === 'eenheid') { c.fb = fbHTML('bijna', 'Bijna.', res.tekst); return herteken(); }
  const goed = res.status === 'goed';
  if (goed) { st.c.goed++; for (const t of c.q.tags || []) st.c.tags[t] = (st.c.tags[t] || 0) + 1; }
  else telFout(res.soort);
  if (ev.soort === 'schat' || ev.soort === 'rust') { // onbeperkt proberen, geen harten
    if (!goed) { c.pogingen = (c.pogingen || 0) + 1; c.fb = fbHTML('fout', '✗', res.tekst + (c.pogingen >= 2 ? ' <i>Je mag de uitwerking bekijken.</i>' : '')); bewaar(); return herteken(); }
    c.klaar = true; c.goedGedaan = true; c.fb = fbHTML('goed', '✓ Goed!', `<div class="uitleg">${c.q.uitleg || ''}</div>`); bewaar(); return herteken();
  }
  // snel / gok: één poging
  c.klaar = true; c.goedGedaan = goed;
  if (!goed) nodeNaFout();
  c.fb = fbHTML(goed ? 'goed' : 'fout', goed ? '✓ Goed!' : '✗ Helaas.', `${goed ? '' : res.tekst + ' '}Antwoord: <b>${esc(E.antwoordTekst(c.q))}</b><div class="uitleg">${c.q.uitleg || ''}</div>`);
  if (ev.soort === 'snel') clearInterval(ui.evIv);
  bewaar(); herteken();
}
function eventVerder() {
  const ev = ui.ev || {}; const c = ui.cur || {}; const m = mapState();
  if (ev.soort === 'snel') { if (c.goedGedaan && !ev.tijdOm) { m.munten += 20; toast('🪙 +20 munten'); geefXP(6); } return vakjeVoltooid(); }
  if (ev.soort === 'gok') { if (c.goedGedaan) { geefXP(6); return kiesBoon('Gewaagd en gewonnen! Kies een blessing.', () => vakjeVoltooid(), 2); } return vakjeVoltooid(); }
  if (ev.soort === 'schat') { geefXP(4); return kiesBoon('🧰 De kist gaat open! Kies een blessing.', () => vakjeVoltooid(), 2); }
  if (ev.soort === 'rust') { ev.n = (ev.n || 0) + 1; geefXP(4); if (ev.n < 2) { ui.cur = variantVraag(ev.par, `OEFENEN · SOM ${ev.n + 1}/2`); return renderEvent(); } return kiesBoon('🔥 Goed geoefend! Kies een blessing.', () => vakjeVoltooid(), 2); }
  vakjeVoltooid();
}
function startSchat() {
  const h = ui.node.h; const n = nodeVan(h, ui.node.id);
  ui.ev = { soort: 'schat' }; ui.cur = variantVraag(bandPar(h, n.r), '🗝️ DE SLEUTEL: MAAK DEZE SOM'); renderEvent();
}
function renderRust() {
  const h = ui.node.h; const n = nodeVan(h, ui.node.id); const M = mapState()[h];
  ui.ev = { soort: 'rust-keuze' };
  vakjeScherm(`<div class="kaart"><p class="groot">🔥 Je zit bij het kampvuur.</p><p>Kies één van beide:</p>
    <div class="grid2"><button class="boonkaart" data-act="rust" data-k="uitrusten" ${M.hp >= MAXHP ? 'disabled' : ''}><span class="bi">❤️</span><b>Uitrusten</b><small>+2 harten (je hebt er nu ${M.hp} van de ${MAXHP}).</small></button>
    <button class="boonkaart" data-act="rust" data-k="oefenen"><span class="bi">🏋️</span><b>Oefenen</b><small>Maak 2 sommen goed en kies een blessing.</small></button></div>
    <p style="margin-top:14px"><button class="link" data-act="kaart-theorie" data-h="${h}">📖 Lees hier ook de theorie van § ${bandPar(h, n.r)}</button></p></div>`, 'Rustplaats');
}
function renderWinkel() {
  const m = mapState(); const M = m[ui.node.h]; ui.ev = { soort: 'winkel' };
  vakjeScherm(`<div class="kaart"><p class="groot">🛒 "Welkom, reiziger! Wat mag het zijn?"</p><p>Je hebt <b>🪙 ${m.munten}</b> munten en ${m.boons.length}/${MAXBOONS} blessings.</p>
    <div class="winkel">${Object.entries(BOONS).map(([k, b]) => `<button class="boonkaart" data-act="koop" data-b="${k}" ${m.munten < b.prijs || m.boons.length >= MAXBOONS ? 'disabled' : ''}><span class="bi">${b.ic}</span><b>${b.naam}</b><small>${b.oms}</small><span class="prijs">🪙 ${b.prijs}</span></button>`).join('')}
    <button class="boonkaart" data-act="koop" data-b="hart" ${m.munten < 20 || M.hp >= MAXHP ? 'disabled' : ''}><span class="bi">❤️</span><b>Hart</b><small>Eén hart erbij (max. ${MAXHP}).</small><span class="prijs">🪙 20</span></button></div>
    <div class="knoprij" style="margin-top:14px"><button class="knop accent" data-act="winkel-uit">Verder reizen →</button></div></div>`, 'Winkel');
}

/* ---------- kaartenkamer (startscherm) ---------- */
function kaartKaartje(h) {
  const K = KAARTEN[h]; const M = mapState()[h]; const open = h === 'h1' || h2Open();
  const tot = K.nodes.length; const klaar = Object.keys(M.done).length;
  return `<button class="kaartkaart ${open ? '' : 'dicht'}" ${open ? `data-act="open-kaart" data-h="${h}"` : 'data-act="kaart-dicht"'}>
    <div class="kk-titel">${esc(K.titel)}</div><div class="kk-sub">${esc(K.sub)}</div>
    <div class="kk-ic">${open ? (M.boss ? '🏆' : '🗺️') : '🔒'}</div>
    <div class="kk-info">${open ? `${klaar}/${tot} vakjes · ❤️ ${M.hp} ${M.boss ? '· vrij spel' : M.pos || M.cur ? '· onderweg' : '· nog niet begonnen'}` : 'Versla eerst de eindbaas van hoofdstuk 1'}</div></button>`;
}

/* ---------- acties ---------- */
Object.assign(ACT, {
  'open-kaart': el => { sluitModal(); openKaart(el.dataset.h); },
  'kaart-dicht': () => toast('🔒 Versla eerst de eindbaas van hoofdstuk 1.'),
  'vakje': el => kiesVakje(el.dataset.id),
  'betreed': el => betreed(el.dataset.id),
  'spring': el => spring(el.dataset.id),
  'naar-kaart': () => { clearInterval(ui.evIv); openKaart(ui.node ? ui.node.h : ui.h); },
  'vakje-klaar': () => vakjeVoltooid(),
  'uitgerust': () => { const M = mapState()[ui.node.h]; M.hp = 3; bewaar(); sluitModal(); toast('❤️ Je bent weer op krachten (3 harten)'); herteken(); hudVernieuw(); },
  'boon-info': el => { const b = BOONS[el.dataset.b]; modal(`<div class="perkament-modal"><h2>${b.ic} ${b.naam}</h2><p>${b.oms}</p>${el.dataset.b === 'klaver' ? `<div class="knoprij"><button class="knop accent" data-act="klaver-aan">Nu activeren</button><button class="knop licht" data-act="sluit">Sluiten</button></div>` : '<button class="knop licht" data-act="sluit">Sluiten</button>'}</div>`); },
  'klaver-aan': () => { const m = mapState(); const i = m.boons.indexOf('klaver'); if (i >= 0 && !m.klaver) { m.boons.splice(i, 1); m.klaver = true; bewaar(); toast('🍀 Klavertje actief voor je volgende opdracht'); } sluitModal(); hudVernieuw(); },
  'boon-kies': el => { const b = el.dataset.b; if (b) geefBoon(b); sluitModal(); const f = ui.naBoon; ui.naBoon = null; if (f) f(); },
  'legenda-toggle': () => { const el = $('#legendaPaneel'); if (!el) return; const dicht = !el.classList.contains('dicht'); el.classList.toggle('dicht', dicht); try { localStorage.setItem('rk_legenda', dicht ? 'dicht' : 'open'); } catch (e) { /* */ } const k = el.querySelector('.legenda-kop'); k.setAttribute('aria-expanded', !dicht); k.querySelector('.pijl').textContent = dicht ? '◂' : '▾'; },
  'legenda': () => modal(`<div class="perkament-modal"><h2>Legenda</h2><ul class="legenda">${Object.values(VT).map(v => `<li><span>${v.ic}</span>${v.naam}</li>`).join('')}<li><span style="color:#b3261e;font-weight:bold">✕</span>Jouw plek</li><li><span>◯</span>Voltooid</li><li><span>🦘</span>Overgeslagen</li></ul>
    <h3>Blessings</h3><ul class="legenda">${Object.values(BOONS).map(b => `<li><span>${b.ic}</span><b>${b.naam}</b>: ${b.oms}</li>`).join('')}</ul><button class="knop licht" data-act="sluit">Sluiten</button></div>`),
  'kaart-theorie': el => { const h = el.dataset.h; const pars = PAR.filter(p => p.h === (h === 'h1' ? 1 : 2)); ui.thTab = ui.thTab && pars.some(p => p.id === ui.thTab) ? ui.thTab : pars[0].id; toonTheorie(h); },
  'th-tab': el => { ui.thTab = el.dataset.id; toonTheorie(el.dataset.h); },
  'krant': el => {
    const k = ui.ev.k; const goed = (el.dataset.a === '1') === k.ok; if (ui.ev.klaar) return; ui.ev.klaar = true;
    if (goed) { mapState().munten += 15; geefXP(5); st.c.goed++; } else { telFout('formule'); nodeNaFout(); }
    $('#evfb').innerHTML = fbHTML(goed ? 'goed' : 'fout', goed ? '✓ Goed gezien! +15 munten' : '✗ Helaas.', `<div class="uitleg">${k.uitleg}</div>`) + `<div class="knoprij"><button class="knop accent" data-act="vakje-klaar">Verder →</button></div>`;
    document.querySelectorAll('[data-act=krant]').forEach(b => b.disabled = true); bewaar(); hudVernieuw();
  },
  'gok': el => {
    const h = ui.node.h; const n = nodeVan(h, ui.node.id);
    if (el.dataset.k === 'veilig') { mapState().munten += 15; bewaar(); return vakjeVoltooid(); }
    ui.cur = variantVraag(bandPar(h, n.r), '🎲 WAAG HET: ÉÉN POGING'); renderEvent();
  },
  'event-verder': () => eventVerder(),
  'rust': el => {
    const h = ui.node.h; const n = nodeVan(h, ui.node.id); const M = mapState()[h];
    if (el.dataset.k === 'uitrusten') { M.hp = Math.min(MAXHP, M.hp + 2); bewaar(); toast('❤️ +2 harten'); return vakjeVoltooid(); }
    ui.ev = { soort: 'rust', n: 0, par: bandPar(h, n.r) }; ui.cur = variantVraag(ui.ev.par, 'OEFENEN · SOM 1/2'); renderEvent();
  },
  'koop': el => {
    const m = mapState(); const M = m[ui.node.h]; const b = el.dataset.b;
    if (b === 'hart') { if (m.munten >= 20 && M.hp < MAXHP) { m.munten -= 20; M.hp++; toast('❤️ +1 hart'); } }
    else if (m.munten >= BOONS[b].prijs && m.boons.length < MAXBOONS) { m.munten -= BOONS[b].prijs; geefBoon(b); }
    bewaar(); renderWinkel();
  },
  'winkel-uit': () => vakjeVoltooid()
});
function hudVernieuw() { const hud = document.querySelector('.hud'); if (hud && ui.node) { const t = document.createElement('div'); t.innerHTML = hudHTML(ui.node.h); hud.replaceWith(t.firstElementChild); zetOpslag(saveState); } }
function toonTheorie(h) {
  const pars = PAR.filter(p => p.h === (h === 'h1' ? 1 : 2)); const p = pars.find(x => x.id === ui.thTab) || pars[0];
  modal(`<button class="knop licht klein sluit" data-act="sluit">✕</button><h2>📖 Theorie</h2><div class="chips">${pars.map(x => `<button class="chip ${x.id === p.id ? 'actief' : ''}" data-act="th-tab" data-id="${x.id}" data-h="${h}">§ ${x.id}</button>`).join('')}</div><div class="theorie">${p.theorie}</div>`);
}

/* ---------- controle van de kaarten (ontwikkeltest) ---------- */
function valideerKaarten() {
  const fouten = [];
  for (const [h, K] of Object.entries(KAARTEN)) {
    const ids = new Set(K.nodes.map(n => n.id));
    for (const n of K.nodes) {
      for (const t of n.to) { if (!ids.has(t)) fouten.push(`${h}:${n.id}→${t} bestaat niet`); else if (nodeVan(h, t).r !== n.r + 1) fouten.push(`${h}:${n.id}→${t} slaat een rij over`); }
      if (n.t !== 'boss' && !n.to.length) fouten.push(`${h}:${n.id} heeft geen uitgang`);
      if (n.r > 0 && !K.nodes.some(m => m.to.includes(n.id))) fouten.push(`${h}:${n.id} is onbereikbaar`);
      if ((n.t === 'opd' || n.t === 'elite') && !opdrachtVan(n.ref)) fouten.push(`${h}:${n.id} opdracht ${n.ref} onbekend`);
    }
    for (const r of K.boss.rondes) for (const nr of r) if (!opdrachtVan(nr)) fouten.push(`${h}: eindbaasopdracht ${nr} onbekend`);
  }
  return fouten;
}
window.RKKAART = { KAARTEN, valideerKaarten, bereikbaar, mapState };
