const port = process.env.APP_PORT || 8080

const start = async () => {
  try {
    const server = await require('./server')()
    await server.listen(port, '0.0.0.0') // 0.0.0.0 for docker
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()
