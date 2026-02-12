import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); 
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API Portal de Servicios Digitales ANEUPI - Funcionando ');
});

// 1. Obtener todos los documentos disponibles (Catálogo)
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

// 2. CREAR UNA NUEVA SOLICITUD (Botón "Solicitar")
app.post('/api/solicitudes', async (req, res) => {
  const { usuarioId, tipoDocumentoId } = req.body;

  try {
    // A. Buscamos el documento para saber cuánto cuesta HOY
    const doc = await prisma.tipoDocumento.findUnique({
      where: { id: parseInt(tipoDocumentoId) }
    });

    if (!doc) {
      return res.status(404).json({ error: "El documento seleccionado no existe" });
    }

    // B. Creamos la solicitud en la base de datos
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

// 3. OBTENER HISTORIAL DE SOLICITUDES 
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});