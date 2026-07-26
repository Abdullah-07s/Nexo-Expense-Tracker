import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexo_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('AXIOS INTERCEPTOR CAUGHT ERROR:', error.response?.status, error.config?.url);
    if (error.response?.status === 401) {
      localStorage.removeItem('nexo_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;