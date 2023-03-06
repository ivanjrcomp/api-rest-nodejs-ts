// Runtime type checking = Validação dos tipos usados na aplicação apenas em tempo de execução
// Static Type Checking = validação dos tipos durante a escrita do código
// no TypeScript é possível usar um type ou interface para determinar o tipo do dado

// O Node não entende typeScript por padrão ao contrário do Deno por exemplo
// para funcionar é preciso instalar o typescript em modo dev (npm i -D typescript) e criar um arquivo
// de configuração para o typescript para facilitar basta npx (executar binários das bibliotecas instaladas)
// npx tsc --init (é o mesmo que ./node_modules/.bin/tsc)
// O comando criará o arquivo tsconfig e no mesmo é importante mudar o target pois informa para qual versão do JavaScript converteremos nosso código
// Após passar para ecmascript 2020 por exemplo, é possível usar o comando npx tsc src/index.ts pois assim o arquivo index.ts é convertido em seu js correspondente

// Para usar o node com o typescript, por não ser padrão também é necessário instalar o pacote types node também para que funcione
// npm i -D @types/node
// Após a instalação aí sim é possível usar npx tsc src/server.ts
// Se for usado o pacote tsx facilita o trabalho de ter que toda vez converter com npx tsc <arquivo.ts>
// npm i -D tsx
// Assim basta executar o fonte com npx tsx <arquivo.ts> que será executado sem mostrar inclusive o arquivo js duplicado na pasta do projeto
// lembrando que tsx só deve ser usado em Desenvolvimento, para produção é necessário converter para JavaScript (já que é muitooo mais rápido)
// para ver o tempo de execução é possível usar os comando a seguir:
// time tsx src/server.js
// time node src/server.js

// ESLint = ecma script lint (npm i -D eslint)
// Para trabalhar com o eslint foi necessário instalar a extensão eslint, instalamos um package da rocketseat (npm i -D eslint @rocketseat/eslint-config)
// abrimos com Cmd + Shift + P e digitamos settings json para abrir "Open user settings Json"
// incluímos as linhas a seguir no objeto presente no arquivo settings.json:
// "editor.codeActionsOnSave": {
//     "source.fixAll.eslint": true
// }
// O comando acima faz com que todo fonte sempre que for salvo tente corrigir tudo que é apontado pelo lint automaticamente
// incluímos o comando no package.json para validar todo fonte com o lint e corrigir o que for possível automaticamente ("lint": "eslint src --ext .ts --fix")

// O fastify que será nosso server tem uma vantagem enorme que o permite aceitar plugins e que inclusive serão usados para definição de rotas
// Para se trabalhar com cokies é importante também que seja instalado o fastify/cookie
// npm i @fastify/cookie

// TSUp: Ferramenta para facilitar a transcrição de TypeScript para JavaScript (visando deploy em prod). Utiliza por baixo o esBuild

// *** Resumindo tivemos que instalar ***
// npm i -D @types/node eslint typescript tsx tsup @rocketseat/eslint-config dotenv zod vitest supertest @types/supertest
// npm i fastify knex sqlite3 @fastify/cookie  --save

// knexjs = Query Builder. Package que mistura java script com código do banco e gera a query final sem depender tanto do sql
// Uma opção do knex são os ORMs.
// O knex foi criado para ser usado com o JavaScript e não com o TypeScript logo é necessário executar
// npx knex migrate: make create-documents
// o comando vai criar uma primeira tabela no banco vai dar um série de ERROS e para que ele conheça as infos do bd
// é necessário criar um arquivo knexfile.ts na raiz do projeto
// para funcionar foi preciso criar um novo comando no package.json "node --loader tsx ./node_modules/.bin/knex"
// com isso é possível usar agora o comando npm run knex -- -h (onde o -h seria um comando que seria passado para dentro do knex que se rodado traz o help)
// o -- -h passa os parâmetros para o knex -h
// após isso é possível usar o comando: npm run knex -- migrate:make create-documents (esse comando ao ser executado cria a pasta migrations e começa-se o versionamento do Banco de Dados)

// Migrations é como um controle de versão dentro do banco de dados. Portanto, após criada jamais deverá ser editada, já que se alguém rodou ela não será relida e com isso poderá corromper o banco
// se houver a necessidade de mudar uma migration o ideal é criar uma outra

import fastify from 'fastify'
import cookie from '@fastify/cookie'
// import crypto from 'node:crypto'

import { transactionRoutes } from './routes/transactions'

export const app = fastify()

app.register(cookie)

// Podemos cadastrar quantas rotas quisermos, o único ponto importante é a ordem pois o Fastify irá executar nesta ordem
// Logo se houver algo importante que seja feito por plugin é importante deixar na ordem correta
// quando se registra é possível passar um segundo parâmetro que é o prefix, e isso indica que quando derterminada URL com prefixo XPTO for chamada deve bater naquela rota
app.register(transactionRoutes, {
  prefix: 'transactions',
})
