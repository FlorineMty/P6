require('dotenv').config(); // Permet de séparer les informations de connexion du code source à l'aide de variables d'environnement

const http = require('http'); // Import du package HTTP
const app = require('./app'); // Import de app pour l'utilisation de l'application sur le serveur

// Fonction qui renvoie un port valide que ce soit une chaine de caractère ou un numéro
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Par défaut l'écoute se fera sur le port 3000
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Recherche les différentes erreurs et les gère de manière appropriée. 
// La fonction est ensuite enregistrée dans le serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};
// Création d'un serveur avec une constante pour gérer les requêtes et les réponses
const server = http.createServer(app);
// Aperçu des événements sur la console avec lancement du server 
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('So Pekocko Listening on ' + bind);
});

server.listen(port); // Le serveur écoute le port définit au dessus
