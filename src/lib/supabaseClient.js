import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

function ensureSupabase() {
  if (!supabase) {
    throw new Error('Supabase לא מוגדר')
  }

  return supabase
}

export async function fetchParkingSpots() {
  const client = ensureSupabase()

  const { data, error } = await client.from('parking_spots').select('*')

  if (error) throw error
  return data || []
}

export async function fetchFavorites(userId) {
  if (!supabase || !userId) return []

  const { data, error } = await supabase
    .from('favorites')
    .select('parking_spot_id')
    .eq('user_id', userId)

  if (error) throw error

  return (data || []).map((row) => row.parking_spot_id)
}

export async function addFavorite(userId, parkingSpotId) {
  const client = ensureSupabase()

  const { error } = await client.from('favorites').insert([
    {
      user_id: userId,
      parking_spot_id: parkingSpotId,
    },
  ])

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

export async function signUp(email, password) {
  const client = ensureSupabase()

  const { data, error } = await client.auth.signUp({ email, password })

  if (error) throw error
  return data
}

export async function signIn(email, password) {
  const client = ensureSupabase()

  const { data, error } = await client.auth.signInWithPassword({ email, password })

  if (error) throw error
  return data
}

export async function signOut() {
  const client = ensureSupabase()

  const { error } = await client.auth.signOut()

  if (error) throw error
}

export async function getSession() {
  const client = ensureSupabase()

  const { data, error } = await client.auth.getSession()

  if (error) throw error
  return data.session
}

export function onAuthStateChange(callback) {
  const client = ensureSupabase()

  return client.auth.onAuthStateChange((event, session) => callback(event, session))
}

export async function fetchBookings(userId) {
  if (!supabase || !userId) return []

  const { data, error } = await supabase
    .from('bookings')
    .select('*, parking_spots(id, title, location, price, description, lat, lng)')
    .eq('user_id', userId)
    .neq('status', 'cancelled')

  if (error) throw error
  return data || []
}

export async function createBooking(userId, parkingSpotId) {
  const client = ensureSupabase()

  const start = new Date().toISOString()
  const end = new Date(Date.now() + 1000 * 60 * 60).toISOString()

  const { data, error } = await client
    .from('bookings')
    .insert([
      {
        user_id: userId,
        parking_spot_id: parkingSpotId,
        starts_at: start,
        ends_at: end,
        status: 'confirmed',
      },
    ])
    .select('*, parking_spots(id, title, location, price, description, lat, lng)')
    .single()

  if (error) throw error
  return data
}

export async function cancelBooking(bookingId) {
  const client = ensureSupabase()

  const { error } = await client.from('bookings').delete().eq('id', bookingId)

  if (error) throw error

  return true
}

export async function createPayment(bookingId, amount) {
  const client = ensureSupabase()

  const { data, error } = await client
    .from('payments')
    .insert([
      {
        booking_id: bookingId,
        amount: Number(amount),
        payment_method: 'demo-card',
        status: 'paid',
      },
    ])
    .select()
    .single()

  if (error) throw error

  await client.from('bookings').update({ status: 'paid' }).eq('id', bookingId)

  return data
}

export default supabase