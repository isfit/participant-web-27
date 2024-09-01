import React, { useState } from 'react';
import { Button } from '@radix-ui/themes';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../api/user';
import Header from '../../components/Header/Header';
import styles from './CreateUser.module.css';

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
      const result = await register(user.fullName, user.email, user.password);

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
    <div className={styles.createUser}>
      <Header linkTo="/homepage" />
      <div className={styles.outerContainer}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
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
            <label key={name} className={styles.formSection}>
              <p className={styles.label}>{label}</p>
              <input
                type={type}
                name={name}
                value={user[name as keyof User]}
                onChange={handleChange}
                placeholder={placeholder}
                className={styles.formInput}
                required
              />
            </label>
          ))}
          <Button className={styles.submitButton}>Create User</Button>
          {errorMessage && <div className="errorMessage">{errorMessage}</div>}
          {success && <p className="successMessage">Successfully registered</p>}
          <br />
          <div className={styles.loginPrompt}>Already have an account?</div>

          <Link to="/login" className={styles.loginLink}>
            <Button className={styles.loginButton}>Login</Button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
