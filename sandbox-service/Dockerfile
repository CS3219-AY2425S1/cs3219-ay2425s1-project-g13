# backend/Dockerfile

# Use a Node.js base image
FROM docker:dind

# Install Node.js and any other dependencies
RUN apk update && \
    apk add --no-cache nodejs npm

# Set working directory
WORKDIR /usr/src/app/sandbox-service

# Copy package.json and install dependencies
COPY package*.json ./
# Ensure clean dependency install
RUN rm -rf node_modules
RUN npm install -g nodemon
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Expose the backend port
EXPOSE 8085

# No command necessary as it will be started with docker-compose


