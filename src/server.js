const Dynamo = require('./aws/dynamo/dynamo')

module.exports = async function () {
  const fastify = require('fastify')({
    logger: true,
  })

  const mercurius = require('mercurius')

  const schema = require('./schemas')
  const resolvers = require('./resolvers')

  const dynamodb = new Dynamo()
  await dynamodb.connect()
  console.log('Connected to Dynamo')

  fastify.register(mercurius, {
    schema,
    graphiql: true,
    resolvers,
    context: async (request, _) => {
      // Return an object that will be available in your GraphQL resolvers

      const { authorization: token } = request.headers
      return { dynamodb, token }
    },
  })

  fastify.register(require('./routes/healthcheck'))
  fastify.log.info('Plugin Registration Complete')

  return fastify
}
