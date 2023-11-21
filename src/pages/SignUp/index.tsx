import React, { useContext, useEffect, useRef, useState } from 'react';
import clx from 'classnames';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Layout from 'components/layout';
import useStorage from 'hooks/useStorage';
import {
  signInWighGoogle,
  signUpAndUpdateUserInfo,
  storage,
} from 'services/firebase';
import { AuthContext } from 'App';
import googleIcon from 'assets/images/icons/google.png';

import styles from './index.module.scss';
import { TsignUpForm } from 'types';

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [signUpErrorMsg, setSignUpErrorMsg] = useState<string | null>(null);
  const [avatarImg, setAvatarImg] = useState<File | null>(null);
  const firstLoad = useRef(true);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const { auth, setAuth } = useContext(AuthContext);
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
    watch,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: emailVal,
      password: passwordVal,
      confirmPassword: '',
      rememberCheck: Boolean(emailVal || passwordVal),
      termCheck: false,
    },
    mode: 'onChange',
  });

  const handleSignUp = async (
    data: TsignUpForm & { rememberCheck: boolean }
  ) => {
    firstLoad.current = false;
    const { firstName, lastName, email, password, rememberCheck } = data;
    let photoURL = '';
    setIsLoading(true);
    if (avatarImg) {
      const imgRef = ref(
        storage,
        `user-avatar/${avatarImg.name}_${Date.now()}`
      );
      await uploadBytes(imgRef, avatarImg);
      photoURL = await getDownloadURL(imgRef);
    }
    if (rememberCheck) {
      setEmail(email);
      setPassword(password);
    } else {
      removeEmail();
      removePassword();
    }
    try {
      const user = await signUpAndUpdateUserInfo({
        firstName,
        lastName,
        email,
        password,
        photoURL,
      });
      setAuth(user);
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('email-already-in-use')) {
          setSignUpErrorMsg(t('errorMsg.emailAlreadyExist'));
        } else {
          setSignUpErrorMsg(error.message);
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

  const handleSetAvatarImg = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setAvatarImg(event.target.files[0]);
  };

  useEffect(() => {
    if (auth && firstLoad.current) navigate('/');
  }, [auth, navigate]);

  return (
    <Layout>
      <div className={styles.login}>
        <div className={styles.formTitle}>
          <div className={styles.loginTitle}>{t('signUp.title')}</div>
          <small>For business, band or celebrity.</small>
        </div>
        {signUpErrorMsg && (
          <div className='text-center text-danger'>{signUpErrorMsg}</div>
        )}
        <Form className={styles.loginForm}>
          <Row>
            <Col md={6}>
              <Form.Group className='mb-3'>
                <Form.Label>{t('signUp.firstName')}</Form.Label>
                <Form.Control type='text' {...register('firstName')} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3'>
                <Form.Label>{t('signUp.lastName')}</Form.Label>
                <Form.Control type='text' {...register('lastName')} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className='mb-3'>
                <Form.Label>
                  {t('common.email')} <span className='text-danger'>*</span>
                </Form.Label>
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
                {errors.email && (
                  <small className='text-danger'>{errors.email.message}</small>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3'>
                <Form.Label>{t('signUp.phoneNumber')}</Form.Label>
                <Form.Control type='tel' {...register('phoneNumber')} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className='mb-3'>
                <Form.Label>
                  {t('common.password')} <span className='text-danger'>*</span>
                </Form.Label>
                <Form.Control
                  type='password'
                  className={clx({ [styles.invalid]: errors?.password })}
                  {...register('password', {
                    required: true,
                    minLength: {
                      value: 6,
                      message: t('errorMsg.password'),
                    },
                  })}
                />
                {errors.password && (
                  <small className='text-danger'>
                    {errors.password.message}
                  </small>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3'>
                <Form.Label>
                  {t('signUp.confirmPassword')}{' '}
                  <span className='text-danger'>*</span>
                </Form.Label>
                <Form.Control
                  type='password'
                  className={clx({ [styles.invalid]: errors?.confirmPassword })}
                  {...register('confirmPassword', {
                    required: true,
                    validate: (val) => {
                      return (
                        val === watch('password') ||
                        t('errorMsg.confirmPassword')
                      );
                    },
                  })}
                />
                {errors.confirmPassword && (
                  <small className='text-danger'>
                    {errors.confirmPassword.message}
                  </small>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row className='mb-3 align-items-center'>
            <Col>
              <input
                className='d-none'
                type='file'
                ref={avatarInputRef}
                accept='image/*'
                onChange={(event) => handleSetAvatarImg(event)}
              />
              <Button onClick={() => avatarInputRef.current?.click()}>
                {t('signUp.uploadAvatarImg')}
              </Button>
            </Col>
            {avatarImg && (
              <Col>
                <img
                  src={URL.createObjectURL(avatarImg)}
                  alt={avatarImg.name}
                  className={styles.previewAvatar}
                />
              </Col>
            )}
          </Row>
          <div className='d-flex justify-content-between'>
            <Form.Group className='mb-3' controlId='rememberCheckbox'>
              <Form.Check
                type='checkbox'
                {...register('rememberCheck')}
                label={t('login.remamberMe')}
              />
            </Form.Group>
            <a href='https://www.google.com/' className='text-primary'>
              {t('login.forgotPassword')}?
            </a>
          </div>
          <Form.Group className='mb-3' controlId='termCheckbox'>
            <Form.Check
              type='checkbox'
              {...register('termCheck', { required: true })}
              label={
                <span>
                  I agree to all the{' '}
                  <a
                    href='https://www.google.com/'
                    target='_blank'
                    rel='noopener noreferrer'>
                    Terms
                  </a>{' '}
                  and{' '}
                  <a
                    href='https://www.google.com/'
                    target='_blank'
                    rel='noopener noreferrer'>
                    Privacy policy
                  </a>
                </span>
              }
            />
          </Form.Group>
          <div className={styles.actionBtns}>
            <Button
              onClick={handleSubmit(handleSignUp)}
              disabled={!isValid || isLoading}>
              {t('signUp.title')}
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
        <div className='text-center my-4'>
          {t('signUp.alreadyHaveAccount')}
          <Link to='/login' className='ps-1'>
            {t('login.title')}
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default SignUp;
