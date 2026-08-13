import {
    CalendarClock,
    CheckCircle2,
    CircleDashed,
    TriangleAlert,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { getApiError } from '../hooks/useApiError'
import { dashboardService } from '../services/crud.service'
import type { Dashboard } from '../types'
import { formatDateTime } from '../utils/format'

const cardStyle = [
    'bg-blue-600',
    'bg-amber-500',
    'bg-violet-600',
    'bg-emerald-600',
]

export function DashboardPage() {
    const [data, setData] = useState<Dashboard | null>(null)

    useEffect(() => {
        dashboardService
            .get()
            .then(setData)
            .catch((error) => toast.error(getApiError(error)))
    }, [])

    const cards = data
        ? [
              {
                  label: 'Total de agendamentos',
                  value: data.cards.total,
                  icon: CalendarClock,
              },
              {
                  label: 'Pendentes',
                  value: data.cards.pendentes,
                  icon: CircleDashed,
              },
              {
                  label: 'Confirmados',
                  value: data.cards.confirmados,
                  icon: CheckCircle2,
              },
              {
                  label: 'Concluídos',
                  value: data.cards.concluidos,
                  icon: CheckCircle2,
              },
          ]
        : []

    return (
        <div className="space-y-6">
            <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                    Visão geral
                </p>

                <h1 className="text-3xl font-bold text-slate-900">
                    Dashboard
                </h1>
            </div>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map(
                    ({ label, value, icon: Icon }, index) => (
                        <article
                            key={label}
                            className={`${cardStyle[index]} rounded-2xl p-5 text-white shadow-sm`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                    {label}
                                </span>

                                <Icon size={22} />
                            </div>

                            <p className="mt-4 text-3xl font-bold">
                                {value}
                            </p>
                        </article>
                    ),
                )}
            </section>

            <section className="rounded-2xl border bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                    <TriangleAlert
                        size={20}
                        className="text-amber-500"
                    />

                    <h2 className="text-lg font-bold text-slate-900">
                        Alertas: próximas 24 horas
                    </h2>
                </div>

                {data?.alertas.length ? (
                    <div className="space-y-3">
                        {data.alertas.map((alert) => (
                            <div
                                key={alert.id}
                                className="rounded-xl border border-amber-100 bg-amber-50 p-4"
                            >
                                <p className="font-semibold text-slate-800">
                                    {alert.mensagem}
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    {formatDateTime(
                                        alert.dataHoraInicio,
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500">
                        Nenhum alerta para as próximas 24 horas.
                    </p>
                )}
            </section>
        </div>
    )
}