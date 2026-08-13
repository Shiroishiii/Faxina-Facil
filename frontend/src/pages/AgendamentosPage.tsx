import { Plus, Search, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { Modal } from '../components/Modal'
import { Pagination } from '../components/Pagination'
import { StatusBadge, TypeBadge } from '../components/StatusBadge'
import { getApiError } from '../hooks/useApiError'
import {
    appointmentService,
    clientService,
    professionalService,
} from '../services/crud.service'
import type {
    Agendamento,
    Cliente,
    Paginated,
    Profissional,
    StatusAgendamento,
} from '../types'
import { formatDateTime, toDateTimeLocal } from '../utils/format'

export function AgendamentosPage({
    management = false,
}: {
    management?: boolean
}) {
    const [result, setResult] =
        useState<Paginated<Agendamento> | null>(null)
    const [page, setPage] = useState(1)
    const [q, setQ] = useState('')
    const [editing, setEditing] =
        useState<Agendamento | null>(null)
    const [clients, setClients] = useState<Cliente[]>([])
    const [pros, setPros] = useState<Profissional[]>([])
    const [status, setStatus] =
        useState<StatusAgendamento | ''>('')
    const [history, setHistory] = useState<
        {
            id: string
            acao: string
            createdAt: string
            observacao?: string
            usuario?: {
                nome: string
            }
        }[] | null
    >(null)

    const load = useCallback(
        () =>
            appointmentService
                .list({
                    page,
                    limit: 10,
                    q,
                    sort: management ? 'desc' : 'asc',
                    status: status || undefined,
                })
                .then(setResult)
                .catch((e) => toast.error(getApiError(e))),
        [page, q, management, status],
    )

    useEffect(() => {
        void load()
    }, [load])

    useEffect(() => {
        Promise.all([
            clientService.list({
                page: 1,
                limit: 100,
                ativo: true,
            }),
            professionalService.list({
                page: 1,
                limit: 100,
                ativo: true,
            }),
        ]).then(([c, p]) => {
            setClients(c.data)
            setPros(p.data)
        })
    }, [])

    const remove = async (id: string) => {
        if (!confirm('Excluir este agendamento?')) return

        try {
            await appointmentService.remove(id)

            toast.success('Agendamento excluído.')
            void load()
        } catch (e) {
            toast.error(getApiError(e))
        }
    }

    const save = async (form: HTMLFormElement) => {
        const data = Object.fromEntries(new FormData(form))
        const client = clients.find(
            (c) => c.id === data.clienteId,
        )

        try {
            await appointmentService.save({
                ...data,
                id: editing?.id,
                tipo: client?.tipo,
                valor: Number(data.valor),
                dataHoraInicio: new Date(
                    String(data.dataHoraInicio),
                ).toISOString(),
                dataHoraFim: new Date(
                    String(data.dataHoraFim),
                ).toISOString(),
            })

            toast.success('Agendamento salvo.')
            setEditing(null)
            void load()
        } catch (e) {
            toast.error(getApiError(e))
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                        {management
                            ? 'Movimentação'
                            : 'Cadastro'}
                    </p>

                    <h1 className="text-3xl font-bold">
                        {management
                            ? 'Gestão de agendamentos'
                            : 'Agendamentos'}
                    </h1>
                </div>

                <button
                    onClick={() =>
                        setEditing({} as Agendamento)
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white"
                >
                    <Plus size={18} />
                    Novo agendamento
                </button>
            </div>

            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                    <div className="relative max-w-md flex-1">
                        <Search
                            className="absolute left-3 top-3 text-slate-400"
                            size={18}
                        />

                        <input
                            value={q}
                            onChange={(e) => {
                                setQ(e.target.value)
                                setPage(1)
                            }}
                            placeholder="Buscar cliente, profissional ou endereço"
                            className="w-full rounded-xl border py-2.5 pl-10"
                        />
                    </div>

                    {management && (
                        <select
                            value={status}
                            onChange={(e) => {
                                setStatus(
                                    e.target.value as
                                        | StatusAgendamento
                                        | '',
                                )
                                setPage(1)
                            }}
                            className="rounded-xl border px-3"
                        >
                            <option value="">
                                Todos os status
                            </option>

                            {[
                                'PENDENTE',
                                'CONFIRMADO',
                                'EM_ANDAMENTO',
                                'CONCLUIDO',
                                'CANCELADO',
                            ].map((s) => (
                                <option key={s}>{s}</option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b text-slate-500">
                            <tr>
                                <th className="p-3">
                                    Data e hora
                                </th>

                                <th className="p-3">
                                    Cliente
                                </th>

                                <th className="p-3">
                                    Profissional
                                </th>

                                <th className="p-3">
                                    Tipo
                                </th>

                                <th className="p-3">
                                    Status
                                </th>

                                <th className="p-3 text-right">
                                    Ações
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {result?.data.map((a) => (
                                <tr
                                    key={a.id}
                                    className="border-b border-slate-100"
                                >
                                    <td className="p-3">
                                        {formatDateTime(
                                            a.dataHoraInicio,
                                        )}
                                    </td>

                                    <td className="p-3 font-semibold">
                                        {a.cliente.nome}
                                    </td>

                                    <td className="p-3">
                                        {a.profissional?.nome}
                                    </td>

                                    <td className="p-3">
                                        <TypeBadge type={a.tipo} />
                                    </td>

                                    <td className="p-3">
                                        <StatusBadge
                                            status={a.status}
                                        />
                                    </td>

                                    <td className="p-3 text-right">
                                        <button
                                            onClick={() =>
                                                void appointmentService
                                                    .history(a.id)
                                                    .then(
                                                        setHistory,
                                                    )
                                                    .catch((e) =>
                                                        toast.error(
                                                            getApiError(
                                                                e,
                                                            ),
                                                        ),
                                                    )
                                            }
                                            className="mr-2 text-xs font-semibold text-slate-600"
                                        >
                                            Histórico
                                        </button>

                                        <button
                                            onClick={() =>
                                                setEditing(a)
                                            }
                                            className="mr-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            onClick={() =>
                                                void remove(a.id)
                                            }
                                            className="text-rose-600"
                                        >
                                            <Trash2 size={17} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {result && (
                    <Pagination
                        result={result}
                        onChange={setPage}
                    />
                )}
            </section>

            {history && (
                <Modal
                    title="Histórico do agendamento"
                    onClose={() => setHistory(null)}
                >
                    <div className="space-y-3">
                        {history.map((h) => (
                            <article
                                key={h.id}
                                className="rounded-xl bg-slate-50 p-4"
                            >
                                <p className="font-semibold">
                                    {h.acao.replace('_', ' ')}
                                </p>

                                <p className="text-sm text-slate-600">
                                    {h.observacao ||
                                        'Alteração registrada.'}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    {h.usuario?.nome || 'Sistema'}{' '}
                                    ·{' '}
                                    {formatDateTime(
                                        h.createdAt,
                                    )}
                                </p>
                            </article>
                        ))}
                    </div>
                </Modal>
            )}

            {editing && (
                <Modal
                    title={
                        editing.id
                            ? 'Editar agendamento'
                            : 'Novo agendamento'
                    }
                    onClose={() => setEditing(null)}
                >
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            void save(e.currentTarget)
                        }}
                        className="grid gap-4 md:grid-cols-2"
                    >
                        <label className="text-sm font-semibold">
                            Cliente

                            <select
                                name="clienteId"
                                defaultValue={editing.clienteId}
                                required
                                className="mt-1 w-full rounded-lg border p-2"
                            >
                                <option value="">
                                    Selecione
                                </option>

                                {clients.map((c) => (
                                    <option
                                        key={c.id}
                                        value={c.id}
                                    >
                                        {c.nome} — {c.tipo}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="text-sm font-semibold">
                            Profissional

                            <select
                                name="profissionalId"
                                defaultValue={
                                    editing.profissionalId ?? ''
                                }
                                required
                                className="mt-1 w-full rounded-lg border p-2"
                            >
                                <option value="">
                                    Selecione
                                </option>

                                {pros.map((p) => (
                                    <option
                                        key={p.id}
                                        value={p.id}
                                    >
                                        {p.nome}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="text-sm font-semibold">
                            Início

                            <input
                                name="dataHoraInicio"
                                type="datetime-local"
                                required
                                defaultValue={toDateTimeLocal(
                                    editing.dataHoraInicio,
                                )}
                                className="mt-1 w-full rounded-lg border p-2"
                            />
                        </label>

                        <label className="text-sm font-semibold">
                            Fim

                            <input
                                name="dataHoraFim"
                                type="datetime-local"
                                required
                                defaultValue={toDateTimeLocal(
                                    editing.dataHoraFim,
                                )}
                                className="mt-1 w-full rounded-lg border p-2"
                            />
                        </label>

                        <label className="text-sm font-semibold">
                            Status

                            <select
                                name="status"
                                defaultValue={
                                    editing.status ??
                                    'PENDENTE'
                                }
                                className="mt-1 w-full rounded-lg border p-2"
                            >
                                {[
                                    'PENDENTE',
                                    'CONFIRMADO',
                                    'EM_ANDAMENTO',
                                    'CONCLUIDO',
                                    'CANCELADO',
                                ].map((s) => (
                                    <option key={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="text-sm font-semibold">
                            Valor

                            <input
                                name="valor"
                                type="number"
                                step="0.01"
                                min="0"
                                defaultValue={
                                    editing.valor ?? ''
                                }
                                required
                                className="mt-1 w-full rounded-lg border p-2"
                            />
                        </label>

                        <label className="text-sm font-semibold md:col-span-2">
                            Endereço

                            <input
                                name="enderecoServico"
                                defaultValue={
                                    editing.enderecoServico
                                }
                                required
                                className="mt-1 w-full rounded-lg border p-2"
                            />
                        </label>

                        <label className="text-sm font-semibold md:col-span-2">
                            Descrição

                            <textarea
                                name="descricao"
                                defaultValue={
                                    editing.descricao ?? ''
                                }
                                className="mt-1 w-full rounded-lg border p-2"
                            />
                        </label>

                        <div className="flex justify-end md:col-span-2">
                            <button className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white">
                                Salvar e verificar conflitos
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    )
}