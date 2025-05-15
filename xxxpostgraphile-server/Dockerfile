FROM node:20-alpine

# Add build dependencies
RUN apk add --no-cache python3 make g++

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5678

# Create app directory
WORKDIR /home/node/app

# Copy package files first
COPY ./src/package*.json ./

# Install dependencies with verbose logging
RUN npm install --verbose

# Copy application files
COPY ./src .

# Set proper permissions
RUN chown -R node:node /home/node/app
USER node

EXPOSE 5678

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5678/graphiql || exit 1

CMD [ "node", "--trace-warnings", "index.mjs" ]