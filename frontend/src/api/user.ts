import axios from 'axios';
import { ROLES } from '../config/roles';

const api_url: string = import.meta.env.VITE_API_URL;


export const register = async (fullName: string, email: string, password: string) => {
    const data = JSON.stringify({
        "fullName": fullName,
        "email": email,
        "password": password,
        "role": ROLES.USER
    });
    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${api_url}/auth/register`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };
  
    try {
      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
      return { success: true };
    } catch (error: any) {
      console.log(error);
      return { success: false, message: error.response.data.errors[0].msg };
    }
  };