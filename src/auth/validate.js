require('dotenv').config()

// https://auth0.com/blog/build-and-secure-a-graphql-server-with-node-js/
const jwt = require('jsonwebtoken')

async function getJwt(email) {
  const token = jwt.sign(
    { email, exp: Math.floor(Date.now() / 1000) + 60 * 60 },
    process.env.JWT_SECRET
  )
  return token
}

async function isTokenValid(token) {
  if (token) {
    const bearerToken = token.split(' ')

    // Async decoding of jwt, return user email signed in jwt to validate user tied to jwt
    return new Promise((resolve, reject) => {
      const decoded = jwt.verify(
        bearerToken[1],
        process.env.JWT_SECRET,
        (error, decoded) => {
          if (error) {
            console.error(error)
            reject(error)
          }
          console.log(decoded)
          resolve(decoded.email)
        }
      )
    })
  }

  return { error: 'No token provided' }
}

module.exports = {
  isTokenValid,
  getJwt,
}
