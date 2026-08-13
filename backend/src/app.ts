import cors from 'cors'
import express from 'express'

import authRoutes from './routes/authRoutes'
import clienteRoutes from './routes/clienteRoutes'
import profissionalRoutes from './routes/profissionalRoutes'
import usuarioRoutes from './routes/usuarioRoutes'
import agendamentoRoutes from './routes/agendamentoRoutes'
import dashboardRoutes from './routes/dashboardRoutes'
import { authMiddleware } from './middlewares/authMiddleware'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
    res.json({
        message: 'API funcionando!',
    })
})

app.use('/auth', authRoutes)

app.use('/usuarios', usuarioRoutes)

app.use('/clientes', authMiddleware, clienteRoutes)
app.use('/profissionais', authMiddleware, profissionalRoutes)
app.use('/agendamentos', authMiddleware, agendamentoRoutes)
app.use('/dashboard', authMiddleware, dashboardRoutes)

export default app