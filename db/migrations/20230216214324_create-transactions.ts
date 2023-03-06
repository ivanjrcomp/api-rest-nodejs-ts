/* eslint-disable no-unused-expressions */
import { Knex } from 'knex'

// O que a migration vai fazer no BD
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary
    table.text('title').notNullable
    table.decimal('amout', 10, 2).notNullable
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable
  })
}

// Se for necessário dar um rollback (contrário do que foi feito no up)
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transactions')
}
