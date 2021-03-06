#!/bin/bash
source ./bin/dotenv
.env --file .env.local get REACT_APP_API_HOST
ES_API_HOST=$REPLY
ES_CONTAINERS_ID=(1 2 3 4 5 6 7 8)
ES_LOCALES=(en de fr it)
GENERATE_TRANSLATIONS="${ES_API_HOST}/generate/translations"
TRANSLATION_DUMP_PATH="./src/translations"
TRANSLATION_BUILD_DUMP_PATH="./build/static/translations"
TRANSLATION_DEFAULT_EXPORT_FILE="${TRANSLATION_DUMP_PATH}/index.ts"
GENERATE_CONTAINERS="${ES_API_HOST}/generate/containers";

touch "${TRANSLATION_DEFAULT_EXPORT_FILE}"
echo -n "" > "${TRANSLATION_DEFAULT_EXPORT_FILE}"

mapfile -t ES_CONTAINERS_ID < <(
    wget -qO- "${GENERATE_CONTAINERS}" | jq -r '.[]|.'
)

for containerId in "${ES_CONTAINERS_ID[@]}"
do
  mkdir -p "${TRANSLATION_DUMP_PATH}/${containerId}"
  mkdir -p ${TRANSLATION_BUILD_DUMP_PATH}/${containerId}
  touch "${TRANSLATION_DUMP_PATH}/${containerId}/index.ts"
  echo -n "" > "${TRANSLATION_DUMP_PATH}/${containerId}/index.ts"

  mapfile -t ES_LOCALES < <(
    wget -qO- "${GENERATE_CONTAINERS}/${containerId}" | jq -r '.[]|.'
  )

  for locale in "${ES_LOCALES[@]}"
  do
    wget "${GENERATE_TRANSLATIONS}/${containerId}/${locale}" -O "${TRANSLATION_DUMP_PATH}/${containerId}/${locale}.json"
    cp "${TRANSLATION_DUMP_PATH}/${containerId}/${locale}.json" "${TRANSLATION_BUILD_DUMP_PATH}/${containerId}/"
    echo "import ${locale} from \"./${locale}.json\";" >> "${TRANSLATION_DUMP_PATH}/${containerId}/index.ts"
  done
  echo "export {};" >> "${TRANSLATION_DUMP_PATH}/${containerId}/index.ts"
  for locale in "${ES_LOCALES[@]}"
  do
    mkdir -p "${TRANSLATION_DUMP_PATH}/${containerId}"
    wget "${GENERATE_TRANSLATIONS}/${containerId}/${locale}" -O "${TRANSLATION_DUMP_PATH}/${containerId}/${locale}.json"
    mkdir -p ${TRANSLATION_BUILD_DUMP_PATH}/${containerId}
    cp "${TRANSLATION_DUMP_PATH}/${containerId}/${locale}.json" "${TRANSLATION_BUILD_DUMP_PATH}/${containerId}/"
    echo "export { ${locale} };" >> "${TRANSLATION_DUMP_PATH}/${containerId}/index.ts"
  done
  echo "export * as container${containerId} from \"./${containerId}\";" >> "${TRANSLATION_DEFAULT_EXPORT_FILE}"
done
