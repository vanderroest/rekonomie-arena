/* Rekonomie Arena – app (leerling, klassikale strijd, docent) */
(function () {
'use strict';
const { PAR, genereer } = RK; const { fmt, r } = RK.util; const E = RK.engine;

/* ================= CONFIG ================= */
const CFG = {
  url: 'https://sislandwzwhxldcjqnxq.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpc2xhbmR3endoeGxkY2pxbnhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0MTA0ODMsImV4cCI6MjEwODk4NjQ4M30.EuGCwkBd_JkedOekyim-9VVQCv81q_aV01HaTVNirhM',
  klassen: ['4V1', '4V2', '4V3'],   // keuzelijst klascode (pas hier aan)
  logo: 'https://www.kennemerlyceum.nl/wp-content/themes/kennemerlyceum2025/public/images/kennemer_lyceum_logo.7152d6.svg'
};
const DEMO = /[?&]demo\b/.test(location.search);

/* ================= API ================= */
const API = {
  async fn(naam, body) {   // Supabase edge function
    if (DEMO) return Mock[naam](body);
    const res = await fetch(`${CFG.url}/functions/v1/${naam}`, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: CFG.key, Authorization: 'Bearer ' + CFG.key }, body: JSON.stringify(body) });
    return await res.json();
  },
  async call(fn, args) {
    if (DEMO) return Mock[fn](args);
    const res = await fetch(`${CFG.url}/rest/v1/rpc/${fn}`, {
      method: 'POST', keepalive: fn === 'rk_opslaan',
      headers: { 'Content-Type': 'application/json', apikey: CFG.key, Authorization: 'Bearer ' + CFG.key },
      body: JSON.stringify(args)
    });
    if (!res.ok) throw new Error('Server ' + res.status + ': ' + (await res.text()).slice(0, 200));
    const txt = await res.text();
    return txt ? JSON.parse(txt) : null;
  }
};

/* ---------- Mock-backend voor ?demo (zelfde gedrag als de Supabase-functies, opslag in localStorage) ---------- */
const Mock = (() => {
  const K = 'rk_mock_db';
  const mAuth = (db, lln, pin) => Object.values(db.s).find(x => x.lln === String(lln).trim() && x.pin === pin && pin && (x.fails || 0) < 10);
  const dStand = () => ({ idx: 0, goed: 0, fout: 0, hp: 100, reeks: 0, schild: 0, blok: 0, lg: null, op: false });
  const BLOKMSG = 'Je hebt 3 keer achter elkaar opgegeven. Je kunt even geen duels spelen.';
  const dEinde = d => {
    if (d.status !== 'bezig' || Date.now() < d.start + d.duur * 1000) return false;
    const a = d.st[d.maker], b = d.st[d.tegen]; let w = null;
    if (a.op && !b.op) w = d.tegen; else if (b.op && !a.op) w = d.maker;
    else if (d.mode === 'sprint') { if (a.goed !== b.goed) w = a.goed > b.goed ? d.maker : d.tegen; else if (a.goed > 0) w = a.lg <= b.lg ? d.maker : d.tegen; }
    else { if (a.hp !== b.hp) w = a.hp > b.hp ? d.maker : d.tegen; else if (a.goed !== b.goed) w = a.goed > b.goed ? d.maker : d.tegen; }
    d.status = 'klaar'; d.winnaar = w; return true;
  };
  const load = () => { try { return JSON.parse(localStorage.getItem(K)) || { s: {}, g: {}, pw: 'Docent' }; } catch (e) { return { s: {}, g: {}, pw: 'Docent' }; } };
  const save = db => localStorage.setItem(K, JSON.stringify(db));
  const key = n => String(n || '').trim().replace(/\s+/g, ' ').toLowerCase();
  const sk = (k, n) => String(k).trim().toUpperCase() + '|' + key(n);
  const pub = q => { const c = Object.assign({}, q); delete c.accept; delete c.juist; delete c.uitleg; delete c.fouten; delete c.antwoordTekst; return c; };
  const isOk = (q, w, k) => q.type === 'mc' ? (k != null && k === q.juist) : (w != null && q.accept.some(a => Math.abs(w - a.v) <= a.t));
  return {
    rk_inloggen({ p_lln, p_pin, p_klas, p_naam }) {
      const db = load(); const l = String(p_lln || '').trim(); const k = String(p_klas || '').trim().toUpperCase(); const nm = String(p_naam || '').trim().replace(/\s+/g, ' ');
      if (!/^\d{3,10}$/.test(l)) return { status: 'error', msg: 'Een leerlingnummer bestaat uit 3 tot 10 cijfers' };
      if (!/^\d{4}$/.test(p_pin || '')) return { status: 'error', msg: 'De pincode moet uit 4 cijfers bestaan' };
      const r0 = Object.values(db.s).find(x => x.lln === l);
      if (!r0) {
        if (!k || !nm) return { status: 'nieuw' };
        if (k.length > 12) return { status: 'error', msg: 'Klascode is te lang (max. 12 tekens)' };
        if (nm.length < 2 || nm.length > 40) return { status: 'error', msg: 'Naam moet 2 tot 40 tekens zijn' };
        const id = 'id' + Date.now() + Math.random().toString(36).slice(2, 6);
        db.s[id] = { id, lln: l, klas: k, naam: nm, pin: p_pin, fails: 0, state: {}, xp: 0, updated_at: new Date().toISOString(), created_at: new Date().toISOString() }; save(db);
        return { status: 'new', lln: l, naam: nm, klas: k, state: {} };
      }
      if (r0.pin === '') { r0.pin = p_pin; r0.fails = 0; save(db); return { status: 'ok', lln: l, naam: r0.naam, klas: r0.klas, state: r0.state, pinreset: true }; }
      if ((r0.fails || 0) >= 10) return { status: 'geblokkeerd' };
      if (r0.pin !== p_pin) { r0.fails = (r0.fails || 0) + 1; save(db); return { status: 'badpin' }; }
      r0.fails = 0; save(db); return { status: 'ok', lln: l, naam: r0.naam, klas: r0.klas, state: r0.state };
    },
    rk_opslaan({ p_lln, p_pin, p_state, p_xp }) {
      const db = load(); const r0 = Object.values(db.s).find(x => x.lln === String(p_lln).trim()); if (!r0 || r0.pin !== p_pin || !p_pin || r0.fails >= 10) return false;
      r0.state = p_state; r0.xp = p_xp; r0.updated_at = new Date().toISOString(); save(db); return true;
    },
    rk_ranglijst2({ p_klas, p_lln }) { const db = load(); return Object.values(db.s).filter(s => s.klas === String(p_klas).toUpperCase()).map(s => ({ naam: s.naam, xp: s.xp, ik: s.lln === p_lln })).sort((a, b) => b.xp - a.xp || a.naam.localeCompare(b.naam)); },
    rk_docent_login({ p_pw }) { const db = load(); if (p_pw !== db.pw) return { ok: false }; return { ok: true, klassen: [...new Set(Object.values(db.s).map(s => s.klas))].sort() }; },
    rk_docent_overzicht({ p_pw, p_klas }) { const db = load(); if (p_pw !== db.pw) return null; return Object.values(db.s).filter(s => s.klas === String(p_klas).toUpperCase()).map(s => ({ id: s.id, lln: s.lln, naam: s.naam, xp: s.xp, state: s.state, updated_at: s.updated_at, pinreset: s.pin === '', geblokkeerd: s.fails >= 10 })).sort((a, b) => a.naam.localeCompare(b.naam)); },
    rk_docent_accounts({ p_pw }) { const db = load(); if (p_pw !== db.pw) return null; return Object.values(db.s).map(s => ({ id: s.id, lln: s.lln, naam: s.naam, klas: s.klas, xp: s.xp, updated_at: s.updated_at, created_at: s.created_at, pinreset: s.pin === '', geblokkeerd: s.fails >= 10 })).sort((a, b) => a.klas.localeCompare(b.klas) || a.naam.localeCompare(b.naam)); },
    rk_docent_pinreset({ p_pw, p_id }) { const db = load(); if (p_pw !== db.pw || !db.s[p_id]) return false; db.s[p_id].pin = ''; db.s[p_id].fails = 0; save(db); return true; },
    rk_docent_verwijderen({ p_pw, p_ids }) { const db = load(); if (p_pw !== db.pw) return 0; let n = 0; for (const id of p_ids) if (db.s[id]) { delete db.s[id]; n++; } save(db); return n; },
    'rk-duel-maak'({ lln, pin, mode, onderwerp }) {
      const db = load(); const me = Object.values(db.s).find(x => x.lln === String(lln) && x.pin === pin && pin); if (!me) return { ok: false, msg: 'Log opnieuw in' };
      if (db.duelsUit) return { ok: false, msg: 'Duels staan op dit moment uit' };
      if ((me.dblok || 0) > Date.now()) return { ok: false, msg: BLOKMSG };
      const keuze = RKDUEL.duelKeuze(onderwerp); if (!keuze.length) return { ok: false, msg: 'Kies minstens één onderwerp' }; onderwerp = keuze.join(',');
      const qs = []; while (qs.length < 60) for (const o of [...keuze].sort(() => Math.random() - 0.5)) if (qs.length < 60) qs.push(E.toBattle(RKDUEL.duelSom(o)));
      db.d = db.d || {}; Object.values(db.d).forEach(d => { if (d.maker === me.id && d.status === 'open') d.status = 'geannuleerd'; });
      let c; do { c = String(1000 + Math.floor(Math.random() * 9000)); } while (db.d[c]);
      db.d[c] = { code: c, klas: me.klas, maker: me.id, tegen: null, mode, onderwerp, status: 'open', qs, duur: mode === 'sprint' ? 180 : 480, start: null, winnaar: null, t: Date.now(), st: { [me.id]: dStand() } };
      save(db); return { ok: true, code: c };
    },
    rk_duel_lijst({ p_lln, p_pin }) {
      const db = load(); const me = mAuth(db, p_lln, p_pin); if (!me) return { ok: false, msg: 'Log opnieuw in' };
      const ds = Object.values(db.d || {}); const vers = d => Date.now() - d.t < 600000;
      const mijn = ds.filter(d => (d.maker === me.id || d.tegen === me.id) && (d.status === 'open' && vers(d) || d.status === 'bezig') && !(d.st[me.id] && d.st[me.id].op)).sort((a, b) => b.t - a.t)[0];
      return { ok: true, aan: !db.duelsUit, klas: me.klas, blok_ms: Math.max(0, (me.dblok || 0) - Date.now()), mijn: mijn ? mijn.code : null, open: ds.filter(d => d.klas === me.klas && d.status === 'open' && d.maker !== me.id && vers(d)).map(d => ({ code: d.code, naam: db.s[d.maker].naam, mode: d.mode, onderwerp: d.onderwerp })) };
    },
    rk_duel_join({ p_lln, p_pin, p_code }) {
      const db = load(); const me = mAuth(db, p_lln, p_pin); if (!me) return { ok: false, msg: 'Log opnieuw in' };
      if (db.duelsUit) return { ok: false, msg: 'Duels staan op dit moment uit' };
      if ((me.dblok || 0) > Date.now()) return { ok: false, msg: BLOKMSG };
      const d = (db.d || {})[String(p_code).trim()]; if (!d || d.status !== 'open' || Date.now() - d.t > 600000) return { ok: false, msg: 'Deze uitdaging bestaat niet (meer)' };
      if (d.klas !== me.klas) return { ok: false, msg: 'Deze uitdaging is van een andere klas' };
      if (d.maker === me.id) return { ok: false, msg: 'Je kunt niet tegen jezelf spelen' };
      d.tegen = me.id; d.status = 'bezig'; d.start = Date.now() + 4000; d.st[me.id] = dStand(); save(db); return { ok: true, code: d.code };
    },
    rk_duel_annuleer({ p_lln, p_pin, p_code }) { const db = load(); const me = mAuth(db, p_lln, p_pin); const d = (db.d || {})[p_code]; if (!me || !d || d.maker !== me.id || d.status !== 'open') return false; d.status = 'geannuleerd'; save(db); return true; },
    rk_duel_state({ p_lln, p_pin, p_code }) {
      const db = load(); const me = mAuth(db, p_lln, p_pin); if (!me) return { ok: false, msg: 'Log opnieuw in' };
      const d = (db.d || {})[String(p_code).trim()]; if (!d || (d.maker !== me.id && d.tegen !== me.id)) return { ok: false, msg: 'Duel niet gevonden' };
      if (dEinde(d)) save(db);
      const s = d.st[me.id]; const oid = d.maker === me.id ? d.tegen : d.maker; const o = oid ? d.st[oid] : null; const nu = Date.now();
      const res = { ok: true, code: d.code, mode: d.mode, onderwerp: d.onderwerp, status: d.status, duur: d.duur, tot_start_ms: d.start ? d.start - nu : null, resterend_ms: d.start ? Math.max(0, d.start + d.duur * 1000 - nu) : null,
        me: { idx: s.idx, goed: s.goed, fout: s.fout, hp: s.hp, reeks: s.reeks, schild: s.schild, opgegeven: s.op, opgeef_reeks: me.dreeks || 0, blok_ms: Math.max(0, (s.blok || 0) - nu) },
        tegen: o ? { naam: db.s[oid].naam, goed: o.goed, fout: o.fout, hp: o.hp, reeks: o.reeks, schild: o.schild, opgegeven: o.op } : null };
      if (d.status === 'klaar' && !s.op && me.dreeks) { me.dreeks = 0; save(db); }
      if (d.status === 'bezig' && nu >= d.start) { const q = Object.assign({}, d.qs[s.idx % d.qs.length]); delete q.accept; delete q.fouten; delete q.antwoordTekst; delete q.uitleg; res.vraag = q; }
      if (d.status === 'klaar') { res.uitslag = d.winnaar == null ? 'gelijk' : d.winnaar === me.id ? 'gewonnen' : 'verloren'; res.telt = (o ? o.goed : 0) >= 3; }
      return res;
    },
    rk_duel_antwoord({ p_lln, p_pin, p_code, p_idx, p_waarde, p_skip }) {
      const db = load(); const me = mAuth(db, p_lln, p_pin); if (!me) return { ok: false, msg: 'Log opnieuw in' };
      const d = (db.d || {})[String(p_code).trim()]; if (!d) return { ok: false, msg: 'Duel niet gevonden' };
      dEinde(d); if (d.status !== 'bezig') { save(db); return { ok: false, msg: 'Het duel is afgelopen', klaar: true }; }
      const nu = Date.now(); if (nu < d.start) return { ok: false, msg: 'Het duel is nog niet begonnen' };
      const s = d.st[me.id]; if (s.op) return { ok: false, msg: 'Je hebt dit duel opgegeven', klaar: true }; if (p_idx !== s.idx) return { ok: false, msg: 'Deze som is al beantwoord' }; if ((s.blok || 0) > nu) return { ok: false, msg: 'Nog even wachten' };
      const q = d.qs[s.idx % d.qs.length]; const ok = !p_skip && p_waarde != null && q.accept.some(a => Math.abs(p_waarde - a.v) <= a.t);
      let dmg = 0, geblokt = false, klaar = false;
      if (ok) {
        s.goed++; s.reeks++; s.lg = nu; s.blok = 0;
        if (d.mode === 'kasteel') {
          const oid = d.maker === me.id ? d.tegen : d.maker; const o = d.st[oid]; dmg = s.reeks % 3 === 0 ? 20 : 10;
          if (o.schild > 0) { o.schild--; geblokt = true; dmg = 0; } else o.hp = Math.max(0, o.hp - dmg);
          if (s.goed % 5 === 0) s.schild = Math.min(1, s.schild + 1);
          if (o.hp === 0) { d.status = 'klaar'; d.winnaar = me.id; klaar = true; }
        }
      } else { if (!p_skip) s.fout++; s.reeks = 0; s.blok = nu + (d.mode === 'sprint' ? 3000 : 5000); }
      s.idx++; save(db);
      return { ok: true, correct: ok, antwoordTekst: q.antwoordTekst, uitleg: q.uitleg, dmg, geblokt, klaar, blok_ms: ok ? 0 : d.mode === 'sprint' ? 3000 : 5000 };
    },
    rk_duel_opgeven({ p_lln, p_pin, p_code }) {
      const db = load(); const me = mAuth(db, p_lln, p_pin); if (!me) return { ok: false, msg: 'Log opnieuw in' };
      const d = (db.d || {})[String(p_code).trim()]; if (!d || (d.maker !== me.id && d.tegen !== me.id)) return { ok: false, msg: 'Duel niet gevonden' };
      dEinde(d); if (d.status !== 'bezig') { save(db); return { ok: false, msg: 'Het duel is al afgelopen', klaar: true }; }
      const o = d.st[d.maker === me.id ? d.tegen : d.maker];
      if (o.op) { d.status = 'klaar'; d.winnaar = me.id; save(db); return { ok: true, afgerond: true }; }
      d.st[me.id].op = true; me.dreeks = (me.dreeks || 0) + 1; let blok = 0;
      const r = me.dreeks; if (r >= 3) { me.dreeks = 0; me.dblok = Date.now() + 300000; blok = 300000; }
      save(db); return { ok: true, afgerond: false, reeks: r, blok_ms: blok };
    },
    rk_docent_duels({ p_pw, p_aan }) { const db = load(); if (p_pw !== db.pw) return { ok: false }; if (p_aan !== null && p_aan !== undefined) db.duelsUit = !p_aan; save(db); const ds = Object.values(db.d || {}); return { ok: true, aan: !db.duelsUit, vandaag: ds.filter(d => d.status === 'klaar').length, bezig: ds.filter(d => d.status === 'bezig').length }; },
    rk_game_create({ p_pw, p_klas, p_mode, p_questions, p_duration }) {
      const db = load(); if (p_pw !== db.pw) return { ok: false, msg: 'Wachtwoord onjuist' };
      let c; do { c = String(1000 + Math.floor(Math.random() * 9000)); } while (db.g[c]);
      db.g[c] = { code: c, klas: String(p_klas).toUpperCase(), mode: p_mode, status: 'lobby', q: -1, dur: p_duration, start: null, qs: p_questions, ds: 0, da: -1, pl: {}, an: {} };
      save(db); return { ok: true, code: c };
    },
    rk_game_join({ p_code, p_naam, p_team }) {
      const db = load(); const g = db.g[String(p_code).trim()]; if (!g) return { ok: false, msg: 'Deze spelcode bestaat niet' };
      if (g.status === 'end') return { ok: false, msg: 'Dit spel is al afgelopen' };
      const nk = key(p_naam); const t = g.mode === 'teams' ? Math.max(1, Math.min(p_team || 1, 4)) : 0;
      if (!g.pl[nk]) g.pl[nk] = { naam: String(p_naam).trim(), team: t, score: 0, j: Date.now() };
      else if (g.mode === 'teams' && p_team >= 1 && p_team <= 4) g.pl[nk].team = p_team;
      save(db); return { ok: true, mode: g.mode, status: g.status };
    },
    rk_game_answer({ p_code, p_naam, p_q, p_waarde, p_keuze }) {
      const db = load(); const g = db.g[String(p_code).trim()]; if (!g) return { ok: false, msg: 'Spel niet gevonden' };
      if (g.status !== 'question' || g.q !== p_q) return { ok: false, msg: 'Deze vraag is al gesloten' };
      const nk = key(p_naam); if (!g.pl[nk]) return { ok: false, msg: 'Je doet niet mee aan dit spel' };
      const el = Date.now() - g.start; if (el > (g.dur + 3) * 1000) return { ok: false, msg: 'De tijd is om' };
      const ak = p_q + '|' + nk; if (g.an[ak]) return { ok: false, msg: 'Je had al geantwoord' };
      const q = g.qs[p_q]; const ok = isOk(q, p_waarde, p_keuze);
      const pts = ok ? 500 + Math.round(500 * Math.max(0, 1 - el / (g.dur * 1000))) : 0;
      g.an[ak] = { q: p_q, nk, w: p_waarde, k: p_keuze, ok, pts }; g.pl[nk].score += pts; save(db);
      return { ok: true, msg: 'Antwoord ontvangen' };
    },
    rk_game_control({ p_code, p_pw, p_action, p_waarde, p_keuze }) {
      const db = load(); if (p_pw !== db.pw) return { ok: false, msg: 'Wachtwoord onjuist' };
      const g = db.g[String(p_code).trim()]; if (!g) return { ok: false, msg: 'Spel niet gevonden' };
      if (p_action === 'start' || p_action === 'next') { if (g.q + 1 >= g.qs.length) g.status = 'end'; else { g.q++; g.status = 'question'; g.start = Date.now(); } }
      else if (p_action === 'reveal') { if (g.status === 'question') g.status = 'reveal'; }
      else if (p_action === 'end') g.status = 'end';
      else if (p_action === 'docent') {
        if (g.mode !== 'docent' || g.status !== 'question' || g.da === g.q) return { ok: false, msg: 'Antwoord kan nu niet worden ingevoerd' };
        const q = g.qs[g.q]; const ok = isOk(q, p_waarde, p_keuze); const el = Date.now() - g.start;
        const pts = ok && el <= (g.dur + 3) * 1000 ? 500 + Math.round(500 * Math.max(0, 1 - el / (g.dur * 1000))) : 0;
        g.ds += pts; g.da = g.q; save(db); return { ok: true, correct: ok, points: pts };
      }
      save(db); return { ok: true };
    },
    rk_game_state({ p_code, p_naam }) {
      const db = load(); const g = db.g[String(p_code).trim()]; if (!g) return { ok: false, msg: 'Spel niet gevonden' };
      const pls = Object.entries(g.pl); const ans = Object.values(g.an).filter(a => a.q === g.q);
      const res = { ok: true, code: g.code, status: g.status, mode: g.mode, klas: g.klas, q_index: g.q, total: g.qs.length, duration: g.dur, elapsed_ms: g.start ? Date.now() - g.start : 0, players: pls.length, answered: ans.length };
      const q = g.qs[g.q];
      if (g.status === 'question' || g.status === 'reveal') res.question = pub(q);
      if (p_naam == null) { res.lijst = pls.sort((a, b) => a[1].j - b[1].j).map(([, p]) => ({ naam: p.naam, team: p.team })); res.docent_answered = g.da === g.q; }
      else {
        const nk = key(p_naam); const me = g.pl[nk];
        if (me) {
          const a = g.an[g.q + '|' + nk];
          res.me = { naam: me.naam, team: me.team, score: me.score, answered: !!a, rank: pls.filter(([, p]) => p.score > me.score).length + 1 };
          if ((g.status === 'reveal' || g.status === 'end') && a) { res.me.correct = a.ok; res.me.points = a.pts; }
        }
      }
      if (g.status === 'reveal' || g.status === 'end') {
        if (g.status === 'reveal') {
          const nc = ans.filter(a => a.ok).length;
          Object.assign(res, { antwoordTekst: q.antwoordTekst, uitleg: q.uitleg, pct: ans.length ? Math.round(100 * nc / ans.length) : 0 });
          const wrong = ans.filter(a => !a.ok && (q.type === 'mc' ? a.k != null : a.w != null));
          if (wrong.length) {
            const cnt = {}; wrong.forEach(a => { const v = q.type === 'mc' ? a.k : a.w; cnt[v] = (cnt[v] || 0) + 1; });
            const [v, n] = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0];
            if (q.type === 'mc') res.fout = { waarde: q.opties[+v], n, tekst: null };
            else { const f = (q.fouten || []).find(f => Math.abs(+v - f.v) <= f.t); res.fout = { waarde: +v, n, tekst: f ? f.tekst : null }; }
          }
        }
        const all = pls.map(([, p]) => p);
        res.top = all.slice().sort((a, b) => b.score - a.score || a.naam.localeCompare(b.naam)).slice(0, 10).map(p => ({ naam: p.naam, score: p.score, team: p.team }));
        const tm = {}; all.filter(p => p.team > 0).forEach(p => { (tm[p.team] = tm[p.team] || []).push(p.score); });
        res.teams = Object.entries(tm).map(([t, s]) => ({ team: +t, gem: Math.round(s.reduce((a, b) => a + b, 0) / s.length), n: s.length })).sort((a, b) => b.gem - a.gem);
        res.klas_gem = all.length ? Math.round(all.reduce((a, p) => a + p.score, 0) / all.length) : 0;
        res.docent_score = g.ds;
      }
      return res;
    }
  };
})();

/* ================= HULP ================= */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const app = () => document.getElementById('app');
const nkey = n => String(n || '').trim().replace(/\s+/g, ' ').toLowerCase();
function toast(msg, cls) { const box = $('#toasts'); while (box.children.length >= 3) box.firstChild.remove(); const t = document.createElement('div'); t.className = 'toast ' + (cls || ''); t.innerHTML = msg; $('#toasts').appendChild(t); setTimeout(() => t.remove(), 3000); }
function modal(html) { sluitModal(); const m = document.createElement('div'); m.className = 'modal-achter'; m.id = 'modal'; m.innerHTML = `<div class="modal" role="dialog">${html}</div>`; m.addEventListener('click', e => { if (e.target === m) sluitModal(); }); document.body.appendChild(m); }
function sluitModal() { const m = $('#modal'); if (m) m.remove(); }
const LOGO = `<img class="logo" src="${CFG.logo}" alt="Kennemer Lyceum" onerror="this.style.display='none'">`;
const TEAMS = { 1: 'Team Duin', 2: 'Team Bos', 3: 'Team Zee', 4: 'Team Strand' };

/* ================= STAAT ================= */
let S = null;            // sessie {klas, naam, pin}
let st = null;           // voortgang
const ui = {};           // schermstaat
const leegState = () => ({ v: 1, t: 0, xp: 0, tour: {}, q: {}, tr: {}, un: {}, bd: {}, fs: {}, c: { goed: 0, fout: 0, hint: 0, trgoed: 0, streak: 0, best: 0, tags: {}, par: {} } });
function normState(x) { const b = leegState(); x = x && typeof x === 'object' ? x : {}; for (const k in b) if (x[k] === undefined) x[k] = b[k]; for (const k in b.c) if (x.c[k] === undefined) x.c[k] = b.c[k]; return x; }
const localKey = () => 'rk_local_lln_' + S.lln;

let saveTimer = null, saveState = 'ok', dirty = false;
function bewaar() {
  st.t = Date.now(); dirty = true;
  try { localStorage.setItem(localKey(), JSON.stringify(st)); } catch (e) { /* vol */ }
  clearTimeout(saveTimer); saveTimer = setTimeout(flush, 1200); zetOpslag('bezig');
}
async function flush() {
  if (!S || !dirty) return;
  clearTimeout(saveTimer);
  try {
    const ok = await API.call('rk_opslaan', { p_lln: S.lln, p_pin: S.pin, p_state: st, p_xp: st.xp });
    if (ok === true) { dirty = false; zetOpslag('ok'); }
    else { zetOpslag('fout'); toast('Opslaan geweigerd: log opnieuw in.', ''); }
  } catch (e) { zetOpslag('offline'); }
}
setInterval(() => { if (dirty) flush(); }, 20000);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
function zetOpslag(s) {
  saveState = s; const el = $('#opslag'); if (!el) return;
  el.textContent = { ok: '✓ opgeslagen', bezig: 'opslaan…', offline: '⚠ offline – wordt later opgeslagen', fout: '⚠ niet opgeslagen' }[s];
}

/* ================= VOORTGANG ================= */
const vragenVan = par => par.opdrachten.flatMap(o => o.vragen.map(q => Object.assign(q, { _ctx: o })));
PAR.forEach(p => vragenVan(p));
const parIndex = id => PAR.findIndex(p => p.id === id);
function parStatus(par) {
  const vr = vragenVan(par); let done = 0, eerste = 0, telbaar = 0, hints = 0;
  for (const q of vr) {
    const s = st.q[q.id];
    if (q.type !== 'open' && !q.schatting) telbaar++;
    if (s && s.s) { done++; if (s.f) eerste++; if (s.h) hints++; }
  }
  const tr = st.tr[par.id] || { g: 0, f: 0, st: 0, best: 0 };
  const s1 = done === vr.length; const s2 = s1 && telbaar > 0 && eerste / telbaar >= 0.75; const s3 = s1 && tr.best >= 5;
  return { totaal: vr.length, done, eerste, telbaar, hints, sterren: (s1 ? 1 : 0) + (s2 ? 1 : 0) + (s3 ? 1 : 0), tr };
}
function ontgrendeld(i) { if (i === 0) return true; const p = PAR[i]; if (st.un[p.id]) return true; const vorige = PAR[i - 1]; return parStatus(vorige).done === parStatus(vorige).totaal || parStatus(p).done > 0; }
const RANGEN = [[0, 'Rekenrekruut'], [80, 'Kommakenner'], [200, 'Getallentemmer'], [400, 'Procentprof'], [650, 'Basisbaas'], [1000, 'Rekonomie-legende']];
function rang(xp) { let i = 0; while (i + 1 < RANGEN.length && xp >= RANGEN[i + 1][0]) i++; const vol = RANGEN[i + 1]; return { naam: RANGEN[i][1], van: RANGEN[i][0], tot: vol ? vol[0] : null, i }; }
const BADGES = [
  ['eerste', '👣', 'Eerste stap', 'Je eerste goede antwoord', s => s.c.goed >= 1],
  ['nullen', '👑', 'Nullenkoning', '10 goede antwoorden met grote getallen', s => (s.c.tags.nullen || 0) >= 10],
  ['afronden', '🎯', 'Afrondingsexpert', '10 keer goed afgerond', s => (s.c.tags.afronden || 0) >= 10],
  ['basis', '🧱', 'Basisbewaker', '10 keer de juiste basis gekozen', s => (s.c.tags.basis || 0) >= 10],
  ['btw', '🧾', 'Btw-baas', '5 btw-sommen goed', s => (s.c.tags.btw || 0) >= 5],
  ['pp', '📐', 'Procentpuntpurist', '5 keer procent en procentpunt goed', s => (s.c.tags.pp || 0) >= 5],
  ['reeks10', '🔥', 'Op dreef', '10 keer achter elkaar in één keer goed', s => s.c.best >= 10],
  ['trainer', '🏋️', 'Trainingsbeest', '25 trainingsvragen goed', s => s.c.trgoed >= 25],
  ['boons', '🎒', 'Verzamelaar', '5 blessings verdiend of gekocht', s => (s.c.boons || 0) >= 5],
  ['ongeschonden', '🛡️', 'Ongeschonden', 'Een eindbaas verslagen zonder fout', s => !!s.c.ongeschonden],
  ['ontdekker', '🧭', 'Ontdekkingsreiziger', 'Alle vakjes van een kaart bezocht', s => !!s.m && ['h1', 'h2'].some(h => s.m[h] && KAARTEN[h].nodes.every(n => s.m[h].done[n.id] === 'klaar'))],
  ['boss1', '🐉', 'Drakendoder', 'Eindbaas van hoofdstuk 1 verslagen', s => !!(s.m && s.m.h1 && s.m.h1.boss)],
  ['boss2', '🏆', 'Hydrabedwinger', 'Eindbaas van hoofdstuk 2 verslagen', s => !!(s.m && s.m.h2 && s.m.h2.boss)]
];
function checkBadges() {
  for (const [id, ic, nm, , f] of BADGES) if (!st.bd[id] && f(st)) { st.bd[id] = Date.now(); setTimeout(() => toast(`${ic} Badge behaald: <b>${nm}</b>`, 'badge'), 600); }
}
function geefXP(n, reden) {
  if (n <= 0) return; const oud = rang(st.xp); st.xp += n; toast(`+${n} XP${reden ? ' · ' + reden : ''}`, 'xp');
  const nw = rang(st.xp); if (nw.i > oud.i) setTimeout(() => toast(`🎉 Nieuwe rang: <b>${nw.naam}</b>`, 'badge'), 900);
}
function telGoed(q, eersteKeer, par) {
  st.c.goed++; for (const t of q.tags || []) st.c.tags[t] = (st.c.tags[t] || 0) + 1;
  st.c.par[par] = (st.c.par[par] || 0) + 1;
  if (eersteKeer) { st.c.streak++; st.c.best = Math.max(st.c.best, st.c.streak); } else st.c.streak = 0;
}
function telFout(soort) { st.c.fout++; st.c.streak = 0; if (soort) st.fs[soort] = (st.fs[soort] || 0) + 1; }

/* ================= KOP ================= */
function kop() {
  const rg = rang(st.xp); const pctBalk = rg.tot ? Math.round(100 * (st.xp - rg.van) / (rg.tot - rg.van)) : 100;
  return `<header class="kop">${LOGO}<div class="woordmerk">Rekonomie Arena<small>Kennemer Lyceum · economie</small></div>
  <div class="ruimte"></div>
  <div class="xpblok"><div class="titel"><b>${esc(S.naam)}</b> · ${rg.naam} · ${st.xp} XP</div><div class="xpbalk"><div style="width:${pctBalk}%"></div></div><div class="opslag" id="opslag"></div></div>
  <button class="knop-kop" data-act="home" aria-label="Kaart">🗺️</button></header>`;
}

/* ================= LOGIN ================= */
function loginKop(melding) {
  return `<img class="logo-groot" src="${CFG.logo}" alt="Kennemer Lyceum" onerror="this.outerHTML='<div style=&quot;text-align:center;font-weight:800;color:#12355b;letter-spacing:.04em&quot;>KENNEMER LYCEUM</div>'">
    <h1>Rekonomie Arena</h1><p class="ondertitel">Hoofdstuk 1 en 2 · rekenen en procenten · 4 vwo</p>
    ${DEMO ? '<div class="melding info">Demomodus: gegevens blijven alleen in deze browser.</div>' : ''}
    ${melding ? `<div class="melding fout">${esc(melding)}</div>` : ''}`;
}
function schermLogin(melding) {
  let laatst = {}; try { laatst = JSON.parse(localStorage.getItem('rk_laatst') || '{}'); } catch (e) { /* */ }
  app().innerHTML = `<div class="login-scherm"><div class="login-kaart">${loginKop(melding)}
    <form id="loginForm" autocomplete="off">
      <label class="veld">Leerlingnummer<input id="lLln" required inputmode="numeric" pattern="[0-9]{3,10}" maxlength="10" value="${esc(laatst.lln || '')}" placeholder="bijv. 123456" autocomplete="username"></label>
      <label class="veld">Pincode (4 cijfers)<input id="lPin" required inputmode="numeric" pattern="[0-9]{4}" maxlength="4" type="password" placeholder="••••" autocomplete="current-password"></label>
      <p style="font-size:.82rem;color:var(--zacht);margin:-4px 0 12px">De eerste keer kies je zelf een pincode van 4 cijfers. Onthoud hem goed: je hebt hem nodig om in te loggen op een ander apparaat.</p>
      <button class="knop accent vol" type="submit">Inloggen</button>
    </form>
    <p class="slogan">Ondernemend de wereld in!</p>
    <div style="text-align:center"><button class="link" data-act="docent-login">Docent</button></div>
  </div></div>`;
  $('#loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const lln = $('#lLln').value.trim(), pin = $('#lPin').value.trim();
    if (!/^\d{3,10}$/.test(lln)) return schermLogin('Vul je leerlingnummer in (alleen cijfers).');
    if (!/^\d{4}$/.test(pin)) return schermLogin('De pincode moet uit precies 4 cijfers bestaan.');
    const knop = e.target.querySelector('button'); knop.disabled = true; knop.textContent = 'Bezig…';
    try {
      const res = await API.call('rk_inloggen', { p_lln: lln, p_pin: pin, p_klas: '', p_naam: '' });
      if (res.status === 'nieuw') return schermNieuw(lln, pin);
      verwerkLogin(res, lln, pin);
    } catch (er) { schermLogin('Geen verbinding met de server. Controleer je internet en probeer het opnieuw.'); }
  });
}
function schermNieuw(lln, pin, melding) {
  app().innerHTML = `<div class="login-scherm"><div class="login-kaart">${loginKop(melding)}
    <h2 style="text-align:center;color:var(--kl-blauw)">Welkom! 👋</h2>
    <p style="text-align:center;margin-top:-4px">Leerlingnummer <b>${esc(lln)}</b> is nieuw. Maak je account af.</p>
    <form id="nieuwForm" autocomplete="off">
      <label class="veld">Klas<select id="nKlas" required><option value="">Kies je klas…</option>${CFG.klassen.map(k => `<option value="${k}">${k}</option>`).join('')}</select></label>
      <label class="veld">Je naam (zichtbaar in de ranglijst)<input id="nNaam" required maxlength="40" placeholder="bijv. Sanne de Vries" autocomplete="name"></label>
      <label class="veld">Herhaal je pincode<input id="nPin" required inputmode="numeric" pattern="[0-9]{4}" maxlength="4" type="password" placeholder="••••"></label>
      <button class="knop accent vol" type="submit">Account aanmaken</button>
    </form>
    <div style="text-align:center"><button class="link" data-act="naar-login">← Ander leerlingnummer</button></div>
  </div></div>`;
  $('#nieuwForm').addEventListener('submit', async e => {
    e.preventDefault();
    const klas = $('#nKlas').value.trim().toUpperCase(), naam = $('#nNaam').value.trim().replace(/\s+/g, ' ');
    if (!klas) return schermNieuw(lln, pin, 'Kies je klas.');
    if ($('#nPin').value.trim() !== pin) return schermNieuw(lln, pin, 'De pincodes zijn niet gelijk. Probeer het opnieuw.');
    const knop = e.target.querySelector('button'); knop.disabled = true; knop.textContent = 'Bezig…';
    try {
      const res = await API.call('rk_inloggen', { p_lln: lln, p_pin: pin, p_klas: klas, p_naam: naam });
      if (res.status === 'error') return schermNieuw(lln, pin, res.msg);
      verwerkLogin(res, lln, pin);
    } catch (er) { schermNieuw(lln, pin, 'Geen verbinding met de server.'); }
  });
}
function verwerkLogin(res, lln, pin) {
  if (res.status === 'badpin') return schermLogin('Deze pincode hoort niet bij dit leerlingnummer. Ben je hem kwijt? Vraag je docent om je pincode te resetten.');
  if (res.status === 'geblokkeerd') return schermLogin('Er is te vaak een verkeerde pincode ingevoerd. Vraag je docent om je pincode te resetten.');
  if (res.status === 'error') return schermLogin(res.msg);
  S = { lln: res.lln, klas: res.klas, naam: res.naam, pin };
  localStorage.setItem('rk_sessie', JSON.stringify(S)); localStorage.setItem('rk_laatst', JSON.stringify({ lln: res.lln }));
  const server = normState(res.state || {}); let lokaal = null;
  try { lokaal = JSON.parse(localStorage.getItem(localKey())); } catch (er) { /* */ }
  st = lokaal && lokaal.t > (server.t || 0) ? normState(lokaal) : server;
  if (lokaal && lokaal.t > (server.t || 0)) bewaar();
  if (res.status === 'new') toast('Welkom, ' + esc(res.naam) + '! Je account is aangemaakt.', '');
  if (res.pinreset) toast('Je nieuwe pincode is opgeslagen.', '');
  schermHome();
}
async function autoLogin() {
  let s = null; try { s = JSON.parse(localStorage.getItem('rk_sessie')); } catch (e) { /* */ }
  if (!s || !s.lln) { localStorage.removeItem('rk_sessie'); return schermLogin(); }
  try {
    const res = await API.call('rk_inloggen', { p_lln: s.lln, p_pin: s.pin, p_klas: '', p_naam: '' });
    if (res.status !== 'ok') { localStorage.removeItem('rk_sessie'); return schermLogin(); }
    verwerkLogin(res, s.lln, s.pin);
  } catch (e) {
    S = s; let lokaal = null; try { lokaal = JSON.parse(localStorage.getItem(localKey())); } catch (er) { /* */ }
    if (!lokaal) return schermLogin('Geen verbinding met de server.');
    st = normState(lokaal); schermHome(); zetOpslag('offline');
  }
}

/* ================= HOME ================= */
function schermHome() {
  ui.scherm = 'home'; ui.node = null; ui.h = null; clearInterval(ui.evIv); mapState(); checkBadges();
  const behaald = BADGES.filter(b => st.bd[b[0]]).length;
  app().innerHTML = kop() + `<main class="wrap">
  <div class="kaart" style="display:flex;flex-wrap:wrap;gap:14px;align-items:center">
    <div style="flex:1;min-width:220px"><h2 style="margin:0">Hoi ${esc(S.naam.split(' ')[0])}!</h2>
      <div style="color:var(--zacht);font-size:.92rem">Klas ${esc(S.klas)} · 🪙 ${st.m.munten} munten · ${behaald}/${BADGES.length} badges</div></div>
    <div class="knoprij">
      <button class="knop accent" data-act="strijd-join">⚔️ Doe mee met de strijd</button>
      <button class="knop accent" data-act="duel-arena">🤺 Duel</button>
      <button class="knop licht" data-act="ranglijst">🏆 Ranglijst</button>
      <button class="knop licht" data-act="badges">🎖️ Badges</button>
    </div>
  </div>
  <h2 class="kamerkop">🗺️ Kies je kaart</h2>
  <div class="kaartkaarten">${kaartKaartje('h1')}${kaartKaartje('h2')}</div>
  <div class="kaart" id="top10"><h3 style="margin:0">🏆 Top 10 van ${esc(S.klas)}</h3><p style="color:var(--zacht);margin:6px 0 0">Laden…</p></div>
  <details class="kaart"><summary style="font-weight:700;cursor:pointer">Hoe werkt het?</summary>
    <ul style="margin-bottom:0">
      <li>Elk hoofdstuk is een <b>kaart</b>. Je begint onderaan en kiest steeds een vakje dat met een pad verbonden is. Bovenaan wacht de <b>eindbaas</b>: de zelftest.</li>
      <li>⚔️ Opdracht uit het boekje · 💀 Elite (pittig, dubbele munten en een blessing) · ❓ Onbekend · 🧰 Schatkist · 🔥 Rustplaats · 🛒 Winkel.</li>
      <li>Je hebt <b>5 harten</b>. Een fout antwoord kost een hart. Zijn ze op? Dan lees je eerst de theorie en ga je verder met 3 harten.</li>
      <li>Met <b>munten</b> koop je in de winkel boons: 🦘 Sprong (vakje overslaan), 🛡️ Schild, 💡 Lampje (gratis hint) en 🍀 Klavertje (dubbele munten). Je kunt er maximaal 3 bij je hebben.</li>
      <li>Versla je de eindbaas, dan opent de volgende kaart en mag je in <b>vrij spel</b> alle andere vakjes nog bezoeken.</li>
      <li>Typ getallen zoals je gewend bent: <b>1.250,75</b> · <b>-2,9</b> · <b>588,7 miljard</b>, en kies de juiste eenheid.</li>
    </ul><button class="knop licht klein" data-act="tour-opnieuw" data-t="home" style="margin-top:8px">▶ Rondleiding opnieuw bekijken</button></details>
  <h2 class="kamerkop">🏋️ Oefenruimte</h2>
  <div class="kaart oefenruimte"><p style="margin-top:0;color:var(--zacht)">Theorie en eindeloze training per paragraaf, met steeds nieuwe getallen. Telt mee voor XP, niet voor de kaart.</p>
    <div class="knoprij">${PAR.map(p => `<button class="knop licht klein" data-act="open-par" data-id="${p.id}">§ ${p.id} ${esc(p.titel)}</button>`).join('')}</div></div>
  <div style="text-align:center"><button class="link" data-act="uitloggen">Uitloggen</button></div>
  </main>`;
  zetOpslag(saveState);
  laadTop10();
  tourNa('home', 900);
}
async function haalRanglijst() {
  if (dirty) await flush();          // eigen XP eerst opslaan, dan klopt de ranglijst
  return await API.call('rk_ranglijst2', { p_klas: S.klas, p_lln: S.lln });
}
function top10HTML(lijst, compact) {
  const ik = lijst.findIndex(l => l.ik);
  const top = lijst.slice(0, 10);
  const li = (l, i) => `<li class="${i === ik ? 'ik' : ''}"><span class="pos">${['🥇', '🥈', '🥉'][i] || i + 1}</span><span class="nm">${esc(l.naam)}</span><span class="sc">${l.xp} XP</span></li>`;
  let h = `<ol class="ranglijst ${compact ? 'top10' : ''}">${top.map(li).join('')}</ol>`;
  if (ik >= 10) h += `<ol class="ranglijst" style="margin-top:6px">${li(lijst[ik], ik)}</ol>`;
  if (!lijst.length) h = '<p>Nog niemand op de ranglijst.</p>';
  return h;
}
async function laadTop10() {
  const el = $('#top10'); if (!el) return;
  try {
    const lijst = await haalRanglijst(); const el2 = $('#top10'); if (!el2) return;
    const ik = lijst.findIndex(l => l.ik);
    el2.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:6px"><h3 style="margin:0">🏆 Top 10 van ${esc(S.klas)}</h3><span style="color:var(--zacht);font-size:.88rem">${ik >= 0 ? 'Jij staat op plek <b>' + (ik + 1) + '</b> van ' + lijst.length : ''}</span></div>` + top10HTML(lijst, true);
  } catch (e) { const el2 = $('#top10'); if (el2) el2.innerHTML = '<h3 style="margin:0">🏆 Top 10</h3><p style="color:var(--zacht)">De ranglijst kan nu niet worden geladen.</p>'; }
}

/* ================= PARAGRAAF ================= */
function openPar(id, tab) {
  const par = PAR.find(p => p.id === id); ui.scherm = 'par'; ui.node = null; ui.par = par; ui.tab = tab === 'theorie' ? 'theorie' : 'training';
  if (ui.tab === 'opdrachten' && (!ui.qid || !vragenVan(par).some(q => q.id === ui.qid))) {
    const vr = vragenVan(par); const eerste = vr.find(q => !(st.q[q.id] && st.q[q.id].s)); ui.qid = (eerste || vr[0]).id;
  }
  renderPar();
}
function renderPar() {
  const par = ui.par; const x = parStatus(par);
  let inhoud = '';
  if (ui.tab === 'theorie') inhoud = `<div class="kaart theorie">${par.theorie}<p style="color:var(--zacht);font-size:.85rem;margin-top:16px">Zie ook Rekonomie blz. ${par.p}.</p><button class="knop" data-act="tab" data-tab="training">Naar de training →</button></div>`;
  else if (ui.tab === 'opdrachten') inhoud = renderOpdrachten(par);
  else inhoud = renderTraining(par);
  app().innerHTML = kop() + `<main class="wrap">
    <div class="terugrij"><button class="knop licht klein" data-act="home">← Terug</button><h2>Oefenruimte § ${par.id} ${esc(par.titel)}</h2></div>
    <nav class="tabs">${[['theorie', '📖 Theorie'], ['training', '🏋️ Training']].map(([t, l]) => `<button class="${ui.tab === t ? 'actief' : ''}" data-act="tab" data-tab="${t}">${l}</button>`).join('')}</nav>
    ${inhoud}</main>`;
  zetOpslag(saveState);
  tourNa('oefen');
  const inp = $('#ant'); if (inp && !('ontouchstart' in window)) inp.focus();
}

function renderOpdrachten(par) {
  const vr = vragenVan(par); const q = vr.find(v => v.id === ui.qid) || vr[0]; ui.qid = q.id;
  const chips = par.opdrachten.map(o => `<div class="chipgroep"><b>${o.nr}</b>${o.vragen.map(v => {
    const s = st.q[v.id]; const cls = s && s.s ? (s.s === 'getoond' ? 'getoond' : 'klaar') : '';
    const lbl = v.id.replace(o.nr, '') || '•';
    return `<button class="chip ${cls} ${v.id === q.id ? 'actief' : ''}" data-act="kies-vraag" data-id="${v.id}" aria-label="Vraag ${v.id}">${lbl}</button>`;
  }).join('')}</div>`).join('');
  if (!ui.cur || ui.cur.q !== q || ui.cur.mode !== 'boek') ui.cur = { q, mode: 'boek', unit: null, fb: '', hint: false };
  return `<div class="chips">${chips}</div><div class="kaart" id="vraagkaart">${vraagHTML(ui.cur)}</div>`;
}

function vraagHTML(c) {
  const q = c.q; const ctx = q._ctx || {}; const s = c.mode === 'boek' ? (st.q[q.id] || {}) : {};
  const klaar = c.mode === 'boek' ? !!s.s : !!c.klaar;
  let h = '';
  if (ctx.context) h += `<div class="context"><span class="bron">Opdracht ${ctx.nr} · Rekonomie blz. ${ctx.p}</span>${ctx.context}</div>`;
  h += `<div class="vraaglabel">${c.label || (c.mode === 'boek' ? 'VRAAG ' + q.id : c.mode === 'check' ? 'SNELLE CHECK ' + (ui.check.n + 1) + '/3' : 'TRAINING')}</div><div class="vraagtekst">${q.tekst}</div>`;
  if (klaar && c.mode === 'boek') {
    h += `<div class="feedback ${s.s === 'getoond' ? 'bijna' : 'goed'}"><b>${s.s === 'getoond' ? 'Uitwerking bekeken' : s.s === 'zelf' ? 'Zelf nagekeken: ' + ({ goed: 'goed', deels: 'deels goed', fout: 'nog niet goed' }[s.z] || '') : '✓ Goed' + (s.f ? ' in één keer' : '')}</b>
      ${q.type !== 'open' ? `<div>Antwoord: <b>${esc(E.antwoordTekst(q))}</b></div>` : `<div class="uitleg"><b>Modelantwoord:</b> ${esc(q.model)}</div>`}
      ${q.uitleg ? `<div class="uitleg">${q.uitleg}</div>` : ''}</div>`;
    h += `<div class="knoprij">${ui.node ? nodeVolgendeKnop() : volgendeKnop()}</div>`;
    return h;
  }
  if (q.type === 'mc') {
    h += `<div class="opties">${q.opties.map((o, i) => `<button class="optie ${c.fout && c.fout.includes(i) ? 'fout' : ''}" data-act="mc" data-i="${i}" ${c.fout && c.fout.includes(i) ? 'disabled' : ''}>${esc(o)}</button>`).join('')}</div>`;
  } else if (q.type === 'open') {
    h += `<textarea class="open" id="openAnt" placeholder="Typ hier je antwoord…">${esc(c.open || '')}</textarea>`;
    if (c.toonModel) {
      h += `<div class="feedback info"><b>Modelantwoord:</b> ${esc(q.model)}</div><p style="font-weight:600">Vergelijk met jouw antwoord. Hoe heb je het gedaan?</p>
      <div class="knoprij"><button class="knop groen" data-act="zelf" data-z="goed">Goed</button><button class="knop accent" data-act="zelf" data-z="deels">Deels goed</button><button class="knop licht" data-act="zelf" data-z="fout">Nog niet goed</button></div>`;
    } else h += `<div class="knoprij" style="margin-top:10px"><button class="knop" data-act="toon-model">Bekijk modelantwoord</button></div>`;
  } else {
    const keuze = E.KEUZE_EENHEDEN.includes(q.unit);
    const opties = keuze ? (q.unit === '$' ? ['$', '€', '%'] : ['€', '%', 'procentpunt']) : [];
    h += `<div class="invoerrij"><div class="invoer-wrap"><input id="ant" class="antwoord-invoer" type="text" inputmode="decimal" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="${q.voluit ? 'bijv. 1.250.000.000' : 'jouw antwoord'}" value="${esc(c.inv || '')}" enterkeyhint="done">
      <button class="teken" data-act="teken" aria-label="Plus/min wisselen">±</button></div>
      ${keuze ? `<div class="eenheden"><span>eenheid:</span>${opties.map(u => `<button class="eenheid ${c.unit === u ? 'gekozen' : ''}" data-act="unit" data-u="${u}">${u === 'procentpunt' ? 'procentpunt' : u}</button>`).join('')}</div>`
        : q.unit ? `<span class="eenheid-vast">${esc(q.unit)}</span>` : ''}</div>
      <div class="knoprij"><button class="knop" data-act="controleer">Controleer</button>
      ${c.mode === 'boek' && q.hint && !c.hint ? hintKnop() : ''}
      ${c.mode === 'boek' && (s.a || 0) >= 3 ? `<button class="knop licht" data-act="toon-uitwerking">Toon uitwerking</button>` : ''}
      ${c.mode !== 'boek' && (c.pogingen || 0) >= 2 ? `<button class="knop licht" data-act="toon-uitwerking">Toon uitwerking</button>` : ''}</div>`;
  }
  if (q.type === 'mc' && c.mode === 'boek' && q.hint && !c.hint) h += `<div class="knoprij">${hintKnop()}</div>`;
  if (c.hint && q.hint) h += `<div class="hintblok">💡 ${q.hint}</div>`;
  if (c.fb) h += c.fb;
  if (c.mode !== 'boek' && c.klaar) h += `<div class="knoprij">${c.mode === 'check' ? '<button class="knop" data-act="check-volgende">Verder →</button>' : c.mode === 'event' ? '<button class="knop accent" data-act="event-verder">Verder →</button>' : '<button class="knop" data-act="train-volgende">Volgende som →</button>'}</div>`;
  return h;
}
function hintKnop() { const lamp = ui.node && st.m && st.m.boons.includes('lampje'); return `<button class="knop licht" data-act="hint">💡 ${lamp ? 'Hint (gebruikt je Lampje)' : 'Hint (halve XP)'}</button>`; }
function volgendeKnop() {
  const vr = vragenVan(ui.par); const i = vr.findIndex(v => v.id === ui.qid);
  const open = vr.slice(i + 1).find(v => !(st.q[v.id] && st.q[v.id].s)) || vr.find(v => !(st.q[v.id] && st.q[v.id].s));
  if (open) return `<button class="knop" data-act="kies-vraag" data-id="${open.id}">Volgende vraag →</button>`;
  return `<button class="knop accent" data-act="tab" data-tab="training">Alles af! Ga trainen 🏋️</button><button class="knop licht" data-act="home">Terug naar de kaart</button>`;
}
function herteken() {
  const k = $('#vraagkaart'); if (!k) return renderPar();
  const inv = $('#ant'); if (inv) ui.cur.inv = inv.value;
  const op = $('#openAnt'); if (op) ui.cur.open = op.value;
  k.innerHTML = vraagHTML(ui.cur);
}
function fbHTML(cls, titel, tekst) { return `<div class="feedback ${cls}"><b>${titel}</b>${tekst ? ' ' + tekst : ''}</div>`; }

/* ---------- controleren ---------- */
function controleer() {
  const c = ui.cur; const q = c.q; const inv = $('#ant') ? $('#ant').value : ''; c.inv = inv;
  const res = E.check(q, inv, c.unit);
  if (c.mode === 'check') return checkAntwoord(res);
  if (c.mode === 'event') return eventAntwoord(res);
  const rec = c.mode === 'boek' ? (st.q[q.id] = st.q[q.id] || { a: 0 }) : null;
  if (res.status === 'leeg' || res.status === 'kies-eenheid') { c.fb = fbHTML('info', '', res.tekst); return herteken(); }
  if (res.status === 'bijna') { c.fb = fbHTML('bijna', 'Bijna.', res.tekst); if (res.soort) st.fs[res.soort] = (st.fs[res.soort] || 0) + 1; bewaar(); return herteken(); }
  if (res.status === 'eenheid') { c.fb = fbHTML('bijna', 'Eenheid?', res.tekst); st.fs.eenheid = (st.fs.eenheid || 0) + 1; bewaar(); return herteken(); }
  if (res.status === 'fout') {
    telFout(res.soort);
    if (rec) rec.a = (rec.a || 0) + 1; else c.pogingen = (c.pogingen || 0) + 1;
    if (c.mode === 'train') { const tr = trRec(ui.par.id); tr.f++; tr.st = 0; }
    if (ui.node && c.mode === 'boek') nodeNaFout();
    c.fb = fbHTML('fout', '✗', res.tekst + ((rec ? rec.a : c.pogingen) >= (rec ? 3 : 2) ? ' <i>Lukt het niet? Bekijk de uitwerking.</i>' : ''));
    bewaar(); herteken(); if (ui.node) hudVernieuw(); const k = $('#vraagkaart'); if (k) { k.classList.remove('schud'); void k.offsetWidth; k.classList.add('schud'); }
    return;
  }
  // goed
  goedAfhandelen(c, rec);
}
function goedAfhandelen(c, rec) {
  const q = c.q;
  if (c.mode === 'boek') {
    const eerste = (rec.a || 0) === 0 && (!c.hint || c.gratisHint);
    let xp = rec.a === 0 ? 10 : rec.a === 1 ? 6 : 3; if (c.hint && !c.gratisHint) xp = Math.ceil(xp / 2);
    if (q.schatting) xp = 5; // schatvraag
    Object.assign(rec, { s: 'goed', f: eerste && !q.schatting, h: !!c.hint && !c.gratisHint, x: xp });
    telGoed(q, eerste, ui.par.id); geefXP(xp, eerste ? 'in één keer goed' : '');
    if (ui.node) { nodeMunten(q, rec); c.fb = ''; checkBadges(); bewaar(); herteken(); hudVernieuw(); return; }
    const was = parStatus(ui.par);
    c.fb = '';
    checkBadges(); bewaar(); herteken();
    if (was.done === was.totaal) setTimeout(() => toast(`⭐ Paragraaf ${ui.par.id} voltooid!`, 'badge'), 400);
  } else {
    const tr = trRec(ui.par.id); const eerste = !(c.pogingen > 0);
    tr.g++; if (eerste) { tr.st++; tr.best = Math.max(tr.best, tr.st); } else tr.st = 0;
    st.c.trgoed++; telGoed(q, eerste, ui.par.id);
    let xp = eerste ? 6 : 2; geefXP(xp);
    if (eerste && tr.st > 0 && tr.st % 5 === 0) { geefXP(10, `reeks van ${tr.st}!`); }
    c.klaar = true; c.fb = fbHTML('goed', '✓ Goed!', `Antwoord: <b>${esc(E.antwoordTekst(q))}</b><div class="uitleg">${q.uitleg || ''}</div>`);
    checkBadges(); bewaar(); renderPar();
  }
}
const trRec = id => (st.tr[id] = st.tr[id] || { g: 0, f: 0, st: 0, best: 0 });

/* ---------- training ---------- */
function renderTraining(par) {
  if (!ui.cur || ui.cur.mode !== 'train' || ui.cur.par !== par.id) ui.cur = { q: genereer(par.id), mode: 'train', par: par.id, unit: null, fb: '' };
  const tr = trRec(par.id);
  return `<div class="trainkop"><div>Steeds nieuwe sommen met andere getallen. Een reeks van 5 in één keer goed geeft <b>+10 XP</b> extra.</div>
    <div class="reeks"><span class="vlammen">🔥</span> reeks ${tr.st} · record ${tr.best}</div></div>
    <div class="kaart" id="vraagkaart">${vraagHTML(ui.cur)}</div>`;
}

/* ---------- snelle check ---------- */
function startCheck(id) {
  const par = PAR.find(p => p.id === id); ui.scherm = 'check'; ui.par = par;
  ui.check = { n: 0, goed: 0 }; ui.cur = { q: genereer(id), mode: 'check', unit: null, fb: '' }; renderCheck();
}
function renderCheck() {
  const par = ui.par;
  app().innerHTML = kop() + `<main class="wrap"><div class="terugrij"><button class="knop licht klein" data-act="home">← Kaart</button><h2>Snelle check ${par.id} ${esc(par.titel)}</h2></div>
    <div class="melding info">Beheers je deze stof al? Maak 3 sommen in één keer goed, dan gaat paragraaf ${par.id} open. Je mag de theorie bekijken: <button class="link" data-act="check-theorie">theorie openen</button></div>
    <div class="kaart" id="vraagkaart">${vraagHTML(ui.cur)}</div></main>`;
  zetOpslag(saveState);
}
function checkAntwoord(res) {
  const c = ui.cur;
  if (res.status === 'leeg' || res.status === 'kies-eenheid') { c.fb = fbHTML('info', '', res.tekst); return herteken(); }
  const goed = res.status === 'goed';
  if (goed) ui.check.goed++;
  c.klaar = true;
  c.fb = fbHTML(goed ? 'goed' : 'fout', goed ? '✓ Goed!' : '✗ Helaas.', `${goed ? '' : res.tekst + ' '}Antwoord: <b>${esc(E.antwoordTekst(c.q))}</b><div class="uitleg">${c.q.uitleg || ''}</div>`);
  herteken();
}
function checkVolgende() {
  ui.check.n++;
  if (ui.check.n < 3) { ui.cur = { q: genereer(ui.par.id), mode: 'check', unit: null, fb: '' }; return renderCheck(); }
  const par = ui.par;
  if (ui.check.goed === 3) {
    st.un[par.id] = true; geefXP(15, 'snelle check'); bewaar();
    modal(`<h2>🔓 Paragraaf ${par.id} is open!</h2><p>Alle drie goed. Je kunt nu verder met de opdrachten van ${esc(par.titel)}.</p><div class="knoprij"><button class="knop accent" data-act="open-par" data-id="${par.id}">Naar ${par.id}</button><button class="knop licht" data-act="home">Kaart</button></div>`);
  } else {
    modal(`<h2>${ui.check.goed}/3 goed</h2><p>Nog niet genoeg om paragraaf ${par.id} te openen. Maak eerst de vorige paragraaf af, of probeer de snelle check later opnieuw.</p><div class="knoprij"><button class="knop" data-act="slot" data-id="${par.id}">Opnieuw proberen</button><button class="knop licht" data-act="home">Kaart</button></div>`);
  }
}

/* ================= RANGLIJST & BADGES ================= */
async function toonRanglijst() {
  modal('<p>Ranglijst laden…</p>');
  try {
    const lijst = await haalRanglijst();
    modal(`<button class="knop licht klein sluit" data-act="sluit">✕</button><h2>🏆 Top 10 ${esc(S.klas)}</h2>${top10HTML(lijst, false)}<p style="color:var(--zacht);font-size:.85rem">Je ziet de top 10 en je eigen plek. ${lijst.length} leerlingen in deze klas.</p>`);
  } catch (e) { modal('<button class="knop licht klein sluit" data-act="sluit">✕</button><p>De ranglijst kan nu niet worden geladen (geen verbinding).</p>'); }
}
function toonBadges() {
  checkBadges();
  modal(`<button class="knop licht klein sluit" data-act="sluit">✕</button><h2>🎖️ Badges</h2><div class="badges">${BADGES.map(([id, ic, nm, oms]) => `<div class="badge ${st.bd[id] ? 'behaald' : ''}"><div class="ic">${ic}</div><div class="bn">${nm}</div><div class="bo">${oms}</div></div>`).join('')}</div>
  <h3>Rangen</h3><p style="font-size:.9rem">${RANGEN.map(([x, n]) => `${n} (${x} XP)`).join(' → ')}</p>`);
}

/* ================= STRIJD – LEERLING ================= */
const G = { poll: null, code: null, laatste: null, ant: null };
function strijdJoinModal(melding) {
  modal(`<button class="knop licht klein sluit" data-act="sluit">✕</button><h2>⚔️ Doe mee met de strijd</h2>
    <p>Typ de spelcode die op het bord staat.</p>${melding ? `<div class="melding fout">${esc(melding)}</div>` : ''}
    <form id="joinForm"><label class="veld">Spelcode<input id="jCode" inputmode="numeric" maxlength="4" pattern="[0-9]{4}" required style="font-size:28px;letter-spacing:.3em;text-align:center"></label>
    <button class="knop accent vol" type="submit">Meedoen</button></form>`);
  $('#joinForm').addEventListener('submit', async e => {
    e.preventDefault(); const code = $('#jCode').value.trim();
    try {
      const res = await API.call('rk_game_join', { p_code: code, p_naam: S.naam, p_team: null });
      if (!res.ok) return strijdJoinModal(res.msg);
      sluitModal(); G.code = code; G.mode = res.mode; G.team = null; G.ant = null;
      if (res.mode === 'teams' && res.status === 'lobby') return kiesTeam();
      startStrijdPoll();
    } catch (er) { strijdJoinModal('Geen verbinding met de server.'); }
  });
}
function kiesTeam() {
  ui.scherm = 'strijd';
  app().innerHTML = `<div class="strijd-scherm"><div class="wrap"><h2>Kies je team</h2><div class="teamknoppen">${[1, 2, 3, 4].map(t => `<button class="teamknop team-${t}" data-act="team" data-t="${t}">${TEAMS[t]}</button>`).join('')}</div></div></div>`;
}
function startStrijdPoll() { ui.scherm = 'strijd'; stopPoll(); pollStrijd(); G.poll = setInterval(pollStrijd, 1500); }
function stopPoll() { if (G.poll) clearInterval(G.poll); G.poll = null; if (G.tik) clearInterval(G.tik); G.tik = null; }
async function pollStrijd() {
  try { const s = await API.call('rk_game_state', { p_code: G.code, p_naam: S.naam }); if (ui.scherm === 'strijd') renderStrijd(s); } catch (e) { /* tijdelijk geen verbinding */ }
}
function renderStrijd(s) {
  if (!s.ok) { stopPoll(); return schermHome(); }
  const sleutel = s.status + '|' + s.q_index + '|' + (s.me && s.me.answered) + '|' + (s.status === 'lobby' ? s.players : '') + '|' + (s.me && s.me.team);
  G.s = s;
  if (sleutel === G.laatste) { return; }
  G.laatste = sleutel;
  const me = s.me || {}; const team = me.team ? `<span class="teamlabel team-${me.team}">${TEAMS[me.team]}</span>` : '';
  let h = `<div class="strijd-scherm"><div class="wrap"><div class="strijd-kop"><div><b>${esc(S.naam)}</b> ${team}</div><div>Score: <b>${me.score || 0}</b>${me.rank ? ' · plek ' + me.rank : ''}</div></div>`;
  if (s.status === 'lobby') h += `<div class="kaart" style="text-align:center"><div class="groot">Je doet mee! 🎉</div><p>Wacht tot je docent de strijd start.<br>${s.players} spelers in de lobby.</p>${s.mode === 'teams' ? '<button class="knop licht" data-act="wissel-team">Ander team kiezen</button>' : ''}</div>`;
  else if (s.status === 'question') {
    const q = s.question;
    h += `<div class="timerbalk"><div id="tbalk" style="width:100%"></div></div><div class="strijd-kop"><div>Vraag ${s.q_index + 1} van ${s.total}</div><div class="timer" id="tijd"></div></div>`;
    if (me.answered) h += `<div class="kaart" style="text-align:center"><div class="groot">Antwoord verstuurd ✓</div><p>Wacht op de anderen…</p></div>`;
    else {
      h += `<div class="kaart">${q.context ? `<div class="context">${q.context}</div>` : ''}<div class="vraagtekst">${q.tekst}</div>`;
      if (q.type === 'mc') h += `<div class="opties">${q.opties.map((o, i) => `<button class="optie" data-act="s-mc" data-i="${i}">${esc(o)}</button>`).join('')}</div>`;
      else h += `<div class="invoerrij"><div class="invoer-wrap"><input id="sAnt" class="antwoord-invoer" type="text" inputmode="decimal" autocomplete="off" placeholder="jouw antwoord" enterkeyhint="send"><button class="teken" data-act="teken-s">±</button></div>${q.unit ? `<span class="eenheid-vast">${esc(q.unit)}</span>` : ''}</div>
        <div id="sMelding"></div><button class="knop accent vol" data-act="s-verstuur">Verstuur</button>`;
      h += `</div>`;
    }
  } else if (s.status === 'reveal') {
    const goed = me.correct;
    h += `<div class="kaart" style="text-align:center"><div class="groot">${me.answered ? (goed ? '✓ Goed! +' + me.points : '✗ Helaas') : '⏱️ Geen antwoord gegeven'}</div>
      <p>Juiste antwoord: <b>${esc(s.antwoordTekst)}</b></p>${s.uitleg ? `<p style="font-size:.92rem">${s.uitleg}</p>` : ''}<p>Je staat op plek <b>${me.rank}</b>.</p></div>`;
  } else if (s.status === 'end') {
    h += `<div class="kaart" style="text-align:center"><div class="groot">🏁 Einde van de strijd</div><p>Jouw score: <b>${me.score}</b> · plek <b>${me.rank}</b></p>
      ${s.mode === 'docent' ? `<p>Klas gemiddeld <b>${s.klas_gem}</b> tegen docent <b>${s.docent_score}</b>: ${s.klas_gem > s.docent_score ? '<b>de klas wint!</b> 🎉' : s.klas_gem === s.docent_score ? 'gelijkspel!' : 'de docent wint deze keer.'}</p>` : ''}
      ${s.teams && s.teams.length ? `<p>Winnend team: <b>${TEAMS[s.teams[0].team]}</b></p>` : ''}
      <button class="knop" data-act="strijd-uit">Terug naar de kaart</button></div>`;
    stopPoll();
  }
  h += `</div></div>`;
  const oudeInv = $('#sAnt') ? $('#sAnt').value : '';
  app().innerHTML = h;
  if ($('#sAnt')) { $('#sAnt').value = oudeInv; }
  if (s.status === 'question' && !me.answered) startTik(s);
  else if (s.status === 'question') startTik(s);
}
function startTik(s) {
  if (G.tik) clearInterval(G.tik);
  const eind = Date.now() + s.duration * 1000 - s.elapsed_ms;
  const tik = () => {
    const rest = Math.max(0, Math.ceil((eind - Date.now()) / 1000)); const t = $('#tijd'); const b = $('#tbalk');
    if (t) t.textContent = rest + 's'; if (b) b.style.width = Math.max(0, 100 * (eind - Date.now()) / (s.duration * 1000)) + '%';
  };
  tik(); G.tik = setInterval(tik, 500);
}
async function strijdVerstuur(waarde, keuze) {
  const s = G.s; if (!s || s.status !== 'question') return;
  try {
    const res = await API.call('rk_game_answer', { p_code: G.code, p_naam: S.naam, p_q: s.q_index, p_waarde: waarde, p_keuze: keuze });
    if (!res.ok) { const m = $('#sMelding'); if (m) m.innerHTML = `<div class="melding fout">${esc(res.msg)}</div>`; else toast(esc(res.msg)); }
    G.laatste = null; pollStrijd();
  } catch (e) { const m = $('#sMelding'); if (m) m.innerHTML = '<div class="melding fout">Versturen mislukt, probeer opnieuw.</div>'; }
}

/* ================= DOCENT ================= */
let PW = sessionStorage.getItem('rk_pw');
const D = { klassen: [], klas: null, data: [], poll: null, spel: null };
function docentLogin(melding) {
  app().innerHTML = `<div class="login-scherm"><div class="login-kaart"><img class="logo-groot" src="${CFG.logo}" alt="Kennemer Lyceum" onerror="this.style.display='none'">
    <h1>Docent</h1><p class="ondertitel">Rekonomie Arena</p>${melding ? `<div class="melding fout">${esc(melding)}</div>` : ''}
    <form id="dForm"><label class="veld">Wachtwoord<input id="dPw" type="password" required autocomplete="current-password"></label><button class="knop vol" type="submit">Inloggen</button></form>
    <div style="text-align:center"><button class="link" data-act="naar-login">← Terug naar leerling-login</button></div></div></div>`;
  $('#dForm').addEventListener('submit', async e => {
    e.preventDefault(); const pw = $('#dPw').value;
    try { const res = await API.call('rk_docent_login', { p_pw: pw }); if (!res.ok) return docentLogin('Wachtwoord onjuist.'); PW = pw; sessionStorage.setItem('rk_pw', pw); D.klassen = res.klassen; docentHome(); }
    catch (er) { docentLogin('Geen verbinding met de server.'); }
  });
}
function docentKop(actief) {
  return `<header class="kop">${LOGO}<div class="woordmerk">Rekonomie Arena<small>Docentomgeving</small></div><div class="ruimte"></div>
    <button class="knop-kop" data-act="d-overzicht" ${actief === 'o' ? 'style="background:rgba(255,255,255,.3)"' : ''}>📊 Overzicht</button>
    <button class="knop-kop" data-act="d-accounts" ${actief === 'a' ? 'style="background:rgba(255,255,255,.3)"' : ''}>👥 Accounts</button>
    <button class="knop-kop" data-act="d-strijd" ${actief === 's' ? 'style="background:rgba(255,255,255,.3)"' : ''}>⚔️ Strijd</button>
    <button class="knop-kop" data-act="d-uit">Uitloggen</button></header>`;
}
async function docentHome() {
  ui.scherm = 'docent';
  try { const res = await API.call('rk_docent_login', { p_pw: PW }); if (!res.ok) return docentLogin('Log opnieuw in.'); D.klassen = res.klassen; } catch (e) { /* */ }
  if (!D.klas && D.klassen.length) D.klas = D.klassen[0];
  app().innerHTML = docentKop('o') + `<main class="wrap" style="max-width:1200px"><div class="kaart"><div class="knoprij">
    <label class="veld" style="margin:0;min-width:180px">Klas<select id="dKlas">${D.klassen.length ? D.klassen.map(k => `<option ${k === D.klas ? 'selected' : ''}>${esc(k)}</option>`).join('') : '<option value="">(nog geen leerlingen)</option>'}</select></label>
    <button class="knop licht" data-act="d-ververs">↻ Verversen</button><button class="knop licht" data-act="d-csv">⬇︎ Exporteer CSV</button>
    <div class="ruimte" style="flex:1"></div><div id="dDuels" class="knoprij"></div></div></div>
    <div id="dInhoud"><p>Laden…</p></div></main>`;
  $('#dKlas').addEventListener('change', e => { D.klas = e.target.value; laadKlas(); });
  laadDuelSchakelaar(null);
  laadKlas();
}
async function laadKlas() {
  if (!D.klas) { $('#dInhoud').innerHTML = '<div class="kaart">Er hebben nog geen leerlingen ingelogd. Leerlingen maken zelf een account aan met de klascode die u opgeeft (bijvoorbeeld 4V2).</div>'; return; }
  try { D.data = (await API.call('rk_docent_overzicht', { p_pw: PW, p_klas: D.klas })) || []; } catch (e) { $('#dInhoud').innerHTML = '<div class="melding fout">Laden mislukt.</div>'; return; }
  renderKlas();
}
async function laadDuelSchakelaar(aan) {
  let r0; try { r0 = await API.call('rk_docent_duels', { p_pw: PW, p_aan: aan }); } catch (e) { return; }
  const el = $('#dDuels'); if (!el || !r0.ok) return;
  el.innerHTML = `<span style="font-weight:600">🤺 Duels:</span><button class="knop klein ${r0.aan ? 'groen' : 'licht'}" data-act="d-duels" data-aan="${r0.aan ? 0 : 1}">${r0.aan ? 'Aan ✓' : 'Uit'}</button><small style="color:var(--zacht)">${r0.bezig} bezig · ${r0.vandaag} gespeeld vandaag</small>`;
}
function statsLeerling(l) {
  const s = normState(l.state || {}); const per = PAR.map(p => { const old = st; st = s; const x = parStatus(p); st = old; return x; });
  const km = ['h1', 'h2'].map(h => { const M = s.m && s.m[h]; if (!M) return null; const d = Object.values(M.done); return { klaar: d.filter(x => x === 'klaar').length, sprong: d.filter(x => x === 'sprong').length, totaal: KAARTEN[h].nodes.length, boss: M.boss, hp: M.hp, ronde: M.ronde, done: M.done, pad: M.pad || [] }; });
  let eerste = 0, telbaar = 0, hints = 0;
  per.forEach(x => { eerste += x.eerste; telbaar += x.done; hints += x.hints; });
  return { s, per, km, pctEerste: telbaar ? Math.round(100 * eerste / telbaar) : null, hints, train: s.c.trgoed || 0 };
}
function renderKlas() {
  const rows = D.data.map(l => Object.assign({ l }, statsLeerling(l)));
  const fs = {}; rows.forEach(r0 => Object.entries(r0.s.fs || {}).forEach(([k, v]) => fs[k] = (fs[k] || 0) + v));
  const FSN = { basis: 'Verkeerde basis (100%)', afronden: 'Afronden', eenheid: 'Eenheid vergeten/verkeerd', teken: 'Plus/min (stijging/daling)', pp: 'Procent ↔ procentpunt', btw: 'Btw-berekening', nullen: 'Nullen (miljoen/miljard)', formule: 'Formule/aanpak' };
  const maxfs = Math.max(1, ...Object.values(fs));
  // moeilijkste vragen
  const qstat = {}; rows.forEach(r0 => Object.entries(r0.s.q).forEach(([id, v]) => { const o = qstat[id] = qstat[id] || { a: 0, n: 0, g: 0 }; o.a += v.a || 0; o.n++; if (v.s === 'getoond') o.g++; }));
  const moeilijk = Object.entries(qstat).filter(([, o]) => o.n >= 1).sort((a, b) => (b[1].a / b[1].n + b[1].g) - (a[1].a / a[1].n + a[1].g)).slice(0, 8);
  const gemPar = PAR.map((p, i) => rows.length ? Math.round(rows.reduce((a, r0) => a + r0.per[i].done / r0.per[i].totaal, 0) / rows.length * 100) : 0);
  const fmtDatum = d => d ? new Date(d).toLocaleString('nl-NL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '–';
  $('#dInhoud').innerHTML = `
  <div class="grid2">
    <div class="kaart"><h3 style="margin-top:0">Gemiddelde voortgang ${esc(D.klas)} (${rows.length} leerlingen)</h3>${PAR.map((p, i) => `<div class="staaf"><span class="lbl">${p.id} ${esc(p.titel)}</span><span class="bk"><div style="width:${gemPar[i]}%;background:var(--kl-groen)"></div></span><span class="n">${gemPar[i]}%</span></div>`).join('')}</div>
    <div class="kaart"><h3 style="margin-top:0">Meest gemaakte foutsoorten</h3>${Object.keys(fs).length ? Object.entries(fs).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<div class="staaf"><span class="lbl">${FSN[k] || k}</span><span class="bk"><div style="width:${100 * v / maxfs}%"></div></span><span class="n">${v}</span></div>`).join('') : '<p>Nog geen fouten geregistreerd.</p>'}</div>
  </div>
  <div class="kaart"><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px"><h3 style="margin:0">Gekozen paden</h3>
    <div class="knoprij">${['h1', 'h2'].map(h => `<button class="knop ${D.kaartH === h ? '' : 'licht'} klein" data-act="d-kaart" data-h="${h}">Hoofdstuk ${h[1]}</button>`).join('')}</div></div>
    <p style="font-size:.85rem;color:var(--zacht);margin:6px 0">Het getal bij een vakje is het aantal leerlingen dat het heeft voltooid (🦘 = overgeslagen telt niet mee).</p>
    <div class="perkament perkament-klein">${docentKaart(rows)}</div></div>
  <div class="kaart"><h3 style="margin-top:0">Lastigste opdrachten</h3>${moeilijk.length ? `<div class="tabelwrap"><table class="docent-tabel"><tr><th>Vraag</th><th>Gem. foute pogingen</th><th>Uitwerking bekeken</th><th>Gemaakt door</th></tr>${moeilijk.map(([id, o]) => `<tr><td><b>${id}</b></td><td>${(o.a / o.n).toFixed(1).replace('.', ',')}</td><td>${o.g}×</td><td>${o.n}</td></tr>`).join('')}</table></div>` : '<p>Nog geen gegevens.</p>'}</div>
  <div class="kaart"><h3 style="margin-top:0">Leerlingen</h3><div class="tabelwrap"><table class="docent-tabel"><tr><th>Naam</th><th>XP</th>${PAR.map(p => `<th>${p.id}</th>`).join('')}<th>Kaart H1</th><th>Kaart H2</th><th>Duels</th><th>1e keer goed</th><th>Hints</th><th>Training</th><th>Laatst actief</th><th></th></tr>
  ${rows.map(r0 => `<tr><td><b>${esc(r0.l.naam)}</b><br><small style="color:var(--zacht)">${esc(r0.l.lln || 'geen lln')}</small>${r0.l.pinreset ? ' <small style="color:#b06f00">(pin gereset)</small>' : ''}${r0.l.geblokkeerd ? ' <small style="color:#c8412d">(geblokkeerd)</small>' : ''}</td><td>${r0.l.xp}</td>
    ${r0.per.map(x => `<td><span class="mini"><small>${x.done}/${x.totaal} ${'★'.repeat(x.sterren)}</small><div class="balk"><div style="width:${100 * x.done / x.totaal}%"></div></div></span></td>`).join('')}
    ${r0.km.map(k => `<td style="white-space:nowrap">${k ? `${k.klaar}/${k.totaal}${k.sprong ? ` · ${k.sprong}🦘` : ''}${k.boss ? ' · 🐉✓' : k.ronde ? ` · 🐉 ronde ${k.ronde + 1}` : ''}<br><small>❤️ ${k.hp}</small>` : '–'}</td>`).join('')}
    <td>${r0.s.duel ? `${r0.s.duel.gewonnen}/${r0.s.duel.gespeeld}<br><small>gewonnen</small>` : '–'}</td>
    <td>${r0.pctEerste == null ? '–' : r0.pctEerste + '%'}</td><td>${r0.hints}</td><td>${r0.train}</td><td>${fmtDatum(r0.l.updated_at)}</td>
    <td style="white-space:nowrap"><button class="knop licht klein" data-act="d-pin" data-id="${esc(r0.l.id)}" data-n="${esc(r0.l.naam)}">Pin reset</button> <button class="knop licht klein" data-act="d-del" data-id="${esc(r0.l.id)}" data-n="${esc(r0.l.naam)}">🗑</button></td></tr>`).join('')}
  </table></div><p style="font-size:.82rem;color:var(--zacht)">Pin reset: de leerling kiest bij de volgende keer inloggen zelf een nieuwe pincode. Voortgang blijft behouden.</p></div>`;
}
function docentKaart(rows) {
  const h = D.kaartH || 'h1'; const counts = {};
  rows.forEach(r0 => { const k = r0.km[h === 'h1' ? 0 : 1]; if (k) Object.entries(k.done).forEach(([id, v]) => { if (v === 'klaar') counts[id] = (counts[id] || 0) + 1; }); });
  const oud = st; st = normState({}); mapState(); const svg = kaartSVG(h, { counts }); st = oud; return svg;
}
function exporteerCSV() {
  const rows = D.data.map(l => Object.assign({ l }, statsLeerling(l)));
  const kop0 = ['naam', 'xp', ...PAR.map(p => p.id + ' gemaakt'), ...PAR.map(p => p.id + ' sterren'), 'eerste keer goed %', 'hints', 'training goed', 'laatst actief'];
  const lijnen = [kop0.join(';')].concat(rows.map(r0 => [r0.l.naam, r0.l.xp, ...r0.per.map(x => x.done + '/' + x.totaal), ...r0.per.map(x => x.sterren), r0.pctEerste ?? '', r0.hints, r0.train, r0.l.updated_at || ''].map(v => '"' + String(v).replace(/"/g, '""') + '"').join(';')));
  const blob = new Blob(['﻿' + lijnen.join('\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `rekonomie_${D.klas}.csv`; document.body.appendChild(a); a.click(); a.remove();
}

/* ---------- accounts ---------- */
async function schermAccounts() {
  ui.scherm = 'accounts';
  app().innerHTML = docentKop('a') + `<main class="wrap" style="max-width:1100px"><div class="kaart"><h2 style="margin-top:0">👥 Accounts</h2>
    <p style="color:var(--zacht);margin-top:0">Alle leerlingaccounts. Leerlingen loggen in met hun leerlingnummer en een zelfgekozen pincode. Bij <b>Pin reset</b> kiest de leerling bij de volgende keer inloggen een nieuwe pincode; de voortgang blijft behouden.</p>
    <div class="knoprij"><input id="accZoek" class="antwoord-invoer" style="font-size:17px;min-height:46px;flex:1 1 220px" placeholder="Zoek op naam of leerlingnummer">
      <select id="accKlas" class="antwoord-invoer" style="font-size:17px;min-height:46px;flex:0 1 160px"><option value="">Alle klassen</option></select>
      <button class="knop" data-act="acc-verwijder" id="accVerwijder" disabled>🗑 Verwijder geselecteerde</button></div></div>
    <div class="kaart" id="accLijst"><p>Laden…</p></div></main>`;
  $('#accZoek').addEventListener('input', accFilter); $('#accKlas').addEventListener('change', accFilter);
  document.addEventListener('change', accChange);
  laadAccounts();
}
function accChange(e) { if (e.target.classList && e.target.classList.contains('acc-check')) accTeller(); }
function accTeller() { const n = document.querySelectorAll('.acc-check:checked').length; const b = $('#accVerwijder'); if (b) { b.disabled = !n; b.textContent = n ? `🗑 Verwijder ${n} geselecteerde` : '🗑 Verwijder geselecteerde'; } }
async function laadAccounts() {
  let lijst; try { lijst = (await API.call('rk_docent_accounts', { p_pw: PW })) || []; } catch (e) { $('#accLijst').innerHTML = '<div class="melding fout">Laden mislukt.</div>'; return; }
  const sel = $('#accKlas'); const gekozen = sel.value; const klassen = [...new Set(lijst.map(a => a.klas))].sort();
  sel.innerHTML = '<option value="">Alle klassen</option>' + klassen.map(k => `<option ${k === gekozen ? 'selected' : ''}>${esc(k)}</option>`).join('');
  const dt = d => d ? new Date(d).toLocaleString('nl-NL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '–';
  $('#accLijst').innerHTML = lijst.length ? `<div class="tabelwrap"><table class="docent-tabel"><tr><th><input type="checkbox" data-act="acc-alles" aria-label="Alles selecteren" style="width:22px;height:22px"></th><th>Leerlingnummer</th><th>Naam</th><th>Klas</th><th>XP</th><th>Aangemaakt</th><th>Laatst actief</th><th>Status</th><th></th></tr>
    ${lijst.map(a => `<tr data-zoek="${esc((a.naam + ' ' + (a.lln || '')).toLowerCase())}" data-klas="${esc(a.klas)}"><td><input type="checkbox" class="acc-check" value="${esc(a.id)}" style="width:22px;height:22px"></td>
      <td>${a.lln ? esc(a.lln) : '<i style="color:var(--zacht)">geen (oud account)</i>'}</td><td><b>${esc(a.naam)}</b></td><td>${esc(a.klas)}</td><td>${a.xp}</td><td>${dt(a.created_at)}</td><td>${dt(a.updated_at)}</td>
      <td>${a.geblokkeerd ? '<span style="color:#c8412d">geblokkeerd</span>' : a.pinreset ? '<span style="color:#b06f00">pin gereset</span>' : 'actief'}</td>
      <td style="white-space:nowrap">${a.lln ? `<button class="knop licht klein" data-act="d-pin" data-id="${esc(a.id)}" data-n="${esc(a.naam)}">Pin reset</button> ` : ''}<button class="knop licht klein" data-act="d-del" data-id="${esc(a.id)}" data-n="${esc(a.naam)}">🗑</button></td></tr>`).join('')}
    </table></div><p style="font-size:.85rem;color:var(--zacht)" id="accAantal"></p>` : '<p>Er zijn nog geen accounts.</p>';
  accFilter(); accTeller();
}
function accFilter() {
  const z = ($('#accZoek') || {}).value ? $('#accZoek').value.trim().toLowerCase() : ''; const k = $('#accKlas') ? $('#accKlas').value : ''; let n = 0;
  document.querySelectorAll('#accLijst tr[data-zoek]').forEach(tr => { const zicht = (!z || tr.dataset.zoek.includes(z)) && (!k || tr.dataset.klas === k); tr.style.display = zicht ? '' : 'none'; if (zicht) n++; else tr.querySelector('.acc-check').checked = false; });
  const a = $('#accAantal'); if (a) a.textContent = `${n} account${n === 1 ? '' : 's'} getoond.`; accTeller();
}

/* ---------- strijd (docent / digibord) ---------- */
function strijdSetup(melding) {
  ui.scherm = 'docent'; stopHost();
  app().innerHTML = docentKop('s') + `<main class="wrap"><div class="kaart"><h2>⚔️ Nieuwe klassikale strijd</h2>${melding ? `<div class="melding fout">${esc(melding)}</div>` : ''}
    <div class="grid2"><div>
      <label class="veld">Klas<select id="sKlas">${[...new Set(CFG.klassen.concat(D.klassen || []))].map(k => `<option ${k === D.klas ? 'selected' : ''}>${esc(k)}</option>`).join('')}</select></label>
      <label class="veld">Aantal vragen<select id="sAantal"><option>5</option><option selected>8</option><option>10</option><option>15</option></select></label>
      <label class="veld">Tijd per vraag<select id="sTijd"><option value="30">30 seconden</option><option value="45">45 seconden</option><option value="60" selected>60 seconden</option><option value="90">90 seconden</option><option value="120">2 minuten</option></select></label>
      <label class="veld">Spelvorm<select id="sMode"><option value="solo">Ieder voor zich</option><option value="teams">Teams (Duin · Bos · Zee · Strand)</option><option value="docent">Klas tegen docent</option></select></label>
    </div><div><b>Stof</b><div class="check-lijst">${PAR.map(p => `<label><input type="checkbox" value="${p.id}" class="sPar" ${p.h === 1 ? 'checked' : ''}> ${p.id} ${esc(p.titel)}</label>`).join('')}</div></div></div>
    <p style="font-size:.88rem;color:var(--zacht)">De vragen zijn varianten met nieuwe getallen, zodat niemand de antwoorden uit het boekje kan overnemen. Leerlingen hebben hun rekenmachine nodig. Snel én goed antwoorden levert de meeste punten op (500–1000 per vraag).</p>
    <button class="knop accent" data-act="s-maak">Spel aanmaken</button></div></main>`;
}
async function maakSpel() {
  const pars = [...document.querySelectorAll('.sPar:checked')].map(x => x.value);
  const klas = $('#sKlas').value.trim().toUpperCase();
  if (!pars.length) return strijdSetup('Kies minstens één paragraaf.');
  const n = +$('#sAantal').value; const qs = [];
  for (let i = 0; i < n; i++) { const pid = pars[i % pars.length]; qs.push(E.toBattle(genereer(pid))); }
  for (let i = qs.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [qs[i], qs[j]] = [qs[j], qs[i]]; }
  try {
    const res = await API.call('rk_game_create', { p_pw: PW, p_klas: klas, p_mode: $('#sMode').value, p_questions: qs, p_duration: +$('#sTijd').value });
    if (!res.ok) return strijdSetup(res.msg);
    D.spel = { code: res.code, laatste: null, docentAntw: null }; startHost();
  } catch (e) { strijdSetup('Aanmaken mislukt: geen verbinding.'); }
}
function startHost() { ui.scherm = 'host'; stopHost(); pollHost(); D.poll = setInterval(pollHost, 1000); }
function stopHost() { if (D.poll) clearInterval(D.poll); D.poll = null; if (D.tik) clearInterval(D.tik); D.tik = null; }
async function pollHost() {
  let s; try { s = await API.call('rk_game_state', { p_code: D.spel.code, p_naam: null }); } catch (e) { return; }
  if (ui.scherm !== 'host') return;
  D.s = s;
  if (s.status === 'question') {
    const rest = s.duration * 1000 - s.elapsed_ms;
    if ((rest <= 0 || (s.players > 0 && s.answered >= s.players && (s.mode !== 'docent' || s.docent_answered))) && !D.bezig) { D.bezig = true; try { await control('reveal'); } finally { D.bezig = false; } return; }
  }
  renderHost(s);
}
async function control(action, waarde, keuze) {
  const res = await API.call('rk_game_control', { p_code: D.spel.code, p_pw: PW, p_action: action, p_waarde: waarde ?? null, p_keuze: keuze ?? null });
  D.spel.laatste = null; await pollHost(); return res;
}
function renderHost(s) {
  const sleutel = s.status + '|' + s.q_index + '|' + s.players + '|' + s.answered + '|' + s.docent_answered;
  if (sleutel === D.spel.laatste) return; D.spel.laatste = sleutel;
  let h = `<div class="bord"><div class="wrap" style="max-width:1200px"><div class="strijd-kop"><div style="display:flex;align-items:center;gap:12px">${LOGO}<b>Rekonomie Arena · ${esc(s.klas)}</b></div>
    <div class="knoprij"><span>Code <b style="color:var(--kl-accent);font-size:1.3rem">${s.code}</b></span><button class="knop licht klein" data-act="h-stop">Stoppen</button></div></div>`;
  const modeNaam = { solo: 'Ieder voor zich', teams: 'Teams', docent: 'Klas tegen docent' }[s.mode];
  if (s.status === 'lobby') {
    h += `<div style="text-align:center;margin-top:20px"><h1>Doe mee!</h1><p style="font-size:1.2rem">Open Rekonomie Arena, log in en kies <b>⚔️ Doe mee met de strijd</b>.</p>
      <div class="spelcode">${s.code}</div><p>${modeNaam} · ${s.total} vragen · ${s.duration} s per vraag</p>
      <p class="groot">${s.players} speler${s.players === 1 ? '' : 's'}</p><div class="spelers" style="justify-content:center">${(s.lijst || []).map(p => `<span class="speler">${p.team ? `<span class="teamlabel team-${p.team}" style="padding:0 6px;margin-right:4px">${TEAMS[p.team].replace('Team ', '')}</span>` : ''}${esc(p.naam)}</span>`).join('')}</div>
      <p style="margin-top:20px"><button class="knop accent" data-act="h-start" ${s.players ? '' : 'disabled'}>▶ Start de strijd</button></p></div>`;
  } else if (s.status === 'question') {
    const q = s.question;
    h += `<div class="timerbalk"><div id="tbalk" style="width:100%"></div></div><div class="strijd-kop"><div class="groot">Vraag ${s.q_index + 1} / ${s.total}</div><div class="timer" id="tijd"></div><div class="groot">${s.answered}/${s.players} beantwoord</div></div>
      ${q.context ? `<div class="bord-context">${q.context}</div>` : ''}<div class="bord-vraag">${q.tekst}</div>
      ${q.type === 'mc' ? `<ol style="font-size:1.4rem">${q.opties.map(o => `<li>${esc(o)}</li>`).join('')}</ol>` : ''}
      ${s.mode === 'docent' ? `<div class="kaart" style="margin-top:18px;max-width:520px">${s.docent_answered ? '<b>Docent heeft geantwoord ✓</b>' : `<b>Antwoord docent</b> (verborgen)<div class="invoerrij" style="margin-top:6px"><input id="hAnt" class="antwoord-invoer" type="password" inputmode="decimal" autocomplete="off" placeholder="••••"><button class="knop" data-act="h-docent">Verstuur</button></div><small>Tip: typ min als - (bijv. -2,9).</small>`}</div>` : ''}
      <p style="margin-top:18px"><button class="knop licht" data-act="h-reveal">Toon antwoord nu</button></p>`;
  } else if (s.status === 'reveal') {
    h += `<div class="strijd-kop"><div class="groot">Vraag ${s.q_index + 1} / ${s.total}</div><div class="groot">${s.pct}% goed</div></div>
      <div class="bord-vraag" style="font-size:1.3rem;opacity:.85">${s.question.tekst}</div>
      <div class="kaart" style="margin-top:14px"><div class="groot" style="color:var(--goed)">Antwoord: ${esc(s.antwoordTekst)}</div>${s.uitleg ? `<p style="font-size:1.1rem">${s.uitleg}</p>` : ''}
      ${s.fout ? `<div class="feedback fout" style="font-size:1.05rem"><b>Meest gegeven foute antwoord:</b> ${esc(typeof s.fout.waarde === 'number' ? fmt(s.fout.waarde, (String(s.fout.waarde).split('.')[1] || '').length) : s.fout.waarde)} (${s.fout.n}×)${s.fout.tekst ? `<br>${esc(s.fout.tekst)}` : ''}</div>` : ''}</div>
      ${stand(s)}
      <p><button class="knop accent" data-act="h-volgende">${s.q_index + 1 >= s.total ? '🏁 Eindstand' : 'Volgende vraag ▶'}</button></p>`;
  } else if (s.status === 'end') {
    h += `<h1 style="text-align:center">🏁 Eindstand</h1>${stand(s, true)}<p style="text-align:center"><button class="knop accent" data-act="d-strijd">Nieuw spel</button> <button class="knop licht" data-act="d-overzicht">Naar overzicht</button></p>`;
    stopHost();
  }
  h += `</div></div>`;
  const hv = $('#hAnt') ? $('#hAnt').value : null;
  app().innerHTML = h;
  if (hv && $('#hAnt')) $('#hAnt').value = hv;
  if (s.status === 'question') {
    if (D.tik) clearInterval(D.tik);
    const eind = Date.now() + s.duration * 1000 - s.elapsed_ms;
    const tik = () => { const rest = Math.max(0, Math.ceil((eind - Date.now()) / 1000)); const t = $('#tijd'); const b = $('#tbalk'); if (t) t.textContent = rest + 's'; if (b) b.style.width = Math.max(0, 100 * (eind - Date.now()) / (s.duration * 1000)) + '%'; };
    tik(); D.tik = setInterval(tik, 500);
  }
}
function stand(s, eind) {
  let h = '';
  if (s.mode === 'docent') h += `<div class="vs" style="margin:16px 0"><div><div>Klas (gemiddeld)</div><div class="sc">${s.klas_gem}</div></div><div><div>Docent</div><div class="sc">${s.docent_score}</div></div></div>${eind ? `<p class="groot" style="text-align:center">${s.klas_gem > s.docent_score ? 'De klas wint! 🎉' : s.klas_gem === s.docent_score ? 'Gelijkspel!' : 'De docent wint! 😎'}</p>` : ''}`;
  if (s.mode === 'teams' && s.teams.length) h += `<div class="kaart"><h3 style="margin-top:0">Teams (gemiddelde score)</h3><ol class="ranglijst">${s.teams.map((t, i) => `<li><span class="pos">${['🥇', '🥈', '🥉'][i] || i + 1}</span><span class="nm"><span class="teamlabel team-${t.team}">${TEAMS[t.team]}</span> <small>${t.n} spelers</small></span><span class="sc">${t.gem}</span></li>`).join('')}</ol></div>`;
  h += `<div class="kaart"><h3 style="margin-top:0">${eind ? 'Top 10' : 'Tussenstand'}</h3><ol class="ranglijst podium">${(s.top || []).slice(0, eind ? 10 : 5).map((p, i) => `<li><span class="pos">${['🥇', '🥈', '🥉'][i] || i + 1}</span><span class="nm">${esc(p.naam)}${p.team ? ` <span class="teamlabel team-${p.team}">${TEAMS[p.team].replace('Team ', '')}</span>` : ''}</span><span class="sc">${p.score}</span></li>`).join('')}</ol></div>`;
  return h;
}

/* ================= ACTIES ================= */
const ACT = {
  'home': () => { sluitModal(); clearInterval(ui.evIv); stopDuel(); if (S && st) { ui.cur = null; if (ui.scherm === 'kaart' || !ui.node) schermHome(); else openKaart(ui.node.h); } else schermLogin(); },
  'uitloggen': async () => { await flush(); localStorage.removeItem('rk_sessie'); S = null; st = null; schermLogin(); },
  'open-par': el => { sluitModal(); ui.cur = null; ui.qid = null; openPar(el.dataset.id, 'training'); },
  'slot': el => { sluitModal(); startCheck(el.dataset.id); },
  'tab': el => { ui.cur = null; ui.tab = el.dataset.tab; if (ui.tab === 'opdrachten') ui.qid = ui.qid || null; openPar(ui.par.id, ui.tab); window.scrollTo(0, 0); },
  'kies-vraag': el => { ui.qid = el.dataset.id; ui.cur = null; if (ui.node) { ui.node.t === 'boss' ? renderBoss() : renderOpdrachtVakje(); } else renderPar(); const k = $('#vraagkaart'); if (k && k.getBoundingClientRect().top < 0) k.scrollIntoView({ behavior: 'smooth' }); },
  'controleer': () => controleer(),
  'unit': el => { ui.cur.unit = el.dataset.u; const inv = $('#ant'); if (inv) ui.cur.inv = inv.value; herteken(); },
  'teken': () => { const i = $('#ant'); if (!i) return; i.value = i.value.trim().startsWith('-') ? i.value.trim().slice(1) : '-' + i.value.trim(); ui.cur.inv = i.value; },
  'hint': () => { ui.cur.hint = true; if (ui.node && st.m.boons.includes('lampje')) { st.m.boons.splice(st.m.boons.indexOf('lampje'), 1); ui.cur.gratisHint = true; toast('💡 Lampje gebruikt'); hudVernieuw(); } else st.c.hint++; if (ui.cur.mode === 'boek') { const rec = st.q[ui.cur.q.id] = st.q[ui.cur.q.id] || { a: 0 }; rec.h = true; } bewaar(); herteken(); },
  'toon-uitwerking': () => {
    const c = ui.cur; const q = c.q;
    if (c.mode === 'boek') { const rec = st.q[q.id] = st.q[q.id] || { a: 0 }; Object.assign(rec, { s: 'getoond', f: false, x: 0 }); st.c.streak = 0; bewaar(); herteken(); }
    else if (c.mode === 'event') { c.klaar = true; c.goedGedaan = c.mode === 'event' && ui.ev && (ui.ev.soort === 'schat' || ui.ev.soort === 'rust'); c.fb = fbHTML('bijna', 'Uitwerking:', `Antwoord: <b>${esc(E.antwoordTekst(q))}</b><div class="uitleg">${q.uitleg || ''}</div>`); herteken(); }
    else { c.klaar = true; const tr = trRec(ui.par.id); tr.st = 0; c.fb = fbHTML('bijna', 'Uitwerking:', `Antwoord: <b>${esc(E.antwoordTekst(q))}</b><div class="uitleg">${q.uitleg || ''}</div>`); bewaar(); renderPar(); }
  },
  'mc': el => {
    const c = ui.cur; const q = c.q; const i = +el.dataset.i; const rec = st.q[q.id] = st.q[q.id] || { a: 0 };
    if (i === q.juist) {
      if (q.schatting) { c.fb = ''; }
      goedAfhandelen(c, rec);
    } else {
      if (q.schatting) { // schatting: geen strafpunten, wel uitleg
        Object.assign(rec, { s: 'goed', f: false, x: 2 }); geefXP(2, 'geschat'); c.fb = ''; bewaar(); herteken(); if (ui.node) hudVernieuw();
        return;
      }
      c.fout = (c.fout || []).concat(i); rec.a = (rec.a || 0) + 1; telFout(null); if (ui.node) { nodeNaFout(); hudVernieuw(); }
      c.fb = fbHTML('fout', '✗', 'Dat is niet juist. Probeer het nog eens.'); bewaar(); herteken();
    }
  },
  'toon-model': () => { ui.cur.open = $('#openAnt').value; ui.cur.toonModel = true; herteken(); },
  'zelf': el => { const q = ui.cur.q; const z = el.dataset.z; st.q[q.id] = { s: 'zelf', z, a: 0, f: false, x: 5 }; geefXP(5, 'zelf nagekeken'); st.c.goed++; checkBadges(); bewaar(); herteken(); },
  'train-volgende': () => { ui.cur = null; renderPar(); },
  'check-volgende': () => checkVolgende(),
  'check-theorie': () => modal(`<button class="knop licht klein sluit" data-act="sluit">✕</button><div class="theorie">${ui.par.theorie}</div>`),
  'ranglijst': () => toonRanglijst(),
  'badges': () => toonBadges(),
  'sluit': () => sluitModal(),
  'strijd-join': () => strijdJoinModal(),
  'team': async el => { try { await API.call('rk_game_join', { p_code: G.code, p_naam: S.naam, p_team: +el.dataset.t }); } catch (e) { /* */ } G.laatste = null; startStrijdPoll(); },
  'wissel-team': () => { stopPoll(); kiesTeam(); },
  's-mc': el => strijdVerstuur(null, +el.dataset.i),
  's-verstuur': () => { const v = $('#sAnt').value; const [x, alt] = E.parseNum(v); if (isNaN(x)) { $('#sMelding').innerHTML = '<div class="melding fout">Typ een getal.</div>'; return; } strijdVerstuur(x, null); },
  'teken-s': () => { const i = $('#sAnt'); if (i) i.value = i.value.trim().startsWith('-') ? i.value.trim().slice(1) : '-' + i.value.trim(); },
  'strijd-uit': () => { stopPoll(); schermHome(); },
  'uitloggen-kaart': () => schermHome(),
  'docent-login': () => PW ? docentHome() : docentLogin(),
  'naar-login': () => schermLogin(),
  'd-overzicht': () => { stopHost(); docentHome(); },
  'd-strijd': () => strijdSetup(),
  'd-uit': () => { stopHost(); PW = null; sessionStorage.removeItem('rk_pw'); schermLogin(); },
  'd-ververs': () => laadKlas(),
  'd-kaart': el => { D.kaartH = el.dataset.h; renderKlas(); },
  'd-duels': el => { const aan = el.dataset.aan === '1'; if (!aan && !confirm('Duels uitzetten? Lopende duels worden nog afgemaakt, maar er kunnen geen nieuwe meer starten.')) return; laadDuelSchakelaar(aan); },
  'd-csv': () => exporteerCSV(),
  'd-pin': async el => { if (!confirm('Pincode resetten voor ' + el.dataset.n + '? De leerling kiest bij de volgende keer inloggen zelf een nieuwe pincode.')) return; await API.call('rk_docent_pinreset', { p_pw: PW, p_id: el.dataset.id }); ui.scherm === 'accounts' ? laadAccounts() : laadKlas(); },
  'd-del': async el => { if (!confirm('Account van ' + el.dataset.n + ' en alle voortgang definitief verwijderen?')) return; await API.call('rk_docent_verwijderen', { p_pw: PW, p_ids: [el.dataset.id] }); ui.scherm === 'accounts' ? laadAccounts() : laadKlas(); },
  'd-accounts': () => { stopHost(); schermAccounts(); },
  'acc-alles': el => { const aan = el.checked; document.querySelectorAll('.acc-check').forEach(c => { if (c.closest('tr').style.display !== 'none') c.checked = aan; }); accTeller(); },
  'acc-verwijder': async () => {
    const ids = [...document.querySelectorAll('.acc-check:checked')].map(c => c.value); if (!ids.length) return;
    if (!confirm(`${ids.length} account${ids.length === 1 ? '' : 's'} en alle voortgang definitief verwijderen?`)) return;
    const n = await API.call('rk_docent_verwijderen', { p_pw: PW, p_ids: ids }); toast(`${n} account${n === 1 ? '' : 's'} verwijderd`); laadAccounts();
  },
  's-maak': () => maakSpel(),
  'h-start': () => control('start'),
  'h-reveal': () => control('reveal'),
  'h-volgende': () => control('next'),
  'h-stop': async () => { if (!confirm('Strijd beëindigen?')) return; await control('end'); },
  'h-docent': async () => { const v = $('#hAnt').value; const [x] = E.parseNum(v); if (isNaN(x)) return toast('Typ een getal'); const res = await control('docent', x, null); if (res && res.ok) toast('Antwoord docent ontvangen'); }
};
/*KAART*/
/*DUEL*/
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const f = ACT[el.dataset.act]; if (f) { if (el.type !== 'checkbox') e.preventDefault(); f(el); }
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  if (e.target.id === 'ant') { e.preventDefault(); controleer(); }
  else if (e.target.id === 'sAnt') { e.preventDefault(); ACT['s-verstuur'](); }
  else if (e.target.id === 'hAnt') { e.preventDefault(); ACT['h-docent'](); }
});
document.addEventListener('input', e => { if (e.target.id === 'ant' && ui.cur) ui.cur.inv = e.target.value; });

/* ================= START ================= */
if (/[?&]docent\b/.test(location.search)) { PW ? docentHome() : docentLogin(); }
else autoLogin();
window.RKAPP = { get st() { return st; }, get S() { return S; }, ui, Mock };
})();
