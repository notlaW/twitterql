module.exports = async function (fastify) {
  fastify.get('/healthcheck', async (response, reply) => reply.code(200).send())
}
