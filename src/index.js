'use strict'
require('dotenv').config()

const port = process.env.PORT || 80

const start = async () => {
  try {
    const server = await require('./server')()
    await server.listen(port, '0.0.0.0')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()
