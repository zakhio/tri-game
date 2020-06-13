package main

import (
	"context"
	"flag"
	"fmt"
	"io"
	"log"
	"math/rand"
	"strconv"
	"time"

	"google.golang.org/grpc"
	pb "zakh.io/tri/proto"
)

const (
	address = "localhost:50053"
)

var playerToken string

func joinSession(client *pb.TRIGameClient, sessionID string, playerID string) {
	var stream pb.TRIGame_JoinClient
	var err error
	req := &pb.JoinGameRequest{SessionId: sessionID}
	if playerID != "" {
		req.PlayerToken = playerID
	} else {
		req.PlayerName = "pl" + strconv.Itoa(rand.Int())
	}

	if stream, err = (*client).Join(context.Background(), req); err != nil {
		fmt.Printf("cannot join: %v", err)
		return
	}

	for {
		reply, err := stream.Recv()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatalf("%v.CreateGameSession(_) = _, %v", client, err)
		}
		playerToken = reply.GetMe().GetToken()
		log.Printf("recived reply: %v", reply)
	}
}

func main() {
	rand.Seed(time.Now().UTC().UnixNano())
	var sessionID string
	var playerID string
	var startFlag bool
	flag.StringVar(&sessionID, "sessionID", "", "the session id")
	flag.StringVar(&playerID, "playerID", "", "the player id")
	flag.BoolVar(&startFlag, "start", false, "the flag to start the game")
	flag.Parse()

	conn, err := grpc.Dial(address, grpc.WithInsecure())
	if err != nil {
		log.Fatalf("failed to connect: %v", err)
	}
	defer conn.Close()

	client := pb.NewTRIGameClient(conn)
	if sessionID == "" {
		var createReplay *pb.CreateGameReply
		if createReplay, err = client.Create(context.Background(), &pb.CreateGameRequest{}); err != nil {
			log.Fatalf("failed to create session: %v", err)
		}
		sessionID = createReplay.SessionId
		log.Printf("connected: %v", createReplay)
	}

	go func() {
		for {
			time.Sleep(100 * time.Millisecond)
			var u int
			fmt.Print("> ")
			_, err := fmt.Scanf("%d\n", &u)
			if err != nil {
				panic(err)
			}

			switch u {
			case -1:
				client.Start(context.Background(), &pb.StartGameRequest{
					SessionId:   sessionID,
					PlayerToken: playerToken,
					NumberOfColumns: 5,
					NumberOfRows: 5,
				})
			default:
				client.Turn(context.Background(), &pb.TurnGameRequest{
					SessionId:   sessionID,
					PlayerToken: playerToken,
					Position:    int32(u),
				})
			}
		}
	}()

	joinSession(&client, sessionID, playerID)
}
