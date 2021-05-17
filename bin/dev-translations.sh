#!/bin/bash

API_HOST=http://test1.localhost:8091
CONTAINER_ID=(1 2)
LOCALE=(en de)

GENERATE_TRANSLATIONS="${API_HOST}/generate/translations"
TRANSLATION_DUMP_PATH="${PWD}/src/translations"

git pull
yarn install

for containerId in "${CONTAINER_ID[@]}"
do
  for locale in "${LOCALE[@]}"
  do
    mkdir -p "${TRANSLATION_DUMP_PATH}/${containerId}"
    wget "${GENERATE_TRANSLATIONS}/${containerId}/${locale}" -O "${TRANSLATION_DUMP_PATH}/${containerId}/${locale}.json"
  done
done

yarn run fix:translations
