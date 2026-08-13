import { Plus, Search, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { Modal } from '../components/Modal'
import { Pagination } from '../components/Pagination'
import { getApiError } from '../hooks/useApiError'
import { professionalService } from '../services/crud.service'
import type { Disponibilidade, Paginated, Profissional } from '../types'
import { formatDateTime, toTimeInput } from '../utils/format'

export function ProfissionaisPage() {
    const [result, setResult] = useState<Paginated | null>(null)
    const [page, setPage] = useState(1)
    const [query, setQuery] = useState('')
    const [item, setItem] = useState<Profissional | null>(null)
    const [availability, setAvailability] = useState<
        Disponibilidade[] | null
    >(null)

    const load = useCallback(
        () =>
            professionalService
                .list({ page, limit: 10, q: query })
                .then(setResult)
                .catch((e) => toast.error(getApiError(e))),
        [page, query],
    )

    useEffect(() => {
        void load()
    }, [load])

    const save = async (form: HTMLFormElement) => {
        const data = Object.fromEntries(new FormData(form))

        try {
            await professionalService.save({
                ...data,
                id: item?.id,
                email: String(data.email || '') || null,
                especialidade: String(data.especialidade || '') || null,
            })

            toast.success('Profissional salvo.')
            setItem(null)
            void load()
        } catch (e) {
            toast.error(getApiError(e))
        }
    }

    const openAvailability = async (professional: Profissional) => {
        setItem(professional)

        try {
            setAvailability(
                await professionalService.availability(professional.id),
            )
        } catch (e) {
            toast.error(getApiError(e))
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        Cadastros
                    </h1>

                    <p className="text-slate-500">
                        Profissionais
                    </p>
                </div>

                <button
                    onClick={() =>
                        setItem({
                            id: '',
                            nome: '',
                            documento: '',
                            email: '',
                            telefone: '',
                            especialidade: '',
                            ativo: true,
                        })
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white"
                >
                    <Plus size={18} />
                    Novo profissional
                </button>
            </div>

            <div className="relative">
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setPage(1)
                    }}
                    className="w-full rounded-xl border py-2.5 pl-10"
                    placeholder="Buscar profissional"
                />
            </div>

            <div className="overflow-hidden rounded-xl border bg-white">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-slate-50 text-left text-sm">
                            <th className="px-4 py-3">
                                Nome
                            </th>

                            <th className="px-4 py-3">
                                Especialidade
                            </th>

                            <th className="px-4 py-3">
                                Telefone
                            </th>

                            <th className="px-4 py-3">
                                Ações
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {result?.data.map((p) => (
                            <tr
                                key={p.id}
                                className="border-b last:border-0"
                            >
                                <td className="px-4 py-3">
                                    {p.nome}
                                </td>

                                <td className="px-4 py-3">
                                    {p.especialidade || '—'}
                                </td>

                                <td className="px-4 py-3">
                                    {p.telefone}
                                </td>

                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => setItem(p)}
                                        className="mr-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700"
                                    >
                                        Editar
                                    </button>

                                    <button
                                        onClick={() =>
                                            void openAvailability(p)
                                        }
                                        className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold"
                                    >
                                        Disponibilidade
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {result && (
                <Pagination
                    page={result.meta.page}
                    totalPages={result.meta.totalPages}
                    onPageChange={setPage}
                />
            )}

            {item && !availability && (
                <Modal
                    title={
                        item.id
                            ? 'Editar profissional'
                            : 'Novo profissional'
                    }
                    onClose={() => setItem(null)}
                >
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            void save(e.currentTarget)
                        }}
                        className="grid gap-4 md:grid-cols-2"
                    >
                        {[
                            ['nome', 'Nome'],
                            ['documento', 'Documento'],
                            ['email', 'E-mail'],
                            ['telefone', 'Telefone'],
                            ['especialidade', 'Especialidade'],
                        ].map(([name, label]) => (
                            <label key={name}>
                                {label}

                                <input
                                    name={name}
                                    type={
                                        name === 'email'
                                            ? 'email'
                                            : 'text'
                                    }
                                    required={
                                        name !== 'email' &&
                                        name !== 'especialidade'
                                    }
                                    defaultValue={
                                        (item[
                                            name as keyof Profissional
                                        ] as string) ?? ''
                                    }
                                    className="mt-1 w-full rounded-lg border p-2"
                                />
                            </label>
                        ))}

                        <button
                            type="submit"
                            className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white"
                        >
                            Salvar
                        </button>
                    </form>
                </Modal>
            )}

            {item && availability && (
                <AvailabilityModal
                    professional={item}
                    values={availability}
                    close={() => {
                        setItem(null)
                        setAvailability(null)
                    }}
                    refresh={async () =>
                        setAvailability(
                            await professionalService.availability(
                                item.id,
                            ),
                        )
                    }
                />
            )}
        </div>
    )
}

function AvailabilityModal({
    professional,
    values,
    close,
    refresh,
}: {
    professional: Profissional
    values: Disponibilidade[]
    close: () => void
    refresh: () => Promise<void>
}) {
    const add = async (form: HTMLFormElement) => {
        try {
            const value = Object.fromEntries(
                new FormData(form),
            )

            await professionalService.addAvailability(
                professional.id,
                {
                    ...value,
                    horaInicio: `1970-01-01T${value.horaInicio}:00.000Z`,
                    horaFim: `1970-01-01T${value.horaFim}:00.000Z`,
                },
            )

            form.reset()
            await refresh()

            toast.success(
                'Disponibilidade adicionada.',
            )
        } catch (e) {
            toast.error(getApiError(e))
        }
    }

    return (
        <Modal
            title={`Disponibilidade — ${professional.nome}`}
            onClose={close}
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    void add(e.currentTarget)
                }}
                className="mb-5 grid gap-3 sm:grid-cols-3"
            >
                <input
                    name="data"
                    type="date"
                    required
                    className="rounded-lg border p-2"
                />

                <input
                    name="horaInicio"
                    type="time"
                    required
                    className="rounded-lg border p-2"
                />

                <input
                    name="horaFim"
                    type="time"
                    required
                    className="rounded-lg border p-2"
                />

                <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
                >
                    Adicionar horário
                </button>
            </form>

            <div className="space-y-2">
                {values.map((v) => (
                    <div
                        key={v.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                    >
                        <span>
                            {formatDateTime(v.data)} ·{' '}
                            {toTimeInput(v.horaInicio)}–
                            {toTimeInput(v.horaFim)}
                        </span>

                        <button
                            onClick={async () => {
                                await professionalService.removeAvailability(
                                    professional.id,
                                    v.id,
                                )

                                await refresh()
                            }}
                            className="text-rose-600"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}

                {!values.length && (
                    <p className="text-sm text-slate-500">
                        Nenhum horário registrado.
                    </p>
                )}
            </div>
        </Modal>
    )
}
