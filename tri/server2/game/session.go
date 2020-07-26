package game

import (
	"fmt"

	"github.com/zakhio/online-games/go-game-base/session"
)

type TRISession interface {
	session.Session

	Turn(actor string, position int32) error
	Start(actor string, config *TRIConfig) error
}

type triSession struct {
	session.BaseSession
}

func (s *triSession) Start(actor string, config *TRIConfig) error {
	if !s.Validator.HasPermission(actor) {
		return fmt.Errorf("player %v cannot start: must observe session", actor)
	}

	err := s.State.(TRIState).Start()
	return err
}

func (s *triSession) Turn(actor string, position int32) error {
	if !s.Validator.HasPermission(actor) {
		return fmt.Errorf("player %v cannot turn: must observe session", actor)
	}

	err := s.State.(TRIState).Turn()
	return err
}

func NewTRISession() TRISession {
	session := &triSession{}
	session.State = NewTRIState()

	return session
}
