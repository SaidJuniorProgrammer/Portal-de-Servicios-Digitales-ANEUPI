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
 * /api/solicitudes/usuario/{id}:
 * get:
 * summary: Historial usuario
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