import axios from 'axios';

export const apply = async (applicationForm: FormData) => {
  const token = JSON.parse(localStorage.getItem('authTokens') || '');

  const response = await axios.post('https://participant-web-25-backend-fxc0baateneje3f0.norwayeast-01.azurewebsites.net/api/application/apply', applicationForm, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const getApplications = async () => {
  const token = JSON.parse(localStorage.getItem('authTokens') || '');

  const response = await axios.get('https://participant-web-25-backend-fxc0baateneje3f0.norwayeast-01.azurewebsites.net/api/application/applications', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};