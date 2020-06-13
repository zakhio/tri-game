package logic

import "zakh.io/tri/server/engine/entities"

type GameState struct {
	Players          []string
	PlayerWords      map[string][]entities.WordCell
	Words            []entities.WordCell
	CurrentPlayer    string
	CurrentPlayerIdx int
	Started          bool
	numberOrRows     int
	numberOfColumns  int

	PlayerInfo
	WordsInfo
	GameInfo
}

func NewGameState() *GameState {
	state := new(GameState)
	state.Words = make([]entities.WordCell, 0)
	state.Started = false
	state.PlayerWords = make(map[string][]entities.WordCell)
	state.Players = make([]string, 0)

	return state
}
