const { https } = require('firebase-functions/v1');
const axios = require('axios');

/**
 * Verifies a reCAPTCHA token using the Google reCAPTCHA API.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} The verification result.
 */
exports.verifyRecaptcha = https.onRequest(async (req, res) => {
  console.log('verifyRecaptcha function called. Request received.');

  try {
    const { captchaToken } = req.body;

    if (!captchaToken) {
      console.log('Captcha token is missing from the request.');
      return res.status(400).json({ success: false, message: 'Captcha token is missing' });
    }

    const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: captchaToken,
      },
    });

    const { success, score, 'error-codes': errorCodes } = response.data;

    if (!success) {
      console.log('reCAPTCHA verification failed:', errorCodes);
      return res.status(403).json({
        success: false,
        message: `reCAPTCHA verification failed: ${errorCodes?.join(', ') || 'Unknown error'}`,
      });
    }

    console.log('reCAPTCHA verification successful. Score:', score);
    return res.status(200).json({ success: true, score });
  } catch (error) {
    console.error('reCAPTCHA verification error:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
