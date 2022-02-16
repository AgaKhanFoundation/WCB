# WCB

[![Build Status](https://dev.azure.com/steps4impact/steps4impact/_apis/build/status/backend?branchName=main)](https://dev.azure.com/steps4impact/steps4impact/_build/latest?definitionId=2&branchName=main)

Work in progress!

## Requirements

- [Node.js](https://nodejs.org) v14.19.0

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
