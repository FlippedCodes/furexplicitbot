# get node
# needs to be this version, otherwise breakes uwuifier
FROM node:18.5.0-buster-slim

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
CMD [ "npm", "run", "startLegacy" ]
