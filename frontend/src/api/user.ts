import { ROLES } from '../config/roles';

const api_url: string = import.meta.env.VITE_API_URL;

export const register = async (
  fullName: string,
  email: string,
  password: string,
) => {
  const data = JSON.stringify({
    fullName: fullName,
    email: email,
    password: password,
    role: ROLES.USER,
  });

  try {
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.response.data.errors[0].msg };
  }
};
