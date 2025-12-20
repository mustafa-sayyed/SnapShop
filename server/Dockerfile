# First Stage - Build Image
FROM node:22-alpine AS build

WORKDIR /build

COPY package*.json  .

RUN npm install

COPY . .


# Second Stage - Production Image
FROM node:22-alpine AS production

WORKDIR /app

COPY --from=build /build/src /app/src
COPY --from=build /build/package*.json .
COPY --from=build /build/server.js .

ENV NODE_ENV=production

RUN npm install --production

CMD [ "npm", "start" ]

