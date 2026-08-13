import { prisma } from '../lib/prisma'

export const dashboardService = {
    async get() {
        const agora = new Date()

        const proximas24Horas = new Date(
            agora.getTime() + 24 * 60 * 60 * 1000,
        )

        const [
            total,
            pendentes,
            confirmados,
            concluidos,
            alertas,
        ] = await Promise.all([
            prisma.agendamento.count(),

            prisma.agendamento.count({
                where: {
                    status: 'PENDENTE',
                },
            }),

            prisma.agendamento.count({
                where: {
                    status: 'CONFIRMADO',
                },
            }),

            prisma.agendamento.count({
                where: {
                    status: 'CONCLUIDO',
                },
            }),

            prisma.agendamento.findMany({
                where: {
                    dataHoraInicio: {
                        gte: agora,
                        lte: proximas24Horas,
                    },
                    status: {
                        not: 'CANCELADO',
                    },
                },
                orderBy: {
                    dataHoraInicio: 'asc',
                },
                take: 10,
            }),
        ])

        return {
            cards: {
                total,
                pendentes,
                confirmados,
                concluidos,
            },

            alertas: alertas.map((agendamento) => ({
                id: agendamento.id,
                mensagem: agendamento.descricao
                    || 'Agendamento próximo.',
                dataHoraInicio: agendamento.dataHoraInicio,
                tipo: agendamento.tipo,
            })),
        }
    },
}