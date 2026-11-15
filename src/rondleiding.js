/* ================= RONDLEIDING (eerste keer per scherm) ================= */
const TOURS = {
  home: [
    ['.kaartkaarten', '🗺️ Jouw kaarten', 'Elk hoofdstuk is een kaart. Begin bij hoofdstuk 1. Hoofdstuk 2 gaat open zodra je de eindbaas van hoofdstuk 1 hebt verslagen.'],
    ['#top10', '🏆 Top 10', 'Hier zie je wie in jouw klas de meeste XP heeft. Je eigen plek zie je altijd, ook als je (nog) niet in de top 10 staat.'],
    ['[data-act=strijd-join]', '⚔️ Klassikale strijd', 'Start je docent een strijd op het bord? Tik dan hier en vul de spelcode in.'],
    ['[data-act=duel-arena]', '🤺 Duel', 'Daag een klasgenoot uit voor een 1-tegen-1: een <b>Sprint</b> (zo veel mogelijk goed in 3 minuten) of een <b>Kasteelstrijd</b>. Winnen levert badges op.'],
    ['[data-act=badges]', '🎖️ Badges', 'Met goed spelen verdien je badges. Hier zie je welke je al hebt en welke je nog kunt halen.'],
    ['.oefenruimte', '🏋️ Oefenruimte', 'Extra oefenen? Per paragraaf vind je hier de theorie en eindeloos nieuwe sommen.']
  ],
  kaart: [
    ['.vakje.kan', '👣 Hier begin je', 'Vakjes met een <b>gouden ring</b> kun je kiezen. Je begint onderaan en klimt naar de eindbaas bovenaan. Let op: een gekozen pad kun je niet meer veranderen.'],
    ['#legendaPaneel', '📜 Legenda', 'Weet je niet wat een icoon betekent? Kijk in de legenda. Je kunt hem in- en uitklappen.'],
    ['.hud-harten', '❤️ Harten', 'Een fout antwoord kost een hart. Zijn ze op? Dan lees je eerst de theorie en ga je verder met 3 harten.'],
    ['.hud-munten', '🪙 Munten', 'Elk goed antwoord levert munten op. In de winkel 🛒 koop je er blessings of harten mee.'],
    ['.hud-boons', '✨ Blessings', 'Hier bewaar je maximaal 3 blessings, zoals 🦘 Sprong om een vakje over te slaan. Tik op een blessing voor uitleg.'],
    ['.hud [data-act=kaart-theorie]', '📖 Theorie', 'Hier vind je altijd de theorie van dit hoofdstuk.']
  ],
  opdracht: [
    ['#vraagkaart .context', '📘 De opdracht', 'Dit is de opdracht uit je boekje, kort samengevat. Je ziet erbij op welke bladzijde hij staat.'],
    ['#vraagkaart .invoerrij', '✏️ Je antwoord', 'Typ je antwoord zoals je gewend bent, bijvoorbeeld <b>1.250,75</b> of <b>588,7 miljard</b>. Met <b>±</b> maak je er een negatief getal van. Kies ook de juiste <b>eenheid</b> als daarom gevraagd wordt.'],
    ['#vraagkaart [data-act=hint]', '💡 Hint', 'Kom je er niet uit? Een hint helpt je op weg, maar je krijgt dan de helft minder XP. Na 3 foute pogingen kun je de uitwerking bekijken.'],
    ['.vakjewrap .chips', '🔢 Deelvragen', 'Een opdracht bestaat uit deelvragen. Zijn ze allemaal af, dan is het vakje voltooid en ga je terug naar de kaart.']
  ],
  winkel: [['.vakjewrap .winkel', '🛒 De winkel', 'Koop hier blessings of een extra hart met je munten. Je kunt maximaal 3 blessings bij je hebben. Klaar? Tik op <b>Verder reizen</b>.']],
  rust: [['.vakjewrap .grid2', '🔥 Rustplaats', 'Kies één van beide: <b>uitrusten</b> (+2 harten) of <b>oefenen</b> (2 sommen goed = een blessing naar keuze).']],
  boss: [['.bossbalk', '🐉 De eindbaas', 'De zelftest in 3 rondes. Elke goede deelvraag kost de eindbaas levens. De eindbaas kun je niet overslaan. Succes!']],
  krant: [['.krant', '📰 Klopt dit?', 'Lees het bericht goed en beslis of het klopt. Goed gezien levert 15 munten op, een fout kost een hart.']],
  schat: [['#vraagkaart', '🧰 Schatkist', 'Maak deze som goed om de kist te openen. Je mag het vaker proberen. Daarna kies je een blessing.']],
  oefen: [['.tabs', '🏋️ Oefenruimte', 'Lees hier de theorie of train met steeds nieuwe sommen. Dit levert XP op, maar telt niet mee voor de kaart.']]
};
let TOUR = null;
function tourNa(naam, vertraging = 450) {
  if (!st || (st.tour && st.tour[naam])) return;
  const scherm = ui.scherm;
  setTimeout(() => { if (ui.scherm !== scherm || TOUR) return; if ($('#modal')) return setTimeout(() => tourNa(naam, 0), 1200); startTour(naam); }, vertraging);
}
function startTour(naam) {
  const stappen = (TOURS[naam] || []).filter(([sel]) => { const el = document.querySelector(sel); return el && el.getClientRects().length; });
  if (!stappen.length) return;
  st.tour = st.tour || {}; st.tour[naam] = 1; bewaar();
  sluitModal(); TOUR = { naam, stappen, i: 0 };
  const laag = document.createElement('div'); laag.id = 'tour'; laag.className = 'tour-laag';
  laag.innerHTML = `<div class="tour-spot"></div><div class="tour-kaart" role="dialog" aria-live="polite"></div>`;
  document.body.appendChild(laag); toonStap();
}
function toonStap() {
  if (!TOUR) return; const [sel, titel, tekst] = TOUR.stappen[TOUR.i]; const el = document.querySelector(sel);
  if (!el) return volgendeStap();
  el.scrollIntoView({ block: 'center', inline: 'nearest' });
  const kaart = document.querySelector('.tour-kaart'); const laatste = TOUR.i === TOUR.stappen.length - 1;
  kaart.innerHTML = `<div class="tour-tel">${TOUR.i + 1} / ${TOUR.stappen.length}</div><h3>${titel}</h3><p>${tekst}</p>
    <div class="knoprij"><button class="knop licht klein" data-act="tour-stop">${laatste ? 'Sluiten' : 'Overslaan'}</button><button class="knop accent klein" data-act="tour-verder">${laatste ? 'Aan de slag! ✓' : 'Volgende →'}</button></div>`;
  setTimeout(plaatsTour, 260);
}
function plaatsTour() {
  if (!TOUR) return; const el = document.querySelector(TOUR.stappen[TOUR.i][0]); const spot = document.querySelector('.tour-spot'); const kaart = document.querySelector('.tour-kaart');
  if (!el || !spot || !kaart) return;
  const r = el.getBoundingClientRect(); const pad = 8; const vw = window.innerWidth, vh = window.innerHeight;
  const t = Math.max(4, r.top - pad), l = Math.max(4, r.left - pad), w = Math.min(vw - 8, r.width + 2 * pad), h = Math.min(vh - 8, r.height + 2 * pad);
  Object.assign(spot.style, { top: t + 'px', left: l + 'px', width: w + 'px', height: h + 'px' });
  const kw = Math.min(360, vw - 24); kaart.style.width = kw + 'px'; const kh = kaart.offsetHeight;
  let top = t + h + 12; if (top + kh > vh - 8) top = t - kh - 12; if (top < 8) top = Math.max(8, vh - kh - 12);
  let left = l + w / 2 - kw / 2; left = Math.max(12, Math.min(vw - kw - 12, left));
  Object.assign(kaart.style, { top: top + 'px', left: left + 'px' });
}
function volgendeStap() { if (!TOUR) return; TOUR.i++; if (TOUR.i >= TOUR.stappen.length) return stopTour(); toonStap(); }
function stopTour() { TOUR = null; const t = $('#tour'); if (t) t.remove(); }
window.addEventListener('resize', () => { if (TOUR) plaatsTour(); });
Object.assign(ACT, {
  'tour-verder': () => volgendeStap(),
  'tour-stop': () => stopTour(),
  'tour-opnieuw': el => { sluitModal(); startTour(el.dataset.t); }
});
