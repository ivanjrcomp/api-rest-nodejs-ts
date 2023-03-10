export default {
  listAll: {
    summary: 'List All Transactions',
    description: 'Get list of all registered transactions',
    tags: ['Transactions'],
    cookies: {
      type: 'object',
      properties: {
        sessionId: {
          type: 'string',
          required: true,
          description:
            'This cookie includes the session ID, path, and expiration date. ' +
            '*It is generated during the first transaction registration and ' +
            'is used to maintain session state.',
        },
      },
    },
    response: {
      200: {
        description: 'Succesful response',
        properties: {
          transactions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  description: 'Transaction id',
                  type: 'string',
                  format: 'uuid',
                },
                title: { description: 'Transaction title', type: 'string' },
                amount: { description: 'Transaction amount', type: 'number' },
                created_at: {
                  description: 'Transaction created date',
                  type: 'string',
                  format: 'date',
                },
                session_id: {
                  description: 'Session ID',
                  type: 'string',
                  format: 'uuid',
                },
              },
            },
          },
        },
      },
    },
  },
  createTransaction: {
    summary: 'Create Transaction',
    description:
      'Create Transaction register with title, amount and type informations',
    tags: ['Transactions'],
    body: {
      type: 'object',
      properties: {
        title: { type: 'string', default: 'Transaction Description' },
        amount: { type: 'number', default: 0.01, minimum: 0.01 },
        type: {
          type: 'string',
          enum: ['debit', 'credit'],
          description: 'Type of transaction',
        },
      },
      required: ['title', 'amount', 'type'],
    },
    response: {
      201: {
        type: 'null',
        description: 'Successful registration',
        headers: {
          'Set-Cookie': {
            type: 'string',
            description: 'Session ID cookie with path and expiration',
            pattern:
              'sessionID=.*?; Path=/; Expires=[A-Za-z]{3}, \\d{2} [A-Za-z]{3} \\d{4} \\d{2}:\\d{2}:\\d{2} GMT',
          },
        },
      },
    },
  },
  listSpecificTransaction: {
    summary: 'Get information (specific transaction)',
    description: 'Get a specific transaction information by transaction id',
    tags: ['Transactions'],
    cookies: {
      type: 'object',
      properties: {
        sessionId: {
          type: 'string',
          required: true,
          description:
            'This cookie includes the session ID, path, and expiration date. ' +
            '*It is generated during the first transaction registration and ' +
            'is used to maintain session state.',
        },
      },
    },
    params: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Transaction ID',
          format: 'uuid',
        },
      },
    },
    response: {
      200: {
        description: 'Succesful response',
        properties: {
          transaction: {
            type: 'object',
            properties: {
              id: {
                description: 'Transaction id',
                type: 'string',
                format: 'uuid',
              },
              title: { description: 'Transaction title', type: 'string' },
              amount: { description: 'Transaction amount', type: 'number' },
              created_at: {
                description: 'Transaction created date',
                type: 'string',
                format: 'date',
              },
              session_id: {
                description: 'Session ID',
                type: 'string',
                format: 'uuid',
              },
            },
          },
        },
      },
    },
  },
  summary: {
    summary: 'Get total amount',
    description:
      'Obtenha o valor total de todas as transações generated in current session',
    tags: ['Transactions'],
    cookies: {
      type: 'object',
      properties: {
        sessionId: {
          type: 'string',
          required: true,
          description:
            'This cookie includes the session ID, path, and expiration date. ' +
            '*It is generated during the first transaction registration and ' +
            'is used to maintain session state.',
        },
      },
    },
    response: {
      200: {
        description: 'Succesful response',
        properties: {
          summary: {
            type: 'object',
            properties: {
              amount: {
                description:
                  'Returns the total amount of transactions recorded',
                type: 'number',
              },
            },
          },
        },
      },
    },
  },
}
