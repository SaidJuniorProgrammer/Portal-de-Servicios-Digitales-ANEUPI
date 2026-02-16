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
 * get:
 * summary: Obtener todas las solicitudes
 * tags: [Solicitudes]
 */
solicitudRoutes.get('/', solicitudController.getAll);

/**
 * @swagger
 * /api/solicitudes/{id}:
 * get:
 * summary: Obtener una solicitud por ID
 * tags: [Solicitudes]
 */
solicitudRoutes.get('/:id', solicitudController.getById);

/**
 * @swagger
 * /api/solicitudes/usuario/{id}:
 * get:
 * summary: Obtener solicitudes de un usuario específico
 * tags: [Solicitudes]
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
 * /api/solicitudes/{id}/comprobante:
 * put:
 * summary: Subir comprobante de pago
 * tags: [Solicitudes]
 */
// CAMBIO IMPORTANTE: Ahora usamos PUT y /comprobante para coincidir con Jorge
solicitudRoutes.put('/:id/comprobante', solicitudController.uploadComprobante);

/**
 * @swagger
 * /api/solicitudes/{id}:
 * delete:
 * summary: Eliminar solicitud
 * tags: [Solicitudes]
 */
solicitudRoutes.delete('/:id', solicitudController.delete);