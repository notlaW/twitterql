const { v4: uuidv4 } = require('uuid')
const { isTokenValid, getJwt } = require('../auth/validate')
const { rule, shield, and, or, not } = require('graphql-shield')

// Rules
const isAuthenticated = rule({ cache: 'contextual' })(
  async (parent, args, ctx, info) => {
    return await isTokenValid(ctx.token)
  }
)

const isAdmin = rule({ cache: 'contextual' })(
  async (parent, args, ctx, info) => {
    return ctx.user.role === 'admin'
  }
)

const isEditor = rule({ cache: 'contextual' })(
  async (parent, args, ctx, info) => {
    return ctx.email === 'editor'
  }
)

// TODO: export this

// Permissions
const permissions = shield({
  Mutation: {
    addPost: isAuthenticated,
  },
})

module.exports = {
  Query: {
    userPosts: async (_, loginUser, context) => {
      const { db, token } = context
    },
    login: async (_, loginUser, context) => {
      const { db, token } = context

      var params = {
        TableName: 'users',
      }
      try {
        // TODO: this just returns the whole list for now,
        // do a more targeted cheaper lookup using email as a Global Secondary index
        const response = await context.dynamodb.scan(params)
        const loggedInUser = response.Items.filter(
          (currUser) => currUser.password == loginUser.password
        )[0]

        if (loggedInUser) {
          loggedInUser.token = getJwt(loggedInUser.email)
        }

        return loggedInUser
      } catch (error) {
        console.error(error)
      }
    },
  },
  Mutation: {
    addPost: async (_, user, context) => {},
    addUser: async (_, user, context) => {
      try {
        console.log('writing user')
        await context.dynamodb.put({
          TableName: 'users',
          Item: {
            id: uuidv4(),
            email: user.email,
            password: user.password,
          },
        })
        return true
      } catch (error) {
        console.error(error)
        return false
      }
    },
  },
}
