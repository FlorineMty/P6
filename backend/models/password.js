const passwordValidator = require('password-validator'); // https://www.npmjs.com/package/password-validator
 
// Création du schéma d'un mot de passe fort
const passwordSchema = new passwordValidator();
 
// Ajouter des propriétés
passwordSchema
.is().min(8)                                    // Longueur minimum 8 caractères
.is().max(100)                                  // Longueur maximum 10 caractères
.has().uppercase()                              // Doit avoir des lettres majuscules
.has().lowercase()                              // Doit avoir des lettres minuscules
.has().digits(2)                                // Doit être composé d'au moins 2 chiffres
.has().not().spaces()                           // Pas d'espaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Impossibilité de choisir ces mots de passe

module.exports = passwordSchema;