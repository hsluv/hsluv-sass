#!/bin/bash
set -e

if [ -n "${NODE_SASS_VERSION}" ]
then
  node-sass test/specs.scss
  exit
fi

if [ -n "${TEST_SASS_VERSION}" ]
then
  sass test/specs.scss
  exit
fi

echo "no tests run"
exit 1
