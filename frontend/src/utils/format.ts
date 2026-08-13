export const formatDateTime = (value: string) =>
    new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(new Date(value))

export const formatCurrency = (value: string | null) =>
    value
        ? new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
          }).format(Number(value))
        : '—'

export const toDateTimeLocal = (value?: string) => {
    if (!value) return ''

    const date = new Date(value)
    const offset = date.getTimezoneOffset() * 60_000

    return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

export const toTimeInput = (value: string) =>
    new Date(value).toISOString().slice(11, 16)