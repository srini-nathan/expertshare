#!/bin/bash

API_HOST=http://test1.localhost:8091
GENERATE_ROUTES=http://test1.localhost:8091/generate/routes
GENERATE_CONSTANTS=http://test1.localhost:8091/generate/constants
CONFIG_DUMP_PATH=src/config

wget $GENERATE_ROUTES > "$CONFIG_DUMP_PATH/routes.json"