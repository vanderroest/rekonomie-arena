
(function (global) {
'use strict';
const r = (x, d) => { const f = Math.pow(10, d); return Math.round((x + Math.sign(x) * 1e-9) * f) / f; };
const fmt = (x, d) => Number(x).toLocaleString('nl-NL', { minimumFractionDigits: d, maximumFractionDigits: d });
const eur = (x, d = 2) => '€ ' + fmt(x, d);
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const pct = (deel, geheel) => deel / geheel * 100;
const sf = x => Number(x).toLocaleString('nl-NL', { maximumFractionDigits: 4 });
const PAR = [{"id":"1.1","gens":["afr_dec","afr_tal","afr_cijfer","afr_tussen","afr_geld"]},{"id":"1.2","gens":["gr_voluit","gr_inw","gr_maal","gr_deel"]},{"id":"1.3","gens":["afr_dec","afr_tal","afr_tussen","gr_inw","gr_maal","gr_deel","gr_voluit"]},{"id":"2.1","gens":["p_deel","p_van","btw_incl","btw_bedrag","btw_excl","p_terug"]},{"id":"2.2","gens":["gf","p_nieuw","p_verand","p_vergelijk","p_terugoud","p_rente"]},{"id":"2.3","gens":["pp","pp","p_verand"]},{"id":"2.4","gens":["p_deel","btw_bedrag","btw_excl","p_verand","p_vergelijk","p_terugoud","korting","pp"]}];
const G = {};
function nummer(min, max, dec) { return r(min + Math.random() * (max - min), dec); }
G.afr_dec = () => {
  let x = nummer(1, 9999, 5); const d = pick([0, 1, 2, 3]);
  const s = x.toFixed(5).split('.'); const dec = s[1].split('');
  dec[d] = pick(['4', '5', '5', '9', '0', '6']); x = parseFloat(s[0] + '.' + dec.join(''));
  const ans = r(x, d);
  const tw = d === 0 ? 'een heel getal' : d === 1 ? 'één decimaal' : d + ' decimalen';
  return { type: 'num', tekst: `Rond ${fmt(x, 5)} af op ${tw}.`, antwoord: ans, d, exact: true, unit: '', tags: ['afronden'],
    uitleg: `Kijk naar decimaal ${d + 1}: een ${dec[d]} → ${+dec[d] >= 5 ? 'omhoog' : 'omlaag'}: ${fmt(ans, d)}.`,
    fouten: [{ v: r(ans > x ? ans - Math.pow(10, -d) : ans + Math.pow(10, -d), d), tekst: 'Je rondt de verkeerde kant op. Kijk alleen naar het eerste cijfer ná de plek waarop je afrondt.', soort: 'afronden' }] };
};
G.afr_tal = () => {
  const x = ri(1000, 999999); const [w, f] = pick([['tientallen', 10], ['honderdtallen', 100], ['duizendtallen', 1000]]);
  const ans = Math.round(x / f) * f;
  return { type: 'num', tekst: `Rond € ${fmt(x, 0)} af op ${w}.`, antwoord: ans, d: 0, exact: true, unit: '€', tags: ['afronden'],
    uitleg: `Kijk naar het cijfer direct rechts van de ${w}: € ${fmt(ans, 0)}.`,
    fouten: [{ v: (ans > x ? ans - f : ans + f), tekst: 'Je rondt de verkeerde kant op. Kijk naar het cijfer direct rechts van de plek waarop je afrondt.', soort: 'afronden' }] };
};
G.afr_cijfer = () => {
  let a, b, gem;
  do { a = ri(40, 89) / 10; b = ri(40, 89) / 10; gem = (a + b) / 2; } while (Math.abs(gem * 10 - Math.round(gem * 10)) < 1e-9 || Math.round(gem * 100) % 10 !== 5);
  const dubbel = Math.round(r(gem, 1));
  const f = dubbel !== r(gem, 0) ? [{ v: dubbel, tekst: `Je rondt twee keer af (${fmt(gem, 2)} → ${fmt(r(gem, 1), 1)} → ${dubbel}). Rond in één keer af op een heel getal.`, soort: 'afronden' }] : [];
  return { type: 'num', tekst: `Een leerling haalt een ${fmt(a, 1)} voor het SE en een ${fmt(b, 1)} voor het CE. Ze tellen even zwaar. Bereken het eindcijfer (afgerond op een heel getal).`,
    antwoord: r(gem, 0), d: 0, exact: true, unit: 'cijfer', tags: ['afronden'], uitleg: `(${fmt(a, 1)} + ${fmt(b, 1)}) ÷ 2 = ${fmt(gem, 2)} → eindcijfer ${r(gem, 0)}.`, fouten: f };
};
G.afr_tussen = () => {
  let a, b, c, q;
  do { a = ri(101, 499) / 10; b = pick([3, 6, 7, 9, 11, 12]); c = pick([2500, 4000, 7500, 12500, 15000]); q = a / b; } while (Math.abs(r(q, 1) - q) < 0.02);
  const ans = q * c; const fout = r(q, 1) * c;
  return { type: 'num', tekst: `Bereken (${fmt(a, 1)} ÷ ${b}) × ${fmt(c, 0)}. Rond niet tussentijds af; geef het antwoord afgerond op een heel getal.`, antwoord: ans, d: 0, unit: '', tags: ['afronden'],
    uitleg: `${fmt(a, 1)} ÷ ${b} = ${fmt(q, 5)}… × ${fmt(c, 0)} = ${fmt(r(ans, 0), 0)}.`, fouten: [{ v: r(fout, 0), t: 0.5, tekst: 'Je hebt tussentijds afgerond. Reken door met het volledige getal.', soort: 'afronden' }] };
};
G.afr_geld = () => {
  const tot = ri(1000, 99999) + pick([0, 0.5, 0.25]); const n = pick([3, 6, 7, 9, 11, 12, 13]);
  const ans = tot / n;
  return { type: 'num', tekst: `Een winst van € ${fmt(tot, 2)} wordt gelijk verdeeld over ${n} eigenaren. Bereken hoeveel ieder krijgt.`, antwoord: ans, d: 2, unit: '€', tags: ['afronden'],
    uitleg: `€ ${fmt(tot, 2)} ÷ ${n} = € ${fmt(r(ans, 2), 2)} (geld: twee decimalen).` };
};
const WOORD = { 1e6: 'miljoen', 1e9: 'miljard', 1e12: 'biljoen' };
G.gr_voluit = () => {
  const s = pick([1e6, 1e9, 1e12]); const x = s === 1e12 ? r(pick([nummer(1, 30, 2), nummer(1, 9, 3)]), 3) : r(pick([nummer(1, 99, 2), nummer(100, 999, 1), nummer(1, 9, 3)]), 3);
  const ans = Math.round(x * s);
  return { type: 'num', tekst: `Schrijf € ${sf(x)} ${WOORD[s]} voluit (met alle nullen).`, antwoord: ans, d: 0, exact: true, unit: '€', voluit: true, tags: ['nullen'],
    uitleg: `${WOORD[s]} heeft ${Math.log10(s)} nullen: € ${fmt(ans, 0)}.`,
    fouten: [s > 1e6 ? { v: Math.round(x * s / 1000), tekst: 'Je hebt 3 nullen te weinig.', soort: 'nullen' } : null, { v: Math.round(x * s * 1000), tekst: 'Je hebt 3 nullen te veel.', soort: 'nullen' }].filter(Boolean) };
};
G.gr_inw = () => {
  const land = pick([['Duitsland', 4.12e12, 84.5e6, '€'], ['Frankrijk', 2.82e12, 68.2e6, '€'], ['Italië', 2.13e12, 59.0e6, '€'], ['Spanje', 1.46e12, 48.6e6, '€'],
    ['Nederland', 1.03e12, 17.9e6, '€'], ['België', 584e9, 11.8e6, '€'], ['Oostenrijk', 474e9, 9.1e6, '€'], ['Ierland', 510e9, 5.3e6, '€'],
    ['de Verenigde Staten', 27.4e12, 335e6, '$'], ['de Verenigde Staten', 25.7e12, 333e6, '$']]);
  const [n, bbp, inw, val] = land; const w1 = bbp >= 1e12 ? 'biljoen' : 'miljard'; const v = { biljoen: 1e12, miljard: 1e9 }[w1];
  const ans = bbp / inw;
  return { type: 'num', tekst: `${cap(n)} heeft een bbp van ${val} ${sf(bbp / v)} ${w1} en ${fmt(inw / 1e6, 1)} miljoen inwoners. Bereken het bbp per inwoner (afgerond op hele ${val === '€' ? 'euro\'s' : 'dollars'}).`,
    antwoord: ans, d: 0, unit: val, tags: ['nullen'], uitleg: `${w1} ÷ miljoen = ${w1 === 'biljoen' ? 'miljoen' : 'duizend'}. ${sf(bbp / v)} ÷ ${fmt(inw / 1e6, 1)} × ${w1 === 'biljoen' ? '1.000.000' : '1.000'} = ${val} ${fmt(r(ans, 0), 0)}.`,
    fouten: [{ v: r(ans / 1000, 0), t: 1, tekst: 'Je bent een factor duizend kwijtgeraakt. Tel de nullen goed.', soort: 'nullen' }, { v: r(ans * 1000, 0), t: 1000, tekst: 'Je hebt een factor duizend te veel.', soort: 'nullen' }] };
};
G.gr_maal = () => {
  const a = pick([20, 40, 60, 150, 250, 300, 800]); const s = pick([1e6, 1e9]); const b = pick([200, 500, 2000, 4000, 5000]);
  const ans = a * s * b;
  return { type: 'num', tekst: `Bereken € ${a} ${WOORD[s]} × ${fmt(b, 0)}. (Je mag typen als "3 miljard".)`, antwoord: ans, d: 0, unit: '€', tags: ['nullen'],
    uitleg: `${a} × ${fmt(b, 0)} = ${fmt(a * b, 0)} ${WOORD[s]} = € ${fmt(ans, 0)}.`, fouten: [{ v: ans / 1000, tekst: 'Je hebt 3 nullen te weinig.', soort: 'nullen' }] };
};
G.gr_deel = () => {
  const [s1, s2] = pick([[1e9, 1e6], [1e12, 1e9], [1e12, 1e6], [1e9, 1e3]]); const b = pick([2, 4, 5, 8, 20, 25, 40]); const res = pick([3, 6, 12, 15, 30, 45]);
  const a = b * res; const ans = a * s1 / (b * s2);
  const w2 = s2 === 1e3 ? 'duizend' : WOORD[s2];
  return { type: 'num', tekst: `Bereken € ${a} ${WOORD[s1]} ÷ ${b} ${w2}.`, antwoord: ans, d: 0, unit: '€', tags: ['nullen'],
    uitleg: `${a} ÷ ${b} = ${res}; ${WOORD[s1]} ÷ ${w2} = ${fmt(s1 / s2, 0)}. Antwoord: € ${fmt(ans, 0)}.`, fouten: [{ v: res, tekst: 'Vergeet de nullen niet: hoeveel blijft er over als je ' + WOORD[s1] + ' door ' + w2 + ' deelt?', soort: 'nullen' }] };
};
G.p_deel = () => {
  const ctx = pick([['de loonkosten', 'de omzet', 1], ['de huur', 'het inkomen', 1], ['het aantal werklozen', 'de beroepsbevolking', 0]]);
  const geheel = ctx[2] ? ri(20, 900) * 1000 : ri(80, 950) * 100; const deel = Math.round(geheel * nummer(0.05, 0.75, 3) / 10) * 10;
  const ans = pct(deel, geheel);
  const vb = ctx[2] ? `€ ${fmt(deel, 0)}` : fmt(deel, 0); const vg = ctx[2] ? `€ ${fmt(geheel, 0)}` : fmt(geheel, 0);
  return { type: 'num', tekst: `${cap(ctx[0])} bedraagt ${vb}, ${ctx[1]} ${vg}. Bereken ${ctx[0]} in procenten van ${ctx[1]}.`, antwoord: ans, d: 1, unit: '%', tags: ['basis'],
    uitleg: `${fmt(deel, 0)} ÷ ${fmt(geheel, 0)} × 100% = ${fmt(r(ans, 1), 1)}%.`, fouten: [{ v: r(pct(geheel, deel), 1), tekst: 'Omgekeerde basis: deel door het geheel.', soort: 'basis' }] };
};
G.p_van = () => {
  const p = pick([12, 15, 18, 23, 35, 42, 62.5, 7.5]); const g = ri(12, 480) * 1000; const ans = p / 100 * g;
  return { type: 'num', tekst: `De omzet van een bedrijf is € ${fmt(g, 0)}. De loonkosten zijn ${sf(p)}% van de omzet. Bereken de loonkosten.`, antwoord: ans, d: 2, unit: '€', tags: [],
    uitleg: `${sf(p / 100)} × € ${fmt(g, 0)} = € ${fmt(r(ans, 2), 2)}.` };
};
G.btw_incl = () => {
  const t = pick([9, 21]); const ex = nummer(5, 2500, 2); const ans = ex * (100 + t) / 100;
  return { type: 'num', tekst: `Een product kost € ${fmt(ex, 2)} exclusief ${t}% btw. Bereken de prijs inclusief btw.`, antwoord: ans, d: 2, unit: '€', tags: ['btw'],
    uitleg: `€ ${fmt(ex, 2)} × ${fmt(1 + t / 100, 2)} = € ${fmt(r(ans, 2), 2)}.`, fouten: [{ v: r(ex * t / 100, 2), tekst: 'Dat is alleen het btw-bedrag. Tel het op bij de prijs exclusief btw.', soort: 'btw' }] };
};
G.btw_bedrag = () => {
  const t = pick([9, 21]); const inc = nummer(5, 3000, 2); const ans = inc / (100 + t) * t;
  return { type: 'num', tekst: `Een product kost € ${fmt(inc, 2)} inclusief ${t}% btw. Bereken het btw-bedrag.`, antwoord: ans, d: 2, unit: '€', tags: ['btw', 'basis'],
    uitleg: `€ ${fmt(inc, 2)} = ${100 + t}%. ${fmt(inc, 2)} ÷ ${100 + t} × ${t} = € ${fmt(r(ans, 2), 2)}.`,
    fouten: [{ v: r(inc * t / 100, 2), tekst: `De btw is geen ${t}% van de prijs inclusief btw. Die prijs is ${100 + t}%.`, soort: 'btw' }] };
};
G.btw_excl = () => {
  const t = pick([9, 21]); const inc = nummer(5, 3000, 2); const ans = inc / (1 + t / 100);
  return { type: 'num', tekst: `Een product kost € ${fmt(inc, 2)} inclusief ${t}% btw. Bereken de prijs exclusief btw.`, antwoord: ans, d: 2, unit: '€', tags: ['btw', 'basis'],
    uitleg: `€ ${fmt(inc, 2)} ÷ ${fmt(1 + t / 100, 2)} = € ${fmt(r(ans, 2), 2)}.`,
    fouten: [{ v: r(inc * (1 - t / 100), 2), tekst: `Je trekt ${t}% van de prijs inclusief btw af. Deel door ${fmt(1 + t / 100, 2)}.`, soort: 'btw' }] };
};
G.p_terug = () => {
  const p = pick([10, 15, 20, 25, 30, 40]); const orig = ri(8, 60) * 5000; const rest = orig * (1 - p / 100);
  return { type: 'num', tekst: `Van een lening is ${p}% afgelost. De restschuld is € ${fmt(rest, 0)}. Bereken het oorspronkelijke bedrag van de lening.`, antwoord: orig, d: 0, unit: '€', tags: ['basis'],
    uitleg: `€ ${fmt(rest, 0)} = ${100 - p}%. ${fmt(rest, 0)} ÷ ${100 - p} × 100 = € ${fmt(orig, 0)}.`, fouten: [{ v: r(rest * (1 + p / 100), 0), tekst: `Je neemt ${p}% van de restschuld. De basis is de oorspronkelijke lening.`, soort: 'basis' }] };
};
G.gf = () => {
  const s = pick([1, -1]); const p = pick([0.5, 1.5, 2, 3, 4.5, 8, 12, 15, 25, 35, 60, 120, 0.8]); const ans = 1 + s * p / 100;
  if (ans <= 0) return G.gf();
  const dd = String(p).includes('.') ? 3 : 2;
  return { type: 'num', tekst: `Een bedrag ${s > 0 ? 'stijgt' : 'daalt'} met ${fmt(p, String(p).includes('.') ? 1 : 0)}%. Wat is de groeifactor?`, antwoord: ans, d: dd, unit: '', tags: [],
    uitleg: `(100 ${s > 0 ? '+' : '−'} ${fmt(p, 1).replace(',0', '')}) ÷ 100 = ${fmt(ans, dd)}.`, fouten: [{ v: r(1 - s * p / 100, dd), tekst: s > 0 ? 'Bij een stijging is de groeifactor groter dan 1.' : 'Bij een daling is de groeifactor kleiner dan 1.', soort: 'formule' }] };
};
G.p_nieuw = () => {
  const s = pick([1, -1]); const p = pick([2.5, 4, 6, 7.5, 12, 18, 22, 35]); const oud = ri(20, 900) * 1000; const ans = oud * (1 + s * p / 100);
  return { type: 'num', tekst: `De omzet van een bedrijf was € ${fmt(oud, 0)} en ${s > 0 ? 'stijgt' : 'daalt'} met ${fmt(p, 1).replace(',0', '')}%. Bereken de nieuwe omzet.`, antwoord: ans, d: 2, unit: '€', tags: [],
    uitleg: `€ ${fmt(oud, 0)} × ${sf(1 + s * p / 100)} = € ${fmt(r(ans, 2), 2)}.` };
};
G.p_verand = () => {
  const oud = ri(120, 950) * 1000; let nieuw; do { nieuw = Math.round(oud * nummer(0.7, 1.35, 3) / 100) * 100; } while (Math.abs(nieuw - oud) / oud < 0.05);
  const ans = pct(nieuw - oud, oud);
  const wat = pick(['De omzet', 'De export', 'De omzet van een webwinkel', 'Het aantal verkochte producten']);
  const e = wat.startsWith('Het aantal') ? '' : '€ ';
  return { type: 'num', tekst: `${wat} verandert van ${e}${fmt(oud, 0)} naar ${e}${fmt(nieuw, 0)}. Bereken de procentuele verandering (bij een daling met minteken).`, antwoord: ans, d: 1, unit: '%', tags: ['basis'],
    uitleg: `(${fmt(nieuw, 0)} − ${fmt(oud, 0)}) ÷ ${fmt(oud, 0)} × 100% = ${fmt(r(ans, 1), 1)}%.`,
    fouten: [{ v: r(pct(nieuw - oud, nieuw), 1), tekst: 'Je deelt door de nieuwe waarde. Deel door de oude waarde.', soort: 'basis' }] };
};
G.p_vergelijk = () => {
  const namen = pick([['Fleur', 'Daan'], ['Yara', 'Mees'], ['Noor', 'Sem'], ['Zoë', 'Milan'], ['Lotte', 'Bram']]);
  let a = ri(28, 95) * 500, b; do { b = ri(28, 95) * 500; } while (b === a);
  const [hoog, laag, nh, nl] = a > b ? [a, b, namen[0], namen[1]] : [b, a, namen[1], namen[0]];
  const meer = Math.random() < 0.5;
  const ans = meer ? pct(hoog - laag, laag) : pct(hoog - laag, hoog);
  const tekst = meer ? `${nh} verdient € ${fmt(hoog, 0)} en ${nl} € ${fmt(laag, 0)} per jaar. Hoeveel procent verdient ${nh} meer dan ${nl}?`
    : `${nh} verdient € ${fmt(hoog, 0)} en ${nl} € ${fmt(laag, 0)} per jaar. Hoeveel procent verdient ${nl} minder dan ${nh}?`;
  return { type: 'num', tekst, antwoord: ans, d: 1, sign: 'abs', unit: '%', tags: ['basis'],
    uitleg: meer ? `Basis = ${nl}: (${fmt(hoog, 0)} − ${fmt(laag, 0)}) ÷ ${fmt(laag, 0)} × 100% = ${fmt(r(ans, 1), 1)}%.` : `Basis = ${nh}: (${fmt(laag, 0)} − ${fmt(hoog, 0)}) ÷ ${fmt(hoog, 0)} × 100% = −${fmt(r(ans, 1), 1)}%.`,
    fouten: [{ v: r(meer ? pct(hoog - laag, hoog) : pct(hoog - laag, laag), 1), tekst: `Verkeerde basis. Het getal na "dan" is de basis.`, soort: 'basis' }] };
};
G.p_terugoud = () => {
  const s = pick([1, -1]); const p = pick([2, 4, 5, 8, 12.5, 15, 20, 25]); const oud = ri(20, 400) * 250; const nieuw = oud * (1 + s * p / 100);
  return { type: 'num', tekst: `Het aantal bezoekers ${s > 0 ? 'steeg' : 'daalde'} met ${fmt(p, 1).replace(',0', '')}% tot ${fmt(nieuw, 0)}. Bereken het aantal bezoekers vóór de verandering.`, antwoord: oud, d: 0, unit: 'personen', tags: ['basis'],
    uitleg: `Oud = nieuw ÷ groeifactor = ${fmt(nieuw, 0)} ÷ ${sf(1 + s * p / 100)} = ${fmt(oud, 0)}.`, fouten: [{ v: r(nieuw * (1 - s * p / 100), 0), t: 1, tekst: 'Je neemt het percentage van de nieuwe waarde. Deel door de groeifactor.', soort: 'basis' }] };
};
G.p_rente = () => {
  const k = ri(4, 80) * 250; const p = pick([0.5, 1, 1.5, 2, 2.5, 3, 4]); const n = pick([2, 3, 4, 5, 6, 8, 10]); const ans = k * Math.pow(1 + p / 100, n);
  return { type: 'num', tekst: `Je zet € ${fmt(k, 0)} op een spaarrekening tegen ${fmt(p, 1).replace(',0', '')}% rente per jaar (rente op rente). Bereken het saldo na ${n} jaar.`, antwoord: ans, d: 2, unit: '€', tags: [],
    uitleg: `€ ${fmt(k, 0)} × ${sf(1 + p / 100)}<sup>${n}</sup> = € ${fmt(r(ans, 2), 2)}.`, fouten: [{ v: r(k * (1 + n * p / 100), 2), tekst: 'Je vergeet rente op rente. Vermenigvuldig ' + n + ' keer met de groeifactor.', soort: 'formule' }] };
};
G.korting = () => {
  const p = pick([10, 15, 20, 25, 30, 40]); const oud = ri(8, 120) * 5; const betaal = oud * (1 - p / 100); const ans = oud - betaal;
  return { type: 'num', tekst: `Je krijgt ${p}% korting en betaalt € ${fmt(betaal, 2)}. Bereken de korting in euro's.`, antwoord: ans, d: 2, unit: '€', tags: ['basis'],
    uitleg: `€ ${fmt(betaal, 2)} = ${100 - p}%. Oude prijs = € ${fmt(oud, 2)}. Korting = € ${fmt(ans, 2)}.`, fouten: [{ v: r(betaal * p / 100, 2), tekst: `De korting is ${p}% van de oude prijs, niet van het bedrag dat je betaalt.`, soort: 'basis' }] };
};
G.pp = () => {
  const [wat, lo, hi] = pick([['De werkloosheid', 3, 12], ['Het marktaandeel', 5, 45], ['De rente', 0.5, 6], ['De bezettingsgraad', 60, 95], ['De organisatiegraad', 15, 40]]);
  const a = nummer(lo, hi, 1); let b; do { b = r(a * nummer(0.6, 1.5, 3), 1); } while (Math.abs(a - b) < 0.2 || b <= 0);
  const vraagPP = Math.random() < 0.5; const ans = vraagPP ? b - a : pct(b - a, a);
  return { type: 'num', tekst: `${wat} verandert van ${fmt(a, 1)}% naar ${fmt(b, 1)}%. Bereken de verandering in ${vraagPP ? 'procentpunten' : 'procenten'} (een daling met minteken).`,
    antwoord: ans, d: 1, unit: vraagPP ? 'procentpunt' : '%', tags: ['pp'],
    uitleg: vraagPP ? `${fmt(b, 1)} − ${fmt(a, 1)} = ${fmt(r(ans, 1), 1)} procentpunt.` : `(${fmt(b, 1)} − ${fmt(a, 1)}) ÷ ${fmt(a, 1)} × 100% = ${fmt(r(ans, 1), 1)}%.`,
    fouten: [{ v: r(vraagPP ? pct(b - a, a) : b - a, 1), tekst: vraagPP ? 'Dat is de verandering in procenten. Procentpunten = gewoon het verschil.' : 'Dat is het verschil in procentpunten. In procenten deel je door de oude waarde.', soort: 'pp' }] };
};
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function genereer(parId) {
  const par = PAR.find(p => p.id === parId);
  const g = G[pick(par.gens)]();
  g.id = 'v-' + parId + '-' + Math.random().toString(36).slice(2, 8);
  g.par = parId; g.variant = true;
  return g;
}
global.RK = { PAR, G, genereer, util: { r, fmt, eur, ri, pick } };
})(typeof window !== 'undefined' ? window : globalThis);
