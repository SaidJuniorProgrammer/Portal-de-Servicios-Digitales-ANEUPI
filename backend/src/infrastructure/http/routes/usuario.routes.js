import { Router } from 'express';
import { usuarioController } from '../controllers/usuario.controller.js';

export const usuarioRoutes = Router();

/**
 * @swagger
 * /api/usuarios/login:
 * post:
 * summary: Iniciar Sesion
 * tags: [Usuarios]
 */
usuarioRoutes.post('/login', usuarioController.login);

/**
 * @swagger
 * /api/usuarios:
 * post:
 * summary: Crear usuario
 * tags: [Usuarios]
 */
usuarioRoutes.post('/', usuarioController.crear);

/**
 * @swagger
 * /api/usuarios:
 * get:
 * summary: Listar usuarios
 * tags: [Usuarios]
 */
usuarioRoutes.get('/', usuarioController.listar);

/**
 * @swagger
 * /api/usuarios/{id}:
 * get:
 * summary: Ver usuario
 * tags: [Usuarios]
 */
usuarioRoutes.get('/:id', usuarioController.obtenerPorId);

/**
 * @swagger
 * /api/usuarios/{id}:
 * put:
 * summary: Editar usuario
 * tags: [Usuarios]
 */
usuarioRoutes.put('/:id', usuarioController.actualizar);

/**
 * @swagger
 * /api/usuarios/{id}:
 * delete:
 * summary: Borrar usuario
 * tags: [Usuarios]
 */
usuarioRoutes.delete('/:id', usuarioController.eliminar);