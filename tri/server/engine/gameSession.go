package engine

import (
	"github.com/zakhio/online-games/tri/server/engine/logic"
	"github.com/zakhio/online-games/tri/server/middleware/observable"
)

// RASGame TODO
type GameSession interface {
	// AddPlayer TODO
	NewPlayer() (string, error)

	// Start TODO
	Start(playerId string, numberOfTeams, numberOrRows, numberOfColumns int) error

	// Turn TODO
	Turn(playerId string, position int) error

	// SetSettings TODO
	SetSettings(playerId, teamId, alias string, captain bool) error

	// StateObservable TODO
	StateObservable() observable.Observable
}

type gameSession struct {
	observable observable.Observable
	state      *logic.GameState
}

func (g *gameSession) NewPlayer() (string, error) {
	playerId, err := g.state.NewPlayer()
	if err != nil {
		return "", err
	}

	return playerId, g.publishCurrentState(playerId)
}

func (g *gameSession) SetSettings(playerId, teamId, alias string, captain bool) error {
	if teamId != "" {
		if err := g.state.AddToTeam(teamId, playerId); err != nil {
			return err
		}
	}

	g.state.SetCaptainFlag(playerId, captain)

	if alias != "" {
		g.state.SetAlias(playerId, alias)
	}

	return g.publishCurrentState(playerId)
}

func (g *gameSession) Start(playerId string, numberOfTeams, numberOrRows, numberOfColumns int) error {
	if err := g.state.Start(numberOfTeams, numberOrRows, numberOfColumns); err != nil {
		return err
	}

	return g.publishCurrentState(playerId)
}

func (g *gameSession) Turn(playerId string, position int) error {
	if err := g.state.Turn(playerId, position); err != nil {
		return err
	}

	return g.publishCurrentState(playerId)
}

func (g *gameSession) StateObservable() observable.Observable {
	return g.observable
}

func (g *gameSession) publishCurrentState(changeMessage string) error {
	g.observable.Publish(*g.state, changeMessage)
	return nil
}

// NewWord creates new RASGame
func NewGameSession() GameSession {
	state := logic.NewGameState()
	session := &gameSession{
		observable: observable.New(1),
		state:      state,
	}
	session.publishCurrentState("game created")

	return session
}
