module.exports = async function () {
  const fastify = require('fastify')({
    logger: true,
  })

  fastify.register(require('./routes/healthcheck'))
  fastify.register(require('./routes/graphql'))
  fastify.log.info('Plugin Registration Complete')

  return fastify
}
