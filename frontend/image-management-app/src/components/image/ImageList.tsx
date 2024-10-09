// src/components/image/ImageList.tsx

import React from 'react';

interface ImageListProps {
  images: string[];
}

const ImageList: React.FC<ImageListProps> = ({ images }) => {
  return (
    <div className="image-gallery">
      <h2>Your Images</h2>
      <div className="images">
        {images.map((image, index) => (
          <img 
            key={index} 
            src={image} // Use the image URL directly
            alt={`Image ${index + 1}`} // Improve alt text for accessibility
          />
        ))}
      </div>
    </div>
  );
};

export default ImageList;
