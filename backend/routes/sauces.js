const express = require('express');
const router = express.Router(); // Création d'un routeur express

const auth = require('../middleware/auth'); // import du middleware auth pour la configuratiration d'autification avec JsonWebToken
const multer = require('../middleware/multer-config'); // Import du middleware multer pour la gestion des images

const saucesCtrl = require('../controllers/sauces'); // Import du controller sauces

// Création des différentes routes de l'API en précisant dans un ordre précis les middlewares et les controllers
router.get('/', auth, saucesCtrl.getAllSauces);
router.post('/', auth, multer, saucesCtrl.createSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.post('/:id/like', auth, saucesCtrl.likeSauce);

module.exports = router;