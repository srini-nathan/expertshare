#!/bin/bash
source ./bin/dotenv
.env --file .env.local get REACT_APP_API_HOST
ES_API_HOST=$REPLY
GENERATE_ROUTES="${ES_API_HOST}/generate/routes"
GENERATE_CONSTANTS="${ES_API_HOST}/generate/constants"
CONFIG_DUMP_PATH="./src/config"

wget "$GENERATE_ROUTES" -O "${CONFIG_DUMP_PATH}/routes.json"
wget "$GENERATE_CONSTANTS" -O "${CONFIG_DUMP_PATH}/constants.json"

sed -i 's/.{_format}//g' "$CONFIG_DUMP_PATH/routes.json"
