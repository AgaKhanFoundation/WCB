#!/usr/bin/env bash

set -ex
node_modules/.bin/sequelize db:migrate --config config/staging-migrations.js --options-path config/sequelize.json
node .
