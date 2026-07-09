import axios from './axios';

export const generateResetLink = async (email: string): Promise<string> => {
  const response = await axios.post('/auth/generate-reset-link', { email });
  return response.data.resetLink;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const response = await axios.post('/auth/reset-password', {
    token,
    newPassword,
  });
  return response.data;
};
