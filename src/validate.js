require('dotenv').config()
const axios = require('axios')

// https://auth0.com/blog/build-and-secure-a-graphql-server-with-node-js/
const jwt = require('jsonwebtoken')
const jwksClient = require('jwks-rsa')

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
})

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (error, key) {
    console.log(key)
    console.log(error)
    const signingKey = key.publicKey || key.rsaPublicKey
    callback(null, signingKey)
  })
}

async function getJwt() {
  // Send a POST request
  const auth0Response = await axios({
    method: 'POST',
    url: `${process.env.AUTH0_DOMAIN}/oauth/token`,
    headers: { 'content-type': 'application/json' },
    data: {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      audience: process.env.API_IDENTIFIER,
      grant_type: 'client_credentials',
    },
  })
  console.log(auth0Response)
  return auth0Response.data.access_token
}

async function isTokenValid(token) {
  if (token) {
    const bearerToken = token.split(' ')

    const result = new Promise((resolve, _) => {
      jwt.verify(
        bearerToken[1],
        getKey,
        {
          audience: process.env.API_IDENTIFIER,
          issuer: `https://${process.env.AUTH0_DOMAIN}/`,
          algorithms: ['RS256'],
        },
        (error, decoded) => {
          if (error) {
            resolve({ error })
          }
          if (decoded) {
            resolve({ decoded })
          }
        }
      )
    })

    return result
  }

  return { error: 'No token provided' }
}

module.exports = {
  isTokenValid,
  getJwt,
}
