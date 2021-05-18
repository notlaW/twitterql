FROM node:14.4-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

RUN apk add curl

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 8080

CMD [ "node", "src/index.js" ]