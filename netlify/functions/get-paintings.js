const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  try {
    // Fetch all paintings from the database
    const { data: paintings, error: paintingsError } = await supabase
      .from('paintings')
      .select('*')
      .order('created_at', { ascending: false });

    if (paintingsError) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: paintingsError.message }) 
      };
    }

    // For each painting, get its primary image
    const paintingsWithImages = await Promise.all(
      paintings.map(async (painting) => {
        const { data: images, error: imagesError } = await supabase
          .from('painting_images')
          .select('*')
          .eq('painting_id', painting.id)
          .eq('is_primary', true)
          .limit(1);

        if (imagesError || !images || images.length === 0) {
          return {
            ...painting,
            image_url: null,
            path: null
          };
        }

        return {
          ...painting,
          image_url: images[0].image_url,
          path: images[0].path
        };
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(paintingsWithImages)
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};