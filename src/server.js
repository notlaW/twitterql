const { JwksRateLimitError } = require('jwks-rsa')
const { isTokenValid } = require('./auth/validate')
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
      let context = { dynamodb }

      // if an incoming request has an auth header, try to decode it, and place the user email on the context
      if (token) {
        try {
          let email = await isTokenValid(token)
          console.log(`Login succussful current logged in user: ${email}`)
          context.token = token
          context.email = email
          return context
        } catch (error) {
          //if jwt validation fails, log error, return only dynamodb on the context
          console.error(error)
          return context
        }
      } else {
        return context
      }
    },
  })

  fastify.register(require('./routes/healthcheck'))
  fastify.log.info('Plugin Registration Complete')

  return fastify
}
