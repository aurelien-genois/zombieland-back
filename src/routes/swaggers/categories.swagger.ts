/**
 * @openapi
 * tags:
 *   - name: Categories
 *     description: Endpoints liés à la gestion des catégories.
 */

/************************ PUBLIC ROUTES ************************/

/**
 * @openapi
 * /api/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Récupère toutes les catégories
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: offset
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - in: query
 *         name: orderBy
 *         required: false
 *         schema:
 *           type: string
 *           enum: [name:asc, name:desc]
 *           default: name:asc
 *     responses:
 *       '200':
 *         description: Liste des catégories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       color:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                 totalFound:
 *                   type: number
 *       '404':
 *         description: Catégorie non trouvée
 *       '500':
 *         description: Erreur serveur
 */

/************************ ADMIN ROUTES ************************/

/**
 * @openapi
 * /api/categories/{id}:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Récupère une catégorie par son ID (admin uniquement)
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
 *         description: Catégorie trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 color:
 *                   type: string
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
 *         description: Catégorie non trouvée
 *       '500':
 *         description: Erreur serveur
 *   patch:
 *     tags:
 *       - Categories
 *     summary: Met à jour une catégorie (admin uniquement)
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
 *             properties:
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Catégorie mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 color:
 *                   type: string
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
 *         description: Catégorie non trouvée
 *       '500':
 *         description: Erreur serveur
 *   delete:
 *     tags:
 *       - Categories
 *     summary: Supprime une catégorie (admin uniquement)
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
 *         description: Catégorie supprimée avec succès
 *       '401':
 *         description: Non authentifié
 *       '403':
 *         description: Accès interdit (rôle admin requis)
 *       '404':
 *         description: Catégorie non trouvée
 *       '409':
 *         description: Une activité utilise cette catégorie
 *       '500':
 *         description: Erreur serveur
 */

/**
 * @openapi
 * /api/categories:
 *   post:
 *     tags:
 *       - Categories
 *     summary: Crée une catégorie (admin uniquement)
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Catégorie créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 color:
 *                   type: string
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
 *         description: Catégorie non trouvée
 *       '500':
 *         description: Erreur serveur
 */
