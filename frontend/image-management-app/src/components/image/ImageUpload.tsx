import React, { useState } from 'react';
import { uploadImage } from '../../services/api';

interface ImageUploadProps {
  token: string;
  onImageUploaded: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ token, onImageUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false); // New loading state
  const [message, setMessage] = useState<string | null>(null); // Message for success or failure

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    setUploading(true); // Start loading state
    setMessage(null); // Clear previous message

    try {
      await uploadImage(file, token);
      setMessage('Image uploaded successfully!');
      setFile(null); // Clear the file input
      onImageUploaded(); // Refresh image list after upload
    } catch (error) {
      setMessage('Upload failed. Please try again.');
    } finally {
      setUploading(false); // Stop loading state
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Image</h2>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          required
        />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {message && <p className={`message ${message.includes('failed') ? 'error' : 'success'}`}>{message}</p>}
      
      {/* You can optionally add a spinner during upload */}
      {uploading && <div className="spinner">Uploading...</div>}
    </div>
  );
};

export default ImageUpload;
