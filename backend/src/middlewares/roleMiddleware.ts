import type { NextFunction, Response } from 'express'

import type { AuthRequest } from './authMiddleware'

type Papel = 'ADMIN' | 'ATENDENTE'

export function requireRole(...roles: Papel[]) {
    return (
        req: AuthRequest,
        res: Response,
        next: NextFunction,
    ) => {
        if (!req.user) {
            return res.status(401).json({
                message: 'Usuário não autenticado.',
            })
        }

        if (!roles.includes(req.user.papel)) {
            return res.status(403).json({
                message: 'Você não tem permissão para realizar esta ação.',
            })
        }

        next()
    }
}