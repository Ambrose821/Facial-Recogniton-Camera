import axios from 'axios';

const url =
  import.meta.env.VITE_API_URL || 'https://facial-recogniton-camera-production.up.railway.app';
const api = axios.create({
  baseURL: url,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
