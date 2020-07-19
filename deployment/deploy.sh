#!/bin/bash

# title
DEPLOY_SERVER_SSH=root@161.35.23.211

echo "Deploying Artifacts to $DEPLOY_SERVER_SSH"
echo

(
  cd ../tri/deployment || exit
  ./deploy.sh $DEPLOY_SERVER_SSH
)

echo "Uploading envoy settings"
rsync -avzh ./envoy.production.yaml $DEPLOY_SERVER_SSH:/etc/envoy/envoy.yaml

echo "Restart envoy"
ssh "$DEPLOY_SERVER_SSH" "kill -9 \$(pidof envoy)"
ssh "$DEPLOY_SERVER_SSH" "setsid envoy -c /etc/envoy/envoy.yaml --log-path /var/log/envoy/envoy.log >/dev/null 2>&1 < /dev/null &"
