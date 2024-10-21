# backend/Dockerfile

# Use a Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json ./
# Ensure clean dependency install
RUN rm -rf node_modules
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Expose the backend port
EXPOSE 8080

# Command to run the backend server
CMD ["npm", "start"]
