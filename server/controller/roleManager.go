package controller

type RoleManager interface {
	AddRole(scope, memberId, role string)
	HasRole(scope, memberId, role string) bool
	DeleteAll(scope string)
}

type playerManager struct {
	players map[string]map[string][]string
}

func (p *playerManager) AddRole(scope, memberId, role string) {
	sessionPlayers, ok := p.players[scope]
	if !ok {
		sessionPlayers = make(map[string][]string)
		p.players[scope] = sessionPlayers
	}

	sessionPlayers[memberId] = append(sessionPlayers[memberId], role)
}

func (p *playerManager) HasRole(scope, memberId, role string) bool {
	sessionPlayers, ok := p.players[scope]
	if !ok {
		return false
	}
	roles, ok := sessionPlayers[memberId]

	for _, r := range roles {
		if r == role {
			return true
		}
	}

	return false
}

func (p *playerManager) DeleteAll(scope string) {
	delete(p.players, scope)
}

func NewRoleManager() RoleManager {
	return &playerManager{players: make(map[string]map[string][]string)}
}
