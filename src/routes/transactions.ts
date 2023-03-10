import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import crypto from 'node:crypto'
import { checkSessionIdExists } from '../middlewares/check-sessionId-exists'
import schemaDefinition from './doc/transactions.schemas'

export async function transactionRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    console.log(
      `[${request.method}] ${request.url} ${JSON.stringify(request.cookies)}`,
    )
  })

  app.post(
    '/',
    {
      schema: schemaDefinition.createTransaction,
    },
    async (request, reply) => {
      const createTransactionBodySchema = z.object({
        title: z.string(),
        amount: z.number(),
        type: z.enum(['debit', 'credit']),
      })

      const { title, amount, type } = createTransactionBodySchema.parse(
        request.body,
      )

      let sessionId = request.cookies.sessionId

      if (!sessionId) {
        sessionId = crypto.randomUUID()

        reply.cookie('sessionId', sessionId, {
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days (Miliseconds * seconds * minutes * hours * amount of days)
        })
      }

      await knex('transactions').insert({
        id: crypto.randomUUID(),
        title,
        amount: type === 'credit' ? amount : amount * -1,
        session_id: sessionId,
      })

      return reply.status(201).send()
    },
  )

  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
      schema: schemaDefinition.listAll,
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
      schema: schemaDefinition.listSpecificTransaction,
    },
    async (request) => {
      const getTransactionParamSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getTransactionParamSchema.parse(request.params)
      const { sessionId } = request.cookies

      const transaction = await knex('transactions')
        .where({
          id,
          session_id: sessionId,
        })
        .first()
      console.log(transaction)
      return { transaction }
    },
  )

  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
      schema: schemaDefinition.summary,
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
}
