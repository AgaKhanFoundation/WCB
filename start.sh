#!/usr/bin/env bash

set -e
node_modules/.bin/sequelize db:migrate --config config/config.js --options-path config/sequelize.json
node .
