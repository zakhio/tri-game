package game

import "github.com/zakhio/online-games/go-game-base/session"

type TRIStateValue struct {
	session.StateValue

	Players     []string
	Initialized map[string]bool
	IDs         map[string]string
	Captains    map[string]bool

	Cells        []*WordCell
	NumOfColumns int
	NumOfTeams   int
}

func (v *TRIStateValue) GetRemainCellsCount(teamID int) int {
	count := 0

	for _, c := range v.Cells {
		if !c.Open && c.TeamId == teamID {
			count++
		}
	}

	return count
}

func NewTRIStateValue() *TRIStateValue {
	return &TRIStateValue{
		Players:     make([]string, 0),
		Initialized: make(map[string]bool),
		IDs:         make(map[string]string),
		Captains:    make(map[string]bool),
	}
}
