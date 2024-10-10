// src/hooks/useFetchImages.tsx

import { useEffect, useState } from 'react';
import axios from 'axios';

export const useFetchImages = (token: string) => {
  const [images, setImages] = useState<string[]>([]); // Initialize as an empty array
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    if (!token) return; 
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('http://localhost:8000/images', { 
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
      console.log(response,"res")
      setImages(response.data.images); // Set images to the data received
    } catch (err) {
      setError('Failed to fetch images.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchImages(); // Fetch images when the token changes
    }
  }, [token]);
  return { images, loading, error, fetchImages };
};

