const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Parse the incoming JSON
    const data = JSON.parse(event.body);
    
    // Validate the request has required fields
    if (!data.name || !data.backgroundImage) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Missing required fields' }) 
      };
    }

    // Check for admin password (simple authentication)
    if (data.adminPassword !== process.env.ADMIN_PASSWORD) {
      return { 
        statusCode: 401, 
        body: JSON.stringify({ error: 'Unauthorized' }) 
      };
    }

    // Get the current highest display_order
    const { data: existingViews, error: orderError } = await supabase
      .from('gallery_views')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1);

    if (orderError) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: orderError.message }) 
      };
    }

    // Calculate the next display order
    const nextDisplayOrder = existingViews && existingViews.length > 0 
      ? (existingViews[0].display_order + 1) 
      : 1;

    // Create the gallery view record
    const galleryViewData = { 
      name: data.name,
      description: data.description || '',
      backgroundImage: data.backgroundImage,
      display_order: nextDisplayOrder
    };

    // Insert the gallery view record
    const { data: insertedView, error: dbError } = await supabase
      .from('gallery_views')
      .insert([galleryViewData])
      .select();

    if (dbError) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: dbError.message }) 
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Gallery view created successfully',
        galleryView: insertedView[0]
      })
    };
  } catch (error) {
    console.error('Function error:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};