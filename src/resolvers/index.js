const { v4: uuidv4 } = require('uuid')

module.exports = {
  Query: {
    userPosts: () => [],
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
