import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.26.0'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

function ensureSupabase() {
  if (!supabase) {
    throw new Error('Supabase לא מוגדר. בדוק את קובץ .env.local עם VITE_SUPABASE_URL ו-VITE_SUPABASE_ANON_KEY.')
  }
  return supabase
}

export async function fetchParkingSpots() {
  const client = ensureSupabase()
  const { data, error } = await client.from('parking_spots').select('*')
  if (error) throw error
  return data
}

export async function fetchFavorites(userId) {
  if (!supabase) return []
  const { data, error } = await supabase.from('favorites').select('parking_spot_id').eq('user_id', userId)
  if (error) throw error
  return data.map((row) => row.parking_spot_id)
}

export async function addFavorite(userId, parkingSpotId) {
  const client = ensureSupabase()
  const { error } = await client.from('favorites').insert([{ user_id: userId, parking_spot_id: parkingSpotId }])
  if (error) throw error
}

export async function removeFavorite(userId, parkingSpotId) {
  const client = ensureSupabase()
  const { error } = await client
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('parking_spot_id', parkingSpotId)
  if (error) throw error
}

export default supabase
