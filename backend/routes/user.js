const express = require('express');
const router = express.Router(); // Création d'un routeur express

const userCtrl = require('../controllers/user'); // Import du controller user en associant la route à la fonction
console.log(userCtrl);

const passwordVerification = require('../middleware/passwordVerification');

// // Création des différentes routes de l'API en précisant dans un ordre précis les middlewares et les controllers
router.post('/signup', passwordVerification, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;