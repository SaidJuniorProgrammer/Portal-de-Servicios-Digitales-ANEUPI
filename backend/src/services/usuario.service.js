import sha256 from 'sha256';
import { prisma } from '../infrastructure/database/prisma.js';

class UsuarioService {

  async crearUsuario(data) {
    const { email, password, nombreCompleto, cedula, direccion, telefono, rol } = data;

    const hashedPassword = sha256(password);

    const usuario = await prisma.usuario.create({
      data: {
        email,
        password: hashedPassword,
        nombreCompleto,
        cedula,
        direccion,
        telefono,
        rol
      }
    });

    return usuario;
  }

  async obtenerUsuarios() {
    return await prisma.usuario.findMany({
      select: {
        id: true,
        email: true,
        rol: true,
        nombreCompleto: true,
        cedula: true,
        direccion: true,
        telefono: true,
        fechaRegistro: true
      }
    });
  }

  async obtenerUsuarioPorId(id) {
    return await prisma.usuario.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        email: true,
        rol: true,
        nombreCompleto: true,
        cedula: true,
        direccion: true,
        telefono: true,
        fechaRegistro: true
      }
    });
  }

  async actualizarUsuario(id, data) {
    if (data.password) {
      data.password = sha256(data.password);
    }

    return await prisma.usuario.update({
      where: { id: Number(id) },
      data
    });
  }

  async eliminarUsuario(id) {
    return await prisma.usuario.delete({
      where: { id: Number(id) }
    });
  }


  async login(email, password) {
  const hashedPassword = sha256(password);

  const usuario = await prisma.usuario.findUnique({
    where: { email }
  });

  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  if (usuario.password !== hashedPassword) {
    throw new Error('Credenciales incorrectas');
  }

  return {
    id: usuario.id,
    email: usuario.email,
    rol: usuario.rol,
    nombreCompleto: usuario.nombreCompleto
  };
}



}

export const usuarioService = new UsuarioService();
