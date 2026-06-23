-- Política de exclusão de imagens no bucket property-images
-- Execute no Supabase SQL Editor após fix-sync-completo.sql

drop policy if exists "Excluir imagens do site" on storage.objects;
create policy "Excluir imagens do site"
  on storage.objects
  for delete
  using (bucket_id = 'property-images');

select 'Politica de exclusao de imagens configurada!' as status;
