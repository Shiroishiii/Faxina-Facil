import type { Request, Response } from 'express'
import type { AuthRequest } from '../types/express'

import { usuarioService } from '../services/usuarioService'

export const usuarioController = {
    async list(_req: Request, res: Response) {
        try {
            const usuarios = await usuarioService.list()

            return res.json(usuarios)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Erro ao buscar usuários.',
            })
        }
    },

    async getById(req: Request, res: Response) {
        try {
            const id = String(req.params.id)

            const usuario = await usuarioService.getById(id)

            if (!usuario) {
                return res.status(404).json({
                    message: 'Usuário não encontrado.',
                })
            }

            return res.json(usuario)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Erro ao buscar usuário.',
            })
        }
    },

    async create(req: Request, res: Response) {
        try {
            const { nome, email, senha, papel } = req.body

            if (!nome || !email || !senha || !papel) {
                return res.status(400).json({
                    message:
                        'Nome, e-mail, senha e papel são obrigatórios.',
                })
            }

            const usuario = await usuarioService.create({
                nome,
                email,
                senha,
                papel,
            })

            return res.status(201).json(usuario)
        } catch (error) {
            console.error(error)

            if (
                error instanceof Error &&
                error.message === 'E-mail já cadastrado.'
            ) {
                return res.status(409).json({
                    message: error.message,
                })
            }

            return res.status(500).json({
                message: 'Erro ao cadastrar usuário.',
            })
        }
    },

    async login(req: Request, res: Response) {
        try {
            const { email, senha } = req.body

            if (!email || !senha) {
                return res.status(400).json({
                    message: 'E-mail e senha são obrigatórios.',
                })
            }

            const result = await usuarioService.login(
                email,
                senha,
            )

            return res.json(result)
        } catch (error) {
            console.error(error)

            if (
                error instanceof Error &&
                error.message === 'E-mail ou senha inválidos.'
            ) {
                return res.status(401).json({
                    message: error.message,
                })
            }

            return res.status(500).json({
                message: 'Erro ao realizar login.',
            })
        }
    },

    async update(req: Request, res: Response) {
        try {
            const id = String(req.params.id)

            const existing = await usuarioService.getById(id)

            if (!existing) {
                return res.status(404).json({
                    message: 'Usuário não encontrado.',
                })
            }

            const usuario = await usuarioService.update(
                id,
                req.body,
            )

            return res.json(usuario)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Erro ao atualizar usuário.',
            })
        }
    },

    async remove(req: Request, res: Response) {
        try {
            const id = String(req.params.id)

            const existing = await usuarioService.getById(id)

            if (!existing) {
                return res.status(404).json({
                    message: 'Usuário não encontrado.',
                })
            }

            const usuario = await usuarioService.remove(id)

            return res.json(usuario)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Erro ao desativar usuário.',
            })
        }
    },

    async me(req: AuthRequest, res: Response) {
        try {
            const id = req.user?.id

            if (!id) {
                return res.status(401).json({
                    message: 'Não autenticado.',
                })
            }

            const usuario = await usuarioService.getById(id)

            if (!usuario) {
                return res.status(404).json({
                    message: 'Usuário não encontrado.',
                })
            }

            return res.json(usuario)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Erro ao buscar usuário autenticado.',
            })
        }
    }
}