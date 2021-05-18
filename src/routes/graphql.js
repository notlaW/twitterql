module.exports = async function (fastify) {
  fastify.post('/graphql', async (response, reply) => reply.graphql(query))
}
