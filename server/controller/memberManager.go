package controller

import (
	"github.com/google/uuid"
)

type MemberData string

func (m MemberData) GetName() string {
	return string(m)
}

type MemberManager interface {
	AddMember(scope string, member MemberData) (string, error)
	IsMember(scope string, memberId string) bool
	GetMemberData(scope string) map[string]MemberData
	DeleteAll(scope string)
}

type memberManager struct {
	members map[string]map[string]MemberData
}

func (p *memberManager) AddMember(scope string, member MemberData) (string, error) {
	scopeMembers, ok := p.members[scope]
	if !ok {
		scopeMembers = make(map[string]MemberData)
		p.members[scope] = scopeMembers
	}

	id, _ := uuid.NewUUID()
	scopeMembers[id.String()] = member

	return id.String(), nil
}

func (p *memberManager) IsMember(scope string, memberId string) bool {
	scopeMembers, ok := p.members[scope]
	if !ok {
		return false
	}
	_, ok = scopeMembers[memberId]

	return ok
}

func (p *memberManager) GetMemberData(scope string) map[string]MemberData {
	sessionPlayers, ok := p.members[scope]
	if !ok {
		return nil
	}

	return sessionPlayers
}

func (p *memberManager) DeleteAll(scope string) {
	delete(p.members, scope)
}

func NewMemberManager() MemberManager {
	return &memberManager{members: make(map[string]map[string]MemberData)}
}
