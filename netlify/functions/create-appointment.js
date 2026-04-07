// create-appointment.js – CommonJS verzija

const { createClient } = require('@supabase/supabase-js')

exports.handler = async (event, context) => {
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
      process.env.SUPABASE_ANON_KEY
    )

    // 1) Preveri, ali je termin že zaseden
    const { data: existing, error: checkError } = await supabase
      .from('Rezervacije')
      .select('*')
      .eq('datum', date)
      .eq('ura', time)

    if (checkError) {
      console.error('Error checking existing reservation:', checkError)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Database check failed' })
      }
    }

    if (existing && existing.length > 0) {
      return {
        statusCode: 409,
        body: JSON.stringify({ error: 'Termin je že zaseden.' })
      }
    }

    // 2) Vstavi novo rezervacijo
    const { data, error } = await supabase
      .from('Rezervacije')
      .insert([
        {
          datum: date,
          ura: time,
          ime: name,
          email: email,
          telefon: phone || null
        }
      ])
      .select()

    if (error) {
      console.error('Error inserting reservation:', error)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to create reservation' })
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Rezervacija uspešno ustvarjena.',
        reservation: data[0]
      })
    }
  } catch (err) {
    console.error('Unhandled error:', err)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}
