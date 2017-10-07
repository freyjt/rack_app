#!/bin/bash -ex

LODASH=lodash.sh
LODASH_VERSION=4.17.4
BENCHMARK=benchmark.js
BENCHMARK_VERSION=2.1.4

mkdir ./testsite/js/external_lib
curl -o ./testsite/js/external_lib/$LODASH -vXGET https://raw.githubusercontent.com/lodash/lodash/$LODASH_VERSION/dist/$LODASH
curl -o ./testsite/js/external_lib/$BENCHMARK -vXGET https://raw.githubusercontent.com/bestiejs/$BENCHMARK/$BENCHMARK_VERSION/$BENCHMARK


