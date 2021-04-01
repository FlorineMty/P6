// Création d'une variable à partir de propriétés d'object permettant la connexion à MongoDB
const { DB_URL, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env; 
// Créatioon d'une variable du lien permettant l'accès à MongoDB
const connect_url = `mmongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_URL}/${DB_NAME}?retryWrites=true&w=majority`;

const express = require('express'); // Import d'express
const bodyParser = require('body-parser'); // Middleware express qui la demande POST provenant du front-end, puis extrait l'objet JSON de la demande via req.body
const helmet = require("helmet"); // Helmet is a Node.js module that helps in securing HTTP headers. It is implemented in express applications. It sets up various HTTP headers to prevent attacks like Cross-Site-Scripting(XSS), clickjacking, sniffing attacks, etc

const mongoose = require('mongoose'); // Plugin Mongoose pour se connecter à la data base Mongo Db

const saucesRoutes = require('./routes/sauces'); // Import de la route dédiée aux sauces
const userRoutes = require('./routes/user'); // Import de la route dédiée aux utilisateurs
const path = require('path'); // Ce module donne des accès pour tavailler avec les chemins d'images et fichiers

// Connexion à la base de donnée MongoDB avec le fichier .env
mongoose.connect(connect_url,
  { useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express(); // Création application express

// Middleware pour détourner les erreurs CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Accès à l'API depuis n'importe quelle origine
    // Ajoute les headers mentionnés aux requêtes envoyées vers l'API 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // Envoi les requêtes avec les méthodes mentionnées
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(helmet()); 
app.use(bodyParser.json()); // transforme les donnés en un objet JSON
app.use('/images', express.static(path.join(__dirname, 'images'))); // Midleware qui permet de charger les images qui sont dans le dossier correspondant
//app.use(express.json()); // Middleware global de l'application
app.use('/api/sauces', saucesRoutes); // Utilise les routes dédiées aux sauces 
app.use('/api/auth', (req, res, next) => { // Utilise les routes dédiées à l'authentification
 console.log("Route ok")
 next() 
}, userRoutes);
// app.use('/api/auth', userRoutes); 

module.exports = app; // Export de la constante app pour accéder à l'application depsuis les autres fichiers