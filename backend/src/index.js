import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Portal de Servicios Digitales ANEUPI - Funcionando ');
});

app.get('/api/documentos', async (req, res) => {
  try {
    const docs = await prisma.tipoDocumento.findMany({
      where: { activo: true } 
    });
    res.json(docs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los documentos" });
  }
});

app.post('/api/solicitudes', async (req, res) => {
  const { usuarioId, tipoDocumentoId } = req.body;

  try {
    const doc = await prisma.tipoDocumento.findUnique({
      where: { id: parseInt(tipoDocumentoId) }
    });

    if (!doc) {
      return res.status(404).json({ error: "El documento seleccionado no existe" });
    }

    const nuevaSolicitud = await prisma.solicitud.create({
      data: {
        usuarioId: parseInt(usuarioId),        
        tipoDocumentoId: parseInt(tipoDocumentoId), 
        precioAlSolicitar: doc.precio,         
        estado: 'PENDIENTE_PAGO'               
      }
    });

    res.json(nuevaSolicitud);

  } catch (error) {
    console.error("Error creando solicitud:", error);
    res.status(500).json({ error: "No se pudo crear la solicitud" });
  }
});

app.get('/api/solicitudes/usuario/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const solicitudes = await prisma.solicitud.findMany({
      where: { usuarioId: parseInt(id) }, 
      include: { tipoDocumento: true },   
      orderBy: { fechaSolicitud: 'desc' } 
    });

    res.json(solicitudes);
  } catch (error) {
    console.error("Error obteniendo historial:", error);
    res.status(500).json({ error: "Error al cargar el historial" });
  }
});

app.delete('/api/solicitudes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.solicitud.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: "Solicitud eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar:", error);
    res.status(500).json({ error: "No se pudo eliminar la solicitud" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});