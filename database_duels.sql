-- Rekonomie Arena: 1-tegen-1-duels (Sprint en Kasteelstrijd)
insert into public.rk_settings(key,value) values ('duels_aan','true') on conflict (key) do nothing;

create table if not exists public.rk_duels (
  code text primary key,
  klas text not null,
  maker uuid not null references public.rk_students(id) on delete cascade,
  tegen uuid references public.rk_students(id) on delete cascade,
  mode text not null check (mode in ('sprint','kasteel')),
  onderwerp text not null,
  status text not null default 'open',
  questions jsonb not null,
  duur integer not null,
  start_at timestamptz,
  eind_at timestamptz,
  winnaar uuid,
  created_at timestamptz not null default now()
);
create table if not exists public.rk_duel_stand (
  code text not null references public.rk_duels(code) on delete cascade,
  speler uuid not null references public.rk_students(id) on delete cascade,
  idx integer not null default 0,
  goed integer not null default 0,
  fout integer not null default 0,
  hp integer not null default 100,
  reeks integer not null default 0,
  schild integer not null default 0,
  blok_tot timestamptz,
  laatst_goed_at timestamptz,
  primary key (code, speler)
);
alter table public.rk_duel_stand add column if not exists opgegeven boolean not null default false;
alter table public.rk_students add column if not exists duel_opgeef_reeks integer not null default 0;
alter table public.rk_students add column if not exists duel_blok_tot timestamptz;
alter table public.rk_duels enable row level security;
alter table public.rk_duel_stand enable row level security;
revoke all on public.rk_duels, public.rk_duel_stand from anon, authenticated;

create or replace function public.rk_auth(p_lln text, p_pin text) returns uuid
language sql stable security definer set search_path = public as $$
  select id from rk_students where lln = trim(coalesce(p_lln,'')) and pin = p_pin and pin <> '' and fails < 10
$$;
revoke execute on function public.rk_auth(text,text) from public, anon, authenticated;

create or replace function public.rk_duels_aan() returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select value = 'true' from rk_settings where key = 'duels_aan'), true)
$$;
revoke execute on function public.rk_duels_aan() from public, anon, authenticated;

-- alleen voor de edge function (service role): de sommen worden op de server gemaakt
create or replace function public.rk_duel_insert(p_lln text, p_pin text, p_mode text, p_onderwerp text, p_questions jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare me uuid := rk_auth(p_lln, p_pin); k text; c text; tries int := 0;
begin
  if me is null then return jsonb_build_object('ok',false,'msg','Log opnieuw in'); end if;
  if not rk_duels_aan() then return jsonb_build_object('ok',false,'msg','Duels staan op dit moment uit'); end if;
  if exists (select 1 from rk_students where id = me and duel_blok_tot > now()) then return jsonb_build_object('ok',false,'msg','Je hebt 3 keer achter elkaar opgegeven. Je kunt even geen duels spelen.'); end if;
  if p_mode not in ('sprint','kasteel') then return jsonb_build_object('ok',false,'msg','Onbekende modus'); end if;
  delete from rk_duels where created_at < now() - interval '1 day';
  update rk_duels set status = 'geannuleerd' where maker = me and status = 'open';
  select klas into k from rk_students where id = me;
  loop
    c := lpad((floor(random()*9000)+1000)::int::text, 4, '0');
    exit when not exists (select 1 from rk_duels where code = c);
    tries := tries + 1; if tries > 50 then return jsonb_build_object('ok',false,'msg','Geen code beschikbaar'); end if;
  end loop;
  insert into rk_duels(code, klas, maker, mode, onderwerp, questions, duur)
  values (c, k, me, p_mode, p_onderwerp, p_questions, case when p_mode = 'sprint' then 180 else 480 end);
  insert into rk_duel_stand(code, speler) values (c, me);
  return jsonb_build_object('ok',true,'code',c);
end $$;
revoke execute on function public.rk_duel_insert(text,text,text,text,jsonb) from public, anon, authenticated;
grant execute on function public.rk_duel_insert(text,text,text,text,jsonb) to service_role;

create or replace function public.rk_duel_lijst(p_lln text, p_pin text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare me uuid := rk_auth(p_lln, p_pin); k text; mijn text;
begin
  if me is null then return jsonb_build_object('ok',false,'msg','Log opnieuw in'); end if;
  select klas into k from rk_students where id = me;
  select d.code into mijn from rk_duels d where (d.maker = me or d.tegen = me) and (d.status = 'open' and d.created_at > now() - interval '10 minutes' or d.status = 'bezig')
    and not exists (select 1 from rk_duel_stand x where x.code = d.code and x.speler = me and x.opgegeven) order by d.created_at desc limit 1;
  return jsonb_build_object('ok',true,'aan',rk_duels_aan(),'klas',k,'mijn',mijn,
    'blok_ms', (select greatest(0, coalesce(round(extract(epoch from duel_blok_tot - now())*1000), 0)) from rk_students where id = me),
    'open', coalesce((select jsonb_agg(jsonb_build_object('code',d.code,'naam',s.naam,'mode',d.mode,'onderwerp',d.onderwerp,'sinds',round(extract(epoch from now()-d.created_at))) order by d.created_at desc)
      from rk_duels d join rk_students s on s.id = d.maker
      where d.klas = k and d.status = 'open' and d.maker <> me and d.created_at > now() - interval '10 minutes'), '[]'::jsonb));
end $$;

create or replace function public.rk_duel_join(p_lln text, p_pin text, p_code text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare me uuid := rk_auth(p_lln, p_pin); d rk_duels; k text;
begin
  if me is null then return jsonb_build_object('ok',false,'msg','Log opnieuw in'); end if;
  if not rk_duels_aan() then return jsonb_build_object('ok',false,'msg','Duels staan op dit moment uit'); end if;
  if exists (select 1 from rk_students where id = me and duel_blok_tot > now()) then return jsonb_build_object('ok',false,'msg','Je hebt 3 keer achter elkaar opgegeven. Je kunt even geen duels spelen.'); end if;
  select * into d from rk_duels where code = trim(p_code) for update;
  if not found or d.status <> 'open' or d.created_at < now() - interval '10 minutes' then return jsonb_build_object('ok',false,'msg','Deze uitdaging bestaat niet (meer)'); end if;
  select klas into k from rk_students where id = me;
  if d.klas <> k then return jsonb_build_object('ok',false,'msg','Deze uitdaging is van een andere klas'); end if;
  if d.maker = me then return jsonb_build_object('ok',false,'msg','Je kunt niet tegen jezelf spelen'); end if;
  update rk_duels set tegen = me, status = 'bezig', start_at = now() + interval '4 seconds' where code = d.code;
  insert into rk_duel_stand(code, speler) values (d.code, me) on conflict do nothing;
  return jsonb_build_object('ok',true,'code',d.code);
end $$;

create or replace function public.rk_duel_annuleer(p_lln text, p_pin text, p_code text) returns boolean
language plpgsql security definer set search_path = public as $$
declare me uuid := rk_auth(p_lln, p_pin); n int;
begin
  update rk_duels set status = 'geannuleerd' where code = trim(p_code) and maker = me and status = 'open';
  get diagnostics n = row_count; return n = 1;
end $$;

create or replace function public.rk_duel_einde(p_code text) returns void
language plpgsql security definer set search_path = public as $$
declare d rk_duels; a rk_duel_stand; b rk_duel_stand; w uuid;
begin
  select * into d from rk_duels where code = p_code;
  if not found or d.status <> 'bezig' or now() < d.start_at + make_interval(secs => d.duur) then return; end if;
  select * into a from rk_duel_stand where code = d.code and speler = d.maker;
  select * into b from rk_duel_stand where code = d.code and speler = d.tegen;
  if a.opgegeven and not b.opgegeven then w := b.speler;
  elsif b.opgegeven and not a.opgegeven then w := a.speler;
  elsif d.mode = 'sprint' then
    if a.goed > b.goed then w := a.speler; elsif b.goed > a.goed then w := b.speler;
    elsif a.goed > 0 then w := case when a.laatst_goed_at <= b.laatst_goed_at then a.speler else b.speler end; end if;
  else
    if a.hp > b.hp then w := a.speler; elsif b.hp > a.hp then w := b.speler;
    elsif a.goed > b.goed then w := a.speler; elsif b.goed > a.goed then w := b.speler; end if;
  end if;
  update rk_duels set status = 'klaar', winnaar = w, eind_at = d.start_at + make_interval(secs => d.duur) where code = d.code and status = 'bezig';
end $$;
revoke execute on function public.rk_duel_einde(text) from public, anon, authenticated;

create or replace function public.rk_duel_state(p_lln text, p_pin text, p_code text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare me uuid := rk_auth(p_lln, p_pin); d rk_duels; s rk_duel_stand; o rk_duel_stand; onaam text; n int; res jsonb;
begin
  if me is null then return jsonb_build_object('ok',false,'msg','Log opnieuw in'); end if;
  perform rk_duel_einde(trim(p_code));
  select * into d from rk_duels where code = trim(p_code);
  if not found or (d.maker <> me and coalesce(d.tegen, '00000000-0000-0000-0000-000000000000'::uuid) <> me) then return jsonb_build_object('ok',false,'msg','Duel niet gevonden'); end if;
  select * into s from rk_duel_stand where code = d.code and speler = me;
  select * into o from rk_duel_stand where code = d.code and speler = case when d.maker = me then d.tegen else d.maker end;
  select naam into onaam from rk_students where id = case when d.maker = me then d.tegen else d.maker end;
  n := jsonb_array_length(d.questions);
  res := jsonb_build_object('ok',true,'code',d.code,'mode',d.mode,'onderwerp',d.onderwerp,'status',d.status,'duur',d.duur,
    'tot_start_ms', case when d.start_at is null then null else round(extract(epoch from d.start_at - now())*1000) end,
    'resterend_ms', case when d.start_at is null then null else greatest(0, round(extract(epoch from d.start_at + make_interval(secs => d.duur) - now())*1000)) end,
    'me', jsonb_build_object('idx',s.idx,'goed',s.goed,'fout',s.fout,'hp',s.hp,'reeks',s.reeks,'schild',s.schild,'opgegeven',s.opgegeven,
           'opgeef_reeks',(select duel_opgeef_reeks from rk_students where id = me),
           'blok_ms', greatest(0, coalesce(round(extract(epoch from s.blok_tot - now())*1000), 0))),
    'tegen', case when o.speler is null then null else jsonb_build_object('naam',onaam,'goed',o.goed,'fout',o.fout,'hp',o.hp,'reeks',o.reeks,'schild',o.schild,'opgegeven',o.opgegeven) end);
  if d.status = 'bezig' and now() >= d.start_at then
    res := res || jsonb_build_object('vraag', rk_q_public(d.questions -> (s.idx % n)));
  end if;
  if d.status = 'klaar' and not s.opgegeven then
    update rk_students set duel_opgeef_reeks = 0 where id = me and duel_opgeef_reeks <> 0;   -- een uitgespeeld duel doorbreekt de reeks
  end if;
  if d.status = 'klaar' then
    res := res || jsonb_build_object('uitslag', case when d.winnaar is null then 'gelijk' when d.winnaar = me then 'gewonnen' else 'verloren' end,
                                     'telt', coalesce(o.goed, 0) >= 5);
  end if;
  return res;
end $$;

create or replace function public.rk_duel_antwoord(p_lln text, p_pin text, p_code text, p_idx integer, p_waarde numeric, p_skip boolean)
returns jsonb language plpgsql security definer set search_path = public as $$
declare me uuid := rk_auth(p_lln, p_pin); d rk_duels; s rk_duel_stand; o rk_duel_stand; q jsonb; ok boolean := false; dmg int := 0; geblokt boolean := false; n int; klaar boolean := false;
begin
  if me is null then return jsonb_build_object('ok',false,'msg','Log opnieuw in'); end if;
  perform rk_duel_einde(trim(p_code));
  select * into d from rk_duels where code = trim(p_code) for update;
  if not found or (d.maker <> me and d.tegen <> me) then return jsonb_build_object('ok',false,'msg','Duel niet gevonden'); end if;
  if d.status <> 'bezig' then return jsonb_build_object('ok',false,'msg','Het duel is afgelopen','klaar',true); end if;
  if now() < d.start_at then return jsonb_build_object('ok',false,'msg','Het duel is nog niet begonnen'); end if;
  select * into s from rk_duel_stand where code = d.code and speler = me for update;
  if s.opgegeven then return jsonb_build_object('ok',false,'msg','Je hebt dit duel opgegeven','klaar',true); end if;
  if p_idx <> s.idx then return jsonb_build_object('ok',false,'msg','Deze som is al beantwoord'); end if;
  if s.blok_tot is not null and s.blok_tot > now() then return jsonb_build_object('ok',false,'msg','Nog even wachten'); end if;
  n := jsonb_array_length(d.questions); q := d.questions -> (s.idx % n);
  if not coalesce(p_skip, false) and p_waarde is not null then
    ok := exists (select 1 from jsonb_array_elements(q->'accept') a where abs(p_waarde - (a->>'v')::numeric) <= (a->>'t')::numeric);
  end if;
  if ok then
    s.goed := s.goed + 1; s.reeks := s.reeks + 1; s.laatst_goed_at := clock_timestamp(); s.blok_tot := null;
    if d.mode = 'kasteel' then
      select * into o from rk_duel_stand where code = d.code and speler <> me for update;
      dmg := case when s.reeks % 3 = 0 then 20 else 10 end;
      if o.schild > 0 then o.schild := o.schild - 1; geblokt := true; dmg := 0;
      else o.hp := greatest(0, o.hp - dmg); end if;
      update rk_duel_stand set hp = o.hp, schild = o.schild where code = d.code and speler = o.speler;
      if s.goed % 5 = 0 then s.schild := least(1, s.schild + 1); end if;
      if o.hp = 0 then update rk_duels set status = 'klaar', winnaar = me, eind_at = now() where code = d.code; klaar := true; end if;
    end if;
  else
    if not coalesce(p_skip, false) then s.fout := s.fout + 1; end if;
    s.reeks := 0;
    s.blok_tot := now() + case when d.mode = 'sprint' then interval '3 seconds' else interval '5 seconds' end;
  end if;
  update rk_duel_stand set idx = s.idx + 1, goed = s.goed, fout = s.fout, reeks = s.reeks, schild = s.schild, blok_tot = s.blok_tot, laatst_goed_at = s.laatst_goed_at
   where code = d.code and speler = me;
  return jsonb_build_object('ok',true,'correct',ok,'antwoordTekst',q->>'antwoordTekst','uitleg',q->>'uitleg','dmg',dmg,'geblokt',geblokt,'klaar',klaar,
    'blok_ms', case when ok then 0 when d.mode = 'sprint' then 3000 else 5000 end);
end $$;

create or replace function public.rk_duel_opgeven(p_lln text, p_pin text, p_code text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare me uuid := rk_auth(p_lln, p_pin); d rk_duels; o rk_duel_stand; r int; blok timestamptz;
begin
  if me is null then return jsonb_build_object('ok',false,'msg','Log opnieuw in'); end if;
  perform rk_duel_einde(trim(p_code));
  select * into d from rk_duels where code = trim(p_code) for update;
  if not found or (d.maker <> me and coalesce(d.tegen, '00000000-0000-0000-0000-000000000000'::uuid) <> me) then return jsonb_build_object('ok',false,'msg','Duel niet gevonden'); end if;
  if d.status <> 'bezig' then return jsonb_build_object('ok',false,'msg','Het duel is al afgelopen','klaar',true); end if;
  select * into o from rk_duel_stand where code = d.code and speler <> me;
  if o.opgegeven then   -- de tegenstander gaf al op: dit is afronden, zonder gevolgen
    update rk_duels set status = 'klaar', winnaar = me, eind_at = now() where code = d.code;
    return jsonb_build_object('ok',true,'afgerond',true);
  end if;
  update rk_duel_stand set opgegeven = true where code = d.code and speler = me and not opgegeven;
  update rk_students set duel_opgeef_reeks = duel_opgeef_reeks + 1 where id = me returning duel_opgeef_reeks into r;
  if r >= 3 then
    blok := now() + interval '5 minutes';
    update rk_students set duel_opgeef_reeks = 0, duel_blok_tot = blok where id = me;
  end if;
  return jsonb_build_object('ok',true,'afgerond',false,'reeks',r,'blok_ms', case when blok is null then 0 else 300000 end);
end $$;

create or replace function public.rk_docent_duels(p_pw text, p_aan boolean) returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  if not rk_is_docent(p_pw) then return jsonb_build_object('ok',false); end if;
  if p_aan is not null then
    insert into rk_settings(key,value) values ('duels_aan', case when p_aan then 'true' else 'false' end)
    on conflict (key) do update set value = excluded.value;
  end if;
  return jsonb_build_object('ok',true,'aan',rk_duels_aan(),
    'vandaag',(select count(*) from rk_duels where status = 'klaar' and created_at > now() - interval '1 day'),
    'bezig',(select count(*) from rk_duels where status = 'bezig'));
end $$;

grant execute on function public.rk_duel_lijst(text,text), public.rk_duel_join(text,text,text), public.rk_duel_annuleer(text,text,text),
  public.rk_duel_state(text,text,text), public.rk_duel_antwoord(text,text,text,integer,numeric,boolean), public.rk_duel_opgeven(text,text,text), public.rk_docent_duels(text,boolean) to anon, authenticated;
