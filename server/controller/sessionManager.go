package controller

import (
	"fmt"
	"zakh.io/tri/server/engine"
	"zakh.io/tri/server/middleware/observable"
	"zakh.io/tri/server/middleware/random"
)

var Manager = NewSessionManager()

const playerRole = "player_role"
const creatorRole = "creator_role"

type SessionManager interface {
	Create() (string, string)
	Join(sessionId, name, playerId string) (observable.Observable, string, error)
	Observer(sessionId string) (observable.Observable, error)
	GetSession(sessionId, playerId string) (engine.GameSession, error)
	GetPlayers(sessionId string) map[string]MemberData
	IsCreator(sessionId, playerId string) bool
}

type sessionManager struct {
	sessions map[string]engine.GameSession
	roles    RoleManager
	players  MemberManager
}

func (s *sessionManager) Create() (string, string) {
	sessionId := random.RandString(4)
	session := engine.NewGameSession()
	s.sessions[sessionId] = session
	creatorId, _ := s.players.AddMember(sessionId, creatorRole)
	//s.roles.AddRole(sessionId, creatorId, creatorRole)
	s.roles.AddRole(sessionId, creatorId, playerRole)
	session.AddPlayer(creatorId)

	return sessionId, creatorId
}

func (s *sessionManager) Join(sessionId, name, playerId string) (observable.Observable, string, error) {
	session, ok := s.sessions[sessionId]
	if !ok {
		return nil, "", fmt.Errorf("session %v doesn't exist", sessionId)
	}

	if playerId != "" {
		if !s.players.IsMember(sessionId, playerId) {
			return nil, "", fmt.Errorf("player %v doesn't exist", playerId)
		}
	} else if name != "" {
		playerId, _ = s.players.AddMember(sessionId, MemberData(name))
		s.roles.AddRole(sessionId, playerId, playerRole)
		if err := session.AddPlayer(playerId); err != nil {
			return nil, "", err
		}
	}

	return session.StateObservable(), playerId, nil
}

func (s *sessionManager) Observer(sessionId string) (observable.Observable, error) {
	session, ok := s.sessions[sessionId]
	if !ok {
		return nil, fmt.Errorf("session %v doesn't exist", sessionId)
	}

	return session.StateObservable(), nil
}

func (s *sessionManager) GetSession(sessionId, playerId string) (engine.GameSession, error) {
	session, ok := s.sessions[sessionId]
	if !ok {
		return nil, fmt.Errorf("session %v doesn't exist", sessionId)
	}

	if !s.players.IsMember(sessionId, playerId) {
		return nil, fmt.Errorf("player %v is not part of the session %v", playerId, sessionId)
	}

	return session, nil
}

func (s *sessionManager) GetPlayers(sessionId string) map[string]MemberData {
	return s.players.GetMemberData(sessionId)
}

func (s *sessionManager) IsCreator(sessionId, playerId string) bool {
	return s.roles.HasRole(sessionId, playerId, creatorRole)
}

func NewSessionManager() SessionManager {
	roles := NewRoleManager()
	players := NewMemberManager()
	sessions := make(map[string]engine.GameSession)
	return &sessionManager{
		roles:    roles,
		players:  players,
		sessions: sessions,
	}
}
