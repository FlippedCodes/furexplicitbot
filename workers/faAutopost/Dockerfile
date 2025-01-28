# get node
# needs to be this version, otherwise breakes uwuifier
FROM node:18.5.0-buster-slim

# RUN apk add --no-cache git

# Create app directory
WORKDIR /usr/src/app

# Get app dependencies
COPY ./workers/faAutopost/package*.json ./
COPY ./package-lock.json ./

# building app
RUN npm ci --omit=dev

# Bundle app source
COPY ./workers/faAutopost/. .

# start up the bot
CMD [ "npm", "start" ]