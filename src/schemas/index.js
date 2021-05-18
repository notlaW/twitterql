module.exports = `
  type Query {
    userPosts: [Post]
    users: [User]
  }
  type Mutation {
    addPost(authorId: String!, postText: String!): Boolean!
    addUser(username: String!): Boolean!
  }
  type Post {
    id: ID!
    postText: String!
  }
  type User {
    id: ID!
    username: String!
    posts: [Post]
  }
`
