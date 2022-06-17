#!/bin/bash

VER=`cat package.json| jq -r '.version'`

CHROME_PKG=ctx_wave_${VER}_chrome_unsigned.zip
FIREFOX_PKG=ctx_wave_${VER}_firefox_unsigned.zip
EDGE_PKG=ctx_wave_${VER}_edge_unsigned.zip
ZIP_FILE_PATH=../${CHROME_PKG}

RELEASE_PATH="publish"
mkdir $RELEASE_PATH 2>/dev/null


if [[ -f $RELEASE_PATH/$CHROME_PKG ]]; then
  rm $RELEASE_PATH/$CHROME_PKG
fi
if [[ -f $RELEASE_PATH/$FIREFOX_PKG ]]; then
  rm $RELEASE_PATH/$FIREFOX_PKG
fi


# chrome manifest v3
npm run build
(cd dist && \
  zip -r ../$RELEASE_PATH/$CHROME_PKG * \
    -x "*.DS_Store" \
    -x "__MACOSX" \
    -x "*.map" \
    -x "manifests/*")


# firefox manifest v2
MANIFEST_VERSION=2 npm run build
FF_EXTENSION_ID="0ac9ec36-bf7e-41b0-85d2-2a5b50e91f1b"
FF_ADDITIONAL_PROPERTY=". + { \"browser_specific_settings\": { \"gecko\": { \"id\": \"{${FF_EXTENSION_ID}}\", \"strict_min_version\": \"70.0\" } } }"
jq "${FF_ADDITIONAL_PROPERTY}" dist/manifest.json > dist/tmp_manifest.json && \
  mv dist/tmp_manifest.json dist/manifest.json
(cd dist && \
  zip -r ../$RELEASE_PATH/$FIREFOX_PKG * \
    -x "*.DS_Store" \
    -x "__MACOSX" \
    -x "*.map" \
    -x "manifests/*")
