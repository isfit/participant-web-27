import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@radix-ui/themes';
import { useAuth } from '../../context/AuthenticationContext';
import Header from '../../components/Header/Header';
import styles from './Login.module.css';

interface User {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const [user, setUser] = useState<User>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
    setErrorMessage(undefined);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Handle login logic here
    console.log(
      `Logging in with email: ${user.email} and password: ${user.password}`,
    );

    await login(user.email, user.password)
      .then((success) => {
        if (success) {
          navigate('/homepage');
        } else {
          setErrorMessage('Invalid email or password');
        }
      })
      .catch((error) => {
        setErrorMessage('Something went wrong. Please try again later.');
      });
  };

  return (
    <div className={styles.login}>
      <div className={styles.outerContainer}>
        <Header linkTo="/homepage" />
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          {[
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
              />
            </label>
          ))}
          <Button className={styles.submitButton}>Login</Button>
          {errorMessage && <div className="errorMessage">{errorMessage}</div>}
          <br />
          <div className={styles.createUserPrompt}>Don't have an account?</div>

          <Link to="/createUser" className={styles.createUserLink}>
            <Button className={styles.createUserButton}>Create User</Button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
