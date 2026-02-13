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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 usuarioId:
 *                   type: integer
 *                 tipoDocumentoId:
 *                   type: integer
 *                 estado:
 *                   type: string
 *                   enum: [PENDIENTE_PAGO, EN_REVISION, APROBADO, RECHAZADO]
 *                 precioAlSolicitar:
 *                   type: number
 *                   format: decimal
 *                 fechaSolicitud:
 *                   type: string
 *                   format: date-time
 *                 fechaAprobacion:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                 comprobantePagoUrl:
 *                   type: string
 *                   nullable: true
 *                 pdfGeneradoUrl:
 *                   type: string
 *                   nullable: true
 *                 observacionAdmin:
 *                   type: string
 *                   nullable: true
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   usuarioId:
 *                     type: integer
 *                   tipoDocumentoId:
 *                     type: integer
 *                   estado:
 *                     type: string
 *                     enum: [PENDIENTE_PAGO, EN_REVISION, APROBADO, RECHAZADO]
 *                   precioAlSolicitar:
 *                     type: number
 *                     format: decimal
 *                   fechaSolicitud:
 *                     type: string
 *                     format: date-time
 *                   fechaAprobacion:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                   comprobantePagoUrl:
 *                     type: string
 *                     nullable: true
 *                   pdfGeneradoUrl:
 *                     type: string
 *                     nullable: true
 *                   observacionAdmin:
 *                     type: string
 *                     nullable: true
 *                   tipoDocumento:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                       descripcion:
 *                         type: string
 *                       precio:
 *                         type: number
 *                         format: decimal
 *                       activo:
 *                         type: boolean
 *                       codigoPlantilla:
 *                         type: string
 */
solicitudRoutes.get('/usuario/:id', solicitudController.getByUsuario);

/**
 * @swagger
 * /api/solicitudes/{id}/estado:
 *   put:
 *     summary: Actualizar estado de una solicitud (Admin)
 *     tags: [Solicitudes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la solicitud
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [APROBADO, RECHAZADO]
 *               observacionAdmin:
 *                 type: string
 *                 description: Observación del administrador (requerida si es RECHAZADO)
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Solicitud no encontrada
 */
solicitudRoutes.put('/:id/estado', solicitudController.updateEstado);
