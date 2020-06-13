package entities

// WordCell structure for player
type WordCell interface {
	// GetKind TODO
	GetWord() string

	// GetValue TODO
	IsOpen() bool

	// GetValue TODO
	SetOpen(bool)

	// GetValue TODO
	GetSkin() string
}

type wordCell struct {
	word string
	open bool
	skin string
}

func (c *wordCell) GetWord() string {
	return c.word
}

func (c *wordCell) IsOpen() bool {
	return c.open
}

func (c *wordCell) SetOpen(o bool) {
	c.open = o
}

func (c *wordCell) GetSkin() string {
	return c.skin
}

// NewWord TODO
func NewWord(word string, skin string) WordCell {
	return &wordCell{word: word, open: false, skin: skin}
}
