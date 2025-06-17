-- Create firm_settings table
create table if not exists firm_settings (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    address text,
    city text,
    state text,
    zip_code text,
    phone text,
    email text,
    website text,
    tax_id text,
    logo_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    organization_id uuid references auth.users(id) on delete cascade
);

-- Create RLS policies after all columns are added
alter table firm_settings enable row level security;

-- Add organization_id column explicitly first to avoid race conditions
alter table firm_settings add column if not exists organization_id uuid references auth.users(id) on delete cascade;

create policy "Firm settings are viewable by organization members"
  on firm_settings for select
  using ( auth.uid() = organization_id );

create policy "Firm settings are insertable by organization admin"
  on firm_settings for insert
  with check ( auth.uid() = organization_id );

create policy "Firm settings are updatable by organization admin"
  on firm_settings for update
  using ( auth.uid() = organization_id );

-- Create function to auto-update updated_at
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
