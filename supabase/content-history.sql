-- Histórico de versões do site (restaurar por data/hora)
-- Execute no Supabase SQL Editor após fix-sync-completo.sql

create table if not exists public.site_content_history (
  id bigint generated always as identity primary key,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists site_content_history_created_at_idx
  on public.site_content_history (created_at desc);

alter table public.site_content_history enable row level security;

drop policy if exists "Leitura publica do historico" on public.site_content_history;
create policy "Leitura publica do historico"
  on public.site_content_history
  for select
  using (true);

-- Salva versão anterior automaticamente a cada publicação
create or replace function public.save_site_content(content jsonb, admin_password text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if admin_password is distinct from 'Andre@4869' then
    return false;
  end if;

  insert into public.site_content_history (data, created_at)
  select sc.data, sc.updated_at
  from public.site_content sc
  where sc.id = 1
    and sc.data is not null
    and sc.data <> '{}'::jsonb;

  delete from public.site_content_history
  where id in (
    select id
    from (
      select id, row_number() over (order by created_at desc) as rn
      from public.site_content_history
    ) ranked
    where rn > 50
  );

  insert into public.site_content (id, data, updated_at)
  values (1, content, now())
  on conflict (id) do update
    set data = excluded.data,
        updated_at = now();

  return true;
end;
$$;

create or replace function public.list_site_content_history()
returns table (id bigint, created_at timestamptz)
language sql
security definer
set search_path = public
stable
as $$
  select h.id, h.created_at
  from public.site_content_history h
  order by h.created_at desc
  limit 50;
$$;

create or replace function public.get_site_content_history_version(history_id bigint)
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
  select h.data
  from public.site_content_history h
  where h.id = history_id;
$$;

create or replace function public.restore_site_content_version(history_id bigint, admin_password text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  snapshot jsonb;
begin
  if admin_password is distinct from 'Andre@4869' then
    return false;
  end if;

  select h.data into snapshot
  from public.site_content_history h
  where h.id = history_id;

  if snapshot is null then
    return false;
  end if;

  return public.save_site_content(snapshot, admin_password);
end;
$$;

grant execute on function public.list_site_content_history() to anon, authenticated;
grant execute on function public.get_site_content_history_version(bigint) to anon, authenticated;
grant execute on function public.restore_site_content_version(bigint, text) to anon, authenticated;

select 'Historico de versoes configurado!' as status;
