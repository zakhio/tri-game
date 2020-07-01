package logic

import (
	"fmt"
	"zakh.io/tri/server/engine/entities"
)

// CellsInfo structure for player
type CellsInfo interface {
	Pick(player string, position int) (entities.WordCell, error)
	PickAll()
	GetCells() []entities.WordCell
	GetRemainCellsCount(teamId string) int
}

func (g *GameState) Pick(player string, position int) (*entities.WordCell, error) {
	if err := g.validateInfo(player); err != nil {
		return nil, err
	}

	if position < 0 || position >= len(g.Cells) {
		return nil, fmt.Errorf("cannot pick: position %v is out gamefiled [%v][%v]", position, g.numberOrRows, g.numberOfColumns)
	}

	cell := g.Cells[position]

	if !cell.Open {
		cell.Open = true
		g.PlayerHistory[player] = append(g.PlayerHistory[player], cell)
		g.Cells[position] = cell
	}

	return &cell, nil
}

func (g *GameState) PickAll() {
	for i := 0; i < len(g.Cells); i++ {
		g.Cells[i].Open = true
	}
}

func (g *GameState) GetPicked(player string) ([]entities.WordCell, error) {
	if err := g.validateInfo(player); err != nil {
		return nil, err
	}

	return g.PlayerHistory[player], nil
}

func (g *GameState) GetCells() []entities.WordCell {
	return g.Cells
}

func (g *GameState) GetRemainCellsCount(teamId string) int {
	count := 0
	for _, c := range g.Cells {
		if c.TeamId == teamId && !c.Open {
			count++
		}
	}
	return count
}

func (g *GameState) SetCells(cells []entities.WordCell) {
	g.Cells = cells
}

func (g *GameState) validateInfo(playerId string) error {
	if _, ok := g.PlayerHistory[playerId]; !ok {
		return fmt.Errorf("player %v doesn't exist", playerId)
	}

	return nil
}
