// A serverless function that acts as a secure proxy to the Gemini API.
// It retrieves the API key from environment variables, ensuring it's not exposed client-side.

exports.handler = async function(event) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!prompt) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Prompt is required.' }) };
    }

    if (!apiKey) {
      // This error is for the developer, not the user.
      console.error('GEMINI_API_KEY environment variable not set.');
      return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured on the server.' }) };
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    // Using node-fetch as 'fetch' might not be available in all Node.js runtimes
    // You'll need to install it: npm install node-fetch
    const fetch = (await import('node-fetch')).default;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Gemini API Error:', errorBody);
      return { statusCode: response.status, body: JSON.stringify({ error: `Gemini API returned an error: ${response.statusText}` }) };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Proxy Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

