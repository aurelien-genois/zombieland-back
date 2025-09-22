/**
 * @openapi
 * tags:
 *   - name: Activities
 *     description: Endpoints liés à la gestion des activités.
 */

/************************ PUBLIC ROUTES ************************/

/**
 * @openapi
 * /api/activities:
 *   get:
 *     tags:
 *       - Activities
 *     summary: Récupère toutes les activités publiées
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: string
 *           enum: [name:asc, name:desc]
 *           default: name:asc
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *       - in: query
 *         name: age_group
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 3
 *       - in: query
 *         name: high_intensity
 *         required: false
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: disabled_access
 *         required: false
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Liste des activités publiées
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   slug:
 *                     type: string
 *                   slogan:
 *                     type: string
 *                   description:
 *                     type: string
 *                   minimum_age:
 *                     type: integer
 *                   duration:
 *                     type: string
 *                   disabled_access:
 *                     type: boolean
 *                   high_intensity:
 *                     type: boolean
 *                   status:
 *                     type: string
 *                   image_url:
 *                     type: string
 *                   category_id:
 *                     type: integer
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *       '404':
 *          description: Ressource non trouvée
 *       '500':
 *         description: Erreur serveur
 */

/************************ ADMIN ROUTES ************************/

/**
 * @openapi
 * /api/activities/all:
 *   get:
 *     tags:
 *       - Activities
 *     summary: Récupère toutes les activités (admin uniquement)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *       - in: query
 *         name: order
 *         required: false
 *         schema:
 *           type: string
 *           enum: [name:asc, name:desc]
 *           default: name:asc
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *       - in: query
 *         name: age_group
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 3
 *       - in: query
 *         name: high_intensity
 *         required: false
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: disabled_access
 *         required: false
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [draft, published]
 *     responses:
 *       '200':
 *         description: Liste des activités
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   slug:
 *                     type: string
 *                   slogan:
 *                     type: string
 *                   description:
 *                     type: string
 *                   minimum_age:
 *                     type: integer
 *                   duration:
 *                     type: string
 *                   disabled_access:
 *                     type: boolean
 *                   high_intensity:
 *                     type: boolean
 *                   status:
 *                     type: string
 *                   image_url:
 *                     type: string
 *                   category_id:
 *                     type: integer
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *       '401':
 *         description: Non authentifié
 *       '403':
 *          description: Accès interdit (rôle admin requis)
 *       '404':
 *          description: Ressource non trouvée
 *       '500':
 *         description: Erreur serveur
 */
