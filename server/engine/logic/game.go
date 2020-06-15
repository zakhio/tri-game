package logic

import (
	"fmt"
	"math/rand"
	"zakh.io/tri/server/engine/entities"
	"zakh.io/tri/server/middleware/dictionary"
)

// GameInfo structure for player
type GameInfo interface {
	Start() error
	Turn(player string, position int) error
}

func (g *GameState) Start(numberOfTeams, numberOrRows, numberOfColumns int) error {
	if g.Started {
		return fmt.Errorf("cannot start: game already started")
	}

	if numberOfTeams < 2 {
		numberOfTeams = 2
	}
	if numberOrRows <= 0 {
		numberOrRows = 5
	}
	if numberOfColumns <= 0 {
		numberOfColumns = 5
	}

	teams := make([]string, 1)
	for i := 0; i < numberOfTeams; i++ {
		tId, _ := g.NewTeam()
		teams = append(teams, tId)
	}

	g.numberOrRows = numberOrRows
	g.numberOfColumns = numberOfColumns
	dict, _ := dictionary.ReadLines("server/words.txt")

	types := []int{entities.REGULAR, entities.END_GAME, entities.TEAM_OWNED}

	cells := make([]entities.WordCell, 0)
	for i := 0; i < numberOrRows*numberOfColumns; i++ {
		cell := entities.NewCell(dict[rand.Intn(len(dict))], types[rand.Intn(len(types))], teams[rand.Intn(len(teams))])
		cells = append(cells, cell)
	}
	g.SetCells(cells)

	g.Started = true

	return nil
}

func (g *GameState) GetNumOfColumns() int {
	return g.numberOfColumns
}

func (g *GameState) Turn(player string, position int) error {
	if !g.Started {
		return fmt.Errorf("cannot turn: game did not start yet")
	}

	return g.Pick(player, position)
}
