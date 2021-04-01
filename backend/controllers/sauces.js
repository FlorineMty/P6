// Récupération du modèle sauce puis module fs 'file system' de Node qui est un gestionnaire de fichiers
const Sauce = require('../models/sauce');
const fs = require('fs');

// Création d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
  // Transformation des données provenant du frontend en objet utilisable puis stockage dans une variable
  const sauceObject = JSON.parse(req.body.sauce);
  console.log(sauceObject);
  // Suppression de l'id généré automatiquement car id de la sauce est créé dans la base MongoDB lors de la création
  delete sauceObject._id;
  // Création d'une instance de sauce en passant u n objet JS qui contient les informations du corps de la requête
  const sauce = new Sauce({
    ...sauceObject,
    // Résoudre l'URL complète de l'image à travers plusieurs segments
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce.save() // sauce sauvegardée dans la base donnée
    .then(() => res.status(201).json({ message: 'Sauce saved !' }))
    .catch(error => res.status(400).json({ error }));
};

// Récupération d'une sauce selon son id
exports.getOneSauce = (req, res, next) => {
  // Utilisation de la méthode findOne() dans notre modèle Sauce pour trouver la sauce unique ayant le même _id que le paramètre de la requête 
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  // Utilisation de la méthode updateOne() dans modèle Sauce. Cela permet de mettre à jour la sauce qui correspond à l'objet que nous passons comme premier argument. 
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce updated successfully !' }))
    .catch(error => res.status(400).json({ error }));
};

// Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      // Pour séparer le nom de fichier, utilisation du fait de savoir que l'URL d'image contient un segment /images/ 
      const filename = sauce.imageUrl.split('/images/')[1];
      // Utiolisation de la fonction unlink du package fs pour supprimer le fichier, en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé. 
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id }) // La méthode deleteOne fonctionne comme findOne et updateOne, on passe un objet correspondant au document à supprimer.
          .then(() => res.status(200).json({ message: 'Sauce deleted !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// Récuperation de toutes lessauces de la base Mongo
exports.getAllSauces = (req, res, next) => {
  // Utilisation de la méthode find() dans le modèle Mongoose afin de renvoyer un tableau contenant toutes les sauces dans notre base de données. 
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.likeSauce = (req, res, next) => {
  const like = req.body.like
  const userId = req.body.userId
  const sauceId = req.params.id

  switch (like) {
    case 0: // // Si un utilisateur veut retirer un like ou un dislike
      Sauce.findOne({ _id: sauceId })
        .then((sauce => {
          const usersLikedArray = sauce.usersLiked;
          const usersDislikedArray = sauce.usersDisliked;

          if (usersLikedArray.includes(userId)) { // La méthode includes() permet de déterminer si le tableau usersLiked contient déjà le userId, si oui alors le like peut être retiré ainsi que l'userId
            Sauce.updateOne(
              { _id: sauceId },
              { $inc: { likes: -1 }, $pull: { usersLiked: userId } }
            )
              .then((sauce) => res.status(200).json({ message: "You don't like this sauce anymore!" }))
              .catch(error => res.status(400).json({ error }));
          }
          if (usersDislikedArray.includes(userId)) { // La méthode includes() permet de déterminer si le tableau usersDisliked contient déjà le userId, si oui alors le dislike peut être retiré ainsi que l'userId
            Sauce.updateOne(
              { _id: sauceId },
              { $inc: { dislikes: -1 }, $pull: { usersLiked: userId } }
            )
              .then((sauce) => res.status(200).json({ message: 'Dislike removed!' }))
              .catch(error => res.status(400).json({ error }));
          }
        }))
        .catch(error => res.status(400).json({ error }));
      break;
    case 1: // Si un utilisateur aime la sauce
      Sauce.updateOne( // On ajoute un like et on push l'userId dans un tableau des UsersLiked
        { _id: sauceId },
        { $inc: { likes: 1 }, $push: { usersLiked: userId } }
      )
        .then((sauce) => res.status(200).json({ message: 'You like this sauce!' }))
        .catch(error => res.status(400).json({ error }));
      break;
    case -1: // Si un utilisateur n'aime pas la sauce
      Sauce.updateOne( // On ajoute un dislike et on push l'userId dans un tableau des UsersDisliked
        { _id: sauceId },
        { $inc: { dislikes: 1 }, $push: { usersLiked: userId } }
      )
        .then((sauce) => res.status(200).json({ message: "You don't like this sauce!" }))
        .catch(error => res.status(400).json({ error }));
      break;
  }
};

