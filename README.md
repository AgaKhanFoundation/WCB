# WCB

[![Build Status](https://travis-ci.org/AgaKhanFoundation/WCB.svg?branch=master)](https://travis-ci.org/AgaKhanFoundation/WCB)

Work in progress!

## Requirements

- [Node.js](https://nodejs.org) v14.15.4

## Development

```
make develop
```

### Database Migrations

#### Up

```
npm run migrate
```

#### Down

```
npm run migrate:undo
```

### Docker Instructions

To build the docker container locally

```
make build
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
