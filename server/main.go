package main

import (
	"google.golang.org/grpc"
	"log"
	"net"
	pb "zakh.io/tri/proto"
	"zakh.io/tri/server/handler"
)

const (
	port = ":50053"
)

func main() {
	listener, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer()
	pb.RegisterTRIGameServer(grpcServer, handler.NewTRIGameServer())
	if err := grpcServer.Serve(listener); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
