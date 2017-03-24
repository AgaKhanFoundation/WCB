# WCB

[![Build Status](https://travis-ci.org/AgaKhanFoundation/WCB.svg?branch=master)](https://travis-ci.org/AgaKhanFoundation/WCB)

Work in progress!

## Requirements

- Node.js v7.6.0

## Development notes

### Testing

```
npm install
npm run lint
npm test
```

### Running

```
NODE_ENV=test node .
```
### Docker Instructions

To build the docker container locally

```
docker build -t <name> .
```

To run docker container locally

```
docker run -p <host-port>:7777 -e "NODE_ENV=test" -d <name>
```

To run quay-image-name

```
docker pull quay.io/nidhisd/wcb
docker run -p <host-port>:7777 -e "NODE_ENV=test" -d quay.io/nidhisd/wcb
```
