import { Router } from 'express'

import { authMiddleware } from '../middlewares/authMiddleware'
import { dashboardController } from '../controllers/dashboardController'

const router = Router()

router.use(authMiddleware)

router.get('/', dashboardController.get)

export default router