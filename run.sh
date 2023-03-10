#!/bin/sh

SCENARIO_PATH=$1

if [[ $# -ne 1 ]]; then
  echo "Error: 1 arg are required: apigw SCENARIO_PATH" >&2
  exit 2
fi

k6 run -e SCENARIO_PATH=$SCENARIO_PATH $PWD/run.js --http-debug="full"