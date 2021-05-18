const { v4: uuidv4 } = require('uuid')
const { isTokenValid, getJwt } = require('../validate')

module.exports = {
  Query: {
    userPosts: () => [],
    login: async (_, loginUser, context) => {
      const { db, token } = context

      var params = {
        TableName: 'users',
      }
      try {
        const response = await context.dynamodb.scan(params)
        const loggedInUser = response.Items.filter(
          (currUser) => currUser.password == loginUser.password
        )[0]

        if (loggedInUser) {
          loggedInUser.token = getJwt()
        }

        return loggedInUser
      } catch (error) {
        console.error(error)
      }
    },
  },
  Mutation: {
    addPost: () => true,
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
