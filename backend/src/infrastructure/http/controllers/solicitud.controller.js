import { solicitudService } from '../../../services/solicitud.service.js';

export const solicitudController = {
  async create(req, res) {
    const { usuarioId, tipoDocumentoId } = req.body;

    try {
      const solicitud = await solicitudService.create(
        parseInt(usuarioId),
        parseInt(tipoDocumentoId)
      );
      res.json(solicitud);
    } catch (error) {
      console.error(error);
      const status = error.message.includes('no existe') ? 404 : 500;
      res.status(status).json({ error: error.message });
    }
  },

  async getByUsuario(req, res) {
    const { id } = req.params;

    try {
      const solicitudes = await solicitudService.getByUsuarioId(parseInt(id));
      res.json(solicitudes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al cargar el historial' });
    }
  }
};
