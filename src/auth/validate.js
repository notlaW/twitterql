require('dotenv').config()

// https://auth0.com/blog/build-and-secure-a-graphql-server-with-node-js/
const jwt = require('jsonwebtoken')

async function getJwt(email) {
  // Quick and dirty jwt solution. Use a auth provider in a production setting
  const token = jwt.sign(
    { email, exp: Math.floor(Date.now() / 1000) + 60 * 60 },
    process.env.JWT_SECRET
  )
  return token
}

async function isTokenValid(token) {
  if (token) {
    const bearerToken = token.split(' ')
    // Async decoding of jwt, return user email signed in jwt to validate which user is tied to jwt
    return new Promise((resolve, reject) => {
      jwt.verify(bearerToken[1], process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
          console.error(error)
          reject(error)
        }
        resolve(decoded.email)
      })
    })
  }

  return { error: 'No token provided' }
}

module.exports = {
  isTokenValid,
  getJwt,
}
