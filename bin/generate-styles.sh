#!/bin/bash
source ./bin/dotenv
.env --file .env.local get REACT_APP_API_HOST
ES_API_HOST=$REPLY
containerId=$1
ES_CONTAINERS_ID=(1 2 3 4 5 6 7 8);

GENERATE_STYLE_API="${ES_API_HOST}/generate/styles"
GENERATE_CONTAINERS="${ES_API_HOST}/generate/containers";
GENERATE_STYLE_OUTPUT="./src/config/css"

mapfile -t ES_CONTAINERS_ID < <(
    wget -qO- "${GENERATE_CONTAINERS}" | jq -r '.[]|.'
)

mkdir -p "${GENERATE_STYLE_OUTPUT}";

for containerId in "${ES_CONTAINERS_ID[@]}"
do
  wget "${GENERATE_STYLE_API}/${containerId}" -O "${GENERATE_STYLE_OUTPUT}/${containerId}_style.css"
done


