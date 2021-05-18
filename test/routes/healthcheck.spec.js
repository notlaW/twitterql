const expect = require('chai').expect
const Fastify = require('fastify')

describe('healthcheck', function () {
  let fastify
  before(() => {
    fastify = Fastify({ logger: { level: 'silent' } })
    fastify.register(require('../../src/routes/healthcheck'))
  })

  it('should respond with a 200', function () {
    fastify.inject(
      {
        method: 'GET',
        url: 'healthcheck',
      },
      (error, response) => {
        expect(error).to.be.null
        expect(response.statusCode).to.equal(200)
      }
    )
  })
})
