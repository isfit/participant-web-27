import axios from 'axios';


export const register = async (
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    country: string,
    dateBirth: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    let data = JSON.stringify({
      firstName,
      lastName,
      email,
      phone,
      password,
      country,
      dateBirth
    });
  
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:4000/auth/register',
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
