package logic

type AliasInfo interface {
}

func (g *GameState) GetAlias(id string) string {
	return g.Alias[id]
}

func (g *GameState) SetAlias(id, alias string) {
	g.Alias[id] = alias
}
