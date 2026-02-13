import { prisma } from '../infrastructure/database/prisma.js';

export const documentoService = {
  async getAll() {
    return prisma.tipoDocumento.findMany({ where: { activo: true } });
  }
};
