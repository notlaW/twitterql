module.exports = async function () {
  const fastify = require('fastify')({
    logger: true,
  })

  const mercurius = require('mercurius')

  const schema = `
    type Query {
      add(x: Int, y: Int): Int
    }
  `

  const resolvers = {
    Query: {
      add: async (_, { x, y }) => x + y,
    },
  }

  fastify.register(mercurius, {
    schema,
    resolvers,
  })

  fastify.register(require('./routes/healthcheck'))
  // fastify.register(require('./routes/graphql'))
  fastify.log.info('Plugin Registration Complete')

  return fastify
}
