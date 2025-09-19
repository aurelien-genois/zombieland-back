/**
 * @openapi
 * /api/health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Vérifie que l'API fonctionne
 *     responses:
 *       200:
 *         description: All good here!
 */

/**
 * @openapi
 * /api/health/email:
 *   get:
 *     tags:
 *       - Health
 *     summary: Vérifie la santé du service d'envoi d'email
 *     responses:
 *       200:
 *         description: Email service is working
 *       500:
 *         description: Email service error
 */