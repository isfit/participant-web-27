import React, { useState } from 'react';
import { Button } from '@radix-ui/themes';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../api/user';
import Header from '../../components/Header/Header';
import './CreateUser.css';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  dob: string;
  password: string;
  confirmPassword: string;
}

const CreateUser: React.FC = () => {
  const [user, setUser] = useState<User>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    dob: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
    setErrorMessage(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      alert('Passwords do not match');
      return;
    } else {
      const result = await register(
        user.firstName,
        user.lastName,
        user.email,
        user.phone,
        user.country,
        user.dob,
        user.password,
      );

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        setErrorMessage(result.message);
      }
    }
  };

  return (
    <div className="outerContainer">
      <Header linkTo="/homepage" />
      <form onSubmit={handleSubmit} className="formContainer">
        {[
          {
            label: 'First name',
            name: 'firstName',
            type: 'text',
            placeholder: 'John',
          },
          {
            label: 'Last name',
            name: 'lastName',
            type: 'text',
            placeholder: 'Doe',
          },
          {
            label: 'Email',
            name: 'email',
            type: 'email',
            placeholder: 'name@email.com',
          },
          {
            label: 'Phone Number',
            name: 'phone',
            type: 'tel',
            placeholder: '+49 012 345 6789',
          },
          {
            label: 'Country of Residence',
            name: 'country',
            type: 'text',
            placeholder: 'Germany',
          },
          {
            label: 'Date of Birth',
            name: 'dob',
            type: 'date',
            placeholder: '',
          },
          {
            label: 'Password',
            name: 'password',
            type: 'password',
            placeholder: '**********',
          },
          {
            label: 'Confirm Password',
            name: 'confirmPassword',
            type: 'password',
            placeholder: '**********',
          },
        ].map(({ label, name, type, placeholder }) => (
          <label key={name} className="formSection">
            <p>{label}</p>
            <input
              type={type}
              name={name}
              value={user[name as keyof User]}
              onChange={handleChange}
              placeholder={placeholder}
              className="formInput"
              required
            />
          </label>
        ))}
        <Button className="submitButton">Create User</Button>
        {errorMessage && <div className="errorMessage">{errorMessage}</div>}
        {success && <p className="successMessage">Successfully registered</p>}
        <br />
        <div className="loginPrompt">Already have an account?</div>

        <Link to="/login" className="loginLink">
          <Button className="loginButton">Login</Button>
        </Link>
      </form>
    </div>
  );
};

export default CreateUser;
