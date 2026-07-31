create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_url text not null default '',
  ingredients text not null default '',
  instructions text not null default '',
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.recipes enable row level security;

create policy "Enable read access for all users" on public.recipes
  for select using (true);

create policy "Enable insert for all users" on public.recipes
  for insert with check (true);

create policy "Enable update for all users" on public.recipes
  for update using (true);

create policy "Enable delete for all users" on public.recipes
  for delete using (true);
