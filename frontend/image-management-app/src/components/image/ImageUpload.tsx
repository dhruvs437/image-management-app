// src/components/image/ImageUpload.tsx

import React, { useState } from 'react';
import { uploadImage } from '../../services/api';
import './ImageUpload.css'; // Import CSS for styles

interface ImageUploadProps {
  token: string;
  onImageUploaded: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ token, onImageUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      await uploadImage(file, token);
      setMessage('Image uploaded successfully!');
      setFile(null);
      onImageUploaded();
    } catch {
      setMessage('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <div className="upload-container">
      <h2 className='upload-container-text'>Upload Image</h2>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="image/*" // Restrict file selection to images
          onChange={handleFileChange}
          required
        />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {/* Display the selected file name */}
      {file && (
        <div className="file-preview">
          <h3>Selected File:</h3>
          <p>{file.name}</p>
          <img
            src={URL.createObjectURL(file)} // Create a URL for the selected file
            alt="Preview"
            className="image-preview"
          />
        </div>
      )}

      {message && <p className={`message ${message.includes('failed') ? 'error' : 'success'}`}>{message}</p>}
      {uploading && <div className="spinner">Uploading...</div>}
    </div>
  );
};

export default ImageUpload;
