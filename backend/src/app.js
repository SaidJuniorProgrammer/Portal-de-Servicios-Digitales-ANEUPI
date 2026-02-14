import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import { documentoRoutes } from './infrastructure/http/routes/documento.routes.js';
import { solicitudRoutes } from './infrastructure/http/routes/solicitud.routes.js';
import { usuarioRoutes } from './infrastructure/http/routes/usuario.routes.js';
import { auditoriaRoutes } from './infrastructure/http/routes/auditoria.routes.js';


export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('API Portal de Servicios Digitales ANEUPI - Funcionando');
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api/documentos', documentoRoutes);
  app.use('/api/solicitudes', solicitudRoutes);
  app.use('/api/usuarios', usuarioRoutes);
  app.use('/api/auditorias', auditoriaRoutes);

  return app;
};
