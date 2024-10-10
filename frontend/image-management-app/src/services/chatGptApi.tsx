// src/services/chatGptApi.ts

import axios from 'axios';

const OPENAI_API_KEY = import.meta.env.REACT_APP_OPENAI_API_KEY; 
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

    return response.data.choices[0].message.content; 
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('Failed to analyze image');
  }
};
