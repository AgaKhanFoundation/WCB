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
node .
```
### Docker Instructions

To build the docker container locally

```
docker build -t <name> .
```

To run docker container locally

```
docker run -p <host-port>:7777 -d <name>
```

TODO: Update quay.io Instruction
