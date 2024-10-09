// src/pages/DashboardPage.tsx

import React, { useState } from 'react';
import { registerUser, loginUser } from '../services/api';
import Navbar from '../components/layout/Navbar';
import ImageList from '../components/image/ImageList';
import ImageUpload from '../components/image/ImageUpload';
import useFetchImages from '../hooks/useFetchImages';
import './DashboardPage.css'; // CSS file for styles

const DashboardPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const { images, loading, error } = useFetchImages(token);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(username, password);
      alert('User registered successfully!');
      setIsLogin(true); // Switch to login form after registration
    } catch (error) {
      alert('Registration failed.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser(username, password);
      setToken(response.data.token);
      alert('Login successful!');
    } catch (error) {
      alert('Login failed.');
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="form-container">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <p>
          {isLogin ? 'Need an account? ' : 'Already have an account? '}
          <button onClick={toggleForm}>
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>

      {token && (
        <>
          <ImageUpload token={token} onImageUploaded={() => {}} />
          {loading ? (
            <p>Loading images...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <ImageList images={images} />
          )}
        </>
      )}
    </div>
  );
};

export default DashboardPage;
