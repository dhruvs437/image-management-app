// src/components/image/ImageList.tsx

import React, { useState } from 'react';
import './ImageList.css'; 
import { analyzeImageWithChatGPT } from '../../services/chatGptApi'; 

interface Image {
  url: string;
  uploadDate: string; // Assuming uploadDate is in ISO format
}

interface ImageListProps {
  images: Image[];
}

const ImageList: React.FC<ImageListProps> = ({ images }) => {
  return (
    <div className="image-gallery">
      <h2>Your Images</h2>
      <div className="images">
        {images.map((image, index) => (
          <ImageCard key={index} image={image} />
        ))}
      </div>
    </div>
  );
};

// Create a separate component for each image card
const ImageCard: React.FC<{ image: Image }> = ({ image }) => {
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeImage = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await analyzeImageWithChatGPT(image.url);
      console.log(result,"check");
      setDescription(result);
    } catch (err) {
      console.log(err,"err")
      setError('Failed to generate description. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-card">
      <div className="image-container">
        <img
          src={image.url}
          alt={`Image ${image.url}`}
          className="image"
        />
      </div>
      <div className="image-details">
        <p className="upload-date">Uploaded: {new Date(image.uploadDate).toLocaleDateString()}</p>
        <button onClick={handleAnalyzeImage} disabled={loading}>
          {loading ? 'Analyzing...' : 'Generate Description'}
        </button>
        {description && (
          <p className="description">Description: {description}</p>
        )}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default ImageList;
