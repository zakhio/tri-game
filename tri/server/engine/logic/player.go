package logic

import (
	"zakh.io/tri/server/engine/entities"
)

type PlayerInfo interface {
	AddPlayer(player string) error
	GetPlayers() []string
	IsCaptain(playerId string) *bool
	SetCaptainFlag(playerId string, captain bool)
	ClearCaptains()
}

func (g *GameState) NewPlayer() (string, error) {
	playerId := g.nextId()
	g.Players = append(g.Players, playerId)
	g.PlayerHistory[playerId] = make([]entities.WordCell, 0)

	return playerId, nil
}

func (g *GameState) IsCaptain(playerId string) *bool {
	v, ok := g.Captains[playerId]

	if !ok {
		return nil
	}
	return &v
}

func (g *GameState) SetCaptainFlag(playerId string, captain bool) {
	g.Captains[playerId] = captain
}

func (g *GameState) ClearCaptains() {
	g.Captains = make(map[string]bool)
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
