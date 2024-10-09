// src/services/api.ts

import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Update with your backend URL

const api = axios.create({
  baseURL: API_URL,
});

export const registerUser = async (username: string, password: string) => {
  return await api.post('/register', { username, password });
};

export const loginUser = async (username: string, password: string) => {
  return await api.post('/login', { username, password });
};

export const uploadImage = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append('file', file);
  return await api.post('/upload', formData, {
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
  });
};

export const fetchImages = async (token: string) => {
    const response = await axios.get('/images', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  };
