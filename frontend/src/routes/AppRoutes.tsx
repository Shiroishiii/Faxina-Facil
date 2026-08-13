import { Navigate, Route, Routes } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'
import { AppLayout } from '../layouts/AppLayout'
import { AgendamentosPage } from '../pages/AgendamentosPage'
import { ClientesPage } from '../pages/ClientesPage'
import { DashboardPage } from '../pages/DashboardPage'
import { LoginPage } from '../pages/LoginPage'
import { ProfissionaisPage } from '../pages/ProfissionaisPage'

function Protected() {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <main className="grid min-h-screen place-items-center text-slate-500">
                Carregando...
            </main>
        )
    }

    return user ? <AppLayout /> : <Navigate to="/login" replace />
}

function Guest() {
    const { user, loading } = useAuth()

    if (loading) {
        return null
    }

    return user ? <Navigate to="/" replace /> : <LoginPage />
}

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Guest />} />

            <Route element={<Protected />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/clientes" element={<ClientesPage />} />
                <Route
                    path="/profissionais"
                    element={<ProfissionaisPage />}
                />
                <Route
                    path="/agendamentos"
                    element={<AgendamentosPage />}
                />
                <Route
                    path="/gestao-agendamentos"
                    element={<AgendamentosPage management />}
                />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}