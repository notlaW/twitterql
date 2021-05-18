const { v4: uuidv4 } = require('uuid')

module.exports = {
  Query: {
    userPosts: () => [],
    users: async (_, __, context) => {
      var params = {
        TableName: 'users',
      }

      try {
        const users = await context.dynamodb.scan(params).promise
        console.log(users)
        return users
      } catch (error) {
        console.error(error)
        throw new Error('Error scanning users!')
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
