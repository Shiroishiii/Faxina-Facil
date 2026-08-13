import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { AuthProvider } from './contexts/AuthContext'
import { AppRoutes } from './routes/AppRoutes'

export function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />

                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            borderRadius: '12px',
                        },
                    }}
                />
            </AuthProvider>
        </BrowserRouter>
    )
}