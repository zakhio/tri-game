package logic

type AliasInfo interface {
}

func (g *GameState) GetAlias(playerId string) string {
	return g.Alias[playerId]
}

func (g *GameState) SetAlias(playerId, alias string) {
	g.Alias[playerId] = alias
}
