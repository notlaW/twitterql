const expect = require('chai').expect
const Fastify = require('fastify')

describe('graphql', function () {
  let fastify
  before(() => {
    fastify = Fastify({ logger: { level: 'silent' } })
    fastify.register(require('../../src/routes/graphql'))
  })

  it('should respond with a canned response', function () {
    fastify.inject(
      {
        method: 'GET',
        url: 'graphql',
      },
      (error, response) => {
        expect(error).to.be.null
        const json = JSON.parse(response.payload)
        expect(response.statusCode).to.equal(200)
        expect(json.message).to.equal('stay tuned for graphql')
      }
    )
  })
})
