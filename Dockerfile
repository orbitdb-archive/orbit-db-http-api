FROM node:10

RUN mkdir api

WORKDIR /api

COPY . .

RUN npm ci --only=prod

CMD ["node", "src/cli.js"]