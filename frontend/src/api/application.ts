import axios from 'axios';

export const apply = async (applicationForm: FormData) => {
  const token = JSON.parse(localStorage.getItem('authTokens') || '');

  const response = await axios.post('http://localhost:4000/api/application/apply', applicationForm, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};