# Parkly (Demo)

Parkly is a demo app to discover and book parking spots. This repository contains a local demo dataset and a simple React + Vite frontend with RTL Hebrew support.

What it does:
- מציג חניות לדמו, מאפשר סינון ומיון
- שמירה במועדפים
- עמוד פרטי חניה + כפתור הזמנה (הודעת הצלחה)

How to run:
1. Install dependencies: `npm install`
2. Run dev server: `npm run dev`

Notes:
- This is a demo app with Supabase auth and bookings integration.
- The demo data lives in `src/data/parkingData.js` until Supabase credentials are configured.
- To enable Supabase, create a `.env.local` file and add:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

## Supabase SQL Schema

Recommended tables and relationships:

- `parking_spots`
  - `id` TEXT PRIMARY KEY
  - `title` TEXT NOT NULL
  - `location` TEXT NOT NULL
  - `price` NUMERIC NOT NULL
  - `available` BOOLEAN NOT NULL DEFAULT true
  - `description` TEXT
  - `lat` NUMERIC
  - `lng` NUMERIC

- `favorites`
  - `id` TEXT PRIMARY KEY DEFAULT gen_random_uuid()
  - `user_id` TEXT NOT NULL
  - `parking_spot_id` TEXT NOT NULL
  - `created_at` TIMESTAMP WITH TIME ZONE DEFAULT now()

- `bookings`
  - `id` TEXT PRIMARY KEY DEFAULT gen_random_uuid()
  - `user_id` TEXT NOT NULL
  - `parking_spot_id` TEXT NOT NULL
  - `starts_at` TIMESTAMP WITH TIME ZONE NOT NULL
  - `ends_at` TIMESTAMP WITH TIME ZONE NOT NULL
  - `status` TEXT NOT NULL DEFAULT 'confirmed'
  - `created_at` TIMESTAMP WITH TIME ZONE DEFAULT now()

### Supabase SQL example

Use this SQL in Supabase SQL editor:

```sql
create table if not exists parking_spots (
  id text primary key,
  title text not null,
  location text not null,
  price numeric not null,
  available boolean not null default true,
  description text,
  lat numeric,
  lng numeric
);

create table if not exists favorites (
  id text primary key default gen_random_uuid(),
  user_id text not null,
  parking_spot_id text not null,
  created_at timestamptz default now()
);

create table if not exists bookings (
  id text primary key default gen_random_uuid(),
  user_id text not null,
  parking_spot_id text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'confirmed',
  created_at timestamptz default now()
);
```

If you want user profile metadata, add an optional `profiles` table with `id`, `email`, and `created_at`.

## How it works

- Auth: `src/lib/supabaseClient.js` uses Supabase Auth for login/register.
- Favorites: stored per user in the `favorites` table.
- Bookings: stored per user in the `bookings` table.
