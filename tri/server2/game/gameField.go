package game

import (
	"fmt"
	"math/rand"

	"github.com/zakhio/online-games/tri/server2/middleware/math"
)

type TRIGameField struct {
	cells        []*WordCell
	teamsCount   int
	rowsCount    int
	columnsCount int
}

func (f *TRIGameField) Pick(absoluteIndex int) (*WordCell, error) {
	if absoluteIndex < 0 || absoluteIndex >= len(f.cells) {
		return nil, fmt.Errorf("cannot pick: absoluteIndex %v is out gamefiled %v*%v", absoluteIndex, f.rowsCount, f.columnsCount)
	}

	cell := f.cells[absoluteIndex]
	if !cell.Open {
		cell.Open = true
		f.cells[absoluteIndex] = cell
	}

	return cell, nil
}

func (f *TRIGameField) GetRemainCellsCount(teamId int) int {
	count := 0
	for _, c := range f.cells {
		if c.TeamId == teamId && !c.Open {
			count++
		}
	}
	return count
}

func NewTRIGameField(numberOfTeams, numberOrRows, numberOfColumns int, dict []string) TRIGameField {
	f := TRIGameField{}
	f.teamsCount = math.Max(numberOfTeams, 2)
	f.rowsCount = math.Max(numberOrRows, 5)
	f.columnsCount = math.Max(numberOfColumns, 5)

	wordsCount := f.rowsCount * f.columnsCount
	wordsDict := make(map[string]bool, wordsCount)

	for len(wordsDict) < wordsCount {
		word := dict[rand.Intn(len(dict))]
		wordsDict[word] = false
	}

	f.cells = make([]*WordCell, 0, wordsCount)
	for k, _ := range wordsDict {
		cell := NewWordCell(k, WordCellTypeRegular, -1)
		f.cells = append(f.cells, cell)
	}

	// configure ownership
	teamWordSize := wordsCount / (f.teamsCount + 1)
	endPosition := rand.Intn(wordsCount)
	f.cells[endPosition].Type = WordCellTypeEndGame
	wordsDict[f.cells[endPosition].Word] = true

	startingTeam := rand.Intn(f.teamsCount)
	for tId := 0; tId < f.teamsCount; tId++ {
		size := teamWordSize
		if tId == startingTeam {
			size++
		}

		for i := 0; i < size; i++ {
			pos := rand.Intn(wordsCount)
			for wordsDict[f.cells[pos].Word] == true {
				pos = rand.Intn(wordsCount)
			}
			f.cells[pos].Type = WordCellTypeTeamOwned
			f.cells[pos].TeamId = tId
			wordsDict[f.cells[pos].Word] = true
		}
	}

	return f
}
