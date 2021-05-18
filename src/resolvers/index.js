const { v4: uuidv4 } = require('uuid')

module.exports = {
  Query: {
    userPosts: () => [],
    users: async (_, __, context) => {
      var params = {
        TableName: 'users',
      }
      try {
        const response = await context.dynamodb.scan(params)
        console.log(`users: ${JSON.stringify(response.Items)}`)
        return response.Items
      } catch (error) {
        console.error(error)
      }
    },
  },
  Mutation: {
    addPost: () => true,
    addUser: async (_, user, context) => {
      try {
        await context.dynamodb.put({
          TableName: 'users',
          Item: {
            id: uuidv4(),
            username: user.username,
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
