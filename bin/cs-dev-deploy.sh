#!/bin/bash
git pull
yarn install --https_proxy http://10.8.3.81:8080 --http_proxy http://10.8.3.81:8080
#yarn install
bash ./bin/generate-jsons.sh
bash ./bin/generate-translations.sh
yarn build
cp -r ./src/translations/ ./build/static
