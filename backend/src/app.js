import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

export const createApp = () => {
  const app = express();
  const prisma = new PrismaClient();

  app.use(cors());
  app.use(express.json());


  app.get('/api/documentos', async (req, res) => {
    const docs = await prisma.tipoDocumento.findMany({ where: { activo: true } });
    res.json(docs);
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
      res.status(500).json({ error: "Error al crear" });
    }
  });

  
  app.get('/api/solicitudes/usuario/:id', async (req, res) => {
    const historial = await prisma.solicitud.findMany({
      where: { usuarioId: parseInt(req.params.id) },
      include: { tipoDocumento: true },
      orderBy: { fechaSolicitud: 'desc' }
    });
    res.json(historial);
  });

  
  app.delete('/api/solicitudes/:id', async (req, res) => {
    try {
      await prisma.solicitud.delete({ where: { id: parseInt(req.params.id) } });
      res.json({ message: "Solicitud eliminada correctamente" });
    } catch (error) {
      res.status(500).json({ error: "No se pudo eliminar la solicitud" });
    }
  });

  
  app.get('/api/admin/solicitudes', async (req, res) => {
    const todas = await prisma.solicitud.findMany({
      include: { tipoDocumento: true },
      orderBy: { fechaSolicitud: 'desc' }
    });
    res.json(todas);
  });

  app.put('/api/solicitudes/:id/estado', async (req, res) => {
    const actualizada = await prisma.solicitud.update({
      where: { id: parseInt(req.params.id) },
      data: { estado: req.body.nuevoEstado }
    });
    res.json(actualizada);
  });

  return app;
};