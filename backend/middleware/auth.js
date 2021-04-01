const jwt = require('jsonwebtoken'); // Package qui permet de créer et vérifier les tokens d'identification

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // On extraie le token du header avec la fonction split pour récupérer tout après l'espace dans le header
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // On utilise la fonction verify pour décoder le token. Si celui-ci n'est pas valide, une erreur sera générée 
    const userId = decodedToken.userId; // On extraie l'ID utilisateur du token
    if (req.body.userId && req.body.userId !== userId) { // Si la demande contient un ID utilisateur, on le compare à celui extrait du token. S'ils sont différents, cela génère une erreur
      throw 'Invalid user ID';
    } else { // Dans le cas contraire, tout fonctionne, l'utilisateur est authentifié. Nous passons l'exécution à l'aide de la fonction next
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};