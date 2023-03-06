import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import crypto from 'node:crypto'
import { checkSessionIdExists } from '../middlewares/check-sessionId-exists'

// Testes:
// Unitários: Testam exclusivamente uma unidade da aplicação (de forma totalmente isolada)
// Integração: Comunicação entre duas ou mais unidades
// end to end (e2e): Simulam um usuário operando a aplicação. Testes que irão verificar as portas de entrada do Back-end (neste caso)

// Pirâmide de testes: O primeiro teste que se deve aprender é e2e já que é indiferente de arquitetura, tecnologia etc já que tem baixa barreira de entrada
// Os testes e2e, são os mais lentos geralmente, já que simulam o usuário trabalhando com o backend
// O ideal é termos muitos testes unitário, uma média quantidade de integração e poucos testes e2e
// Para testes geralmente a biblioteca mais utilizada é o JEST, mas foi criado o vitest (criado pelo time do Vue)
// o Vitest será utilizado pois ele é criado em cima do esbuild, igual o typescript e a ferramenta auxilia (o código do JEST e Vitest é praticamente igual)
// Uma outra lib que utilizaremos é o supertest que evita termos que subirmos um servidor (o SuperTest permite testar sem colocarmos a aplicação no ar e usar o método listen)

// Cookies => Forma de manter contexto entre requisições

// O preHandler executa uma função antes de acionar a função (handler) chamada pelo get, logo neste momento é checado a existência do cookie
// Esta é uma forma manual, mas é possível fazer um handler global também

// Todo plugin do Fastfy é assincrono
export async function transactionRoutes(app: FastifyInstance) {
  // O Hook server para criar um método que será utilizado globalmente dentro deste contexto (a cada chamada de rota),
  // Logo, todas as rotas deste plugin irão executar esta função sem precisar colocar preHandler em cada rota
  app.addHook('preHandler', async (request, reply) => {
    console.log(`[${request.method}] ${request.url}`)
  })

  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select()

      return { transactions }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const getTransactionParamSchema = z.object({
        id: z.string().uuid(),
      })

      console.log('teste')

      const { id } = getTransactionParamSchema.parse(request.params)
      const { sessionId } = request.cookies

      // Por padrão o Knex retorna sempre um array exceto quando é utilizado o comando first()
      const transaction = await knex('transactions')
        .where({
          id,
          session_id: sessionId,
        })
        // .andWhere('session_id', sessionId) ou passando um objeto com várias cláusulas where
        .first()

      return { transaction }
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()

      return { summary }
    },
  )

  app.post('/', async (request, reply) => {
    // Dentro desta transação eu quero receber o título, valor e type: credit ou debit

    // usaremos o zod para validar o body
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['debit', 'credit']),
    })

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    let sessionId = request.cookies.sessionId

    // MaxAge: Quantos milisegundos serão necessário para expirar o cookie
    if (!sessionId) {
      sessionId = crypto.randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 Dias (Milesegundos * seg * min * quantas hrs * qts dias)
      })
    }

    await knex('transactions').insert({
      id: crypto.randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    // HTTP Codes= 201 (Recurso criado com sucesso!)
    return reply.status(201).send()
  })
}
