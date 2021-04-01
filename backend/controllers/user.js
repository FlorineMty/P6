const bcrypt = require('bcrypt'); // Package de chiffrement
const jwt = require('jsonwebtoken'); // Package qui permet de créer et vérifier les tokens d'identification
const User = require('../models/User');


exports.signup = (req, res, next) => {
  try {
    bcrypt.hash(req.body.password, 10) // On appelle la fonction de hachage de bcrypt du mot de passe en lui demandant de le "saler" 10 fois
      .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        console.log(user);
        user.save()
          .then(() => res.status(201).json({ message: 'User created !' })) // Nouvel utilisateur créé et enregistré dans la base de données
          .catch(error => {
            console.log('error', error)
            res.status(400).json({ error })
          })
      })
      .catch(error => res.status(500).json({ error}));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Connection failed'})
  }
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // Modèle Mongoose pour vérifier que l'e-mail entré par l'utilisateur correspond à un utilisateur existant de la base de données
      .then(user => {
        if (!user) { // Dans le cas contraire, cela renvoie une erreur
          return res.status(401).json({ error: 'User doesnt exist !' });
        }
        bcrypt.compare(req.body.password, user.password) // Utilisation de la fonction compare de bcrypt pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données
          .then(valid => {
            if (!valid) { // S'ils ne correspondent pas, cela renvoir un message d'erreur
              return res.status(401).json({ error: 'Incorrect password !' });
            }
            res.status(200).json({ // S'ils correspondent, les informations d'identification d'utilisateur sont valides. Cela renvoie une réponse 200 contenant l'ID utilisateur et un token
                userId: user._id,
                token: jwt.sign( // Utilisation de la fonction sign de jsonwebtoken pour encoder un nouveau token
                  { userId: user._id },
                  'RANDOM_TOKEN_SECRET', // Chaîne secrète de développement temporaire pour encoder le token (à remplacer par une chaîne aléatoire beaucoup plus longue pour la production)
                  { expiresIn: 60 * 60 * 24 * 30 } // La durée de validité du token est de 1 mois
                )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };
