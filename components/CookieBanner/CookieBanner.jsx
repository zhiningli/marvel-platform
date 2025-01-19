import React, { useState } from 'react';
import CookieBanner from 'react-cookie-banner';
import styles from './CookieBanner.styles';

const CookieBannerBox = () => {
  const [isVisible, setIsVisible] = useState(true); 

  const handleAccept = () => {
    console.log('Cookies accepted');
    document.cookie = 'user-has-accepted-cookies=true; path=/; max-age=31536000'; 
    setIsVisible(false);
  };

  const handleDecline = () => {
    console.log('Cookies declined');
    document.cookie = 'user-has-accepted-cookies=false; path=/; max-age=31536000';
    setIsVisible(false); 
  };

  if (!isVisible) return null; 

  return (
    <CookieBanner
      message={
        <div style={styles.cookieBoxStyle}>
          <span style={styles.cookieText}>
            This website uses cookies to ensure you get the best experience. 
        </span>
          <div style={styles.buttonGroupStyle}>
            <button style={styles.buttonStyle} onClick={handleAccept}>
              Accept
            </button>
            <button style={styles.buttonStyle} onClick={handleDecline}>
              Reject
            </button>
          </div>
        </div>
      }
      styles={{
        banner: styles.cookieConsentContainer,
        button: { display: 'none' }, 
      }}
      disableStyle={false}
      cookie="user-has-accepted-cookies"
    />
  );
};

export default CookieBannerBox;
