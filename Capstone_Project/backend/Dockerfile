# Use Node base image
FROM node:22-alpine as build

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy all other files
COPY . .

# Expose app port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
