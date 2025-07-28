const API_ENDPOINT = 'https://dataservice.accuweather.com/locations/v1/cities/search';
const API_KEY = process.env.ACCUWEATHER_API_KEY;

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export default async (request, context) => {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }

  const cityName = new URL(request.url).searchParams.get('city');
  
  if (!cityName) {
    return new Response(
      JSON.stringify({ error: 'City name is required' }),
      { 
        status: 400,
        headers: corsHeaders
      }
    );
  }

  if (!API_KEY) {
    return new Response(
      JSON.stringify({ error: 'AccuWeather API key is not configured. Please set the ACCUWEATHER_API_KEY environment variable.' }),
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }

  try {
    // Use fetch to call AccuWeather API
    const response = await fetch(`${API_ENDPOINT}?apikey=${API_KEY}&q=${encodeURIComponent(cityName)}&details=true`);
    
    // If the response isn't OK, return an error
    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch location data' }),
        { 
          status: response.status,
          headers: corsHeaders
        }
      );
    }
    
    // Parse the JSON response
    const data = await response.json();
    
    if (data.length === 0) {
      return new Response(
        JSON.stringify({ error: 'City not found' }),
        { 
          status: 404,
          headers: corsHeaders
        }
      );
    }

    // Return the location data
    return new Response(
      JSON.stringify({ data: data[0] }),
      { 
        status: 200,
        headers: corsHeaders
      }
    );
  } catch (error) {
    // Log the error and return a 500 error response
    console.log(error);
    return new Response(
      JSON.stringify({ error: 'Failed fetching data' }),
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
};
