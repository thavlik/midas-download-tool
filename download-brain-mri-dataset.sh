#!/bin/bash
echo "Building Docker image and downloading the brain MRI dataset..."
NAME=thavlik/midas-tool
TAG=latest
docker build -t $NAME:$TAG .
docker run -v C:/Users/tlhavlik/Repositories/nlm-download:/download $NAME:$TAG