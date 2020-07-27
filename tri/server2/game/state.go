package game

import (
	"fmt"
	"math/rand"
	"strconv"
	"sync"
	"sync/atomic"

	"github.com/zakhio/online-games/go-game-base/session"
	"github.com/zakhio/online-games/tri/server2/middleware/dictionary"
	"github.com/zakhio/online-games/tri/server2/middleware/math"
)

type TRIState interface {
	session.State

	Activate(token string)
	SetCaptainRole(token string, active bool)

	Start(numberOfTeams, numberOrRows, numberOfColumns int) error
	Turn(token string, position int) error
}

type triState struct {
	session.BaseState

	latestPlayerID int32
	players        *sync.Map

	cells        []*WordCell
	teamsCount   int
	rowsCount    int
	columnsCount int

	stateValue *TRIStateValue
}

func (s *triState) Activate(token string) {
	d, _ := s.players.LoadOrStore(token, &TRIPlayer{})
	player := d.(*TRIPlayer)
	if !player.Active {
		player.ID = strconv.Itoa(int(atomic.AddInt32(&s.latestPlayerID, 1)))
		player.Active = true
	}
	s.updateStateValue()
}

func (s *triState) SetCaptainRole(token string, active bool) {
	d, _ := s.players.LoadOrStore(token, &TRIPlayer{})
	player := d.(*TRIPlayer)
	player.Captain = active
	player.Initialized = true
	s.updateStateValue()
}

func (s *triState) Start(numberOfTeams, numberOrRows, numberOfColumns int) error {
	s.teamsCount = math.Max(numberOfTeams, 2)
	s.rowsCount = math.Max(numberOrRows, 5)
	s.columnsCount = math.Max(numberOfColumns, 5)

	// configure cells
	dict, err := dictionary.ReadLines("dictionary/ru.txt")
	if err != nil {
		return err
	}

	wordsCount := s.rowsCount * s.columnsCount
	wordsDict := make(map[string]bool, wordsCount)

	for len(wordsDict) < wordsCount {
		word := dict[rand.Intn(len(dict))]
		wordsDict[word] = false
	}

	s.cells = make([]*WordCell, 0, wordsCount)
	for k, _ := range wordsDict {
		cell := NewWordCell(k, WordCellTypeRegular, -1)
		s.cells = append(s.cells, cell)
	}

	// configure ownership
	teamWordSize := wordsCount / (s.teamsCount + 1)
	endPosition := rand.Intn(wordsCount)
	s.cells[endPosition].Type = WordCellTypeEndGame
	wordsDict[s.cells[endPosition].Word] = true

	startingTeam := rand.Intn(s.teamsCount)
	for tId := 0; tId < s.teamsCount; tId++ {
		size := teamWordSize
		if tId == startingTeam {
			size++
		}

		for i := 0; i < size; i++ {
			pos := rand.Intn(wordsCount)
			for wordsDict[s.cells[pos].Word] == true {
				pos = rand.Intn(wordsCount)
			}
			s.cells[pos].Type = WordCellTypeTeamOwned
			s.cells[pos].TeamId = tId
			wordsDict[s.cells[pos].Word] = true
		}
	}

	s.Active = true

	s.updateStateValue()
	return nil
}

func (s *triState) Turn(token string, position int) error {
	d, _ := s.players.LoadOrStore(token, &TRIPlayer{})
	player := d.(*TRIPlayer)
	if player.Captain {
		return fmt.Errorf("[%v] cannot turn: only non-captains can do it", token)
	} else if position < 0 || position >= len(s.cells) {
		return fmt.Errorf("[%v] cannot pick: position %v is out gamefiled [%v][%v]", token, position, s.rowsCount, s.columnsCount)
	}

	cell := s.cells[position]
	if !cell.Open {
		cell.Open = true
		s.cells[position] = cell
	}

	switch cell.Type {
	case WordCellTypeEndGame:
		s.Active = false
	case WordCellTypeTeamOwned:
		for tId := 0; tId < s.teamsCount; tId++ {
			if s.GetRemainCellsCount(tId) == 0 {
				s.Active = false
				break
			}
		}
	}

	s.updateStateValue()
	return nil
}

func (s *triState) GetRemainCellsCount(teamId int) int {
	count := 0
	for _, c := range s.cells {
		if c.TeamId == teamId && !c.Open {
			count++
		}
	}
	return count
}

func (s *triState) updateStateValue() {
	s.stateValue.Active = s.Active
	s.stateValue.NumOfTeams = s.teamsCount
	s.stateValue.NumOfColumns = s.columnsCount
	s.stateValue.Cells = s.cells
	s.stateValue.Players = s.stateValue.Players[:0]

	s.players.Range(func(key interface{}, value interface{}) bool {
		token := key.(string)
		player := value.(*TRIPlayer)

		s.stateValue.Players = append(s.stateValue.Players, token)
		s.stateValue.Captains[token] = player.Captain
		s.stateValue.IDs[token] = player.ID

		return true
	})
	s.Observable.Publish(s.stateValue)
}

func (s *triState) Reset() {
	s.BaseState.Reset()
}

func NewTRIState() TRIState {
	return &triState{
		BaseState:  session.NewBaseState(),
		players:    &sync.Map{},
		stateValue: NewTRIStateValue(),
	}
}
