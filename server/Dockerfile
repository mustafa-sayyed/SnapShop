# First Stage - Build Image
FROM node:22-alpine AS build

WORKDIR /build

COPY package*.json  .

RUN npm ci

COPY . .


# Second Stage - Production Image
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --chown=node:node --from=build /build/package*.json .
COPY --chown=node:node --from=build /build/src /app/src
COPY --chown=node:node --from=build /build/server.js .
COPY --chown=node:node --from=build /build/node_modules /app/node_modules

USER node

EXPOSE 3000

CMD [ "node", "server.js" ]

