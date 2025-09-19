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
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
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
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès interdit (rôle admin requis)
 */