package logic

import (
	"fmt"
	"strconv"
)

type TeamInfo interface {
	AddTeam(teamId string) error
	AddToTeam(teamId, playerId string) error
	GetTeams() []string
}

func (g *GameState) NewTeam() (string, error) {
	if g.Started {
		return "", fmt.Errorf("cannot add teamId: game already started")
	}

	teamId := g.nextTeamId()
	g.Teams = append(g.Teams, teamId)
	g.SetAlias(teamId, teamId)

	teamPlayers := make([]string, 0)
	g.TeamPlayers[teamId] = teamPlayers

	return teamId, nil
}

func (g *GameState) AddToTeam(teamId, playerId string) error {
	oldTeamId, oldTeamIdx := g.GetTeam(playerId)

	if oldTeamId != "" {
		g.TeamPlayers[oldTeamId] = append(g.TeamPlayers[oldTeamId][:oldTeamIdx], g.TeamPlayers[oldTeamId][oldTeamIdx+1:]...)
	}

	if _, ok := g.TeamPlayers[teamId]; !ok {
		return fmt.Errorf("cannot add to team [%v]: team doesn't exist", teamId)
	}

	g.TeamPlayers[teamId] = append(g.TeamPlayers[teamId], playerId)

	return nil
}

func (g *GameState) GetTeam(playerId string) (string, int) {
	for k, v := range g.TeamPlayers {
		for i, pId := range v {
			if pId == playerId {
				return k, i
			}
		}
	}

	return "", -1
}

func (g *GameState) GetTeams() []string {
	return g.Teams
}

func (g *GameState) nextTeamId() string {
	return strconv.Itoa(len(g.Teams))
}
