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
    if (!data.title || !data.images || !data.images.length) {
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

    // First, create the painting record
    const paintingData = { 
      title: data.title,
      description: data.description || '',
      year: data.year || new Date().getFullYear().toString(),
      dimensions: data.dimensions || '',
      price: data.price || null,
      medium: data.medium || '',
      status: data.status || 'Available',
    };

    // Insert the painting record
    const { data: insertedPainting, error: dbError } = await supabase
      .from('paintings')
      .insert([paintingData])
      .select();

    if (dbError) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: dbError.message }) 
      };
    }

    const paintingId = insertedPainting[0].id;
    const uploadedImages = [];

    // Process each image
    for (let i = 0; i < data.images.length; i++) {
      const imageBase64 = data.images[i];
      
      // Convert base64 to file
      const base64Data = imageBase64.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Generate a unique filename
      const filename = `${Date.now()}-${i}-${data.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      
      // Upload image to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('paintings')
        .upload(filename, buffer, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        continue; // Skip this image but continue with others
      }

      // Get the public URL for the uploaded image
      const { data: urlData } = supabase
        .storage
        .from('paintings')
        .getPublicUrl(filename);

      // Store image data in painting_images table
      const imageData = {
        painting_id: paintingId,
        path: filename,
        image_url: urlData.publicUrl,
        is_primary: i === 0 // First image is primary
      };

      const { data: insertedImage, error: imageDbError } = await supabase
        .from('painting_images')
        .insert([imageData]);

      if (imageDbError) {
        console.error('Image DB error:', imageDbError);
      } else {
        uploadedImages.push({
          path: filename,
          url: urlData.publicUrl,
          is_primary: i === 0
        });
      }
    }

    // If no images were uploaded successfully, return an error
    if (uploadedImages.length === 0) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'Failed to upload any images' }) 
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Painting uploaded successfully',
        painting: {
          ...insertedPainting[0],
          images: uploadedImages
        }
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