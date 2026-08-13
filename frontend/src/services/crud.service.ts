import { api } from './api'

import type {
    Agendamento,
    Cliente,
    Dashboard,
    Disponibilidade,
    Paginated,
    Profissional,
} from '../types'

type Query = Record<string, string | number | boolean | undefined>

const params = (query: Query) =>
    Object.fromEntries(
        Object.entries(query).filter(
            ([, value]) => value !== undefined && value !== '',
        ),
    )

export const clientService = {
    list: async (query: Query) =>
        (
            await api.get<Paginated>('/clientes', {
                params: params(query),
            })
        ).data,

    save: async (data: Partial<Cliente> & { id?: string }) =>
        data.id
            ? (await api.patch(`/clientes/${data.id}`, data)).data
            : (await api.post('/clientes', data)).data,

    remove: async (id: string) => api.delete(`/clientes/${id}`),
}

export const professionalService = {
    list: async (query: Query) =>
        (
            await api.get<Paginated>('/profissionais', {
                params: params(query),
            })
        ).data,

    save: async (data: Partial<Profissional> & { id?: string }) =>
        data.id
            ? (await api.patch(`/profissionais/${data.id}`, data)).data
            : (await api.post('/profissionais', data)).data,

    remove: async (id: string) => api.delete(`/profissionais/${id}`),

    availability: async (id: string, data?: string) =>
        (
            await api.get<Disponibilidade[]>(
                `/profissionais/${id}/disponibilidades`,
                {
                    params: data ? { data } : undefined,
                },
            )
        ).data,

    addAvailability: async (
        id: string,
        value: Record<string, unknown>,
    ) =>
        (
            await api.post(
                `/profissionais/${id}/disponibilidades`,
                value,
            )
        ).data,

    removeAvailability: async (
        id: string,
        availabilityId: string,
    ) =>
        api.delete(
            `/profissionais/${id}/disponibilidades/${availabilityId}`,
        ),
}

export const appointmentService = {
    list: async (query: Query) =>
        (
            await api.get<Paginated>('/agendamentos', {
                params: params(query),
            })
        ).data,

    get: async (id: string) =>
        (await api.get(`/agendamentos/${id}`)).data,

    save: async (
        data: Record<string, unknown> & { id?: string },
    ) =>
        data.id
            ? (await api.patch(`/agendamentos/${data.id}`, data)).data
            : (await api.post('/agendamentos', data)).data,

    remove: async (id: string) => api.delete(`/agendamentos/${id}`),

    history: async (id: string) =>
        (await api.get(`/agendamentos/${id}/historico`)).data,
}

export const dashboardService = {
    get: async () => (await api.get('/dashboard')).data,
}