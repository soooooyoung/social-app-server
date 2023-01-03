#!/bin/bash
set -e
#VERSION=$(git rev-list HEAD --count)
VERSION='1.0.0'
echo ${VERSION}
docker rmi shanabunny/doki:latest || true
docker build   -t  shanabunny/doki:${VERSION} .
docker push shanabunny/doki:${VERSION}
date
echo ${VERSION}

