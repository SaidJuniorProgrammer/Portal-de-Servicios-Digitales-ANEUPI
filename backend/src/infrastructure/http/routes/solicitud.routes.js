import { Router } from 'express';
import { solicitudController } from '../controllers/solicitud.controller.js';

export const solicitudRoutes = Router();

/**
 * @swagger
 * /api/solicitudes:
 * post:
 * summary: Crear solicitud
 * tags: [Solicitudes]
 */
solicitudRoutes.post('/', solicitudController.create);

/**
 * @swagger
 * /api/solicitudes:
 *   get:
 *     summary: Obtener todas las solicitudes
 *     tags: [Solicitudes]
 *     responses:
 *       200:
 *         description: Lista de todas las solicitudes
 */
solicitudRoutes.get('/', solicitudController.getAll);

/**
 * @swagger
 * /api/solicitudes/{id}:
 *   get:
 *     summary: Obtener una solicitud por ID
 *     tags: [Solicitudes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la solicitud
 *     responses:
 *       200:
 *         description: Datos de la solicitud con usuario y tipo de documento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 estado:
 *                   type: string
 *                 fechaSolicitud:
 *                   type: string
 *                   format: date-time
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     nombreCompleto:
 *                       type: string
 *                     cedula:
 *                       type: string
 *                 tipoDocumento:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *       404:
 *         description: Solicitud no encontrada
 */
solicitudRoutes.get('/:id', solicitudController.getById);

/**
 * @swagger
 * /api/solicitudes/usuario/{id}:
 *   get:
 *     summary: Obtener solicitudes de un usuario específico
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
 * put:
 * summary: Cambiar estado
 * tags: [Solicitudes]
 */
solicitudRoutes.put('/:id/estado', solicitudController.updateEstado);

/**
 * @swagger
 * /api/solicitudes/{id}/pago:
 * post:
 * summary: Subir pago
 * tags: [Solicitudes]
 */
solicitudRoutes.post('/:id/pago', solicitudController.uploadComprobante);

/**
 * @swagger
 * /api/solicitudes/{id}:
 * delete:
 * summary: Eliminar solicitud
 * tags: [Solicitudes]
 */
solicitudRoutes.delete('/:id', solicitudController.delete);