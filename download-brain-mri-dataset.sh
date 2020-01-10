#!/bin/bash
set -euo pipefail
DOWNLOAD_URL="https://insight-journal.org/midas/community/view/21"
echo "Building Docker image and downloading the brain MRI dataset..."
NAME=thavlik/midas-download-tool
TAG=latest
docker build -t $NAME:$TAG .
mkdir download
docker run -v $(pwd)/download:/download $NAME:$TAG node sync.js \
    $DOWNLOAD_URL \
    /download
