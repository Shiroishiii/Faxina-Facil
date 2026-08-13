import type { Request, Response } from 'express'
import { dashboardService } from '../services/DashboardService'

export const dashboardController = {
    async get(_req: Request, res: Response) {
        try {
            const dashboard = await dashboardService.get()

            return res.json(dashboard)
        } catch (error) {
            console.error(error)

            return res.status(500).json({
                message: 'Erro ao carregar dashboard.',
            })
        }
    },
}