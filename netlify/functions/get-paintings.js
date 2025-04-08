const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  try {
    // Fetch all paintings from the database
    const { data, error } = await supabase
      .from('paintings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: error.message }) 
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};