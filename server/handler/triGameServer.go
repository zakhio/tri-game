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
	token := req.GetToken()
	sessionId := s.sessionManager.Create(token)
	return &pb.CreateGameReply{SessionId: sessionId}, nil
}

func (s *triGameServer) Observe(req *pb.ObserveGameRequest, stream pb.TRIGame_ObserveServer) error {
	sessionId := req.GetSessionId()
	token := req.GetToken()

	observable, playerId, err := s.sessionManager.Join(sessionId, token)
	if err != nil {
		return err
	}

	value := observable.Value()

	if len(value) > 0 {
		state := value[0].(logic.GameState)

		if err := stream.Send(Convert(playerId, state)); err != nil {
			log.Printf("cannot stream: %v", err)
			return err
		}
	}

	err = observable.SubscribeSync(stream.Context(), func(state logic.GameState, changeMessage string) error {
		log.Printf("[%v] update %v message %v", sessionId, token, changeMessage)
		res := Convert(playerId, state)
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
	token := req.GetToken()

	session, playerId, err := s.sessionManager.GetSession(sessionId, token)
	if err != nil {
		log.Print(err)
		return nil, err
	}

	numberOfTeams := int(req.NumberOfTeams)
	numberOfRows := int(req.NumberOfRows)
	numberOfColumns := int(req.NumberOfColumns)
	err = session.Start(playerId, numberOfTeams, numberOfRows, numberOfColumns)
	if err != nil {
		log.Print(err)
		return nil, err
	}

	return new(empty.Empty), status.Errorf(codes.OK, "started")
}

func (s *triGameServer) Turn(ctx context.Context, req *pb.TurnGameRequest) (*empty.Empty, error) {
	sessionId := req.GetSessionId()
	token := req.GetToken()

	session, playerId, err := s.sessionManager.GetSession(sessionId, token)
	if err != nil {
		log.Print(err)
		return nil, err
	}

	position := req.GetPosition()
	err = session.Turn(playerId, int(position))
	if err != nil {
		log.Print(err)
		return new(empty.Empty), err
	}

	return new(empty.Empty), status.Errorf(codes.OK, "turned")
}

func (s *triGameServer) SetAlias(context.Context, *pb.SetAliasRequest) (*empty.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method SetAlias not implemented")
}
func (s *triGameServer) SetSettings(ctx context.Context, req *pb.SetSettingsRequest) (*empty.Empty, error) {
	sessionId := req.GetSessionId()
	token := req.GetToken()

	session, playerId, err := s.sessionManager.GetSession(sessionId, token)
	if err != nil {
		log.Print(err)
		return nil, err
	}

	teamId := req.GetTeamId()
	alias := req.GetAlias()
	captain := req.GetCaptain()
	err = session.SetSettings(playerId, teamId, alias, captain)
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
