# Usage: 
# Install npm packages using package.json
VERSION:=$(shell npm version| grep wcb | awk '{print $$2}' | sed "s/[\',]//g")
APP_NAME="wcb"
REPO_NAME="agakhanfoundation"


install:
	@npm install

test: install
	@npm test

lint: install test
	@npm run lint

develop: install test lint
	@npm run start-dev

build:
	@docker build . --tag $(APP_NAME):$(VERSION)
	
release: 
	# @npm version --no-git-tag-version minors

	@docker build . --tag quay.io/$(REPO_NAME)/$(APP_NAME):$(VERSION)
	@docker push quay.io/$(REPO_NAME)/$(APP_NAME):$(VERSION)
