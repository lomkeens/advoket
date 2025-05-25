-- Create storage bucket for logos if it doesn't exist
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

-- Allow public access to logos bucket
create policy "Logos are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'logos' );

-- Allow authenticated users to upload logos
create policy "Authenticated users can upload logos"
  on storage.objects for insert
  with check (
    bucket_id = 'logos' 
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to update their own logos
create policy "Users can update their own logos"
  on storage.objects for update
  using (
    bucket_id = 'logos'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to delete their own logos  
create policy "Users can delete their own logos"
  on storage.objects for delete
  using (
    bucket_id = 'logos'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
