-- Rode este SQL no Supabase se você já executou o setup.sql antes
-- Atualiza a senha de salvamento na nuvem para a nova senha do administrador

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
