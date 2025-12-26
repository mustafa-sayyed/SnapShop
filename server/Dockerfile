# First Stage - Build Image
FROM node:22-alpine AS build

WORKDIR /build

COPY package*.json  .

RUN npm ci

COPY . .


# Second Stage - Production Image
FROM node:22-alpine AS production

WORKDIR /app

COPY --chown=node:node --from=build /build/package*.json .

ENV NODE_ENV=production

RUN npm ci --omit=dev

COPY --chown=node:node --from=build /build/src /app/src
COPY --chown=node:node --from=build /build/server.js .

USER node

EXPOSE 3000

CMD [ "node", "server.js" ]

