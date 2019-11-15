# Usage: 
# Install npm packages using package.json
APP_NAME="wcb"
REPO_NAME="agakhanfoundation"
GET_VERSION = $$(npm version| grep wcb | awk '{print $$3}' | sed "s/[\',]//g")


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
	# This is just to test if the Dockerfile is buildable.
	@docker build .
	
release: 
	@npm version --no-git-tag-version minor
	@git add package*.json
	@echo docker build . --tag quay.io/$(REPO_NAME)/$(APP_NAME):$(GET_VERSION)
	@docker login -u="${QUAY_USERNAME}" -p="${QUAY_TOKEN}" quay.io
	@docker build . --tag quay.io/$(REPO_NAME)/$(APP_NAME):${GET_VERSION}
	@docker push quay.io/$(REPO_NAME)/$(APP_NAME):$(GET_VERSION)
	@git commit -m "$(GET_VERSION) [ci skip]"
	@git tag -a $(GET_VERSION) -m "Updating to version `$(GET_VERSION)`"
	@git push origin $(GET_VERSION)
	@git push origin master
	
