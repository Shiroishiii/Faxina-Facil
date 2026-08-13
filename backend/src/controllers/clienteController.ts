import type { Request, Response } from 'express'
import { clienteService } from '../services/clienteService'

export const clienteController = {
    async list(req: Request, res: Response) {
        try {
            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || 10

            const q =
                typeof req.query.q === 'string'
                    ? req.query.q
                    : undefined

            const ativo =
                req.query.ativo === undefined
                    ? undefined
                    : req.query.ativo === 'true'

            const result = await clienteService.list({
                page,
                limit,
                q,
                ativo,
            })

            return res.json(result)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Erro ao buscar clientes.',
            })
        }
    },

    async getById(req: Request, res: Response) {
        try {
            const id = String(req.params.id)

            const cliente = await clienteService.getById(id)

            if (!cliente) {
                return res.status(404).json({
                    message: 'Cliente não encontrado.',
                })
            }

            return res.json(cliente)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Erro ao buscar cliente.',
            })
        }
    },

    async create(req: Request, res: Response) {
        try {
            const cliente = await clienteService.create(req.body)

            return res.status(201).json(cliente)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Erro ao cadastrar cliente.',
            })
        }
    },

    async update(req: Request, res: Response) {
        try {
            const id = String(req.params.id)

            const existing = await clienteService.getById(id)

            if (!existing) {
                return res.status(404).json({
                    message: 'Cliente não encontrado.',
                })
            }

            const cliente = await clienteService.update(id, req.body)

            return res.json(cliente)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Erro ao atualizar cliente.',
            })
        }
    },

    async remove(req: Request, res: Response) {
        try {
            const id = String(req.params.id)

            const existing = await clienteService.getById(id)

            if (!existing) {
                return res.status(404).json({
                    message: 'Cliente não encontrado.',
                })
            }

            const cliente = await clienteService.remove(id)

            return res.json(cliente)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Erro ao desativar cliente.',
            })
        }
    },
}