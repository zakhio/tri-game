package engine

import (
	"zakh.io/tri/server/engine/logic"
	"zakh.io/tri/server/middleware/observable"
)

// RASGame TODO
type GameSession interface {
	// AddPlayer TODO
	AddPlayer(player string) error

	// IsPlayer TODO
	IsPlayer(player string) bool

	// Start TODO
	Start(player string, numberOrRows, numberOfColumns int) error

	// Turn TODO
	Turn(player string, position int) error

	// StateObservable TODO
	StateObservable() observable.Observable
}

type gameSession struct {
	observable observable.Observable
	state      *logic.GameState
}

func (g *gameSession) AddPlayer(player string) error {
	if err := g.state.AddPlayer(player); err != nil {
		return err
	}

	return g.publishCurrentState(player)
}

func (g *gameSession) IsPlayer(playerId string) bool {
	return g.state.IsPlayer(playerId)
}

func (g *gameSession) Start(player string, numberOrRows, numberOfColumns int) error {
	if err := g.state.Start(numberOrRows, numberOfColumns); err != nil {
		return err
	}

	return g.publishCurrentState(player)
}

func (g *gameSession) Turn(player string, position int) error {
	if err := g.state.Turn(player, position); err != nil {
		return err
	}

	return g.publishCurrentState(player)
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
