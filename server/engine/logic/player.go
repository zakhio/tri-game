package logic

import (
	"fmt"
	"zakh.io/tri/server/engine/entities"
)

type PlayerInfo interface {
	AddPlayer(player string) error
	IsPlayer(player string) bool
	GetPlayers() []string
}

func (p *GameState) AddPlayer(player string) error {
	if p.Started {
		return fmt.Errorf("cannot add player: game already started")
	}

	if p.IsPlayer(player) {
		return fmt.Errorf("cannot add player: %v already added", player)
	}

	p.Players = append(p.Players, player)
	p.PlayerWords[player] = make([]entities.WordCell, 0)

	return nil
}

func (p *GameState) IsPlayer(player string) bool {
	_, ok := p.PlayerWords[player]
	return ok
}

func (p *GameState) GetPlayers() []string {
	return p.Players
}
