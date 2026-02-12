import { Router } from 'express';
import { solicitudController } from '../controllers/solicitud.controller.js';

export const solicitudRoutes = Router();

/**
 * @swagger
 * /api/solicitudes:
 *   post:
 *     summary: Crear una nueva solicitud de documento
 *     tags: [Solicitudes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuarioId
 *               - tipoDocumentoId
 *             properties:
 *               usuarioId:
 *                 type: integer
 *               tipoDocumentoId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Solicitud creada exitosamente
 *       404:
 *         description: Documento no encontrado
 */
solicitudRoutes.post('/', solicitudController.create);

/**
 * @swagger
 * /api/solicitudes/usuario/{id}:
 *   get:
 *     summary: Obtener historial de solicitudes de un usuario
 *     tags: [Solicitudes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de solicitudes del usuario
 */
solicitudRoutes.get('/usuario/:id', solicitudController.getByUsuario);
