/* Rekonomie Arena – duelsommen: korte sommen van één stap, per onderwerp aan te vinken.
   Dit bestand wordt zowel in de app als in de edge function rk-duel-maak gebruikt. */
(function (global) {
'use strict';
const r = (x, d) => { const f = Math.pow(10, d); return Math.round((x + Math.sign(x) * 1e-9) * f) / f; };
const fmt = (x, d) => Number(x).toLocaleString('nl-NL', { minimumFractionDigits: d, maximumFractionDigits: d });
const sf = x => Number(x).toLocaleString('nl-NL', { maximumFractionDigits: 4 });
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const WOORD = { 1e6: 'miljoen', 1e9: 'miljard', 1e12: 'biljoen' };

const S = {
  // §1.1 Afronden
  afr: [
    () => { const x = ri(10000, 99999) / 1000; const d = pick([0, 1, 2]); const a = r(x, d);
      return { type: 'num', tekst: `Rond ${fmt(x, 3)} af op ${d === 0 ? 'een heel getal' : d === 1 ? 'één decimaal' : 'twee decimalen'}.`, antwoord: a, d, exact: true, unit: '', uitleg: `Kijk naar het cijfer ná de plek waarop je afrondt: ${fmt(a, d)}.` }; },
    () => { const x = ri(1000, 99999); const [w, f] = pick([['tientallen', 10], ['honderdtallen', 100], ['duizendtallen', 1000]]); const a = Math.round(x / f) * f;
      return { type: 'num', tekst: `Rond ${fmt(x, 0)} af op ${w}.`, antwoord: a, d: 0, exact: true, unit: '', uitleg: `Kijk naar het cijfer rechts van de ${w}: ${fmt(a, 0)}.` }; },
    () => { const x = ri(100, 9999) / 1000 + ri(1, 9) / 10000; const a = r(x, 2);
      return { type: 'num', tekst: `Een bedrag komt uit op € ${fmt(x, 4)}. Rond af op centen.`, antwoord: a, d: 2, exact: true, unit: '€', uitleg: `Centen = twee decimalen: € ${fmt(a, 2)}.` }; }
  ],
  // §1.2 Grote getallen
  groot: [
    () => { const s = pick([1e6, 1e9]); const x = pick([ri(2, 99), ri(11, 99) / 10]); const a = Math.round(x * s);
      return { type: 'num', tekst: `Schrijf € ${sf(x)} ${WOORD[s]} voluit (met alle nullen).`, antwoord: a, d: 0, exact: true, unit: '€', voluit: true, uitleg: `${WOORD[s]} heeft ${Math.log10(s)} nullen: € ${fmt(a, 0)}.`,
        fouten: [{ v: a * 1000, tekst: 'Je hebt 3 nullen te veel.', soort: 'nullen' }, { v: a / 1000, tekst: 'Je hebt 3 nullen te weinig.', soort: 'nullen' }] }; },
    () => { const s = pick([1e6, 1e9]); const a0 = pick([2, 3, 4, 5, 6, 8, 12, 15, 20]); const b = pick([10, 100, 1000]); const a = a0 * s * b;
      return { type: 'num', tekst: `Bereken € ${a0} ${WOORD[s]} × ${fmt(b, 0)}. (Je mag typen als "3 miljard".)`, antwoord: a, d: 0, unit: '€', uitleg: `${a0} × ${fmt(b, 0)} = ${fmt(a0 * b, 0)} ${WOORD[s]} = € ${fmt(a, 0)}.`,
        fouten: [{ v: a / 1000, tekst: 'Je hebt 3 nullen te weinig.', soort: 'nullen' }] }; },
    () => { const s = pick([1e6, 1e9]); const n = pick([2, 4, 5, 10, 20, 50]); const res = pick([3, 6, 8, 12, 15, 40]); const a = n * res * s / n;
      return { type: 'num', tekst: `€ ${n * res} ${WOORD[s]} wordt gelijk verdeeld over ${n} landen. Hoeveel krijgt elk land? (Je mag typen als "3 miljard".)`, antwoord: a, d: 0, unit: '€', uitleg: `${n * res} ÷ ${n} = ${res} ${WOORD[s]} = € ${fmt(a, 0)}.` }; }
  ],
  // §2.1 Procent van / deel van geheel
  procent: [
    () => { const p = pick([5, 10, 15, 20, 25, 30, 40, 60, 75]); const g = ri(4, 90) * 20; const a = g * p / 100;
      return { type: 'num', tekst: `Bereken ${p}% van € ${fmt(g, 0)}.`, antwoord: a, d: 2, unit: '€', uitleg: `${p} ÷ 100 × ${fmt(g, 0)} = € ${fmt(a, 2)}.` }; },
    () => { let g, p, d0; do { g = pick([40, 60, 80, 120, 200, 240, 300, 400, 500]); p = pick([10, 15, 20, 25, 30, 40, 60, 75]); d0 = g * p / 100; } while (d0 !== Math.round(d0));
      return { type: 'num', tekst: `Van de ${g} leerlingen van een jaarlaag fietsen er ${fmt(d0, 0)} naar school. Hoeveel procent is dat?`, antwoord: p, d: 1, unit: '%', uitleg: `${d0} ÷ ${g} × 100% = ${p}%.`,
        fouten: [{ v: r(g / d0 * 100, 1), tekst: 'Je deelt de verkeerde kant op: deel ÷ geheel × 100%.', soort: 'basis' }] }; }
  ],
  // §2.1 Btw
  btw: [
    () => { const t = pick([9, 21]); const ex = ri(2, 400) * 5; const a = ex * (100 + t) / 100;
      return { type: 'num', tekst: `Een product kost € ${fmt(ex, 2)} exclusief ${t}% btw. Bereken de prijs inclusief btw.`, antwoord: a, d: 2, unit: '€', uitleg: `€ ${fmt(ex, 2)} × ${fmt(1 + t / 100, 2)} = € ${fmt(r(a, 2), 2)}.`,
        fouten: [{ v: r(ex * t / 100, 2), tekst: 'Dat is alleen het btw-bedrag. Je zocht de prijs inclusief btw.', soort: 'btw' }] }; },
    () => { const t = pick([9, 21]); const ex = ri(2, 400) * 5; const a = ex * t / 100;
      return { type: 'num', tekst: `Een product kost € ${fmt(ex, 2)} exclusief ${t}% btw. Bereken het btw-bedrag.`, antwoord: a, d: 2, unit: '€', uitleg: `${t}% van € ${fmt(ex, 2)} = € ${fmt(r(a, 2), 2)}.`,
        fouten: [{ v: r(ex * (100 + t) / 100, 2), tekst: 'Dat is de prijs inclusief btw. Je zocht alleen het btw-bedrag.', soort: 'btw' }] }; }
  ],
  // §2.2 Procentuele veranderingen
  verandering: [
    () => { const s = pick([1, -1]); const p = pick([5, 10, 12, 15, 20, 25, 30, 40]); const oud = ri(2, 90) * 100; const a = oud * (1 + s * p / 100);
      return { type: 'num', tekst: `Een prijs van € ${fmt(oud, 0)} ${s > 0 ? 'stijgt' : 'daalt'} met ${p}%. Bereken de nieuwe prijs.`, antwoord: a, d: 2, unit: '€', uitleg: `€ ${fmt(oud, 0)} × ${sf(1 + s * p / 100)} = € ${fmt(r(a, 2), 2)}.`,
        fouten: [{ v: r(oud * p / 100, 2), tekst: `Dat is alleen de ${s > 0 ? 'stijging' : 'daling'}. Je zocht de nieuwe prijs.`, soort: 'basis' }] }; },
    () => { const oud = pick([200, 400, 500, 800, 1000, 1200, 2000, 2500]); const p = pick([-40, -25, -20, -10, -5, 5, 10, 15, 20, 25, 50]); const nieuw = oud * (1 + p / 100);
      return { type: 'num', tekst: `Het aantal bezoekers verandert van ${fmt(oud, 0)} naar ${fmt(nieuw, 0)}. Bereken de procentuele verandering (bij een daling met minteken).`, antwoord: p, d: 1, unit: '%',
        uitleg: `(${fmt(nieuw, 0)} − ${fmt(oud, 0)}) ÷ ${fmt(oud, 0)} × 100% = ${p}%.`, fouten: [{ v: r((nieuw - oud) / nieuw * 100, 1), tekst: 'Je deelt door de nieuwe waarde. Deel door de oude waarde.', soort: 'basis' }] }; },
    () => { const s = pick([1, -1]); const p = pick([2, 3, 4, 5, 8, 12, 15, 20, 25, 35]); const a = 1 + s * p / 100;
      return { type: 'num', tekst: `Een bedrag ${s > 0 ? 'stijgt' : 'daalt'} met ${p}%. Wat is de groeifactor?`, antwoord: a, d: 2, exact: true, unit: '', uitleg: `1 ${s > 0 ? '+' : '−'} ${sf(p / 100)} = ${sf(a)}.` }; }
  ],
  // §2.3 Procentpunten
  pp: [
    () => { const [wat, lo, hi] = pick([['De werkloosheid', 3, 9], ['De rente', 1, 6], ['Het marktaandeel', 10, 40]]); const a = ri(lo * 2, hi * 2) / 2; let b; do { b = ri(lo * 2, hi * 2) / 2; } while (b === a);
      return { type: 'num', tekst: `${wat} gaat van ${fmt(a, 1)}% naar ${fmt(b, 1)}%. Hoeveel procentpunt is de verandering? (bij een daling met minteken)`, antwoord: b - a, d: 1, unit: 'procentpunt', uitleg: `${fmt(b, 1)} − ${fmt(a, 1)} = ${fmt(b - a, 1)} procentpunt.` }; },
    () => { const [a, b] = pick([[4, 5], [5, 6], [2, 3], [8, 6], [10, 12], [5, 4], [20, 25], [4, 3]]); const ans = (b - a) / a * 100;
      return { type: 'num', tekst: `De rente ${b > a ? 'stijgt' : 'daalt'} van ${a}% naar ${b}%. Met hoeveel procent verandert de rente? (bij een daling met minteken)`, antwoord: ans, d: 1, unit: '%',
        uitleg: `(${b} − ${a}) ÷ ${a} × 100% = ${fmt(r(ans, 1), 1)}%.`, fouten: [{ v: b - a, tekst: 'Dat is het verschil in procentpunten. In procenten deel je door de oude waarde.', soort: 'pp' }] }; }
  ]
};
const DUEL_ONDERWERPEN = [
  { id: 'afr', h: 1, par: '1.1', naam: 'Afronden', vb: 'Rond 4,567 af op één decimaal.' },
  { id: 'groot', h: 1, par: '1.2', naam: 'Grote getallen', vb: 'Schrijf € 3,5 miljard voluit.' },
  { id: 'procent', h: 2, par: '2.1', naam: 'Procent van een bedrag', vb: 'Bereken 15% van € 240.' },
  { id: 'btw', h: 2, par: '2.1', naam: 'Btw', vb: 'Prijs € 50 excl. 21% btw: prijs incl. btw?' },
  { id: 'verandering', h: 2, par: '2.2', naam: 'Procentuele verandering', vb: 'Een prijs van € 400 stijgt met 10%: nieuwe prijs?' },
  { id: 'pp', h: 2, par: '2.3', naam: 'Procentpunten', vb: 'Rente van 4% naar 5%: hoeveel procentpunt?' }
];
function duelSom(ondId) { const g = pick(S[ondId])(); g.tags = [ondId]; return g; }
// 'afr,btw' -> ['afr','btw']; oude waarden (h1, h2, 1.1 …) worden omgezet
function duelKeuze(o) {
  const OUD = { h1: ['afr', 'groot'], h2: ['procent', 'btw', 'verandering', 'pp'], '1.1': ['afr'], '1.2': ['groot'], '1.3': ['afr', 'groot'], '2.1': ['procent', 'btw'], '2.2': ['verandering'], '2.3': ['pp'], '2.4': ['procent', 'btw', 'verandering', 'pp'] };
  const lijst = String(o || '').split(',').flatMap(x => OUD[x] || [x]).filter(x => S[x]);
  return [...new Set(lijst)];
}
global.RKDUEL = { S, DUEL_ONDERWERPEN, duelSom, duelKeuze };
})(typeof window !== 'undefined' ? window : globalThis);
