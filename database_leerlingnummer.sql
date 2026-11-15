-- Rekonomie Arena: inloggen met leerlingnummer + pincode (uitvoeren na database.sql)
alter table public.rk_students add column if not exists id uuid not null default gen_random_uuid();
alter table public.rk_students add column if not exists lln text;
alter table public.rk_students add column if not exists fails integer not null default 0;
alter table public.rk_students drop constraint if exists rk_students_pkey;
alter table public.rk_students add primary key (id);
create unique index if not exists rk_students_lln_uniek on public.rk_students(lln) where lln is not null;

drop function if exists public.rk_login(text,text,text);
drop function if exists public.rk_save(text,text,text,jsonb,integer);
drop function if exists public.rk_ranglijst(text);
drop function if exists public.rk_docent_reset_pin(text,text,text);
drop function if exists public.rk_docent_verwijder(text,text,text);

create or replace function public.rk_inloggen(p_lln text, p_pin text, p_klas text, p_naam text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare l text := trim(coalesce(p_lln,'')); k text := upper(trim(coalesce(p_klas,''))); nm text := regexp_replace(trim(coalesce(p_naam,'')), '\s+', ' ', 'g'); r rk_students;
begin
  if l !~ '^\d{3,10}$' then return jsonb_build_object('status','error','msg','Een leerlingnummer bestaat uit 3 tot 10 cijfers'); end if;
  if coalesce(p_pin,'') !~ '^\d{4}$' then return jsonb_build_object('status','error','msg','De pincode moet uit 4 cijfers bestaan'); end if;
  select * into r from rk_students where lln = l;
  if not found then
    if k = '' or nm = '' then return jsonb_build_object('status','nieuw'); end if;
    if length(k) > 12 then return jsonb_build_object('status','error','msg','Klascode is te lang (max. 12 tekens)'); end if;
    if length(nm) < 2 or length(nm) > 40 then return jsonb_build_object('status','error','msg','Naam moet 2 tot 40 tekens zijn'); end if;
    insert into rk_students(lln, klas, naam_key, naam, pin) values (l, k, rk_key(nm), nm, p_pin);
    return jsonb_build_object('status','new','lln',l,'naam',nm,'klas',k,'state','{}'::jsonb);
  end if;
  if r.pin = '' then
    update rk_students set pin = p_pin, fails = 0 where id = r.id;
    return jsonb_build_object('status','ok','lln',l,'naam',r.naam,'klas',r.klas,'state',r.state,'pinreset',true);
  end if;
  if r.fails >= 10 then return jsonb_build_object('status','geblokkeerd'); end if;
  if r.pin <> p_pin then update rk_students set fails = fails + 1 where id = r.id; return jsonb_build_object('status','badpin'); end if;
  if r.fails > 0 then update rk_students set fails = 0 where id = r.id; end if;
  return jsonb_build_object('status','ok','lln',l,'naam',r.naam,'klas',r.klas,'state',r.state);
end $$;

create or replace function public.rk_opslaan(p_lln text, p_pin text, p_state jsonb, p_xp integer)
returns boolean language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if pg_column_size(p_state) > 300000 then return false; end if;
  update rk_students set state = p_state, xp = greatest(0, least(coalesce(p_xp,0), 1000000)), updated_at = now()
   where lln = trim(p_lln) and pin = p_pin and pin <> '' and fails < 10;
  get diagnostics n = row_count; return n = 1;
end $$;

create or replace function public.rk_ranglijst2(p_klas text, p_lln text)
returns table(naam text, xp integer, ik boolean) language sql stable security definer set search_path = public as $$
  select naam, xp, coalesce(lln = trim(p_lln), false) from rk_students where klas = upper(trim(p_klas)) order by xp desc, naam limit 200
$$;

create or replace function public.rk_docent_overzicht(p_pw text, p_klas text) returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if not rk_is_docent(p_pw) then return null; end if;
  return coalesce((select jsonb_agg(jsonb_build_object('id',id,'lln',lln,'naam',naam,'xp',xp,'state',state,'updated_at',updated_at,'pinreset', pin='', 'geblokkeerd', fails >= 10) order by naam)
     from rk_students where klas = upper(trim(p_klas))), '[]'::jsonb);
end $$;

create or replace function public.rk_docent_accounts(p_pw text) returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  if not rk_is_docent(p_pw) then return null; end if;
  return coalesce((select jsonb_agg(jsonb_build_object('id',id,'lln',lln,'naam',naam,'klas',klas,'xp',xp,'updated_at',updated_at,'created_at',created_at,'pinreset', pin='', 'geblokkeerd', fails >= 10) order by klas, naam)
     from rk_students), '[]'::jsonb);
end $$;

create or replace function public.rk_docent_pinreset(p_pw text, p_id uuid) returns boolean
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if not rk_is_docent(p_pw) then return false; end if;
  update rk_students set pin = '', fails = 0 where id = p_id;
  get diagnostics n = row_count; return n = 1;
end $$;

create or replace function public.rk_docent_verwijderen(p_pw text, p_ids uuid[]) returns integer
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if not rk_is_docent(p_pw) then return 0; end if;
  delete from rk_students where id = any(p_ids);
  get diagnostics n = row_count; return n;
end $$;

revoke execute on function public.rk_inloggen(text,text,text,text), public.rk_opslaan(text,text,jsonb,integer), public.rk_ranglijst2(text,text),
  public.rk_docent_accounts(text), public.rk_docent_pinreset(text,uuid), public.rk_docent_verwijderen(text,uuid[]) from public;
grant execute on function public.rk_inloggen(text,text,text,text), public.rk_opslaan(text,text,jsonb,integer), public.rk_ranglijst2(text,text),
  public.rk_docent_overzicht(text,text), public.rk_docent_accounts(text), public.rk_docent_pinreset(text,uuid), public.rk_docent_verwijderen(text,uuid[]) to anon, authenticated;
