# Base stage
FROM node:lts AS base
WORKDIR /usr/local/app

# Development stage
FROM base AS dev
ENV NODE_ENV=development
COPY app/package.json app/yarn.lock ./
RUN yarn install && yarn cache clean
COPY app ./
CMD ["yarn", "dev"]

# Production stage
FROM base AS prod
ENV NODE_ENV=production
COPY app/package.json app/yarn.lock ./
RUN yarn install --production && yarn cache clean
COPY app ./
CMD ["node", "src/index.js"]
