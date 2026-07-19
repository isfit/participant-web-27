import axios from './axios';

const api_url: string = import.meta.env.VITE_API_URL;

export const generateResetLink = async (email: string): Promise<string> => {
  const response = await axios.post(`${api_url}/auth/generate-reset-link`, { email });
  return response.data.resetLink;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const response = await axios.post(`${api_url}/auth/reset-password`, {
    token,
    newPassword,
  });
  return response.data;
};
