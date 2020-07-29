package session

import (
	"github.com/zakhio/online-games/go-game-base/observable"
)

type Session interface {
	Reset()

	SetID(id string)
	GetID() string
}

type BaseSession struct {
	ID string

	Active     bool
	Observable observable.Observable
}

func (s *BaseSession) SetID(id string) {
	s.ID = id
}

func (s *BaseSession) GetID() string {
	return s.ID
}

func NewBaseSession() BaseSession {
	return BaseSession{
		Observable: observable.NewObservable(1),
	}
}
