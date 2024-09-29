import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const axiosInstance = axios.create({
  baseURL: '/',
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('authTokens');
    if (token) {
      const authToken: string = JSON.parse(token);
      const decodedToken = jwtDecode<{ exp: number }>(authToken);
      if (decodedToken.exp * 1000 < Date.now()) {
        // Refresh token logic
        localStorage.removeItem('authTokens');
        localStorage.setItem('sessionExpired', 'true');
        window.location.replace('/login');
      } else {
        config.headers['Authorization'] = `Bearer ${authToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
