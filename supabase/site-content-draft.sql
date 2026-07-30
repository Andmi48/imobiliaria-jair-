-- ============================================================
-- RASCUNHO DO ADMIN NA NUVEM
-- Execute no Supabase → SQL Editor → RUN
-- Assim o rascunho fica disponível em qualquer computador.
-- ============================================================

create table if not exists public.site_content_draft (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_content_draft enable row level security;

-- Sem leitura pública: só via funções com senha de admin
drop policy if exists "Bloquear leitura direta do rascunho" on public.site_content_draft;
create policy "Bloquear leitura direta do rascunho"
  on public.site_content_draft
  for select
  using (false);

create or replace function public.get_site_content_draft(admin_password text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if admin_password is distinct from 'Andre@4869' then
    return null;
  end if;

  return coalesce((select data from public.site_content_draft where id = 1), '{}'::jsonb);
end;
$$;

create or replace function public.save_site_content_draft(content jsonb, admin_password text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if admin_password is distinct from 'Andre@4869' then
    return false;
  end if;

  insert into public.site_content_draft (id, data, updated_at)
  values (1, content, now())
  on conflict (id) do update
    set data = excluded.data,
        updated_at = now();

  return true;
end;
$$;

create or replace function public.clear_site_content_draft(admin_password text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if admin_password is distinct from 'Andre@4869' then
    return false;
  end if;

  delete from public.site_content_draft where id = 1;
  return true;
end;
$$;

grant execute on function public.get_site_content_draft(text) to anon, authenticated;
grant execute on function public.save_site_content_draft(jsonb, text) to anon, authenticated;
grant execute on function public.clear_site_content_draft(text) to anon, authenticated;

select 'Rascunho na nuvem configurado com sucesso!' as status;
