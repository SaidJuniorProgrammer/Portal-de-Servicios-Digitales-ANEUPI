import { prisma } from '../infrastructure/database/prisma.js';

class AuditoriaService {

  async crearAuditoria(data) {
    const { accion, detalle, usuarioId } = data;

    return await prisma.auditoria.create({
      data: {
        accion,
        detalle,
        usuarioId
      }
    });
  }

  async obtenerTodas() {
    return await prisma.auditoria.findMany({
      include: {
        usuarioRef: {
          select: {
            id: true,
            email: true,
            nombreCompleto: true,
            rol: true
          }
        }
      },
      orderBy: {
        fecha: 'desc'
      }
    });
  }

  async obtenerPorId(id) {
    return await prisma.auditoria.findUnique({
      where: { id: Number(id) },
      include: {
        usuarioRef: true
      }
    });
  }

  async obtenerPorUsuario(usuarioId) {
    return await prisma.auditoria.findMany({
      where: { usuarioId: Number(usuarioId) },
      orderBy: {
        fecha: 'desc'
      }
    });
  }

}

export const auditoriaService = new AuditoriaService();
