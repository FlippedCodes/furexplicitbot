# get node
# needs to be this version, otherwise breakes uwuifier
FROM oven/bun:1.1-alpine

# RUN apk add --no-cache git

# Create app directory
WORKDIR /usr/src/app

# Get app dependencies
COPY package*.json ./

# building app
# RUN bun update

# RUN bun install
RUN bun install --production

# Bundle app source
COPY . .

# start up the bot
CMD [ "bun", "start" ]