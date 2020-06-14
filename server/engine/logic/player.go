package logic

import (
	"fmt"
	"zakh.io/tri/server/engine/entities"
)

type PlayerInfo interface {
	AddPlayer(player string) error
	GetPlayers() []string
	IsCaptain(playerId string) bool
	PromoteToCaptain(playerId string, captain bool)
}

func (g *GameState) NewPlayer() (string, error) {
	playerId := g.nextId()
	if g.Started {
		return "", fmt.Errorf("cannot add player: game already started")
	}

	if g.IsCaptain(playerId) {
		return "", fmt.Errorf("cannot add player: %v already added", playerId)
	}

	g.Players = append(g.Players, playerId)
	g.PlayerHistory[playerId] = make([]entities.WordCell, 0)

	return "", nil
}

func (g *GameState) IsCaptain(playerId string) bool {
	_, ok := g.PlayerHistory[playerId]
	return ok
}

func (g *GameState) PromoteToCaptain(playerId string, captain bool) {
	g.Captains[playerId] = captain
}

func (g *GameState) GetPlayers() []string {
	return g.Players
}
