const { https } = require('firebase-functions/v1');
const axios = require('axios');
const cors = require('cors')({
  origin: ['http://localhost:3000'], // Restrict origins
});

/**
 * Verifies a reCAPTCHA token using the Google reCAPTCHA API.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} The verification result.
 */
exports.verifyRecaptchaResponse = https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { captchaToken } = req.body;

      if (!captchaToken) {
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
      return res.status(200).json({ success: true, score, message: 'reCAPTCHA verification successful' });
    } catch (error) {
      console.error('reCAPTCHA verification error:', error.message);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
});
