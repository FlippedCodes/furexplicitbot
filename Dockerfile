# get node
# TODO: test if functional version
FROM node:current-buster-slim

# RUN apk add --no-cache git

# Create app directory
WORKDIR /usr/src/app

# Get app dependencies
COPY package*.json ./

# building app
RUN npm ci --only=production

# Bundle app source
COPY . .

# start up the bot
CMD [ "npm", "start" ]