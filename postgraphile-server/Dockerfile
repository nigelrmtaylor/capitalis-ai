FROM node:alpine
LABEL description="Instant high-performance GraphQL API for your PostgreSQL database https://github.com/graphile/postgraphile"

# Set Node.js app folder
RUN mkdir -p /home/node/app/node_modules
WORKDIR /home/node/app

# Copy package.json only (to leverage Docker cache)
COPY ./src/package.json ./

# Set ownership
RUN chown -R node:node /home/node/app

# Install dependencies
USER node
RUN npm install

# Copy application files
COPY --chown=node:node ./src .

EXPOSE 5678
CMD [ "node", "index.mjs" ]