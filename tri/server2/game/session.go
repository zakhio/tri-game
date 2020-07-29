package game

import (
	"context"
	"fmt"
	"strconv"
	"sync"
	"sync/atomic"

	"github.com/zakhio/online-games/go-game-base/session"
	"github.com/zakhio/online-games/tri/server2/middleware/dictionary"
)

type TRISession interface {
	session.Session

	Observe(ctx context.Context, token string, callback func(*TRIStateValue) error) error
	Start(token string, config *TRIConfig) error
	Turn(token string, position int) error
	SetCaptainRole(token string, active bool) error
}

type triSession struct {
	session.BaseSession

	playersMap     *sync.Map
	latestPlayerID int32

	gameField TRIGameField

	stateValue *TRIStateValue
}

func (s *triSession) Observe(ctx context.Context, token string, callback func(*TRIStateValue) error) error {
	player := s.playerByToken(token)
	if !player.Active {
		player.ID = strconv.Itoa(int(atomic.AddInt32(&s.latestPlayerID, 1)))
		player.Active = true
		s.updateStateValue()
	}

	return s.Observable.SubscribeSync(ctx, token, callback)
}

func (s *triSession) Start(token string, config *TRIConfig) error {
	if !s.Observable.IsSubscribed(token) {
		return fmt.Errorf("[%v] cannot start: must observe session", token)
	}

	// configure cells
	dict, err := dictionary.ReadLines("dictionary/ru.txt")
	if err != nil {
		return err
	}

	s.gameField = NewTRIGameField(config.Teams, config.Rows, config.Columns, dict)
	s.Active = true
	s.updateStateValue()

	return err
}

func (s *triSession) Turn(token string, position int) error {
	if !s.Observable.IsSubscribed(token) {
		return fmt.Errorf("[%v] cannot turn: must observe session", token)
	} else if s.playerByToken(token).Captain {
		return fmt.Errorf("[%v] cannot turn: only non-captains can do it", token)
	}

	cell, err := s.gameField.Pick(position)
	if err != nil {
		return err
	}

	switch cell.Type {
	case WordCellTypeEndGame:
		s.Active = false
	case WordCellTypeTeamOwned:
		for tId := 0; tId < s.gameField.teamsCount; tId++ {
			if s.gameField.GetRemainCellsCount(tId) == 0 {
				s.Active = false
				break
			}
		}
	}
	s.updateStateValue()

	return err
}

func (s *triSession) SetCaptainRole(token string, active bool) error {
	if !s.Observable.IsSubscribed(token) {
		return fmt.Errorf("[%v] cannot turn: must observe session", token)
	}

	player := s.playerByToken(token)
	player.Captain = active
	player.Initialized = true
	s.updateStateValue()

	return nil
}

func (s *triSession) Reset() {
	panic("implement me")
}

func (s *triSession) playerByToken(token string) *TRIPlayer {
	d, _ := s.playersMap.LoadOrStore(token, &TRIPlayer{})
	return d.(*TRIPlayer)
}

func (s *triSession) updateStateValue() {
	s.stateValue.SessionID = s.ID
	s.stateValue.Active = s.Active
	s.stateValue.NumOfTeams = s.gameField.teamsCount
	s.stateValue.NumOfColumns = s.gameField.columnsCount
	s.stateValue.Cells = s.gameField.cells
	s.stateValue.Players = s.stateValue.Players[:0]

	s.playersMap.Range(func(key interface{}, value interface{}) bool {
		token := key.(string)
		player := value.(*TRIPlayer)

		s.stateValue.Players = append(s.stateValue.Players, token)
		s.stateValue.Captains[token] = player.Captain
		s.stateValue.IDs[token] = player.ID
		s.stateValue.Initialized[token] = player.Initialized

		return true
	})
	s.Observable.Publish(s.stateValue)
}

func NewTRISession() TRISession {
	s := &triSession{}
	s.BaseSession = session.NewBaseSession()
	s.playersMap = &sync.Map{}
	s.stateValue = NewTRIStateValue()

	return s
}
