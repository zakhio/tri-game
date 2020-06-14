package logic

import (
	"zakh.io/tri/server/engine/entities"
	"zakh.io/tri/server/middleware/random"
)

type GameState struct {
	Captains      map[string]bool
	Players       []string
	Teams         map[string][]string
	PlayerHistory map[string][]entities.WordCell
	Started       bool

	Cells           []entities.WordCell
	numberOrRows    int
	numberOfColumns int

	Alias map[string]string

	TeamInfo
	PlayerInfo
	CellsInfo
	GameInfo
	AliasInfo
}

func (g *GameState) nextId() string {
	return random.RandString(4)
}

func NewGameState() *GameState {
	state := new(GameState)
	state.Cells = make([]entities.WordCell, 0)
	state.Started = false
	state.PlayerHistory = make(map[string][]entities.WordCell)
	state.Teams = make(map[string][]string, 0)
	state.Players = make([]string, 0)
	state.Captains = make(map[string]bool)
	state.Alias = make(map[string]string)

	return state
}
