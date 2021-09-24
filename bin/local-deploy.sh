#!/bin/bash
yarn install
bash "./bin/generate-jsons.sh"
yarn run fix:config
bash "./bin/generate-translations.sh"
yarn run fix:translations
bash "./bin/generate-styles.sh"
cp -r ./src/translations/ ./build/static
cp ./src/config/css/* ./build/static/css