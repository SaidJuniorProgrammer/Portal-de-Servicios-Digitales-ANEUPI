import { solicitudService } from '../../../services/solicitud.service.js';
import { prisma } from '../../database/prisma.js';
import { generarPDF } from '../../../services/pdf.service.js';

export const solicitudController = {
  async create(req, res) {
    const { usuarioId, tipoDocumentoId, datosSolicitud } = req.body;

    if (!usuarioId || !tipoDocumentoId) {
      return res.status(400).json({ error: 'usuarioId y tipoDocumentoId son requeridos' });
    }

    const userIdNum = parseInt(usuarioId);
    const docIdNum = parseInt(tipoDocumentoId);

    if (isNaN(userIdNum) || isNaN(docIdNum)) {
      return res.status(400).json({ error: 'IDs deben ser números válidos' });
    }

    try {
      const solicitud = await solicitudService.create(userIdNum, docIdNum, datosSolicitud);
      res.json(solicitud);
    } catch (error) {
      console.error(error);
      const status = error.message.includes('no existe') ? 404 : 500;
      res.status(status).json({ error: error.message });
    }
  },

  async getByUsuario(req, res) {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'ID de usuario debe ser un número válido' });
    }

    try {
      const solicitudes = await solicitudService.getByUsuarioId(userId);
      res.json(solicitudes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al cargar las solicitudes' });
    }
  },

  async getAll(req, res) {
    try {
      const solicitudes = await prisma.solicitud.findMany({
        include: {
          usuario: true,
          tipoDocumento: true
        },
        orderBy: {
          fechaSolicitud: 'desc'
        }
      });
      res.json(solicitudes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al cargar las solicitudes' });
    }
  },

  async getById(req, res) {
    const { id } = req.params;
    const solicitudId = parseInt(id);

    if (isNaN(solicitudId)) {
      return res.status(400).json({ error: 'ID de solicitud debe ser un número válido' });
    }

    try {
      const solicitud = await solicitudService.getById(solicitudId);
      if (!solicitud) {
        return res.status(404).json({ error: 'Solicitud no encontrada' });
      }
      res.json(solicitud);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al cargar la solicitud' });
    }
  },

  async updateEstado(req, res) {
    const { id } = req.params;
    const { estado, observacionAdmin, adminId, adminNombre } = req.body;
    const solicitudId = parseInt(id);

    if (isNaN(solicitudId)) {
      return res.status(400).json({ error: 'ID de solicitud debe ser un número válido' });
    }

    if (!estado || !['APROBADO', 'RECHAZADO'].includes(estado)) {
      return res.status(400).json({ error: 'Estado debe ser APROBADO o RECHAZADO' });
    }

    try {
      let solicitudActualizada = await solicitudService.updateEstado(solicitudId, estado, observacionAdmin);

      if (estado === 'APROBADO') {
        const solicitudCompleta = await prisma.solicitud.findUnique({
          where: { id: solicitudId },
          include: { 
            usuario: true,
            tipoDocumento: true 
          }
        });

        const resultadoPdf = await generarPDF(solicitudCompleta);

        if (resultadoPdf.error) {
          return res.status(400).json({ error: resultadoPdf.error });
        }

        solicitudActualizada = await prisma.solicitud.update({
          where: { id: solicitudId },
          data: { pdfGeneradoUrl: resultadoPdf }
        });
      }

      try {
        const idDelAdmin = adminId || req.user?.id || solicitudActualizada.usuarioId;
        
        await prisma.auditoria.create({
          data: {
            accion: `SOLICITUD_${estado}`,
            detalle: observacionAdmin || `Cambio de estado a ${estado}`,
            usuario: adminNombre || 'Administrador',
            usuarioId: parseInt(idDelAdmin)
          }
        });
      } catch (auditError) {
        console.error(auditError);
      }

      res.json(solicitudActualizada);
    } catch (error) {
      console.error(error);
      const status = error.message.includes('no existe') ? 404 : 400;
      res.status(status).json({ error: error.message });
    }
  },

  async uploadComprobante(req, res) {
    try {
      const { id } = req.params;
      const solicitudId = parseInt(id);

      if (isNaN(solicitudId)) {
        return res.status(400).json({ error: 'ID de solicitud debe ser un número válido' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No se ha subido ningún archivo de comprobante' });
      }

      const pathArchivo = `/comprobantes/${req.file.filename}`;
      const nombreArchivo = req.file.originalname;
      const extensionArchivo = req.file.filename.split('.').pop();

      const solicitud = await solicitudService.uploadComprobante(
        solicitudId, 
        pathArchivo, 
        nombreArchivo, 
        extensionArchivo
      );

      res.json(solicitud);
    } catch (error) {
      console.error(error);
      const status = error.message.includes('no existe') ? 404 : 500;
      res.status(status).json({ error: error.message });
    }
  },

  async delete(req, res) {
    const { id } = req.params;
    const solicitudId = parseInt(id);

    if (isNaN(solicitudId)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    try {
      await solicitudService.delete(solicitudId);
      res.json({ message: 'Solicitud eliminada correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar la solicitud' });
    }
  }
};