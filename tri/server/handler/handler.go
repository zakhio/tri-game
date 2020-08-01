package handler

import (
	"context"

	"github.com/golang/protobuf/ptypes/empty"
	"github.com/rcrowley/go-metrics"
	log "github.com/sirupsen/logrus"
	"github.com/zakhio/online-games/tri/proto"
	"github.com/zakhio/online-games/tri/server/config"
	"github.com/zakhio/online-games/tri/server/controller"
	"github.com/zakhio/online-games/tri/server/middleware/latency"
	protoConverter "github.com/zakhio/online-games/tri/server/proto-converter"
	"github.com/zakhio/online-games/tri/server/tri-game/data-objects"
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
	log.Infof("[%v][%v] observe session\n", token, sessionID)

	s := h.sessionManager.GetSession(sessionID)
	if s == nil {
		observerFailCounter.Inc(1)
		return status.Errorf(codes.NotFound, "[%v][%v] session doesn't exist", token, sessionID)
	}
	observerSuccessCounter.Inc(1)

	err := s.Observe(stream.Context(), token, func(state *dataObjects.StateValue) error {
		// looks ugly but cannot find a way how to make state.(*game.StateValue) work
		res := protoConverter.FromStateValue(token, state)
		if err := stream.Send(res); err != nil {
			log.Printf("[%v][%v] cannot stream", token, state.SessionID)
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
	log.Infof("[%v][%v] start game\n", token, sessionID)

	s := h.sessionManager.GetSession(sessionID)
	if s == nil {
		return nil, status.Errorf(codes.NotFound, "[%v][%v] session doesn't exist", token, sessionID)
	}

	err := s.Start(token,
		int(req.GetNumberOfTeams()),
		int(req.GetNumberOfRows()),
		int(req.GetNumberOfColumns()),
		req.GetLanguage(),
		req.GetDictionary(),
	)
	if err != nil {
		return nil, err
	}

	return new(empty.Empty), nil
}

func (h *handler) Turn(ctx context.Context, req *proto.TurnGameRequest) (*empty.Empty, error) {
	defer latency.Measure("handler.Turn")()

	token := req.GetToken()
	sessionID := req.GetSessionId()
	log.Infof("[%v][%v] game turn\n", token, sessionID)

	s := h.sessionManager.GetSession(sessionID)
	if s == nil {
		return nil, status.Errorf(codes.NotFound, "[%v][%v] session doesn't exist", token, sessionID)
	}

	err := s.Turn(token, int(req.GetPosition()))
	if err != nil {
		return nil, err
	}

	return new(empty.Empty), nil
}

func (h *handler) SetSettings(ctx context.Context, req *proto.SetSettingsRequest) (*empty.Empty, error) {
	defer latency.Measure("handler.SetSettings")()

	token := req.GetToken()
	sessionID := req.GetSessionId()
	log.Infof("[%v][%v] set settings", token, sessionID)

	s := h.sessionManager.GetSession(sessionID)
	if s == nil {
		return nil, status.Errorf(codes.NotFound, "[%v][%v] session doesn't exist", token, sessionID)
	}

	err := s.SetCaptainRole(token, req.GetCaptain())
	if err != nil {
		return nil, err
	}

	return new(empty.Empty), nil
}

func NewHandler(d *config.Dictionary) proto.TRIGameServer {
	server := &handler{}
	server.sessionManager = controller.NewSessionController(d)
	return server
}
