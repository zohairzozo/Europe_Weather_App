const API_ENDPOINT = 'https://dataservice.accuweather.com/locations/v1/cities/search';
const API_KEY = process.env.ACCUWEATHER_API_KEY;

export default async (request, context) => {
  const cityName = new URL(request.url).searchParams.get('city');
  
  if (!cityName || !API_KEY) {
    return new Response(
      JSON.stringify({ error: 'City name or API key is missing' }),
      { status: 400 }
    );
  }

  try {
    // Use fetch to call AccuWeather API
    const response = await fetch(`${API_ENDPOINT}?apikey=${API_KEY}&q=${encodeURIComponent(cityName)}&details=true`);
    
    // If the response isn't OK, return an error
    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch location data' }),
        { status: response.status }
      );
    }
    
    // Parse the JSON response
    const data = await response.json();
    
    if (data.length === 0) {
      return new Response(
        JSON.stringify({ error: 'City not found' }),
        { status: 404 }
      );
    }

    // Return the location data
    return new Response(
      JSON.stringify({ data: data[0] }),
      { status: 200 }
    );
  } catch (error) {
    // Log the error and return a 500 error response
    console.log(error);
    return new Response(
      JSON.stringify({ error: 'Failed fetching data' }),
      { status: 500 }
    );
  }
};
