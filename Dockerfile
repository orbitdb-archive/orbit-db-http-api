FROM node:10

RUN mkdir api

WORKDIR /api

COPY . .

RUN npm ci  --no-color --only=prod

CMD ["node", "src/cli.js"]