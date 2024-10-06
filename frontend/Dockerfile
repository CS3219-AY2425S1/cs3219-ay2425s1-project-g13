# frontend/Dockerfile

# Use an official Node.js image as a base for building the frontend
FROM node:18-alpine AS build

# Install dependencies needed for building native packages with vite
RUN apk add --no-cache python3 make g++ 

# Set working directory inside the container
WORKDIR /usr/src/app

# Install dependencies
COPY package.json ./
# Ensure clean dependency install
RUN rm -rf node_modules
RUN npm install

# Copy the frontend source code
COPY . .

# # Build the React app for production
# RUN npm run build

# # Use an nginx image to serve the frontend app
# FROM nginx:alpine

# # Copy the build output from the previous stage to the Nginx container
# COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose the frontend port
EXPOSE 3000

RUN npm run build

# Command to run the frontend server
CMD ["npm", "run", "preview"]
