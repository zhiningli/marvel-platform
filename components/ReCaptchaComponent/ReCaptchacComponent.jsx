import React, { useRef, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const ReCaptchaV3Component = ({ siteKey, action, onVerify }) => {
  const recaptchaRef = useRef(null);

  const executeCaptcha = async () => {
    if (recaptchaRef.current) {
      try {
        const token = await recaptchaRef.current.executeAsync(action);
        if (onVerify) {
          onVerify(token);
        }
      } catch (error) {
        console.error('reCAPTCHA v3 execution failed:', error);
      }
    }
  };

  useEffect(() => {
    executeCaptcha();
  }, []);

  return (
    <ReCAPTCHA
      ref={recaptchaRef}
      sitekey={siteKey} 
      size="invisible"
    />
  );
};

export default ReCaptchaV3Component;
