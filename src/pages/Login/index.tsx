import React, { useState, useContext, useEffect } from 'react';
import clx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Button, Form, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { login, signInWighGoogle } from 'services/firebase';
import Layout from 'components/layout';
import useStorage from 'hooks/useStorage';
import { TloginForm } from 'types';
import { AuthContext } from 'App';
import googleIcon from 'assets/images/icons/google.png';

import styles from './index.module.scss';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState<string | null>(null);
  const { auth } = useContext(AuthContext);
  const [emailVal, setEmail, removeEmail] = useStorage<string>('email', '');
  const [passwordVal, setPassword, removePassword] = useStorage<string>(
    'password',
    ''
  );

  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: emailVal,
      password: passwordVal,
      check: Boolean(emailVal || passwordVal),
    },
    mode: 'onChange',
  });

  const handleLogin = async (data: TloginForm & { check: boolean }) => {
    setIsLoading(true);
    if (data.check) {
      setEmail(data.email);
      setPassword(data.password);
    } else {
      removeEmail();
      removePassword();
    }
    try {
      await login({
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('user-not-found')) {
          setLoginErrorMsg(t('errorMsg.userNotFound'));
        } else {
          setLoginErrorMsg(t('errorMsg.wrongPassword'));
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      await signInWighGoogle();
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  useEffect(() => {
    if (auth) navigate('/');
  }, [auth, navigate]);

  return (
    <Layout>
      <div className={styles.login}>
        <div className={styles.formTitle}>
          <div className={styles.loginTitle}>{t('login.title')}</div>
          <small>For business, band or celebrity.</small>
        </div>
        {loginErrorMsg && (
          <div className='text-center text-danger'>{loginErrorMsg}</div>
        )}
        <Form className={styles.loginForm}>
          <Form.Group className='mb-3'>
            <Form.Label>{t('common.email')}</Form.Label>
            <Form.Control
              type='email'
              className={clx({ [styles.invalid]: errors?.email })}
              {...register('email', {
                required: true,
                pattern: {
                  value: /^[^@]+@[^@]+\.[^@]+$/,
                  message: t('errorMsg.email'),
                },
              })}
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>{t('common.password')}</Form.Label>
            <Form.Control
              type='password'
              className={clx({ [styles.invalid]: errors?.password })}
              {...register('password', {
                required: true,
                minLength: 6,
              })}
            />
          </Form.Group>
          <div className='d-flex justify-content-between'>
            <Form.Group className='mb-3' controlId='checkbox'>
              <Form.Check
                type='checkbox'
                label={t('login.remamberMe')}
                {...register('check')}
              />
            </Form.Group>
            <a href='https://www.google.com/' className='text-primary'>
              {t('login.forgotPassword')}?
            </a>
          </div>
          <div className={styles.actionBtns}>
            <Button
              onClick={handleSubmit(handleLogin)}
              disabled={!isValid || isLoading}>
              {t('login.title')}
              {isLoading && (
                <Spinner animation='border' size='sm' className='ms-3' />
              )}
            </Button>
            <Button
              variant='secondary'
              onClick={handleSignInWithGoogle}
              disabled={isLoading}>
              <img src={googleIcon} alt='google-icon' className='me-2' />
              {t('login.google')}
            </Button>
          </div>
        </Form>
        <div className='text-center mt-4 mt-xl-5'>
          {t('login.dontHaveAccount')}{' '}
          <Link to='/sign-up'> {t('signUp.title')}</Link>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
