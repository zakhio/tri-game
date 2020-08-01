package triGame

import (
	"fmt"
	"math/rand"

	"github.com/zakhio/online-games/tri/server/tri-game/data-objects"
)

type GameField struct {
	cells      []*dataObjects.WordCell
	teamsCount int
}

func (f *GameField) Pick(index int) (*dataObjects.WordCell, error) {
	if index < 0 || index >= len(f.cells) {
		return nil, fmt.Errorf("cannot pick: index %v is out gamefiled %v", index, len(f.cells))
	}

	cell := f.cells[index]
	if !cell.Open {
		cell.Open = true
		f.cells[index] = cell
	}

	return cell, nil
}

func (f *GameField) GetRemainCellsCount(teamId int) int {
	count := 0
	for _, c := range f.cells {
		if c.TeamId == teamId && !c.Open {
			count++
		}
	}
	return count
}

func NewTRIGameField(teamsCount int, words []string) GameField {
	f := GameField{}
	f.teamsCount = teamsCount

	// generate cells from words
	f.cells = make([]*dataObjects.WordCell, 0, len(words))
	for _, w := range words {
		cell := dataObjects.NewWordCell(w)
		f.cells = append(f.cells, cell)
	}

	cellsCount := len(f.cells)

	// configure end game cell
	idx := rand.Intn(cellsCount)
	f.cells[idx].Type = dataObjects.WordCellTypeEndGame

	// configure cell owned by teams
	cellsPerTeam := cellsCount / (f.teamsCount + 1)
	startingTeamId := rand.Intn(f.teamsCount)
	for teamId := 0; teamId < f.teamsCount; teamId++ {
		count := cellsPerTeam
		if teamId == startingTeamId {
			count++
		}

		for i := 0; i < count; i++ {
			idx := rand.Intn(cellsCount)
			for f.cells[idx].Type != dataObjects.WordCellTypeRegular {
				idx = rand.Intn(cellsCount)
			}
			f.cells[idx].Type = dataObjects.WordCellTypeTeamOwned
			f.cells[idx].TeamId = teamId
		}
	}

	return f
}
