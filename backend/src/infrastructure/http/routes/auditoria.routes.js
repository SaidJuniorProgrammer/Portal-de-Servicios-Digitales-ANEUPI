import { Router } from 'express';
import { auditoriaController } from '../controllers/auditoria.controller.js';

export const auditoriaRoutes = Router();

/**
 * @swagger
 * /api/auditorias/CrearAuditoria:
 *   post:
 *     summary: Crear un registro de auditoría
 *     tags: [Auditorias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accion
 *               - usuarioId
 *             properties:
 *               accion:
 *                 type: string
 *               detalle:
 *                 type: string
 *               usuarioId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Registro creado correctamente
 */
auditoriaRoutes.post('/CrearAuditoria', auditoriaController.crear);


/**
 * @swagger
 * /api/auditorias/ConsultarTodas:
 *   get:
 *     summary: Consultar todos los registros de auditoría
 *     tags: [Auditorias]
 *     responses:
 *       200:
 *         description: Lista de auditorías
 */
auditoriaRoutes.get('/ConsultarTodas', auditoriaController.listar);


/**
 * @swagger
 * /api/auditorias/ConsultarPorId/{id}:
 *   get:
 *     summary: Consultar auditoría por ID
 *     tags: [Auditorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Registro encontrado
 *       404:
 *         description: No encontrado
 */
auditoriaRoutes.get('/ConsultarPorId/:id', auditoriaController.obtenerPorId);


/**
 * @swagger
 * /api/auditorias/ConsultarPorUsuario/{id}:
 *   get:
 *     summary: Consultar auditorías por ID de usuario
 *     tags: [Auditorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de auditorías del usuario
 */
auditoriaRoutes.get('/ConsultarPorUsuario/:id', auditoriaController.listarPorUsuario);
