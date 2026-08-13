import { prisma } from '../lib/prisma'

interface ListAgendamentosParams {
    page?: number
    limit?: number
    q?: string
    status?: string
    sort?: 'asc' | 'desc'
}

interface CreateAgendamentoData {
    clienteId: string
    profissionalId?: string | null
    tipo: 'RESIDENCIAL' | 'COMERCIAL'
    status?:
        | 'PENDENTE'
        | 'CONFIRMADO'
        | 'EM_ANDAMENTO'
        | 'CONCLUIDO'
        | 'CANCELADO'
    dataHoraInicio: string
    dataHoraFim: string
    enderecoServico: string
    descricao?: string | null
    valor?: number | string | null
    observacao?: string | null
}

export const agendamentoService = {
    async list({
        page = 1,
        limit = 10,
        q,
        status,
        sort = 'asc',
    }: ListAgendamentosParams) {
        const skip = (page - 1) * limit

        const where = {
            ...(status && {
                status: status as
                    | 'PENDENTE'
                    | 'CONFIRMADO'
                    | 'EM_ANDAMENTO'
                    | 'CONCLUIDO'
                    | 'CANCELADO',
            }),

            ...(q && {
                OR: [
                    {
                        cliente: {
                            nome: {
                                contains: q,
                                mode: 'insensitive' as const,
                            },
                        },
                    },
                    {
                        profissional: {
                            nome: {
                                contains: q,
                                mode: 'insensitive' as const,
                            },
                        },
                    },
                    {
                        enderecoServico: {
                            contains: q,
                            mode: 'insensitive' as const,
                        },
                    },
                ],
            }),
        }

        const [data, total] = await Promise.all([
            prisma.agendamento.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    dataHoraInicio: sort,
                },
                include: {
                    cliente: true,
                    profissional: true,
                },
            }),

            prisma.agendamento.count({
                where,
            }),
        ])

        return {
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        }
    },

    async getById(id: string) {
        return prisma.agendamento.findUnique({
            where: {
                id,
            },
            include: {
                cliente: true,
                profissional: true,
                historicos: {
                    include: {
                        usuario: {
                            select: {
                                id: true,
                                nome: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        })
    },

    async create(
        data: CreateAgendamentoData,
        usuarioId?: string,
    ) {
        const inicio = new Date(data.dataHoraInicio)
        const fim = new Date(data.dataHoraFim)

        if (Number.isNaN(inicio.getTime())) {
            throw new Error('Data de início inválida.')
        }

        if (Number.isNaN(fim.getTime())) {
            throw new Error('Data de fim inválida.')
        }

        if (fim <= inicio) {
            throw new Error(
                'A data de fim deve ser posterior à data de início.',
            )
        }

        const cliente = await prisma.cliente.findUnique({
            where: {
                id: data.clienteId,
            },
        })

        if (!cliente || !cliente.ativo) {
            throw new Error('Cliente não encontrado ou inativo.')
        }

        if (data.profissionalId) {
            const profissional =
                await prisma.profissional.findUnique({
                    where: {
                        id: data.profissionalId,
                    },
                })

            if (!profissional || !profissional.ativo) {
                throw new Error(
                    'Profissional não encontrado ou inativo.',
                )
            }

            const conflito =
                await prisma.agendamento.findFirst({
                    where: {
                        profissionalId: data.profissionalId,
                        status: {
                            not: 'CANCELADO',
                        },
                        dataHoraInicio: {
                            lt: fim,
                        },
                        dataHoraFim: {
                            gt: inicio,
                        },
                    },
                })

            if (conflito) {
                throw new Error(
                    'O profissional já possui um agendamento neste horário.',
                )
            }
        }

        const agendamento = await prisma.agendamento.create({
            data: {
                clienteId: data.clienteId,
                profissionalId: data.profissionalId || null,
                tipo: data.tipo,
                status: data.status ?? 'PENDENTE',
                dataHoraInicio: inicio,
                dataHoraFim: fim,
                enderecoServico: data.enderecoServico,
                descricao: data.descricao || null,
                valor:
                    data.valor === null ||
                    data.valor === undefined ||
                    data.valor === ''
                        ? null
                        : Number(data.valor),
                observacao: data.observacao || null,
            },
            include: {
                cliente: true,
                profissional: true,
            },
        })

        await prisma.historicoAgendamento.create({
            data: {
                agendamentoId: agendamento.id,
                usuarioId: usuarioId || null,
                acao: 'CRIADO',
                observacao: 'Agendamento criado.',
            },
        })

        return agendamento
    },

    async update(
        id: string,
        data: Partial<CreateAgendamentoData>,
        usuarioId?: string,
    ) {
        const existing = await prisma.agendamento.findUnique({
            where: {
                id,
            },
        })

        if (!existing) {
            throw new Error('Agendamento não encontrado.')
        }

        const inicio = data.dataHoraInicio
            ? new Date(data.dataHoraInicio)
            : existing.dataHoraInicio

        const fim = data.dataHoraFim
            ? new Date(data.dataHoraFim)
            : existing.dataHoraFim

        if (fim <= inicio) {
            throw new Error(
                'A data de fim deve ser posterior à data de início.',
            )
        }

        const profissionalId =
            data.profissionalId !== undefined
                ? data.profissionalId
                : existing.profissionalId

        if (profissionalId) {
            const conflito =
                await prisma.agendamento.findFirst({
                    where: {
                        id: {
                            not: id,
                        },
                        profissionalId,
                        status: {
                            not: 'CANCELADO',
                        },
                        dataHoraInicio: {
                            lt: fim,
                        },
                        dataHoraFim: {
                            gt: inicio,
                        },
                    },
                })

            if (conflito) {
                throw new Error(
                    'O profissional já possui um agendamento neste horário.',
                )
            }
        }

        const agendamento =
            await prisma.agendamento.update({
                where: {
                    id,
                },
                data: {
                    ...(data.clienteId && {
                        clienteId: data.clienteId,
                    }),
                    ...(data.profissionalId !== undefined && {
                        profissionalId:
                            data.profissionalId || null,
                    }),
                    ...(data.tipo && {
                        tipo: data.tipo,
                    }),
                    ...(data.status && {
                        status: data.status,
                    }),
                    ...(data.dataHoraInicio && {
                        dataHoraInicio: inicio,
                    }),
                    ...(data.dataHoraFim && {
                        dataHoraFim: fim,
                    }),
                    ...(data.enderecoServico !== undefined && {
                        enderecoServico: data.enderecoServico,
                    }),
                    ...(data.descricao !== undefined && {
                        descricao: data.descricao || null,
                    }),
                    ...(data.valor !== undefined && {
                        valor:
                            data.valor === null ||
                            data.valor === ''
                                ? null
                                : Number(data.valor),
                    }),
                    ...(data.observacao !== undefined && {
                        observacao: data.observacao || null,
                    }),
                },
                include: {
                    cliente: true,
                    profissional: true,
                },
            })

        await prisma.historicoAgendamento.create({
            data: {
                agendamentoId: id,
                usuarioId: usuarioId || null,
                acao: 'ATUALIZADO',
                observacao: 'Agendamento atualizado.',
            },
        })

        return agendamento
    },

    async remove(id: string, usuarioId?: string) {
        const existing = await prisma.agendamento.findUnique({
            where: {
                id,
            },
        })

        if (!existing) {
            throw new Error('Agendamento não encontrado.')
        }

        const agendamento =
            await prisma.agendamento.update({
                where: {
                    id,
                },
                data: {
                    status: 'CANCELADO',
                },
                include: {
                    cliente: true,
                    profissional: true,
                },
            })

        await prisma.historicoAgendamento.create({
            data: {
                agendamentoId: id,
                usuarioId: usuarioId || null,
                acao: 'CANCELADO',
                observacao: 'Agendamento cancelado.',
            },
        })

        return agendamento
    },

    async history(id: string) {
        return prisma.historicoAgendamento.findMany({
            where: {
                agendamentoId: id,
            },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
    },
}