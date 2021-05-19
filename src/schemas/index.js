module.exports = `
  type Query {
    userPosts(email: String!): [Post]
    login(email: String!, password: String!): User
  }
  type Mutation {
    addPost(email: String!, postText: String!): Boolean!
    addUser(email: String!, password: String!): Boolean!
  }
  type Post {
    id: ID!
    postText: String!
  }
  type User {
    id: ID!
    email: String!
    password: String!
    posts: [Post]
    token: String
  }
`
