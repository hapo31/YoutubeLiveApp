#!/bin/bash

rm -rf dist/*

PLATFORM=$1
NODE_ENV='production'

if [ "$1" = '' ]; then
  PLATFORM="win32"
fi

ELECTRON_VER=$(cat package.json | grep \"electron\" | sed -r -e 's|\s+"electron": ".?(.*)",|\1|')

webpack --config ./webpack.config.js --mode production

cp package.json dist/

electron-packager ./dist YoutubeLiveApp --platform=$PLATFORM --arch=x64 --icon=./images/icon.ico --electron-version=$ELECTRON_VER --overwrite
