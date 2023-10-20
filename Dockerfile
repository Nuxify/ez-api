# Set the version of node to be used.
FROM node:16.16.0-alpine

# manage workflows and dependencies
WORKDIR /app/build

# make sure to delete node_modules
RUN mkdir -p node_modules

# Copy and install the package.json from local to ./ path
COPY package*.json ./

# Run NPM install command
RUN npm install

# Copy all local file to ./ path
COPY .  .

# Commands the container on how to run the application 
CMD ["npm","start"]

