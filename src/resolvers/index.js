const { v4: uuidv4 } = require('uuid')
const { getJwt } = require('../auth/validate')

const USER_TABLE = 'users'

module.exports = {
  Query: {
    userPosts: async (_, payload, context) => {
      console.log('USER POSTS RESOLVER')
      const userLookup = await context.dynamodb.getUserByEmail(payload.email)
      console.log(`userLookup: ${userLookup}`)
      return userLookup.Item.posts
    },
    login: async (_, payload, context) => {
      console.log('LOGIN RESOLVER')
      try {
        // TODO: this just returns the whole list for now,
        // do a more targeted cheaper lookup using email as a Global Secondary index
        const response = await context.dynamodb.scan({
          TableName: USER_TABLE,
        })
        const loggedInUser = response.Items.filter(
          (currUser) => currUser.password == payload.password
        )[0]

        if (loggedInUser) {
          loggedInUser.token = getJwt(loggedInUser.email)
          console.log(
            `Login succussful current logged in user: ${loggedInUser.email}`
          )
        }

        return loggedInUser
      } catch (error) {
        console.error(error)
      }
    },
  },
  Mutation: {
    addPost: async (_, payload, context) => {
      console.log('ADD POST RESOLVER')
      const userLookup = await context.dynamodb.getUserByEmail(payload.email)
      let user = userLookup.Item

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

      await context.dynamodb.put(putParams)

      return true
    },
    addUser: async (_, payload, context) => {
      console.log('ADD USER RESOLVER')
      try {
        console.log('writing user')
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
