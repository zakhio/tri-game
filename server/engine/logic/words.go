package logic

import (
	"fmt"
	"math/rand"
	"zakh.io/tri/server/engine/entities"
)

// WordsInfo structure for player
type WordsInfo interface {
	Pick(player string, amount int) error
	GetWords() []entities.WordCell
	GenerateWords(amount int)
}

func (d *GameState) Pick(player string, position int) error {
	if err := d.validateInfo(player); err != nil {
		return err
	}

	if position < 0 || position >= d.numberOfColumns * d.numberOrRows {
		return fmt.Errorf("cannot pick: position %v is out gamefiled [%v][%v]", position, d.numberOrRows, d.numberOfColumns)
	}

	cell := d.Words[position]

	if !cell.IsOpen() {
		cell.SetOpen(true)
		d.PlayerWords[player] = append(d.PlayerWords[player], cell)
		d.Words[position] = cell
	}

	return nil
}

func (d *GameState) GetPicked(player string) ([]entities.WordCell, error) {
	if err := d.validateInfo(player); err != nil {
		return nil, err
	}

	return d.PlayerWords[player], nil
}

func (d *GameState) GetWords() []entities.WordCell {
	return d.Words
}

func (d* GameState) GetNumOfColumns() int {
	return d.numberOfColumns
}

func (d *GameState) GenerateWords(amount int, words []string) {
	skins := []string{"none", "black", "blue", "red"}
	for i := 0; i < amount; i++ {
		card := entities.NewWord(words[rand.Intn(len(words))], skins[rand.Intn(len(skins))])
		d.Words = append(d.Words, card)
	}
}

func (d *GameState) validateInfo(playerId string) error {
	if _, ok := d.PlayerWords[playerId]; !ok {
		return fmt.Errorf("player %v doesn't exist", playerId)
	}

	return nil
}
