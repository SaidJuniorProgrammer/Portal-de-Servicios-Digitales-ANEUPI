import express from 'express';
import path from 'path';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import { documentoRoutes } from './infrastructure/http/routes/documento.routes.js';
import { solicitudRoutes } from './infrastructure/http/routes/solicitud.routes.js';
import { usuarioRoutes } from './infrastructure/http/routes/usuario.routes.js';
import { auditoriaRoutes } from './infrastructure/http/routes/auditoria.routes.js';

export const createApp = () => {
  const app = express();
  const prisma = new PrismaClient();

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  
  app.use(express.static(path.join(process.cwd(), 'public')));

  app.get('/', (req, res) => {
    res.send('API Portal ANEUPI Funcionando');
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api/documentos', documentoRoutes);
  app.use('/api/solicitudes', solicitudRoutes);
  app.use('/api/usuarios', usuarioRoutes);
  app.use('/api/auditorias', auditoriaRoutes);

  return app;
};