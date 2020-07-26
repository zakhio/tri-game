package session

import (
	"context"

	"github.com/zakhio/online-games/go-game-base/observable"
)

type State interface {
	// Subscribe synchronically subscribes for state updates
	Subscribe(ctx context.Context, token string, callback interface{}) error
	IsSubscribed(token string) bool

	Reset()
}

type BaseState struct {
	Observable observable.Observable
}

func (s *BaseState) Reset() {
	s.Observable.Close()
}

func (s *BaseState) Subscribe(ctx context.Context, token string, callback interface{}) error {
	return s.Observable.SubscribeSync(ctx, token, callback)
}

func (s *BaseState) IsSubscribed(token string) bool {
	return s.Observable.IsSubscribed(token)
}
