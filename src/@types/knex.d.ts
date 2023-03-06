// A extensão desse arquivo é .d.ts pq vem de types definitions (a ideia aqui é criar um tipo que abstraia a tabela do bd)
// o arquivo conterá apenas código typescript

// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    transactions: {
      id: string
      title: string
      amount: number
      created_at: string
      session_id?: string
    }
  }
}
