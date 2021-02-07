install:
	@npm install
	echo "SERVER_PASSWORD=<password>" >> .env

test: install
	@npm test

lint: install
	@npm run lint

develop: install test lint
	@npm run start-dev

build:
	@docker build .
