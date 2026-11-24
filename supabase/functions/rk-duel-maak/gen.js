// Rekonomie Arena – hulpfuncties voor engine.js (de duelsommen staan in duelsommen.js)
(function (global) {
'use strict';
const r = (x, d) => { const f = Math.pow(10, d); return Math.round((x + Math.sign(x) * 1e-9) * f) / f; };
const fmt = (x, d) => Number(x).toLocaleString('nl-NL', { minimumFractionDigits: d, maximumFractionDigits: d });
global.RK = { PAR: [], util: { r, fmt } };
})(globalThis);
