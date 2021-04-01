const mongoose = require('mongoose');

// création d'un schéma de donné qui contient les champs souhaités pour chaque sauce (obligatoire ou non)
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  usersLiked: { type: [String], required: true },
  usersDisliked: { type: [String], required: true },
});

// Export du schéma en tant que modèle Mongoose appelé « Sauce », le rendant disponible pour notre application
module.exports = mongoose.model('Sauce', sauceSchema);