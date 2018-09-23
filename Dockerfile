FROM node:10.9.0

# Create App directory
WORKDIR /usr/src/app

COPY package*.json ./

# Install App dependencies
RUN npm install

# Bundle App source
COPY . .

# Define port
EXPOSE 7777

# Command to run the app
ENTRYPOINT bash -c "./start.sh"
