import { Router } from 'express'
import { profissionalController } from '../controllers/profissionalController'
import { authMiddleware } from '../middlewares/authMiddleware'

const router = Router()

router.get(
    '/:id/disponibilidades',
    authMiddleware,
    profissionalController.getAvailability,
)

router.post(
    '/:id/disponibilidades',
    authMiddleware,
    profissionalController.addAvailability,
)

router.delete(
    '/:id/disponibilidades/:availabilityId',
    authMiddleware,
    profissionalController.removeAvailability,
)

router.get('/', profissionalController.list)

router.get('/:id', profissionalController.getById)

router.post('/', profissionalController.create)

router.patch('/:id', profissionalController.update)

router.delete('/:id', profissionalController.remove)


export default router