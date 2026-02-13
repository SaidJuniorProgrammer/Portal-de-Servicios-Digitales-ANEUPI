import { documentoService } from '../../../services/documento.service.js';

export const documentoController = {
  async getAll(req, res) {
    try {
      const documentos = await documentoService.getAll();
      res.json(documentos);
    } catch (error) {
      console.error('Error al obtener documentos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};
