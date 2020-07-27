package game

import (
	"context"
	"fmt"

	"github.com/zakhio/online-games/go-game-base/session"
)

type TRISession interface {
	session.Session

	Observe(ctx context.Context, token string, callback func(*TRIStateValue) error) error
	Start(token string, config *TRIConfig) error
	Turn(token string, position int) error
}

type triSession struct {
	session.BaseSession
}

func (s *triSession) Observe(ctx context.Context, token string, callback func(*TRIStateValue) error) error {
	s.State.(TRIState).Activate(token)
	return s.BaseSession.Observe(ctx, token, callback)
}

func (s *triSession) Start(token string, config *TRIConfig) error {
	if !s.State.IsSubscribed(token) {
		return fmt.Errorf("[%v] cannot start: must observe session", token)
	}

	err := s.State.(TRIState).Start(config.Teams, config.Rows, config.Columns)
	return err
}

func (s *triSession) Turn(token string, position int) error {
	if !s.State.IsSubscribed(token) {
		return fmt.Errorf("[%v] cannot turn: must observe session", token)
	}

	err := s.State.(TRIState).Turn(token, position)
	return err
}

func (s *triSession) SetCaptainRole(token string, active bool) error {
	if !s.State.IsSubscribed(token) {
		return fmt.Errorf("[%v] cannot turn: must observe session", token)
	}

	s.State.(TRIState).SetCaptainRole(token, active)
	return nil
}

func NewTRISession() TRISession {
	s := &triSession{}
	s.State = NewTRIState()

	return s
}
