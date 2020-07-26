package game

import (
	"github.com/zakhio/online-games/go-game-base/session"
)

type TRIState interface {
	session.State

	Start() error
	Turn() error
}

type triState struct {
	session.BaseState
}

func (t *triState) Start() error {
	panic("implement me")
}

func (t *triState) Turn() error {
	panic("implement me")
}

func NewTRIState() TRIState {
	return &triState{}
}
