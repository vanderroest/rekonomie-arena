/* Rekonomie Arena – nakijkmotor (invoer lezen, controleren, antwoord tonen) */
(function (global) {
'use strict';
const { r, fmt } = global.RK.util;
const WOORDEN = [['biljoen', 1e12], ['miljard', 1e9], ['miljoen', 1e6], ['duizend', 1e3]];
const SCALEWOORD = { 1e3: 'duizend', 1e6: 'miljoen', 1e9: 'miljard', 1e12: 'biljoen' };
const KEUZE_EENHEDEN = ['€', '$', '%', 'procentpunt'];

/* Lees een getal zoals een leerling het typt: "1.234,56", "1234.56", "-2,9", "588,7 miljard", "€ 17,00", "12 %".
   Geeft [hoofdinterpretatie, alternatieve interpretatie] terug (punt als decimaalteken). */
function parseNum(input) {
  if (input == null) return [NaN, NaN];
  let s = String(input).toLowerCase().trim()
    .replace(/[−–—]/g, '-')          // allerlei mintekens
    .replace(/€|\$|euro'?s?|dollars?|procentpunten|procentpunt|pp|%|procent/g, '')
    .replace(/ /g, ' ').trim();
  let mult = 1;
  for (const [w, m] of WOORDEN) { const i = s.indexOf(w); if (i > 0) { mult = m; s = s.slice(0, i); break; } }
  s = s.replace(/[a-z\u00c0-\u024f]+\.?/g, ' ').trim();       // overige woorden (jaar, stuks, liter…) weglaten
  s = s.replace(/\s+/g, '').replace(/'/g, '');
  if (s === '' || s === '-') return [NaN, NaN];
  let main, alt = NaN;
  if (s.includes(',')) {
    const t = s.replace(/\./g, '').replace(',', '.');
    if (!/^-?\d*\.?\d+$/.test(t)) return [NaN, NaN];
    main = parseFloat(t);
  } else if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) {
    main = parseFloat(s.replace(/\./g, ''));
    if (/^-?\d{1,3}\.\d{3}$/.test(s)) alt = parseFloat(s); // 1.005 kan ook 1,005 bedoeld zijn
  } else {
    if (!/^-?\d*\.?\d+$/.test(s)) return [NaN, NaN];
    main = parseFloat(s);
  }
  return [main * mult, isNaN(alt) ? NaN : alt * mult];
}

const half = d => 0.5 * Math.pow(10, -d) * (1 + 1e-9) + 1e-12;

/* Acceptabele waarden: [{v, t}] */
function accepts(q) {
  const out = [];
  if (q.scale) {
    const ds = q.ds ?? 1; const tS = q.tolS ?? half(ds);
    const vS = r(q.antwoord / q.scale, ds);
    out.push({ v: vS, t: tS });                         // in miljoenen/miljarden
    out.push({ v: vS * q.scale, t: tS * q.scale });     // voluit
  } else {
    const d = q.d ?? 1;
    const t = q.exact ? 1e-9 * Math.max(1, Math.abs(q.antwoord)) : (q.tol ?? half(d));
    out.push({ v: r(q.antwoord, d), t });
  }
  if (q.sign === 'abs') out.slice().forEach(a => out.push({ v: -a.v, t: a.t }));
  return out;
}
const matchAny = (x, list) => list.some(a => Math.abs(x - a.v) <= a.t);

/* Bekende fouten, zonder fouten die (na afronding) samenvallen met het juiste antwoord */
function fouten(q) {
  const acc = accepts(q);
  return (q.fouten || []).filter(f => f && !matchAny(f.v, acc) && !(q.scale && matchAny(f.v * q.scale, acc)));
}

/* Controleer een antwoord. Resultaat: {status: 'goed'|'fout'|'bijna'|'eenheid'|'leeg'|'kies-eenheid', tekst, soort} */
function check(q, input, unitChosen) {
  if (q.type === 'mc') {
    if (input === null || input === undefined || input === '') return { status: 'leeg', tekst: 'Kies een antwoord.' };
    return +input === q.juist ? { status: 'goed' } : { status: 'fout', tekst: 'Dat is niet juist.', soort: null };
  }
  const [x, alt] = parseNum(input);
  if (isNaN(x)) return { status: 'leeg', tekst: 'Typ een getal, bijvoorbeeld 12,5 of 1.250.' };
  const acc = accepts(q);
  let ok = matchAny(x, acc) || (!isNaN(alt) && matchAny(alt, acc));
  const vx = ok && !matchAny(x, acc) ? alt : x;
  const needUnit = KEUZE_EENHEDEN.includes(q.unit);
  if (ok) {
    if (needUnit && !unitChosen) return { status: 'kies-eenheid', tekst: 'Het getal klopt! Kies nog de juiste eenheid.' };
    if (needUnit && unitChosen !== q.unit) return { status: 'eenheid', tekst: `Het getal klopt, maar de eenheid niet. Wat heb je berekend: ${unitChosen === '%' ? 'een percentage of procentpunten' : 'een bedrag of een percentage'}?`, soort: 'eenheid' };
    return { status: 'goed', waarde: vx };
  }
  // bekende fouten
  for (const f of fouten(q)) {
    const t = f.t ?? Math.max(acc[0].t, Math.abs(f.v) * 1e-6);
    const xs = [x, alt].filter(v => !isNaN(v));
    if (xs.some(v => Math.abs(v - f.v) <= t || (q.scale && Math.abs(v - f.v * q.scale) <= t * q.scale))) return { status: 'fout', tekst: f.tekst, soort: f.soort || null };
  }
  // teken
  if (q.sign !== 'abs' && matchAny(-x, acc)) return { status: 'fout', tekst: 'Let op het teken: is het een stijging (+) of een daling (−)?', soort: 'teken' };
  // bijna goed (afronding) of verkeerd afgerond
  const xa = q.sign === 'abs' ? Math.abs(x) : x;
  const refs = q.scale ? [q.antwoord / q.scale, q.antwoord] : [q.antwoord];
  const d = q.scale ? (q.ds ?? 1) : (q.d ?? 1);
  if (q.exact) {
    const tgt = r(q.antwoord, d);
    if (Math.abs(xa - tgt) <= Math.pow(10, -d) * 1.0001) return { status: 'fout', tekst: 'Net niet. Kijk naar welk cijfer je moet kijken en welke kant je op moet afronden.', soort: 'afronden' };
  } else if (refs.some(ref => Math.abs(xa - ref) <= Math.abs(ref) * 0.01)) {
    return { status: 'bijna', tekst: `Bijna! Controleer je afronding: ${d === 0 ? 'rond af op een heel getal' : 'rond af op ' + d + (d === 1 ? ' decimaal' : ' decimalen')}${q.unit === '€' && d === 2 ? ' (geldbedrag: in centen)' : ''}, en rond niet tussentijds af.`, soort: 'afronden' };
  }
  const full = refs[refs.length - 1];
  if (Math.abs(full) > 0 && xa !== 0) {
    const ratio = Math.abs(xa / full);
    for (const k of [1e3, 1e6, 1e9]) {
      if (Math.abs(ratio / k - 1) < 0.01 || Math.abs(ratio * k - 1) < 0.01) return { status: 'fout', tekst: 'Je zit er een factor ' + fmt(k, 0) + ' naast. Tel de nullen goed (duizend, miljoen, miljard).', soort: 'nullen' };
    }
    if (!q.scale && (Math.abs(ratio / 100 - 1) < 0.01 || Math.abs(ratio * 100 - 1) < 0.01)) return { status: 'fout', tekst: 'Je zit er een factor 100 naast. Denk aan × 100% (of deel een percentage door 100).', soort: 'formule' };
  }
  return { status: 'fout', tekst: 'Dat klopt nog niet.', soort: null };
}

/* Juiste antwoord als tekst */
function antwoordTekst(q) {
  if (q.type === 'mc') return q.opties[q.juist];
  if (q.type === 'open') return q.model;
  let s;
  if (q.scale) s = fmt(r(q.antwoord / q.scale, q.ds ?? 1), q.ds ?? 1) + ' ' + SCALEWOORD[q.scale];
  else s = fmt(r(q.antwoord, q.d ?? 1), q.d ?? 1);
  if (q.sign === 'abs' && s.startsWith('-')) s = s.slice(1);
  if (q.unit === '€' || q.unit === '$') return q.unit + ' ' + s;
  if (q.unit === '%') return s + '%';
  if (q.unit) return s + ' ' + q.unit;
  return s;
}

/* Vraag omzetten naar het formaat voor de klassikale strijd (server kijkt na) */
function toBattle(q) {
  const b = { tekst: q.tekst, type: q.type === 'mc' ? 'mc' : 'num', unit: q.unit || '', antwoordTekst: antwoordTekst(q), uitleg: q.uitleg || '' };
  if (q.context) b.context = q.context;
  if (q.type === 'mc') { b.opties = q.opties; b.juist = q.juist; }
  else {
    b.accept = accepts(q).map(a => ({ v: +a.v.toPrecision(15), t: +a.t.toPrecision(6) }));
    b.fouten = fouten(q).map(f => ({ v: f.v, t: f.t ?? Math.max(accepts(q)[0].t, Math.abs(f.v) * 1e-6), tekst: f.tekst.replace(/<[^>]+>/g, '') }));
  }
  return b;
}

global.RK.engine = { parseNum, check, fouten, accepts, antwoordTekst, toBattle, KEUZE_EENHEDEN };
})(typeof window !== 'undefined' ? window : globalThis);
