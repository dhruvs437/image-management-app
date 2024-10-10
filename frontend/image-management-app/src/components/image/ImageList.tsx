// src/components/image/ImageList.tsx

import React from 'react';

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
          <div className="image-card" key={index}>
            <img 
              src={image.url}
              alt={`Image ${index + 1}`} // Improve alt text for accessibility
              className="image"
            />
            <div className="image-details">
              <p className="upload-date">Uploaded-:{new Date(image.uploadDate).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageList;
