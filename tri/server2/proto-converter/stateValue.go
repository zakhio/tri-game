package protoConverter

import (
	"github.com/zakhio/online-games/tri/proto"
	"github.com/zakhio/online-games/tri/server2/game"
)

func FromStateValue(token string, state game.TRIStateValue) *proto.GameSessionStream {
	return &proto.GameSessionStream{}
}
