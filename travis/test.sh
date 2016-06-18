#!/bin/bash
set -e
set -x

if [ -n "${NODE_SASS_VERSION}" ]
then
  . $HOME/.nvm/nvm.sh
  nvm use "$TRAVIS_NODE_VERSION"
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
