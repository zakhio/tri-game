package logic

import (
	"zakh.io/tri/server/engine/entities"
	"zakh.io/tri/server/middleware/random"
)

type GameState struct {
	Started bool

	Captains      map[string]bool
	Players       []string
	PlayerHistory map[string][]entities.WordCell

	Teams       []string
	TeamPlayers map[string][]string
	CurrentTeam string

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
	state.Started = false

	state.Players = make([]string, 0)
	state.Captains = make(map[string]bool)
	state.PlayerHistory = make(map[string][]entities.WordCell)

	state.Teams = make([]string, 0)
	state.TeamPlayers = make(map[string][]string)

	state.Cells = make([]entities.WordCell, 0)

	state.Alias = make(map[string]string)

	return state
}
