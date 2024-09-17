import axios from 'axios';
import axiosInstance from './axios';

const api_url: string = import.meta.env.VITE_API_URL;

export const apply = async (applicationForm: FormData) => {
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${api_url}/api/application/apply`,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: applicationForm,
  };
  const response = await axiosInstance.request(config);

  return response;
};

export const getApplications = async () => {
  const token = JSON.parse(localStorage.getItem('authTokens') || '');
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${api_url}/api/application/applications`,
  };
  try {
    const response = await axiosInstance.request(config);
    return response;
  } catch (error: any) {
    return { success: false, message: error.response.data.errors[0].msg };
  }
};
