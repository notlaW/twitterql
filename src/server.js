const Dynamo = require('./aws/dynamo/dynamo')

module.exports = async function () {
  const fastify = require('fastify')({
    logger: true,
  })

  const mercurius = require('mercurius')

  const dynamodb = new Dynamo()
  console.log('Connecting to Dynamo')
  await dynamodb.connect()

  const schema = require('./schemas')
  const resolvers = require('./resolvers')

  fastify.register(mercurius, {
    schema,
    graphiql: true,
    resolvers,
    context: (_, __) => {
      // Return an object that will be available in your GraphQL resolvers
      return { dynamodb }
    },
  })

  fastify.register(require('./routes/healthcheck'))
  fastify.log.info('Plugin Registration Complete')

  return fastify
}
