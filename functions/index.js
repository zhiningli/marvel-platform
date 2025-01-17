require('dotenv').config({ path: '../.env' }); // Ensure this is at the top
const admin = require('firebase-admin');

admin.initializeApp();

const userController = require('./controllers/userController');
const marvelAIController = require('./controllers/marvelAIController');
const reCaptchaController = require('./controllers/recaptchaController');
const { seedDatabase } = require('./cloud_db_seed');

seedDatabase();

/* Migration Scripts */
// const {
// } = require("./migrationScripts/modifyChallengePlayersData");
const migrationScripts = {};

module.exports = {
  /* Authenticaition */
  signUpUser: userController.signUpUser,
  recaptchaVerifier: reCaptchaController.verifyRecaptcha,

  /* Marvel AI */
  chat: marvelAIController.chat,
  createChatSession: marvelAIController.createChatSession,
  /* Migration Scripts - For running  */
  ...migrationScripts,
};


