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
    console.log(` Intento de login para: ${email}`);
    
    
    const hashedPassword = sha256(password);

    
    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      console.log(" Usuario no encontrado en BD");
      throw new Error('Usuario no encontrado');
    }

   
    console.log(`   Hash BaseDatos: ${usuario.password.substring(0, 10)}...`);
    console.log(`   Hash Recibido:  ${hashedPassword.substring(0, 10)}...`);

    if (usuario.password !== hashedPassword) {
      console.log(" Contraseña incorrecta");
      throw new Error('Credenciales incorrectas');
    }

    console.log(" Login exitoso");

    return {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      nombreCompleto: usuario.nombreCompleto,
      nombre: usuario.nombreCompleto, 
      token: "demo-token-123" 
    };
  }
}

export const usuarioService = new UsuarioService();