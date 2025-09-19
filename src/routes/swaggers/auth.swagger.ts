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
