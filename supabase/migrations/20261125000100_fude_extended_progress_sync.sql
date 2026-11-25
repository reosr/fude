-- Extend Fude cloud sync for Irodori, practical study progress, and Gacha.
-- Existing tables and the original migration RPC remain intact.
-- Safe to apply once; CREATE TABLE and policy recreation are idempotent.

create table if not exists public.fude_irodori_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  completed_lessons jsonb not null default '[]'::jsonb
    check (pg_catalog.jsonb_typeof(completed_lessons) = 'array'),
  self_evaluations jsonb not null default '{}'::jsonb
    check (pg_catalog.jsonb_typeof(self_evaluations) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fude_study_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  completed_practical_categories jsonb not null default '[]'::jsonb
    check (pg_catalog.jsonb_typeof(completed_practical_categories) = 'array'),
  completed_stories jsonb not null default '[]'::jsonb
    check (pg_catalog.jsonb_typeof(completed_stories) = 'array'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fude_gacha_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  inventory jsonb not null default '{"version":2,"badges":{},"newBadgeIds":[],"updatedAt":0}'::jsonb
    check (pg_catalog.jsonb_typeof(inventory) = 'object'),
  history jsonb not null default '[]'::jsonb
    check (pg_catalog.jsonb_typeof(history) = 'array'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.fude_irodori_progress enable row level security;
alter table public.fude_study_progress enable row level security;
alter table public.fude_gacha_data enable row level security;

-- Backfill the XP ledger for users migrated by the original RPC.
-- The original function populated total_xp but left the newer ledger
-- columns at their defaults. Treat that existing total as the base balance;
-- total_xp itself is not changed.
update public.fude_learning_progress
set
  xp_base = total_xp,
  xp_events = '[]'::jsonb,
  updated_at = now()
where total_xp > 0
  and xp_base = 0
  and xp_events = '[]'::jsonb;

drop policy if exists "Users can read own Irodori progress"
  on public.fude_irodori_progress;
create policy "Users can read own Irodori progress"
  on public.fude_irodori_progress
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own Irodori progress"
  on public.fude_irodori_progress;
create policy "Users can insert own Irodori progress"
  on public.fude_irodori_progress
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own Irodori progress"
  on public.fude_irodori_progress;
create policy "Users can update own Irodori progress"
  on public.fude_irodori_progress
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can read own study progress"
  on public.fude_study_progress;
create policy "Users can read own study progress"
  on public.fude_study_progress
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own study progress"
  on public.fude_study_progress;
create policy "Users can insert own study progress"
  on public.fude_study_progress
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own study progress"
  on public.fude_study_progress;
create policy "Users can update own study progress"
  on public.fude_study_progress
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can read own Gacha data"
  on public.fude_gacha_data;
create policy "Users can read own Gacha data"
  on public.fude_gacha_data
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own Gacha data"
  on public.fude_gacha_data;
create policy "Users can insert own Gacha data"
  on public.fude_gacha_data
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own Gacha data"
  on public.fude_gacha_data;
create policy "Users can update own Gacha data"
  on public.fude_gacha_data
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

revoke all on table
  public.fude_irodori_progress,
  public.fude_study_progress,
  public.fude_gacha_data
from anon;

grant select, insert, update on table
  public.fude_irodori_progress,
  public.fude_study_progress,
  public.fude_gacha_data
to authenticated;

-- Versioned RPC so already-open clients using the original function do not
-- break while the app deployment rolls out.
create or replace function public.fude_migrate_local_data_v2(
  p_profile jsonb,
  p_current_bab integer,
  p_total_xp bigint,
  p_xp_base bigint,
  p_xp_events jsonb,
  p_xp_rewards jsonb,
  p_memorized_kanji jsonb,
  p_jlpt_results jsonb,
  p_irodori_progress jsonb,
  p_study_progress jsonb,
  p_gacha_data jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_user_id uuid;
  v_item jsonb;
  v_jlpt_count integer := 0;
  v_xp_event_total numeric := 0;
  v_xp_event_count bigint := 0;
  v_xp_event_distinct_count bigint := 0;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtext(v_user_id::text)
  );

  if exists (
    select 1 from public.fude_profiles where user_id = v_user_id
  ) or exists (
    select 1 from public.fude_learning_progress where user_id = v_user_id
  ) or exists (
    select 1 from public.fude_jlpt_results where user_id = v_user_id
  ) or exists (
    select 1 from public.fude_irodori_progress where user_id = v_user_id
  ) or exists (
    select 1 from public.fude_study_progress where user_id = v_user_id
  ) or exists (
    select 1 from public.fude_gacha_data where user_id = v_user_id
  ) then
    return pg_catalog.jsonb_build_object('status', 'already_has_data');
  end if;

  if pg_catalog.jsonb_typeof(p_profile) is distinct from 'object'
    or p_current_bab is null
    or p_current_bab < 1
    or p_total_xp is null
    or p_total_xp < 0
    or p_xp_base is null
    or p_xp_base < 0
    or pg_catalog.jsonb_typeof(p_xp_events) is distinct from 'array'
    or pg_catalog.jsonb_typeof(p_xp_rewards) is distinct from 'array'
    or pg_catalog.jsonb_typeof(p_memorized_kanji) is distinct from 'array'
    or pg_catalog.jsonb_typeof(p_jlpt_results) is distinct from 'array'
    or pg_catalog.jsonb_typeof(p_irodori_progress) is distinct from 'object'
    or pg_catalog.jsonb_typeof(p_irodori_progress -> 'completed_lessons') is distinct from 'array'
    or pg_catalog.jsonb_typeof(p_irodori_progress -> 'self_evaluations') is distinct from 'object'
    or pg_catalog.jsonb_typeof(p_study_progress) is distinct from 'object'
    or pg_catalog.jsonb_typeof(p_study_progress -> 'completed_practical_categories') is distinct from 'array'
    or pg_catalog.jsonb_typeof(p_study_progress -> 'completed_stories') is distinct from 'array'
    or pg_catalog.jsonb_typeof(p_gacha_data) is distinct from 'object'
    or pg_catalog.jsonb_typeof(p_gacha_data -> 'inventory') is distinct from 'object'
    or pg_catalog.jsonb_typeof(p_gacha_data -> 'history') is distinct from 'array'
  then
    raise exception 'INVALID_MIGRATION_DATA';
  end if;

  if exists (
    select 1
    from pg_catalog.jsonb_array_elements(p_xp_events) as e(value)
    where pg_catalog.jsonb_typeof(e.value) is distinct from 'object'
      or pg_catalog.jsonb_typeof(e.value -> 'id') is distinct from 'string'
      or pg_catalog.btrim(e.value ->> 'id') = ''
      or pg_catalog.jsonb_typeof(e.value -> 'amount') is distinct from 'number'
      or (e.value ->> 'amount')::numeric <= 0
      or pg_catalog.trunc((e.value ->> 'amount')::numeric)
        <> (e.value ->> 'amount')::numeric
  ) then
    raise exception 'INVALID_XP_EVENTS';
  end if;

  select
    coalesce(pg_catalog.sum((e.value ->> 'amount')::numeric), 0),
    pg_catalog.count(*),
    pg_catalog.count(distinct e.value ->> 'id')
  into v_xp_event_total, v_xp_event_count, v_xp_event_distinct_count
  from pg_catalog.jsonb_array_elements(p_xp_events) as e(value);

  if v_xp_event_count <> v_xp_event_distinct_count
    or p_xp_base::numeric + v_xp_event_total <> p_total_xp::numeric
  then
    raise exception 'INVALID_XP_LEDGER';
  end if;

  if exists (
    select 1
    from pg_catalog.jsonb_array_elements(p_irodori_progress -> 'completed_lessons') as e(value)
    where pg_catalog.jsonb_typeof(e.value) is distinct from 'string'
  ) or exists (
    select 1
    from pg_catalog.jsonb_array_elements(p_study_progress -> 'completed_practical_categories') as e(value)
    where pg_catalog.jsonb_typeof(e.value) is distinct from 'string'
  ) or exists (
    select 1
    from pg_catalog.jsonb_array_elements(p_study_progress -> 'completed_stories') as e(value)
    where pg_catalog.jsonb_typeof(e.value) is distinct from 'string'
  ) then
    raise exception 'INVALID_STUDY_PROGRESS';
  end if;

  if exists (
    select 1
    from pg_catalog.jsonb_array_elements(p_jlpt_results) as e(value)
    where pg_catalog.jsonb_typeof(e.value) is distinct from 'object'
      or pg_catalog.jsonb_typeof(e.value -> 'setId') is distinct from 'string'
      or pg_catalog.btrim(e.value ->> 'setId') = ''
      or pg_catalog.jsonb_typeof(e.value -> 'result') is distinct from 'object'
  ) then
    raise exception 'INVALID_JLPT_RESULT';
  end if;

  insert into public.fude_profiles (user_id, profile)
  values (v_user_id, p_profile - 'photoDataUrl');

  insert into public.fude_learning_progress (
    user_id,
    current_bab,
    total_xp,
    xp_base,
    xp_events,
    xp_rewards,
    memorized_kanji
  )
  values (
    v_user_id,
    p_current_bab,
    p_total_xp,
    p_xp_base,
    p_xp_events,
    p_xp_rewards,
    p_memorized_kanji
  );

  for v_item in
    select e.value
    from pg_catalog.jsonb_array_elements(p_jlpt_results) as e(value)
  loop
    insert into public.fude_jlpt_results (user_id, set_id, result)
    values (v_user_id, v_item ->> 'setId', v_item -> 'result');

    v_jlpt_count := v_jlpt_count + 1;
  end loop;

  insert into public.fude_irodori_progress (
    user_id, completed_lessons, self_evaluations
  )
  values (
    v_user_id,
    p_irodori_progress -> 'completed_lessons',
    p_irodori_progress -> 'self_evaluations'
  );

  insert into public.fude_study_progress (
    user_id, completed_practical_categories, completed_stories
  )
  values (
    v_user_id,
    p_study_progress -> 'completed_practical_categories',
    p_study_progress -> 'completed_stories'
  );

  insert into public.fude_gacha_data (user_id, inventory, history)
  values (
    v_user_id,
    p_gacha_data -> 'inventory',
    p_gacha_data -> 'history'
  );

  return pg_catalog.jsonb_build_object(
    'status', 'migrated',
    'jlpt_sets', v_jlpt_count,
    'irodori_lessons',
      pg_catalog.jsonb_array_length(p_irodori_progress -> 'completed_lessons')
  );
end;
$function$;

revoke all on function public.fude_migrate_local_data_v2(
  jsonb, integer, bigint, bigint, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb
) from public;

revoke all on function public.fude_migrate_local_data_v2(
  jsonb, integer, bigint, bigint, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb
) from anon;

grant execute on function public.fude_migrate_local_data_v2(
  jsonb, integer, bigint, bigint, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb, jsonb
) to authenticated;
