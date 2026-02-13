// src/infrastructure/http/controllers/usuario.controller.js

import { usuarioService } from '../../../services/usuario.service.js';

export const usuarioController = {

    async crear(req, res) {
        try {
            const usuario = await usuarioService.crearUsuario(req.body);
            res.status(201).json(usuario);
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: error.message });
        }
    },

    async listar(req, res) {
        try {
            const usuarios = await usuarioService.obtenerUsuarios();
            res.json(usuarios);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },

    async obtenerPorId(req, res) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID debe ser un número válido' });
        }

        try {
            const usuario = await usuarioService.obtenerUsuarioPorId(id);

            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.json(usuario);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    },

    async actualizar(req, res) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID debe ser un número válido' });
        }

        try {
            const usuario = await usuarioService.actualizarUsuario(id, req.body);
            res.json(usuario);
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: error.message });
        }
    },

    async eliminar(req, res) {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID debe ser un número válido' });
        }

        try {
            await usuarioService.eliminarUsuario(id);
            res.json({ message: 'Usuario eliminado correctamente' });
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: error.message });
        }
    },


    async login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y password son requeridos' });
        }

        try {
            const usuario = await usuarioService.login(email, password);
            res.json(usuario);
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }



};
