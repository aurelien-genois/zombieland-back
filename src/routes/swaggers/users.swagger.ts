/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: Endpoints liés à la gestion des utilisateurs.
 */

/************************ MEMBER ROUTES ************************/

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Récupère les informations de l'utilisateur connecté
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Informations de l'utilisateur connecté
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
 *                 role_id:
 *                   type: integer
 *                 last_login:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                 role:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *       '401':
 *         description: Non authentifié
 *       '404':
 *         description: Utilisateur non trouvé
 */

/**
 * @openapi
 * /api/users/change-password:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Met à jour le mot de passe de l'utilisateur connecté
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *               - confirmation
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmation:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Password updated successfully
 *       '401':
 *         description: Ancien mot de passe incorrect ou non authentifié
 *       '404':
 *         description: Utilisateur non trouvé
 */

/**
 * @openapi
 * /api/users:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Met à jour les informations de l'utilisateur connecté
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *     responses:
 *       '200':
 *         description: Informations mises à jour avec succès
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
 *                 phone:
 *                   type: string
 *                 birthday:
 *                   type: string
 *                   format: date
 *       '401':
 *         description: Non authentifié
 *       '409':
 *         description: Email déjà utilisé
 *       '404':
 *         description: Utilisateur non trouvé
 */

/**
 * @openapi
 * /api/users:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Supprime le compte de l'utilisateur connecté
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '204':
 *         description: Compte supprimé avec succès
 *       '401':
 *         description: Non authentifié
 */

/************************ ADMIN ROUTES ************************/

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
 *                   password:
 *                     type: string
 *                   is_active:
 *                     type: boolean
 *                   phone:
 *                     type: string
 *                   birthday:
 *                     type: string
 *                     format: date
 *                   role_id:
 *                     type: integer
 *                   last_login:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
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
 *     summary: Récupère un utilisateur par son ID (Admin uniquement)
 *     security:
 *       - cookieAuth: []
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
 *                 password:
 *                   type: string
 *                 is_active:
 *                   type: boolean
 *                 phone:
 *                   type: string
 *                 birthday:
 *                   type: string
 *                   format: date
 *                 role_id:
 *                   type: integer
 *                 last_login:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       '401':
 *         description: Non authentifié
 *       '403':
 *         description: Accès interdit (rôle admin requis)
 *       '404':
 *         description: Utilisateur non trouvé
 */

/**
 * @openapi
 * /api/users/{id}/role:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Met à jour le rôle d'un utilisateur (Admin uniquement)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, member]
 *     responses:
 *       '200':
 *         description: Rôle mis à jour avec succès
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
 *                 role:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *       '401':
 *         description: Non authentifié
 *       '403':
 *         description: Accès interdit (rôle admin requis)
 *       '404':
 *         description: Utilisateur non trouvé
 *       '409':
 *         description: Rôle invalide
 */

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Supprime un utilisateur (Admin uniquement)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Utilisateur supprimé avec succès
 *       '401':
 *         description: Non authentifié
 *       '403':
 *         description: Accès interdit (rôle admin requis)
 *       '404':
 *         description: Utilisateur non trouvé
 */
