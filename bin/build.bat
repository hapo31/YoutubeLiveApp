@echo off

del /S /Q dist\*

cross-env NODE_ENV=production webpack --config ./webpack.config.js --mode production && copy package.json dist\ && electron-packager ./dist YoutubeLiveApp --platform=win32 --arch=x64 --icon=./images/icon.ico --electron-version=9.0.4 --overwrite
