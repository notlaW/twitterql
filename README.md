# Twitterql API Prototype

Nodejs + Fastify + GraphQL + DynamoDB = Twitter.

## Testing:

Mocha is the primary test runner, to run tests:

```bash
$ npm run test
```

## Linting / Formatting:

Eslint + Prettierjs configuration

(Highly recommend prettier plugin + format on save)

```
$ npm run lint
```

## Running app using docker

(With docker installed on your machine)

```
$ docker-compose up
Creating network "twitterql_app-network" with driver "bridge"
Creating nodejs ... done
Attaching to nodejs
nodejs    | {"level":30,"time":1621293032555,"pid":1,"hostname":"689ae5edeeeb","msg":"Plugin Registration Complete"}
nodejs    | {"level":30,"time":1621293032567,"pid":1,"hostname":"689ae5edeeeb","msg":"Server listening at http://0.0.0.0:8080"}
```

Docker compose will stand two containers, one local Dynamodb instance and an instance of the app.

## GraphQL

Some sample mutations and queries, all graphql queries should be targeted at the /graphql endpoint.

Example CURL:

```
curl --location --request POST 'http://localhost:8080/graphql' \
--header 'Content-Type: application/json' \
--data-raw '{"query":"mutation {\r\n  addUser(email: \"fakeusername@email.com\", password: \"fakepassword\")\r\n}","variables":{}}'
```

### Create User:

```
mutation {
  addUser(email: "fakeusername@email.com", password: "fakepassword")
}
```

### Login A User

```
{
  login(email: "fakeusername@email.com", password:"fakepassword" ) {
    id email token
  }
}
```

### Add Post

### Auth: will require token from the login endpoint

#### (Auth token format: `Bearer: {YOUR_TOKEN})

```
mutation {
  addPost(email: "fakeusername@email.com", postText: "super fun twitter post")
}
```

### Query User Posts

```
{
  userPosts(email: "fakeusername@email.com" ) {
    postText  id
  }
}
```

## Next Steps / Wish list

- CICD
- Exhaustive testing around the graphql endpoint
- A real Auth provider
- Logging
- Tracing
- Dev/Prod constants
- A better data structure for storing posts (an array on a user object will not scale)
- A graph database instead of NOSQL

## DynamoDB

This protoype utilizes DynamoDB for storage. For local development,the app will use dummy credentials and point at the DynamoDb instance spun up with docker-compose. Any interface with dynamo outside of the app will have to be done using the cli, and possibly require `aws configure` command to be run.

## Limitations

The primary goal behind this protype was to demonstrate a graphql implentation using Fastify. Fastify is a very low overhead extension of express that comes with modern nodejs features out of the box. Mercurius, the graphql plugin for fastify, aims to do the same for graphql servers and gateways.

While the performance benefits are fantastic, for a protype app that is just looking to get functionality off of the ground: I found it a bit cumbersome. One call out was the way `graphql-shield` works, if an error is thrown in your resolver you end up with a not authorized message, a 500 and a swallowed error. In order to debug I had to turn off the auth functionality in order to get correct messages. This could be solved with a debug config object but I couldn't get it to work.

Another limitation I thought of about 9/10ths of the way through this challenge was NOT using a graph database. Dynamo was nice provided quick local install and would have set the app up for an easy deployment to an AWS account. Something like NEO4j for example would have allowed for more flexibility in how we model, and query our data.

More info on Fastify and Mercurius can be found here
https://github.com/mercurius-js/mercurius
https://www.fastify.io/
