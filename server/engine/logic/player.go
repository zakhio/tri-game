package logic

import (
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
	g.Players = append(g.Players, playerId)
	g.PlayerHistory[playerId] = make([]entities.WordCell, 0)
	g.SetAlias(playerId, playerId)

	return playerId, nil
}

func (g *GameState) IsCaptain(playerId string) bool {
	return g.Captains[playerId]
}

func (g *GameState) PromoteToCaptain(playerId string, captain bool) {
	g.Captains[playerId] = captain
}

func (g *GameState) GetScore(playerId string) int {
	return g.PlayerScore[playerId]
}

func (g *GameState) IncreaseScore(playerId string, amount int) {
	score := g.PlayerScore[playerId]
	g.PlayerScore[playerId] = score + amount
}

func (g *GameState) GetPlayers() []string {
	return g.Players
}
