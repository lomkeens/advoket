-- Drop existing policies
drop policy if exists "Users can view their own firm settings" on firm_settings;
drop policy if exists "Users can insert their own firm settings" on firm_settings;
drop policy if exists "Users can update their own firm settings" on firm_settings;
drop policy if exists "Firm settings are viewable by organization members" on firm_settings;
drop policy if exists "Firm settings are insertable by organization admin" on firm_settings;
drop policy if exists "Firm settings are updatable by organization admin" on firm_settings;

-- Drop existing trigger
drop trigger if exists update_firm_settings_updated_at on firm_settings;

-- Drop existing function
drop function if exists update_updated_at_column();

-- Drop existing constraints
alter table if exists firm_settings drop constraint if exists unique_user_firm_settings;

-- Update table structure
alter table if exists firm_settings 
  drop column if exists user_id,
  drop column if exists firm_type,
  drop column if exists country;

-- Rename firm_name to name if it exists
do $$ 
begin
  if exists (select 1 from information_schema.columns where table_name = 'firm_settings' and column_name = 'firm_name') then
    alter table firm_settings rename column firm_name to name;
  end if;
end $$;

-- Add organization_id if it doesn't exist
alter table if exists firm_settings 
  add column if not exists organization_id uuid references auth.users(id) on delete cascade;

-- Ensure all required columns exist with correct types
alter table if exists firm_settings
  alter column name type text,
  alter column name set not null,
  alter column address type text,
  alter column city type text,
  alter column state type text,
  alter column zip_code type text,
  alter column phone type text,
  alter column email type text,
  alter column website type text,
  alter column tax_id type text,
  alter column logo_url type text,
  alter column created_at type timestamp with time zone using created_at at time zone 'UTC',
  alter column created_at set default timezone('utc'::text, now()),
  alter column created_at set not null,
  alter column updated_at type timestamp with time zone using updated_at at time zone 'UTC',
  alter column updated_at set default timezone('utc'::text, now()),
  alter column updated_at set not null;

-- Re-create RLS policies
create policy "Firm settings are viewable by organization members"
  on firm_settings for select
  using ( auth.uid() = organization_id );

create policy "Firm settings are insertable by organization admin"
  on firm_settings for insert
  with check ( auth.uid() = organization_id );

create policy "Firm settings are updatable by organization admin"
  on firm_settings for update
  using ( auth.uid() = organization_id );

-- Re-create update_updated_at function and trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_firm_settings_updated_at
    before update on firm_settings
    for each row
    execute function update_updated_at_column();
