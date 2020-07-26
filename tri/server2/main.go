package main

import (
	"flag"
	"log"
	"math/rand"
	"net"
	"os"
	"time"

	"github.com/rcrowley/go-metrics"
	"github.com/zakhio/go-metrics-influxdb"
	"github.com/zakhio/online-games/tri/proto"
	"github.com/zakhio/online-games/tri/server2/config/influxdb"
	"github.com/zakhio/online-games/tri/server2/handler"
	"google.golang.org/grpc"
)

const (
	port = "localhost:50053"
)

func main() {
	rand.Seed(time.Now().UTC().UnixNano())

	var enableMetrics bool
	flag.BoolVar(&enableMetrics, "enableMetrics", false, "connect to production setup")
	flag.Parse()

	if enableMetrics {
		influxDBConfig := influxdb.ParseConfig("influxdb-config.yaml")
		go reporter.InfluxDB(metrics.DefaultRegistry,
			influxDBConfig.Interval,
			influxDBConfig.URL,
			influxDBConfig.OrganizationId,
			influxDBConfig.BucketId,
			influxDBConfig.Measurement,
			influxDBConfig.Token,
			influxDBConfig.AlignTimestamps,
		)
	}
	go metrics.Log(metrics.DefaultRegistry, 10*time.Minute, log.New(os.Stderr, "metrics: ", log.Lmicroseconds))

	listener, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer()
	proto.RegisterTRIGameServer(grpcServer, handler.NewHandler())
	if err := grpcServer.Serve(listener); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
