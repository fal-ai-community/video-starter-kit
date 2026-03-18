FROM node:20-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache git

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Expose Next.js dev server port
EXPOSE 3000

# Run development server
CMD ["npm", "run", "dev"]

