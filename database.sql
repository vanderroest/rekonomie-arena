-- Rekonomie Arena: tabellen, leerling- en docentfuncties
create table if not exists public.rk_settings (key text primary key, value text not null);
insert into public.rk_settings(key,value) values ('docent_pw','Docent') on conflict (key) do nothing;

create table if not exists public.rk_students (
  klas text not null,
  naam_key text not null,
  naam text not null,
  pin text not null default '',
  state jsonb not null default '{}'::jsonb,
  xp integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (klas, naam_key)
);

create table if not exists public.rk_games (
  code text primary key,
  klas text not null,
  mode text not null default 'solo',
  status text not null default 'lobby',
  q_index integer not null default -1,
  q_duration integer not null default 60,
  q_started_at timestamptz,
  questions jsonb not null,
  docent_score integer not null default 0,
  docent_answered integer not null default -1,
  created_at timestamptz not null default now()
);

create table if not exists public.rk_game_players (
  code text not null references public.rk_games(code) on delete cascade,
  naam_key text not null,
  naam text not null,
  team integer not null default 0,
  score integer not null default 0,
  joined_at timestamptz not null default now(),
  primary key (code, naam_key)
);

create table if not exists public.rk_game_answers (
  code text not null references public.rk_games(code) on delete cascade,
  q_index integer not null,
  naam_key text not null,
  waarde numeric,
  keuze integer,
  correct boolean not null,
  points integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (code, q_index, naam_key)
);

alter table public.rk_settings enable row level security;
alter table public.rk_students enable row level security;
alter table public.rk_games enable row level security;
alter table public.rk_game_players enable row level security;
alter table public.rk_game_answers enable row level security;
revoke all on public.rk_settings, public.rk_students, public.rk_games, public.rk_game_players, public.rk_game_answers from anon, authenticated;

create or replace function public.rk_key(p text) returns text language sql immutable
set search_path = public as $$ select lower(regexp_replace(trim(coalesce(p,'')), '\s+', ' ', 'g')) $$;

create or replace function public.rk_is_docent(p_pw text) returns boolean language sql stable security definer
set search_path = public as $$ select exists(select 1 from rk_settings where key='docent_pw' and value = p_pw) $$;
revoke execute on function public.rk_is_docent(text) from public, anon, authenticated;

create or replace function public.rk_login(p_klas text, p_naam text, p_pin text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare k text := upper(trim(coalesce(p_klas,''))); nk text := rk_key(p_naam); r rk_students;
begin
  if length(k) < 1 or length(k) > 12 then return jsonb_build_object('status','error','msg','Klascode ongeldig'); end if;
  if length(nk) < 2 or length(nk) > 40 then return jsonb_build_object('status','error','msg','Naam moet 2 tot 40 tekens zijn'); end if;
  if coalesce(p_pin,'') !~ '^\d{4}$' then return jsonb_build_object('status','error','msg','Pincode moet uit 4 cijfers bestaan'); end if;
  select * into r from rk_students where klas = k and naam_key = nk;
  if not found then
    insert into rk_students(klas, naam_key, naam, pin) values (k, nk, trim(p_naam), p_pin);
    return jsonb_build_object('status','new','naam',trim(p_naam),'klas',k,'state','{}'::jsonb);
  end if;
  if r.pin = '' then
    update rk_students set pin = p_pin where klas = k and naam_key = nk;
    return jsonb_build_object('status','ok','naam',r.naam,'klas',k,'state',r.state,'pinreset',true);
  end if;
  if r.pin <> p_pin then return jsonb_build_object('status','badpin'); end if;
  return jsonb_build_object('status','ok','naam',r.naam,'klas',k,'state',r.state);
end $$;

create or replace function public.rk_save(p_klas text, p_naam text, p_pin text, p_state jsonb, p_xp integer)
returns boolean language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if pg_column_size(p_state) > 300000 then return false; end if;
  update rk_students set state = p_state, xp = greatest(0, least(coalesce(p_xp,0), 1000000)), updated_at = now()
   where klas = upper(trim(p_klas)) and naam_key = rk_key(p_naam) and pin = p_pin and pin <> '';
  get diagnostics n = row_count;
  return n = 1;
end $$;

create or replace function public.rk_ranglijst(p_klas text)
returns table(naam text, xp integer) language sql stable security definer set search_path = public as $$
  select naam, xp from rk_students where klas = upper(trim(p_klas)) order by xp desc, naam limit 200
$$;

create or replace function public.rk_docent_login(p_pw text) returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if not rk_is_docent(p_pw) then return jsonb_build_object('ok',false); end if;
  return jsonb_build_object('ok',true,'klassen',
    coalesce((select jsonb_agg(k order by k) from (select distinct klas k from rk_students) s), '[]'::jsonb));
end $$;

create or replace function public.rk_docent_overzicht(p_pw text, p_klas text) returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if not rk_is_docent(p_pw) then return null; end if;
  return coalesce((select jsonb_agg(jsonb_build_object('naam',naam,'xp',xp,'state',state,'updated_at',updated_at,'pinreset', pin='') order by naam)
     from rk_students where klas = upper(trim(p_klas))), '[]'::jsonb);
end $$;

create or replace function public.rk_docent_reset_pin(p_pw text, p_klas text, p_naam text) returns boolean
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if not rk_is_docent(p_pw) then return false; end if;
  update rk_students set pin = '' where klas = upper(trim(p_klas)) and naam_key = rk_key(p_naam);
  get diagnostics n = row_count; return n = 1;
end $$;

create or replace function public.rk_docent_verwijder(p_pw text, p_klas text, p_naam text) returns boolean
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if not rk_is_docent(p_pw) then return false; end if;
  delete from rk_students where klas = upper(trim(p_klas)) and naam_key = rk_key(p_naam);
  get diagnostics n = row_count; return n = 1;
end $$;
-- Rekonomie Arena: functies voor de klassikale strijd

create or replace function public.rk_q_public(q jsonb) returns jsonb language sql immutable
set search_path = public as $$ select q - 'accept' - 'juist' - 'uitleg' - 'fouten' - 'antwoordTekst' $$;

create or replace function public.rk_game_create(p_pw text, p_klas text, p_mode text, p_questions jsonb, p_duration integer)
returns jsonb language plpgsql security definer set search_path = public as $$
declare c text; tries int := 0;
begin
  if not rk_is_docent(p_pw) then return jsonb_build_object('ok',false,'msg','Wachtwoord onjuist'); end if;
  if jsonb_typeof(p_questions) <> 'array' or jsonb_array_length(p_questions) < 1 or jsonb_array_length(p_questions) > 40 then
    return jsonb_build_object('ok',false,'msg','Ongeldige vragenlijst'); end if;
  delete from rk_games where created_at < now() - interval '2 days';
  loop
    c := lpad((floor(random()*9000)+1000)::int::text, 4, '0');
    exit when not exists(select 1 from rk_games where code = c);
    tries := tries + 1; if tries > 50 then return jsonb_build_object('ok',false,'msg','Geen code beschikbaar'); end if;
  end loop;
  insert into rk_games(code, klas, mode, questions, q_duration)
  values (c, upper(trim(coalesce(p_klas,''))),
          case when p_mode in ('solo','teams','docent') then p_mode else 'solo' end,
          p_questions, greatest(10, least(coalesce(p_duration,60), 300)));
  return jsonb_build_object('ok',true,'code',c);
end $$;

create or replace function public.rk_game_join(p_code text, p_naam text, p_team integer)
returns jsonb language plpgsql security definer set search_path = public as $$
declare g rk_games; nk text := rk_key(p_naam);
begin
  select * into g from rk_games where code = trim(p_code);
  if not found then return jsonb_build_object('ok',false,'msg','Deze spelcode bestaat niet'); end if;
  if g.status = 'end' then return jsonb_build_object('ok',false,'msg','Dit spel is al afgelopen'); end if;
  if length(nk) < 2 then return jsonb_build_object('ok',false,'msg','Ongeldige naam'); end if;
  insert into rk_game_players(code, naam_key, naam, team)
  values (g.code, nk, trim(p_naam), case when g.mode = 'teams' then greatest(1, least(coalesce(p_team,1),4)) else 0 end)
  on conflict (code, naam_key) do update
    set team = case when g.mode = 'teams' and p_team between 1 and 4 then p_team else rk_game_players.team end;
  return jsonb_build_object('ok',true,'mode',g.mode,'status',g.status);
end $$;

create or replace function public.rk_game_answer(p_code text, p_naam text, p_q integer, p_waarde numeric, p_keuze integer)
returns jsonb language plpgsql security definer set search_path = public as $$
declare g rk_games; nk text := rk_key(p_naam); q jsonb; ok boolean := false; el numeric; pts int := 0; n int;
begin
  select * into g from rk_games where code = trim(p_code);
  if not found then return jsonb_build_object('ok',false,'msg','Spel niet gevonden'); end if;
  if g.status <> 'question' or g.q_index <> p_q then return jsonb_build_object('ok',false,'msg','Deze vraag is al gesloten'); end if;
  if not exists(select 1 from rk_game_players where code = g.code and naam_key = nk) then
    return jsonb_build_object('ok',false,'msg','Je doet niet mee aan dit spel'); end if;
  el := extract(epoch from (now() - g.q_started_at)) * 1000;
  if el > (g.q_duration + 3) * 1000 then return jsonb_build_object('ok',false,'msg','De tijd is om'); end if;
  q := g.questions -> p_q;
  if q->>'type' = 'mc' then
    ok := p_keuze is not null and p_keuze = (q->>'juist')::int;
  else
    ok := p_waarde is not null and exists(select 1 from jsonb_array_elements(q->'accept') a
            where abs(p_waarde - (a->>'v')::numeric) <= (a->>'t')::numeric);
  end if;
  if ok then pts := 500 + round(500 * greatest(0, 1 - el / (g.q_duration * 1000.0))); end if;
  insert into rk_game_answers(code, q_index, naam_key, waarde, keuze, correct, points)
  values (g.code, p_q, nk, p_waarde, p_keuze, ok, pts) on conflict do nothing;
  get diagnostics n = row_count;
  if n = 1 and pts > 0 then update rk_game_players set score = score + pts where code = g.code and naam_key = nk; end if;
  return jsonb_build_object('ok', n = 1, 'msg', case when n = 1 then 'Antwoord ontvangen' else 'Je had al geantwoord' end);
end $$;

create or replace function public.rk_game_control(p_code text, p_pw text, p_action text, p_waarde numeric, p_keuze integer)
returns jsonb language plpgsql security definer set search_path = public as $$
declare g rk_games; q jsonb; ok boolean := false; el numeric; pts int := 0; total int;
begin
  if not rk_is_docent(p_pw) then return jsonb_build_object('ok',false,'msg','Wachtwoord onjuist'); end if;
  select * into g from rk_games where code = trim(p_code) for update;
  if not found then return jsonb_build_object('ok',false,'msg','Spel niet gevonden'); end if;
  total := jsonb_array_length(g.questions);
  if p_action in ('start','next') then
    if g.q_index + 1 >= total then
      update rk_games set status = 'end' where code = g.code;
    else
      update rk_games set status = 'question', q_index = g.q_index + 1, q_started_at = now() where code = g.code;
    end if;
  elsif p_action = 'reveal' then
    if g.status = 'question' then update rk_games set status = 'reveal' where code = g.code; end if;
  elsif p_action = 'end' then
    update rk_games set status = 'end' where code = g.code;
  elsif p_action = 'docent' then
    if g.mode <> 'docent' or g.status <> 'question' or g.docent_answered = g.q_index then
      return jsonb_build_object('ok',false,'msg','Antwoord kan nu niet worden ingevoerd'); end if;
    q := g.questions -> g.q_index;
    el := extract(epoch from (now() - g.q_started_at)) * 1000;
    if q->>'type' = 'mc' then ok := p_keuze is not null and p_keuze = (q->>'juist')::int;
    else ok := p_waarde is not null and exists(select 1 from jsonb_array_elements(q->'accept') a
                where abs(p_waarde - (a->>'v')::numeric) <= (a->>'t')::numeric);
    end if;
    if ok and el <= (g.q_duration + 3) * 1000 then pts := 500 + round(500 * greatest(0, 1 - el / (g.q_duration * 1000.0))); end if;
    update rk_games set docent_score = docent_score + pts, docent_answered = g.q_index where code = g.code;
    return jsonb_build_object('ok',true,'correct',ok,'points',pts);
  end if;
  return jsonb_build_object('ok',true);
end $$;

create or replace function public.rk_game_state(p_code text, p_naam text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare g rk_games; nk text := rk_key(p_naam); res jsonb; q jsonb; me rk_game_players; a rk_game_answers;
        nplayers int; nans int; ncorrect int; wrong record; foutTekst text; optTekst text;
begin
  select * into g from rk_games where code = trim(p_code);
  if not found then return jsonb_build_object('ok',false,'msg','Spel niet gevonden'); end if;
  select count(*) into nplayers from rk_game_players where code = g.code;
  select count(*), count(*) filter (where correct) into nans, ncorrect from rk_game_answers where code = g.code and q_index = g.q_index;
  res := jsonb_build_object('ok',true,'code',g.code,'status',g.status,'mode',g.mode,'klas',g.klas,
          'q_index',g.q_index,'total',jsonb_array_length(g.questions),'duration',g.q_duration,
          'elapsed_ms', case when g.q_started_at is null then 0 else round(extract(epoch from (now()-g.q_started_at))*1000) end,
          'players',nplayers,'answered',nans);
  if g.status in ('question','reveal') then
    q := g.questions -> g.q_index;
    res := res || jsonb_build_object('question', rk_q_public(q));
  end if;
  if p_naam is null then
    res := res || jsonb_build_object('lijst', coalesce((select jsonb_agg(jsonb_build_object('naam',naam,'team',team) order by joined_at)
                                         from rk_game_players where code = g.code), '[]'::jsonb),
                                    'docent_answered', g.docent_answered = g.q_index);
  else
    select * into me from rk_game_players where code = g.code and naam_key = nk;
    if found then
      select * into a from rk_game_answers where code = g.code and q_index = g.q_index and naam_key = nk;
      res := res || jsonb_build_object('me', jsonb_build_object('naam',me.naam,'team',me.team,'score',me.score,
               'answered', a.naam_key is not null,
               'rank', (select count(*)+1 from rk_game_players p where p.code = g.code and p.score > me.score)));
      if g.status in ('reveal','end') and a.naam_key is not null then
        res := jsonb_set(res, '{me,correct}', to_jsonb(a.correct));
        res := jsonb_set(res, '{me,points}', to_jsonb(a.points));
      end if;
    end if;
  end if;
  if g.status in ('reveal','end') then
    if g.status = 'reveal' then
      res := res || jsonb_build_object('antwoordTekst', q->>'antwoordTekst', 'uitleg', q->>'uitleg',
                                       'pct', case when nans = 0 then 0 else round(100.0*ncorrect/nans) end);
      if q->>'type' = 'mc' then
        select keuze v, count(*) n into wrong from rk_game_answers where code = g.code and q_index = g.q_index and not correct and keuze is not null
          group by keuze order by count(*) desc limit 1;
        if found then
          optTekst := q->'opties'->>(wrong.v::int);
          res := res || jsonb_build_object('fout', jsonb_build_object('waarde', optTekst, 'n', wrong.n, 'tekst', null));
        end if;
      else
        select waarde v, count(*) n into wrong from rk_game_answers where code = g.code and q_index = g.q_index and not correct and waarde is not null
          group by waarde order by count(*) desc limit 1;
        if found then
          select f->>'tekst' into foutTekst from jsonb_array_elements(coalesce(q->'fouten','[]'::jsonb)) f
            where abs(wrong.v - (f->>'v')::numeric) <= (f->>'t')::numeric limit 1;
          res := res || jsonb_build_object('fout', jsonb_build_object('waarde', wrong.v, 'n', wrong.n, 'tekst', foutTekst));
        end if;
      end if;
    end if;
    res := res || jsonb_build_object(
      'top', coalesce((select jsonb_agg(t) from (select naam, score, team from rk_game_players where code = g.code order by score desc, naam limit 10) t), '[]'::jsonb),
      'teams', coalesce((select jsonb_agg(t order by gem desc) from (select team, round(avg(score)) gem, count(*) n from rk_game_players where code = g.code and team > 0 group by team) t), '[]'::jsonb),
      'klas_gem', coalesce((select round(avg(score)) from rk_game_players where code = g.code), 0),
      'docent_score', g.docent_score);
  end if;
  return res;
end $$;

grant execute on function public.rk_login(text,text,text), public.rk_save(text,text,text,jsonb,integer), public.rk_ranglijst(text),
  public.rk_docent_login(text), public.rk_docent_overzicht(text,text), public.rk_docent_reset_pin(text,text,text),
  public.rk_docent_verwijder(text,text,text), public.rk_game_create(text,text,text,jsonb,integer),
  public.rk_game_join(text,text,integer), public.rk_game_answer(text,text,integer,numeric,integer),
  public.rk_game_control(text,text,text,numeric,integer), public.rk_game_state(text,text) to anon, authenticated;
