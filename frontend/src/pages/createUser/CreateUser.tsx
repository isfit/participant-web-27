import React, { useState } from 'react';
import { Button } from '@radix-ui/themes';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../api/user';
import Header from '../../components/Header/Header';
import './CreateUser.css';

interface User {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const CreateUser: React.FC = () => {
  const [user, setUser] = useState<User>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      alert('Passwords do not match');
      return;
    } else {
      console.log(user);
      register(
        user.fullName,
        user.email,
        user.password,
      );
      navigate('/login');
    }
  };

  return (
    <div className="outerContainer">
      <Header linkTo="/homepage" />
      <form onSubmit={handleSubmit} className="formContainer">
        {[
          {
            label: 'Full name',
            name: 'fullName',
            type: 'text',
            placeholder: 'John Doe',
          },
          {
            label: 'Email',
            name: 'email',
            type: 'email',
            placeholder: 'name@email.com',
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
            />
          </label>
        ))}
        <Button className="submitButton">Create User</Button>
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
