#!/bin/bash
git pull
yarn install --https_proxy http://10.8.3.81:8080 --http_proxy http://10.8.3.81:8080
bash ./bin/generate-jsons.sh
yarn build
bash ./bin/generate-translations.sh
