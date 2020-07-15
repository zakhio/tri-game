#!/bin/bash

# title
DEPLOY_SERVER_SSH=$1

echo "Deploying TRI to $DEPLOY_SERVER_SSH"
echo

echo "-- Build and deploy the server"
mkdir -p ../tmp
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o ../tmp/tri-server ../server/main.go

rsync -avzh ../tmp/tri-server "$DEPLOY_SERVER_SSH":~/tri/
rsync -avzh ../dictionary "$DEPLOY_SERVER_SSH":~/tri/

echo "-- Build and deploy the client"
(cd ../client-web &&
  yarn build)

rsync -avzh ../client-web/build/ "$DEPLOY_SERVER_SSH":/var/www/tri.zakh.io/
