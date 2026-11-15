/* Rekonomie Arena – lesstof H1 en H2 (Rekonomie VWO, LWEO 4e druk)
   Theorie en opdrachtteksten zijn in eigen woorden samengevat; de leerling heeft het boekje als naslag.
   Vraagtypen: num (getal), mc (meerkeuze), open (zelf nakijken met modelantwoord). */
(function (global) {
'use strict';

/* ---------- hulpfuncties ---------- */
const r = (x, d) => { const f = Math.pow(10, d); return Math.round((x + Math.sign(x) * 1e-9) * f) / f; };
const fmt = (x, d) => Number(x).toLocaleString('nl-NL', { minimumFractionDigits: d, maximumFractionDigits: d });
const eur = (x, d = 2) => '€ ' + fmt(x, d);
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const pct = (deel, geheel) => deel / geheel * 100;
const sf = x => Number(x).toLocaleString('nl-NL', { maximumFractionDigits: 4 });

/* ---------- THEORIE ---------- */
const T = {};
T['1.1'] = `
<h3>Afronden: de regel</h3>
<p>Je kijkt naar het eerste cijfer <b>ná</b> de plek waarop je afrondt.</p>
<ul><li>0, 1, 2, 3 of 4 → naar beneden afronden</li><li>5, 6, 7, 8 of 9 → naar boven afronden</li></ul>
<div class="vb"><b>Voorbeeld.</b> 7,3649 op twee decimalen: kijk naar het derde cijfer achter de komma (4) → <b>7,36</b>.<br>
Op één decimaal: kijk naar het tweede cijfer (6) → <b>7,4</b>.<br>
3.482 op honderdtallen: kijk naar het tiental (8) → <b>3.500</b>.</div>
<h3>Afspraken bij economie</h3>
<ul>
<li>Staat er niet bij hoe je moet afronden? Dan rond je af op <b>één decimaal</b>.</li>
<li>Geldbedragen rond je altijd af op <b>twee decimalen</b> (centen), ook als de laatste een nul is: € 3,40 en niet € 3,4.</li>
<li><b>Niet tussentijds afronden.</b> Reken door met het volledige getal op je rekenmachine en rond pas het eindantwoord af.</li>
<li>Rond ook niet <b>twee keer</b> af. 6,45 op een heel getal is 6 (je kijkt naar de 4). Wie eerst 6,5 maakt en daarna 7, rondt twee keer af.</li>
</ul>
<div class="vb"><b>Waarom niet tussendoor afronden?</b> (17,3 / 6) × 9.000 = 2,88333… × 9.000 = 25.950.<br>
Rond je tussendoor af op 2,9, dan krijg je 26.100: dat is € 150 te veel.</div>
<h3>Laat zien wat je doet</h3>
<p>Schrijf altijd je berekening op en zet de <b>eenheid</b> bij je antwoord: €, $, %, stuks, jaren, per persoon… In deze app kies je daarom ook de eenheid.</p>`;

T['1.2'] = `
<h3>Hoeveel nullen?</h3>
<table class="tt"><tr><th>woord</th><th>nullen</th><th>voluit</th></tr>
<tr><td>duizend</td><td>3</td><td>1.000</td></tr>
<tr><td>miljoen</td><td>6</td><td>1.000.000</td></tr>
<tr><td>miljard</td><td>9</td><td>1.000.000.000</td></tr>
<tr><td>biljoen</td><td>12</td><td>1.000.000.000.000</td></tr></table>
<div class="vb"><b>Voorbeeld.</b> € 3,75 miljard = € 3.750.000.000 (de komma schuift negen plaatsen op).</div>
<h3>Rekenen zonder alle nullen in te toetsen</h3>
<p>Tel de nullen apart en reken alleen met de "kale" getallen.</p>
<ul>
<li>biljoen ÷ miljoen = miljoen &nbsp;·&nbsp; biljoen ÷ miljard = duizend</li>
<li>miljard ÷ miljoen = duizend &nbsp;·&nbsp; miljard ÷ duizend = miljoen &nbsp;·&nbsp; miljoen ÷ duizend = duizend</li>
<li>duizend × miljard = biljoen &nbsp;·&nbsp; duizend × miljoen = miljard &nbsp;·&nbsp; duizend × duizend = miljoen</li>
</ul>
<div class="vb"><b>Delen.</b> € 24 miljard ÷ 8 miljoen inwoners = (24 ÷ 8) × duizend = <b>€ 3.000</b> per inwoner.<br>
<b>Vermenigvuldigen.</b> € 30 miljoen × 4.000 = 120.000 miljoen = <b>€ 120 miljard</b>.</div>
<h3>Rekenmachine</h3>
<p>Zie je iets als <b>2,4E10</b> of <b>2,4×10<sup>10</sup></b>? Dan staan er 10 nullen-plaatsen achter de 2: 2,4 × 10<sup>10</sup> = 24.000.000.000.</p>
<p class="tip">In deze app mag je ook typen: <b>588,7 miljard</b> of <b>1 biljoen</b>.</p>`;

T['1.3'] = `
<h3>Zelftest hoofdstuk 1 – eindbaas</h3>
<p>Hier komt alles uit hoofdstuk 1 samen. Herhaal kort:</p>
<ul><li>Afronden: kijk naar het eerstvolgende cijfer (0–4 omlaag, 5–9 omhoog).</li>
<li>Op honderden/duizenden afronden: kijk naar het tiental/honderdtal.</li>
<li>Geld: twee decimalen. Niet tussentijds afronden.</li>
<li>Grote getallen: tel de nullen (miljoen 6, miljard 9, biljoen 12) en reken met kale getallen.</li>
<li>Let op eenheden: km en meter verschillen een factor 1.000.</li></ul>`;

T['2.1'] = `
<h3>Van getal naar percentage</h3>
<p>Een percentage zegt hoe groot een <b>deel</b> is ten opzichte van een <b>geheel</b>. Het geheel is de <b>basis</b> en stel je op 100%.</p>
<p class="formule">percentage = (deel ÷ geheel) × 100%</p>
<div class="vb"><b>Voorbeeld.</b> Sanne verdient € 520 per maand en geeft € 130 uit aan haar telefoon en kleding.<br>
(130 ÷ 520) × 100% = <b>25%</b> van haar inkomen.</div>
<p>Of met een verhoudingstabel:</p>
<table class="tt"><tr><th></th><th>deel</th><th>geheel</th></tr><tr><td>getal</td><td>130</td><td>520</td></tr><tr><td>procent</td><td>?</td><td>100</td></tr></table>
<p>Kruislings: ? = 130 × 100 ÷ 520 = 25.</p>
<h3>Van percentage naar getal</h3>
<p class="formule">deel = (percentage ÷ 100) × geheel</p>
<div class="vb">35% van € 2.400 = 0,35 × 2.400 = <b>€ 840</b>.</div>
<h3>Btw</h3>
<p>Btw komt <b>bovenop</b> de prijs exclusief btw. Tarieven: <b>9%</b> (eerste levensbehoeften, zoals voedsel) en <b>21%</b> (overige producten).</p>
<table class="tt"><tr><td>prijs exclusief btw</td><td>100%</td></tr><tr><td>btw</td><td>21%</td></tr><tr><td>prijs inclusief btw</td><td>121%</td></tr></table>
<div class="vb"><b>Voorbeeld.</b> Een koptelefoon kost € 72,60 inclusief 21% btw.<br>
1% = 72,60 ÷ 121 = 0,60 → btw = 21 × 0,60 = <b>€ 12,60</b>; exclusief btw = 100 × 0,60 = <b>€ 60,00</b>.</div>
<p class="let">Let op: de btw is <b>niet</b> 21% van de prijs inclusief btw! De basis (100%) is de prijs exclusief btw.</p>
<h3>Altijd eerst: wat is de basis?</h3>
<p>Vraag je bij elke procentsom af welk bedrag 100% is. Na 30% aflossen is de restschuld 70% van de oorspronkelijke lening, dus lening = restschuld ÷ 70 × 100.</p>`;

T['2.2'] = `
<h3>Groeifactor</h3>
<p>Bij een stijging of daling met een percentage vermenigvuldig je met de <b>groeifactor</b>.</p>
<p class="formule">groeifactor = (100 + stijging) ÷ 100 &nbsp;of&nbsp; (100 − daling) ÷ 100</p>
<table class="tt"><tr><th>verandering</th><th>groeifactor</th></tr>
<tr><td>+4%</td><td>1,04</td></tr><tr><td>+0,5%</td><td>1,005</td></tr><tr><td>+120%</td><td>2,20</td></tr><tr><td>−15%</td><td>0,85</td></tr><tr><td>−99%</td><td>0,01</td></tr></table>
<p class="formule">nieuw = oud × groeifactor</p>
<div class="vb"><b>Voorbeeld.</b> € 800 sparen tegen 3% rente: na 1 jaar 800 × 1,03 = € 824,00; na 4 jaar 800 × 1,03<sup>4</sup> = <b>€ 900,41</b>.</div>
<h3>Procentuele verandering</h3>
<p class="formule">procentuele verandering = (nieuw − oud) ÷ oud × 100%</p>
<div class="vb">Omzet van € 2,5 miljoen naar € 2,8 miljoen: (2,8 − 2,5) ÷ 2,5 × 100% = <b>+12%</b>.<br>Een negatieve uitkomst is een daling.</div>
<h3>"Hoeveel procent meer/minder dan…"</h3>
<p>Het getal ná <b>"dan"</b> is de basis (oud).</p>
<div class="vb">Lisa verdient € 50, Tim € 40.<br>Lisa verdient (50 − 40) ÷ <b>40</b> × 100% = <b>25% meer</b> dan Tim.<br>Tim verdient (40 − 50) ÷ <b>50</b> × 100% = −20%, dus <b>20% minder</b> dan Lisa.</div>
<h3>Terugrekenen</h3>
<p>Is de nieuwe waarde bekend en de procentuele verandering ook? Dan deel je door de groeifactor:</p>
<p class="formule">oud = nieuw ÷ groeifactor</p>
<div class="vb">Na een stijging van 8% is de omzet € 432.000. Vorig jaar: 432.000 ÷ 1,08 = <b>€ 400.000</b>.<br>
Fout is: 432.000 × 0,92 (dan neem je de verkeerde basis).</div>`;

T['2.3'] = `
<h3>Procent of procentpunt?</h3>
<p>Als een <b>percentage</b> verandert, kun je die verandering op twee manieren uitdrukken:</p>
<ul><li><b>Procentpunten</b>: gewoon het verschil tussen de twee percentages (nieuw − oud).</li>
<li><b>Procenten</b>: de procentuele verandering met de formule (nieuw − oud) ÷ oud × 100%.</li></ul>
<div class="vb"><b>Voorbeeld.</b> De werkloosheid stijgt van 4% naar 5%.<br>
Dat is een stijging van <b>1 procentpunt</b>,<br>maar ook van (5 − 4) ÷ 4 × 100% = <b>25%</b>.</div>
<p class="let">Een veelgemaakte fout (ook in kranten): "daalde met 1,3%" schrijven als een percentage van 26% naar 24,7% gaat. Dat is een daling van 1,3 procent<b>punt</b>, maar 5% in procenten.</p>`;

T['2.4'] = `
<h3>Zelftest hoofdstuk 2 – eindbaas</h3>
<ul><li>Bepaal eerst de <b>basis</b> (100%).</li>
<li>Deel ÷ geheel × 100% · nieuw = oud × groeifactor · oud = nieuw ÷ groeifactor.</li>
<li>(nieuw − oud) ÷ oud × 100%; bij "meer/minder dan X" is X de basis.</li>
<li>Btw: exclusief = 100%, inclusief = 109% of 121%.</li>
<li>Korting van 20%: je betaalt 80% van de oude prijs.</li>
<li>Verschil tussen twee percentages → procentpunten.</li>
<li>Prijzen van verschillende hoeveelheden vergelijken? Reken eerst om naar een prijs per eenheid (per gram, per stuk).</li></ul>`;

/* ---------- BOEKOPDRACHTEN ---------- */
// Velden num: antwoord (onafgeronde waarde), d (decimalen), exact, unit, scale/ds/tolS, sign ('abs'), tol, fouten [{v,tekst,soort}]
const PAR = [
 { id: '1.1', h: 1, titel: 'Afronden', p: '5–6', theorie: T['1.1'], gens: ['afr_dec', 'afr_tal', 'afr_cijfer', 'afr_tussen', 'afr_geld'], opdrachten: [
  { nr: '1.1', p: 5, context: 'Peter staat gemiddeld een 5,45 voor economie. Op zijn school worden rapportcijfers afgerond op hele getallen.', vragen: [
   { id: '1.1a', type: 'num', tekst: 'Welk cijfer komt er op het rapport als 5,45 direct op een heel getal wordt afgerond?', antwoord: 5, d: 0, exact: true, unit: 'cijfer',
     hint: 'Bij afronden op een heel getal kijk je alleen naar het eerste cijfer achter de komma.', uitleg: 'Het eerste cijfer na de komma is een 4 → naar beneden: 5. Peter heeft dus een onvoldoende.',
     fouten: [{ v: 6, tekst: 'Je hebt twee keer afgerond (5,45 → 5,5 → 6). Kijk alleen naar het eerste cijfer achter de komma: dat is een 4.', soort: 'afronden' }], tags: ['afronden'] },
   { id: '1.1b', type: 'num', tekst: 'Docenten leveren het cijfer eerst in met één decimaal; daarna rondt de computer af op een heel getal. Welk cijfer krijgt Peter nu?', antwoord: 6, d: 0, exact: true, unit: 'cijfer',
     hint: 'Rond 5,45 eerst af op één decimaal. Rond dat resultaat daarna af op een heel getal.', uitleg: '5,45 op één decimaal = 5,5 (de tweede decimaal is een 5). 5,5 op een heel getal = 6. Door twee keer af te ronden krijgt Peter toch een voldoende.', tags: ['afronden'] }
  ]},
  { nr: '1.2', p: 5, context: 'Het schoolexamen (SE) en het centraal examen (CE) tellen even zwaar. Het gemiddelde wordt afgerond op een heel cijfer.', vragen: [
   { id: '1.2a', type: 'mc', tekst: 'Leonie haalt een 5,8 voor het SE en een 5,1 voor het CE. Haalt zij een voldoende op haar eindlijst?', opties: ['Ja, ze krijgt een 6', 'Nee, ze krijgt een 5'], juist: 1,
     hint: 'Bereken eerst het gemiddelde van 5,8 en 5,1.', uitleg: '(5,8 + 5,1) ÷ 2 = 5,45. Afronden op een heel getal: kijk naar de 4 → 5. Geen voldoende.', tags: ['afronden'] },
   { id: '1.2b', type: 'num', tekst: 'Karim haalt een 7,4 voor het SE en een 7,5 voor het CE. Bereken zijn eindcijfer.', antwoord: 7, d: 0, exact: true, unit: 'cijfer',
     hint: 'Gemiddelde berekenen en dan één keer afronden op een heel getal.', uitleg: '(7,4 + 7,5) ÷ 2 = 7,45 → kijk naar de 4 → eindcijfer 7.',
     fouten: [{ v: 8, tekst: 'Je rondt twee keer af (7,45 → 7,5 → 8). Kijk alleen naar het eerste cijfer achter de komma.', soort: 'afronden' }], tags: ['afronden'] }
  ]},
  { nr: '1.3', p: 5, context: 'Gegeven is het getal 13.549,285649.', vragen: [
   { id: '1.3a', type: 'num', tekst: 'Rond af op vier decimalen.', antwoord: 13549.2856, d: 4, exact: true, unit: '',
     hint: 'Kijk naar de vijfde decimaal.', uitleg: 'Decimalen: 2 8 5 6 | 4 9. De vijfde decimaal is een 4 → omlaag: 13.549,2856.',
     fouten: [{ v: 13549.2857, tekst: 'Je hebt naar de zesde decimaal gekeken. Kijk alleen naar de vijfde decimaal (een 4).', soort: 'afronden' }], tags: ['afronden'] },
   { id: '1.3b', type: 'num', tekst: 'Rond af op een heel getal.', antwoord: 13549, d: 0, exact: true, unit: '',
     hint: 'Kijk naar het eerste cijfer achter de komma.', uitleg: 'Het eerste cijfer achter de komma is een 2 → omlaag: 13.549.', tags: ['afronden'] },
   { id: '1.3c', type: 'num', tekst: 'Rond af op duizendtallen.', antwoord: 14000, d: 0, exact: true, unit: '',
     hint: 'Kijk naar het cijfer van de honderdtallen.', uitleg: '13.549: het honderdtal is een 5 → omhoog: 14.000.',
     fouten: [{ v: 13000, tekst: 'Het honderdtal is een 5, dus je rondt naar boven af.', soort: 'afronden' }, { v: 13.549, tekst: 'Op duizendtallen afronden betekent: een getal eindigend op 000 (bijvoorbeeld 13.000 of 14.000).', soort: 'afronden' }], tags: ['afronden'] }
  ]},
  { nr: '1.4', p: 5, context: 'De juiste uitkomst van (32,7 ÷ 5) × 12.500 is 6,54 × 12.500 = 81.750. Kijk wat er gebeurt als je tussendoor afrondt.', vragen: [
   { id: '1.4a', type: 'num', tekst: 'Bereken de uitkomst als je 32,7 ÷ 5 tussendoor afrondt op één decimaal.', antwoord: 6.5 * 12500, d: 0, unit: '',
     hint: '32,7 ÷ 5 = 6,54. Rond dat af op één decimaal en vermenigvuldig dan met 12.500.', uitleg: '6,54 → 6,5. 6,5 × 12.500 = 81.250 (dat is 500 minder dan het juiste antwoord).', tags: ['afronden'] },
   { id: '1.4b', type: 'num', tekst: 'Bereken de uitkomst als je 32,7 ÷ 5 tussendoor afrondt op een heel getal.', antwoord: 7 * 12500, d: 0, unit: '',
     hint: '6,54 op een heel getal afronden en dan × 12.500.', uitleg: '6,54 → 7. 7 × 12.500 = 87.500. Een verschil van 5.750 met het juiste antwoord: rond dus niet tussendoor af!', tags: ['afronden'] }
  ]},
  { nr: '1.5', p: 6, context: 'Drie docenten schrijven samen een examenboek. Het boek kost € 15,95 en er worden 8.200 exemplaren verkocht. De totale kosten zijn € 86.500. De winst verdelen de drie schrijvers gelijk.', vragen: [
   { id: '1.5a', type: 'num', tekst: 'Bereken de totale opbrengst van de verkoop.', antwoord: 15.95 * 8200, d: 2, unit: '€', hint: 'Opbrengst = prijs × aantal.', uitleg: '€ 15,95 × 8.200 = € 130.790,00.', tags: [] },
   { id: '1.5b', type: 'num', tekst: 'Bereken de totale winst.', antwoord: 15.95 * 8200 - 86500, d: 2, unit: '€', hint: 'Winst = opbrengst − kosten.', uitleg: '€ 130.790 − € 86.500 = € 44.290,00.', tags: [] },
   { id: '1.5c', type: 'num', tekst: 'Bereken hoeveel winst elke schrijver ontvangt.', antwoord: (15.95 * 8200 - 86500) / 3, d: 2, unit: '€', hint: 'Deel de winst door 3 en rond af op centen.', uitleg: '€ 44.290 ÷ 3 = € 14.763,33 (geld: twee decimalen).', tags: ['afronden'] }
  ]}
 ]},

 { id: '1.2', h: 1, titel: 'Rekenen met grote getallen', p: '6–7', theorie: T['1.2'], gens: ['gr_voluit', 'gr_inw', 'gr_maal', 'gr_deel'], opdrachten: [
  { nr: '1.6', p: 6, context: 'Bbp in 2020: Verenigde Staten $ 20,94 biljoen, China $ 17,72 biljoen, India $ 2,623 biljoen en Nederland $ 912,2 miljard. Om landen te kunnen vergelijken, zijn alle bedragen omgerekend in dollars (ook die van Nederland). Schrijf de bedragen voluit, dus met alle nullen.', vragen: [
   { id: '1.6a', type: 'num', tekst: 'Verenigde Staten: $ 20,94 biljoen voluit.', antwoord: 20.94e12, d: 0, exact: true, unit: '$', voluit: true, hint: 'Biljoen heeft 12 nullen: schuif de komma 12 plaatsen naar rechts.', uitleg: '$ 20.940.000.000.000', tags: ['nullen'],
     fouten: [{ v: 20.94e9, tekst: 'Dat is 20,94 miljard. Biljoen heeft 12 nullen, niet 9.', soort: 'nullen' }] },
   { id: '1.6b', type: 'num', tekst: 'China: $ 17,72 biljoen voluit.', antwoord: 17.72e12, d: 0, exact: true, unit: '$', voluit: true, hint: '12 plaatsen opschuiven.', uitleg: '$ 17.720.000.000.000', tags: ['nullen'], fouten: [{ v: 17.72e9, tekst: 'Biljoen heeft 12 nullen, niet 9.', soort: 'nullen' }] },
   { id: '1.6c', type: 'num', tekst: 'India: $ 2,623 biljoen voluit.', antwoord: 2.623e12, d: 0, exact: true, unit: '$', voluit: true, hint: 'Let op: drie cijfers achter de komma.', uitleg: '$ 2.623.000.000.000', tags: ['nullen'], fouten: [{ v: 2.623e9, tekst: 'Biljoen heeft 12 nullen, niet 9.', soort: 'nullen' }] },
   { id: '1.6d', type: 'num', tekst: 'Nederland: $ 912,2 miljard voluit.', antwoord: 912.2e9, d: 0, exact: true, unit: '$', voluit: true, hint: 'Miljard heeft 9 nullen.', uitleg: '$ 912.200.000.000', tags: ['nullen'], fouten: [{ v: 912.2e12, tekst: 'Dat is biljoen. Miljard heeft 9 nullen.', soort: 'nullen' }] }
  ]},
  { nr: '1.7', p: 6, context: 'China: bbp $ 17,72 biljoen en 1,4 miljard inwoners.', vragen: [
   { id: '1.7a', type: 'num', tekst: 'Bereken het bbp van China per inwoner.', antwoord: 17.72e12 / 1.4e9, d: 2, unit: '$', hint: 'Biljoen ÷ miljard = duizend. Dus 17,72 ÷ 1,4 en dan × 1.000.', uitleg: '17,72 ÷ 1,4 = 12,657… → × 1.000 = $ 12.657,14 per inwoner.', tags: ['nullen'],
     fouten: [{ v: r(17.72 / 1.4, 2), tekst: 'Vergeet de nullen niet: biljoen ÷ miljard = duizend.', soort: 'nullen' }, { v: r(17.72e12 / 1.4e9 * 1000, 2), tekst: 'Te veel nullen: biljoen (12) ÷ miljard (9) laat 3 nullen over.', soort: 'nullen' }] },
   { id: '1.7b', type: 'num', tekst: 'Iemand heeft $ 17,72 biljoen en geeft elke seconde $ 1.000 uit. Hoeveel jaar kan hij dat volhouden? Rond af op hele jaren (1 jaar = 365 dagen).', antwoord: 17.72e12 / 1000 / (365 * 24 * 3600), d: 0, unit: 'jaar',
     hint: 'Bereken eerst het aantal seconden: 17,72 biljoen ÷ 1.000. Hoeveel seconden zitten er in een jaar?', uitleg: '17,72 biljoen ÷ 1.000 = 17,72 miljard seconden. Een jaar = 365 × 24 × 60 × 60 = 31.536.000 s. 17.720.000.000 ÷ 31.536.000 = 561,9 → 562 jaar.', tags: ['nullen'] }
  ]},
  { nr: '1.8', p: 7, context: 'Inwoners in 2020: VS 332,6 miljoen, India 1,326 miljard, Nederland 17,28 miljoen. Gebruik het bbp uit opdracht 1.6 (omgerekend in dollars).', vragen: [
   { id: '1.8a', type: 'num', tekst: 'Bereken het bbp per inwoner van de VS.', antwoord: 20.94e12 / 332.6e6, d: 2, unit: '$', hint: 'Biljoen ÷ miljoen = miljoen. 20,94 ÷ 332,6 en dan × 1.000.000.', uitleg: '20,94 ÷ 332,6 = 0,06296 → × 1.000.000 = $ 62.958,51.', tags: ['nullen'] },
   { id: '1.8b', type: 'num', tekst: 'Bereken het bbp per inwoner van India.', antwoord: 2.623e12 / 1.326e9, d: 2, unit: '$', hint: 'Biljoen ÷ miljard = duizend.', uitleg: '2,623 ÷ 1,326 = 1,97813 → × 1.000 = $ 1.978,13.', tags: ['nullen'] },
   { id: '1.8c', type: 'num', tekst: 'Bereken het bbp per inwoner van Nederland.', antwoord: 912.2e9 / 17.28e6, d: 2, unit: '$', hint: 'Miljard ÷ miljoen = duizend.', uitleg: '912,2 ÷ 17,28 = 52,789 → × 1.000 = $ 52.789,35.', tags: ['nullen'] }
  ]},
  { nr: '1.9', p: 7, context: 'Bereken. Je mag het antwoord voluit typen of met een woord, bijvoorbeeld "3 miljard".', vragen: [
   { id: '1.9a', type: 'num', tekst: '€ 200 miljoen × 5.000', antwoord: 200e6 * 5000, d: 0, unit: '€', hint: '200 × 5 = 1.000; duizend × miljoen = miljard.', uitleg: '200 miljoen × 5.000 = 1.000.000 miljoen = € 1 biljoen (€ 1.000.000.000.000).', tags: ['nullen'] },
   { id: '1.9b', type: 'num', tekst: '€ 90 × 500 miljoen', antwoord: 90 * 500e6, d: 0, unit: '€', hint: '90 × 500 = 45.000 → 45.000 miljoen.', uitleg: '45.000 miljoen = € 45 miljard (€ 45.000.000.000).', tags: ['nullen'] },
   { id: '1.9c', type: 'num', tekst: '€ 200 miljard ÷ 50 miljoen', antwoord: 200e9 / 50e6, d: 0, unit: '€', hint: 'Miljard ÷ miljoen = duizend.', uitleg: '200 ÷ 50 = 4 → × duizend = € 4.000.', tags: ['nullen'] },
   { id: '1.9d', type: 'num', tekst: '€ 40 miljoen ÷ 200.000', antwoord: 40e6 / 200000, d: 0, unit: '€', hint: 'Schrijf 200.000 als 0,2 miljoen of streep nullen weg.', uitleg: '40.000.000 ÷ 200.000 = 400 ÷ 2 = € 200.', tags: ['nullen'] }
  ]},
  { nr: '1.10', p: 7, context: 'Wereldwijd worden per dag 98 miljoen vaten olie gevraagd. Eén vat bevat 158,99 liter.', vragen: [
   { id: '1.10', type: 'num', tekst: 'Bereken de vraag naar olie per jaar (365 dagen) in biljoenen liters.', antwoord: 98e6 * 158.99 * 365, scale: 1e12, ds: 1, unit: 'liter',
     hint: 'Liters per dag = 98 miljoen × 158,99. Daarna × 365. Hoeveel biljoen is dat?', uitleg: '98 miljoen × 158,99 = 15.581 miljoen liter per dag; × 365 = 5.687.072 miljoen = 5,7 biljoen liter.', tags: ['nullen'],
     fouten: [{ v: 98e6 * 158.99 * 365 / 1e9, tekst: 'Dat is het aantal miljarden. Gevraagd is biljoenen (1 biljoen = 1.000 miljard).', soort: 'nullen' }] }
  ]}
 ]},

 { id: '1.3', h: 1, titel: 'Zelftest hoofdstuk 1', boss: true, p: '7–8', theorie: T['1.3'], gens: ['afr_dec', 'afr_tal', 'afr_tussen', 'gr_inw', 'gr_maal', 'gr_deel', 'gr_voluit'], opdrachten: [
  { nr: '1.11', p: 7, context: 'Rond af op één decimaal.', vragen: [
   { id: '1.11a', type: 'num', tekst: '102,44', antwoord: 102.4, d: 1, exact: true, unit: '', hint: 'Kijk naar het tweede cijfer achter de komma.', uitleg: '102,4|4 → 102,4', tags: ['afronden'] },
   { id: '1.11b', type: 'num', tekst: '88,76', antwoord: 88.8, d: 1, exact: true, unit: '', hint: 'Kijk naar de 6.', uitleg: '88,7|6 → 88,8', tags: ['afronden'] },
   { id: '1.11c', type: 'num', tekst: '25,449', antwoord: 25.4, d: 1, exact: true, unit: '', hint: 'Kijk alleen naar het tweede cijfer achter de komma.', uitleg: '25,4|49 → de 4 telt → 25,4.', fouten: [{ v: 25.5, tekst: 'Je hebt twee keer afgerond (25,449 → 25,45 → 25,5). Kijk alleen naar het tweede cijfer: een 4.', soort: 'afronden' }], tags: ['afronden'] },
   { id: '1.11d', type: 'num', tekst: '203,98', antwoord: 204.0, d: 1, exact: true, unit: '', hint: '203,9 + 0,1 = ?', uitleg: '203,9|8 → omhoog → 204,0.', tags: ['afronden'] }
  ]},
  { nr: '1.12', p: 7, context: 'Rond af zoals aangegeven.', vragen: [
   { id: '1.12a', type: 'num', tekst: '€ 4.680 op honderden euro\'s', antwoord: 4700, d: 0, exact: true, unit: '€', hint: 'Kijk naar het tiental.', uitleg: '4.6|80 → het tiental is 8 → € 4.700.', tags: ['afronden'] },
   { id: '1.12b', type: 'num', tekst: '€ 52.523 op honderden euro\'s', antwoord: 52500, d: 0, exact: true, unit: '€', hint: 'Kijk naar het tiental.', uitleg: '52.5|23 → het tiental is 2 → € 52.500.', tags: ['afronden'] },
   { id: '1.12c', type: 'num', tekst: '€ 8.750 op duizenden euro\'s', antwoord: 9000, d: 0, exact: true, unit: '€', hint: 'Kijk naar het honderdtal.', uitleg: '8.|750 → het honderdtal is 7 → € 9.000.', tags: ['afronden'] },
   { id: '1.12d', type: 'num', tekst: '€ 108.499,99 op duizenden euro\'s', antwoord: 108000, d: 0, exact: true, unit: '€', hint: 'Kijk alleen naar het honderdtal.', uitleg: '108.|499,99 → het honderdtal is 4 → € 108.000.', fouten: [{ v: 109000, tekst: 'Je kijkt te ver. Alleen het honderdtal (4) telt, dus naar beneden.', soort: 'afronden' }], tags: ['afronden'] }
  ]},
  { nr: '1.13', p: 7, context: 'In 2020 werd er 4.476 miljoen keer gepind, voor in totaal € 116,7 miljard.', vragen: [
   { id: '1.13', type: 'num', tekst: 'Bereken hoeveel euro er gemiddeld per keer werd gepind.', antwoord: 116.7e9 / 4476e6, d: 2, unit: '€', hint: 'Miljard ÷ miljoen = duizend: 116,7 ÷ 4.476 × 1.000.', uitleg: '116,7 ÷ 4.476 × 1.000 = € 26,07 per keer.', tags: ['nullen'],
     fouten: [{ v: r(116.7 / 4476, 2), tekst: 'Je bent de factor duizend vergeten (miljard ÷ miljoen).', soort: 'nullen' }] }
  ]},
  { nr: '1.14', p: 8, context: 'We kunnen 435.193.601.738.716.800.000.000 <b>km</b> het heelal in kijken. Eén lichtjaar is 9.460.730.472.580.800 <b>meter</b>.', vragen: [
   { id: '1.14a', type: 'mc', tekst: 'Hoeveel lichtjaren denk je dat we het heelal in kunnen kijken? (eerst schatten!)', opties: ['tussen 0 en 1.000', 'tussen 1.000 en 1 miljoen', 'tussen 1 en 100 miljoen', 'tussen 100 miljoen en 1 miljard', 'meer dan 1 miljard'], juist: 4, schatting: true,
     hint: 'Tel de cijfers: de afstand heeft 24 cijfers (in km), een lichtjaar 16 cijfers (in m).', uitleg: 'Het antwoord is ruim 46 miljard lichtjaar, dus meer dan 1 miljard. Zie de volgende vraag.', tags: ['nullen'] },
   { id: '1.14b', type: 'num', tekst: 'Bereken hoeveel lichtjaren we het heelal in kunnen kijken. Geef je antwoord in miljarden lichtjaren (heel getal).', antwoord: 435193601738716800000000 * 1000 / 9460730472580800, scale: 1e9, ds: 0, unit: 'lichtjaar',
     hint: 'Zet eerst de afstand om van km naar meter (× 1.000). Deel daarna door de lengte van een lichtjaar.', uitleg: '435.193.601.738.716.800.000.000 km = 4,352 × 10²⁶ m. Gedeeld door 9,4607 × 10¹⁵ m = 4,6 × 10¹⁰ = 46 miljard lichtjaar.', tags: ['nullen'],
     fouten: [{ v: 46e6, t: 1e6, tekst: 'Je bent de omrekening van km naar meter vergeten (× 1.000).', soort: 'nullen' }, { v: 0.046, t: 0.001, tekst: 'Je bent de omrekening van km naar meter vergeten (× 1.000).', soort: 'nullen' }] }
  ]}
 ]},

 { id: '2.1', h: 2, titel: 'Rekenen met procenten', p: '9–11', theorie: T['2.1'], gens: ['p_deel', 'p_van', 'btw_incl', 'btw_bedrag', 'btw_excl', 'p_terug'], opdrachten: [
  { nr: '2.1', p: 9, context: 'Pieter verdient € 3.000 per maand, Marieke € 4.000.', vragen: [
   { id: '2.1a', type: 'num', tekst: 'Bereken het inkomen van Pieter in procenten van het inkomen van Marieke.', antwoord: pct(3000, 4000), d: 1, unit: '%', hint: '"…van het inkomen van Marieke": Marieke is de basis (100%).', uitleg: '3.000 ÷ 4.000 × 100% = 75%.', tags: ['basis'],
     fouten: [{ v: r(pct(4000, 3000), 1), tekst: 'Omgekeerde basis. "In procenten van Marieke" → deel door het inkomen van Marieke.', soort: 'basis' }] },
   { id: '2.1b', type: 'num', tekst: 'Bereken het inkomen van Marieke als percentage van het inkomen van Pieter.', antwoord: pct(4000, 3000), d: 1, unit: '%', hint: 'Nu is Pieter de basis.', uitleg: '4.000 ÷ 3.000 × 100% = 133,3%.', tags: ['basis'],
     fouten: [{ v: 75, tekst: 'Omgekeerde basis: nu is Pieter 100%.', soort: 'basis' }, { v: 33.3, tekst: 'Je hebt het verschil berekend. Gevraagd is het inkomen van Marieke als percentage: 133,3%.', soort: 'basis' }] }
  ]},
  { nr: '2.2', p: 9, context: 'Een winkel heeft een omzet van € 3,5 miljoen. Inkoopwaarde € 2,4 miljoen, huur € 200.000, loonkosten € 450.000.', vragen: [
   { id: '2.2a', type: 'num', tekst: 'Bereken de inkoopwaarde in procenten van de omzet.', antwoord: pct(2.4, 3.5), d: 1, unit: '%', hint: 'Deel ÷ geheel × 100%. De omzet is het geheel.', uitleg: '2,4 ÷ 3,5 × 100% = 68,6%.', tags: ['basis'] },
   { id: '2.2b', type: 'num', tekst: 'Bereken hoeveel procent van de omzet aan loon wordt betaald.', antwoord: pct(450000, 3.5e6), d: 1, unit: '%', hint: 'Let op: 3,5 miljoen = 3.500.000.', uitleg: '450.000 ÷ 3.500.000 × 100% = 12,9%.', tags: ['basis', 'nullen'] },
   { id: '2.2c', type: 'num', tekst: 'Bereken welk percentage van de omzet aan huur wordt uitgegeven.', antwoord: pct(200000, 3.5e6), d: 1, unit: '%', hint: '200.000 ÷ 3.500.000 × 100%.', uitleg: '200.000 ÷ 3.500.000 × 100% = 5,7%.', tags: ['basis'] }
  ]},
  { nr: '2.3', p: 10, context: 'Een onderneming heeft een omzet van € 1,6 miljoen. De inkoopwaarde is 40% en de loonkosten zijn 23% van de omzet.', vragen: [
   { id: '2.3a', type: 'num', tekst: 'Bereken de inkoopwaarde in euro\'s.', antwoord: 0.4 * 1.6e6, d: 0, unit: '€', hint: '40% = 0,40.', uitleg: '0,40 × € 1.600.000 = € 640.000.', tags: [] },
   { id: '2.3b', type: 'num', tekst: 'Bereken de loonkosten in euro\'s.', antwoord: 0.23 * 1.6e6, d: 0, unit: '€', hint: '23% = 0,23.', uitleg: '0,23 × € 1.600.000 = € 368.000.', tags: [] }
  ]},
  { nr: '2.4', p: 10, context: 'Het nationaal inkomen van Nederland is € 812 miljard. Daarvan is 72,5% arbeidsinkomen.', vragen: [
   { id: '2.4', type: 'num', tekst: 'Bereken het arbeidsinkomen.', antwoord: 0.725 * 812e9, scale: 1e9, ds: 1, unit: '€', hint: '0,725 × 812 miljard.', uitleg: '0,725 × € 812 miljard = € 588,7 miljard.', tags: [] }
  ]},
  { nr: '2.5', p: 11, context: 'Btw-tarieven: 9% en 21%.', vragen: [
   { id: '2.5a', type: 'num', tekst: 'Een schilder rekent € 16.500 exclusief 9% btw. Bereken het bedrag inclusief btw.', antwoord: 16500 * 1.09, d: 2, unit: '€', hint: 'Exclusief = 100%, inclusief = 109%.', uitleg: '€ 16.500 × 1,09 = € 17.985,00.', tags: ['btw'] },
   { id: '2.5b', type: 'num', tekst: 'Een winkelier verkoopt in een week voor € 45.600 inclusief 21% btw. Bereken het btw-bedrag.', antwoord: 45600 / 121 * 21, d: 2, unit: '€', hint: '€ 45.600 is 121%. Bereken eerst 1%.', uitleg: '45.600 ÷ 121 × 21 = € 7.914,05.', tags: ['btw', 'basis'],
     fouten: [{ v: r(45600 * 0.21, 2), tekst: 'De btw is 21% van de prijs <b>exclusief</b> btw, niet van het bedrag inclusief btw. € 45.600 is 121%.', soort: 'btw' }] },
   { id: '2.5c', type: 'num', tekst: 'Een product kost € 2,95 inclusief 9% btw. Bereken de prijs exclusief btw.', antwoord: 2.95 / 1.09, d: 2, unit: '€', hint: '€ 2,95 = 109%.', uitleg: '2,95 ÷ 109 × 100 = € 2,71.', tags: ['btw', 'basis'],
     fouten: [{ v: r(2.95 * 0.91, 2), tekst: 'Je trekt 9% van de prijs inclusief btw af; de basis is de prijs exclusief btw. Deel door 1,09.', soort: 'btw' }] },
   { id: '2.5d', type: 'num', tekst: 'De btw op een product is € 3,35 (tarief 21%). Bereken de verkoopprijs inclusief btw.', antwoord: 3.35 / 21 * 121, d: 2, unit: '€', hint: '€ 3,35 is 21%. Wat is 121%?', uitleg: '3,35 ÷ 21 × 121 = € 19,30.', tags: ['btw'],
     fouten: [{ v: r(3.35 / 21 * 100, 2), tekst: 'Dat is de prijs exclusief btw. Gevraagd is inclusief btw (121%).', soort: 'btw' }] }
  ]},
  { nr: '2.6', p: 11, context: 'De ouders van Jamal hebben na tien jaar 25% van hun hypotheek afgelost. Er is nog € 180.000 over (de restschuld).', vragen: [
   { id: '2.6', type: 'num', tekst: 'Bereken het bedrag van de oorspronkelijke lening.', antwoord: 180000 / 0.75, d: 0, unit: '€', hint: 'Na 25% aflossen is nog 75% over. € 180.000 = 75%.', uitleg: '180.000 ÷ 75 × 100 = € 240.000.', tags: ['basis'],
     fouten: [{ v: 180000 * 1.25, tekst: 'Je neemt 25% van de restschuld; de basis is de oorspronkelijke lening. € 180.000 = 75% van de lening.', soort: 'basis' }] }
  ]}
 ]},

 { id: '2.2', h: 2, titel: 'Procentuele veranderingen', p: '11–13', theorie: T['2.2'], gens: ['gf', 'p_nieuw', 'p_verand', 'p_vergelijk', 'p_terugoud', 'p_rente'], opdrachten: [
  { nr: '2.7', p: 11, context: 'Frans heeft € 500 op zijn spaarrekening en krijgt 0,5% rente per jaar.', vragen: [
   { id: '2.7a', type: 'num', tekst: 'Bereken de groeifactor.', antwoord: 1.005, d: 3, unit: '', hint: '100% + 0,5% = 100,5%.', uitleg: '100,5 ÷ 100 = 1,005.', tags: [],
     fouten: [{ v: 1.05, tekst: '1,05 hoort bij 5%. Bij 0,5% is de groeifactor 1,005.', soort: 'formule' }, { v: 0.005, tekst: 'De groeifactor is 1 + 0,005.', soort: 'formule' }] },
   { id: '2.7b', type: 'num', tekst: 'Bereken het saldo na één jaar.', antwoord: 500 * 1.005, d: 2, unit: '€', hint: 'Saldo × groeifactor.', uitleg: '€ 500 × 1,005 = € 502,50.', tags: [] },
   { id: '2.7c', type: 'num', tekst: 'Bereken het saldo na vijf jaar.', antwoord: 500 * Math.pow(1.005, 5), d: 2, unit: '€', hint: 'Vijf keer vermenigvuldigen met 1,005: 500 × 1,005⁵.', uitleg: '€ 500 × 1,005⁵ = € 512,63.', tags: [],
     fouten: [{ v: 512.5, tekst: 'Dat is 5 × € 2,50 rente. Maar je krijgt ook rente over de rente: 500 × 1,005⁵.', soort: 'formule' }] }
  ]},
  { nr: '2.8', p: 11, context: 'De omzet van Bouwbedrijf Steen bv daalde in 2020 met 25%. In 2019 was de omzet € 300 miljoen.', vragen: [
   { id: '2.8a', type: 'num', tekst: 'Bereken de groeifactor.', antwoord: 0.75, d: 2, unit: '', hint: '100% − 25% = 75%.', uitleg: '75 ÷ 100 = 0,75.', tags: [], fouten: [{ v: 1.25, tekst: 'Bij een daling is de groeifactor kleiner dan 1.', soort: 'formule' }] },
   { id: '2.8b', type: 'num', tekst: 'Bereken de nieuwe omzet.', antwoord: 0.75 * 300e6, scale: 1e6, ds: 0, unit: '€', hint: 'Oude omzet × groeifactor.', uitleg: '€ 300 miljoen × 0,75 = € 225 miljoen.', tags: [] }
  ]},
  { nr: '2.9', p: 12, context: 'De werkgelegenheid in een land stijgt van 6 miljoen naar 6,3 miljoen banen.', vragen: [
   { id: '2.9', type: 'num', tekst: 'Bereken de procentuele toename van de werkgelegenheid.', antwoord: pct(6.3 - 6, 6), d: 1, unit: '%', hint: '(nieuw − oud) ÷ oud × 100%.', uitleg: '(6,3 − 6) ÷ 6 × 100% = 5%.', tags: ['basis'] }
  ]},
  { nr: '2.10', p: 12, context: 'Omzet van een onderneming: 2018 € 3,2 miljoen; 2019 € 3,5 miljoen; 2020 € 3,4 miljoen. Voor 2021 wordt een stijging van 10,2% verwacht.', vragen: [
   { id: '2.10a', type: 'num', tekst: 'Met hoeveel procent is de omzet in 2019 gestegen ten opzichte van 2018?', antwoord: pct(0.3, 3.2), d: 1, unit: '%', hint: 'Oud = 2018.', uitleg: '(3,5 − 3,2) ÷ 3,2 × 100% = 9,4%.', tags: ['basis'],
     fouten: [{ v: r(pct(0.3, 3.5), 1), tekst: 'Je deelt door de nieuwe waarde. Deel door de oude waarde (2018).', soort: 'basis' }] },
   { id: '2.10b', type: 'num', tekst: 'Met hoeveel procent is de omzet in 2020 gedaald ten opzichte van 2019?', antwoord: pct(0.1, 3.5), d: 1, sign: 'abs', unit: '%', hint: 'Oud = 2019.', uitleg: '(3,4 − 3,5) ÷ 3,5 × 100% = −2,9% → een daling van 2,9%.', tags: ['basis'],
 },
   { id: '2.10c', type: 'num', tekst: 'Met hoeveel procent is de omzet in 2020 gestegen ten opzichte van 2018?', antwoord: pct(0.2, 3.2), d: 1, unit: '%', hint: 'Vergelijk 2020 direct met 2018.', uitleg: '(3,4 − 3,2) ÷ 3,2 × 100% = 6,25% → 6,3%.', tags: ['basis'],
     fouten: [{ v: r(9.375 - 2.857, 1), tekst: 'Procenten mag je niet zomaar optellen of aftrekken. Vergelijk 2020 rechtstreeks met 2018.', soort: 'formule' }] },
   { id: '2.10d', type: 'num', tekst: 'Bereken de verwachte omzet in 2021.', antwoord: 3.4e6 * 1.102, d: 0, scale: 1e6, ds: 3, unit: '€', hint: 'Omzet 2020 × 1,102.', uitleg: '€ 3.400.000 × 1,102 = € 3.746.800.', tags: [] }
  ]},
  { nr: '2.11', p: 12, context: 'Karel verdient € 4.800 bruto per maand. Hij betaalt € 1.900 aan belastingen en premies en houdt netto € 2.900 over. Een jaar later is zijn brutoloon € 5.100 en houdt hij netto 4% meer over.', vragen: [
   { id: '2.11a', type: 'num', tekst: 'Met hoeveel procent is het brutoloon gestegen? Rond af op twee decimalen.', antwoord: pct(300, 4800), d: 2, unit: '%', hint: '(5.100 − 4.800) ÷ 4.800 × 100%.', uitleg: '300 ÷ 4.800 × 100% = 6,25%.', tags: ['basis'] },
   { id: '2.11b', type: 'num', tekst: 'Bereken het nettoloon in het laatste jaar.', antwoord: 2900 * 1.04, d: 2, unit: '€', hint: '€ 2.900 × 1,04.', uitleg: '€ 2.900 × 1,04 = € 3.016,00.', tags: [] },
   { id: '2.11c', type: 'num', tekst: 'Met hoeveel procent zijn de belastingen en premies gestegen?', antwoord: pct(5100 - 3016 - 1900, 1900), d: 1, unit: '%', hint: 'Belastingen en premies = bruto − netto. Bereken het nieuwe bedrag en vergelijk met € 1.900.', uitleg: 'Nieuw: € 5.100 − € 3.016 = € 2.084. (2.084 − 1.900) ÷ 1.900 × 100% = 9,7%.', tags: ['basis'] }
  ]},
  { nr: '2.12', p: 12, context: 'Bereken de procentuele verandering.', vragen: [
   { id: '2.12a', type: 'num', tekst: 'De omzet stijgt van € 267.500 naar € 314.290. Met hoeveel procent is de omzet gestegen?', antwoord: pct(314290 - 267500, 267500), d: 1, unit: '%', hint: '(nieuw − oud) ÷ oud × 100%.', uitleg: '46.790 ÷ 267.500 × 100% = 17,5%.', tags: ['basis'] },
   { id: '2.12b', type: 'num', tekst: 'Het nationaal inkomen daalt van $ 340 miljard naar $ 326 miljard. Met hoeveel procent is het gedaald?', antwoord: pct(14, 340), d: 1, sign: 'abs', unit: '%', hint: 'Oud = 340.', uitleg: '(326 − 340) ÷ 340 × 100% = −4,1% → een daling van 4,1%.', tags: ['basis'],
     fouten: [{ v: r(pct(14, 326), 1), tekst: 'Deel door de oude waarde (340), niet door de nieuwe.', soort: 'basis' }] }
  ]},
  { nr: '2.13', p: 12, context: 'De export van een land is € 300 miljard in 2020 en € 330 miljard in 2021.', vragen: [
   { id: '2.13a', type: 'num', tekst: 'Hoeveel procent is de export in 2021 hoger dan in 2020?', antwoord: 10, d: 1, unit: '%', hint: '"…hoger dan in 2020": 2020 is de basis.', uitleg: '(330 − 300) ÷ 300 × 100% = 10%.', tags: ['basis'] },
   { id: '2.13b', type: 'num', tekst: 'En hoeveel procent is de export in 2020 lager dan in 2021?', antwoord: pct(30, 330), d: 1, sign: 'abs', unit: '%', hint: '"…lager dan in 2021": nu is 2021 de basis.', uitleg: '(300 − 330) ÷ 330 × 100% = −9,1% → 9,1% lager. (Let op: in het boekje staat hier per ongeluk "2020 als basis", maar de berekening gebruikt 2021.)', tags: ['basis'],
     fouten: [{ v: 10, tekst: 'Nu is 2021 de basis ("lager dan in 2021"). Deel door 330.', soort: 'basis' }] }
  ]},
  { nr: '2.14', p: 12, context: 'Netto-inkomens in 2021: Marloes € 54.500, Abdoel € 61.400, Henk € 41.750.', vragen: [
   { id: '2.14a', type: 'num', tekst: 'Hoeveel procent verdient Marloes meer dan Henk?', antwoord: pct(54500 - 41750, 41750), d: 1, unit: '%', hint: 'Meer dan <b>Henk</b>: Henk is de basis.', uitleg: '(54.500 − 41.750) ÷ 41.750 × 100% = 30,5%.', tags: ['basis'],
     fouten: [{ v: r(pct(12750, 54500), 1), tekst: 'Verkeerde basis: "meer dan Henk" → deel door het inkomen van Henk.', soort: 'basis' }] },
   { id: '2.14b', type: 'num', tekst: 'Hoeveel procent verdient Henk minder dan Marloes?', antwoord: pct(12750, 54500), d: 1, sign: 'abs', unit: '%', hint: 'Minder dan <b>Marloes</b>: Marloes is de basis.', uitleg: '(41.750 − 54.500) ÷ 54.500 × 100% = −23,4% → 23,4% minder.', tags: ['basis'],
     fouten: [{ v: r(pct(12750, 41750), 1), tekst: 'Verkeerde basis: "minder dan Marloes" → deel door het inkomen van Marloes.', soort: 'basis' }] },
   { id: '2.14c', type: 'num', tekst: 'Hoeveel procent verdient Abdoel meer dan Marloes?', antwoord: pct(6900, 54500), d: 1, unit: '%', hint: 'Marloes is de basis.', uitleg: '(61.400 − 54.500) ÷ 54.500 × 100% = 12,7%.', tags: ['basis'],
     fouten: [{ v: r(pct(6900, 61400), 1), tekst: 'Verkeerde basis: deel door het inkomen van Marloes.', soort: 'basis' }] },
   { id: '2.14d', type: 'num', tekst: 'Bereken het inkomen van Henk in procenten van het inkomen van Abdoel.', antwoord: pct(41750, 61400), d: 1, unit: '%', hint: 'Deel ÷ geheel × 100%, met Abdoel als geheel.', uitleg: '41.750 ÷ 61.400 × 100% = 68,0%.', tags: ['basis'],
     fouten: [{ v: r(pct(61400, 41750), 1), tekst: 'Omgekeerd: Abdoel is de basis.', soort: 'basis' }] },
   { id: '2.14e', type: 'num', tekst: 'Hoeveel procent verdient Henk minder dan Abdoel?', antwoord: pct(19650, 61400), d: 1, sign: 'abs', unit: '%', hint: 'Gebruik je antwoord bij d, of de formule met Abdoel als basis.', uitleg: '100% − 68,0% = 32,0% minder (of (41.750 − 61.400) ÷ 61.400 × 100% = −32,0%).', tags: ['basis'],
     fouten: [{ v: r(pct(19650, 41750), 1), tekst: 'Verkeerde basis: "minder dan Abdoel" → deel door het inkomen van Abdoel.', soort: 'basis' }] }
  ]},
  { nr: '2.15', p: 13, context: 'De arbeidsproductiviteit is 105 stuks per uur in 2020 en 115 stuks per uur in 2021.', vragen: [
   { id: '2.15a', type: 'num', tekst: 'Hoeveel procent is de arbeidsproductiviteit in 2021 hoger dan in 2020?', antwoord: pct(10, 105), d: 1, unit: '%', hint: '2020 is de basis.', uitleg: '10 ÷ 105 × 100% = 9,5%.', tags: ['basis'], fouten: [{ v: r(pct(10, 115), 1), tekst: 'Verkeerde basis: deel door 105.', soort: 'basis' }] },
   { id: '2.15b', type: 'num', tekst: 'Hoeveel procent is de arbeidsproductiviteit in 2020 lager dan in 2021?', antwoord: pct(10, 115), d: 1, sign: 'abs', unit: '%', hint: '2021 is de basis.', uitleg: '−10 ÷ 115 × 100% = −8,7% → 8,7% lager.', tags: ['basis'], fouten: [{ v: r(pct(10, 105), 1), tekst: 'Verkeerde basis: "lager dan in 2021" → deel door 115.', soort: 'basis' }] }
  ]},
  { nr: '2.16', p: 13, context: 'Terugrekenen: de nieuwe waarde is bekend, de oude niet.', vragen: [
   { id: '2.16a', type: 'num', tekst: 'De export van land A is in 2021 met 10,8% gestegen tot € 45,7 miljard. Bereken de export in 2020 (in miljarden).', antwoord: 45.7e9 / 1.108, scale: 1e9, ds: 1, unit: '€', hint: 'Oud = nieuw ÷ groeifactor.', uitleg: '€ 45,7 miljard ÷ 1,108 = € 41,2 miljard.', tags: ['basis'],
     fouten: [{ v: 45.7 * 0.892, t: 0.06, tekst: 'Je neemt 10,8% van de nieuwe waarde. De basis is 2020: deel door 1,108.', soort: 'basis' }] },
   { id: '2.16b', type: 'num', tekst: 'Het inkomen van mevrouw Geesink is met 5% gedaald tot € 2.800 netto. Bereken haar eerdere inkomen.', antwoord: 2800 / 0.95, d: 2, unit: '€', hint: '€ 2.800 = 95% van het oude inkomen.', uitleg: '€ 2.800 ÷ 0,95 = € 2.947,37.', tags: ['basis'],
     fouten: [{ v: 2800 * 1.05, tekst: 'De basis is het oude inkomen. € 2.800 is 95% daarvan: deel door 0,95.', soort: 'basis' }] },
   { id: '2.16c', type: 'num', tekst: 'Het inkomen van ondernemer Jaap daalde in 2020 met 2,5% tot € 3.740 netto. Bereken zijn inkomen in 2019.', antwoord: 3740 / 0.975, d: 2, unit: '€', hint: 'Deel door 0,975.', uitleg: '€ 3.740 ÷ 0,975 = € 3.835,90.', tags: ['basis'],
     fouten: [{ v: 3740 * 1.025, tekst: 'Deel door de groeifactor 0,975 in plaats van te vermenigvuldigen met 1,025.', soort: 'basis' }] },
   { id: '2.16d', type: 'num', tekst: 'Het inkomen van Astrid was in 2020 € 2.560 netto en stijgt in 2021 met 3%. Bereken haar inkomen in 2021.', antwoord: 2560 * 1.03, d: 2, unit: '€', hint: 'Hier is de oude waarde gegeven: vermenigvuldig.', uitleg: '€ 2.560 × 1,03 = € 2.636,80.', tags: [] }
  ]}
 ]},

 { id: '2.3', h: 2, titel: 'Procentpunten', p: '13–14', theorie: T['2.3'], gens: ['pp', 'pp', 'p_verand'], opdrachten: [
  { nr: '2.17', p: 13, context: 'Een krant meldt: het mogelijke stemmenaantal van de VVD is in een maand met 1,3% gedaald, van 26% naar 24,7%. Daar klopt iets niet.', vragen: [
   { id: '2.17', type: 'num', tekst: 'Bereken de daling van het stemmenpercentage van de VVD in procenten.', antwoord: pct(1.3, 26), d: 1, sign: 'abs', unit: '%', hint: '(24,7 − 26) ÷ 26 × 100%.', uitleg: '(24,7 − 26) ÷ 26 × 100% = −5% → een daling van 5% (of 1,3 procentpunt).', tags: ['pp'],
     fouten: [{ v: 1.3, tekst: '1,3 is het verschil in procent<b>punten</b>. Gevraagd is de procentuele daling: (nieuw − oud) ÷ oud × 100%.', soort: 'pp' }] }
  ]},
  { nr: '2.18', p: 14, context: '', vragen: [
   { id: '2.18a1', type: 'num', tekst: 'Een marktaandeel stijgt van 15% naar 17,4%. Met hoeveel procentpunten is het toegenomen?', antwoord: 2.4, d: 1, unit: 'procentpunt', hint: 'Procentpunten = nieuw − oud.', uitleg: '17,4 − 15 = 2,4 procentpunt.', tags: ['pp'],
     fouten: [{ v: 16, tekst: 'Dat is de stijging in procenten. Gevraagd zijn procentpunten: gewoon het verschil.', soort: 'pp' }] },
   { id: '2.18a2', type: 'num', tekst: 'Met hoeveel procent is het marktaandeel (15% → 17,4%) toegenomen?', antwoord: pct(2.4, 15), d: 1, unit: '%', hint: '(nieuw − oud) ÷ oud × 100%.', uitleg: '2,4 ÷ 15 × 100% = 16%.', tags: ['pp'],
     fouten: [{ v: 2.4, tekst: '2,4 is het aantal procentpunten. In procenten: 2,4 ÷ 15 × 100%.', soort: 'pp' }] },
   { id: '2.18b1', type: 'num', tekst: 'De bezettingsgraad daalt van 78% naar 77,5%. Met hoeveel procent is die gedaald?', antwoord: pct(0.5, 78), d: 1, sign: 'abs', unit: '%', hint: '(77,5 − 78) ÷ 78 × 100%.', uitleg: '−0,5 ÷ 78 × 100% = −0,6% → een daling van 0,6%.', tags: ['pp'],
     fouten: [{ v: 0.5, tekst: '0,5 is het aantal procentpunten. Gevraagd is de procentuele daling.', soort: 'pp' }] },
   { id: '2.18b2', type: 'num', tekst: 'Met hoeveel procentpunten is de bezettingsgraad (78% → 77,5%) gedaald?', antwoord: 0.5, d: 1, sign: 'abs', unit: 'procentpunt', hint: 'Gewoon het verschil.', uitleg: '78 − 77,5 = 0,5 procentpunt.', tags: ['pp'],
     fouten: [{ v: 0.6, tekst: 'Dat is de daling in procenten. Procentpunten = het verschil.', soort: 'pp' }] }
  ]}
 ]},

 { id: '2.4', h: 2, titel: 'Zelftest hoofdstuk 2', boss: true, p: '14–17', theorie: T['2.4'], gens: ['p_deel', 'btw_bedrag', 'btw_excl', 'p_verand', 'p_vergelijk', 'p_terugoud', 'korting', 'pp'], opdrachten: [
  { nr: '2.19', p: 14, context: 'Marieke krijgt elke maand € 100 van haar ouders. Ze werkt twee zaterdagen per maand van 11.00 tot 19.00 uur voor € 6 per uur. Ze spaart elke maand automatisch € 25.', vragen: [
   { id: '2.19a', type: 'num', tekst: 'Bereken haar totale inkomsten per maand.', antwoord: 100 + 2 * 8 * 6, d: 2, unit: '€', hint: 'Hoeveel uur werkt ze per zaterdag?', uitleg: '2 × 8 uur × € 6 = € 96. Totaal € 100 + € 96 = € 196,00.', tags: [],
     fouten: [{ v: 100 + 2 * 6, tekst: 'Je bent de uren vergeten: van 11.00 tot 19.00 uur is 8 uur.', soort: 'formule' }] },
   { id: '2.19b', type: 'num', tekst: 'Hoeveel procent van haar inkomen verdient ze met werken?', antwoord: pct(96, 196), d: 1, unit: '%', hint: 'Deel = loon, geheel = totale inkomsten.', uitleg: '96 ÷ 196 × 100% = 49,0%.', tags: ['basis'],
     fouten: [{ v: 96, tekst: 'Dat is het percentage van € 100. Het geheel is € 196.', soort: 'basis' }] },
   { id: '2.19c', type: 'num', tekst: 'Hoeveel procent van haar inkomen spaart ze?', antwoord: pct(25, 196), d: 1, unit: '%', hint: '25 ÷ 196 × 100%.', uitleg: '25 ÷ 196 × 100% = 12,8%.', tags: ['basis'] }
  ]},
  { nr: '2.20', p: 14, context: 'Een bedrijf heeft een omzet van € 1,6 miljoen. De inkoopwaarde van grond- en hulpstoffen is 40% van de omzet, de loonkosten 23%.', vragen: [
   { id: '2.20a', type: 'num', tekst: 'Bereken de inkoopwaarde.', antwoord: 640000, d: 0, unit: '€', hint: '0,40 × 1.600.000.', uitleg: '0,40 × € 1.600.000 = € 640.000.', tags: [] },
   { id: '2.20b', type: 'num', tekst: 'Bereken de loonkosten.', antwoord: 368000, d: 0, unit: '€', hint: '0,23 × 1.600.000.', uitleg: '0,23 × € 1.600.000 = € 368.000.', tags: [] }
  ]},
  { nr: '2.21', p: 14, context: 'Een kledingwinkel geeft 20% korting. Loes betaalt aan de kassa € 68 voor haar spijkerbroek.', vragen: [
   { id: '2.21', type: 'num', tekst: 'Bereken de korting.', antwoord: 68 / 0.8 * 0.2, d: 2, unit: '€', hint: '€ 68 is 80% van de oude prijs.', uitleg: 'Oude prijs = 68 ÷ 0,8 = € 85. Korting = 85 − 68 = € 17,00.', tags: ['basis'],
     fouten: [{ v: 68 * 0.2, tekst: 'De korting is 20% van de <b>oude</b> prijs, niet van € 68. € 68 = 80%.', soort: 'basis' }, { v: 85, tekst: 'Dat is de oude prijs. Gevraagd is de korting.', soort: 'formule' }] }
  ]},
  { nr: '2.22', p: 14, context: 'Het aantal inwoners van een groeigemeente is met 8% gestegen tot 28.080.', vragen: [
   { id: '2.22', type: 'num', tekst: 'Bereken hoeveel mensen er vorig jaar woonden.', antwoord: 28080 / 1.08, d: 0, unit: 'personen', hint: '28.080 = 108%.', uitleg: '28.080 ÷ 1,08 = 26.000 inwoners.', tags: ['basis'],
     fouten: [{ v: 28080 * 0.92, t: 1, tekst: 'Verkeerde basis: deel door 1,08 (vorig jaar = 100%).', soort: 'basis' }] }
  ]},
  { nr: '2.23', p: 14, context: 'Truffels. Frankrijk: de kiloprijs zakte van € 1.100 (vorig jaar) naar € 700. Italië: de recordtruffel van dit jaar (850 gram) bracht € 24.000 op; vorig jaar ging een recordtruffel van 750 gram weg voor € 143.000.', vragen: [
   { id: '2.23a', type: 'num', tekst: 'Bereken de prijsdaling van de Franse truffel in procenten.', antwoord: pct(400, 1100), d: 1, sign: 'abs', unit: '%', hint: 'Oud = € 1.100.', uitleg: '(700 − 1.100) ÷ 1.100 × 100% = −36,4%.', tags: ['basis'],
     fouten: [{ v: r(pct(400, 700), 1), tekst: 'Deel door de oude prijs (€ 1.100).', soort: 'basis' }] },
   { id: '2.23b', type: 'num', tekst: 'Bereken de procentuele prijsdaling van de recordtruffel in Italië.', antwoord: pct(143000 / 750 - 24000 / 850, 143000 / 750), d: 1, sign: 'abs', unit: '%', hint: 'Bereken eerst voor beide truffels de prijs per gram.', uitleg: 'Vorig jaar 143.000 ÷ 750 = € 190,67/g; nu 24.000 ÷ 850 = € 28,24/g. (28,24 − 190,67) ÷ 190,67 × 100% = −85,2%.', tags: ['basis'],
     fouten: [{ v: r(pct(143000 - 24000, 143000), 1), tekst: 'De truffels zijn verschillend zwaar. Reken eerst de prijs per gram uit.', soort: 'formule' }] }
  ]},
  { nr: '2.24', p: 15, context: 'Volgens de Wet Normering Topinkomens was het maximumsalaris in de publieke sector in 2021 € 209.000 per jaar. De best betaalde ziekenhuisbestuurder verdiende € 246.000.', vragen: [
   { id: '2.24a', type: 'num', tekst: 'Bereken het salaris van deze bestuurder in procenten van het maximumsalaris.', antwoord: pct(246000, 209000), d: 1, unit: '%', hint: 'Het maximum is de basis.', uitleg: '246.000 ÷ 209.000 × 100% = 117,7%.', tags: ['basis'],
     fouten: [{ v: r(pct(209000, 246000), 1), tekst: 'Omgekeerde basis: het maximumsalaris is 100%.', soort: 'basis' }] },
   { id: '2.24b', type: 'num', tekst: 'Hoeveel procent verdiende hij meer dan het maximumsalaris?', antwoord: pct(37000, 209000), d: 1, unit: '%', hint: 'Gebruik je antwoord bij a.', uitleg: '117,7% − 100% = 17,7%.', tags: ['basis'],
     fouten: [{ v: r(pct(37000, 246000), 1), tekst: 'Verkeerde basis: "meer dan het maximum" → deel door € 209.000.', soort: 'basis' }] }
  ]},
  { nr: '2.25', p: 15, context: 'Bruto jaarsalarissen 2021: verpleegkundige € 33.000; basisschoolleraar (28 jaar) € 36.000; scheidsrechter eredivisie € 70.000; orthodontist € 126.000; chirurg € 210.000. De toelage van de Koning was € 998.000.', vragen: [
   { id: '2.25a', type: 'num', tekst: 'Bereken het inkomen van een verpleegkundige in procenten van dat van een scheidsrechter.', antwoord: pct(33000, 70000), d: 1, unit: '%', hint: 'Scheidsrechter = 100%.', uitleg: '33.000 ÷ 70.000 × 100% = 47,1%.', tags: ['basis'] },
   { id: '2.25b', type: 'num', tekst: 'Hoeveel procent verdient een basisschoolleraar minder dan een chirurg?', antwoord: pct(174000, 210000), d: 1, sign: 'abs', unit: '%', hint: 'Chirurg = basis.', uitleg: '(36.000 − 210.000) ÷ 210.000 × 100% = −82,9%.', tags: ['basis'],
     fouten: [{ v: r(pct(174000, 36000), 1), tekst: 'Verkeerde basis: "minder dan een chirurg" → deel door € 210.000.', soort: 'basis' }] },
   { id: '2.25c', type: 'num', tekst: 'Bereken het inkomen van een orthodontist in procenten van dat van een chirurg.', antwoord: pct(126000, 210000), d: 1, unit: '%', hint: 'Chirurg = 100%.', uitleg: '126.000 ÷ 210.000 × 100% = 60%.', tags: ['basis'] },
   { id: '2.25d', type: 'num', tekst: 'Hoeveel procent is het inkomen van een verpleegkundige lager dan dat van een scheidsrechter?', antwoord: pct(37000, 70000), d: 1, sign: 'abs', unit: '%', hint: 'Scheidsrechter = basis.', uitleg: '(33.000 − 70.000) ÷ 70.000 × 100% = −52,9%.', tags: ['basis'],
     fouten: [{ v: r(pct(37000, 33000), 1), tekst: 'Verkeerde basis: deel door € 70.000.', soort: 'basis' }] },
   { id: '2.25e', type: 'num', tekst: 'Bereken de toelage van de Koning in procenten van het inkomen van een basisschoolleraar.', antwoord: pct(998000, 36000), d: 1, unit: '%', hint: 'Leraar = 100%.', uitleg: '998.000 ÷ 36.000 × 100% = 2.772,2%.', tags: ['basis'] }
  ]},
  { nr: '2.26', p: 15, context: 'Btw-sommen (21%, tenzij anders vermeld).', vragen: [
   { id: '2.26a', type: 'num', tekst: 'Bedrijf Jansma koopt geluidsboxen in voor € 790 exclusief btw. Bereken de inkoopprijs inclusief btw.', antwoord: 790 * 1.21, d: 2, unit: '€', hint: '× 1,21.', uitleg: '€ 790 × 1,21 = € 955,90.', tags: ['btw'] },
   { id: '2.26b', type: 'num', tekst: 'G. Geluk bv heeft een omzet exclusief btw van € 345.000. Daarvan valt 20% onder 9% btw en 80% onder 21% btw. Bereken de omzet inclusief btw.', antwoord: 345000 * (0.2 * 1.09 + 0.8 * 1.21), d: 2, unit: '€', hint: 'Splits de omzet: 20% × 1,09 en 80% × 1,21.', uitleg: '0,2 × 345.000 × 1,09 = 75.210; 0,8 × 345.000 × 1,21 = 333.960. Totaal € 409.170,00.', tags: ['btw'] },
   { id: '2.26c', type: 'num', tekst: 'Uhp verkoopt een laptop voor € 590 inclusief 21% btw. Hoeveel btw heeft Uhp ontvangen?', antwoord: 590 / 121 * 21, d: 2, unit: '€', hint: '€ 590 = 121%.', uitleg: '590 ÷ 121 × 21 = € 102,40.', tags: ['btw', 'basis'],
     fouten: [{ v: r(590 * 0.21, 2), tekst: 'De btw is geen 21% van de prijs inclusief btw. € 590 = 121%.', soort: 'btw' }] },
   { id: '2.26d1', type: 'num', tekst: 'Een bedrijf moet € 15.500 btw afdragen (21%). Bereken de omzet inclusief btw.', antwoord: 15500 / 21 * 121, d: 2, unit: '€', hint: '€ 15.500 = 21%. Wat is 121%?', uitleg: '15.500 ÷ 21 × 121 = € 89.309,52.', tags: ['btw'] },
   { id: '2.26d2', type: 'num', tekst: 'Bereken de omzet van dit bedrijf exclusief btw.', antwoord: 15500 / 21 * 100, d: 2, unit: '€', hint: '€ 15.500 = 21%. Wat is 100%?', uitleg: '15.500 ÷ 21 × 100 = € 73.809,52.', tags: ['btw'] }
  ]},
  { nr: '2.27', p: 16, context: 'Figuur 2.1 toont de verhouding bbp Spanje ÷ bbp Italië. Afgelezen waarden: 1980: 0,49 · 1990: 0,45 · 2000: 0,52 · 2010: 0,68 · 2020: 0,69. Het bbp van Italië was in 1980 € 402,1 miljard en steeg tot 2020 met 337%.', vragen: [
   { id: '2.27a', type: 'num', tekst: 'Bereken het bbp van Italië in 2020 (in miljarden euro\'s).', antwoord: 402.1e9 * 4.37, scale: 1e9, ds: 1, unit: '€', hint: 'Een stijging van 337% geeft groeifactor 4,37.', uitleg: '€ 402,1 miljard × 4,37 = € 1.757,2 miljard.', tags: [],
     fouten: [{ v: 402.1 * 3.37, t: 0.2, tekst: 'Bij +337% is de groeifactor 4,37 (100% + 337%), niet 3,37.', soort: 'formule' }] },
   { id: '2.27b', type: 'num', tekst: 'Bereken ongeveer het bbp van Spanje in 1980 (in miljarden euro\'s).', antwoord: 0.49 * 402.1e9, scale: 1e9, ds: 0, tolS: 5, unit: '€', hint: 'Bbp Spanje = verhouding × bbp Italië.', uitleg: '0,49 × € 402,1 miljard ≈ € 197 miljard.', tags: [] },
   { id: '2.27c', type: 'num', tekst: 'Bereken met hoeveel procent het bbp van Spanje van 1980 tot 2020 ongeveer is gestegen.', antwoord: pct(0.69 * 1757.177 - 0.49 * 402.1, 0.49 * 402.1), d: 0, tol: 30, unit: '%', hint: 'Bereken eerst het bbp van Spanje in 2020: 0,69 × bbp Italië 2020.', uitleg: 'Spanje 2020 ≈ 0,69 × 1.757,2 = € 1.212 miljard. (1.212 − 197) ÷ 197 × 100% ≈ 515%.', tags: ['basis'] },
   { id: '2.27d', type: 'num', tekst: 'Met hoeveel procent is de verhouding bbp Spanje/bbp Italië van 1980 tot 2020 ongeveer gestegen?', antwoord: pct(0.2, 0.49), d: 1, tol: 5, unit: '%', hint: '(0,69 − 0,49) ÷ 0,49 × 100%.', uitleg: '(0,69 − 0,49) ÷ 0,49 × 100% ≈ 40,8%.', tags: ['basis'],
     fouten: [{ v: 20, t: 0.5, tekst: '0,20 is het verschil. Gevraagd is de procentuele stijging: deel door 0,49.', soort: 'pp' }] },
   { id: '2.27e', type: 'open', tekst: 'Verklaar het verschil tussen de antwoorden van c en d.', model: 'Het bbp van Italië is in deze periode zelf ook sterk gestegen (met 337%). De verhouding laat alleen zien hoeveel sneller het bbp van Spanje groeide dan dat van Italië (ongeveer 41% meer), terwijl c de totale groei van het bbp van Spanje laat zien (ruim 500%).', hint: 'Wat gebeurde er met het bbp van Italië (de noemer van de verhouding)?', tags: [] }
  ]},
  { nr: '2.28', p: 16, context: 'Apple (boekjaar van 1 juli t/m 30 juni). Omzet: 2017-2018 $ 265 miljard; 2018-2019 $ 260,2 miljard; 2019-2020 $ 274,5 miljard. Winst: 2017-2018 $ 59,5 miljard; 2018-2019 $ 55,2 miljard; 2019-2020 $ 57,4 miljard. In het eerste halfjaar van 2020 verkocht Apple meer Mac-computers en iPads.', vragen: [
   { id: '2.28a', type: 'mc', tekst: 'Wat is de meest logische verklaring voor de hogere verkoop van Macs en iPads in het eerste halfjaar van 2020?', opties: ['De iPhone 12 kwam juist eerder op de markt', 'Door de coronacrisis gingen veel mensen thuiswerken en thuisonderwijs volgen', 'Apple verlaagde de prijzen van iPhones', 'Het boekjaar van Apple loopt van januari tot december'], juist: 1,
     hint: 'Denk aan wat er in het voorjaar van 2020 wereldwijd gebeurde.', uitleg: 'Door de coronapandemie werkten en leerden veel mensen thuis; daarvoor kochten ze laptops en tablets.', tags: [] },
   { id: '2.28b', type: 'num', tekst: 'Bereken de procentuele verandering van de omzet in 2018-2019 ten opzichte van 2017-2018. (Een daling geef je met een minteken.)', antwoord: pct(260.2 - 265, 265), d: 1, unit: '%', hint: '(nieuw − oud) ÷ oud × 100%.', uitleg: '(260,2 − 265) ÷ 265 × 100% = −1,8%.', tags: ['basis'] },
   { id: '2.28c', type: 'num', tekst: 'Bereken de procentuele verandering van de omzet in 2019-2020 ten opzichte van 2018-2019.', antwoord: pct(274.5 - 260.2, 260.2), d: 1, unit: '%', hint: 'Oud = 260,2.', uitleg: '(274,5 − 260,2) ÷ 260,2 × 100% = +5,5%.', tags: ['basis'],
     fouten: [{ v: r(pct(14.3, 274.5), 1), tekst: 'Deel door de oude waarde (260,2).', soort: 'basis' }] },
   { id: '2.28d', type: 'num', tekst: 'Bereken de procentuele verandering van de winst in 2019-2020 ten opzichte van 2017-2018.', antwoord: pct(57.4 - 59.5, 59.5), d: 1, unit: '%', hint: 'Let op: vergelijk met 2017-2018 (winst $ 59,5 miljard).', uitleg: '(57,4 − 59,5) ÷ 59,5 × 100% = −3,5%.', tags: ['basis'],
     fouten: [{ v: r(pct(57.4 - 55.2, 55.2), 1), tekst: 'Je vergelijkt met 2018-2019. Gevraagd is ten opzichte van 2017-2018.', soort: 'basis' }] },
   { id: '2.28e', type: 'num', tekst: 'Het marktaandeel van Samsung op de smartphonemarkt daalde in het tweede kwartaal van 2020 van 20,3% naar 18,6%. Met hoeveel procentpunten nam het af?', antwoord: 1.7, d: 1, sign: 'abs', unit: 'procentpunt', hint: 'Procentpunten = verschil.', uitleg: '20,3 − 18,6 = 1,7 procentpunt.', tags: ['pp'],
     fouten: [{ v: r(pct(1.7, 20.3), 1), tekst: 'Dat is de daling in procenten. Gevraagd zijn procentpunten.', soort: 'pp' }] }
  ]},
  { nr: '2.29', p: 17, context: 'Kredietverlening (figuur 2.2). In het eerste kwartaal van 2021 is de waarde voor aanbieders van krediet −30 procentpunt: het percentage aanbieders dat de voorwaarden aanscherpt min het percentage dat versoepelt. 20% van de aanbieders houdt de voorwaarden gelijk.', vragen: [
   { id: '2.29', type: 'num', tekst: 'Toon aan welk percentage van de aanbieders de voorwaarden in 2021-1 versoepelt.', antwoord: 55, d: 0, unit: '%', hint: 'Aanscherpen + versoepelen = 100% − 20% = 80%. En aanscherpen − versoepelen = −30.', uitleg: 'A + V = 80 en A − V = −30. Optellen: 2A = 50 → A = 25%. V = 80 − 25 = 55%.', tags: ['pp'],
     fouten: [{ v: 25, tekst: 'Dat is het percentage dat aanscherpt. Gevraagd is het percentage dat versoepelt.', soort: 'formule' }] }
  ]}
 ]}
];

/* ---------- VARIANTGENERATOREN ---------- */
// Elke generator geeft een num- of mc-vraag met nieuwe getallen.
const G = {};
function nummer(min, max, dec) { return r(min + Math.random() * (max - min), dec); }

G.afr_dec = () => {
  let x = nummer(1, 9999, 5); const d = pick([0, 1, 2, 3]);
  // zorg dat het beslissende cijfer interessant is (4 of 5 komt vaak voor)
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
  // eurolanden in euro's, de Verenigde Staten in dollars (afgeronde cijfers, ongeveer 2023)
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
