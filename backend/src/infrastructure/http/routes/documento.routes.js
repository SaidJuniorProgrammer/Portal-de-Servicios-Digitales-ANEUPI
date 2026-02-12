import { Router } from 'express';
import { documentoController } from '../controllers/documento.controller.js';

export const documentoRoutes = Router();

/**
 * @swagger
 * /api/documentos:
 *   get:
 *     summary: Obtener todos los documentos disponibles
 *     tags: [Documentos]
 *     responses:
 *       200:
 *         description: Lista de documentos activos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   descripcion:
 *                     type: string
 *                   precio:
 *                     type: string
 *                   activo:
 *                     type: boolean
 *                   codigoPlantilla:
 *                     type: string
 */
documentoRoutes.get('/', documentoController.getAll);
