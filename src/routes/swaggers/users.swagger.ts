/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: Endpoints liés à la gestion des utilisateurs.
 */

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Récupère tous les utilisateurs (admin uniquement)
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   firstname:
 *                     type: string
 *                   lastname:
 *                     type: string
 *                   email:
 *                     type: string
 *                   is_active:
 *                     type: boolean
 *                   phone:
 *                     type: string
 *                   birthday:
 *                     type: string
 *                     format: date
 *       '401':
 *         description: Non authentifié
 *       '403':
 *         description: Accès interdit (rôle admin requis)
 */

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Récupère un utilisateur par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 firstname:
 *                   type: string
 *                 lastname:
 *                   type: string
 *                 email:
 *                   type: string
 *                 is_active:
 *                   type: boolean
 *                 phone:
 *                   type: string
 *                 birthday:
 *                   type: string
 *                   format: date
 *       '404':
 *         description: Utilisateur non trouvé
 *       '500':
 *         description: Erreur interne du serveur
 */
