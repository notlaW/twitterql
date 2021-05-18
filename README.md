# Twitterql API Prototype

Nodejs + Fastify + GraphQL = Twitter.

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
