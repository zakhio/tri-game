package logic

import (
	"fmt"
	"log"
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
	g.ClearTeams()

	if numberOfTeams < 2 {
		numberOfTeams = 2
	}
	if numberOrRows <= 0 {
		numberOrRows = 5
	}
	if numberOfColumns <= 0 {
		numberOfColumns = 5
	}

	// configure teams
	teams := make([]string, 0)
	for i := 0; i < numberOfTeams; i++ {
		tId, _ := g.NewTeam()
		teams = append(teams, tId)
	}

	g.CurrentTeam = teams[rand.Intn(len(teams))]

	// configure cells
	dict, err := dictionary.ReadLines("server/words.txt")
	log.Print(err)

	wordsCount := numberOrRows * numberOfColumns
	wordsDict := make(map[string]bool)

	for len(wordsDict) < wordsCount {
		word := dict[rand.Intn(len(dict))]
		wordsDict[word] = false
	}

	cells := make([]entities.WordCell, 0)

	for k, _ := range wordsDict {
		cell := entities.NewCell(k, entities.REGULAR, "")
		cells = append(cells, cell)
	}

	g.numberOrRows = numberOrRows
	g.numberOfColumns = numberOfColumns
	g.SetCells(cells)

	// configure ownership
	teamWordSize := wordsCount / (numberOfTeams + 1)
	endPosition := rand.Intn(wordsCount)
	cells[endPosition].Type = entities.END_GAME
	wordsDict[cells[endPosition].Word] = true

	for _, tId := range teams {
		size := teamWordSize
		if tId == g.CurrentTeam {
			size++
		}

		for i := 0; i < size; i++ {
			pos := rand.Intn(wordsCount)
			for wordsDict[cells[pos].Word] == true {
				pos = rand.Intn(wordsCount)
			}
			cells[pos].Type = entities.TEAM_OWNED
			cells[pos].TeamId = tId
			wordsDict[cells[pos].Word] = true
		}
	}

	g.Started = true

	return nil
}

func (g *GameState) GetNumOfColumns() int {
	return g.numberOfColumns
}

func (g *GameState) Turn(playerId string, position int) error {
	if !g.Started {
		return fmt.Errorf("cannot turn: game did not start yet")
	}

	cell, err := g.Pick(playerId, position)
	if err != nil {
		return err
	}

	if cell.Type == entities.END_GAME {
		g.Started = false
	} else if cell.Type == entities.TEAM_OWNED {
		if t, _ := g.GetTeam(playerId); cell.TeamId == t {
			g.IncreaseScore(playerId, 1)
		}

		for _, tId := range g.GetTeams() {
			if g.GetRemainCellsCount(tId) == 0 {
				g.Started = false
				break
			}
		}
	}

	// reveal all cells when game is over
	if g.Started == false {
		g.PickAll()
	}

	return nil
}
