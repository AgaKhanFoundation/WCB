FROM node:10.9.0

# Create App directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install App dependencies

RUN npm install --silent

# Bundle App source
COPY . /usr/src/app

# Run tests and Lint
#RUN npm run test && npm run lint

# Remove dev dependencies
RUN npm prune --production --silent


# Define port
#EXPOSE 7777

# Command to run the app

CMD [ "./start.sh" ]
