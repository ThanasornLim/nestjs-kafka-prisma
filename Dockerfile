###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:16-alpine As development
USER root
# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./

RUN yarn global add dotenv-cli

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN yarn
RUN yarn prisma generate

# Bundle app source
COPY  . .
RUN yarn build

# Use the node user from the image (instead of the root user)
USER node