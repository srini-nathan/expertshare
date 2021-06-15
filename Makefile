install:
	yarn install

compile:
	yarn run build --prod

deploy: install compile