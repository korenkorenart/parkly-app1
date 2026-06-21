-- Supabase schema for Parkly
-- Run this in the Supabase SQL editor to create the linked tables.

-- Optional profiles table for user metadata.
create table if not exists profiles (
  id text primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Parking spots stored in the app.
create table if not exists parking_spots (
  id text primary key default gen_random_uuid(),
  title text not null,
  location text not null,
  price numeric not null,
  available boolean not null default true,
  description text,
  lat numeric,
  lng numeric,
  created_at timestamptz not null default now()
);

-- Favorites linked to users and parking spots.
create table if not exists favorites (
  id text primary key default gen_random_uuid(),
  user_id text not null,
  parking_spot_id text not null references parking_spots(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, parking_spot_id)
);

-- Bookings linked to users and parking spots.
create table if not exists bookings (
  id text primary key default gen_random_uuid(),
  user_id text not null,
  parking_spot_id text not null references parking_spots(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'confirmed',
  created_at timestamptz not null default now()
);

-- Optional foreign key references to Supabase auth.users.
-- Uncomment if your Supabase project supports direct auth schema references.
-- alter table profiles add constraint profiles_user_fk foreign key (id) references auth.users(id) on delete cascade;
-- alter table favorites add constraint favorites_user_fk foreign key (user_id) references auth.users(id) on delete cascade;
-- alter table bookings add constraint bookings_user_fk foreign key (user_id) references auth.users(id) on delete cascade;

-- Optional RLS policies for auth control.
-- Uncomment and adjust if you want row-level security on favorites and bookings.
-- alter table favorites enable row level security;
-- create policy "Users can manage own favorites" on favorites
--   for select using (auth.uid() = user_id);
-- create policy "Users can insert own favorites" on favorites
--   for insert with check (auth.uid() = user_id);
-- create policy "Users can delete own favorites" on favorites
--   for delete using (auth.uid() = user_id);

-- alter table bookings enable row level security;
-- create policy "Users can manage own bookings" on bookings
--   for select using (auth.uid() = user_id);
-- create policy "Users can create own bookings" on bookings
--   for insert with check (auth.uid() = user_id);
