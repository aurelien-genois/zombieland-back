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
 *         description: Activité non trouvée
 *       '500':
 *         description: Erreur serveur
 */

/**
 * @openapi
 * /api/activities/{slug}:
 *   get:
 *     tags:
 *       - Activities
 *     summary: Récupère une activité publiée par son slug
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Activité publiée trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 slug:
 *                   type: string
 *                 slogan:
 *                   type: string
 *                 description:
 *                   type: string
 *                 minimum_age:
 *                   type: integer
 *                 duration:
 *                   type: string
 *                 disabled_access:
 *                   type: boolean
 *                 high_intensity:
 *                   type: boolean
 *                 status:
 *                   type: string
 *                 image_url:
 *                   type: string
 *                 category_id:
 *                   type: integer
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       '404':
 *         description: Activité non trouvée
 *       '500':
 *         description: Erreur serveur
 */

/************************ MEMBER ROUTES ************************/

/**
 * @openapi
 * /api/activities/evaluate/{id}:
 *   post:
 *     tags:
 *       - Activities
 *     summary: Évalue une activité (membre/admin uniquement)
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
 *               - grade
 *             properties:
 *               grade:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Activité créée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 grade:
 *                   type: integer
 *                 comment:
 *                   type: string
 *                 user_id:
 *                   type: integer
 *                 activity_id:
 *                   type: integer
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       '401':
 *         description: Non authentifié
 *       '403':
 *         description: Accès interdit (rôle admin/membre requis)
 *       '404':
 *         description: Activité non trouvée
 *       '409':
 *         description: Activité déjà évaluée par cet utilisateur
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
 *         description: Accès interdit (rôle admin requis)
 *       '404':
 *         description: Activité non trouvée
 *       '500':
 *         description: Erreur serveur
 */

/**
 * @openapi
 * /api/activities/all/{slug}:
 *   get:
 *     tags:
 *       - Activities
 *     summary: Récupère une activité par son slug (admin uniquement)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Activité trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 slug:
 *                   type: string
 *                 slogan:
 *                   type: string
 *                 description:
 *                   type: string
 *                 minimum_age:
 *                   type: integer
 *                 duration:
 *                   type: string
 *                 disabled_access:
 *                   type: boolean
 *                 high_intensity:
 *                   type: boolean
 *                 status:
 *                   type: string
 *                 image_url:
 *                   type: string
 *                 category_id:
 *                   type: integer
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
 *         description: Activité non trouvée
 *       '500':
 *         description: Erreur serveur
 */

/**
 * @openapi
 * /api/activities:
 *   post:
 *     tags:
 *       - Activities
 *     summary: Crée une activité (admin uniquement)
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - age_group
 *               - category_id
 *             properties:
 *               name:
 *                 type: string
 *               slogan:
 *                 type: string
 *               description:
 *                 type: string
 *               age_group:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 3
 *               duration:
 *                 type: string
 *               disabled_access:
 *                 type: boolean
 *               high_intensity:
 *                 type: boolean
 *               image_url:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               saved:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: Activité créée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 slug:
 *                   type: string
 *                 slogan:
 *                   type: string
 *                 description:
 *                   type: string
 *                 minimum_age:
 *                   type: integer
 *                 duration:
 *                   type: string
 *                 disabled_access:
 *                   type: boolean
 *                 high_intensity:
 *                   type: boolean
 *                 status:
 *                   type: string
 *                 image_url:
 *                   type: string
 *                 category_id:
 *                   type: integer
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
 *       '409':
 *         description: Activité déjà existante avec le même nom ou Catégorie sélectionnée inexistante
 *       '500':
 *         description: Erreur serveur
 */

/**
 * @openapi
 * /api/activities/{id}:
 *   patch:
 *     tags:
 *       - Activities
 *     summary: Met à jour une activité (admin uniquement)
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
 *               slogan:
 *                 type: string
 *               description:
 *                 type: string
 *               age_group:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 3
 *               duration:
 *                 type: string
 *               disabled_access:
 *                 type: boolean
 *               high_intensity:
 *                 type: boolean
 *               image_url:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               saved:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: Activité mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 slug:
 *                   type: string
 *                 slogan:
 *                   type: string
 *                 description:
 *                   type: string
 *                 minimum_age:
 *                   type: integer
 *                 duration:
 *                   type: string
 *                 disabled_access:
 *                   type: boolean
 *                 high_intensity:
 *                   type: boolean
 *                 status:
 *                   type: string
 *                 image_url:
 *                   type: string
 *                 category_id:
 *                   type: integer
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
 *         description: Activité non trouvée
 *       '409':
 *         description: Catégorie sélectionnée inexistante
 *       '500':
 *         description: Erreur serveur
 *   delete:
 *     tags:
 *       - Activities
 *     summary: Supprime une activité (admin uniquement)
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
 *         description: Activité supprimée avec succès
 *       '401':
 *         description: Non authentifié
 *       '403':
 *         description: Accès interdit (rôle admin requis)
 *       '404':
 *         description: Activité non trouvée
 *       '500':
 *         description: Erreur serveur
 */
