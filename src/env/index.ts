// A biblioteca Zod serve para validação de dados
import { config } from 'dotenv'
// (o zod é melhor que Joi ou Yup pois a integração com o TypeScript é muito próxima)
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
})

// O método parse identifica que se tiver algo inconsistente já será disparado uma exceção
// por outro lado há também o método safeParse que por sua vez faz a validação mas não dispara o erro
// dessa forma é possível tratar a exceção
// export const env = envSchema.parse(process.env)
export const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  // Para colocar o emotion basta clicar no VSCode CTRL + COMMAND + SPACE
  console.error('🚨 ⚠️ Invalid environment variables!', _env.error.format())

  throw new Error('Invalid environment variables!')
}

export const env = _env.data
