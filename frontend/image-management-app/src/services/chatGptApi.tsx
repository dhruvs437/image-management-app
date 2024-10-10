// src/services/chatGptApi.ts
import axios from 'axios';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY; 
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const analyzeImageWithChatGPT = async (imageUrl: string): Promise<string> => {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-3.5-turbo", 
        messages: [
          {
            role: "user",
            content: `Please analyze the image found at this URL and provide a description: ${imageUrl}`,
          },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('API Response:', response.data); // Log full response for debugging
    return response.data.choices[0].message.content; // Adjust based on correct API response structure
  } catch (error: any) { // Capture more error details
    if (error.response) {
      // The request was made and the server responded with a status code outside the 2xx range
      console.error('Error response data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
    } else {
      // Something else happened while setting up the request
      console.error('Error message:', error.message);
    }
    throw new Error('Failed to analyze image');
  }
};
