module.exports = `
  type Query {
    userPosts: [Post]
  }
  type Mutation {
    addPost(authorId: String!, postText: String!): Boolean!
    addUser(username: String!): Boolean!
  }
  type Post {
    id: ID!
    postText: String!
  }
  type user {
    id: ID!
    username: String!
    posts: [Post]
  }
`
