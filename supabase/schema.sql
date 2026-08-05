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

-- Favorites: recipes saved by individual users.
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, recipe_id)
);

alter table public.favorites enable row level security;

create policy "Users can view their own favorites" on public.favorites
  for select using (auth.uid() = user_id);

create policy "Users can insert their own favorites" on public.favorites
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own favorites" on public.favorites
  for delete using (auth.uid() = user_id);
