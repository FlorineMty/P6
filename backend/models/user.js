const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // plugin qui vérifie que l'email est unique

// Création du schéma de donné lié à l'utilisateur
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Application du plugin au schéma avant d'en faire un modèle
userSchema.plugin(uniqueValidator);

// Export du schéma en tant que modèle Mongoose appelé « User »
module.exports = mongoose.model('User', userSchema);