// src/pages/DashboardPage.tsx

import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import ImageList from '../components/image/ImageList';
import ImageUpload from '../components/image/ImageUpload';
import AuthForm from '../components/auth/AuthForm';
import {useFetchImages} from '../hooks/useFetchImages';
import './DashboardPage.css'; // Add your styles here

const DashboardPage: React.FC = () => {
  const [token, setToken] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'fetch' | null>(null);
  const { images, loading, error, fetchImages } = useFetchImages(token); // Include fetchImages

  const BUCKET_NAME = 'img-store-container'; // Replace with your actual bucket name
  const BASE_URL = `https://${BUCKET_NAME}.s3.amazonaws.com/`; // Construct base URL for S3

  const handleTabClick = (tab: 'upload' | 'fetch') => {
    setActiveTab(tab);
    if (tab === 'fetch') {
      fetchImages(); // Fetch images when fetch tab is clicked
    }
  };

  return (
    <div className="dashboard">
      <Navbar />

      {!token ? (
        <AuthForm onLoginSuccess={(token) => setToken(token)} />
      ) : (
        <>
          <div className="tab-buttons">
            <button onClick={() => handleTabClick('upload')}>Upload Image</button>
            <button onClick={() => handleTabClick('fetch')}>Fetch Images</button>
          </div>

          {activeTab === 'upload' && (
            <ImageUpload token={token} onImageUploaded={fetchImages} />
          )}
          
          {activeTab === 'fetch' && (
            <>
              {loading ? (
                <p>Loading images...</p>
              ) : error ? (
                <p>{error}</p>
              ) : (
                <ImageList images={images?.map(image => `${BASE_URL}${image}`)} /> // Pass full URLs to ImageList
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardPage;
