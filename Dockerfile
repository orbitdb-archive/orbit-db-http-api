FROM node:10

LABEL maintainer="OrbitDB Team"
LABEL description="An HTTP API Server for the OrbitDB distributed peer-to-peer database"
LABEL author="Phillip Mackintosh, Hayden Young"
LABEL license="MIT"
LABEL repository="https://github.com/orbitdb/orbit-db-http-api"

RUN mkdir api

WORKDIR /api

COPY . .

RUN npm ci  --no-color --only=prod

CMD ["node", "src/cli.js"]