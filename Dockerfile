FROM node:7.7.3

# Create App directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle App source
COPY . /usr/src/app

# Install App dependencies

RUN npm install --silent

# Run tests and Lint
RUN npm run test && npm run lint

# Remove dev dependencies
RUN npm prune --production --silent


# Define port

EXPOSE 7777

# Command to run the app

CMD [ "./start.sh" ]
