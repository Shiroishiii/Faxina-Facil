import { X } from 'lucide-react'
import type { ReactNode } from 'react'

export function Modal({
    title,
    onClose,
    children,
}: {
    title: string
    onClose: () => void
    children: ReactNode
}) {
    return (
        <div
            className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4"
            role="dialog"
            aria-modal="true"
        >
            <section className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                    <h2 className="text-lg font-bold">
                        {title}
                    </h2>

                    <button
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                        onClick={onClose}
                        aria-label="Fechar"
                    >
                        <X size={20} />
                    </button>
                </header>

                <div className="p-6">{children}</div>
            </section>
        </div>
    )
}