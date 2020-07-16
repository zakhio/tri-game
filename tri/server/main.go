package main

import (
	"google.golang.org/grpc"
	"log"
	"math/rand"
	"net"
	"time"
	pb "zakh.io/tri/proto"
	"zakh.io/tri/server/handler"
)

const (
	port = "localhost:50053"
)

func main() {
	rand.Seed(time.Now().UTC().UnixNano())

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
