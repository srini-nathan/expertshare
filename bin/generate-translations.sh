#!/bin/bash
source ./bin/dotenv
.env --file .env.local get REACT_APP_API_HOST
ES_API_HOST=$REPLY
ES_CONTAINERS_ID=(1 2)
ES_LOCALES=(en de)
GENERATE_TRANSLATIONS="${ES_API_HOST}/generate/translations"
TRANSLATION_DUMP_PATH="./src/translations"

for containerId in "${ES_CONTAINERS_ID[@]}"
do
  for locale in "${ES_LOCALES[@]}"
  do
    mkdir -p "${TRANSLATION_DUMP_PATH}/${containerId}"
    wget "${GENERATE_TRANSLATIONS}/${containerId}/${locale}" -O "${TRANSLATION_DUMP_PATH}/${containerId}/${locale}.json"
  done
done
