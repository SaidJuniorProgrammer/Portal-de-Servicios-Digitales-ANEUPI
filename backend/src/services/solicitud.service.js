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
    const solicitudes = await prisma.solicitud.findMany({
      where: { usuarioId },
      include: {
        tipoDocumento: true,
        usuario: true
      },
      orderBy: { fechaSolicitud: 'desc' }
    });

    return solicitudes.map(solicitud => ({
      ...solicitud,
      tipoDocumento: solicitud.tipoDocumento.nombre,
      nombreCompleto: solicitud.usuario.nombreCompleto,
      cedula: solicitud.usuario.cedula
    }));
  },

  async getAll() {
    const solicitudes = await prisma.solicitud.findMany({
      include: {
        tipoDocumento: true,
        usuario: true
      },
      orderBy: { fechaSolicitud: 'desc' }
    });

    return solicitudes.map(solicitud => ({
      ...solicitud,
      tipoDocumento: solicitud.tipoDocumento.nombre,
      nombreCompleto: solicitud.usuario.nombreCompleto,
      cedula: solicitud.usuario.cedula
    }));
  },

  async getById(solicitudId) {
    const solicitud = await prisma.solicitud.findUnique({
      where: { id: solicitudId },
      include: {
        tipoDocumento: true,
        usuario: true
      }
    });

    if (!solicitud) return null;

    return {
      ...solicitud,
      tipoDocumento: solicitud.tipoDocumento.nombre,
      nombreCompleto: solicitud.usuario.nombreCompleto,
      cedula: solicitud.usuario.cedula
    };
  },

  async updateEstado(solicitudId, estado, observacionAdmin) {
    const solicitud = await prisma.solicitud.findUnique({ 
      where: { id: solicitudId } 
    });
    
    if (!solicitud) throw new Error('La solicitud no existe');

    let datosActualizar = {
      estado,
      observacionAdmin,
      fechaAprobacion: estado === 'APROBADO' ? new Date() : null
    };

    if (estado === 'APROBADO' && !solicitud.codigoSolicitud) {
      const year = new Date().getFullYear();
      const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let hashAleatorio = '';
      for (let i = 0; i < 4; i++) {
        hashAleatorio += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
      }
      datosActualizar.codigoSolicitud = `ANEUPI-${year}-${solicitudId.toString().padStart(4, '0')}-${hashAleatorio}`;
    }

    return prisma.solicitud.update({
      where: { id: solicitudId },
      data: datosActualizar
    });
  },

  async uploadComprobante(solicitudId, imagenBase64, nombreArchivo, extensionArchivo) {
    const solicitud = await prisma.solicitud.findUnique({ 
      where: { id: solicitudId } 
    });
    
    if (!solicitud) throw new Error('La solicitud no existe');

    return prisma.solicitud.update({
      where: { id: solicitudId },
      data: {
        comprobantePagoUrl: imagenBase64,
        nombreArchivo,
        extensionArchivo,
        estado: 'EN_REVISION'
      }
    });
  },

  async delete(id) {
    return prisma.solicitud.delete({
      where: { id }
    });
  }
};