package session

import (
	"context"

	"github.com/zakhio/online-games/go-game-base/validator"
)

type Session interface {
	Observe(ctx context.Context, token string, callback func(StateValue) error) error
	Reset()

	SetID(id string)
	GetID() string
}

type BaseSession struct {
	ID        string
	State     State
	Validator validator.Validator
}

func (s *BaseSession) Observe(ctx context.Context, token string, callback func(StateValue) error) error {
	s.Validator.Permit(token, true)
	err := s.State.Subscribe(ctx, token, callback)
	s.Validator.Permit(token, false)

	return err
}

func (s *BaseSession) Reset() {
	s.Validator.Reset()
	s.State.Reset()
}

func (s *BaseSession) SetID(id string) {
	s.ID = id
}

func (s *BaseSession) GetID() string {
	return s.ID
}
