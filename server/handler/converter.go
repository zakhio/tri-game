package handler

import (
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
			words = append(words, convertCell(c, false))
		}

		teamId, _ := gameState.GetTeam(pId)
		player := &pb.Player{
			Alias:  gameState.GetAlias(pId),
			TeamId: teamId,
		}

		players = append(players, player)
	}
	result.Players = players

	teams := make([]*pb.Team, 0)
	for tId, _ := range gameState.GetTeams() {
		team := &pb.Team{
			Id:             tId,
			RemainingCount: int32(gameState.GetRemainCellsCount(tId)),
		}

		teams = append(teams, team)
	}
	result.Teams = teams

	cells := make([]*pb.Cell, 0)
	for _, c := range gameState.GetCells() {
		cells = append(cells, convertCell(c, gameState.IsCaptain(playerId)))
	}
	result.Cells = cells
	result.NumberOfColumns = int32(gameState.GetNumOfColumns())

	return result
}

func convertCell(c entities.WordCell, hideSensitive bool) *pb.Cell {
	cell := &pb.Cell{
		Word: c.Word,
		Open: c.Open,
	}

	if !hideSensitive || c.Open {
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
