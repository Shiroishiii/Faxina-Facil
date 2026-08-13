import type { Request } from 'express'

export interface AuthPayload {
    id: string
    email: string
    papel: 'ADMIN' | 'ATENDENTE'
}

export interface AuthRequest extends Request {
    user?: AuthPayload
}