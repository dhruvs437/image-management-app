// src/hooks/useFetchImages.ts

import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetchImages = (token: string) => {
  const [images, setImages] = useState<{ url: string; uploadDate: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8000/images', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fetchedImages = response.data.images.map((img: { url: string; uploadDate: string }) => ({
        url: img.url,
        uploadDate: img.uploadDate,
      }));
      setImages(fetchedImages);
    } catch (err) {
      setError('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchImages();
    }
  }, [token]);

  return { images, loading, error, fetchImages };
};
