package logic

import (
	"fmt"
	"zakh.io/tri/server/middleware/dictionary"
)

// GameInfo structure for player
type GameInfo interface {
	Start() error
	Turn(player string, position int) error
}

func (g *GameState) Start(numberOrRows, numberOfColumns int) error {
	if g.Started {
		return fmt.Errorf("cannot start: game already started")
	}

	g.numberOrRows = numberOrRows
	g.numberOfColumns = numberOfColumns
	words, err := dictionary.ReadLines("server/words.txt")
	fmt.Printf("err [%v], words: %v", err, words)
	g.GenerateWords(numberOrRows * numberOfColumns, words)

	g.Started = true

	return nil
}

func (g *GameState) Turn(player string, position int) error {
	if !g.Started {
		return fmt.Errorf("cannot turn: game did not start yet")
	}

	return g.Pick(player, position)
}
