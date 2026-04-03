import { createClient } from '@supabase/supabase-js'

export const handler = async (event, context) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' })
      }
    }

    const { date, time, name, email, phone } = JSON.parse(event.body)

    if (!date || !time || !name || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      }
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    )

    // 1) Preveri, ali je termin že zaseden
    const { data: existing, error: checkError } = await supabase
      .from('Rezervacije')
      .select('*')
      .eq('Datum', date)
      .eq('Ura', time)

    if (checkError) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Database check failed' })
      }
    }

    if (existing.length > 0) {
      return {
        statusCode: 409,
        body: JSON.stringify({ error: 'Termin je že zaseden.' })
      }
    }

    // 2) Shrani rezervacijo
    const { data, error } = await supabase
      .from('Rezervacije')
      .insert([
        { Datum: date, Ura: time, Ime: name, 'e-mail': email, Telefon: phone }
      ])

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to save appointment' })
      }
    }

    // 3) (opcijsko) tukaj bova dodala email + Google Calendar

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Termin rezerviran.' })
    }

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', details: err.message })
    }
  }
}
