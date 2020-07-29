package protoConverter

import (
	"github.com/zakhio/online-games/tri/proto"
	"github.com/zakhio/online-games/tri/server/game"
	"strconv"
)

func FromStateValue(token string, state *game.TRIStateValue) *proto.GameSessionStream {
	result := &proto.GameSessionStream{}
	result.PlayerId = state.IDs[token]

	players := make([]*proto.Player, 0, len(state.Players))
	for _, pToken := range state.Players {
		player := &proto.Player{
			Id:          state.IDs[pToken],
			Initialized: state.Initialized[pToken],
			Captain:     state.Captains[pToken],
		}

		players = append(players, player)
	}
	result.Players = players

	teams := make([]*proto.Team, 0)
	for tId := 0; tId < state.NumOfTeams; tId++ {
		team := &proto.Team{
			Id:             strconv.Itoa(tId),
			RemainingCount: int32(state.GetRemainCellsCount(tId)),
		}

		teams = append(teams, team)
	}
	result.Teams = teams

	captain := state.Captains[token]
	cells := make([]*proto.Cell, 0)
	for _, c := range state.Cells {
		cells = append(cells, convertCell(c, captain || !state.Active))
	}
	result.Cells = cells
	result.NumberOfColumns = int32(state.NumOfColumns)
	result.Started = state.Active

	return result
}

func convertCell(c *game.WordCell, showSensitive bool) *proto.Cell {
	cell := &proto.Cell{
		Word: c.Word,
		Open: c.Open,
	}

	if showSensitive || c.Open {
		switch c.Type {
		case game.WordCellTypeRegular:
			cell.Type = proto.Cell_REGULAR
		case game.WordCellTypeEndGame:
			cell.Type = proto.Cell_END_GAME
		case game.WordCellTypeTeamOwned:
			cell.Type = proto.Cell_TEAM_OWNED
			cell.OwnerTeamId = strconv.Itoa(c.TeamId)
		}
	}

	return cell
}
