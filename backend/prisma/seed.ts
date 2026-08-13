import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'
import bcrypt from 'bcrypt'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
    throw new Error('DATABASE_URL não foi definida no .env')
}

const adapter = new PrismaPg({
    connectionString,
})

const prisma = new PrismaClient({
    adapter,
})

async function main() {
    console.log('🌱 Iniciando seed...')

    // =========================================================
    // LIMPA OS DADOS EXISTENTES
    // =========================================================

    await prisma.historicoAgendamento.deleteMany()
    await prisma.agendamento.deleteMany()
    await prisma.disponibilidade.deleteMany()
    await prisma.profissional.deleteMany()
    await prisma.cliente.deleteMany()
    await prisma.usuario.deleteMany()

    console.log('🗑️ Dados antigos removidos.')

    // =========================================================
    // SENHAS
    // =========================================================

    const senhaAdmin = await bcrypt.hash('123456', 10)
    const senhaAtendente = await bcrypt.hash('123456', 10)

    // =========================================================
    // USUÁRIOS
    // =========================================================

    const admin = await prisma.usuario.create({
        data: {
            nome: 'Administrador',
            email: 'admin@faxinafacil.com',
            senha: senhaAdmin,
            papel: 'ADMIN',
            ativo: true,
        },
    })

    const atendente = await prisma.usuario.create({
        data: {
            nome: 'Maria Atendente',
            email: 'atendente@faxinafacil.com',
            senha: senhaAtendente,
            papel: 'ATENDENTE',
            ativo: true,
        },
    })

    console.log('👤 Usuários criados.')

    // =========================================================
    // CLIENTES
    // =========================================================

    const cliente1 = await prisma.cliente.create({
        data: {
            nome: 'João da Silva',
            documento: '11111111111',
            email: 'joao@email.com',
            telefone: '48999990001',
            tipo: 'RESIDENCIAL',
            logradouro: 'Rua das Palmeiras',
            numero: '100',
            complemento: 'Casa',
            bairro: 'Centro',
            cidade: 'Florianópolis',
            estado: 'SC',
            cep: '88010000',
            ativo: true,
        },
    })

    const cliente2 = await prisma.cliente.create({
        data: {
            nome: 'Empresa Limpa Tudo LTDA',
            documento: '22222222000122',
            email: 'contato@limpatudo.com',
            telefone: '4833334444',
            tipo: 'COMERCIAL',
            logradouro: 'Avenida Central',
            numero: '500',
            complemento: 'Sala 204',
            bairro: 'Centro',
            cidade: 'Florianópolis',
            estado: 'SC',
            cep: '88015000',
            ativo: true,
        },
    })

    const cliente3 = await prisma.cliente.create({
        data: {
            nome: 'Ana Souza',
            documento: '33333333333',
            email: 'ana@email.com',
            telefone: '48988887777',
            tipo: 'RESIDENCIAL',
            logradouro: 'Rua das Acácias',
            numero: '250',
            complemento: null,
            bairro: 'Trindade',
            cidade: 'Florianópolis',
            estado: 'SC',
            cep: '88036000',
            ativo: true,
        },
    })

    const cliente4 = await prisma.cliente.create({
        data: {
            nome: 'Escritório Costa & Associados',
            documento: '44444444000144',
            email: 'contato@costaassociados.com',
            telefone: '4832221111',
            tipo: 'COMERCIAL',
            logradouro: 'Rua Bocaiúva',
            numero: '800',
            complemento: '10º andar',
            bairro: 'Centro',
            cidade: 'Florianópolis',
            estado: 'SC',
            cep: '88015000',
            ativo: true,
        },
    })

    console.log('🏠 Clientes criados.')

    // =========================================================
    // PROFISSIONAIS
    // =========================================================

    const profissional1 = await prisma.profissional.create({
        data: {
            nome: 'Carlos Oliveira',
            documento: '55555555555',
            email: 'carlos@faxinafacil.com',
            telefone: '48977776666',
            especialidade: 'Limpeza residencial',
            ativo: true,
        },
    })

    const profissional2 = await prisma.profissional.create({
        data: {
            nome: 'Fernanda Santos',
            documento: '66666666666',
            email: 'fernanda@faxinafacil.com',
            telefone: '48966665555',
            especialidade: 'Limpeza comercial',
            ativo: true,
        },
    })

    const profissional3 = await prisma.profissional.create({
        data: {
            nome: 'Rafael Martins',
            documento: '77777777777',
            email: 'rafael@faxinafacil.com',
            telefone: '48955554444',
            especialidade: 'Limpeza geral',
            ativo: true,
        },
    })

    console.log('🧹 Profissionais criados.')

    // =========================================================
    // DISPONIBILIDADES
    // =========================================================

    const hoje = new Date()

    const criarHorario = (
        profissionalId: string,
        diasAdiante: number,
        inicio: string,
        fim: string,
    ) => {
        const data = new Date(hoje)
        data.setDate(data.getDate() + diasAdiante)
        data.setHours(0, 0, 0, 0)

        const horaInicio = new Date(data)
        const [horaI, minutoI] = inicio.split(':').map(Number)
        horaInicio.setHours(horaI, minutoI, 0, 0)

        const horaFim = new Date(data)
        const [horaF, minutoF] = fim.split(':').map(Number)
        horaFim.setHours(horaF, minutoF, 0, 0)

        return {
            profissionalId,
            data,
            horaInicio,
            horaFim,
            disponivel: true,
        }
    }

    await prisma.disponibilidade.createMany({
        data: [
            criarHorario(profissional1.id, 1, '08:00', '12:00'),
            criarHorario(profissional1.id, 2, '13:00', '17:00'),
            criarHorario(profissional1.id, 3, '08:00', '17:00'),

            criarHorario(profissional2.id, 1, '09:00', '13:00'),
            criarHorario(profissional2.id, 2, '14:00', '18:00'),
            criarHorario(profissional2.id, 4, '08:00', '16:00'),

            criarHorario(profissional3.id, 1, '08:00', '16:00'),
            criarHorario(profissional3.id, 3, '10:00', '18:00'),
        ],
    })

    console.log('🕐 Disponibilidades criadas.')

    // =========================================================
    // DATAS DOS AGENDAMENTOS
    // =========================================================

    const agora = new Date()

    const inicio1 = new Date(agora)
    inicio1.setDate(inicio1.getDate() + 1)
    inicio1.setHours(9, 0, 0, 0)

    const fim1 = new Date(inicio1)
    fim1.setHours(12, 0, 0, 0)

    const inicio2 = new Date(agora)
    inicio2.setDate(inicio2.getDate() + 2)
    inicio2.setHours(14, 0, 0, 0)

    const fim2 = new Date(inicio2)
    fim2.setHours(17, 0, 0, 0)

    const inicio3 = new Date(agora)
    inicio3.setDate(inicio3.getDate() - 1)
    inicio3.setHours(10, 0, 0, 0)

    const fim3 = new Date(inicio3)
    fim3.setHours(13, 0, 0, 0)

    const inicio4 = new Date(agora)
    inicio4.setDate(inicio4.getDate() + 4)
    inicio4.setHours(8, 0, 0, 0)

    const fim4 = new Date(inicio4)
    fim4.setHours(11, 0, 0, 0)

    // =========================================================
    // AGENDAMENTOS
    // =========================================================

    const agendamento1 = await prisma.agendamento.create({
        data: {
            clienteId: cliente1.id,
            profissionalId: profissional1.id,
            tipo: 'RESIDENCIAL',
            status: 'CONFIRMADO',
            dataHoraInicio: inicio1,
            dataHoraFim: fim1,
            enderecoServico: 'Rua das Palmeiras, 100 - Centro, Florianópolis/SC',
            descricao: 'Limpeza completa da residência.',
            observacao: 'Cliente solicitou atenção especial à cozinha.',
            valor: 250,
        },
    })

    const agendamento2 = await prisma.agendamento.create({
        data: {
            clienteId: cliente2.id,
            profissionalId: profissional2.id,
            tipo: 'COMERCIAL',
            status: 'PENDENTE',
            dataHoraInicio: inicio2,
            dataHoraFim: fim2,
            enderecoServico: 'Avenida Central, 500 - Centro, Florianópolis/SC',
            descricao: 'Limpeza das salas e áreas comuns.',
            observacao: 'Levar produtos para limpeza de vidro.',
            valor: 450,
        },
    })

    const agendamento3 = await prisma.agendamento.create({
        data: {
            clienteId: cliente3.id,
            profissionalId: profissional3.id,
            tipo: 'RESIDENCIAL',
            status: 'CONCLUIDO',
            dataHoraInicio: inicio3,
            dataHoraFim: fim3,
            enderecoServico: 'Rua das Acácias, 250 - Trindade, Florianópolis/SC',
            descricao: 'Limpeza geral.',
            observacao: 'Serviço concluído sem problemas.',
            valor: 300,
        },
    })

    const agendamento4 = await prisma.agendamento.create({
        data: {
            clienteId: cliente4.id,
            profissionalId: profissional2.id,
            tipo: 'COMERCIAL',
            status: 'EM_ANDAMENTO',
            dataHoraInicio: inicio4,
            dataHoraFim: fim4,
            enderecoServico: 'Rua Bocaiúva, 800 - Centro, Florianópolis/SC',
            descricao: 'Limpeza do escritório.',
            observacao: 'Serviço em andamento.',
            valor: 500,
        },
    })

    console.log('📅 Agendamentos criados.')

    // =========================================================
    // HISTÓRICO
    // =========================================================

    await prisma.historicoAgendamento.createMany({
        data: [
            {
                agendamentoId: agendamento1.id,
                usuarioId: admin.id,
                acao: 'CRIADO',
                observacao: 'Agendamento criado pelo administrador.',
            },
            {
                agendamentoId: agendamento1.id,
                usuarioId: admin.id,
                acao: 'CONFIRMADO',
                observacao: 'Agendamento confirmado.',
            },
            {
                agendamentoId: agendamento2.id,
                usuarioId: atendente.id,
                acao: 'CRIADO',
                observacao: 'Agendamento criado pelo atendente.',
            },
            {
                agendamentoId: agendamento3.id,
                usuarioId: admin.id,
                acao: 'CRIADO',
                observacao: 'Agendamento criado.',
            },
            {
                agendamentoId: agendamento3.id,
                usuarioId: admin.id,
                acao: 'CONCLUIDO',
                observacao: 'Serviço concluído.',
            },
            {
                agendamentoId: agendamento4.id,
                usuarioId: atendente.id,
                acao: 'CRIADO',
                observacao: 'Agendamento criado pelo atendente.',
            },
            {
                agendamentoId: agendamento4.id,
                usuarioId: atendente.id,
                acao: 'EM_ANDAMENTO',
                observacao: 'Profissional iniciou o serviço.',
            },
        ],
    })

    console.log('📋 Históricos criados.')

    console.log('')
    console.log('======================================')
    console.log('🌱 SEED EXECUTADO COM SUCESSO!')
    console.log('======================================')
    console.log('')
    console.log('🔐 Usuários:')
    console.log('ADMIN:')
    console.log('  E-mail: admin@faxinafacil.com')
    console.log('  Senha: 123456')
    console.log('')
    console.log('ATENDENTE:')
    console.log('  E-mail: atendente@faxinafacil.com')
    console.log('  Senha: 123456')
    console.log('')
    console.log('📊 Dados criados:')
    console.log('  2 usuários')
    console.log('  4 clientes')
    console.log('  3 profissionais')
    console.log('  8 disponibilidades')
    console.log('  4 agendamentos')
    console.log('  7 históricos')
}

main()
    .catch((error) => {
        console.error('❌ Erro ao executar seed:')
        console.error(error)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })