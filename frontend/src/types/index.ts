export type PapelUsuario = 'ADMIN' | 'ATENDENTE'

export type TipoCliente = 'RESIDENCIAL' | 'COMERCIAL'

export type StatusAgendamento =
    | 'PENDENTE'
    | 'CONFIRMADO'
    | 'EM_ANDAMENTO'
    | 'CONCLUIDO'
    | 'CANCELADO'

export type Usuario = {
    id: string
    nome: string
    email: string
    papel: PapelUsuario
    ativo: boolean
}

export type Cliente = {
    id: string
    nome: string
    documento: string
    email: string | null
    telefone: string
    tipo: TipoCliente
    logradouro: string
    numero: string
    complemento: string | null
    bairro: string
    cidade: string
    estado: string
    cep: string
    ativo: boolean
}

export type Profissional = {
    id: string
    nome: string
    documento: string
    email: string | null
    telefone: string
    especialidade: string | null
    ativo: boolean
}

export type Disponibilidade = {
    id: string
    profissionalId: string
    data: string
    horaInicio: string
    horaFim: string
    disponivel: boolean
    observacao: string | null
}

export type Agendamento = {
    id: string
    clienteId: string
    profissionalId: string | null
    tipo: TipoCliente
    status: StatusAgendamento
    dataHoraInicio: string
    dataHoraFim: string
    enderecoServico: string
    descricao: string | null
    valor: string | null
    observacao: string | null
    cliente: Cliente
    profissional: Profissional | null
}

export type Paginated<T> = {
    data: T[]
    meta: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export type Dashboard = {
    cards: {
        total: number
        pendentes: number
        confirmados: number
        concluidos: number
    }
    alertas: {
        id: string
        mensagem: string
        dataHoraInicio: string
        tipo: string
    }[]
}