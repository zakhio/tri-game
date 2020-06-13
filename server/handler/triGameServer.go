package handler

import (
	"context"
	"github.com/golang/protobuf/ptypes/empty"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"log"
	pb "zakh.io/tri/proto"
	"zakh.io/tri/server/controller"
	"zakh.io/tri/server/engine/logic"
)

type triGameServer struct {
	pb.UnimplementedTRIGameServer
	sessionManager controller.SessionManager
}

func (s *triGameServer) Create(ctx context.Context, req *pb.CreateGameRequest) (*pb.CreateGameReply, error) {
	sessionId, creatorId := s.sessionManager.Create()
	return &pb.CreateGameReply{SessionId: sessionId, CreatorToken: creatorId}, nil
}

func (s *triGameServer) Join(req *pb.JoinGameRequest, stream pb.TRIGame_JoinServer) error {
	sessionId := req.GetSessionId()
	playerName := req.GetPlayerName()
	playerId := req.GetPlayerToken()

	observable, playerId, err := s.sessionManager.Join(sessionId, playerName, playerId)
	if err != nil {
		return err
	}

	hideSensitive := !s.sessionManager.IsCreator(sessionId, playerId)
	value := observable.Value()

	if len(value) > 0 {
		state := value[0].(logic.GameState)
		playerData := s.sessionManager.GetPlayers(sessionId)

		if err := stream.Send(Convert(playerId, state, playerData, hideSensitive)); err != nil {
			log.Printf("cannot stream: %v", err)
			return err
		}
	}

	err = observable.SubscribeSync(stream.Context(), func(state logic.GameState, changeMessage string) error {
		log.Printf("[%v] update %v message %v", sessionId, playerId, changeMessage)
		playerData := s.sessionManager.GetPlayers(sessionId)
		res := Convert(playerId, state, playerData, hideSensitive)
		log.Print(res)

		if err := stream.Send(res); err != nil {
			log.Printf("cannot stream: %v", err)
			return err
		}

		return nil
	})

	return err
}

func (s *triGameServer) Start(ctx context.Context, req *pb.StartGameRequest) (*empty.Empty, error) {
	sessionId := req.GetSessionId()
	playerId := req.GetPlayerToken()

	session, err := s.sessionManager.GetSession(sessionId, playerId)
	if err != nil {
		log.Print(err)
		return nil, err
	}

	numberOfRows := int(req.NumberOfRows)
	numberOfColumns := int(req.NumberOfColumns)
	err = session.Start(playerId, numberOfRows, numberOfColumns)
	if err != nil {
		log.Print(err)
		return nil, err
	}

	return new(empty.Empty), status.Errorf(codes.OK, "started")
}

func (s *triGameServer) Turn(ctx context.Context, req *pb.TurnGameRequest) (*empty.Empty, error) {
	sessionId := req.GetSessionId()
	playerId := req.GetPlayerToken()

	session, err := s.sessionManager.GetSession(sessionId, playerId)
	if err != nil {
		log.Print(err)
		return new(empty.Empty), err
	}
	position := req.GetPosition()

	err = session.Turn(playerId, int(position))
	if err != nil {
		log.Print(err)
		return new(empty.Empty), err
	}

	return new(empty.Empty), status.Errorf(codes.OK, "turned")
}

func NewTRIGameServer() pb.TRIGameServer {
	server := &triGameServer{}
	server.sessionManager = controller.NewSessionManager()
	return server
}
