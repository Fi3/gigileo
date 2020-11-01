#!/bin/sh

wasm-pack build
rm -rf ../fe-app/pdf-generator
mv ./pkg ./pdf-generator
cp -r ./pdf-generator ../fe-app

rm -rf ../js-module/pdf-generator
mv ./pdf-generator ../js-module
