// Knex é uma interface com todas as configurações possíveis de usar de dentro do knex
import { knex as setupknex, Knex } from 'knex'
// ao realizar este import o dotenv instalado já incorpora o que está na variável .env junto às variáveis de ambiente
import { env } from './env'

// ao dizer que o config: Knex.Config eu digo que o config deve respeitar a interface Knex logo passa a funcionar o autocomplete no fonte
// A propriedade migrations permite que o arquivo de migrations seja escrito usando typeScript e que o diretório seja customizado e não mais seja criado na raiz
export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = setupknex(config)
