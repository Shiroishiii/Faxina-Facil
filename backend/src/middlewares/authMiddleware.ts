import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthPayload {
    id: string
    email: string
    papel: 'ADMIN' | 'ATENDENTE'
}

export interface AuthRequest extends Request {
    user?: AuthPayload
}

const getJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET

    if (!secret) {
        throw new Error('JWT_SECRET não configurado no .env')
    }

    return secret
}

export function authMiddleware(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) {
    const authorization = req.headers.authorization

    if (!authorization) {
        return res.status(401).json({
            message: 'Token não informado.',
        })
    }

    const [type, token] = authorization.split(' ')

    if (type !== 'Bearer' || !token) {
        return res.status(401).json({
            message: 'Formato de token inválido.',
        })
    }

    try {
        const decoded = jwt.verify(token, getJwtSecret())

        if (
            typeof decoded !== 'object' ||
            !decoded ||
            typeof decoded.id !== 'string' ||
            typeof decoded.email !== 'string' ||
            (decoded.papel !== 'ADMIN' &&
                decoded.papel !== 'ATENDENTE')
        ) {
            return res.status(401).json({
                message: 'Token inválido.',
            })
        }

        req.user = {
            id: decoded.id,
            email: decoded.email,
            papel: decoded.papel,
        }

        next()
    } catch (error) {
        console.error(error)

        return res.status(401).json({
            message: 'Token inválido ou expirado.',
        })
    }
}