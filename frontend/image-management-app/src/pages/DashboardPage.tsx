import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import ImageList from '../components/image/ImageList';
import ImageUpload from '../components/image/ImageUpload';
import AuthForm from '../components/auth/AuthForm';
import { useFetchImages } from '../hooks/useFetchImages';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [activeTab, setActiveTab] = useState<'upload' | 'fetch' | null>(null);
  
  const { images, loading, error, fetchImages } = useFetchImages(token || '');

  // Update token and local storage whenever token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const handleTabClick = (tab: 'upload' | 'fetch') => {
    setActiveTab(tab);
    if (tab === 'fetch') {
      fetchImages();
    }
  };

  const handleLogout = () => {
    setToken(null); // Clear token in state
  };

  return (
    <div className="dashboard">
      <Navbar />
      {!token ? (
        <AuthForm onLoginSuccess={setToken} />
      ) : (
        <>
          <button onClick={handleLogout}>Logout</button> {/* Logout button */}
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
                <ImageList images={images} />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardPage;
