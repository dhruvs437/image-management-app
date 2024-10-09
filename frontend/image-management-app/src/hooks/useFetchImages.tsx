// src/hooks/useFetchImages.ts

import { useState, useEffect } from 'react';
import { fetchImages } from '../services/api';

const useFetchImages = (token: string) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const response = await fetchImages(token);
        setImages(response.data.images);
      } catch (err) {
        setError('Failed to fetch images.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadImages();
    }
  }, [token]);

  return { images, loading, error };
};

export default useFetchImages;
