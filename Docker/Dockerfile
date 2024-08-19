# Use the official Node.js image from the Docker Hub
FROM node:latest

# Set environment variables
ENV NODE_ENV=prod
ARG GH_TOKEN
ARG PORT

# Set the working directory inside the container
WORKDIR /app

# Copy your application code to the container
COPY ./server .

# Install dependencies (if you have a package.json file)
RUN npm install

# Expose The PORT
EXPOSE ${PORT}

# Command to run your Node.js application
CMD ["node", "server.js"]
