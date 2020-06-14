package entities

const (
	REGULAR = iota
	TEAM_OWNED
	END_GAME
)

type WordCell struct {
	Word   string
	Open   bool
	Type   int
	TeamId string
}

// NewCell TODO
func NewCell(word string, cellType int, teamId string) WordCell {
	tId := ""
	if cellType == TEAM_OWNED {
		tId = teamId
	}

	return WordCell{Word: word, Open: false, TeamId: tId, Type: cellType}
}
