const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  try {
    // Fetch gallery views from the database
    const { data: galleryViews, error: galleryViewsError } = await supabase
      .from('gallery_views')
      .select('*')
      .order('display_order', { ascending: true });

    if (galleryViewsError) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: galleryViewsError.message }) 
      };
    }

    // For each gallery view, get its paintings
    const galleryViewsWithPaintings = await Promise.all(
      galleryViews.map(async (view) => {
        // Get gallery_paintings for this view
        const { data: galleryPaintings, error: galleryPaintingsError } = await supabase
          .from('gallery_paintings')
          .select('*, painting_id(*)')
          .eq('gallery_view_id', view.id)
          .order('position_order', { ascending: true });

        if (galleryPaintingsError) {
          console.error('Error fetching gallery paintings:', galleryPaintingsError);
          return {
            ...view,
            paintings: []
          };
        }

        // For each gallery painting, get its image
        const paintingsWithImages = await Promise.all(
          galleryPaintings.map(async (galleryPainting) => {
            const painting = galleryPainting.painting_id;
            
            if (!painting) {
              return null;
            }

            // Get primary image for this painting
            const { data: images, error: imagesError } = await supabase
              .from('painting_images')
              .select('*')
              .eq('painting_id', painting.id)
              .eq('is_primary', true)
              .limit(1);

            if (imagesError || !images || images.length === 0) {
              return {
                id: painting.id,
                title: painting.title,
                description: painting.description,
                year: painting.year,
                image_url: null,
                position: galleryPainting.position,
                size: galleryPainting.size
              };
            }

            return {
              id: painting.id,
              title: painting.title,
              description: painting.description,
              year: painting.year,
              image_url: images[0].image_url,
              position: galleryPainting.position,
              size: galleryPainting.size
            };
          })
        );

        // Filter out null paintings
        const validPaintings = paintingsWithImages.filter(p => p !== null);

        return {
          ...view,
          paintings: validPaintings
        };
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(galleryViewsWithPaintings)
    };
  } catch (error) {
    console.error('Function error:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};