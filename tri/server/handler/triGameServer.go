package handler

import (
	"context"
	"log"

	"github.com/golang/protobuf/ptypes/empty"
	"github.com/rcrowley/go-metrics"
	pb "github.com/zakhio/online-games/tri/proto"
	"github.com/zakhio/online-games/tri/server/controller"
	"github.com/zakhio/online-games/tri/server/engine/logic"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

var (
	sessionCreateCounter   = metrics.GetOrRegisterCounter("sessions_create", nil)
	observerFailCounter    = metrics.GetOrRegisterCounter("observe_fail", nil)
	observerSuccessCounter = metrics.GetOrRegisterCounter("observe_success", nil)
	gamesStartCounter      = metrics.GetOrRegisterCounter("games_start", nil)
	turnsSuccessCounter    = metrics.GetOrRegisterCounter("turns_success", nil)
)

type triGameServer struct {
	pb.UnimplementedTRIGameServer
	sessionManager controller.SessionManager
}

func (s *triGameServer) CreateSession(ctx context.Context, req *pb.CreateSessionRequest) (*pb.CreateSessionReply, error) {
	token := req.GetToken()
	sessionId := s.sessionManager.Create(token)

	sessionCreateCounter.Inc(1)

	return &pb.CreateSessionReply{SessionId: sessionId}, nil
}

func (s *triGameServer) ObserveSession(req *pb.ObserveSessionRequest, stream pb.TRIGame_ObserveSessionServer) error {
	sessionId := req.GetSessionId()
	token := req.GetToken()

	observable, playerId, err := s.sessionManager.Join(token, sessionId)
	if err != nil {
		observerFailCounter.Inc(1)
		return err
	}
	observerSuccessCounter.Inc(1)

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

	session, playerId, err := s.sessionManager.GetSession(token, sessionId)
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

	gamesStartCounter.Inc(1)

	return new(empty.Empty), status.Errorf(codes.OK, "started")
}

func (s *triGameServer) Turn(ctx context.Context, req *pb.TurnGameRequest) (*empty.Empty, error) {
	sessionId := req.GetSessionId()
	token := req.GetToken()

	session, playerId, err := s.sessionManager.GetSession(token, sessionId)
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

	turnsSuccessCounter.Inc(1)

	return new(empty.Empty), status.Errorf(codes.OK, "turned")
}

func (s *triGameServer) SetAlias(context.Context, *pb.SetAliasRequest) (*empty.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method SetAlias not implemented")
}
func (s *triGameServer) SetSettings(ctx context.Context, req *pb.SetSettingsRequest) (*empty.Empty, error) {
	sessionId := req.GetSessionId()
	token := req.GetToken()

	session, playerId, err := s.sessionManager.GetSession(token, sessionId)
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

	return new(empty.Empty), status.Errorf(codes.OK, "settings updated")
}

func NewTRIGameServer() pb.TRIGameServer {
	server := &triGameServer{}
	server.sessionManager = controller.NewSessionManager()
	return server
}
