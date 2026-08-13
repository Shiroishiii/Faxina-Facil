import { Router } from 'express'

import { agendamentoController } from '../controllers/agendamentoController'
import { authMiddleware } from '../middlewares/authMiddleware'

const router = Router()

router.use(authMiddleware)

router.get('/', agendamentoController.list)

router.get('/:id/historico', agendamentoController.history)

router.get('/:id', agendamentoController.getById)

router.post('/', agendamentoController.create)

router.patch('/:id', agendamentoController.update)

router.delete('/:id', agendamentoController.remove)

export default router