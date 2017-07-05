#!/usr/bin/env bash

set -e
node_modules/.bin/sequelize db:migrate
node .
