#!/bin/bash
git pull
yarnpkg install --https_proxy http://10.8.3.81:8080 --http_proxy http://10.8.3.81:8080
bash ./bin/generate-jsons.sh
bash ./bin/generate-translations.sh
yarnpkg build