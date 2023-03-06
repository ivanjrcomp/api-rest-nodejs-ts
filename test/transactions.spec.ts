import { beforeAll, afterAll, describe, it, expect, beforeEach } from 'vitest'
// A supertest não foi construida com TypeScript, mas sim em JavaScript. Logo, quando inclui o supertest fica sublinhado
// Se entrar no npmjs do supertest é possível ver um ícone DT na frente, indicando que o pacote TS foi criado por fora (pela comunidade)
import request from 'supertest'
import { app } from '../src/app'

// O ExecSync permite que seja executado comandos que poderiam ser executados no terminal (child_process permite executar scripts em paralelo )
import { execSync } from 'node:child_process'

// O describe do vitest permite criar categorias de testes que facilitam a visualização caso ocorram erros
describe('Transactions routes', () => {
  // Executa antes de todos os testes (uma única vez), para executar antes de cada teste por exemplo seria utilizado o beforeEach
  beforeAll(async () => {
    await app.ready()
  })

  // Close remove a aplicação da memória
  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  // existe a função teste e a função it que faz a mesma coisa
  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })

  it('should be able to list all transactions', async () => {
    // Para listar é necessário um cookie, todavia eu JAMAIS posso escrever um teste que dependa de um outro
    // logo não posso usar o teste de post para pegar o cookie e usar dentro deste contexto e precisarei repetir o trecho de criação
    // aqui dentro

    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransacitonResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransacitonResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New Transaction',
        amount: 5000,
      }),
    ])
  })

  it('should be able to get a specific transaction', async () => {
    // Para listar é necessário um cookie, todavia eu JAMAIS posso escrever um teste que dependa de um outro
    // logo não posso usar o teste de post para pegar o cookie e usar dentro deste contexto e precisarei repetir o trecho de criação
    // aqui dentro

    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransacitonResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = listTransacitonResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'New Transaction',
        amount: 5000,
      }),
    )
  })

  it('should be able to get the summary', async () => {
    // Para listar é necessário um cookie, todavia eu JAMAIS posso escrever um teste que dependa de um outro
    // logo não posso usar o teste de post para pegar o cookie e usar dentro deste contexto e precisarei repetir o trecho de criação
    // aqui dentro

    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Credit Transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Debit Transaction',
        amount: 2000,
        type: 'debit',
      })
    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(summaryResponse.body.summary).toEqual({
      amount: 3000,
    })
  })
})
