import { Router } from 'express'

import { usuarioController } from '../controllers/usuarioController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { requireRole } from '../middlewares/roleMiddleware'

const router = Router()

router.post('/login', usuarioController.login)

router.get(
    '/me',
    authMiddleware,
    usuarioController.me,
)

router.get(
    '/',
    authMiddleware,
    requireRole('ADMIN'),
    usuarioController.list,
)

router.get(
    '/:id',
    authMiddleware,
    requireRole('ADMIN'),
    usuarioController.getById,
)

router.post(
    '/',
    authMiddleware,
    requireRole('ADMIN'),
    usuarioController.create,
)

router.patch(
    '/:id',
    authMiddleware,
    requireRole('ADMIN'),
    usuarioController.update,
)

router.delete(
    '/:id',
    authMiddleware,
    requireRole('ADMIN'),
    usuarioController.remove,
)



export default router