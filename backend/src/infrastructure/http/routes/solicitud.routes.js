import { Router } from 'express';
import { solicitudController } from '../controllers/solicitud.controller.js';
import { uploadComprobante } from '../middlewares/upload.js';

export const solicitudRoutes = Router();

solicitudRoutes.post('/', solicitudController.create);
solicitudRoutes.get('/', solicitudController.getAll);
solicitudRoutes.get('/:id', solicitudController.getById);
solicitudRoutes.get('/usuario/:id', solicitudController.getByUsuario);
solicitudRoutes.put('/:id/estado', solicitudController.updateEstado);
solicitudRoutes.put('/:id/comprobante', uploadComprobante.single('comprobante'), solicitudController.uploadComprobante);
solicitudRoutes.delete('/:id', solicitudController.delete);