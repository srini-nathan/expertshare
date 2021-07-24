#!/bin/bash
git pull
yarn install
bash ./bin/generate-jsons.sh
bash ./bin/generate-translations.sh
bash ./bin/generate-styles.sh
yarn build
cp -r ./src/translations/ ./build/static
cp ./src/config/css/* ./build/static/css