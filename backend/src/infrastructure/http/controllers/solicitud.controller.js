import { solicitudService } from '../../../services/solicitud.service.js';
import { prisma } from '../../database/prisma.js';
import { generarPDF } from '../../../services/pdf.service.js';
import { enviarCorreoConPDF } from '../../../services/email.service.js';

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

        const year = new Date().getFullYear();
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let hashAleatorio = '';
        for (let i = 0; i < 4; i++) {
          hashAleatorio += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        
        const codigoBlindado = `ANEUPI-${year}-${solicitudId.toString().padStart(4, '0')}-${hashAleatorio}`;

        solicitudCompleta.codigoSolicitud = codigoBlindado;

        try {
          const pdfBufferMemoria = await generarPDF(solicitudCompleta);

          const mensajeHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
              <h2 style="color: #0ea5e9; text-align: center;">¡Solicitud Aprobada!</h2>
              <p>Hola <strong>${solicitudCompleta.usuario.nombreCompleto || 'Accionista'}</strong>,</p>
              <p>Tu solicitud para el documento <strong>"${solicitudCompleta.tipoDocumento.nombre}"</strong> ha sido aprobada con éxito.</p>
              
              <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; color: #4b5563;">TU CÓDIGO ÚNICO ES:</p>
                <h1 style="margin: 10px 0 0 0; color: #16a34a; font-size: 32px; letter-spacing: 4px;">${codigoBlindado}</h1>
              </div>
              
              <p>Adjunto a este correo encontrarás tu documento oficial en formato PDF.</p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
              <p style="font-size: 12px; color: #9ca3af; text-align: center;">Este es un mensaje automático de ANEUPI.</p>
            </div>
          `;

          await enviarCorreoConPDF(
            solicitudCompleta.usuario.email,
            'Tu documento ha sido Aprobado - ANEUPI',
            mensajeHtml,
            pdfBufferMemoria,
            `Documento_ANEUPI_${codigoBlindado}.pdf`
          );

          solicitudActualizada = await prisma.solicitud.update({
            where: { id: solicitudId },
            data: { 
              pdfGeneradoUrl: "ENVIADO_AL_CORREO",
              codigoSolicitud: codigoBlindado
            }
          });

        } catch (pdfError) {
          console.error("Error en PDF o Correo:", pdfError);
          return res.status(500).json({ error: 'Error al generar o enviar el documento PDF.' });
        }
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