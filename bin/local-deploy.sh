#!/bin/bash
yarn install
bash "./bin/generate-jsons.sh"
yarn run fix:config
bash "./bin/generate-translations.sh"
yarn run fix:translations
bash "./bin/generate-styles.sh"
yarn run fix:css
cp -r ./src/translations/ ./build/static
cp -r ./src/config/css ./build/static/css