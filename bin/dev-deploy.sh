#!/bin/bash
git pull
yarn install
bash ./bin/generate-jsons.sh
yarn build
bash ./bin/generate-translations.sh
