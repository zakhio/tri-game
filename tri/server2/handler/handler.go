package handler

import (
	"context"
	log "github.com/sirupsen/logrus"

	"github.com/golang/protobuf/ptypes/empty"
	"github.com/rcrowley/go-metrics"
	"github.com/zakhio/online-games/tri/proto"
	"github.com/zakhio/online-games/tri/server2/controller"
	"github.com/zakhio/online-games/tri/server2/game"
	"github.com/zakhio/online-games/tri/server2/middleware/latency"
	protoConverter "github.com/zakhio/online-games/tri/server2/proto-converter"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

var (
	observerFailCounter    = metrics.GetOrRegisterCounter("handler.ObserveSession.fail", nil)
	observerSuccessCounter = metrics.GetOrRegisterCounter("handler.ObserveSession.success", nil)
)

type handler struct {
	proto.UnimplementedTRIGameServer
	sessionManager controller.SessionController
}

func (h *handler) CreateSession(ctx context.Context, req *proto.CreateSessionRequest) (*proto.CreateSessionReply, error) {
	defer latency.Measure("handler.CreateSession")()

	token := req.GetToken()
	log.Infof("[%v] create session\n", token)

	s := h.sessionManager.Create()
	res := &proto.CreateSessionReply{
		SessionId: s.GetID(),
	}

	return res, nil
}
func (h *handler) ObserveSession(req *proto.ObserveSessionRequest, stream proto.TRIGame_ObserveSessionServer) error {
	token := req.GetToken()
	sessionID := req.GetSessionId()
	log.Infof("[%v] observe session %v\n", token, sessionID)

	s := h.sessionManager.GetSession(sessionID)
	if s == nil {
		observerFailCounter.Inc(1)
		return status.Errorf(codes.NotFound, "[%v] session %v doesn't exist", token, sessionID)
	}
	observerSuccessCounter.Inc(1)

	err := s.Observe(stream.Context(), token, func(state *game.TRIStateValue) error {
		// looks ugly but cannot find a way how to make state.(*game.TRIStateValue) work
		res := protoConverter.FromStateValue(token, state)
		if err := stream.Send(res); err != nil {
			log.Printf("[%v] cannot stream: %v", token, err)
			return err
		}

		return nil
	})

	return err
}

func (h *handler) Start(ctx context.Context, req *proto.StartGameRequest) (*empty.Empty, error) {
	defer latency.Measure("handler.Start")()

	token := req.GetToken()
	sessionID := req.GetSessionId()
	log.Infof("[%v] start game in session %v\n", token, sessionID)

	s := h.sessionManager.GetSession(sessionID)
	if s == nil {
		return nil, status.Errorf(codes.NotFound, "[%v] session %v doesn't exist", token, sessionID)
	}

	err := s.Start(token, &game.TRIConfig{
		Columns:    int(req.GetNumberOfColumns()),
		Rows:       int(req.GetNumberOfRows()),
		Teams:      int(req.GetNumberOfTeams()),
		Language:   req.GetLanguage(),
		Dictionary: req.GetDictionary(),
	})
	if err != nil {
		return nil, err
	}

	return new(empty.Empty), nil
}

func (h *handler) Turn(ctx context.Context, req *proto.TurnGameRequest) (*empty.Empty, error) {
	defer latency.Measure("handler.Turn")()

	token := req.GetToken()
	sessionID := req.GetSessionId()
	log.Infof("[%v] game turn in session %v\n", token, sessionID)

	s := h.sessionManager.GetSession(sessionID)
	if s == nil {
		return nil, status.Errorf(codes.NotFound, "[%v] session %v doesn't exist", token, sessionID)
	}

	err := s.Turn(token, int(req.GetPosition()))
	if err != nil {
		return nil, err
	}

	return new(empty.Empty), nil
}

func (h *handler) SetAlias(context.Context, *proto.SetAliasRequest) (*empty.Empty, error) {
	defer latency.Measure("handler.CreateSession")()

	return nil, status.Errorf(codes.Unimplemented, "method SetAlias not implemented")
}

func (h *handler) SetSettings(context.Context, *proto.SetSettingsRequest) (*empty.Empty, error) {
	return nil, status.Errorf(codes.Unimplemented, "method SetSettings not implemented")
}

func NewHandler() proto.TRIGameServer {
	server := &handler{}
	server.sessionManager = controller.NewSessionController()
	return server
}
