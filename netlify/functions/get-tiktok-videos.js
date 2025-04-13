const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  try {
    // Fetch videos from the database
    const { data: videos, error: videosError } = await supabase
      .from('videos')
      .select('*')
      .order('display_order', { ascending: true });

    if (videosError) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: videosError.message }) 
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(videos)
    };
  } catch (error) {
    console.error('Function error:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};