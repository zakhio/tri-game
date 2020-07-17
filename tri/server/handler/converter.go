package handler

import (
	"github.com/golang/protobuf/ptypes/wrappers"
	pb "zakh.io/tri/proto"
	"zakh.io/tri/server/engine/entities"
	"zakh.io/tri/server/engine/logic"
)

func Convert(playerId string, gameState logic.GameState) *pb.GameSessionStream {
	result := &pb.GameSessionStream{}
	result.PlayerId = playerId

	players := make([]*pb.Player, 0)
	for _, pId := range gameState.GetPlayers() {
		words := make([]*pb.Cell, 0)
		picked, _ := gameState.GetPicked(pId)

		for _, c := range picked {
			words = append(words, convertCell(c, true))
		}

		teamId, _ := gameState.GetTeam(pId)
		var captainWrapper *wrappers.BoolValue = nil
		captain := gameState.IsCaptain(pId)
		if captain != nil {
			captainWrapper = &wrappers.BoolValue{Value: *captain}
		}

		player := &pb.Player{
			Id:      pId,
			Alias:   gameState.GetAlias(pId),
			TeamId:  teamId,
			Captain: captainWrapper,
			Score:   int32(gameState.GetScore(pId)),
		}

		players = append(players, player)
	}
	result.Players = players

	teams := make([]*pb.Team, 0)
	for _, tId := range gameState.GetTeams() {
		team := &pb.Team{
			Id:             tId,
			Alias:          gameState.GetAlias(tId),
			RemainingCount: int32(gameState.GetRemainCellsCount(tId)),
		}

		teams = append(teams, team)
	}
	result.Teams = teams

	captain := gameState.IsCaptain(playerId)
	cells := make([]*pb.Cell, 0)
	for _, c := range gameState.GetCells() {
		cells = append(cells, convertCell(c, (captain != nil && *captain) || !gameState.Started))
	}
	result.Cells = cells
	result.NumberOfColumns = int32(gameState.GetNumOfColumns())
	result.Started = gameState.Started

	return result
}

func convertCell(c entities.WordCell, showSensitive bool) *pb.Cell {
	cell := &pb.Cell{
		Word: c.Word,
		Open: c.Open,
	}

	if showSensitive || c.Open {
		switch c.Type {
		case entities.REGULAR:
			cell.Type = pb.Cell_REGULAR
		case entities.END_GAME:
			cell.Type = pb.Cell_END_GAME
		case entities.TEAM_OWNED:
			cell.Type = pb.Cell_TEAM_OWNED
			cell.OwnerTeamId = c.TeamId
		}
	}

	return cell
}
