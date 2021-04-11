#!/bin/bash

readonly SRC_DIR=$(dirname "$0")'/../src/'
readonly CURR_DIR="$(pwd)"

cd "$SRC_DIR" && zip -FSr "${CURR_DIR}/build.zip" .

