/**
 * @openapi
 * tags:
 *   name: Auth
 *   description: Endpoints liés à l'authentification de l'utilisateur.
 */

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Inscription d'un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - confirmation
 *               - firstname
 *               - lastname
 *               - birthday
 *             properties:
 *               lastname:
 *                 type: string
 *               firstname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmation:
 *                 type: string
 *               phone:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *       400:
 *         description: Données invalides ou mot de passe non confirmé
 *       409:
 *         description: Email déjà utilisé
 */

/**
 * @openapi
 * /api/auth/email-confirmation:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Vérification de l'adresse email via token
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email successfully verified.
 *       400:
 *         description: Token invalide ou expiré
 */

/**
 * @openapi
 * /api/auth/resend-email-confirmation:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Renvoyer l'email de confirmation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification email sent successfully.
 *       400:
 *         description: Compte déjà actif
 *       404:
 *         description: Aucun utilisateur trouvé avec cet email
 */

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Connexion utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie, tokens retournés
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Déconnexion de l'utilisateur
 *     responses:
 *       200:
 *         description: Déconnexion réussie, cookies supprimés
 */

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Rafraîchir le token d'accès avec le refresh token
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token (peut aussi être envoyé via cookie)
 *     responses:
 *       200:
 *         description: Nouveaux tokens retournés
 *       401:
 *         description: Refresh token manquant, invalide ou expiré
 *       500:
 *         description: Erreur interne du serveur
 */

/**
 * @openapi
 * /api/auth/forgot-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Demande de réinitialisation du mot de passe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email de réinitialisation envoyé.
 *       400:
 *         description: Email invalide ou non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */

/**
 * @openapi
 * /api/auth/reset-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Réinitialiser le mot de passe avec un token
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *               - confirmation
 *             properties:
 *               newPassword:
 *                 type: string
 *               confirmation:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé avec succès.
 *       400:
 *         description: Token invalide, expiré ou données invalides.
 *       404:
 *         description: Aucun utilisateur trouvé avec ce token.
 */
