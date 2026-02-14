import { solicitudService } from '../../../services/solicitud.service.js';

export const solicitudController = {
  async create(req, res) {
    const { usuarioId, tipoDocumentoId } = req.body;

    if (!usuarioId || !tipoDocumentoId) {
      return res.status(400).json({ error: 'usuarioId y tipoDocumentoId son requeridos' });
    }

    const userIdNum = parseInt(usuarioId);
    const docIdNum = parseInt(tipoDocumentoId);

    if (isNaN(userIdNum) || isNaN(docIdNum)) {
      return res.status(400).json({ error: 'IDs deben ser números válidos' });
    }

    try {
      const solicitud = await solicitudService.create(userIdNum, docIdNum);
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
      const solicitudes = await solicitudService.getAll();
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
    const { estado, observacionAdmin } = req.body;
    const solicitudId = parseInt(id);

    if (isNaN(solicitudId)) {
      return res.status(400).json({ error: 'ID de solicitud debe ser un número válido' });
    }

    if (!estado || !['APROBADO', 'RECHAZADO'].includes(estado)) {
      return res.status(400).json({ error: 'Estado debe ser APROBADO o RECHAZADO' });
    }

    try {
      const solicitud = await solicitudService.updateEstado(solicitudId, estado, observacionAdmin);
      res.json(solicitud);
    } catch (error) {
      console.error(error);
      const status = error.message.includes('no existe') ? 404 : 500;
      res.status(status).json({ error: error.message });
    }
  },

  async uploadComprobante(req, res) {
    const { id } = req.params;
    const { imagenBase64, nombreArchivo, extensionArchivo } = req.body;
    const solicitudId = parseInt(id);

    if (isNaN(solicitudId)) {
      return res.status(400).json({ error: 'ID de solicitud debe ser un número válido' });
    }

    if (!imagenBase64 || !nombreArchivo || !extensionArchivo) {
      return res.status(400).json({ error: 'imagenBase64, nombreArchivo y extensionArchivo son requeridos' });
    }

    try {
      const solicitud = await solicitudService.uploadComprobante(solicitudId, imagenBase64, nombreArchivo, extensionArchivo);
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
      
      if (solicitudService.delete) {
        await solicitudService.delete(solicitudId);
        res.json({ message: 'Solicitud eliminada correctamente' });
      } else {
      
        console.warn("Falta implementar delete en solicitud.service.js");
        res.status(501).json({ error: 'Función de eliminar no implementada en el servicio' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar la solicitud' });
    }
  }
};