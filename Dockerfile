FROM node:12-slim

# Create App directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle App source
COPY . /usr/src/app

# Install App dependencies
RUN npm install --silent

# Remove dev dependencies
RUN npm prune --production --silent


# Define port

EXPOSE 7777

# Command to run the app

CMD [ "npm", "run", "start"]
