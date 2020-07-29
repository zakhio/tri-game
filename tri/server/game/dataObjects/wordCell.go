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
func NewWordCell(word string, cellType int, teamId int) *WordCell {
	tId := -1
	if cellType == WordCellTypeTeamOwned {
		tId = teamId
	}

	return &WordCell{Word: word, Open: false, TeamId: tId, Type: cellType}
}
