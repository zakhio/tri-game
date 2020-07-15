#!/bin/bash

mkdir -p tmp-deploy

echo -- Build and deploy of TRI server
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o tmp-deploy/tri-server server/main.go

rsync -avzh ./tmp-deploy/tri-server root@161.35.23.211:~/tri/
rsync -avzh ./dictionary root@161.35.23.211:~/tri/


echo -- Build and deploy of TRI client
(cd client-web &&
  yarn build)

rsync -avzh ./client-web/build/ root@161.35.23.211:/var/www/tri.zakh.io/
