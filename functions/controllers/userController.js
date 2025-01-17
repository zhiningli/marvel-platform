const admin = require('firebase-admin');
const { https } = require('firebase-functions/v1');

/**
 * Creates a new user document in the Firestore collection "users" with the provided data.
 *
 * @async
 * @function signUpUser
 * @param {Object} data - The data object containing the user's information.
 * @param {string} data.email - The email address of the user.
 * @param {string} data.fullName - The full name of the user.
 * @param {string} data.uid - The unique identifier for the user.
 * @param {Object} context - The context object containing information about the authenticated user.
 * @returns {Promise<Object>} A promise that resolves to an object indicating the success of the operation.
 */
exports.signUpUser = https.onCall(async (data, context) => {
  try {
    const { email, fullName, uid } = data;

    if (!email || !fullName || !uid) {
      throw new https.HttpsError(
        'failed-precondition',
        'Please provide all required fields (email, fullName, uid).'
      );
    }

    const userRef = admin.firestore().collection('users').doc(uid);
    const userDoc = {
      id: uid,
      email,
      fullName,
      needsBoarding: true,
    };

    await userRef.set(userDoc);

    return {
      status: 'success',
      message: 'User document created successfully',
    };
  } catch (error) {
    console.error('Error in signUpUser:', error);
    throw new https.HttpsError(
      'internal',
      'An error occurred while creating the user document.'
    );
  }
});
