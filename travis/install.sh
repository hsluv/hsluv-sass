#!/bin/bash
set -e
set -x

. $HOME/.nvm/nvm.sh
nvm install "$TRAVIS_NODE_VERSION"
nvm use "$TRAVIS_NODE_VERSION"

npm install

if [ -n "${NODE_SASS_VERSION}" ]
then
  npm install node-sass@"${NODE_SASS_VERSION}"
fi

if [ -n "${TEST_SASS_VERSION}" ]
then
  gem install sass -v "${TEST_SASS_VERSION}"
fi

npm ls
