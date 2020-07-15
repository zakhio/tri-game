package controller

import (
	"fmt"
	"log"
	"zakh.io/tri/server/engine"
	"zakh.io/tri/server/middleware/observable"
	"zakh.io/tri/server/middleware/random"
)

var Manager = NewSessionManager()

type SessionManager interface {
	Create(token string) string
	Join(token, sessionId string) (observable.Observable, string, error)
	GetSession(token, sessionId string) (engine.GameSession, string, error)
}

type sessionManager struct {
	sessions  map[string]engine.GameSession
	playerIds SessionPlayerManager
}

func (s *sessionManager) Create(token string) string {
	sessionId := s.nextSessionId()
	session := engine.NewGameSession()
	playerId, _ := session.NewPlayer()
	log.Printf("create: token %v session %v playerId %v", token, sessionId, playerId)
	s.playerIds.Add(token, sessionId, playerId)

	s.sessions[sessionId] = session

	return sessionId
}

func (s *sessionManager) Join(token, sessionId string) (observable.Observable, string, error) {
	session, ok := s.sessions[sessionId]
	if !ok {
		return nil, "", fmt.Errorf("session %v doesn't exist", sessionId)
	}

	if token == "" {
		return nil, "", fmt.Errorf("token %v is empty", token)
	}

	playerId, ok := s.playerIds.Get(token, sessionId)

	if !ok {
		playerId, _ = session.NewPlayer()
		s.playerIds.Add(token, sessionId, playerId)
	}

	return session.StateObservable(), playerId, nil
}

func (s *sessionManager) GetSession(token, sessionId string) (engine.GameSession, string, error) {
	session, ok := s.sessions[sessionId]
	if !ok {
		return nil, "", fmt.Errorf("session %v doesn't exist", sessionId)
	}

	playerId, ok := s.playerIds.Get(token, sessionId)

	if !ok {
		return nil, "", fmt.Errorf("token %v is not part of the session %v", token, sessionId)
	}

	return session, playerId, nil
}

func (s *sessionManager) nextSessionId() string {
	return random.RandString(4)
}

func NewSessionManager() SessionManager {
	roles := NewRoleManager()
	sessions := make(map[string]engine.GameSession)
	return &sessionManager{
		playerIds: roles,
		sessions:  sessions,
	}
}
