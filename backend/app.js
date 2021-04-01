const { DB_URL, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;
const connect_url = `mmongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_URL}/${DB_NAME}?retryWrites=true&w=majority`;

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const path = require('path');

mongoose.connect(connect_url,
  { useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(express.json());
app.use(bodyParser.json());
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', (req, res, next) => {
 console.log("Route ok")
 next() 
}, userRoutes);
// app.use('/api/auth', userRoutes); 
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;