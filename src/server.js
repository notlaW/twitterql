const mercurius = require('mercurius')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { rule, shield } = require('graphql-shield')
const { applyMiddleware } = require('graphql-middleware')
const { isTokenValid } = require('./auth/validate')

const Dynamo = require('./aws/dynamo/dynamo')

module.exports = async function () {
  const fastify = require('fastify')({
    logger: true,
  })

  //Schema
  const typeDefs = require('./schemas')
  //Resolvers
  const resolvers = require('./resolvers')

  // Rules
  const isPostingToSelf = rule({ cache: 'contextual' })(
    async (parent, args, ctx, info) => {
      return ctx.email === args.email
    }
  )

  // Permissions
  const permissions = shield({
    Mutation: {
      addPost: isPostingToSelf,
    },
  })

  // JIT compilation of schema (more info here https://www.npmjs.com/package/graphql-jit)
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const schemaWithMiddleware = applyMiddleware(schema, permissions)

  // Init data store
  const dynamodb = new Dynamo()
  await dynamodb.connect()

  // Runs before request is processed, passes down context to resolvers
  async function context(request) {
    const { authorization: token } = request.headers
    let context = { dynamodb }

    // If an incoming request has an auth header, try to decode it, and place the user email on the context
    // Email will be used to auth user against adding post
    if (token) {
      try {
        let email = await isTokenValid(token)
        context.token = token
        context.email = email
        return context
      } catch (error) {
        // TODO: gracefully hand back a 403 in this scenario
        console.log(error)
        return context
      }
    } else {
      return context
    }
  }

  // Register all config with fastify+graphql plugin
  // This also generates a /graphql endpoint
  fastify.register(mercurius, {
    schema: schema,
    context,
  })

  fastify.register(require('./routes/healthcheck'))
  fastify.log.info('Plugin Registration Complete')

  return fastify
}
