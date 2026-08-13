import {
    CalendarDays,
    ClipboardList,
    LayoutDashboard,
    LogOut,
    Menu,
    Users,
    Wrench,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'

const links = [
    {
        to: '/',
        label: 'Dashboard',
        icon: LayoutDashboard,
    },
    {
        to: '/clientes',
        label: 'Clientes',
        icon: Users,
    },
    {
        to: '/profissionais',
        label: 'Profissionais',
        icon: Wrench,
    },
    {
        to: '/agendamentos',
        label: 'Agendamentos',
        icon: CalendarDays,
    },
    {
        to: '/gestao-agendamentos',
        label: 'Gestão de agenda',
        icon: ClipboardList,
    },
]

export function AppLayout({ children }: { children?: ReactNode }) {
    const { user, logout } = useAuth()
    const [open, setOpen] = useState(false)

    return (
        <>
            <aside
                className={`fixed inset-y-0 z-30 w-64 bg-blue-950 p-5 text-slate-100 transition-transform md:translate-x-0 ${
                    open ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="mb-8 text-2xl font-bold">
                    Faxina Fácil
                </div>

                <nav className="space-y-2">
                    {links.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            end={to === '/'}
                            key={to}
                            to={to}
                            onClick={() => setOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${
                                    isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-blue-100 hover:bg-blue-900'
                                }`
                            }
                        >
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="absolute bottom-5 left-5 right-5">
                    <div className="mb-3 rounded-xl bg-blue-900/50 p-3">
                        <p className="font-semibold">
                            {user?.nome}
                        </p>

                        <p className="text-xs text-blue-200">
                            {user?.papel}
                        </p>
                    </div>

                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-blue-100 hover:bg-blue-900"
                    >
                        <LogOut size={18} />
                        Sair
                    </button>
                </div>
            </aside>

            <button
                className="fixed left-4 top-4 z-40 rounded-lg bg-blue-950 p-2 text-white md:hidden"
                onClick={() => setOpen(true)}
            >
                <Menu size={22} />
            </button>

            <main className="min-h-screen bg-slate-50 md:ml-64">
                <div className="p-5 pt-16 md:p-8">
                    {children ?? <Outlet />}
                </div>
            </main>
        </>
    )
}