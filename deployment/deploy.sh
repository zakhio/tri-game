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
rsync -avzh ./envoy.production.yaml $DEPLOY_SERVER_SSH:~/envoy/envoy.yaml
