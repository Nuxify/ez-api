# Set the version of node to be used.
FROM node:18.12.1

# Make a working directory on /app path
WORKDIR /app

# Copy and install the package.json from local to ./ path
COPY package*.json ./

# Run NPM install command
RUN npm install

# Copy all local file to ./ path
COPY .  .

# Add environment port 
ENV PORT=3000

# Expose the port 
EXPOSE 3000



# Commands the container on how to run the application 
CMD ["npm","start"]

