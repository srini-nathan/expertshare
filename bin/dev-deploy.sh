#!/bin/bash
git pull
yarn install
bash ./bin/generate-jsons.sh
bash ./bin/generate-translations.sh
yarn build
cp -r ./src/translations/ ./build/static
