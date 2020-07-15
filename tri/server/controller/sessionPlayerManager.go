package controller

type SessionPlayerManager interface {
	Add(token, sessionId, playerId string)
	Get(token, sessionId string) (string, bool)
	DeleteAll(sessionId string)
}

type playerManager struct {
	sessions map[string]map[string]string
}

func (p *playerManager) Add(token, sessionId, playerId string) {
	playerIds, ok := p.sessions[sessionId]
	if !ok {
		playerIds = make(map[string]string)
		p.sessions[sessionId] = playerIds
	}

	playerIds[token] = playerId
}

func (p *playerManager) Get(token, sessionId string) (string, bool) {
	playerIds, ok := p.sessions[sessionId]
	if !ok {
		return "", ok
	}
	playerId, ok := playerIds[token]

	return playerId, ok
}

func (p *playerManager) DeleteAll(scope string) {
	delete(p.sessions, scope)
}

func NewRoleManager() SessionPlayerManager {
	return &playerManager{sessions: make(map[string]map[string]string)}
}
