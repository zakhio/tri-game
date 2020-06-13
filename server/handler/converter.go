package handler

import (
	pb "zakh.io/tri/proto"
	"zakh.io/tri/server/controller"
	"zakh.io/tri/server/engine/entities"
	"zakh.io/tri/server/engine/logic"
)

func Convert(currentPlayer string, gameState logic.GameState, playerData map[string]controller.MemberData, hideSensitive bool) *pb.GameSessionStream {
	result := &pb.GameSessionStream{}
	result.Me = &pb.CurrentPlayer{
		Token: currentPlayer,
	}

	players := make([]*pb.Player, 0)
	for idx, player := range gameState.GetPlayers() {
		if player == currentPlayer {
			result.Me.PlayerIndex = int32(idx)
		}

		words := make([]*pb.Word, 0)
		picked, _ := gameState.GetPicked(player)

		for _, c := range picked {
			words = append(words, convertWordCell(c, false))
		}
		player := &pb.Player{
			Name:  playerData[player].GetName(),
			Words: words,
		}

		players = append(players, player)
	}
	result.Players = players

	words := make([]*pb.Word, 0)
	for _, c := range gameState.GetWords() {
		words = append(words, convertWordCell(c, hideSensitive))
	}
	result.Words = words
	result.NumberOfColumns = int32(gameState.GetNumOfColumns())

	return result
}

func convertWordCell(c entities.WordCell, hideSensitive bool) *pb.Word {
	word := &pb.Word{
		Word: c.GetWord(),
		Open: c.IsOpen(),
	}

	if !hideSensitive || c.IsOpen() {
		word.SkinId = c.GetSkin()
	}

	return word
}
