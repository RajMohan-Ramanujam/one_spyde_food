import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Interceptor to attach simple base64 token if it exists in local storage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('onespyde_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
