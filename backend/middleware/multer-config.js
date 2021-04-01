const multer = require('multer'); // Package qui nous permet de gérer les fichiers entrants dans les requêtes HTTP

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  // La fonction destination indique à multer d'enregistrer les fichiers dans le dossier images 
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // La fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now() comme nom de fichier
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype]; // Constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée 
    callback(null, name + Date.now() + '.' + extension);
  }
});

// Export de l'élément multer entièrement configuré, en lui passant la constante storage et en indiquant qu'uniquement les téléchargements de fichiers image seront générés
module.exports = multer({storage: storage}).single('image');