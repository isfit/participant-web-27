import axios from 'axios';


const api_url: string = import.meta.env.VITE_API_URL;

export const apply = async (applicationForm: FormData) => {
  const token = JSON.parse(localStorage.getItem('authTokens') || '');

  const response = await axios.post(`${api_url}/api/application/apply`, applicationForm, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const getApplications = async () => {
  const token = JSON.parse(localStorage.getItem('authTokens') || '');

  const response = await axios.get(`${api_url}/api/application/applications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};