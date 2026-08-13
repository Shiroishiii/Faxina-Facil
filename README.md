# 🧹 Faxina Fácil

Sistema web para **gestão de serviços de limpeza**, desenvolvido para facilitar o cadastro de clientes e profissionais, controle de disponibilidades, criação de agendamentos e acompanhamento da agenda.

O projeto possui uma arquitetura **Full Stack**, separando o frontend da API/backend.

---

## 📋 Sobre o sistema

O **Faxina Fácil** permite que uma empresa de serviços de limpeza gerencie sua operação através de uma aplicação web.

### Principais funcionalidades

* 🔐 Login e autenticação de usuários
* 👥 Cadastro e gerenciamento de clientes
* 🧹 Cadastro e gerenciamento de profissionais
* 🕐 Controle de disponibilidade dos profissionais
* 📅 Criação e edição de agendamentos
* 🔎 Busca de clientes, profissionais e agendamentos
* 📊 Dashboard com visão geral dos agendamentos
* 📋 Histórico de alterações dos agendamentos
* ⚠️ Alertas de próximos agendamentos
* 📄 Paginação dos registros
* 🔒 Controle de acesso por perfil
* 🏠 Diferenciação entre clientes residenciais e comerciais
* 💰 Controle do valor dos serviços
* ❌ Desativação de clientes e usuários

---

# 🏗️ Arquitetura

O projeto é dividido em duas aplicações:

```text
faxina-facil/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
└── backend/
    ├── prisma/
    │   ├── schema.prisma
    │   └── seed.ts
    │
    ├── src/
    │   ├── controllers/
    │   ├── middlewares/
    │   ├── routes/
    │   ├── services/
    │   ├── lib/
    │   ├── app.ts
    │   └── server.ts
    │
    ├── generated/
    ├── .env
    └── package.json
```

---

# 🖥️ Frontend

O frontend é responsável pela interface visual do sistema.

### Tecnologias

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Axios
* React Hook Form
* Zod
* React Hot Toast
* Lucide React

O frontend realiza as requisições para a API através do Axios.

Exemplo:

```text
Frontend
   │
   │ HTTP
   ▼
Backend/API
```

---

# ⚙️ Backend

O backend é responsável pelas regras de negócio, autenticação e comunicação com o banco de dados.

### Tecnologias

* Node.js
* TypeScript
* Express
* Prisma
* PostgreSQL
* JWT
* bcrypt
* CORS
* dotenv

A estrutura utiliza uma separação por responsabilidades:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Prisma
  ↓
PostgreSQL
```

### Controllers

Responsáveis por receber as requisições HTTP e devolver as respostas.

Exemplo:

```text
clienteController
usuarioController
profissionalController
agendamentoController
dashboardController
```

### Services

Contêm as regras de negócio e comunicação com o Prisma.

Exemplo:

```text
clienteService
usuarioService
profissionalService
agendamentoService
dashboardService
```

### Routes

Definem os endpoints disponíveis na API.

Exemplo:

```text
POST   /usuarios/login

GET    /clientes
POST   /clientes
PATCH  /clientes/:id
DELETE /clientes/:id

GET    /profissionais
POST   /profissionais
PATCH  /profissionais/:id

GET    /agendamentos
POST   /agendamentos
PATCH  /agendamentos/:id
DELETE /agendamentos/:id

GET    /dashboard
```

---

# 🗄️ Banco de dados

O sistema utiliza **PostgreSQL** com **Prisma ORM**.

O banco possui os seguintes principais modelos:

```text
Usuario
Cliente
Profissional
Disponibilidade
Agendamento
HistoricoAgendamento
```

### Relacionamentos

```text
Usuario
   │
   └── HistoricoAgendamento

Cliente
   │
   └── Agendamento
          │
          ├── Profissional
          │
          └── HistoricoAgendamento

Profissional
   │
   ├── Disponibilidade
   │
   └── Agendamento
```

---

# 🔐 Autenticação

A autenticação utiliza **JWT (JSON Web Token)**.

O fluxo funciona da seguinte maneira:

```text
Usuário
   │
   │ e-mail + senha
   ▼
POST /usuarios/login
   │
   ▼
Backend
   │
   ├── verifica usuário
   ├── verifica senha com bcrypt
   └── gera JWT
   │
   ▼
Frontend
   │
   └── salva token
```

Nas requisições autenticadas, o frontend envia:

```http
Authorization: Bearer TOKEN
```

O middleware de autenticação verifica o token antes de permitir o acesso às rotas protegidas.

---

# 👤 Perfis de usuário

O sistema possui dois níveis de acesso:

### ADMIN

Possui acesso administrativo ao sistema.

Pode:

* Gerenciar usuários
* Gerenciar clientes
* Gerenciar profissionais
* Gerenciar agendamentos
* Visualizar dashboard
* Consultar históricos

### ATENDENTE

Possui acesso às operações de atendimento e agenda.

Pode:

* Consultar clientes
* Cadastrar clientes
* Consultar profissionais
* Criar agendamentos
* Gerenciar a agenda

---

# 🚀 Como executar o projeto

## 1. Clonar o projeto

```bash
git clone URL_DO_REPOSITORIO
cd faxina-facil
```

---

# 🔧 Configurando o Backend

Entre na pasta:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

---

## 2. Configurar o banco

Crie um banco PostgreSQL.

Exemplo:

```text
faxina_facil
```

Depois crie o arquivo:

```text
backend/.env
```

Com:

```env
DATABASE_URL="postgresql://postgres:SENHA@localhost:5432/faxina_facil"
JWT_SECRET="uma-chave-secreta"
```

Substitua `SENHA` pela senha do seu PostgreSQL.

---

# 🧬 Prisma

Depois de configurar o banco:

```bash
npx prisma generate
```

Para aplicar as migrations:

```bash
npx prisma migrate dev
```

---

# 🌱 Popular o banco

O projeto possui um script de seed em:

```text
prisma/seed.ts
```

Ele cria dados iniciais para testes.

Execute:

```bash
npm run seed
```

Ou:

```bash
npx tsx prisma/seed.ts
```

O seed cria:

* 2 usuários
* 4 clientes
* 3 profissionais
* 8 disponibilidades
* 4 agendamentos
* 7 registros de histórico

---

# 🔑 Usuários para teste

### Administrador

```text
E-mail:
admin@faxinafacil.com

Senha:
123456
```

### Atendente

```text
E-mail:
atendente@faxinafacil.com

Senha:
123456
```

---

# ▶️ Executando o Backend

Na pasta `backend`:

```bash
npm run dev
```

O servidor será iniciado em:

```text
http://localhost:3000
```

Para verificar se a API está funcionando:

```text
GET http://localhost:3000/health
```

Resposta esperada:

```json
{
  "message": "API funcionando!"
}
```

---

# 🎨 Configurando o Frontend

Entre na pasta:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo:

```text
frontend/.env
```

Com:

```env
VITE_API_URL=http://localhost:3000
```

---

# ▶️ Executando o Frontend

Execute:

```bash
npm run dev
```

O Vite normalmente disponibilizará a aplicação em:

```text
http://localhost:5173
```

---

# 🔄 Executando o projeto completo

É necessário executar os dois servidores.

### Terminal 1 — Backend

```bash
cd backend
npm run dev
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Depois acesse:

```text
http://localhost:5173
```

---

# 🔌 Comunicação Frontend ↔ Backend

O frontend utiliza Axios para se comunicar com a API.

Exemplo:

```ts
import axios from 'axios'

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})
```

O token JWT é enviado automaticamente através de um interceptor:

```ts
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('faxina.token')

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})
```

---

# 📡 Principais endpoints

## Autenticação

```http
POST /usuarios/login
```

---

## Clientes

```http
GET    /clientes
GET    /clientes/:id
POST   /clientes
PATCH  /clientes/:id
DELETE /clientes/:id
```

---

## Profissionais

```http
GET    /profissionais
GET    /profissionais/:id
POST   /profissionais
PATCH  /profissionais/:id
DELETE /profissionais/:id
```

---

## Agendamentos

```http
GET    /agendamentos
GET    /agendamentos/:id
POST   /agendamentos
PATCH  /agendamentos/:id
DELETE /agendamentos/:id
```

---

## Dashboard

```http
GET /dashboard
```

---

# 📊 Dashboard

O Dashboard apresenta informações resumidas do sistema:

```text
Total de agendamentos
Pendentes
Confirmados
Concluídos
```

Também são exibidos alertas relacionados aos próximos agendamentos.

---

# 📅 Agendamentos

Cada agendamento possui informações como:

```text
Cliente
Profissional
Tipo
Status
Data e hora de início
Data e hora de término
Endereço
Descrição
Valor
Observação
```

Os possíveis status são:

```text
PENDENTE
CONFIRMADO
EM_ANDAMENTO
CONCLUIDO
CANCELADO
```

---

# 🧹 Profissionais

Os profissionais possuem:

```text
Nome
Documento
E-mail
Telefone
Especialidade
Status
```

Também é possível cadastrar suas disponibilidades de atendimento.

---

# 👥 Clientes

Os clientes possuem:

```text
Nome
Documento
E-mail
Telefone
Tipo
Endereço
CEP
Cidade
Estado
```

Os tipos disponíveis são:

```text
RESIDENCIAL
COMERCIAL
```

---

# 🧪 Testando a API

O backend pode ser testado utilizando ferramentas como:

* Postman
* Insomnia
* Thunder Client

Exemplo de login:

```http
POST http://localhost:3000/usuarios/login
Content-Type: application/json
```

Body:

```json
{
    "email": "admin@faxinafacil.com",
    "senha": "123456"
}
```

Após o login, utilize o token retornado:

```http
Authorization: Bearer SEU_TOKEN
```

nas rotas protegidas.

---

# 📁 Organização do Backend

A organização segue o padrão:

```text
src/
│
├── controllers/
│   ├── usuarioController.ts
│   ├── clienteController.ts
│   ├── profissionalController.ts
│   ├── agendamentoController.ts
│   └── dashboardController.ts
│
├── services/
│   ├── usuarioService.ts
│   ├── clienteService.ts
│   ├── profissionalService.ts
│   ├── agendamentoService.ts
│   └── dashboardService.ts
│
├── routes/
│   ├── usuarioRoutes.ts
│   ├── clienteRoutes.ts
│   ├── profissionalRoutes.ts
│   ├── agendamentoRoutes.ts
│   └── dashboardRoutes.ts
│
├── middlewares/
│   ├── authMiddleware.ts
│   └── roleMiddleware.ts
│
├── lib/
│   └── prisma.ts
│
├── app.ts
└── server.ts
```

Essa divisão facilita a manutenção e evita colocar toda a lógica do sistema dentro das rotas.

---

# 🛠️ Tecnologias utilizadas

| Tecnologia      | Utilização              |
| --------------- | ----------------------- |
| React           | Interface               |
| TypeScript      | Tipagem                 |
| Vite            | Build e desenvolvimento |
| Tailwind CSS    | Estilização             |
| React Router    | Rotas do frontend       |
| Axios           | Comunicação com API     |
| React Hook Form | Formulários             |
| Zod             | Validação               |
| Node.js         | Runtime do backend      |
| Express         | API REST                |
| Prisma          | ORM                     |
| PostgreSQL      | Banco de dados          |
| JWT             | Autenticação            |
| bcrypt          | Criptografia das senhas |

---

# 👨‍💻 Objetivo do projeto

O projeto tem como objetivo desenvolver um sistema completo de gerenciamento para uma empresa de serviços de limpeza, aplicando conceitos de:

* Desenvolvimento Full Stack
* APIs REST
* Banco de dados relacional
* ORM
* Autenticação
* Autorização
* CRUD
* Arquitetura em camadas
* Validação de dados
* Integração entre frontend e backend
* Gerenciamento de estado
* Paginação
* Regras de negócio

---

# 📌 Status do projeto

🚧 **Em desenvolvimento**

As principais funcionalidades do sistema já estão implementadas, incluindo autenticação, gerenciamento de clientes, profissionais, agendamentos e dashboard.

O projeto continua podendo receber melhorias de interface, validações, testes automatizados e novas funcionalidades.

---

# 👨‍💻 Desenvolvedor

**Isaac Dantas**

Projeto desenvolvido durante a formação em Desenvolvimento de Sistemas — SENAI/SC.

```
```
