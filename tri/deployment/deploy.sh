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
rsync -avzh ./secret/influxdb-config.yaml "$DEPLOY_SERVER_SSH":~/tri/

echo "-- Build and deploy the client"
(cd ../client-web &&
  yarn build)

rsync -avzh --delete ../client-web/build/ "$DEPLOY_SERVER_SSH":/var/www/tri.zakh.io/

#echo "-- Upload configuration and restart nginx"
#rsync -avzh ./tri.zakh.io.conf "$DEPLOY_SERVER_SSH":/etc/nginx/sites-available/tri.zakh.io.conf
#ssh "$DEPLOY_SERVER_SSH" "service nginx restart"

echo "-- Restart the server"
ssh "$DEPLOY_SERVER_SSH" "kill -9 \$(pidof tri-server)"
ssh "$DEPLOY_SERVER_SSH" "setsid ~/tri/tri-server -enableMetrics >/var/log/tri-server/all.\$(date -u +%s).log 2>&1 < /dev/null &"
