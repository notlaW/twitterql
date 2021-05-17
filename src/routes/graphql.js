module.exports = async function (fastify) {
  fastify.get('/graphql', async (response, reply) =>
    reply.code(200).send({ message: 'stay tuned for graphql' })
  )
}
