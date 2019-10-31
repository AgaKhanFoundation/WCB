# Usage: 
# Install npm packages using package.json
VERSION:=$(shell npm version| grep wcb | awk '{print $$3}' | sed "s/[\',]//g")
APP_NAME="wcb"
REPO_NAME="agakhanfoundation"


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
	@echo $(APP_NAME):$(VERSION)
	@docker build . --tag $(APP_NAME):$(VERSION)
	
release: 
	@npm version --no-git-tag-version minor
	@git add package*.json
	@docker login -u="${QUAY_USERNAME}" -p="${QUAY_TOKEN}" quay.io
	@docker build . --tag quay.io/$(REPO_NAME)/$(APP_NAME):$(VERSION)
	@docker push quay.io/$(REPO_NAME)/$(APP_NAME):$(VERSION)
	@git commit -m "$(VERSION) [ci skip]"
	@git push origin master
	
