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
    if (!data.title || !data.imageBase64) {
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

    // Convert base64 to file
    const base64Data = data.imageBase64.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Generate a unique filename
    const filename = `${Date.now()}-${data.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    
    // Upload image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('paintings')
      .upload(filename, buffer, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (uploadError) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: uploadError.message }) 
      };
    }

    // Get the public URL for the uploaded image
    const { data: urlData } = supabase
      .storage
      .from('paintings')
      .getPublicUrl(filename);

    // Store painting data in Supabase database
    const { data: paintingData, error: dbError } = await supabase
      .from('paintings')
      .insert([
        { 
          title: data.title,
          description: data.description || '',
          year: data.year || new Date().getFullYear().toString(),
          path: filename,
          image_url: urlData.publicUrl
        }
      ]);

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
        message: 'Painting uploaded successfully',
        painting: paintingData[0]
      })
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};