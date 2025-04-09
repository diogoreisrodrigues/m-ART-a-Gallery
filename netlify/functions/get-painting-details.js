const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  try {
    // Get painting ID from query parameters
    const params = event.queryStringParameters;
    const paintingId = params.id;
    
    if (!paintingId) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Painting ID is required' }) 
      };
    }

    // Fetch the painting details
    const { data: painting, error: paintingError } = await supabase
      .from('paintings')
      .select('*')
      .eq('id', paintingId)
      .single();

    if (paintingError) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: paintingError.message }) 
      };
    }

    if (!painting) {
      return { 
        statusCode: 404, 
        body: JSON.stringify({ error: 'Painting not found' }) 
      };
    }

    // Fetch all images for this painting
    const { data: images, error: imagesError } = await supabase
      .from('painting_images')
      .select('*')
      .eq('painting_id', paintingId)
      .order('is_primary', { ascending: false });

    if (imagesError) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: imagesError.message }) 
      };
    }

    // Combine painting with its images
    const result = {
      ...painting,
      images: images || []
    };

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};