import fastify from 'fastify'
import cookie from '@fastify/cookie'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { transactionRoutes } from './routes/transactions'
import fs from 'node:fs'

export const app = fastify()

app.register(cookie, { secret: 'a-secret-string' })

app.register(fastifySwagger, {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'Bank Trasactions API',
      description:
        'This REST API project is designed for educational purposes only, to showcase the implementation of TypeScript, Zod, Knex, and Fastify in a web application',
      version: '1.0.0',
      contact: { name: 'Ivan Coimbra', url: 'https://github.com/ivanjrcomp' },
    },
    tags: [{ name: 'Transactions', description: 'Transactions routes' }],
  },
  stripBasePath: true,
  swagger: {
    basePath: '/v1',
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
})

const buffer = fs.readFileSync('favicon.png')

// eslint-disable-next-line
app.register(fastifySwaggerUi, {
  routePrefix: '/docs',

  theme: {
    favicon: [
      {
        filename: 'favicon.png',
        rel: 'icon',
        sizes: '16x16',
        type: 'image/png',
        content: Buffer.from(buffer.toString('base64'), 'base64').toString(),
      },
    ],
  },
  uiConfig: {
    deepLinking: true,
    layout: 'BaseLayout',
    showExtensions: false,
    displayRequestDuration: true,
    docExpansion: 'list',
    url: 'http://localhost:3333/docs',
  },
  staticCSP: false,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => {
    return swaggerObject
  },
  transformSpecificationClone: true,
})

app.register(transactionRoutes, {
  prefix: 'transactions',
})
