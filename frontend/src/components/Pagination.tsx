import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Paginated } from '../types'

interface PaginationProps<T> {
    result: Paginated<T> | null
    onChange: (page: number) => void
}

export function Pagination<T>({
    result,
    onChange,
}: PaginationProps<T>) {
    if (!result) {
        return null
    }

    const { page, totalPages, total } = result.meta

    return (
        <footer className="flex items-center justify-between gap-3 border-t border-slate-100 px-1 pt-4 text-sm text-slate-500">
            <span>
                {total} registro(s)
            </span>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => onChange(page - 1)}
                    className="rounded-lg border p-2 disabled:opacity-40"
                >
                    <ChevronLeft size={16} />
                </button>

                <span>
                    Página {page} de {Math.max(totalPages, 1)}
                </span>

                <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => onChange(page + 1)}
                    className="rounded-lg border p-2 disabled:opacity-40"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </footer>
    )
}

