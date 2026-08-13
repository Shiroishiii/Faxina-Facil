import type { AuthRequest } from '../types/express'
import type { Request, Response } from 'express'
import { agendamentoService } from '../services/agendamentoService'

export const agendamentoController = {
    async list(req: Request, res: Response) {
        try {
            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || 10
            const q =
                typeof req.query.q === 'string'
                    ? req.query.q
                    : undefined

            const status =
                typeof req.query.status === 'string'
                    ? req.query.status
                    : undefined

            const sort =
                req.query.sort === 'desc'
                    ? 'desc'
                    : 'asc'

            const result = await agendamentoService.list({
                page,
                limit,
                q,
                status,
                sort,
            })

            return res.json(result)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Erro ao buscar agendamentos.',
            })
        }
    },

    async getById(req: Request, res: Response) {
        try {
            const id = String(req.params.id)

            const agendamento =
                await agendamentoService.getById(id)

            if (!agendamento) {
                return res.status(404).json({
                    message: 'Agendamento não encontrado.',
                })
            }

            return res.json(agendamento)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Erro ao buscar agendamento.',
            })
        }
    },

    async create(req: AuthRequest, res: Response) {
        try {
            const usuarioId = req.user?.id

            const agendamento =
                await agendamentoService.create(
                    req.body,
                    usuarioId,
                )

            return res.status(201).json(agendamento)
        } catch (error) {
            console.error(error)

            if (error instanceof Error) {
                if (
                    error.message ===
                    'Cliente não encontrado ou inativo.'
                ) {
                    return res.status(404).json({
                        message: error.message,
                    })
                }

                if (
                    error.message ===
                    'Profissional não encontrado ou inativo.'
                ) {
                    return res.status(404).json({
                        message: error.message,
                    })
                }

                if (
                    error.message ===
                    'O profissional já possui um agendamento neste horário.'
                ) {
                    return res.status(409).json({
                        message: error.message,
                    })
                }

                if (
                    error.message ===
                        'A data de fim deve ser posterior à data de início.' ||
                    error.message ===
                        'Data de início inválida.' ||
                    error.message ===
                        'Data de fim inválida.'
                ) {
                    return res.status(400).json({
                        message: error.message,
                    })
                }
            }

            return res.status(500).json({
                message: 'Erro ao criar agendamento.',
            })
        }
    },

    async update(req: AuthRequest, res: Response) {
        try {
            const id = String(req.params.id)
            const usuarioId = req.user?.id

            const agendamento =
                await agendamentoService.update(
                    id,
                    req.body,
                    usuarioId,
                )

            return res.json(agendamento)
        } catch (error) {
            console.error(error)

            if (error instanceof Error) {
                if (
                    error.message ===
                    'Agendamento não encontrado.'
                ) {
                    return res.status(404).json({
                        message: error.message,
                    })
                }

                if (
                    error.message ===
                    'O profissional já possui um agendamento neste horário.'
                ) {
                    return res.status(409).json({
                        message: error.message,
                    })
                }

                if (
                    error.message ===
                    'A data de fim deve ser posterior à data de início.'
                ) {
                    return res.status(400).json({
                        message: error.message,
                    })
                }
            }

            return res.status(500).json({
                message: 'Erro ao atualizar agendamento.',
            })
        }
    },

    async remove(req: AuthRequest, res: Response) {
        try {
            const id = String(req.params.id)
            const usuarioId = req.user?.id

            const agendamento =
                await agendamentoService.remove(
                    id,
                    usuarioId,
                )

            return res.json(agendamento)
        } catch (error) {
            console.error(error)

            if (
                error instanceof Error &&
                error.message ===
                    'Agendamento não encontrado.'
            ) {
                return res.status(404).json({
                    message: error.message,
                })
            }

            return res.status(500).json({
                message: 'Erro ao cancelar agendamento.',
            })
        }
    },

    async history(req: Request, res: Response) {
        try {
            const id = String(req.params.id)

            const agendamento =
                await agendamentoService.getById(id)

            if (!agendamento) {
                return res.status(404).json({
                    message: 'Agendamento não encontrado.',
                })
            }

            const history =
                await agendamentoService.history(id)

            return res.json(history)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Erro ao buscar histórico.',
            })
        }
    },
}