import React from 'react';
import { useTranslation } from 'react-i18next';
import IphoneImg from 'assets/images/iphone.svg';
import { ReactComponent as Logo } from 'assets/images/icons/logo.svg';
import { ReactComponent as AppStore } from 'assets/images/app-store.svg';
import { ReactComponent as GooglePlay } from 'assets/images/google-play.svg';

import styles from './index.module.scss';

const Layout = ({ children }: { children: React.ReactElement }) => {
  const { t } = useTranslation();

  return (
    <div className='d-flex w-100 min-vh-100'>
      <div className={styles.leftBanner}>
        <div className={styles.circleBg}></div>
        <h1>{t('common.bannerTitle')}</h1>
        <div>
          <div className='d-flex'>
            <div className={styles.backIphone}>
              <img src={IphoneImg} alt='iphone' />
            </div>
            <div className={styles.backIphone}>
              <img src={IphoneImg} alt='iphone' />
            </div>
          </div>
          <div className={styles.firstIphone}>
            <img src={IphoneImg} alt='iphone' />
          </div>
        </div>
      </div>
      <div className={styles.rightForm}>
        <div className={styles.logo}>
          <Logo />
          <h2>Capzul</h2>
        </div>
        {children}
        <div className={styles.appLink}>
          <a href='#'>
            <AppStore />
          </a>
          <a href='#'>
            <GooglePlay />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Layout;
