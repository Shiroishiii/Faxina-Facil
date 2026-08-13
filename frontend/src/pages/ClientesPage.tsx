import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

import { Modal } from '../components/Modal'
import { Pagination } from '../components/Pagination'
import { TypeBadge } from '../components/StatusBadge'
import { getApiError } from '../hooks/useApiError'
import { clientService } from '../services/crud.service'
import type { Cliente, Paginated } from '../types'

const schema = z.object({
    nome: z.string().min(3),
    documento: z.string().min(11),
    email: z.email().or(z.literal('')),
    telefone: z.string().min(8),
    tipo: z.enum(['RESIDENCIAL', 'COMERCIAL']),
    logradouro: z.string().min(3),
    numero: z.string().min(1),
    complemento: z.string(),
    bairro: z.string().min(2),
    cidade: z.string().min(2),
    estado: z.string().length(2),
    cep: z.string().min(8),
})

type Form = z.infer<typeof schema>

const empty: Form = {
    nome: '',
    documento: '',
    email: '',
    telefone: '',
    tipo: 'RESIDENCIAL',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
}

const input =
    'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

export function ClientesPage() {
    const [result, setResult] = useState<Paginated | null>(null)
    const [page, setPage] = useState(1)
    const [query, setQuery] = useState('')
    const [editing, setEditing] = useState<Cliente | null>(null)
    const [modal, setModal] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: empty,
    })

    const load = useCallback(async () => {
        try {
            setResult(
                await clientService.list({
                    page,
                    limit: 10,
                    q: query,
                }),
            )
        } catch (error) {
            toast.error(getApiError(error))
        }
    }, [page, query])

    useEffect(() => {
        void load()
    }, [load])

    const open = (value?: Cliente) => {
        setEditing(value ?? null)

        reset(
            value
                ? {
                      ...value,
                      email: value.email ?? '',
                      complemento: value.complemento ?? '',
                  }
                : empty,
        )

        setModal(true)
    }

    const submit = async (data: Form) => {
        try {
            await clientService.save({
                ...data,
                email: data.email || null,
                complemento: data.complemento || null,
                id: editing?.id,
            })

            toast.success(
                editing
                    ? 'Cliente atualizado.'
                    : 'Cliente cadastrado.',
            )

            setModal(false)
            void load()
        } catch (error) {
            toast.error(getApiError(error))
        }
    }

    const remove = async (item: Cliente) => {
        if (!confirm(`Desativar ${item.nome}?`)) return

        try {
            await clientService.remove(item.id)

            toast.success('Cliente desativado.')
            void load()
        } catch (error) {
            toast.error(getApiError(error))
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                        Cadastros
                    </p>

                    <h1 className="text-3xl font-bold text-slate-900">
                        Clientes
                    </h1>
                </div>

                <button
                    onClick={() => open()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
                >
                    <Plus size={18} />
                    Novo cliente
                </button>
            </div>

            <div className="relative">
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                    value={query}
                    onChange={(event) => {
                        setQuery(event.target.value)
                        setPage(1)
                    }}
                    placeholder="Buscar por nome, documento ou telefone"
                    className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 outline-none focus:border-blue-500"
                />
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-slate-50 text-left text-sm">
                            <th className="px-4 py-3">
                                Nome
                            </th>
                            <th className="px-4 py-3">
                                Documento
                            </th>
                            <th className="px-4 py-3">
                                Tipo
                            </th>
                            <th className="px-4 py-3">
                                Contato
                            </th>
                            <th className="px-4 py-3">
                                Ações
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {result?.data.map((item) => (
                            <tr
                                key={item.id}
                                className="border-b last:border-0"
                            >
                                <td className="px-4 py-3 font-medium">
                                    {item.nome}
                                </td>

                                <td className="px-4 py-3">
                                    {item.documento}
                                </td>

                                <td className="px-4 py-3">
                                    <TypeBadge type={item.tipo} />
                                </td>

                                <td className="px-4 py-3">
                                    <div>
                                        {item.telefone}
                                    </div>

                                    {item.email && (
                                        <div className="text-sm text-slate-500">
                                            {item.email}
                                        </div>
                                    )}
                                </td>

                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => open(item)}
                                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                                    >
                                        <Pencil size={18} />
                                    </button>

                                    <button
                                        onClick={() =>
                                            void remove(item)
                                        }
                                        className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {result?.data.length === 0 && (
                    <p className="p-6 text-center text-sm text-slate-500">
                        Nenhum cliente encontrado.
                    </p>
                )}
            </div>

            {result && (
                <Pagination
                    page={result.meta.page}
                    totalPages={result.meta.totalPages}
                    onPageChange={setPage}
                />
            )}

            {modal && (
                <Modal
                    title={
                        editing
                            ? 'Editar cliente'
                            : 'Novo cliente'
                    }
                    onClose={() => setModal(false)}
                >
                    <form
                        onSubmit={handleSubmit(submit)}
                        className="grid gap-4 md:grid-cols-2"
                    >
                        <Field
                            label="Nome"
                            error={errors.nome?.message}
                        >
                            <input
                                className={input}
                                {...register('nome')}
                            />
                        </Field>

                        <Field
                            label="Documento"
                            error={errors.documento?.message}
                        >
                            <input
                                className={input}
                                {...register('documento')}
                            />
                        </Field>

                        <Field
                            label="E-mail"
                            error={errors.email?.message}
                        >
                            <input
                                className={input}
                                {...register('email')}
                            />
                        </Field>

                        <Field
                            label="Telefone"
                            error={errors.telefone?.message}
                        >
                            <input
                                className={input}
                                {...register('telefone')}
                            />
                        </Field>

                        <Field
                            label="Tipo"
                            error={errors.tipo?.message}
                        >
                            <select
                                className={input}
                                {...register('tipo')}
                            >
                                <option value="RESIDENCIAL">
                                    Residencial
                                </option>

                                <option value="COMERCIAL">
                                    Comercial
                                </option>
                            </select>
                        </Field>

                        <Field
                            label="CEP"
                            error={errors.cep?.message}
                        >
                            <input
                                className={input}
                                {...register('cep')}
                            />
                        </Field>

                        <Field
                            label="Logradouro"
                            error={errors.logradouro?.message}
                        >
                            <input
                                className={input}
                                {...register('logradouro')}
                            />
                        </Field>

                        <Field
                            label="Número"
                            error={errors.numero?.message}
                        >
                            <input
                                className={input}
                                {...register('numero')}
                            />
                        </Field>

                        <Field
                            label="Complemento"
                            error={errors.complemento?.message}
                        >
                            <input
                                className={input}
                                {...register('complemento')}
                            />
                        </Field>

                        <Field
                            label="Bairro"
                            error={errors.bairro?.message}
                        >
                            <input
                                className={input}
                                {...register('bairro')}
                            />
                        </Field>

                        <Field
                            label="Cidade"
                            error={errors.cidade?.message}
                        >
                            <input
                                className={input}
                                {...register('cidade')}
                            />
                        </Field>

                        <Field
                            label="Estado"
                            error={errors.estado?.message}
                        >
                            <input
                                className={input}
                                maxLength={2}
                                {...register('estado')}
                            />
                        </Field>

                        <div className="flex justify-end gap-3 md:col-span-2">
                            <button
                                type="button"
                                onClick={() => setModal(false)}
                                className="rounded-xl px-4 py-2"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-60"
                            >
                                {isSubmitting
                                    ? 'Salvando...'
                                    : 'Salvar'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    )
}

function Field({
    label,
    error,
    children,
}: {
    label: string
    error?: string
    children: React.ReactNode
}) {
    return (
        <label className="block text-sm font-semibold text-slate-700">
            {label}

            {children}

            {error && (
                <p className="mt-1 text-sm font-normal text-rose-600">
                    {error}
                </p>
            )}
        </label>
    )
}