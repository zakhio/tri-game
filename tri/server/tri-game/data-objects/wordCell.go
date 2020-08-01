package dataObjects

const (
	WordCellTypeRegular = iota
	WordCellTypeTeamOwned
	WordCellTypeEndGame
)

type WordCell struct {
	Word   string
	Open   bool
	Type   int
	TeamId int
}

// NewWordCell TODO
func NewWordCell(word string) *WordCell {
	return &WordCell{
		Word:   word,
		Type:   WordCellTypeRegular,
		Open:   false,
		TeamId: -1,
	}
}
