package session

import (
	"context"
)

type Session interface {
	Reset()

	SetID(id string)
	GetID() string
}

type BaseSession struct {
	ID    string
	State State
}

func (s *BaseSession) Observe(ctx context.Context, token string, callback interface{}) error {
	return s.State.Subscribe(ctx, token, callback)
}

func (s *BaseSession) Reset() {
	s.State.Reset()
}

func (s *BaseSession) SetID(id string) {
	s.ID = id
}

func (s *BaseSession) GetID() string {
	return s.ID
}
