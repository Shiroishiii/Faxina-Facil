import type { Request, Response } from 'express'
import { profissionalService } from '../services/profissionalService'

export const profissionalController = {
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

            const result = await profissionalService.list({
                page,
                limit,
                q,
                ativo,
            })

            return res.json(result)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Erro ao buscar profissionais.',
            })
        }
    },

    async getById(req: Request, res: Response) {
        try {
            const id = String(req.params.id)

            const profissional = await profissionalService.getById(id)

            if (!profissional) {
                return res.status(404).json({
                    message: 'Profissional não encontrado.',
                })
            }

            return res.json(profissional)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Erro ao buscar profissional.',
            })
        }
    },

    async create(req: Request, res: Response) {
        try {
            const profissional = await profissionalService.create(req.body)

            return res.status(201).json(profissional)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Erro ao cadastrar profissional.',
            })
        }
    },

    async update(req: Request, res: Response) {
        try {
            const id = String(req.params.id)

            const existing = await profissionalService.getById(id)

            if (!existing) {
                return res.status(404).json({
                    message: 'Profissional não encontrado.',
                })
            }

            const profissional = await profissionalService.update(
                id,
                req.body,
            )

            return res.json(profissional)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Erro ao atualizar profissional.',
            })
        }
    },

    async remove(req: Request, res: Response) {
        try {
            const id = String(req.params.id)

            const existing = await profissionalService.getById(id)

            if (!existing) {
                return res.status(404).json({
                    message: 'Profissional não encontrado.',
                })
            }

            const profissional = await profissionalService.remove(id)

            return res.json(profissional)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Erro ao desativar profissional.',
            })
        }
    },

    async getAvailability(req: Request, res: Response) {
        try {
            const profissionalId = String(req.params.id)

            const data =
                typeof req.query.data === 'string'
                    ? req.query.data
                    : undefined

            const disponibilidade =
                await profissionalService.getAvailability(
                    profissionalId,
                    data,
                )

            return res.json(disponibilidade)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Erro ao buscar disponibilidades.',
            })
        }
    },

    async addAvailability(req: Request, res: Response) {
        try {
            const profissionalId = String(req.params.id)

            const disponibilidade =
                await profissionalService.addAvailability(
                    profissionalId,
                    req.body,
                )

            return res.status(201).json(disponibilidade)
        } catch (error) {
            console.error(error)

            if (
                error instanceof Error &&
                error.message === 'Profissional não encontrado.'
            ) {
                return res.status(404).json({
                    message: error.message,
                })
            }

            return res.status(500).json({
                message: 'Erro ao adicionar disponibilidade.',
            })
        }
    },

    async removeAvailability(req: Request, res: Response) {
        try {
            const profissionalId = String(req.params.id)
            const availabilityId = String(
                req.params.availabilityId,
            )

            const disponibilidade =
                await profissionalService.removeAvailability(
                    profissionalId,
                    availabilityId,
                )

            return res.json(disponibilidade)
        } catch (error) {
            console.error(error)

            if (
                error instanceof Error &&
                error.message === 'Disponibilidade não encontrada.'
            ) {
                return res.status(404).json({
                    message: error.message,
                })
            }

            return res.status(500).json({
                message: 'Erro ao remover disponibilidade.',
            })
        }
    },
}