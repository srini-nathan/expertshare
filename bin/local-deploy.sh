#!/bin/bash
yarn install
bash "./bin/generate-jsons.sh"
yarn run fix:config
bash "./bin/generate-translations.sh"
yarn run fix:translations
