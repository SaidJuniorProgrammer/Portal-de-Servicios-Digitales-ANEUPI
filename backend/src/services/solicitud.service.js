import { prisma } from '../infrastructure/database/prisma.js';

export const solicitudService = {
  async create(usuarioId, tipoDocumentoId) {
    const usuario = await prisma.usuario.findUnique({ 
      where: { id: usuarioId } 
    });
    
    if (!usuario) throw new Error('El usuario no existe');

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
  },

  async updateEstado(solicitudId, estado, observacionAdmin) {
    const solicitud = await prisma.solicitud.findUnique({ 
      where: { id: solicitudId } 
    });
    
    if (!solicitud) throw new Error('La solicitud no existe');

    return prisma.solicitud.update({
      where: { id: solicitudId },
      data: {
        estado,
        observacionAdmin,
        fechaAprobacion: estado === 'APROBADO' ? new Date() : null
      }
    });
  }
};
