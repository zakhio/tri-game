#!/bin/bash

#INSTALL_GO_GRPC='true'

# golang
if [ -n "$INSTALL_GO_GRPC" ]; then
  GRPC_GO_VERSION=v1.31.0
  GRPC_GO_PATH=tmp/grpc-go

  echo "go install github.com/golang/protobuf/protoc-gen-go"
  go install github.com/golang/protobuf/protoc-gen-go

  echo "clone or update github.com/grpc/grpc-go"
  test -d "tmp/grpc-go" &&
    (cd $GRPC_GO_PATH && git pull origin $GRPC_GO_VERSION && true) ||
    git clone -b $GRPC_GO_VERSION https://github.com/grpc/grpc-go $GRPC_GO_PATH

  echo "go install grpc-go/cmd/protoc-gen-go-grpc"
  (cd $GRPC_GO_PATH/cmd/protoc-gen-go-grpc && go install .)
fi

mkdir -p proto
protoc tri.proto \
  --go_out=proto --go_opt=paths=source_relative \
  --go-grpc_out=proto --go-grpc_opt=paths=source_relative

# web
web_out=./client-web/src/proto

mkdir -p ${web_out}
protoc tri.proto \
  --js_out=import_style=commonjs:"${web_out}" \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:"${web_out}"

for f in "${web_out}"/*.js; do
  printf '/* eslint-disable */\n//@ts-nocheck\n' | cat - "${f}" >temp && mv temp "${f}"
done
