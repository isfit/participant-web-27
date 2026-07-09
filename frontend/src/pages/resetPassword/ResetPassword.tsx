import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@radix-ui/themes';
import Header from '../../components/Header/Header';
import CustomToast from '../applicationForm/toast';
import { resetPassword } from '../../api/auth';
import styles from '../login/Login.module.css';

interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [data, setData] = useState<ResetPasswordData>({
    password: '',
    confirmPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();
  const [toastOpen, setToastOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setErrorMessage('Invalid reset link');
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
    setErrorMessage(undefined);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!token) {
      setErrorMessage('Invalid reset link');
      return;
    }

    if (data.password !== data.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (data.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword(token, data.password);
      setSuccessMessage('Password reset successful!');
      setToastOpen(true);
      setErrorMessage(undefined);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.login}>
      <Header linkTo="/homepage" />
      <div className={styles.outerContainer}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Reset Password</h2>

          {[
            {
              label: 'New Password',
              name: 'password',
              type: 'password',
              placeholder: 'At least 8 characters',
            },
            {
              label: 'Confirm Password',
              name: 'confirmPassword',
              type: 'password',
              placeholder: 'Re-enter password',
            },
          ].map(({ label, name, type, placeholder }) => (
            <label key={name} className={styles.formSection}>
              <p className={styles.label}>{label}</p>
              <input
                type={type}
                name={name}
                value={data[name as keyof ResetPasswordData]}
                onChange={handleChange}
                placeholder={placeholder}
                className={styles.formInput}
                required
              />
            </label>
          ))}

          <Button 
            className={styles.submitButton}
            disabled={loading || !token}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>

          {errorMessage && (
            <div style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
              {errorMessage}
            </div>
          )}

          <Button
            onClick={() => navigate('/login')}
            style={{ marginTop: '10px', width: '100%' }}
            variant="outline"
          >
            Back to Login
          </Button>
        </form>

        <CustomToast
          open={toastOpen}
          setOpen={setToastOpen}
          title={successMessage || 'Success'}
          message={[successMessage || 'Success']}
        />
      </div>
    </div>
  );
};

export default ResetPassword;
