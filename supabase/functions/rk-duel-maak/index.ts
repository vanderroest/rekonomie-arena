// Rekonomie Arena – maakt een duel met 60 nieuwe sommen. De antwoorden blijven op de server.
import "./gen.js";
import "./engine.js";
import { createClient } from "npm:@supabase/supabase-js@2";

const RK = (globalThis as any).RK;
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });
const MIX: Record<string, string[]> = { h1: ["1.1", "1.2", "1.3"], h2: ["2.1", "2.2", "2.3", "2.4"] };

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { lln, pin, mode, onderwerp } = await req.json();
    const pars = MIX[onderwerp] ?? (RK.PAR.some((p: any) => p.id === onderwerp) ? [onderwerp] : null);
    if (!pars) return json({ ok: false, msg: "Onbekend onderwerp" });
    if (mode !== "sprint" && mode !== "kasteel") return json({ ok: false, msg: "Onbekende modus" });
    const qs = [];
    for (let i = 0; i < 60; i++) {
      const pid = pars[Math.floor(Math.random() * pars.length)];
      qs.push(RK.engine.toBattle(RK.genereer(pid)));
    }
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data, error } = await sb.rpc("rk_duel_insert", { p_lln: String(lln ?? ""), p_pin: String(pin ?? ""), p_mode: mode, p_onderwerp: onderwerp, p_questions: qs });
    if (error) return json({ ok: false, msg: "Serverfout: " + error.message }, 500);
    return json(data);
  } catch (_e) {
    return json({ ok: false, msg: "Ongeldig verzoek" }, 400);
  }
});
