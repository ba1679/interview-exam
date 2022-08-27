import React, { useContext } from 'react';
import clx from 'classnames';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import { signOutFromFirebase } from 'services/firebase';
import { AuthContext } from 'App';

import styles from './index.module.scss';

const Home = () => {
  const { t } = useTranslation();
  const { auth } = useContext(AuthContext);
  return (
    <div className={clx('bg-primary', styles.homeBg)}>
      <div className='d-flex'>
        <div className={clx('d-flex align-items-center ms-auto gap-2', styles.topBar)}>
          {auth?.photoURL && <img src={auth.photoURL} alt='user_avatar' className={styles.userAvatar} />}
          <Button className={styles.signOutBtn} variant='light' onClick={signOutFromFirebase}>
            {t('common.signOut')}
          </Button>
        </div>
      </div>
      <div className='d-flex justify-content-center align-items-center'>
        <div className={styles.homeCircle}>{t('home.loginSuccessfully')}</div>
      </div>
    </div>
  );
};

export default Home;
