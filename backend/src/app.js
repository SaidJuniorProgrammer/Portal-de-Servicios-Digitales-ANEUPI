import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

export const createApp = () => {
  const app = express();
  const prisma = new PrismaClient();

  app.use(cors());
  
  
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.get('/', (req, res) => {
    res.send('API Portal ANEUPI Funcionando');
  });

  app.get('/api/documentos', async (req, res) => {
    try {
      const docs = await prisma.tipoDocumento.findMany({ where: { activo: true } });
      res.json(docs);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener documentos" });
    }
  });

  app.post('/api/solicitudes', async (req, res) => {
    const { usuarioId, tipoDocumentoId } = req.body;
    try {
      const doc = await prisma.tipoDocumento.findUnique({ where: { id: parseInt(tipoDocumentoId) } });
      
      const nueva = await prisma.solicitud.create({
        data: {
          usuarioId: parseInt(usuarioId),
          tipoDocumentoId: parseInt(tipoDocumentoId),
          precioAlSolicitar: doc.precio,
          estado: 'PENDIENTE_PAGO'
        }
      });
      res.json(nueva);
    } catch (error) {
      res.status(500).json({ error: "Error al crear solicitud" });
    }
  });

  app.get('/api/solicitudes/usuario/:id', async (req, res) => {
    try {
      const historial = await prisma.solicitud.findMany({
        where: { usuarioId: parseInt(req.params.id) },
        include: { tipoDocumento: true },
        orderBy: { fechaSolicitud: 'desc' }
      });
      res.json(historial);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener historial" });
    }
  });

  app.delete('/api/solicitudes/:id', async (req, res) => {
    try {
      await prisma.solicitud.delete({ where: { id: parseInt(req.params.id) } });
      res.json({ message: "Solicitud eliminada correctamente" });
    } catch (error) {
      res.status(500).json({ error: "No se pudo eliminar la solicitud" });
    }
  });

  
  app.post('/api/solicitudes/:id/pago', async (req, res) => {
    const { id } = req.params;
    
    const { imagenBase64, nombreArchivo, extension } = req.body;

    console.log(`Recibiendo pago para solicitud #${id}`);
    console.log(`Archivo: ${nombreArchivo}, Extensión: ${extension}`);
    

    try {
      
      const actualizada = await prisma.solicitud.update({
        where: { id: parseInt(id) },
        data: { 
          estado: 'EN_REVISION'
          
        }
      });
      
      res.json({ message: "Pago recibido correctamente", solicitud: actualizada });
    } catch (error) {
      console.error("Error al procesar pago:", error);
      res.status(500).json({ error: "Error al registrar el pago" });
    }
  });

  app.get('/api/admin/solicitudes', async (req, res) => {
    try {
      const todas = await prisma.solicitud.findMany({
        include: { tipoDocumento: true },
        orderBy: { fechaSolicitud: 'desc' }
      });
      res.json(todas);
    } catch (error) {
      res.status(500).json({ error: "Error admin" });
    }
  });

  app.put('/api/solicitudes/:id/estado', async (req, res) => {
    try {
      const actualizada = await prisma.solicitud.update({
        where: { id: parseInt(req.params.id) },
        data: { estado: req.body.nuevoEstado }
      });
      res.json(actualizada);
    } catch (error) {
      res.status(500).json({ error: "Error al cambiar estado" });
    }
  });

  return app;
};