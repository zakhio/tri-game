package main

import (
	"context"
	"flag"
	"fmt"
	"github.com/google/uuid"
	"io"
	"log"
	"math/rand"
	"time"

	"google.golang.org/grpc"
	pb "zakh.io/tri/proto"
)

const (
	address = "localhost:50053"
)

func joinSession(client *pb.TRIGameClient, sessionID string, token string) {
	var stream pb.TRIGame_ObserveSessionClient
	var err error
	req := &pb.ObserveSessionRequest{Token: token, SessionId: sessionID}

	if stream, err = (*client).ObserveSession(context.Background(), req); err != nil {
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
		log.Printf("recived reply: %v", reply)
	}
}

func main() {
	rand.Seed(time.Now().UTC().UnixNano())
	var token string
	var sessionID string
	var startFlag bool
	flag.StringVar(&token, "token", "", "the player's token")
	flag.StringVar(&sessionID, "sessionID", "", "the session id")
	flag.BoolVar(&startFlag, "start", false, "the flag to start the game")
	flag.Parse()

	if token == "" {
		tokenUUID, _ := uuid.NewUUID()
		token = tokenUUID.String()
		log.Printf("new token generated: %v", token)
	}

	conn, err := grpc.Dial(address, grpc.WithInsecure())
	if err != nil {
		log.Fatalf("failed to connect: %v", err)
	}
	defer conn.Close()

	client := pb.NewTRIGameClient(conn)
	if sessionID == "" {
		var createReplay *pb.CreateSessionReply
		if createReplay, err = client.CreateSession(context.Background(), &pb.CreateSessionRequest{Token: token}); err != nil {
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
					Token:     token,
					SessionId: sessionID,
				})
			case -2:
				client.SetSettings(context.Background(), &pb.SetSettingsRequest{
					Token:     token,
					SessionId: sessionID,
					TeamId:    "tdsw",
					Captain:   true,
					Alias:     "diysha",
				})
			default:
				client.Turn(context.Background(), &pb.TurnGameRequest{
					Token:     token,
					SessionId: sessionID,
					Position:  int32(u),
				})
			}
		}
	}()

	joinSession(&client, sessionID, token)
}
