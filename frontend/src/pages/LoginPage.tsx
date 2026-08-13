import { zodResolver } from '@hookform/resolvers/zod'
import { LockKeyhole } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { useAuth } from '../contexts/AuthContext'
import { getApiError } from '../hooks/useApiError'

const schema = z.object({
    email: z.email('Informe um e-mail válido.'),
    senha: z.string().min(1, 'Informe a senha.'),
})

type LoginForm = z.infer<typeof schema>

export function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginForm>({
        resolver: zodResolver(schema),
    })

    const submit = async (data: LoginForm) => {
        try {
            await login(data.email, data.senha)

            navigate('/')
            toast.success('Login realizado com sucesso.')
        } catch (error) {
            toast.error(getApiError(error))
        }
    }

    return (
        <main className="grid min-h-screen place-items-center bg-gradient-to-br from-blue-950 via-blue-800 to-slate-700 p-5">
            <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-blue-600 text-white">
                        <LockKeyhole />
                    </div>

                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                        Faxina Fácil
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        Bem-vindo
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Acesse a gestão de agendamentos.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(submit)}
                    className="space-y-5"
                >
                    <label className="block text-sm font-semibold">
                        E-mail

                        <input
                            autoComplete="email"
                            className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            {...register('email')}
                        />
                    </label>

                    {errors.email && (
                        <p className="-mt-3 text-sm text-rose-600">
                            {errors.email.message}
                        </p>
                    )}

                    <label className="block text-sm font-semibold">
                        Senha

                        <input
                            type="password"
                            autoComplete="current-password"
                            className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            {...register('senha')}
                        />
                    </label>

                    {errors.senha && (
                        <p className="-mt-3 text-sm text-rose-600">
                            {errors.senha.message}
                        </p>
                    )}

                    <button
                        disabled={isSubmitting}
                        className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                        {isSubmitting ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </section>
        </main>
    )
}