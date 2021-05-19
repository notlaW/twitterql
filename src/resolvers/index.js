const { v4: uuidv4 } = require('uuid')
const { getJwt } = require('../auth/validate')

const USER_TABLE = 'users'

module.exports = {
  Query: {
    userPosts: async (_, payload, context) => {
      const user = await context.dynamodb.getUserByEmail(payload.email)
      return user.posts
    },
    login: async (_, payload, context) => {
      try {
        const user = await context.dynamodb.getUserByEmail(payload.email)

        if (user && user.email === payload.email) {
          user.token = getJwt(user.email)
          console.log(`Login succussful current logged in user: ${user.email}`)
        }
        return user
      } catch (error) {
        console.error(error)
        return null
      }
    },
  },
  Mutation: {
    addPost: async (_, payload, context) => {
      const user = await context.dynamodb.getUserByEmail(payload.email)

      const postObject = { id: uuidv4(), postText: payload.postText }

      // Add "post"
      if (!user.posts) {
        user.posts = [postObject]
      } else {
        user.posts.push(postObject)
      }

      const putParams = {
        TableName: USER_TABLE,
        Item: user,
      }

      try {
        await context.dynamodb.put(putParams)
        return true
      } catch (error) {
        console.error(error)
        return false
      }
    },
    addUser: async (_, payload, context) => {
      try {
        await context.dynamodb.put({
          TableName: USER_TABLE,
          Item: {
            id: uuidv4(),
            email: payload.email,
            password: payload.password,
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
