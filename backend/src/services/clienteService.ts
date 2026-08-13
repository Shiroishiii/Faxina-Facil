import { prisma } from '../lib/prisma'

interface ListClientesParams {
    page?: number
    limit?: number
    q?: string
    ativo?: boolean
}

interface ClienteData {
    nome: string
    documento: string
    email?: string | null
    telefone: string
    tipo: 'RESIDENCIAL' | 'COMERCIAL'
    logradouro: string
    numero: string
    complemento?: string | null
    bairro: string
    cidade: string
    estado: string
    cep: string
}

export const clienteService = {
    async list({ page = 1, limit = 10, q, ativo }: ListClientesParams) {
        const skip = (page - 1) * limit

        const where = {
            ...(ativo !== undefined && { ativo }),

            ...(q && {
                OR: [
                    {
                        nome: {
                            contains: q,
                            mode: 'insensitive' as const,
                        },
                    },
                    {
                        documento: {
                            contains: q,
                            mode: 'insensitive' as const,
                        },
                    },
                    {
                        telefone: {
                            contains: q,
                            mode: 'insensitive' as const,
                        },
                    },
                ],
            }),
        }

        const [data, total] = await Promise.all([
            prisma.cliente.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    nome: 'asc',
                },
            }),

            prisma.cliente.count({
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
        return prisma.cliente.findUnique({
            where: { id },
        })
    },

    async create(data: ClienteData) {
        return prisma.cliente.create({
            data,
        })
    },

    async update(id: string, data: Partial<ClienteData>) {
        return prisma.cliente.update({
            where: { id },
            data,
        })
    },

    async remove(id: string) {
        return prisma.cliente.update({
            where: { id },
            data: {
                ativo: false,
            },
        })
    },
}