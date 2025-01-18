const { https } = require('firebase-functions/v1');
const axios = require('axios');
const functions = require('firebase-functions');
/**
 * Verifies a reCAPTCHA token using the Google reCAPTCHA API.
 *
 * @param {Object} data - The data passed from the client.
 * @param {string} data.captchaToken - The reCAPTCHA token to verify.
 * @param {Object} context - The context object (contains Firebase Auth info if authenticated).
 * @returns {Object} The verification result.
 */
exports.recaptchaVerifier = https.onCall(async (data, context) => {
  try {
    const secretKey = functions.config().recaptcha.secret_key;

    const { captchaToken } = data;
    if (!captchaToken) {
      throw new https.HttpsError('invalid-argument', 'Captcha token is missing.');
    }

    const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret: secretKey,
        response: captchaToken,
      },
    });
    const { success, score, 'error-codes': errorCodes } = response.data;

    if (!success) {
      console.error('reCAPTCHA verification failed:', errorCodes);
      throw new https.HttpsError(
        'permission-denied',
        `reCAPTCHA verification failed: ${errorCodes?.join(', ') || 'Unknown error'}`
      );
    }

    console.log('reCAPTCHA verification successful. Score:', score);
    return { success: true, score, message: 'reCAPTCHA verification successful' };
  } catch (error) {
    console.error('reCAPTCHA verification error:', error.message);
    throw new https.HttpsError('internal', 'An error occurred while verifying the reCAPTCHA token.');
  }
});
