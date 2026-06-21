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
- This is a demo app with pending Supabase integration.
- The demo data lives in `src/data/parkingData.js` until Supabase credentials are configured.
- עכשיו אפשר לחבר Supabase בעזרת `VITE_SUPABASE_URL` ו-`VITE_SUPABASE_ANON_KEY` ב־`.env.local`.

## Supabase SQL Schema

Recommended tables and relationships:

- `profiles`
  - `id` (UUID, primary key)
  - `email`
  - `name`
  - `created_at`

- `parking_spots`
  - `id` (UUID, primary key)
  - `title`
  - `location`
  - `price`
  - `available` (boolean)
  - `description`

- `favorites`
  - `id` (UUID, primary key)
  - `user_id` (UUID, foreign key → profiles.id)
  - `parking_spot_id` (UUID, foreign key → parking_spots.id)

- `bookings`
  - `id` (UUID, primary key)
  - `user_id` (UUID, foreign key → profiles.id)
  - `parking_spot_id` (UUID, foreign key → parking_spots.id)
  - `starts_at`
  - `ends_at`
  - `status`

- `payments`
  - `id` (UUID, primary key)
  - `booking_id` (UUID, foreign key → bookings.id)
  - `amount`
  - `status`
  - `paid_at`

- `reviews`
  - `id` (UUID, primary key)
  - `user_id` (UUID, foreign key → profiles.id)
  - `parking_spot_id` (UUID, foreign key → parking_spots.id)
  - `rating`
  - `comment`
  - `created_at`
