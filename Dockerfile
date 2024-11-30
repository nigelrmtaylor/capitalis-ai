FROM node:20-alpine

# Create app directory and set working environment
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=4000
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=4000

# Get commit time during build
ARG COMMIT_TIME
ENV VITE_COMMIT_TIME=$COMMIT_TIME

# Get app version during build
ARG VITE_APP_VERSION
ENV VITE_APP_VERSION=$VITE_APP_VERSION

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application
COPY . .

# Build the application
RUN yarn build

# Expose the port the app runs on
EXPOSE 4000

# Start the application
CMD ["node", ".output/server/index.mjs"]
