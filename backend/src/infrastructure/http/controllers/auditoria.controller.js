import { auditoriaService } from '../../../services/auditoria.service.js';

export const auditoriaController = {

  async crear(req, res) {
    const { accion, detalle, usuarioId } = req.body;

    if (!accion || !usuarioId) {
      return res.status(400).json({ error: 'accion y usuarioId son requeridos' });
    }

    try {
      const auditoria = await auditoriaService.crearAuditoria({
        accion,
        detalle,
        usuarioId: parseInt(usuarioId)
      });

      res.status(201).json(auditoria);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  async listar(req, res) {
    try {
      const auditorias = await auditoriaService.obtenerTodas();
      res.json(auditorias);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  async obtenerPorId(req, res) {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    try {
      const auditoria = await auditoriaService.obtenerPorId(id);

      if (!auditoria) {
        return res.status(404).json({ error: 'Registro no encontrado' });
      }

      res.json(auditoria);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  async listarPorUsuario(req, res) {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    try {
      const auditorias = await auditoriaService.obtenerPorUsuario(id);
      res.json(auditorias);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

};
