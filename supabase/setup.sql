-- Execute este SQL no painel do Supabase (SQL Editor)
-- Projeto: https://supabase.com/dashboard

create table if not exists public.site_content (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

create policy "Leitura publica do conteudo"
  on public.site_content
  for select
  using (true);

create or replace function public.get_site_content()
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select data from public.site_content where id = 1), '{}'::jsonb);
$$;

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

  insert into public.site_content (id, data, updated_at)
  values (1, content, now())
  on conflict (id) do update
    set data = excluded.data,
        updated_at = now();

  return true;
end;
$$;

grant execute on function public.get_site_content() to anon, authenticated;
grant execute on function public.save_site_content(jsonb, text) to anon, authenticated;

-- Bucket para fotos (opcional, recomendado)
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

create policy "Leitura publica de imagens"
  on storage.objects
  for select
  using (bucket_id = 'property-images');

create policy "Upload de imagens com senha via app"
  on storage.objects
  for insert
  with check (bucket_id = 'property-images');
