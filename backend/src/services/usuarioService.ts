import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { prisma } from '../lib/prisma'

interface CreateUsuarioData {
    nome: string
    email: string
    senha: string
    papel: 'ADMIN' | 'ATENDENTE'
}

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET não configurado no .env')
}

export const usuarioService = {
    async list() {
        return prisma.usuario.findMany({
            select: {
                id: true,
                nome: true,
                email: true,
                papel: true,
                ativo: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                nome: 'asc',
            },
        })
    },

    async getById(id: string) {
        return prisma.usuario.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                nome: true,
                email: true,
                papel: true,
                ativo: true,
                createdAt: true,
                updatedAt: true,
            },
        })
    },

    async create(data: CreateUsuarioData) {
        const existing = await prisma.usuario.findUnique({
            where: {
                email: data.email,
            },
        })

        if (existing) {
            throw new Error('E-mail já cadastrado.')
        }

        const senhaHash = await bcrypt.hash(data.senha, 10)

        return prisma.usuario.create({
            data: {
                nome: data.nome,
                email: data.email,
                senha: senhaHash,
                papel: data.papel,
            },
            select: {
                id: true,
                nome: true,
                email: true,
                papel: true,
                ativo: true,
                createdAt: true,
                updatedAt: true,
            },
        })
    },

    async login(email: string, senha: string) {
        const usuario = await prisma.usuario.findUnique({
            where: {
                email,
            },
        })

        if (!usuario || !usuario.ativo) {
            throw new Error('E-mail ou senha inválidos.')
        }

        const senhaValida = await bcrypt.compare(
            senha,
            usuario.senha,
        )

        if (!senhaValida) {
            throw new Error('E-mail ou senha inválidos.')
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email,
                papel: usuario.papel,
            },
            JWT_SECRET,
            {
                expiresIn: '8h',
            },
        )

        return {
            token,
            user: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                papel: usuario.papel,
                ativo: usuario.ativo,
            },
        }
    },

    async update(
        id: string,
        data: {
            nome?: string
            email?: string
            senha?: string
            papel?: 'ADMIN' | 'ATENDENTE'
            ativo?: boolean
        },
    ) {
        const senhaHash = data.senha
            ? await bcrypt.hash(data.senha, 10)
            : undefined

        return prisma.usuario.update({
            where: {
                id,
            },
            data: {
                nome: data.nome,
                email: data.email,
                papel: data.papel,
                ativo: data.ativo,
                ...(senhaHash && {
                    senha: senhaHash,
                }),
            },
            select: {
                id: true,
                nome: true,
                email: true,
                papel: true,
                ativo: true,
                createdAt: true,
                updatedAt: true,
            },
        })
    },

    async remove(id: string) {
        return prisma.usuario.update({
            where: {
                id,
            },
            data: {
                ativo: false,
            },
            select: {
                id: true,
                nome: true,
                email: true,
                papel: true,
                ativo: true,
            },
        })
    },
}