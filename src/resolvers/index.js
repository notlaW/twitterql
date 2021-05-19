const { v4: uuidv4 } = require('uuid')
const { getJwt } = require('../auth/validate')

const USER_TABLE = 'users'

module.exports = {
  Query: {
    userPosts: async (_, payload, context) => {
      const userLookup = await getUserByEmail(context, payload.email)

      return userLookup.Item.posts
    },
    login: async (_, payload, context) => {
      const { dynamodb } = context

      try {
        // TODO: this just returns the whole list for now,
        // do a more targeted cheaper lookup using email as a Global Secondary index
        const response = await dynamodb.scan({
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
      console.log(JSON.stringify(payload))

      const params = {
        TableName: USER_TABLE,
        Key: {
          email: payload.email,
        },
      }

      // User lookup by email
      // TODO: make this more reusable
      const userLookup = await context.dynamodb.get(params)
      let user = userLookup.Item

      // Add "post"
      if (!user.posts) {
        user.posts = [{ id: uuidv4(), postText: payload.postText }]
      } else {
        user.posts.push(payload.postText)
      }

      const putParams = {
        TableName: USER_TABLE,
        Item: user,
      }

      await context.dynamodb.put(putParams)

      return true
    },
    addUser: async (_, payload, context) => {
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

async function getUserByEmail(context, email) {
  const params = {
    TableName: USER_TABLE,
    Key: {
      email,
    },
  }

  return await context.dynamodb.get(params)
}
