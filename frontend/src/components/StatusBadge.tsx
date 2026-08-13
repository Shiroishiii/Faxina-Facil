import type { StatusAgendamento, TipoCliente } from '../types'

const styles: Record<StatusAgendamento, string> = {
    PENDENTE: 'bg-amber-100 text-amber-800',
    CONFIRMADO: 'bg-blue-100 text-blue-800',
    EM_ANDAMENTO: 'bg-violet-100 text-violet-800',
    CONCLUIDO: 'bg-emerald-100 text-emerald-800',
    CANCELADO: 'bg-rose-100 text-rose-800',
}

export function StatusBadge({
    status,
}: {
    status: StatusAgendamento
}) {
    return (
        <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
        >
            {status.replace('_', ' ')}
        </span>
    )
}

export function TypeBadge({ type }: { type: TipoCliente }) {
    return (
        <span>
            {type === 'RESIDENCIAL'
                ? 'Residencial'
                : 'Comercial'}
        </span>
    )
}