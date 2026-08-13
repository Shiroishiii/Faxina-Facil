/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

import { authService } from '../services/auth.service'
import type { Usuario } from '../types'

type AuthContextValue = { user: Usuario | null; loading: boolean; login: (email: string, senha: string) => Promise<void>; logout: () => void }
const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('faxina.token')))

  useEffect(() => {
    if (!localStorage.getItem('faxina.token')) return
    authService.me().then(setUser).catch(() => localStorage.removeItem('faxina.token')).finally(() => setLoading(false))
  }, [])

  const login = async (email: string, senha: string) => {
    const session = await authService.login(email, senha)
    localStorage.setItem('faxina.token', session.token)
    setUser(session.user)
  }
  const logout = () => { localStorage.removeItem('faxina.token'); setUser(null) }
  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider.')
  return context
}
