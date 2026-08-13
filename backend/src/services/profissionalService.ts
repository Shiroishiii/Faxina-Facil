import { prisma } from '../lib/prisma'

interface ListProfissionaisParams {
    page?: number
    limit?: number
    q?: string
    ativo?: boolean
}

interface ProfissionalData {
    nome: string
    documento: string
    email?: string | null
    telefone: string
    especialidade?: string | null
}

export const profissionalService = {
    async list({
        page = 1,
        limit = 10,
        q,
        ativo,
    }: ListProfissionaisParams) {
        const skip = (page - 1) * limit

        const where = {
            ...(ativo !== undefined && {
                ativo,
            }),

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
                    {
                        especialidade: {
                            contains: q,
                            mode: 'insensitive' as const,
                        },
                    },
                ],
            }),
        }

        const [data, total] = await Promise.all([
            prisma.profissional.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    nome: 'asc',
                },
            }),

            prisma.profissional.count({
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
        return prisma.profissional.findUnique({
            where: {
                id,
            },
        })
    },

    async create(data: ProfissionalData) {
        return prisma.profissional.create({
            data,
        })
    },

    async update(id: string, data: Partial<ProfissionalData>) {
        return prisma.profissional.update({
            where: {
                id,
            },
            data,
        })
    },

    async remove(id: string) {
        return prisma.profissional.update({
            where: {
                id,
            },
            data: {
                ativo: false,
            },
        })
    },
    
    async getAvailability(profissionalId: string, data?: string) {
        return prisma.disponibilidade.findMany({
            where: {
                profissionalId,
                ...(data && {
                    data: {
                        gte: new Date(`${data}T00:00:00.000Z`),
                        lt: new Date(`${data}T23:59:59.999Z`),
                    },
                }),
            },
            orderBy: [
                {
                    data: 'asc',
                },
                {
                    horaInicio: 'asc',
                },
            ],
        })
    },

    async addAvailability(
        profissionalId: string,
        data: {
            data: string
            horaInicio: string
            horaFim: string
            disponivel?: boolean
            observacao?: string
        },
    ) {
        const profissional = await prisma.profissional.findUnique({
            where: {
                id: profissionalId,
            },
        })

        if (!profissional) {
            throw new Error('Profissional não encontrado.')
        }

        return prisma.disponibilidade.create({
            data: {
                profissionalId,
                data: new Date(data.data),
                horaInicio: new Date(data.horaInicio),
                horaFim: new Date(data.horaFim),
                disponivel: data.disponivel ?? true,
                observacao: data.observacao || null,
            },
        })
    },

    async removeAvailability(
        profissionalId: string,
        availabilityId: string,
    ) {
        const availability =
            await prisma.disponibilidade.findFirst({
                where: {
                    id: availabilityId,
                    profissionalId,
                },
            })

        if (!availability) {
            throw new Error('Disponibilidade não encontrada.')
        }

        return prisma.disponibilidade.delete({
            where: {
                id: availabilityId,
            },
        })
    },
}