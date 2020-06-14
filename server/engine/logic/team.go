package logic

import (
	"fmt"
)

type TeamInfo interface {
	AddTeam(teamId string) error
	AddToTeam(teamId, playerId string) error
	GetTeams() []string
}

func (g *GameState) NewTeam() (string, error) {
	teamId := g.nextId()

	if g.Started {
		return "", fmt.Errorf("cannot add teamId: game already started")
	}

	team := make([]string, 0)
	g.Teams[teamId] = team

	return teamId, nil
}

func (g *GameState) AddToTeam(teamId, playerId string) error {
	oldTeamId, oldTeamIdx := g.GetTeam(playerId)

	if oldTeamId != "" {
		g.Teams[oldTeamId] = append(g.Teams[oldTeamId][:oldTeamIdx], g.Teams[oldTeamId][oldTeamIdx+1:]...)
	}

	if _, ok := g.Teams[teamId]; !ok {
		return fmt.Errorf("cannot add to team [%v]: team doesn't exist", teamId)
	}

	g.Teams[teamId] = append(g.Teams[teamId], playerId)

	return nil
}

func (g *GameState) GetTeam(playerId string) (string, int) {
	for k, v := range g.Teams {
		for i, pId := range v {
			if pId == playerId {
				return k, i
			}
		}
	}

	return "", -1
}

func (g *GameState) GetTeams() map[string][]string {
	return g.Teams
}
