#!/bin/bash


API_HOST=http://test1.localhost:8091
GENERATE_ROUTES=http://test1.localhost:8091/generate/routes
GENERATE_CONSTANTS=http://test1.localhost:8091/generate/constants
CONFIG_DUMP_PATH=${PWD}/src/config

git pull
yarn install

wget $GENERATE_ROUTES -O "$CONFIG_DUMP_PATH/routes.json"
wget $GENERATE_CONSTANTS -O "$CONFIG_DUMP_PATH/constants.json"

sed -i 's/.{_format}//g' "$CONFIG_DUMP_PATH/routes.json"

yarn run fix:config