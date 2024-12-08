FROM node:20-alpine

# Create app directory and set working environment
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

# Get app version and commit time during build
ARG VITE_APP_VERSION
ARG VITE_COMMIT_TIME
ARG VITE_GIT_COMMIT
ENV VITE_APP_VERSION=$VITE_APP_VERSION
ENV VITE_COMMIT_TIME=$VITE_COMMIT_TIME
ENV VITE_GIT_COMMIT=$VITE_GIT_COMMIT

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies without running prepare script
RUN yarn install --production=false --frozen-lockfile --ignore-scripts

# Copy the rest of the application
COPY . .

# Build the application with PWA support
RUN yarn build

# Ensure OneSignal service worker is in the correct location
RUN cp public/OneSignalSDKWorker.js .output/public/

# Expose the listening port
EXPOSE 3000

# Start the application using the generated output
CMD ["node", ".output/server/index.mjs"]
