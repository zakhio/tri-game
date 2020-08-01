package triGame

import (
	"context"
	"fmt"
	"strconv"
	"sync"
	"sync/atomic"
	"time"

	"github.com/zakhio/online-games/go-game-base/session"
	"github.com/zakhio/online-games/tri/server/config"
	"github.com/zakhio/online-games/tri/server/middleware/math"
	"github.com/zakhio/online-games/tri/server/tri-game/data-objects"
)

type TRISession interface {
	session.Session

	Observe(ctx context.Context, token string, callback func(*dataObjects.StateValue) error) error
	Start(token string, teams, rows, columns int, language string, dictionary []string) error
	Turn(token string, position int) error
	SetCaptainRole(token string, active bool) error
}

type triSession struct {
	session.BaseSession

	dict *config.Dictionary

	canStartAt time.Time

	language     string
	rowsCount    int
	columnsCount int

	playersMap     *sync.Map
	latestPlayerID int32

	gameField GameField

	stateValue *dataObjects.StateValue
}

func (s *triSession) Observe(ctx context.Context, token string, callback func(*dataObjects.StateValue) error) error {
	player := s.playerByToken(token)
	if player.ID == "" {
		player.ID = strconv.Itoa(int(atomic.AddInt32(&s.latestPlayerID, 1)))
		s.updateStateValue()
	}

	err := s.Observable.SubscribeSync(ctx, token, callback)

	return err
}

func (s *triSession) Start(token string, teams, rows, columns int, language string, dictionary []string) error {
	if !s.Observable.IsSubscribed(token) {
		return fmt.Errorf("[%v] cannot start: must observe session", token)
	} else if time.Now().Before(s.canStartAt) {
		return fmt.Errorf("[%v] cannot start: cooldown on start", token)
	}

	s.canStartAt = time.Now().Add(time.Duration(7) * time.Second)

	s.cleanupPlayers()
	s.rowsCount = math.Max(rows, 5)
	s.columnsCount = math.Max(columns, 5)
	s.language = s.dict.GetLanguage(language)

	s.gameField = NewTRIGameField(math.Max(teams, 2), s.dict.GetWords(language, s.rowsCount*s.columnsCount))
	s.Active = true
	s.updateStateValue()

	return nil
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
	case dataObjects.WordCellTypeEndGame:
		s.Active = false
	case dataObjects.WordCellTypeTeamOwned:
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

func (s *triSession) playerByToken(token string) *dataObjects.Player {
	d, _ := s.playersMap.LoadOrStore(token, &dataObjects.Player{})
	return d.(*dataObjects.Player)
}

func (s *triSession) updateStateValue() {
	s.stateValue.SessionID = s.ID
	s.stateValue.Active = s.Active
	s.stateValue.NumOfColumns = s.columnsCount
	s.stateValue.NumOfTeams = s.gameField.teamsCount
	s.stateValue.Cells = s.gameField.cells
	s.stateValue.Language = s.language
	s.stateValue.Players = s.stateValue.Players[:0]

	s.playersMap.Range(func(key interface{}, value interface{}) bool {
		token := key.(string)
		player := value.(*dataObjects.Player)

		s.stateValue.Players = append(s.stateValue.Players, token)
		s.stateValue.Captains[token] = player.Captain
		s.stateValue.IDs[token] = player.ID
		s.stateValue.Initialized[token] = player.Initialized

		return true
	})
	s.Observable.Publish(s.stateValue)
}

func (s *triSession) cleanupPlayers() {
	deleteList := make([]string, 0)
	s.playersMap.Range(func(key interface{}, value interface{}) bool {
		token := key.(string)
		player := value.(*dataObjects.Player)

		if !player.Initialized && !s.Observable.IsSubscribed(token) {
			deleteList = append(deleteList, token)
		}
		player.Initialized = false
		player.Captain = false

		return true
	})

	for _, token := range deleteList {
		s.playersMap.Delete(token)
	}
}

func NewTRISession(d *config.Dictionary) TRISession {
	s := &triSession{}
	s.BaseSession = session.NewBaseSession()
	s.playersMap = &sync.Map{}
	s.stateValue = dataObjects.NewTRIStateValue()
	s.dict = d
	s.canStartAt = time.Now()

	return s
}
