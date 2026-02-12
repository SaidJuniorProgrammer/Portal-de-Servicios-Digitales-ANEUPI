import { prisma } from '../infrastructure/database/prisma.js';

export const solicitudService = {
  async create(usuarioId, tipoDocumentoId) {
    const documento = await prisma.tipoDocumento.findUnique({ 
      where: { id: tipoDocumentoId } 
    });
    
    if (!documento) throw new Error('El documento seleccionado no existe');

    return prisma.solicitud.create({
      data: {
        usuarioId,
        tipoDocumentoId,
        precioAlSolicitar: documento.precio,
        estado: 'PENDIENTE_PAGO'
      }
    });
  },

  async getByUsuarioId(usuarioId) {
    return prisma.solicitud.findMany({
      where: { usuarioId },
      include: { tipoDocumento: true },
      orderBy: { fechaSolicitud: 'desc' }
    });
  }
};
