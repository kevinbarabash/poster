#!/bin/bash
./node_modules/.bin/tsc src/poster.ts --outDir lib --target ES5 --declaration --module commonjs --removeComments &&
mkdir -p dist &&
./node_modules/.bin/browserify lib/poster.js --standalone Poster --outfile dist/poster.js
