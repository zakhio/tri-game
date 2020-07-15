#!/bin/bash

# golang
protoc -I proto proto/tri.proto --go_opt=paths=source_relative --go_out=plugins=grpc:proto

# web
web_out=./client-web/src/proto

protoc -I proto proto/tri.proto \
    --js_out=import_style=commonjs:"${web_out}" \
    --grpc-web_out=import_style=typescript,mode=grpcwebtext:"${web_out}"

for f in "${web_out}"/*.js; do
    printf '/* eslint-disable */\n//@ts-nocheck\n' | cat - "${f}" > temp && mv temp "${f}"
done
